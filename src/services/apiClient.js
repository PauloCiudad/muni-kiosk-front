const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function joinUrl(base, path) {
  if (!base) throw new Error("VITE_API_BASE_URL no está definido (revisa .env)");
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function getToken() {
  return localStorage.getItem("auth_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function setTokens({ token, refreshToken }) {
  if (token) localStorage.setItem("auth_token", token);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
}

function clearAuthStorage() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("persona");
}

/** =========================
 *  Abort de requests
 *  ========================= */
const inflight = new Set();

/** =========================
 *  Cache en memoria
 *  ========================= */
const responseCache = new Map();

// Tiempo de vida del cache (ej: 2 minutos)
const CACHE_TTL = 1000 * 60 * 2;

export function abortAllRequests() {
  for (const ctrl of inflight) ctrl.abort();
  inflight.clear();
}

/** =========================
 *  Refresh (single-flight)
 *  ========================= */
let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthStorage();
    throw new Error("Sesión vencida. No existe refreshToken.");
  }

  refreshPromise = (async () => {
    const url = joinUrl(BASE_URL, "/PagosWebLogin/refresh_token");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      clearAuthStorage();
      const msg = data?.message || data?.mensaje || `Error refresh HTTP ${res.status}`;
      throw new Error(msg);
    }

    const newToken = data?.token;
    const newRefresh = data?.refreshToken;

    if (!newToken) {
      clearAuthStorage();
      throw new Error("Refresh OK pero no llegó token.");
    }

    setTokens({ token: newToken, refreshToken: newRefresh });
    return { token: newToken, refreshToken: newRefresh, raw: data };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/** =========================
 *  Request con retry
 *  ========================= */
async function doFetch(url, { method, headers, body }, controller) {
  const res = await fetch(url, {
    method,
    headers,
    body,
    signal: controller?.signal,
  });

  const data = await res.json().catch(() => null);
  return { res, data };
}

function looksLikeExpiredToken(data) {
  const msg = String(data?.message || data?.mensaje || "").toLowerCase();
  return data?.status === "false" && (msg.includes("token") && (msg.includes("expir") || msg.includes("venc")));
}

export async function apiRequest(
  path,
  { method = "POST", body, auth = true, signal, useCache = false } = {}
) {
  const url = joinUrl(BASE_URL, path);

  const cacheKey = buildCacheKey(path, method, body);

  if (useCache && responseCache.has(cacheKey)) {
    const { data, timestamp } = responseCache.get(cacheKey);

    if (Date.now() - timestamp < CACHE_TTL) {
      return data; // 🔥 devuelve del cache
    } else {
      responseCache.delete(cacheKey); // expiró
    }
  }

  const ctrl = new AbortController();
  inflight.add(ctrl);

  const combinedSignal = signal
    ? anySignal([signal, ctrl.signal])
    : ctrl.signal;

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const requestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: combinedSignal,
  };

  try {
    // 1er intento
    let { res, data } = await doFetch(url, requestInit, null);

    // Manejo HTTP no ok
    if (!res.ok) {
      // si token expiró => intenta refresh y retry 1 vez
      if ((res.status === 401 || res.status === 403) && auth) {
        await refreshAccessToken();

        // reintenta con el token nuevo
        const newHeaders = { ...headers };
        const newToken = getToken();
        if (newToken) newHeaders.Authorization = `Bearer ${newToken}`;

        ({ res, data } = await doFetch(url, { ...requestInit, headers: newHeaders }, null));

        if (!res.ok) {
          const msg2 = data?.message || data?.mensaje || `Error HTTP ${res.status}`;
          const err2 = new Error(msg2);
          err2.status = res.status;
          err2.data = data;
          throw err2;
        }
      } else {
        const msg = data?.message || data?.mensaje || `Error HTTP ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
      }
    }

    // Manejo “API style”
    if (data && data.status === "false") {
      if (auth && looksLikeExpiredToken(data)) {
        await refreshAccessToken();

        const newHeaders = { ...headers };
        const newToken = getToken();
        if (newToken) newHeaders.Authorization = `Bearer ${newToken}`;

        ({ res, data } = await doFetch(url, { ...requestInit, headers: newHeaders }, null));

        if (!res.ok) {
          const msg2 = data?.message || data?.mensaje || `Error HTTP ${res.status}`;
          const err2 = new Error(msg2);
          err2.status = res.status;
          err2.data = data;
          throw err2;
        }
      }

      if (data && data.status === "false") {
        const err = new Error(data?.mensaje || "Operación no válida");
        err.status = 200;
        err.data = data;
        throw err;
      }
    }

    // Guardar en cache si está habilitado
    if (useCache) {
      responseCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  } finally {
    inflight.delete(ctrl);
  }
}

export function clearCache() {
  responseCache.clear();
}

/** Helper: combinar AbortSignals (Chrome moderno). */
function anySignal(signals) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  for (const s of signals) {
    if (!s) continue;
    if (s.aborted) {
      controller.abort();
      break;
    }
    s.addEventListener("abort", onAbort, { once: true });
  }
  return controller.signal;
}

function buildCacheKey(path, method, body) {
  return `${method}:${path}:${body ? JSON.stringify(body) : ""}`;
}

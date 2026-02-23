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
  localStorage.removeItem("auth_exp_at");
}

/** =========================
 *  Abort de requests (para evitar requests colgando)
 *  ========================= */
const inflightControllers = new Set();

// Dedupe (evita requests duplicadas iguales)
const inflightRequests = new Map();

/** =========================
 *  Cache en memoria
 *  ========================= */
const responseCache = new Map();

// Tiempo de vida del cache (ej: 2 minutos)
const CACHE_TTL = 1000 * 60 * 2;

export function abortAllRequests() {
  for (const ctrl of inflightControllers) ctrl.abort();
  inflightControllers.clear();
  inflightRequests.clear();
}

/** =========================
 *  Refresh (single-flight)
 *  ========================= */
let refreshPromise = null;

// Exportado para auto-refresh (timer) desde authService
export async function refreshAccessToken() {
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

    const data = await safeJson(res);

    if (!res.ok) {
      clearAuthStorage();
      const msg = data?.message || data?.mensaje || `Error refresh HTTP ${res.status}`;
      throw new Error(msg);
    }

    // Algunos backends devuelven directamente { token, refreshToken, tiempoExp }
    // Otros devuelven { dato: { token, refreshToken, tiempoExp } }
    const payload = data?.dato ?? data;

    const newToken = payload?.token;
    const newRefresh = payload?.refreshToken;
    const tiempoExp = payload?.tiempoExp ?? payload?.expiresIn ?? payload?.expires_in;

    if (!newToken) {
      clearAuthStorage();
      throw new Error("Refresh OK pero no llegó token.");
    }

    setTokens({ token: newToken, refreshToken: newRefresh });
    if (tiempoExp != null) setAuthExpiry(tiempoExp);

    return { token: newToken, refreshToken: newRefresh, tiempoExp, raw: data };
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
async function doFetch(url, init) {
  const res = await fetch(url, init);
  const data = await safeJson(res);
  return { res, data };
}

function looksLikeExpiredToken(data) {
  const msg = String(data?.message || data?.mensaje || "").toLowerCase();
  return data?.status === "false" && (msg.includes("token") && (msg.includes("expir") || msg.includes("venc")));
}

export async function apiRequest(
  path,
  {
    method = "POST",
    body,
    auth = true,
    signal,
    useCache = false,
    dedupe = true,
  } = {}
) {
  const url = joinUrl(BASE_URL, path);

  const cacheKey = buildCacheKey(path, method, body);

  if (useCache && responseCache.has(cacheKey)) {
    const { data, timestamp } = responseCache.get(cacheKey);

    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    } else {
      responseCache.delete(cacheKey);
    }
  }

  const ctrl = new AbortController();
  inflightControllers.add(ctrl);

  const combinedSignal = signal ? anySignal([signal, ctrl.signal]) : ctrl.signal;

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

  // Dedupe: si la misma request ya está en vuelo, reutilizar promesa.
  const inflightKey = dedupe ? buildCacheKey(url, method, body) : null;
  if (inflightKey && inflightRequests.has(inflightKey)) {
    return inflightRequests.get(inflightKey);
  }

  const run = (async () => {
    // 1er intento
    let { res, data } = await doFetch(url, requestInit);

    if (!res.ok) {
      if ((res.status === 401 || res.status === 403) && auth) {
        await refreshAccessToken();

        const newHeaders = { ...headers };
        const newToken = getToken();
        if (newToken) newHeaders.Authorization = `Bearer ${newToken}`;

        ({ res, data } = await doFetch(url, { ...requestInit, headers: newHeaders }));

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

        ({ res, data } = await doFetch(url, { ...requestInit, headers: newHeaders }));

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

    if (useCache) {
      responseCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  })();

  if (inflightKey) inflightRequests.set(inflightKey, run);

  try {
    return await run;
  } finally {
    inflightControllers.delete(ctrl);
    if (inflightKey) inflightRequests.delete(inflightKey);
  }
}

export function clearCache() {
  responseCache.clear();
}

/** Helper: combinar AbortSignals. */
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

function buildCacheKey(pathOrUrl, method, body) {
  return `${method}:${pathOrUrl}:${body ? JSON.stringify(body) : ""}`;
}

async function safeJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("application/json")) {
    const text = await res.text().catch(() => "");
    return text ? { message: text } : null;
  }
  return res.json().catch(() => null);
}

// =========================
// Expiración (auto-refresh)
// =========================
const AUTH_EXP_AT_KEY = "auth_exp_at";

export function getAuthExpiryEpochMs() {
  const raw = localStorage.getItem(AUTH_EXP_AT_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function setAuthExpiry(tiempoExpValue) {
  const ms = normalizeTiempoExpToMs(tiempoExpValue);
  if (!ms) return;
  const expAt = Date.now() + ms;
  localStorage.setItem(AUTH_EXP_AT_KEY, String(expAt));
}

export function clearAuthExpiry() {
  localStorage.removeItem(AUTH_EXP_AT_KEY);
}

function normalizeTiempoExpToMs(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n * 60 * 1000;
}
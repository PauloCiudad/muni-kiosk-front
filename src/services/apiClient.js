const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Storage Keys
const TOKEN_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

// Ayudas para URL y mensajes de error
function joinUrl(base, path) {
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL no está definido. Revisa tu .env y reinicia el servidor (npm run dev)."
    );
  }
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function cleanMsg(msg) {
  return String(msg || "").replace(/<br\s*\/?>/gi, " ").trim();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("persona");
}

// Core request
export async function apiRequest(
  path,
  { method = "POST", body, auth = true, headers = {} } = {}
) {
  const url = joinUrl(BASE_URL, path);

  const finalHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Intentamos parsear JSON siempre
  const data = await res.json().catch(() => null);

  const apiStatus = data?.status;
  const okApi = apiStatus === undefined || apiStatus === true || apiStatus === "true";

  if (!res.ok || !okApi) {
    const msg =
      cleanMsg(data?.mensaje) ||
      cleanMsg(data?.message) ||
      `Error HTTP ${res.status}`;

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

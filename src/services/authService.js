import {
  apiRequest,
  abortAllRequests,
  clearCache,
  refreshAccessToken,
  setAuthExpiry,
  getAuthExpiryEpochMs,
  clearAuthExpiry,
} from "./apiClient";

import { useCartStore } from "../store/cartStore";

let refreshTimer = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function scheduleRefreshFromExpiry({ skewMs = 30_000 } = {}) {
  clearRefreshTimer();
  const expAt = getAuthExpiryEpochMs();
  if (!expAt) return;

  const ms = Math.max(0, expAt - Date.now() - skewMs);
  refreshTimer = setTimeout(async () => {
    try {
      await refreshAccessToken();
      scheduleRefreshFromExpiry({ skewMs });
    } catch {
      // Si falla, el retry 401/403 se encargará
    }
  }, ms);
}

export async function login(payload) {
  const data = await apiRequest("/PagosWebLogin/login_toten", {
    method: "POST",
    body: payload,
    auth: false,
  });

  const payloadResp = data?.dato ?? data;

  const token = payloadResp?.token;
  const refreshToken = payloadResp?.refreshToken;
  const tiempoExp = payloadResp?.tiempoExp ?? payloadResp?.expiresIn ?? payloadResp?.expires_in;

  if (!token) throw new Error("Login OK pero no llegó token en data.dato.token");

  localStorage.setItem("auth_token", token);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

  if (payloadResp?.persona) localStorage.setItem("persona", JSON.stringify(payloadResp.persona));

  if (tiempoExp != null) {
    setAuthExpiry(tiempoExp);
    scheduleRefreshFromExpiry();
  }

  return { raw: data, token, refreshToken, tiempoExp, persona: payloadResp?.persona ?? null };
}

export function logout() {
  clearRefreshTimer();
  abortAllRequests();
  clearCache();

  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("persona");

  clearAuthExpiry();

  // Limpieza total de carrito (consultas)
  try {
    useCartStore.getState().clear();
  } catch {}
}

/**
 * Llamar 1 vez al iniciar la app para rearmar el auto-refresh si ya hay sesión.
 */
export function initAuthAutoRefresh() {
  scheduleRefreshFromExpiry();
}
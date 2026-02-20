import { apiRequest, abortAllRequests } from "./apiClient";
import { abortAllRequests, clearCache } from "./apiClient";

export async function login(payload) {
  const data = await apiRequest("/PagosWebLogin/login_toten", {
    method: "POST",
    body: payload,
    auth: false,
  });

  const token = data?.dato?.token;
  const refreshToken = data?.dato?.refreshToken;

  if (!token) throw new Error("Login OK pero no llegó token en data.dato.token");

  localStorage.setItem("auth_token", token);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

  if (data?.dato?.persona) localStorage.setItem("persona", JSON.stringify(data.dato.persona));

  return { raw: data, token, refreshToken, persona: data?.dato?.persona ?? null };
}

export function logout() {
  abortAllRequests();
  clearCache();

  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("persona");
}
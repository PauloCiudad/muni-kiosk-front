import { apiRequest, setToken, setRefreshToken } from "./apiClient";

export async function login(payload) {
  const data = await apiRequest("/PagosWebLogin/login_toten", {
    method: "POST",
    body: payload,
    auth: false,
  });

  const token = data?.dato?.token;
  const refreshToken = data?.dato?.refreshToken;

  if (!token) throw new Error("Login OK pero no llegó el token en dato.token.");

  setToken(token);
  if (refreshToken) setRefreshToken(refreshToken);

  return { token, refreshToken, data };
}

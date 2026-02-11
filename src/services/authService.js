import { apiRequest } from "./apiClient";

export async function login(payload) {
  // payload:
  // { correoElectronico, nroCelular, nroDni }
  const data = await apiRequest("/PagosWebLogin/login_toten", {
    method: "POST",
    body: payload,
    auth: false,
  });

  // Estructura real:
  // data.dato.token, data.dato.refreshToken, data.dato.persona
  const token = data?.dato?.token;
  const refreshToken = data?.dato?.refreshToken;

  if (!token) {
    throw new Error("Login OK pero no llegó token en data.dato.token");
  }

  localStorage.setItem("auth_token", token);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

  // opcional: guardar persona
  if (data?.dato?.persona) {
    localStorage.setItem("persona", JSON.stringify(data.dato.persona));
  }

  return {
    raw: data,
    token,
    refreshToken,
    persona: data?.dato?.persona ?? null,
  };
}

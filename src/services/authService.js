const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function joinUrl(base, path) {
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL no está definido. Revisa tu .env y reinicia el dev server (npm run dev)."
    );
  }
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function cleanMsg(msg) {
  return String(msg || "").replace(/<br\s*\/?>/gi, " ").trim();
}

export async function login(payload) {
  const url = joinUrl(BASE_URL, "/PagosWebLogin/login_toten");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!data) {
    // fallback si no vino JSON
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Respuesta inválida (HTTP ${res.status})`);
  }

  const ok = data.status === true || data.status === "true";
  if (!ok) {
    throw new Error(cleanMsg(data.mensaje) || "Credenciales inválidas");
  }

  const token = data?.dato?.token;
  const refreshToken = data?.dato?.refreshToken;

  if (!token) {
    throw new Error("Login OK pero no llegó el token en dato.token.");
  }

  return { token, refreshToken, data };
}

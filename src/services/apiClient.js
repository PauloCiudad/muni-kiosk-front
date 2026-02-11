const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function joinUrl(base, path) {
  if (!base) throw new Error("VITE_API_BASE_URL no está definido (revisa .env)");
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function getToken() {
  return localStorage.getItem("auth_token");
}

export async function apiRequest(path, { method = "POST", body, auth = true } = {}) {
  const url = joinUrl(BASE_URL, path);

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  // Manejo “API style” (status/mensaje/codigo)
  // - si HTTP no ok -> error
  // - si HTTP ok pero status === "false" -> también es error funcional
  if (!res.ok) {
    const msg = data?.message || data?.mensaje || `Error HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  if (data && data.status === "false") {
    const err = new Error(data?.mensaje || "Operación no válida");
    err.status = 200;
    err.data = data;
    throw err;
  }

  return data;
}

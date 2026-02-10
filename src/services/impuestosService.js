import { apiRequest } from "./apiClient";

// 1) Buscar contribuyente por documento
export async function buscarContribuyente({ nroDocumento }) {
  // Ajusta el body exacto que pide tu API
  return apiRequest("/PagosWebImpuestos/buscarContribuyente", {
    method: "POST",
    body: { nroDocumento },
    auth: true,
  });
}

// 2) Buscar deuda (si requiere codigo contribuyente u otro)
export async function buscarDeuda({ codigoContribuyente }) {
  // Ajusta el body exacto que pide tu API
  return apiRequest("/PagosWebImpuestos/buscarDeuda", {
    method: "POST",
    body: { codigoContribuyente },
    auth: true,
  });
}

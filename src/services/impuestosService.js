import { apiRequest } from "./apiClient";

// 1) Contribuyentes por documento
export async function buscarContribuyentes(numeroDocumento) {
  return apiRequest("/PagosWebImpuestos/buscarContribuyenteToten", {
    method: "POST",
    body: { numeroDocumento },
    auth: true,
  });
}

// 2) Predial / Vehicular (conApagId: 1 predial, 2 vehicular)
export async function traerDeudaImpuestos({ conApagId, admCodigo }) {
  return apiRequest("/PagosWebImpuestos/traerDeudaImpuestos", {
    method: "POST",
    body: { conApagId: String(conApagId), admCodigo },
    auth: true,
  });
}

// 3) Predios (para el combo)
export async function traerPredios(admCodigo) {
  return apiRequest("/PagosWebImpuestos/traerPredios", {
    method: "POST",
    body: { admCodigo },
    auth: true,
  });
}

// 4) Arbitrios (trae todo; luego filtras por uso_vcodigo)
export async function traerDeudaArbitrios(admCodigo) {
  return apiRequest("/PagosWebImpuestos/traerDeudaArbitrios", {
    method: "POST",
    body: { admCodigo },
    auth: true,
  });
}

// 5) Infracciones (tipBus siempre 1)
export async function traerDeudaInfracciones({ infractorDni }) {
  return apiRequest("/PagosWebImpuestos/traerDeudaInfracciones", {
    method: "POST",
    body: {
      tipBus: "1",
      nroInfraccion: "",
      placa: "",
      infractorDni,
      carrId: "",
    },
    auth: true,
  });
}

import { apiRequest } from "./apiClient";

// Función de Consulta 11: Busca contribuyentes asociados a un número de documento
// Endpoint: /PagosWebImpuestos/buscarContribuyenteToten
export async function buscarContribuyentes(numeroDocumento) {
  return apiRequest("/PagosWebImpuestos/buscarContribuyenteToten", {
    method: "POST",
    body: { numeroDocumento },
    auth: true,
    useCache: true,
  });
}

// Función de Consulta 12: Obtiene deuda de impuesto predial (conApagId=1) o vehicular (conApagId=2)
// Endpoint: /PagosWebImpuestos/traerDeudaImpuestos
export async function traerDeudaImpuestos({ conApagId, admCodigo }) {
  return apiRequest("/PagosWebImpuestos/traerDeudaImpuestos", {
    method: "POST",
    body: { conApagId: String(conApagId), admCodigo },
    auth: true,
    useCache: true,
  });
}

// Función de Consulta 13: Obtiene lista de predios de un contribuyente (para combo de arbitrios)
// Endpoint: /PagosWebImpuestos/traerPredios
export async function traerPredios(admCodigo) {
  return apiRequest("/PagosWebImpuestos/traerPredios", {
    method: "POST",
    body: { admCodigo },
    auth: true,
    useCache: true,
  });
}

// Función de Consulta 14: Obtiene todas las deudas de arbitrios de un contribuyente
// Endpoint: /PagosWebImpuestos/traerDeudaArbitrios
export async function traerDeudaArbitrios(admCodigo) {
  return apiRequest("/PagosWebImpuestos/traerDeudaArbitrios", {
    method: "POST",
    body: { admCodigo },
    auth: true,
    useCache: true,
  });
}

// Función de Consulta 15: Obtiene deudas de infracciones de tránsito por DNI del infractor
// Endpoint: /PagosWebImpuestos/traerDeudaInfracciones
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
    useCache: true,
  });
}

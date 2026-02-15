// authCleanup.js
import { cleanupAll } from "./apiClient";

export function logoutCleanup() {
  cleanupAll();

  // Limpia lo que tú guardas
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("persona");

  // Si se guarda otros keys (carrito, selections, etc.), lo borramos aquí también:
  // localStorage.removeItem("carrito");
}

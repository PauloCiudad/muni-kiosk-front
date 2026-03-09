import { logout } from "./authService";

// Función de Utilidad 1: Limpieza de autenticación (simplemente llama a logout)
export function logoutCleanup() {
  logout();
}
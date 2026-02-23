import { logout } from "./authService";

export function logoutCleanup() {
  logout();
}
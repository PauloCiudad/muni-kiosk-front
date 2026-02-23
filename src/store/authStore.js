import { create } from "zustand";
import { clearCache, abortAllRequests, clearAuthExpiry } from "../services/apiClient";
import { useCartStore } from "./cartStore";

const STORAGE_KEYS = {
  token: "auth_token",
  refresh: "refresh_token",
  persona: "persona",
};

function readPersona() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.persona);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem(STORAGE_KEYS.token) || "",
  refreshToken: localStorage.getItem(STORAGE_KEYS.refresh) || "",
  persona: readPersona(),

  setSession: ({ token, refreshToken, persona } = {}) => {
    if (token) localStorage.setItem(STORAGE_KEYS.token, token);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
    if (persona) localStorage.setItem(STORAGE_KEYS.persona, JSON.stringify(persona));

    set({
      token: token ?? get().token,
      refreshToken: refreshToken ?? get().refreshToken,
      persona: persona ?? get().persona,
    });
  },

  clearSession: () => {
    abortAllRequests();
    clearCache();
    clearAuthExpiry();

    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.persona);

    try {
      useCartStore.getState().clear();
    } catch {}

    set({ token: "", refreshToken: "", persona: null });
  },
}));
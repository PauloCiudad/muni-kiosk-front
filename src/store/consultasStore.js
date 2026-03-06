import { create } from "zustand";

const LS_EMAIL = "consultas_email";
const LS_META = "consultas_meta";

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useConsultasStore = create((set) => ({
  email: localStorage.getItem(LS_EMAIL) || "",
  meta: readJson(LS_META), // datos de contribuyente para cabecera

  setEmail: (email) => {
    localStorage.setItem(LS_EMAIL, email || "");
    set({ email: email || "" });
  },

  setMeta: (meta) => {
    localStorage.setItem(LS_META, JSON.stringify(meta || null));
    set({ meta: meta || null });
  },

  clearConsultasSession: () => {
    localStorage.removeItem(LS_EMAIL);
    localStorage.removeItem(LS_META);
    set({ email: "", meta: null });
  },
}));
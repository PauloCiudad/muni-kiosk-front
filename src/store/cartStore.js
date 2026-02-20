import { create } from "zustand";

const STORAGE_KEY = "cart_items_v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

/**
 * Estructura de item:
 * {
 *   key: "predial|<id>" (único),
 *   service: "predial" | "vehicular" | "arbitrios" | "transito",
 *   id: "<rowId>",
 *   title: "Impuesto Predial" ...,
 *   meta: { ...campos },
 *   amount: number
 * }
 */
export const useCartStore = create((set, get) => ({
  items: loadInitial(),

  addItem: (item) =>
    set((state) => {
      const exists = state.items.some((x) => x.key === item.key);
      const next = exists ? state.items : [...state.items, item];
      persist(next);
      return { items: next };
    }),

  removeItem: (key) =>
    set((state) => {
      const next = state.items.filter((x) => x.key !== key);
      persist(next);
      return { items: next };
    }),

  clear: () =>
    set(() => {
      persist([]);
      return { items: [] };
    }),

  count: () => get().items.length,
  total: () => get().items.reduce((acc, x) => acc + Number(x.amount || 0), 0),
}));
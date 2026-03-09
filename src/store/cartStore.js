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

// Función de Estado 2: Store global del carrito para consultas
// Persiste los ítems seleccionados en localStorage
// Métodos:
//   setItems(items) - reemplaza todo el carrito
//   addItem(item) - agrega un ítem si no existe (por key)
//   removeItem(key) - elimina un ítem
//   clear() - vacía el carrito
//   count() - número de ítems
//   total() - suma de montos
export const useCartStore = create((set, get) => ({
  items: loadInitial(),

  setItems: (items) =>
    set(() => {
      persist(items);
      return { items };
    }),

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
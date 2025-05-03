import { Product } from "@/@types/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProductsCart = Omit<Product, "category"> & { quantity: number };

interface ProductStore {
  products: ProductsCart[];
  addToCart: (product: Omit<Product, "category">) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

type CartEventType = "ADD_PRODUCT" | "REMOVE_PRODUCT";

let cartListeners: ((type: CartEventType, name: string) => void)[] = [];

export function onCartEvent(callback: (type: CartEventType, name: string) => void) {
  cartListeners.push(callback);
  return () => {
    cartListeners = cartListeners.filter((cb) => cb !== callback);
  };
}

function triggerCartEvent(type: CartEventType, name: string) {
  cartListeners.forEach((cb) => cb(type, name));
}


export const useProductStore = create(
  persist<ProductStore>(
    (set) => ({
      products: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.products.find((p) => p.id === product.id);
          if (existing) {
            return {
              products: state.products.map((p) =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
              ),
            };
          } else {
            // Trigger event saat produk baru ditambahkan
            triggerCartEvent("ADD_PRODUCT", product.name);
            return {
              products: [...state.products, { ...product, quantity: 1 }],
            };
          }
        }),

      increase: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          products: state.products
            .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
            .filter((p) => p.quantity > 0),
        })),

      removeFromCart: (id) =>
        set((state) => {
          const product = state.products.find((p) => p.id === id);
          if (product) {
            triggerCartEvent("REMOVE_PRODUCT", product.name);
          }
          return {
            products: state.products.filter((p) => p.id !== id),
          };
        }),
      clearCart: () => set(() => ({ products: [] })),
    }),
    {
      name: "aqilff-cart-storage",
    }
  )
);

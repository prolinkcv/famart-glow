import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getProduct, type Product } from "@/lib/shop";

export interface CartItem {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  detailed: { product: Product; quantity: number; subtotal: number }[];
  count: number;
  total: number;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "famart-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage after mount so SSR and first render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const clean = parsed
        .filter(
          (i): i is CartItem =>
            !!i && typeof i === "object" && typeof (i as CartItem).slug === "string",
        )
        .map((i) => ({ slug: i.slug, quantity: Math.max(1, Math.min(99, Number(i.quantity) || 1)) }))
        .filter((i) => !!getProduct(i.slug));
      setItems(clean);
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items]);

  const add = useCallback((slug: string, quantity = 1) => {
    const product = getProduct(slug);
    if (!product || !product.inStock) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i,
        );
      }
      return [...prev, { slug, quantity: Math.min(99, Math.max(1, quantity)) }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(99, quantity) } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const detailed = items.flatMap((i) => {
      const product = getProduct(i.slug);
      if (!product) return [];
      return [{ product, quantity: i.quantity, subtotal: product.priceKsh * i.quantity }];
    });
    return {
      items,
      detailed,
      count: detailed.reduce((n, d) => n + d.quantity, 0),
      total: detailed.reduce((n, d) => n + d.subtotal, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

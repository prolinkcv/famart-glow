import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useProducts } from "@/lib/products";
import type { Product } from "@/lib/shop";

interface WishlistContextValue {
  slugs: string[];
  items: Product[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "famart-wishlist-v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useProducts();
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      setSlugs(parsed.filter((s): s is string => typeof s === "string"));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* storage unavailable */
    }
  }, [slugs]);

  const toggle = useCallback(
    (slug: string) => {
      const added = !slugs.includes(slug);
      setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return added;
    },
    [slugs],
  );


  const remove = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<WishlistContextValue>(() => {
    const items = slugs.flatMap((s) => {
      const p = getProduct(s);
      return p ? [p] : [];
    });
    return {
      slugs,
      items,
      count: items.length,
      has: (slug: string) => slugs.includes(slug),
      toggle,
      remove,
      clear,
    };
  }, [slugs, getProduct, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

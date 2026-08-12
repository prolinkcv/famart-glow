import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { applyOverrides, type CustomProduct, type Product, type ProductOverride } from "@/lib/shop";

interface ProductsContextValue {
  products: Product[];
  getProduct: (slug: string) => Product | undefined;
  categories: string[];
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({
  overrides,
  custom = [],
  children,
}: {
  overrides: ProductOverride[];
  custom?: CustomProduct[];
  children: ReactNode;
}) {
  const value = useMemo<ProductsContextValue>(() => {
    const list = applyOverrides(overrides, custom);
    return {
      products: list,
      getProduct: (slug: string) => list.find((p) => p.slug === slug),
      categories: Array.from(new Set(list.map((p) => p.category))),
    };
  }, [overrides, custom]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}

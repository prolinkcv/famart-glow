import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { uniqueCategories, type Product } from "@/lib/shop";

interface ProductsContextValue {
  products: Product[];
  getProduct: (slug: string) => Product | undefined;
  categories: string[];
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const value = useMemo<ProductsContextValue>(() => ({
    products,
    getProduct: (slug: string) => products.find((p) => p.slug === slug),
    categories: uniqueCategories(products),
  }), [products]);

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}

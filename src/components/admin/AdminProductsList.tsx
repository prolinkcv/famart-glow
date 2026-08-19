import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Package, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminDeleteProduct } from "@/lib/shop.functions";
import { formatKsh, type Product } from "@/lib/shop";

export function AdminProductsList({
  products,
  loading,
  onEdit,
  onChanged,
  onAdd,
}: {
  products: Product[];
  loading: boolean;
  onEdit: (slug: string) => void;
  onChanged: () => void;
  onAdd: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [pending, setPending] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  // Debounce search input so filtering stays smooth while typing.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [products, debounced]);

  const confirmDelete = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await adminDeleteProduct({ data: { slug: pending.slug } });
      toast.success("Product deleted", { description: pending.name });
      setPending(null);
      onChanged();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {products.length} products
          </p>
        </div>
        <Button variant="hero" size="sm" onClick={onAdd}>
          <Plus /> Add Product
        </Button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or category…"
          aria-label="Search products"
          className="h-11 pl-9"
        />
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No products found.
        </p>
      ) : (
        <ul className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-soft">
          {filtered.map((p, i) => (
            <li key={p.slug} className={i > 0 ? "border-t" : ""}>
              <div className="flex items-center gap-2 p-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => onEdit(p.slug)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-label={`Edit ${p.name}`}
                >
                  {p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="size-12 shrink-0 rounded-xl bg-surface object-cover"
                    />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface text-muted-foreground">
                      <Package className="size-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {p.category}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">{formatKsh(p.priceKsh)}</span>
                </button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 text-muted-foreground hover:text-red-600"
                  aria-label={`Delete ${p.name}`}
                  onClick={() => setPending(p)}
                >
                  <Trash2 className="size-4" />
                </Button>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes “{pending?.name}” and its uploaded images. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

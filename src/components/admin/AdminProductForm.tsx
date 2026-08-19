import { useRef, useState } from "react";
import { ChevronLeft, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { uploadProductImage } from "@/lib/image-upload";
import { adminDeleteImage, adminDeleteProduct, adminSaveProduct } from "@/lib/shop.functions";
import {
  blankProduct,
  skinTypeOptions,
  slugify,
  type Product,
  type ProductInput,
  type SkinType,
} from "@/lib/shop";
import { services } from "@/lib/site";

const MAX_IMAGES = 3;

function toInput(p: Product): ProductInput {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    short: p.short,
    overview: p.overview,
    uses: p.uses,
    howToUse: p.howToUse,
    ingredients: p.ingredients,
    skinTypes: p.skinTypes,
    precautions: p.precautions,
    concerns: p.concerns,
    priceKsh: p.priceKsh,
    size: p.size ?? null,
    inStock: p.inStock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    featured: p.featured,
    images: p.images,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    relatedService: p.relatedService ?? null,
    hidden: p.hidden ?? false,
  };
}

const lines = (v: string[]) => v.join("\n");
const parseLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export function AdminProductForm({
  slug,
  categories,
  products,
  onSaved,
  onCancel,
}: {
  slug?: string;
  categories: string[];
  products: Product[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const existing = slug ? products.find((p) => p.slug === slug) : undefined;
  const [form, setForm] = useState<ProductInput>(() =>
    existing ? toInput(existing) : blankProduct(categories),
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<number | null>(null);

  const set = (changes: Partial<ProductInput>) => setForm((f) => ({ ...f, ...changes }));
  const computedSlug = form.slug || slugify(form.name);
  const isNew = !existing;

  const pickFiles = (target: number | null) => {
    targetRef.current = target;
    fileRef.current?.click();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      let next = form.images;
      for (const file of Array.from(files)) {
        if (targetRef.current === null && next.length >= MAX_IMAGES) {
          toast.error(`A product can have up to ${MAX_IMAGES} images`);
          break;
        }
        try {
          const url = await uploadProductImage(computedSlug || "product", file);
          if (targetRef.current === null) {
            next = [...next, url];
          } else {
            const replaced = next[targetRef.current];
            next = next.map((u, i) => (i === targetRef.current ? url : u));
            if (replaced) await adminDeleteImage({ data: { url: replaced } }).catch(() => undefined);
          }
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Upload failed");
        }
      }
      setForm((f) => ({ ...f, images: next }));
    } finally {
      setUploading(false);
      targetRef.current = null;
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = async (i: number) => {
    const url = form.images[i];
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
    if (url) await adminDeleteImage({ data: { url } }).catch(() => undefined);
  };

  const makeMain = (i: number) =>
    setForm((f) => {
      const main = f.images[i];
      if (!main) return f;
      return {
        ...f,
        images: [main, ...f.images.filter((_, idx) => idx !== i)],
      };
    });

  const toggleSkinType = (s: SkinType) =>
    setForm((f) => ({
      ...f,
      skinTypes: f.skinTypes.includes(s)
        ? f.skinTypes.filter((x) => x !== s)
        : [...f.skinTypes, s],
    }));

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Please choose a category");
      return;
    }
    setBusy(true);
    try {
      await adminSaveProduct({ data: { ...form, slug: computedSlug } });
      toast.success(isNew ? "Product added" : "Product updated", { description: form.name });
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save product");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await adminDeleteProduct({ data: { slug: form.slug } });
      toast.success("Product deleted", { description: form.name });
      onSaved();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            <ChevronLeft /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isNew ? "Add Product" : "Edit Product"}</h1>
            <p className="text-xs text-muted-foreground">/shop/product/{computedSlug || "…"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 /> Delete
            </Button>
          )}
          <Button type="button" variant="hero" size="sm" disabled={busy} onClick={save}>
            {busy ? "Saving…" : isNew ? "Add product" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Images */}
        <section className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold">Product images</h2>
              <p className="text-xs text-muted-foreground">
                Up to {MAX_IMAGES} images. The first is used on product cards. JPG, PNG, WEBP or
                AVIF — stored directly in Supabase.
              </p>
            </div>
            {form.images.length < MAX_IMAGES && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => pickFiles(null)}
              >
                {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
                Upload
              </Button>
            )}
          </div>

          {form.images.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {form.images.map((src, i) => (
                <li
                  key={`${src}-${i}`}
                  className="group relative overflow-hidden rounded-2xl border bg-surface"
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                      Main
                    </span>
                  )}
                  <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="size-7"
                      title="Replace image"
                      disabled={uploading}
                      onClick={() => pickFiles(i)}
                    >
                      <ImagePlus className="size-3.5" />
                    </Button>
                    {i > 0 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="size-7"
                        title="Make main image"
                        onClick={() => makeMain(i)}
                      >
                        <Star className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="ml-auto size-7"
                      title="Remove image"
                      onClick={() => void removeImage(i)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </section>

        {/* Basics */}
        <section className="rounded-3xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-sm font-semibold">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-name">Product name</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="p-brand">Brand</Label>
              <Input
                id="p-brand"
                value={form.brand}
                onChange={(e) => set({ brand: e.target.value })}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="p-slug">Slug (URL)</Label>
              <Input
                id="p-slug"
                value={computedSlug}
                onChange={(e) => set({ slug: slugify(e.target.value) })}
                className="mt-1.5 h-11 font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="p-category">Category</Label>
              <Input
                id="p-category"
                list="admin-categories"
                value={form.category}
                onChange={(e) => set({ category: e.target.value })}
                className="mt-1.5 h-11"
              />
              <datalist id="admin-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <Label htmlFor="p-price">Price (KSh)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                value={form.priceKsh}
                onChange={(e) => set({ priceKsh: Number(e.target.value) })}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="p-size">Size (optional)</Label>
              <Input
                id="p-size"
                value={form.size ?? ""}
                placeholder="e.g. 200 ml"
                onChange={(e) => set({ size: e.target.value || null })}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="p-rating">Sample rating (0–5)</Label>
              <Input
                id="p-rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating ?? ""}
                onChange={(e) =>
                  set({ rating: e.target.value === "" ? null : Number(e.target.value) })
                }
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label htmlFor="p-reviews">Sample review count</Label>
              <Input
                id="p-reviews"
                type="number"
                min={0}
                value={form.reviewCount}
                onChange={(e) => set({ reviewCount: Number(e.target.value) })}
                className="mt-1.5 h-11"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-short">Short description (product cards)</Label>
              <Input
                id="p-short"
                value={form.short}
                onChange={(e) => set({ short: e.target.value })}
                className="mt-1.5 h-11"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-overview">Full description</Label>
              <Textarea
                id="p-overview"
                rows={3}
                value={form.overview}
                onChange={(e) => set({ overview: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="rounded-3xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-sm font-semibold">Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-uses">Benefits — one per line</Label>
              <Textarea
                id="p-uses"
                rows={3}
                value={lines(form.uses)}
                onChange={(e) => set({ uses: parseLines(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="p-how">How to use — one per line</Label>
              <Textarea
                id="p-how"
                rows={3}
                value={lines(form.howToUse)}
                onChange={(e) => set({ howToUse: parseLines(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="p-ing">Key ingredients — one per line</Label>
              <Textarea
                id="p-ing"
                rows={3}
                value={lines(form.ingredients)}
                onChange={(e) => set({ ingredients: parseLines(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="p-concerns">Search tags — one per line</Label>
              <Textarea
                id="p-concerns"
                rows={3}
                value={lines(form.concerns)}
                onChange={(e) => set({ concerns: parseLines(e.target.value) })}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Suitable skin types</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skinTypeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={form.skinTypes.includes(s)}
                  onClick={() => toggleSkinType(s)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    form.skinTypes.includes(s)
                      ? "border-primary bg-accent text-accent-foreground"
                      : "hover:border-primary/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SEO + visibility */}
        <section className="rounded-3xl border bg-card p-5 shadow-soft">
          <h2 className="font-display text-sm font-semibold">SEO &amp; visibility</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="p-seo-title">SEO title</Label>
              <Input
                id="p-seo-title"
                value={form.seoTitle}
                placeholder={`${form.name || "Product"} in Nairobi | Famart Healthcare`}
                onChange={(e) => set({ seoTitle: e.target.value })}
                className="mt-1.5 h-11"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-seo-desc">SEO description</Label>
              <Textarea
                id="p-seo-desc"
                rows={2}
                value={form.seoDescription}
                onChange={(e) => set({ seoDescription: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Related service</Label>
              <Select
                value={form.relatedService ?? "none"}
                onValueChange={(v) => set({ relatedService: v === "none" ? null : v })}
              >
                <SelectTrigger className="mt-1.5 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={form.inStock}
              onClick={() => set({ inStock: !form.inStock })}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                form.inStock
                  ? "border-primary bg-accent text-accent-foreground"
                  : "hover:border-primary/40"
              }`}
            >
              {form.inStock ? "In stock" : "Out of stock"}
            </button>
            <button
              type="button"
              aria-pressed={form.featured}
              onClick={() => set({ featured: !form.featured })}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                form.featured
                  ? "border-primary bg-accent text-accent-foreground"
                  : "hover:border-primary/40"
              }`}
            >
              {form.featured ? "Featured on homepage" : "Not featured"}
            </button>
            <button
              type="button"
              aria-pressed={!form.hidden}
              onClick={() => set({ hidden: !form.hidden })}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                form.hidden ? "border-red-600 text-red-600" : "hover:border-primary/40"
              }`}
            >
              {form.hidden ? "Hidden from shop" : "Visible in shop"}
            </button>
          </div>
        </section>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes “{form.name}” and its uploaded images. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={() => void remove()}
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

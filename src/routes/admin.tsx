import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, LogOut, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/shop/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CSV_COLUMNS, downloadCsv, parseCsv, toCsv } from "@/lib/csv";
import {
  adminBulkImport,
  adminDeleteCustom,
  adminListCustom,
  adminListOverrides,
  adminLogin,
  adminLogout,
  adminResetOverride,
  adminSaveCustom,
  adminSaveOverride,
  adminStatus,
} from "@/lib/shop.functions";
import {
  emptyCustomProduct,
  emptyOverride,
  formatKsh,
  products,
  shopCategories,
  slugify,
  type CustomProduct,
  type ProductOverride,
} from "@/lib/shop";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Shop Admin | Famart Healthcare" },
      { name: "description", content: "Manage skincare shop products." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Tab = "catalogue" | "products" | "csv";

function AdminPage() {
  const [checked, setChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    adminStatus()
      .then((r) => setSignedIn(r.signedIn))
      .catch(() => setSignedIn(false))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return <div className="mx-auto max-w-md px-5 py-24 text-sm text-muted-foreground">Loading…</div>;
  }

  return signedIn ? (
    <Dashboard onSignOut={() => setSignedIn(false)} />
  ) : (
    <LoginForm onSuccess={() => setSignedIn(true)} />
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await adminLogin({ data: { username, password } });
      if (res.ok) {
        toast.success("Signed in");
        onSuccess();
      } else {
        toast.error("Incorrect username or password");
      }
    } catch {
      toast.error("Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="font-display text-xl font-bold">Shop Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to add products and manage prices, stock, images, SEO fields and sample ratings.
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="admin-user">Username</Label>
            <Input
              id="admin-user"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 h-11"
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-pass">Password</Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11"
              required
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("catalogue");
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [custom, setCustom] = useState<CustomProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rows, items] = await Promise.all([adminListOverrides(), adminListCustom()]);
      setOverrides(Object.fromEntries(rows.map((r) => [r.slug, r])));
      setCustom(items);
    } catch {
      toast.error("Could not load product settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = (slug: string, changes: Partial<ProductOverride>) =>
    setOverrides((prev) => ({
      ...prev,
      [slug]: { ...(prev[slug] ?? emptyOverride(slug)), ...changes },
    }));

  const save = async (slug: string) => {
    const value = overrides[slug] ?? emptyOverride(slug);
    try {
      await adminSaveOverride({ data: value });
      toast.success("Saved", { description: slug });
    } catch {
      toast.error("Could not save changes");
    }
  };

  const reset = async (slug: string) => {
    try {
      await adminResetOverride({ data: { slug } });
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[slug];
        return next;
      });
      toast.success("Reset to catalogue defaults", { description: slug });
    } catch {
      toast.error("Could not reset product");
    }
  };

  const signOut = async () => {
    await adminLogout().catch(() => undefined);
    onSignOut();
  };

  const list = products.filter((p) =>
    query ? `${p.name} ${p.category} ${p.brand}`.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Shop Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add products, upload images, edit prices and SEO, or update everything at once with CSV.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/shop">View shop</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
        {(
          [
            ["catalogue", "Catalogue products"],
            ["products", `My products (${custom.length})`],
            ["csv", "Bulk CSV"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              tab === key
                ? "border-primary bg-accent text-accent-foreground"
                : "hover:border-primary/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading product settings…</p>
      ) : tab === "catalogue" ? (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="mt-6 h-11 max-w-sm"
          />
          <ul className="mt-8 space-y-5">
            {list.map((p) => {
              const o = overrides[p.slug] ?? emptyOverride(p.slug);
              return (
                <li key={p.slug} className="rounded-3xl border bg-card p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={o.imageUrl || p.images[0]}
                        alt=""
                        width={64}
                        height={64}
                        className="size-14 rounded-2xl bg-surface object-cover"
                      />
                      <div>
                        <h2 className="font-display text-sm font-semibold">{p.name}</h2>
                        <p className="text-xs text-muted-foreground">
                          {p.category} · default {formatKsh(p.priceKsh)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="hero" onClick={() => save(p.slug)}>
                        <Save /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => reset(p.slug)}>
                        <RotateCcw /> Reset
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`price-${p.slug}`}>Price (KSh)</Label>
                      <Input
                        id={`price-${p.slug}`}
                        type="number"
                        min={0}
                        value={o.priceKsh ?? ""}
                        placeholder={String(p.priceKsh)}
                        onChange={(e) =>
                          patch(p.slug, {
                            priceKsh: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <ImageUploadField
                      id={`image-${p.slug}`}
                      slug={p.slug}
                      value={o.imageUrl ?? ""}
                      onChange={(url) => patch(p.slug, { imageUrl: url || null })}
                    />
                    <div>
                      <Label htmlFor={`rating-${p.slug}`}>Sample rating (0–5)</Label>
                      <Input
                        id={`rating-${p.slug}`}
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        value={o.rating ?? ""}
                        placeholder={p.rating === null ? "none" : String(p.rating)}
                        onChange={(e) =>
                          patch(p.slug, {
                            rating: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reviews-${p.slug}`}>Sample review count</Label>
                      <Input
                        id={`reviews-${p.slug}`}
                        type="number"
                        min={0}
                        value={o.reviewCount ?? ""}
                        placeholder={String(p.reviewCount)}
                        onChange={(e) =>
                          patch(p.slug, {
                            reviewCount: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor={`seotitle-${p.slug}`}>SEO title</Label>
                      <Input
                        id={`seotitle-${p.slug}`}
                        value={o.seoTitle ?? ""}
                        placeholder={p.seoTitle}
                        onChange={(e) => patch(p.slug, { seoTitle: e.target.value || null })}
                        className="mt-1.5 h-11"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor={`seodesc-${p.slug}`}>SEO description</Label>
                      <Textarea
                        id={`seodesc-${p.slug}`}
                        rows={2}
                        value={o.seoDescription ?? ""}
                        placeholder={p.seoDescription}
                        onChange={(e) => patch(p.slug, { seoDescription: e.target.value || null })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(
                      [
                        { label: "In stock", value: true },
                        { label: "Out of stock", value: false },
                        {
                          label: `Default (${p.inStock ? "in stock" : "out of stock"})`,
                          value: null,
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => patch(p.slug, { inStock: opt.value })}
                        aria-pressed={o.inStock === opt.value}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                          o.inStock === opt.value
                            ? "border-primary bg-accent text-accent-foreground"
                            : "hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => patch(p.slug, { hidden: !o.hidden })}
                      aria-pressed={o.hidden}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                        o.hidden ? "border-brand-red text-brand-red" : "hover:border-primary/40"
                      }`}
                    >
                      {o.hidden ? "Hidden from shop" : "Visible in shop"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : tab === "products" ? (
        <CustomProducts items={custom} onChanged={load} />
      ) : (
        <BulkCsv overrides={overrides} custom={custom} onImported={load} />
      )}
    </div>
  );
}

/* -------------------------- New products tab -------------------------- */

function CustomProducts({ items, onChanged }: { items: CustomProduct[]; onChanged: () => void }) {
  const [draft, setDraft] = useState<CustomProduct | null>(null);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Products you add here appear in the shop, category pages and search straight away.
        </p>
        <Button variant="hero" size="sm" onClick={() => setDraft(emptyCustomProduct())}>
          <Plus /> Add product
        </Button>
      </div>

      {draft ? (
        <ProductEditor
          key={draft.slug || "new"}
          value={draft}
          onCancel={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            onChanged();
          }}
        />
      ) : null}

      {items.length === 0 && !draft ? (
        <p className="mt-8 rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No products added yet. Tap “Add product” to create your first one.
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {items.map((c) => (
            <li key={c.slug}>
              <ProductEditor value={c} existing onSaved={onChanged} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const lines = (v: string[]) => v.join("\n");
const parseLines = (v: string) =>
  v
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

function ProductEditor({
  value,
  existing = false,
  onSaved,
  onCancel,
}: {
  value: CustomProduct;
  existing?: boolean;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<CustomProduct>(value);
  const [busy, setBusy] = useState(false);
  const set = (changes: Partial<CustomProduct>) => setForm((f) => ({ ...f, ...changes }));
  const slug = form.slug || slugify(form.name);

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    setBusy(true);
    try {
      await adminSaveCustom({ data: { ...form, slug } });
      toast.success(existing ? "Product updated" : "Product added", { description: form.name });
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
      await adminDeleteCustom({ data: { slug: form.slug } });
      toast.success("Product deleted", { description: form.name });
      onSaved();
    } catch {
      toast.error("Could not delete product");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6 rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {form.images[0] ? (
            <img
              src={form.images[0]}
              alt=""
              width={64}
              height={64}
              className="size-14 rounded-2xl bg-surface object-cover"
            />
          ) : (
            <div className="size-14 rounded-2xl bg-surface" />
          )}
          <div>
            <h2 className="font-display text-sm font-semibold">
              {form.name || "New product"}
            </h2>
            <p className="text-xs text-muted-foreground">/shop/product/{slug || "…"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="hero" disabled={busy} onClick={save}>
            <Save /> {existing ? "Save" : "Add product"}
          </Button>
          {existing ? (
            <Button size="sm" variant="outline" disabled={busy} onClick={remove}>
              <Trash2 /> Delete
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${slug}`}>Product name</Label>
          <Input
            id={`name-${slug}`}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor={`brand-${slug}`}>Brand</Label>
          <Input
            id={`brand-${slug}`}
            value={form.brand}
            onChange={(e) => set({ brand: e.target.value })}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor={`cat-${slug}`}>Category</Label>
          <Input
            id={`cat-${slug}`}
            list="famart-categories"
            value={form.category}
            onChange={(e) => set({ category: e.target.value })}
            className="mt-1.5 h-11"
          />
          <datalist id="famart-categories">
            {shopCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor={`cprice-${slug}`}>Price (KSh)</Label>
          <Input
            id={`cprice-${slug}`}
            type="number"
            min={0}
            value={form.priceKsh}
            onChange={(e) => set({ priceKsh: Number(e.target.value) })}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor={`size-${slug}`}>Size (optional)</Label>
          <Input
            id={`size-${slug}`}
            value={form.size ?? ""}
            placeholder="e.g. 200 ml"
            onChange={(e) => set({ size: e.target.value || null })}
            className="mt-1.5 h-11"
          />
        </div>
        <ProductImagesField
          slug={slug || "new"}
          images={form.images}
          onChange={(images) => set({ images })}
        />

        <div className="sm:col-span-2">
          <Label htmlFor={`short-${slug}`}>Short description (product cards)</Label>
          <Input
            id={`short-${slug}`}
            value={form.short}
            onChange={(e) => set({ short: e.target.value })}
            className="mt-1.5 h-11"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`overview-${slug}`}>Full description</Label>
          <Textarea
            id={`overview-${slug}`}
            rows={3}
            value={form.overview}
            onChange={(e) => set({ overview: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`uses-${slug}`}>Benefits — one per line</Label>
          <Textarea
            id={`uses-${slug}`}
            rows={3}
            value={lines(form.uses)}
            onChange={(e) => set({ uses: parseLines(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`how-${slug}`}>How to use — one per line</Label>
          <Textarea
            id={`how-${slug}`}
            rows={3}
            value={lines(form.howToUse)}
            onChange={(e) => set({ howToUse: parseLines(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`ing-${slug}`}>Key ingredients — one per line</Label>
          <Textarea
            id={`ing-${slug}`}
            rows={3}
            value={lines(form.ingredients)}
            onChange={(e) => set({ ingredients: parseLines(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`conc-${slug}`}>Search tags — one per line</Label>
          <Textarea
            id={`conc-${slug}`}
            rows={3}
            value={lines(form.concerns)}
            onChange={(e) => set({ concerns: parseLines(e.target.value) })}
            className="mt-1.5"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`cseotitle-${slug}`}>SEO title</Label>
          <Input
            id={`cseotitle-${slug}`}
            value={form.seoTitle}
            placeholder={`${form.name || "Product"} in Nairobi | Famart Healthcare`}
            onChange={(e) => set({ seoTitle: e.target.value })}
            className="mt-1.5 h-11"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`cseodesc-${slug}`}>SEO description</Label>
          <Textarea
            id={`cseodesc-${slug}`}
            rows={2}
            value={form.seoDescription}
            onChange={(e) => set({ seoDescription: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`crating-${slug}`}>Sample rating (0–5)</Label>
          <Input
            id={`crating-${slug}`}
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating ?? ""}
            onChange={(e) => set({ rating: e.target.value === "" ? null : Number(e.target.value) })}
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor={`creviews-${slug}`}>Sample review count</Label>
          <Input
            id={`creviews-${slug}`}
            type="number"
            min={0}
            value={form.reviewCount}
            onChange={(e) => set({ reviewCount: Number(e.target.value) })}
            className="mt-1.5 h-11"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Toggle active={form.inStock} onClick={() => set({ inStock: !form.inStock })}>
          {form.inStock ? "In stock" : "Out of stock"}
        </Toggle>
        <Toggle active={form.featured} onClick={() => set({ featured: !form.featured })}>
          {form.featured ? "Featured on homepage" : "Not featured"}
        </Toggle>
        <Toggle active={!form.hidden} onClick={() => set({ hidden: !form.hidden })}>
          {form.hidden ? "Hidden from shop" : "Visible in shop"}
        </Toggle>
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
        active ? "border-primary bg-accent text-accent-foreground" : "hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------ CSV tab ------------------------------ */

function BulkCsv({
  overrides,
  custom,
  onImported,
}: {
  overrides: Record<string, ProductOverride>;
  custom: CustomProduct[];
  onImported: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const exportCsv = () => {
    const rows: Record<string, string>[] = [
      ...products.map((p) => {
        const o = overrides[p.slug];
        return {
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          category: p.category,
          short: p.short,
          price_ksh: String(o?.priceKsh ?? p.priceKsh),
          in_stock: String(o?.inStock ?? p.inStock),
          image_url: o?.imageUrl ?? "",
          seo_title: o?.seoTitle ?? p.seoTitle,
          seo_description: o?.seoDescription ?? p.seoDescription,
          rating: String(o?.rating ?? p.rating ?? ""),
          review_count: String(o?.reviewCount ?? p.reviewCount),
          hidden: String(o?.hidden ?? false),
          size: p.size ?? "",
        };
      }),
      ...custom.map((c) => ({
        slug: c.slug,
        name: c.name,
        brand: c.brand,
        category: c.category,
        short: c.short,
        price_ksh: String(c.priceKsh),
        in_stock: String(c.inStock),
        image_url: c.images[0] ?? "",
        seo_title: c.seoTitle,
        seo_description: c.seoDescription,
        rating: String(c.rating ?? ""),
        review_count: String(c.reviewCount),
        hidden: String(c.hidden),
        size: c.size ?? "",
      })),
    ];
    downloadCsv(`famart-products-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    toast.success("CSV exported");
  };

  const importCsv = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const rows = parseCsv(await file.text());
      if (rows.length === 0) throw new Error("That file has no rows");
      const res = await adminBulkImport({ data: { rows } });
      toast.success(`Imported: ${res.updated} updated, ${res.created} added`, {
        ...(res.errors.length ? { description: res.errors.slice(0, 3).join("; ") } : {}),
      });
      onImported();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold">Export</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Download every product with its current price, stock, image, SEO fields and rating. Edit
          it in Excel or Google Sheets, then import it back.
        </p>
        <Button className="mt-4" variant="hero" size="sm" onClick={exportCsv}>
          <Download /> Export CSV
        </Button>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold">Import</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Rows matching an existing product update it; new slugs create new products. Only the
          columns you fill in are changed.
        </p>
        <p className="mt-3 rounded-2xl bg-surface p-3 font-mono text-[11px] break-words">
          {CSV_COLUMNS.join(", ")}
        </p>
        <Button
          className="mt-4"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <Upload /> {busy ? "Importing…" : "Import CSV"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => void importCsv(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

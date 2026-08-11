import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminListOverrides,
  adminLogin,
  adminLogout,
  adminResetOverride,
  adminSaveOverride,
  adminStatus,
} from "@/lib/shop.functions";
import { emptyOverride, formatKsh, products, type ProductOverride } from "@/lib/shop";

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
          Sign in to manage product prices, stock, images, SEO fields and sample ratings.
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
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await adminListOverrides();
      setOverrides(Object.fromEntries(rows.map((r) => [r.slug, r])));
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
            Changes go live on the shop immediately. Leave a field blank to keep the default.
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

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="mt-6 h-11 max-w-sm"
      />

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading product settings…</p>
      ) : (
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
                  <div>
                    <Label htmlFor={`image-${p.slug}`}>Main image URL</Label>
                    <Input
                      id={`image-${p.slug}`}
                      value={o.imageUrl ?? ""}
                      placeholder="https://…"
                      onChange={(e) => patch(p.slug, { imageUrl: e.target.value || null })}
                      className="mt-1.5 h-11"
                    />
                  </div>
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
                      { label: `Default (${p.inStock ? "in stock" : "out of stock"})`, value: null },
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
      )}
    </div>
  );
}

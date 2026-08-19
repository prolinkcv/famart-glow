import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Package, Plus, Store } from "lucide-react";
import { toast } from "sonner";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { AdminProductsList } from "@/components/admin/AdminProductsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminListProducts,
  adminLogin,
  adminLogout,
  adminStatus,
} from "@/lib/shop.functions";
import type { Product } from "@/lib/shop";

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

type AdminView =
  | { page: "overview" }
  | { page: "add" }
  | { page: "products" }
  | { page: "edit"; slug: string };

/** Extensible admin navigation — add entries here as the panel grows. */
const NAV = [
  { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { id: "add" as const, label: "Add Product", icon: Plus },
  { id: "products" as const, label: "Manage Products", icon: Package },
];

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
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-sm text-muted-foreground">Loading…</div>
    );
  }

  return signedIn ? (
    <AdminShell onSignOut={() => setSignedIn(false)} />
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

function AdminShell({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<AdminView>({ page: "overview" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setProducts(await adminListProducts());
    } catch {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const signOut = async () => {
    await adminLogout().catch(() => undefined);
    onSignOut();
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const goTo = (id: (typeof NAV)[number]["id"]) => {
    if (id === "overview") setView({ page: "overview" });
    else if (id === "add") setView({ page: "add" });
    else setView({ page: "products" });
  };

  return (
    <div className="min-h-dvh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r bg-card lg:w-60">
        <div className="flex h-16 items-center gap-2 border-b px-3 lg:px-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
            F
          </span>
          <span className="hidden truncate text-sm font-bold lg:block">Famart Shop Admin</span>
        </div>

        <nav className="flex-1 space-y-1 p-2 lg:p-3" aria-label="Admin">
          {NAV.map((item) => {
            const active = view.page === item.id || (item.id === "products" && view.page === "edit");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t p-2 lg:p-3">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/shop">
              <Store className="size-4" />
              <span className="hidden lg:inline">View shop</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={signOut}
          >
            <LogOut className="size-4" />
            <span className="hidden lg:inline">Sign out</span>
          </Button>
        </div>
      </aside>

      <div className="pl-16 lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b bg-background/80 px-4 backdrop-blur sm:px-6">
          <Button asChild variant="outline" size="sm" className="lg:hidden">
            <Link to="/shop">
              <Store /> View shop
            </Link>
          </Button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {view.page === "overview" && <AdminOverview products={products} loading={loading} />}
          {view.page === "add" && (
            <AdminProductForm
              categories={categories}
              products={products}
              onSaved={() => {
                void load();
                setView({ page: "products" });
              }}
              onCancel={() => setView({ page: "products" })}
            />
          )}
          {view.page === "products" && (
            <AdminProductsList
              products={products}
              loading={loading}
              onEdit={(slug) => setView({ page: "edit", slug })}
              onChanged={() => void load()}
              onAdd={() => setView({ page: "add" })}
            />
          )}
          {view.page === "edit" && (
            <AdminProductForm
              slug={view.slug}
              categories={categories}
              products={products}
              onSaved={() => {
                void load();
                setView({ page: "products" });
              }}
              onCancel={() => setView({ page: "products" })}
            />
          )}
        </main>
      </div>
    </div>
  );
}

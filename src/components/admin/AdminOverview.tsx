import { CheckCircle2, Eye, EyeOff, Package, Stethoscope, XCircle } from "lucide-react";
import { services } from "@/lib/site";
import type { Product } from "@/lib/shop";

const card = "rounded-3xl border bg-card p-5 shadow-soft";

export function AdminOverview({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) {
  const total = products.length;
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = total - inStock;
  const hidden = products.filter((p) => p.hidden).length;
  const live = total - hidden;

  const stats = [
    { label: "Total products", value: total, icon: Package, tone: "text-primary" },
    { label: "In stock", value: inStock, icon: CheckCircle2, tone: "text-green-600" },
    { label: "Out of stock", value: outOfStock, icon: XCircle, tone: "text-amber-600" },
    { label: "Hidden", value: hidden, icon: EyeOff, tone: "text-muted-foreground" },
    { label: "Live", value: live, icon: Eye, tone: "text-green-600" },
    { label: "Services", value: services.length, icon: Stethoscope, tone: "text-primary" },
  ];

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A snapshot of your shop catalogue, stock and visibility.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <s.icon className={`size-5 ${s.tone}`} />
            </div>
            <p className="mt-3 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { formatKsh, orderMessage, SHOP_DISCLAIMER } from "@/lib/shop";
import { openWhatsApp } from "@/lib/site";

const TITLE = "Your Cart | Famart Healthcare Skincare Shop";
const DESCRIPTION =
  "Review your skincare order from Famart Healthcare Medical and Skin Clinic in Nairobi and send it to us on WhatsApp for confirmation.";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/cart" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
});

function CartPage() {
  const { detailed, total, count, setQuantity, remove } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfilment, setFulfilment] = useState<"Delivery" | "Pickup From Clinic">(
    "Pickup From Clinic",
  );
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const sendOrder = () => {
    if (detailed.length === 0) return;
    if (fulfilment === "Delivery" && !location.trim()) {
      toast.error("Delivery location needed", {
        description: "Please tell us where the order should be delivered.",
      });
      return;
    }
    const message = orderMessage(
      detailed.map((d) => ({
        name: d.product.name,
        quantity: d.quantity,
        unitPrice: d.product.priceKsh,
      })),
      {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        fulfilment,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      },
    );
    const { prefilled } = openWhatsApp(message);
    if (!prefilled) {
      toast.message("WhatsApp opened without your order details", {
        description: "Please paste or describe your items in the chat and we will confirm.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl">Your Cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Review your items, then send the order to us on WhatsApp for confirmation.
      </p>

      {detailed.length === 0 ? (
        <div className="mt-10 rounded-3xl border bg-card p-10 text-center shadow-soft">
          <ShoppingBag className="mx-auto size-8 text-primary" aria-hidden="true" />
          <h2 className="mt-4 font-display text-lg font-semibold">Your cart is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Browse our skincare range and add the products you would like to order.
          </p>
          <Button asChild className="mt-6" variant="hero" size="lg">
            <Link to="/shop">Shop Skincare Products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <ul className="space-y-4">
            {detailed.map((d) => (
              <li
                key={d.product.slug}
                className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-3xl border bg-card p-4 shadow-soft sm:grid-cols-[6rem_minmax(0,1fr)]"
              >
                <Link to="/shop/product/$slug" params={{ slug: d.product.slug }}>
                  <img
                    src={d.product.images[0]}
                    alt={d.product.name}
                    loading="lazy"
                    width={192}
                    height={192}
                    className="aspect-square w-full rounded-2xl bg-surface object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-sm font-semibold sm:text-base">
                        <Link
                          to="/shop/product/$slug"
                          params={{ slug: d.product.slug }}
                          className="hover:text-primary"
                        >
                          {d.product.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatKsh(d.product.priceKsh)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(d.product.slug)}
                      aria-label={`Remove ${d.product.name} from cart`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors hover:text-brand-red"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${d.product.name}`}
                        onClick={() => setQuantity(d.product.slug, d.quantity - 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:text-primary"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{d.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${d.product.name}`}
                        onClick={() => setQuantity(d.product.slug, d.quantity + 1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:text-primary"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <p className="font-display text-base font-bold text-primary">
                      {formatKsh(d.subtotal)}
                    </p>
                  </div>
                </div>
              </li>
            ))}

            <li>
              <Button asChild variant="outline">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </li>
          </ul>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border bg-card p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="font-medium">{count}</dd>
                </div>
                <div className="flex justify-between border-t pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display font-bold text-primary">{formatKsh(total)}</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="cart-name">Full name (optional)</Label>
                  <Input
                    id="cart-name"
                    value={name}
                    maxLength={80}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 h-11"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="cart-phone">Phone number (optional)</Label>
                  <Input
                    id="cart-phone"
                    type="tel"
                    value={phone}
                    maxLength={20}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 h-11"
                    placeholder="07xx xxx xxx"
                  />
                </div>
                <fieldset>
                  <legend className="text-sm font-medium">Delivery or pickup</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["Delivery", "Pickup From Clinic"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFulfilment(opt)}
                        aria-pressed={fulfilment === opt}
                        className={`rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors ${
                          fulfilment === opt
                            ? "border-primary bg-accent text-accent-foreground"
                            : "hover:border-primary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {fulfilment === "Delivery" && (
                  <div>
                    <Label htmlFor="cart-location">Delivery location</Label>
                    <Input
                      id="cart-location"
                      value={location}
                      maxLength={120}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1.5 h-11"
                      placeholder="Estate, street or landmark"
                    />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Delivery charges are confirmed by the clinic on WhatsApp.
                    </p>
                  </div>
                )}
                <div>
                  <Label htmlFor="cart-notes">Additional notes (optional)</Label>
                  <Textarea
                    id="cart-notes"
                    value={notes}
                    maxLength={400}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5"
                    rows={3}
                    placeholder="Anything we should know about your order"
                  />
                </div>
              </div>

              <Button className="mt-6 w-full" variant="hero" size="lg" onClick={sendOrder}>
                <MessageCircle /> Order via WhatsApp
              </Button>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {SHOP_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StockBadge } from "@/components/shop/StarRating";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatKsh, orderMessage, SHOP_DISCLAIMER } from "@/lib/shop";
import { openWhatsApp } from "@/lib/site";

const TITLE = "Your Wishlist | Famart Healthcare Skincare Shop";
const DESCRIPTION =
  "Saved skincare products from Famart Healthcare Medical and Skin Clinic in Nairobi Pipeline. Come back any time to order them on WhatsApp.";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/wishlist" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
});

function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { add } = useCart();

  const orderAll = () => {
    if (items.length === 0) return;
    const { prefilled } = openWhatsApp(
      orderMessage(
        items.map((p) => ({ name: p.name, quantity: 1, unitPrice: p.priceKsh })),
        { notes: "Sent from my wishlist." },
      ),
    );
    if (!prefilled) {
      toast.message("WhatsApp opened", {
        description: "Please list the saved products in the chat and we will confirm.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:py-16">
      <h1 className="text-2xl font-bold sm:text-3xl">Your Wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Products you have saved for later. Add them to your cart or send the whole list on WhatsApp.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border bg-card p-10 text-center shadow-soft">
          <Heart className="mx-auto size-8 text-brand-red" aria-hidden="true" />
          <h2 className="mt-4 font-display text-lg font-semibold">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Tap the heart on any product to save it here.
          </p>
          <Button asChild className="mt-6" variant="hero" size="lg">
            <Link to="/shop">Browse Skincare Products</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={orderAll}>
              <MessageCircle /> Order all on WhatsApp
            </Button>
            <Button variant="outline" size="lg" onClick={clear}>
              Clear wishlist
            </Button>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((p) => (
              <li
                key={p.slug}
                className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-3xl border bg-card p-4 shadow-soft"
              >
                <Link to="/shop/product/$slug" params={{ slug: p.slug }}>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    width={192}
                    height={192}
                    className="aspect-square w-full rounded-2xl bg-surface object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-sm font-semibold sm:text-base">
                      <Link
                        to="/shop/product/$slug"
                        params={{ slug: p.slug }}
                        className="hover:text-primary"
                      >
                        {p.name}
                      </Link>
                    </h2>
                    <button
                      type="button"
                      onClick={() => remove(p.slug)}
                      aria-label={`Remove ${p.name} from wishlist`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors hover:text-brand-red"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="mt-1.5 font-display text-base font-bold text-primary">
                    {formatKsh(p.priceKsh)}
                  </p>
                  <div className="mt-2">
                    <StockBadge inStock={p.inStock} />
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <Button
                      size="sm"
                      variant="soft"
                      disabled={!p.inStock}
                      onClick={() => {
                        add(p.slug, 1);
                        toast.success("Added to cart", { description: p.name });
                      }}
                    >
                      <ShoppingCart /> Add
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/shop/product/$slug" params={{ slug: p.slug }}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-2xl border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            {SHOP_DISCLAIMER}
          </p>
        </>
      )}
    </div>
  );
}

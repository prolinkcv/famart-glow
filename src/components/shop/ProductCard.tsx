import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { StarRating, StockBadge } from "@/components/shop/StarRating";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatKsh, orderMessage, type Product } from "@/lib/shop";
import { openWhatsApp } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.slug);

  const orderNow = () => {
    const { prefilled } = openWhatsApp(
      orderMessage([{ name: product.name, quantity: 1, unitPrice: product.priceKsh }]),
    );
    if (!prefilled) {
      toast.message("WhatsApp opened", {
        description: `Please mention: ${product.name}.`,
      });
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-soft transition-shadow duration-200 hover:shadow-lift">
      <div className="relative">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        onClick={() => {
          const added = wishlist.toggle(product.slug);
          toast.success(added ? "Saved to wishlist" : "Removed from wishlist", {
            description: product.name,
          });
        }}
        className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background/85 backdrop-blur transition-colors hover:text-brand-red"
      >
        <Heart className={saved ? "size-4 fill-current text-brand-red" : "size-4"} />
      </button>
      <Link
        to="/shop/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-surface"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={`${product.name} by ${product.brand}`}
          loading="lazy"
          width={768}
          height={768}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {product.category}
          </p>
          <StockBadge inStock={product.inStock} />
        </div>

        <h3 className="mt-2 font-display text-sm leading-snug font-semibold sm:text-base">
          <Link to="/shop/product/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {product.short}
        </p>

        <StarRating
          className="mt-3"
          rating={product.rating}
          reviewCount={product.reviewCount}
          demo={product.ratingSource === "demo"}
        />

        <p className="mt-3 font-display text-lg font-bold text-primary">
          {formatKsh(product.priceKsh)}
        </p>

        <div className="mt-4 grid gap-2">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/shop/product/$slug" params={{ slug: product.slug }}>
              View Product
            </Link>
          </Button>
          {product.inStock ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="soft"
                onClick={() => {
                  add(product.slug, 1);
                  toast.success("Added to cart", { description: product.name });
                }}
              >
                <ShoppingCart /> Add
              </Button>
              <Button size="sm" variant="hero" onClick={orderNow}>
                <MessageCircle /> Order
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="secondary" disabled className="w-full">
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

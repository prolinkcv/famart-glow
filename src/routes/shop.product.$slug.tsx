import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, Heart, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { StarRating, StockBadge } from "@/components/shop/StarRating";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { useProducts } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { formatKsh, getProduct, orderMessage, SHOP_DISCLAIMER } from "@/lib/shop";
import { openWhatsApp, services } from "@/lib/site";

export const Route = createFileRoute("/shop/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ params, loaderData }) => {
    const product = loaderData ? getProduct(params.slug) : undefined;
    if (!product) {
      return {
        meta: [{ title: "Product not found | Famart Healthcare" }, { name: "robots", content: "noindex" }],
      };
    }
    const url = `/shop/product/${product.slug}`;
    return {
      meta: [
        { title: product.seoTitle },
        { name: "description", content: product.seoDescription },
        { property: "og:title", content: product.seoTitle },
        { property: "og:description", content: product.seoDescription },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:title", content: product.seoTitle },
        { name: "twitter:description", content: product.seoDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.overview,
            brand: { "@type": "Brand", name: product.brand },
            category: product.category,
            offers: {
              "@type": "Offer",
              price: product.priceKsh,
              priceCurrency: "KES",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url,
              seller: { "@type": "Organization", name: "Famart Healthcare Medical and Skin Clinic" },
            },
            // Aggregate rating is intentionally omitted: current ratings are
            // sample values, not verified customer reviews.
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
              { "@type": "ListItem", position: 3, name: product.name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { products, getProduct: getMerged } = useProducts();
  const product = getMerged(slug) ?? getProduct(slug)!;
  const { add } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.slug);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(products.filter((p) => p.slug !== product.slug && p.category !== product.category))
    .slice(0, 4);

  const service = services.find((s) => s.slug === product.relatedService);

  const orderOnWhatsApp = () => {
    const { prefilled } = openWhatsApp(
      orderMessage([{ name: product.name, quantity: qty, unitPrice: product.priceKsh }]),
    );
    if (!prefilled) {
      toast.message("WhatsApp opened", {
        description: `Please mention: ${product.name} × ${qty}.`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="block w-full overflow-hidden rounded-3xl border bg-surface shadow-soft"
                aria-label={`Expand image of ${product.name}`}
              >
                <img
                  src={product.images[active]}
                  alt={`${product.name} by ${product.brand} — image ${active + 1}`}
                  width={768}
                  height={768}
                  className="aspect-square w-full object-cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-2 sm:p-4">
              <DialogTitle className="sr-only">{product.name}</DialogTitle>
              <img
                src={product.images[active]}
                alt={`${product.name} enlarged view`}
                width={768}
                height={768}
                className="h-auto w-full rounded-2xl object-contain"
              />
            </DialogContent>
          </Dialog>

          <ul className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((img, i) => (
              <li key={img}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${product.name}`}
                  aria-current={active === i}
                  className={`block w-full overflow-hidden rounded-2xl border bg-surface transition-colors ${
                    active === i ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    loading="lazy"
                    width={256}
                    height={256}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {product.category} · {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-balance sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              demo={product.ratingSource === "demo"}
            />
            <StockBadge inStock={product.inStock} />
          </div>

          <p className="mt-5 font-display text-3xl font-bold text-primary">
            {formatKsh(product.priceKsh)}
            {product.size && (
              <span className="ml-2 text-sm font-medium text-muted-foreground">{product.size}</span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.overview}</p>

          {product.inStock ? (
            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="inline-flex items-center rounded-full border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-primary"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:text-primary"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  size="lg"
                  variant="soft"
                  onClick={() => {
                    add(product.slug, qty);
                    toast.success("Added to cart", {
                      description: `${product.name} × ${qty}`,
                    });
                  }}
                >
                  <ShoppingCart /> Add to Cart
                </Button>
                <Button size="lg" variant="hero" onClick={orderOnWhatsApp}>
                  <MessageCircle /> Order via WhatsApp
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  size="lg"
                  aria-pressed={saved}
                  onClick={() => {
                    const added = wishlist.toggle(product.slug);
                    toast.success(added ? "Saved to wishlist" : "Removed from wishlist", {
                      description: product.name,
                    });
                  }}
                >
                  <Heart className={saved ? "fill-current text-brand-red" : ""} />
                  {saved ? "Saved to Wishlist" : "Save to Wishlist"}
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border bg-surface p-5">
              <p className="text-sm font-semibold">Out of Stock</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This product is currently unavailable. Message us on WhatsApp and we will let you
                know when it is back.
              </p>
              <Button className="mt-4" variant="outline" disabled>
                Ordering unavailable
              </Button>
            </div>
          )}

          <div className="mt-8 space-y-6 text-sm">
            <section>
              <h2 className="font-display text-base font-semibold">Uses / Benefits</h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {product.uses.map((u) => (
                  <li key={u} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {u}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-base font-semibold">How to use</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
                {product.howToUse.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </section>

            {product.ingredients.length > 0 && (
              <section>
                <h2 className="font-display text-base font-semibold">Key ingredients</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {product.ingredients.map((i) => (
                    <li key={i} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {i}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-base font-semibold">Suitable for</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.skinTypes.map((s) => (
                  <li key={s} className="rounded-full border px-3 py-1 text-xs font-medium">
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-base font-semibold">Important precautions</h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {product.precautions.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </section>

            <p className="rounded-2xl border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
              {SHOP_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-14 rounded-[2rem] border bg-card p-8 text-center shadow-soft sm:p-10">
        <h2 className="text-xl font-bold sm:text-2xl">Need professional skin advice?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Our clinicians in Nairobi Pipeline can review your skin and recommend a suitable routine before
          you buy.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/book">Book a Consultation</Link>
          </Button>
          {service && (
            <Button asChild variant="outline" size="lg">
              <Link to="/services/$slug" params={{ slug: service.slug }}>
                {service.name}
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="lg">
            <Link to="/about">About the Clinic</Link>
          </Button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">You may also like</h2>
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <ChevronLeft className="size-4" /> Continue shopping
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.slug} className="h-full">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

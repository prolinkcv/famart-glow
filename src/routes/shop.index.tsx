import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  products,
  shopCategories,
  skinTypeOptions,
  SHOP_DISCLAIMER,
  type Product,
} from "@/lib/shop";
import { SITE, waLink } from "@/lib/site";

const TITLE = "Shop Premium Skincare Products | Famart Healthcare";
const DESCRIPTION =
  "Shop skincare products from Famart Healthcare Medical and Skin Clinic in Nairobi. Browse cleansers, moisturisers, sunscreens, acne care and serums, and order conveniently through WhatsApp.";

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/shop" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Skincare products at Famart Healthcare",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: `/shop/product/${p.slug}`,
          })),
        }),
      },
    ],
  }),
});

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
] as const;

const priceRanges = [
  { value: "all", label: "Any price", min: 0, max: Infinity },
  { value: "under-2000", label: "Under KSh 2,000", min: 0, max: 1999 },
  { value: "2000-3000", label: "KSh 2,000 – 3,000", min: 2000, max: 3000 },
  { value: "over-3000", label: "Over KSh 3,000", min: 3001, max: Infinity },
] as const;

const trust = [
  "Healthcare-focused business",
  "Convenient WhatsApp ordering",
  "Professional skincare guidance",
  "Convenient Nairobi location",
  "Delivery / pickup options",
  "Customer support",
];

function matchesQuery(p: Product, q: string) {
  const haystack = [p.name, p.brand, p.category, p.short, ...p.concerns, ...p.skinTypes]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

function ShopPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [skinType, setSkinType] = useState("all");
  const [price, setPrice] = useState<string>("all");
  const [availability, setAvailability] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sort, setSort] = useState<string>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const range = priceRanges.find((r) => r.value === price) ?? priceRanges[0];
    const list = products.filter((p) => {
      if (query && !matchesQuery(p, query)) return false;
      if (category !== "all" && p.category !== category) return false;
      if (skinType !== "all" && !p.skinTypes.includes(skinType as Product["skinTypes"][number]))
        return false;
      if (p.priceKsh < range.min || p.priceKsh > range.max) return false;
      if (availability === "in" && !p.inStock) return false;
      if (availability === "out" && p.inStock) return false;
      if (minRating !== "all" && (p.rating ?? 0) < Number(minRating)) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.priceKsh - b.priceKsh);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceKsh - a.priceKsh);
    else if (sort === "rating") sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sort === "newest") sorted.sort((a, b) => b.addedOrder - a.addedOrder);
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.addedOrder - a.addedOrder);
    return sorted;
  }, [query, category, skinType, price, availability, minRating, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSkinType("all");
    setPrice("all");
    setAvailability("all");
    setMinRating("all");
    setSort("featured");
  };

  const filtersActive =
    !!query ||
    category !== "all" ||
    skinType !== "all" ||
    price !== "all" ||
    availability !== "all" ||
    minRating !== "all";

  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <Reveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
              Skincare Shop · Nairobi CBD
            </span>
            <h1 className="mt-6 text-3xl leading-tight font-bold text-balance sm:text-4xl lg:text-5xl">
              Professional Skincare Products,{" "}
              <span className="text-gradient-brand">Available Online</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Explore our carefully selected skincare products and order conveniently through
              WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a href="#products">Shop Now</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={waLink(
                    "Hello Famart Healthcare, I have a question about your skincare products.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Chat With Us on WhatsApp
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <h2 className="text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Shop by category
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shopCategories.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={
                      category === c
                        ? "rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground"
                        : "rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                    }
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 lg:py-20">
        <div className="rounded-3xl border bg-card p-4 shadow-soft sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands or concerns e.g. acne"
                aria-label="Search skincare products"
                className="h-12 pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-12 min-w-[10rem]" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                className="h-12 lg:hidden"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal /> Filters
              </Button>
            </div>
          </div>

          <div className={`${filtersOpen ? "grid" : "hidden"} mt-4 gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {shopCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Skin type</Label>
              <Select value={skinType} onValueChange={setSkinType}>
                <SelectTrigger className="mt-1.5 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any skin type</SelectItem>
                  {skinTypeOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Price range</Label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="mt-1.5 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Availability</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="mt-1.5 h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="in">In stock</SelectItem>
                    <SelectItem value="out">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Rating</Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger className="mt-1.5 h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="4">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{results.length}</span> of{" "}
              {products.length} products
            </p>
            {filtersActive && (
              <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
                <X /> Clear filters
              </Button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <li key={p.slug} className="h-full">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl border bg-card p-10 text-center shadow-soft">
            <h2 className="font-display text-lg font-semibold">No products match your search</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a different keyword, or clear the filters to see the full range.
            </p>
            <Button className="mt-6" variant="soft" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        <p className="mt-8 rounded-2xl border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          {SHOP_DISCLAIMER}
        </p>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="Trust & Safety"
            title="Why shop with Famart Healthcare?"
            subtitle={`Ordering skincare from a working dermatology clinic at ${SITE.address}.`}
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
            {trust.map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-2xl border bg-card px-5 py-4 text-sm font-medium shadow-soft"
              >
                <span className="text-primary">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
        <div className="rounded-[2rem] border bg-card p-8 text-center shadow-soft sm:p-12">
          <h2 className="text-2xl font-bold text-balance sm:text-3xl">
            Need professional skin advice?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Our clinicians can recommend the right routine for your skin before you buy. Book a
            consultation at our Nairobi CBD clinic.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/book">Book a Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">Dermatology Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact the Clinic</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

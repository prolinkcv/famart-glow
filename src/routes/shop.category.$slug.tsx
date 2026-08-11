import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/products";
import {
  categoryCopy,
  categoryFromSlug,
  categorySlug,
  products as catalogue,
  shopCategories,
  SHOP_DISCLAIMER,
} from "@/lib/shop";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/shop/category/$slug")({
  loader: ({ params }) => {
    const category = categoryFromSlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ params, loaderData }) => {
    const copy = loaderData ? categoryCopy[params.slug] : undefined;
    if (!copy) {
      return {
        meta: [
          { title: "Category not found | Famart Healthcare" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `/shop/category/${params.slug}`;
    return {
      meta: [
        { title: copy.title },
        { name: "description", content: copy.description },
        { property: "og:title", content: copy.title },
        { property: "og:description", content: copy.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:title", content: copy.title },
        { name: "twitter:description", content: copy.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "/shop" },
              { "@type": "ListItem", position: 3, name: loaderData?.category, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${loaderData?.category} at Famart Healthcare`,
            itemListElement: catalogue
              .filter((p) => p.category === loaderData?.category)
              .map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.name,
                url: `/shop/product/${p.slug}`,
              })),
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const { products } = useProducts();
  const copy = categoryCopy[categorySlug(category)]!;
  const list = products.filter((p) => p.category === category);

  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:py-16">
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
              <li className="font-medium text-foreground">{category}</li>
            </ol>
          </nav>

          <Reveal className="mt-6 max-w-3xl">
            <h1 className="text-3xl leading-tight font-bold text-balance sm:text-4xl">
              {category} <span className="text-gradient-brand">in Nairobi</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{copy.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a
                  href={waLink(
                    `Hello Famart Healthcare, I would like to order ${category.toLowerCase()}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> Order on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop">All Products</Link>
              </Button>
            </div>
          </Reveal>

          <ul className="mt-8 flex flex-wrap gap-2">
            {shopCategories.map((c) => (
              <li key={c}>
                <Link
                  to="/shop/category/$slug"
                  params={{ slug: categorySlug(c) }}
                  className={
                    c === category
                      ? "gradient-brand rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground"
                      : "rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  }
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:py-16">
        {list.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <li key={p.slug} className="h-full">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border bg-card p-10 text-center shadow-soft">
            <h2 className="font-display text-lg font-semibold">
              No {category.toLowerCase()} available right now
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Message us on WhatsApp and we will let you know when stock arrives.
            </p>
          </div>
        )}

        <p className="mt-8 rounded-2xl border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          {SHOP_DISCLAIMER}
        </p>
      </section>
    </>
  );
}

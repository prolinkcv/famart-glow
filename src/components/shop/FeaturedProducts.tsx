import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/products";

export function FeaturedProducts() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <SectionHeading
        eyebrow="Skincare Shop"
        title="Featured skincare products"
        subtitle="A selected range of cleansers, moisturisers, sunscreens and serums — order conveniently on WhatsApp."
      />
      <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {featured.map((p) => (
          <li key={p.slug} className="h-full">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      <Reveal className="mt-10 text-center">
        <Button asChild variant="hero" size="lg">
          <Link to="/shop">View All Products</Link>
        </Button>
      </Reveal>
    </>
  );
}

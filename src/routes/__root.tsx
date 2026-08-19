import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { SITE, services } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import { ProductsProvider } from "@/lib/products";
import { WishlistProvider } from "@/lib/wishlist";
import { getProducts } from "@/lib/shop.functions";


function NotFoundComponent() {
  const topServices = services.slice(0, 6);

  useEffect(() => {
    document.title = `Page Not Found (404) | ${SITE.shortName}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-5 py-24 text-center">
      <p className="font-display text-6xl font-bold text-primary sm:text-7xl">404</p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        The page may have moved or no longer exists. Here are the fastest ways to get what you need
        at {SITE.shortName}.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/book"
          className="inline-flex items-center justify-center rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lift"
        >
          Book an Appointment
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          All Services
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          Contact Us
        </Link>
      </div>

      <section className="mt-14 text-left">
        <h2 className="text-center font-display text-lg font-semibold">Popular treatments</h2>
        <ul className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
          {topServices.map((s) => (
            <li key={s.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="block rounded-2xl border bg-card p-4 text-sm font-medium shadow-soft transition-colors hover:border-primary hover:text-primary"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Or go back to the <Link to="/" className="text-primary underline-offset-4 hover:underline">home page</Link>.
        </p>
      </section>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Famart Healthcare Medical & Skin Clinic | Dermatology Clinic in Nairobi" },
      {
        name: "description",
        content:
          "Famart Healthcare Medical and Skin Clinic offers expert dermatology consultation, acne treatment, eczema care and professional skin care in Nairobi Pipeline.",
      },
      {
        name: "keywords",
        content:
          "Dermatologist Nairobi, Skin Clinic Nairobi, Acne Treatment Nairobi, Eczema Treatment Nairobi, Psoriasis Clinic Nairobi, Skin Doctor Nairobi, Medical Skin Clinic Kenya, Dermatology Clinic Kenya, Skin Specialist Nairobi, Healthcare Clinic Nairobi",
      },
      { name: "author", content: SITE.name },
      { name: "theme-color", content: "#1a63d6" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_KE" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["MedicalClinic", "LocalBusiness"],
          name: SITE.name,
          description:
            "Dermatology and skin care clinic in Nairobi Pipeline offering acne, eczema, psoriasis, allergy and general dermatology treatment.",
          medicalSpecialty: "Dermatology",
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address,
            addressLocality: "Nairobi",
            addressRegion: "Nairobi",
            addressCountry: "KE",
          },
          areaServed: "Nairobi, Kenya",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "17:00",
            },
          ],
          priceRange: "$$",
        }),
      },
    ],
  }),
  loader: async () => {
    const products = await getProducts();
    return { products };
  },

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const data = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsProvider products={data?.products ?? []}>
      <CartProvider>
      <WishlistProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <Toaster />
      </WishlistProvider>
      </CartProvider>
      </ProductsProvider>
    </QueryClientProvider>
  );
}

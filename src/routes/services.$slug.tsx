import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MessageCircle, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections";
import { SITE, serviceDetails, services, telLink, waLink } from "@/lib/site";

const findService = (slug: string) => services.find((s) => s.slug === slug);

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = findService(params.slug);
    const detail = serviceDetails[params.slug];
    if (!service || !detail) throw notFound();
    return { service, detail };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found | Famart Healthcare" }, { name: "robots", content: "noindex" }] };
    }
    const { service, detail } = loaderData;
    const title = `${service.name} in Nairobi | Famart Healthcare Skin Clinic`;
    const description = `${detail.intro.slice(0, 150)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/services/${params.slug}` },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: service.name,
            description: service.desc,
            provider: {
              "@type": "MedicalClinic",
              name: SITE.name,
              telephone: SITE.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address,
                addressLocality: SITE.city,
                addressCountry: "KE",
              },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: detail.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "/services" },
              { "@type": "ListItem", position: 3, name: service.name, item: `/services/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: ServiceDetailPage,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Service not found</h1>
      <p className="mt-4 text-muted-foreground">
        That service page doesn&apos;t exist. Browse all our dermatology services instead.
      </p>
      <Button asChild variant="hero" size="lg" className="mt-8">
        <Link to="/services">View all services</Link>
      </Button>
    </section>
  );
}

function ServiceDetailPage() {
  const { service, detail } = Route.useLoaderData() as {
    service: (typeof services)[number];
    detail: ServiceDetail;
  };
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <Reveal className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/services" className="hover:text-primary">
                Services
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{service.name}</span>
            </nav>
            <span className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-primary-foreground">
              <Icon name={service.icon} className="size-5" />
            </span>
            <h1 className="mt-5 text-4xl font-bold text-balance sm:text-5xl">{detail.headline}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{detail.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/book" search={{ service: service.name }}>
                  Book {service.name}
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={waLink(
                    `Hello Famart Healthcare, I would like to book an appointment for ${service.name}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> WhatsApp Us
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">What this service includes</h2>
          <ul className="mt-6 space-y-4">
            {detail.benefits.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <aside className="rounded-3xl border bg-surface p-7 shadow-soft">
            <h2 className="font-display text-lg font-semibold">Ready to book?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE.address}. Open {SITE.hours}.
            </p>
            <div className="mt-6 grid gap-3">
              <Button asChild variant="hero">
                <Link to="/book" search={{ service: service.name }}>
                  Book Appointment
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={telLink}>
                  <Phone /> {SITE.phoneDisplay}
                </a>
              </Button>
            </div>
          </aside>
        </Reveal>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="FAQ"
            title={`${service.name} questions`}
            subtitle="Common questions patients ask before starting this treatment."
          />
          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {detail.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="cursor-pointer text-left font-display text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading eyebrow="Related" title="Other services you may need" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 90}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex h-full flex-col rounded-3xl border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lift"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}

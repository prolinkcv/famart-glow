import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, Faqs, SectionHeading, ServicesGrid } from "@/components/sections";
import { Reveal } from "@/components/Reveal";
import { services, SITE } from "@/lib/site";

export const Route = createFileRoute("/services/")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Dermatology Services in Nairobi | Acne, Eczema & Skin Care | Famart" },
      {
        name: "description",
        content:
          "Explore Famart Healthcare's dermatology services in Nairobi Pipeline: acne treatment, eczema management, psoriasis care, skin allergies, fungal infections, pigmentation, mole assessment and more.",
      },
      { property: "og:title", content: "Dermatology Services in Nairobi | Famart Healthcare" },
      {
        property: "og:description",
        content:
          "Acne, eczema, psoriasis, allergies, pigmentation, hair and scalp care and general dermatology in Nairobi Pipeline.",
      },
      { property: "og:url", content: "/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Dermatology Services in Nairobi | Famart Healthcare" },
      {
        name: "twitter:description",
        content: "15 dermatology and skin care services offered in Nairobi Pipeline.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Dermatology services at Famart Healthcare Medical and Skin Clinic",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "MedicalProcedure",
              name: s.name,
              description: s.desc,
              provider: { "@type": "MedicalClinic", name: SITE.name },
            },
          })),
        }),
      },
    ],
  }),
});

function Services() {
  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-24">
          <Reveal className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">
              Our Services
            </span>
            <h1 className="mt-5 text-4xl font-bold text-balance sm:text-5xl">
              Dermatology and skin care services in Nairobi
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Fifteen focused services covering medical dermatology, cosmetic skin care and ongoing
              follow-up — all delivered from our Nairobi Pipeline clinic.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
        <ServicesGrid />
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions about treatment"
            subtitle="A few things patients often ask before booking a service."
          />
          <div className="mt-12">
            <Faqs />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <CtaBand />
      </section>
    </>
  );
}

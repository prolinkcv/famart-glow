import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, Phone, Sparkles, Wallet } from "lucide-react";
import heroImg from "@/assets/hero-derm.jpg";
import clinicImg from "@/assets/clinic-interior.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { FeaturedProducts } from "@/components/shop/FeaturedProducts";
import {
  CtaBand,
  Faqs,
  SectionHeading,
  ServicesGrid,
  StatsBand,
  Testimonials,
  WhyChooseUs,
} from "@/components/sections";
import { faqs, SITE, telLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Famart Healthcare Medical & Skin Clinic | Dermatology Clinic in Nairobi" },
      {
        name: "description",
        content:
          "Famart Healthcare Medical and Skin Clinic offers expert dermatology consultation, acne treatment, eczema care, psoriasis management, skin allergy treatment and professional skin care services in Nairobi Pipeline.",
      },
      {
        property: "og:title",
        content: "Famart Healthcare Medical & Skin Clinic | Dermatology Clinic in Nairobi",
      },
      {
        property: "og:description",
        content:
          "Expert dermatology consultation, acne, eczema, psoriasis and skin allergy treatment in Nairobi Pipeline.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      {
        name: "twitter:title",
        content: "Famart Healthcare Medical & Skin Clinic | Dermatology Clinic in Nairobi",
      },
      {
        name: "twitter:description",
        content:
          "Expert dermatology consultation, acne, eczema, psoriasis and skin allergy treatment in Nairobi Pipeline.",
      },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroImg },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

const badges = [
  { icon: BadgeCheck, label: "Professional Care" },
  { icon: Wallet, label: "Affordable Treatment" },
  { icon: Sparkles, label: "Modern Medical Practice" },
  { icon: HeartHandshake, label: "Patient-Centered Care" },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden gradient-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal className="reveal-in">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
              Dermatology & Skin Care · Nairobi Pipeline
            </span>
            <h1 className="mt-6 text-4xl leading-[1.08] font-bold text-balance sm:text-5xl lg:text-6xl">
              Healthy Skin Starts With <span className="text-gradient-brand">Expert Care</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Professional Dermatology, Skin Care and Medical Consultation in Nairobi Pipeline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/book">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href={telLink}>
                  <Phone /> Call Now
                </a>
              </Button>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {badges.map((b) => (
                <li
                  key={b.label}
                  className="flex items-center gap-3 rounded-2xl border bg-background/70 px-4 py-3 text-sm font-medium shadow-soft"
                >
                  <b.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {b.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border shadow-lift">
              <img
                src={heroImg}
                alt="Dermatologist examining a patient's healthy skin during a consultation"
                width={1600}
                height={1104}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass-panel absolute -bottom-6 left-4 hidden rounded-2xl px-5 py-4 shadow-soft sm:block">
              <p className="font-display text-2xl font-bold text-primary">98%</p>
              <p className="text-xs text-muted-foreground">Patient satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border shadow-soft">
              <img
                src={clinicImg}
                alt="Bright modern consultation room at Famart Healthcare Medical and Skin Clinic"
                loading="lazy"
                width={1200}
                height={912}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              center={false}
              eyebrow="About Us"
              title="Compassionate, evidence-based skin care"
              subtitle={`${SITE.name} is a dedicated medical and dermatology practice in the heart of Nairobi. We combine clinical expertise with genuine compassion to diagnose, treat and manage skin conditions of every kind.`}
            />
            <Reveal delay={120} className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Every treatment plan is personalised. We take time to understand your history,
                lifestyle and goals before recommending a course of care — and we explain each step
                in plain language so you always know what to expect.
              </p>
              <p>
                Our practice is grounded in evidence-based medicine and modern clinical standards,
                delivered in a calm, spotless environment designed to put patients at ease.
              </p>
              <div className="pt-2">
                <Button asChild variant="soft">
                  <Link to="/about">More about the clinic</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="Our Services"
            title="Complete dermatology and skin care"
            subtitle="From acne and eczema to pigmentation and mole assessment — comprehensive skin health under one roof."
          />
          <div className="mt-14">
            <ServicesGrid limit={6} />
          </div>
          <Reveal className="mt-12 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/services">View All 15 Services</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
        <FeaturedProducts />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Healthcare you can trust"
          subtitle="A patient-first clinic built around expertise, accessibility and consistent quality."
        />
        <div className="mt-14">
          <WhyChooseUs />
        </div>
        <div className="mt-16">
          <StatsBand />
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="Testimonials"
            title="What our patients say"
            subtitle="Real experiences from people we have cared for at our Nairobi Pipeline clinic."
          />
          <div className="mt-14">
            <Testimonials />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-28">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know before your first visit."
        />
        <div className="mt-12">
          <Faqs />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <CtaBand />
      </section>
    </>
  );
}

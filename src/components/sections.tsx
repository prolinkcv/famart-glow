import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, services, testimonials, whyChooseUs } from "@/lib/site";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold text-balance sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
    </Reveal>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s, i) => (
        <Reveal as="li" key={s.slug} delay={(i % 3) * 90}>
          <article
            id={s.slug}
            className="group flex h-full scroll-mt-28 flex-col rounded-3xl border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lift"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
              <Icon name={s.icon} className="size-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            <Link
              to="/book"
              search={{ service: s.name }}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5"
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

export function WhyChooseUs() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {whyChooseUs.map((w, i) => (
        <Reveal as="li" key={w.title} delay={(i % 4) * 80}>
          <div className="h-full rounded-3xl border bg-card p-6 text-center shadow-soft transition-transform duration-300 hover:-translate-y-1.5">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-primary-foreground">
              <Icon name={w.icon} className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">{w.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

export function StatsBand() {
  const stats = [
    { to: 5000, suffix: "+", label: "Patients Treated" },
    { to: 15, suffix: "", label: "Skin Services" },
    { to: 10, suffix: "+", label: "Years Experience" },
    { to: 98, suffix: "%", label: "Patient Satisfaction" },
  ];
  return (
    <div className="rounded-[2rem] gradient-brand px-6 py-12 text-primary-foreground shadow-lift">
      <dl className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block font-display text-4xl font-bold">
                <Counter to={s.to} suffix={s.suffix} />
              </span>
              <span className="mt-1 block text-sm opacity-85">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Testimonials() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal as="li" key={t.name} delay={(i % 3) * 90}>
          <figure className="flex h-full flex-col rounded-3xl border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1.5">
            <div className="flex gap-0.5 text-brand-red" aria-label="Rated 5 out of 5">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              “{t.text}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                {t.name.charAt(0)}
              </span>
              <span className="text-sm font-semibold">{t.name}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

export function Faqs() {
  return (
    <Reveal className="mx-auto max-w-3xl">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`} className="border-b last:border-b-0">
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
  );
}

export function CtaBand() {
  return (
    <Reveal className="overflow-hidden rounded-[2rem] border bg-surface p-10 text-center shadow-soft sm:p-14">
      <h2 className="text-3xl font-bold text-balance sm:text-4xl">
        Ready to take care of your skin?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Book a consultation with our dermatology team in Nairobi CBD. Same-week appointments are
        usually available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="hero" size="lg">
          <Link to="/book">Book Appointment</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/contact">Visit the Clinic</Link>
        </Button>
      </div>
    </Reveal>
  );
}

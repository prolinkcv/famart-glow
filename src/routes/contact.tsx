import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/sections";
import { SITE, mapsLink, telLink, waLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Famart Healthcare | Pipeline opposite Honeysuckle gardens estate, Nairobi" },
      {
        name: "description",
        content:
          "Visit Famart Healthcare Medical and Skin Clinic at Pipeline opposite Honeysuckle gardens estate, Nairobi. Call +254708 931 682/ +254747 077 433. Open Monday to Friday, 9:00 AM to 5:00 PM.",
      },
      { property: "og:title", content: "Contact Famart Healthcare Medical and Skin Clinic" },
      {
        property: "og:description",
        content:
          "Pipeline opposite Honeysuckle gardens estate, Nairobi. Call or WhatsApp +254708 931 682/ +254747 077 433.",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Contact Famart Healthcare Medical and Skin Clinic" },
      {
        name: "twitter:description",
        content: "Nairobi Pipeline skin clinic — call or WhatsApp +254708 931 682/ +254747 077 433.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <Reveal className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">
              Contact
            </span>
            <h1 className="mt-5 text-4xl font-bold text-balance sm:text-5xl">Visit our clinic</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We are easy to find in the heart of Nairobi — and always happy to answer questions
              before you come in.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-[2rem] border bg-card p-8 shadow-soft">
            <h2 className="font-display text-xl font-semibold">{SITE.name}</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">Location</span>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {SITE.address}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-whatsapp">
                  <MessageCircle className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">Phone & WhatsApp</span>
                  <a href={telLink} className="block text-muted-foreground hover:text-primary">
                    {SITE.phoneDisplay}
                  </a>
                  <a href={telLinkAlt} className="block text-muted-foreground hover:text-primary">
                    {SITE.phoneAltDisplay}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">Email</span>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {SITE.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Clock className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">Working Hours</span>
                  <span className="text-muted-foreground">
                    Monday – Friday
                    <br />
                    9:00 AM – 5:00 PM
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a href={telLink}>
                  <Phone /> Call Now
                </a>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a href={waLink()} target="_blank" rel="noreferrer">
                  <MessageCircle /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="h-full overflow-hidden rounded-[2rem] border shadow-soft">
            <iframe
              title={`Google Maps location of ${SITE.name}`}
              src={`https://www.google.com/maps?q=${SITE.mapsQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[420px] w-full border-0"
            />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <CtaBand />
      </section>
    </>
  );
}

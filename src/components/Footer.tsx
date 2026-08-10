import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/famart-logo-new.png.asset.json";
import { SITE, mapsLink, services, telLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src={logo.url}
            alt={`${SITE.name} logo`}
            loading="lazy"
            width={112}
            height={112}
            className="h-20 w-20 object-contain"
          />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Expert dermatology, skin care and medical consultation in the heart of Nairobi CBD —
            compassionate, evidence-based and patient-centered.
          </p>
          <div className="mt-5 flex gap-2">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`${SITE.shortName} on ${label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-bold tracking-wide uppercase">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/services", label: "Services" },
              { to: "/shop", label: "Skincare Shop" },
              { to: "/book", label: "Book Appointment" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="font-display text-sm font-bold tracking-wide uppercase">Services</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {services.slice(0, 8).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="transition-colors hover:text-primary"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold tracking-wide uppercase">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={mapsLink} target="_blank" rel="noreferrer" className="hover:text-primary">
                {SITE.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={telLink} className="hover:text-primary">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Working Hours
                <br />
                Monday – Friday
                <br />
                9:00 AM – 5:00 PM
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 {SITE.name}. All Rights Reserved.</p>
          <p>Developed by Apex Web Solutions.</p>
        </div>
      </div>
    </footer>
  );
}

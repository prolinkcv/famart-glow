import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import logo from "@/assets/famart-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { SITE, telLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass-panel shadow-soft" : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt={`${SITE.name} logo`}
            width={56}
            height={56}
            className="h-11 w-11 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight">
              <span className="text-brand-red">FAMART</span> <span className="text-primary">HEALTHCARE</span>
            </span>
            <span className="block text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary bg-accent" }}
              inactiveProps={{ className: "text-foreground/80" }}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={telLink}>
              <Phone /> Call Now
            </a>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/book">Book Appointment</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-panel border-t lg:hidden">
          <nav aria-label="Mobile" className="mx-auto grid max-w-7xl gap-1 px-5 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-primary bg-accent" }}
                className="rounded-xl px-4 py-3 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <a href={telLink}>
                  <Phone /> Call
                </a>
              </Button>
              <Button asChild variant="hero">
                <Link to="/book" onClick={() => setOpen(false)}>
                  Book
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

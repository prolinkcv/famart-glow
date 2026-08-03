import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { SITE, telLink, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the sticky CTA from overlapping the footer.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Sticky Book Appointment CTA */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-300 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-0 sm:pb-6",
          show && !footerVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <Link
          to="/book"
          className="mx-auto flex h-12 max-w-md items-center justify-center gap-2 rounded-full gradient-brand px-7 text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          <CalendarCheck className="size-4" /> Book Appointment
        </Link>
      </div>

      <div
        className={cn(
          "fixed right-4 z-50 flex flex-col items-end gap-3 transition-all duration-300 sm:right-6",
          show && !footerVisible ? "bottom-20 sm:bottom-24" : "bottom-4 sm:bottom-6",
        )}
      >
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:text-primary",
            show ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          <ArrowUp className="size-5" />
        </button>

        <a
          href={telLink}
          aria-label={`Call ${SITE.shortName} on ${SITE.phoneDisplay}`}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-red text-brand-red-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:hidden"
        >
          <Phone className="size-5" />
        </a>

        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="size-6" />
        </a>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { SITE, telLink, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
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
  );
}

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Scrolls to the top of the page on every pathname change (unless a hash target is present). */
export function ScrollToTop() {
  const { pathname, hash } = useRouterState({ select: (s) => s.location });

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

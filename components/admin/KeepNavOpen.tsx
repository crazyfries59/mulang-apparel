"use client";

import { useNav, useWindowInfo } from "@payloadcms/ui";
import { useEffect } from "react";

/* Payload collapses the sidebar whenever the window is 1440px wide or less, which hides the menu
   on most laptops. Re-open it on anything wider than a tablet (Payload's "m" breakpoint is
   1024px); phones and tablets keep the slide-out menu. Payload closes the nav in its own effect
   for the same breakpoint change, and parent effects run after this child's, so the re-open is
   deferred to the next task to land last. */
export function KeepNavOpen() {
  const { hydrated, setNavOpen } = useNav();
  const { breakpoints: { m: tabletOrSmaller } } = useWindowInfo();
  useEffect(() => {
    if (!hydrated || tabletOrSmaller !== false) return;
    const timer = window.setTimeout(() => setNavOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, tabletOrSmaller, setNavOpen]);
  return null;
}

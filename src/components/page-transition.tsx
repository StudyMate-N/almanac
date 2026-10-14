"use client";

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

/**
 * Continuity between screens (docs/experience-standard.md, C2). The layout
 * (sidebar, tab bar) stays put; only the page content changes. By default the
 * old page fades out quickly and the new one rises in gently. Links tagged
 * "nav-forward" / "nav-back" (previous and next topic) slide in that direction.
 * Under prefers-reduced-motion the CSS turns every animation off.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

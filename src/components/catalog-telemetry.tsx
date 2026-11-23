"use client";

import { useEffect } from "react";
import { captureAlmanacEvent } from "@/lib/observability/posthog-client";

/** Count an actual catalogue impression, not every homepage load. */
export function AlmanacCatalogTelemetry() {
  useEffect(() => {
    const section = document.getElementById("courses");
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        // Disconnect only when consented capture succeeded.
        if (captureAlmanacEvent("almanac_catalog_viewed", { surface: "public" })) {
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return null;
}

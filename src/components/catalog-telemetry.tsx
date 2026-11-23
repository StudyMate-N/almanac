"use client";

import { useEffect } from "react";
import {
  ALMANAC_ANALYTICS_CONSENT_CHANGED,
  captureAlmanacEvent,
} from "@/lib/observability/posthog-client";

/**
 * Observe the catalogue once. If analytics consent is granted while the
 * catalogue is already visible, re-check its visibility immediately.
 */
export function AlmanacCatalogTelemetry() {
  useEffect(() => {
    const section = document.getElementById("courses");
    if (!section || typeof IntersectionObserver === "undefined") return;

    let captured = false;
    let observer: IntersectionObserver;

    function attemptCapture() {
      if (captured || !section) return;
      const rectangle = section.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(window.innerHeight, rectangle.bottom) -
          Math.max(0, rectangle.top),
      );
      const visibleFraction = visibleHeight / Math.max(1, rectangle.height);
      if (visibleFraction < 0.25) return;

      if (
        captureAlmanacEvent("almanac_catalog_viewed", {
          surface: "public",
        })
      ) {
        captured = true;
        observer.disconnect();
      }
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) attemptCapture();
      },
      { threshold: 0.25 },
    );

    window.addEventListener(
      ALMANAC_ANALYTICS_CONSENT_CHANGED,
      attemptCapture,
    );
    observer.observe(section);
    attemptCapture();

    return () => {
      observer.disconnect();
      window.removeEventListener(
        ALMANAC_ANALYTICS_CONSENT_CHANGED,
        attemptCapture,
      );
    };
  }, []);

  return null;
}

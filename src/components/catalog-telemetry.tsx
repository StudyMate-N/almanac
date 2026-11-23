"use client";

import { useEffect } from "react";
import {
  ALMANAC_ANALYTICS_CONSENT_CHANGED,
  captureAlmanacEvent,
} from "@/lib/observability/posthog-client";

/**
 * Track opening Almanac's refined /courses catalogue once per mount. No text,
 * personal data, request parameters or course identifiers are captured.
 * If consent is granted after page load, retry only then.
 */
export function AlmanacCatalogTelemetry() {
  useEffect(() => {
    let accepted = false;
    function captureIfAllowed() {
      if (accepted) return;
      accepted = captureAlmanacEvent("almanac_catalog_viewed", {
        surface: "public",
      });
    }

    window.addEventListener(
      ALMANAC_ANALYTICS_CONSENT_CHANGED,
      captureIfAllowed,
    );
    captureIfAllowed();

    return () => window.removeEventListener(
      ALMANAC_ANALYTICS_CONSENT_CHANGED,
      captureIfAllowed,
    );
  }, []);

  return null;
}

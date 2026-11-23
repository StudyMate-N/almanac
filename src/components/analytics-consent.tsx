"use client";

import { useEffect, useState } from "react";
import {
  isAlmanacAnalyticsPilotEnabled,
  readAlmanacAnalyticsConsent,
  saveAlmanacAnalyticsConsent,
} from "@/lib/observability/posthog-client";
import type { AlmanacAnalyticsConsentChoice } from "@/lib/observability/consent-policy";

/**
 * Disabled in production unless explicitly switched on. The visitor may
 * decline without affecting course browsing, learning or payments.
 */
export function AlmanacAnalyticsConsent() {
  const [choice, setChoice] = useState<AlmanacAnalyticsConsentChoice | null>(null);

  useEffect(() => {
    if (isAlmanacAnalyticsPilotEnabled()) {
      setChoice(readAlmanacAnalyticsConsent());
    }
  }, []);

  if (!isAlmanacAnalyticsPilotEnabled() || choice !== "pending") return null;

  function choose(next: "granted" | "denied") {
    // If localStorage is blocked, leave tracking disabled and keep the prompt.
    if (saveAlmanacAnalyticsConsent(next)) {
      setChoice(next);
    }
  }

  return (
    <aside
      aria-label="Optional analytics preference"
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:p-5"
    >
      <p className="font-semibold">Optional product analytics</p>
      <p className="mt-1 text-sm leading-relaxed">
        Help us improve Almanac by sharing limited usage events, such as opening
        the course catalogue. We do not send study answers, documents, invoice
        details or access codes. Analytics are processed by PostHog in the US.
        Your choice does not affect your access.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          onClick={() => choose("denied")}
        >
          No thanks
        </button>
        <button
          type="button"
          className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
          onClick={() => choose("granted")}
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}

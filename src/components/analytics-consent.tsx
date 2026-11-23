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
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (isAlmanacAnalyticsPilotEnabled()) {
      setChoice(readAlmanacAnalyticsConsent());
    }
  }, []);

  if (!isAlmanacAnalyticsPilotEnabled() || choice === null) return null;

  function choose(next: "granted" | "denied") {
    // If localStorage is blocked, leave tracking disabled and keep the prompt.
    if (saveAlmanacAnalyticsConsent(next)) {
      setChoice(next);
      setShowPreferences(false);
    }
  }

  return (
    <>
      {choice !== "pending" && !showPreferences && (
        <button
          type="button"
          aria-label="Change optional analytics preferences"
          className="fixed bottom-3 right-3 z-40 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50"
          onClick={() => setShowPreferences(true)}
        >
          Analytics settings
        </button>
      )}
      {(choice === "pending" || showPreferences) && (
    <aside
      aria-label="Optional analytics preference"
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-2xl rounded-2xl border border-[#E4DFF5] bg-white p-4 text-[#1B1530] shadow-xl sm:p-5"
    >
      <p className="font-semibold">Optional product analytics</p>
      <p className="mt-1 text-sm leading-relaxed">
        Help us improve Almanac by sharing limited usage events, such as opening
        the course catalogue. We do not send study answers, documents, invoice
        details or access codes. Analytics are processed by PostHog in the US.
        Your choice does not affect your access, and you can change it later
        using Analytics settings.
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
          className="rounded-full bg-[#5B3DF5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4A2DE6]"
          onClick={() => choose("granted")}
        >
          Allow analytics
        </button>
      </div>
    </aside>
      )}
    </>
  );
}

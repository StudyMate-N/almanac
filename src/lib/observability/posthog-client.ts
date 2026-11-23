import posthog from "posthog-js";
import { allowlistedAlmanacEvent } from "./event-contract";
import { sanitizeAlmanacTransportProperties } from "./transport-filter";
import {
  mayInitializeAlmanacAnalytics,
  type AlmanacAnalyticsConsentChoice,
} from "./consent-policy";

const CONSENT_STORAGE_KEY = "almanac:product-analytics-consent:v1";
export const ALMANAC_ANALYTICS_CONSENT_CHANGED = "almanac:analytics-consent-updated";
let sdkInitialized = false;

/** QA-only lifecycle markers, containing no user input or event properties. */
export function almanacAnalyticsQaStage(stage: string): void {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_ALMANAC_ANALYTICS_QA === "true"
  ) {
    window.dispatchEvent(
      new CustomEvent("almanac:qa-stage", { detail: stage }),
    );
  }
}

export function isAlmanacAnalyticsPilotEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ALMANAC_ANALYTICS_ENABLED === "true";
}

export function readAlmanacAnalyticsConsent(): AlmanacAnalyticsConsentChoice {
  if (typeof window === "undefined") return "pending";
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : "pending";
  } catch {
    return "pending";
  }
}

function missingConfigError(name: string): Error {
  return new Error(
    name +
      " variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once " +
      name +
      " is configured",
  );
}

/**
 * Next.js client-side bootstrap. Does not initialize PostHog, send events,
 * contact a CDN, or create a person until the visitor explicitly opts in.
 */
export function initializeAlmanacPosthog(): boolean {
  if (typeof window === "undefined" || !isAlmanacAnalyticsPilotEnabled()) {
    return false;
  }

  const consent = readAlmanacAnalyticsConsent();
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (consent !== "granted") return false;
  almanacAnalyticsQaStage("init:consented");
  if (!token?.trim() || !host?.trim()) {
    if (process.env.NODE_ENV !== "production") {
      throw missingConfigError(
        !token?.trim() ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN" : "NEXT_PUBLIC_POSTHOG_HOST",
      );
    }
    return false;
  }
  if (!mayInitializeAlmanacAnalytics(true, consent, token, host)) return false;

  if (sdkInitialized) {
    // A user may opt back in after declining.
    posthog.opt_in_capturing({ captureEventName: false });
    almanacAnalyticsQaStage(posthog.is_capturing() ? "init:capture-enabled" : "init:capture-disabled");
    return true;
  }

  try {
    almanacAnalyticsQaStage("init:starting");
    posthog.init(token, {
      api_host: host,
      defaults: "2026-08-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_flags: true,
      person_profiles: "identified_only",
      persistence: "memory",
      // Prevent the browser SDK from adding URL, query, referrer, document
      // and device properties to our already allowlisted event payloads.
      before_send: (event) => {
        if (!event) return null;
        const properties = sanitizeAlmanacTransportProperties(
          event.event,
          event.properties,
        );
        if (!properties) {
          almanacAnalyticsQaStage("send:rejected");
          return null;
        }
        almanacAnalyticsQaStage("send:allowed");
        return { ...event, properties, $set: undefined, $set_once: undefined };
      },
    });
    sdkInitialized = true;
    // Respect the explicit consent choice within the SDK as well; suppress
    // automatic $opt_in events so only our allowlisted events can be sent.
    posthog.opt_in_capturing({ captureEventName: false });
    almanacAnalyticsQaStage(posthog.is_capturing() ? "init:capture-enabled" : "init:capture-disabled");
    almanacAnalyticsQaStage("init:done");
    return true;
  } catch (error) {
    almanacAnalyticsQaStage("init:failed");
    if (process.env.NODE_ENV !== "production") {
      console.error("Almanac analytics failed to initialize", error);
    }
    return false;
  }
}

/** Explicit user action only; grant is never inferred from page navigation. */
export function saveAlmanacAnalyticsConsent(
  choice: Exclude<AlmanacAnalyticsConsentChoice, "pending">,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    return false;
  }

  if (choice === "denied") {
    if (sdkInitialized) {
      posthog.opt_out_capturing();
      posthog.reset();
    }
    window.dispatchEvent(new Event(ALMANAC_ANALYTICS_CONSENT_CHANGED));
    return true;
  }

  const initialized = initializeAlmanacPosthog();
  window.dispatchEvent(new Event(ALMANAC_ANALYTICS_CONSENT_CHANGED));
  return initialized;
}

/** Only the approved name and enumerated properties can reach the SDK. */
export function captureAlmanacEvent(
  eventName: unknown,
  properties: unknown,
): boolean {
  if (
    !sdkInitialized ||
    !isAlmanacAnalyticsPilotEnabled() ||
    readAlmanacAnalyticsConsent() !== "granted"
  ) {
    return false;
  }
  const safe = allowlistedAlmanacEvent(eventName, properties);
  if (!safe) {
    almanacAnalyticsQaStage("capture:invalid");
    return false;
  }
  almanacAnalyticsQaStage(posthog.is_capturing() ? "capture:enabled" : "capture:disabled");
  almanacAnalyticsQaStage("capture:attempt");

  try {
    const result = posthog.capture(safe.event, {
      ...safe.properties,
      $process_person_profile: false,
    });
    almanacAnalyticsQaStage(result ? "capture:returned-event" : "capture:returned-empty");
    return true;
  } catch {
    almanacAnalyticsQaStage("capture:failed");
    // Analytics failure must never affect the learner-facing workflow.
    return false;
  }
}

import posthog from "posthog-js";
import { allowlistedAlmanacEvent } from "./event-contract";
import {
  mayInitializeAlmanacAnalytics,
  type AlmanacAnalyticsConsentChoice,
} from "./consent-policy";

const CONSENT_STORAGE_KEY = "almanac:product-analytics-consent:v1";
let sdkInitialized = false;

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
    posthog.opt_in_capturing();
    return true;
  }

  try {
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
    });
    sdkInitialized = true;
    return true;
  } catch (error) {
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
    return true;
  }

  return initializeAlmanacPosthog();
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
  if (!safe) return false;

  try {
    posthog.capture(safe.event, {
      ...safe.properties,
      $process_person_profile: false,
    });
    return true;
  } catch {
    // Analytics failure must never affect the learner-facing workflow.
    return false;
  }
}

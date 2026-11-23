import { initializeAlmanacPosthog } from "./lib/observability/posthog-client";

// Next.js client bootstrap. With no consent or with pilot disabled, this is a
// complete no-op: no tracking requests, recordings or automatic pageviews.
initializeAlmanacPosthog();

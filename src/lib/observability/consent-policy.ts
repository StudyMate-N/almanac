/** Pure, network-free policy used by the browser integration and tests. */
export type AlmanacAnalyticsConsentChoice = "granted" | "denied" | "pending";

/** Tracking is opt-in, and is disabled whenever deployment config is incomplete. */
export function mayInitializeAlmanacAnalytics(
  enabled: boolean,
  consent: unknown,
  projectToken: string | undefined,
  host: string | undefined,
): boolean {
  return (
    enabled &&
    consent === "granted" &&
    Boolean(projectToken?.trim()) &&
    Boolean(host?.trim())
  );
}

import { allowlistedAlmanacEvent } from "./event-contract.ts";

/**
 * PostHog adds automatic context properties to custom events. The original
 * event allowlist alone cannot stop query strings, referrers and paths from
 * leaking. Use this for the SDK's before_send hook to fail closed.
 *
 * Preserve only the SDK's public ingest token and anonymous distinct ID,
 * the reviewed event properties and a personless-event flag.
 */
export function sanitizeAlmanacTransportProperties(
  name: unknown,
  rawProperties: unknown,
): Record<string, string | boolean> | null {
  const safe = allowlistedAlmanacEvent(name, rawProperties);
  if (!safe) return null;

  const output: Record<string, string | boolean> = {
    ...safe.properties,
    $process_person_profile: false,
  };
  if (rawProperties && typeof rawProperties === "object" && !Array.isArray(rawProperties)) {
    const input = rawProperties as Record<string, unknown>;
    if (typeof input.token === "string") output.token = input.token;
    if (typeof input.distinct_id === "string") output.distinct_id = input.distinct_id;
  }
  return output;
}

/**
 * Almanac's privacy-preserving telemetry schema.
 *
 * Only enum-like, non-identifying fields are permitted. This module has no
 * dependency on an analytics provider and performs no network requests.
 * An invalid name or value fails closed instead of forwarding raw content.
 */
export const ALMANAC_EVENT_ALLOWLIST = {
  almanac_catalog_viewed: { surface: ["public"] },
  almanac_request_started: { request_kind: ["custom", "catalog"] },
  almanac_request_step_completed: { step: ["scope", "preferences", "review"] },
  almanac_request_submitted: { request_kind: ["custom", "catalog"] },
  almanac_invoice_viewed: { surface: ["invoice"] },
  almanac_learning_opened: { surface: ["learner"] },
  almanac_client_error: {
    area: ["catalog", "request", "invoice", "learner"],
    error_code: ["network_error", "validation_error", "unauthorized", "unavailable"],
  },
} as const;

export type AlmanacEventName = keyof typeof ALMANAC_EVENT_ALLOWLIST;

export type AlmanacTelemetryEvent = Readonly<{
  event: AlmanacEventName;
  properties: Readonly<Record<string, string>>;
}>;

/**
 * Return a sanitized payload or null. Unknown fields, including PII and URL
 * query strings, are never retained. All known values must match the schema.
 * Call sites must also respect consent and the authorized transition point.
 */
export function allowlistedAlmanacEvent(
  name: unknown,
  rawProperties: unknown,
): AlmanacTelemetryEvent | null {
  if (typeof name !== "string" || !Object.hasOwn(ALMANAC_EVENT_ALLOWLIST, name)) {
    return null;
  }
  if (
    typeof rawProperties !== "object" ||
    rawProperties === null ||
    Array.isArray(rawProperties)
  ) {
    return null;
  }

  const rules = ALMANAC_EVENT_ALLOWLIST[
    name as AlmanacEventName
  ] as Readonly<Record<string, readonly string[]>>;
  const incoming = rawProperties as Readonly<Record<string, unknown>>;
  const sanitized: Record<string, string> = {};

  for (const [key, approved] of Object.entries(rules)) {
    const value = incoming[key];
    if (typeof value !== "string" || !approved.includes(value)) {
      return null;
    }
    sanitized[key] = value;
  }

  return { event: name as AlmanacEventName, properties: sanitized };
}

/**
 * Creem payment validation for Almanac. Pure, side-effect-free and server-only.
 * No credentials, customer details, browser SDK or database writes live here.
 *
 * Authenticity is only the FIRST gate. A signed event is not, by itself,
 * authorization to grant learning access. A separate persistent transaction
 * must match an approved offer/order, ensure idempotency and apply entitlement.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export type CreemPaymentEvidence = Readonly<{
  provider: "creem";
  eventId: string;
  checkoutId: string;
  orderId: string;
  productId: string;
  mode: string;
  status: "paid";
  eventType: "checkout.completed";
}>;

export type CreemVerification =
  | { verified: true; evidence: CreemPaymentEvidence; fulfillmentAllowed: false }
  | { verified: false; reason: "signature_missing" | "signature_invalid" | "payload_invalid" | "event_unsupported"; fulfillmentAllowed: false };

const CREEM_SIG_HEX = /^[0-9a-fA-F]{64}$/;
const creemId = (value: unknown, prefix: string): value is string =>
  typeof value === "string" && value.startsWith(prefix) && value.length <= 160 && /^[a-zA-Z0-9_-]+$/.test(value);
const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

export function verifyCreemWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !CREEM_SIG_HEX.test(signature)) return false;
  // Hash the unaltered raw body exactly as received. Do not JSON.stringify
  // a parsed request, which could change signed bytes or whitespace.
  const computed = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const supplied = Buffer.from(signature, "hex");
  return supplied.length === computed.length && timingSafeEqual(computed, supplied);
}

/**
 * Read a genuine Creem `checkout.completed` event into a minimal evidence
 * envelope. It intentionally does NOT grant access or acknowledge purchase.
 * Customer identifiers, emails, metadata and token-like fields are dropped.
 */
export function examineCreemWebhook(rawBody: string, signature: string | null, secret: string): CreemVerification {
  if (!signature || !secret) {
    return { verified: false, reason: "signature_missing", fulfillmentAllowed: false };
  }
  if (rawBody.length > 64_000 || !verifyCreemWebhookSignature(rawBody, signature, secret)) {
    return { verified: false, reason: "signature_invalid", fulfillmentAllowed: false };
  }

  let event: unknown;
  try { event = JSON.parse(rawBody); }
  catch { return { verified: false, reason: "payload_invalid", fulfillmentAllowed: false }; }

  const root = asRecord(event);
  if (!root || !creemId(root.id, "evt_") || typeof root.eventType !== "string") {
    return { verified: false, reason: "payload_invalid", fulfillmentAllowed: false };
  }
  if (root.eventType !== "checkout.completed") {
    // Refund, dispute, subscriptions and other event types need a separately
    // versioned state machine and persistent ledger. Never auto-fulfill them.
    return { verified: false, reason: "event_unsupported", fulfillmentAllowed: false };
  }

  const checkout = asRecord(root.object);
  const order = asRecord(checkout?.order);
  const product = asRecord(checkout?.product);
  const productId = product?.id ?? checkout?.product;
  if (
    !creemId(checkout?.id, "ch_") ||
    checkout.status !== "completed" ||
    !order ||
    !creemId(order.id, "ord_") ||
    order.status !== "paid" ||
    !creemId(productId, "prod_") ||
    typeof checkout.mode !== "string" ||
    !["test","live","prod"].includes(checkout.mode)
  ) {
    return { verified: false, reason: "payload_invalid", fulfillmentAllowed: false };
  }

  return {
    verified: true,
    evidence: {
      provider: "creem",
      eventId: root.id,
      eventType: "checkout.completed",
      checkoutId: checkout.id,
      orderId: order.id,
      productId,
      mode: checkout.mode,
      status: "paid",
    },
    fulfillmentAllowed: false,
  };
}

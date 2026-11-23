/**
 * Server-owned offer policy for a future Creem checkout adapter.
 * No offer IDs, prices or currency amounts are trusted from the browser.
 * No production checkout route is wired to this policy yet.
 */
export type AlmanacCreemOffer = Readonly<{
  slug: string;
  productId: string;
  currency: "USD" | "EUR";
  amountMinor: number;
  productType: "prebuilt-course" | "exam-preparation-library" | "self-study-resource";
  status: "approved" | "draft" | "retired";
  rightsCleared: boolean;
}>;

export type CreemCheckoutPolicyInput = Readonly<{
  requestedSlug: string;
  environment: "test" | "live";
  merchantApproved: boolean;
  paymentReleaseApproved: boolean;
  authenticatedLearner: boolean;
  offers: readonly AlmanacCreemOffer[];
}>;

export type CreemCheckoutDecision =
  | { allowed: true; offer: AlmanacCreemOffer; environment: "test" | "live" }
  | { allowed: false; reason: "checkout_disabled" | "not_authenticated" | "offer_unavailable" | "merchant_unapproved" | "invalid_offer" };

const productId = (value: string) => /^prod_[a-zA-Z0-9_-]{3,120}$/.test(value);
const safeSlug = (value: string) => /^[a-z0-9][a-z0-9-]{1,100}$/.test(value);

export function evaluateCreemCheckout(input: CreemCheckoutPolicyInput): CreemCheckoutDecision {
  if (!input.paymentReleaseApproved) return { allowed:false,reason:"checkout_disabled" };
  if (!input.authenticatedLearner) return { allowed:false,reason:"not_authenticated" };
  if (!input.merchantApproved) return { allowed:false,reason:"merchant_unapproved" };
  if (!safeSlug(input.requestedSlug)) return { allowed:false,reason:"invalid_offer" };

  const item = input.offers.find(offer => offer.slug === input.requestedSlug);
  if (
    !item ||
    item.status !== "approved" ||
    !item.rightsCleared ||
    !productId(item.productId) ||
    !Number.isSafeInteger(item.amountMinor) ||
    item.amountMinor < 100 ||
    !["USD","EUR"].includes(item.currency) ||
    !["prebuilt-course","exam-preparation-library","self-study-resource"].includes(item.productType)
  ) return { allowed:false,reason:"offer_unavailable" };
  return { allowed:true,offer:item,environment:input.environment };
}

/**
 * IMPORTANT: production registry is deliberately empty until the owner and
 * Creem approve real offers, product IDs, advertised prices and rights.
 * Do not create a checkout from arbitrary browser-supplied Creem product ID.
 */
export const ALMANAC_CREEM_APPROVED_OFFERS: readonly AlmanacCreemOffer[] = Object.freeze([]);

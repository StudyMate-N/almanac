/**
 * Almanac-only customer contact policy.
 *
 * Keep public invoice recovery, mail reply-to and the help center aligned.
 * A WhatsApp number must not silently fall back to a number associated with
 * another merchant. Approval must reflect a real operationally verified,
 * dedicated support channel; it cannot resolve provider compliance by itself.
 */
export const ALMANAC_SUPPORT_EMAIL = "almanacstudy.support@gmail.com";

/** Legacy shared channel identified in the provider's Nov 2026 review. */
const LEGACY_CROSS_BRAND_WHATSAPP = "12057279363";
const CROSS_BRAND_EMAIL_DOMAIN = "@unemployedproff.com";

/** Never use the known other brand as the support or transactional sender. */
export function isCrossBrandEmail(value: string): boolean {
  return value.toLowerCase().includes(CROSS_BRAND_EMAIL_DOMAIN);
}

/**
 * Fail closed. Only show WhatsApp when an operator confirms a separate,
 * approved Almanac-only channel and supplies the actual E.164 number.
 *
 * Do not treat this opt-in as proof of payment-provider approval or autonomy
 * from any related business. Organizational affiliation must be disclosed.
 */
export function approvedAlmanacWhatsAppNumber(
  raw: string | undefined | null,
  approved: string | undefined | null,
): string | null {
  if (approved !== "true" || !raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (!/^[1-9][0-9]{7,14}$/.test(digits)) return null;
  if (digits === LEGACY_CROSS_BRAND_WHATSAPP) return null;
  return digits;
}

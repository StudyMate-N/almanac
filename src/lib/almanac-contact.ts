/**
 * Almanac-only customer contact policy.
 *
 * Keep public invoice recovery, mail reply-to and the help center aligned.
 * A WhatsApp number must not silently fall back to a number associated with
 * another merchant. Approval must reflect a real operationally verified,
 * dedicated support channel; it cannot resolve provider compliance by itself.
 *
 * Legacy channels from another business are blocked by fingerprint only, so
 * their addresses never appear in Almanac source, builds or bundles.
 */
export const ALMANAC_SUPPORT_EMAIL = "almanacstudy.support@gmail.com";

/** FNV-1a 32-bit fingerprint (lowercase hex). Used only for denylist checks. */
export function contactFingerprint(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/** Email domains that must never be used as Almanac support or sender identities. */
const BLOCKED_EMAIL_DOMAIN_FINGERPRINTS = new Set(["d0eb1c2b"]);
/** WhatsApp numbers (E.164 digits) previously shared with another merchant. */
const BLOCKED_WHATSAPP_FINGERPRINTS = new Set(["d9e0222e"]);

/** Never use a blocked legacy domain as the support or transactional sender. */
export function isCrossBrandEmail(value: string): boolean {
  const matches = value.toLowerCase().match(/@([a-z0-9.-]+\.[a-z]{2,})/g) ?? [];
  return matches.some((m) => {
    // Check the domain and each parent (mail.example.com -> example.com).
    const parts = m.slice(1).split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      if (BLOCKED_EMAIL_DOMAIN_FINGERPRINTS.has(contactFingerprint(parts.slice(i).join(".")))) return true;
    }
    return false;
  });
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
  if (BLOCKED_WHATSAPP_FINGERPRINTS.has(contactFingerprint(digits))) return null;
  return digits;
}

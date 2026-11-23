/** Parse a bank-confirmed CAD amount without floating-point rounding. */
export function parseConfirmedCadCents(raw: string): number | null {
  const text = raw.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) return null;
  const [dollars, decimals = ""] = text.split(".");
  const dollarAmount = Number(dollars);
  if (!Number.isSafeInteger(dollarAmount)) return null;
  const cents = dollarAmount * 100 + Number(decimals.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

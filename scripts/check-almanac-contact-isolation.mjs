/**
 * Run: node scripts/check-almanac-contact-isolation.mjs
 * Regression guard: no Almanac file (app code, edge functions, scripts, docs,
 * workflows) may expose a legacy cross-brand email domain or the previously
 * shared WhatsApp number. Blocked values are matched by fingerprint, so the
 * legacy contacts themselves never appear anywhere in this repository.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

// Must match src/lib/almanac-contact.ts (FNV-1a 32-bit, lowercase hex).
const BLOCKED_EMAIL_DOMAINS = new Set(["d0eb1c2b"]);
// Previously shared WhatsApp number, with and without the country code.
const BLOCKED_PHONE_DIGITS = new Set(["d9e0222e", "7320a557"]);

function fingerprint(value) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

const SCAN_DIRS = ["src", "supabase", "scripts", "docs", "product-studio", "learning-experience", ".github", "public"];
const ROOT_FILES = ["README.md", "AGENTS.md", "netlify.toml", "next.config.ts", "package.json"];
const TEXT = /\.(?:tsx?|jsx?|mjs|cjs|json|md|mdx|sql|toml|ya?ml|txt|html|css)$/i;
const problems = [];
let scanned = 0;

function check(path, body) {
  scanned++;
  const lower = body.toLowerCase();
  for (const m of lower.matchAll(/@([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})/g)) {
    // Check the full domain and each parent domain (e.g. mail.example.com -> example.com).
    const parts = m[1].split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      if (BLOCKED_EMAIL_DOMAINS.has(fingerprint(parts.slice(i).join(".")))) {
        problems.push(`${path}: blocked legacy email domain`);
        return;
      }
    }
  }
  for (const m of lower.matchAll(/(?:^|[^a-z0-9-])([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})/g)) {
    if (BLOCKED_EMAIL_DOMAINS.has(fingerprint(m[1]))) {
      problems.push(`${path}: blocked legacy domain`);
      return;
    }
  }
  for (const m of body.matchAll(/\+?\d[\d\s().-]{8,18}\d/g)) {
    const digits = m[0].replace(/[^0-9]/g, "");
    if (BLOCKED_PHONE_DIGITS.has(fingerprint(digits))) {
      problems.push(`${path}: legacy shared WhatsApp number`);
      return;
    }
  }
}

async function walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const ent of entries) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const loc = join(dir, ent.name);
    if (ent.isDirectory()) { await walk(loc); continue; }
    if (!ent.isFile() || !TEXT.test(ent.name)) continue;
    check(relative(root, loc).replaceAll("\\", "/"), await readFile(loc, "utf8"));
  }
}

for (const d of SCAN_DIRS) await walk(join(root, d));
for (const f of ROOT_FILES) {
  try { check(f, await readFile(join(root, f), "utf8")); } catch { /* optional file */ }
}

const read = (p) => readFile(join(root, p), "utf8");
const contact = await read("src/app/contact/page.tsx");
const invoiceRoute = await read("src/app/api/learning-invoices/route.ts");
const helper = await read("src/lib/almanac-contact.ts");
const mail = await read("src/lib/learning-mail.ts");
if (!contact.includes("approvedAlmanacWhatsAppNumber")) problems.push("contact page lacks approved WhatsApp gate");
if (!invoiceRoute.includes("approvedAlmanacWhatsAppNumber")) problems.push("invoice API lacks approved WhatsApp gate");
if (!helper.includes('approved !== "true"')) problems.push("WhatsApp gate does not require explicit approval");
if (!helper.includes("BLOCKED_WHATSAPP_FINGERPRINTS.has(")) problems.push("legacy shared WhatsApp number not blocked");
for (const fp of BLOCKED_EMAIL_DOMAINS) if (!helper.includes(`"${fp}"`)) problems.push("app email denylist out of sync with this audit");
if (!mail.includes("isCrossBrandEmail(FROM)") && !mail.includes("isCrossBrandEmail(value)")) problems.push("transactional sender lacks known cross-brand gate");

if (problems.length) {
  console.error("Almanac contact isolation audit FAILED:\n" + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Almanac contact isolation audit passed (" + scanned + " files checked).");
}

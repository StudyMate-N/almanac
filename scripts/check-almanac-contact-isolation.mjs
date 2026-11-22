/**
 * Run: node scripts/check-almanac-contact-isolation.mjs
 * Regression guard: Almanac customer UI must not expose a legacy cross-brand
 * email or share the previously rejected WhatsApp number.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const sourceDir = new URL("../src/", import.meta.url);
const forbiddenEmail = ["support", "@", "unemployedproff.com"].join("");
const oldNumber = ["1205", "727", "9363"].join("");
const allowOneDenialPolicy = "lib/almanac-contact.ts";
const problems = [];
let scanned = 0;

async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const loc = join(dir, ent.name);
    if (ent.isDirectory()) { await walk(loc); continue; }
    if (!ent.isFile() || !/\.(?:tsx?|jsx?|mjs|js)$/.test(ent.name)) continue;
    scanned++;
    const path = relative(new URL("../src/", import.meta.url).pathname, loc).replaceAll("\\", "/");
    const body = await readFile(loc, "utf8");
    if (body.toLowerCase().includes(forbiddenEmail)) problems.push(path + ": forbidden legacy support address");
    if (path !== allowOneDenialPolicy && body.replace(/[^0-9]/g, "").includes(oldNumber)) {
      problems.push(path + ": legacy shared WhatsApp digits");
    }
    if (path !== allowOneDenialPolicy && body.includes(oldNumber)) problems.push(path + ": legacy shared WhatsApp number");
  }
}

await walk(new URL("../src/", import.meta.url).pathname);
const contact = await readFile(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8");
const invoiceRoute = await readFile(new URL("../src/app/api/learning-invoices/route.ts", import.meta.url), "utf8");
const helper = await readFile(new URL("../src/lib/almanac-contact.ts", import.meta.url), "utf8");
const mail = await readFile(new URL("../src/lib/learning-mail.ts", import.meta.url), "utf8");
if (!contact.includes("approvedAlmanacWhatsAppNumber")) problems.push("contact page lacks approved WhatsApp gate");
if (!invoiceRoute.includes("approvedAlmanacWhatsAppNumber")) problems.push("invoice API lacks approved WhatsApp gate");
if (!helper.includes('approved !== "true"')) problems.push("WhatsApp gate does not require explicit approval");
if (!helper.includes(oldNumber)) problems.push("legacy shared WhatsApp number not blocked explicitly");
if (!mail.includes("isCrossBrandEmail(FROM)") && !mail.includes("isCrossBrandEmail(value)")) problems.push("transactional sender lacks known cross-brand gate");
if (problems.length) {
  console.error("Almanac contact isolation audit FAILED:\n" + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Almanac contact isolation audit passed (" + scanned + " source files checked).");
}

/**
 * Browser QA: serves the production build with fake, compile-time-only
 * PostHog settings. All analytics calls are intercepted by Playwright.
 * Nothing in this test sends telemetry to PostHog or changes production.
 *
 * Usage after building the app with the QA environment variables:
 *   node scripts/qa-analytics-consent-browser.mjs
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { gunzipSync } from "node:zlib";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const port = 3185;
const origin = `http://127.0.0.1:${port}`;
const fakeIngestion = "https://telemetry.almanac.invalid";
const prohibitedMarker = "PRIVATE_LEARNER_TOKEN_SHOULD_NOT_LEAK";
const requests = [];
let appStdout = "";
const proc = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(port)],
  { env: { ...process.env, NODE_ENV: "production" }, stdio: ["ignore", "pipe", "pipe"] },
);
proc.stdout.on("data", (chunk) => { appStdout += String(chunk).slice(-1000); });
proc.stderr.on("data", (chunk) => { appStdout += String(chunk).slice(-1000); });

function inspectBody(request) {
  let body = request.postDataBuffer() ?? Buffer.alloc(0);
  try {
    if (body.length > 2 && body[0] === 0x1f && body[1] === 0x8b) {
      body = gunzipSync(body);
    }
  } catch {
    // A binary body is still recorded, not silently omitted.
  }
  let value = body.toString("utf8");
  if (value.startsWith("data=")) {
    const params = new URLSearchParams(value);
    const encoded = params.get("data");
    if (encoded) {
      const decoded = Buffer.from(encoded, "base64");
      try {
        value += "\n" + gunzipSync(decoded).toString("utf8");
      } catch {
        value += "\n" + decoded.toString("utf8");
      }
    }
  }
  return value;
}

async function waitForServer() {
  for (let i = 0; i < 75; i++) {
    if (proc.exitCode !== null) throw new Error("Next.js server stopped: " + appStdout);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1250) });
      if (response.ok) return;
    } catch { /* Build server not ready yet */ }
    await sleep(450);
  }
  throw new Error("Next.js server did not start: " + appStdout);
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const context = await browser.newContext({ serviceWorkers: "block" });
  await context.route(`${fakeIngestion}/**`, async (route) => {
    const request = route.request();
    requests.push({
      url: request.url(),
      method: request.method(),
      body: inspectBody(request),
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-credentials": "true",
      },
      body: '{"status":"ok","flags":{}}',
    });
  });

  const page = await context.newPage();
  const clientErrors = [];
  const thirdPartyHosts = new Set();
  page.on("pageerror", (error) => clientErrors.push(error.message.slice(0, 300)));
  page.on("request", (request) => {
    const host = new URL(request.url()).hostname;
    if (host !== "127.0.0.1") thirdPartyHosts.add(host);
  });
  await page.goto(`${origin}/?private_token=${prohibitedMarker}`);
  await page.getByRole("button", { name: "No thanks" }).click();
  await page.locator("#courses").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  assert.equal(requests.length, 0, "declined consent must never contact analytics");

  await page.getByRole("button", { name: "Change optional analytics preferences" }).click();
  await page.getByRole("button", { name: "Allow analytics" }).click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("almanac:product-analytics-consent:v1")),
    "granted",
    "opt-in must persist as granted",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.locator("#courses").scrollIntoViewIfNeeded();

  // At least one approved catalogue event must reach the intercepted host.
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline && requests.length === 0) await page.waitForTimeout(450);
  if (!requests.length) {
    console.error("QA diagnostics:", JSON.stringify({
      consent: await page.evaluate(() => localStorage.getItem("almanac:product-analytics-consent:v1")),
      visibleAnalyticsControl: await page.getByRole("button", { name: "Change optional analytics preferences" }).count(),
      thirdPartyHosts: [...thirdPartyHosts],
      clientErrors,
      courseVisible: await page.locator("#courses").isVisible(),
    }));
  }
  assert.ok(requests.length > 0, "opt-in and catalogue view must emit a test analytics request");

  const sent = requests.map((r) => `${r.url}\n${r.body}`).join("\n");
  assert.ok(
    requests.every((r) => r.url.startsWith(fakeIngestion + "/")),
    "requests must be intercepted and must never reach real PostHog",
  );
  assert.ok(!sent.includes(prohibitedMarker), "private query token must not be sent");
  assert.ok(!sent.includes("private_token="), "URL query keys must not be sent");
  console.log(`PASS: decline emits zero requests; consented catalogue emits ${requests.length} intercepted request(s)`);

  await page.getByRole("button", { name: "Change optional analytics preferences" }).click();
  await page.getByRole("button", { name: "No thanks" }).click();
  const afterRevoke = requests.length;
  await page.reload();
  await page.locator("#courses").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  assert.equal(requests.length, afterRevoke, "revoke must stop further analytics requests");
  console.log("PASS: revocation persists after reload and prevents further tracking");
  await context.close();
} finally {
  if (browser) await browser.close();
  proc.kill("SIGTERM");
}

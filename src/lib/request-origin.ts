/**
 * Allow browser submissions only from known Almanac deployments.
 * Netlify/OpenNext may reconstruct request.url with an internal host, which
 * cannot be used as the sole CSRF origin comparison.
 * Keep the production hostname explicit and read preview hosts only from
 * server-controlled platform variables, never forwarded request headers.
 */
const PRODUCTION_ORIGIN = "https://almanac-study.netlify.app";

type IncomingRequest = { url: string; headers: { get(name: string): string | null } };

function permittedOrigins(request: IncomingRequest) {
  const allowed = new Set([PRODUCTION_ORIGIN]);
  const supplied = [
    process.env.URL,             // Netlify production site URL
    process.env.DEPLOY_URL,      // Netlify individual deployment
    process.env.DEPLOY_PRIME_URL,// Netlify branch/deploy-preview alias
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];
  for (const value of supplied) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol === "https:") allowed.add(url.origin);
    } catch { /* Do not trust malformed deployment URLs. */ }
  }
  // Local developer workflows should continue to work without production secrets.
  try {
    const requestUrl = new URL(request.url);
    if (process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(requestUrl.hostname)) {
      allowed.add(requestUrl.origin);
    }
  } catch { /* The caller's URL should be valid; invalid URLs are not trusted. */ }
  return allowed;
}

export function approvedRequestOrigin(request: IncomingRequest): boolean {
  const browserOrigin = request.headers.get("origin");
  // Preserve non-browser API clients, which do not send Origin. These routes
  // additionally validate payloads, secret invoice tokens, and staff sessions.
  if (!browserOrigin) return true;
  return permittedOrigins(request).has(browserOrigin);
}

/** Create customer invoice links on the public site, never a protected deployment alias. */
export function publicInvoiceUrl(id: string, token: string): string {
  const url = new URL("/invoice", PRODUCTION_ORIGIN);
  url.searchParams.set("id", id);
  url.searchParams.set("token", token);
  return url.toString();
}

/** All customer access emails should open the public learning workspace. */
export function emailLoginBaseUrl(_request: IncomingRequest): string {
  return PRODUCTION_ORIGIN;
}

/**
 * Dependency advisory audit using the exact lockfile.
 * Reads npm audit output only. Never changes npm dependencies or credentials.
 */
import { spawnSync } from "node:child_process";

function fetchAudit(label, options) {
  const result = spawnSync("npm", ["audit", "--json", ...options], {
    encoding: "utf8",
    maxBuffer: 15 * 1024 * 1024,
    timeout: 120_000,
  });

  if (result.error) throw result.error;
  let audit;
  try {
    audit = JSON.parse(result.stdout ?? "");
  } catch {
    throw new Error(label + ": npm audit did not return valid JSON; stderr=" +
      String(result.stderr ?? "").slice(0, 1000));
  }
  if (audit.error) throw new Error(label + ": npm audit error " + JSON.stringify(audit.error).slice(0, 1200));
  const vulnerabilities = audit.vulnerabilities ?? {};
  const entries = Object.values(vulnerabilities).sort((a, b) => a.name.localeCompare(b.name));

  console.log("\n=== " + label + " ===");
  console.log("Advisory counts:", JSON.stringify(audit.metadata?.vulnerabilities ?? {}));
  if (entries.length === 0) console.log("No vulnerabilities in npm audit response.");

  for (const entry of entries) {
    console.log("\nPACKAGE", entry.name);
    console.log("  severity:", entry.severity);
    console.log("  direct:", Boolean(entry.isDirect));
    console.log("  affected range:", entry.range ?? "unspecified");
    console.log("  lockfile nodes:", JSON.stringify(entry.nodes ?? []));
    console.log("  upgrade path:", JSON.stringify(entry.fixAvailable ?? false));
    console.log("  via:");
    for (const via of entry.via ?? []) {
      if (typeof via === "string") {
        console.log("    transitive cause:", via);
      } else {
        console.log("    advisory:", JSON.stringify({
          source: via.source,
          name: via.name,
          title: via.title,
          url: via.url,
          range: via.range,
          severity: via.severity,
          cwe: via.cwe,
        }));
      }
    }
  }
  return { entries, counts: audit.metadata?.vulnerabilities ?? {} };
}

const all = fetchAudit("LOCKED COMPLETE DEPENDENCY TREE", []);
const prod = fetchAudit("LOCKED PRODUCTION DEPENDENCIES ONLY", ["--omit=dev"]);
console.log("\nREVIEW SUMMARY");
console.log("All:", JSON.stringify(all.counts));
console.log("Production:", JSON.stringify(prod.counts));
console.log("Production high/critical packages:",
  prod.entries.filter(e => e.severity === "high" || e.severity === "critical").map(e => e.name).join(", ") || "none");

if (all.entries.some(e => e.severity === "high" || e.severity === "critical")) {
  console.error("Security gate BLOCKED: high/critical locked dependency advisories require tested fixes or reviewed risk acceptance.");
  process.exitCode = 1;
}

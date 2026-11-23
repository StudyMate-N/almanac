// Almanac Product Studio: a feature needs a testable user outcome, not a
// descriptive issue or a passing TypeScript build alone.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const file = "product-studio/features/guided-learning-entry.v1.json";
const feature = JSON.parse(readFileSync(file,"utf8"));
assert.equal(feature.schemaVersion,1);
assert.match(feature.featureId,/^[a-z][a-z0-9-]+$/);
assert.equal(feature.surface,"/app/guide");
assert.equal(feature.status,"pilot");
assert.equal(feature.pricingImpact,"none");
assert.equal(feature.requiredEntitlement,"existing-authorized-course");
assert.equal(feature.allowedSource,"useCourse(courseId)");
assert.equal(feature.evaluation.releaseAllowed,false);
assert.ok(feature.job.length>40 && feature.learnerPromise.length>40);
assert.ok(feature.assumptions.length>=1);
assert.ok(feature.pilotScenarios.length>=8);
assert.equal(new Set(feature.pilotScenarios.map(x=>x.id)).size,feature.pilotScenarios.length);
assert.ok(feature.pilotScenarios.every(x=>x.outcome.length>10));
for(const gate of ["no-new-orders","entitlement-safe","reviewed-content-only","non-fabricated-fallbacks","keyboard-and-mobile","no-sensitive-analytics","rollback-ready"]){
  assert.ok(feature.releaseGates.includes(gate),"missing required product safety gate "+gate);
}
assert.equal(feature.privacy.posthogEnabled,false);
assert.equal(feature.privacy.sessionReplayEnabled,false);
assert.ok(feature.privacy.disallow.includes("clinical_case") && feature.privacy.disallow.includes("answers"));
assert.ok(feature.evaluation.browserReviewRequired && feature.evaluation.contentReviewRequired);
for(const path of [
  feature.evaluation.testScript,
  "src/lib/learning-guide.ts",
  "src/components/guided-learning-entry.tsx",
  "src/app/app/(shell)/guide/page.tsx",
]){
  assert.ok(existsSync(path),"missing implementation/test file: "+path);
}

const newOrderRoute=readFileSync("src/app/api/learning-requests/route.ts","utf8");
assert.ok(newOrderRoute.includes('error: "checkout_paused"'),"new-order API must remain paused");
assert.ok(!newOrderRoute.includes("learning-order-checkout"),"new-order API cannot re-enable old backend");
const publicRequest=readFileSync("src/app/request/page.tsx","utf8");
assert.ok(!publicRequest.includes("<RequestBuilder"),"old payment form must not return during product pilot");
console.log("PASS: guided entry has a measurable, no-checkout product contract and implementation gates.");

import assert from "node:assert/strict";
import { calculateQuote, parseLearningRequest, OfferValidationError } from "../src/lib/learning-offers.ts";

const packages = {
  resource: [49, 69, 93],
  exam: [149, 209, 283],
  course: [399, 559, 758],
};
for (const [kind, expected] of Object.entries(packages)) {
  ["standard","priority","express"].forEach((speed, i) => {
    assert.equal(calculateQuote({kind, speed, addons:[]}).totalUsd, expected[i], kind+" "+speed);
  });
}
assert.equal(calculateQuote({kind:"course",speed:"priority",addons:["slides","audio"]}).totalUsd,794);
assert.equal(calculateQuote({kind:"resource",speed:"standard",addons:["exam_sim"]}).totalUsd,88);
const valid = {
  kind:"course",speed:"standard",deliveryMethod:"both",
  courseId:"advanced-pharmacology",subject:"Advanced Pharmacology",
  goal:"Prepare a structured study course with practice.",
  name:"Alex Learner",email:"ALEX@example.com",addons:["slides","slides","audio"],
};
const parsed = parseLearningRequest(valid);
assert.deepEqual(parsed.addons, ["slides","audio"]);
assert.equal(parsed.email,"alex@example.com");
assert.throws(() => parseLearningRequest({...valid,email:"invalid"}), OfferValidationError);
assert.throws(() => parseLearningRequest({...valid,addons:["unpriced"]}), OfferValidationError);
console.log("Almanac package price and validation checks passed.");

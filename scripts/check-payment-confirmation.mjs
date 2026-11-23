// No-write tests for staff bank amount validation.
import assert from "node:assert/strict";
import { parseConfirmedCadCents } from "../src/lib/payment-confirmation.ts";

assert.equal(parseConfirmedCadCents("168.30"),16830);
assert.equal(parseConfirmedCadCents(" 168.30 "),16830);
assert.equal(parseConfirmedCadCents("168.3"),16830);
assert.equal(parseConfirmedCadCents("168"),16800);
assert.equal(parseConfirmedCadCents("0.01"),1);
assert.equal(parseConfirmedCadCents("168.301"),null);
assert.equal(parseConfirmedCadCents("168,30"),null);
assert.equal(parseConfirmedCadCents("CAD 168.30"),null);
assert.equal(parseConfirmedCadCents("-168.30"),null);
assert.equal(parseConfirmedCadCents("abc"),null);
assert.equal(parseConfirmedCadCents("999999999999999999999999"),null);
console.log("Passed staff CAD amount parsing tests.");

import assert from "node:assert/strict";
import test from "node:test";
import { suggestGuidedStep } from "../src/lib/learning-guide.ts";

const reading = (id, completed = false) => ({id, medium:"reading", completed});
const video = (id, completed = false) => ({id, medium:"video", completed});
const base = {
  courseId: "advanced-pathophysiology",
  intent: "unsure",
  minutes: 15,
  lowData: false,
  lessons: [],
  approvedQuestionCount: 0,
  missedQuestionCount: 0,
};

test("no permission-derived content means no invented learning", () => {
  const result = suggestGuidedStep(base);
  assert.equal(result.state, "not_ready");
  assert.equal(result.kind, "overview");
  assert.ok(!result.href.includes("/app/learn/"));
});

test("malformed course id cannot become a link", () => {
  const result = suggestGuidedStep({...base,courseId:"../../other-account",lessons:[reading("l1")]});
  assert.equal(result.state,"not_ready");
  assert.equal(result.href,"/app/courses");
});

test("understand chooses an explanation from authorized input", () => {
  const result = suggestGuidedStep({...base,intent:"understand",lessons:[video("v1"),reading("r1")]});
  assert.equal(result.href,"/app/learn/r1");
  assert.equal(result.reasonCode,"explain");
});

test("low data never opens a video-first lesson", () => {
  const result = suggestGuidedStep({...base,intent:"understand",lowData:true,lessons:[video("v1"),reading("r1")]});
  assert.equal(result.href,"/app/learn/r1");
  const none = suggestGuidedStep({...base,lowData:true,lessons:[video("v1")]});
  assert.equal(none.state,"not_ready");
});

test("guided start prioritizes unfinished materials", () => {
  const result=suggestGuidedStep({...base,lessons:[reading("done",true),reading("next")]});
  assert.equal(result.href,"/app/learn/next");
});

test("exam prep opens existing practice and size follows session target", () => {
  const results=[5,15,30].map(minutes=>suggestGuidedStep({...base,intent:"prepare",minutes,approvedQuestionCount:70}));
  assert.deepEqual(results.map(x=>new URL(x.href,"https://example.invalid").searchParams.get("n")),["5","10","20"]);
  assert.ok(results.every(x=>x.kind==="practice"&&x.reasonCode==="prepare"));
});

test("missed review routes only to already-reviewed practice pool", () => {
  const result=suggestGuidedStep({...base,intent:"review",approvedQuestionCount:20,missedQuestionCount:3});
  assert.equal(result.reasonCode,"missed");
  assert.equal(new URL(result.href,"https://example.invalid").searchParams.get("pool"),"missed");
});

test("no missed history is explained without pretending errors", () => {
  const result=suggestGuidedStep({...base,intent:"review",approvedQuestionCount:20,missedQuestionCount:0});
  assert.equal(result.kind,"practice");
  assert.equal(result.reasonCode,"fallback");
  assert.equal(new URL(result.href,"https://example.invalid").searchParams.has("pool"),false);
});

test("unsafe or nonexistent lesson identifiers are excluded", () => {
  const result=suggestGuidedStep({...base,intent:"understand",lessons:[reading("../private"),reading("good-lesson")]});
  assert.equal(result.href,"/app/learn/good-lesson");
});

test("invalid practice count never invents a practice route", () => {
  const result=suggestGuidedStep({...base,intent:"prepare",approvedQuestionCount:Number.NaN});
  assert.equal(result.state,"not_ready");
});

test("the guidance engine cannot change entitlement, score, prices or learning data", () => {
  const input={...base,lessons:[reading("r1")],approvedQuestionCount:4};
  const before=JSON.stringify(input);
  const result=suggestGuidedStep(input);
  assert.equal(JSON.stringify(input),before);
  for(const key of ["score","grade","mastery","authToken","price","payment","email","studentId"]) {
    assert.equal(Object.hasOwn(result,key),false);
  }
});

test("no arbitrary unapproved user-provided lesson content enters recommendation output", () => {
  const result=suggestGuidedStep({...base,lessons:[reading("available-lesson")]});
  assert.ok(result.why.length>0);
  assert.ok(result.after.length>0);
  assert.ok(!JSON.stringify(result).includes("student@example"));
});

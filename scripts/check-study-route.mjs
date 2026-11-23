import assert from "node:assert/strict";
import test from "node:test";
import { selectStudyRoute, safePracticeSetSize } from "../src/lib/study-route.ts";

const reading = (id, completed = false) => ({id, mode:"reading", completed});
const video = (id, completed = false) => ({id, mode:"video", completed});

test("no open content or available practice never invents a lesson", () => {
  assert.equal(selectStudyRoute([], "balanced", 0, false), null);
  assert.equal(selectStudyRoute([video("v1")], "video", 0, true), null);
});

test("learners can choose a preferred authorized format", () => {
  assert.deepEqual(selectStudyRoute([reading("r1"),video("v1")], "video", 2, false), {
    kind:"lesson", lessonId:"v1", reason:"preference",
  });
  assert.deepEqual(selectStudyRoute([reading("r1"),video("v1")], "reading", 2, false), {
    kind:"lesson", lessonId:"r1", reason:"preference",
  });
});

test("practice remains available without inventing additional media", () => {
  assert.deepEqual(selectStudyRoute([], "practice", 5, false), {
    kind:"practice", lessonId:null, reason:"preference",
  });
  assert.equal(selectStudyRoute([], "practice", 0, false), null);
});

test("balanced mode favors unfinished real content, not a completed page", () => {
  assert.deepEqual(selectStudyRoute([reading("already-read",true),video("new-video")], "balanced", 2, false), {
    kind:"lesson", lessonId:"new-video", reason:"continue",
  });
});

test("low-bandwidth mode never starts a video", () => {
  const result=selectStudyRoute([video("video"),reading("text")], "video", 3, true);
  assert.deepEqual(result, {kind:"lesson",lessonId:"text",reason:"safe_alternative"});
});

test("requested video or practice modes offer a truthful fallback", () => {
  assert.equal(selectStudyRoute([reading("r1")],"video",0,false)?.reason,"safe_alternative");
  assert.equal(selectStudyRoute([reading("r1")],"practice",0,false)?.lessonId,"r1");
});

test("invalid paths and invalid practice counts cannot generate a navigation target", () => {
  assert.equal(selectStudyRoute([reading("../../private")],"reading",0,false),null);
  assert.equal(selectStudyRoute([], "practice", Number.NaN, false), null);
  assert.equal(selectStudyRoute([], "practice", -2, false), null);
});

test("recommendation contains no grade, mastery or entitlement modification", () => {
  const before=[reading("lesson-1")];
  const out=selectStudyRoute(before,"balanced",0,false);
  assert.equal(out?.lessonId,"lesson-1");
  assert.deepEqual(before,[reading("lesson-1")]);
  for (const blocked of ["grade","mastery","entitlement","invoice","payment"]) {
    assert.equal(Object.hasOwn(out ?? {},blocked),false);
  }
});

test("practice-set deep links accept only existing supported sizes", () => {
  for (const n of [5, 10, 20, 40]) {
    assert.equal(safePracticeSetSize(String(n)), n);
  }
  for (const invalid of ["-1", "999", "1e3", "abc", "10;DROP TABLE", null, undefined, {}, []]) {
    assert.equal(safePracticeSetSize(invalid), 10);
  }
});

import assert from "node:assert/strict";
import test from "node:test";
import { STUDY_FORMATS, alternativeFormats, courseFormats, topicFormats } from "../src/lib/study-formats.ts";

/* Study formats must never claim more than exists (ITERATION_2_FINDINGS.md). */

const mod = { id: "c-s1", courseId: "c", number: 1, title: "Cells", blurb: "", kind: "section" };
const page = (id, blocks, kind = "topic") => ({ id, moduleId: "c-s1", index: 0, title: id, kind, groupId: "g", groupTitle: "g", objective: "", blocks });
const video = { t: "video", clip: "clip-1" };
const topic = page("t1", [{ t: "p", html: "words" }, video]);
const summary = page("sum", [{ t: "cards", title: "Cards", ids: ["k1"] }], "summary");
const q = (id) => ({ id, moduleId: "c-s1", topic: "x", type: "single", level: "recall", stem: "", ask: "", options: [], correct: [], source: "" });
const card = (id) => ({ id, moduleId: "c-s1", topic: "x", front: "", back: "", source: "" });
const content = { lessons: [topic, summary], questions: [q("q1"), q("q2")], cards: [card("k1")], modules: [mod] };
const clipMinutes = (id) => (id === "clip-1" ? 7 : undefined);
const status = (list, id) => list.find((f) => f.format.id === id).status;

test("catalogue has the seven formats in a fixed order", () => {
  assert.deepEqual(STUDY_FORMATS.map((f) => f.id), ["read", "watch", "listen", "see", "practise", "remember", "rehearse"]);
});

test("listen is never available without published audio", () => {
  for (const audioAssets of [undefined, 0, -3]) {
    assert.notEqual(status(courseFormats("c", content, { mediaBase: "https://m", clipMinutes, audioAssets }), "listen"), "available");
    assert.notEqual(status(topicFormats(topic, content, { mediaBase: "https://m", clipMinutes, audioAssets }), "listen"), "available");
  }
  assert.equal(status(courseFormats("c", content, { mediaBase: "", clipMinutes, audioAssets: 2 }), "listen"), "available");
});

test("watch is never available when there is no media store", () => {
  const course = courseFormats("c", content, { mediaBase: "", clipMinutes });
  assert.equal(status(course, "watch"), "in_production");
  const t = topicFormats(topic, content, { mediaBase: "", clipMinutes });
  assert.equal(status(t, "watch"), "in_production");
  assert.equal(t.find((f) => f.format.id === "watch").href, undefined);
});

test("watch needs a clip that exists, not just a video block", () => {
  const missing = { ...content, lessons: [page("t2", [{ t: "video", clip: "gone" }]), summary] };
  assert.notEqual(status(courseFormats("c", missing, { mediaBase: "https://m", clipMinutes }), "watch"), "available");
  assert.equal(status(courseFormats("c", content, { mediaBase: "https://m", clipMinutes }), "watch"), "available");
});

test("empty, unentitled or unapproved content yields nothing available", () => {
  const none = courseFormats("c", { lessons: [], questions: [], cards: [], modules: [mod] }, { mediaBase: "https://m", clipMinutes, examsConfigured: true });
  assert.ok(none.every((f) => f.status !== "available"), "no content must mean no available format");
  const other = courseFormats("other-course", content, { mediaBase: "https://m", clipMinutes, examsConfigured: true });
  assert.ok(other.every((f) => f.status !== "available"), "another course's items never count");
});

test("rehearse needs configured exams and questions; see stays planned without maps", () => {
  assert.equal(status(courseFormats("c", content, { mediaBase: "", clipMinutes }), "rehearse"), "planned");
  assert.equal(status(courseFormats("c", content, { mediaBase: "", clipMinutes, examsConfigured: true }), "rehearse"), "available");
  assert.equal(status(courseFormats("c", content, { mediaBase: "", clipMinutes }), "see"), "planned");
});

test("alternatives exclude the primary link, unavailable formats and duplicates", () => {
  const t = topicFormats(topic, content, { mediaBase: "https://m", clipMinutes, pageMinutes: () => 8 });
  const alts = alternativeFormats(t, { href: "/app/learn/t1", format: "read" });
  assert.deepEqual(alts.map((f) => f.format.id), ["practise", "remember"]);
  assert.ok(alts.every((f) => f.href && !f.href.includes("..")));
  assert.equal(alts.find((f) => f.format.id === "practise").count, 2);
});

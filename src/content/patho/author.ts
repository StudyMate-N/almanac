/**
 * Authoring format for the Pathophysiology course player, and the build step
 * that turns it into Almanac modules, pages, questions and cards.
 *
 * Sections are written the way a student meets them: section → lesson →
 * page → blocks. Questions and flashcards are written inline where they
 * appear; build() lifts them out into the shared question bank and deck, so
 * the same item feeds the page, practice, exam simulations and review.
 */
import type { Block, Card, Lesson, Level, Module, PageKind, Question } from "../types";

export const COURSE_ID = "advanced-pathophysiology";
export const TEXT = "McCance & Huether, Pathophysiology: The Biologic Basis for Disease in Adults and Children";

/** An option: text, whether it is correct, and why. */
export type AOpt = { t: string; ok: boolean; why: string };

export type AQ = {
  id: string;
  /** mc = one best answer; ms = select all that apply. */
  type: "mc" | "ms";
  stem: string;
  options: AOpt[];
  /** The takeaway shown after answering. */
  rationale: string;
  /** Keep option order (numbers, sequences). */
  fixed?: boolean;
  level?: Level;
  topic?: string;
};

/** Flashcard: [front, back] or [front, back, detail]. */
export type ACard = [string, string] | [string, string, string];

export type ABlock =
  | Exclude<Block, { t: "check" } | { t: "quiz" } | { t: "cards" }>
  | { t: "q"; q: AQ }
  | { t: "quiz"; mode: "practice" | "test"; qs: AQ[] }
  | { t: "cards"; id: string; title: string; cards: ACard[] };

export type APage = { id: string; title: string; shortTitle?: string; kind: PageKind; blocks: ABlock[]; source?: string; topic?: string };
export type AGroup = { id: string; title: string; pages: APage[]; topic?: string };
export type ASection = {
  id: string;
  num: number;
  title: string;
  blurb: string;
  kind: "start" | "section" | "final";
  competency?: string;
  /** Default source for every item in the section. */
  source?: string;
  groups: AGroup[];
};

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** Split a stem into the scenario and the question line the runner shows in bold. */
function splitStem(stemHtml: string): { stem: string; ask: string } {
  const text = stripTags(stemHtml);
  const choose = text.match(/\s*(Choose (?:\d+|all) answers?\.?)\s*$/i);
  const body = choose ? text.slice(0, choose.index).trim() : text;
  const tail = choose ? ` ${choose[1]}` : "";
  // The last sentence that ends in a question mark is the ask.
  const m = body.match(/^(.*?[.!?"”)])\s+([^.!?]*\?)$/s);
  if (m) return { stem: m[1].trim(), ask: (m[2].trim() + tail).trim() };
  return { stem: "", ask: (body + tail).trim() };
}

const letters = "abcdefgh";

function toQuestion(q: AQ, moduleId: string, lessonId: string, topic: string, source: string): Question {
  const { stem, ask } = splitStem(q.stem);
  const options = q.options.map((o, i) => ({ id: letters[i], text: stripTags(o.t), rationale: stripTags(o.why) }));
  return {
    id: q.id,
    moduleId,
    lessonId,
    topic: q.topic ?? topic,
    type: q.type === "ms" ? "multiple" : "single",
    level: q.level ?? "application",
    stem,
    ask,
    options,
    correct: q.options.flatMap((o, i) => (o.ok ? [letters[i]] : [])),
    source,
    takeaway: stripTags(q.rationale),
    fixedOrder: q.fixed,
  };
}

export type Built = { modules: Module[]; pages: Lesson[]; questions: Question[]; cards: Card[] };

export function build(sections: ASection[]): Built {
  const out: Built = { modules: [], pages: [], questions: [], cards: [] };
  const seen = new Set<string>();
  const unique = (id: string) => {
    if (seen.has(id)) throw new Error(`Duplicate content id: ${id}`);
    seen.add(id);
  };
  for (const s of sections) {
    const moduleId = `patho-${s.id}`;
    unique(moduleId);
    out.modules.push({ id: moduleId, courseId: COURSE_ID, number: s.num, title: s.title, blurb: s.blurb, kind: s.kind, competency: s.competency });
    let index = 0;
    for (const g of s.groups) {
      for (const p of g.pages) {
        unique(p.id);
        const source = p.source ?? s.source ?? TEXT;
        const topic = p.topic ?? g.topic ?? g.title.replace(/^Lesson \d+:\s*/, "");
        const blocks: Block[] = p.blocks.map((b) => {
          if (b.t === "q") {
            unique(b.q.id);
            out.questions.push(toQuestion(b.q, moduleId, p.id, topic, source));
            return { t: "check", id: b.q.id };
          }
          if (b.t === "quiz") {
            for (const q of b.qs) {
              unique(q.id);
              out.questions.push(toQuestion(q, moduleId, p.id, topic, source));
            }
            return { t: "quiz", mode: b.mode, ids: b.qs.map((q) => q.id) };
          }
          if (b.t === "cards") {
            const ids = b.cards.map((c, i) => {
              const id = `${b.id}-${String(i + 1).padStart(2, "0")}`;
              unique(id);
              out.cards.push({ id, moduleId, lessonId: p.id, topic, front: stripTags(c[0]), back: stripTags(c[1]), detail: c[2] ? stripTags(c[2]) : undefined, source });
              return id;
            });
            return { t: "cards", title: b.title, ids };
          }
          if (b.t === "open") unique(b.id);
          return b;
        });
        const eq = blocks.find((b) => b.t === "eq") as { text: string } | undefined;
        const firstP = blocks.find((b) => b.t === "p") as { html: string } | undefined;
        out.pages.push({
          id: p.id,
          moduleId,
          index: ++index,
          title: p.title,
          shortTitle: p.shortTitle,
          kind: p.kind,
          groupId: g.id,
          groupTitle: g.title,
          objective: eq ? eq.text : firstP ? stripTags(firstP.html).split(/(?<=\.)\s/)[0] : p.title,
          blocks,
          source,
        });
      }
    }
  }
  return out;
}

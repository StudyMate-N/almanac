/**
 * Study formats (Learning Studio iteration 2, product-studio/ITERATION_2_FINDINGS.md).
 *
 * One reviewed topic can be studied several ways. This module is the single
 * catalogue of those ways and the rules for when each one may be called
 * "available". Status is always derived from content that actually exists:
 * a plan, a production pipeline or a marketing wish never makes a format
 * available. Callers pass already entitlement- and approval-filtered content
 * for learner views; public pages pass the static catalogue only.
 *
 * Pure: no imports with runtime effect, no network, no storage. Safe to run
 * under `node --experimental-strip-types` (scripts/check-study-formats.mjs).
 */
import type { Block, Card, Lesson, Module, Question } from "@/content/types";

export type FormatId = "read" | "watch" | "listen" | "see" | "practise" | "remember" | "rehearse";
export type FormatStatus = "available" | "in_production" | "planned";
export type FormatIcon = "page" | "play" | "wave" | "map" | "check" | "cards" | "timer";

export type StudyFormat = Readonly<{
  id: FormatId;
  /** Imperative verb shown first: "Read", "Watch"… */
  verb: string;
  /** What the learner gets. */
  label: string;
  description: string;
  icon: FormatIcon;
}>;

/** Order matters: it is the order learners see everywhere. */
export const STUDY_FORMATS: readonly StudyFormat[] = [
  { id: "read", verb: "Read", label: "Reviewed lesson", description: "A short, reviewed explanation of one idea, with the textbook pages it comes from.", icon: "page" },
  { id: "watch", verb: "Watch", label: "Video overview", description: "The same idea explained on screen, with chapters and pauses to check yourself.", icon: "play" },
  { id: "listen", verb: "Listen", label: "Audio overview", description: "A spoken walk-through for the commute or a break between tasks.", icon: "wave" },
  { id: "see", verb: "See", label: "Concept map", description: "How the ideas in a section connect, on one page.", icon: "map" },
  { id: "practise", verb: "Practise", label: "Questions with rationales", description: "Apply the idea, then read why each option is right or wrong.", icon: "check" },
  { id: "remember", verb: "Remember", label: "Flashcards", description: "Spaced review that brings an idea back just before you forget it.", icon: "cards" },
  { id: "rehearse", verb: "Rehearse", label: "Exam simulation", description: "A timed practice exam built from the course's reviewed questions.", icon: "timer" },
] as const;

export const STATUS_LABEL: Record<FormatStatus, string> = {
  available: "Available",
  in_production: "In production",
  planned: "Planned",
};

export type FormatContent = Readonly<{
  /** Course pages (all kinds). For learner views: only pages this learner may open. */
  lessons: readonly Lesson[];
  questions: readonly Question[];
  cards: readonly Card[];
  modules: readonly Module[];
}>;

export type FormatOptions = Readonly<{
  /** Base URL of the media store. Empty means no video can play, so Watch is never available. */
  mediaBase: string;
  /** Duration in minutes of a clip id, or undefined when the clip does not exist. */
  clipMinutes: (clipId: string) => number | undefined;
  /** Published, reviewed audio overviews for this scope. None exist yet. */
  audioAssets?: number;
  /** Published, reviewed concept maps for this scope. None exist yet. */
  conceptMaps?: number;
  /** Whether exam simulations are configured for the course. */
  examsConfigured?: boolean;
  /** Reading time for a page, used for the Read chip. */
  pageMinutes?: (page: Lesson) => number;
}>;

export type FormatState = Readonly<{
  format: StudyFormat;
  status: FormatStatus;
  /** How many items back this status (pages, clips, questions, cards). 0 when not available. */
  count: number;
}>;

type VideoBlock = Extract<Block, { t: "video" }>;
const videoBlocks = (page: Lesson) => page.blocks.filter((b): b is VideoBlock => b.t === "video");
const byId = new Map(STUDY_FORMATS.map((f) => [f.id, f]));
const fmt = (id: FormatId) => byId.get(id)!;

function playableClips(pages: readonly Lesson[], opts: FormatOptions) {
  if (!opts.mediaBase) return [] as VideoBlock[];
  return pages.flatMap(videoBlocks).filter((b) => opts.clipMinutes(b.clip) !== undefined);
}

/**
 * Status of every format for one course. `content` should hold only that course's
 * items (learner views: only items the learner may see).
 */
export function courseFormats(courseId: string, content: FormatContent, opts: FormatOptions): FormatState[] {
  const mods = new Set(content.modules.filter((m) => m.courseId === courseId).map((m) => m.id));
  const pages = content.lessons.filter((l) => mods.has(l.moduleId));
  const readable = pages.filter((l) => l.kind === "topic" || l.kind === "reading").length;
  const clips = playableClips(pages, opts).length;
  const anyVideo = pages.some((p) => videoBlocks(p).length > 0);
  const questions = content.questions.filter((q) => mods.has(q.moduleId)).length;
  const cards = content.cards.filter((c) => mods.has(c.moduleId)).length;
  const audio = Math.max(0, opts.audioAssets ?? 0);
  const maps = Math.max(0, opts.conceptMaps ?? 0);

  const status: Record<FormatId, [FormatStatus, number]> = {
    read: readable ? ["available", readable] : ["planned", 0],
    // Clips exist but cannot play without a media store: they are still being prepared for learners.
    watch: clips ? ["available", clips] : [anyVideo || readable ? "in_production" : "planned", 0],
    // The owner produces audio overviews in Gemini Notebook; none is published yet.
    listen: audio ? ["available", audio] : ["in_production", 0],
    see: maps ? ["available", maps] : ["planned", 0],
    practise: questions ? ["available", questions] : [readable ? "in_production" : "planned", 0],
    remember: cards ? ["available", cards] : [readable ? "in_production" : "planned", 0],
    rehearse: opts.examsConfigured && questions ? ["available", questions] : ["planned", 0],
  };
  return STUDY_FORMATS.map((f) => ({ format: f, status: status[f.id][0], count: status[f.id][1] }));
}

export type TopicFormat = FormatState &
  Readonly<{
    /** "topic" items belong to this page; "section" items cover the page's whole section. */
    scope: "topic" | "section";
    href?: string;
    minutes?: number;
    /** Short chip text, e.g. "Section 1 cards · 34". */
    chip?: string;
  }>;

/**
 * Ways to study one topic page, with links to existing routes. Only formats
 * with real items for this learner are "available"; the rest carry their
 * course-level status so a caller can show or hide them honestly.
 */
export function topicFormats(topic: Lesson, content: FormatContent, opts: FormatOptions): TopicFormat[] {
  const mod = content.modules.find((m) => m.id === topic.moduleId);
  const sectionName = mod && mod.kind === "section" ? `Section ${mod.number}` : mod?.title ?? "this section";
  const learn = `/app/learn/${encodeURIComponent(topic.id)}`;
  const clipMin = opts.mediaBase
    ? videoBlocks(topic).reduce((n, b) => n + (opts.clipMinutes(b.clip) ?? 0), 0)
    : 0;
  const hasClip = opts.mediaBase ? videoBlocks(topic).some((b) => opts.clipMinutes(b.clip) !== undefined) : false;
  const sectionQuestions = content.questions.filter((q) => q.moduleId === topic.moduleId).length;
  const sectionCards = content.cards.filter((c) => c.moduleId === topic.moduleId).length;
  // Cards are studied on the section's summary page, when the learner may open it.
  const cardsPage = content.lessons.find((l) => l.moduleId === topic.moduleId && l.blocks.some((b) => b.t === "cards"));
  const practiseN = Math.min(5, sectionQuestions);

  const out: Record<FormatId, TopicFormat> = {
    read: { format: fmt("read"), status: "available", count: 1, scope: "topic", href: learn, minutes: opts.pageMinutes?.(topic), chip: opts.pageMinutes ? `Read · ${opts.pageMinutes(topic)} min` : "Read" },
    watch: hasClip
      ? { format: fmt("watch"), status: "available", count: videoBlocks(topic).length, scope: "topic", href: learn, minutes: Math.round(clipMin) || undefined, chip: clipMin ? `Watch · ${Math.round(clipMin)} min` : "Watch" }
      : { format: fmt("watch"), status: "in_production", count: 0, scope: "topic" },
    listen: { format: fmt("listen"), status: (opts.audioAssets ?? 0) > 0 ? "available" : "in_production", count: Math.max(0, opts.audioAssets ?? 0), scope: "topic" },
    see: { format: fmt("see"), status: (opts.conceptMaps ?? 0) > 0 ? "available" : "planned", count: Math.max(0, opts.conceptMaps ?? 0), scope: "section" },
    practise: practiseN
      ? { format: fmt("practise"), status: "available", count: practiseN, scope: "section", href: `/app/practice/custom?m=${encodeURIComponent(topic.moduleId)}&t=all&l=all&p=new&n=${practiseN}&mode=tutor&timer=0`, chip: `${practiseN} ${sectionName} question${practiseN === 1 ? "" : "s"}` }
      : { format: fmt("practise"), status: "in_production", count: 0, scope: "section" },
    remember: sectionCards && cardsPage
      ? { format: fmt("remember"), status: "available", count: sectionCards, scope: "section", href: `/app/learn/${encodeURIComponent(cardsPage.id)}`, chip: `${sectionName} cards · ${sectionCards}` }
      : { format: fmt("remember"), status: sectionCards ? "in_production" : "planned", count: 0, scope: "section" },
    // A simulation covers the course, not a topic; it is offered from home and progress instead.
    rehearse: { format: fmt("rehearse"), status: "planned", count: 0, scope: "section" },
  };
  return STUDY_FORMATS.map((f) => out[f.id]);
}

/**
 * The quiet alternatives under a primary action: available formats for the
 * same topic that lead somewhere other than the primary link.
 */
export function alternativeFormats(formats: readonly TopicFormat[], primary: { href?: string; format?: FormatId }) {
  const seen = new Set<string>(primary.href ? [primary.href] : []);
  return formats.filter((f) => {
    if (f.status !== "available" || !f.href || !f.chip || f.format.id === primary.format) return false;
    if (seen.has(f.href)) return false;
    seen.add(f.href);
    return true;
  });
}

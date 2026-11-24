import { cards, lessons, modules, questions } from "@/content/course";
import { clipById } from "@/content/patho";
import { EXAMS, MEDIA_BASE } from "@/lib/config";
import { minutesFor } from "@/lib/minutes";
import { courseFormats, type FormatOptions } from "@/lib/study-formats";

/** Length of a course clip in minutes, or undefined when the clip does not exist. */
export function clipMinutes(clipId: string) {
  const d = clipById(clipId)?.duration;
  if (!d) return undefined;
  return d.split(":").reduce((a, x) => a * 60 + Number(x), 0) / 60;
}

/** Options shared by public and learner views. Audio overviews and concept maps: none published yet. */
export const formatOptions: FormatOptions = {
  mediaBase: MEDIA_BASE,
  clipMinutes,
  audioAssets: 0,
  conceptMaps: 0,
  examsConfigured: Boolean(EXAMS.midterm && EXAMS.final),
  pageMinutes: minutesFor,
};

/**
 * Public, catalogue-level status for a course page or the homepage. Uses the
 * static course catalogue only: no learner data, no approvals, no network.
 */
export function publicCourseFormats(courseId: string) {
  return courseFormats(courseId, { lessons, questions, cards, modules }, formatOptions);
}

export type SectionInside = Readonly<{
  id: string;
  number: number;
  title: string;
  /** Topic and reading pages. */
  pages: number;
  /** Clips that can play: counted only when a media store is configured, like the Watch status. */
  videos: number;
  questions: number;
  cards: number;
  /** Estimated study minutes: the app's own per-page estimate (words at 200/min, plus clip lengths and checks). */
  minutes: number;
}>;

/**
 * "What's inside" for a public course page: per-section counts from the static catalogue.
 * Public data only (no learner state). Counts describe the prepared course; learners see items
 * as reviewers approve them.
 */
export function publicSectionsInside(courseId: string): SectionInside[] {
  return modules
    .filter((m) => m.courseId === courseId && m.kind === "section")
    .map((m) => {
      const pages = lessons.filter((l) => l.moduleId === m.id);
      const readable = pages.filter((l) => l.kind === "topic" || l.kind === "reading");
      const videos = MEDIA_BASE
        ? pages.flatMap((l) => l.blocks).filter((b) => b.t === "video" && clipMinutes(b.clip) !== undefined).length
        : 0;
      return {
        id: m.id,
        number: m.number,
        title: m.title,
        pages: readable.length,
        videos,
        questions: questions.filter((q) => q.moduleId === m.id).length,
        cards: cards.filter((c) => c.moduleId === m.id).length,
        minutes: pages.reduce((n, l) => n + minutesFor(l), 0),
      };
    });
}

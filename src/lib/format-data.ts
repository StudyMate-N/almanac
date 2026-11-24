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

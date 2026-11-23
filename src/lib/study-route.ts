/**
 * Small deterministic study-route selector. The caller must supply only
 * lessons already authorized by useCourse() — this is never an entitlement
 * authority and cannot unlock a lesson or rewrite learner progress.
 */
export type StudyStartMode = "balanced" | "reading" | "video" | "practice";
export type StudyRouteCandidate = Readonly<{
  id: string;
  mode: "reading" | "video";
  completed: boolean;
}>;
export type SuggestedStudyRoute = Readonly<{
  kind: "lesson" | "practice";
  lessonId: string | null;
  reason: "continue" | "preference" | "safe_alternative";
}>;

export function selectStudyRoute(
  candidates: readonly StudyRouteCandidate[],
  mode: StudyStartMode,
  practiceQuestionCount: number,
  lowBandwidth: boolean,
): SuggestedStudyRoute | null {
  const safe = candidates.filter(
    (candidate) =>
      /^[a-z0-9-]+$/.test(candidate.id) &&
      (!lowBandwidth || candidate.mode !== "video"),
  );
  const pick = (kind?: "reading" | "video") => {
    const options = kind ? safe.filter((item) => item.mode === kind) : safe;
    return options.find((item) => !item.completed) ?? options[0] ?? null;
  };
  const practiceReady = Number.isInteger(practiceQuestionCount) && practiceQuestionCount > 0;
  const asLesson = (item: StudyRouteCandidate, reason: SuggestedStudyRoute["reason"]): SuggestedStudyRoute => ({
    kind: "lesson",
    lessonId: item.id,
    reason,
  });

  if (mode === "practice" && practiceReady) {
    return { kind: "practice", lessonId: null, reason: "preference" };
  }
  if (mode === "reading") {
    const preferred = pick("reading");
    if (preferred) return asLesson(preferred, "preference");
  }
  if (mode === "video" && !lowBandwidth) {
    const preferred = pick("video");
    if (preferred) return asLesson(preferred, "preference");
  }
  // A new user can simply continue. Fallbacks do not imply a measured
  // learning-style diagnosis or allow access to unavailable formats.
  const ordinary = pick("reading") ?? pick();
  if (ordinary) return asLesson(ordinary, mode === "balanced" ? "continue" : "safe_alternative");
  if (practiceReady) {
    return { kind: "practice", lessonId: null, reason: "safe_alternative" };
  }
  return null;
}

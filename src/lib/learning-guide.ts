/**
 * Almanac's first learner-guidance contract. This is an educational
 * *navigator*, not a generative tutor or a mastery diagnosis.
 *
 * The caller must pass content already filtered by the signed-in learner's
 * entitlement and reviewer approvals. This function has no data/network
 * access, pricing path or write side effects.
 */
export type LearnerIntent = "understand" | "prepare" | "review" | "unsure";
export type SessionMinutes = 5 | 15 | 30;
export type AvailableLesson = Readonly<{
  id: string;
  medium: "reading" | "video";
  completed: boolean;
}>;

export type GuideInput = Readonly<{
  courseId: string;
  intent: LearnerIntent;
  minutes: SessionMinutes;
  lowData: boolean;
  lessons: readonly AvailableLesson[];
  approvedQuestionCount: number;
  missedQuestionCount: number;
}>;

export type GuidedStep = Readonly<{
  state: "ready" | "not_ready";
  kind: "lesson" | "practice" | "overview";
  href: string;
  action: string;
  reasonCode: "explain" | "prepare" | "missed" | "continue" | "fallback" | "not_ready";
  why: string;
  after: string;
  sessionTargetMinutes: SessionMinutes;
}>;

const slug = (value: string) => /^[a-z0-9][a-z0-9-]*$/.test(value);
const practiceSize = (minutes: SessionMinutes) => minutes === 5 ? 5 : minutes === 15 ? 10 : 20;
const asLink = (lessonId: string) => `/app/learn/${encodeURIComponent(lessonId)}`;

export function suggestGuidedStep(input: GuideInput): GuidedStep {
  const { courseId, intent, minutes, lowData } = input;
  const safeLessons = input.lessons.filter(
    (lesson) => slug(lesson.id) && (!lowData || lesson.medium !== "video"),
  );
  const availableQuestions = Number.isInteger(input.approvedQuestionCount)
    ? Math.max(0, input.approvedQuestionCount)
    : 0;
  const missed = Number.isInteger(input.missedQuestionCount)
    ? Math.min(availableQuestions, Math.max(0, input.missedQuestionCount))
    : 0;
  const uncompleted = (kind?: AvailableLesson["medium"]) =>
    safeLessons.find((l) => (!kind || l.medium === kind) && !l.completed);
  const any = (kind?: AvailableLesson["medium"]) =>
    uncompleted(kind) ?? safeLessons.find((l) => !kind || l.medium === kind);

  function lessonStep(lesson: AvailableLesson, reasonCode: GuidedStep["reasonCode"], why: string): GuidedStep {
    return {
      state: "ready", kind: "lesson", href: asLink(lesson.id), action: lesson.medium === "video" ? "Start this video lesson" : "Open this lesson",
      reasonCode, why,
      after: "When you're done, try a reviewed question or a flashcard to check what you remember.",
      sessionTargetMinutes: minutes,
    };
  }

  function practiceStep(missedOnly: boolean, reasonCode: GuidedStep["reasonCode"], why: string): GuidedStep {
    const n=Math.min(practiceSize(minutes), availableQuestions);
    const requested=missedOnly?Math.min(n,missed):n;
    const params=new URLSearchParams({course:courseId,n:String(requested),...(missedOnly?{pool:"missed"}:{})});
    return {
      state: "ready",kind:"practice",href:`/app/practice?${params.toString()}`,
      action:missedOnly?"Review questions you missed":"Build a practice set",
      reasonCode,why,
      after:"Read each explanation, note where your reasoning changed, and decide which concept to revisit.",
      sessionTargetMinutes:minutes,
    };
  }

  const reading=any("reading");
  const next=uncompleted() ?? any();

  if (!slug(courseId)) {
    return {
      state:"not_ready",kind:"overview",href:"/app/courses",action:"Browse your courses",
      reasonCode:"not_ready",
      why:"The selected course could not be verified. No lesson or practice link has been suggested.",
      after:"Choose a course you already have permission to study.",
      sessionTargetMinutes:minutes,
    };
  }

  if (intent === "review" && missed > 0) {
    return practiceStep(true,"missed","You have unanswered learning needs from earlier practice. Start by reviewing missed questions and their explanations.");
  }
  if (intent === "prepare" && availableQuestions > 0) {
    return practiceStep(false,"prepare","A short practice set can show which reviewed topics need another explanation before your assessment.");
  }
  if (intent === "understand" && reading) {
    return lessonStep(reading,"explain","Start with a reviewed explanation, then check the idea by trying to retrieve or apply it.");
  }
  if (intent === "unsure" && next) {
    return lessonStep(next,"continue","This available course page is a useful starting point. You can change the route at any time.");
  }
  if (next) {
    return lessonStep(next,"fallback","Your requested route is not available right now. This is an already-authorized learning alternative.");
  }
  if (availableQuestions > 0) {
    return practiceStep(false,"fallback","No suitable lesson is ready; reviewed practice is available as an alternative.");
  }
  return {
    state:"not_ready",kind:"overview",href:`/app/courses/${encodeURIComponent(courseId)}`,
    action:"View your course",
    reasonCode:"not_ready",
    why:"There is no reviewed, accessible lesson or practice item ready for this course yet. Almanac won't pretend an unavailable resource exists.",
    after:"Check the course outline or contact support if you expected content to be released.",
    sessionTargetMinutes:minutes,
  };
}

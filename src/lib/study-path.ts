/**
 * Proposal-only, deterministic study-next-step selector for Almanac.
 * It does NOT persist data, change entitlements, grade learners, recalculate
 * prices or assert mastery. Use only with server-authorized content metadata.
 */
export type StudyStartMode = "balanced" | "reading" | "video" | "practice";
export type LearningMediaKind = "text" | "video" | "audio" | "slides" | "quiz" | "flashcards" | "story" | "game" | "music";
export type MediaStatus = "draft" | "review" | "approved" | "released" | "blocked";
export type StudyMedia = {
  id: string;
  kind: LearningMediaKind;
  objectiveId: string;
  status: MediaStatus;
  approvedHash: string | null;
  entitled: boolean;
  rightsCleared: boolean;
  accessible: boolean;
};
export type StudyContext = {
  objectiveId: string;
  startMode: StudyStartMode;
  lowBandwidth: boolean;
  dueCardCount: number;
  missedReviewedItemCount: number;
  hasReviewedExplanation: boolean;
  options: StudyMedia[];
};
export type NextStep = {
  action: "revisit_due" | "explain_gap" | "learn" | "practise" | "unavailable";
  mediaId: string | null;
  reasonCode: "due_review" | "missed_reasoning" | "preference" | "safe_fallback" | "not_ready";
  reason: string;
  canOverride: true;
  evidenceOfMastery: false;
};

const isReleased = (m: StudyMedia, objective: string) =>
  m.objectiveId === objective &&
  m.status === "released" &&
  Boolean(m.approvedHash?.trim()) &&
  m.entitled && m.rightsCleared && m.accessible;

function select(assets: StudyMedia[], kinds: LearningMediaKind[]) {
  for (const kind of kinds) {
    const found=assets.find(m=>m.kind === kind);
    if (found) return found;
  }
  return null;
}

/** A reversible recommendation, not an adaptive learning diagnosis. */
export function recommendStudyNextStep(input: StudyContext): NextStep {
  const safe=input.options.filter(m=>isReleased(m,input.objectiveId));
  const textual = (kinds: LearningMediaKind[]) =>
    input.lowBandwidth ? kinds.filter(k=>!["video","audio","game","music"].includes(k)) : kinds;

  if (input.dueCardCount > 0) {
    const review=select(safe,["flashcards"]);
    if (review) return {action:"revisit_due",mediaId:review.id,reasonCode:"due_review",
      reason:"Some previously studied cards are due for review.",canOverride:true,evidenceOfMastery:false};
  }
  if (input.missedReviewedItemCount > 0) {
    const explanation=select(safe,textual(["text","slides","video","audio"]));
    if (explanation) return {action:"explain_gap",mediaId:explanation.id,reasonCode:"missed_reasoning",
      reason:"Recent reviewed practice suggests revisiting an explanation before trying a new example.",
      canOverride:true,evidenceOfMastery:false};
  }
  const priorities:Record<StudyStartMode,LearningMediaKind[]> = {
    reading:["text","slides","quiz","flashcards"],
    video:["video","text","slides","quiz"],
    practice:["quiz","flashcards","text","slides"],
    balanced:["text","quiz","slides","video","flashcards"]
  };
  const wish=priorities[input.startMode];
  const primary=select(safe,textual(wish));
  if(primary) return {action:primary.kind==="quiz"||primary.kind==="flashcards"?"practise":"learn",
    mediaId:primary.id,reasonCode:"preference",reason:"This released, accessible format matches your chosen starting route.",
    canOverride:true,evidenceOfMastery:false};
  const fallback=select(safe,textual(["text","slides","quiz","flashcards","video","audio"]));
  if(fallback) return {action:fallback.kind==="quiz"||fallback.kind==="flashcards"?"practise":"learn",
    mediaId:fallback.id,reasonCode:"safe_fallback",reason:"Your preferred starting format is unavailable. This released alternative is ready.",
    canOverride:true,evidenceOfMastery:false};
  return {action:"unavailable",mediaId:null,reasonCode:"not_ready",
    reason:"No approved, accessible and entitled learning item is ready for this objective.",
    canOverride:true,evidenceOfMastery:false};
}

/**
 * Almanac learning packages: core formats are included in the package price.
 * All optional enhancements add measurable scope, not basic learning features.
 * USD list prices. Database RPC independently validates each submitted quote.
 */
export const OFFERS = {
  resource: {
    title: "Focused Study Module",
    baseUsd: 49,
    units: 1,
    turnaround: { standard: 5, priority: 3, express: 2 },
    summary: "One structured module covering a defined part of your course, with explanations, visuals, practice and review.",
    includes: [
      "One structured module guide with clearly defined learning objectives and key concepts",
      "One narrated video overview (approximately 4–6 minutes)",
      "One visual summary: slides, infographic, or mind map",
      "15 practice questions with explanations",
      "15 review flashcards",
      "Workspace access and supported downloads",
    ],
  },
  exam: {
    title: "Exam Preparation Pack",
    baseUsd: 149,
    units: 4,
    turnaround: { standard: 7, priority: 5, express: 3 },
    summary: "Prepare for an exam with targeted review, practice, and performance feedback.",
    includes: [
      "Revision guides covering up to 4 defined course modules",
      "Two narrated video overviews (approximately 4–6 minutes each)",
      "Visual revision summaries and one consolidated slide deck",
      "40 practice questions with explanations",
      "One timed 50-question exam simulation with feedback",
      "40 flashcards and a personalized revision plan",
      "Progress tracking, workspace access, and supported downloads",
    ],
  },
  course: {
    title: "Complete Course",
    baseUsd: 399,
    units: 8,
    turnaround: { standard: 14, priority: 7, express: 3 },
    summary: "A complete learning experience for up to eight clearly defined course modules.",
    includes: [
      "8 structured written module lessons",
      "8 narrated video overviews (one approximately 4–6-minute video per module)",
      "8 slide summaries (approximately 6–10 slides each)",
      "120 practice questions with explanations",
      "120 review flashcards",
      "One comprehensive 80-question exam simulation",
      "Personalized study plan and progress tracking",
      "Workspace access and supported downloads",
    ],
  },
} as const;

export const SPEEDS = {
  standard: { title: "Standard", factor: 1 },
  priority: { title: "Priority", factor: 1.4 },
  express: { title: "Express", factor: 1.9 },
} as const;

export const ENHANCEMENTS = {
  deep_video: {
    title: "Deep-dive video lesson",
    explanation: "One additional 12–15-minute focused instructional video with worked examples and a transcript.",
    unitUsd: 35,
    max: { resource: 1, exam: 2, course: 3 },
  },
  exam_sim: {
    title: "Additional exam simulation",
    explanation: "One new 50-question timed simulation with original questions, explanations, scoring and performance feedback.",
    unitUsd: 39,
    max: { resource: 0, exam: 2, course: 2 },
  },
  unit: {
    title: "Additional complete learning module",
    explanation: "One additional module including its written lesson, video overview, slides, 15 explained practice questions and 15 flashcards.",
    unitUsd: 59,
    max: { resource: 0, exam: 0, course: 4 },
  },
} as const;

export const PREFERENCES = {
  balanced: "Balanced mix (recommended)",
  video: "Begin with video explanations",
  reading: "Begin with written lessons",
  practice: "Begin with practice and review",
} as const;

export type OfferKind = keyof typeof OFFERS;
export type Speed = keyof typeof SPEEDS;
export type Enhancement = keyof typeof ENHANCEMENTS;
export type LearningPreference = keyof typeof PREFERENCES;
export type DeliveryMethod = "both" | "workspace" | "files";
export type EnhancementCounts = Record<Enhancement, number>;
export const EMPTY_ENHANCEMENTS: EnhancementCounts = { deep_video: 0, exam_sim: 0, unit: 0 };

export type LearningRequestInput = {
  kind: OfferKind;
  courseId: string | null;
  subject: string;
  goal: string;
  name: string;
  email: string;
  deliveryMethod: DeliveryMethod;
  speed: Speed;
  enhancements: EnhancementCounts;
  learningPreference: LearningPreference;
  website?: string;
};

export class OfferValidationError extends Error {}
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const allowed = (obj: object, value: unknown): value is string => typeof value === "string" && Object.prototype.hasOwnProperty.call(obj, value);

export function isSpeedAvailable(kind: OfferKind, speed: Speed, extras: EnhancementCounts) {
  // Actual staff production capacity still needs verification before enabling paid checkout.
  // Never remove included videos or other core materials to meet a shorter deadline.
  if (speed === "express" && (extras.unit > 0 || extras.deep_video > 1 || extras.exam_sim > 1)) return false;
  if (speed === "priority" && extras.unit > 2) return false;
  return true;
}

export function parseLearningRequest(value: unknown): LearningRequestInput {
  if (!isObject(value)) throw new OfferValidationError("Please check your request and try again.");
  const { kind, speed, deliveryMethod, enhancements, learningPreference, courseId, subject, goal, name, email, website } = value;
  if (!allowed(OFFERS, kind) || !allowed(SPEEDS, speed) || !["both", "workspace", "files"].includes(String(deliveryMethod))) {
    throw new OfferValidationError("Choose a package, delivery method and timeline.");
  }
  if (!allowed(PREFERENCES, learningPreference) || !isObject(enhancements) ||
    Object.keys(enhancements).some(key => !allowed(ENHANCEMENTS,key))) {
    throw new OfferValidationError("Choose a learning preference and valid enhancements.");
  }
  const extras = { ...EMPTY_ENHANCEMENTS };
  for (const id of Object.keys(ENHANCEMENTS) as Enhancement[]) {
    const count = enhancements[id] ?? 0;
    if (!Number.isInteger(count) || (count as number) < 0 || (count as number) > ENHANCEMENTS[id].max[kind as OfferKind]) {
      throw new OfferValidationError("Adjust the enhancement quantities to the limits shown.");
    }
    extras[id] = count as number;
  }
  if (!isSpeedAvailable(kind as OfferKind, speed as Speed, extras)) {
    throw new OfferValidationError("This combination needs a longer production window. Choose a slower delivery option or reduce your enhancements.");
  }
  const clean = (v: unknown, max: number) => typeof v === "string" ? v.trim().slice(0, max + 1) : "";
  const cleanSubject = clean(subject, 140);
  const cleanGoal = clean(goal, 2000);
  const cleanName = clean(name, 120);
  const cleanEmail = clean(email, 254).toLowerCase();
  if (cleanSubject.length < 3 || cleanSubject.length > 140) throw new OfferValidationError("Enter your subject or course.");
  if (cleanGoal.length < 10 || cleanGoal.length > 2000) throw new OfferValidationError("Briefly tell us what you need to learn.");
  if (cleanName.length < 2 || cleanName.length > 120) throw new OfferValidationError("Enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) throw new OfferValidationError("Enter a valid email address.");
  if (courseId !== null && courseId !== undefined && (typeof courseId !== "string" || courseId.length > 100 || !/^[a-z0-9-]+$/.test(courseId))) {
    throw new OfferValidationError("Choose a valid course.");
  }
  return {
    kind: kind as OfferKind,
    speed: speed as Speed,
    deliveryMethod: deliveryMethod as DeliveryMethod,
    enhancements: extras,
    learningPreference: learningPreference as LearningPreference,
    courseId: typeof courseId === "string" ? courseId : null,
    subject: cleanSubject, goal: cleanGoal, name: cleanName, email: cleanEmail,
    website: typeof website === "string" ? website.slice(0,100) : "",
  };
}

export function calculateQuote(input: Pick<LearningRequestInput, "kind" | "speed" | "enhancements">) {
  const offer = OFFERS[input.kind];
  const baseUsd: number = offer.baseUsd;
  const addonUsd = (Object.keys(ENHANCEMENTS) as Enhancement[]).reduce(
    (sum, id) => sum + ENHANCEMENTS[id].unitUsd * input.enhancements[id], 0
  );
  const subtotalUsd = baseUsd + addonUsd;
  const totalUsd = Math.round(subtotalUsd * SPEEDS[input.speed].factor);
  return {
    baseUsd, addonUsd, subtotalUsd,
    urgencyUsd: totalUsd - subtotalUsd,
    totalUsd,
    units: offer.units + input.enhancements.unit,
    days: offer.turnaround[input.speed],
    speed: input.speed,
  };
}

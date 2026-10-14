/**
 * Almanac made-to-order learning offers.
 * Public pricing configuration. Currency is USD.
 * The SQL request-creation function independently recomputes totals before saving.
 * Keep both in sync; the database value is authoritative.
 */
export const OFFERS = {
  resource: {
    title: "Focused Study Resource",
    baseUsd: 49,
    units: 1,
    turnaround: { standard: 5, priority: 3, express: 2 },
    summary: "A focused learning resource for one topic or learning unit.",
    includes: ["Focused study guide", "Key concepts", "Review questions"],
  },
  exam: {
    title: "Exam Preparation Pack",
    baseUsd: 149,
    units: 4,
    turnaround: { standard: 7, priority: 5, express: 3 },
    summary: "Targeted revision, practice and exam preparation for up to four topics.",
    includes: ["Topic review", "Practice with explanations", "One exam simulation", "Revision plan"],
  },
  course: {
    title: "Complete Course",
    baseUsd: 399,
    units: 8,
    turnaround: { standard: 14, priority: 7, express: 3 },
    summary: "Up to eight structured units with a guided workspace experience.",
    includes: ["Structured lessons", "Practice questions", "Flashcards", "Study plan", "Progress tracking", "One exam simulation"],
  },
} as const;

export const SPEEDS = {
  standard: { title: "Standard", factor: 1 },
  priority: { title: "Priority", factor: 1.4 },
  express: { title: "Express", factor: 1.9 },
} as const;

export const ADDONS = {
  slides: { title: "Slide decks", pricePerUnit: 9 },
  audio: { title: "Audio overviews", pricePerUnit: 12 },
  video: { title: "Video overviews", pricePerUnit: 30 },
  mindmaps: { title: "Mind maps", pricePerUnit: 7 },
  infographics: { title: "Infographics", pricePerUnit: 9 },
  exam_sim: { title: "Additional exam simulation", flatUsd: 39 },
} as const;

export type OfferKind = keyof typeof OFFERS;
export type Speed = keyof typeof SPEEDS;
export type Addon = keyof typeof ADDONS;
export type DeliveryMethod = "both" | "workspace" | "files";
export type LearningRequestInput = {
  kind: OfferKind;
  courseId: string | null;
  subject: string;
  goal: string;
  name: string;
  email: string;
  deliveryMethod: DeliveryMethod;
  speed: Speed;
  addons: Addon[];
  website?: string; // Honeypot field.
};

export class OfferValidationError extends Error {}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const allowed = (obj: object, value: unknown): value is string => typeof value === "string" && Object.prototype.hasOwnProperty.call(obj, value);

export function parseLearningRequest(value: unknown): LearningRequestInput {
  if (!isObject(value)) throw new OfferValidationError("Please check your request and try again.");
  const { kind, speed, deliveryMethod, addons, courseId, subject, goal, name, email, website } = value;
  if (!allowed(OFFERS, kind) || !allowed(SPEEDS, speed) || !["both", "workspace", "files"].includes(String(deliveryMethod))) {
    throw new OfferValidationError("Choose a package, delivery method and timeline.");
  }
  if (!Array.isArray(addons) || addons.length > Object.keys(ADDONS).length || !addons.every(a => allowed(ADDONS, a))) {
    throw new OfferValidationError("Check the selected learning materials.");
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
    addons: [...new Set(addons)] as Addon[],
    courseId: typeof courseId === "string" ? courseId : null,
    subject: cleanSubject,
    goal: cleanGoal,
    name: cleanName,
    email: cleanEmail,
    website: typeof website === "string" ? website.slice(0,100) : "",
  };
}

export function calculateQuote(input: Pick<LearningRequestInput, "kind" | "speed" | "addons">) {
  const offer = OFFERS[input.kind];
  const baseUsd: number = offer.baseUsd;
  const addonUsd = input.addons.reduce((sum, id) => {
    const item = ADDONS[id];
    return sum + ("flatUsd" in item ? item.flatUsd : item.pricePerUnit * offer.units);
  }, 0);
  const subtotalUsd = baseUsd + addonUsd;
  const totalUsd = Math.round(subtotalUsd * SPEEDS[input.speed].factor);
  return {
    baseUsd, addonUsd, subtotalUsd,
    urgencyUsd: totalUsd - subtotalUsd,
    totalUsd,
    units: offer.units,
    days: offer.turnaround[input.speed],
    speed: input.speed,
  };
}

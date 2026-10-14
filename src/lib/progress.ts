import type { Question } from "@/content/types";

export type AnswerMode = "tutor" | "exam" | "check" | "midterm" | "final" | "case";

export type Answer = {
  questionId: string;
  moduleId?: string;
  lessonId?: string;
  selected: string[];
  correct: boolean;
  seconds: number;
  mode: AnswerMode;
  sessionId: string;
  at: string;
};

/** The most recent answer to each question. */
export function latestByQuestion(answers: Answer[]): Map<string, Answer> {
  const out = new Map<string, Answer>();
  for (const a of answers) {
    const prev = out.get(a.questionId);
    if (!prev || prev.at <= a.at) out.set(a.questionId, a);
  }
  return out;
}

const DAY_MS = 86_400_000;

/**
 * Answers that count toward readiness. Exam-mode answers (section tests,
 * midterm and final simulations) always count. A tutor-mode answer counts only
 * if it came at least 24 hours after the student first opened the page that
 * teaches the question, so a check answered straight after reading it doesn't
 * inflate readiness. Starting-check and case answers never count.
 */
export function scoredAnswers(answers: Answer[], opened: Record<string, { at: string }>, lessonOf: (questionId: string) => string | undefined): Answer[] {
  return answers.filter((a) => {
    if (a.mode === "exam" || a.mode === "midterm" || a.mode === "final") return true;
    if (a.mode !== "tutor") return false;
    const times = [lessonOf(a.questionId), a.lessonId]
      .map((id) => (id ? opened[id]?.at : undefined))
      .filter((t): t is string => Boolean(t))
      .map((t) => Date.parse(t));
    // Never opened the page: this was a cold attempt, so it counts.
    if (!times.length) return true;
    return Date.parse(a.at) - Math.min(...times) >= DAY_MS;
  });
}

export type Readiness = {
  answered: number;
  total: number;
  percent: number | null;
  level: "not-started" | "building" | "nearly" | "ready";
};

/**
 * Readiness for a set of questions (a module or lesson): the share of the
 * latest attempts that are correct, and how much of the bank has been seen.
 */
export function readiness(questions: Question[], latest: Map<string, Answer>): Readiness {
  const seen = questions.filter((q) => latest.has(q.id));
  const right = seen.filter((q) => latest.get(q.id)!.correct).length;
  const percent = seen.length ? Math.round((right / seen.length) * 100) : null;
  let level: Readiness["level"] = "not-started";
  if (seen.length >= 3 && percent !== null) {
    const coverage = seen.length / Math.max(1, questions.length);
    level = percent >= 80 && coverage >= 0.6 ? "ready" : percent >= 60 ? "nearly" : "building";
  } else if (seen.length > 0) {
    level = "building";
  }
  return { answered: seen.length, total: questions.length, percent, level };
}

export const readinessLabel: Record<Readiness["level"], string> = {
  "not-started": "Not started",
  building: "Building",
  nearly: "Nearly there",
  ready: "Ready",
};

export const readinessTone: Record<Readiness["level"], { bar: string; chip: string }> = {
  "not-started": { bar: "bg-[#D9D4EA]", chip: "bg-mist text-ink-muted" },
  building: { bar: "bg-tangerine", chip: "bg-peach text-peach-ink" },
  nearly: { bar: "bg-sky-strong", chip: "bg-sky text-sky-ink" },
  ready: { bar: "bg-correct", chip: "bg-mint text-mint-ink" },
};

export function topicStats(questions: Question[], latest: Map<string, Answer>) {
  const byTopic = new Map<string, { right: number; seen: number }>();
  for (const q of questions) {
    const a = latest.get(q.id);
    if (!a) continue;
    const s = byTopic.get(q.topic) ?? { right: 0, seen: 0 };
    s.seen += 1;
    if (a.correct) s.right += 1;
    byTopic.set(q.topic, s);
  }
  return [...byTopic.entries()]
    .map(([topic, s]) => ({ topic, seen: s.seen, percent: Math.round((s.right / s.seen) * 100) }))
    .sort((a, b) => a.percent - b.percent || b.seen - a.seen);
}

export function isCorrect(q: Question, selected: string[]) {
  return selected.length === q.correct.length && q.correct.every((c) => selected.includes(c));
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Course } from "@/content/types";
import { selectStudyRoute, type StudyStartMode } from "@/lib/study-route";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

const CHOICES: readonly { value: StudyStartMode; title: string }[] = [
  { value: "balanced", title: "Continue" },
  { value: "reading", title: "Read first" },
  { value: "video", title: "Watch first" },
  { value: "practice", title: "Practise first" },
];

const isMode = (v: unknown): v is StudyStartMode =>
  v === "balanced" || v === "reading" || v === "video" || v === "practice";

type DeviceChoice = { mode: StudyStartMode; lowBandwidth: boolean };

/**
 * An optional, reversible, device-scoped study preference. It never changes
 * purchase/entitlement, reviewed assessment keys, grades, FSRS or price.
 */
export function StudyRouteChooser({ course }: { course: Course }) {
  const { profile, state } = useStudent();
  const { lessons, questions, latest } = useCourse(course.id);
  const [mode, setMode] = useState<StudyStartMode>("balanced");
  const [lowBandwidth, setLowBandwidth] = useState(false);

  const key = profile?.id ? `almanac:route:v1:${profile.id}:${course.id}` : null;

  useEffect(() => {
    let saved: DeviceChoice | null = null;
    if (key) {
      try { saved = JSON.parse(window.localStorage.getItem(key) ?? "null") as DeviceChoice | null; }
      catch { saved = null; }
    }
    setMode(isMode(saved?.mode) ? saved.mode : "balanced");
    setLowBandwidth(saved?.lowBandwidth === true);
  }, [key]);

  function choose(next: DeviceChoice) {
    setMode(next.mode);
    setLowBandwidth(next.lowBandwidth);
    if (key) {
      try { window.localStorage.setItem(key, JSON.stringify(next)); }
      catch { /* Preference works in memory if local storage is restricted. */ }
    }
  }

  const options = useMemo(
    () => lessons.map((l) => ({
      id: l.id,
      mode: l.blocks.some((b) => b.t === "video") ? "video" as const : "reading" as const,
      completed: Boolean(state.lessons[l.id]),
    })),
    [lessons, state.lessons],
  );
  const videoReady = options.some((o) => o.mode === "video");
  const readingReady = options.some((o) => o.mode === "reading");
  const practiceReady = questions.length > 0;
  const missed = [...latest.values()].filter((a) => a.correct === false).length;
  const route = selectStudyRoute(options, mode, questions.length, lowBandwidth);
  const href = route?.kind === "lesson"
    ? `/app/learn/${route.lessonId}`
    : `/app/practice?course=${encodeURIComponent(course.id)}`;

  const label = route?.kind === "practice"
    ? "Open reviewed practice"
    : route?.kind === "lesson"
      ? "Open next lesson"
      : "Browse your course";

  return (
    <section className="rounded-[20px] border border-[#E4DFF5] bg-white px-4 py-4 sm:px-5" aria-label={`Customize study route for ${course.title}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[17px] font-bold text-ink">Your session, your starting point</h2>
        <span className="text-[11px] text-ink-muted">Free within your course access</span>
      </div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-body">
        Choose what to do first. You can change this whenever you like; your progress and study plan stay intact.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Study starting route">
        {CHOICES.map((choice) => {
          const unavailable = (choice.value === "video" && (!videoReady || lowBandwidth)) ||
            (choice.value === "reading" && !readingReady) ||
            (choice.value === "practice" && !practiceReady);
          return (
            <button
              key={choice.value}
              type="button"
              disabled={unavailable}
              aria-pressed={mode === choice.value}
              onClick={() => choose({ mode: choice.value, lowBandwidth })}
              className={`min-h-10 rounded-full border px-3 py-2 text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                mode === choice.value ? "border-violet bg-lilac text-violet-deep" : "border-hairline text-ink-body hover:border-violet"
              }`}
            >
              {choice.title}
            </button>
          );
        })}
      </div>
      <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12px] text-ink-body">
        <input
          type="checkbox"
          className="h-4 w-4 accent-violet"
          checked={lowBandwidth}
          onChange={(e) => choose({ mode, lowBandwidth: e.target.checked })}
        />
        Prefer lower-data lessons (avoid starting with video)
      </label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[13px] bg-[#F6F4FB] p-3">
        <p className="max-w-lg text-[12px] leading-relaxed text-ink-body" aria-live="polite">
          {route
            ? route.reason === "safe_alternative"
              ? "That starting format isn't available. Here is an accessible alternative from your course."
              : "We’ll start with something currently available in your course. This is your preference, not a learning-style diagnosis."
            : "There isn't an approved activity ready for this choice yet. You can still browse your course outline."}
        </p>
        <Link
          href={route ? href : `/app/courses/${encodeURIComponent(course.id)}`}
          className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-violet px-4 py-2 text-[12px] font-bold text-white hover:bg-[#4A2DE6]"
        >
          {label} →
        </Link>
      </div>
      {missed > 0 && (
        <Link
          href={`/app/practice?course=${encodeURIComponent(course.id)}&pool=missed`}
          className="mt-3 inline-flex min-h-9 items-center text-[12px] font-bold text-violet-700 hover:underline"
        >
          Review missed questions ({missed}) →
        </Link>
      )}
      <p className="mt-2 text-[11px] text-ink-muted">
        Starting preference saved only on this device. Approved content and assessment standards do not change.
      </p>
    </section>
  );
}

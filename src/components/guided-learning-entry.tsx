"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { openCourses } from "@/content/course";
import { suggestGuidedStep, type LearnerIntent, type SessionMinutes } from "@/lib/learning-guide";
import { useCourse } from "@/lib/use-course";
import { useStudent } from "@/lib/store";

const INTENTS: readonly { id: LearnerIntent; title: string; description: string }[] = [
  { id: "unsure", title: "Help me get started", description: "I need a sensible next step." },
  { id: "understand", title: "Understand a topic", description: "I want an explanation I can follow." },
  { id: "prepare", title: "Prepare for an assessment", description: "I want to find what I still need to practise." },
  { id: "review", title: "Review what I missed", description: "I want to revisit questions and explanations." },
];

const sessionOptions: readonly SessionMinutes[] = [5, 15, 30];
const isSessionMinutes = (v: unknown): v is SessionMinutes => v === 5 || v === 15 || v === 30;

export function GuidedLearningEntry() {
  const { authorizedCourses, status } = useStudent();
  const availableCourses = useMemo(
    () => openCourses.filter((course) => authorizedCourses.includes(course.id)),
    [authorizedCourses],
  );
  const [courseId, setCourseId] = useState("");
  const [intent, setIntent] = useState<LearnerIntent>("unsure");
  const [minutes, setMinutes] = useState<SessionMinutes>(15);
  const [lowData, setLowData] = useState(false);

  useEffect(() => {
    if (!availableCourses.some((course) => course.id === courseId)) {
      setCourseId(availableCourses[0]?.id ?? "");
    }
  }, [availableCourses, courseId]);

  // useCourse applies the signed-in learner's entitlement and reviewer
  // visibility rules. Never feed the guide raw, unreviewed source content.
  const { lessons, questions, latest } = useCourse(courseId);
  const safeLessons = useMemo(
    () => lessons.map((lesson) => ({
      id: lesson.id,
      medium: lesson.blocks.some((block) => block.t === "video") ? "video" as const : "reading" as const,
      completed: false,
    })),
    [lessons],
  );
  const missedCount = questions.filter((question) => latest.get(question.id)?.correct === false).length;
  const guidance = suggestGuidedStep({
    courseId, intent,
    minutes: isSessionMinutes(minutes) ? minutes : 15,
    lowData,
    lessons: safeLessons,
    approvedQuestionCount: questions.length,
    missedQuestionCount: missedCount,
  });

  if (status === "loading") return (
    <div className="mx-auto max-w-[930px] rounded-[22px] border border-hairline bg-white p-6" role="status">
      <h1 className="font-display text-2xl font-bold">Finding your next learning step</h1>
      <p className="mt-3 text-sm text-ink-body">Checking which course materials are available to you.</p>
    </div>
  );
  if (status === "signed-out" || availableCourses.length === 0) return (
    <div className="mx-auto max-w-[930px] rounded-[22px] border border-hairline bg-white p-6 sm:p-9">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-violet-700">Almanac · guided study</p>
      <h1 className="mt-3 font-display text-[33px] font-bold">A clearer way to begin.</h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-ink-body">
        Your next action should come from learning materials you are actually entitled to use. There isn&apos;t a ready guided course in this session yet.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-ink-body">
        If you already have access, sign in using your existing code. Previously purchased custom orders remain in your learning orders.
        New learning-package checkout is currently paused.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/app/orders" className="inline-flex min-h-11 items-center rounded-full bg-violet px-5 text-sm font-bold text-white">
          Your learning orders →
        </Link>
        <Link href="/courses" className="inline-flex min-h-11 items-center rounded-full border border-hairline px-5 text-sm font-bold text-violet-700">
          Explore course topics
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[930px] space-y-5 pb-16">
      <header className="rounded-[22px] bg-[#F3EFFD] p-6 sm:p-9">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-violet-700">Almanac · guided study</p>
        <h1 className="mt-3 max-w-[730px] font-display text-[33px] font-bold leading-tight tracking-[-.035em] sm:text-[42px]">
          What would you like to make progress on today?
        </h1>
        <p className="mt-3 max-w-[680px] text-[14.5px] leading-7 text-ink-body">
          Tell Almanac what you need. We&apos;ll suggest a next step from your available learning materials, explain why, and help you keep moving. You can always choose another route.
        </p>
      </header>

      <section className="rounded-[20px] border border-hairline bg-white p-5 sm:p-7" aria-labelledby="almanac-guide-intent">
        <h2 id="almanac-guide-intent" className="font-display text-[21px] font-bold">First, your goal.</h2>
        <p className="mt-1 text-[13px] text-ink-body">No need to configure a full study plan before beginning.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2" role="group" aria-label="Choose why you are studying">
          {INTENTS.map((choice) => (
            <button key={choice.id} type="button" aria-pressed={intent === choice.id}
              onClick={() => setIntent(choice.id)}
              className={`min-h-[90px] rounded-[15px] border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet ${
                intent === choice.id ? "border-[#5B3DF5] bg-[#F2EEFF]" : "border-hairline hover:border-[#B5A7ED]"
              }`}>
              <span className="block text-[14px] font-bold text-ink">{choice.title}</span>
              <span className="mt-1 block text-[12px] leading-5 text-ink-body">{choice.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-hairline bg-white p-5 sm:p-7" aria-labelledby="almanac-guide-context">
        <h2 id="almanac-guide-context" className="font-display text-[21px] font-bold">Let&apos;s make it fit your day.</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="block text-[13px] font-semibold">
            Which course?
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-[13px] border border-hairline bg-white px-3 text-[13px] text-ink">
              {availableCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-[13px] font-semibold">Time you want to set aside</legend>
            <div className="mt-2 flex gap-2">
              {sessionOptions.map((value) => (
                <button key={value} type="button" aria-pressed={minutes === value} onClick={() => setMinutes(value)}
                  className={`min-h-12 flex-1 rounded-[13px] border px-3 text-[13px] font-bold ${
                    minutes === value ? "border-violet bg-lilac text-violet-deep" : "border-hairline text-ink-body"
                  }`}>
                  {value} min
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink-muted">A session target, not a promise that every lesson finishes within this time.</p>
          </fieldset>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-[12px] bg-[#F6F4FB] p-3 text-[12.5px] text-ink-body">
          <input type="checkbox" checked={lowData} onChange={(e) => setLowData(e.target.checked)} className="h-4 w-4 accent-violet" />
          Keep data usage low: prefer reading and avoid starting with video.
        </label>
      </section>

      <section className="rounded-[20px] border border-[#C8BEF4] bg-[#2A1B78] p-6 text-white sm:p-8" aria-labelledby="almanac-guide-next">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#C9BEF7]">Your next step</p>
        <h2 id="almanac-guide-next" className="mt-2 font-display text-[26px] font-bold">
          {guidance.state === "ready" ? "Here's where I'd start." : "This course isn't ready for a guided session yet."}
        </h2>
        <div aria-live="polite" aria-atomic="true" className="mt-4">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#C9BEF7]">Why this step?</h3>
          <p className="mt-1 text-[14px] leading-7 text-white/90">{guidance.why}</p>
          <h3 className="mt-4 text-[12px] font-bold uppercase tracking-wider text-[#C9BEF7]">What happens afterwards?</h3>
          <p className="mt-1 text-[14px] leading-7 text-white/90">{guidance.after}</p>
        </div>
        <Link href={guidance.href}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-[13px] font-bold text-[#2A1B78] hover:bg-[#F1EEFF]">
          {guidance.action} →
        </Link>
        <p className="mt-4 text-[11px] leading-5 text-white/70">
          You are in control. This is a suggestion based on available, approved material—not an assessment of your intelligence, learning style or mastery.
        </p>
      </section>

      <div className="rounded-[16px] border border-hairline bg-white p-5">
        <h2 className="text-[14px] font-bold text-ink">The learning rhythm</h2>
        <p className="mt-2 text-[12.5px] leading-6 text-ink-body">
          Understand an idea → retrieve it from memory → try applying it → read feedback → return later if needed.
          Your actual practice results and reviewed materials, not time spent watching, determine what needs revisiting.
        </p>
      </div>
    </div>
  );
}

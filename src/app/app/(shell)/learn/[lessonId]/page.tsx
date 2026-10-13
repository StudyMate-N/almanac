"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ReportButton, TutorButton } from "@/components/tutor";
import { VideoPlayer } from "@/components/video-player";
import { caseForLesson, courseById, lessonById, lessonsInModule, moduleById } from "@/content/course";
import { REVIEWER } from "@/lib/config";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

const toSec = (t: string) => t.split(":").reduce((a, b) => a * 60 + Number(b), 0);

function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const t = useSearchParams().get("t");
  const { state, update } = useStudent();
  const { lessonOpen, questions, isApproved, cases } = useCourse();
  const video = useRef<HTMLVideoElement>(null);
  const lesson = lessonById(lessonId);

  useEffect(() => {
    const v = video.current;
    if (v && t) {
      const seek = () => (v.currentTime = Number(t));
      if (v.readyState >= 1) seek();
      else v.addEventListener("loadedmetadata", seek, { once: true });
    }
  }, [t]);

  if (!lesson || !lessonOpen(lesson.id))
    return (
      <p className="rounded-tile bg-white p-6 text-ink-body">
        This lesson opens once it&apos;s approved. <Link href="/app/courses" className="font-bold text-violet-600">Back to the course</Link>
      </p>
    );

  const mod = moduleById(lesson.moduleId)!;
  const siblings = lessonsInModule(lesson.moduleId);
  const next = siblings.find((l) => l.index === lesson.index + 1);
  const qs = questions.filter((q) => q.lessonId === lesson.id);
  const kase = caseForLesson(lesson.id);
  const caseOpen = kase && cases.some((c) => c.id === kase.id);
  const done = Boolean(state.lessons[lesson.id]);
  const markDone = () => !state.lessons[lesson.id] && update("lessons", { ...state.lessons, [lesson.id]: { at: new Date().toISOString() } });
  const seek = (at: string) => {
    if (video.current) {
      video.current.currentTime = toSec(at);
      void video.current.play();
    }
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-3 text-sm font-semibold text-ink-muted">
        <Link href={`/app/courses/${mod.courseId}`} className="hover:text-ink">
          {courseById(mod.courseId)?.title}
        </Link>{" "}
        / {mod.title}
        / Lesson {lesson.index}
      </nav>
      <h1 className="font-display text-[28px] leading-tight font-semibold sm:text-[32px]">{lesson.title}</h1>
      <div className="mt-2.5 mb-5 flex flex-wrap gap-2 text-[13px] font-semibold">
        {lesson.duration && <span className="rounded-full bg-white px-3 py-1 text-ink-muted">{lesson.duration}</span>}
        <span className={`rounded-full px-3 py-1 ${isApproved(lesson.id, lesson) ? "bg-mint text-mint-ink" : "bg-peach text-peach-ink"}`}>
          {isApproved(lesson.id, lesson) ? `Approved by ${REVIEWER.name}` : "Awaiting nurse review (preview)"}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <VideoPlayer ref={video} video={lesson.video} title={lesson.title} label="Lesson video" onEnded={markDone} onProgress={(f) => f > 0.9 && markDone()} />
          <p className="text-[15px] text-ink-body">
            <span className="font-bold text-ink">Objective:</span> {lesson.objective}
          </p>

          {lesson.corrections && lesson.corrections.length > 0 && (
            <section aria-labelledby="corr" className="rounded-tile bg-peach p-5">
              <h2 id="corr" className="font-display text-[19px] font-semibold">
                Corrections to the video
              </h2>
              <p className="mb-3 text-sm text-[#5C3218]">Our reviewers checked the lecture against current sources. Where it says something inaccurate, here is the correct version.</p>
              <ul className="flex flex-col gap-3">
                {lesson.corrections.map((c) => (
                  <li key={c.at} className="rounded-2xl bg-white p-3.5 text-[15px]">
                    <button onClick={() => seek(c.at)} className="mb-1 rounded-full bg-peach px-2.5 py-0.5 text-xs font-bold text-peach-ink">
                      At {c.at}
                    </button>
                    <p className="text-ink-muted line-through decoration-1">{c.said}</p>
                    <p className="mt-1">{c.correct}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.summary && (
            <section aria-labelledby="sum" className="rounded-tile bg-surface p-6">
              <h2 id="sum" className="mb-3 font-display text-[21px] font-semibold">
                The mechanism on one page
              </h2>
              <ol className="grid gap-3 sm:grid-cols-2">
                {lesson.summary.map((s, i) => (
                  <li key={s.title} className={`rounded-card p-4 ${["bg-lilac", "bg-peach", "bg-mint", "bg-sky"][i % 4]}`}>
                    <p className="font-bold">
                      {i + 1}. {s.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-body">{s.body}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {(lesson.priorities?.length || lesson.traps?.length) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {lesson.priorities && (
                <section className="rounded-tile bg-white p-5">
                  <h2 className="mb-2 font-display text-lg font-semibold">Nursing priorities</h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-body">
                    {lesson.priorities.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              )}
              {lesson.traps && (
                <section className="rounded-tile bg-white p-5">
                  <h2 className="mb-2 font-display text-lg font-semibold">Common traps</h2>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-body">
                    {lesson.traps.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            {lesson.source && <span>Source: {lesson.source}</span>}
            <ReportButton itemId={lesson.id} itemType="lesson" />
          </div>
        </div>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
          {qs.length > 0 && (
            <section className="flex flex-col gap-2.5 rounded-tile bg-peach p-[22px]">
              <p className="text-[13px] font-bold text-peach-ink">Up next</p>
              <h2 className="font-display text-[21px] font-semibold">Answer {qs.length} questions</h2>
              <p className="text-sm text-[#5C3218]">Each option has a rationale, right or wrong.</p>
              <Link href={`/app/practice/${lesson.id}`} onClick={markDone} className="mt-1 inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-tangerine px-[22px] font-bold text-ink">
                Start questions <ArrowRightIcon size={16} />
              </Link>
            </section>
          )}
          {caseOpen && kase && (
            <Link href={`/app/case/${kase.id}`} className="rounded-tile bg-sky p-5 text-sky-ink">
              <p className="text-xs font-bold">NGN case study</p>
              <p className="font-display text-lg font-semibold">{kase.title}</p>
            </Link>
          )}
          <section className="flex flex-col gap-2 rounded-tile bg-white p-5">
            <h2 className="font-display text-lg font-semibold">Questions about this lesson?</h2>
            <TutorButton lessonId={lesson.id} />
            {!done && (
              <button onClick={markDone} className="self-start text-sm font-bold text-violet-600 underline">
                Mark as watched
              </button>
            )}
          </section>
          {next && (
            <Link href={`/app/learn/${next.id}`} className="rounded-tile bg-lilac p-5 font-bold text-violet-700">
              Next: {next.shortTitle ?? next.title} →
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}

export default function LessonPage() {
  return (
    <Suspense>
      <Lesson />
    </Suspense>
  );
}

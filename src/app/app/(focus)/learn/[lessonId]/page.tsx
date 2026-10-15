"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoMark } from "@/components/brand";
import { ArrowRightIcon, XIcon } from "@/components/icons";
import { BlockView } from "@/components/player/blocks";
import { CheckGroup } from "@/components/player/topic-check";
import { kindLabel, Outline, Ring } from "@/components/player/outline";
import { VideoLedTopic, videoLedBlocks } from "@/components/player/video-led";
import { ReportButton, TutorButton } from "@/components/tutor";
import { courseById, lessonById, lessons, modulesInCourse, moduleById, questionById } from "@/content/course";
import type { Card, Lesson, Question } from "@/content/types";
import { REVIEWER } from "@/lib/config";
import { minutesFor } from "@/lib/minutes";
import { useStudent } from "@/lib/store";

const SELF_COMPLETING = new Set(["reading", "activity", "summary", "video", "topic"]);

export default function Player() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state, answers, update, isVisible, isApproved, preview, authorizedCourses } = useStudent();
  const [drawer, setDrawer] = useState(false);
  const page = lessonById(lessonId);
  const mod = page ? moduleById(page.moduleId) : undefined;
  const course = mod ? courseById(mod.courseId) : undefined;
  const coursePages = useMemo(() => (mod ? lessons.filter((l) => moduleById(l.moduleId)?.courseId === mod.courseId) : []), [mod]);
  const entitled = Boolean(course && authorizedCourses.includes(course.id));
  const isOpen = (p: Lesson) => entitled && isVisible(p.id, p);
  const isDone = (id: string) => Boolean(state.lessons[id]);
  const visibleQ = (q: Question) => isVisible(q.id, q);
  const visibleCards = (c: Card) => isVisible(c.id, c);
  const open = page ? isOpen(page) : false;

  const markDone = () => {
    if (page && entitled && !state.lessons[page.id]) update("lessons", { ...state.lessons, [page.id]: { at: new Date().toISOString() } });
  };

  // A page with learning checks is done only when every visible check has been answered.
  // Checks still awaiting review aren't rendered, so they can't hold the page back.
  const checkIds = page
    ? page.blocks.flatMap((b) => {
        const q = b.t === "check" ? questionById(b.id) : undefined;
        return q && visibleQ(q) ? [q.id] : [];
      })
    : [];
  const checksLeft = checkIds.filter((id) => !answers.some((a) => a.questionId === id)).length;
  const checksAnswered = checksLeft === 0;
  // Course standard: a page with checks is done when they're answered; one without checks
  // is done when the student reaches its end (the Previous/Next row scrolls into view).
  const [reachedEnd, setReachedEnd] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const canSelfComplete = Boolean(page && SELF_COMPLETING.has(page.kind) && checksAnswered && (checkIds.length > 0 || reachedEnd));

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setDrawer(false);
  }, [page?.id]);

  useEffect(() => {
    setReachedEnd(false);
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setReachedEnd(true));
    io.observe(el);
    return () => io.disconnect();
  }, [page?.id, open]);

  useEffect(() => {
    if (page && open && canSelfComplete && !state.lessons[page.id]) markDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page?.id, open, canSelfComplete]);

  if (!page || !mod || !course)
    return (
      <main className="mx-auto max-w-xl p-6">
        <p className="rounded-tile bg-white p-6">
          That page doesn&apos;t exist. <Link href="/app/courses" className="font-bold text-violet-600">Back to your courses</Link>
        </p>
      </main>
    );

  if (!entitled) return <main className="mx-auto max-w-xl px-4 py-12">
    <div className="alm-desk-card p-6">
      <p className="alm-desk-eyebrow">Approved course access</p>
      <h1 className="mt-3 text-[25px] font-bold">This course is not in your enrollment yet.</h1>
      <p className="mt-3 text-[14px] text-ink-body">Lessons and practice are available only with an approved paid enrollment.</p>
      <Link href="/app/courses" className="alm-desk-btn mt-5">See your courses →</Link>
    </div>
  </main>;

  const idx = coursePages.findIndex((p) => p.id === page.id);
  const prev = coursePages.slice(0, idx).reverse().find(isOpen);
  const next = coursePages.slice(idx + 1).find(isOpen);
  const done = coursePages.filter((p) => isDone(p.id)).length;
  const approved = isApproved(page.id, page);
  // A topic page with a question-stop clip is video-led; without one (or without media) it reads.
  const videoClips = videoLedBlocks(page);
  // Topic pages are titled "5.3 Obstructive disease": the number goes in the breadcrumb.
  const topicNum = page.kind === "topic" ? page.title.match(/^\d+\.\d+(?=\s)/)?.[0] : undefined;
  const sectionLabel = mod.kind === "section" ? `Section ${mod.number}` : mod.kind === "start" ? "Start here" : "Final review";
  const modules = modulesInCourse(course.id);

  const outline = <Outline modules={modules} currentId={page.id} isDone={isDone} isOpen={isOpen} onNavigate={() => setDrawer(false)} />;

  return (
    <div className="alm-focus min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <Link href={`/app/courses/${course.id}`} aria-label="Close the course player" className="grid h-10 w-10 flex-none place-items-center rounded-full border border-hairline bg-white hover:bg-mist">
            <XIcon size={18} />
          </Link>
          <span className="hidden sm:block">
            <LogoMark size={28} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-violet-600">{course.title}</p>
            <p className="truncate font-display text-[16px] leading-tight font-semibold">
              {mod.kind === "section" ? `${sectionLabel}: ${mod.title}` : mod.title}
            </p>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-hairline bg-[#F7F6FB] py-1 pr-3.5 pl-1.5 text-[12px] font-bold text-ink-muted md:inline-flex">
            <Ring done={done} total={coursePages.length} size={26} />
            {done} of {coursePages.length} pages
          </span>
          <button onClick={() => setDrawer(true)} className="min-h-11 rounded-full bg-violet px-4 text-sm font-bold text-white lg:hidden" aria-haspopup="dialog">
            Outline
          </button>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Course outline">
          <button className="absolute inset-0 bg-ink/40" aria-label="Close the outline" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(360px,88vw)] flex-col bg-ground shadow-xl">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="font-display text-lg font-semibold">Course outline</p>
              <button onClick={() => setDrawer(false)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full bg-white">
                <XIcon size={16} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">{outline}</div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] gap-5 px-4 pb-16 pt-5 sm:px-6 lg:grid-cols-[268px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)_252px] xl:gap-7">
        <aside className="sticky top-[80px] hidden h-[calc(100dvh-96px)] overflow-y-auto pr-1 lg:block">
         <p className="alm-desk-eyebrow mb-3">Course outline</p>{outline}
       </aside>

        <main className="min-w-0">
          <article className="alm-lesson-content mx-auto max-w-[760px]">
            <nav aria-label="Breadcrumb" className="mb-2 text-[13px] font-semibold text-ink-muted">
              {mod.kind !== "section" ? sectionLabel : topicNum ? `${sectionLabel} · Topic ${topicNum}` : page.groupTitle === page.title ? `${sectionLabel} · ${mod.title}` : `${sectionLabel} · ${page.groupTitle}`}
            </nav>
            <h1 className="font-display text-[clamp(28px,3vw,34px)] leading-[1.12] font-bold">{topicNum ? page.title.slice(topicNum.length).trim() : page.title}</h1>
            <div className="mb-6 mt-3 flex flex-wrap gap-2 text-[12px] font-bold">
              <span className="rounded-full bg-white px-3 py-1 text-violet-700">{videoClips ? "Video topic" : kindLabel[page.kind]}</span>
              <span className="rounded-full bg-white px-3 py-1 text-ink-muted">About {minutesFor(page)} min</span>
              {isDone(page.id) ? (
                <span role="status" className="rounded-full bg-mint px-3 py-1 text-mint-ink">✓ Marked done</span>
              ) : (
                open &&
                checksLeft > 0 && (
                  <span className="rounded-full bg-white px-3 py-1 text-ink-muted">
                    {checksLeft} check{checksLeft === 1 ? "" : "s"} left
                  </span>
                )
              )}
              {preview && <span className={`rounded-full px-3 py-1 ${approved ? "bg-mint text-mint-ink" : "bg-peach text-peach-ink"}`}>{approved ? `Approved by ${REVIEWER.name}` : "Awaiting nurse review (preview)"}</span>}
            </div>

            {!open ? (
              <div className="rounded-tile bg-white p-6 text-ink-body">
                <p className="font-display text-xl font-semibold text-ink">This page opens once it&apos;s approved</p>
                <p className="mt-1">
                  Every page is checked by {REVIEWER.name}, {REVIEWER.credentials}, before students see it.
                </p>
              </div>
            ) : (
              videoClips ? (
                <VideoLedTopic page={page} videos={videoClips} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} />
              ) : (
              <div className="flex flex-col gap-6">
                {page.blocks.map((b, i) => {
                  const prev = page.blocks[i - 1];
                  if (b.t === "eq" && page.blocks[i + 1]?.t === "keypoints") return null;
                  // Consecutive learning checks render as one "Learning check n of N" group.
                  if (b.t === "check") {
                    if (prev?.t === "check") return null;
                    const run: Question[] = [];
                    for (let j = i; page.blocks[j]?.t === "check"; j++) {
                      const q = questionById((page.blocks[j] as { id: string }).id);
                      if (q && visibleQ(q)) run.push(q);
                    }
                    return <CheckGroup key={i} qs={run} pageId={page.id} onDone={() => document.querySelector('[aria-label="Submit and compare"]')?.scrollIntoView({ behavior: "smooth", block: "start" })} />;
                  }
                  const eq = b.t === "keypoints" && prev?.t === "eq" ? prev.text : undefined;
                  return <BlockView key={i} b={b} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} eq={eq} />;
                })}
              </div>
              )
            )}

            {open && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline pt-5 text-[13px] text-ink-muted xl:hidden">
                <TutorButton lessonId={page.id} label="Ask the tutor about this page" />
                <ReportButton itemId={page.id} itemType="page" />
                {page.source && <span className="basis-full pt-1 text-[13px]">Source: {page.source}</span>}
              </div>
            )}

            <div ref={endRef} className="mt-6 flex flex-wrap items-stretch justify-between gap-3 border-t border-hairline pt-5">
              {prev ? (
                <Link href={`/app/learn/${prev.id}`} className="flex min-h-[51px] min-w-[175px] flex-col justify-center rounded-xl border border-hairline bg-white px-4 py-2 hover:bg-mist">
                  <span className="text-[12px] font-bold text-ink-muted">Previous</span>
                  <span className="font-display text-[17px] leading-snug font-semibold">{prev.shortTitle ?? prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/app/learn/${next.id}`} onClick={() => SELF_COMPLETING.has(page.kind) && checksAnswered && markDone()} className="flex min-h-[51px] min-w-[175px] items-center gap-3 rounded-xl bg-violet px-4 py-2 text-white hover:bg-violet-600">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-extrabold">Next</span>
                    <span className="block font-display text-[17px] leading-snug font-semibold">{next.shortTitle ?? next.title}</span>
                  </span>
                  <ArrowRightIcon size={20} />
                </Link>
              )}
            </div>
          </article>
        </main>
        <aside className="sticky top-[80px] hidden h-[calc(100dvh-100px)] space-y-4 overflow-y-auto xl:block">
          <section className="alm-desk-card p-4">
            <p className="alm-desk-eyebrow">Your page</p>
            <h2 className="mt-2 text-[16px] font-bold">{videoClips?"Video lesson":"Lesson notes"}</h2>
            <p className="mt-2 text-[12px] text-ink-body">About {minutesFor(page)} min · {sectionLabel}</p>
            <p className="mt-3 text-[12px] text-ink-muted">{isDone(page.id)?"This page is marked complete.":"Continue reading and complete the available learning checks."}</p>
          </section>
          {page.source&&<section className="alm-desk-card p-4"><p className="alm-desk-eyebrow">Source</p><p className="mt-2 text-[12px] text-ink-body">{page.source}</p></section>}
          <section className="alm-desk-card space-y-3 p-4">
            <p className="alm-desk-eyebrow">Need a hand?</p>
            <TutorButton lessonId={page.id} label="Ask the tutor about this page"/>
            <ReportButton itemId={page.id} itemType="page"/>
          </section>
        </aside>
      </div>
    </div>
  );
}

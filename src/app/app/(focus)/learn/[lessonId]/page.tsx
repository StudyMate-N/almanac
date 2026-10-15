"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoMark } from "@/components/brand";
import { ArrowRightIcon, XIcon } from "@/components/icons";
import { BlockView, VideoReviewNotes } from "@/components/player/blocks";
import { CheckGroup } from "@/components/player/topic-check";
import { FocusProgress } from "@/components/focus-bar";
import { kindLabel, Outline } from "@/components/player/outline";
import { VideoLedTopic, videoLedBlocks } from "@/components/player/video-led";
import { ReportButton, TutorButton } from "@/components/tutor";
import { courseById, lessonById, lessons, modulesInCourse, moduleById, questionById } from "@/content/course";
import type { Card, Lesson, Question } from "@/content/types";
import { minutesFor } from "@/lib/minutes";
import { useStudent } from "@/lib/store";

const SELF_COMPLETING = new Set(["reading", "activity", "summary", "video", "topic"]);

export default function Player() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state, answers, update, isVisible, isApproved, preview, authorizedCourses } = useStudent();
  const [drawer, setDrawer] = useState(false);
  const [videoFocus, setVideoFocus] = useState(false);
  const scrollToVideo = () => {
    const target = document.querySelector<HTMLElement>("[data-patho-video-anchor]");
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
  };
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
    setVideoFocus(false);
  }, [page?.id]);

  useEffect(() => {
    if (!videoFocus || !open) return;
    const frame = requestAnimationFrame(() => scrollToVideo());
    return () => cancelAnimationFrame(frame);
    // Scroll only when switching into focus, not on playback or progress changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoFocus, page?.id, open]);

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
  const clipIds = page.blocks.filter((b) => b.t === "video").map((b) => b.t === "video" ? b.clip : "");
  const containsVideo = clipIds.length > 0;
  // Topic pages are titled "5.3 Obstructive disease": the number goes in the breadcrumb.
  const topicNum = page.kind === "topic" ? page.title.match(/^\d+\.\d+(?=\s)/)?.[0] : undefined;
  const sectionLabel = mod.kind === "section" ? `Section ${mod.number}` : mod.kind === "start" ? "Start here" : "Final review";
  const modules = modulesInCourse(course.id);

  const outline = <Outline modules={modules} currentId={page.id} isDone={isDone} isOpen={isOpen} onNavigate={() => setDrawer(false)} />;

  return (
    <div className="alm-focus min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/95 backdrop-blur" style={{ viewTransitionName: "player-header" }}>
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:h-[60px] sm:px-6">
          <Link href={`/app/courses/${course.id}`} aria-label="Close the course player" className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline bg-white hover:bg-mist sm:h-10 sm:w-10">
            <XIcon size={18} />
          </Link>
          <span className="hidden sm:block">
            <LogoMark size={28} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:hidden">
            <p className="truncate text-[13px] font-bold">{topicNum ? `Topic ${topicNum}` : sectionLabel} · {done} of {coursePages.length}</p>
            <div className="h-[5px] overflow-hidden rounded-full bg-[#EFEDF5]" aria-hidden="true"><div className="h-full bg-violet" style={{ width: `${coursePages.length ? Math.round((done / coursePages.length) * 100) : 0}%` }} /></div>
          </div>
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-[11.5px] font-bold text-violet-700">{course.title}</p>
            <p className="truncate font-display text-[15px] leading-tight font-bold">
              {mod.kind === "section" ? `${sectionLabel}: ${mod.title}` : mod.title}
            </p>
          </div>
          {containsVideo && open && (
            <button type="button" onClick={() => setVideoFocus((v) => !v)} aria-pressed={videoFocus}
              className="hidden min-h-10 items-center rounded-full border border-[#D9D2F3] bg-white px-4 text-[12px] font-bold text-violet-deep hover:bg-mist sm:inline-flex">
              {videoFocus ? "Exit video focus" : "Focus video"}
            </button>
          )}
          <FocusProgress value={coursePages.length ? done / coursePages.length : 0} label={`${done} of ${coursePages.length} pages`} />
          <button onClick={() => setDrawer(true)} className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline text-[18px] text-ink hover:bg-mist lg:hidden" aria-haspopup="dialog" aria-label="Course outline">
            ☰
          </button>
        </div>
      </header>
      {preview && (
        <div role="status" className="bg-lilac px-4 py-2 text-[12px] leading-snug text-violet-deep sm:px-6">
          <b>Preview.</b> A coach is signed in on this device, so you can see items still awaiting nurse review. Students see only approved items.
        </div>
      )}

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
            <div data-outline-scroll className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">{outline}</div>
          </div>
        </div>
      )}

      {videoFocus && containsVideo && open && (
        <button type="button" onClick={scrollToVideo} aria-label="Return to the current video"
          className="fixed bottom-5 right-5 z-30 min-h-12 rounded-full border border-white/30 bg-violet-deep px-5 text-[13px] font-bold text-white shadow-lg hover:bg-violet focus-visible:outline-offset-4">
          ↑ Return to video
        </button>
      )}
      <div className={`mx-auto grid gap-5 px-4 pb-16 pt-5 sm:px-6 ${videoFocus ? "max-w-[1060px] grid-cols-1" : "max-w-[1440px] lg:grid-cols-[268px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,1fr)_272px] xl:gap-7"}`}>
        {!videoFocus && <aside data-outline-scroll className="sticky top-[80px] hidden h-[calc(100dvh-96px)] overflow-y-auto pr-1 lg:block">{outline}</aside>}

        <main className="min-w-0">
          <article className={`alm-lesson-content mx-auto w-full ${videoFocus ? "max-w-[900px]" : "max-w-[760px]"}`}>
            <nav aria-label="Breadcrumb" className="mb-1.5 text-[13px] font-medium text-ink-muted">
              {mod.kind !== "section" ? sectionLabel : topicNum ? `${sectionLabel} · Topic ${topicNum}` : page.groupTitle === page.title ? `${sectionLabel} · ${mod.title}` : `${sectionLabel} · ${page.groupTitle}`}
            </nav>
            <h1 className="font-display text-[26px] leading-[1.08] font-bold tracking-[-.035em] sm:text-[34px]">{topicNum ? page.title.slice(topicNum.length).trim() : page.title}</h1>
            {containsVideo && open && <button type="button" onClick={() => setVideoFocus((v) => !v)} aria-pressed={videoFocus}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D9D2F3] bg-white px-4 text-[13px] font-bold text-violet-700 sm:hidden">
              {videoFocus ? "← Return to lesson layout" : "Focus on video ↗"}
            </button>}
            <div className="mt-2.5 mb-5 flex flex-wrap gap-2 text-[12.5px] font-bold">
              <span className={`rounded-full px-3 py-1 ${videoClips ? "bg-[#FFE9DC] text-[#A8430A]" : "border border-hairline bg-white text-violet-700"}`}>{videoClips ? "Video topic" : kindLabel[page.kind]}</span>
              <span className="rounded-full border border-hairline bg-white px-3 py-1 text-ink">About {minutesFor(page)} min</span>
              {isDone(page.id) ? (
                <span role="status" className="rounded-full bg-mint px-3 py-1 text-correct">✓ Marked done</span>
              ) : (
                open &&
                checksLeft > 0 && (
                  <span className="rounded-full border border-hairline bg-white px-3 py-1 text-ink-muted">
                    {checksLeft} check{checksLeft === 1 ? "" : "s"} left
                  </span>
                )
              )}
              {preview && <span className={`rounded-full px-3 py-1 ${approved ? "bg-mint text-correct" : "bg-[#FFE9DC] text-[#A8430A]"}`}>{approved ? "Approved for release (preview)" : "Awaiting content review (preview)"}</span>}
            </div>

            {!open ? (
              <div className="rounded-[16px] border border-hairline bg-white p-6 text-ink-body">
                <p className="font-display text-xl font-semibold text-ink">This page opens once it&apos;s approved</p>
                <p className="mt-1">
                  This lesson is awaiting its content approval before it can be released to learners.
                </p>
              </div>
            ) : (
              videoClips ? (
                <VideoLedTopic page={page} videos={videoClips} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} focusMode={videoFocus} />
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
                  return <BlockView key={i} b={b} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} eq={eq} groupVideoCorrections={clipIds.length > 1} />;
                })}
                {clipIds.length > 1 && <VideoReviewNotes clipIds={clipIds} />}
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

            <div ref={endRef} className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
              {prev ? (
                <Link href={`/app/learn/${prev.id}`} transitionTypes={["nav-back"]} aria-label={`Previous: ${prev.shortTitle ?? prev.title}`} className="flex h-12 max-w-[45%] min-w-0 items-center gap-1.5 rounded-[12px] border-[1.5px] border-[#D9D2F3] bg-white px-4 text-[14px] font-bold text-violet-deep hover:bg-mist">
                  <span aria-hidden="true">←</span><span className="truncate"><span className="sm:hidden">Back</span><span className="hidden sm:inline">{prev.shortTitle ?? prev.title}</span></span>
                </Link>
              ) : null}
              <span className="hidden min-w-0 flex-1 truncate text-[13px] text-ink-muted sm:block">{next ? `Next: ${next.shortTitle ?? next.title} · ${minutesFor(next)} min` : ""}</span>
              <span className="flex-1 sm:hidden" />
              {next ? (
                <Link href={`/app/learn/${next.id}`} transitionTypes={["nav-forward"]} onClick={() => SELF_COMPLETING.has(page.kind) && checksAnswered && markDone()} aria-label={`Next: ${next.shortTitle ?? next.title}`} className="flex h-12 items-center gap-2 rounded-[12px] bg-violet px-5 text-[15px] font-bold text-white hover:bg-[#4A2DE6]">
                  {next.kind === "topic" ? "Next topic" : "Next page"} <ArrowRightIcon size={16} />
                </Link>
              ) : (
                <Link href={`/app/courses/${course.id}`} className="flex h-12 items-center gap-2 rounded-[12px] bg-violet px-5 text-[15px] font-bold text-white hover:bg-[#4A2DE6]">
                  Back to the course <ArrowRightIcon size={16} />
                </Link>
              )}
            </div>
          </article>
        </main>
        {!videoFocus && <aside className="sticky top-[80px] hidden h-[calc(100dvh-100px)] flex-col gap-4 overflow-y-auto xl:flex">
          <div id="player-chapters" className="empty:hidden" />
          {page.source && (
            <details className="rounded-[16px] border border-hairline bg-white p-4">
              <summary className="cursor-pointer text-[12px] font-extrabold text-violet-700">Source & reference</summary>
              <p className="mt-3 text-[13px] leading-normal text-ink-body">{page.source}</p>
            </details>
          )}
          <section className="flex flex-col gap-2 rounded-[16px] border border-hairline bg-white p-4 [&_button]:min-h-11 [&_button]:w-full [&_button]:justify-center [&_button]:rounded-[12px]">
            <p className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">STUCK?</p>
            <TutorButton lessonId={page.id} label="Ask the tutor about this page" />
            <div className="text-center">
              <ReportButton itemId={page.id} itemType="page" />
            </div>
          </section>
        </aside>}
      </div>
    </div>
  );
}

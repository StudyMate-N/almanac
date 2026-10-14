"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/brand";
import { ArrowRightIcon, XIcon } from "@/components/icons";
import { BlockView } from "@/components/player/blocks";
import { kindLabel, Outline, Ring } from "@/components/player/outline";
import { VideoLedTopic, videoLedClip } from "@/components/player/video-led";
import { ReportButton, TutorButton } from "@/components/tutor";
import { courseById, lessonById, lessons, modulesInCourse, moduleById, questionById } from "@/content/course";
import type { Card, Lesson, Question } from "@/content/types";
import { REVIEWER } from "@/lib/config";
import { minutesFor } from "@/lib/minutes";
import { useStudent } from "@/lib/store";

const SELF_COMPLETING = new Set(["reading", "activity", "summary", "video", "topic"]);

export default function Player() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { state, answers, update, isVisible, isApproved, preview } = useStudent();
  const [drawer, setDrawer] = useState(false);
  const page = lessonById(lessonId);
  const mod = page ? moduleById(page.moduleId) : undefined;
  const course = mod ? courseById(mod.courseId) : undefined;
  const coursePages = useMemo(() => (mod ? lessons.filter((l) => moduleById(l.moduleId)?.courseId === mod.courseId) : []), [mod]);
  const isOpen = (p: Lesson) => isVisible(p.id, p);
  const isDone = (id: string) => Boolean(state.lessons[id]);
  const visibleQ = (q: Question) => isVisible(q.id, q);
  const visibleCards = (c: Card) => isVisible(c.id, c);
  const open = page ? isOpen(page) : false;

  const markDone = () => {
    if (page && !state.lessons[page.id]) update("lessons", { ...state.lessons, [page.id]: { at: new Date().toISOString() } });
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
  const canSelfComplete = Boolean(page && SELF_COMPLETING.has(page.kind) && checksAnswered);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setDrawer(false);
  }, [page?.id]);

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

  const idx = coursePages.findIndex((p) => p.id === page.id);
  const prev = coursePages.slice(0, idx).reverse().find(isOpen);
  const next = coursePages.slice(idx + 1).find(isOpen);
  const done = coursePages.filter((p) => isDone(p.id)).length;
  const approved = isApproved(page.id, page);
  // A topic page with a question-stop clip is video-led; without one (or without media) it reads.
  const videoClip = videoLedClip(page);
  // Topic pages are titled "5.3 Obstructive disease": the number goes in the breadcrumb.
  const topicNum = page.kind === "topic" ? page.title.match(/^\d+\.\d+(?=\s)/)?.[0] : undefined;
  const sectionLabel = mod.kind === "section" ? `Section ${mod.number}` : mod.kind === "start" ? "Start here" : "Final review";
  const modules = modulesInCourse(course.id);

  const outline = <Outline modules={modules} currentId={page.id} isDone={isDone} isOpen={isOpen} onNavigate={() => setDrawer(false)} />;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-hairline/70 bg-ground/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 sm:px-6">
          <Link href={`/app/courses/${course.id}`} aria-label="Close the course player" className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white hover:bg-mist">
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
          <span className="hidden items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1.5 text-[13px] font-bold text-ink-muted md:inline-flex">
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

      <div className="mx-auto flex max-w-[1320px] gap-8 px-4 pt-6 pb-24 sm:px-6">
        <aside className="sticky top-[88px] hidden h-[calc(100dvh-112px)] w-[320px] flex-none overflow-y-auto pr-1 lg:block">{outline}</aside>

        <main className="min-w-0 flex-1">
          <article className="mx-auto max-w-[760px]">
            <nav aria-label="Breadcrumb" className="mb-2 text-[13px] font-semibold text-ink-muted">
              {mod.kind !== "section" ? sectionLabel : topicNum ? `${sectionLabel} · Topic ${topicNum}` : page.groupTitle === page.title ? `${sectionLabel} · ${mod.title}` : `${sectionLabel} · ${page.groupTitle}`}
            </nav>
            <h1 className="font-display text-[30px] leading-[1.15] font-semibold sm:text-[36px]">{topicNum ? page.title.slice(topicNum.length).trim() : page.title}</h1>
            <div className="mt-3 mb-7 flex flex-wrap gap-2 text-[13px] font-bold">
              <span className="rounded-full bg-white px-3 py-1 text-violet-700">{videoClip ? "Video topic" : kindLabel[page.kind]}</span>
              <span className="rounded-full bg-white px-3 py-1 text-ink-muted">About {minutesFor(page)} min</span>
              {isDone(page.id) ? (
                <span className="rounded-full bg-mint px-3 py-1 text-mint-ink">Done</span>
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
              videoClip ? (
                <VideoLedTopic page={page} vb={videoClip} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} />
              ) : (
              <div className="flex flex-col gap-6">
                {page.blocks.map((b, i) => {
                  const prev = page.blocks[i - 1];
                  if (b.t === "eq" && page.blocks[i + 1]?.t === "keypoints") return null;
                  const eq = b.t === "keypoints" && prev?.t === "eq" ? prev.text : undefined;
                  return <BlockView key={i} b={b} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={markDone} eq={eq} />;
                })}
              </div>
              )
            )}

            {open && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline pt-5 text-sm text-ink-muted">
                <TutorButton lessonId={page.id} label="Ask the tutor about this page" />
                <ReportButton itemId={page.id} itemType="page" />
                {page.source && <span className="basis-full pt-1 text-[13px]">Source: {page.source}</span>}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link href={`/app/learn/${prev.id}`} className="flex flex-col rounded-tile bg-white p-5 hover:bg-mist">
                  <span className="text-[12px] font-bold text-ink-muted">Previous</span>
                  <span className="font-display text-[17px] leading-snug font-semibold">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/app/learn/${next.id}`} onClick={() => canSelfComplete && markDone()} className="flex items-center gap-3 rounded-tile bg-tangerine p-5 text-ink hover:bg-tangerine-700">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-extrabold">Next</span>
                    <span className="block font-display text-[17px] leading-snug font-semibold">{next.title}</span>
                  </span>
                  <ArrowRightIcon size={20} />
                </Link>
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}

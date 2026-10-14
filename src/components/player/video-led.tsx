"use client";

import { useEffect, useRef, useState } from "react";
import { questionById } from "@/content/course";
import { clipById } from "@/content/patho";
import type { Block, Card, Lesson, Question } from "@/content/types";
import { MEDIA_BASE, REVIEWER } from "@/lib/config";
import { readingWords } from "@/lib/minutes";
import { useStudent } from "@/lib/store";
import { BlockView, Corrections, OpenPrompt, Predict, TopicHead, toSec } from "./blocks";
import { CheckCard } from "./topic-check";

type VideoBlock = Extract<Block, { t: "video" }>;
type Stop = { at: number; label: string; ref: string; kind: "predict" | "check" };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** The page's question-stop video, if it has one and clips can play. Pages without one render read-led. */
export function videoLedClip(page: Lesson): VideoBlock | undefined {
  if (!MEDIA_BASE || page.kind !== "topic") return undefined;
  return page.blocks.find((b): b is VideoBlock => b.t === "video" && Boolean(b.stops?.length) && Boolean(clipById(b.clip)));
}

/** Blocks shown inside "Full notes": the reading, pictures, tables and the patient. */
const NOTE_KINDS = new Set<Block["t"]>(["h2", "p", "ul", "ol", "table", "img", "callout", "case", "labs"]);

/**
 * Video-led topic page (course standard v1, 2.3): the clip leads and pauses at
 * each question stop, key points stay visible, and the full notes open on
 * request. The page completes only once every check is answered, whichever
 * way the student gets there.
 */
export function VideoLedTopic({ page, vb, visibleQ, visibleCards, onComplete }: { page: Lesson; vb: VideoBlock; visibleQ: (q: Question) => boolean; visibleCards: (c: Card) => boolean; onComplete: () => void }) {
  const { state, answers } = useStudent();
  const clip = clipById(vb.clip)!;
  const video = useRef<HTMLVideoElement>(null);
  const last = useRef(0);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(toSec(clip.duration));
  const [playing, setPlaying] = useState(false);
  const [cc, setCc] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);

  const predicts = page.blocks.filter((b): b is Extract<Block, { t: "predict" }> => b.t === "predict");
  const stops: Stop[] = (vb.stops ?? [])
    .map((s) => ({ at: toSec(s.at), label: s.at, ref: s.ref, kind: predicts.some((p) => p.id === s.ref) ? ("predict" as const) : ("check" as const) }))
    .filter((s) => s.kind === "predict" || (questionById(s.ref) && visibleQ(questionById(s.ref)!)))
    .sort((a, b) => a.at - b.at);
  const checkStops = stops.filter((s) => s.kind === "check");
  const answered = (s: Stop) => (s.kind === "predict" ? Boolean(state.notes[`predict:${s.ref}`]) : answers.some((a) => a.questionId === s.ref));
  // The predict stop at 0:00 shows before the first play.
  const [active, setActive] = useState<Stop | null>(() => stops.find((s) => s.at === 0 && !answered(s)) ?? null);

  useEffect(() => {
    const el = video.current;
    if (el) for (const tr of Array.from(el.textTracks)) tr.mode = cc ? "showing" : "hidden";
  }, [cc]);

  const play = () => {
    setActive(null);
    void video.current?.play();
  };
  const toggle = () => {
    const el = video.current;
    if (!el || active) return;
    if (el.paused) void el.play();
    else el.pause();
  };
  const seek = (sec: number) => {
    const el = video.current;
    if (!el) return;
    el.currentTime = sec;
    last.current = sec;
    setT(sec);
  };
  const onTime = () => {
    const el = video.current;
    if (!el) return;
    const now = el.currentTime;
    // Playing through a stop pauses for it; seeking past one doesn't (the page stays incomplete instead).
    // Browsers fire timeupdate after a seek with seeking already false, so a jump counts as a seek too.
    if (!el.seeking && now - last.current < 1.5) {
      const hit = stops.find((s) => s.at > 0 && s.at > last.current && s.at <= now && !answered(s));
      if (hit) {
        el.pause();
        setActive(hit);
      }
    }
    last.current = now;
    setT(now);
  };

  const chapters = (clip.chapters ?? []).map((c) => ({ ...c, sec: toSec(c.at) }));
  const chapterNow = [...chapters].reverse().find((c) => c.sec <= t)?.label ?? clip.shortTitle ?? clip.title;
  const keypoints = page.blocks.find((b) => b.t === "keypoints");
  const open = page.blocks.find((b) => b.t === "open");
  const read = page.blocks.find((b) => b.t === "read");
  const notes = page.blocks.filter((b) => NOTE_KINDS.has(b.t));
  const stopRefs = new Set(stops.map((s) => s.ref));
  // Checks and predicts that aren't stops still need a place on the page.
  const loose = page.blocks.filter((b) => (b.t === "check" && !stopRefs.has(b.id)) || (b.t === "predict" && !stopRefs.has(b.id)));
  const patient = page.blocks.find((b) => b.t === "case")?.title.split(/[ ,]/)[0];
  const notesSub = [notes.some((b) => b.t === "img") && "Diagram", notes.some((b) => b.t === "table") && "comparison table", patient, read && "textbook reading"].filter(Boolean).join(", ");
  const notesMin = Math.max(1, Math.round(readingWords(notes) / 200));
  const pct = dur ? Math.min(100, (t / dur) * 100) : 0;
  const base = `${MEDIA_BASE.replace(/\/$/, "")}/${clip.id}`;

  return (
    <div className="flex flex-col gap-6">
      <section aria-label={`Video: ${clip.title}`} className="flex flex-col gap-2.5">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-violet-deep text-white">
          <video
            ref={video}
            preload="metadata"
            playsInline
            poster={`${base}.jpg`}
            crossOrigin="anonymous"
            className="absolute inset-0 h-full w-full"
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => e.currentTarget.duration && setDur(e.currentTarget.duration)}
            onTimeUpdate={onTime}
            onSeeking={(e) => (last.current = e.currentTarget.currentTime)}
            onSeeked={(e) => (last.current = e.currentTarget.currentTime)}
          >
            <source src={`${base}.mp4`} type="video/mp4" />
            <track kind="captions" src={`${base}.vtt`} srcLang="en" label="English" default />
          </video>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-[18px_20px]">
            <div className="flex items-start justify-between gap-2.5">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{chapterNow}</span>
              <button onClick={() => setCc(!cc)} aria-pressed={cc} aria-label="Captions" className="pointer-events-auto min-h-8 rounded-full bg-white/15 px-3 text-xs font-bold">
                CC
              </button>
            </div>
            {!playing && (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggle}
                  disabled={Boolean(active)}
                  aria-label="Play"
                  className="pointer-events-auto grid h-[76px] w-[76px] place-items-center rounded-full bg-tangerine text-[26px] text-ink disabled:opacity-60"
                >
                  ▶
                </button>
                <p className="text-center text-sm font-semibold text-violet-on">{active ? "Paused for a question below" : t > 0 && t >= dur - 0.5 ? "Finished. Every stop answered?" : "Press play"}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="relative h-1.5 rounded-md bg-white/22">
                <div className="absolute inset-y-0 left-0 rounded-md bg-white" style={{ width: `${pct}%` }} />
                {stops
                  .filter((s) => s.at > 0)
                  .map((s) => (
                    <span key={s.ref} aria-hidden="true" className={`absolute -top-[5px] -ml-2 h-4 w-4 rounded-full border-2 border-violet-deep ${answered(s) ? "bg-correct" : "bg-tangerine"}`} style={{ left: `${dur ? (s.at / dur) * 100 : 0}%` }} />
                  ))}
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.round(dur))}
                  step={1}
                  value={Math.round(t)}
                  onChange={(e) => seek(Number(e.target.value))}
                  aria-label="Seek"
                  aria-valuetext={`${fmt(t)} of ${fmt(dur)}`}
                  className="pointer-events-auto absolute -inset-y-3 inset-x-0 w-full cursor-pointer opacity-0"
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-violet-on">
                <span>{fmt(t)}</span>
                <span>{fmt(dur)}</span>
              </div>
            </div>
          </div>
        </div>
        {chapters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chapters.map((c) => {
              const here = c.label === chapterNow;
              return (
                <button key={c.at} onClick={() => seek(c.sec)} className={`min-h-10 rounded-full px-3.5 text-[13px] font-bold ${here ? "bg-lilac text-violet-700" : "bg-white text-ink-muted"}`}>
                  {c.at} {c.label}
                </button>
              );
            })}
          </div>
        )}
        <p className="text-[13px] text-ink-muted">
          Course video · {clip.duration} · {checkStops.length} stop{checkStops.length === 1 ? "" : "s"} for questions · Script approved by {REVIEWER.name}, {REVIEWER.credentials}
        </p>
        <Corrections clip={clip} seek={(at) => seek(toSec(at))} />
      </section>

      {active?.kind === "predict" &&
        (() => {
          const p = predicts.find((x) => x.id === active.ref)!;
          return (
            <div className="rounded-tile ring-2 ring-violet-300">
              <Predict id={p.id} stem={p.stem} options={p.options} correct={p.correct} reveal={p.reveal} eyebrow={active.at === 0 ? "Before you press play · not scored" : `Video paused at ${active.label} · not scored`}>
                <button onClick={play} className="min-h-12 self-start rounded-full bg-violet px-6 font-bold text-white">
                  Play the video ▶
                </button>
              </Predict>
            </div>
          );
        })()}
      {active?.kind === "check" && (
        <section aria-label="Video stop" className="flex flex-col gap-3 rounded-tile bg-white p-[20px_22px] ring-2 ring-violet-300">
          <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">
            Video paused at {active.label} · Check {checkStops.findIndex((s) => s.ref === active.ref) + 1} of {checkStops.length}
          </p>
          <CheckCard key={active.ref} q={questionById(active.ref)!} pageId={page.id} action={{ label: "Continue the video ▶", onClick: play }} />
        </section>
      )}

      {keypoints && <BlockView b={keypoints} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={onComplete} />}
      {loose.map((b, i) => (
        <BlockView key={i} b={b} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={onComplete} />
      ))}
      {open?.t === "open" && <OpenPrompt id={open.id} stem={open.stem} expert={open.expert} />}

      {notes.length > 0 && (
        <section className="flex flex-col gap-6">
          <button onClick={() => setNotesOpen(!notesOpen)} aria-expanded={notesOpen} className="flex w-full items-center gap-3 rounded-card bg-white p-[16px_18px] text-left">
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[18px] font-semibold">Full notes</span>
              <span className="block text-[13.5px] text-ink-muted">
                {notesSub ? `${notesSub} · ` : ""}about {notesMin} min
              </span>
            </span>
            <span aria-hidden="true" className="text-[18px] font-bold text-violet-600">
              {notesOpen ? "Hide ▴" : "Open ▾"}
            </span>
          </button>
          {notesOpen && notes.map((b, i) => <BlockView key={i} b={b} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={onComplete} />)}
        </section>
      )}

      {read && <BlockView b={read} pageId={page.id} visibleQ={visibleQ} visibleCards={visibleCards} onComplete={onComplete} />}
    </div>
  );
}

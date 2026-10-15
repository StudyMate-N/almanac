"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { questionById } from "@/content/course";
import { type Clip, clipById } from "@/content/patho";
import type { Block, Card, Lesson, Question } from "@/content/types";
import { MEDIA_BASE, REVIEWER } from "@/lib/config";
import { readingWords } from "@/lib/minutes";
import { useStudent } from "@/lib/store";
import { BlockView, OpenPrompt, Predict, TopicHead, toSec } from "./blocks";
import { CheckCard } from "./topic-check";

type VideoBlock = Extract<Block, { t: "video" }>;
type Seg = { clip: Clip; block: VideoBlock; offset: number; len: number };
/** A learning check placed in the clip; `pos` is seconds on the page's combined timeline. */
type Stop = { pos: number; seg: number; at: number; check: Question };

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * The page's clips when it should render video-led: a topic page with at least one
 * video block whose clip exists. Without a media store the page stays read-led.
 */
export function videoLedBlocks(page: Lesson): VideoBlock[] | undefined {
  if (!MEDIA_BASE || page.kind !== "topic") return undefined;
  const vs = page.blocks.filter((b): b is VideoBlock => b.t === "video" && Boolean(clipById(b.clip)));
  return vs.length ? vs : undefined;
}

/** What "Full notes" holds: the reading, pictures, tables, the patient and the textbook. */
const NOTE_KINDS = new Set<Block["t"]>(["h2", "p", "ul", "ol", "table", "img", "diagram", "callout", "case", "labs", "read"]);

/**
 * Video-led topic page (design/Topic Page 5.3, "Video-led"). The page's clips play
 * as one video with chapter chips; each learning check is a stop that pauses the
 * video. Stops come in order and can't be skipped: any seek past the first
 * unanswered stop lands on it. Predict comes before the first play, key points stay
 * visible, and the full notes open on request. The page completes through the
 * learn page's checksLeft rule once every stop is answered.
 */
export function VideoLedTopic({ page, videos, visibleQ, visibleCards, onComplete, focusMode = false }: { page: Lesson; videos: VideoBlock[]; visibleQ: (q: Question) => boolean; visibleCards: (c: Card) => boolean; onComplete: () => void; focusMode?: boolean }) {
  const { state, answers } = useStudent();
  const video = useRef<HTMLVideoElement>(null);
  const pending = useRef<{ local: number; play: boolean } | null>(null);
  const [seg, setSeg] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [cc, setCc] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [active, setActive] = useState<Stop | null>(null);

  const segs = useMemo(() => {
    let offset = 0;
    return videos.map((block) => {
      const clip = clipById(block.clip)!;
      const s = { clip, block, offset, len: toSec(clip.duration) };
      offset += s.len;
      return s;
    }) as Seg[];
  }, [videos]);
  const total = segs.reduce((n, s) => n + s.len, 0);
  const stops = useMemo(
    () =>
      segs
        .flatMap((s, i) =>
          (s.block.stops ?? []).flatMap((st) => {
            const q = questionById(st.check);
            return q && visibleQ(q) ? [{ pos: s.offset + toSec(st.at), seg: i, at: toSec(st.at), check: q }] : [];
          }),
        )
        .sort((a, b) => a.pos - b.pos),
    // visibleQ is stable for a page view
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [segs],
  );
  const chapters = segs.flatMap((s) => (s.block.chapters?.length ? s.block.chapters : [{ at: "0:00", label: s.clip.shortTitle ?? s.clip.title }]).map((c) => ({ ...c, pos: s.offset + toSec(c.at) })));
  const answered = (st: Stop) => answers.some((a) => a.questionId === st.check.id);
  const nextStop = stops.find((st) => !answered(st));

  const predict = page.blocks.find((b): b is Extract<Block, { t: "predict" }> => b.t === "predict");
  const predictDone = !predict || Boolean(state.notes[`predict:${predict.id}`]);

  useEffect(() => {
    const el = video.current;
    if (el) for (const tr of Array.from(el.textTracks)) tr.mode = cc ? "showing" : "hidden";
  }, [cc, seg]);

  const pauseAt = (st: Stop) => {
    const el = video.current;
    el?.pause();
    if (st.seg !== seg) {
      pending.current = { local: st.at, play: false };
      setSeg(st.seg);
    } else if (el) el.currentTime = st.at;
    setT(st.pos);
    setActive(st);
  };

  /** Move to a point on the page timeline; an unanswered stop before it stops the move there. */
  const goTo = (g: number, play: boolean) => {
    const blocker = nextStop && nextStop.pos < g - 0.25 ? nextStop : undefined;
    if (blocker) return pauseAt(blocker);
    const i = Math.max(0, segs.findLastIndex((s) => s.offset <= g));
    const local = Math.min(g - segs[i].offset, segs[i].len - 0.1);
    setEnded(false);
    setT(segs[i].offset + local);
    if (i !== seg) {
      pending.current = { local, play };
      setSeg(i);
      return;
    }
    const el = video.current;
    if (!el) return;
    el.currentTime = local;
    if (play) void el.play();
  };

  const play = () => {
    if (!predictDone || active) return;
    setActive(null);
    if (ended) return goTo(0, true);
    void video.current?.play();
  };
  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) play();
    else el.pause();
  };
  const resume = () => {
    setActive(null);
    void video.current?.play();
  };

  const onTime = () => {
    const el = video.current;
    if (!el) return;
    const g = segs[seg].offset + el.currentTime;
    if (nextStop && !active && nextStop.seg === seg && g >= nextStop.pos - 0.05) return pauseAt(nextStop);
    setT(g);
  };
  const onSeeking = () => {
    const el = video.current;
    if (!el || !nextStop) return;
    const g = segs[seg].offset + el.currentTime;
    if (g > nextStop.pos + 0.25) pauseAt(nextStop);
  };
  const onEnded = () => {
    if (seg < segs.length - 1) {
      pending.current = { local: 0, play: true };
      setSeg(seg + 1);
    } else {
      setPlaying(false);
      setEnded(true);
    }
  };
  const onLoaded = () => {
    const el = video.current;
    const p = pending.current;
    pending.current = null;
    if (!el || !p) return;
    el.currentTime = p.local;
    if (p.play) void el.play();
  };

  const [railEl, setRailEl] = useState<HTMLElement | null>(null);
  useEffect(() => setRailEl(document.getElementById("player-chapters")), []);
  const keypoints = page.blocks.find((b) => b.t === "keypoints");
  const open = page.blocks.find((b) => b.t === "open");
  const notes = page.blocks.filter((b) => NOTE_KINDS.has(b.t));
  const patient = page.blocks.find((b) => b.t === "case")?.title.split(/[ ,]/)[0];
  const notesSub = [notes.some((b) => b.t === "img" || b.t === "diagram") && "Diagram", notes.some((b) => b.t === "table") && "comparison table", patient, notes.some((b) => b.t === "read") && "textbook reading"].filter(Boolean).join(", ");
  const notesMin = Math.max(1, Math.round(readingWords(notes) / 200));
  const chapterNow = [...chapters].reverse().find((c) => c.pos <= t + 0.05) ?? chapters[0];
  const cur = segs[seg];
  const base = `${MEDIA_BASE.replace(/\/$/, "")}/${cur.clip.id}`;
  const message = !predictDone ? "Choose an answer above to unlock play" : active ? "Paused for a learning check below" : ended ? "Video complete · review your checks" : "Your prediction is saved · ready to watch";

  return (
    <div className="flex flex-col gap-6">
      {predict && (
        <div>
          <Predict id={predict.id} stem={predict.stem} options={predict.options} correct={predict.correct} reveal={predict.reveal} eyebrow="Before you press play · not scored">
            {!playing && !active && t === 0 && (
              <button onClick={play} className="min-h-12 self-start rounded-full bg-violet px-6 font-bold text-white">
                Play the video ▶
              </button>
            )}
          </Predict>
        </div>
      )}
      <section aria-label="Course video" className="flex flex-col gap-2.5">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-violet-deep text-white">
          <video
            key={cur.clip.id}
            ref={video}
            preload="metadata"
            playsInline
            poster={`${base}.jpg`}
            crossOrigin="anonymous"
            className="absolute inset-0 h-full w-full"
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={onLoaded}
            onTimeUpdate={onTime}
            onSeeking={onSeeking}
            onEnded={onEnded}
          >
            <source src={`${base}.mp4`} type="video/mp4" />
            <track kind="captions" src={`${base}.vtt`} srcLang="en" label="English" default />
          </video>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-[18px_20px]">
            <div className="flex items-start justify-between gap-2.5">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{chapterNow?.label}</span>
              <button onClick={() => setCc(!cc)} aria-pressed={cc} aria-label="Captions" className="pointer-events-auto min-h-8 rounded-full bg-white/15 px-3 text-xs font-bold">
                CC
              </button>
            </div>
            {!playing && (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggle}
                  disabled={!predictDone || Boolean(active)}
                  aria-label={ended ? "Play again" : "Play"}
                  className="pointer-events-auto grid h-[76px] w-[76px] place-items-center rounded-full bg-[#EA6512] text-[26px] text-white shadow-[0_0_0_6px_#FFE9DC] disabled:cursor-not-allowed max-sm:h-16 max-sm:w-16"
                >
                  {ended ? "↺" : "▶"}
                </button>
                <p className="rounded-full bg-white px-3 py-1.5 text-center text-[13px] font-bold text-violet-deep max-sm:hidden">{message}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="relative h-1.5 rounded-md bg-white/22">
                <div className="absolute inset-y-0 left-0 rounded-md bg-white" style={{ width: `${total ? Math.min(100, (t / total) * 100) : 0}%` }} />
                {stops.map((st) => (
                  <span
                    key={st.check.id}
                    aria-hidden="true"
                    className={`absolute -top-[5px] -ml-2 h-4 w-4 rounded-full border-2 border-violet-deep ${answered(st) ? "bg-correct" : "bg-tangerine"}`}
                    style={{ left: `${(st.pos / total) * 100}%` }}
                  />
                ))}
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.round(total))}
                  step={1}
                  value={Math.round(t)}
                  onChange={(e) => goTo(Number(e.target.value), playing)}
                  aria-label="Seek"
                  aria-valuetext={`${fmt(t)} of ${fmt(total)}`}
                  className="pointer-events-auto absolute -inset-y-3 inset-x-0 w-full cursor-pointer opacity-0"
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-violet-on">
                <span>{fmt(t)}</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 ${focusMode ? "" : "xl:hidden"}`}>
          {chapters.map((c) => {
            const here = c === chapterNow;
            return (
              <button key={`${c.pos}-${c.label}`} onClick={() => goTo(c.pos, playing)} aria-current={here ? "true" : undefined} className={`min-h-10 flex-none rounded-full border-[1.5px] px-3.5 text-[13px] font-bold whitespace-nowrap ${here ? "border-[#F2711C] bg-[#FFF4EC] text-ink" : "border-hairline bg-white text-ink-muted"}`}>
                {fmt(c.pos)} {c.label}
              </button>
            );
          })}
        </div>
        {!focusMode && railEl &&
          createPortal(
            <section className="rounded-[16px] border border-hairline bg-white p-2">
              <p className="px-2 pt-2 pb-1.5 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">CHAPTERS</p>
              {chapters.map((c) => {
                const here = c === chapterNow;
                return (
                  <button key={`${c.pos}-${c.label}`} onClick={() => goTo(c.pos, playing)} aria-current={here ? "true" : undefined} className={`relative flex min-h-11 w-full items-center gap-2 rounded-[10px] px-3.5 text-left text-[13.5px] ${here ? "bg-[#FFF4EC] font-bold text-ink" : "font-medium text-ink-body hover:bg-mist"}`}>
                    {here && <span aria-hidden="true" className="absolute top-2.5 bottom-2.5 left-1 w-1 rounded-full bg-[#F2711C]" />}
                    <span className="min-w-0 flex-1">{c.label}</span>
                    <span className="font-mono text-[11.5px] text-ink-muted">{fmt(c.pos)}</span>
                  </button>
                );
              })}
            </section>,
            railEl,
          )}
        <p className="text-[13px] text-ink-muted">
          Course video · {fmt(total)} · {stops.length} stop{stops.length === 1 ? "" : "s"} for questions · Script approved by {REVIEWER.name}, {REVIEWER.credentials}
        </p>
        {segs.some((s) => s.clip.corrections.length > 0) && (
          <details className="rounded-[16px] border border-hairline bg-white px-4 py-3.5">
            <summary className="cursor-pointer text-[14px] font-bold text-violet-700">
              Video review notes · {segs.reduce((n, s) => n + s.clip.corrections.length, 0)} timestamped corrections
            </summary>
            <p className="mt-3 text-[13px] leading-6 text-ink-muted">Some statements in the original narration need clarification. Review these notes while watching.</p>
            <div className="mt-4 flex flex-col gap-5">
              {segs.filter((s) => s.clip.corrections.length > 0).map((s) => (
                <section key={s.clip.id} className="border-t border-hairline pt-3">
                  <h3 className="text-[14px] font-bold text-ink">{s.clip.shortTitle ?? s.clip.title}</h3>
                  <ul className="mt-2 space-y-3">
                    {s.clip.corrections.map((c) => (
                      <li key={c.at} className="rounded-xl bg-mist p-3.5 text-[13px] leading-6">
                        <button type="button" onClick={() => goTo(s.offset + toSec(c.at), true)}
                          className="mb-2 min-h-10 rounded-full bg-white px-3 text-xs font-bold text-violet-700">
                          Jump to {c.at} ↗
                        </button>
                        <p className="text-ink-muted line-through">{c.said}</p>
                        <p className="mt-1 text-ink">{c.correct}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </details>
        )}
      </section>

      {active && (
        <section aria-label="Video stop" className="flex flex-col gap-3 rounded-tile bg-white p-[20px_22px] ring-2 ring-violet-300">
          <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">
            Video paused at {fmt(active.pos)} · Check {stops.indexOf(stops.find((s) => s.check.id === active.check.id)!) + 1} of {stops.length}
          </p>
          <CheckCard key={active.check.id} q={active.check} pageId={page.id} action={{ label: "Continue the video ▶", onClick: resume }} />
        </section>
      )}

      {keypoints?.t === "keypoints" && <TopicHead items={keypoints.items} />}
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
    </div>
  );
}

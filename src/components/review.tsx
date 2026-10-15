"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, UndoIcon, XIcon } from "@/components/icons";
import { courseById, modules } from "@/content/course";
import { BOOK } from "@/content/patho/author";
import { dayKey, formatInterval, gradeCard, grades, isNew, nextDueDate, previewIntervals, ROUND, storeDeck, type Deck } from "@/lib/deck";
import { useStudent } from "@/lib/store";
import { useCardQueue } from "@/lib/use-cards";
import { useCourse } from "@/lib/use-course";
import { Rating, type Grade } from "ts-fsrs";

/** One review session. `inRound` counts grades in the current round; `recalled` counts Good/Easy on a card's first showing. */
type Session = { queue: string[]; round: number; inRound: number; graded: number; firsts: number; recalled: number; seen: string[]; waiting: number; locked: number };
type Snapshot = { deck: Deck; session: Session; fresh: Record<string, number> };

const SECONDS_PER_CARD = 24;
const SWIPE = 90;

const words = (s: string) => s.trim().split(/\s+/).length;
/** Short prompts read big; longer ones step down so a card never feels like a wall. */
const frontSize = (s: string) => (words(s) <= 3 ? "text-[34px] sm:text-[40px] leading-[1.1]" : words(s) <= 8 ? "text-[27px] sm:text-[30px] leading-tight" : "text-[22px] sm:text-[24px] leading-snug");
const backSize = (s: string) => (words(s) <= 3 ? "text-[32px] sm:text-[36px] leading-tight text-violet-600" : words(s) <= 8 ? "text-[24px] sm:text-[27px] leading-snug text-ink" : "text-[20px] sm:text-[22px] leading-snug text-ink");
const minutes = (n: number) => Math.max(1, Math.round((n * SECONDS_PER_CARD) / 60));

function sectionLabel(moduleId: string) {
  const m = modules.find((x) => x.id === moduleId);
  if (!m) return "";
  const n = m.id.match(/-s(\d+)$/)?.[1];
  return n ? `Section ${n} · ${m.title}` : m.title;
}

/**
 * Flashcard review with FSRS scheduling, saved to the student's account.
 * Built to keep fatigue low: short rounds with a pause between them, one
 * action spot at the bottom, Space then Space for the common path, a swipe
 * on touch, and a question that shrinks out of the way when the answer opens.
 */
export function Review() {
  const { state, update, approvalsLoaded } = useStudent();
  const { cards } = useCourse();
  const today = useCardQueue();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [fresh, setFresh] = useState<Record<string, number>>({});
  const [flipped, setFlipped] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [now, setNow] = useState(() => new Date());

  const flippedAt = useRef(0);
  const flip = useCallback(() => {
    flippedAt.current = performance.now();
    setFlipped(true);
  }, []);

  useEffect(() => {
    // Build the queue once per visit, as soon as approvals are known (cached copies make this instant
    // on return visits). Building earlier would show "all caught up" to a student with cards due.
    if (session || !approvalsLoaded) return;
    setDeck(today.deck);
    setFresh(state.deck?.fresh ?? {});
    setSession({ queue: today.queue, round: 1, inRound: 0, graded: 0, firsts: 0, recalled: 0, seen: [], waiting: today.waiting, locked: today.locked });
    // Later saves must not reshuffle the queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalsLoaded]);

  const resting = Boolean(session && session.inRound >= ROUND && session.queue.length > 0);
  const currentId = resting ? undefined : session?.queue[0];
  const content = useMemo(() => cards.find((c) => c.id === currentId), [currentId, cards]);
  const intervals = useMemo(() => (deck && currentId ? previewIntervals(deck[currentId], now) : null), [deck, currentId, now]);

  const grade = useCallback(
    (g: Grade) => {
      if (!deck || !session || !currentId) return;
      const at = new Date();
      const day = dayKey(at);
      const wasNew = isNew(deck[currentId]);
      const updated = gradeCard(deck[currentId], g, at);
      const nextDeck = { ...deck, [currentId]: updated };
      const rest = session.queue.slice(1);
      // A card due again within the session ("Again" is minutes) comes back a few cards later, not at the very end.
      const back = updated.due.getTime() <= at.getTime() + 20 * 60 * 1000;
      const queue = back ? [...rest.slice(0, 3), currentId, ...rest.slice(3)] : rest;
      const first = !session.seen.includes(currentId);
      const nextFresh = wasNew ? { ...fresh, [day]: (fresh[day] ?? 0) + 1 } : fresh;
      setHistory((h) => [...h, { deck, session, fresh }]);
      setDeck(nextDeck);
      setFresh(nextFresh);
      setSession({
        ...session,
        queue,
        inRound: session.inRound + 1,
        graded: session.graded + 1,
        firsts: session.firsts + (first ? 1 : 0),
        recalled: session.recalled + (first && g >= Rating.Good ? 1 : 0),
        seen: first ? [...session.seen, currentId] : session.seen,
      });
      setFlipped(false);
      setNow(at);
      const log = { ...(state.deck?.log ?? {}) };
      log[day] = (log[day] ?? 0) + 1;
      update("deck", storeDeck(nextDeck, log, state.deck, nextFresh));
    },
    [deck, session, currentId, fresh, state.deck, update],
  );

  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setDeck(last.deck);
    setSession(last.session);
    setFresh(last.fresh);
    setFlipped(true);
    update("deck", storeDeck(last.deck, state.deck?.log ?? {}, state.deck, last.fresh));
  }, [history, state.deck, update]);

  const nextRound = useCallback(() => setSession((s) => (s ? { ...s, round: s.round + 1, inRound: 0 } : s)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.repeat) return; // a held key must not flip and grade in one press
      const go = e.key === " " || e.key === "Enter";
      if (e.key === "u" || e.key === "U") return undo();
      if (resting) {
        if (go) {
          e.preventDefault();
          nextRound();
        }
        return;
      }
      if (!currentId) return;
      if (go) {
        e.preventDefault();
        if (!flipped) flip();
        else if (performance.now() - flippedAt.current > 300) grade(Rating.Good);
      } else if (flipped && ["1", "2", "3", "4"].includes(e.key)) {
        grade(Number(e.key) as Grade);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentId, flipped, flip, grade, resting, nextRound, undo]);

  const left = session?.queue.length ?? 0;
  const contentModule = content ? modules.find((m) => m.id === content.moduleId) : undefined;
  const courseTitle = courseById(contentModule?.courseId ?? "")?.title ?? "Your cards";
  const here = contentModule ? (contentModule.kind === "section" ? `Section ${contentModule.number}` : contentModule.title) : "";
  const roundSize = session ? Math.min(ROUND, session.inRound + left) : ROUND;

  return (
    <div className="alm-focus flex min-h-dvh w-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EEEBF7] bg-white px-4 sm:h-[60px] sm:gap-3.5 sm:px-6" style={{ viewTransitionName: "focus-bar" }}>
        <Link href="/app" aria-label="End review" className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline text-ink hover:bg-mist sm:h-10 sm:w-10">
          <XIcon size={16} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="hidden truncate text-[11.5px] font-bold text-violet-700 sm:block">{courseTitle}{session && session.graded + left > ROUND ? ` · Round ${session.round}` : ""}</span>
          <span className="truncate font-display text-[15px] font-bold text-ink" aria-live="polite">
            {!session ? "Loading…" : left === 0 ? "Flashcards · done for today" : `Flashcards${here ? ` · ${here}` : ""}`}
          </span>
        </div>
        {session && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FFE9DC] px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-[#A8430A]">{left} due</span>
            <span className="hidden rounded-full bg-mint px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-correct sm:inline">{state.deck?.log?.[dayKey()] ?? 0} reviewed today</span>
          </div>
        )}
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          aria-label="Undo last answer"
          title="Undo (U)"
          className="grid h-10 w-10 flex-none place-items-center rounded-full text-ink-muted hover:bg-mist disabled:opacity-30"
        >
          <UndoIcon size={17} />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col px-4 pt-4 sm:px-0 sm:pt-8">
      {session && left > 0 && (
        <div className="mb-3 flex items-center gap-3">
          <div aria-hidden="true" className="flex flex-1 gap-1">
            {Array.from({ length: roundSize }, (_, i) => (
              <span key={i} className={`h-[5px] flex-1 rounded-full transition-colors duration-300 ${i < session.inRound ? "bg-violet" : i === session.inRound && !resting ? "bg-violet-300" : "bg-[#EFEDF5]"}`} />
            ))}
          </div>
          <span className="text-[12px] font-bold whitespace-nowrap text-ink-muted">{left} left · about {minutes(left)} min</span>
        </div>
      )}
      <main className="flex flex-1 flex-col gap-3 pb-[max(16px,env(safe-area-inset-bottom))] sm:justify-center sm:pb-16">
        {!session || !deck ? null : resting ? (
          <Breather session={session} onContinue={nextRound} />
        ) : !content ? (
          <Finished deck={deck} session={session} />
        ) : (
          <>
            <FlashCard
              key={`${content.id}-${session.graded}`}
              section={/^\d+\.\d+ /.test(content.topic) || content.topic === "Word parts" ? content.topic : sectionLabel(content.moduleId)}
              front={content.front}
              back={content.back}
              detail={content.detail}
              source={content.source?.startsWith("McCance") ? BOOK : content.source}
              flipped={flipped}
              onFlip={flip}
              onSwipe={(g) => grade(g)}
            />

            {/* One action spot: the same place before and after the flip, so the hand never travels. */}
            <div className="flex min-h-[90px] flex-col justify-start gap-2 pt-1">
              {flipped && intervals ? (
                <>
                  <div className="grid grid-cols-4 gap-2 motion-safe:animate-[fade-in_200ms_ease-out]" role="group" aria-label="How well did you recall it?">
                    {grades.map((g) => (
                      <button
                        key={g.grade}
                        type="button"
                        onClick={() => grade(g.grade)}
                        aria-keyshortcuts={String(g.grade)}
                        className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-[12px] sm:h-[60px] sm:rounded-[14px] ${g.tone} hover:brightness-[.96] ${g.grade === Rating.Good ? "ring-2 ring-violet/25" : ""}`}
                      >
                        <span className="text-[15px] font-bold">{g.label}</span>
                        <span className="text-[11.5px] font-semibold opacity-85">{intervals[g.grade]}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-ink-muted">
                    <span className="hidden sm:inline">Space = Good · 1–4 to choose · U to undo</span>
                    <span className="sm:hidden">{session.graded < 3 ? "Swipe right for Good, left for Again" : "How well did you recall it?"}</span>
                  </p>
                </>
              ) : (
                <>
                  <button type="button" onClick={flip} className="h-[52px] rounded-[12px] bg-violet text-[15px] font-bold text-white hover:bg-[#4A2DE6] sm:mx-auto sm:h-12 sm:w-[240px]">
                    Show answer
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </main>
      </div>
    </div>
  );
}

/**
 * The card. Before the flip the question fills it. On the flip the question
 * shrinks to a line at the top and the answer expands into the space it left,
 * so the eye stays in one place. Once flipped, a swipe grades (right Good, left Again).
 */
function FlashCard({
  section,
  front,
  back,
  detail,
  source,
  flipped,
  onFlip,
  onSwipe,
}: {
  section: string;
  front: string;
  back: string;
  detail?: string;
  source?: string;
  flipped: boolean;
  onFlip: () => void;
  onSwipe: (g: Grade) => void;
}) {
  const [dx, setDx] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const onDown = (e: React.PointerEvent) => {
    if (!flipped || e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY };
    dragged.current = false;
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const x = e.clientX - start.current.x;
    if (!dragged.current && Math.abs(x) > 8 && Math.abs(x) > Math.abs(e.clientY - start.current.y)) {
      dragged.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (dragged.current) setDx(x);
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (dx > SWIPE) onSwipe(Rating.Good);
    else if (dx < -SWIPE) onSwipe(Rating.Again);
    else setDx(0);
  };
  const pull = Math.min(1, Math.abs(dx) / SWIPE);

  return (
    <section
      aria-label="Flashcard"
      onClick={() => !flipped && onFlip()}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ transform: dx ? `translateX(${dx}px) rotate(${dx / 30}deg)` : undefined, touchAction: flipped ? "pan-y" : undefined }}
      className={`relative flex max-h-[580px] min-h-[310px] flex-1 flex-col overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_18px_40px_rgba(42,27,120,.08)] motion-safe:animate-card-in sm:min-h-[380px] sm:flex-none ${dx ? "" : "transition-transform duration-200"} ${flipped ? "" : "cursor-pointer"}`}
    >
      {dx !== 0 && (
        <>
          <span aria-hidden="true" style={{ opacity: pull * 0.55 }} className={`pointer-events-none absolute inset-0 ${dx > 0 ? "bg-mint" : "bg-rose"}`} />
          <span
            aria-hidden="true"
            style={{ opacity: pull }}
            className={`pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm font-bold ${dx > 0 ? "text-mint-ink" : "text-rose-ink"}`}
          >
            {dx > 0 ? "Good →" : "← Again"}
          </span>
        </>
      )}

      <div className="relative flex items-center justify-between gap-3 px-[22px] pt-5 sm:px-11 sm:pt-10">
        <span className="text-[11px] font-extrabold tracking-[.14em] text-ink-muted">{flipped ? "ANSWER" : "QUESTION"}</span>
        <span className="hidden min-w-0 truncate text-[11px] font-extrabold tracking-[.12em] text-ink-muted uppercase sm:block">{section}</span>
      </div>

      {/*
        Shrink and expand, as one group centred in the card: before the flip the question
        fills it; on the flip the question shrinks and the answer opens directly beneath it,
        so the eye moves a few lines down, not across the card. Left-aligned in both states.
      */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-[22px] py-5 sm:px-11">
        <h2
          className={`font-display transition-[font-size,line-height,color] duration-300 ease-out motion-reduce:transition-none ${flipped ? "text-[17px] leading-snug font-semibold text-ink-muted" : `${frontSize(front)} font-bold tracking-[-.02em] text-ink`}`}
        >
          {front}
        </h2>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none" style={{ gridTemplateRows: flipped ? "1fr" : "0fr" }}>
          <div className="min-h-0 overflow-hidden">
            <div aria-live="polite" className={`flex flex-col gap-2.5 pt-4 transition-opacity duration-200 ease-out motion-reduce:transition-none ${flipped ? "opacity-100 delay-100" : "opacity-0"}`}>
              <span aria-hidden="true" className="mb-1 border-t-2 border-dashed border-hairline" />
              {flipped && (
                <>
                  <p className={`font-display font-semibold ${backSize(back)}`}>{back}</p>
                  {detail && <p className="text-[15px] leading-relaxed text-ink-body">{detail}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <p aria-hidden={flipped} className={`relative px-[22px] text-center text-[12.5px] text-ink-muted ${flipped ? "hidden" : "pb-5 sm:pb-9"}`}>
        <span className="sm:hidden">Tap the card or press Space to show the answer</span>
        <span className="hidden sm:inline">Click the card or press Space to show the answer</span>
      </p>
      {flipped && <p className={`relative px-[22px] pb-5 text-xs text-ink-muted transition-opacity duration-300 sm:px-11 sm:pb-8 ${source ? "opacity-100" : "opacity-0"}`}>{source || "\u00a0"}</p>}
    </section>
  );
}

function Breather({ session, onContinue }: { session: Session; onContinue: () => void }) {
  const left = session.queue.length;
  return (
    <section className="flex max-h-[560px] flex-1 flex-col justify-center gap-5 rounded-[20px] border border-hairline bg-white p-7 shadow-[0_18px_40px_rgba(42,27,120,.08)] motion-safe:animate-card-in sm:flex-none sm:p-11" aria-live="polite">
      <p className="text-[11px] font-extrabold tracking-[.14em] text-violet-700 uppercase">Round {session.round} done</p>
      <h1 className="font-display text-[30px] leading-tight font-semibold">Good place for a breath.</h1>
      <p className="text-ink-body">
        {session.firsts > 0 && `You recalled ${session.recalled} of ${session.firsts} on the first try. `}
        Everything so far is saved, so you can stop here and the rest waits for you.
      </p>
      <p className="font-display text-[17px] font-semibold">
        {left} left · about {minutes(left)} min
      </p>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button type="button" onClick={onContinue} className="h-12 rounded-[12px] bg-violet px-7 font-bold text-white hover:bg-[#4A2DE6]">
          Keep going
        </button>
        <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-[12px] border-[1.5px] border-[#D9D2F3] bg-white px-7 font-bold text-violet-deep hover:bg-mist">
          Stop for now
        </Link>
      </div>
    </section>
  );
}

function Finished({ deck, session }: { deck: Deck; session: Session }) {
  const next = nextDueDate(deck);
  const now = new Date();
  const reviewed = session.seen.length;
  return (
    <section className="mt-2 flex flex-col items-start gap-4 rounded-[20px] border border-hairline bg-white p-7 shadow-[0_18px_40px_rgba(42,27,120,.08)] motion-safe:animate-card-in sm:p-11">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-correct" aria-hidden="true">
        <CheckIcon size={26} />
      </span>
      <h1 className="font-display text-[30px] leading-tight font-semibold">
        {reviewed > 0 ? `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed` : "You're all caught up"}
      </h1>
      {reviewed > 0 && (
        <p className="text-ink-body">
          You recalled {session.recalled} of {session.firsts} on the first try.
        </p>
      )}
      <p className="text-ink-body">
        {next && next.getTime() > now.getTime()
          ? `The next card comes back in ${formatInterval(next, now)}. Coming back then keeps today's work from fading.`
          : "Nothing else is due right now."}
      </p>
      {(session.waiting > 0 || session.locked > 0) && (
        <ul className="flex flex-col gap-1.5 text-[15px] text-ink-muted">
          {session.waiting > 0 && <li>{session.waiting} new cards wait for tomorrow. A few new cards a day keeps every session short.</li>}
          {session.locked > 0 && <li>{session.locked} cards open as you start their sections.</li>}
        </ul>
      )}
      <div className="flex flex-wrap gap-2.5">
        <Link href="/app" className="inline-flex h-12 items-center rounded-[12px] bg-violet px-6 font-bold text-white hover:bg-[#4A2DE6]">
          Back to Today
        </Link>
      </div>
    </section>
  );
}

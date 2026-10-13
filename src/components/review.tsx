"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckIcon, UndoIcon, XIcon } from "@/components/icons";
import { dayKey, dueCardIds, formatInterval, gradeCard, grades, nextDueDate, previewIntervals, reviveDeck, storeDeck, type Deck } from "@/lib/deck";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";
import type { Grade } from "ts-fsrs";

type Session = { queue: string[]; total: number; done: number };

/** Flashcard review with FSRS scheduling, saved to the student's account. */
export function Review() {
  const { state, update } = useStudent();
  const { cards } = useCourse();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [history, setHistory] = useState<{ deck: Deck; session: Session }[]>([]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const d = reviveDeck(state.deck, cards.map((c) => c.id));
    const queue = dueCardIds(d);
    setDeck(d);
    setSession({ queue, total: queue.length, done: 0 });
    // Load once per visit; later saves must not reshuffle the queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentId = session?.queue[0];
  const content = useMemo(() => cards.find((c) => c.id === currentId), [currentId, cards]);
  const intervals = useMemo(() => (deck && currentId ? previewIntervals(deck[currentId], now) : null), [deck, currentId, now]);

  const grade = useCallback(
    (g: Grade) => {
      if (!deck || !session || !currentId) return;
      const at = new Date();
      const updated = gradeCard(deck[currentId], g, at);
      const nextDeck = { ...deck, [currentId]: updated };
      const rest = session.queue.slice(1);
      // Cards that come back within this session (e.g. "Again" = minutes) go to the end of the queue.
      const sessionCutoff = at.getTime() + 20 * 60 * 1000;
      const requeue = updated.due.getTime() <= sessionCutoff ? [...rest, currentId] : rest;
      setHistory((h) => [...h, { deck, session }]);
      setDeck(nextDeck);
      setSession({ queue: requeue, total: session.total, done: session.done + (requeue.length < session.queue.length ? 1 : 0) });
      setFlipped(false);
      setNow(at);
      const log = { ...(state.deck?.log ?? {}) };
      log[dayKey(at)] = (log[dayKey(at)] ?? 0) + 1;
      update("deck", storeDeck(nextDeck, log, state.deck));
    },
    [deck, session, currentId, state.deck, update],
  );

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setDeck(last.deck);
    setSession(last.session);
    setFlipped(true);
    update("deck", storeDeck(last.deck, state.deck?.log ?? {}, state.deck));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!currentId || e.target instanceof HTMLInputElement) return;
      if (e.key === " " || e.key === "Enter") {
        if (!flipped) {
          e.preventDefault();
          setFlipped(true);
        }
      } else if (flipped && ["1", "2", "3", "4"].includes(e.key)) {
        grade(Number(e.key) as Grade);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentId, flipped, grade]);

  const progress = session && session.total > 0 ? (session.done / session.total) * 100 : 0;

  return (
    <>
      <header className="px-4 pt-3.5 pb-2.5 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <Link href="/app" aria-label="End review" className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-ink hover:bg-mist">
              <XIcon size={18} />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-violet-600">Card review</p>
              <p className="font-display text-[17px] font-semibold" aria-live="polite">
                {session ? (session.total === 0 ? "Nothing due" : `${Math.min(session.done + 1, session.total)} of ${session.total}`) : "Loading…"}
              </p>
            </div>
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0}
              aria-label="Undo last answer"
              className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-ink-muted hover:bg-mist disabled:opacity-40"
            >
              <UndoIcon size={18} />
            </button>
          </div>
          <div aria-hidden="true" className="h-2 overflow-hidden rounded bg-hairline">
            <div className="h-full rounded bg-violet transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-110px)] max-w-xl flex-col gap-3.5 px-4 pb-8 sm:px-6">
        {!session || !deck ? null : !content ? (
          <Finished deck={deck} reviewed={session.done} />
        ) : (
          <>
            <span className="self-start rounded-full bg-lilac px-3 py-1 text-xs font-bold text-violet-700">{content.topic}</span>

            <button
              type="button"
              onClick={() => setFlipped(true)}
              disabled={flipped}
              aria-label={flipped ? undefined : "Show answer"}
              className="relative flex min-h-[380px] flex-1 flex-col gap-4 overflow-hidden rounded-tile bg-white px-[22px] py-[26px] text-left disabled:cursor-default"
            >
              <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true" className="absolute -right-10 -bottom-10">
                <circle cx="70" cy="70" r="70" fill="var(--color-mist)" />
                <circle cx="58" cy="58" r="14" fill="var(--color-peach)" />
              </svg>
              <span className="flex flex-col gap-2">
                <span className="text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">Question</span>
                <span className="font-display text-[22px] leading-snug font-medium">{content.front}</span>
              </span>
              {flipped ? (
                <>
                  <span aria-hidden="true" className="border-t-2 border-dashed border-hairline" />
                  <span className="relative flex flex-col gap-2" aria-live="polite">
                    <span className="text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">Answer</span>
                    <span className="font-display text-[34px] leading-tight font-semibold text-violet-600">{content.back}</span>
                    {content.detail && <span className="text-[15px] leading-relaxed text-ink-body">{content.detail}</span>}
                  </span>
                  <span className="relative mt-auto text-xs text-ink-muted">{content.source}</span>
                </>
              ) : (
                <span className="relative mt-auto self-center rounded-full bg-lilac px-4 py-2 text-sm font-bold text-violet-700">Tap to show the answer</span>
              )}
            </button>

            {flipped && intervals ? (
              <>
                <p className="text-center text-[13px] font-semibold text-ink-muted">How well did you recall it?</p>
                <div className="grid grid-cols-4 gap-2">
                  {grades.map((g) => (
                    <button
                      key={g.grade}
                      type="button"
                      onClick={() => grade(g.grade)}
                      className={`flex min-h-[66px] flex-col items-center justify-center gap-0.5 rounded-[18px] ${g.tone} hover:brightness-95`}
                    >
                      <span className="text-[15px] font-bold">{g.label}</span>
                      <span className="text-xs font-semibold">{intervals[g.grade]}</span>
                    </button>
                  ))}
                </div>
                <p className="hidden text-center text-xs text-ink-muted sm:block">Keys 1–4 to answer</p>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="min-h-[56px] rounded-full bg-violet font-bold text-white hover:bg-violet-600"
              >
                Show answer
              </button>
            )}
          </>
        )}
      </main>
    </>
  );
}

function Finished({ deck, reviewed }: { deck: Deck; reviewed: number }) {
  const next = nextDueDate(deck);
  const now = new Date();
  return (
    <section className="mt-6 flex flex-col items-start gap-4 rounded-tile bg-white p-7">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-correct" aria-hidden="true">
        <CheckIcon size={26} />
      </span>
      <h1 className="font-display text-[30px] leading-tight font-semibold">
        {reviewed > 0 ? `${reviewed} card${reviewed === 1 ? "" : "s"} reviewed` : "You're all caught up"}
      </h1>
      <p className="text-ink-body">
        {next && next.getTime() > now.getTime()
          ? `The next card comes back in ${formatInterval(next, now)}. Coming back then keeps today's work from fading.`
          : "Nothing else is due right now."}
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Link href="/app" className="inline-flex min-h-[52px] items-center rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">
          Back to Today
        </Link>

      </div>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { cardQueue, dayKey, NEW_PER_DAY, reviveDeck } from "@/lib/deck";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";
import { lessons } from "@/content/course";

const moduleOfLesson = new Map(lessons.map((l) => [l.id, l.moduleId]));

/**
 * The student's card queue for today, shared by the review screen, the nav
 * badge and the Today tiles so every count agrees. A section's cards open
 * once the student has completed a page in it (all of them in preview).
 */
export function useCardQueue() {
  const { state, preview } = useStudent();
  const { cards } = useCourse();
  return useMemo(() => {
    const deck = reviveDeck(state.deck, cards.map((c) => c.id));
    const started = new Set(Object.keys(state.lessons ?? {}).map((id) => moduleOfLesson.get(id)));
    const moduleOfCard = new Map(cards.map((c) => [c.id, c.moduleId]));
    const unlocked = (id: string) => preview || started.has(moduleOfCard.get(id));
    const newToday = state.deck?.fresh?.[dayKey()] ?? 0;
    return { deck, unlocked, newToday, ...cardQueue(deck, unlocked, NEW_PER_DAY - newToday) };
  }, [state.deck, state.lessons, cards, preview]);
}

/** Cards in today's queue. */
export function useDueCount() {
  return useCardQueue().queue.length;
}

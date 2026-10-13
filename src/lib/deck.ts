import { createEmptyCard, fsrs, generatorParameters, Rating, type Card as FsrsCard, type Grade } from "ts-fsrs";

/**
 * Spaced-repetition scheduling (FSRS). Card states are saved per student
 * (Supabase key "deck") with a copy on this device for offline use.
 */

export const scheduler = fsrs(generatorParameters({ enable_fuzz: false, enable_short_term: true }));

export type Deck = Record<string, FsrsCard>;
type StoredCard = Omit<FsrsCard, "due" | "last_review"> & { due: string; last_review?: string };
export type StoredDeck = { cards: Record<string, StoredCard>; log: Record<string, number> };

export function reviveDeck(stored: StoredDeck | null | undefined, cardIds: string[], now = new Date()): Deck {
  const deck: Deck = {};
  for (const id of cardIds) {
    const s = stored?.cards?.[id];
    deck[id] = s ? { ...s, due: new Date(s.due), last_review: s.last_review ? new Date(s.last_review) : undefined } : createEmptyCard(now);
  }
  return deck;
}

export function storeDeck(deck: Deck, log: Record<string, number>, previous?: StoredDeck | null): StoredDeck {
  const cards: Record<string, StoredCard> = { ...(previous?.cards ?? {}) };
  for (const [id, c] of Object.entries(deck)) {
    // Untouched new cards need no storage.
    if (c.reps === 0 && !previous?.cards?.[id]) continue;
    cards[id] = { ...c, due: c.due.toISOString(), last_review: c.last_review?.toISOString() };
  }
  return { cards, log };
}

export function dueCardIds(deck: Deck, now = new Date()): string[] {
  return Object.entries(deck)
    .filter(([, c]) => c.due.getTime() <= now.getTime())
    .map(([id]) => id);
}

export function nextDueDate(deck: Deck): Date | null {
  const dates = Object.values(deck).map((c) => c.due.getTime());
  return dates.length ? new Date(Math.min(...dates)) : null;
}

export function formatInterval(due: Date, now: Date): string {
  const minutes = Math.round((due.getTime() - now.getTime()) / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days} day${days === 1 ? "" : "s"}`;
  return `${Math.round(days / 30)} mo`;
}

export const grades: { grade: Grade; label: string; tone: string }[] = [
  { grade: Rating.Again, label: "Again", tone: "bg-rose text-rose-ink" },
  { grade: Rating.Hard, label: "Hard", tone: "bg-peach text-peach-ink" },
  { grade: Rating.Good, label: "Good", tone: "bg-mint text-mint-ink" },
  { grade: Rating.Easy, label: "Easy", tone: "bg-lilac text-violet-700" },
];

export function previewIntervals(card: FsrsCard, now: Date): Record<number, string> {
  const preview = scheduler.repeat(card, now);
  const out: Record<number, string> = {};
  for (const { grade } of grades) out[grade] = formatInterval(preview[grade].card.due, now);
  return out;
}

export function gradeCard(card: FsrsCard, grade: Grade, now: Date): FsrsCard {
  return scheduler.next(card, now, grade).card;
}

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Learner quotes, held behind a consent gate (iteration 3, product-studio/ITERATION_3_FINETUNE.md).
 *
 * Almanac shows a learner's words only after that learner has agreed in writing
 * to be quoted, with the date the consent was recorded. There are none yet, so
 * every caller passes nothing and this renders nothing. Do not add placeholder,
 * paraphrased or invented quotes: an empty section is honest, a made-up one is not.
 */
export type ConsentedQuote = Readonly<{
  quote: string;
  /** As the learner asked to be named, e.g. "Graduate nursing student". */
  attribution: string;
  /** ISO date the written consent was recorded. Required: no date, no quote. */
  consentRecordedOn: string;
}>;

export function TestimonialsSlot({ quotes = [] }: { quotes?: readonly ConsentedQuote[] }) {
  const shown = quotes.filter((q) => q.quote.trim() && q.attribution.trim() && /^\d{4}-\d{2}-\d{2}$/.test(q.consentRecordedOn));
  if (shown.length === 0) return null;
  return (
    <section aria-label="What learners say" className="mt-8">
      <ul className="grid gap-3 md:grid-cols-2">
        {shown.map((q) => (
          <li key={q.quote} className="rounded-section border border-border bg-canvas p-5">
            <blockquote className="text-[15px] leading-[1.6] text-text-body">&ldquo;{q.quote}&rdquo;</blockquote>
            <p className="mt-3 text-[12.5px] font-semibold text-text-muted">{q.attribution}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

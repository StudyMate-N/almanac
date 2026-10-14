import type { Block, DiagramItem } from "@/content/types";

type D = Extract<Block, { t: "diagram" }>;

/** Severity ramp for chains such as infection → septic shock. */
const RAMP = ["bg-white", "bg-lilac", "bg-peach", "bg-rose"];

function Box({ it, n, tone = "bg-white" }: { it: DiagramItem; n?: number; tone?: string }) {
  return (
    <div className={`flex h-full flex-col gap-1 rounded-2xl p-3 ${tone}`}>
      {n !== undefined && <span className="text-[11px] font-extrabold tracking-[.06em] text-violet-600 uppercase">Step {n}</span>}
      <span className="font-display text-[15px] leading-snug font-semibold text-ink">{it.label}</span>
      {it.sub && <span className="text-[13px] leading-snug text-ink-body">{it.sub}</span>}
      {it.tag && <span className="mt-auto self-start rounded-full bg-rose px-2.5 py-0.5 text-[12px] font-bold text-rose-ink">{it.tag}</span>}
    </div>
  );
}

/** Steps in a row (a column on phones) with arrows between them. */
function Steps({ items, numbered, ramp }: { items: DiagramItem[]; numbered?: boolean; ramp?: boolean }) {
  return (
    <ol className="grid gap-6 sm:auto-cols-fr sm:grid-flow-col sm:gap-5">
      {items.map((it, i) => (
        <li key={it.label} className="relative">
          <Box it={it} n={numbered ? i + 1 : undefined} tone={ramp ? RAMP[Math.min(i, RAMP.length - 1)] : "bg-white"} />
          {i < items.length - 1 && (
            <span aria-hidden="true" className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[16px] font-bold text-violet-600 sm:top-1/2 sm:-right-[15px] sm:bottom-auto sm:left-auto sm:translate-x-0 sm:-translate-y-1/2">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Loop({ d }: { d: D }) {
  return (
    <>
      <Steps items={d.items} numbered />
      <p className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 px-3 py-2 text-[13.5px] font-semibold text-violet-700">
        <span aria-hidden="true" className="text-[18px]">↺</span>
        {d.feedback ?? `Back to step 1`}
      </p>
    </>
  );
}

function Chain({ d }: { d: D }) {
  return (
    <>
      <Steps items={d.items} ramp={!d.feedback} />
      {d.feedback && (
        <p className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-incorrect/40 px-3 py-2 text-[13.5px] font-semibold text-rose-ink">
          <span aria-hidden="true" className="text-[18px]">↩</span>
          {d.feedback}
        </p>
      )}
    </>
  );
}

function Quad({ d }: { d: D }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {d.items.map((it) => (
        <div key={it.label} className="flex flex-col gap-1 rounded-2xl bg-white p-3.5">
          <span className="font-display text-[15px] font-semibold text-ink">{it.label}</span>
          {it.sub && <span className="font-display text-[19px] font-semibold text-violet-700">{it.sub}</span>}
          {it.tag && <span className="text-[13px] text-ink-body">{it.tag}</span>}
        </div>
      ))}
    </div>
  );
}

function Columns({ d }: { d: D }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {(d.columns ?? []).map((c) => (
        <div key={c.title} className="flex flex-col gap-1.5 rounded-2xl bg-white p-3.5">
          <span className="font-display text-[16px] font-semibold text-ink">{c.title}</span>
          <ol className="flex flex-col gap-1">
            {c.steps.map((s, i) => (
              <li key={s} className="flex flex-col items-start">
                {i > 0 && (
                  <span aria-hidden="true" className="pl-3 text-[14px] font-bold text-violet-600">
                    ↓
                  </span>
                )}
                <span className={`rounded-xl px-3 py-2 text-[13.5px] leading-snug ${i === c.steps.length - 1 ? "bg-rose text-ink" : "bg-lilac text-ink"}`}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

function Membrane({ d }: { d: D }) {
  const [left, right] = d.items;
  return (
    <div className="grid items-stretch gap-2.5 sm:grid-cols-[1fr_auto_1fr]">
      {left && <Box it={left} tone="bg-rose" />}
      <div className="flex flex-col justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-300 bg-white/60 p-3 sm:w-[210px]">
        <span className="text-center text-[11px] font-extrabold tracking-[.06em] text-violet-600 uppercase">Semipermeable membrane</span>
        {(d.flows ?? []).map((f) => (
          <div key={f.label} className="flex flex-col">
            <span className="text-[13.5px] font-bold text-ink">
              {f.label} <span aria-hidden="true" className="text-violet-600">→</span>
            </span>
            {f.sub && <span className="text-[12.5px] leading-snug text-ink-body">{f.sub}</span>}
          </div>
        ))}
      </div>
      {right && <Box it={right} tone="bg-sky" />}
    </div>
  );
}

/** Rule-of-nines body map: front view carries every region but the back of the trunk. */
function Nines({ d }: { d: D }) {
  const v = (key: string) => d.items.find((i) => i.key === key)?.sub ?? "";
  const on = "var(--color-violet-200)";
  const off = "var(--color-track)";
  const ink = "var(--color-violet-deep)";
  const figure = (back: boolean) => (
    <svg viewBox="0 0 160 300" className="h-auto w-full max-w-[170px]" aria-hidden="true">
      <g stroke={ink} strokeWidth="1.5">
        <circle cx="80" cy="30" r="22" fill={back ? off : on} />
        <rect x="52" y="56" width="56" height="94" rx="10" fill={back ? on : on} />
        <rect x="24" y="60" width="24" height="96" rx="11" fill={back ? off : on} />
        <rect x="112" y="60" width="24" height="96" rx="11" fill={back ? off : on} />
        <rect x="54" y="156" width="24" height="132" rx="11" fill={back ? off : on} />
        <rect x="82" y="156" width="24" height="132" rx="11" fill={back ? off : on} />
        {!back && <rect x="72" y="146" width="16" height="14" rx="4" fill="var(--color-peach)" />}
      </g>
      <g fill={ink} fontFamily="var(--font-display, inherit)" fontWeight="600" fontSize="15" textAnchor="middle">
        {back ? (
          <text x="80" y="108">{v("trunk-back")}</text>
        ) : (
          <>
            <text x="80" y="35">{v("head")}</text>
            <text x="80" y="108">{v("trunk-front")}</text>
            <text x="36" y="113">{v("arm")}</text>
            <text x="124" y="113">{v("arm")}</text>
            <text x="66" y="230">{v("leg")}</text>
            <text x="94" y="230">{v("leg")}</text>
            <text x="80" y="157" fontSize="11">{v("perineum")}</text>
          </>
        )}
      </g>
    </svg>
  );
  return (
    <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-[1fr_1fr_1.2fr]">
      <div className="flex flex-col items-center gap-1">
        {figure(false)}
        <span className="text-[13px] font-bold text-ink">Front</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        {figure(true)}
        <span className="text-[13px] font-bold text-ink">Back</span>
      </div>
      <ul className="col-span-2 flex flex-col gap-1 rounded-2xl bg-white p-3 text-[13.5px] sm:col-span-1">
        {d.items.map((it) => (
          <li key={it.label} className="flex justify-between gap-3">
            <span className="text-ink-body">{it.label}</span>
            <span className="font-bold text-violet-700">{it.sub}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A page diagram: real text labels on the course palette, framed like an image figure. */
export function Diagram({ d }: { d: D }) {
  const body = { loop: Loop, chain: Chain, quad: Quad, columns: Columns, membrane: Membrane, nines: Nines }[d.layout];
  return (
    <figure role="group" aria-label={d.alt} className="flex flex-col gap-3 rounded-card bg-mist p-[14px_14px_16px]">
      <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">{d.title}</p>
      {body && body({ d })}
      {d.note && <figcaption className="text-[13.5px] leading-snug text-ink-body">{d.note}</figcaption>}
    </figure>
  );
}

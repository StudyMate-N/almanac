"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRightIcon, CardsIcon } from "@/components/icons";
import { VideoPlayer } from "@/components/video-player";
import { cardById, imageById, questionById } from "@/content/course";
import { type Clip, clipById } from "@/content/patho";
import { BOOK } from "@/content/patho/author";
import type { Block, Card, Question } from "@/content/types";
import { useStudent } from "@/lib/store";
import { Diagram } from "./diagram";
import { CheckGroup } from "./topic-check";
import { QuizBlock } from "./quiz";

const Html = ({ html, className }: { html: string; className?: string }) => <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;

/** Reading references read heading first, page numbers last ("pp. 12–20: Heading" → "Heading · pp. 12–20"). */
const citeRef = (ref: string) => {
  const m = ref.match(/^(pp?\. [^:]+):\s*(.+)$/);
  return m ? `${m[2]} · ${m[1]}` : ref;
};

export const toSec = (t: string) => t.split(":").reduce((a, b) => a * 60 + Number(b), 0);

/** The reviewer's corrections to a clip, each with a link that seeks to it. */
export function Corrections({ clip, seek }: { clip: Clip; seek: (at: string) => void }) {
  if (!clip.corrections.length) return null;
  return (
    <details className="rounded-[14px] border border-hairline bg-white px-4 py-3 text-[14px]">
      <summary className="cursor-pointer font-bold text-violet-700">
        {clip.corrections.length} correction{clip.corrections.length > 1 ? "s" : ""} to this clip
      </summary>
      <ul className="mt-3 flex flex-col gap-2.5">
        {clip.corrections.map((c) => (
          <li key={c.at} className="rounded-2xl bg-white p-3.5">
            <button onClick={() => seek(c.at)} className="mb-1 rounded-full bg-mist px-2.5 py-0.5 text-xs font-bold text-violet-700">
              At {c.at}
            </button>
            <p className="text-ink-muted line-through decoration-1">{c.said}</p>
            <p className="mt-1">{c.correct}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ClipBlock({ clip: id, note }: { clip: string; note?: string }) {
  const clip = clipById(id);
  const video = useRef<HTMLVideoElement>(null);
  if (!clip) return null;
  const seek = (at: string) => {
    if (video.current) {
      video.current.currentTime = toSec(at);
      void video.current.play();
    }
  };
  return (
    <figure className="flex flex-col gap-3">
      <VideoPlayer ref={video} video={clip.id} title={clip.title} label={`Video: ${clip.title}`} />
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-1">
        <span className="font-display text-[17px] font-semibold">{clip.title}</span>
        <span className="rounded-full bg-white px-3 py-0.5 text-[13px] font-semibold text-ink-muted">Course video · {clip.duration}</span>
      </figcaption>
      {note && <p className="px-1 text-[15px] text-ink-body">{note}</p>}
      <Corrections clip={clip} seek={seek} />
    </figure>
  );
}

function CardsBlock({ title, cards }: { title: string; cards: Card[] }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  if (!cards.length) return null;
  const c = cards[i];
  const go = (n: number) => {
    setFlip(false);
    setI((n + cards.length) % cards.length);
  };
  return (
    <section aria-label={title} className="rounded-tile bg-lilac p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-display text-[18px] font-semibold text-violet-deep">
          <CardsIcon /> {title}
        </p>
        <span className="text-sm font-bold text-violet-700">
          {i + 1} / {cards.length}
        </span>
      </div>
      <button
        onClick={() => setFlip((f) => !f)}
        aria-label={flip ? "Show the question side" : "Show the answer"}
        className={`grid min-h-[168px] w-full place-items-center rounded-card p-6 text-center transition-colors ${flip ? "bg-violet text-white" : "bg-white text-ink"}`}
      >
        <span className="flex flex-col gap-2">
          <span className={`text-xs font-bold tracking-wide uppercase ${flip ? "text-violet-on" : "text-ink-faint"}`}>{flip ? "Answer" : "Tap to reveal"}</span>
          <span className="font-display text-[21px] leading-snug font-semibold">{flip ? c.back : c.front}</span>
          {flip && c.detail && <span className="text-[15px] text-violet-on">{c.detail}</span>}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button onClick={() => go(i - 1)} className="min-h-11 rounded-full bg-white px-4 text-sm font-bold text-violet-700">
          Previous
        </button>
        <p className="hidden text-center text-[13px] text-violet-deep sm:block">These cards are in your review deck, scheduled so you see them just before you would forget.</p>
        <button onClick={() => go(i + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-violet px-4 text-sm font-bold text-white">
          Next <ArrowRightIcon size={14} />
        </button>
      </div>
    </section>
  );
}

export function Predict({ id, stem, options, correct, reveal, eyebrow = "Predict first · not scored", children }: { id: string; stem: string; options: { id: string; text: string }[]; correct: string; reveal: string; eyebrow?: string; children?: React.ReactNode }) {
  const { state, update } = useStudent();
  const key = `predict:${id}`;
  const pick = state.notes[key];
  const choose = (o: string) => !pick && update("notes", { ...state.notes, [key]: o });
  return (
    <section aria-label="Predict first" className="flex flex-col gap-3 rounded-tile bg-white p-[20px_22px]">
      <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">{eyebrow}</p>
      <p className="font-display text-[18px] leading-snug font-semibold">{stem}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const tone = !pick ? "border-hairline bg-mist" : o.id === correct ? "border-correct bg-mint" : o.id === pick ? "border-incorrect bg-rose" : "border-transparent bg-mist";
          return (
            <button key={o.id} onClick={() => choose(o.id)} disabled={Boolean(pick)} aria-pressed={pick === o.id} className={`min-h-[52px] flex-[1_1_160px] rounded-full border-2 px-5 text-[15px] font-bold text-ink ${tone}`}>
              {o.text}
            </button>
          );
        })}
      </div>
      {pick && (
        <p role="status" className="rounded-2xl bg-lilac px-3.5 py-3 text-[15px] leading-[1.55] text-ink-body">
          <strong className="text-violet-700">{pick === correct ? "Right." : "Not quite."}</strong> {reveal}
        </p>
      )}
      {pick && children}
    </section>
  );
}

function Figure({ id, alt, panels, aspect }: { id: string; alt: string; panels: { label: string; sub?: string }[]; aspect?: "3:1" | "3:2" }) {
  const { isVisible, isApproved, preview } = useStudent();
  const img = imageById(id);
  // Images open to students only once the reviewer has approved this exact file and caption set.
  if (!img || !isVisible(img.reviewId, img.item)) return null;
  const pending = preview && !isApproved(img.reviewId, img.item);
  return (
    <figure className="flex flex-col gap-2.5 rounded-card bg-mist p-[12px_12px_14px]">
      {/* 3:1 sources are cropped to 3.6:1 from the top: the generator leaves an empty strip below the panels. */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: aspect === "3:2" ? "2.4 / 1" : "3.6 / 1" }}>
        <Image src={`/images/patho/${id}.png`} alt={alt} fill sizes="(max-width: 800px) 100vw, 736px" className="object-cover object-top" />
        {pending && <span className="absolute top-2 left-2 rounded-full bg-peach px-3 py-1 text-xs font-bold text-peach-ink">Image awaiting review (preview)</span>}
      </div>
      <figcaption className="grid gap-2 text-center" style={{ gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))` }}>
        {panels.map((p) => (
          <span key={p.label} className="flex flex-col">
            <span className="text-[13.5px] font-bold text-ink">{p.label}</span>
            {p.sub && <span className="text-[12.5px] text-ink-muted">{p.sub}</span>}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export function TopicHead({ eq, items }: { eq?: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-tile bg-violet p-[22px_24px] text-white">
      {eq && (
        <div>
          <p className="mb-1 text-xs font-extrabold tracking-[.06em] text-violet-on uppercase">Essential question</p>
          <p className="font-display text-[22px] leading-[1.3] font-semibold">{eq}</p>
        </div>
      )}
      <div className="rounded-card bg-white/10 p-[16px_18px]">
        <p className="mb-2 text-xs font-extrabold tracking-[.06em] text-violet-on uppercase">Key points</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15.5px] leading-normal [&_strong]:font-bold">
          {items.map((it, i) => (
            <li key={i}>
              <Html html={it} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OpenPrompt({ id, stem, expert }: { id: string; stem: string; expert: string }) {
  const { state, update } = useStudent();
  const [text, setText] = useState(state.notes[id] ?? "");
  const [shown, setShown] = useState(Boolean(state.notes[id]));
  return (
    <section aria-label="Submit and compare" className="flex flex-col gap-3 rounded-tile bg-mint p-[20px_22px]">
      <p className="self-start rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-[.06em] text-mint-ink uppercase">Explain it in your own words</p>
      <p className="font-display text-[18px] leading-[1.35] font-semibold">{stem}</p>
      <label className="sr-only" htmlFor={`open-${id}`}>
        Your answer
      </label>
      <textarea
        id={`open-${id}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Two or three sentences, then compare."
        className="w-full resize-y rounded-2xl border-2 border-hairline bg-white p-3.5 text-[15px] outline-none focus:border-violet"
      />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            // As in the design: the expert answer opens once the student has written something.
            if (!text.trim()) return document.getElementById(`open-${id}`)?.focus();
            setShown(true);
            update("notes", { ...state.notes, [id]: text.trim() });
          }}
          className="min-h-12 rounded-full bg-violet px-[22px] font-bold text-white"
        >
          Compare with the expert answer
        </button>
      </div>
      {shown && (
        <div className="rounded-2xl bg-white p-[14px_16px] text-[15px] leading-relaxed text-ink-body" role="status">
          <p className="mb-1 font-bold text-mint-ink">Expert answer</p>
          <p>{expert}</p>
        </div>
      )}
    </section>
  );
}

export function BlockView({ b, pageId, visibleQ, visibleCards, onComplete, eq }: { b: Block; pageId: string; visibleQ: (q: Question) => boolean; visibleCards: (c: Card) => boolean; onComplete: () => void; eq?: string }) {
  switch (b.t) {
    case "keypoints":
      return <TopicHead eq={eq} items={b.items} />;
    case "predict":
      return <Predict id={b.id} stem={b.stem} options={b.options} correct={b.correct} reveal={b.reveal} />;
    case "diagram":
      return <Diagram d={b} />;
    case "img":
      return <Figure id={b.id} alt={b.alt} panels={b.panels} aspect={b.aspect} />;
    case "confused":
      return (
        <section aria-label="Commonly confused" className="rounded-tile bg-white p-5 sm:p-6">
          <p className="mb-3 font-display text-[18px] font-semibold">Commonly confused</p>
          <ul className="flex flex-col gap-2.5">
            {b.rows.map(([x, y, d]) => (
              <li key={x + y} className="rounded-card bg-mist p-4">
                <p className="font-display text-[16px] font-semibold">
                  {x} <span className="text-ink-muted">vs</span> {y}
                </p>
                <Html html={d} className="mt-1 block text-[15px] leading-relaxed text-ink-body" />
              </li>
            ))}
          </ul>
        </section>
      );
    case "values":
      return (
        <section aria-label="Key values" className="overflow-x-auto rounded-card border border-hairline bg-white">
          <p className="px-4 pt-3 font-display text-[18px] font-semibold">Key values</p>
          <table className="w-full border-collapse text-left text-[15px]">
            <tbody>
              {b.rows.map((r) => (
                <tr key={r[0]} className="border-t border-hairline align-top first:border-t-0">
                  <th scope="row" className="px-4 py-2.5 font-semibold text-ink">{r[0]}</th>
                  <td className="px-4 py-2.5 font-bold text-violet-700">{r[1]}</td>
                  <td className="px-4 py-2.5 text-ink-muted">{r[2] ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "h2":
      return <h2 className="mt-3 font-display text-[23px] leading-tight font-semibold">{b.text}</h2>;
    case "p":
      return <Html html={b.html} className="block text-[16.5px] leading-[1.7] text-ink-body [&_em]:italic [&_strong]:font-bold [&_strong]:text-ink" />;
    case "ul":
    case "ol": {
      const L = b.t === "ul" ? "ul" : "ol";
      return (
        <L className={`flex flex-col gap-2 pl-6 text-[16.5px] leading-[1.65] text-ink-body ${b.t === "ul" ? "list-disc marker:text-violet-300" : "list-decimal marker:font-bold marker:text-violet-600"} [&_em]:italic [&_strong]:font-bold [&_strong]:text-ink`}>
          {b.items.map((it, i) => (
            <li key={i} className="pl-1">
              <Html html={it} />
            </li>
          ))}
        </L>
      );
    }
    case "table":
      return (
        <div className="-mx-1 overflow-x-auto rounded-card border border-hairline bg-white">
          <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
            {b.caption && <caption className="px-4 pt-3 text-left text-sm text-ink-muted">{b.caption}</caption>}
            <thead>
              <tr className="bg-mist">
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-display text-[14px] font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-hairline align-top">
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-4 py-3 font-semibold text-ink">
                        <Html html={c} />
                      </th>
                    ) : (
                      <td key={j} className="px-4 py-3 text-ink-body">
                        <Html html={c} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className="rounded-card bg-rose p-[16px_18px]">
          <p className="mb-1 font-display text-[16px] font-semibold text-rose-ink">{b.title}</p>
          <Html html={b.html} className="block text-[15px] leading-relaxed text-ink-body [&_strong]:font-bold [&_strong]:text-ink" />
        </aside>
      );
    case "case": {
      const initials = b.title.replace(/[^A-Za-z ]/g, "").trim().split(/\s+/)[0]?.slice(0, 2) ?? "";
      return (
        <aside className="flex gap-3.5 rounded-tile bg-white p-[18px_20px] ring-2 ring-lilac ring-inset">
          <span aria-hidden="true" className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-lilac font-display text-lg font-semibold text-violet-700">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-[.06em] text-violet-600 uppercase">Patient · {b.title}</p>
            <Html html={b.html} className="mt-1 block text-[15.5px] leading-[1.6] text-ink-body" />
          </div>
        </aside>
      );
    }
    case "labs":
      return (
        <div className="overflow-x-auto rounded-card border border-hairline bg-white">
          <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
            {b.caption && <caption className="px-4 pt-3 text-left text-sm text-ink-muted">{b.caption}</caption>}
            <thead>
              <tr className="bg-mist">
                <th scope="col" className="px-4 py-2.5 font-display text-[14px] font-semibold">
                  Test
                </th>
                {b.cols.map((c) => (
                  <th key={c} scope="col" className="px-4 py-2.5 font-display text-[14px] font-semibold">
                    {c}
                  </th>
                ))}
                <th scope="col" className="px-4 py-2.5 font-display text-[14px] font-semibold">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => {
                const [name, unit, ...rest] = r;
                const flag = rest[rest.length - 1] === 1;
                const range = rest[rest.length - 2];
                const vals = rest.slice(0, -2);
                return (
                  <tr key={String(name)} className="border-t border-hairline">
                    <th scope="row" className="px-4 py-2.5 font-semibold">
                      {name} <span className="text-xs font-normal text-ink-muted">{unit}</span>
                    </th>
                    {vals.map((v, i) => (
                      <td key={i} className={`px-4 py-2.5 ${flag && i === vals.length - 1 ? "font-bold text-incorrect" : "text-ink-body"}`}>
                        {v}
                        {flag && i === vals.length - 1 ? <span className="sr-only"> (abnormal)</span> : null}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-ink-muted">{range}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    case "eq":
      return (
        <div className="rounded-tile bg-violet p-5 text-white sm:p-6">
          <p className="mb-1 text-xs font-extrabold tracking-wide text-violet-on uppercase">Essential question</p>
          <p className="font-display text-[21px] leading-snug font-semibold">{b.text}</p>
        </div>
      );
    case "video":
      return <ClipBlock clip={b.clip} note={b.note} />;
    case "check": {
      const q = questionById(b.id);
      return q && visibleQ(q) ? <CheckGroup qs={[q]} pageId={pageId} /> : null;
    }
    case "open":
      return <OpenPrompt id={b.id} stem={b.stem} expert={b.expert} />;
    case "quiz": {
      const qs = b.ids.map((id) => questionById(id)).filter((q): q is Question => Boolean(q && visibleQ(q)));
      if (!qs.length) return <p className="rounded-tile bg-white p-5 text-ink-muted">These questions open once our nurse reviewer approves them.</p>;
      return <QuizBlock qs={qs} mode={b.mode} pageId={pageId} onComplete={onComplete} />;
    }
    case "cards": {
      const cs = b.ids.map((id) => cardById(id)).filter((c): c is Card => Boolean(c && visibleCards(c)));
      return <CardsBlock title={b.title} cards={cs} />;
    }
    case "read":
      return (
        <aside className="flex flex-col gap-1.5 rounded-card bg-mist p-[16px_18px]">
          <p className="text-[14px] font-extrabold text-ink">Read in your textbook</p>
          {b.items.map((it) => (
            <p key={it.ref} className="text-[15px] leading-[1.55] text-ink-body">
              <strong className="text-ink">{BOOK}</strong> · {citeRef(it.ref)}
              {it.note && <span className="block text-[14px] text-ink-muted">{it.note}</span>}
            </p>
          ))}
        </aside>
      );
    default:
      return null;
  }
}

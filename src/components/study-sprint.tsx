"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FocusBar } from "@/components/focus-bar";
import { Runner, type AnswerRow, type PathItem } from "@/components/runner";
import type { Question } from "@/content/types";
import { rpc } from "@/lib/api";
import { PASS_MARK } from "@/lib/config";
import { nur635VideoUrl } from "@/lib/nur635-video";
import { useStudent } from "@/lib/store";

/* ── Course pack shapes (shared by the NUR-635 midterm pack and custom-order packs) ── */
type PackQuestion = { stem: string; options: string[]; correctIndex: number; explanation: string };
type Unit = { title: string; lesson: string; objectives: string[]; practice: PackQuestion[]; flashcards: { front: string; back: string }[] };
type Simulation = { title: string; minutes: number; questions: PackQuestion[] };
type Pack = { version: number; modules: Unit[]; simulations: Simulation[] };
type Progress = { answers: Record<string, { selected: number; correct: boolean; answeredAt: string }>; cards: Record<string, { known: boolean; reviewedAt: string }> };

export type SprintSource = { kind: "midterm" } | { kind: "order"; orderId: string };

const EMPTY: Progress = { answers: {}, cards: {} };
const MIDTERM_COURSE = "advanced-pharmacology";
/** Midterm progress lives in the account's synced state under this key (unchanged, so no progress is lost). */
const MIDTERM_KEY = "nur635-midterm-progress-v1";
const LETTERS = "abcd";
type Tab = "lesson" | "video" | "practice" | "cards" | "exam";

/** Turns pack lesson text (ALL-CAPS headings, numbered paragraphs, "- " bullets) into the 680px reading layout. */
function LessonText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const out: React.ReactNode[] = [];
  const isHeading = (l: string) => l.length < 60 && /[A-Z]/.test(l) && l === l.toUpperCase() && !/^[-\d]/.test(l);
  const sentence = (l: string) => l.charAt(0) + l.slice(1).toLowerCase();
  blocks.forEach((b, i) => {
    const lines = b.split("\n");
    if (i === 0 && /^TOPIC\b|^MODULE\b/i.test(lines[0]) && lines.length === 1) return; // the title is already the page heading
    let rest = lines;
    if (isHeading(lines[0])) {
      const h = lines[0];
      rest = lines.slice(1);
      if (/ESSENTIAL IDEA|KEY POINT|CLINICAL PEARL|TAKEAWAY/.test(h) && rest.length) {
        out.push(
          <div key={i} className="rounded-[12px] bg-lilac px-4 py-3 text-[14.5px] leading-relaxed text-ink">
            <b>Key point</b> · {rest.join(" ")}
          </div>,
        );
        return;
      }
      out.push(
        <h3 key={`h${i}`} className="mt-1 font-display text-[19px] font-semibold tracking-[-.02em] text-ink">
          {sentence(h)}
        </h3>,
      );
      if (!rest.length) return;
    }
    if (rest.every((l) => /^-\s/.test(l))) {
      out.push(
        <ul key={i} className="flex flex-col gap-1.5">
          {rest.map((l, k) => (
            <li key={k} className="flex gap-2.5">
              <span className="font-extrabold text-violet">—</span>
              <span>{l.replace(/^-\s+/, "")}</span>
            </li>
          ))}
        </ul>,
      );
      return;
    }
    out.push(
      <p key={i} className="whitespace-pre-line">
        {rest.map((l, k) => {
          const m = l.match(/^(Scenario|Reasoning|Answer|Why|Example):\s*(.*)$/);
          return (
            <span key={k}>
              {m ? (
                <>
                  <b className="text-ink">{m[1]}:</b> {m[2]}
                </>
              ) : (
                l
              )}
              {k < rest.length - 1 ? "\n" : ""}
            </span>
          );
        })}
      </p>,
    );
  });
  return <div className="flex max-w-[680px] flex-col gap-3.5 text-[15.5px] leading-[1.7] text-ink-body">{out}</div>;
}

/** Player states (design 14c). */
function StateCard({ eyebrow, title, body, action, art, tone = "neutral" }: { eyebrow: string; title: string; body: string; action?: React.ReactNode; art?: string; tone?: "neutral" | "violet" }) {
  return (
    <section className="mx-auto flex w-full max-w-[420px] flex-col gap-3 rounded-[20px] border border-hairline bg-white p-6">
      {art && <img src={art} alt="" className="h-[120px] w-auto self-start object-contain" />}
      <span className={`text-[11px] font-extrabold tracking-[.12em] ${tone === "violet" ? "text-violet-700" : "text-ink-muted"}`}>{eyebrow}</span>
      <h1 className="font-display text-[22px] leading-tight font-bold tracking-[-.02em]">{title}</h1>
      <p className="text-[14px] leading-relaxed text-ink-body">{body}</p>
      {action}
    </section>
  );
}

/** One question shape for the shared runner. */
const toQuestion = (q: PackQuestion, id: string, topic: string): Question => ({
  id,
  moduleId: "pack",
  topic,
  type: "single",
  level: "application" as Question["level"],
  stem: "",
  ask: q.stem,
  options: q.options.map((t, i) => ({ id: LETTERS[i], text: t, rationale: i === q.correctIndex ? q.explanation : "" })),
  correct: [LETTERS[q.correctIndex]],
  source: "",
  fixedOrder: true,
});

/**
 * The study sprint (design 14a–14c): one player for the NUR-635 midterm and for
 * custom-order courses. Topic rail with readiness (correct ÷ all questions),
 * tabs Lesson · Video (when the pack has videos) · Practice · Flashcards · Exam simulations.
 */
export function StudySprint({ source }: { source: SprintSource }) {
  const { status, token, state, update, authorizedCourses } = useStudent();
  const midterm = source.kind === "midterm";
  const orderId = source.kind === "order" ? source.orderId : "";
  const entitled = !midterm || authorizedCourses.includes(MIDTERM_COURSE);
  const [pack, setPack] = useState<Pack | null>(null);
  const [orderLabel, setOrderLabel] = useState<string>("");
  const [serverProgress, setServerProgress] = useState<Progress>(EMPTY);
  const [phase, setPhase] = useState<"loading" | "ready" | "preparing" | "error">("loading");
  const [topic, setTopic] = useState(0);
  const [tab, setTab] = useState<Tab>("lesson");
  const [railOpen, setRailOpen] = useState(false);
  const [sim, setSim] = useState<number | null>(null);

  const progress: Progress = useMemo(() => {
    if (!midterm) return serverProgress;
    try {
      const v = JSON.parse(state.notes[MIDTERM_KEY] ?? "null") as Progress | null;
      return v?.answers && v?.cards ? v : EMPTY;
    } catch {
      return EMPTY;
    }
  }, [midterm, serverProgress, state.notes]);

  const load = useCallback(async () => {
    if (!token || !entitled) return setPhase("ready");
    setPhase("loading");
    try {
      if (source.kind === "midterm") {
        const r = await rpc<{ published: boolean; content: Pack | null }>("learning_curated_student_pack_get", { p_token: token, p_course: MIDTERM_COURSE });
        setPack(r.published ? r.content : null);
        setPhase(r.published && r.content ? "ready" : "preparing");
      } else {
        const [r, pr, orders] = await Promise.all([
          rpc<{ published: boolean; content: Pack | null }>("learning_student_pack_get", { p_token: token, p_order: source.orderId }),
          rpc<Progress>("learning_student_progress_get", { p_token: token, p_order: source.orderId }),
          rpc<{ id: string; invoiceRef: string; subject: string }[]>("learning_student_orders", { p_token: token }).catch(() => []),
        ]);
        setPack(r.published ? r.content : null);
        setServerProgress({ answers: pr?.answers ?? {}, cards: pr?.cards ?? {} });
        const o = (orders ?? []).find((x) => x.id === source.orderId);
        if (o) setOrderLabel(`${o.subject} · ${o.invoiceRef}`);
        setPhase(r.published && r.content ? "ready" : "preparing");
      }
    } catch {
      setPhase("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, entitled, midterm, orderId]);
  useEffect(() => {
    if (status === "ready") void load();
  }, [status, load]);

  /** Saves answers and card ratings where this source keeps them (server RPCs for orders, synced state for the midterm). */
  const saveAnswers = useCallback(
    async (rows: { key: string; kind: "practice" | "simulation"; module: number; question: number; selected: number; correct: boolean }[]) => {
      const at = new Date().toISOString();
      if (source.kind === "order") {
        for (const r of rows) await rpc("learning_student_answer", { p_token: token, p_order: source.orderId, p_kind: r.kind, p_module: r.module, p_question: r.question, p_selected: r.selected });
        setServerProgress((p) => ({ ...p, answers: { ...p.answers, ...Object.fromEntries(rows.map((r) => [r.key, { selected: r.selected, correct: r.correct, answeredAt: at }])) } }));
      } else {
        const next = { ...progress, answers: { ...progress.answers, ...Object.fromEntries(rows.map((r) => [r.key, { selected: r.selected, correct: r.correct, answeredAt: at }])) } };
        update("notes", { ...state.notes, [MIDTERM_KEY]: JSON.stringify(next) });
      }
    },
    [source, token, progress, state.notes, update],
  );
  const saveCard = useCallback(
    async (module: number, card: number, known: boolean) => {
      const key = `m${module}:${card}`;
      const v = { known, reviewedAt: new Date().toISOString() };
      if (source.kind === "order") {
        await rpc("learning_student_card_mark", { p_token: token, p_order: source.orderId, p_module: module, p_card: card, p_known: known });
        setServerProgress((p) => ({ ...p, cards: { ...p.cards, [key]: v } }));
      } else update("notes", { ...state.notes, [MIDTERM_KEY]: JSON.stringify({ ...progress, cards: { ...progress.cards, [key]: v } }) });
    },
    [source, token, progress, state.notes, update],
  );

  const closeHref = midterm ? "/app/courses" : "/app/orders";
  const eyebrow = midterm ? "NUR-635 Advanced Pharmacology · Midterm sprint" : orderLabel || "Your learning order";
  const unitWord = midterm ? "Topic" : "Module";

  /* ── States (14c) ── */
  const shell = (children: React.ReactNode, title = midterm ? "Midterm study sprint" : "Your personalised course") => (
    <div className="alm-focus flex min-h-dvh flex-col">
      <FocusBar closeHref={closeHref} eyebrow={eyebrow} title={title} />
      <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
    </div>
  );
  if (!entitled)
    return shell(
      <StateCard
        eyebrow="NOT ENROLLED"
        title="This course isn't in your enrolment"
        body="The midterm sprint is for approved Advanced Pharmacology learners. If you've paid, sign in with the access code from your invoice email."
        action={
          <Link href="/app/courses" className="text-[14px] font-bold text-violet-700">
            Your courses →
          </Link>
        }
      />,
    );
  if (phase === "loading" || status !== "ready")
    return shell(
      <div className="flex w-full max-w-[420px] flex-col gap-3" aria-busy="true" aria-label="Opening your course">
        <div className="h-6 w-40 rounded-full bg-track" />
        <div className="h-40 rounded-[20px] bg-white" />
      </div>,
    );
  if (phase === "error")
    return shell(
      <StateCard
        eyebrow="COULDN'T OPEN"
        title="We couldn't load this course"
        body="Check your connection and try again. If it keeps happening, make sure you're signed in with the code for this purchase."
        action={
          <button type="button" onClick={() => void load()} className="h-11 self-start rounded-[12px] border-[1.5px] border-violet px-[18px] text-[14px] font-bold text-violet-700 hover:bg-mist">
            Try again
          </button>
        }
      />,
    );
  if (phase === "preparing" || !pack)
    return shell(
      <StateCard
        tone="violet"
        art="/almanac-art/state-being-prepared.png"
        eyebrow="BEING PREPARED"
        title="Your lessons are in nurse review"
        body="Your access is active. The lessons, questions and simulations appear here as soon as they're released."
        action={
          <Link href="/app/orders" className="text-[14px] font-bold text-violet-700">
            View your order →
          </Link>
        }
      />,
    );

  const units = pack.modules;
  const sims = pack.simulations ?? [];
  const unit = units[topic];
  const total = units.reduce((a, m) => a + m.practice.length, 0);
  const answeredKeys = Object.keys(progress.answers).filter((k) => k.startsWith("p"));
  const correctCount = answeredKeys.filter((k) => progress.answers[k].correct).length;
  const readiness = total ? Math.round((correctCount / total) * 100) : 0;
  const unitScore = (i: number) => {
    const n = units[i].practice.length;
    const keys = units[i].practice.map((_, q) => `p${i}:${q}`).filter((k) => progress.answers[k]);
    return { n, answered: keys.length, correct: keys.filter((k) => progress.answers[k].correct).length };
  };
  const tabs: [Tab, string][] = [["lesson", "Lesson"], ...(midterm ? ([["video", "Video"]] as [Tab, string][]) : []), ["practice", "Practice"], ["cards", "Flashcards"], ...(sims.length ? ([["exam", "Exam simulations"]] as [Tab, string][]) : [])];
  const pickTopic = (i: number) => {
    setTopic(i);
    setTab("lesson");
    setRailOpen(false);
  };

  /* ── Exam simulation, run full screen by the shared runner (15a–15d → 10c) ── */
  if (sim !== null && sims[sim]) {
    const s = sims[sim];
    const key = midterm ? "nur635" : source.kind === "order" ? source.orderId : "";
    const qs = s.questions.map((q, i) => toQuestion(q, `${key}:s${sim}:${i}`, s.title));
    const record = async (rows: AnswerRow[], ph: "check" | "submit") => {
      if (ph !== "submit") return;
      await saveAnswers(
        rows
          .filter((r) => r.sel.length)
          .map((r) => {
            const qi = Number(r.q.id.split(":s")[1].split(":")[1]);
            return { key: `s${sim}:${qi}`, kind: "simulation" as const, module: sim, question: qi, selected: LETTERS.indexOf(r.sel[0]), correct: r.correct };
          }),
      );
    };
    const revision = (): PathItem[] => [
      { title: "Practise topic questions", sub: "Rationales after each answer", min: 15, onClick: () => (setSim(null), setTab("practice")) },
      { title: "Review your flashcards", sub: "Mark the ones to see again", min: 10, onClick: () => (setSim(null), setTab("cards")) },
    ];
    return (
      <Runner
        eyebrow={midterm ? "NUR-635 Advanced Pharmacology" : orderLabel}
        title={s.title}
        questions={qs}
        mode="exam"
        kind="midterm"
        minutes={s.minutes || 60}
        intro={{ scope: midterm ? `Topics 1–${units.length}` : "All modules", total: qs.length, repeats: 0, showRepeats: false }}
        passMark={PASS_MARK}
        persistKey={`sprint.${key}.${sim}`}
        record={record}
        revision={revision}
        backHref={midterm ? "/app/midterm/nur635" : `/app/orders/${key}/learn`}
        backLabel="Back to the study sprint"
        onClose={() => setSim(null)}
      />
    );
  }

  return (
    <div className="alm-focus min-h-dvh">
      {/* Desktop bar */}
      <div className="hidden sm:block">
        <FocusBar
          closeHref={closeHref}
          eyebrow={eyebrow}
          title={`${unitWord} ${topic + 1} · ${unit.title}`}
          right={<span className="rounded-full bg-mint px-3 py-1.5 text-[12.5px] font-bold text-correct">Readiness {readiness}%</span>}
        />
      </div>
      {/* Mobile bar + tab chips (14b) */}
      <div className="sticky top-0 z-30 sm:hidden">
        <div className="flex h-14 items-center gap-2 border-b border-[#EEEBF7] bg-white px-1.5">
          <Link href={closeHref} aria-label="Close" className="grid h-11 w-11 place-items-center text-[15px]">
            ✕
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] font-bold text-violet-700">{midterm ? "Midterm sprint" : "Your course"}</span>
            <span className="truncate font-display text-[14.5px] font-bold">
              {unitWord} {topic + 1} · {unit.title}
            </span>
          </div>
          <button type="button" onClick={() => setRailOpen(true)} className="h-11 px-3 text-[13px] font-bold text-violet-700">
            {midterm ? "Topics" : "Modules"}
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto border-b border-[#EEEBF7] bg-white px-3 py-2" role="tablist" aria-label="Learning activities">
          {tabs.map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => setTab(k)} className={`h-11 flex-none rounded-full px-3.5 text-[13px] font-bold ${tab === k ? "bg-ink text-white" : "bg-mist text-ink-body"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-7 px-4 pt-4 pb-16 sm:px-6 sm:pt-7 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Topic rail */}
        <aside className={`${railOpen ? "fixed inset-0 z-40 flex items-end bg-[rgba(27,21,48,.32)] p-0" : "hidden"} lg:static lg:flex lg:bg-transparent`} onClick={() => setRailOpen(false)}>
          <div className="flex max-h-[85dvh] w-full flex-col gap-3 overflow-y-auto rounded-t-[20px] bg-[#F7F6FB] p-3 lg:max-h-none lg:overflow-visible lg:rounded-none lg:p-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col gap-3 rounded-[16px] border border-hairline bg-white p-4">
              <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">{midterm ? "MIDTERM TOPICS" : "YOUR MODULES"}</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex h-1.5 overflow-hidden rounded-full bg-[#EFEDF5]">
                  <div className="h-full bg-correct" style={{ width: `${total ? (correctCount / total) * 100 : 0}%` }} />
                  <div className="h-full bg-[#C9BEF7]" style={{ width: `${total ? ((answeredKeys.length - correctCount) / total) * 100 : 0}%` }} />
                </div>
                <div className="flex justify-between text-[12px] text-ink-body">
                  <span>
                    <b className="text-correct">{correctCount} correct</b> · {answeredKeys.length} answered
                  </span>
                  <span>of {total}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                {units.map((u, i) => {
                  const cur = i === topic;
                  const sc = unitScore(i);
                  const done = sc.n > 0 && sc.answered === sc.n;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickTopic(i)}
                      aria-current={cur ? "true" : undefined}
                      className={`flex min-h-11 items-center gap-2.5 rounded-[10px] px-2.5 py-1 text-left ${cur ? "bg-lilac" : "hover:bg-mist"}`}
                    >
                      <span
                        className={`grid h-6 w-6 flex-none place-items-center rounded-full border-[1.5px] text-[11px] font-extrabold ${done ? "border-mint bg-mint text-correct" : cur ? "border-violet bg-violet text-white" : "border-[#D6CFF0] bg-white text-ink-muted"}`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span className={`flex-1 text-[13.5px] leading-[1.3] ${cur ? "font-bold text-violet-deep" : "font-medium text-ink"}`}>{u.title}</span>
                      <span className="text-[11.5px] text-ink-muted">{sc.answered ? `${sc.correct}/${sc.n}` : "–"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-[16px] border border-hairline bg-white px-4 py-3.5 text-[13px]">
              <Link href="/app/orders" className="font-bold text-violet-700">
                Downloads and order details →
              </Link>
              <Link href="/app/coach" className="font-bold text-violet-700">
                Ask a coach →
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex w-full max-w-[820px] flex-col gap-3 sm:gap-[18px]">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">
              {unitWord.toUpperCase()} {topic + 1} OF {units.length}
            </span>
            <h1 className="font-display text-[26px] leading-[1.12] font-bold tracking-[-.03em] sm:text-[34px]">{unit.title}</h1>
            <div className="mt-2 flex flex-col gap-1.5 sm:hidden">
              <div className="flex h-[5px] overflow-hidden rounded-full bg-[#EFEDF5]">
                <div className="h-full bg-correct" style={{ width: `${total ? (correctCount / total) * 100 : 0}%` }} />
                <div className="h-full bg-[#C9BEF7]" style={{ width: `${total ? ((answeredKeys.length - correctCount) / total) * 100 : 0}%` }} />
              </div>
              <span className="text-[12px] text-ink-body">
                <b className="text-correct">{correctCount} correct</b> · {answeredKeys.length} answered of {total}
              </span>
            </div>
          </div>
          <div className="hidden gap-1 self-start rounded-[14px] bg-[#EFEDF5] p-1 sm:flex" role="tablist" aria-label="Learning activities">
            {tabs.map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                type="button"
                onClick={() => setTab(k)}
                className={`h-10 rounded-[10px] px-4 text-[13.5px] font-bold ${tab === k ? "bg-white text-violet-deep shadow-[0_1px_2px_rgba(27,21,48,.08)]" : "text-ink-muted hover:text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "lesson" && (
            <section className="flex flex-col gap-[18px] rounded-[18px] border border-hairline bg-white p-5 sm:px-7 sm:py-6">
              {unit.objectives?.length > 0 && (
                <div className="flex flex-col gap-2 rounded-[14px] bg-mist px-[18px] py-4">
                  <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">YOU WILL BE ABLE TO</span>
                  {unit.objectives.map((x, i) => (
                    <div key={i} className="flex gap-2.5 text-[14.5px] leading-normal">
                      <span className="font-extrabold text-violet">—</span>
                      {x}
                    </div>
                  ))}
                </div>
              )}
              <LessonText text={unit.lesson} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEBF7] pt-4">
                <span className="text-[13px] text-ink-muted">About {Math.max(1, Math.round(unit.lesson.split(/\s+/).length / 200))} min read</span>
                {unit.practice.length > 0 && (
                  <button type="button" onClick={() => setTab("practice")} className="h-12 rounded-[12px] bg-violet px-[22px] text-[15px] font-bold text-white hover:bg-[#4A2DE6]">
                    Check your understanding →
                  </button>
                )}
              </div>
            </section>
          )}

          {tab === "video" && midterm && <VideoTab key={topic} topic={topic} token={token} onLesson={() => setTab("lesson")} />}

          {tab === "practice" && (
            <PracticeTab
              key={topic}
              unit={unit}
              topic={topic}
              progress={progress}
              save={saveAnswers}
              onDone={() => setTab("cards")}
            />
          )}

          {tab === "cards" && <CardsTab key={topic} unit={unit} topic={topic} progress={progress} save={saveCard} />}

          {tab === "exam" && (
            <section className="flex flex-col gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                {sims.map((s, i) => {
                  const keys = s.questions.map((_, q) => `s${i}:${q}`);
                  const answered = keys.filter((k) => progress.answers[k]);
                  const right = answered.filter((k) => progress.answers[k].correct).length;
                  const score = s.questions.length ? Math.round((right / s.questions.length) * 100) : 0;
                  return (
                    <div key={i} className="flex flex-col gap-3 rounded-[18px] border border-hairline bg-white p-5">
                      <span className="font-display text-[20px] font-bold">{s.title}</span>
                      <span className="text-[13.5px] text-ink-body">
                        {s.questions.length} questions · {s.minutes || 60} min
                      </span>
                      <span className={`text-[13px] font-bold ${answered.length ? "text-ink-body" : "text-ink-muted"}`}>
                        {answered.length ? `Last score ${score}% · ${score >= PASS_MARK ? "above" : "below"} the ${PASS_MARK}% pass mark` : "Not attempted"}
                      </span>
                      <button type="button" onClick={() => setSim(i)} className="h-[46px] rounded-[12px] bg-violet text-[14px] font-bold text-white hover:bg-[#4A2DE6]">
                        {answered.length ? "Try again →" : "Start →"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-[13px] text-ink-muted">Timed, with answers and rationales after you submit. Original study practice, not the proctored exam.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Video tab: orange play button; peach notice when a topic has no video ── */
function VideoTab({ topic, token, onLesson }: { topic: number; token: string | null; onLesson: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "none" | "error">(topic === 3 ? "none" : "idle");
  const [error, setError] = useState("");
  const play = () => {
    if (!token) return;
    setState("loading");
    nur635VideoUrl(token, topic + 1)
      .then((u) => {
        setUrl(u);
        setState(u ? "ready" : "none");
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Video access is temporarily unavailable.");
        setState("error");
      });
  };
  if (state === "none")
    return (
      <section className="flex flex-col gap-2.5 rounded-[18px] border border-[#FFD9C2] bg-[#FFF4EC] px-6 py-[22px]">
        <span className="text-[16px] font-bold text-ink">The video for this topic isn&apos;t ready yet</span>
        <span className="text-[14.5px] leading-relaxed text-ink-body">The lesson and practice cover the same material. We&apos;ll add the video to this tab when it&apos;s approved.</span>
        <div>
          <button type="button" onClick={onLesson} className="h-[46px] rounded-[12px] bg-violet px-[18px] text-[14px] font-bold text-white">
            Go to the lesson
          </button>
        </div>
      </section>
    );
  return (
    <section className="flex flex-col gap-3">
      {state === "ready" && url ? (
        <video key={url} className="aspect-video w-full rounded-[18px] bg-black" controls autoPlay playsInline preload="metadata" controlsList="nodownload">
          <source src={url} type="video/mp4" />
          Your browser cannot play this video.
        </video>
      ) : (
        <button
          type="button"
          onClick={play}
          disabled={state === "loading"}
          aria-label="Play the video"
          className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-[18px] bg-lilac bg-[url('/almanac-art/video-poster-generic.png')] bg-cover bg-center"
        >
          <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#EA6512] pl-1.5 text-[26px] text-white motion-safe:animate-[almPulse_2.4s_ease-out_infinite]">{state === "loading" ? "…" : "▶"}</span>
          <span className="absolute inset-x-0 bottom-0 h-[5px] bg-[rgba(27,21,48,.12)]" />
        </button>
      )}
      {state === "error" && (
        <p role="alert" className="rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] px-3.5 py-2.5 text-[13.5px] text-ink">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[14px] text-ink-body">Topic {topic + 1} video overview</span>
        <button type="button" onClick={onLesson} className="h-[46px] rounded-[12px] border-[1.5px] border-violet px-[18px] text-[14px] font-bold text-violet-700 hover:bg-mist">
          Continue to the lesson →
        </button>
      </div>
    </section>
  );
}

/* ── Practice tab: pick locks on Check answer; Try again clears (decision 14) ── */
function PracticeTab({
  unit,
  topic,
  progress,
  save,
  onDone,
}: {
  unit: Unit;
  topic: number;
  progress: Progress;
  save: (rows: { key: string; kind: "practice"; module: number; question: number; selected: number; correct: boolean }[]) => Promise<void>;
  onDone: () => void;
}) {
  const qs = unit.practice;
  const firstOpen = Math.max(0, qs.findIndex((_, i) => !progress.answers[`p${topic}:${i}`]));
  const [i, setI] = useState(firstOpen);
  const key = `p${topic}:${i}`;
  const prev = progress.answers[key];
  const [pick, setPick] = useState<number | null>(prev ? prev.selected : null);
  const [checked, setChecked] = useState(Boolean(prev));
  const [failed, setFailed] = useState(false);
  const q = qs[i];
  if (!q) return <p className="rounded-[18px] border border-hairline bg-white p-5 text-[14px] text-ink-body">No practice questions in this {topic >= 0 ? "topic" : "module"} yet.</p>;
  const goTo = (n: number) => {
    const p = progress.answers[`p${topic}:${n}`];
    setI(n);
    setPick(p ? p.selected : null);
    setChecked(Boolean(p));
    setFailed(false);
  };
  const check = async () => {
    if (pick === null) return;
    setChecked(true);
    try {
      await save([{ key, kind: "practice", module: topic, question: i, selected: pick, correct: pick === q.correctIndex }]);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  const last = i === qs.length - 1;
  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-body">
        <span>
          <b className="text-ink">
            Question {i + 1} of {qs.length}
          </b>{" "}
          · rationale after you check
        </span>
        <span>Saved to your account</span>
      </div>
      <div className="rounded-[16px] border border-hairline bg-white p-4 sm:rounded-[18px] sm:px-[22px] sm:py-5">
        <p className="text-[16.5px] leading-[1.4] font-bold sm:text-[18px]">{q.stem}</p>
      </div>
      <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Answer options">
        {q.options.map((text, k) => {
          const sel = pick === k;
          const ok = k === q.correctIndex;
          let tone = "border-hairline bg-white";
          let mark = "border-[#D6CFF0] bg-white text-ink-muted";
          let tag = "";
          if (sel && !checked) {
            tone = "border-violet bg-mist";
            mark = "border-violet bg-violet text-white";
          }
          if (checked && ok) {
            tone = "border-correct bg-[#F2FBF6]";
            mark = "border-correct bg-correct text-white";
            tag = sel ? "CORRECT · YOUR ANSWER" : "CORRECT";
          }
          if (checked && sel && !ok) {
            tone = "border-incorrect bg-rose";
            mark = "border-incorrect bg-incorrect text-white";
            tag = "YOUR ANSWER";
          }
          return (
            <div key={k} className={`flex flex-col overflow-hidden rounded-[14px] border-[1.5px] ${tone}`}>
              <button type="button" role="radio" aria-checked={sel} disabled={checked} onClick={() => setPick(k)} className="flex min-h-[52px] items-center gap-2.5 px-3 py-2 text-left sm:gap-3 sm:px-3.5 disabled:cursor-default">
                <span className={`grid h-7 w-7 flex-none place-items-center rounded-full border-[1.5px] text-[12px] font-extrabold ${mark}`}>{"ABCD"[k]}</span>
                <span className="flex-1 text-[14.5px] leading-[1.4] font-semibold sm:text-[15px]">{text}</span>
                {tag && <span className={`text-[12px] font-extrabold ${ok ? "text-correct" : "text-incorrect"}`}>{tag}</span>}
              </button>
              {checked && ok && <p className="pr-3.5 pb-3 pl-[54px] text-[13.5px] leading-[1.55] text-ink-body">{q.explanation}</p>}
            </div>
          );
        })}
      </div>
      {failed && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] px-3.5 py-2.5 text-[13.5px] text-ink">
          <span>Your answer wasn&apos;t saved. Check your connection.</span>
          <button type="button" onClick={() => void check()} className="font-bold text-violet-700">
            Retry
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => goTo(i - 1)} disabled={i === 0} className="hidden h-12 rounded-[12px] border-[1.5px] border-violet px-[18px] text-[14px] font-bold text-violet-700 hover:bg-mist disabled:opacity-40 sm:block">
          ← Previous
        </button>
        <div className="flex w-full gap-2.5 sm:w-auto">
          {checked && (
            <button
              type="button"
              onClick={() => {
                setChecked(false);
                setPick(null);
                setFailed(false);
              }}
              className="h-12 px-[18px] text-[14px] font-bold text-violet-700"
            >
              Try again
            </button>
          )}
          <button
            type="button"
            onClick={() => (!checked ? void check() : last ? onDone() : goTo(i + 1))}
            disabled={!checked && pick === null}
            className="h-12 flex-1 rounded-[12px] bg-violet px-[22px] text-[15px] font-bold text-white hover:bg-violet-700 disabled:bg-[#A99BF0] sm:flex-none"
          >
            {!checked ? "Check answer" : last ? "Go to flashcards →" : "Next question →"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Flashcards tab: the pack's two ratings (Review again · I know this) ── */
function CardsTab({ unit, topic, progress, save }: { unit: Unit; topic: number; progress: Progress; save: (m: number, c: number, known: boolean) => Promise<void> }) {
  const cards = unit.flashcards;
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const c = cards[i];
  if (!c) return <p className="rounded-[18px] border border-hairline bg-white p-5 text-[14px] text-ink-body">No flashcards here yet.</p>;
  const marks = cards.map((_, k) => progress.cards[`m${topic}:${k}`]);
  const known = marks.filter((m) => m?.known).length;
  const again = marks.filter((m) => m && !m.known).length;
  const rate = async (k: boolean) => {
    try {
      await save(topic, i, k);
      setFailed(false);
      setFlipped(false);
      setI((n) => Math.min(cards.length - 1, n + 1));
    } catch {
      setFailed(true);
    }
  };
  return (
    <section className="flex flex-col items-center gap-3.5">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-[13px] text-ink-body">
        <b className="text-ink">
          Card {i + 1} of {cards.length}
        </b>
        <span className="flex gap-1.5">
          <span className="rounded-full bg-mint px-2.5 py-0.5 text-[12px] font-bold text-correct">{known} known</span>
          <span className="rounded-full bg-[#FFE9DC] px-2.5 py-0.5 text-[12px] font-bold text-[#A8430A]">{again} to review</span>
        </span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show the question side" : "Show the answer"}
        className="flex min-h-[300px] w-full flex-col gap-3.5 rounded-[22px] border border-hairline bg-white px-6 py-7 text-left shadow-[0_12px_32px_rgba(27,21,48,.06)] sm:px-9 sm:py-[30px]"
      >
        <span className="text-[11px] font-extrabold tracking-[.12em] text-ink-muted">{flipped ? "ANSWER" : "RECALL"}</span>
        <span className="flex flex-1 flex-col justify-center gap-3">
          <span className="font-display text-[22px] leading-[1.25] font-bold tracking-[-.02em] sm:text-[26px]">{c.front}</span>
          {flipped && <span className="border-t border-[#EEEBF7] pt-3 text-[16.5px] leading-relaxed text-ink-body">{c.back}</span>}
        </span>
        <span className="text-center text-[12.5px] text-ink-muted">{flipped ? "Rate the card to move on" : "Tap or press Space to flip"}</span>
      </button>
      {failed && (
        <p role="alert" className="w-full rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] px-3.5 py-2.5 text-[13.5px] text-ink">
          This review wasn&apos;t saved. Check your connection and rate the card again.
        </p>
      )}
      {flipped && (
        <div className="grid w-full grid-cols-2 gap-2.5 sm:w-auto sm:grid-cols-[200px_200px]">
          <button type="button" onClick={() => void rate(false)} className="h-[52px] rounded-[12px] bg-[#FFE9DC] text-[15px] font-bold text-[#A8430A]">
            Review again
          </button>
          <button type="button" onClick={() => void rate(true)} className="h-[52px] rounded-[12px] bg-mint text-[15px] font-bold text-correct">
            I know this
          </button>
        </div>
      )}
    </section>
  );
}

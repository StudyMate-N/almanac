"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { lessonById } from "@/content/course";
import { friendlyError, rpc } from "@/lib/api";
import { useStudent } from "@/lib/store";

type Req = { id: number; lessonId: string | null; question: string; status: string; reply: string | null; repliedBy: string | null; createdAt: string; repliedAt: string | null };

const when = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return `${today ? "Today" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};
const firstLine = (s: string) => {
  const line = s.trim().split(/\n/)[0];
  return line.length > 90 ? `${line.slice(0, 88)}…` : line;
};
/** Status chips (uniformity rules): answered = mint, waiting = peach, closed = neutral mist. */
const status = (r: Req) =>
  r.reply ? { label: "Answered", cls: "bg-mint text-correct" } : r.status === "open" ? { label: "Waiting on coach", cls: "bg-[#FFE9DC] text-[#A8430A]" } : { label: "Closed", cls: "bg-mist text-ink-muted" };

/** Ask a coach (design 12c): questions on the left, the selected question and its reply on the right. */
export default function Coach() {
  const { token } = useStudent();
  const [list, setList] = useState<Req[] | null>(null);
  const [selected, setSelected] = useState<number | "new" | null>(null);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (token) rpc<Req[]>("coach_list", { p_token: token }).then(setList, (e) => setMsg(friendlyError(e)));
  }, [token]);
  useEffect(load, [load]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !token) return;
    setBusy(true);
    try {
      await rpc("coach_ask", { p_token: token, p_lesson_id: null, p_question_id: null, p_question: text.trim(), p_ai_answer: null });
      setText("");
      setMsg("Sent. You'll see the reply here.");
      setSelected(null);
      load();
    } catch (err) {
      setMsg(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  // Desktop shows the newest question by default; on mobile the list comes first.
  const current = selected === "new" ? null : (list?.find((r) => r.id === selected) ?? null);
  const desktopDefault = selected === null ? list?.[0] : undefined;
  const shown = current ?? desktopDefault ?? null;
  const composing = selected === "new" || (list !== null && list.length === 0);
  const lesson = shown?.lessonId ? lessonById(shown.lessonId) : undefined;

  const form = (
    <form onSubmit={send} className="flex flex-1 flex-col gap-3 p-5 sm:p-7">
      <p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">NEW QUESTION</p>
      <label htmlFor="q" className="font-display text-[20px] font-bold">
        What are you stuck on?
      </label>
      <textarea
        id="q"
        rows={6}
        maxLength={2000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="rounded-[12px] border border-[#D9D2F3] bg-white p-3.5 text-[15px] outline-none focus:border-violet focus:ring-2 focus:ring-violet/15"
        placeholder="E.g. I keep mixing up left- and right-sided heart failure signs."
      />
      <p className="text-[13px] text-ink-muted">Coaches help you understand course material. They don&apos;t help with graded work.</p>
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={busy || !text.trim()} className="h-12 rounded-[12px] bg-violet px-6 font-bold text-white hover:bg-[#4A2DE6] disabled:bg-[#A99BF0]">
          {busy ? "Sending…" : "Send to a coach"}
        </button>
        {list && list.length > 0 && (
          <button type="button" onClick={() => setSelected(null)} className="h-12 rounded-[12px] px-4 font-bold text-violet-700 hover:bg-mist">
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-[1128px]">
      <div className="grid overflow-hidden rounded-[16px] border border-hairline bg-white lg:h-[calc(100dvh-112px)] lg:min-h-[560px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className={`flex min-h-0 flex-col border-[#EEEBF7] lg:border-r ${selected !== null ? "max-lg:hidden" : ""}`}>
          <div className="flex flex-col gap-1.5 p-5 pb-4">
            <h1 className="font-display text-[26px] leading-tight font-bold tracking-[-.03em]">Ask a coach</h1>
            <p className="text-[13px] text-ink-muted">A person reads and answers every question, not a bot.</p>
            <button type="button" onClick={() => { setSelected("new"); setMsg(""); }} className="mt-2.5 h-11 rounded-[12px] bg-violet text-[14px] font-bold text-white hover:bg-[#4A2DE6]">
              New question
            </button>
          </div>
          <p aria-live="polite" className={`mx-5 text-[13px] font-semibold text-violet-700 ${msg ? "mb-3" : ""}`}>
            {msg}
          </p>
          <ul className="min-h-0 flex-1 overflow-y-auto border-t border-[#EEEBF7]">
            {list === null ? (
              <li className="p-5 text-[13.5px] text-ink-muted">Loading…</li>
            ) : list.length === 0 ? (
              <li className="p-5 text-[13.5px] text-ink-muted">No questions yet.</li>
            ) : (
              list.map((r) => {
                const st = status(r);
                const on = shown?.id === r.id && selected !== "new";
                const l = r.lessonId ? lessonById(r.lessonId) : undefined;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(r.id)}
                      aria-current={on ? "true" : undefined}
                      className={`flex w-full flex-col gap-1 border-b border-l-[3px] border-b-[#EEEBF7] px-5 py-3.5 text-left ${on ? "border-l-violet bg-[#F6F4FB]" : "border-l-transparent hover:bg-[#FBFAFE]"}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[12px] text-ink-muted">{l ? l.title : when(r.createdAt)}</span>
                        <span className={`flex-none rounded-full px-2 py-0.5 text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                      </span>
                      <span className="text-[14px] leading-snug font-bold">{firstLine(r.question)}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <section className={`flex min-h-[60dvh] min-w-0 flex-col bg-[#FBFAFE] lg:min-h-0 ${selected === null && !composing ? "max-lg:hidden" : ""}`}>
          {composing ? (
            <>
              {list && list.length > 0 && (
                <button type="button" onClick={() => setSelected(null)} className="m-4 mb-0 self-start text-[13.5px] font-bold text-violet-700 lg:hidden">
                  ← All questions
                </button>
              )}
              {form}
            </>
          ) : shown ? (
            <>
              <header className="flex items-start justify-between gap-3 border-b border-[#EEEBF7] bg-white px-5 py-4 sm:px-7">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <button type="button" onClick={() => setSelected(null)} className="mb-1 self-start text-[13px] font-bold text-violet-700 lg:hidden">
                    ← All questions
                  </button>
                  <h2 className="text-[15.5px] font-bold">{firstLine(shown.question)}</h2>
                  {lesson && (
                    <Link href={`/app/learn/${lesson.id}`} className="text-[13px] font-bold text-violet-700">
                      From {lesson.title} →
                    </Link>
                  )}
                </div>
                <span className={`flex-none rounded-full px-2.5 py-1 text-[11.5px] font-bold ${status(shown).cls}`}>{status(shown).label}</span>
              </header>
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[12px] font-bold text-ink-muted">You · {when(shown.createdAt)}</span>
                  <p className="max-w-[560px] rounded-[16px] rounded-tr-[6px] bg-violet px-4 py-3 text-[15px] leading-normal whitespace-pre-wrap text-white">{shown.question}</p>
                </div>
                {shown.reply ? (
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[12px] font-bold text-ink-muted">
                      {shown.repliedBy ?? "Coach"}
                      {shown.repliedAt ? ` · ${when(shown.repliedAt)}` : ""}
                    </span>
                    <p className="max-w-[560px] rounded-[16px] rounded-tl-[6px] border border-hairline bg-white px-4 py-3 text-[15px] leading-normal whitespace-pre-wrap">{shown.reply}</p>
                  </div>
                ) : (
                  <p className="self-start rounded-[12px] bg-[#FFF4EC] px-3.5 py-2.5 text-[13.5px] text-[#7A2E06]">Waiting for a coach. The reply appears here.</p>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[#EEEBF7] bg-white px-5 py-3.5 sm:px-7">
                <span className="text-[13px] text-ink-muted">Need more help with this?</span>
                <button type="button" onClick={() => { setSelected("new"); setMsg(""); }} className="h-11 rounded-[12px] border-[1.5px] border-[#D9D2F3] px-4 text-[14px] font-bold text-violet-deep hover:bg-mist">
                  Ask a follow-up
                </button>
              </div>
            </>
          ) : (
            <p className="m-auto p-6 text-[14px] text-ink-muted">Loading…</p>
          )}
        </section>
      </div>
    </div>
  );
}

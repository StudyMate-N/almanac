"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { lessonById } from "@/content/course";
import { friendlyError, rpc } from "@/lib/api";
import { useStudent } from "@/lib/store";

type Req = { id: number; lessonId: string | null; question: string; status: string; reply: string | null; repliedBy: string | null; createdAt: string; repliedAt: string | null };

export default function Coach() {
  const { token } = useStudent();
  const [list, setList] = useState<Req[] | null>(null);
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
      setMsg("Sent. A coach replies within 3 hours.");
      load();
    } catch (err) {
      setMsg(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="A person, not a bot" title="Ask a coach" />
      <form onSubmit={send} className="mb-5 flex max-w-2xl flex-col gap-3 rounded-tile bg-white p-6">
        <label htmlFor="q" className="text-sm font-bold">
          What are you stuck on?
        </label>
        <textarea id="q" rows={4} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} className="rounded-2xl border-2 border-hairline p-3 outline-none focus:border-violet" placeholder="E.g. I keep mixing up left- and right-sided heart failure signs." />
        <p className="text-sm text-ink-muted">Coaches help you understand course material. They don&apos;t help with graded work.</p>
        <button disabled={busy || !text.trim()} className="min-h-12 self-start rounded-full bg-violet px-6 font-bold text-white disabled:opacity-50">
          {busy ? "Sending…" : "Send to a coach"}
        </button>
        <p aria-live="polite" className="text-sm font-semibold text-violet-700">
          {msg}
        </p>
      </form>

      <h2 className="mb-3 font-display text-[21px] font-semibold">Your questions</h2>
      {list === null ? (
        <p className="text-ink-muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-ink-muted">Nothing yet.</p>
      ) : (
        <ul className="flex max-w-2xl flex-col gap-3">
          {list.map((r) => (
            <li key={r.id} className="rounded-tile bg-white p-5">
              <p className="text-xs font-bold text-ink-muted">
                {new Date(r.createdAt).toLocaleString()}
                {r.lessonId && lessonById(r.lessonId) ? ` · ${lessonById(r.lessonId)!.title}` : ""}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{r.question}</p>
              {r.reply ? (
                <div className="mt-3 rounded-2xl bg-mint p-3.5 text-mint-ink">
                  <p className="text-xs font-bold">{r.repliedBy ?? "Coach"} replied</p>
                  <p className="mt-1 whitespace-pre-wrap">{r.reply}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm font-bold text-peach-ink">Waiting for a coach (within 3 hours)</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { XIcon } from "@/components/icons";
import { friendlyError, rpc } from "@/lib/api";
import { useStudent } from "@/lib/store";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = ["Explain this more simply", "Why is my answer wrong?", "Give me a way to remember it"];

/** AI tutor that answers from Almanac's own lesson content, with a hand-off to a human coach. */
export function TutorButton({ lessonId, questionId, selected, label = "Ask the tutor" }: { lessonId?: string; questionId?: string; selected?: string[]; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-10 items-center rounded-full bg-lilac px-4 text-sm font-bold text-violet-700 hover:bg-violet-200">
        {label}
      </button>
      {open && <TutorPanel lessonId={lessonId} questionId={questionId} selected={selected} onClose={() => setOpen(false)} />}
    </>
  );
}

function TutorPanel({ lessonId, questionId, selected, onClose }: { lessonId?: string; questionId?: string; selected?: string[]; onClose: () => void }) {
  const { token } = useStudent();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [coach, setCoach] = useState<"idle" | "sending" | "sent" | string>("idle");

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: q.trim() }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, lessonId, questionId, selected, messages: next }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      setMessages([...next, { role: "assistant", content: data.answer ?? data.error ?? "The tutor couldn't answer just now. Try again, or ask a coach." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "The tutor is unreachable right now. You can ask a coach instead." }]);
    }
    setBusy(false);
  };

  const askCoach = async () => {
    const question = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n") || text;
    if (!question.trim()) return setCoach("Type your question first.");
    setCoach("sending");
    try {
      const ai = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("\n\n");
      await rpc("coach_ask", { p_token: token, p_lesson_id: lessonId ?? null, p_question_id: questionId ?? null, p_question: question, p_ai_answer: ai || null });
      setCoach("sent");
    } catch (e) {
      setCoach(friendlyError(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1b153066]" role="dialog" aria-modal="true" aria-label="Tutor" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-ground" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-hairline bg-white px-4 py-3">
          <div className="flex-1">
            <p className="font-display text-lg font-semibold">Tutor</p>
            <p className="text-xs text-ink-muted">AI, answering from Almanac&apos;s lessons. Check anything important against your course text.</p>
          </div>
          <button onClick={onClose} aria-label="Close tutor" className="grid h-10 w-10 place-items-center rounded-full bg-mist">
            <XIcon size={16} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => void ask(s)} className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-violet-700 hover:bg-lilac">
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <p key={i} className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "self-end bg-violet text-white" : "self-start bg-white"}`}>
              {m.content}
            </p>
          ))}
          {busy && <p className="self-start rounded-2xl bg-white px-4 py-2.5 text-ink-muted">Thinking…</p>}
        </div>
        <div className="flex flex-col gap-2 border-t border-hairline bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(text);
            }}
            className="flex gap-2"
          >
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about this…" className="min-h-11 flex-1 rounded-full border-2 border-hairline px-4 outline-none focus:border-violet" />
            <button disabled={busy} className="min-h-11 rounded-full bg-violet px-5 font-bold text-white disabled:bg-violet-300">
              Ask
            </button>
          </form>
          {coach === "sent" ? (
            <p className="text-sm font-semibold text-mint-ink">Sent to a coach. You&apos;ll find the reply under Ask a coach, usually within 3 hours.</p>
          ) : (
            <button onClick={() => void askCoach()} disabled={coach === "sending"} className="self-start text-sm font-bold text-violet-600 underline">
              {coach === "sending" ? "Sending…" : "Not helpful? Ask a coach"}
            </button>
          )}
          {coach !== "idle" && coach !== "sent" && coach !== "sending" && <p className="text-sm text-rose-ink">{coach}</p>}
        </div>
      </div>
    </div>
  );
}

export function ReportButton({ itemId, itemType }: { itemId: string; itemType: string }) {
  const { token } = useStudent();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sent" | string>("idle");
  if (state === "sent") return <span className="text-sm font-semibold text-mint-ink">Thanks, a reviewer will check it.</span>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-bold text-ink-muted underline">
        Report a problem
      </button>
    );
  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await rpc("report_add", { p_token: token, p_item_id: itemId, p_item_type: itemType, p_message: msg });
          setState("sent");
        } catch (err) {
          setState(friendlyError(err));
        }
      }}
    >
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} required rows={2} placeholder="What looks wrong?" className="rounded-2xl border-2 border-hairline p-3 outline-none focus:border-violet" />
      <div className="flex gap-2">
        <button className="min-h-10 rounded-full bg-violet px-4 text-sm font-bold text-white">Send report</button>
        <button type="button" onClick={() => setOpen(false)} className="min-h-10 rounded-full px-4 text-sm font-bold text-ink-muted">
          Cancel
        </button>
      </div>
      {state !== "idle" && <p className="text-sm text-rose-ink">{state}</p>}
    </form>
  );
}

"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { lessonById } from "@/content/course";
import { readiness, readinessLabel, readinessTone, topicStats } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

export default function Progress() {
  const { answers, state } = useStudent();
  const { modules, questions, latest } = useCourse();
  const seen = questions.filter((q) => latest.has(q.id));
  const right = seen.filter((q) => latest.get(q.id)!.correct).length;
  const missed = seen.length - right;
  const topics = topicStats(questions, latest);
  const sims = answers.filter((a) => ["midterm", "final", "check"].includes(a.mode));
  const simSessions = [...new Map(sims.map((a) => [a.sessionId, a])).values()].map((a) => {
    const rows = sims.filter((s) => s.sessionId === a.sessionId);
    return { id: a.sessionId, mode: a.mode, at: a.at, n: rows.length, right: rows.filter((r) => r.correct).length };
  });
  const reviewed = Object.values(state.deck?.log ?? {}).reduce((a, b) => a + b, 0);
  const stat = "rounded-tile bg-white p-5";

  return (
    <>
      <PageHeader eyebrow="Your progress" title="Where you stand" />
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Questions answered", seen.length],
          ["Correct last time", seen.length ? `${Math.round((right / seen.length) * 100)}%` : "–"],
          // Only pages that still exist: ids retired by the topic restructure stay in history.
          ["Pages done", Object.keys(state.lessons).filter((id) => lessonById(id)).length],
          ["Cards reviewed", reviewed],
        ].map(([l, v]) => (
          <div key={l} className={stat}>
            <p className="font-display text-[28px] font-semibold">{v}</p>
            <p className="text-sm text-ink-muted">{l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={stat}>
          <h2 className="mb-3 font-display text-[19px] font-semibold">Readiness by section</h2>
          <ul className="flex flex-col gap-3">
            {modules.map((m) => {
              const r = readiness(questions.filter((q) => q.moduleId === m.id), latest);
              if (!r.total) return null;
              return (
                <li key={m.id} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-semibold">{m.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${readinessTone[r.level].chip}`}>
                      {readinessLabel[r.level]} · {r.answered}/{r.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-track">
                    <div className={`h-full ${readinessTone[r.level].bar}`} style={{ width: `${r.percent ?? 0}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={stat}>
          <h2 className="mb-3 font-display text-[19px] font-semibold">Weakest topics</h2>
          {topics.length === 0 ? (
            <p className="text-sm text-ink-muted">Answer a few questions and your weakest topics show up here.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topics.slice(0, 8).map((t) => (
                <li key={t.topic} className="flex justify-between gap-2 text-sm">
                  <span>{t.topic}</span>
                  <span className="font-bold">
                    {t.percent}% <span className="font-normal text-ink-muted">of {t.seen}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {missed > 0 && (
            <Link href="/app/practice/missed" className="mt-4 inline-block rounded-full bg-peach px-4 py-2 text-sm font-bold text-peach-ink">
              Redo the {missed} I missed
            </Link>
          )}
        </section>

        <section className={`${stat} lg:col-span-2`}>
          <h2 className="mb-3 font-display text-[19px] font-semibold">Exam simulations</h2>
          {simSessions.length === 0 ? (
            <p className="text-sm text-ink-muted">
              No simulations yet. <Link href="/app/practice" className="font-bold text-violet-600">Take one from Practice</Link>.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {simSessions.map((s) => (
                <li key={s.id} className="flex justify-between gap-2">
                  <span className="font-semibold capitalize">
                    {s.mode === "check" ? "Starting check" : s.mode} · {new Date(s.at).toLocaleDateString()}
                  </span>
                  <span className="font-bold">
                    {s.right}/{s.n} ({Math.round((s.right / s.n) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

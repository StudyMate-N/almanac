"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { courseById, moduleById } from "@/content/course";
import { REVIEWER } from "@/lib/config";
import { useCourse } from "@/lib/use-course";

export default function Guide() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { lessons, cards } = useCourse();
  const mod = moduleById(moduleId);
  const ls = lessons.filter((l) => l.moduleId === moduleId);
  const cs = cards.filter((c) => c.moduleId === moduleId);
  if (!mod || ls.length === 0)
    return (
      <p className="rounded-tile bg-white p-6">
        This study guide opens once its lessons are approved. <Link href={mod ? `/app/courses/${mod.courseId}` : "/app/courses"} className="font-bold text-violet-600">Back</Link>
      </p>
    );

  return (
    <article className="guide mx-auto max-w-3xl rounded-tile bg-white p-6 sm:p-10 print:p-0">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-700">Almanac study guide · {courseById(mod.courseId)?.title}</p>
          <h1 className="font-display text-[30px] font-semibold">{mod.title}</h1>
          <p className="text-sm text-ink-muted">{courseById(mod.courseId)?.reviewer === "nurse" ? `Reviewed by ${REVIEWER.name}, ${REVIEWER.credentials}` : "Reviewed by a subject expert"}</p>
        </div>
        <button onClick={() => window.print()} className="min-h-11 rounded-full bg-violet px-5 font-bold text-white print:hidden">
          Print or save PDF
        </button>
      </div>
      {ls.map((l) => (
        <section key={l.id} className="mb-7 break-inside-avoid-page">
          <h2 className="mb-1 font-display text-[21px] font-semibold">
            {l.index}. {l.title}
          </h2>
          {l.hook && <p className="mb-2 text-[15px] italic text-ink-body">{l.hook}</p>}
          {l.summary && (
            <ol className="mb-2 list-decimal space-y-1 pl-5 text-[15px]">
              {l.summary.map((s) => (
                <li key={s.title}>
                  <b>{s.title}.</b> {s.body}
                </li>
              ))}
            </ol>
          )}
          {l.priorities && (
            <>
              <h3 className="mt-2 text-sm font-bold">Nursing priorities</h3>
              <ul className="list-disc pl-5 text-[15px]">{l.priorities.map((p) => <li key={p}>{p}</li>)}</ul>
            </>
          )}
          {l.traps && (
            <>
              <h3 className="mt-2 text-sm font-bold">Traps</h3>
              <ul className="list-disc pl-5 text-[15px]">{l.traps.map((p) => <li key={p}>{p}</li>)}</ul>
            </>
          )}
          {l.corrections?.length ? (
            <>
              <h3 className="mt-2 text-sm font-bold">Corrections to the video</h3>
              <ul className="list-disc pl-5 text-[15px]">{l.corrections.map((c) => <li key={c.at}>{c.correct}</li>)}</ul>
            </>
          ) : null}
        </section>
      ))}
      {cs.length > 0 && (
        <section>
          <h2 className="mb-2 font-display text-[21px] font-semibold">Self-test</h2>
          <p className="mb-3 text-sm text-ink-muted">Cover the right column and answer out loud.</p>
          <table className="w-full text-left text-[14px]">
            <tbody>
              {cs.map((c) => (
                <tr key={c.id} className="border-t border-hairline align-top">
                  <td className="w-1/2 py-2 pr-3 font-semibold">{c.front}</td>
                  <td className="py-2">{c.back}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </article>
  );
}

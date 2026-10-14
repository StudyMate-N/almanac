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
      {ls.some((l) => l.kind === "topic") && (
        <section className="mb-7">
          <h2 className="mb-2 font-display text-[21px] font-semibold">Key points by topic</h2>
          {ls
            .filter((l) => l.kind === "topic")
            .map((l) => {
              const kp = l.blocks.find((b) => b.t === "keypoints");
              return kp && kp.t === "keypoints" ? (
                <div key={l.id} className="mb-3 break-inside-avoid-page">
                  <h3 className="mb-1 text-sm font-bold">{l.title}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-[15px]">
                    {kp.items.map((it) => (
                      <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
        </section>
      )}
      {ls
        .filter((l) => l.kind === "summary")
        .map((l) => (
          <section key={l.id} className="mb-7 break-inside-avoid-page">
            <h2 className="mb-2 font-display text-[21px] font-semibold">{l.groupTitle.replace(/:\s*Summary$/, "")}</h2>
            {l.blocks.map((b, i) =>
              b.t === "ul" || b.t === "ol" ? (
                <ul key={i} className="mb-2 list-disc space-y-1 pl-5 text-[15px]">
                  {b.items.map((it) => (
                    <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </ul>
              ) : b.t === "p" ? (
                <p key={i} className="mb-2 text-[15px]" dangerouslySetInnerHTML={{ __html: b.html }} />
              ) : b.t === "confused" ? (
                <div key={i} className="mb-3 break-inside-avoid-page">
                  <h3 className="mt-3 mb-1 text-sm font-bold">Commonly confused</h3>
                  <ul className="space-y-1.5 text-[15px]">
                    {b.rows.map(([x, y, d]) => (
                      <li key={x + y}>
                        <strong>
                          {x} vs {y}:
                        </strong>{" "}
                        <span dangerouslySetInnerHTML={{ __html: d }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : b.t === "values" ? (
                <div key={i} className="mb-3 break-inside-avoid-page">
                  <h3 className="mt-3 mb-1 text-sm font-bold">Key values</h3>
                  <table className="w-full text-left text-[14px]">
                    <tbody>
                      {b.rows.map((r) => (
                        <tr key={r[0]} className="border-t border-hairline align-top">
                          <th scope="row" className="py-1.5 pr-3 font-semibold">{r[0]}</th>
                          <td className="py-1.5 pr-3 font-bold">{r[1]}</td>
                          <td className="py-1.5 text-ink-muted">{r[2] ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : b.t === "h2" && b.text !== "Take a moment to review" ? (
                <h3 key={i} className="mt-3 mb-1 text-sm font-bold">
                  {b.text}
                </h3>
              ) : null,
            )}
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

"use client";

import "@fontsource-variable/source-serif-4";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { courseById, moduleById } from "@/content/course";
import { REVIEWER } from "@/lib/config";
import { readingWords } from "@/lib/minutes";
import { useCourse } from "@/lib/use-course";
import { useStudent } from "@/lib/store";

export default function Guide() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { lessons, cards } = useCourse();
  const { authorizedCourses } = useStudent();
  const mod = moduleById(moduleId);
  const ls = lessons.filter((l) => l.moduleId === moduleId);
  const cs = cards.filter((c) => c.moduleId === moduleId);
  const [active, setActive] = useState("");
  const topics = ls.filter((l) => l.kind === "topic" && l.blocks.some((b) => b.t === "keypoints"));
  const summaries = ls.filter((l) => l.kind === "summary");
  const toc = [
    ...(topics.length ? [{ id: "key-points", label: "Key points by topic" }] : []),
    ...summaries.map((l) => ({ id: `s-${l.id}`, label: l.groupTitle.replace(/:\s*Summary$/, "") })),
    ...(cs.length ? [{ id: "self-test", label: "Self-test" }] : []),
  ];
  const tocKey = toc.map((t) => t.id).join("|");
  useEffect(() => {
    const els = tocKey.split("|").map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-80px 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [tocKey]);
  if (!mod || !authorizedCourses.includes(mod.courseId) || ls.length === 0)
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="rounded-[16px] border border-hairline bg-white p-6">
          This study guide opens once its lessons are approved. <Link href={mod ? `/app/courses/${mod.courseId}` : "/app/courses"} className="font-bold text-violet-700">Back</Link>
        </p>
      </main>
    );

  const course = courseById(mod.courseId);
  const test = ls.find((l) => l.kind === "test");
  const minutes = Math.max(1, Math.round((readingWords(topics.flatMap((l) => l.blocks)) + readingWords(summaries.flatMap((l) => l.blocks)) + cs.length * 25) / 200));
  const reviewed = course?.reviewer === "nurse" ? `Reviewed by ${REVIEWER.name}, ${REVIEWER.credentials}` : "Reviewed by a subject expert";
  const title = mod.kind === "section" ? `Section ${mod.number}: ${mod.title}` : mod.title;
  const h2 = "mb-3 scroll-mt-24 font-display text-[22px] font-bold tracking-[-.02em] sm:text-[24px]";
  const prose = "font-['Source_Serif_4_Variable',Georgia,serif] text-[17px] leading-[1.7] text-ink sm:text-[18px]";
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EEEBF7] bg-white px-4 sm:h-[60px] sm:gap-3.5 sm:px-6 print:hidden" style={{ viewTransitionName: "focus-bar" }}>
        <Link href={`/app/courses/${mod.courseId}`} aria-label="Back to the course" className="grid h-11 w-11 flex-none place-items-center rounded-full border border-hairline text-[16px] hover:bg-mist sm:h-10 sm:w-10">
          ←
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[11.5px] font-bold text-violet-700">{course?.title} · Study guide</span>
          <span className="truncate font-display text-[15px] font-bold">{title}</span>
        </div>
        <span className="hidden text-[13px] text-ink-muted sm:block">About {minutes} min read</span>
      </header>
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 pt-6 pb-16 sm:px-8 sm:pt-10 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-between xl:grid-cols-[220px_minmax(0,680px)_260px] print:block print:p-0">
        <nav aria-label="On this page" className="sticky top-[92px] hidden self-start lg:block print:hidden">
          <p className="mb-2 px-2.5 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">ON THIS PAGE</p>
          <ul className="flex flex-col gap-0.5">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className={`block rounded-r-[8px] border-l-2 py-2 pr-2 pl-2.5 text-[13.5px] ${active === t.id ? "border-violet font-bold text-violet-deep" : "border-transparent text-ink-body hover:text-ink"}`}>
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <article className="guide min-w-0">
          <p className="text-[13px] text-ink-muted">{mod.kind === "section" ? `Section ${mod.number}` : course?.title}</p>
          <h1 className="mt-1 mb-6 font-display text-[30px] leading-[1.05] font-bold tracking-[-.04em] sm:text-[40px]">{mod.title}</h1>
          {topics.length > 0 && (
            <section id="key-points" className="mb-9 scroll-mt-24 rounded-[16px] border border-hairline bg-white p-5 break-inside-avoid-page">
              <p className="mb-3 text-[11px] font-extrabold tracking-[.12em] text-violet-700">KEY POINTS BY TOPIC</p>
              {topics.map((l) => {
                const kp = l.blocks.find((b) => b.t === "keypoints");
                return kp && kp.t === "keypoints" ? (
                  <div key={l.id} className="mb-4 last:mb-0">
                    <h3 className="mb-1 text-[14.5px] font-bold">{l.title}</h3>
                    <ul className="list-disc space-y-1 pl-5 text-[15px] leading-normal marker:text-violet">
                      {kp.items.map((it) => (
                        <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
            </section>
          )}
          {summaries.map((l) => (
            <section key={l.id} id={`s-${l.id}`} className="mb-9 break-inside-avoid-page">
              <h2 className={h2}>{l.groupTitle.replace(/:\s*Summary$/, "")}</h2>
              {l.blocks.map((b, i) =>
                b.t === "ul" || b.t === "ol" ? (
                  <ul key={i} className={`mb-4 list-disc space-y-1.5 pl-6 marker:text-violet ${prose}`}>
                    {b.items.map((it) => (
                      <li key={it} dangerouslySetInnerHTML={{ __html: it }} />
                    ))}
                  </ul>
                ) : b.t === "p" ? (
                  <p key={i} className={`mb-4 ${prose}`} dangerouslySetInnerHTML={{ __html: b.html }} />
                ) : b.t === "confused" ? (
                  <div key={i} className="mb-5 rounded-[16px] bg-lilac p-[16px_18px] break-inside-avoid-page">
                    <p className="mb-2 text-[11px] font-extrabold tracking-[.12em] text-violet-700">COMMONLY CONFUSED</p>
                    <ul className="space-y-2 text-[15px] leading-normal">
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
                  <div key={i} className="mb-5 overflow-hidden rounded-[16px] border border-hairline bg-white break-inside-avoid-page">
                    <p className="px-4 pt-3.5 pb-1 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">KEY VALUES</p>
                    <table className="w-full text-left text-[14px]">
                      <tbody>
                        {b.rows.map((r) => (
                          <tr key={r[0]} className="border-t border-[#EEEBF7] align-top">
                            <th scope="row" className="px-4 py-2 font-semibold">{r[0]}</th>
                            <td className="py-2 pr-3 font-bold">{r[1]}</td>
                            <td className="py-2 pr-4 text-ink-muted">{r[2] ?? ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : b.t === "h2" && b.text !== "Take a moment to review" ? (
                  <h3 key={i} className="mt-5 mb-2 font-display text-[18px] font-bold">
                    {b.text}
                  </h3>
                ) : null,
              )}
            </section>
          ))}
          {cs.length > 0 && (
            <section id="self-test" className="mb-9 scroll-mt-24">
              <h2 className={h2}>Self-test</h2>
              <p className="mb-3 text-[14px] text-ink-muted">Cover the right column and answer out loud.</p>
              <div className="overflow-hidden rounded-[16px] border border-hairline bg-white">
                <table className="w-full text-left text-[14.5px]">
                  <tbody>
                    {cs.map((c) => (
                      <tr key={c.id} className="border-t border-[#EEEBF7] align-top first:border-t-0">
                        <td className="w-1/2 px-4 py-3 font-semibold">{c.front}</td>
                        <td className="py-3 pr-4">
                          {c.back}
                          {c.detail && <span className="mt-0.5 block text-[13px] text-ink-muted">{c.detail}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5 print:hidden">
            <span className="text-[13px] text-ink-muted">{reviewed}</span>
            {test ? (
              <Link href={`/app/learn/${test.id}`} className="flex h-12 items-center rounded-[12px] bg-violet px-5 text-[14.5px] font-bold text-white hover:bg-[#4A2DE6]">
                Test yourself on Section {mod.number} →
              </Link>
            ) : (
              <Link href={`/app/courses/${mod.courseId}`} className="flex h-12 items-center rounded-[12px] bg-violet px-5 text-[14.5px] font-bold text-white hover:bg-[#4A2DE6]">
                Back to the course →
              </Link>
            )}
          </div>
          <p className="hidden text-sm text-ink-muted print:block">{reviewed}</p>
        </article>
        <aside className="hidden flex-col gap-4 self-start xl:sticky xl:top-[92px] xl:flex print:hidden">
          <section className="flex flex-col gap-2 rounded-[16px] border border-hairline bg-white p-3.5">
            <p className="px-0.5 pb-1 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">REVISION TOOLS</p>
            <button type="button" onClick={() => window.print()} className="flex h-11 items-center rounded-[12px] border border-hairline px-3 text-left text-[13.5px] font-bold hover:bg-mist">
              Print or save as PDF
            </button>
            {cs.length > 0 && (
              <Link href="/app/review" className="flex h-11 items-center rounded-[12px] border border-hairline px-3 text-[13.5px] font-bold hover:bg-mist">
                Review your cards
              </Link>
            )}
            {test && (
              <Link href={`/app/learn/${test.id}`} className="flex h-11 items-center rounded-[12px] border border-hairline px-3 text-[13.5px] font-bold hover:bg-mist">
                Take the section test
              </Link>
            )}
          </section>
          <section className="rounded-[16px] border border-hairline bg-white p-3.5">
            <p className="pb-1 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">THIS GUIDE</p>
            <p className="text-[13px] leading-normal text-ink-body">
              {topics.length} topic{topics.length === 1 ? "" : "s"} · {cs.length} self-test card{cs.length === 1 ? "" : "s"} · about {minutes} min read.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

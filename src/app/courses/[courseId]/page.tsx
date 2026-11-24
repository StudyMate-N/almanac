import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { PathoPage } from "@/components/site/patho-page";
import { courseById, courses } from "@/content/course";

export const dynamicParams = false;
export const generateStaticParams = () => courses.map((c) => ({ courseId: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const c = courseById((await params).courseId);
  return c ? { title: c.title, description: c.blurb } : {};
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const c = courseById((await params).courseId);
  if (!c) notFound();
  if (c.id === "advanced-pathophysiology") return <PathoPage />;
  if (c.id === "advanced-pharmacology") {
    const topics=[
      "Pharmacology foundations, PK/PD and lifespan prescribing",
      "Autonomic and peripheral nervous system",
      "Central nervous system, pain and orthopedic therapy",
      "Psychotherapeutics and substance-use pharmacology",
      "Hypertension and heart-failure treatment",
      "Atrial fibrillation, coronary disease and lipid management",
      "Endocrine, diabetes and reproductive pharmacology",
      "Immunology, disease-modifying drugs and vaccines"
    ];
    return <div className="alm-public min-h-screen">
      <SiteHeader/>
      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-8 sm:px-6">
        <Link href="/courses" className="text-sm font-semibold text-violet-700">← All courses</Link>
        <section className="alm-gradient-lilac mt-5 overflow-hidden rounded-[20px] border border-hairline">
          <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(290px,.9fr)] lg:items-center">
            <div>
              <span className="alm-pill">Learning pilot in review</span>
              <p className="alm-eyebrow mt-5">Nursing · Graduate</p>
              <h1 className="mt-2 font-display text-[36px] font-bold leading-[1.05] sm:text-[48px]">Advanced Pharmacology</h1>
              <p className="mt-4 max-w-[570px] text-[15px] leading-7 text-ink-body">Learn how medicines work, why patients respond differently and how to reason through prescribing and monitoring decisions.</p>
              <p className="mt-4 max-w-[540px] text-sm leading-6 text-ink-body">Our first prepared learning sequence focuses on <strong>NUR-635 midterm Topics 1–8</strong>. Structured lessons and practice are in final review; narrated videos and remaining supporting resources are still being prepared.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/request?course=advanced-pharmacology" className="alm-action">What is changing →</Link>
                <a href="#midterm-outline" className="alm-action alm-action-secondary">See midterm topics ↓</a>
              </div>
              <p className="mt-4 text-xs text-ink-muted">New learning-package orders are paused during Almanac's redesign. Existing approved learners may continue using available course materials.</p>
            </div>
            <img src="/almanac-art/cover-pharmacology.png" alt="Advanced Pharmacology course artwork" className="aspect-[16/10] h-full w-full rounded-[16px] object-cover" />
          </div>
        </section>
        <section id="midterm-outline" className="mt-9 rounded-[20px] border border-hairline bg-white p-6 sm:p-8">
          <p className="alm-eyebrow">First learning sequence</p>
          <h2 className="mt-2 font-display text-[27px] font-bold">The eight topics covered in the midterm</h2>
          <p className="mt-3 max-w-[750px] text-sm leading-6 text-ink-body">A focused study route for understanding the mechanisms, clinical applications and safety concepts most relevant to your exam. Practice questions, revision cards and a timed rehearsal support the written lessons.</p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {topics.map((topic,i)=><li key={topic} className="flex gap-3 rounded-[14px] bg-[#F7F6FB] p-4">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[#2A1B78] text-sm font-bold text-white">{i+1}</span>
              <span className="text-[14px] font-semibold leading-6">{topic}</span>
            </li>)}
          </ol>
        </section>
        <section className="mt-7 grid gap-5 rounded-[20px] bg-[#2A1B78] p-6 text-white md:grid-cols-[1fr_auto] md:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">Prepared around your assessment</p>
            <h2 className="mt-2 font-display text-[27px] font-bold">Choose the support you need.</h2>
            <p className="mt-3 max-w-[650px] text-sm leading-6 text-white/80">This course is being developed into a more guided learning experience. Explore the topics shown here; new orders are currently paused.</p>
          </div>
          <Link href="/request?course=advanced-pharmacology" className="alm-action border-white bg-white text-[#2A1B78] hover:bg-[#F6F4FB]">Read product update →</Link>
        </section>
        <p className="mt-6 text-xs text-ink-muted">Almanac provides independent study support. It is not affiliated with or endorsed by Grand Canyon University.</p>
      </main>
      <SiteFooter/>
    </div>;
  }
  const cover = c.id.includes("pharm") ? "cover-pharmacology.png" : c.id.includes("editing") ? "cover-editing-proofreading.png" : c.id.includes("ai") ? "cover-practical-ai-skills.png" : "cover-on-request.png";

  return (
    <div className="alm-public min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-20 sm:px-6">
        <p className="text-sm font-bold text-violet-700">
          <Link href="/#courses" className="hover:underline">
            Almanac courses
          </Link>{" "}
          · {c.category}
        </p>
        <section className="alm-gradient-lilac mt-4 overflow-hidden rounded-[20px] border border-hairline">
          <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(290px,.9fr)] lg:items-center">
            <div>
              <span className="alm-pill">Learning concept in development</span>
              <h1 className="mt-4 text-[35px] leading-[1.05] sm:text-[46px]">{c.title}</h1>
              <p className="mt-4 max-w-[530px] text-[15px] leading-relaxed text-ink-body">{c.blurb}</p>
              <p className="mt-4 max-w-[530px] text-[14px] text-ink-body">New custom learning orders are paused. Almanac is reviewing how to guide learning from a clear goal through appropriate lessons, practice and feedback.</p>
              <Link href={`/request?course=${encodeURIComponent(c.id)}`} className="alm-action mt-6">Read product update →</Link>
              <p className="mt-4 text-[12px] text-ink-muted">Existing approved learners retain their access. No new payment or order can be initiated through the retired checkout.</p>
            </div>
            <div className="alm-course-media relative aspect-[16/10] border border-hairline">
              <img src={`/almanac-art/${cover}`} alt={`${c.title} course artwork`} className="h-full w-full object-cover" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

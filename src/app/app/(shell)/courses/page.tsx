"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { comingCourses, lessons as allLessons, modulesInCourse, openCourses } from "@/content/course";
import type { Course } from "@/content/types";
import { daysUntil, planFor, weekToday } from "@/lib/plan";
import { readiness, readinessLabel, readinessTone } from "@/lib/progress";
import { useStudent } from "@/lib/store";
import { useCourse } from "@/lib/use-course";

const cover: Record<string,string> = {
 "advanced-pathophysiology":"/almanac-art/cover-pathophysiology.png",
 "advanced-pharmacology":"/almanac-art/cover-pharmacology.png",
 "practical-ai-skills":"/almanac-art/cover-practical-ai-skills.png",
 "editing-and-proofreading":"/almanac-art/cover-editing-proofreading.png",
};
function PreparedCourse({course}:{course:Course}) {
 const image=cover[course.id]||"/almanac-art/cover-on-request.png";
 return <article className="alm-desk-card min-w-[236px] shrink-0 overflow-hidden sm:min-w-0">
  <div className="relative h-[130px] overflow-hidden bg-[#E6E0F8]">
   <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url("${image}")`}} role="img" aria-label={course.title+" course cover"}/>
   <span className="absolute right-3 top-3 rounded-full bg-[#FFF4EC] px-2.5 py-1 text-[10px] font-bold text-[#9D3E0E]">Prepared on request</span>
  </div>
  <div className="p-4">
   <p className="alm-desk-eyebrow">{course.category}</p>
   <h3 className="mt-2 text-[17px] font-bold">{course.title}</h3>
   <p className="mt-2 line-clamp-3 text-[12px] text-ink-body">{course.blurb}</p>
   <Link href={`/request?course=${encodeURIComponent(course.id)}`} className="mt-3 inline-flex min-h-[42px] items-center text-[12px] font-bold text-violet-700">
    Request this course <ArrowRightIcon size={14}/>
   </Link>
  </div>
 </article>;
}
export default function Courses() {
 const {state,authorizedCourses}=useStudent();
 const {questions,scored,lessonOpen}=useCourse();
 return <div className="mx-auto max-w-[1110px]">
  <PageHeader eyebrow="Almanac" title="Your courses"/>
  <p className="-mt-2 mb-6 text-[13px] text-ink-muted">Pick up where you left off, or set a plan for what comes next.</p>
  <div className="space-y-4">
   {openCourses.filter(c=>authorizedCourses.includes(c.id)).map(c=>{
    const moduleIds=modulesInCourse(c.id).map(m=>m.id);
    const qs=questions.filter(q=>moduleIds.includes(q.moduleId));
    const readinessResult=readiness(qs,scored);
    const accessible=allLessons.filter(l=>moduleIds.includes(l.moduleId)&&lessonOpen(l.id));
    const completed=accessible.filter(l=>Boolean(state.lessons[l.id])).length;
    const percent=accessible.length?Math.round(completed/accessible.length*100):0;
    const plan=planFor(state,c.id);
    const toFinal=daysUntil(plan?.final);
    const begun=completed>0;
    return <article key={c.id} className="alm-desk-card alm-desk-panel overflow-hidden">
     <div className="grid md:grid-cols-[minmax(220px,36%)_minmax(0,1fr)]">
      <div className="relative min-h-[180px] overflow-hidden bg-[#D9D1ED] md:min-h-[275px]">
       <div className="absolute inset-0 bg-cover" style={{backgroundImage:`url("${cover[c.id]||"/almanac-art/cover-pathophysiology.png"}")`,backgroundPosition:"80% 55%",backgroundSize:"150% auto"}} role="img" aria-label={c.title+" cover"}/>
      </div>
      <div className="p-5 sm:p-6">
       <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="alm-desk-eyebrow">{c.category}</span>
        <span className={`alm-desk-chip ${begun?"alm-chip-ready":""}`}>{begun?"Started":plan?"Plan set":"No plan yet"}</span>
       </div>
       <h2 className="mt-3 text-[24px] font-bold sm:text-[27px]">{c.title}</h2>
       <p className="mt-2 max-w-[630px] text-[13px] leading-relaxed text-ink-body">{c.blurb}</p>
       <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-muted">
        <span>{completed} of {accessible.length} available pages completed</span>
        <span aria-hidden="true">·</span>
        <span>{plan?`Week ${weekToday(plan)} of ${plan.courseWeeks}`:"Your plan is not set up yet"}</span>
        {toFinal!==null&&toFinal>=0&&<span>· Final in {toFinal} day{toFinal===1?"":"s"}</span>}
       </div>
       <div className="mt-2 flex items-center gap-3">
        <div className="alm-desk-progress flex-1" role="progressbar" aria-label="Course completion" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percent}%`}}/></div>
        <span className="text-[12px] font-bold text-violet-700">{percent}%</span>
       </div>
       {qs.length>0&&<p className="mt-3 text-[12px] text-ink-muted">Practice readiness: <span className={readinessTone[readinessResult.level].chip+" rounded-full px-2 py-0.5 font-semibold"}>{readinessLabel[readinessResult.level]}</span></p>}
       <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/app/courses/${c.id}`} className="alm-desk-btn alm-desk-btn-secondary">Open course <ArrowRightIcon size={15}/></Link>
        <Link href={`/app/setup?course=${c.id}`} className="alm-desk-btn">{plan?"Edit study plan":"Set up your plan"} <ArrowRightIcon size={15}/></Link>
       </div>
      </div>
     </div>
    </article>;
   })}
  </div>
  {comingCourses.length>0&&<section className="mt-9">
   <div className="flex flex-wrap items-baseline justify-between gap-3">
    <div><p className="alm-desk-eyebrow">Explore more</p><h2 className="mt-2 text-[23px] font-bold">More courses on Almanac</h2></div>
    <Link href="/request" className="text-[12px] font-bold text-violet-700">Request a different course →</Link>
   </div>
   <p className="mt-2 max-w-[680px] text-[13px] text-ink-body">These courses can be prepared for you. Choose a package and delivery timeline, with the price shown before you submit.</p>
   <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
    {comingCourses.map(c=><div key={c.id} className="w-[250px] snap-start sm:w-auto"><PreparedCourse course={c}/></div>)}
   </div>
  </section>}
 </div>;
}

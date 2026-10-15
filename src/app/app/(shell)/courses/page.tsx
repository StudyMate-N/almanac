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
 return <article className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#EEEBF7] bg-white">
  <div className="relative h-[132px]" role="img" aria-label={course.title+" course cover"} style={{background:`#E6E0F8 url("${image}") 80% 55%/150% auto no-repeat`}}>
   <span className="absolute top-2.5 left-2.5 rounded-full bg-[#FFE9DC] px-2.5 py-1 text-[11.5px] font-extrabold text-[#A8430A]">Prepared on request</span>
  </div>
  <div className="flex flex-1 flex-col gap-1 px-[18px] pt-4 pb-[18px]">
   <span className="text-[12px] font-bold text-ink-muted">{course.category}</span>
   <h3 className="font-display text-[18px] font-bold tracking-[-.02em]">{course.title}</h3>
   <p className="line-clamp-3 text-[13.5px] leading-[1.55] text-ink-body">{course.blurb}</p>
   <Link href={`/request?course=${encodeURIComponent(course.id)}`} className="mt-auto inline-flex min-h-11 items-center gap-1 pt-2 text-[13.5px] font-bold text-violet-700">
    Request this course <ArrowRightIcon size={14}/>
   </Link>
  </div>
 </article>;
}
export default function Courses() {
 const {state,authorizedCourses}=useStudent();
 const {questions,scored,lessonOpen}=useCourse();
 const ownedCount=openCourses.filter(c=>authorizedCourses.includes(c.id)).length;
 const prepared=comingCourses.filter(c=>!authorizedCourses.includes(c.id));
 const filler=(3-(prepared.length%3))%3;
 return <div className="mx-auto max-w-[1128px]">
  <PageHeader large eyebrow={ownedCount?`${ownedCount} active course${ownedCount===1?"":"s"}`:undefined} title="Your courses"/>
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
    const sprint=c.id==="advanced-pharmacology";
    return <article key={c.id} className="grid overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_18px_40px_rgba(42,27,120,.08)] md:grid-cols-[380px_minmax(0,1fr)]">
     <div className="h-[150px] bg-[#E6E0F8] md:h-auto md:min-h-[236px]" role="img" aria-label={c.title+" cover"}
      style={{background:`#E6E0F8 url("${cover[c.id]||"/almanac-art/cover-on-request.png"}") 80% 55%/150% auto no-repeat`}}/>
     <div className="flex flex-col gap-3.5 p-4 sm:px-7 sm:py-[26px]">
      <div className="flex flex-col gap-1.5">
       <span className="text-[12.5px] font-bold text-ink-muted">{c.category}</span>
       <h2 className="font-display text-[20px] leading-[1.1] font-bold tracking-[-.03em] sm:text-[28px]">{c.title}</h2>
      </div>
      {sprint?<p className="text-[13.5px] text-ink-body">NUR-635 midterm sprint · eight topics with lessons, practice, flashcards and simulations</p>:
      <div className="flex flex-col gap-2">
       <div className="flex justify-between gap-3 text-[13.5px] text-ink-body">
        <span>{plan?`Week ${weekToday(plan)} of ${plan.courseWeeks}`:"No plan yet"} · {completed} of {accessible.length} pages done{toFinal!==null&&toFinal>=0?` · final in ${toFinal} day${toFinal===1?"":"s"}`:""}</span>
        <span className="font-bold">{percent}%</span>
       </div>
       <div className="alm-desk-progress !h-1.5" role="progressbar" aria-label="Course completion" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percent}%`}}/></div>
      </div>}
      <div className="mt-auto flex flex-wrap items-center gap-2.5">
       {!sprint&&<div className="flex w-full flex-wrap gap-2 sm:w-auto"><span className={`rounded-full px-[11px] py-[5px] text-[12px] font-bold whitespace-nowrap ${begun?"bg-mint text-correct":"bg-mist text-ink-muted"}`}>{begun?"Started":"Not started"}</span>
       {qs.length>0&&readinessResult.answered>0&&<span className={`rounded-full px-[11px] py-[5px] text-[12px] font-bold whitespace-nowrap ${readinessTone[readinessResult.level].chip}`}>Readiness: {readinessLabel[readinessResult.level]}</span>}</div>}
       <span className="hidden flex-1 sm:block"/>
       {sprint?<>
        <Link href={`/app/courses/${c.id}`} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border-[1.5px] sm:flex-none border-[#D9D2F3] px-[18px] text-[14px] font-bold whitespace-nowrap text-violet-deep hover:bg-mist">Open →</Link>
        <Link href="/app/midterm/nur635" className="flex h-11 flex-[1.4] items-center justify-center rounded-[12px] bg-violet sm:flex-none px-5 text-[14px] font-bold whitespace-nowrap text-white hover:bg-[#4A2DE6]">Open midterm sprint</Link>
       </>:<>
        <Link href={`/app/courses/${c.id}`} className="flex h-11 flex-1 items-center justify-center rounded-[12px] border-[1.5px] sm:flex-none border-[#D9D2F3] px-[18px] text-[14px] font-bold whitespace-nowrap text-violet-deep hover:bg-mist">Open →</Link>
        <Link href={`/app/setup?course=${c.id}`} className="flex h-11 flex-[1.4] items-center justify-center rounded-[12px] bg-violet sm:flex-none px-5 text-[14px] font-bold whitespace-nowrap text-white hover:bg-[#4A2DE6]">{plan?"Edit study plan":"Set up your plan"}</Link>
       </>}
      </div>
     </div>
    </article>;
   })}
  </div>
  {prepared.length>0&&<section className="mt-9 flex flex-col gap-3.5">
   <div><div className="flex flex-wrap items-baseline justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700">EXPLORE MORE</p><h2 className="mt-1 font-display text-[22px] font-bold tracking-[-.02em]">More courses on Almanac</h2></div>
    {filler===0&&<Link href="/request" className="text-[13px] font-bold text-violet-700">Request a different course →</Link>}</div>
    <p className="mt-1 max-w-[680px] text-[13.5px] text-ink-body">These courses can be prepared for you. Choose a package and delivery timeline, with the price shown before you submit.</p></div>
   <div className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
    {prepared.map(c=><div key={c.id} className="w-[250px] flex-none snap-start sm:w-auto"><PreparedCourse course={c}/></div>)}
    {filler>0&&<Link href="/request" className="flex w-[250px] flex-none snap-start flex-col items-start justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#D9D2F3] bg-transparent p-5 hover:border-violet hover:bg-white sm:w-auto">
     <span className="font-display text-[18px] font-bold tracking-[-.02em]">Request a different course</span>
     <span className="text-[13.5px] leading-normal text-ink-body">Tell us your course and what you need. You see the price before you submit.</span>
     <span className="mt-1 text-[13.5px] font-bold text-violet-700">Start a request →</span>
    </Link>}
   </div>
  </section>}
 </div>;
}

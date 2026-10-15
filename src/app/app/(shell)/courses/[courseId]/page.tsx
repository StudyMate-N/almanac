"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowRightIcon,CheckIcon} from "@/components/icons";
import {Ring} from "@/components/player/outline";
import {courseById,groupsInModule} from "@/content/course";
import {EXAMS} from "@/lib/config";
import {moduleWeeks,planFor,weekToday} from "@/lib/plan";
import {readiness,readinessLabel,readinessTone} from "@/lib/progress";
import {useStudent} from "@/lib/store";
import {useCourse} from "@/lib/use-course";

export default function CourseOutline(){
 const {courseId}=useParams<{courseId:string}>();
 const {state}=useStudent();
 const {modules,lessons,questions,scored}=useCourse(courseId);
 const course=courseById(courseId);
 const plan=planFor(state,courseId);
 const weeks=plan?moduleWeeks(plan,courseId):null;
 const week=plan?weekToday(plan):null;
 if(!course||course.status!=="open")return <p className="alm-desk-card p-5">
   This course isn&apos;t open yet. <Link href="/app/courses" className="font-bold text-violet-700">See your courses →</Link>
 </p>;
 const accessible=new Set(lessons.map(l=>l.id));
 const done=(id:string)=>Boolean(state.lessons[id]);
 const allPages=modules.flatMap(m=>groupsInModule(m.id).flatMap(g=>g.pages));
 const doneCount=allPages.filter(p=>done(p.id)).length;
 const pct=allPages.length?Math.round(doneCount/allPages.length*100):0;
 const resume=allPages.find(p=>accessible.has(p.id)&&!done(p.id))??allPages.find(p=>accessible.has(p.id));
 const start=modules.find(m=>m.kind==="start");
 const final=modules.find(m=>m.kind==="final");
 const sections=modules.filter(m=>m.kind==="section");
 const firstOpen=(moduleId:string)=>{
  const ps=groupsInModule(moduleId).flatMap(g=>g.pages).filter(p=>accessible.has(p.id));
  return ps.find(p=>!done(p.id))??ps[0];
 };
 const current=sections.find(m=>weeks&&week&&weeks[m.id]===week)??sections.find(m=>groupsInModule(m.id).flatMap(g=>g.pages).some(p=>accessible.has(p.id)&&!done(p.id)))??sections[0];
 return <div className="mx-auto max-w-[1110px]">
  <nav aria-label="Breadcrumb" className="mb-4 text-[12px] font-semibold text-ink-muted">
   <Link href="/app/courses" className="text-violet-700">Courses</Link> / {course.title}
  </nav>
  <section className="alm-desk-card overflow-hidden">
   <div className="grid gap-0 md:grid-cols-[1fr_235px]">
    <div className="p-5 sm:p-7">
     <span className="alm-desk-eyebrow">{course.category}</span>
     <h1 className="mt-3 text-[30px] font-bold sm:text-[34px]">{course.title}</h1>
     <p className="mt-2 max-w-[680px] text-[13px] leading-relaxed text-ink-body">{course.blurb}</p>
     <div className="mt-5 flex flex-wrap items-center gap-2">
       {resume&&<Link href={`/app/learn/${resume.id}`} className="alm-desk-btn">{doneCount?"Continue learning":"Start the course"} <ArrowRightIcon size={14}/></Link>}
       <Link href={`/app/setup?course=${course.id}`} className="alm-desk-btn alm-desk-btn-secondary">
          {plan?`Week ${week} of ${plan.courseWeeks} · Edit plan`:"Set up your plan"}
       </Link>
     </div>
     <div className="mt-5 max-w-[570px]"><div className="flex justify-between text-[12px] text-ink-muted"><span>{doneCount} of {allPages.length} pages complete</span><strong className="text-violet-700">{pct}%</strong></div>
       <div className="alm-desk-progress mt-2"><span style={{width:`${pct}%`}}/></div></div>
    </div>
    <div className="alm-cover min-h-[155px] bg-[#E6E0F8] md:min-h-full" aria-label="Advanced Pathophysiology course cover" role="img"/>
   </div>
  </section>
  <p className="my-5 text-[12px] text-ink-muted">{course.fit} Almanac is independent of your school and publisher.</p>
  {start&&<section className="alm-desk-card mb-4 flex flex-wrap items-center gap-4 p-4 sm:p-5">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-lilac font-bold text-violet-700">★</span>
    <div className="min-w-0 flex-1"><p className="alm-desk-eyebrow">Start here</p>
     <h2 className="text-[17px] font-bold">{start.title}</h2>
     <p className="mt-1 text-[12px] text-ink-muted">{start.blurb}</p></div>
    {firstOpen(start.id)&&<Link href={`/app/learn/${firstOpen(start.id)!.id}`} className="alm-desk-btn alm-desk-btn-secondary">Open →</Link>}
  </section>}
  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
    <h2 className="text-[24px] font-bold">Seven competencies</h2>
    <span className="alm-desk-chip">{sections.filter(m=>groupsInModule(m.id).flatMap(g=>g.pages).every(p=>done(p.id))).length} complete</span>
  </div>
  <div className="space-y-2">
   {sections.map(m=>{
     const groups=groupsInModule(m.id);
     const pages=groups.flatMap(g=>g.pages);
     const completed=pages.filter(p=>done(p.id)).length;
     const allDone=pages.length>0&&completed===pages.length;
     const go=firstOpen(m.id);
     const isCurrent=m.id===current?.id;
     const r=readiness(questions.filter(q=>q.moduleId===m.id),scored);
     const topics=pages.filter(p=>p.kind==="topic");
     const rows=topics.length?topics.map(p=>({id:p.id,title:p.title,pages:[p]})):groups.filter(g=>/^Lesson \d+:/.test(g.title));
     const test=pages.find(p=>p.kind==="test");
     return <details key={m.id} open={isCurrent?true:undefined} className="group alm-desk-card overflow-hidden">
      <summary className="flex min-h-[74px] cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
       <span className={`grid h-10 w-10 flex-none place-items-center rounded-xl font-display text-[18px] font-bold ${allDone?"bg-mint text-mint-ink":isCurrent?"bg-[#2A1B78] text-white":"bg-lilac text-violet-700"}`}>
        {allDone?<CheckIcon size={17}/>:m.number}
       </span>
       <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold uppercase tracking-[.11em] text-ink-muted">Section {m.number}{weeks?` · Week ${weeks[m.id]}`:""}</span>
        <span className="mt-1 block text-[16px] font-bold">{m.title}</span>
       </span>
       <span className="hidden text-[12px] text-ink-muted sm:block">{completed}/{pages.length} pages</span>
       <Ring done={completed} total={pages.length} size={32}/>
       <span className="text-violet-700 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
      </summary>
      <div className="border-t border-hairline px-4 pb-5 pt-4 sm:px-5">
       <p className="text-[13px] text-ink-body">{m.blurb}</p>
       <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {rows.map(g=>{
          const available=g.pages.find(p=>accessible.has(p.id));
          const finished=g.pages.filter(p=>done(p.id)).length;
          return available?<Link key={g.id} href={`/app/learn/${available.id}`}
            className="flex min-h-11 items-center gap-3 rounded-xl bg-[#F7F6FB] px-3 text-[12px] font-semibold hover:bg-lilac">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${finished===g.pages.length?"bg-mint text-mint-ink":"bg-white text-violet-700"}`}>{finished===g.pages.length?"✓":"→"}</span>
            <span className="min-w-0 flex-1">{g.title}</span>
           </Link>:<div key={g.id} className="flex min-h-11 items-center justify-between gap-2 rounded-xl bg-[#F7F6FB] px-3 text-[12px] text-ink-muted"><span>{g.title}</span><span>In review</span></div>
        })}
       </div>
       <div className="mt-4 flex flex-wrap items-center gap-2">
        {go?<Link href={`/app/learn/${go.id}`} className="alm-desk-btn">{completed?"Continue":"Begin section"} →</Link>:
          <span className="alm-desk-chip">Content in review</span>}
        {test&&accessible.has(test.id)&&<Link href={`/app/learn/${test.id}`} className="alm-desk-btn alm-desk-btn-secondary">Section test</Link>}
        {r.total>0&&<span className={`alm-desk-chip ml-auto ${readinessTone[r.level].chip}`}>{readinessLabel[r.level]}</span>}
       </div>
      </div>
     </details>;
   })}
  </div>
  {final&&<section className="mt-5 grid gap-3 sm:grid-cols-2">
    <div className="alm-desk-card p-5"><p className="alm-desk-eyebrow">Final review</p><h2 className="mt-2 text-[21px] font-bold">{final.title}</h2>
     <p className="mt-2 text-[13px] text-ink-body">{final.blurb}</p>
     {firstOpen(final.id)&&<Link href={`/app/learn/${firstOpen(final.id)!.id}`} className="alm-desk-btn mt-4">Open final review →</Link>}
    </div>
    <div className="rounded-[18px] bg-[#2A1B78] p-5 text-white"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-white/70">Timed exam rehearsal</p>
      <h2 className="mt-2 text-[21px] font-bold">{EXAMS.final.questions} questions · {EXAMS.final.minutes} min</h2>
      <p className="mt-2 text-[12px] text-white/75">Practice simulation, not an official exam.</p>
      <Link href={`/app/exam/final?course=${course.id}`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-[13px] font-bold text-[#2A1B78]">Start when ready →</Link>
    </div>
   </section>}
 </div>;
}

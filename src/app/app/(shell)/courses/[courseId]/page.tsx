"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {ArrowRightIcon,CheckIcon} from "@/components/icons";
import {Ring} from "@/components/player/outline";
import {courseById,groupsInModule} from "@/content/course";
import {EXAMS} from "@/lib/config";
import {minutesFor} from "@/lib/minutes";
import {moduleWeeks,planFor,weekToday} from "@/lib/plan";
import {readiness,readinessLabel,readinessTone} from "@/lib/progress";
import {useStudent} from "@/lib/store";
import {useCourse} from "@/lib/use-course";

export default function CourseOutline(){
 const {courseId}=useParams<{courseId:string}>();
 const {state,authorizedCourses}=useStudent();
 const {modules,lessons,questions,scored}=useCourse(courseId);
 const course=courseById(courseId);
 const plan=planFor(state,courseId);
 const weeks=plan?moduleWeeks(plan,courseId):null;
 const week=plan?weekToday(plan):null;
 const [openId,setOpenId]=useState<string|null|undefined>(undefined);
 if(!course||course.status!=="open"||!authorizedCourses.includes(courseId))return <p className="rounded-[16px] border border-hairline bg-white p-5 text-[14px]">
   This course is not available in your paid learning plan. <Link href="/app/courses" className="font-bold text-violet-700">See your courses →</Link>
 </p>;
 if(courseId==="advanced-pharmacology")return <div className="mx-auto flex max-w-[1128px] flex-col gap-4">
    <nav aria-label="Breadcrumb" className="text-[12px] text-ink-muted"><Link href="/app/courses" className="hover:text-violet-700">Courses</Link> / <b className="text-ink">{course.title}</b></nav>
    <section className="grid overflow-hidden rounded-[20px] border border-hairline bg-white md:grid-cols-[minmax(0,1fr)_420px]">
      <div className="h-[150px] md:order-2 md:h-auto md:min-h-[240px]" role="img" aria-label="Advanced Pharmacology course cover" style={{background:'#E6E0F8 url("/almanac-art/cover-pharmacology.png") 78% 55%/cover no-repeat'}}/>
      <div className="flex flex-col gap-2.5 p-5 sm:px-7 sm:py-6" style={{background:"radial-gradient(60% 120% at 0% 0%,#DFF5EA 0%,rgba(223,245,234,0) 70%)"}}>
        <span className="text-[11px] font-extrabold tracking-[.14em] text-violet-700 uppercase">NUR-635 · {course.category}</span>
        <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.04em] sm:text-[36px]">Midterm preparation · Topics 1–8</h1>
        <p className="max-w-[540px] text-[14px] leading-[1.6] text-ink-body">Review your lessons, strengthen the drug mechanisms and test your clinical reasoning. Your progress is saved as you practise.</p>
        <div className="mt-1.5"><Link href="/app/midterm/nur635" className="inline-flex h-[42px] items-center rounded-full bg-violet px-5 text-[13.5px] font-bold text-white hover:bg-[#4A2DE6]">Open your midterm course →</Link></div>
        <p className="mt-1.5 max-w-[600px] text-[11.5px] leading-normal text-ink-muted">Your course includes topic lessons, explained practice questions, flashcards and a timed midterm rehearsal once the reviewed materials are released.</p>
      </div>
    </section>
  </div>;
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
 const shown=openId===undefined?current?.id:openId;
 const resumeVideo=Boolean(resume?.blocks.some(b=>b.t==="video"));
 const stat=(m:{id:string})=>{const ps=groupsInModule(m.id).flatMap(g=>g.pages);const c=ps.filter(p=>done(p.id)).length;return ps.length>0&&c===ps.length?"done":c>0||m.id===current?.id?"progress":"none";};
 const counts={done:sections.filter(m=>stat(m)==="done").length,progress:sections.filter(m=>stat(m)==="progress").length,none:sections.filter(m=>stat(m)==="none").length};
 const startDone=start?groupsInModule(start.id).flatMap(g=>g.pages).every(p=>done(p.id)):false;
 return <div className="mx-auto flex max-w-[1128px] flex-col gap-4">
  <nav aria-label="Breadcrumb" className="text-[12px] text-ink-muted"><Link href="/app/courses" className="hover:text-violet-700">Courses</Link> / <b className="text-ink">{course.title}</b></nav>
  <section className="grid overflow-hidden rounded-[20px] border border-hairline bg-white md:grid-cols-[minmax(0,1fr)_420px]">
   <div className="h-[150px] md:order-2 md:h-auto md:min-h-[240px]" role="img" aria-label={`${course.title} course cover`} style={{background:'#E6E0F8 url("/almanac-art/cover-pathophysiology.png") 78% 55%/cover no-repeat'}}/>
   <div className="flex min-w-0 flex-col gap-2.5 p-5 sm:px-7 sm:py-6" style={{background:"radial-gradient(60% 120% at 0% 0%,#DFF5EA 0%,rgba(223,245,234,0) 70%)"}}>
    <span className="text-[11px] font-extrabold tracking-[.14em] text-violet-700 uppercase">{course.category}</span>
    <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.04em] sm:text-[36px]">{course.title}</h1>
    <p className="hidden max-w-[540px] text-[14px] leading-[1.6] text-ink-body sm:block">{course.blurb}</p>
    <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
     {resume&&<Link href={`/app/learn/${resume.id}`} className={`flex h-[42px] max-w-full min-w-0 items-center gap-2.5 rounded-full bg-violet pr-[18px] text-[13.5px] font-bold text-white hover:bg-[#4A2DE6] max-sm:w-full ${resumeVideo?"pl-1.5":"pl-[18px]"}`}>
      {resumeVideo&&<span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full bg-[#EA6512]" aria-hidden="true"><span className="ml-0.5 h-0 w-0 border-y-[5.5px] border-l-[9px] border-y-transparent border-l-white"/></span>}
      <span className="truncate">{doneCount?"Continue":"Start"} · {resume.title}</span>{!resumeVideo&&<ArrowRightIcon size={14}/>}
     </Link>}
     <Link href={`/app/setup?course=${course.id}`} className="hidden h-[42px] items-center rounded-full border border-[#D9D2F3] px-4 text-[13.5px] font-bold whitespace-nowrap text-violet-deep hover:bg-mist sm:flex">
      {plan?`Week ${week} of ${plan.courseWeeks} · edit plan`:"Set up your plan"}
     </Link>
     <div className="flex items-center gap-2.5 max-sm:order-first sm:ml-2.5">
      <Ring done={doneCount} total={allPages.length} size={40}/>
      <div className="flex flex-col max-sm:flex-row max-sm:items-baseline max-sm:gap-1"><span className="font-display text-[15px] leading-none font-bold sm:text-[18px]">{doneCount} / {allPages.length}</span><span className="text-[11.5px] text-ink-muted max-sm:text-[13px]">pages done{plan?<span className="sm:hidden"> · <Link href={`/app/setup?course=${course.id}`} className="text-violet-700">Week {week} of {plan.courseWeeks}</Link></span>:null}</span></div>
     </div>
    </div>
    {!plan&&<Link href={`/app/setup?course=${course.id}`} className="text-[13px] font-bold text-violet-700 sm:hidden">Set up your plan →</Link>}
    <p className="mt-1.5 hidden max-w-[600px] text-[11.5px] leading-normal text-ink-muted sm:block">{course.fit} Almanac is independent and not affiliated with any school or publisher.</p>
   </div>
  </section>
  {start&&(()=>{const go=firstOpen(start.id);const inner=<>
    <span className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] text-[14px] font-extrabold ${startDone?"bg-mint text-correct":"bg-lilac text-violet-700"}`}>{startDone?"✓":"★"}</span>
    <div className="flex min-w-0 flex-1 flex-col gap-px"><span className={`text-[10.5px] font-extrabold tracking-[.12em] ${startDone?"text-correct":"text-violet-700"}`}>{startDone?"START HERE · DONE":"START HERE"}</span>
     <span className="text-[14px] font-bold">{start.title}</span><span className="text-[12px] text-ink-muted">{start.blurb}</span></div>
    {go&&!startDone&&<span className="text-[13px] font-bold text-violet-700">Open →</span>}</>;
   return go?<Link href={`/app/learn/${go.id}`} className="flex items-center gap-3.5 rounded-[16px] border border-hairline bg-white px-4 py-3 hover:bg-[#FBFAFE]">{inner}</Link>:
    <div className="flex items-center gap-3.5 rounded-[16px] border border-hairline bg-white px-4 py-3">{inner}</div>;})()}
  <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
    <h2 className="font-display text-[22px] font-bold tracking-[-.03em]">Seven competencies</h2>
    <span className="text-[12px] text-ink-muted">{[counts.done&&`${counts.done} done`,counts.progress&&`${counts.progress} in progress`,counts.none&&`${counts.none} not started`].filter(Boolean).join(" · ")}</span>
  </div>
  <div className="overflow-hidden rounded-[16px] border border-hairline bg-white">
   {sections.map(m=>{
     const groups=groupsInModule(m.id);
     const pages=groups.flatMap(g=>g.pages);
     const st=stat(m);
     const go=firstOpen(m.id);
     const isCurrent=m.id===current?.id;
     const isOpen=shown===m.id;
     const r=readiness(questions.filter(q=>q.moduleId===m.id),scored);
     const topics=pages.filter(p=>p.kind==="topic");
     const rows=topics.length?topics.map(p=>({id:p.id,title:p.title,pages:[p]})):groups.filter(g=>/^Lesson \d+:/.test(g.title));
     const quiz=pages.some(p=>p.kind==="quiz");
     const test=pages.find(p=>p.kind==="test");
     const count=rows.length?`${rows.length} topic${rows.length===1?"":"s"}${quiz?" + quiz":""}`:"Topics";
     const status=st==="done"?"Done":st==="progress"?"In progress":"Not started";
     const chip=st==="done"?"bg-mint text-correct":st==="progress"?"bg-[#FFE9DC] text-[#A8430A]":"bg-mist text-ink-muted";
     const cta=st==="done"?"Review":isCurrent||st==="progress"?"Continue":"Begin";
     const primary=isCurrent;
     const actions=<>
       {test&&accessible.has(test.id)&&<Link href={`/app/learn/${test.id}`} className="flex min-h-8 items-center px-1.5 text-[12.5px] font-bold whitespace-nowrap text-violet-700 hover:underline">Section test</Link>}
       {go?<Link href={`/app/learn/${go.id}`} className={`flex h-8 items-center rounded-full px-3.5 text-[12.5px] font-bold whitespace-nowrap ${primary?"bg-violet text-white hover:bg-[#4A2DE6]":"border border-[#D9D2F3] text-violet-deep hover:bg-mist"}`}>{cta} →</Link>:
        <span className="rounded-full bg-[#FFE9DC] px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-[#A8430A]">In review</span>}
     </>;
     return <div key={m.id} className="border-b border-[#EEEBF7] last:border-b-0">
      <div className="grid items-center gap-3 px-3.5 py-3 hover:bg-[#FBFAFE] sm:px-[18px] sm:py-3.5 md:grid-cols-[40px_minmax(0,1fr)_110px_120px_200px] md:gap-4">
       <button type="button" onClick={()=>setOpenId(isOpen?null:m.id)} aria-expanded={isOpen} className="grid grid-cols-[36px_minmax(0,1fr)_16px] items-center gap-3 text-left md:col-span-4 md:grid-cols-subgrid md:gap-4">
        <span className={`grid h-9 w-9 place-items-center rounded-[10px] font-display text-[16px] font-bold ${st==="done"?"bg-mint text-correct":isCurrent?"bg-violet-deep text-white":"border-[1.5px] border-[#D9D2F3] text-ink-body"}`}>{st==="done"?<CheckIcon size={16}/>:m.number}</span>
        <span className="flex min-w-0 flex-col gap-0.5">
         <span className="hidden text-[10px] font-extrabold tracking-[.1em] text-ink-muted uppercase md:block">Section {m.number}{weeks?` · Week ${weeks[m.id]}${isCurrent&&week===weeks[m.id]?" (now)":""}`:""}</span>
         <span className="text-[14.5px] leading-snug font-bold sm:text-[15px]">{m.title}</span>
         <span className="hidden text-[12px] leading-[1.45] text-ink-muted md:block">{m.blurb}</span>
         <span className="text-[12px] text-ink-muted md:hidden">{count} · {status}</span>
        </span>
        <span className="text-center text-[16px] text-ink-muted md:hidden" aria-hidden="true">{isOpen?"–":"+"}</span>
        <span className="hidden text-[12px] text-ink-body md:block">{count}</span>
        <span className={`hidden justify-self-start rounded-full px-2.5 py-1 text-[11px] font-bold md:block ${chip}`}>{status}</span>
       </button>
       <div className="hidden items-center justify-end gap-1.5 md:flex">{actions}</div>
      </div>
      {isOpen&&<div className="flex flex-col gap-3 px-3.5 pb-4 md:pr-[18px] md:pl-[74px]">
       {rows.length>0&&<div className="grid gap-1.5 md:grid-cols-3">
        {rows.map(g=>{
          const available=g.pages.find(p=>accessible.has(p.id));
          const finished=g.pages.every(p=>done(p.id));
          const now=!finished&&g.pages.some(p=>p.id===resume?.id);
          const min=Math.max(1,Math.round(g.pages.reduce((a,p)=>a+minutesFor(p),0)));
          const cls=`flex min-h-[38px] items-center gap-2 rounded-[10px] px-2.5 py-1 text-[12.5px] ${now?"bg-lilac":"bg-mist"}`;
          const mark=<span className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full text-[9px] font-extrabold text-white ${finished?"bg-correct":now?"bg-[#F2711C]":"border-[1.5px] border-[#D9D2F3] bg-white"}`}>{finished?"✓":""}</span>;
          return available?<Link key={g.id} href={`/app/learn/${available.id}`} className={`${cls} hover:bg-lilac`}>
            {mark}<span className={`min-w-0 flex-1 ${now?"font-extrabold text-violet-deep":"font-semibold"}`}>{g.title}</span><span className="text-[11px] text-ink-muted">{min} min</span>
           </Link>:<div key={g.id} className={`${cls} text-ink-muted`}>{mark}<span className="min-w-0 flex-1 font-semibold">{g.title}</span><span className="text-[11px]">In review</span></div>;
        })}
       </div>}
       {!rows.length&&<p className="text-[12.5px] text-ink-body">{m.blurb}</p>}
       <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 md:hidden">{actions}</div>
        {r.total>0&&r.answered>0&&<span className={`rounded-full px-2.5 py-1 text-[11px] font-bold md:ml-auto ${readinessTone[r.level].chip}`}>Readiness: {readinessLabel[r.level]}</span>}
       </div>
      </div>}
     </div>;
   })}
  </div>
  {final&&<section className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    {(()=>{const go=firstOpen(final.id);const inner=<><span className="text-[10px] font-extrabold tracking-[.12em]">FINISH</span><span className="font-display text-[18px] font-bold">{final.title}</span><span className="text-[12.5px] leading-normal">{final.blurb}</span></>;
     return go?<Link href={`/app/learn/${go.id}`} className="flex flex-col gap-[3px] rounded-[16px] bg-mint px-[18px] py-4 text-[#14532D] hover:brightness-[.98]">{inner}</Link>:
      <div className="flex flex-col gap-[3px] rounded-[16px] bg-mint px-[18px] py-4 text-[#14532D]">{inner}</div>;})()}
    <Link href={`/app/exam/final?course=${course.id}`} className="flex flex-col gap-[3px] rounded-[16px] bg-violet-deep px-[18px] py-4 text-white hover:bg-[#33228F]">
      <span className="text-[10px] font-extrabold tracking-[.12em] text-[#C9BEF7]">FULL-LENGTH SIMULATION</span>
      <span className="font-display text-[18px] font-bold">{EXAMS.final.questions} questions · {EXAMS.final.minutes} minutes</span>
      <span className="text-[11.5px] text-[#C9BEF7]">Practice simulation, not an official exam.</span>
      <span className="text-[13px] font-bold text-[#FFB27F]">Start when ready →</span>
    </Link>
   </section>}
 </div>;
}

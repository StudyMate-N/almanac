"use client";

import Link from "next/link";
import {PageHeader} from "@/components/page-header";
import {TodaySession} from "@/components/today-session";
import {openCourses,lessons as allLessons,modulesInCourse} from "@/content/course";
import type {Course} from "@/content/types";
import {EXAMS} from "@/lib/config";
import {daysUntil,formatDate,planFor,weekToday} from "@/lib/plan";
import {readiness,readinessLabel,readinessTone} from "@/lib/progress";
import {firstName,useStudent} from "@/lib/store";
import {useCourse} from "@/lib/use-course";

function TodayRail({course}:{course:Course}) {
 const {state,answers}=useStudent();
 const {modules,questions,scored,cases,lessonOpen}=useCourse(course.id);
 const plan=planFor(state,course.id);
 const toMid=daysUntil(plan?.midterm);
 const toFinal=daysUntil(plan?.final);
 const exam=toMid!==null&&toMid>=0?{kind:"midterm" as const,days:toMid,date:plan?.midterm}:toFinal!==null&&toFinal>=0?{kind:"final" as const,days:toFinal,date:plan?.final}:null;
 const stats=modules.filter(m=>m.kind==="section").slice(0,3).map(m=>({m,r:readiness(questions.filter(q=>q.moduleId===m.id),scored)}));
 const allMods=modulesInCourse(course.id).map(m=>m.id);
 const available=allLessons.filter(l=>allMods.includes(l.moduleId)&&lessonOpen(l.id));
 const first=available.find(l=>!state.lessons[l.id])??available[0];
 const checkDone=answers.some(a=>a.mode==="check"&&questions.some(q=>q.id===a.questionId));
 return <div className="space-y-3">
   <section className="alm-desk-card p-5">
     <p className="alm-desk-eyebrow">Your course</p>
     <div className="mt-3 flex items-start gap-3">
      <div className="alm-cover h-[65px] w-[72px] flex-none rounded-xl border border-hairline"/>
      <div><h2 className="text-[16px] font-bold">{course.title}</h2>
       <p className="mt-1 text-[12px] text-ink-muted">{plan?`Week ${weekToday(plan)} of ${plan.courseWeeks}`:"Set your learning plan"}</p>
      </div>
     </div>
     <Link href={`/app/courses/${course.id}`} className="mt-4 inline-flex min-h-11 items-center text-[13px] font-bold text-violet-700">View course and modules →</Link>
   </section>
   {exam&&<section className="alm-desk-card p-5">
     <p className="alm-desk-eyebrow">{exam.kind==="midterm"?"Midterm":"Final"} · {formatDate(exam.date)}</p>
     <p className="mt-2 font-display text-[27px] font-extrabold">{exam.days===0?"Exam day":`${exam.days} days left`}</p>
     <Link href={`/app/exam/${exam.kind}?course=${course.id}`} className="mt-2 inline-flex min-h-11 items-center text-[12px] font-bold text-violet-700">
      Start a timed practice simulation →</Link>
   </section>}
   <section className="alm-desk-card p-5">
    <div className="flex items-center justify-between gap-2"><h2 className="text-[16px] font-bold">This week&apos;s readiness</h2><span className="alm-desk-chip">Progress</span></div>
    <ul className="mt-4 space-y-3">
      {stats.map(({m,r})=><li key={m.id}>
       <div className="flex justify-between gap-2 text-[12px]"><span className="font-semibold">{m.title}</span><span className="text-ink-muted">{r.total?readinessLabel[r.level]:"In review"}</span></div>
       <div className="alm-desk-progress mt-2"><span className={readinessTone[r.level].bar} style={{width:`${r.percent??0}%`}}/></div>
      </li>)}
    </ul>
    <Link href="/app/progress" className="mt-4 inline-flex min-h-10 items-center text-[12px] font-bold text-violet-700">See all progress →</Link>
   </section>
   <section className="alm-desk-card p-5">
     <h2 className="text-[16px] font-bold">Your next options</h2>
     {!plan&&<Link href={`/app/setup?course=${course.id}`} className="mt-2 block text-[13px] font-semibold text-violet-700">Set up a study plan →</Link>}
     {!checkDone&&questions.length>=5&&<Link href={`/app/exam/check?course=${course.id}`} className="mt-2 block text-[13px] font-semibold text-violet-700">Take a starting check →</Link>}
     {first&&<Link href={`/app/learn/${first.id}`} className="mt-2 block text-[13px] font-semibold text-violet-700">Continue the next lesson →</Link>}
     {cases[0]&&<Link href={`/app/case/${cases[0].id}`} className="mt-2 block text-[13px] font-semibold text-violet-700">Open a case study →</Link>}
     <Link href="/app/coach" className="mt-2 block text-[13px] font-semibold text-violet-700">Ask a coach →</Link>
   </section>
 </div>;
}
export default function Today() {
 const {profile,authorizedCourses}=useStudent();
 const name=firstName(profile);
 const availableCourses=openCourses.filter(course=>authorizedCourses.includes(course.id));
 return <div className="mx-auto max-w-[1110px]">
  <PageHeader eyebrow={new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} title={name?`Hi, ${name}`:"Today"}/>
  <p className="-mt-2 mb-6 text-[13px] text-ink-muted">A clearer view of what to learn and what comes next.</p>
  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_294px]">
    <div className="space-y-5">
      {availableCourses.map(course=><section key={course.id}>
       {availableCourses.length>1&&<h2 className="mb-3 text-[19px] font-bold">{course.title}</h2>}
       <TodaySession course={course}/>
      </section>)}
      <section className="alm-desk-card p-5">
        <p className="alm-desk-eyebrow">Explore your learning</p>
        <h2 className="mt-2 text-[20px] font-bold">Everything is within reach.</h2>
        <p className="mt-2 text-[13px] text-ink-body">Move between lessons, practice questions, cards and progress without losing where you left off.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[["Courses","/app/courses"],["Practice","/app/practice"],["Flashcards","/app/review"],["Your orders","/app/orders"]].map(([title,href])=>
           <Link key={href} href={href} className="rounded-xl border border-hairline bg-[#F9F8FD] px-4 py-3 text-[13px] font-bold text-violet-700">{title} →</Link>)}
        </div>
      </section>
    </div>
    <aside className="space-y-4">{availableCourses.map(course=><TodayRail key={course.id} course={course}/>)}</aside>
  </div>
 </div>;
}

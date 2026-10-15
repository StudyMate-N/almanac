"use client";
import Link from "next/link";
import {useCallback,useEffect,useState} from "react";
import {rpc} from "@/lib/api";
import {useStudent} from "@/lib/store";

type Question={stem:string;options:string[];correctIndex:number;explanation:string};
type Flashcard={front:string;back:string};
type Unit={title:string;lesson:string;objectives:string[];practice:Question[];flashcards:Flashcard[]};
type Simulation={title:string;minutes:number;questions:Question[]};
type CoursePack={version:number;modules:Unit[];simulations:Simulation[]};
type Progress={answers:Record<string,{selected:number;correct:boolean;answeredAt:string}>;
 cards:Record<string,{known:boolean;reviewedAt:string}>};
type Feedback={correct:boolean;correctIndex:number;explanation:string};
const EMPTY:Progress={answers:{},cards:{}};
const COURSE="advanced-pharmacology";
const STORAGE_KEY="nur635-midterm-progress-v1";

export default function Nur635Midterm(){
 const {status,token,state,update,authorizedCourses}=useStudent();
 const entitled=authorizedCourses.includes(COURSE);
 const [pack,setPack]=useState<CoursePack|null>(null);
 const [progress,setProgress]=useState<Progress>(EMPTY);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [moduleIdx,setModuleIdx]=useState(0);
 const [mode,setMode]=useState<"lesson"|"practice"|"cards"|"exam">("lesson");
 const [practiceIdx,setPracticeIdx]=useState(0);
 const [cardIdx,setCardIdx]=useState(0);
 const [revealed,setRevealed]=useState(false);
 const [simIdx,setSimIdx]=useState(0);
 const [examIdx,setExamIdx]=useState(0);
 const [examStarted,setExamStarted]=useState(false);
 const [examStartedAt,setExamStartedAt]=useState(0);
 const [now,setNow]=useState(0);
 const [feedback,setFeedback]=useState<Record<string,Feedback>>({});

 const load=useCallback(async()=>{
  if(!token||!entitled){setLoading(false);return;}
  setLoading(true);setError("");
  try{
   const result=await rpc<{published:boolean;content:CoursePack|null}>("learning_curated_student_pack_get",{p_token:token,p_course:COURSE});
   setPack(result.published?result.content:null);
  }catch{setError("This course is not available for your current enrollment. Contact Almanac support.");}
  finally{setLoading(false);}
 },[token,entitled]);
 useEffect(()=>{
   const saved=state.notes[STORAGE_KEY];
   if(saved){try{const obj=JSON.parse(saved) as Progress;
     if(obj.answers&&obj.cards)setProgress(obj);}catch{/* New account: no progress yet. */}}
 },[state.notes]);
 function persist(next:Progress){
  setProgress(next);
  update("notes",{...state.notes,[STORAGE_KEY]:JSON.stringify(next)});
 }
 useEffect(()=>{if(status==="ready")void load();},[status,load]);
 useEffect(()=>{
  if(!examStarted)return;
  const t=setInterval(()=>setNow(Date.now()),1000);
  return()=>clearInterval(t);
 },[examStarted]);

 const current=pack?.modules[moduleIdx];
 const pract=current?.practice||[];
 const cards=current?.flashcards||[];
 const simulation=pack?.simulations?.[simIdx];
 const question=mode==="exam"?simulation?.questions?.[examIdx]:pract[practiceIdx];
 const activeKey=mode==="exam"?`s${simIdx}:${examIdx}`:`p${moduleIdx}:${practiceIdx}`;
 const answer=progress.answers[activeKey];
 const result=feedback[activeKey];
 const minutesLeft=simulation&&examStarted?Math.max(0,(simulation.minutes||60)*60-Math.floor((now-examStartedAt)/1000)):null;
 const totalPractice=pack?.modules.reduce((a,m)=>a+m.practice.length,0)||0;
 const attemptedPractice=Object.keys(progress.answers).filter(k=>k.startsWith("p")).length;
 const readiness=totalPractice?Math.min(100,Math.round(attemptedPractice/totalPractice*100)):0;
 const examClosed=minutesLeft===0;

 function choose(selected:number){
  if(!question||(mode==="exam"&&(!examStarted||examClosed)))return;
  const response:Feedback={correct:selected===question.correctIndex,correctIndex:question.correctIndex,explanation:question.explanation};
  setFeedback(v=>({...v,[activeKey]:response}));
  persist({...progress,answers:{...progress.answers,[activeKey]:{
    selected,correct:response.correct,answeredAt:new Date().toISOString()}}});
 }
 function rateCard(known:boolean){
  persist({...progress,cards:{...progress.cards,[`m${moduleIdx}:${cardIdx}`]:{known,reviewedAt:new Date().toISOString()}}});
  setRevealed(false);
  setCardIdx(n=>Math.min(cards.length-1,n+1));
 }
 const activeCard=cards[cardIdx];
 if(!entitled)return <section className="alm-desk-card mx-auto max-w-xl p-6"><h1 className="text-2xl font-bold">Enrollment required</h1><p className="mt-3 text-sm text-ink-body">This midterm preparation course is available to approved Advanced Pharmacology learners only.</p><Link href="/app/courses" className="alm-desk-btn mt-5">Your courses →</Link></section>;
 return <main className="mx-auto max-w-[1160px] px-4 pb-24 pt-8 sm:px-6">
  <Link href="/app/courses" className="text-sm font-semibold text-violet-700">← Your courses</Link>
  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-widest text-violet-700">NUR-635 ADVANCED PHARMACOLOGY · TOPICS 1–8</p>
    <h1 className="mt-2 font-display text-3xl font-semibold">Your midterm study sprint</h1></div>
   <button type="button" onClick={()=>void load()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold">Refresh content</button>
  </div>
  {error&&<p role="alert" className="mt-5 rounded-xl bg-rose p-4 text-sm">{error}</p>}
  {loading?<p className="mt-7 rounded-xl bg-white p-5">Opening your course…</p>:
   !pack?<section className="mt-7 rounded-tile bg-white p-7">
    <h2 className="font-display text-2xl font-semibold">Your interactive lessons are being prepared.</h2>
    <p className="mt-3 text-sm text-ink-body">The approved midterm pack is awaiting publication. Your paid course access is active, and we will release this study material as soon as it is ready.</p>
    <Link href="/app/courses" className="mt-5 inline-flex rounded-full bg-violet px-5 py-3 font-semibold text-white">Back to your courses →</Link>
   </section>:
   <div className="mt-7 grid gap-5 lg:grid-cols-[245px_1fr]">
    <aside className="rounded-tile bg-white p-4">
     <h2 className="font-semibold">Midterm topics</h2>
     <p className="mt-1 text-xs text-ink-muted">{attemptedPractice}/{totalPractice} practice questions answered · {readiness}%</p>
     <div className="mt-3 h-2 rounded-full bg-mist"><div className="h-full rounded-full bg-violet" style={{width:readiness+"%"}}/></div>
     <div className="mt-5 space-y-2">{pack.modules.map((m,i)=><button type="button" key={i}
      onClick={()=>{setModuleIdx(i);setMode("lesson");setPracticeIdx(0);setCardIdx(0);setRevealed(false);}}
      className={`w-full rounded-xl px-3 py-3 text-left text-sm ${moduleIdx===i?"bg-lilac font-semibold text-violet-700":"bg-mist text-ink-body"}`}>
      <span className="block text-xs">Module {i+1}</span><span className="mt-1 block">{m.title}</span>
     </button>)}</div>
     <Link href="/app/orders" className="mt-6 block text-sm font-semibold text-violet-700 underline">Videos, slides & downloads →</Link>
    </aside>
    <section className="min-w-0 rounded-tile bg-white p-5 sm:p-7">
     <p className="text-xs font-semibold uppercase text-violet-700">Module {moduleIdx+1}</p>
     <h2 className="mt-2 font-display text-2xl font-semibold">{current?.title}</h2>
     <nav aria-label="Learning activities" className="mt-6 flex flex-wrap gap-2">
      {([
       ["lesson","Lesson"],["practice","Practice"],["cards","Flashcards"],
       ["exam","Exam simulations"]
      ] as const).map(([key,label])=><button key={key} type="button"
       disabled={key==="exam"&&!pack.simulations?.length}
       onClick={()=>{setMode(key);setError("");}}
       className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 ${mode===key?"bg-violet text-white":"bg-mist text-ink-body"}`}>{label}</button>)}
     </nav>
     {mode==="lesson"&&<div className="mt-6">
      <h3 className="font-display text-xl font-semibold">Understand this module</h3>
      {(current?.objectives||[]).length>0&&<div className="mt-4 rounded-xl bg-mist p-4"><p className="font-semibold">Learning objectives</p>
       <ul className="mt-2 list-inside list-disc space-y-1 text-sm">{current?.objectives?.map((v,i)=><li key={i}>{v}</li>)}</ul></div>}
      <article className="mt-5 whitespace-pre-wrap text-sm leading-7 text-ink-body">{current?.lesson}</article>
      <button type="button" onClick={()=>{setMode("practice");setPracticeIdx(0);}}
       className="mt-6 rounded-full bg-violet px-5 py-3 font-semibold text-white">Check your understanding →</button>
     </div>}
     {mode==="practice"&&<div className="mt-6">
      <h3 className="font-display text-xl font-semibold">Practice with explanations</h3>
      <p className="mt-1 text-sm text-ink-muted">Question {practiceIdx+1} of {pract.length}. Your latest answer is saved to your account.</p>
      {question?<div className="mt-4 rounded-xl bg-mist p-5">
       <p className="font-semibold">{question.stem}</p>
       <div className="mt-4 grid gap-2">{question.options.map((option,i)=><button type="button" key={i}
        disabled={false} onClick={()=>choose(i)}
        className={`min-h-12 rounded-xl border p-3 text-left text-sm disabled:opacity-60 ${answer?.selected===i?"border-violet bg-lilac":"border-hairline bg-white"}`}>
        {String.fromCharCode(65+i)}. {option}</button>)}</div>
       {result?<p role="status" className="mt-4 rounded-xl bg-white p-4 text-sm">
        <strong>{result.correct?"Correct":"Review this answer"}</strong> · {result.explanation}</p>:
        answer&&<p className="mt-4 text-sm text-ink-muted">Your previous response was {answer.correct?"correct":"not correct"}. Select an answer to see the explanation again.</p>}
      </div>:<p className="mt-4 text-sm">No practice questions available in this module.</p>}
      <div className="mt-4 flex flex-wrap gap-2">
       <button type="button" disabled={practiceIdx===0} onClick={()=>setPracticeIdx(i=>i-1)}
        className="rounded-full border border-hairline px-4 py-2 text-sm disabled:opacity-40">← Previous</button>
       <button type="button" disabled={practiceIdx>=pract.length-1} onClick={()=>setPracticeIdx(i=>i+1)}
        className="rounded-full bg-violet px-4 py-2 text-sm text-white disabled:opacity-40">Next question →</button>
      </div>
     </div>}
     {mode==="cards"&&<div className="mt-6">
      <h3 className="font-display text-xl font-semibold">Review flashcards</h3>
      <p className="mt-1 text-sm text-ink-muted">Card {cardIdx+1} of {cards.length}. Rate each card to track your review.</p>
      {activeCard?<div className="mt-4">
       <button type="button" onClick={()=>setRevealed(v=>!v)}
        className="grid min-h-44 w-full place-items-center rounded-2xl border border-hairline bg-lilac p-6 text-center">
        <span><span className="block text-xs font-bold uppercase tracking-wider text-violet-700">{revealed?"Answer":"Recall"}</span>
         <span className="mt-3 block font-display text-xl font-semibold">{revealed?activeCard.back:activeCard.front}</span>
         <span className="mt-4 block text-xs text-ink-muted">Tap to flip</span></span></button>
       <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={false} onClick={()=>rateCard(false)}
         className="rounded-full border border-hairline px-5 py-3 text-sm font-semibold disabled:opacity-40">Review again</button>
        <button type="button" disabled={false} onClick={()=>rateCard(true)}
         className="rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">I know this ✓</button>
        <button type="button" disabled={cardIdx>=cards.length-1} onClick={()=>{setCardIdx(i=>i+1);setRevealed(false);}}
         className="rounded-full bg-mist px-5 py-3 text-sm disabled:opacity-40">Next →</button>
       </div>
      </div>:<p className="mt-4 text-sm">No flashcards available.</p>}
     </div>}
     {mode==="exam"&&<div className="mt-6">
      <h3 className="font-display text-xl font-semibold">Exam simulations</h3>
      <div className="mt-3 flex flex-wrap gap-2">{pack.simulations.map((s,i)=><button key={i}
       type="button" onClick={()=>{setSimIdx(i);setExamIdx(0);setExamStarted(false);}}
       className={`rounded-full px-4 py-2 text-sm ${simIdx===i?"bg-violet text-white":"bg-mist"}`}>{s.title}</button>)}</div>
      {!examStarted?<div className="mt-5 rounded-xl bg-mist p-5">
       <p className="font-semibold">{simulation?.title}</p>
       <p className="mt-2 text-sm text-ink-body">{simulation?.questions.length} questions · {simulation?.minutes||60} minutes. This is original study practice, not the university proctored exam. Some questions also appear in the topic practice sets.</p>
       <button type="button" onClick={()=>{setExamStartedAt(Date.now());setNow(Date.now());setExamStarted(true);}}
        className="mt-4 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white">Start timed practice →</button>
      </div>:<div className="mt-5">
       <p className="font-semibold">{minutesLeft!==null?`${Math.floor(minutesLeft/60)}:${String(minutesLeft%60).padStart(2,"0")}`:""} remaining · Question {examIdx+1} of {simulation?.questions.length}</p>
       {examClosed?<p className="mt-4 rounded-xl bg-mist p-4 text-sm">Time is up. Review your saved responses or restart the practice simulation.</p>:
        <div className="mt-4 rounded-xl bg-mist p-5">
         <p className="font-semibold">{question?.stem}</p>
         <div className="mt-4 grid gap-2">{question?.options?.map((option,i)=><button type="button" key={i}
          disabled={false} onClick={()=>choose(i)}
          className={`rounded-xl border border-hairline p-3 text-left text-sm ${answer?.selected===i?"bg-lilac":"bg-white"}`}>
          {String.fromCharCode(65+i)}. {option}</button>)}</div>
         {result&&<p role="status" className="mt-4 rounded-xl bg-white p-3 text-sm">
          {result.correct?"Correct":"Review"} · {result.explanation}</p>}
        </div>}
       <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={examIdx===0} onClick={()=>setExamIdx(i=>i-1)}
         className="rounded-full border border-hairline px-4 py-2 text-sm disabled:opacity-40">← Previous</button>
        <button type="button" disabled={examIdx>=(simulation?.questions.length||0)-1} onClick={()=>setExamIdx(i=>i+1)}
         className="rounded-full bg-violet px-4 py-2 text-sm text-white disabled:opacity-40">Next question →</button>
        <button type="button" onClick={()=>setExamStarted(false)}
         className="rounded-full bg-mist px-4 py-2 text-sm">End session</button>
       </div>
      </div>}
     </div>}
    </section>
   </div>}
 </main>;
}

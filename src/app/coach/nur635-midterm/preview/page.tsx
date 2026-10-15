"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {rpc,friendlyError} from "@/lib/api";
import {COACH_KEY} from "@/lib/store";
import {nur635VideoUrl} from "@/lib/nur635-video";

type Question={stem:string;options:string[];correctIndex:number;explanation:string};
type Flashcard={front:string;back:string};
type Module={title:string;lesson:string;objectives:string[];practice:Question[];flashcards:Flashcard[]};
type Simulation={title:string;minutes:number;questions:Question[]};
type Pack={version:number;modules:Module[];simulations:Simulation[]};
type Mode="lesson"|"practice"|"flashcards"|"rehearsal"|"video";

export default function OwnerMidtermPreview(){
 const [pack,setPack]=useState<Pack|null>(null);
 const [ownerToken,setOwnerToken]=useState("");
 const [videoUrl,setVideoUrl]=useState<string|null>(null);
 const [videoBusy,setVideoBusy]=useState(false);
 const [videoError,setVideoError]=useState("");
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [topic,setTopic]=useState(0);
 const [mode,setMode]=useState<Mode>("lesson");
 const [questionIdx,setQuestionIdx]=useState(0);
 const [cardIdx,setCardIdx]=useState(0);
 const [flip,setFlip]=useState(false);
 const [answer,setAnswer]=useState<number|null>(null);
 const [simIdx,setSimIdx]=useState(0);
 const [simQuestion,setSimQuestion]=useState(0);
 const [simAnswer,setSimAnswer]=useState<number|null>(null);
 useEffect(()=>{
  let active=true;
  try{
   const admin=JSON.parse(localStorage.getItem(COACH_KEY)||"null") as {token?:string;role?:string}|null;
   if(!admin?.token||admin.role!=="owner"){
    setError("Please sign in as Almanac Owner before opening this private preview.");
    setLoading(false);return;
   }
   setOwnerToken(admin.token);
    void rpc<{content:Pack|null;published:boolean}>("learning_curated_staff_pack_get",{p_token:admin.token,p_course:"advanced-pharmacology"})
    .then(res=>{if(!active)return;setPack(res.content||null);if(!res.content)setError("The reviewed study pack has not been imported yet.");})
    .catch(e=>{if(active)setError(friendlyError(e));})
    .finally(()=>{if(active)setLoading(false);});
  }catch{setError("Owner session unavailable. Sign in again.");setLoading(false);}
  return()=>{active=false};
 },[]);
 useEffect(()=>{
  if(mode!=="video"||!ownerToken)return;
  let active=true;setVideoUrl(null);setVideoError("");
  if(topic===3){setVideoBusy(false);return;}
  setVideoBusy(true);
  void nur635VideoUrl(ownerToken,topic+1)
   .then(url=>{if(active)setVideoUrl(url);})
   .catch(e=>{if(active)setVideoError(e instanceof Error?e.message:"Unable to play video.");})
   .finally(()=>{if(active)setVideoBusy(false);});
  return()=>{active=false};
 },[mode,ownerToken,topic]);
 const current=pack?.modules[topic];
 const practice=current?.practice[questionIdx];
 const flashcard=current?.flashcards[cardIdx];
 const simulation=pack?.simulations[simIdx];
 const examQuestion=simulation?.questions[simQuestion];
 function selectTopic(i:number){setTopic(i);setMode("lesson");setQuestionIdx(0);setCardIdx(0);setAnswer(null);setFlip(false);}
 function switchMode(m:Mode){setMode(m);setQuestionIdx(0);setCardIdx(0);setAnswer(null);setSimAnswer(null);setFlip(false);}
 const metrics=pack?{topics:pack.modules.length,questions:pack.modules.reduce((n,x)=>n+x.practice.length,0),flashcards:pack.modules.reduce((n,x)=>n+x.flashcards.length,0),simulations:pack.simulations.length}:null;
 return <main className="alm-staff mx-auto max-w-[1180px] px-4 pb-24 pt-7 sm:px-6">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <Link href="/coach/nur635-midterm" className="text-sm font-bold text-violet-700">← NUR-635 course management</Link>
   <span className="rounded-full bg-[#FFF1E8] px-3 py-2 text-xs font-bold text-[#A8430A]">Owner-only preview · Not a learner release</span>
  </div>
  <header className="mt-5 overflow-hidden rounded-[20px] bg-[#2A1B78] px-6 py-7 text-white sm:px-8">
   <p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/70">Almanac · Course review</p>
   <h1 className="mt-3 font-display text-[32px] font-bold leading-tight sm:text-[38px]">Advanced Pharmacology</h1>
   <p className="mt-2 text-sm text-white/80">NUR-635 Midterm · Topics 1–8 · Private preview of the exact imported study pack</p>
   {metrics&&<div className="mt-5 flex flex-wrap gap-2 text-[12px] font-bold text-white/90">
    <span className="rounded-full border border-white/30 px-3 py-1.5">{metrics.topics} topics</span>
    <span className="rounded-full border border-white/30 px-3 py-1.5">{metrics.questions} questions</span>
    <span className="rounded-full border border-white/30 px-3 py-1.5">{metrics.flashcards} flashcards</span>
    <span className="rounded-full border border-white/30 px-3 py-1.5">{metrics.simulations} timed rehearsal</span>
   </div>}
  </header>
  {loading?<p className="alm-desk-card mt-5 p-6 text-sm">Opening the private review pack…</p>:null}
  {error&&<section className="alm-desk-card mt-5 p-6"><p role="alert" className="text-sm text-[#8A1C37]">{error}</p><Link href="/coach" className="mt-3 inline-block text-sm font-bold text-violet-700">Staff sign-in →</Link></section>}
  {pack&&!loading&&<div className="mt-5 grid gap-5 lg:grid-cols-[285px_minmax(0,1fr)]">
   <aside className="alm-desk-card self-start p-4 lg:sticky lg:top-5">
    <h2 className="px-2 text-[16px] font-bold">Course outline</h2>
    <p className="mt-1 px-2 text-[12px] text-ink-muted">Choose a topic to inspect its lessons and learning activities.</p>
    <nav className="mt-4 space-y-2" aria-label="Midterm topics">
     {pack.modules.map((m,i)=><button key={i} type="button" aria-current={topic===i?"step":undefined} onClick={()=>selectTopic(i)}
      className={`w-full rounded-xl px-3 py-3 text-left text-[13px] leading-5 ${topic===i?"bg-[#ECE7FF] font-bold text-[#2A1B78]":"bg-[#F7F6FB] text-ink-body hover:bg-[#F0EBFB]"}`}>
      <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider">Topic {i+1}</span>{m.title.replace(/^Topic [0-9]+:\s*/,"")}
     </button>)}
    </nav>
   </aside>
   <section className="alm-desk-card min-w-0 p-5 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-2">
     <p className="alm-desk-eyebrow">Topic {topic+1} of {pack.modules.length}</p>
     <span className="text-xs text-ink-muted">Review mode · Answers are not graded here</span>
    </div>
    <h2 className="mt-3 font-display text-[27px] font-bold leading-tight">{current?.title}</h2>
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Preview activities">
     {([["lesson","Read lesson"],["practice","Practice"],["flashcards","Flashcards"],["rehearsal","Exam rehearsal"],["video","Watch video"]] as [Mode,string][]).map(([k,l])=>
      <button key={k} type="button" onClick={()=>switchMode(k)} aria-pressed={mode===k}
       className={`min-h-11 rounded-full px-4 text-[12px] font-bold ${mode===k?"bg-[#2A1B78] text-white":"border border-hairline bg-white text-violet-700"}`}>{l}</button>)}
    </nav>
    {mode==="lesson"&&<div className="mt-7">
     <h3 className="font-display text-[21px] font-bold">Understand this topic</h3>
     <div className="mt-4 rounded-[14px] bg-[#F6F4FB] p-5">
      <p className="text-[12px] font-bold uppercase tracking-wider text-violet-700">Learning objectives</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-6">{current?.objectives.map((v,i)=><li key={i}>{v}</li>)}</ul>
     </div>
     <article className="mt-6 whitespace-pre-wrap text-[14px] leading-7 text-ink-body">{current?.lesson}</article>
     <button type="button" onClick={()=>switchMode("practice")} className="alm-desk-btn mt-7">Check understanding →</button>
    </div>}
    {mode==="practice"&&<div className="mt-7">
     <h3 className="font-display text-[21px] font-bold">Explained practice</h3>
     <p className="mt-1 text-xs text-ink-muted">Question {questionIdx+1} of {current?.practice.length}. Choose an answer to reveal the rationale.</p>
     {practice&&<div className="mt-5 rounded-[14px] bg-[#F6F4FB] p-5">
      <p className="text-[15px] font-bold leading-6">{practice.stem}</p>
      <div className="mt-4 grid gap-2">{practice.options.map((o,i)=><button key={i} type="button" onClick={()=>setAnswer(i)}
       className={`min-h-12 rounded-xl border px-4 py-3 text-left text-[14px] ${answer===i?"border-[#5B3DF5] bg-[#ECE7FF]":"border-hairline bg-white"}`}>{String.fromCharCode(65+i)}. {o}</button>)}</div>
      {answer!==null&&<div className="mt-4 rounded-xl bg-white p-4 text-[13px] leading-6" role="status">
       <strong>{answer===practice.correctIndex?"Correct":"Review this answer"}</strong>
       <p className="mt-1">Correct answer: {String.fromCharCode(65+practice.correctIndex)}. {practice.options[practice.correctIndex]}</p>
       <p className="mt-2 text-ink-body">{practice.explanation}</p>
      </div>}
     </div>}
     <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" disabled={questionIdx===0} onClick={()=>{setQuestionIdx(i=>i-1);setAnswer(null)}} className="min-h-11 rounded-full border border-hairline px-4 text-sm disabled:opacity-40">← Previous</button>
      <button type="button" disabled={!current||questionIdx>=current.practice.length-1} onClick={()=>{setQuestionIdx(i=>i+1);setAnswer(null)}} className="min-h-11 rounded-full bg-violet px-4 text-sm text-white disabled:opacity-40">Next question →</button>
     </div>
    </div>}
    {mode==="flashcards"&&<div className="mt-7">
     <h3 className="font-display text-[21px] font-bold">Recall cards</h3>
     <p className="mt-1 text-xs text-ink-muted">Card {cardIdx+1} of {current?.flashcards.length}</p>
     {flashcard&&<button type="button" onClick={()=>setFlip(v=>!v)} className="mt-5 grid min-h-[220px] w-full place-items-center rounded-[16px] border border-[#C9BEF7] bg-[#ECE7FF] p-7 text-center">
       <span><span className="block text-xs font-bold uppercase tracking-wider text-violet-700">{flip?"Answer":"Question"}</span><strong className="mt-5 block font-display text-[22px] leading-relaxed">{flip?flashcard.back:flashcard.front}</strong><span className="mt-5 block text-xs text-ink-muted">Select to flip</span></span>
      </button>}
     <div className="mt-4 flex gap-2">
      <button type="button" disabled={cardIdx===0} onClick={()=>{setCardIdx(i=>i-1);setFlip(false)}} className="min-h-11 rounded-full border border-hairline px-4 text-sm disabled:opacity-40">← Previous</button>
      <button type="button" disabled={!current||cardIdx>=current.flashcards.length-1} onClick={()=>{setCardIdx(i=>i+1);setFlip(false)}} className="min-h-11 rounded-full bg-violet px-4 text-sm text-white disabled:opacity-40">Next card →</button>
     </div>
    </div>}
    {mode==="rehearsal"&&<div className="mt-7">
     <h3 className="font-display text-[21px] font-bold">Timed practice rehearsal</h3>
     <p className="mt-2 text-[13px] leading-6 text-ink-body">{simulation?.title} · {simulation?.questions.length} questions · {simulation?.minutes} minutes</p>
     <p className="mt-1 text-xs text-ink-muted">This preview lets the Owner inspect questions and explanations. Student sessions use the timed learning player.</p>
     {examQuestion&&<div className="mt-5 rounded-xl bg-[#F6F4FB] p-5">
      <p className="mb-3 text-xs font-bold text-violet-700">Question {simQuestion+1} of {simulation?.questions.length}</p>
      <p className="font-bold">{examQuestion.stem}</p>
      <div className="mt-4 grid gap-2">{examQuestion.options.map((o,i)=><button type="button" key={i} onClick={()=>setSimAnswer(i)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-sm ${simAnswer===i?"border-violet bg-lilac":"border-hairline bg-white"}`}>{String.fromCharCode(65+i)}. {o}</button>)}</div>
      {simAnswer!==null&&<p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6"><strong>{simAnswer===examQuestion.correctIndex?"Correct":"Needs revision"}</strong> · {examQuestion.explanation}</p>}
     </div>}
     <div className="mt-4 flex gap-2">
      <button type="button" disabled={simQuestion===0} onClick={()=>{setSimQuestion(i=>i-1);setSimAnswer(null)}} className="min-h-11 rounded-full border border-hairline px-4 text-sm disabled:opacity-40">← Previous</button>
      <button type="button" disabled={!simulation||simQuestion>=simulation.questions.length-1} onClick={()=>{setSimQuestion(i=>i+1);setSimAnswer(null)}} className="min-h-11 rounded-full bg-violet px-4 text-sm text-white disabled:opacity-40">Next question →</button>
     </div>
    </div>}
    {mode==="video"&&<div className="mt-7 rounded-[16px] border border-hairline bg-[#F7F6FB] p-5 sm:p-6">
     <h3 className="font-display text-[23px] font-bold">Topic {topic+1} · Video overview</h3>
     <p className="mt-2 text-[14px] leading-6 text-ink-body">This recording streams from Almanac's private course storage. The original source link is not exposed in the public catalog.</p>
     {topic===3?<div className="mt-5 rounded-xl bg-[#FFF3E8] p-5 text-sm text-[#8B491B]"><strong>No dedicated Topic 4 recording was supplied.</strong> The topic's lesson, practice and cards remain available.</div>:
       videoBusy?<div className="mt-5 rounded-xl bg-white p-6 text-sm">Preparing secure video playback…</div>:
       videoError?<p role="alert" className="mt-5 rounded-xl bg-[#FDEBEF] p-4 text-sm text-[#8A1C37]">{videoError}</p>:
       videoUrl?<video key={videoUrl} className="mt-5 aspect-video w-full rounded-xl bg-black" controls playsInline preload="metadata" controlsList="nodownload">
         <source src={videoUrl} type="video/mp4"/>Your browser cannot play this recording.
       </video>:<p className="mt-5 rounded-xl bg-white p-4 text-sm">This recording is not available yet.</p>}
     <p className="mt-4 text-xs text-ink-muted">Check narration accuracy, slide-to-audio sync, readability and reuse rights before final learner release. Jocelyne's invitation remains on hold.</p>
    </div>}
    <footer className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
     <button type="button" disabled={topic===0} onClick={()=>selectTopic(topic-1)} className="min-h-11 rounded-full border border-hairline px-5 text-sm disabled:opacity-40">← Previous topic</button>
     <button type="button" disabled={topic>=pack.modules.length-1} onClick={()=>selectTopic(topic+1)} className="min-h-11 rounded-full bg-violet px-5 text-sm text-white disabled:opacity-40">Next topic →</button>
    </footer>
   </section>
  </div>}
  <p className="mt-5 text-xs leading-6 text-ink-muted">Private Owner view. The public course page only shows the curriculum and purchasing options. Learners still require approved paid access, and the study pack is withheld until final publication.</p>
 </main>;
}

"use client";
import {useEffect,useState} from "react";
import {rpc} from "@/lib/api";
type Question={stem:string;options:string[];correctIndex:number;explanation:string};
type Flashcard={front:string;back:string};
type Unit={title:string;lesson:string;objectives:string[];practice:Question[];flashcards:Flashcard[]};
type Simulation={title:string;minutes:number;questions:Question[]};
type CoursePack={version:number;modules:Unit[];simulations:Simulation[]};
const starter=(count:number):CoursePack=>({version:1,
 modules:Array.from({length:count},(_,i)=>({
  title:`Module ${i+1}: replace with actual syllabus topic`,
  objectives:["Write a clear learning objective here"],
  lesson:"Write the complete instructional lesson here. Include worked examples, explanations and key connections.",
  practice:[],flashcards:[]
 })),simulations:[]});
const sampleQuestion:Question={stem:"What is the best answer to this sample question?",options:["Option A","Option B","Option C","Option D"],correctIndex:1,explanation:"Explain why the correct choice is right and why the others do not apply."};
const sampleCard:Flashcard={front:"Describe the principle.",back:"Write a concise and accurate explanation."};
export function StaffCoursePack({orderId,token,modules,kind,paymentStatus,startedAt}:{
 orderId:string;token:string;modules:number;kind:string;paymentStatus:string;startedAt:string|null;
}){
 const [open,setOpen]=useState(false);
 const [json,setJson]=useState("");
 const [published,setPublished]=useState(false);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const [metrics,setMetrics]=useState({modules:0,practice:0,cards:0,simulations:0});
 useEffect(()=>{
  if(!open||!token)return;let cancelled=false;
  void rpc<{content:CoursePack|null;published:boolean}>("learning_staff_pack_get",{p_token:token,p_order:orderId})
   .then(v=>{if(cancelled)return;setJson(JSON.stringify(v.content||starter(modules),null,2));setPublished(v.published);})
   .catch(()=>{if(!cancelled)setError("Unable to retrieve this pack.");});
  return()=>{cancelled=true};
 },[open,orderId,token,modules]);
 function parse(){
  const parsed=JSON.parse(json) as CoursePack;
  if(!parsed||!Array.isArray(parsed.modules)||parsed.modules.length!==modules)
   throw Error(`Expected exactly ${modules} modules.`);
  return parsed;
 }
 function downloadTemplate(){
  const c=starter(modules);
  if(c.modules[0]){c.modules[0].practice.push(sampleQuestion);c.modules[0].flashcards.push(sampleCard);}
  if(kind!=="resource")c.simulations.push({title:"Sample exam simulation",minutes:60,questions:[sampleQuestion]});
  const u=URL.createObjectURL(new Blob([JSON.stringify(c,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=u;a.download="almanac-course-template.json";
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
 }
 async function save(){
  setBusy(true);setError("");setNotice("");
  try{
   const parsed=parse();
   await rpc("learning_staff_pack_set",{p_token:token,p_order:orderId,p_content:parsed});
   setPublished(false);setNotice("Draft saved privately. A quality review and publish step remain.");
  }catch(e){setError(e instanceof Error?e.message:"Could not save the pack. Check the schema.");}
  finally{setBusy(false);}
 }
 async function publish(){
  if(!window.confirm("Confirm that the imported lessons, practice answers, flashcards, explanations and simulations were checked for accuracy and the purchased quantity. Publish to this learner's workspace?"))return;
  setBusy(true);setError("");setNotice("");
  try{
   const data=await rpc<{published:boolean;practiceQuestions:number;flashcards:number}>("learning_staff_pack_publish",
    {p_token:token,p_order:orderId});
   setPublished(data.published);
   setNotice(`Published ${data.practiceQuestions} practice questions and ${data.flashcards} cards. The customer can study them in their workspace.`);
  }catch{setError("Publishing blocked: confirm production has started and the pack includes the required lessons, explained questions, flashcards and exam simulations.");}
  finally{setBusy(false);}
 }
 function metricsForJson(input:string){
  try{
   const x=JSON.parse(input) as CoursePack;
   if(!Array.isArray(x.modules))throw Error();
   setMetrics({modules:x.modules.length,
    practice:x.modules.reduce((a,m)=>a+(Array.isArray(m.practice)?m.practice.length:0),0),
    cards:x.modules.reduce((a,m)=>a+(Array.isArray(m.flashcards)?m.flashcards.length:0),0),
    simulations:Array.isArray(x.simulations)?x.simulations.length:0});
  }catch{setMetrics({modules:0,practice:0,cards:0,simulations:0});}
 }
 return <section className="mt-4 rounded-xl border border-hairline bg-white p-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><h3 className="font-semibold">Interactive module content</h3>
    <p className="mt-1 text-xs text-ink-muted">{published?"Published to learner":"Draft or not yet configured"} · Lessons, quizzes, flashcards and exam simulations</p></div>
   <button type="button" onClick={()=>setOpen(v=>!v)}
    className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700">
    {open?"Hide import tools":"Build or import content →"}</button>
  </div>
  {open&&<>
   <p className="mt-3 text-sm text-ink-body">Import a structured JSON file for this customer's modules. This lets Almanac teach and assess any subject with the same interactive engine. Files such as videos, slides and downloadable guides are managed separately above.</p>
   <div className="mt-3 flex flex-wrap gap-2">
    <button type="button" onClick={downloadTemplate} className="rounded-full bg-mist px-4 py-2 text-xs font-semibold text-violet-700">Download JSON starter template</button>
    <label className="rounded-full bg-mist px-4 py-2 text-xs font-semibold text-violet-700">
     Import JSON <input type="file" accept=".json,application/json" className="sr-only" onChange={async e=>{
      const file=e.target.files?.[0];if(!file)return;
      if(file.size>1500000){setError("Maximum 1.5MB per structured course file.");return;}
      const raw=await file.text();setJson(raw);metricsForJson(raw);setError("");
     }}/></label>
   </div>
   <p className="mt-3 text-xs text-ink-muted">Each module requires a title, lesson, objectives, practice questions with four options, a correct answer index and explanation, and front/back flashcards. Exam packs additionally require timed simulations. The publisher enforces minimum included quantities.</p>
   <label className="mt-4 block text-sm font-semibold">Structured course content
    <textarea value={json} onChange={e=>{setJson(e.target.value);metricsForJson(e.target.value)}}
     rows={12} spellCheck={false} className="mt-2 w-full rounded-xl border border-hairline bg-mist p-3 font-mono text-xs"/>
   </label>
   <p className="mt-2 text-xs text-ink-muted">Current JSON: {metrics.modules||modules} modules · {metrics.practice} questions · {metrics.cards} flashcards · {metrics.simulations} exam simulations.</p>
   <div className="mt-4 flex flex-wrap gap-3">
    <button type="button" disabled={busy||paymentStatus!=="verified"} onClick={()=>void save()}
     className="min-h-11 rounded-full bg-violet px-5 text-sm font-semibold text-white disabled:opacity-50">Save private draft</button>
    <button type="button" disabled={busy||!startedAt||published} onClick={()=>void publish()}
     className="min-h-11 rounded-full border border-hairline bg-white px-5 text-sm font-semibold text-violet-700 disabled:opacity-50">
     Quality checked · Publish pack</button>
   </div>
   {notice&&<p role="status" className="mt-3 rounded-xl bg-lilac p-3 text-sm">{notice}</p>}
   {error&&<p role="alert" className="mt-3 rounded-xl bg-rose p-3 text-sm">{error}</p>}
  </>}
 </section>;
}

"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {rpc,friendlyError} from "@/lib/api";
import {COACH_KEY} from "@/lib/store";

type Question={stem:string;options:string[];correctIndex:number;explanation:string};
type Card={front:string;back:string};
type Unit={title:string;lesson:string;objectives:string[];practice:Question[];flashcards:Card[]};
type Simulation={title:string;minutes:number;questions:Question[]};
type Pack={version:number;modules:Unit[];simulations:Simulation[]};
const COURSE="advanced-pharmacology";

export default function MidtermRelease(){
 const [token,setToken]=useState("");
 const [allowed,setAllowed]=useState(false);
 const [pack,setPack]=useState<Pack|null>(null);
 const [json,setJson]=useState("");
 const [published,setPublished]=useState(false);
 const [reviewer,setReviewer]=useState("");
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 useEffect(()=>{
   try{
     const staff=JSON.parse(localStorage.getItem(COACH_KEY)||"null") as {token?:string;role?:string}|null;
     if(!staff?.token||staff.role!=="owner"){
       setError("Sign in as Almanac Owner to prepare the NUR-635 midterm.");
       setLoading(false);return;
     }
     setToken(staff.token);setAllowed(true);
     void rpc<{content:Pack|null;published:boolean}>("learning_curated_staff_pack_get",{p_token:staff.token,p_course:COURSE})
       .then(v=>{setPack(v.content||null);setPublished(Boolean(v.published));})
       .catch(e=>setError(friendlyError(e))).finally(()=>setLoading(false));
   }catch{setError("Owner session not available.");setLoading(false)}
 },[]);
 const count=pack?{
  modules:pack.modules?.length||0,
  practice:pack.modules.reduce((n,m)=>n+(m.practice?.length||0),0),
  cards:pack.modules.reduce((n,m)=>n+(m.flashcards?.length||0),0),
  simulation:pack.simulations?.length||0
 }:null;
 async function importFile(f:File|null){
  if(!f)return;
  if(f.size>1500000){setError("File exceeds the 1.5 MB limit.");return;}
  setError("");setNotice("");
  try{
   const raw=await f.text();
   const v=JSON.parse(raw) as Pack;
   if(v.version!==1||!Array.isArray(v.modules)||v.modules.length!==8
      ||!v.modules.every(m=>m.practice?.length>=6&&m.flashcards?.length>=6)
      ||!Array.isArray(v.simulations)||v.simulations.length<1)
     throw Error("Expected 8 topics, at least 6 questions and 6 cards per topic, and a timed simulation.");
   setPack(v);setJson(raw);setPublished(false);
   setNotice("File checked in this browser. Save the private draft before publishing.");
  }catch(e){setError(e instanceof Error?e.message:"Invalid course pack file.");}
 }
 async function save(){
  if(!token||!json)return;
  setBusy(true);setError("");setNotice("");
  try{
   await rpc("learning_curated_staff_pack_set",{p_token:token,p_course:COURSE,p_content:JSON.parse(json)});
   setPublished(false);setNotice("Saved as a private NUR-635 midterm draft; paid learners cannot view it until published.");
  }catch(e){setError(e instanceof Error?e.message:"Could not save draft.");}
  finally{setBusy(false)}
 }
 async function publish(){
  if(!token||!pack||!reviewer.trim()||!window.confirm("Confirm that the clinical review of the exact eight-topic pack passed and release it to entitled Advanced Pharmacology learners?"))return;
  setBusy(true);setError("");setNotice("");
  try{
   await rpc("learning_curated_staff_pack_publish",{p_token:token,p_course:COURSE,p_reviewed_by:reviewer.trim()});
   setPublished(true);
   setNotice("Published. Only students enrolled and approved for Advanced Pharmacology can open this pack.");
  }catch(e){setError(e instanceof Error?e.message:"Could not publish.");}
  finally{setBusy(false)}
 }
 return <main className="alm-staff mx-auto max-w-[960px] px-4 pb-24 pt-8 sm:px-6">
  <Link href="/coach/learning-requests" className="text-sm font-semibold text-violet-700">← Learning orders &amp; payments</Link>
  <div className="mt-5 rounded-[20px] bg-[#2A1B78] p-6 text-white sm:p-8">
   <p className="text-xs font-bold uppercase tracking-widest text-white/70">Almanac · Approved learning content</p>
   <h1 className="mt-2 font-display text-[30px] font-bold">NUR-635 Midterm — Topics 1–8</h1>
   <p className="mt-3 max-w-[650px] text-sm leading-6 text-white/80">Import the reviewed course pack once. Publication makes it available only to learners with an approved Advanced Pharmacology enrollment.</p>
  </div>
  {loading?<p className="mt-6 text-sm">Checking Owner access…</p>:null}
  {error&&<p role="alert" className="mt-5 rounded-xl bg-rose p-4 text-sm">{error}</p>}
  {allowed&&<section className="alm-desk-card mt-5 p-5 sm:p-7">
    <div className="mb-5 rounded-xl border border-hairline bg-[#F7F6FB] p-4">
      <p className="text-sm font-bold">Preview the imported learning experience</p>
      <p className="mt-2 text-xs text-ink-muted">Review the eight topic lessons, practice rationales, flashcards, exam rehearsal and outstanding video integration before releasing student access.</p>
      <Link href="/coach/nur635-midterm/preview" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#2A1B78] px-5 text-sm font-bold text-white">Open private course preview →</Link>
    </div>
    <div className="flex flex-wrap justify-between gap-3">
      <div><h2 className="text-xl font-bold">Course release</h2><p className="mt-1 text-sm text-ink-body">Private pack · Clinical review signoff required to publish</p></div>
      <span className={`rounded-full px-3 py-2 text-xs font-bold ${published?"bg-mint text-mint-ink":"bg-lilac text-violet-700"}`}>{published?"Published to entitled students":"Private draft"}</span>
    </div>
    <label className="mt-5 block text-sm font-semibold">Reviewed NUR-635 import file (.json)
      <input type="file" accept=".json,application/json" onChange={e=>void importFile(e.target.files?.[0]||null)}
        className="mt-2 block w-full rounded-xl border border-hairline bg-white p-3 text-sm"/>
    </label>
    {count&&<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {([["Topics",count.modules],["Questions",count.practice],["Flashcards",count.cards],["Simulations",count.simulation]] as const).map(([k,v])=>
        <div key={k} className="rounded-xl bg-[#F6F4FB] p-4"><p className="text-[12px] text-ink-muted">{k}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}
     </div>}
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" disabled={busy||!json||!allowed} onClick={()=>void save()}
        className="min-h-11 rounded-full bg-violet px-5 text-sm font-bold text-white disabled:opacity-40">Save private draft</button>
    </div>
    <div className="mt-6 border-t border-hairline pt-5">
      <label className="block text-sm font-semibold">Clinical reviewer or approving lead
        <input value={reviewer} onChange={e=>setReviewer(e.target.value)} placeholder="Name or review reference" maxLength={120}
          className="mt-2 min-h-12 w-full rounded-xl border border-hairline p-3 text-base"/>
      </label>
      <p className="mt-2 text-xs text-ink-muted">Review the exact uploaded lessons, 48 explanations, 48 cards and timed rehearsal before release. No changes to payment records.</p>
      <button type="button" onClick={()=>void publish()} disabled={busy||!pack||!reviewer.trim()||published}
        className="mt-4 min-h-11 rounded-full bg-violet px-5 text-sm font-bold text-white disabled:opacity-40">Clinical review passed · Publish to paid learners</button>
    </div>
    {notice&&<p role="status" className="mt-5 rounded-xl bg-mint p-4 text-sm">{notice}</p>}
    <p className="mt-5 text-xs text-ink-muted">This preparation course is independent of GCU. It is not a copy of the institution's proctored examination.</p>
  </section>}
 </main>;
}

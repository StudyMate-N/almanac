"use client";

import { useState } from "react";
import { rpc } from "@/lib/api";
export type StaffPlan={
 learning_plan_title?:string|null;learning_plan_summary?:string|null;
 learning_plan_topics?:string[];learning_plan_objectives?:string[];
 learning_plan_dates?:string[];learning_plan_status?:string;
 learning_plan_feedback?:string|null;
};
export function StaffLearningPlan({id,token,plan}:{
 id:string;token:string;plan:StaffPlan;
}){
 const [title,setTitle]=useState(plan.learning_plan_title||"");
 const [summary,setSummary]=useState(plan.learning_plan_summary||"");
 const [topics,setTopics]=useState((plan.learning_plan_topics||[]).join("\n"));
 const [objectives,setObjectives]=useState((plan.learning_plan_objectives||[]).join("\n"));
 const [dates,setDates]=useState((plan.learning_plan_dates||[]).join("\n"));
 const [status,setStatus]=useState(plan.learning_plan_status||"pending");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [open,setOpen]=useState(false);
 function lines(value:string){return value.split("\n").map(x=>x.trim()).filter(Boolean).slice(0,12);}
 async function share(){
  if(busy)return;setBusy(true);setError("");
  try{
   await rpc("learning_plan_staff_set",{
    p_staff_token:token,p_id:id,p_title:title,p_summary:summary,
    p_topics:lines(topics),p_objectives:lines(objectives),p_dates:lines(dates)
   });
   setStatus("shared");setError("Learning plan saved and shared on the customer's private invoice.");
   setOpen(false);
  }catch{setError("Unable to share the plan. Check the title, summary and item lengths.");}
  finally{setBusy(false);}
 }
 return <div className="mt-4 rounded-xl border border-hairline bg-mist p-4">
  <div className="flex flex-wrap items-center justify-between gap-2">
   <div><p className="font-semibold">Learning plan</p>
     <p className="text-xs text-ink-muted">Status: {status.replaceAll("_"," ")}</p></div>
   <button type="button" onClick={()=>setOpen(v=>!v)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700">
    {open?"Hide editor":"Review and share learning plan →"}</button>
  </div>
  {plan.learning_plan_feedback&&<p className="mt-3 text-sm text-ink-body">Learner adjustment request: {plan.learning_plan_feedback}</p>}
  {open&&<div className="mt-4 space-y-3">
   <p className="text-xs text-ink-muted">Review uploaded syllabus and materials first. Enter only topics, objectives and dates supported by what was supplied; don't promise coverage beyond the purchased package.</p>
   <label className="block text-sm font-semibold">Plan title
     <input maxLength={140} className="mt-2 w-full rounded-xl border border-hairline bg-white p-3" value={title} onChange={e=>setTitle(e.target.value)}/></label>
   <label className="block text-sm font-semibold">Summary
     <textarea rows={3} maxLength={1500} className="mt-2 w-full rounded-xl border border-hairline bg-white p-3" value={summary} onChange={e=>setSummary(e.target.value)}/></label>
   {([
    ["Topics or units",topics,setTopics],
    ["Learning objectives",objectives,setObjectives],
    ["Important dates (only if known)",dates,setDates]
   ] as const).map(([label,value,setter])=><label key={label} className="block text-sm font-semibold">{label}
     <textarea rows={3} className="mt-2 w-full rounded-xl border border-hairline bg-white p-3"
      value={value} onChange={e=>setter(e.target.value)} placeholder="One item per line, up to 12"/>
    </label>)}
   <button type="button" disabled={busy||title.trim().length<3||summary.trim().length<15}
    onClick={()=>void share()} className="min-h-11 rounded-full bg-violet px-5 font-semibold text-white disabled:opacity-50">
    {busy?"Sharing…":"Share plan for learner approval →"}
   </button>
  </div>}
  {error&&<p role="status" className="mt-3 text-xs text-ink-body">{error}</p>}
 </div>;
}

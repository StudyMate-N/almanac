"use client";

import { useState } from "react";
import { rpc } from "@/lib/api";

export type LearningPlan={
 learningPlanStatus:string|null;
 learningPlanTitle:string|null;
 learningPlanSummary:string|null;
 learningPlanTopics:string[]|null;
 learningPlanObjectives:string[]|null;
 learningPlanDates:string[]|null;
 learningPlanFeedback:string|null;
};
export function LearningPlanReview({id,token,plan,onRefresh}:{
 id:string;token:string;plan:LearningPlan;onRefresh:()=>Promise<void>;
}) {
 const [feedback,setFeedback]=useState("");
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [editing,setEditing]=useState(false);
 const status=plan.learningPlanStatus||"pending";
 async function respond(action:"confirm"|"request_revision"){
  if(busy)return;
  if(action==="request_revision"&&feedback.trim().length<8){
   setNotice("Tell us what needs changing (at least 8 characters).");return;
  }
  setBusy(true);setNotice("");
  try {
   await rpc("learning_plan_respond",{p_id:id,p_token:token,p_action:action,p_feedback:feedback.trim()});
   await onRefresh();
   setNotice(action==="confirm"?"Learning plan confirmed.":"Your changes have been sent to our team.");
   setEditing(false);
  }catch{setNotice("We couldn't record your response. Please try again.");}
  finally{setBusy(false);}
 }
 return <section className="rounded-tile border border-hairline bg-white p-5 sm:p-7 print:hidden">
  <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">PERSONALIZED LEARNING</p>
  <h2 className="mt-2 font-display text-2xl font-semibold">Your Learning Plan</h2>
  {status==="pending"?<div className="mt-4 rounded-2xl bg-mist p-4">
   <p className="font-semibold">Your plan is being prepared.</p>
   <p className="mt-2 text-sm text-ink-body">Once your course information is reviewed, we'll share the topics, learning goals, and important dates identified for your package. You'll have a chance to confirm them or request adjustments.</p>
  </div>:<>
   <div className="mt-4 rounded-2xl bg-mist p-4">
    <p className="text-xs font-semibold text-violet-700">{status==="confirmed"?"CONFIRMED":status==="revision_requested"?"ADJUSTMENTS REQUESTED":"READY FOR YOUR REVIEW"}</p>
    <h3 className="mt-2 font-display text-xl font-semibold">{plan.learningPlanTitle||"Your course plan"}</h3>
    <p className="mt-2 text-sm text-ink-body whitespace-pre-wrap">{plan.learningPlanSummary}</p>
   </div>
   <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {([
      ["Topics to cover",plan.learningPlanTopics],
      ["Learning objectives",plan.learningPlanObjectives],
      ["Important dates or milestones",plan.learningPlanDates]
    ] as const).map(([title,items])=>items?.length?<div key={title} className="rounded-xl border border-hairline p-4">
     <h4 className="font-semibold">{title}</h4>
     <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-body">{items.map((x,i)=><li key={i}>{x}</li>)}</ul>
    </div>:null)}
   </div>
   {status==="revision_requested"&&plan.learningPlanFeedback&&<p className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink-body">Your feedback: {plan.learningPlanFeedback}</p>}
   {status==="shared"&&<div className="mt-5">
    <p className="text-sm text-ink-body">Does this reflect what you're learning? Confirm the plan or tell us what to adjust—there's no extra charge for clarifying the agreed scope.</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <button type="button" onClick={()=>void respond("confirm")} disabled={busy}
        className="min-h-12 rounded-full bg-violet px-5 font-semibold text-white disabled:opacity-50">Confirm my learning plan ✓</button>
      <button type="button" onClick={()=>setEditing(v=>!v)}
        className="min-h-12 rounded-full border border-hairline px-5 font-semibold text-violet-700">Request an adjustment</button>
    </div>
    {editing&&<div className="mt-4">
     <label className="block text-sm font-semibold">What should we change or clarify?
      <textarea rows={3} maxLength={1000} className="mt-2 w-full rounded-xl border border-hairline p-3"
       value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="e.g. Please prioritize chapters 4–6 before my exam."/>
     </label>
     <button type="button" onClick={()=>void respond("request_revision")} disabled={busy}
      className="mt-2 rounded-full bg-violet px-5 py-3 font-semibold text-white disabled:opacity-50">Send adjustment request →</button>
    </div>}
   </div>}
  </>}
  {notice&&<p role="status" className="mt-4 rounded-xl bg-mist p-3 text-sm text-ink-body">{notice}</p>}
 </section>;
}

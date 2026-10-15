"use client";
import {useCallback,useEffect,useState} from "react";
import {rpc} from "@/lib/api";

type Plan={
 orderId:string;invoiceRef:string;subject:string;status:string;
 title:string|null;summary:string|null;
 topics:string[];objectives:string[];dates:string[];
 feedback:string|null;
};
type Props={orderId:string;studentToken:string;onUpdated:()=>void};
export function StudentPlanReview({orderId,studentToken,onUpdated}:Props){
 const [plan,setPlan]=useState<Plan|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [feedback,setFeedback]=useState("");
 const [busy,setBusy]=useState(false);
 const [open,setOpen]=useState(false);
 const get=useCallback(async()=>{
   setLoading(true);setError("");
   try{
     const p=await rpc<Plan>("learning_student_plan_get",{p_student_token:studentToken,p_order:orderId});
     setPlan(p);
   }catch{setError("Your plan couldn't be loaded. Try again or contact support.");setPlan(null);}
   finally{setLoading(false);}
 },[orderId,studentToken]);
 useEffect(()=>{void get()},[get]);
 const respond=async(action:"confirm"|"request_revision")=>{
  if(busy||!plan)return;
  if(action==="request_revision"&&(feedback.trim().length<8||feedback.trim().length>1000)){
   setError("Please describe the requested changes in 8–1000 characters.");return;
  }
  setBusy(true);setError("");
  try{
   await rpc("learning_student_plan_respond",{
     p_student_token:studentToken,p_order:orderId,p_action:action,
     p_feedback:action==="request_revision"?feedback.trim():""
   });
   await get();onUpdated();setFeedback("");
  }catch{setError("We couldn't save your response. Please try again.");}
  finally{setBusy(false);}
 };
 return <section className="mt-4 overflow-hidden rounded-[15px] border border-[#D9D2F4] bg-[#FBFAFE]">
  <div className="flex flex-wrap items-center justify-between gap-2 p-4">
   <div><p className="alm-desk-eyebrow">Your learning plan</p>
    <p className="mt-1 text-[13px] font-bold text-ink">{plan?.title??"Course plan"}</p>
    <p className="mt-1 text-[12px] text-ink-muted">{plan?.status==="confirmed"?"Plan confirmed":plan?.status==="revision_requested"?"Changes requested":plan?.status==="shared"?"Ready for your review":"Awaiting plan details"}</p></div>
   <button type="button" disabled={loading} onClick={()=>setOpen(v=>!v)}
    aria-expanded={open} className="alm-desk-btn alm-desk-btn-secondary">
    {open?"Close plan":"Review your plan"} <span aria-hidden="true">{open?"↑":"→"}</span>
   </button>
  </div>
  {open&&<div className="space-y-4 border-t border-[#E4DFF5] bg-white p-4 sm:p-5">
   {loading?<p role="status" className="text-[13px] text-ink-muted">Loading the shared plan…</p>:
    plan?<div className="space-y-4">
     <p className="text-[13px] leading-relaxed text-ink-body">{plan.summary}</p>
     {([
       ["Topics and modules",plan.topics],["Learning objectives",plan.objectives],["Planned milestones",plan.dates]
      ] as [string,string[]][]).filter(([,items])=>items?.length).map(([heading,items])=>
       <div key={heading}><h3 className="text-[14px] font-bold">{heading}</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-ink-body">{items.map((x,i)=><li key={i}>{x}</li>)}</ul>
       </div>)}
     {plan.status==="confirmed"&&<p className="rounded-xl bg-mint p-3 text-[13px] font-semibold text-mint-ink">✓ Your plan has been confirmed.</p>}
     {plan.status==="revision_requested"&&<p className="rounded-xl bg-[#FFF4EC] p-3 text-[13px] text-[#9D3E0E]">Your comments have been sent to the team. We&apos;ll review them before you confirm the updated plan.</p>}
     {plan.status==="shared"&&<>
      <div className="flex flex-wrap gap-2">
       <button type="button" disabled={busy} onClick={()=>void respond("confirm")} className="alm-desk-btn disabled:opacity-50">Confirm this plan →</button>
      </div>
      <label htmlFor={"plan-feedback-"+orderId} className="block text-[13px] font-bold">Need changes?</label>
      <textarea id={"plan-feedback-"+orderId} rows={3} value={feedback} maxLength={1000}
       onChange={e=>setFeedback(e.target.value)} placeholder="Tell us what should change in the course coverage, objectives or dates."
       className="w-full rounded-xl border border-[#D9D2F4] bg-white p-3 text-[13px] outline-none focus:border-violet"/>
      <button type="button" disabled={busy||feedback.trim().length<8} onClick={()=>void respond("request_revision")}
       className="alm-desk-btn alm-desk-btn-secondary disabled:opacity-50">{busy?"Saving…":"Request a revision →"}</button>
     </>}
    </div>:null}
   {error&&<p role="alert" className="rounded-xl bg-rose p-3 text-[13px] text-rose-ink">{error}</p>}
   <p className="text-[11px] text-ink-muted">This review is available only to the student account linked to the verified purchase. Your private invoice link is not required.</p>
  </div>}
 </section>;
}

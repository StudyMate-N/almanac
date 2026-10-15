"use client";
import Link from "next/link";
import {WorkspaceShell} from "@/components/workspace-shell";
import {StudentPlanReview} from "@/components/site/student-plan-review";
import { useCallback, useEffect, useState } from "react";
import { rpc } from "@/lib/api";
import { useStudent } from "@/lib/store";
import { SUPABASE_URL } from "@/lib/config";

type Order={
 id:string;invoiceRef:string;subject:string;kind:string;moduleCount:number;
 status:string;paymentStatus:string;planStatus:string|null;planTitle:string|null;
 productionStartedAt:string|null;deliveryDueAt:string|null;deliveredAt:string|null;
 releasedCount:number;packPublished:boolean;
};
type Resource={id:string;name:string;kind:string;moduleNumber:number|null;size:number;releasedAt:string};
const endpoint=`${SUPABASE_URL}/functions/v1/learning-deliverables`;
const date=(v:string)=>new Date(v).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});
const describeStatus=(r:Order)=>{
 if(r.deliveredAt||r.status==="delivered")return "Delivered";
 if(r.packPublished||r.releasedCount>0)return "Available in your workspace";
 if(r.status==="review")return "Quality review";
 if(r.productionStartedAt||r.status==="in_production")return "Being prepared";
 if(r.planStatus==="shared")return "Learning plan shared";
 if(r.paymentStatus==="reported")return "Bank transfer being verified";
 if(r.paymentStatus==="verified")return "Awaiting preparation";
 return "Awaiting payment";
};
const paymentLabel=(status:string)=>status==="verified"?"Verified":status==="reported"?"Transfer reported":"Awaiting verification";
const chip=(r:Order)=>{
 const s=describeStatus(r);
 return r.deliveredAt||r.packPublished||r.releasedCount>0?"alm-chip-ready":
  r.productionStartedAt||r.status==="in_production"||r.status==="review"?"alm-chip-building":"alm-chip-pending";
};

export default function LearningOrdersPage(){
 const {token,status}=useStudent();
 const [orders,setOrders]=useState<Order[]>([]);
 const [selected,setSelected]=useState<string|null>(null);
 const [files,setFiles]=useState<Resource[]>([]);
 const [busy,setBusy]=useState(false);
 const [downloading,setDownloading]=useState<string|null>(null);
 const [error,setError]=useState("");
 const [claim,setClaim]=useState<{id:string;token:string}|null>(null);
 const [claimBusy,setClaimBusy]=useState(false);
 const [claimNotice,setClaimNotice]=useState("");
 useEffect(()=>{
  const q=new URLSearchParams(window.location.search);
  const id=q.get("claimId")||"";
  const invoiceToken=q.get("claimToken")||"";
  if(/^[a-f0-9-]{36}$/i.test(id)&&/^[a-f0-9]{48}$/i.test(invoiceToken)){
   setClaim({id,token:invoiceToken});
  }
 },[]);
 async function claimOrder(){
  if(!claim||!token||claimBusy)return;
  setClaimBusy(true);setClaimNotice("");
  try{
   await rpc("learning_student_claim_order",{
    p_student_token:token,p_order:claim.id,p_invoice_token:claim.token
   });
   setClaim(null);
   window.history.replaceState(null,"","/app/orders");
   setClaimNotice("This order is now linked to your existing Almanac account.");
   await load();
  }catch{
   setClaimNotice("We couldn't link this order. You must be signed in with an account using the same email address as the paid invoice. For help, contact support@unemployedproff.com.");
  }finally{setClaimBusy(false);}
 }

 const load=useCallback(async()=>{
  if(!token)return;
  setBusy(true);setError("");
  try{
   const rows=await rpc<Order[]>("learning_student_orders",{p_token:token});
   setOrders(rows);
   const current=selected&&rows.some(r=>r.id===selected)?selected:rows[0]?.id||null;
   setSelected(current);
   if(current){
    const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({action:"student_list",studentToken:token,orderId:current})});
    const body=await r.json();
    if(!r.ok||!Array.isArray(body.files))throw Error("Unable to retrieve your learning resources");
    setFiles(body.files);
   }else setFiles([]);
  }catch{setError("We couldn't load your orders. Try refreshing or contact support.");}
  finally{setBusy(false);}
 },[token,selected]);
 useEffect(()=>{if(status==="ready")void load();},[status,load]);
 async function choose(id:string){
  if(!token)return;setSelected(id);setBusy(true);setError("");
  try{
   const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"student_list",studentToken:token,orderId:id})});
   const body=await r.json();if(!r.ok||!Array.isArray(body.files))throw Error();
   setFiles(body.files);
  }catch{setError("Unable to load the selected order.");}
  finally{setBusy(false);}
 }
 async function download(file:Resource){
  if(!token||!selected)return;
  setDownloading(file.id);setError("");
  try{
   const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"student_download",studentToken:token,orderId:selected,fileId:file.id})});
   if(!r.ok)throw Error();
   const blob=URL.createObjectURL(await r.blob());
   const a=document.createElement("a");a.href=blob;a.download=file.name;
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(blob),5000);
  }catch{setError("We couldn't download that resource. Contact support with your invoice reference.");}
  finally{setDownloading(null);}
 }
 const current=orders.find(r=>r.id===selected);
 return <WorkspaceShell><div className="mx-auto max-w-[1110px]">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="alm-desk-eyebrow">Learning workspace / Orders</p>
    <h1 className="mt-2 text-[29px] font-bold">Your learning orders</h1>
    <p className="mt-2 text-sm text-ink-body">Track what we're preparing and open the materials released for you.</p></div>
   <div className="flex gap-3"><Link className="alm-desk-btn alm-desk-btn-secondary" href="/app">Learning tools →</Link>
    <button type="button" onClick={()=>void load()} disabled={busy} className="alm-desk-btn disabled:opacity-50">Refresh status</button></div>
  </div>
  {claim&&<section className="mt-6 rounded-card border border-violet bg-lilac p-5">
    <h2 className="font-display text-xl font-semibold">Keep your learning in one workspace</h2>
    <p className="mt-2 text-sm text-ink-body">You opened a verified purchase from a private invoice. Link it to this signed-in Almanac account to keep your learning orders together. For security, the email address on both accounts must match.</p>
    <button type="button" disabled={claimBusy} onClick={()=>void claimOrder()}
      className="mt-4 min-h-12 rounded-full bg-violet px-5 font-semibold text-white disabled:opacity-50">
      {claimBusy?"Linking…":"Link this purchase to my account →"}</button>
    <p className="mt-2 text-xs text-ink-muted">Any separate access code previously issued just for this purchase will be retired after linking.</p>
   </section>}
  {claimNotice&&<p role="status" className="mt-5 rounded-xl bg-mist p-4 text-sm">{claimNotice}</p>}
  {error&&<p role="alert" className="mt-5 rounded-xl bg-rose p-4 text-sm">{error}</p>}
  {orders.length===0&&!busy?<section className="mt-7 rounded-tile bg-white p-7">
   <h2 className="font-display text-2xl font-semibold">No paid orders linked to this code yet.</h2>
   <p className="mt-3 text-sm text-ink-body">If you're waiting on payment confirmation, check your private invoice. Your course order will appear here once staff verify your transfer.</p>
   <Link href="/courses" className="mt-4 inline-block font-semibold text-violet-700 underline">Browse courses →</Link>
  </section>:null}
  {orders.length>0&&<div className="mt-5 grid gap-4 md:grid-cols-[265px_1fr]">
   <aside className="space-y-2" aria-label="Your orders">
    {orders.map(r=><button type="button" key={r.id} onClick={()=>void choose(r.id)}
     className={`w-full rounded-[15px] border p-4 text-left ${selected===r.id?"border-violet bg-lilac":"border-hairline bg-white hover:bg-mist"}`}>
     <span className="text-xs text-ink-muted">{r.invoiceRef}</span>
     <strong className="mt-1 block">{r.subject}</strong>
     <span className={`alm-desk-chip mt-2 ${chip(r)}`}>{describeStatus(r)}</span><span className="ml-2 text-[11px] text-ink-muted">{r.releasedCount} resources</span>
    </button>)}
   </aside>
   {current&&<section className="alm-desk-card p-5 sm:p-6">
    <p className="text-xs font-bold uppercase tracking-wide text-violet-700">{current.invoiceRef}</p>
    <h2 className="mt-2 text-[24px] font-bold">{current.subject}</h2><span className={`alm-desk-chip mt-2 ${chip(current)}`}>{describeStatus(current)}</span>
    <p className="mt-2 text-sm text-ink-body">
     {current.moduleCount} learning {current.moduleCount===1?"module":"modules"} · {current.kind.replaceAll("_"," ")}
    </p>
    <div className="mt-5 grid gap-2 sm:grid-cols-3">
     <div className="rounded-xl bg-mist p-4"><p className="text-xs text-ink-muted">Payment</p><p className="mt-1 font-semibold">{paymentLabel(current.paymentStatus)}</p></div>
     <div className="rounded-xl bg-mist p-4"><p className="text-xs text-ink-muted">Preparation</p><p className="mt-1 font-semibold">{current.productionStartedAt?"Underway":"Awaiting start"}</p></div>
     <div className="rounded-xl bg-mist p-4"><p className="text-xs text-ink-muted">Target delivery</p>
      <p className="mt-1 font-semibold">{current.deliveryDueAt?date(current.deliveryDueAt):"To be confirmed"}</p></div>
    </div>
    {current.planStatus&&token&&<StudentPlanReview key={current.id} orderId={current.id} studentToken={token} onUpdated={()=>void load()}/>}

    <div className="alm-desk-card mt-4 bg-[#FBFAFE] p-4">
     <h3 className="text-[15px] font-bold">Your order timeline</h3>
     <ol className="mt-3">
      {[
        ["Request received",true],
        ["Payment verified",current.paymentStatus==="verified"],
        ["Course preparation",Boolean(current.productionStartedAt)],
        ["Quality review",current.status==="review"||current.status==="delivered"||Boolean(current.deliveredAt)],
        ["Ready in your workspace",Boolean(current.packPublished||current.releasedCount>0||current.deliveredAt)]
      ].map(([label,finished],i,all)=><li key={String(label)} className="alm-timeline-row">
        <span className={`alm-timeline-dot ${finished?"done":all.slice(0,i).every(x=>x[1])?"current":""}`}>{finished?"✓":i+1}</span>
        <span className={`flex-1 ${finished?"font-semibold text-ink":"text-ink-muted"}`}>{label}</span>
        {finished&&<span className="text-[11px] font-semibold text-mint-ink">Complete</span>}
      </li>)}
     </ol>
    </div>
    {current.deliveredAt&&<p className="mt-4 rounded-xl bg-mist p-4 text-sm font-semibold">
     Released on {date(current.deliveredAt)}. Your materials remain available below.
    </p>}
    {current.packPublished?
      <div className="mt-5 rounded-xl bg-lilac p-5">
       <p className="font-semibold">Your interactive lessons are ready</p>
       <p className="mt-1 text-sm text-ink-body">Open structured modules, complete explained practice questions, review flashcards and take exam simulations. Your latest answers are saved to this account.</p>
       <Link href={`/app/orders/${encodeURIComponent(current.id)}/learn`}
        className="mt-3 inline-flex min-h-11 items-center rounded-full bg-violet px-5 text-sm font-semibold text-white">
        Start learning →</Link>
      </div>:
      <p className="mt-5 rounded-xl bg-mist p-4 text-sm text-ink-body">Interactive lessons and practice will appear here after staff quality review. Any completed downloadable files remain available below.</p>}
    <h3 className="mt-7 text-[20px] font-bold">Your released materials</h3>
    {busy?<p className="mt-3 text-sm text-ink-muted">Loading…</p>:
     files.length===0?<div className="mt-3 rounded-xl border border-hairline p-5 text-sm text-ink-body">
      Nothing has been released yet. We'll make each approved resource available here. You do not need to submit another purchase.
     </div>:<ul className="mt-4 space-y-3">{files.map(f=><li key={f.id}
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline p-4">
      <div className="min-w-0 flex-1"><p className="break-words font-semibold">{f.name}</p>
       <p className="mt-1 text-xs text-ink-muted">{f.kind} · {f.moduleNumber?`Module ${f.moduleNumber} · `:""}{(f.size/1024/1024).toFixed(1)} MB</p></div>
      <button type="button" disabled={downloading!==null} onClick={()=>void download(f)}
       className="rounded-full bg-violet px-5 py-2 font-semibold text-white disabled:opacity-50">
       {downloading===f.id?"Preparing…":"Download →"}</button>
     </li>)}</ul>}
    <p className="mt-5 text-xs text-ink-muted">Need help? Email support@unemployedproff.com and include {current.invoiceRef}. Only files released to your order appear here.</p>
   </section>}
  </div>}
 </div></WorkspaceShell>;
}

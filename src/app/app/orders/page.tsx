"use client";
import Link from "next/link";
import {WorkspaceShell} from "@/components/workspace-shell";
import {markOrdersSeen} from "@/components/app-nav";
import {Avatar} from "@/components/page-header";
import {StudentPlanReview} from "@/components/site/student-plan-review";
import { useCallback, useEffect, useState } from "react";
import { rpc } from "@/lib/api";
import { useStudent } from "@/lib/store";
import { SUPABASE_URL } from "@/lib/config";
import { ALMANAC_SUPPORT_EMAIL } from "@/lib/almanac-contact";

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
/** Status chip colours (uniformity rules): ready = mint, being built = lilac, review or waiting = peach. */
const chip=(r:Order)=>r.deliveredAt||r.packPublished||r.releasedCount>0?"bg-mint text-correct":
  r.status==="review"?"bg-[#FFE9DC] text-[#A8430A]":
  r.productionStartedAt||r.status==="in_production"||r.planStatus==="shared"?"bg-lilac text-violet-deep":"bg-[#FFE9DC] text-[#A8430A]";
const Chip=({r}:{r:Order})=><span className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap ${chip(r)}`}>{describeStatus(r)}</span>;
const kindText=(r:Order)=>`${r.moduleCount} ${r.moduleCount===1?"module":"modules"} · ${r.kind.replaceAll("_"," ")}`;

export default function LearningOrdersPage(){
 const {token,status,authorizedCourses}=useStudent();
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
   setClaimNotice(`We couldn't link this order. You must be signed in with an account using the same email address as the paid invoice. For help, contact ${ALMANAC_SUPPORT_EMAIL}.`);
  }finally{setClaimBusy(false);}
 }

 const load=useCallback(async()=>{
  if(!token)return;
  setBusy(true);setError("");
  try{
   const rows=await rpc<Order[]>("learning_student_orders",{p_token:token});
   setOrders(rows);
   markOrdersSeen(rows);
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
 const steps:[string,boolean][]=current?[
  ["Request received",true],
  ["Payment verified",current.paymentStatus==="verified"],
  ["Course being prepared",Boolean(current.productionStartedAt)],
  ["Nurse review",current.status==="review"||current.status==="delivered"||Boolean(current.deliveredAt)],
  ["Ready in your workspace",Boolean(current.packPublished||current.releasedCount>0||current.deliveredAt)]
 ]:[];
 const firstOpen=steps.findIndex(x=>!x[1]);
 return <WorkspaceShell><div className="mx-auto max-w-[1128px]">
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
   <div className="flex min-w-0 flex-col gap-1">
    {orders.length>0&&<p className="text-[11px] font-extrabold tracking-[.12em] text-violet-700 uppercase">{orders.length} order{orders.length===1?"":"s"}</p>}
    <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-[-.035em] sm:text-[32px]">Orders</h1>
    <p className="text-[13.5px] text-ink-body sm:text-[14px]">Track what we're preparing and open the materials released for you.</p>
   </div>
   <div className="flex flex-wrap gap-2.5">
    <button type="button" onClick={()=>void load()} disabled={busy} className="flex h-11 items-center rounded-[12px] border-[1.5px] border-[#D9D2F3] bg-white px-4 text-[14px] font-bold text-violet-deep hover:bg-mist disabled:opacity-50">{busy?"Refreshing…":"Refresh status"}</button>
    <Link href="/request" className="flex h-11 items-center rounded-[12px] bg-violet px-5 text-[14px] font-bold text-white hover:bg-[#4A2DE6]">Request a course</Link>
    <span className="hidden sm:block"><Avatar/></span>
   </div>
  </div>
  {claim&&<section className="mb-5 rounded-[16px] border border-violet bg-lilac p-5">
    <h2 className="font-display text-xl font-semibold">Keep your learning in one workspace</h2>
    <p className="mt-2 text-sm text-ink-body">You opened a verified purchase from a private invoice. Link it to this signed-in Almanac account to keep your learning orders together. For security, the email address on both accounts must match.</p>
    <button type="button" disabled={claimBusy} onClick={()=>void claimOrder()}
      className="mt-4 h-11 rounded-[12px] bg-violet px-5 font-bold text-white disabled:opacity-50">
      {claimBusy?"Linking…":"Link this purchase to my account →"}</button>
    <p className="mt-2 text-xs text-ink-muted">Any separate access code previously issued just for this purchase will be retired after linking.</p>
   </section>}
  {claimNotice&&<p role="status" className="mb-5 rounded-[12px] border border-hairline bg-white p-4 text-sm">{claimNotice}</p>}
  {error&&<p role="alert" className="mb-5 rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] p-4 text-sm text-[#A8430A]">{error}</p>}
  {orders.length===0&&!busy&&authorizedCourses.length>0?<section className="rounded-[16px] border border-hairline bg-white p-7">
   <h2 className="font-display text-2xl font-semibold">Your learning access is active.</h2>
   <p className="mt-3 text-sm text-ink-body">Your enrollment was approved outside Almanac checkout, so there is no invoice or payment request to complete here. You can begin with your enrolled course.</p>
   <div className="mt-4 flex flex-wrap gap-3">{authorizedCourses.map(id=><Link key={id} href={`/app/courses/${encodeURIComponent(id)}`} className="flex h-11 items-center rounded-[12px] border-[1.5px] border-[#D9D2F3] px-4 text-[14px] font-bold text-violet-deep hover:bg-mist">Open your course →</Link>)}</div>
  </section>:null}
  {orders.length===0&&!busy&&authorizedCourses.length===0?<section className="rounded-[16px] border border-hairline bg-white p-7">
   <h2 className="font-display text-2xl font-semibold">No paid orders linked to this code yet.</h2>
   <p className="mt-3 text-sm text-ink-body">If you're waiting on payment confirmation, check your private invoice. Your course order will appear here once staff verify your transfer.</p>
   <Link href="/courses" className="mt-4 inline-block font-semibold text-violet-700 underline">Browse courses →</Link>
  </section>:null}
  {orders.length>0&&<div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr]">
    <section aria-label="Your orders" className="overflow-hidden rounded-[16px] border border-hairline bg-white">
     <div className="hidden grid-cols-[120px_minmax(0,1fr)_190px_90px] gap-4 border-b border-[#EEEBF7] px-[18px] py-3 text-[11px] font-extrabold tracking-[.12em] text-ink-muted md:grid">
      <span>ORDER</span><span>COURSE</span><span>STATUS</span><span className="text-right">RELEASED</span>
     </div>
     {orders.map(r=><button type="button" key={r.id} onClick={()=>void choose(r.id)} aria-pressed={selected===r.id}
      className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 border-b border-[#EEEBF7] px-4 py-4 text-left last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)_190px_90px] md:px-[18px] md:py-5 ${selected===r.id?"bg-[#F6F4FB]":"hover:bg-[#FBFAFE]"}`}>
      <span className="font-mono text-[12.5px] text-ink-body max-md:order-2 max-md:col-span-2">{r.invoiceRef}</span>
      <span className="flex min-w-0 flex-col max-md:order-1"><span className="truncate text-[14.5px] font-bold">{r.subject}</span><span className="text-[12.5px] text-ink-muted">{kindText(r)}</span></span>
      <span className="max-md:order-1 max-md:self-start"><Chip r={r}/></span>
      <span className="hidden text-right text-[14px] font-bold md:block">{r.releasedCount}</span>
     </button>)}
    </section>
   {current&&<aside className="flex flex-col gap-4 rounded-[16px] border border-hairline bg-white p-5 lg:sticky lg:top-6 lg:row-span-2">
    <div className="flex items-center justify-between gap-3"><span className="font-mono text-[12.5px] text-ink-body">{current.invoiceRef}</span><Chip r={current}/></div>
    <div><h2 className="font-display text-[22px] leading-tight font-bold tracking-[-.02em]">{current.subject}</h2><p className="mt-1 text-[12.5px] text-ink-muted">{kindText(current)}</p></div>
    <ol className="flex flex-col gap-2.5">
     {steps.map(([label,finished],i)=>{const now=i===firstOpen;return <li key={label} className="flex items-start gap-3">
      <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full text-[10px] font-extrabold ${finished?"bg-correct text-white":now?"border-2 border-violet text-violet-700":"border-[1.5px] border-[#D9D2F3] text-ink-muted"}`}>{finished?"✓":i+1}</span>
      <span className="flex flex-col"><span className={`text-[14px] ${finished||now?"font-semibold text-ink":"text-ink-muted"}`}>{label}</span><span className="text-[12px] text-ink-muted">{finished?"Done":now?"In progress":"Waiting"}</span></span>
     </li>;})}
    </ol>
    <div className="flex flex-col gap-2 border-t border-[#EEEBF7] pt-3.5 text-[13.5px]">
     <div className="flex justify-between gap-3"><span className="text-ink-muted">Payment</span><span className="font-bold">{paymentLabel(current.paymentStatus)}</span></div>
     <div className="flex justify-between gap-3"><span className="text-ink-muted">Target delivery</span><span className="font-bold">{current.deliveryDueAt?date(current.deliveryDueAt):"To be confirmed"}</span></div>
     {current.deliveredAt&&<div className="flex justify-between gap-3"><span className="text-ink-muted">Released</span><span className="font-bold">{date(current.deliveredAt)}</span></div>}
    </div>
    {current.planStatus&&token&&<StudentPlanReview key={current.id} orderId={current.id} studentToken={token} onUpdated={()=>void load()}/>}
    {current.packPublished?
     <Link href={`/app/orders/${encodeURIComponent(current.id)}/learn`} className="flex h-12 items-center justify-center rounded-[12px] bg-violet text-[14.5px] font-bold text-white hover:bg-[#4A2DE6]">Start learning →</Link>:
     <p className="rounded-[12px] bg-mist p-3.5 text-[13px] text-ink-body">Interactive lessons and practice appear here after nurse review. Any released files stay available under Released materials.</p>}
   </aside>}
    {current&&<section className="min-w-0 rounded-[16px] border border-hairline bg-white p-5">
     <h2 className="font-display text-[18px] font-bold">Released materials</h2>
     {busy?<p className="mt-3 text-sm text-ink-muted">Loading…</p>:
      files.length===0?<p className="mt-2 text-[13.5px] text-ink-body">Nothing has been released yet. We'll make each approved resource available here. You do not need to submit another purchase.</p>:
      <ul className="mt-3 flex flex-col gap-2">{files.map(f=><li key={f.id}
       className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#EEEBF7] p-3.5">
       <div className="min-w-0 flex-1"><p className="font-semibold break-words">{f.name}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{f.kind} · {f.moduleNumber?`Module ${f.moduleNumber} · `:""}{(f.size/1024/1024).toFixed(1)} MB</p></div>
       <button type="button" disabled={downloading!==null} onClick={()=>void download(f)}
        className="h-10 rounded-[12px] border-[1.5px] border-violet px-4 text-[13.5px] font-bold text-violet-700 hover:bg-lilac disabled:opacity-50">
        {downloading===f.id?"Preparing…":"Download"}</button>
      </li>)}</ul>}
     <p className="mt-4 text-xs text-ink-muted">Need help? Email {ALMANAC_SUPPORT_EMAIL} and include {current.invoiceRef}. Only files released to your order appear here.</p>
    </section>}
  </div>}
 </div></WorkspaceShell>;
}

"use client";
import { useEffect,useState } from "react";
import { rpc } from "@/lib/api";
import { SUPABASE_URL } from "@/lib/config";
const endpoint=`${SUPABASE_URL}/functions/v1/learning-deliverables`;
const KINDS=["lesson","video","slides","practice","flashcards","simulation","plan","other"] as const;
type Resource={id:string;name:string;kind:string;moduleNumber:number|null;size:number;released:boolean;uploadedAt:string};
export function StaffDeliveryPanel({orderId,token,paymentStatus,days,startedAt,dueAt,kind,modules,enhancements={}}:{
 orderId:string;token:string;paymentStatus:string;days:number;
 startedAt:string|null;dueAt:string|null;kind:string;modules:number;
 enhancements?:Record<string,number>;
}) {
 const [started,setStarted]=useState(startedAt);
 const [due,setDue]=useState(dueAt);
 const [records,setRecords]=useState<Resource[]>([]);
 const [open,setOpen]=useState(false);
 const [kindValue,setKindValue]=useState<(typeof KINDS)[number]>("lesson");
 const [moduleNumber,setModuleNumber]=useState("1");
 const [file,setFile]=useState<File|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 async function call(action:string,extra:Record<string,unknown>={}){
  const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({action,staffToken:token,orderId,...extra})});
  const d=await r.json();
  if(!r.ok)throw new Error(d.error||"The request failed");
  return d;
 }
 async function reload(){
  setBusy(true);setError("");
  try{const data=await call("staff_list");setRecords(data.files||[]);}
  catch(e){setError(e instanceof Error?e.message:"Unable to load files");}
  finally{setBusy(false);}
 }
 useEffect(()=>{if(open)void reload();/* eslint-disable-next-line react-hooks/exhaustive-deps */},[open]);
 async function begin(){
  if(!window.confirm("Confirm payment is verified and the required materials are received. This starts the delivery deadline."))return;
  setBusy(true);setError("");
  try{const data=await rpc<{startedAt:string;dueAt:string}>("learning_staff_start_production",{p_token:token,p_order:orderId});
   setStarted(data.startedAt);setDue(data.dueAt);setNotice("Preparation deadline recorded.");}
  catch{setError("Unable to start preparation. Confirm the payment was independently verified.");}
  finally{setBusy(false);}
 }
 async function upload(){
  if(!file||busy)return;
  setBusy(true);setError("");setNotice("");
  try{
   if(file.size>20*1024*1024)throw Error("Maximum 20MB per resource. Compress or split large videos.");
   const data=new FormData();data.append("orderId",orderId);data.append("staffToken",token);
   data.append("kind",kindValue);data.append("module",moduleNumber);data.append("file",file);
   const r=await fetch(endpoint,{method:"POST",body:data});const body=await r.json();
   if(!r.ok)throw Error(body.error||"Upload failed");
   setFile(null);setNotice("File saved privately. Release it only after quality review.");
   const list=await call("staff_list");setRecords(list.files||[]);
  }catch(e){setError(e instanceof Error?e.message:"Upload failed");}
  finally{setBusy(false);}
 }
 async function release(record:Resource){
  if(!window.confirm(record.released?"Withdraw this resource from student access?":
  "Confirm the resource has been reviewed for accuracy, completeness, licensing and student suitability. Release it to this learner?"))return;
  setBusy(true);setError("");
  try{await call("staff_release",{fileId:record.id,released:!record.released});
   setRecords(rows=>rows.map(x=>x.id===record.id?{...x,released:!record.released}:x));
   setNotice(record.released?"Access to this file withdrawn.":"File released to learner.");}
  catch(e){setError(e instanceof Error?e.message:"Unable to change release status");}
  finally{setBusy(false);}
 }
 const issued=records.filter(x=>x.released);
 const required:Record<string,number>=kind==="course"?
  {lesson:modules,video:modules+(enhancements.deep_video||0),slides:modules,practice:1,flashcards:1,simulation:1+(enhancements.exam_sim||0),plan:1}:
  kind==="exam"?{lesson:Math.min(modules,4),video:2+(enhancements.deep_video||0),slides:1,practice:1,flashcards:1,simulation:1+(enhancements.exam_sim||0),plan:1}:
  {lesson:1,video:1+(enhancements.deep_video||0),slides:1,practice:1,flashcards:1};
 const gaps=Object.entries(required).filter(([key,min])=>issued.filter(r=>r.kind===key).length<min);
 return <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
  <div className="flex flex-wrap items-center justify-between gap-2">
   <div><h3 className="font-semibold">Course preparation and delivery</h3>
    <p className="mt-1 text-xs text-ink-muted">{started?"Started "+new Date(started).toLocaleDateString():"Not yet started"} · Deadline: {due?new Date(due).toLocaleDateString():"Not set"}</p></div>
   <button type="button" onClick={()=>setOpen(!open)} className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700">
    {open?"Close":"Manage course resources →"}</button>
  </div>
  {!started&&paymentStatus==="verified"&&<button type="button" disabled={busy}
    onClick={()=>void begin()} className="mt-3 rounded-full bg-violet px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
    Confirm source materials · Start {days}-day timeline</button>}
  {open&&<>
   <p className="mt-4 text-sm text-ink-body">Store files privately, review each one, and release only complete and approved materials. Learners see released files in their order workspace.</p>
   <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
    {Object.entries(required).map(([key,count])=><p key={key} className="rounded-lg bg-mist p-3">
     {key}: <strong>{issued.filter(r=>r.kind===key).length}/{count}</strong> released</p>)}
   </div>
   {gaps.length>0&&<p className="mt-3 text-xs text-ink-muted">Incomplete release checklist: {gaps.map(([k])=>k).join(", ")}. Check the contents of each file, including the promised number of questions and flashcards.</p>}
   {paymentStatus!=="verified"?<p className="mt-3 text-sm text-ink-muted">Verify payment before uploading deliverables.</p>:
    <div className="mt-4 grid gap-3 rounded-xl bg-mist p-4 sm:grid-cols-2">
     <label className="text-sm font-semibold">Resource type
      <select className="mt-2 w-full rounded-xl border border-hairline p-3" value={kindValue}
       onChange={e=>setKindValue(e.target.value as typeof kindValue)}>
       {KINDS.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
     <label className="text-sm font-semibold">Module number
      <select className="mt-2 w-full rounded-xl border border-hairline p-3" value={moduleNumber}
       onChange={e=>setModuleNumber(e.target.value)}>
       <option value="">Whole package</option>
       {Array.from({length:modules},(_,i)=><option key={i+1} value={i+1}>Module {i+1}</option>)}</select></label>
     <label className="text-sm font-semibold sm:col-span-2">File to deliver (20MB maximum)
      <input type="file" className="mt-2 block w-full text-xs" accept=".pdf,.docx,.pptx,.zip,.mp4,.mp3,.png,.jpg,.jpeg,.txt"
       onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
     <button type="button" disabled={!file||busy} onClick={()=>void upload()}
      className="min-h-11 rounded-full bg-violet px-5 text-sm font-semibold text-white disabled:opacity-50">Upload privately →</button>
    </div>}
   <div className="mt-4 space-y-2">{records.length===0?<p className="text-sm text-ink-muted">No course files prepared yet.</p>:
    records.map(row=><div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline p-3">
      <div className="min-w-0 flex-1"><p className="break-all text-sm font-semibold">{row.name}</p>
       <p className="text-xs text-ink-muted">{row.kind} {row.moduleNumber?`· Module ${row.moduleNumber}`:""} · {row.released?"Available to learner":"Private draft"}</p></div>
      <button type="button" disabled={busy} onClick={()=>void release(row)}
       className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50">
       {row.released?"Withdraw":"Quality checked · Release"}</button>
     </div>)}</div>
   {notice&&<p role="status" className="mt-3 rounded-xl bg-lilac p-3 text-sm">{notice}</p>}
   {error&&<p role="alert" className="mt-3 rounded-xl bg-rose p-3 text-sm">{error}</p>}
  </>}
 </div>;
}

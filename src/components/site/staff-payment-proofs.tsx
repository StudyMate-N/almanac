"use client";
import { useState } from "react";
import { SUPABASE_URL } from "@/lib/config";
type Receipt={id:string;fileName:string;fileSize:number;submittedAt:string};
const ENDPOINT=`${SUPABASE_URL}/functions/v1/learning-payment-receipts`;
export function StaffPaymentProofs({orderId,staffToken}:{
 orderId:string;staffToken:string;
}){
 const [open,setOpen]=useState(false),[loading,setLoading]=useState(false);
 const [receipts,setReceipts]=useState<Receipt[]>([]);
 const [error,setError]=useState(""),[downloading,setDownloading]=useState<string|null>(null);
 async function toggle(){
  if(open){setOpen(false);return;}
  setOpen(true);setLoading(true);setError("");
  try{
   const response=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"staff_list",orderId,staffToken})});
   const result=await response.json();
   if(!response.ok||!Array.isArray(result.files))throw Error("Couldn't load receipts");
   setReceipts(result.files);
  }catch{setError("Unable to open private payment evidence.");}
  finally{setLoading(false);}
 }
 async function download(file:Receipt){
  setDownloading(file.id);setError("");
  try{
   const response=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"staff_download",orderId,staffToken,fileId:file.id})});
   if(!response.ok)throw Error("Unable to download receipt");
   const url=URL.createObjectURL(await response.blob());
   const a=document.createElement("a");a.href=url;a.download=file.fileName;
   document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),5000);
  }catch{setError("Could not download the payment evidence.");}
  finally{setDownloading(null);}
 }
 return <div className="mt-2">
  <button type="button" className="text-sm font-semibold text-violet-700 underline" onClick={()=>void toggle()}>
    {open?"Hide payment receipts":"Review payment receipts"} →
  </button>
  {open&&<div className="mt-2 rounded-xl bg-white p-3">
    {loading?<p className="text-sm">Loading…</p>:receipts.length===0?<p className="text-sm">No receipts uploaded.</p>:
      <ul className="space-y-2">{receipts.map(f=><li key={f.id} className="flex flex-wrap items-center justify-between gap-3">
        <span className="break-all text-sm">{f.fileName}</span>
        <button type="button" disabled={downloading!==null} className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50"
          onClick={()=>void download(f)}>{downloading===f.id?"Preparing…":"Download securely"}</button>
      </li>)}</ul>}
    <p className="mt-3 text-xs text-ink-muted">A receipt is a claim of payment, not bank confirmation. Verify the actual amount credited to the receiving CAD account before issuing access.</p>
    {error&&<p role="alert" className="mt-2 text-xs">{error}</p>}
  </div>}
 </div>;
}

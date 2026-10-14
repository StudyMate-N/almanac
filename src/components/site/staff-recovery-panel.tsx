"use client";
import {useState} from "react";
import {rpc} from "@/lib/api";
export function StaffRecoveryPanel({token,role,orderId,email,invoiceRef}:{
 token:string;role:string;orderId:string;email:string;invoiceRef:string;
}) {
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [result,setResult]=useState<{type:"invoice"|"access";secret:string;url?:string}|null>(null);
 async function action(type:"invoice"|"access"){
  if(busy)return;
  if(!window.confirm(type==="invoice"?
    "Reissue this private invoice link? The previous link will stop working. Use only when the customer has lost access or the link may be compromised.":
    "Reset this learner's access code? Their existing sessions and old code will stop working. Send the new code only to their verified email."))return;
  setBusy(true);setError("");setResult(null);
  try {
   if(type==="invoice"){
    const v=await rpc<{id:string;invoiceToken:string}>("learning_staff_reissue_invoice",{p_staff_token:token,p_order:orderId});
    const url=new URL("/invoice",window.location.origin);
    url.searchParams.set("id",v.id);url.searchParams.set("token",v.invoiceToken);
    setResult({type,secret:v.invoiceToken,url:url.toString()});
   }else{
    const v=await rpc<{accessCode:string}>("learning_staff_reset_access",{p_staff_token:token,p_order:orderId});
    setResult({type,secret:v.accessCode});
   }
  }catch{setError("Recovery couldn't be completed. Confirm owner access and check the recovery limit.");}
  finally{setBusy(false);}
 }
 if(role!=="owner")return null;
 const body=result?.type==="invoice"?
  `Hello,\n\nYour Almanac invoice link for ${invoiceRef} has been reissued. Your previous link no longer works.\n\nPrivate invoice: ${result.url}\n\nFor help contact support@unemployedproff.com.`:
  `Hello,\n\nYour Almanac access code for ${invoiceRef} has been reset. Your old code and signed-in sessions no longer work.\n\nNew access code: ${result?.secret}\nSign in: ${typeof window!=="undefined"?window.location.origin:""}/app/orders\n\nFor help contact support@unemployedproff.com.`;
 return <div className="mt-4 rounded-xl border border-hairline bg-white p-4">
  <p className="font-semibold">Account and invoice recovery · Owner only</p>
  <p className="mt-1 text-xs text-ink-muted">Use only after confirming the requester controls the email address on the invoice. Resetting access invalidates earlier credentials.</p>
  <div className="mt-3 flex flex-wrap gap-2">
   <button type="button" disabled={busy} onClick={()=>void action("invoice")} className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50">Reissue invoice link</button>
   <button type="button" disabled={busy} onClick={()=>void action("access")} className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50">Reset access code</button>
  </div>
  {result&&<div className="mt-3 rounded-xl bg-mist p-4">
   <p className="text-xs font-semibold">New private {result.type==="invoice"?"invoice link":"access code"} — copy before leaving</p>
   <p className="mt-2 break-all font-mono text-xs">{result.url||result.secret}</p>
   <div className="mt-3 flex flex-wrap gap-2">
    <button type="button" onClick={()=>void navigator.clipboard.writeText(result.url||result.secret)}
     className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700">Copy</button>
    <a href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Almanac account help · "+invoiceRef)}&body=${encodeURIComponent(body)}`}
      className="rounded-full bg-violet px-4 py-2 text-xs font-semibold text-white">Prepare recovery email →</a>
   </div>
  </div>}
  {error&&<p role="alert" className="mt-3 text-xs">{error}</p>}
 </div>;
}
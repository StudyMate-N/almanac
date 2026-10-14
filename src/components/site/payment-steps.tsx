"use client";

import { useEffect, useState, type FormEvent } from "react";
import { SUPABASE_URL } from "@/lib/config";

export type PaymentBank={
 name:string;address:string;institution:string;transit:string;
 accountType:string;accountNumber:string;beneficiary:string;currency:string;
};
export type PayableInvoice={
 id:string;invoiceRef:string;quoteUsd:number;payableCadCents:number|null;
 rateCadPerUsd:number|null;rateDate:string|null;quoteValidUntil:string|null;paymentStatus:string;
 subject:string;
};
const cad=(cents:number)=>new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD"}).format(cents/100);
const receiptsUrl=`${SUPABASE_URL}/functions/v1/learning-payment-receipts`;

export function PaymentSteps({invoice,bank,id,token,whatsappNumber,onRefresh}:{
 invoice:PayableInvoice;bank:PaymentBank|null;id:string;token:string;
 whatsappNumber:string|null;onRefresh:()=>Promise<void>;
}){
 const [reference,setReference]=useState("");
 const [date,setDate]=useState("");
 const [receipt,setReceipt]=useState<File|null>(null);
 const [proofs,setProofs]=useState<{id:string;fileName:string}[]>([]);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [copied,setCopied]=useState("");
 const hasQuote=invoice.payableCadCents!==null&&invoice.payableCadCents>0;
 const expired=invoice.quoteValidUntil?Date.parse(invoice.quoteValidUntil)<Date.now():false;
 const canTransfer=Boolean(bank)&&hasQuote&&!expired&&invoice.paymentStatus!=="reported"&&invoice.paymentStatus!=="verified";
 const reported=invoice.paymentStatus==="reported";
 const completed=invoice.paymentStatus==="verified";
 useEffect(()=>{
  if(!hasQuote)return;
  let cancelled=false;
  void fetch(receiptsUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   action:"list",orderId:id,invoiceToken:token
  })}).then(r=>r.json()).then(data=>{if(!cancelled&&Array.isArray(data.files))setProofs(data.files);})
  .catch(()=>{});
  return()=>{cancelled=true};
 },[id,token,payable]);

 async function copy(value:string,label:string){
  try{await navigator.clipboard.writeText(value);setCopied(label);}catch{setNotice("Copy isn't available in this browser. You can select the details below.");}
 }
 const instructions=bank&&canTransfer?[
  `Payment amount: ${cad(invoice.payableCadCents!)}`,
  `Reference: ${invoice.invoiceRef}`,
  `Beneficiary: ${bank.beneficiary}`,
  `Bank: ${bank.name}`,
  `Account number: ${bank.accountNumber}`,
  `Transit number: ${bank.transit}`,
  `Institution number: ${bank.institution}`,
  `Account type: ${bank.accountType}`,
  `Bank address: ${bank.address}`,
  `Currency: ${bank.currency}`
 ].join("\n"):"";

 const whatsText=`Hello Almanac, I need help with invoice ${invoice.invoiceRef} for ${invoice.subject}. ${invoice.payableCadCents?cad(invoice.payableCadCents):"CAD amount pending"}. ${reference?"My transfer reference is "+reference+".":""} Please help me confirm the next step.`;
 const whatsappUrl=whatsappNumber?`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsText)}`:null;

 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!hasQuote||busy||completed)return;
  if(!date){setNotice("Enter the date you sent your payment.");return;}
  if(reference.trim().length<5&&!receipt&&proofs.length===0){
   setNotice("Add a bank transaction reference or a screenshot of your payment.");return;
  }
  if(receipt&&(!["application/pdf","image/png","image/jpeg"].includes(receipt.type)
     ||receipt.size<1||receipt.size>5*1024*1024)){
    setNotice("Upload a PDF, PNG, or JPG smaller than 5 MB.");return;
  }
  setBusy(true);setNotice("");
  try{
   if(receipt){
    const form=new FormData();
    form.append("orderId",id);form.append("invoiceToken",token);form.append("file",receipt);
    const up=await fetch(receiptsUrl,{method:"POST",body:form});
    const upBody=await up.json();
    if(!up.ok)throw new Error(upBody.error||"Couldn't upload your receipt.");
    setReceipt(null);
    setProofs(current=>[...current,upBody.file]);
   }
   const response=await fetch("/api/learning-invoices/report-payment",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id,token,reference:reference.trim(),paidOn:date})
   });
   const res=await response.json();
   if(!response.ok)throw new Error(res.error||"Couldn't record your payment.");
   setNotice("We've received your payment details. Your transfer is awaiting independent bank verification.");
   await onRefresh();
  }catch(e){setNotice(e instanceof Error?e.message:"Please try again.");}
  finally{setBusy(false);}
 }

 return <section className="rounded-tile border border-hairline bg-white p-5 sm:p-8 print:hidden" aria-label="Payment steps">
  <p className="text-xs font-bold uppercase tracking-wide text-violet-700">MANUAL BANK TRANSFER</p>
  <h2 className="mt-2 font-display text-2xl font-semibold">Pay your invoice, then send us the details.</h2>
  <p className="mt-2 text-sm text-ink-body">Everything you need is here. Save your invoice, make a transfer, and report it below. We'll check the bank payment and issue your access code after verification.</p>

  {!canTransfer?<div role="status" className="mt-5 rounded-2xl bg-mist p-5">
    <h3 className="font-semibold">{completed?"Bank payment verified":reported?"Payment report received":expired?"Your seven-day bank quote has expired":"Your CAD payment amount is not ready yet"}</h3>
    <p className="mt-2 text-sm text-ink-body">
     {completed?"Your payment has been confirmed. Do not send a second transfer. Sign in using the learning access code issued by staff.":
      reported?"We have your payment report. Please do not send another transfer while staff check the receiving bank account.":
      expired?"The CAD transfer instructions have been hidden to protect you from using an outdated exchange rate. Contact support with your invoice reference to request an updated private invoice. If you already transferred before expiry, you can still report it below.":
      "This invoice doesn't yet have a fixed CAD payable amount. Please don't transfer the USD catalog price. Contact support with your invoice reference."}
    </p>
    {hasQuote&&<p className="mt-3 text-sm text-ink-muted">Recorded invoice total: {cad(invoice.payableCadCents!)} · {invoice.invoiceRef}</p>}
  </div>:<>
   <div className="mt-6 rounded-2xl bg-lilac p-5">
    <p className="text-sm font-semibold">1 · Transfer this amount in CAD</p>
    <p className="mt-2 font-display text-[34px] font-semibold">{cad(invoice.payableCadCents!)}</p>
    <p className="mt-1 text-xs text-ink-body">Fixed for invoice {invoice.invoiceRef} · USD list price: ${invoice.quoteUsd.toFixed(2)} · Pay by {invoice.quoteValidUntil?new Date(invoice.quoteValidUntil).toLocaleDateString("en-US"):"the deadline on your invoice"}</p>
    <div className="mt-3 flex flex-wrap gap-2">
     <button type="button" onClick={()=>void copy((invoice.payableCadCents!/100).toFixed(2),"amount")} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700">
       {copied==="amount"?"Amount copied ✓":"Copy CAD amount"}
     </button>
     <button type="button" onClick={()=>void copy(invoice.invoiceRef,"reference")} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-violet-700">
       {copied==="reference"?"Reference copied ✓":"Copy invoice reference"}
     </button>
    </div>
    <p className="mt-3 text-xs text-ink-muted">The invoice uses the Bank of Canada reference rate published on {invoice.rateDate||"the rate date shown"}, locked when the invoice was created. Your bank may charge transfer fees; request that the full invoiced CAD amount reaches the beneficiary.</p>
   </div>
   <div className="mt-4 rounded-2xl border border-hairline p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
     <h3 className="font-semibold">2 · Bank details</h3>
     <button type="button" onClick={()=>void copy(instructions,"all")} className="rounded-full bg-lilac px-4 py-2 text-xs font-semibold text-violet-700">
       {copied==="all"?"All details copied ✓":"Copy all bank details"}
     </button>
    </div>
    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
     {([
       ["Beneficiary",bank!.beneficiary],["Bank",bank!.name],["Account number",bank!.accountNumber],
       ["Transit number",bank!.transit],["Institution number",bank!.institution],
       ["Account type",bank!.accountType],["Bank address",bank!.address],
       ["Currency",bank!.currency],["Payment reference",invoice.invoiceRef],
     ] as const).map(([label,value])=><div key={label} className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2">
       <div className="min-w-0 flex-1"><dt className="text-xs text-ink-muted">{label}</dt>
       <dd className="break-words text-sm font-semibold">{value}</dd></div>
       <button type="button" aria-label={`Copy ${label}`} onClick={()=>void copy(value,label)} className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-violet-700">
        {copied===label?"Copied ✓":"Copy"}
       </button>
      </div>)}
    </dl>
    <p className="mt-4 text-xs text-ink-muted">The account beneficiary is {bank!.beneficiary}, receiving payments for Almanac services. If your bank requests information not shown here (such as international routing details), contact us before sending money.</p>
   </div>
  </>}
  <div className="mt-5 rounded-2xl border border-hairline p-5">
   <h3 className="font-semibold">3 · Tell us you've paid</h3>
   {completed?<p className="mt-2 text-sm text-ink-body">Your payment has been verified. Access is issued by Almanac staff using the email associated with your invoice.</p>:
    reported?<p className="mt-2 text-sm text-ink-body">Your transfer report is recorded. Staff will independently verify the bank receipt and issue access when it matches. Contact support if you need to correct a reference.</p>:
    !hasQuote?<p className="mt-2 text-sm text-ink-muted">This step opens once your CAD amount is confirmed.</p>:
    <form onSubmit={submit} className="mt-4 space-y-3">
     <p className="text-sm text-ink-body">Use a bank reference, a screenshot/receipt, or both. A screenshot is optional if you have a transfer reference. {expired?"Only report a transfer that you actually sent before this quote expired. Do not send a new transfer against the expired amount.":""}</p>
     <div className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm font-semibold">Bank transfer reference (if available)
       <input className="mt-2 w-full rounded-xl border border-hairline px-3 py-3" value={reference} maxLength={120} onChange={e=>setReference(e.target.value)} placeholder="e.g. transfer confirmation number"/>
      </label>
      <label className="block text-sm font-semibold">Date transfer was sent
       <input className="mt-2 w-full rounded-xl border border-hairline px-3 py-3" required type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      </label>
     </div>
     <label className="block text-sm font-semibold">Screenshot or PDF receipt (optional)
      <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={e=>setReceipt(e.target.files?.[0]??null)}
       className="mt-2 block w-full rounded-xl border border-hairline p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lilac file:px-3 file:py-2 file:font-semibold file:text-violet-700"/>
     </label>
     <p className="text-xs text-ink-muted">Up to 2 private receipts per invoice, maximum 5 MB each. Please redact unrelated transactions, account balances, and personal details before uploading.</p>
     {proofs.length>0&&<p className="text-xs font-semibold text-violet-700">{proofs.length} receipt file(s) already attached.</p>}
     <button type="submit" disabled={busy} className="min-h-12 rounded-full bg-violet px-6 font-semibold text-white disabled:opacity-50">
      {busy?"Sending payment details…":"Send payment details for verification →"}
     </button>
    </form>}
   {notice&&<p role="status" className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink-body">{notice}</p>}
   {invoice.paymentStatus==="reported"&&<p className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink-body">Payment reported. We are waiting for confirmation in the receiving account. Reporting a transfer does not itself verify payment.</p>}
  </div>
  <div className="mt-5 rounded-2xl bg-mist p-5">
   <h3 className="font-semibold">Need help? Choose a contact method.</h3>
   <p className="mt-2 text-sm text-ink-body">Mention invoice {invoice.invoiceRef} when contacting support. You don't need to share your private invoice link or banking credentials.</p>
   <div className="mt-4 flex flex-wrap gap-3">
    {whatsappUrl&&<a href={whatsappUrl} rel="noreferrer" target="_blank" className="inline-flex min-h-12 items-center rounded-full bg-[#186C4C] px-5 font-semibold text-white">
      Continue on WhatsApp ↗</a>}
    <a className="inline-flex min-h-12 items-center rounded-full border border-hairline bg-white px-5 font-semibold text-violet-700"
     href={`mailto:support@unemployedproff.com?subject=${encodeURIComponent("Almanac invoice "+invoice.invoiceRef)}&body=${encodeURIComponent("Hello, I need help with invoice "+invoice.invoiceRef+".")}`}>
      Email support ↗</a>
   </div>
   {whatsappUrl&&<p className="mt-3 text-xs text-ink-muted">WhatsApp opens with your invoice reference filled in. If you choose to send a receipt there, it leaves Almanac's private upload system; the secure form above is recommended.</p>}
  </div>
 </section>;
}

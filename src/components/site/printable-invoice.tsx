"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

type Invoice = {
  id:string; invoiceRef:string; name:string; email:string; subject:string;
  goal:string; kind:string; deliveryMethod:string; speed:string;
  addons:string[]; units:number; baseUsd:number; addonUsd:number;
  quoteUsd:number; turnaroundDays:number; paymentStatus:string; status:string; createdAt:string;
};
type Bank = { name:string; address:string; institution:string; transit:string;
  accountType:string; accountNumber:string; beneficiary:string; currency:string };
type Result = {invoice:Invoice;bank:Bank|null};
const money=(v:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v);
const label=(s:string)=>s.replaceAll("_"," ").replace(/\b\w/g,ch=>ch.toUpperCase());

export function PrintableInvoice({id,token}:{id:string;token:string}) {
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [reference,setReference]=useState("");
  const [paidOn,setPaidOn]=useState("");
  const [reporting,setReporting]=useState(false);
  const [message,setMessage]=useState("");

  const refresh=useCallback(async()=>{
    try {
      const response=await fetch(`/api/learning-invoices?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`,{cache:"no-store"});
      const payload=await response.json();
      if(!response.ok) throw new Error(payload.error||"Invoice unavailable.");
      setResult(payload as Result);
      setError("");
    } catch(e) {setError(e instanceof Error?e.message:"Invoice unavailable.");}
    finally {setLoading(false);}
  },[id,token]);

  useEffect(()=>{void refresh();},[refresh]);

  async function report(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReporting(true);setMessage("");
    try {
      const response=await fetch("/api/learning-invoices/report-payment", {
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id,token,reference,paidOn})
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"Unable to record payment.");
      setMessage("Transfer details received. Your payment is now awaiting verification.");
      await refresh();
    } catch(e) {setMessage(e instanceof Error?e.message:"Unable to record payment.");}
    finally {setReporting(false);}
  }

  if(loading) return <p role="status" className="rounded-card bg-white p-5">Preparing your invoice…</p>;
  if(error||!result) return <p role="alert" className="rounded-card bg-white p-5">{error||"Invoice not found."}</p>;
  const {invoice,bank}=result;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/courses" className="text-sm font-semibold text-violet-700">← Back to courses</Link>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={()=>void refresh()} className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-semibold">Refresh status</button>
          <button type="button" onClick={()=>window.print()} className="rounded-full bg-violet px-5 py-2 font-bold text-white">Print / Save PDF</button>
        </div>
      </div>
      <article className="rounded-tile bg-white p-5 sm:p-9 print:rounded-none print:p-0 print:shadow-none" aria-label="Almanac invoice">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-hairline pb-6">
          <div><p className="font-display text-3xl font-semibold">Almanac</p>
            <p className="mt-1 text-sm text-ink-muted">One place. A clearer way to learn.</p>
          </div>
          <div className="text-left sm:text-right">
            <h1 className="font-display text-2xl font-semibold">Invoice</h1>
            <p className="mt-1 font-mono text-sm">{invoice.invoiceRef}</p>
            <p className="mt-1 text-xs text-ink-muted">Issued {new Date(invoice.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div><p className="text-xs font-bold uppercase text-ink-muted">Prepared for</p>
            <p className="mt-2 font-semibold">{invoice.name}</p><p className="text-sm text-ink-body">{invoice.email}</p></div>
          <div><p className="text-xs font-bold uppercase text-ink-muted">Order summary</p>
            <p className="mt-2 font-semibold">{invoice.subject}</p>
            <p className="text-sm text-ink-body">{label(invoice.kind)} · Up to {invoice.units} learning units</p>
          </div>
        </div>
        <dl className="mt-7 space-y-3 border-t border-hairline pt-5 text-sm">
          <div className="flex justify-between gap-3"><dt>Base package</dt><dd>{money(invoice.baseUsd)}</dd></div>
          <div className="flex justify-between gap-3"><dt>Additional materials {invoice.addons.length? `(${invoice.addons.map(label).join(", ")})` : ""}</dt><dd>{money(invoice.addonUsd)}</dd></div>
          <div className="flex justify-between gap-3"><dt>Delivery: {label(invoice.speed)} ({invoice.turnaroundDays} calendar days)</dt><dd>{money(invoice.quoteUsd-invoice.baseUsd-invoice.addonUsd)}</dd></div>
          <div className="flex justify-between gap-3 border-t border-hairline pt-4 font-semibold"><dt>Amount due (USD)</dt><dd className="font-display text-2xl">{money(invoice.quoteUsd)}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-ink-muted">Delivery method: {label(invoice.deliveryMethod)}. Work begins when payment and all required materials have been received.</p>

        <section className="mt-8 rounded-card bg-mist p-5 print:border print:border-hairline print:bg-white">
          <h2 className="font-display text-xl font-semibold">Bank transfer instructions</h2>
          {bank ? <>
            <p className="mt-2 text-sm text-ink-body">Make your transfer using the details below. Add your invoice reference to the payment memo so we can identify it quickly.</p>
            <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {([
                ["Beneficiary",bank.beneficiary],["Bank",bank.name],["Bank address",bank.address],
                ["Institution number",bank.institution],["Transit number",bank.transit],
                ["Account type",bank.accountType],["Account number",bank.accountNumber],
                ["Account currency",bank.currency],["Payment reference",invoice.invoiceRef],
              ] as const).map(([key,value])=><div key={key} className="min-w-0">
                <dt className="text-xs font-medium text-ink-muted">{key}</dt><dd className="mt-1 break-words font-semibold">{value}</dd>
              </div>)}
            </dl>
            <p className="mt-4 text-xs text-ink-muted">
              Payment beneficiary: {bank.beneficiary}, for Almanac learning services.
              Cross-border transfers may require additional bank instructions from your payment provider.
            </p>
          </> : <p className="mt-3 text-sm text-ink-body">
            Bank instructions are being configured. Do not transfer funds until the verified instructions appear on this invoice.
            Contact <a className="font-semibold text-violet-700 underline" href={`mailto:help@almanac.study?subject=${encodeURIComponent(invoice.invoiceRef)}`}>Almanac support</a> with your invoice reference.
          </p>}
        </section>
        <div className="mt-6 border-t border-hairline pt-4 text-xs text-ink-muted">
          <p>Payment status: <strong>{invoice.paymentStatus==="verified"?"Verified":invoice.paymentStatus==="reported"?"Awaiting verification":"Awaiting payment"}</strong></p>
          <p className="mt-2">This is a payment invoice, not a payment receipt. Access codes are issued only after payment verification. For questions, email help@almanac.study.</p>
        </div>
      </article>
      <section className="rounded-tile bg-white p-5 sm:p-7 print:hidden">
        <h2 className="font-display text-2xl font-semibold">Already made your transfer?</h2>
        {invoice.paymentStatus==="verified" ? <p className="mt-3 text-ink-body">Your payment has been verified. Your learning access code will be provided using the contact email from your request.</p> : (
          <>
            <p className="mt-2 text-sm text-ink-body">Share the bank transaction reference and date. We will verify the transfer before issuing your learning access code.</p>
            <form onSubmit={report} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Transaction reference
                <input className="mt-2 min-h-12 w-full rounded-xl border border-hairline bg-white px-3" required minLength={5} maxLength={120} value={reference} onChange={e=>setReference(e.target.value)} placeholder="Reference from your bank" />
              </label>
              <label className="block text-sm font-semibold">Date payment was sent
                <input className="mt-2 min-h-12 w-full rounded-xl border border-hairline bg-white px-3" type="date" required value={paidOn} onChange={e=>setPaidOn(e.target.value)} />
              </label>
              <div className="sm:col-span-2">
                <button disabled={reporting} className="min-h-12 rounded-full bg-violet px-6 font-semibold text-white disabled:opacity-50">{reporting?"Submitting…":"I have sent the payment →"}</button>
              </div>
            </form>
            {message && <p role="status" className="mt-4 rounded-xl bg-mist p-3 text-sm">{message}</p>}
          </>
        )}
        <p className="mt-5 text-sm text-ink-muted">
          If the transfer reference is unavailable, you can send a receipt to <a href={`mailto:help@almanac.study?subject=${encodeURIComponent(invoice.invoiceRef+" payment")}`} className="text-violet-700 underline">help@almanac.study</a> with your invoice number.
          Please omit unnecessary bank account balances or other sensitive details.
        </p>
      </section>
      <style jsx global>{`@media print {
        @page { size: A4; margin: 14mm; }
        body { background: white !important; color: #1b1530 !important; }
        header,footer,nav { display:none !important; }
        article { break-inside:avoid; }
      }`}</style>
    </div>
  );
}

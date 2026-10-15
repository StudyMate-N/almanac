"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { SourceMaterialUploader } from "@/components/site/source-material-uploader";
import { PaymentSteps, type PaymentBank } from "@/components/site/payment-steps";
import { LearningPlanReview, type LearningPlan } from "@/components/site/learning-plan-review";
import { ENHANCEMENTS, OFFERS, PREFERENCES, type Enhancement } from "@/lib/learning-offers";

type Invoice = LearningPlan & {
  id:string; invoiceRef:string; name:string; email:string; subject:string;
  goal:string; kind:string; deliveryMethod:string; speed:string;
  addons:string[]; enhancements?: Record<string,number>; learningPreference?: string;
  units:number; baseUsd:number; addonUsd:number;
  quoteUsd:number; turnaroundDays:number; paymentStatus:string; status:string; createdAt:string;
 payableCadCents:number|null;rateCadPerUsd:number|null;rateDate:string|null;fxSource:string|null;quoteValidUntil:string|null;
};
type Result = {invoice:Invoice;bank:PaymentBank|null;whatsappNumber:string|null};
const money=(v:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v);
const label=(s:string)=>s.replaceAll("_"," ").replace(/\b\w/g,ch=>ch.toUpperCase());

export function PrintableInvoice({id,token}:{id:string;token:string}) {
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

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

  if(loading) return <p role="status" className="rounded-card bg-white p-5">Preparing your invoice…</p>;
  if(error||!result) return <p role="alert" className="rounded-card bg-white p-5">{error||"Invoice not found."}</p>;
  const {invoice,bank,whatsappNumber}=result;
  const enhanced=(Object.keys(ENHANCEMENTS) as Enhancement[]).filter(key=>(invoice.enhancements?.[key] ?? 0)>0);
  const packageName=OFFERS[invoice.kind as keyof typeof OFFERS]?.title ?? label(invoice.kind);
  const prepLabel=invoice.status==="delivered"?"Delivered":invoice.status==="review"?"Quality review":
    invoice.status==="in_production"?"In production":invoice.paymentStatus==="verified"?"Payment verified":"Awaiting payment";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/courses" className="text-sm font-semibold text-violet-700">← Back to courses</Link>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={()=>void refresh()} className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-semibold">Refresh status</button>
          <button type="button" onClick={()=>window.print()} className="rounded-full bg-violet px-5 py-2 font-bold text-white">Print / Save PDF</button>
        </div>
      </div>
      <PaymentSteps id={id} token={token} invoice={invoice} bank={bank} whatsappNumber={whatsappNumber}
        onRefresh={refresh}/>
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
            <p className="text-sm text-ink-body">{packageName} · Up to {invoice.units} learning modules</p>
          </div>
        </div>
        <dl className="mt-7 space-y-3 border-t border-hairline pt-5 text-sm">
          <div className="flex justify-between gap-3"><dt>{packageName} (core materials included)</dt><dd>{money(invoice.baseUsd)}</dd></div>
          {enhanced.map(key=><div className="flex justify-between gap-3" key={key}>
            <dt>{ENHANCEMENTS[key].title} × {invoice.enhancements?.[key] ?? 0}</dt>
            <dd>{money(ENHANCEMENTS[key].unitUsd*(invoice.enhancements?.[key] ?? 0))}</dd>
          </div>)}
          {enhanced.length===0 && invoice.addons.length>0 && <div className="flex justify-between gap-3">
            <dt>Previous-format additions ({invoice.addons.map(label).join(", ")})</dt><dd>{money(invoice.addonUsd)}</dd>
          </div>}
          <div className="flex justify-between gap-3"><dt>Delivery: {label(invoice.speed)} ({invoice.turnaroundDays} calendar days)</dt><dd>{money(invoice.quoteUsd-invoice.baseUsd-invoice.addonUsd)}</dd></div>
          <div className="flex justify-between gap-3 border-t border-hairline pt-4 font-semibold"><dt>Catalog price (USD)</dt><dd className="font-display text-2xl">{money(invoice.quoteUsd)}</dd></div>
          {invoice.payableCadCents!==null&&<div className="flex justify-between gap-3 border-t border-hairline pt-4 font-semibold">
            <dt>Total payable by bank transfer (CAD)</dt>
            <dd className="font-display text-2xl">CA${(invoice.payableCadCents/100).toFixed(2)}</dd>
          </div>}
          {invoice.quoteValidUntil&&<div className="flex flex-wrap justify-between gap-3 text-xs text-ink-muted">
            <dt>Original bank-transfer quote valid through</dt>
            <dd>{new Date(invoice.quoteValidUntil).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric"})}</dd>
          </div>}
        </dl>
        <p className="mt-3 text-xs text-ink-muted">Delivery: {label(invoice.deliveryMethod)} · Study preference: {PREFERENCES[invoice.learningPreference as keyof typeof PREFERENCES] ?? "Balanced mix"}. Work begins when payment and all required materials have been received.</p>

        <section className="mt-8 hidden rounded-card bg-mist p-5 print:block print:border print:border-hairline print:bg-white">
          <h2 className="font-display text-xl font-semibold">Bank transfer instructions</h2>
          {bank && invoice.payableCadCents!==null ? <>
            <p className="mt-2 text-sm text-ink-body">Pay the fixed CAD amount above, and include the invoice reference in your transfer memo.</p>
            <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {([
                ["Beneficiary name",bank.beneficiary],["Bank name",bank.name],
                ["Account number",bank.accountNumber],["Account type",bank.accountType],
                ["Institution number",bank.institution],["Transit number",bank.transit],
                ["Bank address",bank.address],["Account currency",bank.currency],
                ["Payment reference",invoice.invoiceRef],
              ] as const).map(([key,value])=><div key={key} className="min-w-0">
                <dt className="text-xs font-medium text-ink-muted">{key}</dt><dd className="mt-1 break-words font-semibold">{value}</dd>
              </div>)}
            </dl>
            <p className="mt-4 text-xs text-ink-muted">
              Payment beneficiary: {bank.beneficiary}, for Almanac learning services.
              Cross-border transfers may require additional bank instructions from your payment provider.
            </p>
          </> : <p className="mt-3 text-sm text-ink-body">
            Bank-transfer instructions are withheld because the original CAD quote has expired, the payment has already been reported, or the amount is not yet confirmed. Do not send a new transfer until current instructions are visible. Contact support with the invoice reference for help.
            Contact <a className="font-semibold text-violet-700 underline" href={`mailto:support@unemployedproff.com?subject=${encodeURIComponent(invoice.invoiceRef)}`}>Almanac support</a> with your invoice reference.
          </p>}
        </section>
        <div className="mt-6 border-t border-hairline pt-4 text-xs text-ink-muted">
          <p>Payment status: <strong>{invoice.paymentStatus==="verified"?"Verified":invoice.paymentStatus==="reported"?"Reported · awaiting verification":"Awaiting payment"}</strong></p>
          <p className="mt-2">Learning package status: <strong>{prepLabel}</strong>. Check this private invoice link for updates recorded by staff.</p>
          <p className="mt-2">This is a payment invoice, not a payment receipt. Access codes are issued only after payment verification. For questions, email support@unemployedproff.com.</p>
        </div>
      </article>
      {invoice.paymentStatus==="verified"&&<section className="rounded-tile border border-hairline bg-white p-5 sm:p-7 print:hidden">
        <h2 className="font-display text-2xl font-semibold">Your learning workspace is ready for access</h2>
        <p className="mt-2 text-sm text-ink-body">After payment verification, Almanac staff provide your access code by email. Sign in to view preparation milestones and resources released specifically for your order. Course files may still be in preparation.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/orders" className="inline-flex min-h-12 items-center rounded-full bg-violet px-5 font-semibold text-white">Go to your learning orders →</Link>
          <Link href={`/app/orders?claimId=${encodeURIComponent(id)}&claimToken=${encodeURIComponent(token)}`}
            className="inline-flex min-h-12 items-center rounded-full border border-hairline px-5 font-semibold text-violet-700">
            Already have an Almanac account? Link this order →
          </Link>
        </div>
      </section>}
      <SourceMaterialUploader orderId={id} invoiceToken={token}/>
      <LearningPlanReview id={id} token={token} plan={invoice} onRefresh={refresh}/>
      <style jsx global>{`@media print {
        @page { size: A4; margin: 14mm; }
        body { background: white !important; color: #1b1530 !important; }
        header,footer,nav { display:none !important; }
        article { break-inside:avoid; }
      }`}</style>
    </div>
  );
}

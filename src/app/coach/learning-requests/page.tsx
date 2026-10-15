"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { friendlyError, rpc } from "@/lib/api";
import { COACH_KEY } from "@/lib/store";
import { StaffSourceFiles } from "@/components/site/staff-source-files";
import { StaffLearningPlan } from "@/components/site/staff-learning-plan";
import { StaffPaymentProofs } from "@/components/site/staff-payment-proofs";
import { StaffDeliveryPanel } from "@/components/site/staff-delivery-panel";
import { StaffRecoveryPanel } from "@/components/site/staff-recovery-panel";
import { StaffCoursePack } from "@/components/site/staff-course-pack";
import { StaffOrderTimeline } from "@/components/site/staff-order-timeline";
import { ENHANCEMENTS, PREFERENCES, type Enhancement } from "@/lib/learning-offers";
import { parseConfirmedCadCents } from "@/lib/payment-confirmation";

type ExternalPaid = {name:string;email:string;courseId:string;verifiedExternallyAt:string;active:boolean;recordedBy:string};
type RequestRow = {
  id: string; name: string; email: string; course_id: string | null;
  subject: string; goal: string; kind: string; delivery_method: string;
  speed: string; addons: string[]; enhancements?: Record<string,number>; learning_preference?: string; unit_count: number;
  quote_usd: number; turnaround_days: number;
  status: string; payment_status: string; payment_reference: string | null;
 payment_date: string | null; invoice_ref: string; created_at: string;
 payable_cad_cents: number|null; fx_rate_date: string|null;
 quote_valid_until?:string|null;
 learning_plan_title?:string|null;learning_plan_summary?:string|null;
 learning_plan_topics?:string[];learning_plan_objectives?:string[];
 learning_plan_dates?:string[];learning_plan_status?:string;
 learning_plan_feedback?:string|null;
 production_started_at?:string|null;delivery_due_at?:string|null;delivered_at?:string|null;
};
const statuses = ["received","awaiting_payment","in_production","review","delivered","cancelled"];
export default function LearningRequestsPage() {
  const [token, setToken] = useState("");
  const [role,setRole]=useState("");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [externalPaid,setExternalPaid] = useState<ExternalPaid[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshBusy, setRefreshBusy] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [issued, setIssued] = useState<{id:string;invoiceRef:string;code:string;email:string}|null>(null);
  const [emailStatus,setEmailStatus]=useState<Record<string,"sending"|"sent"|"not_configured"|"failed">>({});
  async function deliverAccessEmail(id:string,code:string){
    if(!token)return;
    setEmailStatus(s=>({...s,[id]:"sending"}));
    try{
      const r=await fetch("/api/learning-access-email",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({orderId:id,staffToken:token,accessCode:code}),
      });
      const body=await r.json() as {configured?:boolean;sent?:boolean};
      setEmailStatus(s=>({...s,[id]:body.sent?"sent":body.configured===false?"not_configured":"failed"}));
    }catch{setEmailStatus(s=>({...s,[id]:"failed"}));}
  }


  useEffect(() => {
    let stored: { token?: string;role?: string } | null = null;
    try { stored = JSON.parse(localStorage.getItem(COACH_KEY) ?? "null"); } catch { /* no staff login */ }
    if (!stored?.token) {
      setError("Sign in to the coach console first.");
      setLoading(false);
      return;
    }
    setToken(stored.token);
    setRole(stored.role||"");
    void rpc<ExternalPaid[]>("learning_external_paid_list", { p_token: stored.token })
      .then(setExternalPaid).catch(() => {});
    rpc<RequestRow[]>("learning_requests_list", { p_token: stored.token })
      .then(data => { setRows(data); setLastUpdated(new Date()); })
      .catch(e => setError(friendlyError(e)))
      .finally(() => setLoading(false));
  }, []);

  // Refresh payment reports while the staff dashboard stays open.
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      void rpc<RequestRow[]>("learning_requests_list", { p_token: token })
        .then(data => { setRows(data); setLastUpdated(new Date()); })
        .catch(() => {}); // A transient poll failure must not hide loaded orders.
    }, 30_000);
    return () => clearInterval(interval);
  }, [token]);

  async function refreshOrders() {
    if (!token || refreshBusy) return;
    setRefreshBusy(true);
    try {
      const updated = await rpc<RequestRow[]>("learning_requests_list", { p_token: token });
      setRows(updated);
      const external = await rpc<ExternalPaid[]>("learning_external_paid_list", { p_token: token });
      setExternalPaid(external);
      setLastUpdated(new Date());
      setError("");
    } catch (e) {
      setError(friendlyError(e));
    } finally { setRefreshBusy(false); }
  }

  async function changeStatus(id: string, status: string) {
    if (!token) return;
    setEditing(id);
    setError("");
    try {
      const result = await rpc<{ id: string; status: string }>("learning_request_status_set", { p_token: token, p_id: id, p_status: status });
      setRows(rows => rows.map(r => r.id === result.id ? { ...r, status: result.status } : r));
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setEditing(null);
    }
  }

  async function verifyPayment(id:string) {
    const row=rows.find(r=>r.id===id);
    const cad=row?.payable_cad_cents ? new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD"}).format(row.payable_cad_cents/100) : "CAD amount not recorded";
    if(!token || editing || !row?.payable_cad_cents)return;
    const typed=window.prompt("Enter the CAD amount actually received in your bank account for "+row.invoice_ref+" (example: 123.45). This is not the amount on a screenshot.");
    if(typed===null)return;
    const receivedCents=parseConfirmedCadCents(typed);
    if(receivedCents===null || receivedCents!==row.payable_cad_cents){
      setError("Bank amount does not match the invoice's fixed CAD total ("+cad+"). Do not issue access; investigate any shortfall or fee.");
      return;
    }
    if(!window.confirm("I have independently verified that exactly "+cad+
      " has been credited to the receiving bank account for invoice "+row.invoice_ref+
      ". A payment screenshot alone is not sufficient. Issue the access code?"))return;
    setEditing(id);setError("");
    try {
      const result=await rpc<{paymentStatus:string;accessCode?:string;invoiceRef?:string;email?:string;alreadyVerified?:boolean}>(
        "learning_payment_verify",{p_token:token,p_id:id,p_cad_cents:row.payable_cad_cents});
      if(result.alreadyVerified || !result.accessCode || !result.invoiceRef || !result.email) {
        throw new Error("Payment was already verified. The access code cannot be displayed again; contact the owner for a reset.");
      }
      setIssued({id,invoiceRef:result.invoiceRef,code:result.accessCode,email:result.email});
      void deliverAccessEmail(id,result.accessCode);
      setRows(rows=>rows.map(row=>row.id===id?{...row,payment_status:"verified",status:"received"}:row));
    } catch(e) {setError(e instanceof Error?e.message:friendlyError(e));}
    finally {setEditing(null);}
  }

  return (
    <main className="alm-staff mx-auto max-w-[1100px] px-4 pb-24 pt-8 sm:px-6">
      {role==="owner"&&<Link href="/coach/nur635-midterm" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-violet px-5 text-sm font-bold text-white">NUR-635 Midterm · Import &amp; publish →</Link>}
      <Link href="/coach" className="text-sm font-semibold text-violet-700">← Coach console</Link>
      <h1 className="mt-4 rounded-[18px] bg-[#2A1B78] px-6 py-6 font-display text-[30px] font-bold text-white">Learning orders &amp; payments</h1>
      <p className="mt-2 text-ink-body">Review package specifications, payment reports, and production status. Payments reported by customers stay pending until your independent bank confirmation.</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-white p-4">
        <div>
          <p className="font-semibold">{rows.filter(r => r.payment_status === "reported").length} payments awaiting bank verification</p>
          <p className="mt-1 text-xs text-ink-muted">Customer payment reports appear here, not in Coach inbox or Reports. {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading orders…"}.</p>
        </div>
        <button type="button" onClick={() => void refreshOrders()} disabled={refreshBusy || !token}
          className="min-h-11 rounded-full border border-hairline bg-lilac px-5 text-sm font-bold text-violet-700 disabled:opacity-50">
          {refreshBusy ? "Refreshing…" : "Refresh payment reports"}
        </button>
      </div>
      <section className="mt-5 rounded-2xl border border-hairline bg-white p-4 sm:p-5">
        <h2 className="font-semibold">Paid outside Almanac · Enrolled learners ({externalPaid.filter(e=>e.active).length})</h2>
        <p className="mt-1 text-xs text-ink-muted">These learners have approved course access without a fabricated invoice or bank-transfer record. The enrollment is recorded separately from online orders.</p>
        {externalPaid.length===0?<p className="mt-3 text-sm text-ink-muted">No external paid enrollments recorded yet.</p>:
          <div className="mt-3 space-y-2">{externalPaid.map(e=><div key={e.email+e.courseId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-hairline px-4 py-3 text-sm">
            <div><p className="font-semibold">{e.name}</p><p className="text-xs text-ink-muted">{e.email} · {e.courseId}</p></div>
            <span className="text-xs font-bold text-violet-700">{e.active?"Approved · external paid":"Access revoked"}</span>
          </div>)}</div>}
      </section>
      {error && <p role="alert" className="mt-4 rounded-card bg-peach p-4 text-sm text-peach-ink">{error} <Link href="/coach" className="underline">Coach sign-in</Link></p>}
      {loading ? <p className="mt-8 text-ink-muted">Loading requests…</p> : rows.length === 0 ? <p className="mt-8 rounded-card bg-white p-5">No requests to display.</p> : (
        <div className="mt-6 space-y-4">
          {rows.map(r => (
            <article key={r.id} className="rounded-card border border-hairline bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">{new Date(r.created_at).toLocaleString()} · {r.invoice_ref}</p>
                  <h2 className="mt-2 font-display text-xl font-semibold">{r.subject}</h2>
                  <p className="text-sm text-ink-body">{r.kind} · {r.unit_count} modules · {r.speed} · {r.turnaround_days} days</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold">US${r.quote_usd}</p>
                  {r.payable_cad_cents!==null&&<p className="mt-1 text-xs font-bold text-violet-700">
                    CAD {(r.payable_cad_cents/100).toFixed(2)}
                  </p>}
                  <label className="mt-2 block text-xs font-semibold">Status
                    <select aria-label={`Status for ${r.subject}`} disabled={editing === r.id}
                      className="mt-1 rounded-lg border border-hairline bg-mist px-3 py-2 text-sm"
                      value={r.status} onChange={e => void changeStatus(r.id, e.target.value)}>
                      {statuses.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <StaffOrderTimeline payment={r.payment_status} plan={r.learning_plan_status} started={r.production_started_at} status={r.status}/>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-body">{r.goal}</p>
              <div className="mt-3 rounded-2xl bg-mist p-4 text-sm">
                <p><strong>Bank transfer:</strong> {r.payment_status==="verified"?"Verified":r.payment_status==="reported"?"Reported · awaiting verification":"Not yet reported"}</p>
                {r.payment_reference && <p className="mt-1">Reference: {r.payment_reference}</p>}
                {r.payment_date && <p className="mt-1">Reported transfer date: {r.payment_date}</p>}
                <StaffPaymentProofs orderId={r.id} staffToken={token}/>
                {r.payment_status==="reported" && <button disabled={editing===r.id}
                  type="button" onClick={()=>void verifyPayment(r.id)}
                  className="mt-3 min-h-11 rounded-full bg-violet px-4 font-semibold text-white disabled:opacity-50">
                  Verified in bank · Issue access code →
                </button>}
                {r.payment_status==="verified" && <p className="mt-2 text-xs text-ink-muted">Access code was issued once. It is not stored in plaintext.</p>}
                {issued?.id===r.id && <div className="mt-3 rounded-xl border border-hairline bg-white p-4">
                  <p className="font-semibold">New access code — copy before leaving</p>
                  <p className="mt-1 break-all font-mono text-lg">{issued.code}</p>
                  <p className="mt-2 text-xs text-ink-muted">
                    This code is shown once. Automatic delivery is attempted to {issued.email}; if unavailable, use the manual email link below.
                  </p>
                  {emailStatus[r.id]==="sending"&&<p role="status" className="mt-2 rounded-xl bg-lilac p-3 text-xs text-violet-700">Sending secure access email…</p>}
                  {emailStatus[r.id]==="sent"&&<p role="status" className="mt-2 rounded-xl bg-mint p-3 text-xs font-semibold text-mint-ink">✓ Access email delivered to the email provider.</p>}
                  {emailStatus[r.id]==="not_configured"&&<p role="status" className="mt-2 rounded-xl bg-[#FFF4EC] p-3 text-xs text-[#9D3E0E]">Automatic email is not configured. Please send this code manually.</p>}
                  {emailStatus[r.id]==="failed"&&<p role="status" className="mt-2 rounded-xl bg-[#FFF4EC] p-3 text-xs text-[#9D3E0E]">Email could not be sent. Use the manual email link, or retry.</p>}
                  {emailStatus[r.id]!=="sending"&&emailStatus[r.id]!=="sent"&&emailStatus[r.id]!=="not_configured"&&
                   <button type="button" onClick={()=>void deliverAccessEmail(r.id,issued.code)}
                    className="mt-3 rounded-full border border-hairline px-3 py-2 text-xs font-bold text-violet-700">
                    Retry automatic email →
                   </button>}
                  <a className="mt-3 inline-flex font-semibold text-violet-700 underline"
                    href={`mailto:${encodeURIComponent(issued.email)}?subject=${encodeURIComponent("Almanac access code · "+issued.invoiceRef)}&body=${encodeURIComponent("Your payment has been verified for "+issued.invoiceRef+".\n\nYour Almanac learning access code is: "+issued.code+"\n\nSign in: "+window.location.origin+"/app\n\nYour materials are being prepared. We will update you when they are ready.")}`}>
                    Prepare access email →
                  </a>
                </div>}
              </div>
              <div className="mt-4 grid gap-2 border-t border-hairline pt-3 text-sm text-ink-body sm:grid-cols-2">
                <span>Requested by: <strong>{r.name}</strong></span>
                <a className="font-semibold text-violet-700 underline" href={`mailto:${r.email}`}>{r.email}</a>
                <span>Delivery: {r.delivery_method}</span>
                <span>Extras: {(Object.keys(ENHANCEMENTS) as Enhancement[])
                  .filter(key=>(r.enhancements?.[key] ?? 0)>0)
                  .map(key=>`${ENHANCEMENTS[key].title} × ${r.enhancements?.[key]}`).join(", ")
                  || (r.addons.length?r.addons.join(", "):"Core package only")}</span>
                <span>Study preference: {PREFERENCES[r.learning_preference as keyof typeof PREFERENCES] ?? "Balanced"}</span>
                <div className="sm:col-span-2"><StaffSourceFiles orderId={r.id} staffToken={token}/></div>
              </div>
              <StaffLearningPlan id={r.id} token={token} plan={r}/>
              <StaffDeliveryPanel orderId={r.id} token={token} paymentStatus={r.payment_status}
                days={r.turnaround_days} startedAt={r.production_started_at||null}
                dueAt={r.delivery_due_at||null} kind={r.kind} modules={r.unit_count} enhancements={r.enhancements}/>
              <StaffCoursePack orderId={r.id} token={token} modules={r.unit_count}
                kind={r.kind} paymentStatus={r.payment_status} startedAt={r.production_started_at||null}/>
              <StaffRecoveryPanel orderId={r.id} token={token} role={role} invoiceRef={r.invoice_ref}
                email={r.email} quoteValidUntil={r.quote_valid_until} paymentStatus={r.payment_status}/>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

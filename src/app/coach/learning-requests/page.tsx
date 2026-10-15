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
import { StaffShell } from "@/components/staff-shell";
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
  const [label,setLabel]=useState("");
  const [filter,setFilter]=useState<"all"|"payments"|"plans"|"building"|"released">("all");
  const [sel,setSel]=useState<string|null>(null);
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
    let stored: { token?: string;role?: string;label?: string } | null = null;
    try { stored = JSON.parse(localStorage.getItem(COACH_KEY) ?? "null"); } catch { /* no staff login */ }
    if (!stored?.token) {
      setError("Sign in to the coach console first.");
      setLoading(false);
      return;
    }
    setToken(stored.token);
    setRole(stored.role||"");
    setLabel(stored.label||"");
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

  const chip=(r:RequestRow)=>r.status==="delivered"?["Released","bg-mint text-correct"]:
    r.status==="cancelled"?["Cancelled","bg-rose text-rose-ink"]:
    r.status==="review"?["Nurse review","bg-[#FFE9DC] text-[#A8430A]"]:
    r.status==="in_production"?["Being built","bg-lilac text-violet-deep"]:
    r.payment_status==="reported"?["Payment reported","bg-[#FFE9DC] text-[#A8430A]"]:
    (r.learning_plan_status==="shared"||r.learning_plan_status==="revision_requested")&&r.payment_status==="verified"?["Plan review","bg-lilac text-violet-deep"]:
    r.payment_status==="verified"?["Paid","bg-mint text-correct"]:["Awaiting payment","bg-mist text-ink-muted"];
  const groups={
    all:(_:RequestRow)=>true,
    payments:(r:RequestRow)=>r.payment_status==="reported",
    plans:(r:RequestRow)=>(r.learning_plan_status==="shared"||r.learning_plan_status==="revision_requested")&&r.status!=="delivered",
    building:(r:RequestRow)=>r.status==="in_production"||r.status==="review",
    released:(r:RequestRow)=>r.status==="delivered",
  } as const;
  const shown=rows.filter(groups[filter]);
  const current=rows.find(r=>r.id===sel)??shown[0];
  const waited=(iso:string)=>{const m=(Date.now()-new Date(iso).getTime())/60000;return m<60?`${Math.round(m)} min`:m<2880?`${Math.round(m/60)} h`:`${Math.round(m/1440)} d`;};
  const reported=rows.filter(r=>r.payment_status==="reported").length;
  const nav=[
    {key:"today",label:"Today",href:"/coach"},
    {key:"requests",label:"Learning requests",badge:reported,active:true,href:"/coach/learning-requests"},
    {key:"review",label:"Content review",href:"/coach?tab=review"},
    {key:"inbox",label:"Learner questions",href:"/coach?tab=inbox"},
    {key:"reports",label:"Reports",href:"/coach?tab=reports"},
    {key:"students",label:"Learners",href:"/coach?tab=students"},
    {key:"signups",label:"Sign-ups",href:"/coach?tab=signups"},
    ...(role==="owner"?[{key:"nur635",label:"NUR-635 midterm",href:"/coach/nur635-midterm"}]:[]),
  ];
  return (
    <StaffShell items={nav} user={label||"Staff"} role={role}>
    <div className="alm-staff grid min-h-dvh lg:grid-cols-[400px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-[#EEEBF7] bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-r">
        <div className="flex flex-col gap-3 px-5 pt-6 pb-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-display text-[26px] leading-tight font-bold tracking-[-.03em]">Learning requests</h1>
            <button type="button" onClick={() => void refreshOrders()} disabled={refreshBusy || !token} className="h-9 rounded-[10px] border border-hairline px-3 text-[12.5px] font-bold text-violet-700 hover:bg-mist disabled:opacity-50">
              {refreshBusy ? "Refreshing…" : "Refresh"}
            </button>
          </div>
          <p className="text-[12px] text-ink-muted">{reported} payment{reported===1?"":"s"} awaiting bank verification · {lastUpdated ? `updated ${lastUpdated.toLocaleTimeString()}` : "loading…"}</p>
          <div className="flex flex-wrap gap-1.5">
            {([["all","All"],["payments","Payments"],["plans","Plans"],["building","Building"],["released","Released"]] as const).map(([k,l])=>{
              const n=rows.filter(groups[k]).length;
              return <button key={k} type="button" onClick={()=>{setFilter(k);setSel(null);}} aria-pressed={filter===k}
                className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-bold ${filter===k?"bg-violet text-white":"border border-hairline text-ink-body hover:bg-mist"}`}>{l}<span className={filter===k?"text-white/80":"text-ink-muted"}>{n}</span></button>;
            })}
          </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto border-t border-[#EEEBF7]">
          {loading?<li className="p-5 text-[13.5px] text-ink-muted">Loading requests…</li>:shown.length===0?<li className="p-5 text-[13.5px] text-ink-muted">No requests here.</li>:
          shown.map(r=>{const [cl,cc]=chip(r);const on=current?.id===r.id;return <li key={r.id}>
            <button type="button" onClick={()=>setSel(r.id)} aria-current={on?"true":undefined}
              className={`flex w-full flex-col gap-1 border-b border-l-[3px] border-b-[#EEEBF7] px-5 py-3.5 text-left ${on?"border-l-violet bg-[#F6F4FB]":"border-l-transparent hover:bg-[#FBFAFE]"}`}>
              <span className="flex items-center justify-between gap-2"><span className="font-mono text-[12px] text-ink-muted">{r.invoice_ref}</span>
                {r.status!=="delivered"&&r.status!=="cancelled"&&<span className={`text-[12px] font-bold ${r.payment_status==="reported"?"text-[#A8430A]":"text-ink-muted"}`}>Waiting {waited(r.created_at)}</span>}</span>
              <span className="truncate text-[14.5px] font-bold">{r.name} · {r.subject}</span>
              <span className="flex items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-[11.5px] font-bold ${cc}`}>{cl}</span><span className="truncate text-[12px] text-ink-muted">{r.kind} · {r.speed}</span></span>
            </button>
          </li>;})}
        </ul>
        <details className="border-t border-[#EEEBF7] px-5 py-3.5 text-sm">
          <summary className="cursor-pointer text-[13px] font-bold text-violet-700">Paid outside Almanac · {externalPaid.filter(e=>e.active).length} enrolled</summary>
          <p className="mt-2 text-xs text-ink-muted">These learners have approved course access without a fabricated invoice or bank-transfer record. The enrollment is recorded separately from online orders.</p>
          {externalPaid.length===0?<p className="mt-2 text-xs text-ink-muted">No external paid enrollments recorded yet.</p>:
            <div className="mt-2 space-y-1.5">{externalPaid.map(e=><div key={e.email+e.courseId} className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-hairline px-3 py-2 text-xs">
              <div><p className="font-semibold">{e.name}</p><p className="text-ink-muted">{e.email} · {e.courseId}</p></div>
              <span className="font-bold text-violet-700">{e.active?"Approved · external paid":"Access revoked"}</span>
            </div>)}</div>}
        </details>
      </aside>
      <section className="min-w-0 px-4 py-6 sm:px-8">
        {error && <p role="alert" className="mb-4 rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] p-4 text-sm text-[#A8430A]">{error} <Link href="/coach" className="underline">Coach sign-in</Link></p>}
        <p className="mb-4 text-[12.5px] text-ink-muted">Payments reported by customers stay pending until your independent bank confirmation. Customer payment reports appear here, not in Learner questions or Reports.</p>
        {!loading&&rows.length===0?<p className="rounded-[16px] border border-hairline bg-white p-5">No requests to display.</p>:
        current?[current].map(r => (
            <article key={r.id} className="rounded-[16px] border border-hairline bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[12.5px] text-ink-muted">{r.invoice_ref} · {r.kind} · {r.speed}</p>
                  <h2 className="mt-1 font-display text-[24px] leading-tight font-bold tracking-[-.03em] sm:text-[28px]">{r.name} · {r.subject}</h2>
                  <p className="text-[13px] text-ink-muted">Requested {new Date(r.created_at).toLocaleString()}</p>
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
              <div className="mt-3 rounded-[14px] bg-[#FFF4EC] p-4 text-sm">
                <p><strong>Bank transfer:</strong> {r.payment_status==="verified"?"Verified":r.payment_status==="reported"?"Reported · awaiting verification":"Not yet reported"}</p>
                {r.payment_reference && <p className="mt-1">Reference: {r.payment_reference}</p>}
                {r.payment_date && <p className="mt-1">Reported transfer date: {r.payment_date}</p>}
                <StaffPaymentProofs orderId={r.id} staffToken={token}/>
                {r.payment_status==="reported" && <button disabled={editing===r.id}
                  type="button" onClick={()=>void verifyPayment(r.id)}
                  className="mt-3 h-11 rounded-[12px] bg-violet px-4 font-bold text-white hover:bg-[#4A2DE6] disabled:opacity-50">
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
        )):null}
      </section>
    </div>
    </StaffShell>
  );
}

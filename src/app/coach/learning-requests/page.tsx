"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { friendlyError, rpc } from "@/lib/api";
import { COACH_KEY } from "@/lib/store";

type RequestRow = {
  id: string; name: string; email: string; course_id: string | null;
  subject: string; goal: string; kind: string; delivery_method: string;
  speed: string; addons: string[]; unit_count: number;
  quote_usd: number; turnaround_days: number;
  status: string; payment_status: string; payment_reference: string | null; payment_date: string | null; invoice_ref: string; created_at: string;
};
const statuses = ["received","awaiting_payment","in_production","review","delivered","cancelled"];
export default function LearningRequestsPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [issued, setIssued] = useState<{id:string;invoiceRef:string;code:string;email:string}|null>(null);

  useEffect(() => {
    let stored: { token?: string } | null = null;
    try { stored = JSON.parse(localStorage.getItem(COACH_KEY) ?? "null"); } catch { /* no staff login */ }
    if (!stored?.token) {
      setError("Sign in to the coach console first.");
      setLoading(false);
      return;
    }
    setToken(stored.token);
    rpc<RequestRow[]>("learning_requests_list", { p_token: stored.token })
      .then(setRows)
      .catch(e => setError(friendlyError(e)))
      .finally(() => setLoading(false));
  }, []);

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
    if(!token || editing || !window.confirm("Have you independently verified this transfer in the bank account? This will create a student access code.")) return;
    setEditing(id);setError("");
    try {
      const result=await rpc<{paymentStatus:string;accessCode?:string;invoiceRef?:string;email?:string;alreadyVerified?:boolean}>(
        "learning_payment_verify",{p_token:token,p_id:id});
      if(result.alreadyVerified || !result.accessCode || !result.invoiceRef || !result.email) {
        throw new Error("Payment was already verified. The access code cannot be displayed again; contact the owner for a reset.");
      }
      setIssued({id,invoiceRef:result.invoiceRef,code:result.accessCode,email:result.email});
      setRows(rows=>rows.map(row=>row.id===id?{...row,payment_status:"verified",status:"in_production"}:row));
    } catch(e) {setError(e instanceof Error?e.message:friendlyError(e));}
    finally {setEditing(null);}
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-8 sm:px-6">
      <Link href="/coach" className="text-sm font-semibold text-violet-700">← Coach console</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold">Learning requests</h1>
      <p className="mt-2 text-ink-body">Review package specifications, contact information, price and production status.</p>
      {error && <p role="alert" className="mt-4 rounded-card bg-peach p-4 text-sm text-peach-ink">{error} <Link href="/coach" className="underline">Coach sign-in</Link></p>}
      {loading ? <p className="mt-8 text-ink-muted">Loading requests…</p> : rows.length === 0 ? <p className="mt-8 rounded-card bg-white p-5">No requests to display.</p> : (
        <div className="mt-6 space-y-4">
          {rows.map(r => (
            <article key={r.id} className="rounded-card border border-hairline bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">{new Date(r.created_at).toLocaleString()} · {r.invoice_ref}</p>
                  <h2 className="mt-2 font-display text-xl font-semibold">{r.subject}</h2>
                  <p className="text-sm text-ink-body">{r.kind} · {r.unit_count} units · {r.speed} · {r.turnaround_days} days</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl font-semibold">${r.quote_usd}</p>
                  <label className="mt-2 block text-xs font-semibold">Status
                    <select aria-label={`Status for ${r.subject}`} disabled={editing === r.id}
                      className="mt-1 rounded-lg border border-hairline bg-mist px-3 py-2 text-sm"
                      value={r.status} onChange={e => void changeStatus(r.id, e.target.value)}>
                      {statuses.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                    </select>
                  </label>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-body">{r.goal}</p>
              <div className="mt-3 rounded-2xl bg-mist p-4 text-sm">
                <p><strong>Bank transfer:</strong> {r.payment_status==="verified"?"Verified":r.payment_status==="reported"?"Reported · awaiting verification":"Not yet reported"}</p>
                {r.payment_reference && <p className="mt-1">Reference: {r.payment_reference}</p>}
                {r.payment_date && <p className="mt-1">Reported transfer date: {r.payment_date}</p>}
                {r.payment_status==="reported" && <button disabled={editing===r.id}
                  type="button" onClick={()=>void verifyPayment(r.id)}
                  className="mt-3 min-h-11 rounded-full bg-violet px-4 font-semibold text-white disabled:opacity-50">
                  Verified in bank · Issue access code →
                </button>}
                {r.payment_status==="verified" && <p className="mt-2 text-xs text-ink-muted">Access code was issued once. It is not stored in plaintext.</p>}
                {issued?.id===r.id && <div className="mt-3 rounded-xl border border-hairline bg-white p-4">
                  <p className="font-semibold">New access code — copy before leaving</p>
                  <p className="mt-1 break-all font-mono text-lg">{issued.code}</p>
                  <p className="mt-2 text-xs text-ink-muted">Send this code to the learner using the verified email address. It will not be shown again.</p>
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
                <span>Additions: {r.addons.length ? r.addons.join(", ") : "Core package"}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/brand";
import { cardById, courseOfModule, type ImageItem, lessonById, moduleById, questionById, reviewables } from "@/content/course";
import { pageText } from "@/lib/page-text";
import { ApiError, friendlyError, rpc } from "@/lib/api";
import { contentHash } from "@/lib/hash";
import { COACH_KEY } from "@/lib/store";
import { StaffShell } from "@/components/staff-shell";

type Admin = { token: string; label: string; role: "owner" | "coach" | "reviewer" };
type CoachReq = { id: number; student: string; label: string; lessonId: string | null; question: string; aiAnswer: string | null; status: string; reply: string | null; repliedBy: string | null; createdAt: string };
type Report = { id: number; student: string; itemId: string; itemType: string; message: string; createdAt: string };
type Student = { label: string; name: string | null; lastSeenAt: string | null; answers: number; correct: number };
type Inbox = { coach: CoachReq[]; reports: Report[]; students: Student[] };
type Signup = { email: string; courseId: string; kind: string; createdAt: string };
type Review = { hash: string; status: "approved" | "changes"; note: string | null; reviewer: string; at: string };

const load = (): Admin | null => {
  try {
    return JSON.parse(localStorage.getItem(COACH_KEY) ?? "null");
  } catch {
    return null;
  }
};

function SignIn({ onDone }: { onDone: (a: Admin) => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <form
      className="mx-auto mt-16 flex max-w-[400px] flex-col gap-4 rounded-[20px] border border-hairline bg-white p-7 shadow-[0_18px_40px_rgba(42,27,120,.08)]"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const a = await rpc<Admin>("admin_sign_in", { p_code: code });
          localStorage.setItem(COACH_KEY, JSON.stringify(a));
          onDone(a);
        } catch (x) {
          setErr(x instanceof ApiError && x.unauthorized ? "That code didn't work." : friendlyError(x));
        }
      }}
    >
      <span className="flex items-center gap-2"><Logo /><span className="rounded-[6px] bg-violet-deep px-1.5 py-0.5 text-[10.5px] font-extrabold tracking-[.12em] text-white">COACH</span></span>
      <h1 className="font-display text-[26px] leading-tight font-bold tracking-[-.03em]">Coach and reviewer sign-in</h1>
      <label className="flex flex-col gap-1.5 text-[13.5px] font-bold">
        Staff code
        <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" className="h-12 rounded-[12px] border border-[#D9D2F3] px-4 font-mono outline-none focus:border-violet focus:ring-2 focus:ring-violet/15" />
      </label>
      <button className="h-12 rounded-[12px] bg-violet font-bold text-white hover:bg-[#4A2DE6]">Sign in</button>
      <p aria-live="polite" className="text-sm text-incorrect">
        {err}
      </p>
    </form>
  );
}

/** A readable view of an item for the reviewer. */
function ItemView({ kind, id, item }: { kind: string; id: string; item: unknown }) {
  if (kind === "page") {
    const p = lessonById(id);
    return p ? <div className="max-h-[60vh] overflow-auto rounded-xl bg-mist p-4 text-sm whitespace-pre-wrap">{pageText(p, 40000)}</div> : null;
  }
  if (kind === "question") {
    const q = questionById(id);
    if (!q) return null;
    return (
      <div className="rounded-xl bg-mist p-4 text-sm">
        <p className="mb-1 text-xs font-bold text-ink-muted uppercase">
          {q.type === "multiple" ? "Select all that apply" : "One best answer"} · {q.level} · {q.topic}
        </p>
        {q.stem && <p className="mb-1">{q.stem}</p>}
        <p className="mb-2 font-bold">{q.ask}</p>
        <ul className="flex flex-col gap-2">
          {q.options.map((o) => (
            <li key={o.id}>
              <span className={`font-semibold ${q.correct.includes(o.id) ? "text-mint-ink" : ""}`}>
                {q.correct.includes(o.id) ? "✓ " : "○ "}
                {o.text}
              </span>
              <span className="block pl-4 text-ink-body">{o.rationale}</span>
            </li>
          ))}
        </ul>
        {q.takeaway && <p className="mt-2"><span className="font-bold">Takeaway:</span> {q.takeaway}</p>}
        <p className="mt-2 text-xs text-ink-muted">Source: {q.source}</p>
      </div>
    );
  }
  if (kind === "card") {
    const c = cardById(id);
    if (!c) return null;
    return (
      <div className="rounded-xl bg-mist p-4 text-sm">
        <p className="text-xs font-bold text-violet-700">{c.topic}</p>
        <p className="font-bold">{c.front}</p>
        <p>{c.back}</p>
        {c.detail && <p className="text-ink-muted">{c.detail}</p>}
        <p className="mt-2 text-xs text-ink-muted">Source: {c.source}</p>
      </div>
    );
  }
  if (kind === "image") {
    const im = item as ImageItem;
    return (
      <div className="rounded-xl bg-mist p-4 text-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/patho/${im.id}.png`} alt={im.alt} className="w-full rounded-lg bg-white" />
        <div className="mt-2 grid gap-2 text-center" style={{ gridTemplateColumns: `repeat(${im.panels.length}, minmax(0, 1fr))` }}>
          {im.panels.map((p) => (
            <span key={p.label}>
              <span className="block font-bold">{p.label}</span>
              {p.sub && <span className="block text-ink-muted">{p.sub}</span>}
            </span>
          ))}
        </div>
        <p className="mt-3">
          <span className="font-bold">Alt text:</span> {im.alt}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          File {im.id}.png · {im.bytes === null ? "missing" : `${Math.round(im.bytes / 1024)} KB`}. Labels are page text, so check them against the picture. Students see wide (3:1) images with the empty strip at the bottom cropped off.
        </p>
      </div>
    );
  }
  return <pre className="max-h-[60vh] overflow-auto rounded-xl bg-mist p-3 text-xs whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>;
}

/**
 * Preview builds share the production database. Approving (or requesting changes on)
 * an item that already has a review would replace the live approval and hide that
 * item from students, so on a preview only never-reviewed items can be acted on.
 */
function usePreviewBuild() {
  const [preview, setPreview] = useState(false);
  useEffect(() => setPreview(process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || window.location.hostname.includes("-git-")), []);
  return preview;
}

function ReviewTab({ admin }: { admin: Admin }) {
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [filter, setFilter] = useState<"pending" | "changes" | "approved">("pending");
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [bulk, setBulk] = useState("");
  const [section, setSection] = useState("all");
  const items = useMemo(() => reviewables.map((r) => ({ ...r, hash: contentHash(r.item) })), []);
  const [loaded, setLoaded] = useState(false);
  const refresh = useCallback(
    () =>
      rpc<Record<string, Review>>("review_list", { p_token: admin.token }).then((r) => {
        setReviews(r);
        setLoaded(true);
      }),
    [admin.token],
  );
  useEffect(() => void refresh(), [refresh]);
  const statusOf = (id: string, hash: string) => {
    const r = reviews[id];
    if (!r || r.hash !== hash) return r?.status === "approved" ? "pending" : (r?.status ?? "pending");
    return r.status;
  };
  const sections = [...new Map(items.map((i) => [i.moduleId, moduleById(i.moduleId)?.title ?? i.moduleId])).entries()];
  const shown = items.filter((i) => statusOf(i.id, i.hash) === filter && (section === "all" || i.moduleId === section));
  const counts = { pending: 0, changes: 0, approved: 0 } as Record<string, number>;
  items.forEach((i) => counts[statusOf(i.id, i.hash)]++);
  const canReview = admin.role === "reviewer";
  const previewBuild = usePreviewBuild();
  // On a preview, an item with any existing review is live (or was) in another version.
  const lockedHere = (id: string) => previewBuild && (!loaded || Boolean(reviews[id]));
  const pendingItems = items.filter((i) => statusOf(i.id, i.hash) === "pending");
  const lockedPending = pendingItems.filter((i) => lockedHere(i.id)).length;
  const newPending = pendingItems.length - lockedPending;
  const bulkCount = previewBuild ? newPending : counts.pending;

  const set = async (id: string, hash: string, status: "approved" | "changes") => {
    await rpc("review_set", { p_token: admin.token, p_item_id: id, p_hash: hash, p_status: status, p_note: note || null });
    setNote("");
    setOpen(null);
    await refresh();
  };

  const approveAll = async () => {
    const pending = items.filter((i) => statusOf(i.id, i.hash) === "pending" && !lockedHere(i.id));
    if (!pending.length || !window.confirm(`Approve all ${pending.length} ${previewBuild ? "new " : ""}pending items as reviewed? Each one goes live to students in this exact version.`)) return;
    let n = 0;
    for (const i of pending) {
      await rpc("review_set", { p_token: admin.token, p_item_id: i.id, p_hash: i.hash, p_status: "approved", p_note: null });
      setBulk(`Approving… ${++n} of ${pending.length}`);
    }
    setBulk(`Approved ${n} items.`);
    await refresh();
  };

  return (
    <div>
      {previewBuild && loaded && (
        <div className="mb-4 rounded-2xl bg-peach p-4 text-sm text-peach-ink">
          <p className="font-bold">This is a preview of the next version.</p>
          <p>
            You can approve items that are new in this version ({newPending} waiting). Items already on the live site ({lockedPending} with changes here) can only be approved after this version is published, so students keep seeing them in the meantime.
          </p>
        </div>
      )}
      {canReview && loaded && bulkCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-mint p-4 text-mint-ink">
          <p className="flex-1 text-sm font-semibold">
            Reviewed everything in the queue? Approve all {bulkCount} {previewBuild ? "new " : ""}pending items at once. Items with changes requested stay as they are.
          </p>
          <button onClick={approveAll} className="rounded-full bg-correct px-5 py-2 font-bold text-white">
            {previewBuild ? "Approve all new items" : "Approve all pending"}
          </button>
        </div>
      )}
      {bulk && <p aria-live="polite" className="mb-3 text-sm font-semibold">{bulk}</p>}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["pending", "changes", "approved"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${filter === f ? "bg-violet text-white" : "bg-white"}`}>
            {f === "changes" ? "Changes requested" : f} ({counts[f]})
          </button>
        ))}
      </div>
      <label className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold">
        Section
        <select value={section} onChange={(e) => setSection(e.target.value)} className="min-h-10 rounded-full border-2 border-hairline bg-white px-3">
          <option value="all">All sections</option>
          {sections.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
        <span className="text-ink-muted">{shown.length} items</span>
      </label>
      {!canReview && <p className="mb-3 text-sm text-ink-muted">Only the nurse reviewer can approve. You can read the queue.</p>}
      <ul className="flex flex-col gap-2">
        {shown.map((i) => (
          <li key={i.id} className="rounded-2xl bg-white p-4">
            <button className="flex w-full flex-wrap justify-between gap-2 text-left" onClick={() => setOpen(open === i.id ? null : i.id)} aria-expanded={open === i.id}>
              <span className="font-semibold">
                <span className="mr-2 rounded-full bg-mist px-2 py-0.5 text-xs uppercase">{i.kind}</span>
                {i.id} · {courseOfModule(i.moduleId)?.title} · {(i.lessonId && lessonById(i.lessonId)?.shortTitle) || moduleById(i.moduleId)?.title}
              </span>
              {reviews[i.id]?.note && <span className="text-xs text-peach-ink">Note: {reviews[i.id].note}</span>}
            </button>
            {open === i.id && (
              <div className="mt-3 flex flex-col gap-3">
                <ItemView kind={i.kind} id={i.id} item={i.item} />
                {(i.kind === "page" || i.kind === "question" || i.kind === "image") && i.lessonId && (
                  <a className="text-sm font-bold text-violet-600" href={`/app/learn/${i.lessonId}`} target="_blank">
                    Open as a student sees it (preview)
                  </a>
                )}
                {canReview && lockedHere(i.id) && (
                  <p className="rounded-xl bg-peach p-3 text-sm text-peach-ink">
                    This item is on the live site in another version. Approve it after this version is published; approving here would hide it from students until then.
                  </p>
                )}
                {canReview && !lockedHere(i.id) && (
                  <>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (required for changes)" rows={2} className="rounded-xl border-2 border-hairline p-2" />
                    <div className="flex gap-2">
                      <button onClick={() => set(i.id, i.hash, "approved")} className="rounded-full bg-correct px-5 py-2 font-bold text-white">
                        Approve this version
                      </button>
                      <button disabled={!note.trim()} onClick={() => set(i.id, i.hash, "changes")} className="rounded-full bg-peach px-5 py-2 font-bold text-peach-ink disabled:opacity-50">
                        Request changes
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
        {shown.length === 0 && <li className="text-ink-muted">Nothing here.</li>}
      </ul>
    </div>
  );
}

export default function CoachConsole() {
  const [admin, setAdmin] = useState<Admin | null | undefined>(undefined);
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [tab, setTab] = useState<"today" | "inbox" | "reports" | "review" | "students" | "signups">("today");
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [err, setErr] = useState("");
  const [emailTestBusy,setEmailTestBusy]=useState(false);
  const [emailTestResult,setEmailTestResult]=useState("");
  const [pendingPaymentCount,setPendingPaymentCount]=useState<number|null>(null);

  const runEmailTest=async()=>{
    if(!admin||admin.role!=="owner"||emailTestBusy)return;
    setEmailTestBusy(true);
    setEmailTestResult("");
    try{
      const response=await fetch("/api/internal/email-check",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({staffToken:admin.token})
      });
      const result=await response.json() as {
        sent?:boolean;configured?:boolean;error?:string;missing?:string[];
        providerStatus?:number|null;reason?:string|null
      };
      setEmailTestResult(result.sent
        ?"Resend accepted the email from Almanac. Check the destination inbox and provider delivery status."
        :response.status===403
        ?result.reason==="session_expired"
          ?"Your Owner session is invalid or expired. Sign out, then sign back in using your latest Owner code."
          :result.reason==="origin_mismatch"
          ?"Almanac detected an unexpected request origin. Refresh the current almanac-study.netlify.app page and try again."
          :result.reason==="owner_required"
          ?"This action needs an active Owner session. Sign in to the Owner account and try again."
          :`Email check was blocked before sending (HTTP 403: ${result.reason||"authorization_error"}).`
        :result.configured===false
        ?`Almanac could not detect: ${result.missing?.join(", ")||"required mail settings"}. Check these settings in Netlify, then redeploy.`
        :result.providerStatus
        ?`Resend rejected the request: HTTP ${result.providerStatus} (${result.reason||"unknown"}). Please share this status and error category, not any credentials.`
        :`Almanac could not reach Resend: ${result.reason||result.error||"unknown"}. Check the network/runtime connection.`);
    }catch{setEmailTestResult("The email check could not reach Almanac. Retry when the server is available.");}
    finally{setEmailTestBusy(false);}
  };

  useEffect(() => setAdmin(load()), []);
  useEffect(() => {
    if (!admin) return;
    const q = new URLSearchParams(window.location.search).get("tab");
    const ok = ["today", "inbox", "reports", "review", "students", "signups"] as const;
    const pick = ok.find((k) => k === q);
    setTab(admin.role === "reviewer" ? "review" : (pick ?? "today"));
  }, [admin]);
  const refresh = useCallback(() => {
    if (!admin) return;
    rpc<Inbox>("admin_inbox", { p_token: admin.token }).then(setInbox, (e) => {
      if (e instanceof ApiError && e.unauthorized) {
        localStorage.removeItem(COACH_KEY);
        setAdmin(null);
      } else setErr(friendlyError(e));
    });
    if (admin.role !== "reviewer") {
      void rpc<Array<{ payment_status: string }>>("learning_requests_list", { p_token: admin.token })
        .then(rows => setPendingPaymentCount(rows.filter(r => r.payment_status === "reported").length))
        .catch(() => setPendingPaymentCount(null));
    }
  }, [admin]);
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [refresh]);

  if (admin === undefined) return null;
  if (!admin) return <SignIn onDone={setAdmin} />;
  const open = inbox?.coach.filter((c) => c.status === "open") ?? [];
  const age = (d: string) => Math.round((Date.now() - new Date(d).getTime()) / 60000);

  const signOut = async () => {
    await rpc("admin_sign_out", { p_token: admin.token }).catch(() => {});
    localStorage.removeItem(COACH_KEY);
    setAdmin(null);
  };
  const go = (k: typeof tab) => {
    setTab(k);
    if (k === "signups") rpc<Signup[]>("admin_signups", { p_token: admin.token }).then(setSignups, (e) => setErr(friendlyError(e)));
  };
  const staffOnly = admin.role !== "reviewer";
  const nav = [
    ...(staffOnly ? [{ key: "today", label: "Today", onClick: () => go("today"), active: tab === "today" }] : []),
    ...(staffOnly ? [{ key: "requests", label: "Learning requests", href: "/coach/learning-requests", badge: pendingPaymentCount }] : []),
    { key: "review", label: "Content review", onClick: () => go("review"), active: tab === "review" },
    { key: "inbox", label: "Learner questions", badge: open.length, onClick: () => go("inbox"), active: tab === "inbox" },
    { key: "reports", label: "Reports", badge: inbox?.reports.length ?? 0, onClick: () => go("reports"), active: tab === "reports" },
    { key: "students", label: "Learners", onClick: () => go("students"), active: tab === "students" },
    { key: "signups", label: "Sign-ups", onClick: () => go("signups"), active: tab === "signups" },
    ...(admin.role === "owner" ? [{ key: "invite", label: "Invite a learner", href: "/coach/external-enrollment" }, { key: "nur635", label: "NUR-635 midterm", href: "/coach/nur635-midterm" }] : []),
  ];
  const now = new Date();
  const hello = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const title = { today: `${hello}, ${admin.label}`, inbox: "Learner questions", reports: "Reports", review: "Content review", students: "Learners", signups: "Sign-ups" }[tab];
  const waiting = (pendingPaymentCount ?? 0) + open.length + (inbox?.reports.length ?? 0);
  const oldest = open.length ? Math.max(...open.map((c) => age(c.createdAt))) : null;
  const ageLabel = (m: number) => (m < 60 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} d`);
  const card = "rounded-[16px] border border-hairline bg-white";

  return (
    <StaffShell items={nav} user={admin.label} role={admin.role} onSignOut={() => void signOut()}>
    <div className="alm-staff mx-auto max-w-[1180px] px-4 pt-6 pb-16 sm:px-10 sm:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-ink-muted">{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
          <h1 className="font-display text-[28px] leading-[1.05] font-bold tracking-[-.04em] sm:text-[36px]">{title}</h1>
        </div>
        {tab === "today" && <span className="text-[13px] text-ink-body"><b className="text-ink">{waiting} item{waiting === 1 ? "" : "s"}</b> waiting on staff{oldest !== null ? ` · oldest question ${ageLabel(oldest)}` : ""}</span>}
      </div>
      {err && <p className="mb-4 rounded-[12px] border border-[#FFD9C2] bg-[#FFF4EC] p-3 text-[13.5px] text-[#A8430A]">{err}</p>}

      {tab === "today" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Payments to verify", n: pendingPaymentCount, sub: pendingPaymentCount ? "Check your bank first" : "Nothing reported", href: "/coach/learning-requests", warn: Boolean(pendingPaymentCount) },
              { label: "Learner questions", n: open.length, sub: oldest !== null ? `Oldest ${ageLabel(oldest)}` : "All answered", onClick: () => go("inbox"), warn: oldest !== null && oldest > 150 },
              { label: "Open reports", n: inbox?.reports.length ?? 0, sub: "Problems flagged on content", onClick: () => go("reports"), warn: false },
              { label: "Learners", n: inbox?.students.length ?? 0, sub: "With access", onClick: () => go("students"), warn: false },
            ].map((x) => {
              const inner = (
                <>
                  <span className="text-[13.5px] font-semibold text-ink-body">{x.label}</span>
                  <span className="font-display text-[34px] leading-none font-bold">{x.n ?? "–"}</span>
                  <span className={`text-[12.5px] font-semibold ${x.warn ? "text-[#A8430A]" : "text-ink-muted"}`}>{x.sub}</span>
                </>
              );
              const cls = `${card} flex flex-col gap-2 p-4 text-left hover:border-violet sm:p-5`;
              return x.href ? <a key={x.label} href={x.href} className={cls}>{inner}</a> : <button key={x.label} type="button" onClick={x.onClick} className={cls}>{inner}</button>;
            })}
          </div>
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className={`${card} overflow-hidden`}>
              <div className="flex items-center justify-between border-b border-[#EEEBF7] px-5 py-4">
                <h2 className="font-display text-[20px] font-bold tracking-[-.02em]">Today&apos;s priorities</h2>
                <span className="text-[12.5px] text-ink-muted">Oldest first</span>
              </div>
              <ul>
                {pendingPaymentCount ? (
                  <li className="flex items-center gap-4 border-b border-[#EEEBF7] px-5 py-4">
                    <span className="h-2 w-2 flex-none rounded-full bg-[#F2711C]" />
                    <span className="min-w-0 flex-1"><span className="block text-[14.5px] font-bold">Verify {pendingPaymentCount} payment report{pendingPaymentCount === 1 ? "" : "s"}</span><span className="block text-[12.5px] text-ink-muted">Match reference and amount against the bank statement</span></span>
                    <span className="hidden rounded-full bg-[#FFE9DC] px-2.5 py-1 text-[11.5px] font-bold text-[#A8430A] sm:inline">Payment</span>
                    <a href="/coach/learning-requests" className="flex h-10 items-center rounded-[10px] border-[1.5px] border-[#D9D2F3] px-4 text-[13.5px] font-bold text-violet-deep hover:bg-mist">Verify</a>
                  </li>
                ) : null}
                {[...open].sort((x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime()).slice(0, 6).map((c) => (
                  <li key={c.id} className="flex items-center gap-4 border-b border-[#EEEBF7] px-5 py-4">
                    <span className={`h-2 w-2 flex-none rounded-full ${age(c.createdAt) > 150 ? "bg-[#F2711C]" : "bg-[#C9BEF7]"}`} />
                    <span className="min-w-0 flex-1"><span className="block truncate text-[14.5px] font-bold">Answer question · {c.student}</span><span className="block truncate text-[12.5px] text-ink-muted">“{c.question.slice(0, 80)}”{c.lessonId ? ` on ${lessonById(c.lessonId)?.title ?? c.lessonId}` : ""}</span></span>
                    <span className="hidden rounded-full bg-lilac px-2.5 py-1 text-[11.5px] font-bold text-violet-deep sm:inline">Question</span>
                    <span className="hidden w-12 text-right text-[13px] font-bold text-ink-body sm:inline">{ageLabel(age(c.createdAt))}</span>
                    <button type="button" onClick={() => go("inbox")} className="flex h-10 items-center rounded-[10px] border-[1.5px] border-[#D9D2F3] px-4 text-[13.5px] font-bold text-violet-deep hover:bg-mist">Reply</button>
                  </li>
                ))}
                {(inbox?.reports ?? []).slice(0, 4).map((r) => (
                  <li key={r.id} className="flex items-center gap-4 border-b border-[#EEEBF7] px-5 py-4">
                    <span className="h-2 w-2 flex-none rounded-full bg-[#C9BEF7]" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-[14.5px] font-bold">Check report · {r.itemType} {r.itemId}</span><span className="block truncate text-[12.5px] text-ink-muted">{r.message}</span></span>
                    <span className="hidden rounded-full bg-mist px-2.5 py-1 text-[11.5px] font-bold text-ink-body sm:inline">Report</span>
                    <button type="button" onClick={() => go("reports")} className="flex h-10 items-center rounded-[10px] border-[1.5px] border-[#D9D2F3] px-4 text-[13.5px] font-bold text-violet-deep hover:bg-mist">Open</button>
                  </li>
                ))}
                {!pendingPaymentCount && open.length === 0 && !(inbox?.reports.length) && <li className="px-5 py-6 text-[14px] text-ink-muted">Nothing waiting. New payments, questions and reports appear here.</li>}
              </ul>
            </section>
            <div className="flex flex-col gap-4">
              <section className={`${card} p-4`}>
                <p className="mb-2 text-[11px] font-extrabold tracking-[.12em] text-ink-muted">RECENT LEARNERS</p>
                <ul className="flex flex-col gap-2.5">
                  {[...(inbox?.students ?? [])].sort((x, y) => (y.lastSeenAt ?? "").localeCompare(x.lastSeenAt ?? "")).slice(0, 4).map((st) => (
                    <li key={st.label} className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lilac text-[11.5px] font-extrabold text-violet-deep">{(st.name ?? st.label).split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                      <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[13.5px] font-bold">{st.name ?? st.label}</span><span className="text-[12px] text-ink-muted">{st.answers} answers{st.answers ? ` · ${Math.round((st.correct / st.answers) * 100)}% correct` : ""}</span></span>
                      <span className="text-[11.5px] text-ink-muted">{st.lastSeenAt ? new Date(st.lastSeenAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Never"}</span>
                    </li>
                  ))}
                  {(inbox?.students.length ?? 0) === 0 && <li className="text-[13px] text-ink-muted">No learners yet.</li>}
                </ul>
              </section>
              <p className="rounded-[16px] bg-mist p-4 text-[13px] leading-normal text-ink-body"><b className="text-ink">Payments.</b> Payment reports are separate from the Reports tab. Verify money received in your bank before granting learning access.</p>
              {admin.role==="owner"&&
                <details className={`${card} p-4`}>
                  <summary className="cursor-pointer text-[13px] font-bold text-violet-700">System QA · Email delivery</summary>
                  <p className="mt-2 text-[12px] text-ink-body">Send one diagnostic from the live Almanac server using the same Resend connection as invoices and access codes. No order or payment is created. The recipient is set in the hosting environment.</p>
                  <button type="button" onClick={()=>void runEmailTest()} disabled={emailTestBusy}
                    className="mt-3 h-10 rounded-[10px] bg-violet px-4 text-[13px] font-bold text-white disabled:opacity-50">
                    {emailTestBusy?"Sending test…":"Send Almanac test email →"}
                  </button>
                  {emailTestResult&&<p role="status" className="mt-3 rounded-[10px] bg-lilac p-3 text-[12px] text-ink-body">{emailTestResult}</p>}
                </details>}
            </div>
          </div>
        </div>
      )}

      {tab === "inbox" && (
        <ul className="flex flex-col gap-3">
          {(inbox?.coach ?? []).map((c) => (
            <li key={c.id} className={`rounded-[16px] border border-hairline p-5 ${c.status === "open" ? "bg-white" : "bg-mist"}`}>
              <p className="text-xs font-bold text-ink-muted">
                {c.student} · {c.lessonId ? (lessonById(c.lessonId)?.title ?? c.lessonId) : "General"} ·{" "}
                <span className={c.status === "open" && age(c.createdAt) > 150 ? "text-incorrect" : ""}>{age(c.createdAt)} min ago</span>
              </p>
              <p className="mt-1 whitespace-pre-wrap">{c.question}</p>
              {c.aiAnswer && (
                <details className="mt-2 text-sm text-ink-muted">
                  <summary>AI tutor said</summary>
                  <p className="whitespace-pre-wrap">{c.aiAnswer}</p>
                </details>
              )}
              {c.reply ? (
                <p className="mt-2 rounded-xl bg-mint p-3 text-sm text-mint-ink">
                  <b>{c.repliedBy}:</b> {c.reply}
                </p>
              ) : (
                <form
                  className="mt-3 flex flex-col gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const reply = drafts[c.id]?.trim();
                    if (!reply) return;
                    try {
                      await rpc("admin_reply", { p_token: admin.token, p_request_id: c.id, p_reply: reply });
                      setDrafts({ ...drafts, [c.id]: "" });
                      refresh();
                    } catch (x) {
                      setErr(friendlyError(x));
                    }
                  }}
                >
                  <textarea rows={3} value={drafts[c.id] ?? ""} onChange={(e) => setDrafts({ ...drafts, [c.id]: e.target.value })} className="rounded-[12px] border border-[#D9D2F3] p-3 outline-none focus:border-violet" placeholder="Reply" />
                  <button className="h-10 self-start rounded-[10px] bg-violet px-5 font-bold text-white hover:bg-[#4A2DE6]">Send reply</button>
                </form>
              )}
            </li>
          ))}
          {inbox?.coach.length === 0 && <li className="text-ink-muted">No questions yet.</li>}
        </ul>
      )}

      {tab === "reports" && (
        <ul className="flex flex-col gap-3">
          {(inbox?.reports ?? []).map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-[16px] border border-hairline bg-white p-5">
              <div>
                <p className="text-xs font-bold text-ink-muted">
                  {r.student} · {r.itemType} {r.itemId} · {new Date(r.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
              </div>
              <button onClick={() => rpc("admin_resolve_report", { p_token: admin.token, p_report_id: r.id }).then(refresh)} className="rounded-full bg-mist px-4 py-2 text-sm font-bold">
                Mark resolved
              </button>
            </li>
          ))}
          {inbox?.reports.length === 0 && <li className="text-ink-muted">No open reports.</li>}
        </ul>
      )}

      {tab === "review" && <ReviewTab admin={admin} />}

      {tab === "signups" && (
        <table className="w-full overflow-hidden rounded-[16px] border border-hairline bg-white text-left text-sm">
          <thead>
            <tr className="text-ink-muted">
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Wants</th>
              <th className="p-3">When</th>
            </tr>
          </thead>
          <tbody>
            {(signups ?? []).map((x) => (
              <tr key={x.email + x.courseId + x.kind} className="border-t border-hairline">
                <td className="p-3">{x.email}</td>
                <td className="p-3">{x.courseId}</td>
                <td className="p-3">{x.kind === "pilot" ? "Pilot access" : "Tell me when it opens"}</td>
                <td className="p-3">{new Date(x.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {signups?.length === 0 && (
              <tr>
                <td className="p-3 text-ink-muted" colSpan={4}>
                  No sign-ups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {tab === "students" && (
        <table className="w-full overflow-hidden rounded-[16px] border border-hairline bg-white text-left text-sm">
          <thead>
            <tr className="text-ink-muted">
              <th className="p-3">Login</th>
              <th className="p-3">Name</th>
              <th className="p-3">Answers</th>
              <th className="p-3">Correct</th>
              <th className="p-3">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {(inbox?.students ?? []).map((s) => (
              <tr key={s.label} className="border-t border-hairline">
                <td className="p-3">{s.label}</td>
                <td className="p-3">{s.name ?? "–"}</td>
                <td className="p-3">{s.answers}</td>
                <td className="p-3">{s.answers ? `${Math.round((s.correct / s.answers) * 100)}%` : "–"}</td>
                <td className="p-3">{s.lastSeenAt ? new Date(s.lastSeenAt).toLocaleDateString() : "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </StaffShell>
  );
}

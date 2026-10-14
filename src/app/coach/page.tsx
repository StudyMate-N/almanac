"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/brand";
import { cardById, courseOfModule, type ImageItem, lessonById, moduleById, questionById, reviewables } from "@/content/course";
import { pageText } from "@/lib/page-text";
import { ApiError, friendlyError, rpc } from "@/lib/api";
import { contentHash } from "@/lib/hash";
import { COACH_KEY } from "@/lib/store";

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
      className="mx-auto mt-16 flex max-w-sm flex-col gap-3 rounded-tile bg-white p-6"
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
      <h1 className="font-display text-2xl font-semibold">Coach and reviewer sign-in</h1>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Staff code
        <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" className="min-h-12 rounded-2xl border-2 border-hairline px-4 font-mono outline-none focus:border-violet" />
      </label>
      <button className="min-h-12 rounded-full bg-violet font-bold text-white">Sign in</button>
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
  const [tab, setTab] = useState<"inbox" | "reports" | "review" | "students" | "signups">("inbox");
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [err, setErr] = useState("");

  useEffect(() => setAdmin(load()), []);
  useEffect(() => {
    if (admin) setTab(admin.role === "reviewer" ? "review" : "inbox");
  }, [admin]);
  const refresh = useCallback(() => {
    if (!admin) return;
    rpc<Inbox>("admin_inbox", { p_token: admin.token }).then(setInbox, (e) => {
      if (e instanceof ApiError && e.unauthorized) {
        localStorage.removeItem(COACH_KEY);
        setAdmin(null);
      } else setErr(friendlyError(e));
    });
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

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Logo href="/coach" />
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">
            {admin.label} · {admin.role}
          </span>
          <a href="/app" className="font-bold text-violet-600">
            Preview student app
          </a>
          <button
            onClick={async () => {
              await rpc("admin_sign_out", { p_token: admin.token }).catch(() => {});
              localStorage.removeItem(COACH_KEY);
              setAdmin(null);
            }}
            className="font-bold text-ink-muted"
          >
            Sign out
          </button>
        </div>
      </header>
      <nav className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["inbox", `Coach inbox (${open.length})`],
            ["reports", `Reports (${inbox?.reports.length ?? 0})`],
            ["review", "Content review"],
            ["students", "Students"],
            ["signups", "Sign-ups"],
          ] as const
        ).map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); if (k === "signups") rpc<Signup[]>("admin_signups", { p_token: admin.token }).then(setSignups, (e) => setErr(friendlyError(e))); }} aria-pressed={tab === k} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === k ? "bg-ink text-white" : "bg-white"}`}>
            {l}
          </button>
        ))}
      </nav>
      {err && <p className="mb-3 text-incorrect">{err}</p>}

      {tab === "inbox" && (
        <ul className="flex flex-col gap-3">
          {(inbox?.coach ?? []).map((c) => (
            <li key={c.id} className={`rounded-tile p-5 ${c.status === "open" ? "bg-white" : "bg-mist"}`}>
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
                  <textarea rows={3} value={drafts[c.id] ?? ""} onChange={(e) => setDrafts({ ...drafts, [c.id]: e.target.value })} className="rounded-xl border-2 border-hairline p-2" placeholder="Reply" />
                  <button className="self-start rounded-full bg-violet px-5 py-2 font-bold text-white">Send reply</button>
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
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-tile bg-white p-5">
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
        <table className="w-full rounded-tile bg-white text-left text-sm">
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
        <table className="w-full rounded-tile bg-white text-left text-sm">
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
  );
}

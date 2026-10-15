"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {COACH_KEY} from "@/lib/store";
import {friendlyError,rpc} from "@/lib/api";

type InvitationResult={
  status:"created"|"existing_account"|"already_enrolled";
  name:string;email:string;courseId:string;accessCode:string|null;
};
const SUBJECT="Welcome to Almanac — Your Learning Space";
const BASE="https://almanac-study.netlify.app/app";
const externalNote="Owner-confirmed enrollment following payment outside Almanac.";

export default function ExternalEnrollmentPage(){
 const [staff,setStaff]=useState<{token:string;role:string}|null>(null);
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [course,setCourse]=useState("advanced-pharmacology");
 const [attested,setAttested]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [result,setResult]=useState<InvitationResult|null>(null);
 useEffect(()=>{
  try{
   const saved=JSON.parse(localStorage.getItem(COACH_KEY)||"null") as {token?:string;role?:string}|null;
   if(saved?.token&&saved.role==="owner")setStaff({token:saved.token,role:saved.role});
  }catch{/* Sign in to Coach first. */}
 },[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(!staff||!attested||busy)return;
  setBusy(true);setError("");setResult(null);
  try{
   const data=await rpc<InvitationResult>("learning_external_paid_invite",{
    p_token:staff.token,p_name:name.trim(),p_email:email.trim(),
    p_course:course,p_source_note:externalNote
   });
   setResult(data);
  }catch(e){setError(friendlyError(e)==="Something went wrong. Please try again."
    ?"The enrollment could not be created. Check that the Owner enrollment migration is installed and your session is active.":friendlyError(e));}
  finally{setBusy(false);}
 }
 const invitation=result?[`Hi ${result.name},`,"",
  "Welcome to Almanac! Your learning space is ready.",
  `Course: ${result.courseId==="advanced-pharmacology"?"Advanced Pharmacology — NUR-635 Midterm (Topics 1–8)":"Advanced Pathophysiology"}`,
  `Sign in: ${BASE}`,"",
  "Open the learning space, enter your access code, and select your course.",
  "Your progress will be saved as you study.","",
  "For assistance, reply to this message.",
  "Best,","Almanac Support","support@unemployedproff.com"].join("\n"):null;
 const mailto=result&&invitation?`mailto:${result.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(invitation)}`:null;
 return <main className="alm-staff mx-auto max-w-[840px] px-4 pb-24 pt-8 sm:px-6">
   <Link href="/coach/learning-requests" className="text-sm font-bold text-violet-700">← Learning orders &amp; payments</Link>
   <header className="mt-5 rounded-[18px] bg-[#2A1B78] p-6 text-white sm:p-8">
    <p className="text-xs font-bold uppercase tracking-wider text-white/70">Owner · Learner accounts</p>
    <h1 className="mt-2 font-display text-3xl font-bold">Invite an approved learner</h1>
    <p className="mt-3 text-sm leading-6 text-white/80">Create course access for a payment handled outside Almanac. This does not create or change an invoice, payment record or order.</p>
   </header>
   {!staff?<section className="alm-desk-card mt-5 p-6">
    <p role="alert">An active Owner session is required for this operation.</p>
    <Link href="/coach" className="alm-desk-btn mt-4">Sign in as Owner →</Link>
   </section>:
   <form className="alm-desk-card mt-5 space-y-5 p-6 sm:p-8" onSubmit={e=>void submit(e)}>
    <div><h2 className="font-display text-xl font-bold">Enrollment details</h2><p className="mt-1 text-sm text-ink-body">The access code can be viewed only once when a new learner account is created.</p></div>
    <label className="block text-sm font-semibold">Learner name
      <input value={name} onChange={e=>setName(e.target.value)} required minLength={2} maxLength={80}
        autoComplete="off" placeholder="Full name" className="mt-2 min-h-12 w-full rounded-xl border border-hairline bg-white px-4 text-base"/>
    </label>
    <label className="block text-sm font-semibold">Learner email
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={160}
        autoComplete="off" placeholder="learner@example.com" className="mt-2 min-h-12 w-full rounded-xl border border-hairline bg-white px-4 text-base"/>
    </label>
    <label className="block text-sm font-semibold">Course
      <select value={course} onChange={e=>setCourse(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-hairline bg-white px-4 text-base">
        <option value="advanced-pharmacology">Advanced Pharmacology · NUR-635</option>
        <option value="advanced-pathophysiology">Advanced Pathophysiology</option>
      </select>
    </label>
    <label className="flex items-start gap-3 rounded-xl bg-[#F6F4FB] p-4 text-sm leading-6">
      <input type="checkbox" required checked={attested} onChange={e=>setAttested(e.target.checked)} className="mt-1 h-5 w-5 accent-[#2A1B78]"/>
      <span>I have confirmed the external payment and authorize access for this learner and course. No bank payment will be recorded in Almanac.</span>
    </label>
    <button type="submit" disabled={busy||!attested} className="min-h-12 rounded-full bg-violet px-6 text-sm font-bold text-white disabled:opacity-40">{busy?"Creating approval…":"Approve enrollment & issue access →"}</button>
    {error&&<p role="alert" className="rounded-xl bg-[#FDEBEF] p-4 text-sm text-[#8A1C37]">{error}</p>}
   </form>}
   {result&&<section className="alm-desk-card mt-5 p-6 sm:p-8">
    <h2 className="font-display text-xl font-bold">{result.status==="created"?"New learner approved":result.status==="already_enrolled"?"Learner already approved":"Course added to existing learner"}</h2>
    <p className="mt-2 text-sm text-ink-body">{result.name} · {result.email}</p>
    {result.accessCode?
      <div className="mt-5 rounded-xl border border-hairline bg-[#F7F6FB] p-5">
       <p className="text-xs font-bold uppercase tracking-wider text-violet-700">New access code · Copy before leaving</p>
       <p className="mt-2 break-all font-mono text-lg font-bold" aria-label="New student access code">{result.accessCode}</p>
       <button type="button" onClick={()=>void navigator.clipboard.writeText(result.accessCode||"")}
        className="mt-3 min-h-11 rounded-full bg-violet px-5 text-sm font-bold text-white">Copy access code</button>
       <p className="mt-3 text-xs text-ink-muted">Keep this code private and send it directly to the student. The code is stored only as a hash.</p>
      </div>:
      <p className="mt-4 rounded-xl bg-mist p-4 text-sm">This account already exists. Its access code has not been rotated; the learner can use their existing code. A separate verified reset is needed if the code was lost.</p>}
    {mailto&&<a href={mailto} className="alm-desk-btn mt-5">Prepare welcome email →</a>}
    <p className="mt-4 text-xs text-ink-muted">Confirm that the course pack is published and test learner sign-in before sending any invitation. This screen does not send email automatically.</p>
   </section>}
 </main>;
}

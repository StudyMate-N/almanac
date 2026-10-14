"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  ENHANCEMENTS, EMPTY_ENHANCEMENTS, OFFERS, PREFERENCES, SPEEDS,
  calculateQuote, isSpeedAvailable,
  type DeliveryMethod, type Enhancement, type EnhancementCounts,
  type LearningPreference, type OfferKind, type Speed,
} from "@/lib/learning-offers";
import { SOURCE_ACCEPT, checkSourceFiles, uploadOrderSource } from "@/lib/learning-source-files";

const PACKAGE_KEYS: OfferKind[] = ["resource","exam","course"];
const ENHANCEMENT_KEYS = Object.keys(ENHANCEMENTS) as Enhancement[];
const SPEED_KEYS: Speed[] = ["standard","priority","express"];
const PREFERENCE_KEYS = Object.keys(PREFERENCES) as LearningPreference[];
const inputClass="mt-2 w-full rounded-2xl border border-hairline bg-white px-4 py-3 text-base outline-none focus:border-violet";
const usd=(n:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);

type Submitted={id:string;invoiceRef:string;invoiceToken:string;quoteUsd:number;turnaroundDays:number;status:string};

export function RequestBuilder({initialCourseId,initialSubject}:{initialCourseId:string|null;initialSubject:string}) {
  const [kind,setKind]=useState<OfferKind>("course");
  const [subject,setSubject]=useState(initialSubject);
  const [goal,setGoal]=useState("");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [website,setWebsite]=useState("");
  const [enhancements,setEnhancements]=useState<EnhancementCounts>({...EMPTY_ENHANCEMENTS});
  const [learningPreference,setLearningPreference]=useState<LearningPreference>("balanced");
  const [deliveryMethod,setDeliveryMethod]=useState<DeliveryMethod>("both");
  const [speed,setSpeed]=useState<Speed>("standard");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [submitted,setSubmitted]=useState<Submitted|null>(null);
  const [sourceFiles,setSourceFiles]=useState<File[]>([]);
  const [sourceError,setSourceError]=useState("");
  const [uploadProgress,setUploadProgress]=useState("");

  const offer=OFFERS[kind];
  const quote=useMemo(()=>calculateQuote({kind,speed,enhancements}),[kind,speed,enhancements]);
  const speedAvailable=isSpeedAvailable(kind,speed,enhancements);
  const visibleEnhancements=ENHANCEMENT_KEYS.filter(key=>ENHANCEMENTS[key].max[kind]>0);

  function switchPackage(next:OfferKind) {
    setKind(next);
    setEnhancements({...EMPTY_ENHANCEMENTS});
    setSpeed("standard");
  }
  function changeQuantity(key:Enhancement,delta:number) {
    setEnhancements(current=>{
      const max=ENHANCEMENTS[key].max[kind];
      const next=Math.min(max,Math.max(0,current[key]+delta));
      return {...current,[key]:next};
    });
  }
  function selectSources(fileList:FileList|null) {
    const selected=Array.from(fileList??[]);
    const validation=checkSourceFiles(selected);
    setSourceError(validation??"");
    setSourceFiles(validation?[]:selected);
  }
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy||!speedAvailable)return;
    setBusy(true);setError("");
    try {
      const response=await fetch("/api/learning-requests",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          kind,subject,goal,name,email,website,enhancements,learningPreference,
          courseId:initialCourseId,deliveryMethod,speed,
        }),
      });
      const result=await response.json() as Submitted&{error?:string};
      if(!response.ok)throw new Error(result.error||"We couldn't save your request. Please try again.");
      setSubmitted(result);
      if(sourceFiles.length){
        setUploadProgress(`Uploading your ${sourceFiles.length} course ${sourceFiles.length===1?"file":"files"} securely…`);
        let completed=0;
        for(const file of sourceFiles){
          try{await uploadOrderSource(result.id,result.invoiceToken,file);completed++;}
          catch(e){
            setUploadProgress(`${completed} of ${sourceFiles.length} files saved. ${e instanceof Error?e.message:"An upload failed."} You can retry from your private invoice.`);
            break;
          }
        }
        if(completed===sourceFiles.length)setUploadProgress(`All ${completed} ${completed===1?"file":"files"} attached to your order.`);
      }
    } catch(e) {setError(e instanceof Error?e.message:"We couldn't save your request.");}
    finally {setBusy(false);}
  }

  if(submitted)return <section className="mt-10 rounded-tile border border-hairline bg-white p-6 sm:p-10" role="status">
    <p className="text-sm font-bold text-violet-700">REQUEST RECEIVED</p>
    <h2 className="mt-2 font-display text-3xl font-semibold">Your invoice is ready.</h2>
    <p className="mt-3 text-ink-body">Your package contents and selected extras have been saved with your price. Open your invoice to review the details and payment instructions when available.</p>
    <dl className="mt-6 grid gap-3 rounded-card bg-mist p-5 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><dt>Reference</dt><dd className="break-all font-semibold">{submitted.invoiceRef}</dd></div>
      <div className="flex justify-between"><dt>Catalog total (USD)</dt><dd className="font-semibold">{usd(submitted.quoteUsd)}</dd></div>
      <div className="flex justify-between"><dt>Selected turnaround</dt><dd className="font-semibold">{submitted.turnaroundDays} calendar days</dd></div>
      <div className="flex justify-between"><dt>Payment status</dt><dd className="font-semibold">Awaiting payment</dd></div>
    </dl>
    {uploadProgress&&<p role="status" className="mt-4 rounded-xl bg-mist p-3 text-sm text-ink-body">{uploadProgress}</p>}
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Link href={`/invoice?id=${encodeURIComponent(submitted.id)}&token=${encodeURIComponent(submitted.invoiceToken)}`}
        className="inline-flex min-h-14 items-center rounded-full bg-violet px-6 font-bold text-white hover:bg-violet-600">View and print your invoice →</Link>
      <button type="button" className="min-h-12 rounded-full border border-hairline px-5 font-semibold text-violet-700"
        onClick={()=>void navigator.clipboard.writeText(window.location.origin+`/invoice?id=${encodeURIComponent(submitted.id)}&token=${encodeURIComponent(submitted.invoiceToken)}`)}>
        Copy private invoice link
      </button>
    </div>
    <p className="mt-4 text-sm text-ink-muted">No payment has been taken. Bank instructions stay unavailable until a confirmed CAD amount is shown. After payment is verified, staff issue a learning access code. Your delivery period begins when payment and required materials have been received.</p>
  </section>;

  return <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
    <div className="space-y-6">
      <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-scope">
        <h2 id="request-scope" className="font-display text-2xl font-semibold">1. What should we prepare?</h2>
        <p className="mt-2 text-sm text-ink-body">Choose a complete starting package. Each one already includes its essential learning materials.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PACKAGE_KEYS.map(key=><button key={key} type="button" aria-pressed={kind===key} onClick={()=>switchPackage(key)}
            className={`min-h-24 rounded-2xl border-2 p-3 text-left transition-colors ${kind===key?"border-violet bg-lilac":"border-hairline bg-white hover:bg-mist"}`}>
            <span className="block text-sm font-semibold">{OFFERS[key].title}</span>
            <span className="mt-1 block text-sm text-ink-muted">From {usd(OFFERS[key].baseUsd)}</span>
          </button>)}
        </div>
        <p className="mt-4 text-sm text-ink-muted">{offer.summary}</p>
        <div className="mt-5 grid gap-4">
          <label className="block text-sm font-semibold">Subject or course
            <input required minLength={3} maxLength={140} value={subject} onChange={e=>setSubject(e.target.value)}
              className={inputClass} placeholder="e.g. Advanced Pharmacology"/>
          </label>
          <label className="block text-sm font-semibold">What are you working toward?
            <textarea required minLength={10} maxLength={2000} rows={3} value={goal} onChange={e=>setGoal(e.target.value)}
              className={inputClass} placeholder="Your course, exam, important topics, syllabus or learning goals"/>
          </label>
        </div>
        <div className="mt-6 rounded-card border border-violet bg-mist p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold">Make it specific to your course.</h3>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-violet-700">Recommended · Optional</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-body">
            Have a syllabus, lecture slides, notes, or course resources?
            Share them to help us match your learning materials to your actual topics, objectives, and dates.
            Personalization is included in your package.
          </p>
          <label className="mt-4 block text-sm font-semibold">Add your course materials
            <input type="file" multiple accept={SOURCE_ACCEPT}
              onChange={e=>selectSources(e.target.files)}
              className="mt-2 block w-full rounded-xl border border-hairline bg-white p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lilac file:px-3 file:py-2 file:font-semibold file:text-violet-700"/>
          </label>
          {sourceFiles.length>0&&<ul className="mt-3 space-y-1 text-xs text-ink-body">
            {sourceFiles.map((file,i)=><li key={i} className="flex flex-wrap justify-between gap-2">
              <span className="break-all">{file.name}</span>
              <span>{(file.size/1024/1024).toFixed(1)} MB · Selected</span>
            </li>)}
          </ul>}
          {sourceError&&<p role="alert" className="mt-3 text-sm font-medium text-rose-ink">{sourceError}</p>}
          <p className="mt-3 text-xs text-ink-muted">
            PDF, DOCX, PPTX, TXT, PNG, JPG · Up to 8 files, 10 MB each, 40 MB total.
            Your files upload securely after you create the request. You can also add them later using your private invoice.
            Only share materials you have permission to use; don't include passwords or sensitive student records.
          </p>
        </div>
      </section>

      <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-materials">
        <h2 id="request-materials" className="font-display text-2xl font-semibold">2. Your learning package.</h2>
        <p className="mt-2 text-sm text-ink-body">Everything listed here is included. Personalize your study experience without paying twice for the essentials.</p>

        <div className="mt-5 rounded-card bg-mist p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl font-semibold">{offer.title}</h3>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700">{usd(offer.baseUsd)} · included</span>
          </div>
          <p className="mt-2 text-sm text-ink-body">{offer.summary}</p>
          <ul className="mt-4 grid gap-3 text-sm text-ink-body sm:grid-cols-2">
            {offer.includes.map(item=><li key={item} className="flex items-start gap-2">
              <span aria-hidden="true" className="font-bold text-violet">✓</span><span>{item}</span>
            </li>)}
          </ul>
          <p className="mt-4 border-t border-hairline pt-3 text-xs font-semibold text-violet-700">No additional format purchases are needed for this package.</p>
        </div>

        <fieldset className="mt-6">
          <legend className="font-semibold">How do you prefer to learn?</legend>
          <p className="mt-1 text-sm text-ink-muted">We'll organize the materials around this preference. The price stays the same.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {PREFERENCE_KEYS.map(key=><label key={key} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-sm ${learningPreference===key?"border-violet bg-lilac":"border-hairline"}`}>
              <input type="radio" name="learningPreference" className="mt-1 accent-violet" checked={learningPreference===key}
                onChange={()=>setLearningPreference(key)}/><span>{PREFERENCES[key]}</span>
            </label>)}
          </div>
        </fieldset>

        <div className="mt-7">
          <h3 className="font-display text-xl font-semibold">Need something more specific?</h3>
          <p className="mt-2 text-sm text-ink-body">Only add extra depth, exam practice, or coverage beyond what's already included.</p>
          <div className="mt-4 space-y-3">
            {visibleEnhancements.map(key=>{
              const extra=ENHANCEMENTS[key],max=extra.max[kind],count=enhancements[key];
              return <div key={key} className={`rounded-2xl border p-4 ${count>0?"border-violet bg-lilac":"border-hairline"}`}>
                <div className="flex flex-wrap justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold">{extra.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-body">{extra.explanation}</p>
                  </div>
                  <div className="text-right">
                    <p className="whitespace-nowrap text-sm font-semibold text-violet-700">+{usd(extra.unitUsd)} each</p>
                    <p className="text-xs text-ink-muted">Max {max}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-3">
                  <button type="button" aria-label={`Remove one ${extra.title}`} disabled={count===0}
                    onClick={()=>changeQuantity(key,-1)} className="h-10 w-10 rounded-full border border-hairline bg-white text-lg disabled:opacity-35">−</button>
                  <span className="w-5 text-center font-semibold" aria-live="polite">{count}</span>
                  <button type="button" aria-label={`Add one ${extra.title}`} disabled={count>=max}
                    onClick={()=>changeQuantity(key,1)} className="h-10 w-10 rounded-full border border-hairline bg-white text-lg disabled:opacity-35">+</button>
                </div>
              </div>;
            })}
          </div>
          {visibleEnhancements.length===1 && kind==="resource" && <p className="mt-3 text-sm text-ink-muted">Need a broader set of topics or exam simulations? Choose the Exam Preparation Pack or Complete Course above.</p>}
        </div>
        {kind==="course" && <p className="mt-4 text-xs text-ink-muted">AI tutor access is being verified separately and is not yet a guaranteed inclusion.</p>}
      </section>

      <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-delivery">
        <h2 id="request-delivery" className="font-display text-2xl font-semibold">3. Choose your delivery.</h2>
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Delivery method</legend>
          {([
            ["both","Learning workspace + downloadable files","Study online and keep supported files for review."],
            ["workspace","Almanac learning workspace","Keep lessons, scored practice, planning, and progress together."],
            ["files","Downloadable materials","Receive supported files without interactive workspace tools."],
          ] as const).map(([value,label,description])=><label key={value} className="flex cursor-pointer gap-3 rounded-2xl border border-hairline p-4">
            <input type="radio" className="mt-1 accent-violet" name="deliveryMethod" checked={deliveryMethod===value} onChange={()=>setDeliveryMethod(value)}/>
            <span><strong className="block">{label}</strong><span className="mt-1 block text-sm text-ink-muted">{description}</span></span>
          </label>)}
        </fieldset>
        {deliveryMethod==="files" && <p className="mt-3 rounded-2xl bg-mist p-3 text-sm text-ink-body">
          Interactive practice, exam scoring, and progress tracking require workspace access. Choosing downloadable files alone does not reduce the price.
        </p>}
      </section>

      <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-urgency">
        <h2 id="request-urgency" className="font-display text-2xl font-semibold">4. When do you need it?</h2>
        <p className="mt-2 text-sm text-ink-body">Your full package stays included at every speed. Larger enhancements may require more time.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {SPEED_KEYS.map(key=>{
            const available=isSpeedAvailable(kind,key,enhancements);
            return <button key={key} type="button" disabled={!available} aria-pressed={speed===key} onClick={()=>setSpeed(key)}
              className={`min-h-24 rounded-2xl border-2 px-2 py-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${speed===key?"border-violet bg-lilac":"border-hairline bg-white hover:bg-mist"}`}>
              <span className="block text-sm font-semibold">{SPEEDS[key].title}</span>
              <span className="mt-1 block font-display text-lg font-semibold">{offer.turnaround[key]} days</span>
              <span className="mt-1 block text-xs text-ink-muted">{available?(SPEEDS[key].factor===1?"Base rate":`${SPEEDS[key].factor}×`):"Unavailable"}</span>
            </button>;
          })}
        </div>
        {!speedAvailable && <p role="alert" className="mt-3 rounded-2xl bg-peach p-3 text-sm text-peach-ink">
          Your selected enhancements need a longer production window. Choose an available delivery tier or reduce their quantities.
        </p>}
        <p className="mt-3 text-sm text-ink-muted">Timelines are in calendar days, beginning after payment verification and receipt of all required materials. Express availability also depends on production capacity before payment activation.</p>
      </section>

      <section className="rounded-tile bg-white p-5 sm:p-7" aria-labelledby="request-contact">
        <h2 id="request-contact" className="font-display text-2xl font-semibold">5. Your details</h2>
        <p className="mt-2 text-sm text-ink-body">So we can identify your request and follow up on its preparation.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Name
            <input className={inputClass} required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/>
          </label>
          <label className="block text-sm font-semibold">Email
            <input className={inputClass} required type="email" maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/>
          </label>
        </div>
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
        </div>
        <p className="mt-4 text-xs text-ink-muted">No payment is collected when you submit this request.</p>
      </section>
    </div>

    <aside className="rounded-tile border border-hairline bg-white p-5 lg:sticky lg:top-5" aria-label="Your request summary">
      <p className="text-xs font-bold uppercase tracking-wide text-violet-700">YOUR PACKAGE</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">{offer.title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{quote.units} learning {quote.units===1?"unit":"units"} · Core materials included</p>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-2"><dt>Package</dt><dd>{usd(quote.baseUsd)}</dd></div>
        {ENHANCEMENT_KEYS.filter(key=>enhancements[key]>0).map(key=><div key={key} className="flex justify-between gap-2">
          <dt>{ENHANCEMENTS[key].title} × {enhancements[key]}</dt>
          <dd className="whitespace-nowrap">{usd(ENHANCEMENTS[key].unitUsd*enhancements[key])}</dd>
        </div>)}
        <div className="flex justify-between gap-2"><dt>Delivery: {SPEEDS[speed].title}</dt><dd>+{usd(quote.urgencyUsd)}</dd></div>
        <div className="border-t border-hairline pt-3">
          <dt className="text-ink-muted">Total list price (USD)</dt>
          <dd className="mt-1 font-display text-[38px] font-semibold leading-tight">{usd(quote.totalUsd)}</dd>
        </div>
        <div className="flex justify-between gap-2 rounded-2xl bg-mist p-3"><dt>Turnaround</dt><dd className="font-semibold">{quote.days} calendar days</dd></div>
      </dl>
      <p className="mt-3 text-xs text-ink-muted">Preference: {PREFERENCES[learningPreference]}</p>
      {error && <p role="alert" className="mt-4 rounded-xl bg-rose p-3 text-sm text-rose-ink">{error}</p>}
      <button type="submit" disabled={busy||!speedAvailable}
        className="mt-5 min-h-14 w-full rounded-full bg-violet px-5 font-bold text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50">
        {busy?"Saving your request…":"Review and create invoice →"}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">Your itemized invoice will include your package, quantities, and delivery choice. Bank transfers in CAD are not yet enabled until the payable amount is locked.</p>
    </aside>
  </form>;
}

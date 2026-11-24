import Link from "next/link";
import {SiteHeader,SiteFooter} from "@/components/site/chrome";
import {ALMANAC_SUPPORT_EMAIL} from "@/lib/almanac-contact";
import {FORMAT_TINT,FormatGrid} from "@/components/study-formats-view";
import {publicCourseFormats,publicSectionsInside} from "@/lib/format-data";
import type {FormatId} from "@/lib/study-formats";

const TILE_CYCLE:FormatId[]=["read","watch","practise","remember","see","listen","rehearse"];
const plural=(n:number,one:string,many=`${one}s`)=>`${n} ${n===1?one:many}`;
const hours=(min:number)=>min<60?`about ${min} min`:`about ${Math.round(min/30)/2} h`;
const ID="advanced-pathophysiology";

const included=[
 ["Lessons","Short, clear explanations of the mechanisms behind disease."],
 ["Explained practice","Check understanding and review why each choice is correct."],
 ["Flashcards","Keep important relationships fresh as you progress."],
 ["Section assessments","Review each competency before moving forward."],
 ["Study planning","Organize your revision around your own course dates."],
 ["Exam preparation","Practise applying what you have learned under timed conditions."]
] as const;

export function PathoPage() {
 const sections=publicSectionsInside(ID);
 const formats=publicCourseFormats(ID);
 return <div className="alm-public min-h-screen">
  <SiteHeader/>
  <main>
   <section className="alm-gradient-hero">
    <div className="alm-wrap pb-10 pt-7">
     <p className="text-[12px] text-ink-muted"><Link href="/courses" className="font-bold text-violet-700">Courses</Link> / Advanced Pathophysiology</p>
     <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_.9fr]">
      <div>
       <div className="flex flex-wrap items-center gap-2"><span className="alm-pill alm-pill-mint">Prepared course · existing access</span><span className="alm-eyebrow">Nursing · Graduate</span></div>
       <h1 className="mt-4 max-w-[610px] text-[37px] font-bold leading-[1.05] sm:text-[49px]">Advanced Pathophysiology</h1>
       <p className="mt-4 max-w-[530px] text-[15.5px] text-ink-body">Seven competencies, from homeostasis to every body system: how disease develops, shows up, complicates and varies.</p>
       <div className="mt-6 flex flex-wrap gap-2"><Link href="/request?course=advanced-pathophysiology" className="alm-action">Read product update →</Link><a href="#inside" className="alm-action alm-action-secondary">See what&apos;s inside</a></div>
       <p className="mt-4 max-w-[510px] text-[12px] text-ink-muted">Existing approved learners retain course access. New learning orders are paused while the product is redesigned; materials remain subject to review.</p>
      </div>
      <div className="alm-course-media relative aspect-[16/10] overflow-hidden border border-hairline bg-[#E6E0F8] shadow-[0_12px_30px_rgba(42,27,120,.1)]">
       <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/almanac-art/video-poster-pathophysiology.png')"}}/>
       <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-white/95 py-2 pl-3 pr-5 shadow-sm"><span className="alm-play !h-[34px] !w-[34px]"/></div>
      </div>
     </div>
    </div>
   </section>
   <section id="formats" className="alm-section scroll-mt-6 border-b border-[#EEEBF7] bg-studio" aria-labelledby="formats-title">
    <div className="alm-wrap">
     <p className="alm-eyebrow">Ways to study this course</p>
     <h2 id="formats-title" className="alm-section-title mt-2">Every topic, several ways in.</h2>
     <p className="mt-3 max-w-[660px] text-[14px] text-text-body">What exists today for Advanced Pathophysiology. &ldquo;In production&rdquo; means it is being made and reviewed; nothing is shown to learners before a reviewer approves it.</p>
     <div className="mt-6"><FormatGrid states={formats} compact/></div>
    </div>
   </section>
   <section id="inside" className="alm-section scroll-mt-6" aria-labelledby="inside-title">
    <div className="alm-wrap">
      <p className="alm-eyebrow">What&apos;s inside</p><h2 id="inside-title" className="alm-section-title mt-2">Seven competencies. One clear path.</h2>
      <p className="mt-3 max-w-[700px] text-[14px] text-ink-body">Work through one section at a time. Counts describe the prepared course; learners see each item once a reviewer approves it.</p>
      <ol className="mt-6 flex flex-col gap-2">
       {sections.map((m,i)=><li key={m.id} className={`flex items-center gap-4 rounded-section border p-3.5 sm:p-4 ${i===0?"border-border-strong bg-primary-tint/40":"border-border bg-canvas"}`}>
         <span aria-hidden="true" className={`grid h-11 w-11 flex-none place-items-center rounded-control font-display text-[16px] font-bold text-primary-deep ${FORMAT_TINT[TILE_CYCLE[i%TILE_CYCLE.length]]}`}>{m.number}</span>
         <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold leading-snug text-text sm:text-[17px]"><span className="sr-only">Section {m.number}: </span>{m.title}</h3>
          <p className="mt-0.5 text-[12.5px] text-text-muted">{[plural(m.pages,"page"),m.videos?plural(m.videos,"video"):"",plural(m.questions,"question"),plural(m.cards,"card")].filter(Boolean).join(" · ")}</p>
         </div>
         <span className="hidden flex-none rounded-full bg-mist px-3 py-1 text-[12px] font-semibold text-text-body sm:inline">{hours(m.minutes)}</span>
       </li>)}
      </ol>
      <p className="mt-3 text-[12px] text-text-muted">Times are estimates from each page&apos;s word count (200 words a minute), plus clip lengths and checks.</p>
      <div className="alm-card mt-4 flex flex-wrap items-center gap-4 bg-[#F6F4FB] p-5">
       <div className="flex-1"><p className="alm-eyebrow">Final review</p><h3 className="mt-1 text-[19px] font-bold">Check your readiness.</h3><p className="mt-2 text-[13px] text-ink-body">Revisit the full course, see where more practice would help, then rehearse with a timed practice exam.</p></div>
       <span className="alm-pill alm-pill-orange">Exam preparation</span>
      </div>
    </div>
   </section>
   <section id="includes" className="alm-section border-y border-[#EEEBF7] bg-[#FBFAFE]">
    <div className="alm-wrap">
     <p className="alm-eyebrow">In every module</p><h2 className="alm-section-title mt-2">Each module gives you more than notes.</h2>
     <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {included.map(([t,d],i)=><article key={t} className="alm-card p-5">
       <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ECE7FF] font-bold text-violet-700">{String(i+1).padStart(2,"0")}</span>
       <h3 className="mt-3 text-[18px] font-bold">{t}</h3><p className="mt-2 text-[13px] text-ink-body">{d}</p>
      </article>)}
     </div>
     <p className="mt-5 text-[12px] text-ink-muted">Almanac materials are educational support, independent of any institution, and do not replace your required course texts or assessments.</p>
    </div>
   </section>
   <section id="access" className="alm-section">
    <div className="alm-wrap grid items-center gap-6 rounded-[20px] bg-[#2A1B78] p-6 text-white md:grid-cols-[1fr_auto] md:p-8">
     <div>
       <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#D2C8FF]">Approved learner access</p>
       <h2 className="mt-3 text-[29px] font-bold">Build understanding, one module at a time.</h2>
       <p className="mt-3 max-w-[610px] text-[14px] text-white/80">New course orders are paused during the product rebuild. Existing approved learners can continue in their workspace while we refine the guided study experience.</p>
       <p className="mt-4 text-[12px] text-white/75">Need assistance? <a className="font-bold text-white underline" href={`mailto:${ALMANAC_SUPPORT_EMAIL}`}>Contact Almanac support</a>.</p>
     </div>
     <div className="flex flex-col gap-3">
       <Link href="/request?course=advanced-pathophysiology" className="alm-action border-white bg-white text-[#2A1B78] hover:bg-[#F6F4FB]">Read product update →</Link>
       <Link href="/app" className="alm-action border-white/60 bg-transparent text-white hover:bg-white/10">Open learner workspace →</Link>
     </div>
    </div>
   </section>
  </main><SiteFooter/>
 </div>;
}

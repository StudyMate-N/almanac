import Link from "next/link";
import { SiteHeader,SiteFooter } from "@/components/site/chrome";
import { LogoMark } from "@/components/brand";

const action="alm-action";
const secondary="alm-action alm-action-secondary";
/* One study session, as the studio runs it (Learning Studio brief, issue #33). */
const session=[
 ["01","Explain","Start from a reviewed explanation: a short reading or video overview of one idea."],
 ["02","Practise","Retrieve or apply it straight away with practice questions and flashcards."],
 ["03","Feedback","Each answer comes with the reasoning, including why the other options are wrong."],
 ["04","Revisit","Spaced review brings the idea back before you forget it, and your plan shows what comes next."]
] as const;

function DeskArt(){
 return <div className="relative mx-auto aspect-[5/4] w-full max-w-[600px]">
   <div className="alm-hero-glow pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(circle,#ECE7FF_0%,transparent_72%)]"/>
   <img src="/almanac-art/hero-still-life.png" alt="A carefully arranged stack of study books, notes and learning objects" className="alm-hero-art relative h-full w-full object-contain" width="600" height="480"/>
 </div>;
}

function CourseVisual({variant}:{variant:"patho"|"request"}){
 return <div className="alm-course-media relative grid h-[165px] place-items-center">
   {variant==="patho"?<svg viewBox="0 0 350 160" className="h-full w-full" aria-hidden="true"><ellipse cx="170" cy="145" rx="115" ry="10" fill="#CEC5EB"/><g fill="none" stroke="#5B3DF5" strokeWidth="4"><circle cx="145" cy="80" r="41"/><path d="M122 40L188 110M117 106l77-56"/><circle cx="210" cy="80" r="29"/></g><g fill="#F2711C"><circle cx="121" cy="43" r="10"/><circle cx="184" cy="117" r="9"/><circle cx="205" cy="65" r="8"/></g><g fill="#ECE7FF"><circle cx="142" cy="84" r="20"/><circle cx="209" cy="97" r="11"/></g></svg>:
   <div className="grid grid-cols-3 gap-3"><span className="grid h-16 w-16 place-items-center rounded-xl bg-white text-violet">▤</span><span className="grid h-16 w-16 place-items-center rounded-xl bg-white text-violet">✧</span><span className="grid h-16 w-16 place-items-center rounded-xl bg-white text-violet">▦</span></div>}
   <div className={`pointer-events-none absolute inset-0 bg-cover bg-center ${variant==="patho"?"bg-[url('/almanac-art/cover-pathophysiology.png')]":"bg-[url('/almanac-art/cover-on-request.png')]"}`}/>
 </div>;
}

export default function Home(){
 return <div className="alm-public min-h-screen">
  <SiteHeader/>
  <main>
   <section className="alm-gradient-hero">
    <div className="alm-wrap grid items-center gap-9 pb-9 pt-12 lg:grid-cols-[1fr_.96fr] lg:gap-14 lg:pt-16">
     <div>
      <p className="alm-eyebrow">Learning, organized around you</p>
      <h1 className="mt-4 max-w-[590px] text-[35px] leading-[1.05] sm:text-[45px] lg:text-[52px]">Everything you need to make sense of your course &amp; exams.</h1>
      <p className="mt-4 max-w-[490px] text-[15.5px] leading-[1.65] text-ink-body">Almanac brings your study materials, learning plan, and progress together in one organized experience. Start with a ready-made course or resource, shape it around your goals, while the new learning and request experience is being rebuilt.</p>
      <div className="mt-6 flex flex-wrap gap-2">
       <Link href="/courses" className={action}>Browse courses &amp; resources <span aria-hidden="true">→</span></Link>
       <Link href="/request" className={secondary}>Read product update</Link>
      </div>
      <p className="mt-4 text-[12.5px] text-ink-muted">For coursework, exam preparation, independent study, and more.</p>
     </div>
     <DeskArt/>
    </div>
   </section>
   <section className="alm-section">
    <div className="alm-wrap">
      <p className="alm-eyebrow">Courses &amp; resources</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
       <div><h2 className="alm-section-title">Start with what you&apos;re learning.</h2>
        <p className="mt-3 max-w-[640px] text-[15px] text-ink-body">Explore what&apos;s available, or tell us what you&apos;d like to learn. Whether it&apos;s a complete course, exam preparation, or a particular study resource, there&apos;s a place to start.</p></div>
       <Link href="/courses" className={secondary}>Browse the catalog →</Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
       <article className="alm-card alm-card-hover overflow-hidden">
        <div className="relative bg-[#E6E0F8] p-4"><CourseVisual variant="patho"/>
         <span className="alm-pill alm-pill-mint absolute right-6 top-6">● Pilot open</span></div>
        <div className="p-5"><p className="alm-eyebrow">Graduate nursing</p><h3 className="mt-2 text-[23px] font-bold">Advanced Pathophysiology</h3>
         <p className="mt-2 text-[14px] text-ink-body">Understand disease mechanisms through structured lessons, practice questions, flashcards, and exam preparation.</p>
         <Link href="/courses/advanced-pathophysiology" className="mt-4 inline-flex text-[13px] font-bold text-violet-700">Explore the course →</Link></div>
       </article>
       <article className="alm-card alm-card-hover overflow-hidden">
        <div className="bg-[#F6F4FB] p-4"><CourseVisual variant="request"/></div>
        <div className="p-5"><p className="alm-eyebrow">Custom learning</p><h3 className="mt-2 text-[23px] font-bold">Don&apos;t see what you need?</h3>
         <p className="mt-2 text-[14px] text-ink-body">Tell us what you&apos;re studying and what you&apos;d like us to create. Choose your materials and timeline to get started.</p>
         <Link href="/request" className="mt-4 inline-flex text-[13px] font-bold text-violet-700">Read product update →</Link></div>
       </article>
      </div>
      <p className="mt-4 text-[12px] text-ink-muted">Other topics being developed: Advanced Pharmacology · Practical AI Skills · Editing &amp; Proofreading</p>
    </div>
   </section>
   <section className="alm-section border-y border-[#EEEBF7] bg-[#FBFAFE]" aria-labelledby="how-session">
    <div className="alm-wrap grid items-start gap-10 md:grid-cols-[1fr_.95fr] md:gap-14">
     <div>
      <p className="alm-eyebrow">How a study session works</p>
      <h2 id="how-session" className="alm-section-title mt-2">One idea at a time, from explanation to recall.</h2>
      <p className="mt-3 max-w-[520px] text-[15px] text-ink-body">Lessons, practice, flashcards and feedback are parts of one study journey, so you always know what to do next and why.</p>
      <ol className="mt-7 flex flex-col">
       {session.map(([n,title,body])=><li key={n} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-t border-[#E9E5F5] py-4 first:border-t-0 first:pt-0">
        <span className="font-display text-[15px] font-bold text-violet-700" aria-hidden="true">{n}</span>
        <div><h3 className="text-[17px] font-bold">{title}</h3><p className="mt-1 text-[14px] text-ink-body">{body}</p></div>
       </li>)}
      </ol>
      <Link href="/how-it-works" className={`${secondary} mt-4`}>Understand each step →</Link>
     </div>
     <figure className="md:sticky md:top-8">
      <div className="alm-card overflow-hidden bg-[#F4F1FE] p-5">
       <div className="alm-frame rounded-xl bg-white p-5">
        <p className="text-[12px] text-ink-muted">Advanced Pathophysiology · Section 1 · Week 3 of 11</p>
        <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[.12em] text-violet-700">Your next step</p>
        <p className="mt-1 font-display text-[21px] font-bold leading-snug tracking-[-.02em]">1.4 Cellular adaptation and injury</p>
        <p className="mt-1 text-[12.5px] text-ink-body">Read the next topic · about 8 min, then 2 more steps.</p>
        <span className="mt-4 inline-flex min-h-[40px] items-center rounded-full bg-violet px-4 text-[13px] font-bold text-white">Start: read →</span>
        <ul className="mt-4 flex flex-col gap-2 border-t border-hairline pt-3 text-[12.5px]">
         {[["Read","1.4 Cellular adaptation and injury","8 min"],["Answer","5 questions on this topic","6 min"],["Review","12 cards due","5 min"]].map(([v,t,m])=><li key={v} className="flex items-center gap-2.5"><span aria-hidden="true" className="h-4 w-4 flex-none rounded-full border-[1.5px] border-[#D9D2F3]"/><span className="flex-1"><b className="font-semibold">{v}:</b> {t}</span><span className="text-ink-muted">{m}</span></li>)}
        </ul>
       </div>
      </div>
      <figcaption className="mt-3 text-center text-[11px] text-ink-muted">Illustrative: the learner home with one next step. Example content.</figcaption>
     </figure>
    </div>
   </section>
   <section className="alm-section">
    <div className="alm-wrap grid items-center gap-8 md:grid-cols-[1fr_.9fr]">
     <div><p className="alm-eyebrow">Custom learning requests</p><h2 className="alm-section-title mt-2">Your needs don&apos;t have to fit our catalog.</h2>
      <p className="mt-4 text-[15px] text-ink-body">A course we haven&apos;t covered. An exam you&apos;re preparing for. A complete study module for a particular part of your course. Tell us what you&apos;re working toward, and we&apos;ll see what we can create for you.</p>
      <Link href="/request" className={`${action} mt-5`}>Read product update →</Link>
      <p className="mt-3 text-[12px] text-ink-muted">New custom-learning orders are paused while we redesign the experience.</p>
     </div>
     <div className="alm-plum-panel p-6">
      <p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#CFC7FF]">Your request, your goals</p><h3 className="mt-3 text-[23px] font-bold">A few details help us get started.</h3>
      <div className="mt-5 space-y-4">{[["01","What are you learning?","A subject, course, exam, or module"],["02","What would help?","A full course, study guide, practice, or something else"],["03","When do you need it?","Select a delivery timeline and see your price"]].map(([n,h,d])=><div key={n} className="flex gap-3 border-t border-white/20 pt-4"><span className="text-[13px] font-extrabold text-[#CEBBFF]">{n}</span><div><p className="text-[13px] font-bold">{h}</p><p className="mt-1 text-[12px] text-white/75">{d}</p></div></div>)}</div>
     </div>
    </div>
   </section>
   <section className="alm-section">
    <div className="alm-wrap rounded-[20px] bg-[#ECE7FF] px-6 py-10 text-center sm:px-10">
     <p className="alm-eyebrow">Your next step</p><h2 className="alm-section-title mt-3">There&apos;s more than one way to begin.</h2>
     <p className="mx-auto mt-3 max-w-[570px] text-[15px] text-ink-body">Find something ready to use, or tell us what you&apos;d like to learn. We&apos;ll help you take it from there.</p>
     <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/courses" className={action}>Browse courses &amp; resources →</Link><Link href="/request" className={secondary}>Read product update</Link></div>
    </div>
   </section>
  </main>
  <SiteFooter/>
 </div>;
}

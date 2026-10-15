import Link from "next/link";
import { SiteHeader,SiteFooter } from "@/components/site/chrome";
import { LogoMark } from "@/components/brand";

const action="alm-action";
const secondary="alm-action alm-action-secondary";
const resources=[
 ["Structured lessons","Clear explanations, in a useful order.","01"],
 ["Video overviews","See the big ideas before you go deeper.","02"],
 ["Practice questions","Check understanding with worked explanations.","03"],
 ["Flashcards","Return to essential concepts as you learn.","04"],
 ["Exam simulations","Practise applying what you have learned.","05"],
 ["Study plans","Know what to cover and what comes next.","06"]
] as const;
const steps=[
 ["01","Choose","Start with an available course or request exactly what you need.","/almanac-art/step-1-choose.png"],
 ["02","Your invoice","See the package, delivery choice, and payable amount before transferring.","/almanac-art/step-invoice.png"],
 ["03","Your plan","Share your syllabus if you have one, then review your proposed modules.","/almanac-art/step-2-plan.png"],
 ["04","Your workspace","Find released lessons, practice, flashcards and progress in one place.","/almanac-art/step-3-workspace.png"]
] as const;

function DeskArt(){
 return <div className="relative mx-auto aspect-[1.22] w-full max-w-[520px]" aria-label="Illustration of books and study objects">
   <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#ECE7FF_0%,transparent_73%)]"/>
   <svg className="alm-hero-art relative h-full w-full" viewBox="0 0 520 430" role="img" aria-label="Books, papers, writing pen, molecule and study objects">
    <defs><linearGradient id="alm-cover" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#E7E0FB"/><stop offset="1" stopColor="#A89AE5"/></linearGradient><filter id="alm-shadow"><feDropShadow dx="0" dy="14" stdDeviation="13" floodOpacity=".13"/></filter></defs>
    <g filter="url(#alm-shadow)">
      <path d="M95 286L328 238 440 297 200 348Z" fill="#DDD5F8"/>
      <path d="M95 286v17l105 45v-18z" fill="#8171B5"/>
      <path d="M200 348v-18l240-33v14z" fill="#B5A9DF"/>
      <path d="M82 242L320 202 431 261 185 309Z" fill="#FAF7EE" stroke="#D7D0C3" strokeWidth="2"/>
      <path d="M82 242v22l103 45v-20z" fill="#F1EBDD"/>
      <path d="M185 309v-20l246-28v17z" fill="#D4CEC5"/>
      <path d="M120 221L317 189 421 239 206 269Z" fill="url(#alm-cover)"/>
      <path d="M120 221v18l86 38v-17z" fill="#8074B5"/>
      <path d="M206 269v8l215-26v-12z" fill="#C4BAE6"/>
      <path d="M142 198L307 170 399 218 226 245Z" fill="#FEFEFD"/>
      <path d="M142 198v11l84 36v-11z" fill="#DBD7E4"/>
      <path d="M226 245v-11l173-16v9z" fill="#F4F3F7"/>
    </g>
    <circle cx="341" cy="175" r="40" fill="#F2711C"/><circle cx="328" cy="162" r="13" fill="#F9B27B" opacity=".7"/>
    <g stroke="#5B3DF5" strokeWidth="4"><path d="M165 137L213 103 262 137 225 180 165 137M213 103l12 77M165 137l97 0" fill="none"/>
    <g fill="#ECE7FF"><circle cx="165" cy="137" r="13"/><circle cx="213" cy="103" r="16"/><circle cx="262" cy="137" r="13"/><circle cx="225" cy="180" r="12"/></g></g>
    <path d="M296 130l37-62 38 62z" fill="#D8B86D" stroke="#B68B42" strokeWidth="3"/><path d="M333 68v62h38z" fill="#BFA058"/>
    <circle cx="291" cy="201" r="19" fill="#D5E5EA" stroke="#A6B3C0" strokeWidth="2"/><circle cx="295" cy="191" r="7" fill="#F7FAFA" opacity=".8"/>
    <path d="M129 245L366 167" stroke="#30234D" strokeWidth="7" strokeLinecap="round"/><path d="M358 168l17-8-8 19z" fill="#EACB94"/><path d="M131 247l-12 4" stroke="#BE9D58" strokeWidth="8" strokeLinecap="round"/>
   </svg>
   <div className="pointer-events-none absolute inset-0 bg-[url('/almanac-art/hero-still-life.png')] bg-contain bg-center bg-no-repeat" aria-hidden="true"/>
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
      <p className="mt-4 max-w-[490px] text-[15.5px] leading-[1.65] text-ink-body">Almanac brings your study materials, learning plan, and progress together in one organized experience. Start with a ready-made course or resource, shape it around your goals, or request something built for what you want to learn.</p>
      <div className="mt-6 flex flex-wrap gap-2">
       <Link href="/courses" className={action}>Browse courses &amp; resources <span aria-hidden="true">→</span></Link>
       <Link href="/request" className={secondary}>Request a course or resource</Link>
      </div>
      <p className="mt-4 text-[12.5px] text-ink-muted">For coursework, exam preparation, independent study, and more.</p>
     </div>
     <DeskArt/>
    </div>
    <div className="alm-wrap grid grid-cols-2 gap-2 border-t border-[#E9E5F5] py-4 sm:grid-cols-3 lg:grid-cols-6">
     {resources.map(([heading,body,num])=><div key={num} className="rounded-xl border border-[#E4DFF5] bg-white/85 px-3 py-3">
      <p className="text-[11px] font-extrabold text-violet-700">{num}</p>
      <p className="mt-1 text-[12px] font-bold">{heading}</p>
      <p className="mt-1 text-[11px] leading-[1.4] text-ink-muted">{body}</p>
     </div>)}
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
         <Link href="/request" className="mt-4 inline-flex text-[13px] font-bold text-violet-700">Request a course or resource →</Link></div>
       </article>
      </div>
      <p className="mt-4 text-[12px] text-ink-muted">Also available on request: Advanced Pharmacology · Practical AI Skills · Editing &amp; Proofreading</p>
    </div>
   </section>
   <section className="alm-section border-y border-[#EEEBF7] bg-[#FBFAFE]">
    <div className="alm-wrap">
     <p className="alm-eyebrow">How Almanac works</p><h2 className="alm-section-title mt-2">Start where you are. Know where to go next.</h2>
     <p className="mt-3 max-w-[680px] text-[15px] text-ink-body">Whether you&apos;re following a course or preparing for something specific, Almanac helps turn your materials and goals into a learning experience you can follow.</p>
     <div className="mt-6 grid gap-3 md:grid-cols-4">
      {steps.map(([n,title,body,img])=><div key={n} className="alm-card overflow-hidden">
       <div className="grid h-[125px] place-items-center bg-[#F4F1FE] bg-center bg-contain bg-no-repeat" style={{backgroundImage:`url("${img}")`}}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-display text-lg font-bold text-violet-700 shadow-sm">{n}</span>
       </div>
       <div className="p-4"><h3 className="text-[18px] font-bold">{title}</h3><p className="mt-2 text-[12.5px] text-ink-body">{body}</p></div>
      </div>)}
     </div>
     <Link href="/how-it-works" className={`${secondary} mt-6`}>Understand each step →</Link>
    </div>
   </section>
   <section className="alm-section">
    <div className="alm-wrap grid items-center gap-9 md:grid-cols-2">
     <div><p className="alm-eyebrow">Your learning space</p><h2 className="alm-section-title mt-2">Pick up where you left off.</h2>
      <p className="mt-3 text-[15px] text-ink-body">Your lessons, practice, flashcards, and study plan stay together. Find what you need, revisit what you&apos;ve learned, and see what&apos;s next without starting over each time.</p>
      <Link href="/app" className={`${secondary} mt-5`}>Open your workspace →</Link>
     </div>
     <div className="alm-card overflow-hidden bg-[#F4F1FE] p-5">
      <div className="alm-frame rounded-xl bg-white p-5">
       <div className="flex items-center justify-between border-b border-hairline pb-3"><strong className="text-[14px]">Your learning space</strong><span className="alm-pill">Module progress</span></div>
       <p className="mt-4 text-[12px] text-ink-muted">Advanced Pathophysiology · Module 02</p>
       <h3 className="mt-1 text-[19px] font-bold">Understand the mechanisms</h3>
       <div className="mt-4 h-2 rounded-full bg-[#EEEBF7]"><div className="h-full w-[42%] rounded-full bg-violet"/></div>
       <div className="mt-4 grid grid-cols-2 gap-2">{["Lessons","Practice","Flashcards","Study plan"].map(x=><div key={x} className="rounded-lg border border-hairline p-3 text-[12px] font-semibold">{x} <span className="float-right text-violet-700">↗</span></div>)}</div>
      </div><p className="mt-3 text-center text-[11px] text-ink-muted">Illustrative workspace layout</p>
     </div>
    </div>
   </section>
   <section className="alm-section border-y border-[#EEEBF7] bg-[#FBFAFE]">
    <div className="alm-wrap grid items-center gap-8 md:grid-cols-[1fr_.9fr]">
     <div><p className="alm-eyebrow">Custom learning requests</p><h2 className="alm-section-title mt-2">Your needs don&apos;t have to fit our catalog.</h2>
      <p className="mt-4 text-[15px] text-ink-body">A course we haven&apos;t covered. An exam you&apos;re preparing for. A complete study module for a particular part of your course. Tell us what you&apos;re working toward, and we&apos;ll see what we can create for you.</p>
      <Link href="/request" className={`${action} mt-5`}>Request a course or resource →</Link>
      <p className="mt-3 text-[12px] text-ink-muted">We&apos;ll review your request and explain what&apos;s possible and what happens next.</p>
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
     <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/courses" className={action}>Browse courses &amp; resources →</Link><Link href="/request" className={secondary}>Request a course or resource</Link></div>
    </div>
   </section>
  </main>
  <SiteFooter/>
 </div>;
}

"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import type {Course} from "@/content/types";

const categories=["All","Nursing","Everyday skills","Writing"] as const;
const coverFor=(id:string)=>{
 const key=id.toLowerCase();
 if(key.includes("patho"))return "/almanac-art/cover-pathophysiology.png";
 if(key.includes("pharm"))return "/almanac-art/cover-pharmacology.png";
 if(key.includes("editing")||key.includes("proofread"))return "/almanac-art/cover-editing-proofreading.png";
 if(key.includes("ai"))return "/almanac-art/cover-practical-ai-skills.png";
 return "/almanac-art/cover-on-request.png";
};
export function CourseCatalog({courses}:{courses:Course[]}) {
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState<string>("All");
 const shown=useMemo(()=>{
  const q=query.trim().toLowerCase();
  return courses.filter(c=>(category==="All"||c.category.toLowerCase().includes(category.toLowerCase()))&&
   (!q||[c.title,c.category,c.blurb].join(" ").toLowerCase().includes(q)));
 },[courses,query,category]);
 const open=shown.filter(c=>c.status==="open");
 const requested=shown.filter(c=>c.status!=="open");
 return <>
  <div className="mt-7 rounded-[17px] border border-hairline bg-white p-4 sm:p-5">
   <label htmlFor="catalog-search" className="block text-[12px] font-bold text-ink-body">What are you studying?</label>
   <div className="relative mt-2">
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">⌕</span>
    <input id="catalog-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
     className="min-h-[45px] w-full rounded-xl border border-hairline bg-[#FBFAFE] py-2 pl-11 pr-4 text-[14px] outline-none focus:border-violet" placeholder="Search courses, subjects or resources…"/>
   </div>
   <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter courses">
    {categories.map(c=><button key={c} type="button" aria-pressed={category===c}
     onClick={()=>setCategory(c)}
     className={`min-h-[35px] rounded-full border px-4 py-1.5 text-[12px] font-bold ${category===c?"border-violet bg-violet text-white":"border-hairline bg-white text-ink-body hover:bg-lilac"}`}>{c}</button>)}
   </div>
  </div>
  {open.length>0&&<section className="mt-9" aria-labelledby="available">
   <div className="flex flex-wrap items-end justify-between gap-3">
    <div><p className="alm-eyebrow">Explore now</p><h2 id="available" className="mt-1 text-[26px] font-bold">Courses accepting enrollments</h2></div>
    <span className="alm-pill alm-pill-mint">Approved access</span>
   </div>
   <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {open.map(c=><article key={c.id} className="alm-card alm-card-hover overflow-hidden">
     <div className="alm-course-media relative h-[205px] bg-[#E6E0F8]">
      <div className="absolute inset-0 grid place-items-center text-[24px] font-display font-bold text-[#7A68B4]">ALMANAC · LEARN</div>
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url("${coverFor(c.id)}")`}}/>
      <span className="alm-pill alm-pill-mint absolute right-4 top-4">Approved access</span>
     </div>
     <div className="p-5"><p className="alm-eyebrow">{c.category}</p><h3 className="mt-2 text-[23px] font-bold">{c.title}</h3>
      <p className="mt-2 text-[13.5px] text-ink-body">{c.blurb}</p>
      <Link href={`/courses/${c.id}`} className="mt-4 inline-flex min-h-[44px] items-center text-[13px] font-bold text-violet-700">Explore course &amp; enrollment →</Link>
     </div>
    </article>)}
   </div>
  </section>}
  {requested.length>0&&<section className="mt-10" aria-labelledby="requestable">
   <p className="alm-eyebrow">Made for you</p><h2 id="requestable" className="mt-1 text-[26px] font-bold">Available on request</h2>
   <p className="mt-2 max-w-[640px] text-[14px] text-ink-body">Choose a course, tell us what you need, and we&apos;ll prepare it for you. Select your delivery timeline and see the price before submitting your request.</p>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">
    {requested.map(c=><article key={c.id} className="alm-card alm-card-hover overflow-hidden">
     <div className="alm-course-media relative h-[170px] bg-[#E6E0F8]">
      <div className="absolute inset-0 grid place-items-center font-display text-[20px] text-[#8277B0]">Learning, prepared to order</div>
      <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url("${coverFor(c.id)}")`}}/>
     </div>
     <div className="p-5"><p className="alm-eyebrow">{c.category} · Prepared on request</p>
      <h3 className="mt-2 text-[20px] font-bold">{c.title}</h3>
      <p className="mt-2 text-[13.5px] text-ink-body">{c.blurb}</p>
      <Link href={`/request?course=${encodeURIComponent(c.id)}`} className="alm-action mt-4">Request this course →</Link>
     </div>
    </article>)}
   </div>
  </section>}
  {shown.length===0&&<section role="status" className="alm-card mt-7 p-6 sm:p-8">
    <p className="alm-eyebrow">No results</p><h2 className="mt-2 text-[23px] font-bold">No courses match that search yet.</h2>
    <p className="mt-2 text-[14px] text-ink-body">You can request a complete course or study resource even when it is not listed in our catalog.</p>
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={()=>{setQuery("");setCategory("All")}} className="alm-action alm-action-secondary">Clear filters</button>
    <Link href="/request" className="alm-action">Request a course →</Link></div>
  </section>}
  <section className="alm-plum-panel mt-10 grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
   <div><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-[#CFC7FF]">A place to begin</p>
    <h2 className="mt-2 text-[25px] font-bold">Looking for something else?</h2>
    <p className="mt-2 max-w-[610px] text-[13.5px] text-white/80">Tell us what you would like to learn or prepare for. We&apos;ll create a learning package around your needs.</p>
   </div>
   <Link href="/request" className="alm-action border-white bg-white text-[#2A1B78] hover:bg-[#F6F4FB]">Make a request →</Link>
  </section>
 </>;
}

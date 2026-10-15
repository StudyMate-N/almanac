"use client";
import Link from "next/link";
import {Sidebar,TabBar} from "@/components/app-nav";
import {Logo} from "@/components/brand";
import {PageTransition} from "@/components/page-transition";
import {useStudent} from "@/lib/store";

export function WorkspaceShell({children}:{children:React.ReactNode}) {
 const {preview,offline}=useStudent();
 return <div className="alm-workspace min-h-dvh bg-[#F7F6FB]">
   <div className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-hairline bg-white px-4 lg:hidden">
     <Logo href="/app" size={26} textClass="text-[21px]"/>
     <div className="flex gap-2">
       <Link href="/app/coach" aria-label="Ask a coach" className="grid h-11 w-11 place-items-center rounded-full border border-hairline">
         <img src="/almanac-art/icon-support.svg" alt="" className="alm-workspace-icon"/>
       </Link>
       <Link href="/app/orders" className="inline-flex min-h-11 items-center rounded-full border border-hairline px-3 text-[12px] font-bold text-violet-700">Orders</Link>
     </div>
   </div>
   <div className="mx-auto flex max-w-[1440px]">
     <Sidebar/>
     <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12 lg:pt-8 xl:px-8">
       {preview&&<div role="status" className="mb-5 rounded-xl bg-lilac px-4 py-3 text-[13px] text-ink-body">
          <strong className="text-violet-700">Coach preview.</strong> Some material you can see is still awaiting approval. Students only see approved content.
       </div>}
       {offline&&<div role="status" className="mb-5 rounded-xl bg-[#FFF4EC] px-4 py-3 text-[13px] text-[#9D3E0E]">
           You&apos;re offline. Your local study progress will sync when you reconnect.
       </div>}
       <PageTransition>{children}</PageTransition>
     </main>
   </div>
   <TabBar/>
 </div>;
}

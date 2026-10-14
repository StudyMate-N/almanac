import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";
import { PrintableInvoice } from "@/components/site/printable-invoice";

export const metadata:Metadata={
  title:"Your Almanac Invoice",
  robots:{index:false,follow:false,noarchive:true},
  referrer:"no-referrer",
};

export default async function InvoicePage({searchParams}:{
  searchParams:Promise<{id?:string;token?:string}>;
}) {
  const {id="",token=""}=await searchParams;
  return <div className="min-h-screen bg-ground text-ink">
    <div className="print:hidden"><SiteHeader/></div>
    <main className="mx-auto max-w-[980px] px-4 pb-16 pt-6 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <PrintableInvoice id={id} token={token}/>
    </main>
    <div className="print:hidden"><SiteFooter/></div>
  </div>;
}

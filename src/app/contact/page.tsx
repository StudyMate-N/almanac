import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Contact Almanac", description: "Get in touch with Almanac about learning resources, access or a request." };

export default function ContactPage() {
  const digits=(process.env.ALMANAC_WHATSAPP_NUMBER??"").replace(/[^0-9]/g,"");
  const whatsApp=/^[1-9][0-9]{7,14}$/.test(digits)?
    "https://wa.me/"+digits+"?text="+encodeURIComponent("Hello Almanac, I need help with a learning course or request.") : null;
  return <div className="alm-public min-h-screen"><SiteHeader/>
    <main className="mx-auto max-w-[880px] px-4 pb-24 pt-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-700">Contact Almanac</p>
      <h1 className="mt-3 font-display text-[42px] font-semibold">We're here to help you move forward.</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-body">For questions about learning resources, existing requests, or access to Almanac, reach our support team.</p>
      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        <div className="rounded-tile bg-white p-6">
          <h2 className="font-display text-xl font-semibold">General support</h2>
          <p className="mt-2 text-sm text-ink-body">Tell us what you need help with and include a request reference if you have one.</p>
          <a href="mailto:support@unemployedproff.com" className="mt-5 inline-block break-all font-semibold text-violet-700 underline">support@unemployedproff.com</a>
        </div>
        <div className="rounded-tile bg-lilac p-6">
          <h2 className="font-display text-xl font-semibold">Request learning materials</h2>
          <p className="mt-2 text-sm text-ink-body">Choose a package, select your preferred formats, and see your delivery options and price.</p>
          <Link href="/request" className="mt-5 inline-block font-semibold text-violet-700 underline">Request a course or resource →</Link>
        </div>
      </div>
      {whatsApp&&<div className="mt-4 rounded-tile bg-white p-6">
        <h2 className="font-display text-xl font-semibold">WhatsApp support</h2>
        <p className="mt-2 text-sm text-ink-body">Prefer to chat? Start a WhatsApp conversation. For existing orders, include the invoice reference—not the private invoice link.</p>
        <a href={whatsApp} target="_blank" rel="noreferrer"
          className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#186C4C] px-5 font-semibold text-white">
          Message Almanac on WhatsApp ↗
        </a>
      </div>}
      <p className="mt-7 text-sm text-ink-muted">For questions about a course you are already taking, you can also use the support options available inside your learning workspace.</p>
    </main><SiteFooter/></div>;
}

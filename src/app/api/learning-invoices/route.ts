import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/config";

const HEADERS = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
const uuid = /^[0-9a-f-]{36}$/i;
const tokenPattern = /^[0-9a-f]{48}$/i;

function credentials(invoice: { payableCadCents?: number | null; quoteValidUntil?:string|null;paymentStatus?:string|null }) {
  const bank = {
    name: process.env.ALMANAC_BANK_NAME ?? "",
    address: process.env.ALMANAC_BANK_ADDRESS ?? "",
    institution: process.env.ALMANAC_BANK_INSTITUTION ?? "",
    transit: process.env.ALMANAC_BANK_TRANSIT ?? "",
    accountType: process.env.ALMANAC_BANK_ACCOUNT_TYPE ?? "",
    accountNumber: process.env.ALMANAC_BANK_ACCOUNT_NUMBER ?? "",
    beneficiary: process.env.ALMANAC_BANK_BENEFICIARY ?? "",
    currency: process.env.ALMANAC_BANK_CURRENCY ?? "",
  };
  const ready = Object.values(bank).every(Boolean);
  // Never show banking instructions for an expired quote or a reported/verified transfer.
  const quoteActive=invoice.quoteValidUntil?Date.parse(invoice.quoteValidUntil)>Date.now():false;
  const awaiting=invoice.paymentStatus!=="verified"&&invoice.paymentStatus!=="reported";
  return ready && bank.currency === "CAD" && Number(invoice.payableCadCents)>0 && quoteActive && awaiting ? bank : null;
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!uuid.test(id) || !tokenPattern.test(token)) return NextResponse.json({error:"Invoice not found."},{status:404,headers:HEADERS});
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_invoice_get`, {
      method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY},
      body:JSON.stringify({p_id:id,p_token:token}),cache:"no-store"
    });
    if(!res.ok) return NextResponse.json({error:"Invoice not found."},{status:404,headers:HEADERS});
    const invoice = await res.json();
    const rawWhatsApp=(process.env.ALMANAC_WHATSAPP_NUMBER||"12057279363").replace(/[^0-9]/g,"");
    const whatsappNumber=/^[1-9][0-9]{7,14}$/.test(rawWhatsApp)?rawWhatsApp:null;
    return NextResponse.json({invoice,bank:credentials(invoice),whatsappNumber}, {headers:HEADERS});
  } catch {
    return NextResponse.json({error:"Invoice service is temporarily unavailable."},{status:503,headers:HEADERS});
  }
}

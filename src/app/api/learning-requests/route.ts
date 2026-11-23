import { NextResponse } from "next/server";

/**
 * Legacy order creation is explicitly retired while Almanac's educational
 * experience and purchase architecture are redesigned.
 *
 * This route does not accept personal information, send emails, call Supabase,
 * create invoices, or collect payments. Existing invoice/read/recovery APIs
 * remain separate and intact.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "checkout_paused",
      message: "New Almanac learning orders are temporarily paused while the experience is rebuilt.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

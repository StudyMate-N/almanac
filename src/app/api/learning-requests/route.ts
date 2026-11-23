import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/config";
import { calculateQuote, OfferValidationError, parseLearningRequest } from "@/lib/learning-offers";
import { orderEmail } from "@/lib/learning-mail";
import { approvedRequestOrigin, publicInvoiceUrl } from "@/lib/request-origin";

export async function POST(request: NextRequest) {
  // Almanac's legacy purchase journey is retired during the product rebuild.
  // Fail closed on the canonical site, independent of deployment environment.
  // Existing invoice, payment report and learner recovery APIs remain available.
  if (true) {
    return NextResponse.json(
      {
        error: "checkout_paused",
        message: "New Almanac learning orders are temporarily paused while the experience is rebuilt.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!approvedRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || "0") > 16000) {
    return NextResponse.json({ error: "Request is too long." }, { status: 413 });
  }
  let input;
  try {
    const raw = await request.text();
    if (raw.length > 16000) return NextResponse.json({ error: "Request is too long." }, { status: 413 });
    input = parseLearningRequest(JSON.parse(raw));
  } catch (error) {
    return NextResponse.json({
      error: error instanceof OfferValidationError ? error.message : "Please check the request details.",
    }, { status: 400 });
  }

  if (input.website) {
    return NextResponse.json({ error: "Unable to submit this request." }, { status: 400 });
  }

  const quote = calculateQuote(input);
  try {
    const result = await fetch(`${SUPABASE_URL}/functions/v1/learning-order-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify({ ...input, expectedTotalUsd: quote.totalUsd }),
      cache: "no-store",
    });
    if (!result.ok) {
      const body = (await result.text()).slice(0, 1500);
      if (body.includes("fx_rate_unavailable")) return NextResponse.json({
        error: "We can't confirm the Canadian-dollar exchange rate just now. Please try again shortly. Your choices are still on this page."
      }, { status: 503 });
      if (body.includes("request_limit")) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      if (body.includes("delivery_unavailable")) return NextResponse.json({ error: "The selected enhancements need a longer delivery window. Choose an available tier or reduce their quantities." }, { status: 422 });
      if (body.includes("price_changed")) return NextResponse.json({ error: "Your package price has changed. Refresh before submitting." }, { status: 409 });
      if (body.includes("invalid_")) return NextResponse.json({ error: "Check the package, quantities, learning preferences and request details." }, { status: 400 });
      return NextResponse.json({ error: "We couldn't save your request. Please try again shortly." }, { status: 503 });
    }
    const received: { id: string; quoteUsd: number; payableCadCents: number; turnaroundDays: number; status: string } = await result.json();
    // A private invoice token is returned once, not persisted in readable form.
    const invoiceToken=(received as { invoiceToken?: string }).invoiceToken;
    let emailNotice={customerSent:false,staffSent:false,configured:false};
    if(invoiceToken){
      // Netlify's request.url may be a protected deploy URL, never email it.
      const privateUrl=publicInvoiceUrl(received.id,invoiceToken);
      emailNotice=await orderEmail({email:input.email,name:input.name,
        ref:(received as {invoiceRef?:string}).invoiceRef||"",url:privateUrl,
        cadCents:received.payableCadCents});
    }
    return NextResponse.json({ ...received, notification:emailNotice }, {
      status: 201, headers: { "Cache-Control": "no-store" }
    });
  } catch {
    return NextResponse.json({ error: "The request service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

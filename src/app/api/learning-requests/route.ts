import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/config";
import { calculateQuote, OfferValidationError, parseLearningRequest } from "@/lib/learning-offers";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
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
    const result = await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_request_create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify({
        p_data: {
          ...input,
          expectedTotalUsd: quote.totalUsd,
        },
      }),
      cache: "no-store",
    });
    if (!result.ok) {
      const body = (await result.text()).slice(0, 1500);
      if (body.includes("request_limit")) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      if (body.includes("express_unavailable")) return NextResponse.json({ error: "Please choose Priority delivery or remove video overviews for this course." }, { status: 422 });
      if (body.includes("price_changed")) return NextResponse.json({ error: "Your package price has changed. Refresh before submitting." }, { status: 409 });
      if (body.includes("invalid_")) return NextResponse.json({ error: "Check the selected options and request details." }, { status: 400 });
      return NextResponse.json({ error: "We couldn't save your request. Please try again shortly." }, { status: 503 });
    }
    const received: { id: string; quoteUsd: number; turnaroundDays: number; status: string } = await result.json();
    return NextResponse.json(received, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The request service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

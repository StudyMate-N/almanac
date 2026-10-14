import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/config";
import { paymentReportEmail } from "@/lib/learning-mail";

const uuid=/^[0-9a-f-]{36}$/i;
const tokenPattern=/^[0-9a-f]{48}$/i;

export async function POST(request:NextRequest) {
  const origin=request.headers.get("origin");
  if (origin && origin!==new URL(request.url).origin) return NextResponse.json({error:"Invalid request origin."},{status:403});
  let payload: unknown;
  try {
    const raw=await request.text();
    if (raw.length>2000) return NextResponse.json({error:"Request too long."},{status:413});
    payload=JSON.parse(raw);
  } catch {
    return NextResponse.json({error:"Please check the payment details."},{status:400});
  }
  const data=payload as Record<string,unknown>;
  const id=typeof data.id==="string"?data.id:"";
  const token=typeof data.token==="string"?data.token:"";
  const reference=typeof data.reference==="string"?data.reference.trim():"";
  const paidOn=typeof data.paidOn==="string"?data.paidOn:"";
  if(!uuid.test(id)||!tokenPattern.test(token)||(reference.length>0&&reference.length<5)||reference.length>120||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(paidOn)) {
    return NextResponse.json({error:"Enter a valid transfer reference and payment date."},{status:400});
  }
  try {
    const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_payment_report`,{
      method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY},
      body:JSON.stringify({p_id:id,p_token:token,p_reference:reference,p_paid_on:paidOn}),cache:"no-store"
    });
    if(!response.ok){
      const message=await response.text();
      return NextResponse.json({
        error:message.includes("invoice_expired")
          ?"This transfer date falls after the CAD quote expired. Do not pay again. Contact support with your invoice reference for help."
          :message.includes("invalid_payment_details")
          ?"Check the transfer reference and payment date. You may use a receipt instead of a reference."
          :"We couldn't record the transfer details. Please try again."
      },{status:response.status===400?400:503});
    }
    const responseData=await response.json();
    // A secondary notification failure must not lose a valid payment report.
    try{
      const info=await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_invoice_get`,{
        method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY},
        body:JSON.stringify({p_id:id,p_token:token}),cache:"no-store"});
      if(info.ok){
        const invoice=await info.json() as {invoiceRef:string;payableCadCents:number|null};
        if(invoice.invoiceRef&&invoice.payableCadCents)await paymentReportEmail(invoice.invoiceRef,invoice.payableCadCents);
      }
    }catch{/* preserved; staff inbox remains source of truth */}
    return NextResponse.json(responseData,{headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({error:"Payment reporting is temporarily unavailable."},{status:503});
  }
}

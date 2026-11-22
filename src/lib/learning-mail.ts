import { ALMANAC_SUPPORT_EMAIL, isCrossBrandEmail } from "@/lib/almanac-contact";

/**
 * Transactional email is opt-in until a verified sending domain and provider key
 * are configured. Order creation never depends on email delivery.
 */
export const SUPPORT_EMAIL = ALMANAC_SUPPORT_EMAIL;
const FROM=process.env.ALMANAC_EMAIL_FROM||"";
const API_KEY=process.env.ALMANAC_RESEND_API_KEY||"";
const rawOps=process.env.ALMANAC_OPERATIONS_EMAIL||"";
// A legacy cross-brand operations address must never receive Almanac order notices.
const OPS=rawOps && !isCrossBrandEmail(rawOps) ? rawOps : SUPPORT_EMAIL;
const DOMAIN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validSender=(value:string)=>{
 if(isCrossBrandEmail(value))return false;
 if(DOMAIN.test(value))return true;
 const match=value.match(/^[A-Za-z0-9 .'-]{1,80}\s+<([^<>]+)>$/);
 return Boolean(match&&DOMAIN.test(match[1]));
};
const safe=(s:string)=>s.replace(/[<>\r\n]/g," ").slice(0,600);
type MailResult = {ok:boolean;status?:number;reason?:string};
async function sendDetailed(to:string,subject:string,body:string):Promise<MailResult> {
 if(!API_KEY||!validSender(FROM)||!DOMAIN.test(to))return {ok:false,reason:"configuration"};
 try{
  const response=await fetch("https://api.resend.com/emails",{
   method:"POST",
   headers:{Authorization:`Bearer ${API_KEY}`,"Content-Type":"application/json"},
   body:JSON.stringify({from:FROM,to:[to],subject,text:body,reply_to:SUPPORT_EMAIL}),
   cache:"no-store"
  });
  if(response.ok)return {ok:true,status:response.status};
  // Only surface the provider's documented error category, never response content
  // that could contain addresses, recipient data, or credentials.
  let reason="provider_rejected";
  try{
    const raw=await response.json() as {name?:unknown;error?:unknown};
    const code=typeof raw.name==="string"?raw.name:typeof raw.error==="string"?raw.error:"provider_rejected";
    reason=code.replace(/[^a-zA-Z0-9_-]/g,"").slice(0,60)||"provider_rejected";
  }catch{}
  return {ok:false,status:response.status,reason};
 }catch{return {ok:false,reason:"network_error"};}
}
async function send(to:string,subject:string,body:string){
 return (await sendDetailed(to,subject,body)).ok;
}
export async function orderEmail({email,name,ref,url,cadCents}:{
 email:string;name:string;ref:string;url:string;cadCents:number
}) {
 const paid=(cadCents/100).toLocaleString("en-CA",{style:"currency",currency:"CAD"});
 const client=await send(email,`Your Almanac request · ${ref}`,
  `Hello ${safe(name)},\n\nYour Almanac request ${safe(ref)} is recorded.\nYour fixed CAD invoice amount: ${paid}.\n\nOpen your private invoice: ${url}\n\nYour invoice contains bank instructions and the secure payment-report form. Only staff-confirmed bank transfers are marked paid. Your materials will be prepared after verification and required files are received.\n\nNeed help? ${SUPPORT_EMAIL}\nAlmanac`);
 const staff=await send(OPS,`New Almanac request · ${ref}`,
  `New learning request from ${safe(name)} (${safe(email)}).\nInvoice: ${safe(ref)}\nCAD total: ${paid}\nOpen the staff dashboard to review. Do not confirm payment from a screenshot alone.`);
 return {customerSent:client,staffSent:staff,configured:Boolean(API_KEY&&validSender(FROM))};
}
export async function paymentReportEmail(ref:string,amountCents:number){
 const paid=(amountCents/100).toLocaleString("en-CA",{style:"currency",currency:"CAD"});
 return send(OPS,`Payment reported · ${ref}`,`A learner reported payment for invoice ${safe(ref)} (${paid}). Verify actual receipt in your CAD bank account before issuing access.\nOpen Almanac's staff dashboard for the reference and receipt.`);
}

/** Delivers a newly issued access code after independent bank verification.
 * Never call until the staff session and code were checked by Supabase. */
export async function verifiedAccessEmail({email,name,ref,code,baseUrl}:{
 email:string;name:string;ref:string;code:string;baseUrl:string;
}){
 const signinUrl=new URL("/app",baseUrl).toString();
 return send(email,`Almanac learning access · ${safe(ref)}`,
  `Hello ${safe(name)},\n\nYour payment for Almanac invoice ${safe(ref)} has been verified by our team.\n\nYour learner access code: ${code}\n\nSign in: ${signinUrl}\n\nSave your code privately. Your plan and reviewed learning materials will appear in your workspace as they become available.\n\nQuestions? ${SUPPORT_EMAIL}\nAlmanac`);
}
export function transactionalEmailConfigured(){
 return Boolean(API_KEY&&validSender(FROM));
}

/** Owner-only live transport test, using the same Resend sender as customer messages.
 * Report only configuration flags, never secret values. */
export async function sendAlmanacEmailDiagnostic() {
 const to=process.env.ALMANAC_EMAIL_TEST_RECIPIENT||"";
 const missing:string[]=[];
 if(!process.env.ALMANAC_RESEND_API_KEY)missing.push("ALMANAC_RESEND_API_KEY");
 if(!validSender(FROM))missing.push("ALMANAC_EMAIL_FROM");
 if(!DOMAIN.test(to))missing.push("ALMANAC_EMAIL_TEST_RECIPIENT");
 if(missing.length)return {sent:false,configured:false,missing};
 const body=[
  "This test email was sent from the live Almanac web application.",
  "It confirms the Netlify runtime can reach the same Resend transport used for invoice and learner access notifications.",
  "No order, payment or student account was created or changed.",
  "Almanac"
 ].join("\n\n");
 const result=await sendDetailed(to,"Almanac — application email integration test",body);
 return {
  sent:result.ok,
  configured:true,
  missing,
  providerStatus:result.status??null,
  reason:result.ok?null:result.reason??"unknown",
 };
}

/**
 * Transactional email is opt-in until a verified sending domain and provider key
 * are configured. Order creation never depends on email delivery.
 */
export const SUPPORT_EMAIL="support@unemployedproff.com";
const FROM=process.env.ALMANAC_EMAIL_FROM||"";
const API_KEY=process.env.ALMANAC_RESEND_API_KEY||"";
const OPS=process.env.ALMANAC_OPERATIONS_EMAIL||SUPPORT_EMAIL;
const DOMAIN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validSender=(value:string)=>{
 if(DOMAIN.test(value))return true;
 const match=value.match(/^[A-Za-z0-9 .'-]{1,80}\s+<([^<>]+)>$/);
 return Boolean(match&&DOMAIN.test(match[1]));
};
const safe=(s:string)=>s.replace(/[<>\r\n]/g," ").slice(0,600);
async function send(to:string,subject:string,body:string) {
 if(!API_KEY||!validSender(FROM)||!DOMAIN.test(to))return false;
 try{
  const r=await fetch("https://api.resend.com/emails",{
   method:"POST",headers:{Authorization:`Bearer ${API_KEY}`,"Content-Type":"application/json"},
   body:JSON.stringify({from:FROM,to:[to],subject,text:body,reply_to:SUPPORT_EMAIL})
  });
  return r.ok;
 }catch{return false;}
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
 return {
  sent:await send(to,"Almanac — application email integration test",body),
  configured:true,
  missing,
 };
}

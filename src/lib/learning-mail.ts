/**
 * Transactional email is opt-in until a verified sending domain and provider key
 * are configured. Order creation never depends on email delivery.
 */
export const SUPPORT_EMAIL="support@unemployedproff.com";
const FROM=process.env.ALMANAC_EMAIL_FROM||"";
const API_KEY=process.env.ALMANAC_RESEND_API_KEY||"";
const OPS=process.env.ALMANAC_OPERATIONS_EMAIL||SUPPORT_EMAIL;
const DOMAIN=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const safe=(s:string)=>s.replace(/[<>\r\n]/g," ").slice(0,600);
async function send(to:string,subject:string,body:string) {
 if(!API_KEY||!DOMAIN.test(FROM)||!DOMAIN.test(to))return false;
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
 return {customerSent:client,staffSent:staff,configured:Boolean(API_KEY&&DOMAIN.test(FROM))};
}
export async function paymentReportEmail(ref:string,amountCents:number){
 const paid=(amountCents/100).toLocaleString("en-CA",{style:"currency",currency:"CAD"});
 return send(OPS,`Payment reported · ${ref}`,`A learner reported payment for invoice ${safe(ref)} (${paid}). Verify actual receipt in your CAD bank account before issuing access.\nOpen Almanac's staff dashboard for the reference and receipt.`);
}

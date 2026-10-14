// Read-only smoke tests: secret-less requests must NEVER expose user files.
// Run against the development Supabase Edge functions. No records are written.
const BASE="https://pebkqsyfliytbowxzyun.supabase.co/functions/v1";
const orderId="00000000-0000-4000-a000-000000000000";
const fileId="00000000-0000-4000-a000-000000000001";
const bogusToken="000000000000000000000000000000000000000000000000";
const checks=[
 {route:"learning-deliverables",action:"student_list",studentToken:bogusToken,orderId},
 {route:"learning-deliverables",action:"student_download",studentToken:bogusToken,orderId,fileId},
 {route:"learning-deliverables",action:"staff_list",staffToken:bogusToken,orderId},
 {route:"learning-deliverables",action:"staff_download",staffToken:bogusToken,orderId,fileId},
 {route:"learning-payment-receipts",action:"list",invoiceToken:bogusToken,orderId},
 {route:"learning-payment-receipts",action:"staff_list",staffToken:bogusToken,orderId},
 {route:"learning-source-files",action:"list",invoiceToken:bogusToken,orderId}
];
let failures=0;
for(const c of checks){
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const response=await fetch(BASE+"/"+c.route,{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify(c),signal:controller.signal
  });
  const data=await response.text();
  const valid=response.status>=400&&response.status<500;
  if(!valid||data.includes("objectPath")||data.includes("storage/v1/object")){
   console.error("Private endpoint exposure check FAILED",c.route,c.action,response.status);
   failures++;
  }else console.log("Blocked unauthorized access",c.route,c.action,response.status);
 }catch(e){
  console.error("Private endpoint unreachable:",c.route,c.action,e instanceof Error?e.message:"unknown");
  failures++;
 }finally{clearTimeout(timeout);}
}
if(failures)process.exitCode=1;
else console.log("Passed",checks.length,"unauthorized file-access checks. No orders or files created.");

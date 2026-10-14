// Non-mutating smoke test for the complete live checkout path.
// Intentionally gives an incorrect expected quote so the database rejects
// the request before any customer row is written.
const endpoint="https://pebkqsyfliytbowxzyun.supabase.co/functions/v1/learning-order-checkout";
const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),15000);
try {
  const body={
    kind:"resource",speed:"standard",deliveryMethod:"both",
    enhancements:{deep_video:0,exam_sim:0,unit:0},
    learningPreference:"balanced",courseId:null,
    name:"Checkout Diagnostic",email:"diagnostic-check@example.invalid",
    subject:"Test Learning Module",
    goal:"Non-purchasing quote validation for automated checkout health tests.",
    expectedTotalUsd:1
  };
  const response=await fetch(endpoint,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify(body),signal:controller.signal
  });
  const result=await response.json().catch(()=>({}));
  console.log("Checkout dry-run result:",JSON.stringify({status:response.status,error:result.error||null}));
  if(response.status!==400||result.error!=="price_changed")throw Error("Live pricing validation did not respond as expected");
  console.log("Safe checkout preflight passed; no customer order was written.");
}catch(error){console.error("Checkout preflight failed:",error instanceof Error?error.message:"Unknown");process.exitCode=1;}
finally{clearTimeout(timeout);}

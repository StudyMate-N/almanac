// Non-mutating live verification of the checkout pause during Almanac's rebuild.
// Request intentionally carries an invalid quote and must be rejected before
// reaching quote or order creation. Never uses customer information.
const endpoint="https://pebkqsyfliytbowxzyun.supabase.co/functions/v1/learning-order-checkout";
const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),15000);
try {
  const response=await fetch(endpoint,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      kind:"resource",
      speed:"standard",
      deliveryMethod:"both",
      enhancements:{deep_video:0,exam_sim:0,unit:0},
      learningPreference:"balanced",
      termsAccepted:true,
      courseId:null,
      name:"Checkout Pause Probe",
      email:"checkout-pause-probe@example.invalid",
      subject:"Checkout is suspended",
      goal:"This is a deliberate non-purchasing rejection test.",
      expectedTotalUsd:1
    }),
    signal:controller.signal
  });
  const result=await response.json().catch(()=>({}));
  console.log("Live checkout pause status:",JSON.stringify({
    status:response.status,
    error:result.error??null
  }));
  if(response.status!==503||result.error!=="checkout_paused") {
    throw new Error("New order checkout did not fail closed with checkout_paused.");
  }
  console.log("PASS: new checkout is paused by the backend; no customer order created.");
}catch(error){
  console.error("Checkout pause probe failed:",error instanceof Error?error.message:"Unknown");
  process.exitCode=1;
}finally{clearTimeout(timeout);}

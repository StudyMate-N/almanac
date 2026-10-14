// Temporary non-mutating deployment preflight. Prints no environment variable values.
const endpoint="https://pebkqsyfliytbowxzyun.supabase.co/functions/v1/learning-order-checkout?diagnostic=preflight";
const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),10000);
try{
 const response=await fetch(endpoint,{signal:controller.signal});
 const body=await response.json().catch(()=>({}));
 console.log(JSON.stringify({status:response.status,serviceConfigured:body.serviceConfigured??null,bankRate:body.bankRate??null}));
 if(!response.ok||!body.serviceConfigured||body.bankRate!=="available")process.exitCode=1;
}catch(error){console.error("Checkout diagnostic fetch unavailable:",error instanceof Error?error.message:"unknown");process.exitCode=1;}
finally{clearTimeout(timeout);}

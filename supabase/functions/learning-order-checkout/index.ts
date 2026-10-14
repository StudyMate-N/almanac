import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const BOC_URL="https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=10";
const headers={"Content-Type":"application/json","Cache-Control":"no-store",
 "Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS",
 "Access-Control-Allow-Headers":"Content-Type, apikey, Authorization"};
function respond(result:unknown,status=200){return new Response(JSON.stringify(result),{status,headers});}
async function bankRate():Promise<{value:number;date:string}>{
 const ctrl=new AbortController();
 const timeout=setTimeout(()=>ctrl.abort(),7000);
 try{
  const res=await fetch(BOC_URL,{signal:ctrl.signal,headers:{Accept:"application/json"}});
  if(!res.ok)throw Error("FX_HTTP_"+res.status);
  const payload=await res.json();
  const observations=Array.isArray(payload?.observations)?payload.observations:[];
  const item=[...observations].reverse().find((x:any)=>Number(x?.FXUSDCAD?.v)>0);
  const value=Number(item?.FXUSDCAD?.v);
  const date=String(item?.d||"");
  if(!Number.isFinite(value)||value<.5||value>3||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("Invalid rate");
  const age=(Date.now()-new Date(date+"T00:00:00Z").getTime())/86400000;
  if(age<-.99||age>10)throw Error("Stale FX rate");
  return {value,date};
 }finally{clearTimeout(timeout);}
}
Deno.serve(async req=>{
 if(req.method==="GET" && new URL(req.url).searchParams.get("diagnostic")==="preflight"){
  let bankStatus="unavailable";
  try { const fx=await bankRate(); bankStatus=fx.value>0?"available":"invalid"; }
  catch(error) { bankStatus=error instanceof Error?error.message.replace(/[^a-zA-Z0-9_ -]/g,"").slice(0,70):"unavailable"; }
  return respond({serviceConfigured:Boolean(SUPABASE_URL&&SERVICE),bankRate:bankStatus});
 }
 if(req.method==="OPTIONS")return new Response(null,{headers});
 if(req.method!=="POST")return respond({error:"Method not allowed"},405);
 if(!SUPABASE_URL||!SERVICE)return respond({error:"Invoice service unavailable"},503);
 try{
  const raw=await req.text();
  if(raw.length>16000)return respond({error:"Request too long"},413);
  const data=JSON.parse(raw);
  if(!data||typeof data!=="object"||Array.isArray(data))return respond({error:"Invalid request"},400);
  // Exchange rate comes only from the Bank of Canada, never from the customer.
  const rate=await bankRate();
  const result=await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_request_create_cad`,{
   method:"POST",
   headers:{"Content-Type":"application/json",apikey:SERVICE,Authorization:`Bearer ${SERVICE}`},
   body:JSON.stringify({p_data:data,p_rate:rate.value,p_rate_date:rate.date})
  });
  if(!result.ok){
   const error=await result.text();
   const err=error.includes("request_limit")?"request_limit":
    error.includes("delivery_unavailable")?"delivery_unavailable":
    error.includes("price_changed")?"price_changed":
    error.includes("invalid_")?"invalid_details":"request_failed";
   return respond({error:err},err==="request_limit"?429:err==="request_failed"?503:400);
  }
  return respond(await result.json(),201);
 }catch{
  return respond({error:"We can't calculate a verified CAD invoice right now. Please try again shortly."},503);
 }
});

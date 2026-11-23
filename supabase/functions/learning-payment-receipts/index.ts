import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const BASE=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const BUCKET="almanac-payment-receipts";
const MIME:Record<string,string>={pdf:"application/pdf",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png"};
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS",
 "Access-Control-Allow-Headers":"Content-Type, Authorization, apikey",
 "Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const goodId=(x:unknown)=>typeof x==="string"&&/^[a-f0-9-]{36}$/i.test(x);
const goodToken=(x:unknown)=>typeof x==="string"&&/^[a-f0-9]{48}$/i.test(x);
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...CORS,"Content-Type":"application/json"}});
const headers={apikey:SERVICE,Authorization:`Bearer ${SERVICE}`,"Content-Type":"application/json"};
async function rpc(name:string,data:Record<string,unknown>){
 const r=await fetch(`${BASE}/rest/v1/rpc/${name}`,{
  method:"POST",headers,body:JSON.stringify(data)});
 if(!r.ok)throw Error("No access");
 return r.json();
}
function magic(ext:string,bytes:Uint8Array){
 if(ext==="pdf")return String.fromCharCode(...bytes.slice(0,4))==="%PDF";
 if(ext==="png")return bytes.slice(0,8).every((v,i)=>v===[137,80,78,71,13,10,26,10][i]);
 return bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
 if(req.method!=="POST")return json({error:"Method not allowed."},405);
 if(!BASE||!SERVICE)return json({error:"Receipt service unavailable."},503);
 try{
  const type=req.headers.get("content-type")||"";
  if(type.includes("multipart/form-data")){
   if(Number(req.headers.get("content-length")||"0")>5767168)return json({error:"Receipt must be under 5 MB."},413);
   const form=await req.formData();
   const id=String(form.get("orderId")||"");
   const token=String(form.get("invoiceToken")||"");
   const file=form.get("file");
   if(!goodId(id)||!goodToken(token)||!(file instanceof File))return json({error:"Invalid invoice link."},403);
   if(file.size<1||file.size>5242880)return json({error:"Receipt must be under 5 MB."},413);
   await rpc("learning_invoice_get",{p_id:id,p_token:token});
   const name=file.name.normalize("NFKC").replace(/[\\/\r\n\0]/g,"-").slice(0,120);
   const ext=name.split(".").pop()?.toLowerCase()||"";
   const media=MIME[ext];
   if(!media)return json({error:"Use PDF, PNG, or JPG for payment evidence."},415);
   if(file.type&&file.type!=="application/octet-stream"&&file.type!==media)
    return json({error:"The file type doesn't match its name."},415);
   const bytes=new Uint8Array(await file.arrayBuffer());
   if(!magic(ext,bytes))return json({error:"The selected file isn't a supported receipt."},415);
   const safe=name.replace(/[^a-zA-Z0-9._-]/g,"_");
   const path=`${id}/${crypto.randomUUID()}-${safe}`;
   const stored=await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{
    method:"POST",headers:{...headers,"Content-Type":media,"x-upsert":"false"},body:bytes});
   if(!stored.ok)return json({error:"Could not save the receipt securely."},503);
   try{
    const record=await rpc("learning_payment_proof_register",{
     p_order:id,p_token:token,p_file_name:name,p_object_path:path,p_media_type:media,p_bytes:file.size});
    return json({file:record});
   }catch{
    await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{method:"DELETE",headers}).catch(()=>{});
    return json({error:"This invoice has reached its receipt limit or is already verified."},409);
   }
  }
  if(!type.includes("application/json"))return json({error:"Invalid request."},415);
  const raw=await req.text();
  if(raw.length>2500)return json({error:"Request too large"},413);
  const p=JSON.parse(raw);
  const action=p?.action;
  if(!goodId(p.orderId))return json({error:"Invoice not found."},404);
  if(action==="list"){
   if(!goodToken(p.invoiceToken))return json({error:"Invalid invoice link."},403);
   const files=await rpc("learning_payment_proofs_list",{p_order:p.orderId,p_token:p.invoiceToken});
   return json({files});
  }
  if(action==="staff_list"||action==="staff_download"){
   if(typeof p.staffToken!=="string"||p.staffToken.length>500)return json({error:"Not authorized."},403);
   const files=await rpc("learning_payment_proofs_staff_list",{
     p_staff_token:p.staffToken,p_order:p.orderId
   });
   if(action==="staff_list")return json({files:files.map((f:Record<string,unknown>)=>({
     id:f.id,fileName:f.fileName,fileSize:f.fileSize,submittedAt:f.submittedAt
   }))});
   const found=files.find((f:Record<string,unknown>)=>f.id===p.fileId);
   if(!found)return json({error:"Receipt not found."},404);
   const response=await fetch(`${BASE}/storage/v1/object/authenticated/${BUCKET}/${found.objectPath}`,{
    headers:{apikey:SERVICE,Authorization:`Bearer ${SERVICE}`}});
   if(!response.ok)return json({error:"Receipt unavailable."},503);
   const clean=String(found.fileName).replace(/[^a-zA-Z0-9._-]/g,"_");
   return new Response(response.body,{headers:{...CORS,
     "Content-Type":"application/octet-stream",
     "Content-Disposition":`attachment; filename="${clean}"`}});
  }
  return json({error:"Unsupported operation"},400);
 }catch{
  return json({error:"Unable to handle the receipt. Verify your private invoice link."},403);
 }
});

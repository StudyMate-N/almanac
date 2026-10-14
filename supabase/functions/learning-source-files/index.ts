import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const BASE=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const BUCKET="almanac-course-sources";
const ALLOWED:Record<string,string>={
 pdf:"application/pdf",
 docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
 pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",
 txt:"text/plain",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg"
};
const CORS={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS",
 "Access-Control-Allow-Headers":"Content-Type, Authorization, apikey",
 "Cache-Control":"no-store"};
const validId=(s:unknown)=>typeof s==="string"&&/^[a-f0-9-]{36}$/i.test(s);
const validToken=(s:unknown)=>typeof s==="string"&&/^[a-f0-9]{48}$/i.test(s);
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{...CORS,"Content-Type":"application/json"}});
const rheaders={"apikey":SERVICE,"Authorization":`Bearer ${SERVICE}`,"Content-Type":"application/json"};
async function rpc(name:string,data:Record<string,unknown>){
  const r=await fetch(`${BASE}/rest/v1/rpc/${name}`,{method:"POST",headers:rheaders,body:JSON.stringify(data)});
  if(!r.ok)throw new Error("Auth or request validation failed");
  return await r.json();
}
async function authorized(id:string,token:string){
  await rpc("learning_invoice_get",{p_id:id,p_token:token});
}
function verifyMagic(ext:string,bytes:Uint8Array){
  if(ext==="pdf")return bytes.length>4&&String.fromCharCode(...bytes.slice(0,4))==="%PDF";
  if(ext==="docx"||ext==="pptx")return bytes[0]===0x50&&bytes[1]===0x4b;
  if(ext==="png")return bytes.slice(0,8).every((n,i)=>n===[137,80,78,71,13,10,26,10][i]);
  if(ext==="jpg"||ext==="jpeg")return bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  if(ext==="txt")return !bytes.slice(0,500).includes(0);
  return false;
}
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
  if(req.method!=="POST")return json({error:"Method not allowed"},405);
  if(!BASE||!SERVICE)return json({error:"Upload service unavailable"},503);
  try{
    const type=req.headers.get("content-type")||"";
    if(type.includes("multipart/form-data")){
      const length=Number(req.headers.get("content-length")||"0");
      if(length>11534336)return json({error:"File exceeds the 10MB limit."},413);
      const data=await req.formData();
      const id=String(data.get("orderId")||"");
      const token=String(data.get("invoiceToken")||"");
      const file=data.get("file");
      if(!validId(id)||!validToken(token)||!(file instanceof File))return json({error:"Invalid upload request"},400);
      await authorized(id,token);
      if(file.size<1||file.size>10485760)return json({error:"Maximum 10 MB per file"},413);
      const sourceName=file.name.normalize("NFKC").replace(/[\\/\r\n\0]/g,"-").slice(0,120);
      const extension=sourceName.split(".").pop()?.toLowerCase()||"";
      const mime=ALLOWED[extension];
      if(!mime)return json({error:"Use PDF, DOCX, PPTX, TXT, PNG or JPG."},415);
      if(file.type&&file.type!=="application/octet-stream"&&file.type!==mime)return json({error:"File format does not match its extension."},415);
      const check=await rpc("learning_sources_slot_check",{p_order:id,p_token:token,p_bytes:file.size});
      if(check?.allowed!==true)return json({error:"Upload capacity reached."},409);
      const bytes=new Uint8Array(await file.arrayBuffer());
      if(!verifyMagic(extension,bytes))return json({error:"The selected file does not match a supported format."},415);
      const safe=sourceName.replace(/[^a-zA-Z0-9._-]/g,"_")||"document";
      const path=`${id}/${crypto.randomUUID()}-${safe}`;
      const storage=await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{
        method:"POST",headers:{...rheaders,"Content-Type":mime,"x-upsert":"false"},
        body:bytes
      });
      if(!storage.ok)return json({error:"Secure storage is currently unavailable."},503);
      try{
        const registered=await rpc("learning_source_file_register",{
          p_order:id,p_token:token,p_file_name:sourceName,
          p_object_path:path,p_media_type:mime,p_bytes:file.size
        });
        return json({file:registered});
      } catch{
        await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{method:"DELETE",headers:rheaders}).catch(()=>{});
        return json({error:"Upload limit reached. Remove files or contact support."},409);
      }
    }
    if(!type.includes("application/json"))return json({error:"Invalid request type."},415);
    const data=await req.json();
    const action=String(data.action||"");
    if(action==="list"){
      if(!validId(data.orderId)||!validToken(data.invoiceToken))return json({error:"Not authorized"},403);
      const files=await rpc("learning_sources_list",{p_order:data.orderId,p_token:data.invoiceToken});
      return json({files});
    }
    if(action==="staff_list"||action==="staff_download"){
      if(!validId(data.orderId)||typeof data.staffToken!=="string"||data.staffToken.length>500)
        return json({error:"Not authorized"},403);
      const files=await rpc("learning_sources_staff_list",{p_staff_token:data.staffToken,p_order:data.orderId});
      if(action==="staff_list")return json({files:files.map((f:Record<string,unknown>)=>({
        id:f.id,fileName:f.fileName,fileSize:f.fileSize,submittedAt:f.submittedAt
      }))});
      const file=files.find((f:Record<string,unknown>)=>f.id===data.fileId);
      if(!file)return json({error:"File not found"},404);
      const resp=await fetch(`${BASE}/storage/v1/object/authenticated/${BUCKET}/${file.objectPath}`,{
        headers:{"apikey":SERVICE,"Authorization":`Bearer ${SERVICE}`}
      });
      if(!resp.ok)return json({error:"File unavailable"},503);
      const name=String(file.fileName).replace(/[^a-zA-Z0-9._-]/g,"_");
      return new Response(resp.body,{status:200,headers:{...CORS,
        "Content-Type":"application/octet-stream",
        "Content-Disposition":`attachment; filename="${name}"`,
        "X-Content-Type-Options":"nosniff"
      }});
    }
    return json({error:"Unsupported operation"},400);
  } catch{
    return json({error:"Unable to process your request. Check your invoice link and try again."},403);
  }
});

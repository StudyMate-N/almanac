import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const BASE=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const BUCKET="almanac-deliverables";
const CORS={
 "Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,OPTIONS",
 "Access-Control-Allow-Headers":"Content-Type, Authorization, apikey",
 "Cache-Control":"no-store","X-Content-Type-Options":"nosniff"
};
const map:Record<string,string>={
 pdf:"application/pdf",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
 pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",
 zip:"application/zip",mp4:"video/mp4",mp3:"audio/mpeg",png:"image/png",
 jpg:"image/jpeg",jpeg:"image/jpeg",txt:"text/plain"
};
const idOK=(v:unknown)=>typeof v==="string"&&/^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(v);
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{...CORS,"Content-Type":"application/json"}});}
const serviceHeaders={apikey:SERVICE,Authorization:`Bearer ${SERVICE}`,"Content-Type":"application/json"};
async function rpc(name:string,data:Record<string,unknown>){
 const r=await fetch(`${BASE}/rest/v1/rpc/${name}`,{
  method:"POST",headers:serviceHeaders,body:JSON.stringify(data)});
 if(!r.ok)throw Error("not_authorized");
 return await r.json();
}
function validMagic(ext:string,b:Uint8Array){
 if(ext==="pdf")return new TextDecoder().decode(b.slice(0,4))==="%PDF";
 if(ext==="docx"||ext==="pptx"||ext==="zip")return b[0]===0x50&&b[1]===0x4b;
 if(ext==="mp4")return new TextDecoder().decode(b.slice(4,8))==="ftyp";
 if(ext==="mp3")return new TextDecoder().decode(b.slice(0,3))==="ID3"||b[0]===255;
 if(ext==="png")return b.slice(0,8).every((v,i)=>v===[137,80,78,71,13,10,26,10][i]);
 if(ext==="jpg"||ext==="jpeg")return b[0]===255&&b[1]===216;
 if(ext==="txt")return !b.slice(0,512).includes(0);
 return false;
}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
 if(req.method!=="POST")return json({error:"Unsupported request"},405);
 if(!BASE||!SERVICE)return json({error:"Delivery service unavailable"},503);
 try{
  const ct=req.headers.get("content-type")||"";
  if(ct.includes("multipart/form-data")){
   if(Number(req.headers.get("content-length")||"0")>22020096)return json({error:"Maximum file size is 20 MB"},413);
   const data=await req.formData();
   const staffToken=String(data.get("staffToken")||"");
   const orderId=String(data.get("orderId")||"");
   const kind=String(data.get("kind")||"");
   const moduleValue=String(data.get("module")||"");
   const moduleNumber=moduleValue?Number(moduleValue):null;
   const file=data.get("file");
   if(!idOK(orderId)||staffToken.length<20||staffToken.length>500||!(file instanceof File))
    return json({error:"Invalid upload request"},400);
   if(file.size<1||file.size>20971520)return json({error:"Maximum file size is 20 MB"},413);
   if(!["lesson","video","slides","practice","flashcards","simulation","plan","other"].includes(kind))
    return json({error:"Select a valid resource type"},400);
   if(moduleNumber!==null&&(!Number.isInteger(moduleNumber)||moduleNumber<1||moduleNumber>12))
    return json({error:"Select a valid module"},400);
   await rpc("learning_staff_delivery_list",{p_token:staffToken,p_order:orderId});
   const name=file.name.normalize("NFKC").replace(/[\\/\r\n\0]/g,"-").slice(0,120);
   const ext=name.split(".").pop()?.toLowerCase()||"";
   const mime=map[ext];
   if(!mime)return json({error:"Unsupported resource format"},415);
   if(file.type&&file.type!=="application/octet-stream"&&file.type!==mime)
    return json({error:"File extension doesn't match its type"},415);
   const bytes=new Uint8Array(await file.arrayBuffer());
   if(!validMagic(ext,bytes))return json({error:"File content isn't a valid supported format"},415);
   const path=`${orderId}/${crypto.randomUUID()}-${name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;
   const storage=await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{
    method:"POST",headers:{...serviceHeaders,"Content-Type":mime,"x-upsert":"false"},body:bytes});
   if(!storage.ok)return json({error:"File storage temporarily unavailable"},503);
   try{
    const record=await rpc("learning_staff_delivery_register",{
     p_token:staffToken,p_order:orderId,p_name:name,p_path:path,p_mime:mime,p_size:file.size,
     p_kind:kind,p_module:moduleNumber
    });
    return json({file:record},201);
   }catch{
    await fetch(`${BASE}/storage/v1/object/${BUCKET}/${path}`,{method:"DELETE",headers:serviceHeaders}).catch(()=>{});
    return json({error:"Unable to register file. Check the order status and resource limits."},409);
   }
  }
  if(!ct.includes("application/json"))return json({error:"Invalid request format"},415);
  const raw=await req.text();
  if(raw.length>3000)return json({error:"Request too long"},413);
  const p=JSON.parse(raw);
  if(!idOK(p?.orderId))return json({error:"Invalid order reference"},400);
  if(p.action==="staff_list"||p.action==="staff_download"||p.action==="staff_release"){
   if(typeof p.staffToken!=="string"||p.staffToken.length>500)return json({error:"Staff sign in required"},403);
   if(p.action==="staff_release"){
    if(!idOK(p.fileId)||typeof p.released!=="boolean")return json({error:"Invalid release"},400);
    return json(await rpc("learning_staff_delivery_release",{
     p_token:p.staffToken,p_order:p.orderId,p_file:p.fileId,p_release:p.released}));
   }
   const files=await rpc("learning_staff_delivery_list",{p_token:p.staffToken,p_order:p.orderId});
   if(p.action==="staff_list")return json({files:files.map((f:Record<string,unknown>)=>{
    const {objectPath,...safe}=f;return safe;
   })});
   const selected=files.find((f:Record<string,unknown>)=>f.id===p.fileId);
   if(!selected)return json({error:"File not found"},404);
   return await stream(String(selected.objectPath),String(selected.name));
  }
  if(p.action==="student_list"||p.action==="student_download"){
   if(typeof p.studentToken!=="string"||p.studentToken.length<20||p.studentToken.length>500)
    return json({error:"Student sign in required"},403);
   if(p.action==="student_list"){
    const files=await rpc("learning_student_delivery_list",{p_token:p.studentToken,p_order:p.orderId});
    return json({files});
   }
   if(!idOK(p.fileId))return json({error:"Invalid file"},400);
   const result=await rpc("learning_student_delivery_path",{
    p_token:p.studentToken,p_order:p.orderId,p_file:p.fileId});
   if(typeof result.path!=="string")return json({error:"File unavailable"},404);
   return await stream(result.path,"almanac-resource");
  }
  return json({error:"Invalid operation"},400);
 }catch{
  return json({error:"Unauthorized or unavailable. Please sign in and try again."},403);
 }
});
async function stream(path:string,filename:string){
 const response=await fetch(`${BASE}/storage/v1/object/authenticated/${BUCKET}/${path}`,{
  headers:{apikey:SERVICE,Authorization:`Bearer ${SERVICE}`}});
 if(!response.ok)return json({error:"File not found"},404);
 const clean=filename.replace(/[^a-zA-Z0-9._-]/g,"_");
 return new Response(response.body,{headers:{...CORS,
  "Content-Type":"application/octet-stream",
  "Content-Disposition":`attachment; filename="${clean}"`,"Content-Length":response.headers.get("content-length")||""}});
}

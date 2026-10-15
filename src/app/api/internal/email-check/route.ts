import {NextResponse,type NextRequest} from "next/server";
import {SUPABASE_KEY,SUPABASE_URL} from "@/lib/config";
import {sendAlmanacEmailDiagnostic} from "@/lib/learning-mail";

const HEADERS={"Cache-Control":"no-store, private","X-Robots-Tag":"noindex, nofollow"};
const INVALID=NextResponse.json({error:"Not authorized."},{status:403,headers:HEADERS});
const TOKEN=/^[a-f0-9]{64}$/;

export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin && origin!==new URL(request.url).origin)return INVALID;
 if(Number(request.headers.get("content-length")||"0")>512)
   return NextResponse.json({error:"Invalid request."},{status:400,headers:HEADERS});
 let params:unknown;
 try {
  const input=await request.text();
  if(input.length>512)throw Error("large");
  params=JSON.parse(input);
 } catch {
  return NextResponse.json({error:"Invalid request."},{status:400,headers:HEADERS});
 }
 if(!params||typeof params!=="object")return INVALID;
 const staffToken=(params as Record<string,unknown>).staffToken;
 if(typeof staffToken!=="string"||!TOKEN.test(staffToken))return INVALID;
 try{
  const verified=await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_me`,{
   method:"POST",
   headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY},
   body:JSON.stringify({p_token:staffToken}),cache:"no-store"
  });
  if(!verified.ok)return INVALID;
  const user=await verified.json() as {role?:string};
  if(user.role!=="owner")return INVALID;
  const result=await sendAlmanacEmailDiagnostic();
  return NextResponse.json(result,{status:result.sent?200:503,headers:HEADERS});
 }catch{
  return NextResponse.json({sent:false,error:"Email check unavailable."},
    {status:503,headers:HEADERS});
 }
}

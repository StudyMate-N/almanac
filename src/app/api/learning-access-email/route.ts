import {NextResponse,type NextRequest} from "next/server";
import {SUPABASE_KEY,SUPABASE_URL} from "@/lib/config";
import {transactionalEmailConfigured,verifiedAccessEmail} from "@/lib/learning-mail";
import {approvedRequestOrigin,emailLoginBaseUrl} from "@/lib/request-origin";

const PRIVATE_HEADERS={"Cache-Control":"no-store, private","X-Robots-Tag":"noindex, nofollow"};
const uuid=/^[0-9a-f-]{36}$/i;
const staffToken=/^[a-f0-9]{64}$/;
const studentCode=/^ALM-[A-F0-9]{24}$/;

export async function POST(req:NextRequest){
 if(!approvedRequestOrigin(req)){
  return NextResponse.json({error:"Invalid request origin."},{status:403,headers:PRIVATE_HEADERS});
 }
 const raw=await req.text().catch(()=>"");
 if(!raw||raw.length>1600)return NextResponse.json({error:"Invalid request."},{status:400,headers:PRIVATE_HEADERS});
 let data:unknown;
 try{data=JSON.parse(raw)}catch{return NextResponse.json({error:"Invalid request."},{status:400,headers:PRIVATE_HEADERS})}
 if(!data||typeof data!=="object")return NextResponse.json({error:"Invalid request."},{status:400,headers:PRIVATE_HEADERS});
 const d=data as Record<string,unknown>;
 if(typeof d.orderId!=="string"||!uuid.test(d.orderId)
   ||typeof d.staffToken!=="string"||!staffToken.test(d.staffToken)
   ||typeof d.accessCode!=="string"||!studentCode.test(d.accessCode)){
  return NextResponse.json({error:"Invalid request."},{status:400,headers:PRIVATE_HEADERS});
 }
 if(!transactionalEmailConfigured())
  return NextResponse.json({configured:false,sent:false},{status:503,headers:PRIVATE_HEADERS});
 try{
  const auth=await fetch(`${SUPABASE_URL}/rest/v1/rpc/learning_staff_access_email_validate`,{
   method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY},
   body:JSON.stringify({p_staff_token:d.staffToken,p_order:d.orderId,p_access_code:d.accessCode}),
   cache:"no-store"
  });
  if(!auth.ok)return NextResponse.json({error:"Not authorized."},{status:403,headers:PRIVATE_HEADERS});
  const valid=await auth.json() as {email:string;name:string;invoiceRef:string};
  if(!valid.email||!valid.invoiceRef)return NextResponse.json({error:"Cannot send access email."},{status:422,headers:PRIVATE_HEADERS});
  const sent=await verifiedAccessEmail({email:valid.email,name:valid.name,
   ref:valid.invoiceRef,code:d.accessCode,baseUrl:emailLoginBaseUrl(req)});
  return NextResponse.json({configured:true,sent},{status:sent?200:503,headers:PRIVATE_HEADERS});
 }catch{return NextResponse.json({configured:true,sent:false},{status:503,headers:PRIVATE_HEADERS});}
}

import { SUPABASE_URL } from "@/lib/config";

export const SOURCE_UPLOAD_URL=`${SUPABASE_URL}/functions/v1/learning-source-files`;
export const SOURCE_LIMITS={count:8,eachBytes:10*1024*1024,totalBytes:40*1024*1024} as const;
export const SOURCE_ACCEPT=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg";
const EXTENSIONS=new Set(["pdf","docx","pptx","txt","png","jpg","jpeg"]);

export type SourceRecord={id:string;fileName:string;fileSize:number;submittedAt?:string};

export function checkSourceFiles(files:File[],already:SourceRecord[]=[]):string|null {
  if(files.length+already.length>SOURCE_LIMITS.count)return "Up to 8 files can be attached to one request.";
  if(files.some(f=>f.size<1||f.size>SOURCE_LIMITS.eachBytes))return "Each file must be smaller than 10 MB.";
  if(files.reduce((n,f)=>n+f.size,0)+already.reduce((n,f)=>n+f.fileSize,0)>SOURCE_LIMITS.totalBytes)
    return "Please keep the total attachments below 40 MB.";
  if(files.some(f=>!EXTENSIONS.has(f.name.split(".").pop()?.toLowerCase()||"")))
    return "Choose PDF, Word, PowerPoint, TXT, PNG or JPG files.";
  return null;
}

export async function uploadOrderSource(id:string,token:string,file:File):Promise<SourceRecord> {
  const data=new FormData();
  data.append("orderId",id);data.append("invoiceToken",token);data.append("file",file);
  const response=await fetch(SOURCE_UPLOAD_URL,{method:"POST",body:data});
  const body=await response.json() as {file?:SourceRecord;error?:string};
  if(!response.ok||!body.file)throw new Error(body.error||`Couldn't upload ${file.name}.`);
  return body.file;
}

export async function listOrderSources(id:string,token:string):Promise<SourceRecord[]> {
  const response=await fetch(SOURCE_UPLOAD_URL,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:"list",orderId:id,invoiceToken:token})
  });
  const body=await response.json() as {files?:SourceRecord[];error?:string};
  if(!response.ok||!body.files)throw new Error(body.error||"Couldn't load your files.");
  return body.files;
}

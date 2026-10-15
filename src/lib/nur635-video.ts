import {SUPABASE_URL} from "@/lib/config";

type SignedVideo = {available:boolean;url?:string;expiresIn?:number;error?:string};

/**
 * The video bucket is private. Each URL is signed only after Supabase checks
 * an active Owner session or a paid Advanced Pharmacology enrollment.
 */
export async function nur635VideoUrl(token:string,topic:number):Promise<string|null>{
 if(!token||!Number.isInteger(topic)||topic<1||topic>8)return null;
 const response=await fetch(`${SUPABASE_URL}/functions/v1/nur635-video-url`,{
  method:"POST",mode:"cors",cache:"no-store",
  headers:{"content-type":"application/json"},
  body:JSON.stringify({token,topic})
 });
 const body=await response.json() as SignedVideo;
 if(!response.ok)throw new Error(body.error||"Video access is temporarily unavailable.");
 if(!body.available)return null;
 if(!body.url||!body.url.startsWith(`${SUPABASE_URL}/storage/v1/object/sign/almanac-course-videos/`))
  throw new Error("Could not verify the private playback link.");
 return body.url;
}

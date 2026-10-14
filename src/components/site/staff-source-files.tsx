"use client";

import { useState } from "react";
import { SOURCE_UPLOAD_URL, type SourceRecord } from "@/lib/learning-source-files";

type Row=SourceRecord;

export function StaffSourceFiles({orderId,staffToken}:{orderId:string;staffToken:string}) {
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const [files,setFiles]=useState<Row[]>([]);
  const [error,setError]=useState("");
  const [downloading,setDownloading]=useState<string|null>(null);

  async function load(){
    if(open){setOpen(false);return;}
    setOpen(true);setLoading(true);setError("");
    try{
      const response=await fetch(SOURCE_UPLOAD_URL,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"staff_list",orderId,staffToken})
      });
      const body=await response.json() as {files?:Row[];error?:string};
      if(!response.ok||!body.files)throw new Error(body.error||"Unable to load attachments.");
      setFiles(body.files);
    }catch(e){setError(e instanceof Error?e.message:"Unable to load attachments.");}
    finally{setLoading(false);}
  }
  async function download(file:Row){
    setDownloading(file.id);setError("");
    try {
      const response=await fetch(SOURCE_UPLOAD_URL,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"staff_download",orderId,staffToken,fileId:file.id})
      });
      if(!response.ok)throw new Error("The file couldn't be downloaded.");
      const object=URL.createObjectURL(await response.blob());
      const a=document.createElement("a");
      a.href=object;a.download=file.fileName;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(object),5000);
    }catch(e){setError(e instanceof Error?e.message:"Download failed.");}
    finally{setDownloading(null);}
  }
  return <div className="mt-3">
    <button type="button" onClick={()=>void load()} className="min-h-10 text-sm font-semibold text-violet-700 underline">
      {open?"Hide submitted course files":"View submitted course files"} →
    </button>
    {open&&<div className="mt-2 rounded-xl border border-hairline bg-white p-3 text-sm">
      {loading?<p>Checking private attachments…</p>:files.length===0?<p className="text-ink-muted">No files uploaded yet.</p>:
        <ul className="space-y-3">
          {files.map(file=><li key={file.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-2">
            <div className="min-w-0 flex-1">
              <p className="break-all font-semibold">{file.fileName}</p>
              <p className="text-xs text-ink-muted">{(file.fileSize/1024/1024).toFixed(1)} MB · Source material</p>
            </div>
            <button type="button" disabled={downloading!==null}
              onClick={()=>void download(file)} className="rounded-full bg-lilac px-3 py-2 font-semibold text-violet-700 disabled:opacity-50">
              {downloading===file.id?"Preparing…":"Download"}
            </button>
          </li>)}
        </ul>
      }
      {error&&<p role="alert" className="mt-2 text-rose-ink">{error}</p>}
      <p className="mt-2 text-xs text-ink-muted">Files are private. Handle course materials only for the requested learning service, and check uploads before opening or processing them.</p>
    </div>}
  </div>;
}

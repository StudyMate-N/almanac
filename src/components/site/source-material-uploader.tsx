"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SOURCE_ACCEPT,SOURCE_LIMITS,checkSourceFiles,
  listOrderSources,uploadOrderSource,type SourceRecord,
} from "@/lib/learning-source-files";

export function SourceMaterialUploader({orderId,invoiceToken}:{
  orderId:string;invoiceToken:string;
}) {
  const [files,setFiles]=useState<SourceRecord[]>([]);
  const [pending,setPending]=useState<File[]>([]);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState("");
  const ref=useRef<HTMLInputElement|null>(null);

  const refresh=useCallback(async()=>{
    try{setFiles(await listOrderSources(orderId,invoiceToken));}
    catch{setNotice("We couldn't load your course files. Please refresh.");}
    finally{setLoading(false);}
  },[orderId,invoiceToken]);
  useEffect(()=>{void refresh();},[refresh]);

  function select(next:FileList|null){
    const selected=Array.from(next??[]);
    const invalid=checkSourceFiles(selected,files);
    if(invalid){setNotice(invalid);setPending([]);return;}
    setPending(selected);setNotice("");
  }
  async function upload(){
    if(busy||!pending.length)return;
    const invalid=checkSourceFiles(pending,files);
    if(invalid){setNotice(invalid);return;}
    setBusy(true);setNotice("");
    let good=0;
    for(const file of pending){
      try{await uploadOrderSource(orderId,invoiceToken,file);good++;}
      catch(e){setNotice((e instanceof Error?e.message:"Upload failed.")+" Your other files remain saved.");break;}
    }
    setPending([]);
    if(ref.current)ref.current.value="";
    await refresh();
    if(good===pending.length)setNotice(`${good} ${good===1?"file":"files"} uploaded securely. We'll use them to tailor your learning materials.`);
    setBusy(false);
  }

  return <section className="rounded-tile border border-hairline bg-white p-5 sm:p-7 print:hidden" aria-labelledby="course-files-h">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Recommended · Optional</p>
        <h2 id="course-files-h" className="mt-2 font-display text-2xl font-semibold">Add your course materials</h2>
      </div>
      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-ink-body">{files.length}/{SOURCE_LIMITS.count} files attached</span>
    </div>
    <p className="mt-3 text-sm text-ink-body">
      Share your syllabus, lecture slides, class notes, or course resources.
      We'll use them to match the package to your topics, learning objectives, and important dates.
      This is included in your package.
    </p>
    {loading?<p className="mt-4 text-sm text-ink-muted">Checking attachments…</p>:files.length>0&&
      <ul className="mt-4 space-y-2">
        {files.map(file=><li key={file.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-mist p-3 text-sm">
          <span className="break-all font-medium">{file.fileName}</span>
          <span className="text-ink-muted">{(file.fileSize/1024/1024).toFixed(1)} MB · Received</span>
        </li>)}
      </ul>
    }
    <label className="mt-5 block text-sm font-semibold">Choose additional documents
      <input ref={ref} type="file" multiple accept={SOURCE_ACCEPT} disabled={busy||files.length>=SOURCE_LIMITS.count}
        onChange={e=>select(e.target.files)} className="mt-2 block w-full rounded-xl border border-hairline bg-white p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lilac file:px-3 file:py-2 file:font-semibold file:text-violet-700"/>
    </label>
    <p className="mt-2 text-xs text-ink-muted">
      PDF, DOCX, PPTX, TXT, PNG, or JPG · Up to 8 files · 10 MB each · 40 MB total.
      Only share materials you're permitted to use. Don't upload passwords, IDs, or confidential student records.
    </p>
    {pending.length>0&&<div className="mt-4">
      <p className="text-sm text-ink-body">{pending.length} ready to upload.</p>
      <button type="button" disabled={busy} onClick={()=>void upload()}
        className="mt-2 min-h-12 rounded-full bg-violet px-6 font-semibold text-white disabled:opacity-50">
        {busy?"Uploading…":"Upload selected files →"}
      </button>
    </div>}
    {notice&&<p role="status" className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink-body">{notice}</p>}
    <p className="mt-4 text-xs text-ink-muted">
      You can return to this private invoice link to add files later.
      Files are held privately for authorized Almanac staff, and do not automatically expand the package scope.
    </p>
  </section>;
}

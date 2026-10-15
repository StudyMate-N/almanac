type Status = "received" | "awaiting_payment" | "in_production" | "review" | "delivered" | "cancelled";
export function StaffOrderTimeline({payment,plan,started,status}:{
 payment:string;plan?:string|null;started?:string|null;status:Status|string;
}){
 const verified=payment==="verified";
 const startedWork=Boolean(started)||status==="in_production"||status==="review"||status==="delivered";
 const underReview=status==="review"||status==="delivered";
 const delivered=status==="delivered";
 const stages=[
  {label:"Payment",done:verified,now:payment==="reported"},
  {label:"Learning plan",done:plan==="confirmed",now:verified&&plan!=="confirmed"&&!startedWork},
  {label:"Preparation",done:underReview,now:startedWork&&!underReview},
  {label:"Quality review",done:delivered,now:underReview&&!delivered},
  {label:"Release",done:delivered,now:delivered}
 ];
 return <div className="mt-4 overflow-x-auto rounded-[14px] border border-hairline bg-[#FBFAFE] px-4 py-4">
  <ol aria-label="Learning fulfillment stages" className="grid min-w-[530px] grid-cols-5 gap-2">
   {stages.map((s,i)=><li key={s.label} className="flex min-w-0 flex-col gap-2 text-center">
     <div className="flex items-center gap-1">
       {i>0&&<span aria-hidden="true" className="h-px min-w-0 flex-1 bg-[#D9D2F3]"/>}
       <span aria-label={s.done?"Complete":s.now?"In progress":"Pending"} className={`grid h-7 w-7 flex-none place-items-center rounded-full text-[11px] font-bold ${s.done?"bg-[#1E7A4F] text-white":s.now?"bg-[#FFE9DC] text-[#A8430A] ring-2 ring-[#F2711C]":"border border-[#C9BEF7] bg-white text-[#5E5775]"}`}>
         {s.done?"✓":i+1}
       </span>
       {i<stages.length-1&&<span aria-hidden="true" className="h-px min-w-0 flex-1 bg-[#D9D2F3]"/>}
     </div>
     <span className={`text-[11px] leading-tight ${s.done?"font-bold text-[#1E7A4F]":s.now?"font-bold text-[#A8430A]":"font-medium text-[#5E5775]"}`}>{s.label}</span>
    </li>)}
  </ol>
 </div>;
}

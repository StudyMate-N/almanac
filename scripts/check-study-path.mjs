// Non-transactional, deterministic study-path safety checks.
// Run: node --experimental-strip-types scripts/check-study-path.mjs
import assert from "node:assert/strict";
import { recommendStudyNextStep } from "../src/lib/study-path.ts";
const media=(id,kind,extra={})=>({id,kind,objectiveId:"o1",status:"released",approvedHash:"reviewed-sha",
  entitled:true,rightsCleared:true,accessible:true,...extra});
const base={objectiveId:"o1",startMode:"balanced",lowBandwidth:false,dueCardCount:0,missedReviewedItemCount:0,hasReviewedExplanation:true};
const cases=[
  ["no source, no recommendation",[],{action:"unavailable",mediaId:null,reasonCode:"not_ready"}],
  ["rejected unavailable source",[media("bad","text",{status:"blocked"})],{action:"unavailable",mediaId:null}],
  ["unapproved content hidden",[media("bad","text",{approvedHash:null})],{action:"unavailable",mediaId:null}],
  ["unlicensed content hidden",[media("bad","text",{rightsCleared:false})],{action:"unavailable",mediaId:null}],
  ["not entitled hidden",[media("bad","text",{entitled:false})],{action:"unavailable",mediaId:null}],
  ["inaccessible format hidden",[media("bad","text",{accessible:false})],{action:"unavailable",mediaId:null}],
  ["wrong objective hidden",[media("wrong","text",{objectiveId:"other"})],{action:"unavailable",mediaId:null}],
  ["safe default text first",[media("video","video"),media("text","text")],{action:"learn",mediaId:"text"}],
  ["preferred video first",[media("video","video"),media("text","text")],{action:"learn",mediaId:"video"},"video"],
  ["video fallback to text",[media("text","text")],{action:"learn",mediaId:"text"},"video"],
  ["review-due priority",[media("text","text"),media("due","flashcards")],{action:"revisit_due",mediaId:"due"},"balanced",false,3,0],
  ["missed practice explained",[media("text","text"),media("quiz","quiz")],{action:"explain_gap",mediaId:"text"},"practice",false,0,2],
  ["practice-first valid",[media("text","text"),media("quiz","quiz")],{action:"practise",mediaId:"quiz"},"practice"],
  ["low bandwidth avoids video",[media("video","video"),media("text","text")],{action:"learn",mediaId:"text"},"video",true],
  ["no music/game as compulsory fallback",[media("song","music"),media("game","game")],{action:"unavailable",mediaId:null}],
];
for(const [title,options,expected,startMode="balanced",lowBandwidth=false,dueCardCount=0,missedReviewedItemCount=0] of cases){
 const result=recommendStudyNextStep({...base,startMode,lowBandwidth,dueCardCount,missedReviewedItemCount,options});
 for(const [key,value] of Object.entries(expected))assert.deepEqual(result[key],value,`${title} - ${key}`);
 assert.equal(result.canOverride,true,title);
 assert.equal(result.evidenceOfMastery,false,title);
}
console.log("Passed "+cases.length+" learning-route authorization and user-agency checks.");

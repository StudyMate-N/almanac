import { createHash } from "node:crypto";

export const STATES = Object.freeze([
  "proposed","sourced","curriculum_mapped","ai_draft","automated_qa",
  "expert_review","approved","published","needs_sources","needs_license","rejected","superseded",
]);
export const ASSET_TYPES = Object.freeze([
  "lesson","question","flashcard","diagram","video","audio","case","simulation",
]);

const slug=/^[a-z][a-z0-9-]{2,100}$/;
const digest=/^[a-f0-9]{64}$/;
const fail=(errors,condition,message)=>{if(!condition)errors.push(message);};
const isText=(value)=>typeof value==="string" && value.trim().length>0;
const isHttps=(value)=>typeof value==="string" && /^https:\/\/[^\s]+$/.test(value);
const obj=(value)=>value!==null&&typeof value==="object"&&!Array.isArray(value);
const validCitation=(c)=>obj(c)&&isText(c.sourceId)&&isText(c.locator)&&isText(c.claim);
const validSource=(s)=>obj(s)&&slug.test(s.id??"")&&isText(s.title)&&isText(s.version)&&
  isHttps(s.url)&&["licensed","public-domain","original","permission-granted"].includes(s.rights)&&
  isText(s.rightsEvidence)&&digest.test(s.sha256??"");

/** Deterministic SHA-256 of the exact candidate bytes, not a hash of approval metadata. */
export function sourceSha256(bytes){return createHash("sha256").update(bytes).digest("hex");}

/**
 * Review permissions are intentionally not decided by this validator.
 * Staff review, evidence authenticity and ownership must be proven by the
 * protected backend, then anchored to the exact verified candidate digest.
 */
export function validateContentManifest(record) {
  const errors=[];
  if(!obj(record))return {valid:false,errors:["manifest must be an object"],publishable:false};
  fail(errors,record.schemaVersion===1,"schemaVersion must be 1");
  fail(errors,slug.test(record.assetId??""),"assetId must be a safe stable slug");
  fail(errors,slug.test(record.courseId??""),"courseId must be a safe stable slug");
  fail(errors,ASSET_TYPES.includes(record.assetType),"assetType must be supported");
  fail(errors,STATES.includes(record.state),"state must be a recognized lifecycle state");
  fail(errors,isText(record.objective),"objective must be concrete");
  fail(errors,isText(record.audience),"audience must be specified");
  fail(errors,obj(record.generation),"generation metadata must be present");
  if(obj(record.generation)){
    fail(errors,isText(record.generation.workflowVersion),"generation.workflowVersion is required");
    fail(errors,isText(record.generation.promptVersion),"generation.promptVersion is required");
    fail(errors,isText(record.generation.model),"generation.model must identify the model or 'human-only'");
  }
  fail(errors,digest.test(record.candidateSha256??""),"candidateSha256 must be SHA-256");
  fail(errors,Array.isArray(record.sources),"sources must be an array");
  fail(errors,Array.isArray(record.citations),"citations must be an array");
  if(Array.isArray(record.sources)){
    for(const [index,s] of record.sources.entries()){
      if(!validSource(s))errors.push(`sources[${index}] missing genuine evidence, rights or SHA-256`);
    }
    const ids=record.sources.map(s=>s?.id);
    fail(errors,new Set(ids).size===ids.length,"source IDs must be unique");
  }
  if(Array.isArray(record.citations)){
    for(const [index,c] of record.citations.entries()){
      if(!validCitation(c))errors.push(`citations[${index}] missing sourceId, locator or claim`);
      else if(!record.sources?.some(s=>s.id===c.sourceId))errors.push(`citations[${index}] cites unknown source`);
    }
  }
  const approved=["approved","published"].includes(record.state);
  const reviewer=obj(record.review)?record.review:null;
  const approvalOk=!!(reviewer&&isText(reviewer.reviewerId)&&
    isText(reviewer.credentialOrRole)&&reviewer.decision==="approved"&&
    reviewer.candidateSha256===record.candidateSha256&&
    isText(reviewer.reviewedAt)&&!Number.isNaN(Date.parse(reviewer.reviewedAt))&&
    isText(reviewer.attestationRef));
  if(approved){
    fail(errors,approvalOk,"approved/published assets need exact-version, traceable expert review");
    fail(errors,record.sources?.length>0,"approved/published assets need licensed sources");
    fail(errors,record.citations?.length>0,"approved/published assets need source-linked claims");
  }
  if(record.state==="published"){
    fail(errors,obj(record.release),"published assets need a release record");
    if(obj(record.release)){
      fail(errors,isText(record.release.releaseId),"releaseId required");
      fail(errors,record.release.candidateSha256===record.candidateSha256,"released digest must match approved candidate");
      fail(errors,record.release.entitlementRequired===true,"publication must require entitlement");
    }
  }
  // A formatted manifest alone can never prove reviewer identity or rights.
  // This flag indicates *only* local schema readiness for a later secure review.
  return {valid:errors.length===0,errors,publishable:false};
}

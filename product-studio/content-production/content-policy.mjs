/**
 * Content Studio release policy. Pure data validation, no model or network calls.
 * Every item is a candidate, never a learner-visible entitlement by itself.
 * A current subject expert must attest to the exact SHA-256 digest before a
 * publication bundle is eligible for a separate controlled release.
 */
import { createHash } from "node:crypto";

export const CONTENT_STAGES = Object.freeze([
  "proposed","sourced","curriculum_mapped","ai_draft","automated_qa",
  "expert_review","approved","published","superseded","rejected"
]);

const idPattern = /^[a-z][a-z0-9-]{2,119}$/;
const shaPattern = /^[a-f0-9]{64}$/;
const safeText = (v, max=600) => typeof v==="string" && v.trim().length>0 && v.length<=max;
const plainObj = v => v && typeof v==="object" && !Array.isArray(v);
const unique = array => new Set(array).size===array.length;

export function canonicalJSONString(value) {
  if (value===null || typeof value!=="object") return JSON.stringify(value);
  if (Array.isArray(value)) return "["+value.map(canonicalJSONString).join(",")+"]";
  return "{"+Object.keys(value).filter(k=>value[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+":"+canonicalJSONString(value[k])).join(",")+"}";
}

export function contentDigest(payload) {
  return createHash("sha256").update(canonicalJSONString(payload),"utf8").digest("hex");
}

/**
 * checkContentCandidate returns errors rather than silently repairing or
 * inventing provenance. Intended for authoring and CI before staff review.
 */
export function checkContentCandidate(candidate) {
  const errors=[];
  if(!plainObj(candidate))return ["candidate must be an object"];
  const {schemaVersion,id,courseId,stage,objective,sources,asset,provenance,review}=candidate;
  if(schemaVersion!==1)errors.push("schemaVersion must be 1");
  if(!idPattern.test(id??""))errors.push("id must be a stable slug");
  if(!idPattern.test(courseId??""))errors.push("courseId must be a stable slug");
  if(!CONTENT_STAGES.includes(stage))errors.push("unknown content lifecycle stage");
  if(!plainObj(objective)||!idPattern.test(objective.id??"")||!safeText(objective.statement))
    errors.push("explicit measurable objective required");
  if(!Array.isArray(sources)||sources.length===0)errors.push("at least one independently verifiable source required");
  else {
    if(!unique(sources.map(s=>s?.id)))errors.push("source IDs must be unique");
    sources.forEach((source,i)=>{
      if(!plainObj(source)||!idPattern.test(source.id??"")||!safeText(source.title)||!safeText(source.locator,2048))
        errors.push(`source ${i}: identifier, title and locator required`);
      if(!source||!["public-domain","open-license","licensed","permission-granted"].includes(source.rights))
        errors.push(`source ${i}: positive source usage rights evidence required`);
      if(!source||!safeText(source.rightsEvidence,2000))
        errors.push(`source ${i}: rights grant/reference required`);
      if(!source||!safeText(source.editionOrVersion))
        errors.push(`source ${i}: edition/version required`);
      if(!source||!safeText(source.checkedAt)||Number.isNaN(Date.parse(source.checkedAt)))
        errors.push(`source ${i}: verification timestamp required`);
    });
  }
  if(!plainObj(asset)||!["lesson","question","flashcard","case","diagram","audio","video"].includes(asset.type))
    errors.push("recognized asset type required");
  if(!plainObj(asset)||!safeText(asset.title)||!safeText(asset.body,250000))
    errors.push("nonempty asset title and body required");
  if(!plainObj(asset)||!Array.isArray(asset.claims)||asset.claims.length===0)
    errors.push("each asset must have at least one claim with source anchors");
  else for(const [i,claim] of asset.claims.entries()){
    if(!plainObj(claim)||!safeText(claim.text,5000)||!Array.isArray(claim.sourceIds)||!claim.sourceIds.length)
      errors.push(`claim ${i}: text and source anchors required`);
    else for(const sid of claim.sourceIds) if(!sources?.some(s=>s?.id===sid))
      errors.push(`claim ${i}: unknown source ${sid}`);
  }
  if(!plainObj(provenance)||!safeText(provenance.workflowVersion)||!safeText(provenance.promptVersion)||!safeText(provenance.modelId))
    errors.push("generation provenance required");
  if(!plainObj(provenance)||!safeText(provenance.sourceSnapshotId))
    errors.push("source snapshot must be recorded");
  if(!plainObj(review)||!["not_requested","needs_changes","rejected","approved"].includes(review.status))
    errors.push("explicit review status required");

  const digest=plainObj(asset)?contentDigest({id,courseId,objective,asset,sources}):null;
  const finalStage=["approved","published"].includes(stage);
  if(finalStage){
    if(review?.status!=="approved")errors.push("approved or published asset requires human review");
    if(!safeText(review?.reviewerId)||!safeText(review?.reviewerRole))
      errors.push("identifiable subject expert reviewer required");
    if(!safeText(review?.reviewedAt)||Number.isNaN(Date.parse(review?.reviewedAt??"")))
      errors.push("review timestamp required");
    if(!digest||review?.approvedDigest!==digest)
      errors.push("review approval must match exact current content SHA-256");
    if(provenance?.generatedByAI===true && review?.reviewerId===provenance?.authorId)
      errors.push("AI draft cannot self-approve its own generated output");
  }
  if(stage==="published"){
    if(!plainObj(candidate.release)||candidate.release.authorized!==true||
      !safeText(candidate.release.approvedBy)||!safeText(candidate.release.approvedAt)||
      Number.isNaN(Date.parse(candidate.release.approvedAt??"")))
      errors.push("publication requires independent human release authorization");
    if(candidate.release?.approvedDigest!==digest)
      errors.push("release approval must match exact current SHA-256");
  }
  return errors;
}

export function canPublishContent(candidate) {
  return candidate?.stage==="published" && checkContentCandidate(candidate).length===0;
}

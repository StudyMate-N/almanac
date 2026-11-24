// Review-only synthetic media gate. NOT an authorization service or live catalog.
// Inputs must originate from trusted server records, never client assertions.
const digest = x => typeof x === "string" && /^[a-f0-9]{64}$/.test(x);
const id = x => typeof x === "string" && x.trim().length > 0;
const kinds = ["text","video","audio","slides","quiz","flashcards","story","game","music"];
function eligible(a, c) {
  return !!a && !!c && c.backendVerified === true &&
    [a.id,a.courseId,a.objectiveId,a.sourceId,a.sourceVersion,c.learnerId,c.courseId,c.objectiveId].every(id) &&
    a.courseId === c.courseId && a.objectiveId === c.objectiveId &&
    Array.isArray(c.entitlements) && c.entitlements.some(e => e.active === true && e.learnerId === c.learnerId && e.courseId === a.courseId && e.assetId === a.id) &&
    kinds.includes(a.kind) && a.status === "released" && a.retrievable === true && a.accessible === true &&
    ["owned_original","permission_confirmed","open_licensed"].includes(a.rightsStatus) &&
    Array.isArray(a.rightsScope) && a.rightsScope.includes("private") &&
    digest(a.sourceDigest) && digest(a.mediaDigest) &&
    a.approval?.sourceId === a.sourceId && a.approval?.sourceVersion === a.sourceVersion &&
    a.approval?.sourceDigest === a.sourceDigest && a.approval?.mediaDigest === a.mediaDigest &&
    a.approval?.assetId === a.id && a.approval?.courseId === a.courseId && a.approval?.objectiveId === a.objectiveId;
}
function available(a, records, context) {
  if (!eligible(a, context)) return false;
  if (a.kind === "text") return true;
  const matches = records.filter(b => b.id === a.alternativeId);
  return matches.length === 1 && matches[0].kind === "text" && matches[0].id !== a.id && eligible(matches[0],context);
}
// Synthetic fixtures only. Digests are placeholders, not computed asset hashes.
const d = "a".repeat(64), m = "b".repeat(64);
const base = {courseId:"course",objectiveId:"objective",sourceId:"source",sourceVersion:"1",sourceDigest:d,mediaDigest:m,status:"released",retrievable:true,accessible:true,rightsStatus:"owned_original",rightsScope:["private"]};
const asset = (id,kind) => ({...base,id,kind,approval:{assetId:id,courseId:base.courseId,objectiveId:base.objectiveId,sourceId:base.sourceId,sourceVersion:base.sourceVersion,sourceDigest:d,mediaDigest:m}});
const textAsset = asset("text","text"), video = {...asset("video","video"),alternativeId:"text"};
const context = {backendVerified:true,learnerId:"learner",courseId:"course",objectiveId:"objective",entitlements:["text","video"].map(assetId=>({assetId,learnerId:"learner",courseId:"course",active:true}))};
const check = (a=video, records=[textAsset,video], c=context) => available(a,records,c);
const cases = [
 ["valid synthetic video",check(),true],
 ["valid text",check(textAsset),true],
 ["stale media digest",check({...video,mediaDigest:"c".repeat(64)}),false],
 ["stale source version",check({...video,sourceVersion:"2"}),false],
 ["unlicensed",check({...video,rightsStatus:"link_only"}),false],
 ["wrong scope",check({...video,rightsScope:["public"]}),false],
 ["draft",check({...video,status:"approved"}),false],
 ["missing file",check({...video,retrievable:false}),false],
 ["no text alternative",check(video,[video]),false],
 ["unapproved alternative",check(video,[{...textAsset,status:"draft"},video]),false],
 ["duplicate alternative",check(video,[textAsset,textAsset,video]),false],
 ["wrong learner",check(video,[textAsset,video],{...context,learnerId:"other",preview:true}),false],
 ["backend unavailable",check(video,[textAsset,video],{...context,backendVerified:false}),false],
 ["no alternative entitlement",check(video,[textAsset,video],{...context,entitlements:context.entitlements.slice(1)}),false],
 ["wrong objective",check({...video,objectiveId:"other"}),false],
 ["changed source digest",check({...video,sourceDigest:"c".repeat(64)}),false],
 ["inaccessible",check({...video,accessible:false}),false],
 ["missing approval",check({...video,approval:null}),false],
 ["preference invariance",check(video,[textAsset,video],{...context,startMode:"reading",lowBandwidth:true}),true]
];
for (const [name,actual,expected] of cases) if(actual!==expected) throw new Error(name);
console.log(cases.length+" synthetic checks passed");

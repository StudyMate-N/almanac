import assert from "node:assert/strict";
import test from "node:test";
import { sourceSha256, validateContentManifest } from "../product-studio/content-production/validate-manifest.mjs";

const sampleDigest=sourceSha256(Buffer.from("Reference source sample bytes for validator test only. No teaching claims."));
const manuscriptDigest=sourceSha256(Buffer.from("Draft sample content placeholder, not approved for students."));
const base={
  schemaVersion:1,
  assetId:"almanac-qa-draft",
  courseId:"advanced-pathophysiology",
  assetType:"lesson",
  state:"ai_draft",
  objective:"Explain the relationship between a defined concept and its mechanism.",
  audience:"Graduate nursing learners",
  candidateSha256:manuscriptDigest,
  generation:{workflowVersion:"content-studio-v0.1",promptVersion:"prompt-v0.1",model:"human-only"},
  sources:[{id:"qa-source",title:"Synthetic test source",version:"2026-test",url:"https://example.invalid/source",rights:"original",rightsEvidence:"Synthetic test fixture, not a real teaching license",sha256:sampleDigest}],
  citations:[{sourceId:"qa-source",locator:"fixture-line-1",claim:"Only a synthetic validator demonstration."}],
  review:null,
  release:null,
};
const clone=x=>structuredClone(x);
test("SHA-256 is deterministic and byte sensitive",()=>{
  assert.equal(sourceSha256(Buffer.from("abc")),"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.notEqual(sourceSha256("a"),sourceSha256("a "));
});
test("unreviewed draft with evidence-shaped metadata is valid but never publishable",()=>{
  const result=validateContentManifest(base);
  assert.deepEqual(result,{valid:true,errors:[],publishable:false});
});
test("invented source IDs or empty rights evidence are rejected",()=>{
  const broken=clone(base);
  broken.sources[0].rightsEvidence="";
  broken.citations[0].sourceId="unknown-source";
  const checked=validateContentManifest(broken);
  assert.equal(checked.valid,false);
  assert.ok(checked.errors.some(x=>x.includes("rights")));
  assert.ok(checked.errors.some(x=>x.includes("unknown source")));
});
test("no source, no citation and no reviewer cannot masquerade as approved",()=>{
  const broken={...base,state:"approved",sources:[],citations:[],review:null};
  const checked=validateContentManifest(broken);
  assert.equal(checked.valid,false);
  assert.ok(checked.errors.length>=3);
});
test("changed manuscript invalidates a previous review",()=>{
  const broken={...clone(base),state:"approved",review:{
    reviewerId:"test-reviewer",credentialOrRole:"subject expert",decision:"approved",
    reviewedAt:"2026-11-24T00:00:00Z",attestationRef:"test-attestation",
    candidateSha256:sampleDigest
  }};
  assert.equal(validateContentManifest(broken).valid,false);
  assert.ok(validateContentManifest(broken).errors.some(x=>x.includes("exact-version")));
});
test("a review-shaped record remains non-publishable without secure identity verification",()=>{
  const candidate={...clone(base),state:"approved",review:{
    reviewerId:"test-reviewer",credentialOrRole:"subject expert",decision:"approved",
    reviewedAt:"2026-11-24T00:00:00Z",attestationRef:"test-attestation",
    candidateSha256:manuscriptDigest
  }};
  assert.deepEqual(validateContentManifest(candidate),{valid:true,errors:[],publishable:false});
});
test("published content needs exact candidate digest and entitlement requirement",()=>{
  const broken={...clone(base),state:"published",review:{
    reviewerId:"test-reviewer",credentialOrRole:"subject expert",decision:"approved",
    reviewedAt:"2026-11-24T00:00:00Z",attestationRef:"test-attestation",
    candidateSha256:manuscriptDigest
  },release:{releaseId:"test-release",candidateSha256:sampleDigest,entitlementRequired:false}};
  const checked=validateContentManifest(broken);
  assert.equal(checked.valid,false);
  assert.ok(checked.errors.some(x=>x.includes("released digest")));
  assert.ok(checked.errors.some(x=>x.includes("entitlement")));
});
test("invalid asset identifiers, formats and missing generation information are rejected",()=>{
  const broken={...clone(base),assetId:"../../escape",assetType:"unsupported",generation:{},candidateSha256:"123"};
  assert.equal(validateContentManifest(broken).valid,false);
  assert.ok(validateContentManifest(broken).errors.length>=4);
});

// Safe unit checks for the production Netlify/OpenNext origin mismatch.
// No network calls, customer records, secrets, or orders are involved.
import assert from "node:assert/strict";
import { approvedRequestOrigin, emailLoginBaseUrl } from "../src/lib/request-origin.ts";

const request=(url,origin)=>({
 url, headers: { get: (name) => name==="origin" ? origin : null }
});
const internal="http://127.0.0.1:9000/api/learning-requests";
const live="https://almanac-study.netlify.app";
const approved=request(internal,live);
assert.equal(approvedRequestOrigin(approved),true,"Production site must work behind internal proxy URL");
assert.equal(emailLoginBaseUrl(approved),live,"Access emails must link to the public site");
assert.equal(approvedRequestOrigin(request(internal,"https://evil.example")),false,"Cross-site browser origin must be denied");
assert.equal(approvedRequestOrigin(request(internal,live+".evil.example")),false,"Hostname lookalikes must be denied");
assert.equal(approvedRequestOrigin(request(live+"/api/learning-requests",live)),true,"Direct production URLs must work");
assert.equal(approvedRequestOrigin(request("http://localhost:3000/api/learning-requests","http://localhost:3000")),true,"Local development must work");
assert.equal(emailLoginBaseUrl(request(internal,null)),live,"Server requests must not embed internal proxy URLs in access emails");
assert.equal(approvedRequestOrigin(request(internal,null)),true,"Non-browser API clients remain allowed by the existing policy");
const original=process.env.DEPLOY_URL;
try{
 process.env.DEPLOY_URL="https://deploy-preview-3--almanac-study.netlify.app";
 assert.equal(approvedRequestOrigin(request(internal,process.env.DEPLOY_URL)),true,"Netlify deploy preview must work");
}finally{
 if(original===undefined)delete process.env.DEPLOY_URL;
 else process.env.DEPLOY_URL=original;
}
console.log("Passed origin validation and correct public access-link tests.");

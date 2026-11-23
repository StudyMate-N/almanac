import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { examineCreemWebhook, verifyCreemWebhookSignature } from "../src/lib/payments/creem-verification.ts";
import { evaluateCreemCheckout, ALMANAC_CREEM_APPROVED_OFFERS } from "../src/lib/payments/creem-checkout-policy.ts";

const secret="test-only-creem-signing-secret-not-real";
const event={
  id:"evt_test_001",
  eventType:"checkout.completed",
  object:{
    id:"ch_test_001",
    object:"checkout",
    mode:"test",
    status:"completed",
    product:{id:"prod_training_001",name:"Mock Almanac course"},
    order:{id:"ord_test_001",status:"paid",amount:4900,currency:"USD"},
    customer:{email:"sensitive-learner@example.invalid",name:"Sensitive Learner"},
    metadata:{accessToken:"PRIVATE_TOKEN_DO_NOT_COPY"}
  }
};
const sign=raw=>createHmac("sha256",secret).update(raw).digest("hex");
const raw=JSON.stringify(event);
const signature=sign(raw);

test("Creem signatures authenticate original raw bytes and reject tampering",()=>{
  assert.equal(verifyCreemWebhookSignature(raw,signature,secret),true);
  assert.equal(verifyCreemWebhookSignature(raw+" ",signature,secret),false);
  assert.equal(verifyCreemWebhookSignature(raw,"0".repeat(64),secret),false);
  assert.equal(verifyCreemWebhookSignature(raw,"xyz",secret),false);
  assert.equal(verifyCreemWebhookSignature(raw,signature,"wrong-secret"),false);
  assert.equal(verifyCreemWebhookSignature(raw,null,secret),false);
});

test("signed checkout produces minimal evidence but never auto-fulfills",()=>{
  const checked=examineCreemWebhook(raw,signature,secret);
  assert.equal(checked.verified,true);
  assert.equal(checked.fulfillmentAllowed,false);
  if (!checked.verified) throw Error("expected verified event");
  assert.deepEqual(checked.evidence,{
    provider:"creem",
    eventId:"evt_test_001",
    eventType:"checkout.completed",
    checkoutId:"ch_test_001",
    orderId:"ord_test_001",
    productId:"prod_training_001",
    mode:"test",
    status:"paid"
  });
  assert.equal(JSON.stringify(checked).includes("Sensitive Learner"),false);
  assert.equal(JSON.stringify(checked).includes("PRIVATE_TOKEN_DO_NOT_COPY"),false);
});

test("invalid body and incomplete payment are rejected even when signed",()=>{
  assert.equal(examineCreemWebhook("not json",sign("not json"),secret).verified,false);
  for(const mutation of [
    {...event,object:{...event.object,status:"pending"}},
    {...event,object:{...event.object,order:{id:"ord_test_001",status:"unpaid"}}},
    {...event,object:{...event.object,product:{id:"bad"}}},
    {...event,eventType:"refund.created"}
  ]){
    const text=JSON.stringify(mutation);
    assert.equal(examineCreemWebhook(text,sign(text),secret).verified,false);
  }
});

const example={
  slug:"reviewed-course-pilot",
  productId:"prod_training_001",
  currency:"USD",
  amountMinor:4900,
  productType:"prebuilt-course",
  status:"approved",
  rightsCleared:true
};
const policy={
  requestedSlug:example.slug,environment:"test",
  merchantApproved:true,paymentReleaseApproved:true,
  authenticatedLearner:true,offers:[example]
};

test("checkout is disabled when merchant, release, login or listing is missing",()=>{
  assert.equal(ALMANAC_CREEM_APPROVED_OFFERS.length,0);
  assert.equal(evaluateCreemCheckout({...policy,paymentReleaseApproved:false}).reason,"checkout_disabled");
  assert.equal(evaluateCreemCheckout({...policy,merchantApproved:false}).reason,"merchant_unapproved");
  assert.equal(evaluateCreemCheckout({...policy,authenticatedLearner:false}).reason,"not_authenticated");
  assert.equal(evaluateCreemCheckout({...policy,offers:[]}).reason,"offer_unavailable");
  assert.equal(evaluateCreemCheckout({...policy,requestedSlug:"../../secret"}).reason,"invalid_offer");
});

test("approved fixed-priced and rights-cleared products alone pass pure policy",()=>{
  const accepted=evaluateCreemCheckout(policy);
  assert.equal(accepted.allowed,true);
  if(!accepted.allowed)throw Error("unreachable");
  assert.equal(accepted.offer.productId,example.productId);
  assert.equal(accepted.offer.amountMinor,4900);
  assert.equal(accepted.environment,"test");
  for(const offer of [
    {...example,status:"draft"},
    {...example,rightsCleared:false},
    {...example,productId:"not-a-product-id"},
    {...example,amountMinor:0},
    {...example,productType:"bespoke-service"}
  ]){
    assert.equal(evaluateCreemCheckout({...policy,offers:[offer]}).allowed,false);
  }
});

test("legacy checkout remains hard-paused while Creem is unconfigured",()=>{
  const handler=readFileSync("src/app/api/learning-requests/route.ts","utf8");
  assert.match(handler,/checkout_paused/);
  const userFacing=readFileSync("src/app/request/page.tsx","utf8");
  assert.doesNotMatch(userFacing,/<RequestBuilder/);
  assert.equal(ALMANAC_CREEM_APPROVED_OFFERS.length,0);
  // No Creem live API calls or access-grant methods are implemented here.
});

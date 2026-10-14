import assert from "node:assert/strict";
import {
  calculateQuote, parseLearningRequest, OfferValidationError, OFFERS,
  EMPTY_ENHANCEMENTS, ENHANCEMENTS, isSpeedAvailable
} from "../src/lib/learning-offers.ts";

const packages={ resource:[49,69,93], exam:[149,209,283], course:[399,559,758] };
for(const [kind,expected] of Object.entries(packages)){
  ["standard","priority","express"].forEach((speed,i)=>{
    assert.equal(calculateQuote({kind,speed,enhancements:{...EMPTY_ENHANCEMENTS}}).totalUsd,expected[i],kind+" "+speed);
  });
}
assert.equal(OFFERS.resource.title,"Focused Study Module");
assert.equal(OFFERS.resource.summary.includes("module"),true);
assert.equal(OFFERS.exam.includes.some(x=>x.includes("4 defined course modules")),true);
assert.equal(OFFERS.course.summary.includes("eight clearly defined course modules"),true);
assert.equal(ENHANCEMENTS.unit.title,"Additional complete learning module");
assert.equal(OFFERS.course.includes.some(x=>x.includes("8 narrated video overviews")),true);
assert.equal(OFFERS.course.includes.some(x=>x.includes("120 practice questions")),true);
assert.equal(OFFERS.exam.includes.some(x=>x.includes("50-question exam simulation")),true);
assert.equal(ENHANCEMENTS.deep_video.unitUsd,35);
assert.equal(ENHANCEMENTS.exam_sim.unitUsd,39);
assert.equal(ENHANCEMENTS.unit.unitUsd,59);
assert.equal(calculateQuote({kind:"course",speed:"standard",enhancements:{deep_video:2,exam_sim:1,unit:4}}).totalUsd,744);
assert.equal(calculateQuote({kind:"exam",speed:"standard",enhancements:{deep_video:2,exam_sim:2,unit:0}}).totalUsd,297);
assert.equal(calculateQuote({kind:"resource",speed:"standard",enhancements:{deep_video:1,exam_sim:0,unit:0}}).totalUsd,84);
assert.equal(isSpeedAvailable("course","express",{deep_video:0,exam_sim:0,unit:0}),false);
assert.throws(()=>parseLearningRequest({...valid,speed:"express",enhancements:{deep_video:0,exam_sim:0,unit:0}}),OfferValidationError);
assert.equal(isSpeedAvailable("course","express",{deep_video:0,exam_sim:0,unit:1}),false);
assert.equal(isSpeedAvailable("course","priority",{deep_video:0,exam_sim:0,unit:4}),false);
assert.equal(isSpeedAvailable("course","standard",{deep_video:0,exam_sim:0,unit:4}),true);

const valid={
  kind:"course",speed:"standard",deliveryMethod:"both",
  courseId:"advanced-pharmacology",subject:"Advanced Pharmacology",
  goal:"Prepare a structured study course with practice.",
  name:"Alex Learner",email:"ALEX@example.com",
  learningPreference:"video",termsAccepted:true,enhancements:{deep_video:1,exam_sim:2,unit:2},
};
const parsed=parseLearningRequest(valid);
assert.deepEqual(parsed.enhancements,{deep_video:1,exam_sim:2,unit:2});
assert.equal(parsed.email,"alex@example.com");
assert.equal(parsed.learningPreference,"video");
assert.throws(()=>parseLearningRequest({...valid,email:"invalid"}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,enhancements:{...valid.enhancements,slides:1}}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,enhancements:{...valid.enhancements,unit:5}}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,enhancements:{...valid.enhancements,unit:0,deep_video:1.5}}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,kind:"resource"}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,speed:"express",enhancements:{deep_video:0,exam_sim:0,unit:1}}),OfferValidationError);
assert.throws(()=>parseLearningRequest({...valid,learningPreference:"wrong"}),OfferValidationError);
console.log("Almanac complete-package quotes, quantities, preferences and validation passed.");

/**
 * NGN-style unfolding case study built on Foundations lesson 4. Six items,
 * one per step of the NCSBN Clinical Judgment Measurement Model. Original.
 *
 * Scoring: highlight and multiple response use plus-minus (+1 per correct
 * selection, -1 per incorrect selection, floor 0); matrix and drop-down cloze
 * score 0/1 per row or drop-down.
 */
import type { CaseStudy } from "./types";

export const heartFailureCase: CaseStudy = {
  id: "case-hf",
  moduleId: "f",
  lessonId: "f-04",
  title: "A 72-year-old with worsening breathlessness",
  intro:
    "A 72-year-old man comes to the emergency department with three days of worsening shortness of breath and tiredness. He has hypertension and a sedentary job, and his father had heart failure.",
  source:
    "2022 AHA/ACC/HFSA heart failure guideline; McCance & Huether, Pathophysiology: Alterations of cardiovascular function; NCSBN Clinical Judgment Measurement Model.",
  stages: [
    {
      item: {
        kind: "highlight",
        id: "hf-1",
        step: "Recognize cues",
        prompt: "Highlight the findings that require immediate follow-up.",
        parts: [
          "0900. Client reports feeling tired and ",
          { id: "orthopnea", text: "short of breath when lying flat" },
          "; he sleeps on three pillows. ",
          { id: "pain", text: "Denies chest pain" },
          ". ",
          { id: "oriented", text: "Alert and oriented" },
          ". ",
          { id: "bp", text: "BP 168/94 mmHg" },
          ", ",
          { id: "hr", text: "HR 104/min" },
          ", ",
          { id: "rr", text: "RR 26/min" },
          ", ",
          { id: "spo2", text: "SpO2 89% on room air" },
          ", ",
          { id: "temp", text: "temperature 36.8 °C" },
          ". ",
          { id: "crackles", text: "Crackles in both lung bases" },
          ". ",
          { id: "edema", text: "2+ pitting edema of both ankles" },
          ". ",
          { id: "cap", text: "Capillary refill 2 seconds" },
          ". ",
          { id: "weight", text: "Weight 4 kg above his usual" },
          ". ",
          { id: "skin", text: "Skin warm and dry" },
          ". ",
          { id: "glucose", text: "Bedside glucose 118 mg/dL" },
          ". ",
          { id: "diet", text: "Eats fast food most days" },
          ".",
        ],
        correct: ["orthopnea", "bp", "hr", "rr", "spo2", "crackles", "edema", "weight"],
        rationale:
          "Immediate follow-up: orthopnea, crackles and SpO2 89% (fluid in the lungs and low oxygen); RR 26/min and HR 104/min (compensating for hypoxemia and low output); 2+ ankle edema and a 4 kg weight gain (fluid retention); BP 168/94 mmHg (raises afterload on a failing heart). No immediate follow-up: no chest pain, alert and oriented, temperature 36.8 °C, capillary refill 2 seconds, warm dry skin and glucose 118 mg/dL are expected or reassuring. Eating fast food matters for later teaching but is not urgent.",
      },
    },
    {
      update:
        "Further assessment: neck veins distended at 45 degrees; liver edge palpable 3 cm below the right costal margin.",
      item: {
        kind: "matrix",
        id: "hf-2",
        step: "Analyze cues",
        prompt:
          "For each finding, specify whether it is more consistent with left-sided heart failure (pulmonary congestion) or right-sided heart failure (systemic venous congestion).",
        columns: ["Left-sided (pulmonary)", "Right-sided (systemic)"],
        rows: [
          { id: "r1", text: "Short of breath when lying flat", correct: 0 },
          { id: "r2", text: "2+ pitting ankle edema", correct: 1 },
          { id: "r3", text: "Crackles in both lung bases", correct: 0 },
          { id: "r4", text: "Distended neck veins", correct: 1 },
          { id: "r5", text: "SpO2 89% on room air", correct: 0 },
          { id: "r6", text: "Palpable, enlarged liver edge", correct: 1 },
        ],
        rationale:
          "Left-sided: a failing left ventricle backs blood into the lungs, causing orthopnea, crackles and low oxygen saturation. Right-sided: a failing right ventricle backs blood into the systemic veins, causing ankle edema, distended neck veins and an enlarged liver.",
      },
    },
    {
      update:
        "Results: BNP 1,150 pg/mL. Chest X-ray shows an enlarged heart and congested lungs. Echocardiogram shows a left ventricular ejection fraction of 30%.",
      item: {
        kind: "cloze",
        id: "hf-3",
        step: "Prioritize hypotheses",
        prompt: "Complete the sentence by choosing from the lists.",
        parts: [
          "The client is most likely experiencing ",
          {
            id: "d1",
            options: ["an exacerbation of COPD", "heart failure with reduced ejection fraction", "pneumonia", "pulmonary embolism"],
            correct: 1,
          },
          ", as shown by ",
          {
            id: "d2",
            options: [
              "an SpO2 of 89% with a respiratory rate of 26/min",
              "crackles in both lung bases with a normal temperature",
              "a BNP of 1,150 pg/mL with an ejection fraction of 30%",
              "a heart rate of 104/min with a BP of 168/94 mmHg",
            ],
            correct: 2,
          },
          ". The priority problem is ",
          {
            id: "d3",
            options: [
              "activity intolerance from fatigue and breathlessness",
              "lack of knowledge about a low-sodium diet",
              "risk of falls from urgency during diuresis",
              "impaired gas exchange from fluid in the lungs",
            ],
            correct: 3,
          },
          ".",
        ],
        rationale:
          "First blank: heart failure with reduced ejection fraction fits the raised BNP, an ejection fraction of 30%, the enlarged heart and congested lungs. Pneumonia is unlikely without fever and with congestion rather than consolidation. Pulmonary embolism does not explain the low ejection fraction or edema, and nothing points to COPD. Second blank: only a raised BNP with an ejection fraction of 30% is specific; the other pairs fit several of the choices. Third blank: oxygenation comes first. Activity intolerance, falls risk and diet teaching matter but follow breathing.",
      },
    },
    {
      item: {
        kind: "multi",
        id: "hf-4",
        step: "Generate solutions",
        prompt: "Which orders does the nurse anticipate for this client? Select all that apply.",
        options: [
          { id: "a", text: "1 L normal saline bolus" },
          { id: "b", text: "IV furosemide" },
          { id: "c", text: "Daily weight at the same time each morning" },
          { id: "d", text: "Keep the head of the bed flat to rest the heart" },
          { id: "e", text: "Oxygen to keep SpO2 at 92% or higher" },
          { id: "f", text: "Ibuprofen as needed for discomfort" },
          { id: "g", text: "Strict intake and output" },
          { id: "h", text: "Diet that avoids excess sodium" },
        ],
        correct: ["b", "c", "e", "g", "h"],
        rationale:
          "Saline bolus: no, it adds volume to a client who is already overloaded. IV furosemide: yes, a loop diuretic removes excess fluid. Daily weight: yes, it tracks fluid loss. Flat head of bed: no, lying flat worsens orthopnea; raise the head of the bed. Oxygen: yes, it treats the hypoxemia. Ibuprofen: no, NSAIDs cause sodium and water retention and worsen heart failure. Intake and output: yes, they track the response to diuresis. Avoiding excess sodium: yes, it is reasonable to ease congestion, although strict limits have not been shown to improve outcomes.",
      },
    },
    {
      update:
        "Day 3. He has lost 3 kg and breathes more easily. He reports leg cramps and a 'fluttering' in his chest. Potassium is 3.0 mEq/L. The ECG shows flattened T waves and U waves.",
      item: {
        kind: "cloze",
        id: "hf-5",
        step: "Take action",
        prompt: "Complete the sentence by choosing from the lists.",
        parts: [
          "The findings show ",
          {
            id: "a1",
            options: [
              "worsening heart failure",
              "a sequela of his hypertension",
              "hyperkalemia caused by the loop diuretic",
              "hypokalemia caused by the loop diuretic",
            ],
            correct: 3,
          },
          ". The nurse's best action is to ",
          {
            id: "a2",
            options: [
              "give the next furosemide dose, encourage bananas and recheck potassium tomorrow",
              "hold the next furosemide dose, start cardiac monitoring and notify the provider",
              "hold the next furosemide dose, give potassium from ward stock and document it",
              "increase oxygen to 6 L/min, raise the head of the bed and repeat the ECG later",
            ],
            correct: 1,
          },
          ".",
        ],
        rationale:
          "First blank: leg cramps, palpitations, flattened T waves and U waves with a potassium of 3.0 mEq/L show hypokalemia, an iatrogenic effect of the loop diuretic. Hyperkalemia reverses the direction; he is breathing more easily and has lost weight, so heart failure is not worsening; hypertension does not explain a low potassium. Second blank: hypokalemia can trigger dysrhythmias, so the nurse holds the next dose, starts cardiac monitoring and notifies the provider. Giving the dose deepens the hypokalemia and diet alone is too slow; potassium replacement needs a provider's order for dose and route; oxygen does not treat the cause. Expect magnesium to be checked and replaced too: loop diuretics waste magnesium, and low magnesium makes potassium hard to correct.",
      },
    },
    {
      update: "Day 5. The provider replaced his potassium, adjusted his diuretic and started guideline-directed therapy.",
      item: {
        kind: "matrix",
        id: "hf-6",
        step: "Evaluate outcomes",
        prompt: "For each finding, specify whether it shows the client's condition has improved, not changed or declined.",
        columns: ["Improved", "No change", "Declined"],
        rows: [
          { id: "e1", text: "Lungs clear on auscultation", correct: 0 },
          { id: "e2", text: "2+ ankle edema, unchanged from admission", correct: 1 },
          { id: "e3", text: "Potassium 4.1 mEq/L", correct: 0 },
          { id: "e4", text: "New confusion with BP 86/50 mmHg", correct: 2 },
          { id: "e5", text: "SpO2 96% on room air", correct: 0 },
          { id: "e6", text: "Weight 4 kg below admission weight", correct: 0 },
        ],
        rationale:
          "Improved: clear lungs, potassium 4.1 mEq/L, SpO2 96% and the 4 kg weight loss show congestion and hypokalemia have resolved. No change: edema at the admission level shows systemic congestion persists. Declined: new confusion with a BP of 86/50 mmHg signals poor perfusion. It may come from removing too much fluid or from the newly started blood-pressure-lowering drugs, and it needs to be reported at once.",
      },
    },
  ],
};

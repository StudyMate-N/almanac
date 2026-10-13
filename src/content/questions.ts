/**
 * Practice questions. Original items written to each lesson's objective;
 * nothing is taken from a school exam, publisher test bank or recalled item.
 * Each item has passed the four reviewer agents (clinical accuracy, item
 * writing, alignment, integrity) and still needs the nurse reviewer's
 * approval before students see it.
 */
import type { Question } from "./types";

export const foundationsQuestions: Question[] = [
  {
    "id": "fq-01-1",
    "moduleId": "f",
    "lessonId": "f-01",
    "topic": "Homeostasis and allostasis",
    "type": "multiple",
    "level": "application",
    "stem": "A client who lost blood after a fall has a blood pressure of 96/60 mmHg, heart rate of 122/min, cool pale skin and urine output of 20 mL/hr. Hemoglobin drawn 20 minutes after the injury is 13.6 g/dL.",
    "ask": "Which findings reflect the body's attempt to restore homeostasis? Select all that apply.",
    "correct": [
      "b",
      "d",
      "e"
    ],
    "options": [
      {
        "id": "a",
        "text": "Blood pressure of 96/60 mmHg",
        "rationale": "Incorrect. The low pressure is the disturbance. The other responses are what keep it from falling further."
      },
      {
        "id": "b",
        "text": "Heart rate of 122/min",
        "rationale": "Correct. Sympathetic activation raises heart rate to keep cardiac output up as volume falls."
      },
      {
        "id": "c",
        "text": "Hemoglobin of 13.6 g/dL",
        "rationale": "Incorrect. Soon after acute bleeding, whole blood is lost, so hemoglobin can still read normal. It is not a compensatory response and does not show how much blood was lost."
      },
      {
        "id": "d",
        "text": "Cool, pale skin",
        "rationale": "Correct. Peripheral vasoconstriction shunts blood from the skin to the heart and brain."
      },
      {
        "id": "e",
        "text": "Urine output of 20 mL/hr",
        "rationale": "Correct. In early blood loss, ADH and aldosterone make the kidneys conserve water and sodium. Persistent low output can later signal kidney injury."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Stress and disease; Shock.",
    "clip": 216
  },
  {
    "id": "fq-01-2",
    "moduleId": "f",
    "lessonId": "f-01",
    "topic": "Pathology vs pathophysiology",
    "type": "single",
    "level": "recall",
    "stem": "A classmate says pathology and pathophysiology are two names for the same subject.",
    "ask": "Which statement best distinguishes the two?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Pathology studies disease in populations; pathophysiology studies disease in one person.",
        "rationale": "Incorrect. Disease in populations is epidemiology. Pathology and pathophysiology both study disease in individuals."
      },
      {
        "id": "b",
        "text": "Pathophysiology studies how disease alters function; pathology studies the structural changes.",
        "rationale": "Correct. The 'physio' in pathophysiology refers to function; pathology describes changes in cells and tissues."
      },
      {
        "id": "c",
        "text": "Pathology studies the causes of disease; pathophysiology studies how disease is treated.",
        "rationale": "Incorrect. Causes are etiology; treatment belongs to pharmacology and therapeutics."
      },
      {
        "id": "d",
        "text": "Pathophysiology studies normal body function; pathology studies function in disease.",
        "rationale": "Incorrect. Normal function is physiology, and pathology centers on structure, not function."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 100
  },
  {
    "id": "fq-01-3",
    "moduleId": "f",
    "lessonId": "f-01",
    "topic": "Homeostasis and allostasis",
    "type": "single",
    "level": "application",
    "stem": "A client has worked rotating night shifts under heavy stress for many years. She now has hypertension, raised fasting glucose and central weight gain.",
    "ask": "Which concept best explains how her stress response contributed to these problems?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Homeostasis",
        "rationale": "Incorrect. Homeostasis is the maintenance of stable ranges; these findings show it is failing."
      },
      {
        "id": "b",
        "text": "Allostasis",
        "rationale": "Incorrect. Allostasis is the short-term adaptive response, which is protective. The harm comes from its prolonged activation."
      },
      {
        "id": "c",
        "text": "Allostatic load",
        "rationale": "Correct. Repeated or prolonged activation of stress responses causes cumulative wear, contributing to hypertension, insulin resistance and central obesity."
      },
      {
        "id": "d",
        "text": "Idiopathic disease",
        "rationale": "Incorrect. Clear contributing factors are present, so the problem is not idiopathic."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Stress and disease.",
    "clip": 225
  },
  {
    "id": "fq-01-4",
    "moduleId": "f",
    "lessonId": "f-01",
    "topic": "Homeostasis and allostasis",
    "type": "single",
    "level": "application",
    "stem": "The nurse gives a class four examples of feedback loops in the body.",
    "ask": "Which example shows negative feedback restoring homeostasis?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Uterine contractions trigger oxytocin release, which strengthens the contractions.",
        "rationale": "Incorrect. This is positive feedback: the response amplifies the change."
      },
      {
        "id": "b",
        "text": "After a meal, rising glucose triggers insulin release, which brings glucose back down.",
        "rationale": "Correct. In negative feedback, the response reverses the original change."
      },
      {
        "id": "c",
        "text": "Activated clotting factors activate more clotting factors, which speeds clot formation.",
        "rationale": "Incorrect. The clotting cascade is a positive feedback loop: each step amplifies the next."
      },
      {
        "id": "d",
        "text": "During an infection, the temperature set point rises and the body generates heat.",
        "rationale": "Incorrect. Fever is a regulated rise in the set point, not a correction back toward the normal value."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cellular biology (homeostasis).",
    "clip": 160
  },
  {
    "id": "fq-01-5",
    "moduleId": "f",
    "lessonId": "f-01",
    "topic": "Homeostasis and allostasis",
    "type": "single",
    "level": "analysis",
    "stem": "Client A has a common cold and recovers in a week without treatment. Client B has a malignant tumor that keeps growing.",
    "ask": "Which statement best explains the difference in terms of homeostasis?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Only Client B's illness disturbs homeostasis; a cold leaves it intact.",
        "rationale": "Incorrect. A cold also disturbs homeostasis, with fever and congestion."
      },
      {
        "id": "b",
        "text": "Client A recovers because the cause of a cold is known; Client B's cause is unknown.",
        "rationale": "Incorrect. Knowing the cause does not decide recovery. Severity depends on whether the body's responses can correct the disturbance."
      },
      {
        "id": "c",
        "text": "Client A's adaptive responses restore balance; Client B's disease overwhelms them.",
        "rationale": "Correct. Severity is partly defined by whether the body's adaptive responses can correct the problem. When they cannot, treatment is needed."
      },
      {
        "id": "d",
        "text": "Client B's tumor growth is itself an adaptive, allostatic response to stress.",
        "rationale": "Incorrect. Tumor growth is the disease itself, not an adaptive response to it."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 245
  },
  {
    "id": "fq-02-1",
    "moduleId": "f",
    "lessonId": "f-02",
    "topic": "Etiology",
    "type": "multiple",
    "level": "application",
    "stem": "On day 6 of a hospital stay, after a course of broad-spectrum antibiotics, a client develops Clostridioides difficile diarrhea.",
    "ask": "Which terms describe this problem? Select all that apply.",
    "correct": [
      "b",
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Community-acquired",
        "rationale": "Incorrect. The diarrhea began on day 6 of the stay, after antibiotics given in hospital, so it is hospital-onset."
      },
      {
        "id": "b",
        "text": "Iatrogenic",
        "rationale": "Correct. The antibiotic treatment disrupted the normal gut flora, letting C. difficile overgrow."
      },
      {
        "id": "c",
        "text": "Idiopathic",
        "rationale": "Incorrect. The cause, antibiotic disruption of the gut flora, is clear."
      },
      {
        "id": "d",
        "text": "Nosocomial",
        "rationale": "Correct. It was acquired in the hospital and appeared well after admission."
      },
      {
        "id": "e",
        "text": "A sequela of the condition that led to admission",
        "rationale": "Incorrect. The infection follows the antibiotic treatment, not the original disease."
      }
    ],
    "source": "CDC healthcare-associated infection definitions; McCance & Huether: Infection.",
    "clip": 330
  },
  {
    "id": "fq-02-2",
    "moduleId": "f",
    "lessonId": "f-02",
    "topic": "Etiology",
    "type": "single",
    "level": "application",
    "stem": "Two weeks after starting hydrochlorothiazide for hypertension, a client reports leg cramps. Serum potassium is 3.1 mEq/L.",
    "ask": "How is the hypokalemia best classified?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Nosocomial",
        "rationale": "Incorrect. Nosocomial describes problems, usually infections, acquired in a health care setting."
      },
      {
        "id": "b",
        "text": "Idiopathic",
        "rationale": "Incorrect. The cause, the new diuretic, is identifiable."
      },
      {
        "id": "c",
        "text": "A sequela of hypertension",
        "rationale": "Incorrect. A sequela follows from the disease itself; this follows from its treatment."
      },
      {
        "id": "d",
        "text": "Iatrogenic",
        "rationale": "Correct. Thiazide diuretics increase potassium loss in the urine, so the treatment caused the problem."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (potassium).",
    "clip": 260
  },
  {
    "id": "fq-02-3",
    "moduleId": "f",
    "lessonId": "f-02",
    "topic": "Etiology",
    "type": "single",
    "level": "application",
    "stem": "The nurse reviews four clients' histories.",
    "ask": "Which client's condition is best described as multifactorial?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Cystic fibrosis in a child whose parents both carry the gene",
        "rationale": "Incorrect. A single-gene, autosomal recessive cause."
      },
      {
        "id": "b",
        "text": "Lead poisoning in a child living in a house with peeling lead paint",
        "rationale": "Incorrect. A single environmental cause."
      },
      {
        "id": "c",
        "text": "Type 2 diabetes with obesity, inactivity and a diabetic parent",
        "rationale": "Correct. Genetic, environmental and behavioral factors combine."
      },
      {
        "id": "d",
        "text": "Trisomy 21 in an infant with an extra copy of chromosome 21",
        "rationale": "Incorrect. A single chromosomal cause."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Genes, environment-lifestyle and common diseases.",
    "clip": 190
  },
  {
    "id": "fq-02-4",
    "moduleId": "f",
    "lessonId": "f-02",
    "topic": "Etiology",
    "type": "single",
    "level": "recall",
    "stem": "A 45-year-old client develops sudden hearing loss in one ear. After a full workup, including imaging and blood tests, no cause is found.",
    "ask": "Which term describes the condition?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Iatrogenic",
        "rationale": "Incorrect. No treatment or medication caused it."
      },
      {
        "id": "b",
        "text": "Idiopathic",
        "rationale": "Correct. Idiopathic means no identifiable cause after investigation."
      },
      {
        "id": "c",
        "text": "Nosocomial",
        "rationale": "Incorrect. It was not acquired in a health care setting."
      },
      {
        "id": "d",
        "text": "Multifactorial",
        "rationale": "Incorrect. Multifactorial requires identified contributing factors."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 400
  },
  {
    "id": "fq-02-5",
    "moduleId": "f",
    "lessonId": "f-02",
    "topic": "Etiology",
    "type": "single",
    "level": "application",
    "stem": "Four days after surgery, a client's incision is red and draining. The culture grows methicillin-resistant Staphylococcus aureus (MRSA).",
    "ask": "How is this infection best classified?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Community-acquired, because the client may have carried MRSA before admission",
        "rationale": "Incorrect. A surgical-site infection that appears days after the operation is classed as healthcare-associated, even if the organism came from the client's own skin."
      },
      {
        "id": "b",
        "text": "Healthcare-associated (nosocomial), because it followed a procedure in hospital",
        "rationale": "Correct. A surgical-site infection that appears days after surgery is healthcare-associated."
      },
      {
        "id": "c",
        "text": "Idiopathic, because the source of the organism cannot be confirmed",
        "rationale": "Incorrect. Idiopathic means the cause is unknown; here the causative organism is identified."
      },
      {
        "id": "d",
        "text": "A sequela of the underlying condition that required the surgery",
        "rationale": "Incorrect. The infection follows the procedure and the organism, not the original disease."
      }
    ],
    "source": "CDC healthcare-associated infection definitions; McCance & Huether: Infection.",
    "clip": 360
  },
  {
    "id": "fq-03-1",
    "moduleId": "f",
    "lessonId": "f-03",
    "topic": "Signs, symptoms and diagnosis",
    "type": "multiple",
    "level": "application",
    "stem": "A client reports nausea and 'feeling wiped out'. Temperature is 38.6 °C, oral mucosa is dry, WBC is 15,200/mm³, and the client rates abdominal pain at 7/10.",
    "ask": "Which findings are signs? Select all that apply.",
    "correct": [
      "b",
      "c",
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Nausea",
        "rationale": "Incorrect. Nausea is a subjective symptom."
      },
      {
        "id": "b",
        "text": "Temperature of 38.6 °C",
        "rationale": "Correct. Measured, so objective."
      },
      {
        "id": "c",
        "text": "Dry oral mucosa",
        "rationale": "Correct. Observed by the nurse, so objective."
      },
      {
        "id": "d",
        "text": "WBC of 15,200/mm³",
        "rationale": "Correct. A lab value is objective."
      },
      {
        "id": "e",
        "text": "Abdominal pain rated 7/10",
        "rationale": "Incorrect. Pain is reported by the client, so it is a symptom even when given a number."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 60
  },
  {
    "id": "fq-03-2",
    "moduleId": "f",
    "lessonId": "f-03",
    "topic": "Signs, symptoms and diagnosis",
    "type": "single",
    "level": "application",
    "stem": "A 48-year-old client with obesity and a parent with type 2 diabetes has a routine checkup. She reports no symptoms.",
    "ask": "Which result provides the strongest support for a diagnosis of diabetes mellitus?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Fasting glucose of 112 mg/dL",
        "rationale": "Incorrect. 100-125 mg/dL is impaired fasting glucose (prediabetes), not diabetes."
      },
      {
        "id": "b",
        "text": "2-hour glucose of 168 mg/dL on an oral glucose tolerance test",
        "rationale": "Incorrect. 140-199 mg/dL at 2 hours is impaired glucose tolerance (prediabetes); diabetes needs 200 mg/dL or higher."
      },
      {
        "id": "c",
        "text": "Random glucose of 182 mg/dL",
        "rationale": "Incorrect. A random value supports diabetes only at 200 mg/dL or higher with classic symptoms."
      },
      {
        "id": "d",
        "text": "A1C of 7.2%",
        "rationale": "Correct. An A1C of 6.5% or higher meets the diagnostic threshold. Without symptoms, a repeat test confirms it."
      }
    ],
    "source": "American Diabetes Association, Standards of Care: diagnosis and classification.",
    "clip": 188
  },
  {
    "id": "fq-03-3",
    "moduleId": "f",
    "lessonId": "f-03",
    "topic": "Signs, symptoms and diagnosis",
    "type": "single",
    "level": "application",
    "stem": "A provider tells a client with newly diagnosed stage I breast cancer that most people with this stage are alive and disease-free five years after treatment.",
    "ask": "What is the provider describing?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Prognosis",
        "rationale": "Correct. Prognosis is the expected course and outcome."
      },
      {
        "id": "b",
        "text": "Diagnosis",
        "rationale": "Incorrect. The diagnosis, breast cancer, is already made."
      },
      {
        "id": "c",
        "text": "Morbidity",
        "rationale": "Incorrect. Morbidity describes illness in a population, not one client's expected outcome."
      },
      {
        "id": "d",
        "text": "Etiology",
        "rationale": "Incorrect. Etiology is the cause."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 215
  },
  {
    "id": "fq-03-4",
    "moduleId": "f",
    "lessonId": "f-03",
    "topic": "Signs, symptoms and diagnosis",
    "type": "single",
    "level": "application",
    "stem": "A health department reports that this season 1,200 residents were hospitalized with influenza and 31 died from it.",
    "ask": "Which statement is accurate?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "The hospitalizations describe mortality; the deaths describe morbidity.",
        "rationale": "Incorrect. This reverses them: morbidity is illness, mortality is death."
      },
      {
        "id": "b",
        "text": "The hospitalizations describe morbidity; the deaths describe mortality.",
        "rationale": "Correct. Morbidity is illness; mortality is death."
      },
      {
        "id": "c",
        "text": "Both figures describe morbidity, because both count people who were ill.",
        "rationale": "Incorrect. The deaths are counted as mortality, even though those people were ill first."
      },
      {
        "id": "d",
        "text": "The hospitalizations describe prognosis; the deaths describe mortality.",
        "rationale": "Incorrect. Prognosis is the expected outcome for a client, not a count of illness."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 255
  },
  {
    "id": "fq-03-5",
    "moduleId": "f",
    "lessonId": "f-03",
    "topic": "Signs, symptoms and diagnosis",
    "type": "single",
    "level": "application",
    "stem": "A traveler back from West Africa has fever and chills. A blood smear shows Plasmodium parasites inside red blood cells, and the provider documents malaria.",
    "ask": "Which statement correctly labels these findings?",
    "options": [
      {
        "id": "a",
        "text": "The parasites on the smear are the diagnosis; malaria is the marker.",
        "rationale": "Incorrect. This reverses them: malaria is the name of the disease, and the smear finding is the evidence."
      },
      {
        "id": "b",
        "text": "Malaria is the diagnosis; the parasites on the smear are the evidence for it.",
        "rationale": "Correct. The diagnosis names the disease. The smear finding is the measurable marker that supports it."
      },
      {
        "id": "c",
        "text": "The fever is the diagnosis; the smear result shows the prognosis.",
        "rationale": "Incorrect. Fever is a sign, and the smear supports the diagnosis rather than predicting the outcome."
      },
      {
        "id": "d",
        "text": "The chills are the marker; Plasmodium is the prognosis.",
        "rationale": "Incorrect. Chills are a symptom the client reports, and Plasmodium is the cause (etiology)."
      }
    ],
    "correct": [
      "b"
    ],
    "source": "McCance & Huether, Pathophysiology: Introduction to pathophysiology; CDC malaria diagnosis.",
    "clip": 166
  },
  {
    "id": "fq-04-1",
    "moduleId": "f",
    "lessonId": "f-04",
    "topic": "Heart failure",
    "type": "single",
    "level": "application",
    "stem": "A 72-year-old man with heart failure is sedentary. His father and brother also had heart failure.",
    "ask": "How is the etiology of his heart failure best described?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Multifactorial",
        "rationale": "Correct. A family history and a sedentary lifestyle both contribute."
      },
      {
        "id": "b",
        "text": "A single inherited gene",
        "rationale": "Incorrect. His family history raises risk, but his inactivity also contributes, so a single inherited cause is too narrow."
      },
      {
        "id": "c",
        "text": "Iatrogenic",
        "rationale": "Incorrect. No treatment caused it."
      },
      {
        "id": "d",
        "text": "Idiopathic",
        "rationale": "Incorrect. Contributing factors are identified."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 50
  },
  {
    "id": "fq-04-2",
    "moduleId": "f",
    "lessonId": "f-04",
    "topic": "Heart failure",
    "type": "single",
    "level": "application",
    "stem": "Three days after starting furosemide for fluid overload, the client reports muscle cramps and palpitations.",
    "ask": "Which laboratory result does the nurse expect?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Potassium 3.0 mEq/L",
        "rationale": "Correct. Loop diuretics waste potassium; cramps and palpitations fit hypokalemia."
      },
      {
        "id": "b",
        "text": "Potassium 5.9 mEq/L",
        "rationale": "Incorrect. High potassium follows spironolactone, ACE inhibitors, ARBs or kidney injury, not furosemide."
      },
      {
        "id": "c",
        "text": "Sodium 152 mEq/L",
        "rationale": "Incorrect. Diuretics more often lower sodium, and high sodium would not explain these findings."
      },
      {
        "id": "d",
        "text": "Calcium 11.2 mg/dL",
        "rationale": "Incorrect. Loop diuretics increase calcium loss, so high calcium is not expected."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (potassium).",
    "clip": 165
  },
  {
    "id": "fq-04-3",
    "moduleId": "f",
    "lessonId": "f-04",
    "topic": "Heart failure",
    "type": "single",
    "level": "application",
    "stem": "A 70-year-old man with heart failure with reduced ejection fraction takes lisinopril. His potassium is 4.9 mEq/L. The provider considers adding one more drug.",
    "ask": "Which added drug would most increase his risk of hyperkalemia?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Furosemide",
        "rationale": "Incorrect. Loop diuretics cause potassium loss."
      },
      {
        "id": "b",
        "text": "Digoxin",
        "rationale": "Incorrect. Low potassium makes digoxin toxicity more likely, but therapeutic doses do not raise potassium."
      },
      {
        "id": "c",
        "text": "Spironolactone",
        "rationale": "Correct. It blocks aldosterone, so the kidneys retain potassium. Added to an ACE inhibitor with potassium near the upper limit, the risk is highest."
      },
      {
        "id": "d",
        "text": "Hydrochlorothiazide",
        "rationale": "Incorrect. Thiazides cause potassium loss."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (potassium).",
    "clip": 177
  },
  {
    "id": "fq-04-4",
    "moduleId": "f",
    "lessonId": "f-04",
    "topic": "Heart failure",
    "type": "single",
    "level": "application",
    "stem": "Over several years of heart failure, the client's left ventricle dilates and remodels. A month after starting lisinopril, he develops a persistent dry cough.",
    "ask": "Which statement correctly classifies these problems?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "The remodeling is iatrogenic; the cough is a sequela of heart failure.",
        "rationale": "Incorrect. This reverses the two."
      },
      {
        "id": "b",
        "text": "The remodeling is a sequela of heart failure; the cough is iatrogenic.",
        "rationale": "Correct. Remodeling follows from the disease; the cough follows from the ACE inhibitor."
      },
      {
        "id": "c",
        "text": "The remodeling and the cough are both sequelae of heart failure.",
        "rationale": "Incorrect. The cough began after lisinopril and is a known ACE-inhibitor effect."
      },
      {
        "id": "d",
        "text": "The remodeling and the cough are both iatrogenic effects of lisinopril.",
        "rationale": "Incorrect. Remodeling developed over years of heart failure, before the drug was started."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 209
  },
  {
    "id": "fq-04-5",
    "moduleId": "f",
    "lessonId": "f-04",
    "topic": "Heart failure",
    "type": "single",
    "level": "application",
    "stem": "A 72-year-old client has fatigue, bilateral ankle edema, a 2 kg weight gain over one week and a BNP of 1,150 pg/mL.",
    "ask": "Which finding best supports heart failure over other causes of edema?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Fatigue",
        "rationale": "Incorrect. Fatigue is a nonspecific symptom."
      },
      {
        "id": "b",
        "text": "Bilateral ankle edema",
        "rationale": "Incorrect. Edema also occurs with venous insufficiency, kidney or liver disease and some drugs."
      },
      {
        "id": "c",
        "text": "Weight gain of 2 kg in one week",
        "rationale": "Incorrect. Rapid weight gain shows fluid retention but not which organ is causing it."
      },
      {
        "id": "d",
        "text": "BNP of 1,150 pg/mL",
        "rationale": "Correct. A markedly raised BNP points to ventricular stretch."
      }
    ],
    "source": "2022 AHA/ACC/HFSA heart failure guideline.",
    "clip": 90
  },
  {
    "id": "fq-05-1",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "single",
    "level": "application",
    "stem": "A client's serum potassium is 6.4 mEq/L.",
    "ask": "Which complication is the priority concern?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Cardiac dysrhythmias",
        "rationale": "Correct. High potassium alters the resting membrane potential of heart cells and can cause life-threatening dysrhythmias."
      },
      {
        "id": "b",
        "text": "Tetany",
        "rationale": "Incorrect. Tetany is linked to low calcium."
      },
      {
        "id": "c",
        "text": "Seizures",
        "rationale": "Incorrect. Seizures are more typical of severe sodium disturbances."
      },
      {
        "id": "d",
        "text": "Kussmaul respirations",
        "rationale": "Incorrect. These compensate for metabolic acidosis; they are not a complication of high potassium."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (potassium).",
    "clip": 285
  },
  {
    "id": "fq-05-2",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "single",
    "level": "application",
    "stem": "A client has a metabolic acidosis (arterial pH 7.28, HCO3⁻ 15 mEq/L) and a serum potassium of 5.8 mEq/L.",
    "ask": "Which mechanism links these findings?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Acidosis stimulates aldosterone, which makes the kidneys retain potassium.",
        "rationale": "Incorrect. Aldosterone increases potassium excretion, so it would lower serum potassium."
      },
      {
        "id": "b",
        "text": "In acidosis, hydrogen ions move into cells and potassium moves out.",
        "rationale": "Correct. Hydrogen ions move into cells in exchange for potassium, raising serum potassium. The shift is greatest with mineral acids; in lactic acidosis and ketoacidosis, other causes such as lack of insulin matter more."
      },
      {
        "id": "c",
        "text": "Acidosis increases the kidneys' potassium excretion.",
        "rationale": "Incorrect. Acidosis tends to reduce potassium excretion, and more excretion would lower serum potassium, not raise it."
      },
      {
        "id": "d",
        "text": "In acidosis, hydrogen ions and potassium both move out of cells.",
        "rationale": "Incorrect. The two ions exchange in opposite directions: hydrogen in, potassium out."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (acids and bases).",
    "clip": 520
  },
  {
    "id": "fq-05-3",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "single",
    "level": "application",
    "stem": "A client with tetanus has jaw rigidity and painful, generalized muscle spasms.",
    "ask": "Which mechanism explains these findings?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "The toxin binds receptors on skeletal muscle and stimulates contraction.",
        "rationale": "Incorrect. A common misconception: tetanus toxin acts in the central nervous system, not on muscle."
      },
      {
        "id": "b",
        "text": "The toxin blocks acetylcholine release at the neuromuscular junction.",
        "rationale": "Incorrect. That is botulinum toxin, which causes flaccid paralysis."
      },
      {
        "id": "c",
        "text": "The toxin blocks inhibitory neurotransmitter release in the spinal cord.",
        "rationale": "Correct. Tetanus toxin stops GABA and glycine release from inhibitory neurons, so motor neurons fire unchecked and muscles stay in spasm."
      },
      {
        "id": "d",
        "text": "The toxin lowers serum calcium, causing tetany.",
        "rationale": "Incorrect. Tetany from low calcium is a different condition despite the similar name. Calcium is normal in tetanus."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Infection; Alterations of neurologic function.",
    "clip": 452
  },
  {
    "id": "fq-05-4",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "single",
    "level": "application",
    "stem": "A client with type 1 diabetes stopped taking insulin. Glucose is 520 mg/dL, pH is 7.21 and respirations are deep and rapid.",
    "ask": "Which process explains the acidosis?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Very high glucose acts as an acid and lowers the blood pH directly.",
        "rationale": "Incorrect. Glucose is not an acid; the ketones are."
      },
      {
        "id": "b",
        "text": "The deep, rapid breathing retains carbon dioxide and causes the acidosis.",
        "rationale": "Incorrect. Deep, rapid breathing blows off CO2 to compensate for the acidosis."
      },
      {
        "id": "c",
        "text": "Insulin lack moves potassium out of cells, and this acidifies the blood.",
        "rationale": "Incorrect. Potassium does shift out of cells in DKA, but that is a result of insulin lack and acidosis, not the cause of the low pH."
      },
      {
        "id": "d",
        "text": "Without insulin, cells break down fat and the liver makes acidic ketone bodies.",
        "rationale": "Correct. This is diabetic ketoacidosis."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of hormonal regulation (diabetic ketoacidosis).",
    "clip": 390
  },
  {
    "id": "fq-05-5",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "multiple",
    "level": "recall",
    "stem": "The nurse reviews an adult client's morning labs.",
    "ask": "Which values are outside the normal adult range? Select all that apply.",
    "correct": [
      "a",
      "c",
      "e"
    ],
    "options": [
      {
        "id": "a",
        "text": "Sodium 128 mEq/L",
        "rationale": "Correct. Below 135 mEq/L is hyponatremia."
      },
      {
        "id": "b",
        "text": "Potassium 4.2 mEq/L",
        "rationale": "Incorrect. Within 3.5–5.0 mEq/L."
      },
      {
        "id": "c",
        "text": "Arterial pH 7.48",
        "rationale": "Correct. Above 7.45 is alkalosis."
      },
      {
        "id": "d",
        "text": "Fasting glucose 88 mg/dL",
        "rationale": "Incorrect. Within the normal fasting range of 70–99 mg/dL."
      },
      {
        "id": "e",
        "text": "Potassium 3.1 mEq/L",
        "rationale": "Correct. Below 3.5 mEq/L is hypokalemia."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment.",
    "clip": 210
  },
  {
    "id": "fq-05-6",
    "moduleId": "f",
    "lessonId": "f-05",
    "topic": "Electrolytes, glucose and pH",
    "type": "single",
    "level": "application",
    "stem": "A client in severe acidosis (arterial pH 7.08) has weak heart contractions and low blood pressure. Contractions strengthen as the pH is corrected.",
    "ask": "Which explanation best fits?",
    "options": [
      {
        "id": "a",
        "text": "Acidosis lowers serum potassium, which weakens each contraction.",
        "rationale": "Incorrect. Acidosis tends to raise potassium, not lower it."
      },
      {
        "id": "b",
        "text": "Excess hydrogen ions change the shape of enzymes and ion channels.",
        "rationale": "Correct. Proteins only work in a narrow pH range; in acidosis, contractile and channel proteins work poorly until pH is restored."
      },
      {
        "id": "c",
        "text": "Acidosis raises blood glucose, which depresses heart muscle.",
        "rationale": "Incorrect. Glucose does not explain the weak contractions."
      },
      {
        "id": "d",
        "text": "Breathing slows to correct the pH, starving the heart of oxygen.",
        "rationale": "Incorrect. In metabolic acidosis, breathing speeds up to blow off CO2."
      }
    ],
    "correct": [
      "b"
    ],
    "source": "McCance & Huether, Pathophysiology: The cellular environment (acids and bases).",
    "clip": 532
  },
  {
    "id": "fq-06-1",
    "moduleId": "f",
    "lessonId": "f-06",
    "topic": "Protein problems and autoimmunity",
    "type": "single",
    "level": "application",
    "stem": "A client newly diagnosed with type 1 diabetes asks what caused her disease.",
    "ask": "Which explanation is most accurate?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Her pancreas wore out after years of making extra insulin.",
        "rationale": "Incorrect. Beta-cell exhaustion after long insulin resistance is a feature of type 2 diabetes."
      },
      {
        "id": "b",
        "text": "Eating too much sugar over many years damaged her pancreas.",
        "rationale": "Incorrect. Diet does not cause type 1 diabetes; the beta cells are destroyed by an autoimmune process."
      },
      {
        "id": "c",
        "text": "Insulin resistance in her muscle and fat made her beta cells die.",
        "rationale": "Incorrect. Insulin resistance drives type 2 diabetes."
      },
      {
        "id": "d",
        "text": "Her own T cells destroyed the beta cells that make insulin.",
        "rationale": "Correct. Type 1 diabetes is autoimmune and mainly T-cell mediated; autoantibodies in the blood are markers of the attack."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of hormonal regulation; Alterations in immunity.",
    "clip": 340
  },
  {
    "id": "fq-06-2",
    "moduleId": "f",
    "lessonId": "f-06",
    "topic": "Protein problems and autoimmunity",
    "type": "single",
    "level": "recall",
    "stem": "A client with COVID-19 asks why the virus infects the lining of the airways and lungs so readily.",
    "ask": "Which explanation is most accurate?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Its spike protein binds the CD4 receptor on airway cells.",
        "rationale": "Incorrect. CD4 is the receptor HIV uses."
      },
      {
        "id": "b",
        "text": "Its spike protein binds the ACE2 receptor on airway cells.",
        "rationale": "Correct. ACE2, expressed on airway and alveolar cells, is the virus's entry receptor."
      },
      {
        "id": "c",
        "text": "It dissolves the airway cell membrane on contact.",
        "rationale": "Incorrect. Entry depends on binding a specific receptor, not on dissolving membranes."
      },
      {
        "id": "d",
        "text": "Airway cells cannot make interferon, so nothing slows the virus.",
        "rationale": "Incorrect. Airway cells do make interferons, though the virus can blunt them; entry still depends on ACE2."
      }
    ],
    "source": "McCance & Huether, Pathophysiology",
    "clip": 90
  },
  {
    "id": "fq-06-3",
    "moduleId": "f",
    "lessonId": "f-06",
    "topic": "Protein problems and autoimmunity",
    "type": "single",
    "level": "application",
    "stem": "A 63-year-old client develops dementia and jerking movements that worsen rapidly over four months. Brain tissue shows sponge-like holes. The disease is caused by a misfolded protein that converts normal copies of the same protein into the misfolded form.",
    "ask": "Which disease does this describe?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Alzheimer disease",
        "rationale": "Incorrect. Alzheimer disease progresses over years and shows amyloid plaques and tau tangles, not sponge-like change."
      },
      {
        "id": "b",
        "text": "Creutzfeldt-Jakob disease",
        "rationale": "Correct. It is a prion disease: the misfolded prion protein templates further misfolding, causing rapidly progressive dementia, myoclonus and spongiform change."
      },
      {
        "id": "c",
        "text": "Huntington disease",
        "rationale": "Incorrect. Huntington disease is an inherited CAG-repeat disorder that progresses over years, with chorea."
      },
      {
        "id": "d",
        "text": "Parkinson disease",
        "rationale": "Incorrect. Parkinson disease involves alpha-synuclein in Lewy bodies and progresses slowly, with tremor and rigidity."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of neurologic function.",
    "clip": 40
  },
  {
    "id": "fq-06-4",
    "moduleId": "f",
    "lessonId": "f-06",
    "topic": "Protein problems and autoimmunity",
    "type": "single",
    "level": "recall",
    "stem": "A client is diagnosed with Alzheimer's disease.",
    "ask": "Which finding reflects abnormal protein folding in this disease?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Lewy bodies containing alpha-synuclein",
        "rationale": "Incorrect. These mark Parkinson disease and Lewy body dementia."
      },
      {
        "id": "b",
        "text": "Spongiform change from prion protein",
        "rationale": "Incorrect. That is Creutzfeldt-Jakob disease; Alzheimer disease is not a prion disease."
      },
      {
        "id": "c",
        "text": "Amyloid-beta plaques and tau tangles",
        "rationale": "Correct. These are the hallmark misfolded proteins of Alzheimer disease."
      },
      {
        "id": "d",
        "text": "Demyelinating plaques in white matter",
        "rationale": "Incorrect. These mark multiple sclerosis and are not made of misfolded protein."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of neurologic function.",
    "clip": 35
  },
  {
    "id": "fq-06-5",
    "moduleId": "f",
    "lessonId": "f-06",
    "topic": "Protein problems and autoimmunity",
    "type": "single",
    "level": "application",
    "stem": "A client has drooping eyelids and muscle weakness that gets worse through the day and improves with rest.",
    "ask": "Which mechanism explains these findings?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Antibodies block and destroy acetylcholine receptors at the junction.",
        "rationale": "Correct. This is myasthenia gravis. Antibodies block receptors and, mainly through complement, destroy them, so repeated use exhausts the few that remain."
      },
      {
        "id": "b",
        "text": "A bacterial toxin blocks acetylcholine release from motor nerve endings.",
        "rationale": "Incorrect. That is botulism, which causes descending flaccid paralysis that does not improve with rest."
      },
      {
        "id": "c",
        "text": "T cells destroy the myelin around nerves in the brain and spinal cord.",
        "rationale": "Incorrect. That is multiple sclerosis."
      },
      {
        "id": "d",
        "text": "Motor neurons in the brain and spinal cord progressively degenerate.",
        "rationale": "Incorrect. That is amyotrophic lateral sclerosis, which causes progressive weakness that does not recover with rest."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of musculoskeletal function; Alterations in immunity.",
    "clip": 259
  },
  {
    "id": "fq-07-1",
    "moduleId": "f",
    "lessonId": "f-07",
    "topic": "Cancer genetics",
    "type": "single",
    "level": "application",
    "stem": "A tumor carries a RAS mutation that keeps the growth-signaling protein permanently switched on.",
    "ask": "How is this mutation classified?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "Gain-of-function mutation in a tumor-suppressor gene",
        "rationale": "Incorrect. Tumor suppressors are the brakes; they fail by loss of function, not gain."
      },
      {
        "id": "b",
        "text": "Gain-of-function mutation in a proto-oncogene",
        "rationale": "Correct. A stuck accelerator: one altered copy is enough to turn the proto-oncogene into an oncogene."
      },
      {
        "id": "c",
        "text": "Loss-of-function mutation in a tumor-suppressor gene",
        "rationale": "Incorrect. RAS sends growth signals; it is a proto-oncogene, not a brake."
      },
      {
        "id": "d",
        "text": "Loss-of-function mutation in a DNA mismatch-repair gene",
        "rationale": "Incorrect. Repair genes fix damage; they do not send growth signals."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cancer biology.",
    "clip": 130
  },
  {
    "id": "fq-07-2",
    "moduleId": "f",
    "lessonId": "f-07",
    "topic": "Cancer genetics",
    "type": "single",
    "level": "application",
    "stem": "A 32-year-old client has breast cancer. Her mother and maternal aunt had ovarian cancer in their 40s. Testing shows a BRCA1 mutation.",
    "ask": "Which explanation for her early-onset cancer is most accurate?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "BRCA1 is an oncogene, and her inherited copy makes breast cells divide faster.",
        "rationale": "Incorrect. That describes an oncogene; BRCA1 is a DNA-repair, tumor-suppressor gene."
      },
      {
        "id": "b",
        "text": "She inherited two faulty BRCA1 copies, so DNA repair failed from birth.",
        "rationale": "Incorrect. Carriers inherit one faulty copy; the second copy is lost later, in a breast or ovarian cell."
      },
      {
        "id": "c",
        "text": "Her cancer arose from acquired mutations alone; the BRCA1 result is incidental.",
        "rationale": "Incorrect. Early onset and the family pattern point to the inherited mutation as a major cause."
      },
      {
        "id": "d",
        "text": "She was born with one faulty BRCA1 copy, so one acquired hit can disable DNA repair.",
        "rationale": "Correct. The inherited mutation is the first hit in every cell, so a single further hit in a breast cell removes DNA repair."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cancer biology; Cancer epidemiology.",
    "clip": 455
  },
  {
    "id": "fq-07-3",
    "moduleId": "f",
    "lessonId": "f-07",
    "topic": "Cancer genetics",
    "type": "single",
    "level": "recall",
    "stem": "TP53 is mutated in about half of human cancers.",
    "ask": "Why is it called the 'guardian of the genome'?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Its protein pauses the cell cycle for repair, or triggers apoptosis.",
        "rationale": "Correct. Losing p53 lets cells with damaged DNA keep dividing."
      },
      {
        "id": "b",
        "text": "Its protein finds broken DNA strands and repairs them directly.",
        "rationale": "Incorrect. p53 coordinates the response, switching on repair genes or apoptosis, rather than repairing DNA itself."
      },
      {
        "id": "c",
        "text": "Its protein drives cell division when growth signals arrive.",
        "rationale": "Incorrect. That describes the products of proto-oncogenes."
      },
      {
        "id": "d",
        "text": "Its protein lengthens telomeres so cells can keep dividing.",
        "rationale": "Incorrect. That is telomerase, encoded by a different gene."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cancer biology.",
    "clip": 250
  },
  {
    "id": "fq-07-4",
    "moduleId": "f",
    "lessonId": "f-07",
    "topic": "Cancer genetics",
    "type": "multiple",
    "level": "application",
    "stem": "The nurse is teaching about cancer prevention.",
    "ask": "Which are modifiable exposures that damage DNA and raise cancer risk? Select all that apply.",
    "correct": [
      "a",
      "c",
      "e"
    ],
    "options": [
      {
        "id": "a",
        "text": "Tobacco smoke",
        "rationale": "Correct. A major source of DNA-damaging carcinogens."
      },
      {
        "id": "b",
        "text": "Older age",
        "rationale": "Incorrect. A risk factor, but not modifiable."
      },
      {
        "id": "c",
        "text": "Alcohol",
        "rationale": "Correct. Its breakdown product acetaldehyde damages DNA."
      },
      {
        "id": "d",
        "text": "An inherited BRCA2 mutation",
        "rationale": "Incorrect. It raises risk but cannot be modified."
      },
      {
        "id": "e",
        "text": "UV radiation from sun or tanning beds",
        "rationale": "Correct. UV damages skin-cell DNA."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cancer epidemiology.",
    "clip": 438
  },
  {
    "id": "fq-07-5",
    "moduleId": "f",
    "lessonId": "f-07",
    "topic": "Cancer genetics",
    "type": "single",
    "level": "recall",
    "stem": "A client asks how the provider knows whether a tumor is benign or malignant.",
    "ask": "Which feature distinguishes a malignant tumor from a benign one?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "It grows quickly, doubling in size within weeks.",
        "rationale": "Incorrect. Some benign tumors grow quickly and some cancers grow slowly."
      },
      {
        "id": "b",
        "text": "It forms a firm mass that can be felt on examination.",
        "rationale": "Incorrect. Benign tumors also form palpable masses."
      },
      {
        "id": "c",
        "text": "It arises from epithelial cells lining an organ.",
        "rationale": "Incorrect. Both benign and malignant tumors can be epithelial."
      },
      {
        "id": "d",
        "text": "It invades nearby tissue and can spread to distant sites.",
        "rationale": "Correct. Invasion and metastasis define malignancy."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Cancer biology.",
    "clip": 404
  },
  {
    "id": "fq-08-1",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "single",
    "level": "application",
    "stem": "Both parents have sickle cell trait (HbAS).",
    "ask": "What is the chance that each of their children will have sickle cell disease?",
    "correct": [
      "b"
    ],
    "options": [
      {
        "id": "a",
        "text": "0%",
        "rationale": "Incorrect. Two carriers can have an affected child."
      },
      {
        "id": "b",
        "text": "25%",
        "rationale": "Correct. Two carriers of an autosomal recessive gene have a 1 in 4 chance per child of an affected child."
      },
      {
        "id": "c",
        "text": "50%",
        "rationale": "Incorrect. That is the chance of a child having the trait."
      },
      {
        "id": "d",
        "text": "100%",
        "rationale": "Incorrect. Each parent also passes a normal gene half the time."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Genes and genetic diseases.",
    "clip": 20,
    "fixedOrder": true
  },
  {
    "id": "fq-08-2",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "single",
    "level": "application",
    "stem": "After a long flight, a client with sickle cell disease has severe pain in the back and legs.",
    "ask": "Which mechanism best explains the pain?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Overactive clotting factors form clots in the deep leg veins.",
        "rationale": "Incorrect. Clotting is activated in sickle cell disease and the risk of deep vein thrombosis is higher, but a pain crisis is driven by sickled cells blocking small vessels."
      },
      {
        "id": "b",
        "text": "Antibodies coat the red cells and destroy them in the spleen.",
        "rationale": "Incorrect. That is autoimmune hemolytic anemia, which causes anemia rather than acute pain."
      },
      {
        "id": "c",
        "text": "Sickled red cells block small vessels, causing tissue ischemia.",
        "rationale": "Correct. Low oxygen and dehydration during the flight make deoxygenated HbS polymerize; stiff, sickled cells block small vessels."
      },
      {
        "id": "d",
        "text": "Low iron stores reduce oxygen delivery to the muscles.",
        "rationale": "Incorrect. Iron deficiency causes fatigue, not acute vaso-occlusive pain."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of erythrocyte function.",
    "clip": 55
  },
  {
    "id": "fq-08-3",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "multiple",
    "level": "application",
    "stem": "The nurse teaches a client with sickle cell disease how to prevent crises.",
    "ask": "Which factors can trigger sickling? Select all that apply.",
    "correct": [
      "b",
      "c",
      "e",
      "f"
    ],
    "options": [
      {
        "id": "a",
        "text": "Warm compresses on painful joints",
        "rationale": "Incorrect. Warmth dilates vessels and is used for comfort; cold, not warmth, triggers sickling."
      },
      {
        "id": "b",
        "text": "Dehydration",
        "rationale": "Correct. A higher HbS concentration promotes polymerization."
      },
      {
        "id": "c",
        "text": "Swimming in cold water",
        "rationale": "Correct. Cold causes vasoconstriction, slowing flow and promoting sickling."
      },
      {
        "id": "d",
        "text": "Daily folic acid",
        "rationale": "Incorrect. Folic acid supports red cell production and is part of routine care."
      },
      {
        "id": "e",
        "text": "Infection or fever",
        "rationale": "Correct. Infection increases oxygen demand and causes acidosis and dehydration."
      },
      {
        "id": "f",
        "text": "High altitude",
        "rationale": "Correct. Lower oxygen levels let deoxygenated HbS polymerize."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of erythrocyte function.",
    "clip": 55
  },
  {
    "id": "fq-08-4",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "single",
    "level": "recall",
    "stem": "Parents of a newborn with trisomy 21 ask how it happened.",
    "ask": "Which mechanism most often produces trisomy 21?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "A point mutation in a gene on chromosome 21",
        "rationale": "Incorrect. Trisomy is an extra whole chromosome, not a single-gene change."
      },
      {
        "id": "b",
        "text": "An inherited Robertsonian translocation involving chromosome 21",
        "rationale": "Incorrect. Translocation explains a small minority of cases; most are new events."
      },
      {
        "id": "c",
        "text": "Deletion of part of chromosome 21",
        "rationale": "Incorrect. A deletion is a loss of material, not an extra chromosome."
      },
      {
        "id": "d",
        "text": "Nondisjunction of chromosome 21 during meiosis",
        "rationale": "Correct. The chromosomes fail to separate, usually in the egg, so the egg carries an extra chromosome 21. The risk rises with maternal age."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Genes and genetic diseases.",
    "clip": 75
  },
  {
    "id": "fq-08-5",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "single",
    "level": "recall",
    "stem": "A student compares sickle cell disease and trisomy 21.",
    "ask": "How do they differ in their genetic basis?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Sickle cell disease is chromosomal; trisomy 21 is a single-gene disorder.",
        "rationale": "Incorrect. This reverses them."
      },
      {
        "id": "b",
        "text": "Both are single-gene disorders inherited in an autosomal recessive pattern.",
        "rationale": "Incorrect. Only sickle cell disease is single-gene and autosomal recessive; trisomy 21 is an extra chromosome."
      },
      {
        "id": "c",
        "text": "Sickle cell disease is a single-gene disorder; trisomy 21 is chromosomal.",
        "rationale": "Correct. One is a point mutation in the beta-globin gene; the other is a change in chromosome number."
      },
      {
        "id": "d",
        "text": "Both are chromosomal disorders caused by errors during meiosis.",
        "rationale": "Incorrect. Sickle cell disease is a single-gene point mutation, not a meiotic error."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Genes and genetic diseases.",
    "clip": 75
  },
  {
    "id": "fq-08-6",
    "moduleId": "f",
    "lessonId": "f-08",
    "topic": "Genetic disorders",
    "type": "single",
    "level": "analysis",
    "stem": "Between crises, a client with sickle cell disease has a hemoglobin of 8.2 g/dL, yellow sclera and a raised reticulocyte count.",
    "ask": "Which mechanism explains all three findings?",
    "options": [
      {
        "id": "a",
        "text": "Sickled red cells break down early, so bilirubin rises and the marrow speeds up",
        "rationale": "Correct. Hemolysis lowers hemoglobin, releases bilirubin (jaundice) and drives the marrow to release more young red cells."
      },
      {
        "id": "b",
        "text": "Iron deficiency from a poor diet limits hemoglobin production",
        "rationale": "Incorrect. Iron deficiency lowers the reticulocyte count and does not cause jaundice."
      },
      {
        "id": "c",
        "text": "Liver damage from repeated crises stops bilirubin being cleared",
        "rationale": "Incorrect. This could explain jaundice but not the anemia with a high reticulocyte count."
      },
      {
        "id": "d",
        "text": "Bone marrow failure lowers red cell production",
        "rationale": "Incorrect. Marrow failure would give a low reticulocyte count, not a high one."
      }
    ],
    "correct": [
      "a"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations of erythrocyte function.",
    "clip": 60
  },
  {
    "id": "fq-09-1",
    "moduleId": "f",
    "lessonId": "f-09",
    "topic": "HIV entry",
    "type": "single",
    "level": "application",
    "stem": "A client with untreated HIV develops repeated opportunistic infections.",
    "ask": "Loss of which cells best explains his immune deficiency?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "CD4-positive helper T cells",
        "rationale": "Correct. HIV infects and depletes helper T cells, which coordinate both arms of adaptive immunity."
      },
      {
        "id": "b",
        "text": "CD8-positive cytotoxic T cells",
        "rationale": "Incorrect. CD8 cells are not HIV's main target."
      },
      {
        "id": "c",
        "text": "B cells",
        "rationale": "Incorrect. B-cell function suffers indirectly, but they are not the main target."
      },
      {
        "id": "d",
        "text": "Neutrophils",
        "rationale": "Incorrect. Neutrophils are not HIV's target."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 130
  },
  {
    "id": "fq-09-2",
    "moduleId": "f",
    "lessonId": "f-09",
    "topic": "HIV entry",
    "type": "single",
    "level": "recall",
    "stem": "The nurse explains the first steps of HIV infection.",
    "ask": "What does the envelope protein gp120 do?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Binds CD4 and then a co-receptor (CCR5 or CXCR4)",
        "rationale": "Correct. gp120 is the 'key' for attachment."
      },
      {
        "id": "b",
        "text": "Fuses the viral envelope with the cell membrane",
        "rationale": "Incorrect. That is gp41, which acts after gp120 binds."
      },
      {
        "id": "c",
        "text": "Copies viral RNA into DNA inside the cell",
        "rationale": "Incorrect. That is reverse transcriptase."
      },
      {
        "id": "d",
        "text": "Cuts viral polyproteins into working proteins",
        "rationale": "Incorrect. That is protease."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 208
  },
  {
    "id": "fq-09-3",
    "moduleId": "f",
    "lessonId": "f-09",
    "topic": "HIV entry",
    "type": "single",
    "level": "application",
    "stem": "People who inherit two copies of the CCR5-Δ32 deletion are highly resistant to the most common strains of HIV.",
    "ask": "Which explanation is correct?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "Their T cells lack CD4, so gp120 has nothing to attach to.",
        "rationale": "Incorrect. CD4 is present; the co-receptor is missing."
      },
      {
        "id": "b",
        "text": "Their antibodies neutralize gp120 before the virus reaches cells.",
        "rationale": "Incorrect. Resistance comes from the missing co-receptor, not from antibodies."
      },
      {
        "id": "c",
        "text": "Their cells lack working CCR5, the co-receptor these strains need.",
        "rationale": "Correct. Without a working CCR5, CCR5-using strains cannot complete entry."
      },
      {
        "id": "d",
        "text": "Their cells make extra CCR5, which traps the virus outside the cell.",
        "rationale": "Incorrect. The deletion removes working CCR5 from the cell surface; it does not add more."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 215
  },
  {
    "id": "fq-09-4",
    "moduleId": "f",
    "lessonId": "f-09",
    "topic": "HIV entry",
    "type": "single",
    "level": "recall",
    "stem": "A student asks why HIV cannot multiply in a tube of blood plasma.",
    "ask": "Which explanation is correct?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "HIV carries no genetic material until it enters a cell.",
        "rationale": "Incorrect. It carries an RNA genome."
      },
      {
        "id": "b",
        "text": "Antibodies in the plasma inactivate the virus before it divides.",
        "rationale": "Incorrect. Antibodies do not stop HIV from replicating in the body; the barrier here is the lack of host cells."
      },
      {
        "id": "c",
        "text": "Plasma lacks the glucose and nutrients HIV needs to divide.",
        "rationale": "Incorrect. Viruses do not feed and divide like bacteria; adding nutrients would not help."
      },
      {
        "id": "d",
        "text": "HIV has no ribosomes, so it needs a host cell to make its proteins.",
        "rationale": "Correct. Viruses are obligate intracellular parasites."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Infection.",
    "clip": 100
  },
  {
    "id": "fq-09-5",
    "moduleId": "f",
    "lessonId": "f-09",
    "topic": "HIV entry",
    "type": "multiple",
    "level": "recall",
    "stem": "The nurse reviews HIV's structure.",
    "ask": "Which statements are accurate? Select all that apply.",
    "correct": [
      "b",
      "d",
      "e"
    ],
    "options": [
      {
        "id": "a",
        "text": "Its genome is double-stranded DNA.",
        "rationale": "Incorrect. Viral DNA is made only after infection, by reverse transcription."
      },
      {
        "id": "b",
        "text": "Its genome is single-stranded RNA.",
        "rationale": "Correct. Two copies of single-stranded RNA."
      },
      {
        "id": "c",
        "text": "It inserts its RNA directly into the host chromosome.",
        "rationale": "Incorrect. The RNA must first be copied into DNA by reverse transcriptase; integrase then inserts the DNA."
      },
      {
        "id": "d",
        "text": "It carries reverse transcriptase inside its capsid.",
        "rationale": "Correct. Along with integrase and protease."
      },
      {
        "id": "e",
        "text": "Its lipid envelope holds gp120 and gp41.",
        "rationale": "Correct. The envelope is taken from the host cell membrane."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 75
  },
  {
    "id": "fq-10-1",
    "moduleId": "f",
    "lessonId": "f-10",
    "topic": "HIV replication",
    "type": "single",
    "level": "application",
    "stem": "A client stopped his antiretroviral therapy several times. His virus is now resistant to two drugs.",
    "ask": "Why does HIV develop drug resistance so quickly?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "The drugs damage the viral RNA, and the damage creates resistance mutations.",
        "rationale": "Incorrect. The drugs do not create mutations; they select mutants that already arise during copying."
      },
      {
        "id": "b",
        "text": "His immune system adapts to the drugs and clears them faster over time.",
        "rationale": "Incorrect. Resistance is a change in the virus, not in how his body handles the drugs."
      },
      {
        "id": "c",
        "text": "Error-prone reverse transcriptase makes many mutants; drug gaps select resistant ones.",
        "rationale": "Correct. Under incomplete drug pressure, resistant mutants outgrow the rest."
      },
      {
        "id": "d",
        "text": "Stopping therapy lets the virus hide in the reservoir, where it turns resistant.",
        "rationale": "Incorrect. The latent reservoir stores virus but does not replicate; resistance arises during active replication."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity. DHHS antiretroviral guidelines.",
    "clip": 40
  },
  {
    "id": "fq-10-2",
    "moduleId": "f",
    "lessonId": "f-10",
    "topic": "HIV replication",
    "type": "single",
    "level": "application",
    "stem": "A client's viral load has been undetectable for two years. She asks whether she is cured.",
    "ask": "Why does current therapy not cure HIV?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "The virus mutates too quickly for any drug combination to suppress it.",
        "rationale": "Incorrect. Her undetectable viral load shows the virus is suppressed."
      },
      {
        "id": "b",
        "text": "Antibodies made during treatment are too weak to clear the virus.",
        "rationale": "Incorrect. Cure does not depend on antibodies; the barrier is virus hidden in resting cells."
      },
      {
        "id": "c",
        "text": "Integrated viral DNA persists silently in long-lived resting CD4 cells.",
        "rationale": "Correct. This latent reservoir restarts replication if therapy stops."
      },
      {
        "id": "d",
        "text": "The drugs kill infected cells too slowly to clear them within two years.",
        "rationale": "Incorrect. Antiretrovirals block new rounds of infection; they do not kill infected cells."
      }
    ],
    "source": "DHHS antiretroviral guidelines.",
    "clip": 143
  },
  {
    "id": "fq-10-3",
    "moduleId": "f",
    "lessonId": "f-10",
    "topic": "HIV replication",
    "type": "single",
    "level": "recall",
    "stem": "New HIV particles have just budded from an infected cell.",
    "ask": "Which enzyme must act next for them to become infectious?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Protease",
        "rationale": "Correct. Protease cuts the Gag and Gag-Pol polyproteins into working proteins, maturing the virion."
      },
      {
        "id": "b",
        "text": "Reverse transcriptase",
        "rationale": "Incorrect. It acts after the next cell is infected."
      },
      {
        "id": "c",
        "text": "Integrase",
        "rationale": "Incorrect. It acts inside the infected cell's nucleus."
      },
      {
        "id": "d",
        "text": "The host's RNA polymerase",
        "rationale": "Incorrect. It transcribes the provirus before assembly."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 286
  },
  {
    "id": "fq-10-4",
    "moduleId": "f",
    "lessonId": "f-10",
    "topic": "HIV replication",
    "type": "single",
    "level": "recall",
    "stem": "A student is reviewing the HIV life cycle.",
    "ask": "Which sequence is correct?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Binding/fusion → integration → reverse transcription → transcription/translation → assembly/budding → maturation",
        "rationale": "Incorrect. RNA must be copied into DNA before it can be integrated."
      },
      {
        "id": "b",
        "text": "Binding/fusion → reverse transcription → integration → transcription/translation → maturation → assembly/budding",
        "rationale": "Incorrect. Maturation happens after budding, when protease cuts the polyproteins."
      },
      {
        "id": "c",
        "text": "Reverse transcription → binding/fusion → integration → transcription/translation → assembly/budding → maturation",
        "rationale": "Incorrect. The virus must enter the cell before its RNA is copied."
      },
      {
        "id": "d",
        "text": "Binding/fusion → reverse transcription → integration → transcription/translation → assembly/budding → maturation",
        "rationale": "Correct. Entry, RNA copied into DNA, DNA inserted, viral genes expressed, new virions assembled and released, then matured by protease."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 10,
    "fixedOrder": true
  },
  {
    "id": "fq-10-5",
    "moduleId": "f",
    "lessonId": "f-10",
    "topic": "HIV replication",
    "type": "single",
    "level": "recall",
    "stem": "A student reviews the enzymes HIV carries.",
    "ask": "What does HIV integrase do?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Inserts viral DNA into the host cell's chromosome",
        "rationale": "Correct. The inserted provirus stays for the life of the cell."
      },
      {
        "id": "b",
        "text": "Copies viral RNA into DNA inside the cytoplasm",
        "rationale": "Incorrect. That is reverse transcriptase."
      },
      {
        "id": "c",
        "text": "Cuts viral polyproteins into working proteins",
        "rationale": "Incorrect. That is protease."
      },
      {
        "id": "d",
        "text": "Binds CD4 on the surface of helper T cells",
        "rationale": "Incorrect. That is gp120, an envelope protein, not an enzyme."
      }
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity.",
    "clip": 110
  },
  {
    "id": "fq-11-1",
    "moduleId": "f",
    "lessonId": "f-11",
    "topic": "Antiretroviral drugs",
    "type": "single",
    "level": "application",
    "stem": "Before prescribing maraviroc, the provider orders a tropism assay.",
    "ask": "What is the reason for this test?",
    "correct": [
      "c"
    ],
    "options": [
      {
        "id": "a",
        "text": "To check that the CD4 count is high enough to start maraviroc",
        "rationale": "Incorrect. CD4 count is measured separately and does not decide maraviroc's use."
      },
      {
        "id": "b",
        "text": "To screen for the HLA-B*5701 allele before starting maraviroc",
        "rationale": "Incorrect. HLA-B*5701 screening is done before abacavir, to predict hypersensitivity."
      },
      {
        "id": "c",
        "text": "To confirm the virus uses CCR5, the co-receptor maraviroc blocks",
        "rationale": "Correct. Maraviroc blocks CCR5, so it has no effect on virus that uses CXCR4."
      },
      {
        "id": "d",
        "text": "To detect resistance mutations in the viral protease gene",
        "rationale": "Incorrect. Protease resistance does not affect maraviroc, which targets a host receptor."
      }
    ],
    "source": "DHHS antiretroviral guidelines.",
    "clip": 20
  },
  {
    "id": "fq-11-2",
    "moduleId": "f",
    "lessonId": "f-11",
    "topic": "Antiretroviral drugs",
    "type": "single",
    "level": "application",
    "stem": "A client's viral load has rebounded. He takes bictegravir, tenofovir alafenamide and emtricitabine. Resistance testing shows new mutations in the integrase gene.",
    "ask": "Which drug in his regimen is most likely compromised?",
    "options": [
      {
        "id": "a",
        "text": "Tenofovir alafenamide",
        "rationale": "Incorrect. Tenofovir is an NRTI; resistance to it comes from reverse transcriptase mutations."
      },
      {
        "id": "b",
        "text": "Emtricitabine",
        "rationale": "Incorrect. Emtricitabine is also an NRTI and acts on reverse transcriptase."
      },
      {
        "id": "c",
        "text": "Bictegravir",
        "rationale": "Correct. Bictegravir is an integrase strand transfer inhibitor, so integrase mutations can reduce its effect."
      },
      {
        "id": "d",
        "text": "None of them; integrase mutations do not affect these drugs",
        "rationale": "Incorrect. Integrase mutations are the main route to resistance against integrase inhibitors such as bictegravir."
      }
    ],
    "correct": [
      "c"
    ],
    "source": "DHHS antiretroviral guidelines: drug-resistance testing.",
    "clip": 138
  },
  {
    "id": "fq-11-3",
    "moduleId": "f",
    "lessonId": "f-11",
    "topic": "Antiretroviral drugs",
    "type": "single",
    "level": "application",
    "stem": "A client asks why he must take three HIV medications instead of one.",
    "ask": "Which explanation is best?",
    "correct": [
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Each drug treats a different strain of HIV that he carries.",
        "rationale": "Incorrect. The combination targets different steps, not different strains."
      },
      {
        "id": "b",
        "text": "With three drugs, an occasional missed dose matters less.",
        "rationale": "Incorrect. Adherence remains essential; missed doses let resistant virus emerge."
      },
      {
        "id": "c",
        "text": "Three drugs together can clear virus hidden in resting cells.",
        "rationale": "Incorrect. No current combination clears the latent reservoir; therapy suppresses replication."
      },
      {
        "id": "d",
        "text": "Blocking several steps at once makes resistance far less likely.",
        "rationale": "Correct. The virus would need several mutations at once to escape."
      }
    ],
    "source": "DHHS antiretroviral guidelines.",
    "clip": 200
  },
  {
    "id": "fq-11-4",
    "moduleId": "f",
    "lessonId": "f-11",
    "topic": "Antiretroviral drugs",
    "type": "single",
    "level": "recall",
    "stem": "A client's regimen includes tenofovir and emtricitabine.",
    "ask": "Which step do these drugs block?",
    "correct": [
      "a"
    ],
    "options": [
      {
        "id": "a",
        "text": "Reverse transcription",
        "rationale": "Correct. As NRTIs, they are built into the viral DNA and stop the chain from growing."
      },
      {
        "id": "b",
        "text": "Integration",
        "rationale": "Incorrect. That is the integrase inhibitors."
      },
      {
        "id": "c",
        "text": "Maturation",
        "rationale": "Incorrect. That is the protease inhibitors."
      },
      {
        "id": "d",
        "text": "Entry",
        "rationale": "Incorrect. That is the entry inhibitors."
      }
    ],
    "source": "DHHS antiretroviral guidelines.",
    "clip": 100
  },
  {
    "id": "fq-11-5",
    "moduleId": "f",
    "lessonId": "f-11",
    "topic": "Antiretroviral drugs",
    "type": "multiple",
    "level": "recall",
    "stem": "A student matches antiretroviral drugs to their targets.",
    "ask": "Which pairings are correct? Select all that apply.",
    "correct": [
      "a",
      "c",
      "d"
    ],
    "options": [
      {
        "id": "a",
        "text": "Darunavir: protease",
        "rationale": "Correct. Darunavir is a protease inhibitor."
      },
      {
        "id": "b",
        "text": "Efavirenz: integrase",
        "rationale": "Incorrect. Efavirenz is an NNRTI and blocks reverse transcriptase."
      },
      {
        "id": "c",
        "text": "Fostemsavir: gp120, blocking attachment",
        "rationale": "Correct. Fostemsavir's active form, temsavir, binds gp120 and stops it attaching to CD4."
      },
      {
        "id": "d",
        "text": "Ibalizumab: CD4 (post-attachment inhibitor)",
        "rationale": "Correct. Ibalizumab is a monoclonal antibody that binds CD4 and blocks entry after the virus attaches."
      },
      {
        "id": "e",
        "text": "Dolutegravir: reverse transcriptase",
        "rationale": "Incorrect. Dolutegravir blocks integrase."
      }
    ],
    "source": "DHHS antiretroviral guidelines.",
    "clip": 60
  }
];

/** Items carried over from the v1 preview (modules 1 and 3). */
export const legacyQuestions: Question[] = [
  {
    "id": "q-anaphylaxis",
    "moduleId": "m3",
    "lessonId": "m3-l3",
    "topic": "Hypersensitivity types I–IV",
    "type": "single",
    "level": "application",
    "stem": "Minutes after a bee sting, a client develops generalized hives, wheezing and a falling blood pressure.",
    "ask": "Which mechanism is responsible?",
    "options": [
      {
        "id": "a",
        "text": "Antibodies binding antigens on the client's own cell surfaces",
        "rationale": "That is Type II, as in a transfusion reaction. It targets specific cells rather than causing sudden, body-wide mediator release."
      },
      {
        "id": "b",
        "text": "Immune complexes depositing in vessel walls",
        "rationale": "That is Type III. Complexes build up over days, as in serum sickness, not within minutes."
      },
      {
        "id": "c",
        "text": "Sensitized T cells releasing cytokines",
        "rationale": "That is Type IV, a delayed reaction that peaks after 24–72 hours."
      },
      {
        "id": "d",
        "text": "Allergen cross-linking IgE on mast cells",
        "rationale": "A reaction within minutes of re-exposure is Type I. Mast cells release histamine and other mediators all at once."
      }
    ],
    "correct": [
      "d"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity and inflammation"
  },
  {
    "id": "q-anaphylaxis-bp",
    "moduleId": "m3",
    "lessonId": "m3-l3",
    "topic": "Hypersensitivity types I–IV",
    "type": "single",
    "level": "application",
    "stem": "A client in anaphylaxis has a blood pressure of 78/40 mmHg.",
    "ask": "Which mediator effect best explains the hypotension?",
    "options": [
      {
        "id": "a",
        "text": "Bronchoconstriction reducing oxygen delivery",
        "rationale": "This causes wheeze and hypoxia, but the blood pressure falls because of what happens in the vessels."
      },
      {
        "id": "b",
        "text": "Histamine-driven vasodilation and leaky capillaries",
        "rationale": "Widespread vasodilation drops vascular resistance, and fluid shifts out of leaky capillaries, so circulating volume falls."
      },
      {
        "id": "c",
        "text": "Eosinophils recruited to the tissues",
        "rationale": "Eosinophils drive the late phase, hours later. They do not explain an early drop in pressure."
      },
      {
        "id": "d",
        "text": "Complement-mediated destruction of red blood cells",
        "rationale": "Red cell lysis is a Type II mechanism and is not part of anaphylaxis."
      }
    ],
    "correct": [
      "b"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity and inflammation"
  },
  {
    "id": "q-sensitization",
    "moduleId": "m3",
    "lessonId": "m3-l3",
    "topic": "Hypersensitivity types I–IV",
    "type": "single",
    "level": "application",
    "stem": "A client had no reaction to their first course of penicillin, but developed hives and wheezing within minutes of the first dose of a second course.",
    "ask": "What best explains why the first course caused no reaction?",
    "options": [
      {
        "id": "a",
        "text": "The first course used a lower dose that stayed below the reaction threshold",
        "rationale": "Dose is not the key factor. Once sensitized, even a small exposure can trigger a severe reaction."
      },
      {
        "id": "b",
        "text": "Immune complexes had not yet formed in large enough amounts",
        "rationale": "Immune complexes belong to Type III reactions, which take days, not minutes."
      },
      {
        "id": "c",
        "text": "The first course sensitized the client, priming mast cells with IgE",
        "rationale": "Type I reactions need a sensitizing exposure first: IgE is made and binds to mast cells. Symptoms appear on re-exposure, when the allergen meets that IgE."
      },
      {
        "id": "d",
        "text": "Sensitized T cells needed 24-72 hours to respond to the drug",
        "rationale": "That describes a delayed Type IV reaction. This reaction came within minutes."
      }
    ],
    "correct": [
      "c"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity and inflammation"
  },
  {
    "id": "q-late-phase",
    "moduleId": "m3",
    "lessonId": "m3-l3",
    "topic": "Hypersensitivity types I–IV",
    "type": "single",
    "level": "application",
    "stem": "A client's wheezing after cat-dander exposure settles with treatment, then returns about six hours later without further exposure.",
    "ask": "Which cells mainly drive this return of symptoms?",
    "options": [
      {
        "id": "a",
        "text": "Eosinophils recruited to the airway",
        "rationale": "This is the late-phase reaction. Cytokines and leukotrienes from mast cells recruit eosinophils and other leukocytes, which sustain inflammation hours later."
      },
      {
        "id": "b",
        "text": "Plasma cells making new IgE",
        "rationale": "New IgE production belongs to sensitization. It does not explain symptoms returning within hours."
      },
      {
        "id": "c",
        "text": "Neutrophils responding to a bacterial infection",
        "rationale": "Nothing here points to infection. The timing fits an allergic late phase."
      },
      {
        "id": "d",
        "text": "Cytotoxic T cells destroying airway cells",
        "rationale": "Direct T cell killing is a Type IV mechanism and is not how allergic asthma relapses."
      }
    ],
    "correct": [
      "a"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity and inflammation"
  },
  {
    "id": "q-which-type-1",
    "moduleId": "m3",
    "lessonId": "m3-l3",
    "topic": "Hypersensitivity types I–IV",
    "type": "single",
    "level": "application",
    "stem": "A nurse reviews four clients' histories.",
    "ask": "Which client's reaction is an example of Type I hypersensitivity?",
    "options": [
      {
        "id": "a",
        "text": "A rash under a new watch's metal buckle two days after first wearing it, in a client with a known nickel allergy",
        "rationale": "A rash at the contact site after 48 hours is contact dermatitis, a Type IV (T cell) reaction."
      },
      {
        "id": "b",
        "text": "Hemolysis after an ABO-incompatible blood transfusion",
        "rationale": "Antibodies attacking the transfused red cells is Type II."
      },
      {
        "id": "c",
        "text": "Sneezing and itchy eyes within minutes of exposure to pollen",
        "rationale": "Allergic rhinitis is IgE-mediated, with symptoms within minutes of exposure. That is Type I."
      },
      {
        "id": "d",
        "text": "Glomerulonephritis two weeks after a streptococcal throat infection",
        "rationale": "Post-streptococcal glomerulonephritis comes from immune complexes deposited in the kidney, which is Type III."
      }
    ],
    "correct": [
      "c"
    ],
    "source": "McCance & Huether, Pathophysiology: Alterations in immunity and inflammation"
  },
  {
    "id": "q-metaplasia",
    "moduleId": "m1",
    "topic": "Cellular adaptation",
    "type": "single",
    "level": "application",
    "stem": "A 55-year-old client has had untreated acid reflux for 15 years. Biopsy of the lower esophagus shows its normal squamous lining replaced by columnar cells with goblet cells. There is no dysplasia.",
    "ask": "Which follow-up best matches the significance of this finding?",
    "options": [
      {
        "id": "a",
        "text": "A repeat biopsy only if heartburn gets worse, since this is a stable adaptation",
        "rationale": "Incorrect. The change can progress without new symptoms, so follow-up does not wait for symptoms."
      },
      {
        "id": "b",
        "text": "Removal of the esophagus now, since the change is already a cancer",
        "rationale": "Incorrect. With no dysplasia, this is not cancer, and surgery is not indicated."
      },
      {
        "id": "c",
        "text": "Regular endoscopic surveillance, since the change can progress to dysplasia and cancer",
        "rationale": "Correct. This is Barrett esophagus: metaplasia that better withstands acid but raises the risk of dysplasia and adenocarcinoma, so it is watched with endoscopy."
      },
      {
        "id": "d",
        "text": "Stopping acid-suppressing drugs, since the new cells already resist acid",
        "rationale": "Incorrect. Acid suppression continues; ongoing acid injury drives further change."
      }
    ],
    "correct": [
      "c"
    ],
    "source": "McCance & Huether, Pathophysiology: Altered cellular and tissue biology; American College of Gastroenterology guideline on Barrett esophagus."
  },
  {
    "id": "q-lvh",
    "moduleId": "m1",
    "topic": "Cellular adaptation",
    "type": "single",
    "level": "application",
    "stem": "A client with long-standing, poorly controlled hypertension has a thickened left ventricular wall on echocardiogram.",
    "ask": "Which cellular change best explains this finding?",
    "options": [
      {
        "id": "a",
        "text": "Hyperplasia of cardiac myocytes",
        "rationale": "Hyperplasia needs cells that can divide. Adult cardiac myocytes have very little capacity to divide, so the heart cannot add cells this way."
      },
      {
        "id": "b",
        "text": "Hypertrophy of cardiac myocytes",
        "rationale": "Pumping against high pressure increases workload, so each myocyte builds more contractile protein and enlarges. The wall thickens without more cells."
      },
      {
        "id": "c",
        "text": "Metaplasia of the myocardium",
        "rationale": "Metaplasia swaps one cell type for another, mainly in epithelium. Myocytes are not replaced by a new cell type here."
      },
      {
        "id": "d",
        "text": "Fibrous scarring after necrosis",
        "rationale": "Scar follows cell death, as after an infarction. Pressure overload alone causes adaptive enlargement of living cells, not replacement by scar."
      }
    ],
    "correct": [
      "b"
    ],
    "source": "McCance & Huether, Pathophysiology: Altered cellular and tissue biology"
  },
  {
    "id": "q-irreversible",
    "moduleId": "m1",
    "topic": "Reversible vs irreversible injury",
    "type": "single",
    "level": "application",
    "stem": "A pathology report describes myocardial tissue taken after a prolonged period of ischemia.",
    "ask": "Which finding shows that these cells could not have recovered, even if blood flow had been restored?",
    "options": [
      {
        "id": "a",
        "text": "Cellular swelling",
        "rationale": "Usually the earliest change: falling ATP stops the Na⁺/K⁺ pump and water follows sodium in. It is reversible if oxygen returns."
      },
      {
        "id": "b",
        "text": "A shift to anaerobic glycolysis with lactic acid build-up",
        "rationale": "An early response to low oxygen. It lowers pH but is reversible once oxygen is restored."
      },
      {
        "id": "c",
        "text": "Fatty change in the cytoplasm",
        "rationale": "Lipid accumulation from impaired metabolism. It signals stress, not death, and can resolve."
      },
      {
        "id": "d",
        "text": "Shrinkage and fragmentation of the nucleus",
        "rationale": "Nuclear changes (pyknosis, karyorrhexis, karyolysis) mark cell death. Together with severe mitochondrial and membrane damage, they mean the injury is irreversible."
      }
    ],
    "correct": [
      "d"
    ],
    "source": "McCance & Huether, Pathophysiology: Altered cellular and tissue biology"
  },
  {
    "id": "q-caseous",
    "moduleId": "m1",
    "topic": "Necrosis",
    "type": "single",
    "level": "recall",
    "stem": "A lung biopsy from a client with pulmonary tuberculosis shows granulomas with soft, crumbly, structureless dead tissue at their centers.",
    "ask": "Which type of necrosis is this?",
    "options": [
      {
        "id": "a",
        "text": "Coagulative necrosis",
        "rationale": "Typical of ischemic infarcts in most solid organs such as the heart and kidney. Tissue outlines are preserved, not cheese-like."
      },
      {
        "id": "b",
        "text": "Liquefactive necrosis",
        "rationale": "Enzymes digest tissue into a liquid, as in brain infarcts and bacterial abscesses."
      },
      {
        "id": "c",
        "text": "Caseous necrosis",
        "rationale": "Necrosis within granulomas that leaves soft, cheese-like ('caseous') debris is the classic finding in tuberculosis. It combines features of coagulative and liquefactive necrosis."
      },
      {
        "id": "d",
        "text": "Fat necrosis",
        "rationale": "Lipases break down fat, often in the pancreas or breast, leaving chalky deposits. It is not linked to TB granulomas."
      }
    ],
    "correct": [
      "c"
    ],
    "source": "McCance & Huether, Pathophysiology: Altered cellular and tissue biology"
  },
  {
    "id": "q-apoptosis",
    "moduleId": "m1",
    "topic": "Apoptosis vs necrosis",
    "type": "single",
    "level": "application",
    "stem": "During embryonic development, the cells between the future fingers are removed without causing any inflammation.",
    "ask": "Which description fits this process?",
    "options": [
      {
        "id": "a",
        "text": "Cells shrink and break into membrane-bound fragments that phagocytes clear",
        "rationale": "This is apoptosis: programmed, orderly cell death. Membranes stay intact, so no inflammation follows."
      },
      {
        "id": "b",
        "text": "Cells swell, their membranes rupture and their contents spill into the tissue",
        "rationale": "This is necrosis. Released contents trigger inflammation, which this scenario rules out."
      },
      {
        "id": "c",
        "text": "Neutrophil enzymes digest the dead cells into a liquid mass",
        "rationale": "This describes liquefactive necrosis, which is inflammatory and not part of normal development."
      },
      {
        "id": "d",
        "text": "Cells shrink in size and survive with reduced metabolic activity",
        "rationale": "This is atrophy, an adaptation. The cells here are removed, not just made smaller."
      }
    ],
    "correct": [
      "a"
    ],
    "source": "McCance & Huether, Pathophysiology: Altered cellular and tissue biology"
  }
];

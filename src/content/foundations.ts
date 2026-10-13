/**
 * Start here: Foundations. Eleven short lessons cut from the course overview
 * video, with summaries, nursing priorities, common traps, corrections to the
 * video, and flashcards.
 *
 * Original writing. Sources are named per item; every item is checked by the
 * four reviewer agents and must be approved by the nurse reviewer before
 * students see it.
 */
import type { Card, Lesson } from "./types";

const MH = "McCance & Huether, Pathophysiology";

export const foundationsLessons: Lesson[] = [
  {
    id: "f-01",
    moduleId: "f",
    index: 1,
    title: "What pathophysiology is: homeostasis and allostasis",
    shortTitle: "Homeostasis and allostasis",
    duration: "4:48",
    video: "foundations-01",
    objective: "Explain how disease disrupts homeostasis, how the body's responses try to restore it, and how protective allostasis differs from harmful allostatic load.",
    hook: "Exams test whether you can tell the body's compensation apart from the disease it is compensating for.",
    summary: [
      {
        title: "Pathology vs pathophysiology",
        body: "Pathology describes what diseased tissue looks like. Pathophysiology explains how and why function changes.",
      },
      {
        title: "Homeostasis",
        body: "The body holds variables such as temperature, glucose, blood pressure and pH within set ranges, mostly through negative feedback.",
      },
      {
        title: "Disease",
        body: "Disease is a disturbance of structure or function that upsets homeostasis. Mild disease is corrected by the body's own responses; when those responses are overwhelmed, variables stay outside their normal range and treatment is needed.",
      },
      {
        title: "Allostasis",
        body: "Stability through change: heart rate, cortisol and blood pressure shift to meet a challenge. Prolonged activation builds allostatic load, which itself causes harm.",
      },
    ],
    priorities: [
      "Separate the disturbance (e.g. falling blood pressure) from the compensation (e.g. rising heart rate).",
      "Trend values against their normal range rather than reacting to one reading.",
    ],
    traps: [
      "Calling a compensatory finding the problem itself.",
      "Treating allostasis (protective, short term) and allostatic load (harmful, cumulative) as the same thing.",
    ],
    corrections: [
      {
        at: "3:43",
        said: "Allostasis is the body going to the area that's causing the disease and fixing it, so you get back to homeostasis.",
        correct: "Allostasis means stability through change: the body shifts heart rate, blood pressure and stress hormones to meet a challenge. Fighting off an infection uses these responses, but allostasis is broader than repair, and its prolonged activation builds allostatic load.",
      },
    ],
    source: `${MH}: Cellular biology; Stress and disease (allostasis and allostatic load).`,
  },
  {
    id: "f-02",
    moduleId: "f",
    index: 2,
    title: "What causes disease: etiology and how we describe it",
    shortTitle: "Etiology",
    duration: "7:05",
    video: "foundations-02",
    objective: "Classify the cause of a disease and describe it as multifactorial, iatrogenic, nosocomial or idiopathic.",
    hook: "Questions hide the classification in the timeline: what came first, the treatment, the hospital stay, or the disease?",
    summary: [
      {
        title: "Etiology",
        body: "The cause of a disease. Broad groups: environmental (heat, lead), genetic (trisomy 21, sickle cell disease) and pathogens (viruses, bacteria, fungi, protozoa).",
      },
      {
        title: "Multifactorial",
        body: "Two or more factors combine, such as genes, environment and behavior. Type 2 diabetes and coronary artery disease are examples.",
      },
      {
        title: "Iatrogenic and nosocomial",
        body: "Iatrogenic: caused by treatment or care, e.g. hypokalemia from a thiazide diuretic. Nosocomial: acquired in a health care setting, e.g. C. difficile or MRSA infection.",
      },
      {
        title: "Idiopathic",
        body: "No identifiable cause after a full workup.",
      },
    ],
    priorities: [
      "When a new problem follows a new medication, consider an iatrogenic cause and review the medication list.",
      "Prevent nosocomial infection: hand hygiene, line and catheter care, and removing devices as soon as they are not needed.",
    ],
    traps: [
      "A hospital-acquired infection from a device or antibiotic can be both nosocomial and iatrogenic.",
      "Idiopathic means no cause was found after a workup, not that the cause was simply not explained to the client.",
      "Multifactorial is not the same as genetic.",
    ],
    corrections: [
      {
        at: "1:35",
        said: "Lead in Flint's water caused all sorts of cancers.",
        correct: "Lead's main harms are to the developing brain, the blood (anemia), the kidneys and, in adults, blood pressure. Inorganic lead is classed as a probable carcinogen, but cancer is not the main concern. It is a good example of an environmental cause.",
      },
      {
        at: "4:45",
        said: "Semaglutide (Ozempic) causes depression, so the depression is iatrogenic.",
        correct: "There is no good evidence that GLP-1 receptor agonists cause depression. In January 2026 the FDA reviewed 91 placebo-controlled trials, found no increased risk of depression or suicidal thoughts, and asked for the suicidality warning to be removed from weight-loss labels. Clearer iatrogenic examples: hypokalemia from a thiazide, C. difficile after antibiotics, Cushingoid features from long-term steroids.",
      },
      {
        at: "5:59",
        said: "MRSA is a type of fungus that causes a rash.",
        correct: "MRSA is methicillin-resistant Staphylococcus aureus, a bacterium. It commonly causes skin, wound, blood and lung infections.",
      },
    ],
    source: `${MH}: Genes, environment-lifestyle and common diseases; Infection. CDC healthcare-associated infection definitions.`,
  },
  {
    id: "f-03",
    moduleId: "f",
    index: 3,
    title: "Diagnosing disease: symptoms, signs, biomarkers and prognosis",
    shortTitle: "Signs, symptoms and diagnosis",
    duration: "5:57",
    video: "foundations-03",
    objective: "Sort findings into symptoms and signs, name the biomarker that supports a diagnosis, and use prognosis, morbidity and mortality correctly.",
    hook: "Pain is a symptom even when the client gives it a number, a common source of wrong answers.",
    summary: [
      {
        title: "Symptoms",
        body: "Subjective: what the client reports, such as pain, nausea or fatigue.",
      },
      {
        title: "Signs",
        body: "Objective: what can be observed or measured, such as edema, fever or a lab value.",
      },
      {
        title: "Diagnosis and biomarkers",
        body: "A diagnosis names the disease. Biomarkers are the measurable evidence that supports it, e.g. A1C for diabetes, BNP for heart failure, parasites on a smear for malaria.",
      },
      {
        title: "Prognosis, morbidity, mortality",
        body: "Prognosis is the expected outcome. Morbidity is illness (how many have it, and its burden). Mortality is death.",
      },
    ],
    priorities: [
      "Pair each symptom with the sign or lab that confirms or rules it out.",
      "Know the diagnostic thresholds, such as A1C 6.5% or higher for diabetes.",
    ],
    traps: [
      "A rated pain score is still a symptom.",
      "Morbidity is not a softer word for mortality.",
      "Fasting glucose of 100–125 mg/dL is prediabetes, not diabetes.",
    ],
    corrections: [
      {
        at: "2:34",
        said: "The diagnosis is the key marker for a disease.",
        correct: "The diagnosis is the name of the disease. The marker (a lab value, imaging finding or other biomarker) is the evidence that supports it.",
      },
      {
        at: "3:08",
        said: "Blood glucose of 1,000 millimoles per deciliter means diabetes; the normal range is about 60 to 100.",
        correct: "US labs report glucose in mg/dL. Normal fasting glucose is 70–99 mg/dL. Diabetes: A1C of 6.5% or higher, fasting glucose of 126 mg/dL or higher, a 2-hour glucose of 200 mg/dL or higher on a 75-g oral glucose tolerance test, or a random glucose of 200 mg/dL or higher with classic symptoms. Without clear hyperglycemia, two abnormal results are needed to confirm.",
      },
    ],
    source: `${MH}: Introduction to pathophysiology. American Diabetes Association, Standards of Care: diagnosis and classification.`,
  },
  {
    id: "f-04",
    moduleId: "f",
    index: 4,
    title: "Case: a 72-year-old with heart failure",
    shortTitle: "Case: heart failure",
    duration: "4:13",
    video: "foundations-04",
    objective: "Apply signs, symptoms, etiology, biomarkers, sequelae and iatrogenic effects to one client.",
    hook: "Diuretics and potassium is a high-yield link in pathophysiology and pharmacology, and the direction matters.",
    summary: [
      {
        title: "Cues",
        body: "Fatigue (symptom). Bilateral ankle edema and labored breathing (signs). Labored breathing the nurse observes is a sign; breathlessness the client reports is a symptom. Sedentary with a family history of heart disease, so the cause is multifactorial.",
      },
      {
        title: "Diagnosis",
        body: "Heart failure: the heart cannot fill or pump well enough to meet the body's needs without raised filling pressures. A raised BNP or NT-proBNP and an echocardiogram support the diagnosis; the ejection fraction separates reduced (40% or less) from preserved (50% or more) heart failure.",
      },
      {
        title: "Left vs right",
        body: "Left-sided failure backs fluid into the lungs: orthopnea, crackles, low oxygen saturation. Right-sided failure backs it into the systemic veins: ankle edema, distended neck veins, an enlarged liver.",
      },
      {
        title: "Treatment and its side effects",
        body: "Loop and thiazide diuretics remove fluid but waste potassium, causing hypokalemia (weakness, cramps, palpitations, dysrhythmias). Spironolactone, ACE inhibitors and ARBs raise potassium instead.",
      },
      {
        title: "Sequela vs iatrogenic",
        body: "A sequela follows from the disease, such as ventricular remodeling. An iatrogenic problem follows from the treatment, such as an ACE-inhibitor cough.",
      },
    ],
    priorities: [
      "Check potassium before giving a loop or thiazide diuretic, and report a low value.",
      "Monitor daily weight, intake and output, edema and lung sounds.",
    ],
    traps: [
      "Thiazides and loop diuretics cause low potassium, not high.",
      "Edema alone does not diagnose heart failure; venous disease, kidney disease and some drugs also cause it.",
    ],
    corrections: [
      {
        at: "2:30",
        said: "Elevated ANP is the main diagnostic marker for heart failure.",
        correct: "BNP or NT-proBNP is the natriuretic peptide measured in practice. ANP is related but is not used routinely.",
      },
      {
        at: "2:57",
        said: "After thiazides, the client develops high potassium (hyperkalemia).",
        correct: "Thiazide and loop diuretics cause low potassium (hypokalemia). High potassium follows potassium-sparing diuretics such as spironolactone, ACE inhibitors or ARBs, or kidney injury. Loop diuretics, not thiazides, are first-line for fluid overload in heart failure.",
      },
      {
        at: "3:29",
        said: "The cardiac hypertrophy happened in response to the heart failure.",
        correct: "Hypertrophy and remodeling can be both cause and consequence. Long-standing hypertension thickens the ventricle and leads to heart failure; failure then drives further remodeling.",
      },
    ],
    source: `${MH}: Alterations of cardiovascular function. 2022 AHA/ACC/HFSA heart failure guideline.`,
  },
  {
    id: "f-05",
    moduleId: "f",
    index: 5,
    title: "The cell's environment: electrolytes, glucose, toxins and pH",
    shortTitle: "The cell's environment",
    duration: "9:53",
    video: "foundations-05",
    objective: "Explain how changes in the fluid around cells (electrolytes, glucose, toxins, pH) cause disease.",
    hook: "Potassium problems show up first in the heart, and acid–base problems often show up in the potassium.",
    summary: [
      {
        title: "Protein, environment, DNA",
        body: "A useful frame: most cell-level disease comes from faulty proteins, a hostile environment, or damaged DNA.",
      },
      {
        title: "Electrolytes",
        body: "Sodium 135–145 mEq/L, potassium 3.5–5.0 mEq/L. Small shifts in potassium change the resting membrane potential of heart and muscle cells.",
      },
      {
        title: "Glucose and toxins",
        body: "Without insulin, cells cannot take up glucose, fat is broken down, and the liver turns fatty acids into ketones, causing ketoacidosis. Tetanus toxin blocks inhibitory signals in the spinal cord, so muscles spasm.",
      },
      {
        title: "pH",
        body: "Normal arterial pH is 7.35–7.45. Acidosis changes protein shape and function. Acidosis from mineral acids shifts potassium out of cells; in lactic acidosis and ketoacidosis the shift is small, and other causes, such as lack of insulin, raise potassium.",
      },
    ],
    priorities: [
      "Report a potassium outside 3.5–5.0 mEq/L. Expect an ECG and cardiac monitoring when the value is markedly abnormal, changing quickly, or causing symptoms or ECG changes.",
      "In acidosis and its treatment, recheck potassium often: it may be high at first and fall quickly once insulin or other treatment starts.",
    ],
    traps: [
      "Tetanus (spastic, toxin acts on the spinal cord) vs botulism (flaccid, toxin acts at the neuromuscular junction).",
      "Deep, rapid Kussmaul breathing is the compensation for acidosis, not its cause.",
    ],
    corrections: [
      {
        at: "3:33",
        said: "Sodium is 135–145 millimoles per deciliter.",
        correct: "Sodium is 135–145 mmol/L (the same as mEq/L for sodium).",
      },
      {
        at: "4:43",
        said: "Sodium entering heart muscle cells triggers them to contract.",
        correct: "Sodium entry depolarizes the cell. Calcium entering through L-type channels then triggers release of more calcium from the sarcoplasmic reticulum, and that calcium triggers contraction.",
      },
      {
        at: "7:32",
        said: "Tetanus toxin binds receptors on muscle cells and stimulates them to contract.",
        correct: "Tetanus toxin travels to the spinal cord and blocks the release of inhibitory neurotransmitters (GABA and glycine), so motor neurons fire unchecked.",
      },
    ],
    source: `${MH}: The cellular environment: fluids and electrolytes, acids and bases; Infection (tetanus).`,
  },
  {
    id: "f-06",
    moduleId: "f",
    index: 6,
    title: "Protein problems: receptors, viral entry, antibodies and autoimmunity",
    shortTitle: "Protein problems",
    duration: "6:49",
    video: "foundations-06",
    objective: "Explain how misfolded proteins, receptors used by viruses, and self-directed immune responses cause disease.",
    hook: "Autoimmune questions test the mechanism: which immune cell or antibody is doing the damage, and to what.",
    summary: [
      {
        title: "Misfolded proteins",
        body: "Alzheimer's disease: amyloid-β plaques and tau tangles. Prion diseases such as Creutzfeldt-Jakob disease: a misfolded prion protein converts normal copies.",
      },
      {
        title: "Receptors as doors",
        body: "Normal host proteins can be hijacked. The SARS-CoV-2 spike protein binds ACE2 to enter cells of the airways, lungs, vessels and other organs.",
      },
      {
        title: "Antibodies",
        body: "B cells make antibodies that bind antigens and neutralize pathogens. When self-tolerance fails, antibodies or T cells target the body's own cells.",
      },
      {
        title: "Autoimmunity examples",
        body: "Type 1 diabetes: T cells destroy beta cells; autoantibodies mark the process. Myasthenia gravis: antibodies to acetylcholine receptors block them and, mainly through complement, destroy them.",
      },
    ],
    priorities: [
      "In new type 1 diabetes, watch for ketoacidosis; insulin is lifelong.",
      "In myasthenia gravis, assess swallowing and breathing; weakness worsens with activity.",
    ],
    traps: [
      "Alzheimer's disease is not a prion disease.",
      "Type 1 diabetes is autoimmune beta-cell destruction; type 2 starts with insulin resistance.",
    ],
    corrections: [
      {
        at: "0:40",
        said: "In Alzheimer's disease, a prion protein gets misshaped.",
        correct: "Alzheimer's disease involves misfolded amyloid-β and tau. Prion diseases, such as Creutzfeldt-Jakob disease, are a separate group.",
      },
      {
        at: "1:14",
        said: "ACE2 is found primarily in the nose.",
        correct: "ACE2 is expressed widely, not only in the nose: nasal and airway epithelium (an early entry site), alveolar type II cells, blood vessels, heart, kidneys and gut.",
      },
      {
        at: "1:48",
        said: "The COVID-19 virus expresses an antigen.",
        correct: "The virus is SARS-CoV-2; COVID-19 is the disease. Its spike protein binds ACE2.",
      },
      {
        at: "5:41",
        said: "In type 1 diabetes, antibodies attack and destroy the beta cells.",
        correct: "Beta-cell destruction is mainly T-cell mediated. Autoantibodies (GAD65, insulin, IA-2, ZnT8) are markers of the process.",
      },
    ],
    source: `${MH}: Adaptive immunity; Alterations in immunity and inflammation; Alterations of neurologic function.`,
  },
  {
    id: "f-07",
    moduleId: "f",
    index: 7,
    title: "DNA and cancer: oncogenes, tumor suppressors and DNA repair",
    shortTitle: "DNA and cancer",
    duration: "8:44",
    video: "foundations-07",
    objective: "Explain how changes in proto-oncogenes, tumor-suppressor genes and DNA repair genes lead to cancer, and why inherited mutations raise risk.",
    hook: "Accelerator, brakes, mechanic: know which gene class is which and whether one hit or two is needed.",
    summary: [
      {
        title: "Proto-oncogenes (accelerator)",
        body: "Normal growth-promoting genes. A gain-of-function mutation turns one into an oncogene; one altered copy can be enough.",
      },
      {
        title: "Tumor suppressors (brakes)",
        body: "Genes such as TP53 and RB1 halt the cell cycle or trigger apoptosis. Usually both copies must be lost (two hits).",
      },
      {
        title: "DNA repair (mechanic)",
        body: "Genes such as the mismatch repair genes fix DNA damage. BRCA1 and BRCA2 are tumor-suppressor genes whose job is DNA repair. When repair fails, mutations pile up.",
      },
      {
        title: "Acquired or inherited",
        body: "Tobacco, alcohol, UV light and radiation damage DNA. An inherited mutation means every cell starts with one hit, so cancers come earlier and more often.",
      },
    ],
    priorities: [
      "Take a three-generation family history and refer early-onset or clustered cancers for genetic counseling.",
      "Teach modifiable risk reduction: no tobacco, limit alcohol, sun protection.",
    ],
    traps: [
      "Fast growth alone does not make a tumor malignant; invasion and metastasis do.",
      "Carrying a BRCA mutation raises risk; it does not guarantee cancer.",
    ],
    corrections: [
      {
        at: "6:44",
        said: "Cancer is rapid, unregulated cell growth and division.",
        correct: "Uncontrolled growth is part of it, but malignancy is defined by invasion of nearby tissue and the ability to metastasize. Benign tumors can also grow.",
      },
    ],
    source: `${MH}: Cancer biology; Genes and genetic diseases.`,
  },
  {
    id: "f-08",
    moduleId: "f",
    index: 8,
    title: "Inherited genetic disorders: sickle cell disease and trisomy 21",
    shortTitle: "Genetic disorders",
    duration: "1:27",
    video: "foundations-08",
    objective: "Contrast a single-gene disorder with a chromosomal disorder, and explain how sickling causes symptoms.",
    hook: "Practice a two-carrier Punnett square, and know what triggers a sickle crisis.",
    summary: [
      {
        title: "Sickle cell disease",
        body: "A point mutation in the β-globin gene (HBB), inherited autosomal recessively. HbS polymerizes when deoxygenated, so red cells stiffen and sickle.",
      },
      {
        title: "Consequences",
        body: "Sickled cells block small vessels (pain crises, stroke, acute chest syndrome) and break down early (hemolytic anemia).",
      },
      {
        title: "Trisomy 21",
        body: "A whole extra chromosome 21, usually from nondisjunction in the mother's egg. Risk rises with maternal age.",
      },
    ],
    priorities: [
      "In a sickle crisis: pain control, hydration, oxygen if hypoxic, and watch for chest syndrome and stroke signs.",
      "Teach crisis prevention: hydration, avoid cold and high altitude, treat infection early.",
    ],
    traps: [
      "Two carrier parents: 25% chance of disease, 50% chance of trait for each child.",
      "Sickle cell disease is a single-gene disorder, not a chromosomal one.",
    ],
    corrections: [
      {
        at: "1:04",
        said: "Sickle cells can form clots that cause strokes.",
        correct: "Sickled cells mainly block small vessels (vaso-occlusion). Most overt strokes come from narrowing of large brain arteries damaged by sickled cells and hemolysis. Sickle cell disease is also a clot-prone state, so thrombosis can add to the blockage.",
      },
    ],
    source: `${MH}: Genes and genetic diseases; Alterations of erythrocyte function.`,
  },
  {
    id: "f-09",
    moduleId: "f",
    index: 9,
    title: "Case: how HIV gets into a cell",
    shortTitle: "HIV: entry",
    duration: "4:54",
    video: "foundations-09",
    objective: "Describe HIV's structure and the steps of binding and entry into CD4 cells.",
    hook: "Each entry step is a drug target, so the order of binding, co-receptor and fusion matters.",
    summary: [
      {
        title: "A retrovirus",
        body: "HIV carries two copies of single-stranded RNA plus reverse transcriptase, integrase and protease, inside a lipid envelope.",
      },
      {
        title: "Target cells",
        body: "CD4-positive helper T cells, plus macrophages and dendritic cells. Losing helper T cells is what weakens the immune system.",
      },
      {
        title: "Entry",
        body: "gp120 binds CD4, then a co-receptor (CCR5 or CXCR4). This triggers gp41 to fuse the viral envelope with a host membrane, releasing the core into the cell.",
      },
      {
        title: "Hijacking the factory",
        body: "HIV has no ribosomes. It must use the host cell's machinery to copy itself.",
      },
    ],
    priorities: [
      "Monitor CD4 count and viral load. Stage 3 HIV (AIDS) is a CD4 count below 200 cells/mm³, a CD4 below 14%, or an AIDS-defining opportunistic illness.",
      "Teach prevention: condoms, PrEP, and treatment as prevention (undetectable equals untransmittable).",
    ],
    traps: [
      "gp120 binds; gp41 fuses. Do not swap them.",
      "Co-receptor binding does not simply pull the virus in; it triggers gp41 to fuse the viral and cell membranes.",
    ],
    corrections: [
      {
        at: "3:30",
        said: "The virus's antigen acts as the key into the lock.",
        correct: "The key is the envelope glycoprotein gp120, which binds CD4 and then a co-receptor.",
      },
      {
        at: "4:21",
        said: "Activating CCR5 induces endocytosis, bringing the virus into the cell.",
        correct: "Co-receptor binding triggers gp41 to fuse the viral envelope with a host membrane, releasing the core into the cell. Whether fusion happens mostly at the cell surface or after uptake into vesicles is still debated; either way, gp41-mediated fusion is the essential step.",
      },
    ],
    source: `${MH}: Alterations in immunity (acquired immunodeficiency). DHHS adult and adolescent antiretroviral guidelines.`,
  },
  {
    id: "f-10",
    moduleId: "f",
    index: 10,
    title: "Case: how HIV copies itself",
    shortTitle: "HIV: replication",
    duration: "5:23",
    video: "foundations-10",
    objective: "Sequence reverse transcription, integration, protein production, budding and maturation, and explain why HIV persists.",
    hook: "Know which enzyme does which step; drug questions map straight onto them.",
    summary: [
      {
        title: "Reverse transcription",
        body: "Reverse transcriptase copies viral RNA into DNA. It makes frequent errors, so mutations and drug resistance arise quickly.",
      },
      {
        title: "Integration",
        body: "Integrase inserts the viral DNA into the host chromosome as a provirus, which stays for the life of the cell.",
      },
      {
        title: "Production and budding",
        body: "Host enzymes transcribe the provirus and ribosomes make viral polyproteins. New virions assemble and bud from the membrane.",
      },
      {
        title: "Maturation",
        body: "Protease cuts the Gag and Gag-Pol polyproteins into working proteins, making the virion infectious.",
      },
    ],
    priorities: [
      "Stress daily adherence: missed doses let resistant virus emerge.",
      "Explain that an undetectable viral load means control, not cure, because of the latent reservoir.",
    ],
    traps: [
      "Protease acts on proteins, not on RNA.",
      "Integration happens before the host makes viral proteins, not after.",
    ],
    corrections: [
      {
        at: "0:04",
        said: "HIV carries viral mRNA.",
        correct: "HIV's genome is two copies of positive-sense, single-stranded RNA. It resembles mRNA, but after entry it is not translated; reverse transcriptase first copies it into DNA.",
      },
      {
        at: "0:40",
        said: "It uses something called DNA reverse transcriptase.",
        correct: "The enzyme is reverse transcriptase, an RNA-dependent DNA polymerase.",
      },
      {
        at: "4:46",
        said: "Protease converts immature RNA to mature RNA.",
        correct: "Protease cuts the Gag and Gag-Pol polyproteins into working proteins, which matures the virus. It does not act on RNA.",
      },
    ],
    source: `${MH}: Alterations in immunity (acquired immunodeficiency). DHHS adult and adolescent antiretroviral guidelines.`,
  },
  {
    id: "f-11",
    moduleId: "f",
    index: 11,
    title: "How HIV drugs block each step",
    shortTitle: "HIV: drug targets",
    duration: "3:43",
    video: "foundations-11",
    objective: "Match each antiretroviral class to the step it blocks, and explain why combination therapy is used.",
    hook: "Match the drug class to the step; the distractors are the neighboring steps.",
    summary: [
      {
        title: "Entry",
        body: "CCR5 antagonists (maraviroc, needs a tropism test first), the post-attachment inhibitor ibalizumab (an antibody to CD4), the attachment inhibitor fostemsavir (gp120), and the fusion inhibitor enfuvirtide (gp41; no longer marketed in the US since 2025).",
      },
      {
        title: "Reverse transcription",
        body: "NRTIs such as tenofovir and emtricitabine end the growing DNA chain. NNRTIs such as efavirenz and rilpivirine bind the enzyme elsewhere and block it.",
      },
      {
        title: "Integration and maturation",
        body: "Integrase inhibitors (dolutegravir, bictegravir) block insertion into host DNA. Protease inhibitors (boosted darunavir) leave new virions immature.",
      },
      {
        title: "Capsid inhibitor",
        body: "Lenacapavir disrupts the viral capsid, blocking several steps, including entry of viral DNA into the nucleus and assembly of new virions.",
      },
      {
        title: "Combination therapy",
        body: "Two or three active drugs from at least two classes, for example bictegravir, tenofovir alafenamide and emtricitabine or, for some clients, dolutegravir with lamivudine, so the virus cannot escape with a single mutation.",
      },
    ],
    priorities: [
      "Check for drug interactions, especially with boosted protease inhibitors.",
      "Before abacavir, confirm a negative HLA-B*5701 test; before maraviroc, confirm CCR5 tropism.",
    ],
    traps: [
      "NRTIs and NNRTIs both target reverse transcriptase, by different mechanisms.",
      "Integrase inhibitors block insertion of DNA, not reverse transcription.",
    ],
    corrections: [
      {
        at: "0:49",
        said: "A post-attachment inhibitor works by inhibiting a G protein inside the cell.",
        correct: "Ibalizumab is a monoclonal antibody that binds CD4 and blocks the changes HIV needs after attaching. It does not act on a G protein inside the cell.",
      },
      {
        at: "1:41",
        said: "The drug class is a DNA reverse transcriptase inhibitor (DRTI).",
        correct: "The classes are nucleoside/nucleotide reverse transcriptase inhibitors (NRTIs) and non-nucleoside reverse transcriptase inhibitors (NNRTIs).",
      },
      {
        at: "2:45",
        said: "Protease inhibitors stop the RNA from maturing.",
        correct: "Protease inhibitors block the cutting of viral polyproteins, so new virions stay immature and cannot infect.",
      },
    ],
    source: `DHHS Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV; ${MH}: Alterations in immunity.`,
  },
];

export const foundationsCards: Card[] = [
  { id: "fc-01-1", moduleId: "f", lessonId: "f-01", topic: "Pathology vs pathophysiology", front: "Pathology vs pathophysiology", back: "Pathology: what diseased tissue looks like. Pathophysiology: how and why function changes.", source: MH },
  { id: "fc-01-2", moduleId: "f", lessonId: "f-01", topic: "Homeostasis and allostasis", front: "Homeostasis", back: "Keeping internal variables (temperature, glucose, blood pressure, pH) within set ranges, mainly by negative feedback.", source: MH },
  { id: "fc-01-3", moduleId: "f", lessonId: "f-01", topic: "Homeostasis and allostasis", front: "Allostasis", back: "Stability through change: shifting heart rate, cortisol and blood pressure to meet a challenge.", detail: "Protective in the short term. Prolonged activation builds allostatic load.", source: `${MH}: Stress and disease` },
  { id: "fc-01-4", moduleId: "f", lessonId: "f-01", topic: "Homeostasis and allostasis", front: "Allostatic load", back: "Cumulative wear from repeated or prolonged stress responses.", detail: "Contributes to hypertension, insulin resistance and central obesity.", source: `${MH}: Stress and disease` },

  { id: "fc-02-1", moduleId: "f", lessonId: "f-02", topic: "Etiology", front: "Iatrogenic", back: "Caused by treatment or medical care.", detail: "Example: hypokalemia from a thiazide diuretic.", source: MH },
  { id: "fc-02-2", moduleId: "f", lessonId: "f-02", topic: "Etiology", front: "Nosocomial", back: "Acquired in a health care setting; for infections, not present or incubating on admission.", detail: "Examples: C. difficile, catheter-associated UTI, MRSA.", source: "CDC healthcare-associated infection definitions" },
  { id: "fc-02-3", moduleId: "f", lessonId: "f-02", topic: "Etiology", front: "Idiopathic", back: "No identifiable cause after a full workup.", source: MH },
  { id: "fc-02-4", moduleId: "f", lessonId: "f-02", topic: "Etiology", front: "Multifactorial", back: "Two or more factors (genes, environment, behavior) combine to cause disease.", detail: "Examples: type 2 diabetes, coronary artery disease.", source: MH },
  { id: "fc-02-5", moduleId: "f", lessonId: "f-02", topic: "Etiology", front: "Three broad causes of disease", back: "Environmental (e.g. lead), genetic (e.g. sickle cell disease) and pathogens (e.g. HIV).", source: MH },

  { id: "fc-03-1", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Symptom vs sign", back: "Symptom: subjective, reported by the client (pain, nausea). Sign: objective, observed or measured (edema, fever, a lab value).", source: MH },
  { id: "fc-03-2", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Biomarker", back: "A measurable indicator that supports a diagnosis.", detail: "Examples: A1C, BNP, troponin.", source: MH },
  { id: "fc-03-3", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Morbidity vs mortality", back: "Morbidity: illness (how many have it, its burden). Mortality: deaths.", source: MH },
  { id: "fc-03-4", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Diabetes diagnostic thresholds", back: "A1C ≥ 6.5%, fasting glucose ≥ 126 mg/dL, 2-hour OGTT glucose ≥ 200 mg/dL, or random glucose ≥ 200 mg/dL with classic symptoms.", detail: "Without clear hyperglycemia, two abnormal results are needed to confirm.", source: "American Diabetes Association, Standards of Care" },
  { id: "fc-03-5", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Prognosis", back: "The expected course and outcome of a disease.", source: MH },
  { id: "fc-03-6", moduleId: "f", lessonId: "f-03", topic: "Signs, symptoms and diagnosis", front: "Diagnosis vs biomarker", back: "The diagnosis names the disease. A biomarker is the measurable evidence that supports it.", source: MH },

  { id: "fc-04-1", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "BNP in heart failure", back: "Released when the ventricles are stretched. Below 100 pg/mL makes heart failure unlikely; higher values support it alongside the clinical picture.", detail: "NT-proBNP below 300 pg/mL makes it unlikely. Age and kidney disease raise levels; obesity lowers them; sacubitril/valsartan raises BNP but not NT-proBNP.", source: "2022 AHA/ACC/HFSA heart failure guideline" },
  { id: "fc-04-2", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "Diuretics and potassium", back: "Loop and thiazide diuretics: low potassium. Spironolactone, ACE inhibitors, ARBs: high potassium.", source: MH },
  { id: "fc-04-3", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "Sequela vs iatrogenic", back: "Sequela: a consequence of the disease (e.g. remodeling). Iatrogenic: a consequence of treatment (e.g. ACE-inhibitor cough).", source: MH },
  { id: "fc-04-4", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "Signs of hypokalemia", back: "Muscle weakness and cramps, palpitations, dysrhythmias; flattened T waves and U waves on ECG.", source: MH },
  { id: "fc-04-5", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "Left- vs right-sided congestion", back: "Left: lungs (orthopnea, crackles, low SpO2). Right: systemic veins (ankle edema, distended neck veins, enlarged liver).", source: MH },
  { id: "fc-04-6", moduleId: "f", lessonId: "f-04", topic: "Heart failure", front: "Ejection fraction in heart failure", back: "40% or less: reduced ejection fraction (HFrEF). 50% or more: preserved ejection fraction (HFpEF).", source: "2022 AHA/ACC/HFSA heart failure guideline" },

  { id: "fc-05-1", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Normal sodium", back: "135–145 mEq/L", source: MH },
  { id: "fc-05-2", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Normal potassium", back: "3.5–5.0 mEq/L", detail: "Heart rhythm is very sensitive to changes.", source: MH },
  { id: "fc-05-3", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Normal arterial pH", back: "7.35–7.45. Below is acidosis; above is alkalosis.", source: MH },
  { id: "fc-05-4", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Acidosis and potassium", back: "In acidosis from mineral acids, hydrogen ions move into cells and potassium moves out, so potassium rises.", detail: "The shift is small in lactic acidosis and ketoacidosis; in DKA, high potassium comes mainly from lack of insulin.", source: MH },
  { id: "fc-05-5", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "How tetanus toxin causes spasms", back: "It blocks GABA and glycine release from inhibitory neurons in the spinal cord, so motor neurons fire unchecked.", source: `${MH}: Infection` },
  { id: "fc-05-6", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Diabetic ketoacidosis", back: "No insulin, so fat is broken down and the liver makes ketones: a metabolic acidosis.", detail: "Deep, rapid (Kussmaul) breathing blows off CO2 to compensate.", source: MH },
  { id: "fc-05-7", moduleId: "f", lessonId: "f-05", topic: "Electrolytes, glucose and pH", front: "Why pH matters to proteins", back: "Outside 7.35–7.45, enzymes and ion channels change shape and work poorly.", source: MH },

  { id: "fc-06-1", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "ACE2", back: "The host receptor SARS-CoV-2's spike protein binds to enter cells.", source: MH },
  { id: "fc-06-2", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "Proteins in Alzheimer's disease", back: "Amyloid-β plaques outside neurons and tau tangles inside them.", source: MH },
  { id: "fc-06-3", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "Prion disease", back: "A misfolded prion protein converts normal copies.", detail: "Example: Creutzfeldt-Jakob disease.", source: MH },
  { id: "fc-06-4", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "How beta cells are destroyed in type 1 diabetes", back: "Mainly by autoreactive T cells. Autoantibodies (GAD65, insulin, IA-2, ZnT8) are markers.", source: MH },
  { id: "fc-06-5", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "Self-tolerance", back: "The immune system normally ignores self antigens. When tolerance fails, antibodies or T cells attack the body's own cells.", source: MH },
  { id: "fc-06-6", moduleId: "f", lessonId: "f-06", topic: "Protein problems and autoimmunity", front: "Myasthenia gravis", back: "Antibodies to acetylcholine receptors block and destroy them; weakness worsens with use and improves with rest.", source: MH },

  { id: "fc-07-1", moduleId: "f", lessonId: "f-07", topic: "Cancer genetics", front: "Proto-oncogene", back: "A normal growth-promoting gene. A gain-of-function mutation makes it an oncogene: the accelerator stuck down.", source: `${MH}: Cancer biology` },
  { id: "fc-07-2", moduleId: "f", lessonId: "f-07", topic: "Cancer genetics", front: "Tumor-suppressor gene", back: "The brakes on the cell cycle (TP53, RB1). Usually both copies must be lost.", source: `${MH}: Cancer biology` },
  { id: "fc-07-3", moduleId: "f", lessonId: "f-07", topic: "Cancer genetics", front: "DNA repair gene", back: "Fixes DNA damage (mismatch repair genes; BRCA1 and BRCA2, tumor suppressors whose job is DNA repair). Loss lets mutations pile up.", source: `${MH}: Cancer biology` },
  { id: "fc-07-4", moduleId: "f", lessonId: "f-07", topic: "Cancer genetics", front: "Why inherited mutations raise cancer risk", back: "Every cell already carries the first hit, so cancers come earlier and more often.", source: `${MH}: Cancer biology` },
  { id: "fc-07-5", moduleId: "f", lessonId: "f-07", topic: "Cancer genetics", front: "Benign vs malignant", back: "Malignant tumors invade nearby tissue and can metastasize. Fast growth alone does not make a tumor malignant.", source: `${MH}: Cancer biology` },

  { id: "fc-08-1", moduleId: "f", lessonId: "f-08", topic: "Genetic disorders", front: "Sickle cell mutation", back: "A point mutation in HBB (glutamic acid to valine at position 6), inherited autosomal recessively.", source: MH },
  { id: "fc-08-2", moduleId: "f", lessonId: "f-08", topic: "Genetic disorders", front: "Triggers of sickling", back: "Hypoxia, dehydration, infection or fever, acidosis, cold.", source: MH },
  { id: "fc-08-3", moduleId: "f", lessonId: "f-08", topic: "Genetic disorders", front: "Effects of sickling", back: "Vaso-occlusion (pain crises, stroke, acute chest syndrome) and hemolytic anemia.", source: MH },
  { id: "fc-08-4", moduleId: "f", lessonId: "f-08", topic: "Genetic disorders", front: "Trisomy 21", back: "An extra chromosome 21, usually from nondisjunction in the mother's egg. Risk rises with maternal age.", source: MH },
  { id: "fc-08-5", moduleId: "f", lessonId: "f-08", topic: "Genetic disorders", front: "Hemolysis in sickle cell disease", back: "Sickled cells break down early: anemia, jaundice, a high reticulocyte count and gallstones.", source: MH },

  { id: "fc-09-1", moduleId: "f", lessonId: "f-09", topic: "HIV entry", front: "HIV's target cells", back: "CD4-positive helper T cells, plus macrophages and dendritic cells.", source: MH },
  { id: "fc-09-2", moduleId: "f", lessonId: "f-09", topic: "HIV entry", front: "Steps of HIV entry", back: "gp120 binds CD4, then a co-receptor (CCR5 or CXCR4); gp41 fuses the membranes.", source: MH },
  { id: "fc-09-3", moduleId: "f", lessonId: "f-09", topic: "HIV entry", front: "Retrovirus", back: "An RNA virus that uses reverse transcriptase to make DNA from its RNA genome.", source: MH },
  { id: "fc-09-4", moduleId: "f", lessonId: "f-09", topic: "HIV entry", front: "CCR5-Δ32", back: "People with two copies resist HIV strains that use CCR5.", source: MH },
  { id: "fc-09-5", moduleId: "f", lessonId: "f-09", topic: "HIV entry", front: "Stage 3 HIV (AIDS)", back: "CD4 below 200 cells/mm³, CD4 below 14%, or an AIDS-defining opportunistic illness.", source: "CDC HIV surveillance case definition" },

  { id: "fc-10-1", moduleId: "f", lessonId: "f-10", topic: "HIV replication", front: "Reverse transcriptase", back: "Copies viral RNA into DNA. It is error-prone, so mutations and resistance arise.", source: MH },
  { id: "fc-10-2", moduleId: "f", lessonId: "f-10", topic: "HIV replication", front: "Integrase", back: "Inserts viral DNA into the host chromosome as a provirus.", source: MH },
  { id: "fc-10-3", moduleId: "f", lessonId: "f-10", topic: "HIV replication", front: "HIV protease", back: "Cuts the Gag and Gag-Pol polyproteins into working proteins, making the virion infectious.", source: MH },
  { id: "fc-10-4", moduleId: "f", lessonId: "f-10", topic: "HIV replication", front: "Latent reservoir", back: "Integrated provirus in resting memory CD4 cells. It is why treatment controls HIV but does not cure it.", source: MH },

  { id: "fc-11-1", moduleId: "f", lessonId: "f-11", topic: "Antiretroviral drugs", front: "CCR5 antagonist", back: "Maraviroc. Blocks entry of HIV that uses CCR5; a tropism test is needed first.", source: "DHHS antiretroviral guidelines" },
  { id: "fc-11-2", moduleId: "f", lessonId: "f-11", topic: "Antiretroviral drugs", front: "NRTI vs NNRTI", back: "NRTIs (tenofovir, emtricitabine) end the DNA chain. NNRTIs (efavirenz, rilpivirine) bind reverse transcriptase elsewhere and block it.", source: "DHHS antiretroviral guidelines" },
  { id: "fc-11-3", moduleId: "f", lessonId: "f-11", topic: "Antiretroviral drugs", front: "Integrase inhibitors", back: "Dolutegravir, bictegravir. Block insertion of viral DNA into the host genome.", source: "DHHS antiretroviral guidelines" },
  { id: "fc-11-4", moduleId: "f", lessonId: "f-11", topic: "Antiretroviral drugs", front: "Protease inhibitors", back: "Boosted darunavir. Block polyprotein cutting, so new virions stay immature.", source: "DHHS antiretroviral guidelines" },
  { id: "fc-11-5", moduleId: "f", lessonId: "f-11", topic: "Antiretroviral drugs", front: "Why combination therapy", back: "Two or three active drugs from at least two classes, so the virus cannot escape with a single mutation.", source: "DHHS antiretroviral guidelines" },
];

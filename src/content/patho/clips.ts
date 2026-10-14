/**
 * The course video: a whiteboard lecture cut into eleven clips, hosted in the
 * media store (mp4, jpg poster and vtt captions share each clip id). Each clip
 * carries the reviewers' corrections, shown under the player with a seek link.
 */
export type Clip = {
  id: string;
  title: string;
  shortTitle?: string;
  duration: string;
  corrections: { at: string; said: string; correct: string }[];
};

export const clips: Clip[] = [
  {
    id: "foundations-01",
    title: "What pathophysiology is: homeostasis and allostasis",
    shortTitle: "Homeostasis and allostasis",
    duration: "4:48",
    corrections: [
      {
        at: "3:43",
        said: "Allostasis is the body going to the area that's causing the disease and fixing it, so you get back to homeostasis.",
        correct:
          "Allostasis means stability through change: the body shifts heart rate, blood pressure and stress hormones to meet a challenge. Fighting off an infection uses these responses, but allostasis is broader than repair, and its prolonged activation builds allostatic load.",
      },
    ],
  },
  {
    id: "foundations-02",
    title: "What causes disease: etiology and how we describe it",
    shortTitle: "Etiology",
    duration: "7:05",
    corrections: [
      {
        at: "1:35",
        said: "Lead in Flint's water caused all sorts of cancers.",
        correct:
          "Lead's main harms are to the developing brain, the blood (anemia), the kidneys and, in adults, blood pressure. Inorganic lead is classed as a probable carcinogen, but cancer is not the main concern. It is a good example of an environmental cause.",
      },
      {
        at: "4:45",
        said: "Semaglutide (Ozempic) causes depression, so the depression is iatrogenic.",
        correct:
          "There is no good evidence that GLP-1 receptor agonists cause depression. In January 2026 the FDA reviewed 91 placebo-controlled trials, found no increased risk of depression or suicidal thoughts, and asked for the suicidality warning to be removed from weight-loss labels. Clearer iatrogenic examples: hypokalemia from a thiazide, C. difficile after antibiotics, Cushingoid features from long-term steroids.",
      },
      {
        at: "5:59",
        said: "MRSA is a type of fungus that causes a rash.",
        correct: "MRSA is methicillin-resistant Staphylococcus aureus, a bacterium. It commonly causes skin, wound, blood and lung infections.",
      },
    ],
  },
  {
    id: "foundations-03",
    title: "Diagnosing disease: symptoms, signs, biomarkers and prognosis",
    shortTitle: "Signs, symptoms and diagnosis",
    duration: "5:57",
    corrections: [
      {
        at: "2:34",
        said: "The diagnosis is the key marker for a disease.",
        correct: "The diagnosis is the name of the disease. The marker (a lab value, imaging finding or other biomarker) is the evidence that supports it.",
      },
      {
        at: "3:08",
        said: "Blood glucose of 1,000 millimoles per deciliter means diabetes; the normal range is about 60 to 100.",
        correct:
          "US labs report glucose in mg/dL. Normal fasting glucose is 70–99 mg/dL. Diabetes: A1C of 6.5% or higher, fasting glucose of 126 mg/dL or higher, a 2-hour glucose of 200 mg/dL or higher on a 75-g oral glucose tolerance test, or a random glucose of 200 mg/dL or higher with classic symptoms. Without clear hyperglycemia, two abnormal results are needed to confirm.",
      },
    ],
  },
  {
    id: "foundations-04",
    title: "Case: a 72-year-old with heart failure",
    shortTitle: "Case: heart failure",
    duration: "4:13",
    corrections: [
      {
        at: "2:30",
        said: "Elevated ANP is the main diagnostic marker for heart failure.",
        correct: "BNP or NT-proBNP is the natriuretic peptide measured in practice. ANP is related but is not used routinely.",
      },
      {
        at: "2:57",
        said: "After thiazides, the client develops high potassium (hyperkalemia).",
        correct:
          "Thiazide and loop diuretics cause low potassium (hypokalemia). High potassium follows potassium-sparing diuretics such as spironolactone, ACE inhibitors or ARBs, or kidney injury. Loop diuretics, not thiazides, are first-line for fluid overload in heart failure.",
      },
      {
        at: "3:29",
        said: "The cardiac hypertrophy happened in response to the heart failure.",
        correct:
          "Hypertrophy and remodeling can be both cause and consequence. Long-standing hypertension thickens the ventricle and leads to heart failure; failure then drives further remodeling.",
      },
    ],
  },
  {
    id: "foundations-05",
    title: "The cell's environment: electrolytes, glucose, toxins and pH",
    shortTitle: "The cell's environment",
    duration: "9:53",
    corrections: [
      {
        at: "3:33",
        said: "Sodium is 135–145 millimoles per deciliter.",
        correct: "Sodium is 135–145 mmol/L (the same as mEq/L for sodium).",
      },
      {
        at: "4:43",
        said: "Sodium entering heart muscle cells triggers them to contract.",
        correct:
          "Sodium entry depolarizes the cell. Calcium entering through L-type channels then triggers release of more calcium from the sarcoplasmic reticulum, and that calcium triggers contraction.",
      },
      {
        at: "7:32",
        said: "Tetanus toxin binds receptors on muscle cells and stimulates them to contract.",
        correct: "Tetanus toxin travels to the spinal cord and blocks the release of inhibitory neurotransmitters (GABA and glycine), so motor neurons fire unchecked.",
      },
    ],
  },
  {
    id: "foundations-06",
    title: "Protein problems: receptors, viral entry, antibodies and autoimmunity",
    shortTitle: "Protein problems",
    duration: "6:49",
    corrections: [
      {
        at: "0:40",
        said: "In Alzheimer's disease, a prion protein gets misshaped.",
        correct: "Alzheimer's disease involves misfolded amyloid-β and tau. Prion diseases, such as Creutzfeldt-Jakob disease, are a separate group.",
      },
      {
        at: "1:14",
        said: "ACE2 is found primarily in the nose.",
        correct:
          "ACE2 is expressed widely, not only in the nose: nasal and airway epithelium (an early entry site), alveolar type II cells, blood vessels, heart, kidneys and gut.",
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
  },
  {
    id: "foundations-07",
    title: "DNA and cancer: oncogenes, tumor suppressors and DNA repair",
    shortTitle: "DNA and cancer",
    duration: "8:44",
    corrections: [
      {
        at: "6:44",
        said: "Cancer is rapid, unregulated cell growth and division.",
        correct: "Uncontrolled growth is part of it, but malignancy is defined by invasion of nearby tissue and the ability to metastasize. Benign tumors can also grow.",
      },
    ],
  },
  {
    id: "foundations-08",
    title: "Inherited genetic disorders: sickle cell disease and trisomy 21",
    shortTitle: "Genetic disorders",
    duration: "1:27",
    corrections: [
      {
        at: "1:04",
        said: "Sickle cells can form clots that cause strokes.",
        correct:
          "Sickled cells mainly block small vessels (vaso-occlusion). Most overt strokes come from narrowing of large brain arteries damaged by sickled cells and hemolysis. Sickle cell disease is also a clot-prone state, so thrombosis can add to the blockage.",
      },
    ],
  },
  {
    id: "foundations-09",
    title: "Case: how HIV gets into a cell",
    shortTitle: "HIV: entry",
    duration: "4:54",
    corrections: [
      {
        at: "3:30",
        said: "The virus's antigen acts as the key into the lock.",
        correct: "The key is the envelope glycoprotein gp120, which binds CD4 and then a co-receptor.",
      },
      {
        at: "4:21",
        said: "Activating CCR5 induces endocytosis, bringing the virus into the cell.",
        correct:
          "Co-receptor binding triggers gp41 to fuse the viral envelope with a host membrane, releasing the core into the cell. Whether fusion happens mostly at the cell surface or after uptake into vesicles is still debated; either way, gp41-mediated fusion is the essential step.",
      },
    ],
  },
  {
    id: "foundations-10",
    title: "Case: how HIV copies itself",
    shortTitle: "HIV: replication",
    duration: "5:23",
    corrections: [
      {
        at: "0:04",
        said: "HIV carries viral mRNA.",
        correct:
          "HIV's genome is two copies of positive-sense, single-stranded RNA. It resembles mRNA, but after entry it is not translated; reverse transcriptase first copies it into DNA.",
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
  },
  {
    id: "foundations-11",
    title: "How HIV drugs block each step",
    shortTitle: "HIV: drug targets",
    duration: "3:43",
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
  },
];

export const clipById = (id: string) => clips.find((c) => c.id === id);

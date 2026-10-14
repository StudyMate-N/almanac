import type { ASection } from "./author";

// Section 7 rebuilt to course standard v1: one page per topic. Question and card ids unchanged.
// Items marked "REVIEW" need owner approval in the review screen.
const T = "McCance & Huether, Pathophysiology";

export const s7: ASection = {
  id: "s7",
  num: 7,
  kind: "section",
  title: "Endocrine and Reproductive Systems",
  blurb: "Hormone feedback; pituitary, thyroid and adrenal disorders; diabetes and its complications; STIs, PID, PCOS, endometriosis, breast, prostate and testicular disease.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of endocrine and reproductive disorders.",
  source: `${T}: Mechanisms of hormonal regulation; Alterations of hormonal regulation; Structure and function of the reproductive systems; Alterations of the female and male reproductive systems; Sexually transmitted infections.`,
  groups: [
    {
      id: "s7-topics",
      title: "Topics",
      pages: [
        {
          id: "s7-tp0",
          title: "7.0 Meet Sheila",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The endocrine and reproductive systems are joined by hormones. Glands release chemical messengers into the blood to regulate metabolism, growth, fluid balance and fertility, and most are controlled by <strong>feedback loops</strong> running from the hypothalamus to the pituitary to the target gland and back. The ovaries and testes are endocrine glands as well as reproductive organs. Key ideas in this section: the hypothalamic–pituitary axis, <strong>negative feedback</strong>, <strong>hormone resistance</strong>, and fertility.",
            },
            { t: "p", html: "Five patients run through this section." },
            {
              t: "case",
              title: "Sheila, 42",
              html: "Sheila is always tired and cold, has gained 6 kg, and has dry skin, thinning hair, constipation and heavier periods.",
            },
            {
              t: "case",
              title: "Leo, 12",
              html: "Leo has type 1 diabetes. After two days of a stomach bug he is drowsy, breathing deeply and fast, and his breath smells fruity.",
            },
            {
              t: "case",
              title: "Jennifer, 26",
              html: "Jennifer has bleeding between periods and after sex, and an unusual vaginal discharge. She has a new partner and they do not use condoms.",
            },
            {
              t: "case",
              title: "Lily, 28",
              html: "Lily has tried to conceive for 13 months. Her periods come every two to four months, she has acne and coarse dark hair on her chin, and her BMI is 33.",
            },
            {
              t: "case",
              title: "Daniel, 54",
              html: "Daniel gets up four times a night to urinate. His stream is weak and he feels he never quite empties his bladder.",
            },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Explain negative feedback and tell primary from secondary endocrine disorders.",
                "Describe pituitary, thyroid and adrenal disorders by their hormone excess or deficit.",
                "Compare type 1 and type 2 diabetes, DKA and HHS, and explain the chronic complications of diabetes.",
                "Describe common sexually transmitted infections and pelvic inflammatory disease.",
                "Describe PCOS, endometriosis and breast cancer, including triple-negative disease.",
                "Describe BPH, prostate cancer and its treatment side effects, testicular cancer and causes of erectile dysfunction.",
              ],
            },
          ],
        },
        {
          id: "s7-tp1",
          title: "7.1 Pituitary and hypothalamus",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do disorders of the pituitary and hypothalamus throw other glands out of balance?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Negative feedback: target hormone switches off the hypothalamus and pituitary. In primary gland failure, the stimulating hormone (e.g., TSH) is high.",
                "Pituitary tumors: mass effect (headache, bitemporal hemianopia), excess of one hormone (prolactin, GH, ACTH) and deficit of the others.",
                "DI: too little ADH effect, dilute urine, high sodium. SIADH: too much ADH, concentrated urine, low sodium.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p1",
              stem: "A pituitary tumor grows upward. Which vision goes first?",
              options: [{ id: "a", text: "The outer field on both sides" }, { id: "b", text: "Central vision" }],
              correct: "a",
              reveal: "It presses on the optic chiasm, where fibers from the inner retinas cross, causing bitemporal hemianopia.",
            },
            { t: "h2", text: "Negative feedback" },
            {
              t: "p",
              html: "Most hormones are controlled like a thermostat. The hypothalamus releases a releasing hormone; the pituitary responds with a stimulating hormone; the target gland releases its hormone; and that hormone feeds back to switch off the hypothalamus and pituitary. For the thyroid: TRH → TSH → T4 and T3, which suppress TRH and TSH.",
            },
            {
              t: "table",
              head: ["Level of the problem", "Thyroid example", "Pattern"],
              rows: [
                [
                  "Primary: the target gland",
                  "Hashimoto thyroiditis",
                  "Low T4, <strong>high</strong> TSH (the pituitary is shouting at a failing gland)",
                ],
                [
                  "Secondary: the pituitary",
                  "Pituitary tumor destroying TSH-producing cells",
                  "Low T4, <strong>low or normal</strong> TSH",
                ],
                ["Tertiary: the hypothalamus", "Hypothalamic damage", "Low TRH, low TSH, low T4"],
              ],
            },
            // REVIEW: new diagram (image manifest: built as page diagrams). From the text and table above.
            {
              t: "diagram",
              id: "d-endocrine-axes",
              layout: "chain",
              title: "Hypothalamus → pituitary → target gland",
              alt: "Endocrine axis: the hypothalamus releases TRH or CRH, the anterior pituitary releases TSH or ACTH, the thyroid or adrenal cortex releases T4 and T3 or cortisol, and the target hormone switches off the hypothalamus and pituitary by negative feedback.",
              items: [
                { label: "Hypothalamus", sub: "Releasing hormone: TRH, CRH" },
                { label: "Anterior pituitary", sub: "Stimulating hormone: TSH, ACTH" },
                { label: "Target gland", sub: "Thyroid, adrenal cortex" },
                { label: "Target hormone", sub: "T₄ and T₃, cortisol" },
              ],
              feedback: "Negative feedback: the target hormone switches off the hypothalamus and pituitary",
              note: "Primary failure (the gland): target hormone low, stimulating hormone high. Secondary failure (the pituitary): both low.",
            },
            {
              t: "p",
              html: "Endocrine disease is either too much hormone, too little, or <strong>resistance</strong>: the hormone is present but the tissue does not respond, as in type 2 diabetes (insulin resistance) and nephrogenic diabetes insipidus (resistance to ADH).",
            },
            { t: "h2", text: "Pituitary tumors" },
            { t: "p", html: "Most pituitary tumors are benign adenomas. They cause problems in three ways:" },
            // REVIEW: new image
            {
              t: "img",
              id: "s7-pituitary-adenoma",
              alt: "Side view of the brain base: a pituitary tumour growing upward and pressing on the centre of the optic chiasm.",
              panels: [{ label: "Pituitary adenoma", sub: "Grows upward" }, { label: "Optic chiasm", sub: "Compressed centre" }],
              aspect: "3:2",
            },
            {
              t: "table",
              head: ["Effect", "What you see"],
              rows: [
                [
                  "Mass effect",
                  "Headache; pressure on the optic chiasm above the pituitary causes loss of the outer visual fields in both eyes (bitemporal hemianopia)",
                ],
                [
                  "Too much of one hormone",
                  "Prolactin (the most common): milky nipple discharge, absent periods and infertility in women; low libido and erectile dysfunction in men. Growth hormone: gigantism before growth plates close, acromegaly after (large hands, feet, jaw and facial features; diabetes and hypertension). ACTH: Cushing disease",
                ],
                [
                  "Too little of the others",
                  "Compressed normal pituitary cells: hypopituitarism (low thyroid, adrenal and sex hormone function)",
                ],
              ],
            },
            { t: "h2", text: "Antidiuretic hormone (ADH) disorders" },
            {
              t: "table",
              head: ["", "Diabetes insipidus (now also called AVP deficiency or AVP resistance)", "SIADH"],
              rows: [
                [
                  "Problem",
                  "Too little ADH (central: head injury, surgery, tumor) or kidneys that ignore it (nephrogenic: lithium, chronic kidney disease)",
                  "Too much ADH: small cell lung cancer, brain injury or infection, lung disease, drugs such as SSRIs and carbamazepine",
                ],
                ["Urine", "Large volumes of dilute urine (low specific gravity)", "Small volumes of concentrated urine"],
                [
                  "Blood",
                  "Sodium and osmolality rise; intense thirst; dehydration",
                  "Water is retained, so sodium falls (dilutional hyponatremia): headache, confusion, seizures",
                ],
              ],
            },
            {
              t: "q",
              q: {
                id: "s7-c1",
                type: "ms",
                stem: "A client has a large pituitary adenoma that secretes prolactin. Which disorders could develop as a result of this tumor? <strong>Choose 3 answers.</strong>",
                options: [
                  {
                    t: "Loss of the outer visual fields from pressure on the optic chiasm",
                    ok: true,
                    why: "The chiasm sits just above the pituitary.",
                  },
                  {
                    t: "Absent periods and infertility",
                    ok: true,
                    why: "High prolactin suppresses the hormones that drive ovulation.",
                  },
                  {
                    t: "Hypothyroidism from compression of normal pituitary cells",
                    ok: true,
                    why: "A large tumor can reduce TSH production.",
                  },
                  { t: "Graves disease", ok: false, why: "Graves disease is autoimmune stimulation of the thyroid itself." },
                  { t: "Type 1 diabetes", ok: false, why: "Type 1 diabetes is autoimmune destruction of beta cells." },
                ],
                rationale: "Pituitary tumors: mass effect, excess of one hormone, deficit of the others.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open1",
              stem: "Why is sodium low in SIADH?",
              expert: "Too much ADH makes the kidneys hold on to water. The retained water dilutes the blood, so sodium falls while urine stays concentrated.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "Alterations of hormonal regulation: the hypothalamic–pituitary system",
                  note: "Pituitary tumors, hypopituitarism, ADH disorders.",
                },
              ],
            },
          ],
        },
        {
          id: "s7-tp2",
          title: "7.2 Thyroid and adrenal",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What are the characteristic signs of thyroid and adrenal disorders?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Hypothyroidism (Hashimoto): slow, cold, weight gain, high TSH.",
                "Hyperthyroidism (Graves): fast, hot, weight loss, low TSH; exophthalmos is specific to Graves.",
                "Cushing: excess cortisol, most often from steroid medication.",
                "Addison: low cortisol and aldosterone, high potassium, hyperpigmentation.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p2",
              stem: "In primary hypothyroidism, is TSH high or low?",
              options: [{ id: "a", text: "High" }, { id: "b", text: "Low" }],
              correct: "a",
              reveal: "The failing thyroid stops switching off the pituitary, so TSH rises.",
            },
            { t: "h2", text: "Thyroid" },
            {
              t: "table",
              head: ["", "Hypothyroidism", "Hyperthyroidism"],
              rows: [
                [
                  "Most common cause in the US",
                  "Hashimoto thyroiditis: autoimmune destruction of the gland (iodine deficiency worldwide)",
                  "Graves disease: antibodies that stimulate the TSH receptor",
                ],
                [
                  "Metabolism",
                  "Slows: fatigue, cold intolerance, weight gain, constipation",
                  "Speeds: heat intolerance, sweating, weight loss with good appetite, frequent stools",
                ],
                ["Heart", "Slow heart rate", "Fast heart rate, palpitations, atrial fibrillation"],
                ["Skin and hair", "Dry, coarse skin; hair loss; puffy face", "Warm, moist skin; fine hair"],
                ["Mind and nerves", "Slow thinking, depression, slow reflexes", "Anxiety, irritability, tremor, insomnia"],
                ["Periods", "Heavy", "Light or absent"],
                ["Labs (primary disease)", "High TSH, low free T4", "Low TSH, high free T4 and T3"],
                [
                  "Emergency",
                  "Myxedema coma: hypothermia, slowed breathing, reduced consciousness",
                  "Thyroid storm: high fever, severe tachycardia, delirium",
                ],
              ],
            },
            {
              t: "p",
              html: "Bulging eyes (exophthalmos) and thickened skin on the shins are specific to <strong>Graves disease</strong>, not to other causes of hyperthyroidism. A goiter (enlarged thyroid) can occur with too much or too little hormone.",
            },
            {
              t: "q",
              q: {
                id: "s7-c2",
                type: "mc",
                stem: "Sheila (42) is tired and cold, has gained weight, and has dry skin, thinning hair, constipation and heavy periods. Her TSH is high and free T4 is low. Which gland is experiencing dysfunction?",
                options: [
                  {
                    t: "The thyroid gland",
                    ok: true,
                    why: "High TSH with low T4 is primary hypothyroidism: the thyroid is failing and the pituitary is trying to drive it.",
                  },
                  { t: "The pituitary gland", ok: false, why: "Pituitary failure would give a low or normal TSH." },
                  {
                    t: "The adrenal cortex",
                    ok: false,
                    why: "Adrenal failure causes weight loss, low blood pressure and salt craving.",
                  },
                  { t: "The pancreas", ok: false, why: "Nothing here points to glucose regulation." },
                ],
                rationale: "TSH moves opposite to the thyroid in primary disease.",
                level: "application",
              },
            },
            { t: "h2", text: "Adrenal" },
            {
              t: "table",
              head: ["", "Cushing syndrome (too much cortisol)", "Addison disease (primary adrenal insufficiency)"],
              rows: [
                [
                  "Common cause",
                  "Long-term glucocorticoid medication (most common); pituitary ACTH tumor (Cushing <em>disease</em>); adrenal tumor",
                  "Autoimmune destruction of the adrenal cortex (most common in high-income countries); TB worldwide",
                ],
                [
                  "Picture",
                  "Central weight gain, round face, fat pad between the shoulders, purple stretch marks, thin skin that bruises, weak muscles",
                  "Fatigue, weight loss, low blood pressure, salt craving, nausea",
                ],
                [
                  "Labs and effects",
                  "High glucose, hypertension, low potassium, osteoporosis, infections, mood changes",
                  "Low sodium, <strong>high potassium</strong> (no aldosterone), low glucose",
                ],
                ["Skin", "Thin, fragile", "Darkened skin and gums: high ACTH stimulates melanocytes"],
                ["Emergency", "—", "Adrenal crisis (shock) with stress, infection or sudden steroid withdrawal"],
              ],
            },
            {
              t: "callout",
              title: "Never stop long-term steroids suddenly",
              html: "Months of glucocorticoids suppress ACTH, and the adrenals shrink. Stopping abruptly leaves the body without cortisol and can cause an adrenal crisis. Doses are tapered.",
            },
            {
              t: "ul",
              items: [
                "<strong>Pheochromocytoma:</strong> a tumor of the adrenal medulla releasing epinephrine and norepinephrine. Episodes of severe hypertension, pounding headache, sweating and palpitations.",
                "<strong>Primary hyperaldosteronism:</strong> excess aldosterone. Hypertension with low potassium; a common cause of secondary hypertension.",
              ],
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open2",
              stem: "Why must long-term steroids be tapered rather than stopped?",
              expert: "Steroid medication suppresses ACTH, so the adrenal glands shrink and stop making cortisol. Stopping suddenly leaves the body without cortisol, which can cause an adrenal crisis.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 694–700: Alterations of thyroid function" },
                { ref: "pp. 715–718: Alterations of adrenal function" },
              ],
            },
          ],
        },
        {
          id: "s7-tp3",
          title: "7.3 Diabetes and its complications",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do the acute and chronic complications of diabetes develop?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "DKA: type 1, ketones, acidosis, Kussmaul breathing.",
                "HHS: type 2, extreme glucose and osmolality, little ketosis, slower onset.",
                "Microvascular complications: eyes, kidneys, nerves.",
                "Macrovascular complications: heart, brain, legs.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p3",
              stem: "Why does DKA cause deep, fast breathing?",
              options: [{ id: "a", text: "To blow off acid as CO₂" }, { id: "b", text: "To take in more oxygen" }],
              correct: "a",
              reveal: "Kussmaul breathing is the lungs compensating for metabolic acidosis by blowing off CO₂.",
            },
            {
              t: "p",
              html: "You met type 1 and type 2 diabetes and diabetic ketoacidosis in Section 1. Here the focus is on the complications.",
            },
            {
              t: "table",
              caption: "Diagnosis of diabetes (American Diabetes Association). Without clear hyperglycemia, an abnormal result is confirmed with a second test.",
              head: ["Test", "Diabetes"],
              rows: [
                ["Hemoglobin A1C", "6.5% or higher"],
                ["Fasting plasma glucose", "126 mg/dL or higher"],
                ["2-hour glucose on a 75-g oral glucose tolerance test", "200 mg/dL or higher"],
                ["Random glucose with classic symptoms", "200 mg/dL or higher"],
              ],
            },
            { t: "h2", text: "Acute complications" },
            {
              t: "table",
              head: ["", "Diabetic ketoacidosis (DKA)", "Hyperosmolar hyperglycemic state (HHS)"],
              rows: [
                ["Who", "Usually type 1 (can occur in type 2)", "Usually older adults with type 2"],
                ["Insulin", "Absent or nearly absent", "Enough to prevent ketone production, not enough to control glucose"],
                [
                  "Mechanism",
                  "Without insulin, fat is broken down into ketone acids",
                  "Extreme hyperglycemia pulls water out of cells and causes massive osmotic diuresis",
                ],
                [
                  "Glucose",
                  "High (200 mg/dL or more, or known diabetes); can be near normal with SGLT2 inhibitors, pregnancy or poor intake (euglycemic DKA)",
                  "Very high (often above 600 mg/dL)",
                ],
                [
                  "Ketones and pH",
                  "Ketones present; metabolic acidosis with a high anion gap",
                  "Little or no ketosis; pH near normal",
                ],
                [
                  "Signs",
                  "Kussmaul breathing, fruity breath, abdominal pain, vomiting",
                  "Profound dehydration, very high osmolality, confusion to coma",
                ],
                ["Onset", "Hours to a day or two", "Days to weeks"],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s7-insulin-glucose",
              alt: "Cell membranes: normal, with insulin bound and glucose entering; type 1, with no insulin and glucose outside; type 2, with insulin present but few transporters and glucose outside.",
              panels: [
                { label: "Normal", sub: "Insulin binds, glucose enters" },
                { label: "Type 1", sub: "No insulin" },
                { label: "Type 2", sub: "Insulin present, resistance" },
              ],
              aspect: "3:1",
            },
            {
              t: "p",
              html: "<strong>Hypoglycemia</strong> (glucose below 70 mg/dL) is the most common acute complication of treatment. Early signs come from adrenaline: shakiness, sweating, fast heart rate, hunger, anxiety. Later signs come from the brain running out of glucose: confusion, odd behavior, seizures, loss of consciousness. Beta-blockers and long-standing diabetes can mask the early warning signs.",
            },
            {
              t: "q",
              q: {
                id: "s7-c3",
                type: "mc",
                stem: "Leo (12) has type 1 diabetes and a two-day stomach bug. He is drowsy, breathing deeply and fast, and his breath smells fruity. Glucose 480 mg/dL; pH 7.12; urine ketones large. What would you suspect he is experiencing?",
                options: [
                  {
                    t: "Diabetic ketoacidosis",
                    ok: true,
                    why: "Absent insulin, ketones, acidosis and Kussmaul breathing in a child with type 1 diabetes.",
                  },
                  {
                    t: "Hyperosmolar hyperglycemic state",
                    ok: false,
                    why: "HHS has little or no ketosis and a near-normal pH, usually in older adults with type 2.",
                  },
                  { t: "Hypoglycemia", ok: false, why: "His glucose is very high." },
                  {
                    t: "Gastroenteritis alone",
                    ok: false,
                    why: "The illness triggered it, but the ketones and acidosis are DKA.",
                  },
                ],
                rationale: "Illness raises insulin needs; skipped or insufficient insulin tips type 1 into DKA.",
                level: "application",
              },
            },
            { t: "h2", text: "Chronic complications" },
            {
              t: "p",
              html: "Years of high glucose damage blood vessels and nerves. Glucose attaches to proteins (forming advanced glycation end products), sorbitol builds up inside nerve and lens cells, and small-vessel basement membranes thicken. The result:",
            },
            {
              t: "table",
              head: ["Microvascular (small vessels)", "Macrovascular (large vessels)", "Other"],
              rows: [
                [
                  "Retinopathy: leading cause of new blindness in working-age adults",
                  "Coronary artery disease and MI (often silent)",
                  "Infections and poor wound healing",
                ],
                ["Nephropathy: leading cause of kidney failure", "Stroke", "Gastroparesis, erectile dysfunction"],
                [
                  "Neuropathy: numb feet, foot ulcers, autonomic problems",
                  "Peripheral artery disease: claudication, amputation",
                  "Cataract, periodontal disease",
                ],
              ],
            },
            {
              t: "callout",
              title: "Variation",
              html: "Type 2 diabetes is more common and starts younger in people of Black, Hispanic/Latino, American Indian, Alaska Native, Asian American and Pacific Islander heritage. A1C can read falsely high or low with some hemoglobin variants and anemias. Older adults often present with HHS rather than DKA.",
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open3",
              stem: "Why does HHS cause little ketosis?",
              expert: "In type 2 diabetes there is usually enough insulin to stop fat breakdown and ketone production, but not enough to control glucose. Glucose climbs very high without much ketosis.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 702–709: Dysfunction of the endocrine pancreas: diabetes mellitus and its types" },
                { ref: "pp. 709–715: Acute and chronic complications of diabetes mellitus" },
              ],
            },
          ],
        },
        {
          id: "s7-l11-quiz",
          topic: "Endocrine Pathophysiology",
          title: "Quiz: Lesson 11 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on hormone feedback, the thyroid, adrenal glands and diabetes." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s7-q1",
                  type: "mc",
                  stem: "A client has weight loss, a fast heart rate, tremor, heat intolerance and bulging eyes. TSH is very low and free T4 is high. Which disorder is consistent with these findings?",
                  options: [
                    { t: "Graves disease", ok: true, why: "Hyperthyroid features with exophthalmos point to Graves disease." },
                    { t: "Hashimoto thyroiditis", ok: false, why: "Hashimoto causes hypothyroidism." },
                    {
                      t: "Addison disease",
                      ok: false,
                      why: "Addison disease causes fatigue and low blood pressure, not hyperthyroid signs.",
                    },
                    { t: "Secondary hypothyroidism", ok: false, why: "T4 is high, not low." },
                  ],
                  rationale: "Hot, fast, thin, bulging eyes = Graves.",
                  level: "application",
                },
                {
                  id: "s7-q2",
                  type: "mc",
                  stem: "A client with Addison disease has a potassium of 6.0 mEq/L. What is the pathophysiological reason for this finding?",
                  options: [
                    {
                      t: "Without aldosterone, the kidneys cannot excrete potassium",
                      ok: true,
                      why: "Aldosterone normally drives potassium excretion in the distal nephron.",
                    },
                    { t: "Excess cortisol shifts potassium out of cells", ok: false, why: "Cortisol is low in Addison disease." },
                    { t: "Too much ADH dilutes the blood", ok: false, why: "That would lower sodium, not raise potassium." },
                    { t: "High insulin moves potassium into the blood", ok: false, why: "Insulin moves potassium into cells." },
                  ],
                  rationale: "No aldosterone = keep potassium, lose sodium.",
                  level: "application",
                },
                {
                  id: "s7-q3",
                  type: "mc",
                  stem: "A 50-year-old with a pituitary tumor has a larger jaw and nose, wider hands and feet, and new diabetes. Which hormone is in excess?",
                  options: [
                    {
                      t: "Growth hormone",
                      ok: true,
                      why: "After the growth plates close, excess GH enlarges bones of the face, hands and feet and causes insulin resistance.",
                    },
                    { t: "Prolactin", ok: false, why: "Prolactin excess causes galactorrhea and infertility." },
                    { t: "ADH", ok: false, why: "ADH excess causes hyponatremia." },
                    { t: "TSH", ok: false, why: "TSH excess would cause hyperthyroidism." },
                  ],
                  rationale: "GH: gigantism before growth plates close, acromegaly after.",
                  level: "application",
                },
                {
                  id: "s7-q4",
                  type: "mc",
                  stem: "A client with type 2 diabetes for 15 years has numb feet and a painless ulcer on the sole. What is the pathophysiological reason for this complication?",
                  options: [
                    {
                      t: "Hyperglycemia has damaged his nerves and small vessels",
                      ok: true,
                      why: "Neuropathy removes protective sensation; microvascular disease slows healing.",
                    },
                    { t: "Repeated ketoacidosis has damaged the skin", ok: false, why: "DKA is an acute metabolic emergency." },
                    {
                      t: "Years of insulin therapy have damaged the nerves",
                      ok: false,
                      why: "Chronic hyperglycemia, not insulin, damages nerves.",
                    },
                    {
                      t: "An autoimmune attack on the skin of the foot",
                      ok: false,
                      why: "Diabetic foot ulcers are not autoimmune.",
                    },
                  ],
                  rationale: "Neuropathy + poor perfusion = the diabetic foot.",
                  level: "application",
                },
                {
                  id: "s7-q5",
                  type: "mc",
                  stem: "When comparing diabetic ketoacidosis (DKA) with hyperosmolar hyperglycemic state (HHS), what is a significant difference?",
                  options: [
                    {
                      t: "DKA causes ketoacidosis; HHS causes little or no ketosis",
                      ok: true,
                      why: "Residual insulin in HHS prevents ketogenesis.",
                    },
                    { t: "HHS develops much faster than DKA", ok: false, why: "HHS develops over days to weeks." },
                    { t: "DKA occurs only in type 2 diabetes", ok: false, why: "DKA is typical of type 1." },
                    { t: "Glucose is usually higher in DKA than in HHS", ok: false, why: "HHS usually has the higher glucose." },
                  ],
                  rationale: "Ketones are the dividing line.",
                  level: "application",
                },
              ],
            },
          ],
        },
        {
          id: "s7-tp4",
          title: "7.4 STIs, PID and sexual dysfunction",
          kind: "topic",
          blocks: [
            {
              t: "eq",
              text: "What causes sexually transmitted infections, pelvic inflammatory disease and sexual dysfunction?",
            },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Chlamydia is the most commonly reported bacterial STI and is often silent. Many STIs are transmissible without symptoms: screen, treat partners.",
                "Syphilis: painless chancre, then a rash on palms and soles. HSV recurs from nerve ganglia. High-risk HPV causes cervical cancer.",
                "PID: ascending chlamydia or gonorrhea; cervical motion tenderness; infertility and ectopic pregnancy are the complications.",
                "Erectile dysfunction is most often vascular and can be an early sign of coronary disease.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p4",
              stem: "Most chlamydia infections are…",
              options: [{ id: "a", text: "Silent" }, { id: "b", text: "Painful" }],
              correct: "a",
              reveal: "Chlamydia is often silent, which is why screening and partner treatment matter.",
            },
            {
              t: "p",
              html: "The female reproductive system includes the ovaries, fallopian tubes, uterus, cervix, vagina and breasts; the male system includes the testes, ducts, prostate and penis. Both are run by the same axis: hypothalamic GnRH → pituitary FSH and LH → ovarian estrogen and progesterone or testicular testosterone, with negative feedback.",
            },
            {
              t: "table",
              head: ["Menstrual cycle phase", "What happens"],
              rows: [
                ["Follicular (days 1–14)", "FSH grows follicles; rising estrogen rebuilds the endometrium"],
                ["Ovulation (about day 14)", "An LH surge releases the egg"],
                [
                  "Luteal (days 15–28)",
                  "The corpus luteum makes progesterone, which prepares the endometrium; without pregnancy, hormones fall and the lining sheds",
                ],
              ],
            },
            {
              t: "table",
              head: ["Infection", "Organism", "Key features"],
              rows: [
                [
                  "Chlamydia",
                  "<em>Chlamydia trachomatis</em> (bacterium)",
                  "The most commonly reported bacterial STI in the US. Often silent, especially in women; cervicitis, bleeding between periods or after sex, discharge, painful urination. A leading cause of PID and tubal infertility",
                ],
                [
                  "Gonorrhea",
                  "<em>Neisseria gonorrhoeae</em> (bacterium)",
                  "Purulent discharge and painful urination (more often symptomatic in men); PID; can spread to joints and skin; growing antibiotic resistance",
                ],
                [
                  "Syphilis",
                  "<em>Treponema pallidum</em> (bacterium)",
                  "Primary: a painless chancre. Secondary: rash including palms and soles, fever, swollen nodes. Latent, then tertiary disease of heart, brain and nerves. Neurologic, eye and ear involvement can occur at any stage. Can cross the placenta",
                ],
                [
                  "Genital herpes",
                  "Herpes simplex virus (HSV-2 or HSV-1)",
                  "Painful vesicles and ulcers; the virus stays latent in sensory nerve ganglia and recurs; can be shed without symptoms",
                ],
                [
                  "Human papillomavirus",
                  "HPV",
                  "Low-risk types cause genital warts; high-risk types (especially 16 and 18) cause cervical, anal and throat cancers. Vaccine available",
                ],
                [
                  "Trichomoniasis",
                  "<em>Trichomonas vaginalis</em> (protozoan)",
                  "Frothy yellow-green discharge, itching; most infections in both women and men are silent",
                ],
                ["HIV", "Retrovirus", "See Lesson 7.2"],
              ],
            },
            {
              t: "callout",
              title: "What's true of STIs in general",
              html: "Many are silent yet transmissible, so screening matters. Having one STI raises the risk of others, including HIV. Partners need testing and treatment to prevent reinfection. Condoms lower but do not eliminate risk, especially for infections spread by skin contact (HSV, HPV, syphilis). A full sexual history asks about partners, practices, protection, past STIs and pregnancy plans, without judgment.",
            },
            { t: "h2", text: "Pelvic inflammatory disease (PID)" },
            {
              t: "p",
              html: "PID is infection ascending from the cervix to the uterus, fallopian tubes and ovaries, most often from chlamydia or gonorrhea. Expect lower abdominal pain, <strong>cervical motion tenderness</strong>, uterine or adnexal tenderness, fever and discharge. Scarring of the tubes causes the complications: <strong>infertility, ectopic pregnancy, chronic pelvic pain</strong> and tubo-ovarian abscess.",
            },
            {
              t: "q",
              q: {
                id: "s7-c4",
                type: "mc",
                stem: "Jennifer (26) has bleeding between periods and after sex and an unusual discharge, and has a new partner. Her cervix bleeds easily when touched. She asks whether she could have an infection even though her partner has no symptoms. What is the best response by the provider?",
                options: [
                  {
                    t: "\"Yes. Infections like chlamydia are often silent but still spread, so we will test you both.\"",
                    ok: true,
                    why: "Chlamydia is often silent and is a common cause of cervicitis with this kind of bleeding.",
                  },
                  {
                    t: "\"No. If he had an infection, he would definitely have symptoms by now.\"",
                    ok: false,
                    why: "Many STIs are asymptomatic in both sexes.",
                  },
                  {
                    t: "\"Bleeding between periods at your age is usually caused by cancer.\"",
                    ok: false,
                    why: "Cervicitis from infection is far more likely at her age, though persistent bleeding is always investigated.",
                  },
                  {
                    t: "\"Possibly, but only the partner with symptoms needs any treatment.\"",
                    ok: false,
                    why: "Partners need treatment to prevent reinfection.",
                  },
                ],
                rationale: "Silent but transmissible: test, treat partners, prevent PID.",
                level: "application",
              },
            },
            { t: "h2", text: "Sexual dysfunction" },
            {
              t: "p",
              html: "<strong>Erectile dysfunction</strong> needs healthy arteries, nerves, hormones and mental state. The most common physical cause is <strong>vascular</strong>: atherosclerosis, hypertension, smoking and diabetes narrow penile arteries. Diabetes also damages nerves. Other causes: medications (some antihypertensives, SSRIs), low testosterone, pelvic surgery or radiation (including prostate cancer treatment), spinal cord injury, alcohol, depression and anxiety. Because penile arteries are small, ED can be an early warning of coronary artery disease. In women, sexual dysfunction includes low desire, arousal and orgasm disorders and pain with intercourse, influenced by hormones (menopause), medications, pelvic disorders such as endometriosis, and relationship and mental health factors.",
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open4",
              stem: "Why can pelvic inflammatory disease lead to ectopic pregnancy?",
              expert: "Infection ascending into the fallopian tubes scars them. A fertilized egg can be caught in a scarred tube and implant there instead of in the uterus.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 800–802 and 853–855: Sexual dysfunction (female and male)" },
                { ref: "pp. 866–870 and 877–884: Sexually transmitted urogenital infections; viral infections" },
                { ref: "pp. 778–779: Pelvic inflammatory disease; pp. 886–888: STIs of other body systems" },
              ],
            },
          ],
        },
        {
          id: "s7-tp5",
          title: "7.5 PCOS, endometriosis and breast cancer",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What are the manifestations of common female reproductive disorders?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "PCOS: insulin resistance and high LH → androgen excess → anovulation, hirsutism, infertility; long-term diabetes and endometrial risk.",
                "Endometriosis: endometrium outside the uterus; pain and infertility. Adenomyosis: endometrium in the uterine wall; heavy painful periods.",
                "Triple-negative breast cancer lacks ER, PR and HER2: aggressive, more common in younger and Black women and BRCA1 carriers; no hormone or HER2 therapy.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p5",
              stem: "Insulin resistance in PCOS drives up which hormones?",
              options: [{ id: "a", text: "Androgens" }, { id: "b", text: "Progesterone" }],
              correct: "a",
              reveal: "Insulin resistance and high LH push the ovary to make androgens, causing anovulation and hirsutism.",
            },
            { t: "h2", text: "Polycystic ovary syndrome (PCOS)" },
            {
              t: "p",
              html: "PCOS is the most common endocrine disorder in women of reproductive age. Diagnosis needs two of three: <strong>irregular or absent ovulation</strong>, <strong>signs of excess androgen</strong> (hirsutism, acne, raised testosterone) and <strong>polycystic ovaries</strong> on ultrasound, with other causes excluded.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s7-pcos-ovary",
              alt: "Ovaries: normal with follicles at different stages; polycystic, enlarged with many small follicles in a ring and no mature follicle.",
              panels: [
                { label: "Normal ovary", sub: "Follicles at all stages" },
                { label: "Polycystic ovary", sub: "Many small follicles" },
              ],
              aspect: "3:2",
            },
            {
              t: "ol",
              items: [
                "Insulin resistance raises insulin levels, and the pituitary releases relatively more LH than FSH.",
                "High insulin and LH drive the ovary's theca cells to make excess androgen.",
                "Androgen excess stops follicles maturing, so ovulation fails: irregular periods and infertility. The arrested follicles appear as many small cysts.",
                "Androgens cause hirsutism and acne. Without ovulation, there is no progesterone to oppose estrogen, so the endometrium can overgrow (hyperplasia), raising the risk of endometrial cancer.",
                "Long-term risks: type 2 diabetes, dyslipidemia, sleep apnea and cardiovascular disease.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s7-c5",
                type: "mc",
                stem: "Lily (28) has infrequent periods, acne, chin hirsutism, a BMI of 33 and 13 months of trying to conceive. What is the pathophysiological cause behind her irregular cycles, hirsutism and infertility?",
                options: [
                  {
                    t: "Insulin resistance and high LH drive androgen excess that blocks ovulation",
                    ok: true,
                    why: "This is the core mechanism of PCOS.",
                  },
                  {
                    t: "Endometrial tissue growing outside the uterus and scarring the ovaries",
                    ok: false,
                    why: "That is endometriosis, which causes pain rather than hirsutism.",
                  },
                  {
                    t: "An ascending infection that has scarred the fallopian tubes",
                    ok: false,
                    why: "That is PID; it does not cause androgen excess.",
                  },
                  {
                    t: "Too little androgen production by the ovaries and adrenals",
                    ok: false,
                    why: "Androgens are high in PCOS.",
                  },
                ],
                rationale: "PCOS: insulin + LH → androgens → no ovulation.",
                level: "application",
              },
            },
            { t: "h2", text: "Endometriosis and adenomyosis" },
            {
              t: "table",
              head: ["", "Endometriosis", "Adenomyosis"],
              rows: [
                [
                  "What",
                  "Endometrial-like tissue outside the uterus: ovaries, pelvic peritoneum, the pouch behind the uterus (cul-de-sac)",
                  "Endometrial tissue growing into the muscle wall of the uterus",
                ],
                [
                  "Why it hurts",
                  "The tissue responds to the cycle, bleeds and inflames, forming scar tissue and adhesions",
                  "The uterus enlarges and becomes tender",
                ],
                [
                  "Symptoms",
                  "Painful periods, pain with intercourse, chronic pelvic pain, painful bowel movements, infertility; sometimes heavy bleeding",
                  "Heavy, painful periods; enlarged, soft uterus; often in women in their 40s",
                ],
                [
                  "Diagnosis",
                  "Often diagnosed clinically with ultrasound or MRI; laparoscopy with biopsy confirms it",
                  "Ultrasound or MRI",
                ],
              ],
            },
            { t: "h2", text: "Breast cancer" },
            {
              t: "ul",
              items: [
                "<strong>Risk factors:</strong> female sex, older age, BRCA1 or BRCA2 mutation, family history, early first period or late menopause, no pregnancies or a first pregnancy after 30, combined hormone therapy, obesity after menopause, alcohol, and chest radiation.",
                "<strong>Signs:</strong> a hard, painless, irregular lump that may be fixed; skin dimpling or orange-peel texture; nipple retraction or bloody discharge; swollen axillary nodes.",
                "<strong>Receptors guide treatment:</strong> estrogen and progesterone receptor (ER/PR) positive cancers respond to hormone therapy; HER2-positive cancers respond to HER2-targeted drugs.",
              ],
            },
            {
              t: "callout",
              title: "Triple-negative breast cancer",
              html: "Lacks ER, PR and HER2. It tends to grow and spread faster, is more common in younger women, Black women and BRCA1 carriers, and <strong>cannot be treated with hormone therapy or HER2-targeted drugs</strong>, so chemotherapy (with surgery and radiation, and sometimes immunotherapy) is the mainstay.",
            },
            {
              t: "ul",
              items: [
                "<strong>Cervical cancer:</strong> caused by persistent high-risk HPV; prevented by vaccination and screening (Pap and HPV tests); may cause bleeding after sex.",
                "<strong>Ovarian cancer:</strong> vague symptoms (bloating, early fullness, pelvic pain), so it is usually found late; BRCA mutations raise the risk.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s7-c6",
                type: "mc",
                stem: "A female patient has pelvic pain that is worst during her periods, pain with intercourse, and heavy bleeding. Laparoscopy reveals endometrial tissue on the ovaries and in the cul-de-sac. What is the most likely diagnosis?",
                options: [
                  { t: "Endometriosis", ok: true, why: "Endometrial tissue outside the uterus confirms endometriosis." },
                  { t: "Adenomyosis", ok: false, why: "Adenomyosis is tissue within the uterine wall." },
                  {
                    t: "Polycystic ovary syndrome",
                    ok: false,
                    why: "PCOS causes anovulation and androgen excess, not implants of endometrium.",
                  },
                  {
                    t: "Pelvic inflammatory disease",
                    ok: false,
                    why: "PID is infection; laparoscopy would show inflamed tubes, not ectopic endometrium.",
                  },
                ],
                rationale: "Where the endometrial tissue is decides the name.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open5",
              stem: "Why does triple-negative breast cancer have fewer treatment options?",
              expert: "It lacks estrogen, progesterone and HER2 receptors, so hormone therapy and HER2-targeted drugs have nothing to act on. Chemotherapy is the main option.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 742–751: The female reproductive system" },
                { ref: "pp. 774–776: Polycystic ovary syndrome; pp. 787–790: Adenomyosis and endometriosis" },
                { ref: "pp. 790–800: Cancer of the female reproductive system and breast" },
              ],
            },
          ],
        },
        {
          id: "s7-tp6",
          title: "7.6 BPH, prostate and testicular disorders",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do disorders of the male reproductive system and their treatments affect the body?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "BPH: inner-zone hyperplasia, smooth enlargement, urinary symptoms. Prostate cancer: peripheral zone, hard nodule, often silent.",
                "ADT side effects: hot flashes, low libido, ED, bone and muscle loss, weight gain, anemia.",
                "Testicular cancer: painless lump in a young man; very curable. Torsion: sudden pain; emergency.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s7-p6",
              stem: "BPH grows in which part of the prostate?",
              options: [{ id: "a", text: "The inner zone around the urethra" }, { id: "b", text: "The peripheral zone" }],
              correct: "a",
              reveal: "BPH enlarges the inner zone around the urethra, so urinary symptoms come early. Prostate cancer usually starts in the peripheral zone.",
            },
            {
              t: "case",
              title: "Daniel, 54",
              html: "Daniel gets up four times a night to urinate, has a weak stream, has to wait for it to start, and dribbles afterward. On examination, his prostate is smooth, symmetrically enlarged and rubbery. His PSA is mildly raised.",
            },
            { t: "h2", text: "Benign prostatic hyperplasia (BPH)" },
            {
              t: "p",
              html: "With age, the cells of the prostate's inner (transition) zone around the urethra multiply, driven by dihydrotestosterone (DHT), made from testosterone by 5-alpha-reductase. The enlarged gland squeezes the urethra.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s7-bph",
              alt: "Side views: a normal prostate around an open urethra; an enlarged prostate narrowing the urethra, with a thick-walled, distended bladder.",
              panels: [{ label: "Normal prostate", sub: "Open urethra" }, { label: "BPH", sub: "Squeezed urethra, full bladder" }],
              aspect: "3:2",
            },
            {
              t: "ul",
              items: [
                "<strong>Symptoms:</strong> frequency, urgency, nocturia, hesitancy, weak stream, straining, dribbling and a sense of incomplete emptying.",
                "<strong>Complications:</strong> acute urinary retention, urinary tract infection, bladder stones, hydronephrosis and postrenal kidney injury.",
                "BPH is not cancer and does not turn into cancer, but both are common in older men and both can raise PSA.",
              ],
            },
            { t: "h2", text: "Prostate cancer" },
            {
              t: "table",
              head: ["", "BPH", "Prostate cancer"],
              rows: [
                ["Zone", "Inner transition zone (around the urethra)", "Usually the outer peripheral zone"],
                ["Exam", "Smooth, symmetric, rubbery enlargement", "Hard, irregular nodule"],
                [
                  "Symptoms",
                  "Urinary symptoms early",
                  "Often none early; urinary symptoms or bone pain (spread to spine) later",
                ],
                ["Risk", "Age", "Age, Black ancestry, family history, BRCA2"],
              ],
            },
            {
              t: "p",
              html: "Most prostate cancers are adenocarcinomas that grow in response to androgens. Treatment depends on risk: active surveillance, surgery (radical prostatectomy), radiation, and <strong>androgen deprivation therapy (ADT)</strong>.",
            },
            {
              t: "table",
              head: ["Treatment", "Why it is used", "Expected effects"],
              rows: [
                [
                  "Androgen deprivation therapy",
                  "Prostate cancer cells depend on testosterone; lowering it shrinks or slows the cancer",
                  "Hot flashes, loss of libido, erectile dysfunction, fatigue, loss of muscle and bone (osteoporosis), weight gain and insulin resistance, breast tenderness or enlargement, anemia, mood changes",
                ],
                ["Radical prostatectomy", "Removes the gland", "Urinary incontinence (often improves), erectile dysfunction"],
                ["Radiation", "Destroys cancer cells", "Bowel and bladder irritation, erectile dysfunction"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s7-c7",
                type: "ms",
                stem: "Daniel's biopsy later shows prostate cancer and he starts androgen deprivation therapy. Which side effects would the provider expect him to experience? <strong>Choose 3 answers.</strong>",
                options: [
                  { t: "Hot flashes", ok: true, why: "Sudden loss of testosterone disturbs temperature regulation." },
                  {
                    t: "Loss of libido and erectile dysfunction",
                    ok: true,
                    why: "Testosterone drives libido and supports erections.",
                  },
                  {
                    t: "Loss of bone density",
                    ok: true,
                    why: "Sex hormones protect bone; ADT raises osteoporosis and fracture risk.",
                  },
                  { t: "Increased muscle mass", ok: false, why: "Muscle mass falls without testosterone." },
                  { t: "Polycythemia", ok: false, why: "Low testosterone tends to cause anemia, not a high red cell count." },
                ],
                rationale: "ADT effects are the effects of low testosterone.",
                level: "application",
              },
            },
            { t: "h2", text: "Testicular disorders" },
            {
              t: "ul",
              items: [
                "<strong>Testicular cancer:</strong> the most common solid cancer in men aged about 15–35. Usually a painless lump or heaviness in one testis. Risk factors: an undescended testis (cryptorchidism), family or personal history. Most are germ cell tumors; markers include AFP, hCG and LDH. Treatment with orchiectomy, with or without chemotherapy or radiation, is highly successful. Fertility may be affected, so sperm banking is offered before treatment.",
                "<strong>Testicular torsion:</strong> twisting of the spermatic cord cuts off blood supply: sudden severe scrotal pain, swelling, nausea, a high-riding testis. A surgical emergency; the testis can be lost within hours.",
              ],
            },
            // REVIEW: new
            {
              t: "open",
              id: "s7-open6",
              stem: "Why does BPH cause urinary symptoms early while prostate cancer is often silent?",
              expert: "BPH enlarges the tissue that surrounds the urethra and squeezes it. Prostate cancer usually grows in the outer zone, away from the urethra, so it can grow for a long time before causing symptoms.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 753–757: The male reproductive system" },
                { ref: "pp. 843–845: Benign prostatic hyperplasia; pp. 847–853: Cancer of the prostate" },
              ],
            },
          ],
        },
        {
          id: "s7-l12-quiz",
          topic: "Reproductive System Pathophysiology",
          title: "Quiz: Lesson 12 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on STIs, female and male reproductive disorders." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s7-q6",
                  type: "mc",
                  stem: "A 22-year-old has lower abdominal pain, fever and a purulent cervical discharge. Moving her cervix during the exam causes sharp pain. What is the most likely diagnosis?",
                  options: [
                    {
                      t: "Pelvic inflammatory disease",
                      ok: true,
                      why: "Cervical motion tenderness with fever and discharge points to ascending pelvic infection.",
                    },
                    {
                      t: "Endometriosis",
                      ok: false,
                      why: "Endometriosis causes cyclical pain without fever or purulent discharge.",
                    },
                    { t: "Polycystic ovary syndrome", ok: false, why: "PCOS does not cause fever or acute pain." },
                    {
                      t: "Ectopic pregnancy",
                      ok: false,
                      why: "Ectopic pregnancy causes pain and bleeding but not fever or purulent discharge; a pregnancy test is still required.",
                    },
                  ],
                  rationale: "Cervical motion tenderness + fever + discharge = PID.",
                  level: "application",
                },
                {
                  id: "s7-q7",
                  type: "mc",
                  stem: "What is true about triple-negative breast cancer?",
                  options: [
                    {
                      t: "It lacks ER, PR and HER2, so receptor-targeted drugs do not work",
                      ok: true,
                      why: "Without these targets, chemotherapy is the mainstay.",
                    },
                    {
                      t: "It is the slowest-growing type of breast cancer",
                      ok: false,
                      why: "It tends to grow and spread faster.",
                    },
                    { t: "It occurs mostly in women over the age of 80", ok: false, why: "It is more common in younger women." },
                    {
                      t: "It is treated mainly with tamoxifen or other hormone therapy",
                      ok: false,
                      why: "Tamoxifen targets estrogen receptors, which are absent.",
                    },
                  ],
                  rationale: "No receptors, no receptor-targeted treatment.",
                  level: "application",
                },
                {
                  id: "s7-q8",
                  type: "mc",
                  stem: "Which statement about sexually transmitted infections is true?",
                  options: [
                    {
                      t: "Many cause no symptoms but can still be transmitted",
                      ok: true,
                      why: "Chlamydia, HPV, HSV and others are often silent.",
                    },
                    {
                      t: "Only people with symptoms need to be treated",
                      ok: false,
                      why: "Asymptomatic partners need treatment to prevent reinfection.",
                    },
                    {
                      t: "Condoms completely prevent all STIs",
                      ok: false,
                      why: "Condoms reduce risk; skin-contact infections can still spread.",
                    },
                    { t: "Having one STI lowers the risk of getting HIV", ok: false, why: "It raises the risk." },
                  ],
                  rationale: "Silent does not mean safe.",
                  level: "application",
                },
                {
                  id: "s7-q9",
                  type: "ms",
                  stem: "A man with prostate cancer is starting androgen deprivation therapy. Which side effects would the provider expect this client might experience? <strong>Choose 3 answers.</strong>",
                  options: [
                    { t: "Hot flashes", ok: true, why: "A classic effect of sudden testosterone loss." },
                    { t: "Decreased libido", ok: true, why: "Testosterone drives libido." },
                    {
                      t: "Weight gain and loss of muscle mass",
                      ok: true,
                      why: "Body composition shifts toward fat without testosterone.",
                    },
                    { t: "Increased bone density", ok: false, why: "Bone density falls." },
                    { t: "Higher red cell count", ok: false, why: "Anemia is more likely." },
                  ],
                  rationale: "ADT = low testosterone effects.",
                  level: "application",
                },
                {
                  id: "s7-q10",
                  type: "mc",
                  stem: "A 58-year-old with hypertension, type 2 diabetes and a 30-pack-year smoking history reports difficulty maintaining erections. What is the most likely cause of his erectile dysfunction?",
                  options: [
                    {
                      t: "Vascular disease narrowing the penile arteries",
                      ok: true,
                      why: "Atherosclerosis, hypertension, diabetes and smoking all damage the small arteries needed for erection.",
                    },
                    { t: "Testicular cancer", ok: false, why: "Testicular cancer presents as a painless lump in younger men." },
                    {
                      t: "Benign prostatic hyperplasia",
                      ok: false,
                      why: "BPH causes urinary symptoms; it is not a common cause of ED on its own.",
                    },
                    { t: "A sexually transmitted infection", ok: false, why: "STIs are not a typical cause of ED." },
                  ],
                  rationale: "ED is often the first sign of vascular disease; assess his heart too.",
                  level: "application",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s7-sum-g",
      title: "Section 7: Summary",
      pages: [
        {
          id: "s7-sum",
          title: "Section 7: Summary and cards",
          kind: "summary",
          blocks: [
            {
              t: "p",
              html: "Sheila's labs showed negative feedback at work: a failing thyroid and a pituitary pushing harder. Leo showed how an illness tips type 1 diabetes into ketoacidosis. Jennifer showed how a silent infection can threaten fertility. Lily showed how insulin resistance reaches the ovary. Daniel showed how one common gland can cause both a benign and a malignant problem, and how treatment brings effects of its own.",
            },
            {
              t: "ul",
              items: [
                "Negative feedback: target hormone switches off the hypothalamus and pituitary. In primary gland failure, the stimulating hormone (e.g., TSH) is high.",
                "Pituitary tumors: mass effect (headache, bitemporal hemianopia), excess of one hormone (prolactin, GH, ACTH) and deficit of the others.",
                "DI: too little ADH effect, dilute urine, high sodium. SIADH: too much ADH, concentrated urine, low sodium.",
                "Hypothyroidism (Hashimoto): slow, cold, weight gain, high TSH. Hyperthyroidism (Graves): fast, hot, weight loss, low TSH; exophthalmos is specific to Graves.",
                "Cushing: excess cortisol, most often from steroid medication. Addison: low cortisol and aldosterone, high potassium, hyperpigmentation. Taper long-term steroids.",
                "DKA: type 1, ketones, acidosis, Kussmaul breathing. HHS: type 2, extreme glucose and osmolality, little ketosis, slower onset.",
                "Chronic diabetes complications: microvascular (eyes, kidneys, nerves) and macrovascular (heart, brain, legs).",
                "Chlamydia is the most commonly reported bacterial STI and is often silent. Many STIs are transmissible without symptoms: screen, treat partners.",
                "Syphilis: painless chancre, then a rash on palms and soles. HSV recurs from nerve ganglia. High-risk HPV causes cervical cancer.",
                "PID: ascending chlamydia or gonorrhea; cervical motion tenderness; infertility and ectopic pregnancy are the complications.",
                "Erectile dysfunction is most often vascular and can be an early sign of coronary disease.",
                "PCOS: insulin resistance and high LH → androgen excess → anovulation, hirsutism, infertility; long-term diabetes and endometrial risk.",
                "Endometriosis: endometrium outside the uterus; pain and infertility. Adenomyosis: endometrium in the uterine wall; heavy painful periods.",
                "Triple-negative breast cancer lacks ER, PR and HER2: aggressive, more common in younger and Black women and BRCA1 carriers; no hormone or HER2 therapy.",
                "BPH: inner-zone hyperplasia, smooth enlargement, urinary symptoms. Prostate cancer: peripheral zone, hard nodule, often silent.",
                "ADT side effects: hot flashes, low libido, ED, bone and muscle loss, weight gain, anemia.",
                "Testicular cancer: painless lump in a young man; very curable. Torsion: sudden pain; emergency.",
              ],
            },
            // REVIEW: new
            {
              t: "confused",
              rows: [
                [
                  "Diabetes insipidus",
                  "SIADH",
                  "DI: too little ADH effect, dilute urine, high sodium. SIADH: too much ADH, concentrated urine, low sodium.",
                ],
                ["DKA", "HHS", "DKA: type 1, ketones, acidosis. HHS: type 2, extreme glucose, little ketosis."],
                [
                  "Cushing syndrome",
                  "Addison disease",
                  "Cushing: too much cortisol. Addison: too little cortisol and aldosterone, high potassium.",
                ],
                [
                  "BPH",
                  "Prostate cancer",
                  "BPH: inner zone, smooth enlargement, urinary symptoms. Cancer: peripheral zone, hard nodule, often silent.",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "values",
              rows: [
                ["TSH in primary hypothyroidism", "high"],
                ["TSH in Graves disease", "low"],
                ["Sodium in SIADH", "low", "dilutional"],
                ["Sodium in diabetes insipidus", "high", "water loss"],
              ],
            },
            {
              t: "cards",
              id: "fc-l11",
              title: "Lesson 11 flashcards",
              cards: [
                ["Primary hypothyroidism labs", "High TSH, low free T4"],
                ["Most common cause of hypothyroidism in the US", "Hashimoto thyroiditis"],
                ["Most common cause of hyperthyroidism", "Graves disease (TSH receptor antibodies)"],
                ["Sign specific to Graves disease", "Exophthalmos"],
                ["Most common cause of Cushing syndrome", "Long-term glucocorticoid medication"],
                ["Addison disease electrolytes", "Low sodium, high potassium"],
                ["Why Addison disease darkens skin", "High ACTH stimulates melanocytes"],
                ["Bitemporal hemianopia", "Pituitary tumor pressing on the optic chiasm"],
                ["DI urine vs SIADH urine", "Large and dilute vs small and concentrated"],
                ["DKA vs HHS: ketones", "Present vs little or none"],
                ["A1C diagnostic of diabetes", "6.5% or higher"],
                ["Hypoglycemia threshold", "Below 70 mg/dL"],
                ["Microvascular complications", "Retinopathy, nephropathy, neuropathy"],
              ],
            },
            {
              t: "cards",
              id: "fc-l12",
              title: "Lesson 12 flashcards",
              cards: [
                ["Most commonly reported bacterial STI (US)", "Chlamydia"],
                ["Primary syphilis lesion", "Painless chancre"],
                ["HPV types most linked to cervical cancer", "16 and 18"],
                ["PID hallmark on exam", "Cervical motion tenderness"],
                ["PID complications", "Infertility, ectopic pregnancy, chronic pelvic pain, abscess"],
                ["Most common physical cause of ED", "Vascular disease (atherosclerosis, diabetes, hypertension, smoking)"],
                ["PCOS diagnosis (2 of 3)", "Anovulation, androgen excess, polycystic ovaries"],
                ["Endometriosis", "Endometrial tissue outside the uterus"],
                ["Triple-negative breast cancer", "ER-, PR-, HER2-negative; chemotherapy is the mainstay"],
                ["BPH vs prostate cancer on exam", "Smooth and rubbery vs hard and irregular"],
                ["Rationale for androgen deprivation therapy", "Prostate cancer cells depend on testosterone"],
                ["Testicular cancer age group", "About 15–35"],
              ],
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I tell primary from secondary endocrine disease using the stimulating hormone?",
                "Can I tell hypothyroidism from hyperthyroidism, and Cushing syndrome from Addison disease?",
                "Can I tell DKA from HHS, and list the micro- and macrovascular complications of diabetes?",
                "Can I describe chlamydia, syphilis, HSV and HPV, and the complications of PID?",
                "Can I explain the mechanism of PCOS and tell endometriosis from adenomyosis?",
                "Can I tell BPH from prostate cancer and list the effects of androgen deprivation therapy?",
              ],
            },
            {
              t: "callout",
              title: "Before the test",
              html: "If any line above feels shaky, go back to that topic and retry its learning checks.",
            },
          ],
        },
      ],
    },
    {
      id: "s7-test-g",
      title: "Section 7: Test",
      pages: [
        {
          id: "s7-test",
          title: "Section 7: Test",
          kind: "test",
          blocks: [
            {
              t: "p",
              html: "Ten questions covering Section 7, plus two from earlier sections. Answer every question, then submit. Your score and all rationales appear after you submit.",
            },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s7-t1",
                  type: "mc",
                  stem: "A client has been diagnosed with primary hypothyroidism. Which gland is experiencing dysfunction?",
                  options: [
                    { t: "Thyroid", ok: true, why: "Primary means the target gland itself is failing." },
                    { t: "Pituitary", ok: false, why: "Pituitary failure would be secondary hypothyroidism." },
                    { t: "Hypothalamus", ok: false, why: "Hypothalamic failure would be tertiary." },
                    { t: "Adrenal", ok: false, why: "The adrenal glands do not make thyroid hormone." },
                  ],
                  rationale: "Primary = the gland; secondary = the pituitary; tertiary = the hypothalamus.",
                  level: "recall",
                },
                {
                  id: "s7-t2",
                  type: "mc",
                  stem: "A client who has taken prednisone for three years for lupus has a round face, a fat pad between the shoulders, purple abdominal stretch marks, easy bruising and high blood glucose. Which diagnosis is consistent with these manifestations?",
                  options: [
                    {
                      t: "Cushing syndrome from glucocorticoid medication",
                      ok: true,
                      why: "Long-term steroids are the most common cause of Cushing syndrome.",
                    },
                    {
                      t: "Addison disease",
                      ok: false,
                      why: "Addison disease causes weight loss, low blood pressure and hyperpigmentation.",
                    },
                    { t: "Hyperthyroidism", ok: false, why: "Hyperthyroidism causes weight loss, not central fat gain." },
                    {
                      t: "Cushing disease from a pituitary tumor",
                      ok: false,
                      why: "Possible in general, but her steroid history makes medication the far more likely cause.",
                    },
                  ],
                  rationale: "Ask about steroid use first.",
                  level: "application",
                },
                {
                  id: "s7-t3",
                  type: "mc",
                  stem: "A client with hypothyroidism is started on levothyroxine. What is the rationale behind this treatment?",
                  options: [
                    {
                      t: "It replaces missing thyroid hormone, and TSH falls as feedback returns",
                      ok: true,
                      why: "Replacement corrects the deficit; TSH is used to adjust the dose.",
                    },
                    {
                      t: "It destroys overactive thyroid tissue with radiation",
                      ok: false,
                      why: "That describes radioactive iodine for hyperthyroidism.",
                    },
                    { t: "It blocks the TSH receptor on the thyroid gland", ok: false, why: "That would worsen hypothyroidism." },
                    {
                      t: "It stops the autoimmune attack on the gland",
                      ok: false,
                      why: "It replaces hormone; it does not stop Hashimoto thyroiditis.",
                    },
                  ],
                  rationale: "Replace what's missing; monitor with TSH.",
                  level: "application",
                },
                {
                  id: "s7-t4",
                  type: "mc",
                  stem: "A client with small cell lung cancer has a serum sodium of 121 mEq/L, concentrated urine and new confusion. Which disorder is most likely?",
                  options: [
                    {
                      t: "SIADH",
                      ok: true,
                      why: "Small cell lung cancer can secrete ADH, causing water retention and dilutional hyponatremia.",
                    },
                    { t: "Diabetes insipidus", ok: false, why: "DI causes high sodium and dilute urine." },
                    {
                      t: "Addison disease",
                      ok: false,
                      why: "Addison disease can lower sodium, but concentrated urine with this cancer points to SIADH.",
                    },
                    { t: "Hyperthyroidism", ok: false, why: "Hyperthyroidism does not cause hyponatremia." },
                  ],
                  rationale: "Low sodium + concentrated urine + small cell cancer = SIADH.",
                  level: "application",
                },
                {
                  id: "s7-t5",
                  type: "mc",
                  stem: "A 74-year-old with type 2 diabetes has been increasingly confused for five days. Glucose 920 mg/dL, serum osmolality 350 mOsm/kg, pH 7.36, no ketones. Which condition is present?",
                  options: [
                    {
                      t: "Hyperosmolar hyperglycemic state",
                      ok: true,
                      why: "Extreme glucose and osmolality without ketosis or acidosis, developing over days.",
                    },
                    { t: "Diabetic ketoacidosis", ok: false, why: "DKA has ketones and acidosis." },
                    { t: "Hypoglycemia", ok: false, why: "Glucose is very high." },
                    { t: "SIADH", ok: false, why: "SIADH lowers osmolality." },
                  ],
                  rationale: "No ketones, huge glucose, high osmolality = HHS.",
                  level: "application",
                },
                {
                  id: "s7-t6",
                  type: "mc",
                  stem: "A client has fatigue, weight loss, low blood pressure, salt craving and darkened skin creases. Labs: sodium 128, potassium 5.8 mEq/L. Which disorder fits?",
                  options: [
                    {
                      t: "Primary adrenal insufficiency (Addison disease)",
                      ok: true,
                      why: "Low cortisol and aldosterone with high ACTH cause these findings.",
                    },
                    { t: "Cushing syndrome", ok: false, why: "Cushing causes weight gain and hypertension." },
                    { t: "Primary hyperaldosteronism", ok: false, why: "That causes hypertension with low potassium." },
                    { t: "Pheochromocytoma", ok: false, why: "That causes episodic hypertension." },
                  ],
                  rationale: "Low sodium + high potassium + hyperpigmentation = Addison.",
                  level: "application",
                },
                {
                  id: "s7-t7",
                  type: "mc",
                  stem: "A 25-year-old has a painless, firm lump in his right testis that he noticed a month ago. He had an undescended testis as a child. Which diagnosis is most likely?",
                  options: [
                    {
                      t: "Testicular cancer",
                      ok: true,
                      why: "A painless testicular mass in a young man, with a history of cryptorchidism, is cancer until proven otherwise.",
                    },
                    { t: "Testicular torsion", ok: false, why: "Torsion causes sudden severe pain." },
                    { t: "Benign prostatic hyperplasia", ok: false, why: "BPH affects older men's prostate glands." },
                    { t: "Epididymitis from chlamydia", ok: false, why: "Epididymitis is painful and tender." },
                  ],
                  rationale: "Painless lump + young man = urgent evaluation.",
                  level: "application",
                },
                {
                  id: "s7-t8",
                  type: "mc",
                  stem: "A 66-year-old man has a weak stream, nocturia and a sense of incomplete emptying. His prostate is smooth, symmetrically enlarged and rubbery. Which complication of his likely condition should he be taught to report at once?",
                  options: [
                    {
                      t: "Being unable to pass urine with lower abdominal pain",
                      ok: true,
                      why: "Acute urinary retention is a complication of BPH and needs urgent catheterization.",
                    },
                    { t: "Getting up twice a night", ok: false, why: "Nocturia is an expected symptom." },
                    {
                      t: "A slightly weaker stream than last month",
                      ok: false,
                      why: "Gradual change is expected and discussed at review.",
                    },
                    {
                      t: "Dribbling after urinating",
                      ok: false,
                      why: "Post-void dribbling is a common symptom, not an emergency.",
                    },
                  ],
                  rationale: "BPH symptoms are expected; retention is an emergency.",
                  level: "application",
                },
                {
                  id: "s7-t9",
                  type: "mc",
                  stem: "A client with PCOS asks why her risk of type 2 diabetes is higher. What is the best explanation?",
                  options: [
                    {
                      t: "\"PCOS involves insulin resistance, and your pancreas may not keep up.\"",
                      ok: true,
                      why: "Insulin resistance drives both the ovarian problem and the diabetes risk.",
                    },
                    {
                      t: "\"The cysts on your ovaries release extra insulin.\"",
                      ok: false,
                      why: "Ovarian cysts do not make insulin.",
                    },
                    {
                      t: "\"PCOS destroys the insulin-producing cells over time.\"",
                      ok: false,
                      why: "That describes type 1 diabetes.",
                    },
                    { t: "\"Your diabetes risk is the same as anyone else's.\"", ok: false, why: "PCOS clearly raises risk." },
                  ],
                  rationale: "Insulin resistance links PCOS and type 2 diabetes.",
                  level: "application",
                },
                {
                  id: "s7-t10",
                  type: "mc",
                  stem: "A client who had chlamydia twice, both untreated for months, is now unable to conceive. What is the most likely mechanism?",
                  options: [
                    {
                      t: "Pelvic inflammatory disease scarred and blocked her fallopian tubes",
                      ok: true,
                      why: "Ascending infection damages the tubes, causing tubal infertility and ectopic pregnancy risk.",
                    },
                    { t: "Chlamydia causes androgen excess", ok: false, why: "Androgen excess is the mechanism in PCOS." },
                    {
                      t: "Chlamydia causes endometrial tissue to grow outside the uterus",
                      ok: false,
                      why: "That is endometriosis.",
                    },
                    {
                      t: "Chlamydia destroys the ovaries' supply of eggs",
                      ok: false,
                      why: "The damage is to the tubes, not the egg supply.",
                    },
                  ],
                  rationale: "Untreated chlamydia → PID → tubal scarring.",
                  level: "application",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

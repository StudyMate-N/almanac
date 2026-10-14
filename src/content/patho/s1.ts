import type { ASection } from "./author";

// Section 1 rebuilt to course standard v1: one page per topic. Question and card ids unchanged.
// Items marked "REVIEW" need owner approval in the review screen.

export const s1: ASection = {
  id: "s1",
  title: "Homeostasis and Cellular Responses",
  num: 1,
  kind: "section",
  blurb: "Fluid, electrolyte and acid–base balance; how cells adapt, die and defend; genes and congenital anomalies.",
  competency: "Describe how homeostasis is maintained and how cells respond, adapt and are injured when it fails.",
  groups: [
    {
      id: "s1-topics",
      title: "Topics",
      pages: [
        {
          id: "s1-tp0",
          title: "1.0 Meet Lena",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "<em>Homeo-</em> means the same; <em>-stasis</em> means standing still. Homeostasis is the work the body does to keep its internal conditions steady while everything around it changes. Disease is often what happens when that work fails.",
            },
            { t: "p", html: "Two patients run through this section. Compare their panels before you read on." },
            {
              t: "case",
              title: "Lena, 24",
              html: "Lena is donating blood at a campus drive. She feels well and her screening panel is normal. She is the baseline.",
            },
            {
              t: "case",
              title: "Samuel, 19",
              html: "Samuel has type 1 diabetes. He had a stomach virus, could not keep food down, and skipped his insulin because he was not eating. Two days later he arrives in the emergency department breathing deeply and quickly. His breath smells fruity and he is drowsy.",
            },
            {
              t: "labs",
              caption: "Basic metabolic panel. Reference ranges vary slightly between laboratories.",
              cols: ["Lena", "Samuel"],
              rows: [
                ["Sodium", "mEq/L", "139", "131", "135–145", 1],
                ["Potassium", "mEq/L", "4.2", "5.8", "3.5–5.0", 1],
                ["Chloride", "mEq/L", "103", "98", "98–106", 0],
                ["CO₂ (bicarbonate)", "mEq/L", "25", "10", "22–29", 1],
                ["Anion gap", "mEq/L", "11", "23", "8–16", 1],
                ["Glucose", "mg/dL", "88", "485", "70–99", 1],
                ["BUN", "mg/dL", "14", "24", "7–20", 1],
                ["Creatinine", "mg/dL", "0.8", "1.3", "0.6–1.2", 1],
              ],
            },
            {
              t: "callout",
              title: "What to notice",
              html: "Samuel's bicarbonate is being used up to buffer acid. His anion gap is high, which means an unmeasured acid has been added to his blood. His potassium is high even though he has lost potassium through vomiting and urine. By the end of Lesson 1 you will be able to explain all three.",
            },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Describe how fluid, electrolyte and acid-base balance is maintained and what happens when it is disturbed.",
                "Describe how cells adapt to stress and injury, and how immune responses change with age.",
                "Explain how genetic and environmental factors cause congenital anomalies.",
              ],
            },
          ],
        },
        {
          id: "s1-tp1",
          title: "1.1 Fluids and electrolytes",
          kind: "topic",
          blocks: [
            {
              t: "eq",
              text: "How does the body keep fluid volume and electrolytes within a narrow range, and what happens when it cannot?",
            },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Homeostasis depends on negative feedback: a sensor, a control center and an effector.",
                "Edema comes from more push out of the capillary, less pull back in, leaky capillaries or blocked lymph drainage.",
                "ADH responds to concentration; the RAAS responds to volume and pressure; ANP works against both.",
                "Potassium has the most immediate effect on the heart. Calcium and magnesium affect nerve and muscle excitability.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p1",
              stem: "A red blood cell is placed in a hypotonic solution. What happens to it?",
              options: [{ id: "a", text: "It swells" }, { id: "b", text: "It shrinks" }],
              correct: "a",
              reveal: "Water moves into the cell, toward the higher solute concentration inside, so it swells and can burst.",
            },
            { t: "h2", text: "Lesson introduction" },
            {
              t: "p",
              html: "Think about cruise control in a car. You set a speed. A sensor reads the actual speed many times a second. When the car slows on a hill, a computer compares the reading with the set point and opens the throttle. When the car speeds up going downhill, it eases off. The speed stays close to the set point, even though the road keeps changing.",
            },
            {
              t: "p",
              html: "The body does the same thing with temperature, blood pressure, glucose, pH, fluid volume and electrolytes. Each system has three parts:",
            },
            {
              t: "table",
              head: ["Part", "Job", "Example: blood osmolality"],
              rows: [
                ["Sensor (receptor)", "Detects a change from the set point", "Osmoreceptors in the hypothalamus"],
                ["Control center", "Compares the reading and decides on a response", "Hypothalamus"],
                ["Effector", "Carries out the response", "ADH acting on the kidney's collecting ducts"],
              ],
            },
            // REVIEW: new diagram (image manifest: built as page diagrams). Labels from the table above.
            {
              t: "diagram",
              id: "d-feedback-loop",
              layout: "loop",
              title: "Negative feedback: blood osmolality",
              alt: "A negative feedback loop in five steps: blood osmolality rises, osmoreceptors in the hypothalamus detect it, the hypothalamus responds, ADH acts on the collecting ducts, and the kidneys keep water so osmolality falls back toward the set point.",
              items: [
                { label: "Stimulus", sub: "Blood osmolality rises, for example in dehydration" },
                { label: "Sensor", sub: "Osmoreceptors in the hypothalamus" },
                { label: "Control center", sub: "The hypothalamus compares the reading with the set point" },
                { label: "Effector", sub: "ADH acts on the kidney's collecting ducts" },
                { label: "Response", sub: "The kidneys keep water; osmolality falls" },
              ],
              feedback: "The response removes the stimulus, so the signal switches off",
            },
            {
              t: "p",
              html: "<strong>Negative feedback</strong> pushes a value back toward the set point. Almost all homeostasis works this way. <strong>Positive feedback</strong> amplifies a change until an event finishes, as in the clotting cascade or oxytocin driving contractions during labor. Positive feedback is useful for a short time but harmful when it runs unchecked.",
            },
            // Video-led: chapters from the clip transcripts; the check is a stop in the clip.
            {
              t: "video",
              clip: "foundations-01",
              chapters: [
                { at: "0:00", label: "What pathophysiology is" },
                { at: "2:40", label: "Homeostasis" },
                { at: "3:40", label: "Allostasis" },
              ],
            },
            {
              t: "video",
              clip: "foundations-05",
              chapters: [
                { at: "0:00", label: "Why the blood matters" },
                { at: "2:40", label: "Electrolytes" },
                { at: "5:20", label: "Fluid" },
                { at: "5:40", label: "Glucose" },
                { at: "7:00", label: "Toxins" },
                { at: "8:00", label: "pH" },
              ],
              stops: [{ at: "5:38", check: "s1-c1" }],
            },
            { t: "h2", text: "Where body water sits" },
            {
              t: "p",
              html: "About two thirds of body water is inside cells (intracellular fluid). The remaining third is outside cells (extracellular fluid). Extracellular fluid is split between the spaces around cells (interstitial fluid) and the blood vessels (intravascular fluid, or plasma).",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s1-rbc-tonicity",
              alt: "A red blood cell in three solutions: normal in isotonic, swollen in hypotonic, shrunken and spiky in hypertonic.",
              panels: [
                { label: "Isotonic", sub: "Normal disc" },
                { label: "Hypotonic", sub: "Water in, cell swells" },
                { label: "Hypertonic", sub: "Water out, cell shrinks" },
              ],
              aspect: "3:1",
            },
            {
              t: "p",
              html: "Water moves between the vessels and the tissues according to two opposing forces at the capillary:",
            },
            {
              t: "ul",
              items: [
                "<strong>Capillary hydrostatic pressure</strong> pushes fluid out of the vessel into the tissue.",
                "<strong>Plasma oncotic pressure</strong>, created mainly by albumin, pulls fluid back into the vessel.",
              ],
            },
            { t: "h2", text: "Four ways to get edema" },
            {
              t: "table",
              head: ["Mechanism", "What changes", "Example"],
              rows: [
                ["Increased hydrostatic pressure", "More push out of the capillary", "Heart failure, fluid overload"],
                [
                  "Decreased oncotic pressure",
                  "Less pull back into the capillary",
                  "Cirrhosis, nephrotic syndrome, malnutrition (low albumin)",
                ],
                ["Increased capillary permeability", "Proteins and fluid leak into tissue", "Burns, inflammation, sepsis"],
                ["Lymphatic obstruction", "Fluid that leaks out cannot drain away", "Lymph node removal, tumor"],
              ],
            },
            { t: "h2", text: "Two hormone systems that hold on to water" },
            {
              t: "p",
              html: "<strong>ADH (antidiuretic hormone)</strong> responds to concentration. When blood osmolality rises, osmoreceptors in the hypothalamus signal the posterior pituitary to release ADH. ADH opens water channels in the collecting ducts, so the kidney reabsorbs water and urine becomes small in volume and concentrated.",
            },
            {
              t: "p",
              html: "<strong>The renin-angiotensin-aldosterone system (RAAS)</strong> responds to volume and pressure:",
            },
            {
              t: "ol",
              items: [
                "Reduced blood flow to the kidney causes the juxtaglomerular cells to release renin.",
                "Renin converts angiotensinogen (made by the liver) to angiotensin I.",
                "Angiotensin-converting enzyme (ACE), mainly in the lungs, converts angiotensin I to angiotensin II.",
                "Angiotensin II constricts arterioles, stimulates thirst and ADH release, and triggers aldosterone release from the adrenal cortex.",
                "Aldosterone makes the distal nephron reabsorb sodium (and water follows) and excrete potassium.",
              ],
            },
            {
              t: "p",
              html: "Working the other way, <strong>atrial natriuretic peptide (ANP)</strong> is released when the atria are stretched by too much volume. It makes the kidney excrete sodium and water.",
            },
            {
              t: "q",
              q: {
                id: "s1-c1",
                type: "ms",
                stem: "A landscaper has worked for six hours in the heat, sweating heavily and drinking very little. His blood osmolality is rising and his blood pressure is starting to fall. Which responses help restore his fluid balance? <strong>Choose 3 answers.</strong>",
                options: [
                  {
                    t: "Osmoreceptors trigger release of ADH from the posterior pituitary.",
                    ok: true,
                    why: "Rising osmolality is the main trigger for ADH. ADH makes the collecting ducts reabsorb water.",
                  },
                  {
                    t: "The kidneys release renin because blood flow to them has dropped.",
                    ok: true,
                    why: "Falling volume and pressure reduce renal perfusion, which starts the RAAS.",
                  },
                  {
                    t: "Aldosterone increases sodium reabsorption, and water follows.",
                    ok: true,
                    why: "Aldosterone is the final step of the RAAS and helps rebuild circulating volume.",
                  },
                  {
                    t: "The atria release more natriuretic peptide (ANP).",
                    ok: false,
                    why: "ANP is released when the atria are overstretched by too much volume. It makes the kidney excrete sodium and water, which is the opposite of what he needs.",
                  },
                  {
                    t: "The kidneys produce a large volume of dilute urine.",
                    ok: false,
                    why: "That happens when ADH is low, as in overhydration or diabetes insipidus. With high ADH, urine is small in volume and concentrated.",
                  },
                ],
                rationale: "Both systems work together here. ADH responds to the rising concentration; the RAAS responds to the falling volume and pressure.",
                level: "application",
              },
            },
            { t: "h2", text: "Electrolytes to know cold" },
            {
              t: "table",
              head: ["Electrolyte", "Typical range", "Too low", "Too high"],
              rows: [
                [
                  "Sodium (Na⁺)",
                  "135–145 mEq/L",
                  "Confusion, headache, seizures (brain cells swell)",
                  "Thirst, agitation, confusion (brain cells shrink)",
                ],
                [
                  "Potassium (K⁺)",
                  "3.5–5.0 mEq/L",
                  "Muscle weakness, cramps, flat T waves, U waves, dysrhythmias",
                  "Muscle weakness, tall peaked T waves, dysrhythmias, cardiac arrest",
                ],
                [
                  "Calcium (Ca²⁺)",
                  "8.5–10.5 mg/dL",
                  "Tingling, muscle spasms, tetany, Chvostek and Trousseau signs, prolonged QT",
                  "Kidney stones, bone pain, constipation, confusion, shortened QT",
                ],
                [
                  "Magnesium (Mg²⁺)",
                  "1.7–2.2 mg/dL",
                  "Tremor, hyperreflexia, torsades de pointes",
                  "Hyporeflexia, lethargy, respiratory depression",
                ],
              ],
            },
            {
              t: "callout",
              title: "Why potassium matters most",
              html: "Potassium sets the resting electrical charge of heart muscle. Small changes in either direction can cause life-threatening dysrhythmias, which is why a high or low potassium is reported promptly.",
            },
            // REVIEW: new
            {
              t: "open",
              id: "s1-open1",
              stem: "Why does low albumin cause edema?",
              expert: "Albumin keeps plasma oncotic pressure up, which pulls fluid back into the capillaries. With less albumin, less fluid is pulled back, so it stays in the tissues.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "The cellular environment: fluids and electrolytes, acids and bases",
                  note: "Water distribution, edema, sodium, potassium, calcium and the hormones that regulate them.",
                },
              ],
            },
          ],
        },
        {
          id: "s1-tp2",
          title: "1.2 Acid–base balance",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do buffers, the lungs and the kidneys keep blood pH between 7.35 and 7.45?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Buffers act in seconds, lungs in minutes and kidneys over hours to days.",
                "ROME: in a respiratory problem pH and PaCO₂ move in opposite directions; in a metabolic problem pH and HCO₃⁻ move in the same direction.",
                "A high anion gap means an acid has been added; a normal gap means bicarbonate has been lost.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p2",
              stem: "A client is breathing very fast and deep from anxiety. What happens to PaCO₂?",
              options: [{ id: "a", text: "It falls" }, { id: "b", text: "It rises" }],
              correct: "a",
              reveal: "Fast breathing blows off CO₂, so PaCO₂ falls and pH rises: respiratory alkalosis.",
            },
            { t: "h2", text: "Three lines of defense" },
            {
              t: "p",
              html: "Normal arterial pH is 7.35–7.45. Cells make acid all the time, so the body needs a way to remove it. Three systems share the job, each at a different speed:",
            },
            {
              t: "table",
              head: ["Defense", "How it works", "Speed"],
              rows: [
                [
                  "Buffers",
                  "Bicarbonate, phosphate and proteins (including hemoglobin) bind or release H⁺ immediately",
                  "Seconds",
                ],
                ["Lungs", "Breathing faster blows off CO₂ (an acid); breathing slower retains it", "Minutes"],
                ["Kidneys", "Excrete H⁺ and reabsorb or generate bicarbonate", "Hours to days"],
              ],
            },
            {
              t: "p",
              html: "The link between them is the carbonic acid–bicarbonate buffer: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. More CO₂ pushes the reaction to the right and makes more H⁺. That is why CO₂ behaves as an acid.",
            },
            { t: "h2", text: "Reading a blood gas in four steps" },
            {
              t: "table",
              head: ["Value", "Normal range"],
              rows: [["pH", "7.35–7.45"], ["PaCO₂", "35–45 mm Hg"], ["HCO₃⁻", "22–26 mEq/L"]],
            },
            {
              t: "ol",
              items: [
                "<strong>Look at the pH.</strong> Below 7.35 is acidosis; above 7.45 is alkalosis.",
                "<strong>Is PaCO₂ moving opposite to pH?</strong> (pH down, CO₂ up, or pH up, CO₂ down.) Then the problem is respiratory.",
                "<strong>Is HCO₃⁻ moving the same way as pH?</strong> (both down, or both up.) Then the problem is metabolic.",
                "<strong>Check compensation.</strong> If the other value has moved in the direction that corrects pH, compensation has started. If pH is back in range, compensation is full; if not, it is partial.",
              ],
            },
            {
              t: "callout",
              title: "Memory aid: ROME",
              html: "<strong>R</strong>espiratory <strong>O</strong>pposite, <strong>M</strong>etabolic <strong>E</strong>qual. In a respiratory problem, pH and PaCO₂ move in opposite directions. In a metabolic problem, pH and HCO₃⁻ move in the same direction.",
            },
            {
              t: "table",
              head: ["Disorder", "Primary change", "Common causes"],
              rows: [
                [
                  "Respiratory acidosis",
                  "PaCO₂ high (hypoventilation)",
                  "COPD exacerbation, opioid overdose, pulmonary edema, neuromuscular weakness",
                ],
                [
                  "Respiratory alkalosis",
                  "PaCO₂ low (hyperventilation)",
                  "Anxiety or pain, early salicylate toxicity, pulmonary embolism, high altitude",
                ],
                [
                  "Metabolic acidosis",
                  "HCO₃⁻ low",
                  "Diabetic ketoacidosis, lactic acidosis, kidney failure, severe diarrhea",
                ],
                [
                  "Metabolic alkalosis",
                  "HCO₃⁻ high",
                  "Vomiting or gastric suction, loop or thiazide diuretics, excess antacids",
                ],
              ],
            },
            // REVIEW: new diagram (image manifest: built as page diagrams). Primary changes from the table above.
            {
              t: "diagram",
              id: "d-acid-base",
              layout: "quad",
              title: "The four primary disorders and how the body compensates",
              alt: "Four acid–base disorders. Respiratory acidosis: pH down, PaCO2 up; the kidneys keep bicarbonate. Respiratory alkalosis: pH up, PaCO2 down; the kidneys excrete bicarbonate. Metabolic acidosis: pH down, bicarbonate down; the lungs blow off CO2. Metabolic alkalosis: pH up, bicarbonate up; the lungs retain CO2.",
              items: [
                { label: "Respiratory acidosis", sub: "pH ↓  PaCO₂ ↑", tag: "Compensation: the kidneys keep HCO₃⁻, so it rises" },
                { label: "Respiratory alkalosis", sub: "pH ↑  PaCO₂ ↓", tag: "Compensation: the kidneys excrete HCO₃⁻, so it falls" },
                { label: "Metabolic acidosis", sub: "pH ↓  HCO₃⁻ ↓", tag: "Compensation: faster, deeper breathing blows off CO₂, so PaCO₂ falls" },
                { label: "Metabolic alkalosis", sub: "pH ↑  HCO₃⁻ ↑", tag: "Compensation: slower breathing keeps CO₂, so PaCO₂ rises" },
              ],
              note: "ROME: Respiratory Opposite, Metabolic Equal. Compensation moves the other value in the same direction as the primary change, pushing pH back toward 7.35–7.45.",
            },
            { t: "h2", text: "The anion gap" },
            {
              t: "p",
              html: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻). A typical range is about 8–16 mEq/L. The gap stands for anions the panel does not measure.",
            },
            {
              t: "ul",
              items: [
                "<strong>High gap:</strong> an acid has been added, and bicarbonate is used up buffering it. Ketones (DKA), lactate (shock, sepsis), uremic acids (kidney failure), and toxins such as methanol, ethylene glycol and salicylates.",
                "<strong>Normal gap:</strong> bicarbonate has been lost, and chloride rises to replace it. Severe diarrhea and renal tubular acidosis.",
              ],
            },
            { t: "h2", text: "What pH does to potassium and calcium" },
            {
              t: "ul",
              items: [
                "In <strong>acidosis</strong>, H⁺ moves into cells and K⁺ moves out, so serum potassium rises. In <strong>alkalosis</strong>, the reverse happens and serum potassium falls.",
                "H⁺ competes with calcium for binding sites on albumin. In <strong>alkalosis</strong>, more calcium binds to albumin and ionized (active) calcium falls. That is why someone who is hyperventilating feels tingling around the mouth and in the fingers.",
              ],
            },
            {
              t: "case",
              title: "Back to Samuel",
              html: "Samuel's arterial blood gas: pH 7.18, PaCO₂ 24 mm Hg, HCO₃⁻ 10 mEq/L.",
            },
            {
              t: "q",
              q: {
                id: "s1-c2",
                type: "mc",
                stem: "Which interpretation of Samuel's blood gas is correct?",
                options: [
                  {
                    t: "Respiratory acidosis with metabolic compensation",
                    ok: false,
                    why: "In respiratory acidosis, PaCO₂ is high. Samuel's is low.",
                  },
                  {
                    t: "Metabolic acidosis with partial respiratory compensation",
                    ok: true,
                    why: "pH is low and HCO₃⁻ is low (same direction), so the cause is metabolic. PaCO₂ is low because he is breathing deeply and quickly to blow off CO₂. pH is still out of range, so compensation is partial.",
                  },
                  {
                    t: "Metabolic acidosis, fully compensated",
                    ok: false,
                    why: "Full compensation brings pH back to 7.35–7.45. At 7.18 he is still acidotic.",
                  },
                  {
                    t: "Respiratory alkalosis",
                    ok: false,
                    why: "A low PaCO₂ on its own suggests alkalosis, but his pH is acidotic. The low CO₂ is the compensation, not the cause.",
                  },
                ],
                rationale: "Ketone acids from fat breakdown are consuming his bicarbonate. His deep, rapid (Kussmaul) breathing is the lungs' attempt to correct the pH.",
                level: "application",
              },
            },
            {
              t: "q",
              q: {
                id: "s1-c3",
                type: "mc",
                stem: "Samuel's potassium is 5.8 mEq/L and an insulin infusion is started. Which statement best explains his potassium and what the nurse should anticipate?",
                options: [
                  {
                    t: "Acidosis and low insulin have shifted potassium out of his cells; insulin will move it back in, so his level can fall fast.",
                    ok: true,
                    why: "His serum potassium is high, but his total body potassium is usually low from vomiting and osmotic diuresis. Insulin drives potassium back into cells, so levels are checked often and replacement is usually needed as they fall.",
                  },
                  {
                    t: "His kidneys are retaining potassium because his aldosterone is high, so the level will keep rising.",
                    ok: false,
                    why: "Aldosterone makes the kidney excrete potassium, not retain it.",
                  },
                  {
                    t: "He has eaten too much potassium-rich food, so the level will stay high until he has dialysis.",
                    ok: false,
                    why: "He has been vomiting and not eating. The cause is a shift out of cells, not intake.",
                  },
                  {
                    t: "His high glucose is binding potassium in the blood, so the level will rise further once insulin starts.",
                    ok: false,
                    why: "Glucose does not bind potassium. Insulin lowers serum potassium.",
                  },
                ],
                rationale: "A normal or high potassium in DKA can hide a total body deficit. The danger is hypokalemia once treatment starts.",
                level: "application",
              },
            },
            {
              t: "open",
              id: "s1-o1",
              stem: "In your own words, explain why Samuel is breathing deeply and quickly. What would happen to his pH if he could not do this?",
              expert: "Samuel has metabolic acidosis from ketone acids. Breathing deeply and quickly (Kussmaul respirations) blows off CO₂, which removes acid and pushes his pH back toward normal. That is respiratory compensation. If he could not increase his breathing, for example because of sedation or exhaustion, CO₂ would build up and his pH would fall even further.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "The cellular environment: acid–base balance",
                  note: "Buffer systems, respiratory and renal compensation, the four primary disorders.",
                },
              ],
            },
          ],
        },
        {
          id: "s1-tp3",
          title: "1.3 Diabetes, kidney failure and dialysis",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What happens to homeostasis when the kidneys fail, and how does dialysis take over?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Failing kidneys cannot clear potassium, acid or fluid. Dialysis clears them by diffusion and ultrafiltration.",
                "Type 1 diabetes is autoimmune loss of insulin; type 2 is insulin resistance.",
                "High glucose damages the glomeruli over years, and diabetes is a leading cause of kidney failure.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p3",
              stem: "Failing kidneys cannot clear potassium. What does high potassium threaten first?",
              options: [{ id: "a", text: "The heart" }, { id: "b", text: "The lungs" }],
              correct: "a",
              reveal: "Potassium has the most immediate effect on the heart: high levels cause dangerous arrhythmias.",
            },
            { t: "h2", text: "Type 1 and type 2 diabetes" },
            {
              t: "table",
              head: ["", "Type 1", "Type 2"],
              rows: [
                [
                  "Main problem",
                  "Autoimmune destruction of pancreatic beta cells: little or no insulin",
                  "Insulin resistance, with beta-cell function declining over time",
                ],
                [
                  "Typical onset",
                  "Often childhood or young adulthood, but can occur at any age",
                  "Usually adulthood, increasingly seen in young people",
                ],
                [
                  "Insulin",
                  "Always required",
                  "May be managed with lifestyle and oral or injectable medicines; some people need insulin",
                ],
                ["Acute crisis", "Diabetic ketoacidosis (DKA)", "Hyperosmolar hyperglycemic state (HHS) is more typical"],
              ],
            },
            { t: "h2", text: "How diabetes damages the kidney" },
            {
              t: "p",
              html: "Years of high glucose and high blood pressure damage the glomeruli. Protein leaks into the urine, filtration falls, and chronic kidney disease (CKD) develops. Diabetes is a leading cause of kidney failure.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s6-ckd-kidney",
              alt: "Kidneys cut lengthwise: healthy with a thick cortex; chronic kidney disease, small with a thin, scarred cortex.",
              panels: [
                { label: "Healthy kidney", sub: "Thick cortex" },
                { label: "Chronic kidney disease", sub: "Small, scarred" },
              ],
              aspect: "3:2",
            },
            {
              t: "p",
              html: "When the kidneys fail, they can no longer do the homeostatic jobs from Lessons 1.1 and 1.2:",
            },
            {
              t: "ul",
              items: [
                "Potassium builds up (hyperkalemia).",
                "Acid builds up (metabolic acidosis with a high anion gap).",
                "Fluid builds up (edema, hypertension, pulmonary edema).",
                "Urea and creatinine build up (uremia).",
              ],
            },
            { t: "h2", text: "Dialysis does the kidney's work from outside" },
            { t: "p", html: "Dialysis uses a semipermeable membrane. Two processes do the work:" },
            {
              t: "ul",
              items: [
                "<strong>Diffusion</strong> moves solutes such as potassium and urea from where they are more concentrated (the blood) to where they are less concentrated (the dialysate).",
                "<strong>Ultrafiltration</strong> uses a pressure difference to remove excess fluid.",
              ],
            },
            // REVIEW: new diagram (image manifest: built as page diagrams).
            {
              t: "diagram",
              id: "d-dialysis",
              layout: "membrane",
              title: "How dialysis cleans the blood",
              alt: "Blood and dialysate on either side of a semipermeable membrane. Solutes such as potassium and urea diffuse from the blood into the dialysate; a pressure difference pulls excess water across by ultrafiltration.",
              items: [
                { label: "Blood", sub: "High potassium, urea and creatinine, and extra water" },
                { label: "Dialysate", sub: "No urea or creatinine; potassium and other solutes set to target levels" },
              ],
              flows: [
                { label: "Diffusion", sub: "Solutes move from higher to lower concentration" },
                { label: "Ultrafiltration", sub: "A pressure difference pulls excess water across" },
              ],
              note: "Blood cells and proteins are too large to cross the membrane, so they stay in the blood.",
            },
            {
              t: "table",
              head: ["", "Hemodialysis", "Peritoneal dialysis"],
              rows: [
                ["Membrane", "Artificial membrane in a dialyzer", "The client's own peritoneum"],
                ["Access", "Arteriovenous fistula or graft, or a central catheter", "Catheter into the peritoneal cavity"],
                ["Where and when", "Usually at a center, about three sessions a week", "Usually at home, every day"],
                [
                  "Key risks",
                  "Hypotension during treatment, access infection or clotting",
                  "Peritonitis: cloudy effluent, abdominal pain, fever",
                ],
              ],
            },
            {
              t: "q",
              q: {
                id: "s1-c4",
                type: "mc",
                stem: "A client with end-stage kidney disease has a potassium of 6.4 mEq/L before hemodialysis. How does dialysis lower it?",
                options: [
                  {
                    t: "The dialysate has a lower potassium concentration than the blood, so potassium diffuses out of the blood.",
                    ok: true,
                    why: "Diffusion moves potassium down its concentration gradient into the dialysate.",
                  },
                  {
                    t: "The dialysate has a higher potassium concentration, which pulls potassium out by osmosis.",
                    ok: false,
                    why: "A higher dialysate potassium would push potassium into the blood. Osmosis describes the movement of water, not solutes.",
                  },
                  {
                    t: "Ultrafiltration removes potassium by forcing plasma through the membrane.",
                    ok: false,
                    why: "Ultrafiltration mainly removes excess fluid. Potassium is removed mainly by diffusion.",
                  },
                  {
                    t: "The dialyzer converts potassium into a form the kidneys can excrete.",
                    ok: false,
                    why: "Nothing is converted, and this client's kidneys cannot excrete it.",
                  },
                ],
                rationale: "The dialysate's composition is set on purpose. Its low potassium creates the gradient that pulls potassium out.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s1-open3",
              stem: "Why does a client with kidney failure develop fluid overload and high potassium?",
              expert: "The kidneys normally excrete excess water and potassium. When filtration falls, both are retained: fluid builds up as edema and hypertension, and potassium rises in the blood.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "Alterations of renal function: chronic kidney disease",
                  note: "How filtration fails and what builds up.",
                },
                {
                  ref: "Alterations of hormonal regulation: diabetes mellitus",
                  note: "Type 1 and type 2, and diabetic kidney disease.",
                },
              ],
            },
          ],
        },
        {
          id: "s1-l1-quiz",
          topic: "Homeostasis Concepts",
          title: "Quiz: Lesson 1 topics",
          kind: "quiz",
          blocks: [
            {
              t: "p",
              html: "This quiz has five questions on homeostasis, fluids, electrolytes and acid-base balance. Submit each answer to see the reasoning before you move on.",
            },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s1-q1",
                  type: "mc",
                  stem: "A client has had nasogastric suction for three days after abdominal surgery. Arterial blood gas: pH 7.50, PaCO₂ 47 mm Hg, HCO₃⁻ 34 mEq/L. Which condition is present?",
                  options: [
                    { t: "Respiratory alkalosis", ok: false, why: "In respiratory alkalosis PaCO₂ is low. Here it is high." },
                    {
                      t: "Respiratory acidosis",
                      ok: false,
                      why: "pH is alkaline. The raised PaCO₂ is the lungs compensating, not the primary problem.",
                    },
                    {
                      t: "Metabolic alkalosis",
                      ok: true,
                      why: "Gastric suction removes hydrochloric acid. pH and HCO₃⁻ are both high (same direction), so the cause is metabolic. The slightly high PaCO₂ shows the lungs retaining CO₂ to compensate.",
                    },
                    { t: "Metabolic acidosis", ok: false, why: "In metabolic acidosis, pH and HCO₃⁻ would both be low." },
                  ],
                  rationale: "Losing stomach acid leaves bicarbonate behind. Vomiting and gastric suction are the classic causes of metabolic alkalosis.",
                  level: "application",
                },
                {
                  id: "s1-q2",
                  type: "mc",
                  stem: "Which client's edema is caused mainly by decreased plasma oncotic pressure?",
                  options: [
                    {
                      t: "A client with heart failure who has crackles and swollen ankles",
                      ok: false,
                      why: "Heart failure raises capillary hydrostatic pressure. That pushes fluid out; it does not reduce the pull back in.",
                    },
                    {
                      t: "A client with cirrhosis and a serum albumin of 2.1 g/dL",
                      ok: true,
                      why: "The liver makes albumin. With little albumin, the blood cannot pull fluid back from the tissues.",
                    },
                    {
                      t: "A client with a partial-thickness burn on the forearm",
                      ok: false,
                      why: "Burns make capillaries leaky. That is a permeability problem.",
                    },
                    {
                      t: "A client whose axillary lymph nodes were removed",
                      ok: false,
                      why: "Lymphatic obstruction causes lymphedema because fluid cannot drain away.",
                    },
                  ],
                  rationale: "Match each cause to its mechanism: pressure pushing out, protein pulling in, leaky capillaries, or blocked drainage.",
                  level: "application",
                },
                {
                  id: "s1-q3",
                  type: "mc",
                  stem: "A client is diagnosed with syndrome of inappropriate antidiuretic hormone (SIADH). Which finding does the nurse expect?",
                  options: [
                    {
                      t: "Serum sodium 126 mEq/L",
                      ok: true,
                      why: "Too much ADH makes the kidney keep too much water, which dilutes the sodium.",
                    },
                    {
                      t: "Large volumes of dilute urine",
                      ok: false,
                      why: "That describes diabetes insipidus, where ADH is lacking. In SIADH, urine is concentrated and output is low.",
                    },
                    {
                      t: "Serum osmolality 310 mOsm/kg",
                      ok: false,
                      why: "Retained water lowers serum osmolality in SIADH. A high value points to dehydration or diabetes insipidus.",
                    },
                    {
                      t: "Serum potassium 6.0 mEq/L",
                      ok: false,
                      why: "ADH acts on water, not potassium. Hyperkalemia is not an expected feature of SIADH.",
                    },
                  ],
                  rationale: "SIADH and diabetes insipidus are mirror images. Excess ADH gives dilutional hyponatremia; too little ADH gives large volumes of dilute urine and rising sodium.",
                  level: "application",
                },
                {
                  id: "s1-q4",
                  type: "mc",
                  stem: "A client with chronic kidney disease has a potassium level of 6.8 mEq/L. Which finding should the nurse expect and report immediately?",
                  options: [
                    {
                      t: "Tall, peaked T waves on the cardiac monitor",
                      ok: true,
                      why: "Peaked T waves are an early ECG sign of hyperkalemia and warn of dangerous dysrhythmias.",
                    },
                    { t: "U waves on the cardiac monitor", ok: false, why: "U waves suggest hypokalemia." },
                    { t: "A positive Chvostek sign", ok: false, why: "Chvostek sign points to hypocalcemia." },
                    {
                      t: "Hyperactive deep tendon reflexes",
                      ok: false,
                      why: "Hyperreflexia is linked to low magnesium or low calcium. High potassium tends to cause weakness.",
                    },
                  ],
                  rationale: "Kidney failure is the most common cause of hyperkalemia. The ECG is the most urgent thing to check.",
                  level: "application",
                },
                {
                  id: "s1-q5",
                  type: "ms",
                  stem: "A client's panel shows Na⁺ 138, Cl⁻ 100 and HCO₃⁻ 12 mEq/L. Which conditions could explain these results? <strong>Choose 2 answers.</strong>",
                  options: [
                    {
                      t: "Diabetic ketoacidosis",
                      ok: true,
                      why: "The anion gap is 138 − (100 + 12) = 26, which is high. Ketones are an added acid.",
                    },
                    {
                      t: "Lactic acidosis from septic shock",
                      ok: true,
                      why: "Lactate is an added acid, which also produces a high anion gap.",
                    },
                    {
                      t: "Severe diarrhea",
                      ok: false,
                      why: "Diarrhea loses bicarbonate directly. Chloride rises to replace it, so the gap stays normal.",
                    },
                    {
                      t: "Prolonged vomiting",
                      ok: false,
                      why: "Vomiting causes metabolic alkalosis, so HCO₃⁻ would be high, not 12.",
                    },
                    {
                      t: "Hyperventilation during an anxiety attack",
                      ok: false,
                      why: "That is respiratory alkalosis. It would not produce a bicarbonate of 12 or a high gap.",
                    },
                  ],
                  rationale: "Calculate the gap first. A high gap narrows the cause to an added acid.",
                  level: "application",
                },
              ],
            },
          ],
        },
        {
          id: "s1-tp4",
          title: "1.4 Cellular adaptation and injury",
          kind: "topic",
          blocks: [
            // REVIEW: new
            { t: "eq", text: "How do cells adapt to stress, and how do they die when they cannot?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Cells adapt by atrophy, hypertrophy, hyperplasia or metaplasia. Dysplasia is disordered growth and can come before cancer.",
                "Necrosis causes inflammation; apoptosis does not.",
                "Hypertrophy means bigger cells; hyperplasia means more cells.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p4",
              stem: "A smoker's airway lining changes from ciliated columnar cells to squamous cells. What is this?",
              options: [{ id: "a", text: "Metaplasia" }, { id: "b", text: "Dysplasia" }],
              correct: "a",
              reveal: "One mature cell type replaced by another that better withstands the irritant is metaplasia. It can reverse if the irritant stops.",
            },
            { t: "h2", text: "Lesson introduction" },
            {
              t: "p",
              html: "Cells under stress adapt if they can. If the stress is too strong or lasts too long, they are injured, and injury may become cell death. Most disease you will study later starts with one of these responses.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s1-cell-adaptations",
              alt: "Epithelium in six states: normal, atrophy with smaller cells, hypertrophy with larger cells, hyperplasia with more cells, metaplasia with squamous cells replacing columnar, and dysplasia with disordered cells.",
              panels: [
                { label: "Normal", sub: "Orderly single row" },
                { label: "Atrophy", sub: "Cells smaller" },
                { label: "Hypertrophy", sub: "Cells larger" },
                { label: "Hyperplasia", sub: "More cells" },
                { label: "Metaplasia", sub: "One type replaced by another" },
                { label: "Dysplasia", sub: "Disordered, still contained" },
              ],
              aspect: "3:1",
            },
            { t: "h2", text: "Five adaptations" },
            {
              t: "table",
              head: ["Adaptation", "What happens", "Example"],
              rows: [
                ["Atrophy", "Cells shrink", "Leg muscles after weeks in a cast"],
                ["Hypertrophy", "Cells get bigger", "Left ventricular wall thickening in long-standing hypertension"],
                [
                  "Hyperplasia",
                  "Cells increase in number",
                  "Benign prostatic hyperplasia; endometrial hyperplasia from unopposed estrogen",
                ],
                [
                  "Metaplasia",
                  "One mature cell type is replaced by another that copes better with the stress",
                  "Ciliated columnar airway cells replaced by squamous cells in a smoker",
                ],
                [
                  "Dysplasia",
                  "Cells become disordered and abnormal in size and shape",
                  "Cervical dysplasia found on a Pap test (precancerous)",
                ],
              ],
            },
            {
              t: "callout",
              title: "Metaplasia or dysplasia?",
              html: "Metaplasia is an orderly swap of one normal cell type for another, and it can reverse if the stress stops. Dysplasia is disordered growth and is a warning sign for cancer.",
            },
            { t: "h2", text: "Injury and death" },
            {
              t: "ul",
              items: [
                "<strong>Reversible injury:</strong> the cell swells as its sodium pumps fail, and fat may build up. Function returns if the cause is removed.",
                "<strong>Necrosis:</strong> uncontrolled death. Cells swell and burst, spilling their contents and triggering inflammation. Seen after ischemia, burns and toxins.",
                "<strong>Apoptosis:</strong> programmed, orderly death. The cell shrinks and is removed without inflammation. It is normal in development and tissue turnover.",
              ],
            },
            // REVIEW: new
            {
              t: "q",
              q: {
                id: "s1-c8",
                type: "mc",
                level: "application",
                stem: "Which finding describes apoptosis rather than necrosis?",
                options: [
                  {
                    t: "Programmed cell death that does not trigger inflammation",
                    ok: true,
                    why: "Apoptotic cells shrink into fragments that macrophages remove quietly.",
                  },
                  { t: "Cells swell and rupture, triggering inflammation", ok: false, why: "That is necrosis." },
                  {
                    t: "One mature cell type is replaced by another",
                    ok: false,
                    why: "That is metaplasia, an adaptation, not cell death.",
                  },
                  { t: "The number of cells in a tissue increases", ok: false, why: "That is hyperplasia." },
                ],
                rationale: "Necrosis spills and inflames; apoptosis is tidy.",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s1-open4",
              stem: "Why does necrosis cause inflammation but apoptosis does not?",
              expert: "In necrosis cells swell and burst, spilling contents that attract inflammatory cells. In apoptosis the cell shrinks into membrane-bound fragments that macrophages remove, so nothing spills.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "Altered cellular and tissue biology",
                  note: "Adaptation, reversible and irreversible injury, necrosis and apoptosis.",
                },
              ],
            },
          ],
        },
        {
          id: "s1-tp5",
          title: "1.5 Immunity, inflammation and age",
          kind: "topic",
          blocks: [
            {
              t: "eq",
              text: "How does the immune system respond to pathogens, allergens and injury, and how does that response change with age?",
            },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Innate immunity is fast and general; adaptive immunity is slower, specific and has memory.",
                "Inflammation is vasodilation plus leaky capillaries: redness, heat, swelling, pain and loss of function.",
                "Hypersensitivity types I to IV can be told apart by timing and by whether IgE, antibodies, immune complexes or T cells drive them.",
                "Children have few memory cells; older adults have fewer naive T cells and quieter signs of infection.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p5",
              stem: "Which white cells arrive first at a fresh wound?",
              options: [{ id: "a", text: "Neutrophils" }, { id: "b", text: "Lymphocytes" }],
              correct: "a",
              reveal: "Neutrophils arrive within hours in acute inflammation. Lymphocytes drive the slower adaptive response.",
            },
            {
              t: "video",
              clip: "foundations-06",
              chapters: [
                { at: "0:00", label: "Misfolded proteins" },
                { at: "1:00", label: "Receptors and viral entry" },
                { at: "2:50", label: "Antibodies" },
                { at: "4:20", label: "Autoimmunity" },
              ],
              stops: [
                { at: "4:50", check: "s1-c5" },
                { at: "6:40", check: "s1-c6" },
              ],
            },
            { t: "h2", text: "Two branches of the immune response" },
            {
              t: "table",
              head: ["", "Innate", "Adaptive"],
              rows: [
                ["Speed", "Minutes to hours", "Days on first exposure, faster on repeat exposure"],
                ["Specificity", "General; the same response to any threat", "Specific to one antigen"],
                ["Memory", "None", "Yes, through memory B and T cells"],
                [
                  "Key players",
                  "Skin and mucous membranes, neutrophils, macrophages, natural killer cells, complement, mast cells",
                  "B cells (become plasma cells that make antibodies), helper T cells (CD4), cytotoxic T cells (CD8)",
                ],
              ],
            },
            {
              t: "p",
              html: "Helper T cells coordinate the adaptive response by releasing cytokines that activate B cells and cytotoxic T cells. Cytotoxic T cells kill infected or abnormal cells directly.",
            },
            { t: "h2", text: "Inflammation" },
            {
              t: "p",
              html: "After tissue injury, mast cells release histamine and other mediators. Arterioles dilate, which brings redness and heat. Capillaries become more permeable, so fluid and proteins leak out, causing swelling. Mediators stimulate nerve endings, causing pain, and the swelling and pain limit function. This lets white cells reach the site.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s1-acute-inflammation",
              alt: "A small vessel, normal and then inflamed: wider, leaking fluid, with neutrophils moving out into the swollen tissue.",
              panels: [
                { label: "Normal", sub: "Tight wall, calm tissue" },
                { label: "Acute inflammation", sub: "Wider, leaky, neutrophils out" },
              ],
              aspect: "3:2",
            },
            { t: "h2", text: "When the immune system is the problem: hypersensitivity" },
            {
              t: "table",
              head: ["Type", "Mechanism", "Example"],
              rows: [
                [
                  "I: immediate",
                  "IgE on mast cells releases histamine within minutes",
                  "Anaphylaxis, allergic asthma, hay fever",
                ],
                [
                  "II: cytotoxic",
                  "Antibodies attack antigens on cell surfaces",
                  "ABO transfusion reaction, hemolytic disease of the newborn",
                ],
                [
                  "III: immune complex",
                  "Antigen-antibody complexes deposit in tissues",
                  "Systemic lupus erythematosus, post-streptococcal glomerulonephritis",
                ],
                [
                  "IV: delayed",
                  "T cells cause the reaction over 24–72 hours; no antibodies involved",
                  "Positive tuberculin skin test, poison ivy contact dermatitis",
                ],
              ],
            },
            {
              t: "q",
              q: {
                id: "s1-c5",
                type: "mc",
                stem: "A client develops an itchy, blistering rash two days after clearing poison ivy from a garden. Which type of hypersensitivity is this?",
                options: [
                  { t: "Type I, IgE-mediated", ok: false, why: "Type I reactions start within minutes of exposure." },
                  {
                    t: "Type II, cytotoxic",
                    ok: false,
                    why: "Type II involves antibodies against cell-surface antigens, as in a transfusion reaction.",
                  },
                  {
                    t: "Type III, immune complex",
                    ok: false,
                    why: "Type III involves deposited antigen-antibody complexes, as in lupus.",
                  },
                  {
                    t: "Type IV, delayed",
                    ok: true,
                    why: "A reaction that peaks 24–72 hours after contact and is driven by T cells is type IV.",
                  },
                ],
                rationale: "Timing is the quickest clue: minutes points to type I, days points to type IV.",
                level: "application",
              },
            },
            { t: "h2", text: "Immunity across the life span" },
            {
              t: "ul",
              items: [
                "<strong>Newborns</strong> are protected partly by maternal IgG that crossed the placenta and by IgA in breast milk. This passive immunity fades over the first months.",
                "<strong>Young children</strong> have met few pathogens, so they have few memory cells. Each new virus needs a slower primary response, which is why they catch so many colds.",
                "<strong>Older adults</strong> have a shrunken thymus and fewer new (naive) T cells. They respond less well to new infections and vaccines. Fever may be low or absent, and infection may first show as confusion or a fall.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s1-c6",
                type: "ms",
                stem: "A nurse is caring for an 82-year-old resident who has pneumonia. Which findings reflect age-related changes in immunity? <strong>Choose 3 answers.</strong>",
                options: [
                  {
                    t: "A temperature of 37.4 °C (99.3 °F) despite confirmed pneumonia",
                    ok: true,
                    why: "Older adults often have a blunted fever response.",
                  },
                  {
                    t: "New confusion as the first sign of infection",
                    ok: true,
                    why: "A weaker inflammatory response often makes infection in older adults present in unusual ways, such as confusion.",
                  },
                  {
                    t: "A weaker antibody response to this year's influenza vaccine",
                    ok: true,
                    why: "Fewer naive T cells and changes in B-cell function reduce the response to vaccines.",
                  },
                  {
                    t: "A larger supply of naive T cells than a young adult has",
                    ok: false,
                    why: "The thymus shrinks with age, so fewer naive T cells are produced.",
                  },
                  {
                    t: "A faster, higher fever than a younger adult would have",
                    ok: false,
                    why: "The opposite is true: fever is often lower or absent.",
                  },
                ],
                rationale: "Expect quieter signs of infection in older adults, and treat new confusion as a possible sign of infection.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s1-open5",
              stem: "Why might an 85-year-old with pneumonia have no fever?",
              expert: "Ageing quiets the immune response, so the signals that produce fever and other classic signs are weaker. Infection may show up as confusion, falls or loss of appetite instead.",
            },
            {
              t: "read",
              items: [
                { ref: "Innate immunity: inflammation and wound healing" },
                { ref: "Adaptive immunity" },
                { ref: "Alterations in immunity and inflammation", note: "The four hypersensitivity types." },
              ],
            },
          ],
        },
        {
          id: "s1-tp6",
          title: "1.6 Genetics and congenital anomalies",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do genes and the environment during pregnancy cause congenital anomalies?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Recessive disease between two carriers: 25% risk per pregnancy. X-linked recessive: sons of carrier mothers have a 50% risk.",
                "Alcohol and folate deficiency are preventable causes of congenital anomalies.",
                "Sickle cell disease is autosomal recessive: one faulty gene from each parent.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s1-p6",
              stem: "Two carriers of a recessive disease have a child. What is the chance the child is affected?",
              options: [{ id: "a", text: "25%" }, { id: "b", text: "50%" }],
              correct: "a",
              reveal: "Each parent passes the faulty gene half the time, so the chance of two faulty copies is 1 in 4 for each pregnancy.",
            },
            {
              t: "video",
              clip: "foundations-07",
              chapters: [
                { at: "0:00", label: "DNA and cancer" },
                { at: "1:20", label: "Genes that control division" },
                { at: "6:40", label: "What cancer is" },
                { at: "7:40", label: "Inherited risk: BRCA and p53" },
              ],
            },
            {
              t: "video",
              clip: "foundations-08",
              chapters: [
                { at: "0:00", label: "Genetic disorders" },
                { at: "0:20", label: "Sickle cell anemia" },
                { at: "1:15", label: "Trisomy 21" },
              ],
              stops: [{ at: "1:15", check: "s1-c7" }],
            },
            { t: "h2", text: "Patterns of inheritance" },
            {
              t: "table",
              head: ["Pattern", "How it passes on", "Examples"],
              rows: [
                [
                  "Autosomal dominant",
                  "One altered copy causes the disease. An affected parent with one copy has a 50% chance of passing it to each child.",
                  "Huntington disease, Marfan syndrome",
                ],
                [
                  "Autosomal recessive",
                  "Two altered copies are needed. If both parents are carriers, each child has a 25% chance of being affected, 50% of being a carrier and 25% of being unaffected.",
                  "Cystic fibrosis, sickle cell disease",
                ],
                [
                  "X-linked recessive",
                  "Males have one X, so one altered copy causes disease. A carrier mother passes it to 50% of her sons (affected) and 50% of her daughters (carriers).",
                  "Hemophilia A, Duchenne muscular dystrophy, red-green color blindness",
                ],
                [
                  "Chromosomal",
                  "Whole chromosomes are gained or lost, usually through nondisjunction during meiosis.",
                  "Trisomy 21 (Down syndrome), Turner syndrome (45,X), Klinefelter syndrome (47,XXY)",
                ],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s1-sickle-cell",
              alt: "A small vessel with normal red cells flowing, then rigid crescent-shaped cells jammed at a narrowing, with paler tissue beyond it.",
              panels: [
                { label: "Normal flow", sub: "Flexible discs" },
                { label: "Sickle cell crisis", sub: "Rigid cells block flow" },
              ],
              aspect: "3:2",
            },
            {
              t: "callout",
              title: "Fathers and X-linked disease",
              html: "A father passes his X only to his daughters and his Y to his sons. So an affected father cannot pass an X-linked disease to his sons, but all of his daughters will be carriers.",
            },
            {
              t: "q",
              q: {
                id: "s1-c7",
                type: "mc",
                fixed: true,
                stem: "Both partners carry one copy of the gene for cystic fibrosis, but neither has the disease. What is the chance that each pregnancy results in a child with cystic fibrosis?",
                options: [
                  { t: "0%", ok: false, why: "Carriers can each pass on their altered copy." },
                  { t: "25%", ok: true, why: "Each parent passes on the altered copy half the time: ½ × ½ = ¼." },
                  { t: "50%", ok: false, why: "50% is the chance that a child will be a carrier like the parents." },
                  {
                    t: "75%",
                    ok: false,
                    why: "75% is the chance that a child will not have the disease (carriers plus unaffected children).",
                  },
                ],
                rationale: "Draw a Punnett square for any recessive question. The risk is the same for each pregnancy.",
                level: "application",
              },
            },
            { t: "h2", text: "Environmental causes" },
            {
              t: "p",
              html: "Organs form mainly between weeks 3 and 8 after conception. Exposures during this window are most likely to cause structural defects, and many people do not yet know they are pregnant.",
            },
            {
              t: "ul",
              items: [
                "<strong>Alcohol</strong> crosses the placenta. Fetal alcohol spectrum disorders can include a smooth philtrum, thin upper lip, small eye openings, poor growth, smaller brain volume, and lasting learning and behavior problems. No amount or timing of alcohol in pregnancy is known to be safe.",
                "<strong>Folate deficiency</strong> raises the risk of neural tube defects. The neural tube closes about four weeks after conception. Folic acid, 400 micrograms daily, is recommended for anyone who could become pregnant.",
              ],
            },
            {
              t: "table",
              head: ["Spina bifida type", "What is seen"],
              rows: [
                [
                  "Occulta",
                  "No sac. There may be a dimple, a tuft of hair or a birthmark over the lower spine. Often no symptoms.",
                ],
                [
                  "Meningocele",
                  "A sac containing meninges and spinal fluid, but no spinal cord. Nerve damage is usually mild.",
                ],
                [
                  "Myelomeningocele",
                  "A sac containing meninges and spinal cord or nerves. This is the most severe form, with leg weakness or paralysis and problems with bowel and bladder control.",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "open",
              id: "s1-open6",
              stem: "Why are sons of carrier mothers affected by X-linked recessive disorders more often than daughters?",
              expert: "Sons have one X chromosome, from their mother. If it carries the faulty gene, there is no second X to compensate. Daughters get a second, usually normal, X from their father, so they are usually carriers.",
            },
            {
              t: "read",
              items: [
                { ref: "Genes and genetic diseases", note: "Inheritance patterns and chromosomal disorders." },
                {
                  ref: "Genes, environment-lifestyle and common diseases",
                  note: "Multifactorial causes, teratogens and neural tube defects.",
                },
              ],
            },
          ],
        },
        {
          id: "s1-l2-quiz",
          topic: "Cellular Response and Adaptation",
          title: "Quiz: Lesson 2 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "This quiz has five questions on cell adaptation, immunity and congenital anomalies." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s1-q6",
                  type: "mc",
                  stem: "A client who has smoked for 25 years has a bronchial biopsy. It shows stratified squamous cells where ciliated columnar cells normally line the airway. Which adaptation is this?",
                  options: [
                    {
                      t: "Metaplasia",
                      ok: true,
                      why: "One mature cell type has been replaced by a sturdier one. The change is orderly and may reverse if the client stops smoking.",
                    },
                    {
                      t: "Dysplasia",
                      ok: false,
                      why: "Dysplasia means disordered, abnormal cells. The biopsy describes normal squamous cells in the wrong place.",
                    },
                    { t: "Hyperplasia", ok: false, why: "Hyperplasia is more cells of the same type." },
                    { t: "Hypertrophy", ok: false, why: "Hypertrophy is larger cells of the same type." },
                  ],
                  rationale: "Ask yourself: has the cell type changed (metaplasia), or has it become disordered (dysplasia)?",
                  level: "application",
                },
                {
                  id: "s1-q7",
                  type: "mc",
                  stem: "Which statement best distinguishes necrosis from apoptosis?",
                  options: [
                    {
                      t: "Necrosis ruptures cells and inflames tissue; apoptosis is orderly and quiet.",
                      ok: true,
                      why: "This is the key difference, and it explains why necrosis damages surrounding tissue.",
                    },
                    {
                      t: "Apoptosis is always a sign of disease in the tissue.",
                      ok: false,
                      why: "Apoptosis is normal in development and in routine tissue turnover.",
                    },
                    {
                      t: "Necrosis can be reversed if the blood supply returns quickly.",
                      ok: false,
                      why: "Necrosis is cell death. Only earlier injury, such as cell swelling, is reversible.",
                    },
                    {
                      t: "Apoptosis causes more inflammation than necrosis does.",
                      ok: false,
                      why: "Apoptotic cells are removed quietly. Necrosis is the one that triggers inflammation.",
                    },
                  ],
                  rationale: "Necrosis is messy and inflammatory; apoptosis is tidy and programmed.",
                  level: "application",
                },
                {
                  id: "s1-q8",
                  type: "mc",
                  stem: "A mother asks why her breastfed 2-month-old has not caught the cold that the rest of the family has. Which explanation is most accurate?",
                  options: [
                    {
                      t: "Antibodies that crossed the placenta and antibodies in breast milk give her passive protection.",
                      ok: true,
                      why: "Maternal IgG crosses the placenta and IgA in breast milk protects mucous membranes. This passive immunity fades over the first months.",
                    },
                    {
                      t: "She made her own memory cells against this virus before birth.",
                      ok: false,
                      why: "Memory cells form after exposure. She has not met this virus.",
                    },
                    {
                      t: "Newborns have a fully mature adaptive immune system.",
                      ok: false,
                      why: "The adaptive immune system is still immature in infancy.",
                    },
                    {
                      t: "Infants do not have an innate immune response, so viruses cannot affect them.",
                      ok: false,
                      why: "Infants do have innate immunity, and they can certainly be infected.",
                    },
                  ],
                  rationale: "Passive immunity is borrowed. It protects right away but does not create memory.",
                  level: "application",
                },
                {
                  id: "s1-q9",
                  type: "mc",
                  fixed: true,
                  stem: "A man with hemophilia A and a woman who is not a carrier are expecting a son. What is the chance that their son will have hemophilia A?",
                  options: [
                    {
                      t: "0%",
                      ok: true,
                      why: "A son gets his Y chromosome from his father and his X from his mother. The mother's X is normal, so the son is unaffected. All daughters, though, will be carriers.",
                    },
                    { t: "25%", ok: false, why: "25% applies to two carriers with an autosomal recessive disease." },
                    { t: "50%", ok: false, why: "50% of sons are affected when the mother is a carrier, not the father." },
                    { t: "100%", ok: false, why: "Fathers do not pass their X chromosome to sons." },
                  ],
                  rationale: "For X-linked questions, follow the X. Fathers give their X to daughters only.",
                  level: "application",
                },
                {
                  id: "s1-q10",
                  type: "ms",
                  stem: "A nurse is teaching a client who is planning a pregnancy about preventing congenital anomalies. Which statements show that the client understands? <strong>Choose 2 answers.</strong>",
                  options: [
                    {
                      t: "\"I'll start taking folic acid now, before we start trying.\"",
                      ok: true,
                      why: "The neural tube closes about four weeks after conception, often before a pregnancy is confirmed.",
                    },
                    {
                      t: "\"I'll stop drinking alcohol now, since no amount is known to be safe in pregnancy.\"",
                      ok: true,
                      why: "There is no known safe amount or safe time to drink alcohol in pregnancy.",
                    },
                    {
                      t: "\"An occasional drink is fine after the first trimester.\"",
                      ok: false,
                      why: "Alcohol can affect brain development throughout pregnancy.",
                    },
                    {
                      t: "\"Folic acid only matters once I know I'm pregnant.\"",
                      ok: false,
                      why: "By the time most pregnancies are confirmed, the neural tube has already formed.",
                    },
                    {
                      t: "\"Spina bifida is caused only by genes, so there's nothing I can do.\"",
                      ok: false,
                      why: "Adequate folic acid substantially lowers the risk.",
                    },
                  ],
                  rationale: "Both preventive steps work best when they start before conception.",
                  level: "application",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s1-sum-g",
      title: "Section 1: Summary",
      pages: [
        {
          id: "s1-sum",
          title: "Section 1: Summary and cards",
          kind: "summary",
          blocks: [
            {
              t: "p",
              html: "In this section you looked at how the body holds fluid, electrolytes and pH steady, and what happens when it cannot, using Samuel's DKA as the example. You then looked at how cells adapt and die, how the immune system protects the body (and sometimes harms it), and how genes and the environment cause congenital anomalies. Every body system in the rest of the course builds on these ideas.",
            },
            {
              t: "ul",
              items: [
                "Homeostasis depends on negative feedback: a sensor, a control center and an effector.",
                "Edema comes from more push out of the capillary, less pull back in, leaky capillaries or blocked lymph drainage.",
                "ADH responds to concentration; the RAAS responds to volume and pressure; ANP works against both.",
                "Potassium has the most immediate effect on the heart. Calcium and magnesium affect nerve and muscle excitability.",
                "Buffers act in seconds, lungs in minutes and kidneys over hours to days.",
                "ROME: in a respiratory problem pH and PaCO₂ move in opposite directions; in a metabolic problem pH and HCO₃⁻ move in the same direction.",
                "A high anion gap means an acid has been added; a normal gap means bicarbonate has been lost.",
                "Failing kidneys cannot clear potassium, acid or fluid. Dialysis clears them by diffusion and ultrafiltration.",
                "Cells adapt by atrophy, hypertrophy, hyperplasia or metaplasia. Dysplasia is disordered growth and can come before cancer.",
                "Necrosis causes inflammation; apoptosis does not.",
                "Innate immunity is fast and general; adaptive immunity is slower, specific and has memory.",
                "Inflammation is vasodilation plus leaky capillaries: redness, heat, swelling, pain and loss of function.",
                "Hypersensitivity types I to IV can be told apart by timing and by whether IgE, antibodies, immune complexes or T cells drive them.",
                "Children have few memory cells; older adults have fewer naive T cells and quieter signs of infection.",
                "Recessive disease between two carriers: 25% risk per pregnancy. X-linked recessive: sons of carrier mothers have a 50% risk.",
                "Alcohol and folate deficiency are preventable causes of congenital anomalies.",
              ],
            },
            // REVIEW: new
            {
              t: "confused",
              rows: [
                [
                  "Hypotonic solution",
                  "Hypertonic solution",
                  "Hypotonic: water enters cells and they swell. Hypertonic: water leaves cells and they shrink.",
                ],
                [
                  "Respiratory acidosis",
                  "Metabolic acidosis",
                  "Respiratory: PaCO₂ rises, pH falls (opposite directions). Metabolic: HCO₃⁻ falls, pH falls (same direction).",
                ],
                [
                  "Necrosis",
                  "Apoptosis",
                  "Necrosis: cells swell and burst, causing inflammation. Apoptosis: programmed, tidy, no inflammation.",
                ],
                [
                  "Metaplasia",
                  "Dysplasia",
                  "Metaplasia: one normal cell type replaces another. Dysplasia: disordered growth that can come before cancer.",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "values",
              rows: [
                ["Blood pH", "7.35–7.45"],
                ["PaCO₂", "35–45 mm Hg", "respiratory component"],
                ["HCO₃⁻", "22–26 mEq/L", "metabolic component"],
                ["Potassium", "3.5–5.0 mEq/L", "most immediate effect on the heart"],
              ],
            },
            {
              t: "cards",
              id: "fc-l1",
              title: "Lesson 1 flashcards",
              cards: [
                ["Normal arterial pH", "7.35–7.45"],
                ["Normal PaCO₂", "35–45 mm Hg"],
                ["Normal HCO₃⁻ (arterial)", "22–26 mEq/L"],
                ["ROME", "Respiratory Opposite, Metabolic Equal (the direction of pH compared with PaCO₂ or HCO₃⁻)"],
                ["Anion gap formula", "Na⁺ − (Cl⁻ + HCO₃⁻); typically about 8–16 mEq/L"],
                [
                  "ADH trigger and effect",
                  "Rising osmolality → posterior pituitary releases ADH → collecting ducts reabsorb water",
                ],
                ["Aldosterone effect", "Reabsorb sodium (and water), excrete potassium"],
                ["ANP trigger and effect", "Atrial stretch → excrete sodium and water"],
                ["Tall peaked T waves", "Hyperkalemia"],
                ["U waves", "Hypokalemia"],
                ["Chvostek and Trousseau signs", "Hypocalcemia"],
                ["Low albumin leads to…", "Lower plasma oncotic pressure → edema"],
              ],
            },
            {
              t: "cards",
              id: "fc-l2",
              title: "Lesson 2 flashcards",
              cards: [
                ["Metaplasia", "One mature cell type replaced by another (e.g., columnar to squamous in a smoker's airway)"],
                ["Dysplasia", "Disordered, abnormal cells; precancerous"],
                ["Hypertrophy and hyperplasia", "Bigger cells, compared with more cells"],
                [
                  "Necrosis and apoptosis",
                  "Cells burst with inflammation, compared with orderly programmed death without inflammation",
                ],
                ["Type I hypersensitivity", "IgE and mast cells; minutes (anaphylaxis)"],
                ["Type IV hypersensitivity", "T cells; 24–72 hours (TB skin test, poison ivy)"],
                ["Helper T cell (CD4)", "Releases cytokines that activate B cells and cytotoxic T cells"],
                ["Two carriers, autosomal recessive", "25% affected, 50% carriers, 25% unaffected"],
                ["Carrier mother, X-linked recessive", "50% of sons affected, 50% of daughters carriers"],
                ["Trisomy 21", "Usually nondisjunction; risk rises with maternal age"],
                ["Folic acid", "400 mcg daily before and during early pregnancy to lower neural tube defect risk"],
              ],
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I read a blood gas and say whether compensation is partial or full?",
                "Can I explain why Samuel's potassium was high and why it may fall with treatment?",
                "Can I name the mechanism behind a patient's edema?",
                "Can I tell metaplasia from dysplasia, and necrosis from apoptosis?",
                "Can I work out inheritance risk for autosomal recessive and X-linked conditions?",
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
      id: "s1-test-g",
      title: "Section 1: Test",
      pages: [
        {
          id: "s1-test",
          title: "Section 1: Test",
          kind: "test",
          blocks: [
            {
              t: "p",
              html: "This test has ten questions covering Lesson 1 and Lesson 2. Answer every question, then submit. Your score and all rationales appear after you submit.",
            },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s1-t1",
                  type: "mc",
                  stem: "A client is admitted with severe dehydration from gastroenteritis. Which urine finding shows that ADH is acting as expected?",
                  options: [
                    {
                      t: "Specific gravity 1.032",
                      ok: true,
                      why: "ADH makes the kidney reabsorb water, so urine becomes concentrated. A specific gravity above the usual 1.005–1.030 range fits that.",
                    },
                    {
                      t: "Specific gravity 1.002",
                      ok: false,
                      why: "Very dilute urine in a dehydrated client would suggest ADH is not working, as in diabetes insipidus.",
                    },
                    {
                      t: "Urine output of 250 mL/hour",
                      ok: false,
                      why: "High output is the opposite of the expected response to dehydration.",
                    },
                    { t: "Glucose in the urine", ok: false, why: "Glycosuria reflects high blood glucose, not ADH activity." },
                  ],
                  rationale: "In dehydration, expect a low volume of concentrated urine.",
                  level: "application",
                },
                {
                  id: "s1-t2",
                  type: "mc",
                  stem: "A client is hyperventilating during a panic attack and reports tingling around the mouth and in the fingers. Which explanation is correct?",
                  options: [
                    {
                      t: "Respiratory alkalosis makes more calcium bind to albumin, so ionized calcium falls.",
                      ok: true,
                      why: "Blowing off CO₂ raises pH. Fewer H⁺ ions compete for albumin, so more calcium binds and less is free to act on nerves.",
                    },
                    {
                      t: "Respiratory acidosis raises serum potassium.",
                      ok: false,
                      why: "Hyperventilation lowers CO₂ and causes alkalosis, not acidosis.",
                    },
                    {
                      t: "Metabolic alkalosis has developed from lost stomach acid.",
                      ok: false,
                      why: "Nothing in the history suggests vomiting. The cause is respiratory.",
                    },
                    {
                      t: "Blowing off CO₂ causes hypercalcemia.",
                      ok: false,
                      why: "Total calcium is unchanged, and the ionized fraction falls. Tingling points to low ionized calcium.",
                    },
                  ],
                  rationale: "Tingling with hyperventilation is a calcium story, not a potassium story.",
                  level: "application",
                },
                {
                  id: "s1-t3",
                  type: "mc",
                  stem: "A client with COPD has an arterial blood gas of pH 7.30, PaCO₂ 58 mm Hg and HCO₃⁻ 30 mEq/L. How should it be interpreted?",
                  options: [
                    {
                      t: "Respiratory acidosis, partially compensated",
                      ok: true,
                      why: "pH is low and PaCO₂ is high (opposite directions), so the cause is respiratory. HCO₃⁻ is raised, so the kidneys have begun to compensate, but pH is still out of range.",
                    },
                    {
                      t: "Respiratory acidosis, uncompensated",
                      ok: false,
                      why: "HCO₃⁻ is already above 26, so compensation has started.",
                    },
                    {
                      t: "Respiratory acidosis, fully compensated",
                      ok: false,
                      why: "Full compensation would bring pH back to 7.35–7.45.",
                    },
                    { t: "Metabolic alkalosis", ok: false, why: "The pH is acidotic, so this cannot be an alkalosis." },
                  ],
                  rationale: "Name the pH first, then the cause, then decide whether compensation is partial or full.",
                  level: "application",
                },
                {
                  id: "s1-t4",
                  type: "mc",
                  stem: "Which client is at greatest risk of hypokalemia?",
                  options: [
                    {
                      t: "A client taking furosemide who has had diarrhea for three days",
                      ok: true,
                      why: "Loop diuretics and diarrhea both remove potassium.",
                    },
                    {
                      t: "A client taking spironolactone",
                      ok: false,
                      why: "Spironolactone blocks aldosterone and spares potassium, so the risk is hyperkalemia.",
                    },
                    {
                      t: "A client with chronic kidney disease who missed dialysis",
                      ok: false,
                      why: "Missed dialysis lets potassium build up.",
                    },
                    {
                      t: "A client with DKA before insulin is started",
                      ok: false,
                      why: "Before treatment, serum potassium is usually normal or high because of the shift out of cells.",
                    },
                  ],
                  rationale: "Count the potassium losses: diuretic, diarrhea, vomiting, and insulin moving it into cells.",
                  level: "application",
                },
                {
                  id: "s1-t5",
                  type: "ms",
                  stem: "Which findings does the nurse expect in a client with hypocalcemia? <strong>Choose 3 answers.</strong>",
                  options: [
                    {
                      t: "Carpal spasm when a blood pressure cuff is inflated (Trousseau sign)",
                      ok: true,
                      why: "Low calcium makes nerves and muscles more excitable.",
                    },
                    {
                      t: "Facial twitching when the facial nerve is tapped (Chvostek sign)",
                      ok: true,
                      why: "Another sign of increased neuromuscular excitability.",
                    },
                    {
                      t: "Numbness and tingling around the mouth and in the fingers",
                      ok: true,
                      why: "Paresthesias are often the earliest symptom.",
                    },
                    { t: "Kidney stones", ok: false, why: "Kidney stones are linked to hypercalcemia." },
                    {
                      t: "A shortened QT interval",
                      ok: false,
                      why: "Hypocalcemia prolongs the QT interval; hypercalcemia shortens it.",
                    },
                  ],
                  rationale: "Low calcium means excitable nerves and muscles; high calcium means sluggish muscles and stones.",
                  level: "application",
                },
                {
                  id: "s1-t6",
                  type: "mc",
                  stem: "A client on peritoneal dialysis at home calls to report that the drained fluid is cloudy and his abdomen is tender. What does the nurse suspect?",
                  options: [
                    {
                      t: "Peritonitis",
                      ok: true,
                      why: "Cloudy effluent with abdominal pain is the classic sign of peritonitis, the main complication of peritoneal dialysis.",
                    },
                    {
                      t: "Fluid overload",
                      ok: false,
                      why: "Fluid overload shows as weight gain, edema and shortness of breath, not cloudy effluent.",
                    },
                    { t: "A normal finding after a long dwell", ok: false, why: "Effluent should be clear and pale yellow." },
                    { t: "Hyperkalemia", ok: false, why: "Hyperkalemia does not change how the effluent looks." },
                  ],
                  rationale: "Cloudy effluent needs to be reported and investigated.",
                  level: "application",
                },
                {
                  id: "s1-t7",
                  type: "mc",
                  stem: "A 4-year-old in day care catches far more colds than her parents. Which factor best explains this?",
                  options: [
                    {
                      t: "She has fewer memory cells because she has met fewer pathogens.",
                      ok: true,
                      why: "Each new virus needs a slower primary response. Her parents already have memory cells for many common viruses.",
                    },
                    {
                      t: "Children do not have innate immunity until school age.",
                      ok: false,
                      why: "Innate immunity is present from birth.",
                    },
                    {
                      t: "Children cannot make antibodies until they are 6.",
                      ok: false,
                      why: "Young children do make antibodies; they simply have a smaller library of memory.",
                    },
                    {
                      t: "She has too many naive T cells, which suppress her immune response.",
                      ok: false,
                      why: "Naive T cells are the raw material for new responses. They do not suppress immunity.",
                    },
                  ],
                  rationale: "Children's immunity is limited by experience; older adults' immunity is limited by supply.",
                  level: "application",
                },
                {
                  id: "s1-t8",
                  type: "mc",
                  stem: "A client's knee is red, warm and swollen the day after a sprain. Which process explains the swelling?",
                  options: [
                    {
                      t: "Capillaries become more permeable, so fluid and protein move into the tissue.",
                      ok: true,
                      why: "Inflammatory mediators open gaps between capillary cells, and fluid follows the leaked protein.",
                    },
                    {
                      t: "Arterioles constrict, trapping blood in the joint.",
                      ok: false,
                      why: "Inflammation causes vasodilation, which explains the redness and warmth.",
                    },
                    { t: "Blood flow to the area decreases.", ok: false, why: "Blood flow increases during inflammation." },
                    {
                      t: "Antibodies bind to the joint tissue.",
                      ok: false,
                      why: "A sprain triggers the innate inflammatory response, not an antibody response.",
                    },
                  ],
                  rationale: "Redness and heat come from vasodilation; swelling comes from permeability.",
                  level: "application",
                },
                {
                  id: "s1-t9",
                  type: "mc",
                  stem: "A 41-year-old pregnant client asks why her provider offered screening for Down syndrome. Which explanation is accurate?",
                  options: [
                    {
                      t: "The chance of nondisjunction during egg formation rises with maternal age.",
                      ok: true,
                      why: "Most trisomy 21 comes from chromosomes failing to separate in meiosis, which becomes more likely as maternal age rises.",
                    },
                    {
                      t: "Down syndrome is an autosomal recessive condition, and both parents must be carriers.",
                      ok: false,
                      why: "Down syndrome is a chromosomal condition, not a single-gene recessive one.",
                    },
                    {
                      t: "Down syndrome is caused by alcohol use in early pregnancy.",
                      ok: false,
                      why: "Alcohol causes fetal alcohol spectrum disorders, not trisomy 21.",
                    },
                    {
                      t: "Down syndrome is caused by low folic acid intake.",
                      ok: false,
                      why: "Low folate is linked to neural tube defects.",
                    },
                  ],
                  rationale: "An extra chromosome means nondisjunction, and maternal age is the main risk factor.",
                  level: "application",
                },
                {
                  id: "s1-t10",
                  type: "ms",
                  stem: "A newborn has a sac over the lower back that contains meninges and spinal nerve tissue. Which statements are accurate? <strong>Choose 2 answers.</strong>",
                  options: [
                    {
                      t: "This is myelomeningocele, the most severe form of spina bifida.",
                      ok: true,
                      why: "The sac contains spinal cord or nerve tissue, not just meninges.",
                    },
                    {
                      t: "It results from the neural tube failing to close early in pregnancy.",
                      ok: true,
                      why: "The neural tube normally closes about four weeks after conception.",
                    },
                    {
                      t: "It is caused by an extra chromosome.",
                      ok: false,
                      why: "Neural tube defects are multifactorial, with folate deficiency an important risk factor. They are not trisomies.",
                    },
                    {
                      t: "This presentation is typical of spina bifida occulta.",
                      ok: false,
                      why: "Occulta has no sac and may show only a dimple or tuft of hair.",
                    },
                    {
                      t: "The defect develops during the third trimester.",
                      ok: false,
                      why: "It develops in the first month of pregnancy.",
                    },
                  ],
                  rationale: "Sort spina bifida by what is in the sac: nothing (occulta), meninges only (meningocele), or nerve tissue too (myelomeningocele).",
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

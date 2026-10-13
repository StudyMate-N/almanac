import type { ASection } from "./author";

const T = "McCance & Huether, Pathophysiology";

export const s4: ASection = {
  id: "s4",
  num: 4,
  kind: "section",
  title: "Cardiovascular and Lymphatic Systems",
  blurb: "Arteries and veins, anemia and atherosclerosis, heart failure and valve disease; infection, autoimmunity, HIV, leukemia and lymphoma.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of cardiovascular and lymphatic disorders.",
  source: `${T}: Alterations of cardiovascular function; Alterations of hematologic function; Infection; Alterations in immunity; Alterations of leukocyte and lymphoid function.`,
  groups: [
    {
      id: "s4-intro-g",
      title: "Section Introduction",
      pages: [
        {
          id: "s4-intro",
          title: "Section Introduction",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The cardiovascular and lymphatic systems work as a pair. The heart and vessels deliver oxygen and nutrients to every cell. Each day about three liters of plasma leak out of the capillaries into the tissues; the lymphatic system collects it, filters it through lymph nodes where immune cells inspect it for invaders, and returns it to the blood. Key ideas in this section: <strong>perfusion</strong>, <strong>oxygenation</strong>, <strong>clotting</strong>, <strong>fluid balance</strong> and <strong>immunity</strong>.",
            },
            { t: "p", html: "Five patients run through this section." },
            { t: "case", title: "Edward, 56", html: "Edward has hypertension and high cholesterol and has smoked a pack a day for 34 years. He has just flown home from a 22-hour trip and his left calf is swollen and painful." },
            { t: "case", title: "Sophie, 62", html: "Sophie has rheumatoid arthritis and finished chemotherapy for breast cancer last year. She is short of breath climbing stairs, pale and tired all the time." },
            { t: "case", title: "Frank, 72", html: "Frank had a heart attack yesterday. Today he is more short of breath and has crackles at both lung bases." },
            { t: "case", title: "Susan, 34", html: "Susan cut her thumb on a kitchen knife three days ago. It is now red, hot, swollen and leaking yellow fluid, and there is a tender lump in her armpit." },
            { t: "case", title: "Amir, 6", html: "Amir has been pale and tired for a month, bruises easily and has had three infections in six weeks. His white cell count is very high." },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Describe disorders of arteries and veins, including hypertension, aneurysm and venous thromboembolism.",
                "Classify anemias and explain how atherosclerosis leads to coronary artery disease and myocardial infarction.",
                "Tell left-sided from right-sided heart failure and recognize pericarditis, endocarditis and valve disease.",
                "Explain how infection, inflammation, autoimmunity and immunodeficiency (including HIV) develop.",
                "Describe leukemias and lymphomas and why they raise the risk of infection.",
              ],
            },
          ],
        },
      ],
    },

    /* ───────────── Lesson 6 ───────────── */
    {
      id: "s4-l6",
      title: "Lesson 6: Cardiovascular System Pathophysiology",
      pages: [
        {
          id: "s4-l6-intro",
          title: "Lesson 6: Cardiovascular System Pathophysiology",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The cardiovascular system has three parts that can fail: the <strong>pump</strong> (the heart), the <strong>pipes</strong> (arteries and veins) and what flows through them (blood volume, red cells that carry oxygen, and platelets and clotting factors that seal leaks). Most of the disorders in this lesson are a failure of one of the three.",
            },
            {
              t: "table",
              head: ["Term", "Meaning"],
              rows: [
                ["Cardiac output (CO)", "Heart rate × stroke volume. About 4–8 L/min at rest."],
                ["Preload", "How much the ventricle is stretched by blood returning to it before it contracts (volume)."],
                ["Afterload", "The resistance the ventricle pushes against to eject blood (pressure)."],
                ["Blood pressure", "Cardiac output × systemic vascular resistance."],
                ["Perfusion", "Blood flow delivering oxygen to tissue. Shock is inadequate perfusion."],
              ],
            },
            { t: "h2", text: "In this lesson" },
            {
              t: "ul",
              items: [
                "6.1 Arteries and veins: hypertension, aneurysm, thrombosis and embolism.",
                "6.2 Perfusion and oxygenation: anemia, atherosclerosis and coronary artery disease.",
                "6.3 Heart function: heart failure, valve disease, pericarditis, endocarditis, dysrhythmias and shock.",
              ],
            },
          ],
        },
        {
          id: "s4-l6-1",
          title: "Lesson 6.1: Disorders of Arteries and Veins",
          shortTitle: "Lesson 6.1: Arteries and Veins",
          kind: "activity",
          blocks: [
            { t: "eq", text: "How do disorders of the arteries and veins develop, and what do they lead to?" },
            {
              t: "read",
              items: [
                { ref: "pp. 1061–1067: Diseases of the arteries", note: "Hypertension and its variations. Stop at orthostatic hypotension." },
                { ref: "pp. 1067–1068: Aneurysm" },
                { ref: "pp. 1060 and 1069: Thrombus formation in veins and arteries; embolism" },
              ],
            },
            { t: "h2", text: "Hypertension" },
            {
              t: "table",
              caption: "Adult categories used in US guidelines (ACC/AHA). Based on an average of readings on separate occasions.",
              head: ["Category", "Systolic", "", "Diastolic"],
              rows: [
                ["Normal", "Below 120", "and", "below 80"],
                ["Elevated", "120–129", "and", "below 80"],
                ["Stage 1 hypertension", "130–139", "or", "80–89"],
                ["Stage 2 hypertension", "140 or higher", "or", "90 or higher"],
              ],
            },
            {
              t: "ul",
              items: [
                "<strong>Primary (essential) hypertension</strong> is most cases. There is no single cause; genetics, sodium intake, obesity, inactivity, sympathetic overactivity, the RAAS and stiffening of arteries all contribute.",
                "<strong>Secondary hypertension</strong> has an identifiable cause: kidney disease, renal artery stenosis, hyperaldosteronism, pheochromocytoma, Cushing syndrome, sleep apnea, coarctation of the aorta, or drugs (NSAIDs, decongestants, stimulants, some contraceptives). Suspect it in sudden or severe hypertension, onset at a young age, or hypertension that resists treatment.",
                "<strong>Why it matters:</strong> years of high pressure thicken and damage arteries and make the heart work harder. Target organ damage includes left ventricular hypertrophy and heart failure, coronary artery disease, stroke, chronic kidney disease, retinopathy and aortic aneurysm or dissection. Most people have no symptoms until this damage appears.",
              ],
            },
            { t: "h2", text: "Aneurysm and dissection" },
            {
              t: "p",
              html: "An <strong>aneurysm</strong> is a localized bulging of a weakened arterial wall. A <em>true</em> aneurysm involves all three layers of the wall; a <em>false</em> aneurysm (pseudoaneurysm) is a contained leak outside the wall. Shapes are saccular (a pouch on one side) or fusiform (the whole circumference widens). Arteries carry blood under high pressure, which is why aneurysms are almost always arterial.",
            },
            {
              t: "ul",
              items: [
                "<strong>Abdominal aortic aneurysm:</strong> most common in men over 65 who smoke or have smoked, with hypertension and atherosclerosis. Often silent; may be felt as a pulsating abdominal mass. Rupture causes sudden severe abdominal or back pain and shock.",
                "<strong>Aortic dissection:</strong> a tear in the inner lining lets blood track between the layers. Sudden, severe, \"tearing\" chest pain that radiates to the back; blood pressure may differ between the arms. An emergency.",
              ],
            },
            { t: "h2", text: "Thrombus and embolus" },
            {
              t: "p",
              html: "A <strong>thrombus</strong> is a clot attached to a vessel wall. An <strong>embolus</strong> is anything that travels in the blood and lodges downstream: a broken-off clot, fat, air or amniotic fluid. Three factors promote venous clots (<strong>Virchow triad</strong>):",
            },
            {
              t: "table",
              head: ["Factor", "Examples"],
              rows: [
                ["Stasis of blood flow", "Long flights or car trips, bed rest, paralysis, heart failure, atrial fibrillation"],
                ["Injury to the vessel wall", "Surgery (especially hip and knee), trauma, IV catheters"],
                ["Hypercoagulability", "Cancer, pregnancy, estrogen (contraceptives, hormone therapy), smoking, inherited clotting disorders, dehydration"],
              ],
            },
            {
              t: "p",
              html: "Slow flow lets clotting factors build up, so clots form more readily in veins. A <strong>deep vein thrombosis (DVT)</strong> usually forms in the calf or thigh: one-sided swelling, pain, warmth and redness. Its most serious complication is a <strong>pulmonary embolism</strong> when part of the clot travels through the right heart to the lungs. Arterial clots form on ruptured atherosclerotic plaque and cause heart attacks, strokes and limb ischemia.",
            },
            {
              t: "table",
              head: ["", "Peripheral artery disease", "Chronic venous insufficiency"],
              rows: [
                ["Problem", "Atherosclerosis narrows leg arteries: not enough blood in", "Damaged vein valves: blood pools, not enough out"],
                ["Pain", "Cramping with walking, relieved by rest (claudication); pain at rest when severe", "Aching, heaviness, worse with standing; relieved by elevation"],
                ["Skin", "Cool, pale, shiny, hairless; weak or absent pulses", "Edema, brown discoloration, thickened skin"],
                ["Ulcers", "Toes and pressure points; painful, punched-out, pale base", "Above the inner ankle; shallow, moist, irregular"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s4-c1",
                type: "ms",
                stem: "Edward (56) has a swollen, painful left calf after a 22-hour flight. He smokes, and has hypertension and high cholesterol. Which factors put him at risk of a deep vein thrombosis? <strong>Choose 2 answers.</strong>",
                options: [
                  { t: "Hours of sitting still on the flight", ok: true, why: "Prolonged immobility causes venous stasis." },
                  { t: "Cigarette smoking", ok: true, why: "Smoking makes blood more likely to clot and damages the vessel lining." },
                  { t: "Drinking water regularly during the flight", ok: false, why: "Staying hydrated lowers clot risk; dehydration raises it." },
                  { t: "Taking a daily aspirin", ok: false, why: "Aspirin does not raise clot risk." },
                  { t: "Recent weight loss from exercise", ok: false, why: "Activity lowers risk." },
                ],
                rationale: "Map each risk to Virchow triad: stasis (the flight) and hypercoagulability and wall injury (smoking). His age adds risk too.",
              },
            },
            {
              t: "q",
              q: {
                id: "s4-c2",
                type: "mc",
                stem: "Two days later Edward suddenly becomes short of breath with sharp chest pain when he breathes in. His heart rate is 118 and oxygen saturation 89%. What is the most likely explanation?",
                options: [
                  { t: "Pulmonary embolism from the leg clot", ok: true, why: "Sudden dyspnea, pleuritic chest pain, tachycardia and hypoxemia after a DVT is the classic picture." },
                  { t: "Aortic dissection from his hypertension", ok: false, why: "Dissection causes tearing pain radiating to the back, not hypoxemia after a DVT." },
                  { t: "A hypertensive emergency", ok: false, why: "Nothing here points to dangerously high pressure." },
                  { t: "Worsening peripheral artery disease", ok: false, why: "PAD causes leg pain with walking, not sudden breathlessness." },
                ],
                rationale: "A DVT's most dangerous complication is a pulmonary embolism. Watch for it in any client with a clot in a leg vein.",
              },
            },
          ],
        },
        {
          id: "s4-l6-2",
          title: "Lesson 6.2: Perfusion and Oxygenation: Anemia and Coronary Disease",
          shortTitle: "Lesson 6.2: Anemia and Coronary Disease",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What happens when the blood cannot carry enough oxygen, or the coronary arteries cannot deliver it?" },
            {
              t: "read",
              items: [
                { ref: "pp. 925–939: Anemia" },
                { ref: "pp. 1069–1073: Atherosclerosis" },
                { ref: "pp. 1028–1034: Structures that control blood flow, and coronary circulation" },
              ],
            },
            { t: "h2", text: "Anemia" },
            {
              t: "p",
              html: "Anemia is a fall in hemoglobin, so less oxygen reaches the tissues. Whatever the cause, expect <strong>fatigue, pallor, shortness of breath on exertion, a fast heart rate</strong> and, when severe, chest pain or heart failure. The size of the red cells (mean corpuscular volume, MCV) is the first clue to the cause.",
            },
            {
              t: "table",
              head: ["Type", "Cell size", "Cause", "Clues"],
              rows: [
                ["Iron deficiency", "Small (microcytic), pale", "Blood loss (heavy periods, GI bleeding), poor intake, pregnancy", "Low ferritin; spoon-shaped nails, cravings for ice (pica). In an adult man or postmenopausal woman, look for a GI bleed"],
                ["Vitamin B12 deficiency (including pernicious anemia)", "Large (macrocytic)", "Pernicious anemia: autoimmune loss of intrinsic factor, so B12 cannot be absorbed; also gastric surgery, vegan diet, metformin", "Smooth sore tongue; <strong>neurologic signs</strong>: numbness, poor balance, memory problems"],
                ["Folate deficiency", "Large (macrocytic)", "Poor diet, alcohol use disorder, pregnancy, some drugs", "Like B12 deficiency but <strong>without</strong> neurologic signs"],
                ["Anemia of chronic disease (inflammation)", "Usually normal, sometimes small", "Chronic inflammation, infection or cancer (hepcidin traps iron); chronic kidney disease (low erythropoietin)", "Normal or high ferritin with low serum iron"],
                ["Aplastic anemia", "Normal", "Marrow failure: chemotherapy, radiation, drugs, toxins, autoimmune", "Low red cells, white cells and platelets together (pancytopenia)"],
                ["Hemolytic anemia", "Normal", "Red cells destroyed early: sickle cell disease, autoimmune, transfusion reaction, G6PD deficiency", "Jaundice, high bilirubin, high reticulocyte count"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s4-c3",
                type: "mc",
                stem: "Sophie (62) has rheumatoid arthritis and finished chemotherapy last year. She is pale, tired and breathless on stairs. Hemoglobin is low, MCV normal, serum iron low and ferritin high. Which type of anemia is most likely?",
                options: [
                  { t: "Anemia of chronic disease (inflammation)", ok: true, why: "Chronic inflammation from RA and cancer traps iron in storage: low serum iron with normal or high ferritin." },
                  { t: "Iron deficiency anemia", ok: false, why: "Iron deficiency gives a low ferritin and small cells." },
                  { t: "Pernicious anemia", ok: false, why: "Pernicious anemia produces large cells and often neurologic signs." },
                  { t: "Hemolytic anemia", ok: false, why: "Hemolysis causes jaundice and a high reticulocyte count; nothing here suggests it." },
                ],
                rationale: "Ferritin separates the two common iron pictures: low in iron deficiency, normal or high in chronic disease.",
              },
            },
            { t: "h2", text: "Atherosclerosis: how a plaque forms" },
            {
              t: "ol",
              items: [
                "<strong>Endothelial injury</strong> from hypertension, smoking, high LDL cholesterol, diabetes or inflammation.",
                "LDL enters the vessel wall and is oxidized. Monocytes follow, become macrophages and swallow it, turning into <strong>foam cells</strong>. These form a <strong>fatty streak</strong>.",
                "Smooth muscle cells migrate in and lay down collagen: a <strong>fibrous plaque</strong> with a lipid core under a fibrous cap. The lumen narrows.",
                "An unstable plaque with a thin cap can <strong>rupture</strong>. Platelets aggregate on the exposed core and a thrombus forms, partly or completely blocking the artery.",
              ],
            },
            { t: "h2", text: "Coronary artery disease and myocardial infarction" },
            {
              t: "table",
              head: ["Condition", "What is happening", "Pain pattern"],
              rows: [
                ["Stable angina", "A fixed narrowing limits flow when demand rises", "Predictable chest pressure with exertion or stress, relieved by rest or nitroglycerin within minutes"],
                ["Unstable angina", "Plaque disruption with a partial clot; no heart muscle death yet", "New, worsening or at-rest pain; an emergency (acute coronary syndrome)"],
                ["Myocardial infarction (MI)", "Prolonged ischemia kills heart muscle; troponin rises", "Severe pressure lasting more than 20 minutes, not relieved by rest or nitroglycerin, often with sweating, nausea and breathlessness"],
              ],
            },
            {
              t: "callout",
              title: "Variation: who presents atypically",
              html: "Women, older adults and people with diabetes are more likely to present with fatigue, breathlessness, nausea, indigestion, or jaw, back or arm pain rather than classic crushing chest pain. Diabetic neuropathy can blunt pain altogether. These are the clients most at risk of a missed MI.",
            },
            {
              t: "q",
              q: {
                id: "s4-c4",
                type: "ms",
                stem: "Which processes are involved in the development of atherosclerosis? <strong>Choose 3 answers.</strong>",
                options: [
                  { t: "Injury to the endothelial lining of the artery", ok: true, why: "Endothelial injury starts the process." },
                  { t: "Macrophages engulfing oxidized LDL to form foam cells", ok: true, why: "Foam cells make up the fatty streak." },
                  { t: "Smooth muscle cells forming a fibrous cap over a lipid core", ok: true, why: "This turns a fatty streak into a fibrous plaque." },
                  { t: "Bacteria colonizing the inside of the artery", ok: false, why: "Atherosclerosis is an inflammatory process, but it is not an infection of the artery." },
                  { t: "Weakening of all three layers of a vein wall", ok: false, why: "Atherosclerosis affects arteries, and wall weakening describes an aneurysm." },
                ],
                rationale: "Injury, fat, inflammation, fibrous cap, rupture, clot.",
              },
            },
          ],
        },
        {
          id: "s4-l6-3",
          title: "Lesson 6.3: Disorders of Heart Function",
          shortTitle: "Lesson 6.3: Heart Failure and Valve Disease",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What happens when the heart's muscle, valves, lining or rhythm fail, and what can follow a heart attack?" },
            {
              t: "read",
              items: [
                { ref: "p. 1086: Pericarditis; pp. 1095–1096: Infective endocarditis" },
                { ref: "pp. 1088–1093: Disorders of the endocardium: valvular dysfunction" },
                { ref: "pp. 1096–1101: Manifestations of heart disease: heart failure" },
              ],
            },
            { t: "video", clip: "foundations-04", note: "The heart-failure case from the course video. Watch it now, then use the table below to sort left-sided from right-sided signs." },
            { t: "h2", text: "Heart failure" },
            {
              t: "p",
              html: "Heart failure means the heart cannot pump enough blood to meet the body's needs, or can only do so at high filling pressures. Blood backs up behind the failing ventricle. The body responds by activating the sympathetic nervous system and the RAAS, which hold on to salt and water and constrict vessels. That helps briefly but adds volume and afterload, so heart failure tends to worsen itself.",
            },
            {
              t: "table",
              head: ["", "Left-sided failure", "Right-sided failure"],
              rows: [
                ["Blood backs up into", "The lungs", "The body's veins"],
                ["Signs", "Breathlessness, orthopnea, waking breathless at night, crackles, cough (sometimes pink frothy sputum), S3, fatigue, confusion", "Jugular vein distension, dependent edema (ankles, sacrum), weight gain, enlarged liver, ascites, poor appetite"],
                ["Common causes", "Myocardial infarction, hypertension, aortic or mitral valve disease, cardiomyopathy", "Left-sided failure (the most common cause); lung disease causing pulmonary hypertension (cor pulmonale); right ventricular MI"],
              ],
            },
            {
              t: "ul",
              items: [
                "<strong>Reduced ejection fraction (systolic failure):</strong> a weak ventricle that cannot contract well, as after an MI or in dilated cardiomyopathy.",
                "<strong>Preserved ejection fraction (diastolic failure):</strong> a stiff, thick ventricle that cannot relax and fill, as in long-standing hypertension and older age.",
                "<strong>BNP</strong> (B-type natriuretic peptide) is released by stretched ventricles and rises in heart failure.",
                "<strong>Dilated cardiomyopathy</strong> enlarges and weakens the ventricles. It can be inherited (familial), often autosomal dominant, so first-degree relatives may be screened.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s4-c5",
                type: "mc",
                stem: "Frank (72) had an anterior MI yesterday. Today he is breathless lying flat, has crackles at both lung bases and his oxygen saturation has fallen. What is the most likely explanation?",
                options: [
                  { t: "Left-sided heart failure", ok: true, why: "A weakened left ventricle backs blood up into the lungs, causing pulmonary congestion." },
                  { t: "Right-sided heart failure", ok: false, why: "Right-sided failure causes edema and jugular distension, not crackles and orthopnea." },
                  { t: "Pericarditis", ok: false, why: "Pericarditis causes positional chest pain and a rub, not pulmonary congestion." },
                  { t: "Pneumonia", ok: false, why: "Possible, but on the day after an MI with orthopnea, heart failure is far more likely." },
                ],
                rationale: "Left fails, lungs fill. Right fails, the body fills.",
              },
            },
            { t: "h2", text: "Valves" },
            {
              t: "table",
              head: ["Problem", "What goes wrong", "Consequence"],
              rows: [
                ["Stenosis", "The valve is narrowed and does not open fully", "Pressure overload: the chamber behind it must push harder and thickens (hypertrophy)"],
                ["Regurgitation (insufficiency)", "The valve does not close fully, so blood leaks backward", "Volume overload: the chamber dilates"],
              ],
            },
            {
              t: "ul",
              items: [
                "<strong>Aortic stenosis</strong> (usually age-related calcification in older adults): exertional chest pain, fainting and heart failure; a harsh systolic murmur.",
                "<strong>Mitral stenosis</strong> (often from rheumatic heart disease): the left atrium enlarges, which leads to atrial fibrillation and clots.",
                "<strong>Mitral regurgitation</strong>: can appear suddenly after an MI if a papillary muscle is damaged, causing acute pulmonary edema.",
              ],
            },
            { t: "h2", text: "The heart's lining and sac" },
            {
              t: "table",
              head: ["", "Pericarditis", "Infective endocarditis"],
              rows: [
                ["What", "Inflammation of the pericardial sac", "Infection of the endocardium, usually the valves"],
                ["Causes", "Viral infection, after an MI (early, or weeks later as Dressler syndrome), kidney failure, autoimmune disease", "Bacteria in the blood: injection drug use, prosthetic or damaged valves, dental or invasive procedures"],
                ["Signs", "Sharp chest pain worse lying back or breathing in, eased by sitting forward; friction rub", "Fever, new murmur, small hemorrhages under the nails (splinter), painful finger nodes, painless palm spots, emboli to brain, kidney or spleen"],
                ["Danger", "Fluid can build up and compress the heart (cardiac tamponade: low BP, distended neck veins, muffled heart sounds)", "Valve destruction, heart failure, septic emboli"],
              ],
            },
            { t: "h2", text: "After a heart attack" },
            {
              t: "ul",
              items: [
                "<strong>Dysrhythmias</strong> are the most common cause of death in the first hours. Irregular rhythms matter because they reduce cardiac output (and so perfusion), can deteriorate into ventricular fibrillation and sudden death, and, in atrial fibrillation, let clots form in the atria that can travel to the brain.",
                "<strong>Heart failure</strong> and <strong>cardiogenic shock</strong> when a large area of muscle is lost.",
                "<strong>Pericarditis</strong>, papillary muscle rupture (acute mitral regurgitation), ventricular wall rupture, ventricular aneurysm and mural thrombus.",
              ],
            },
            { t: "h2", text: "Shock: inadequate perfusion" },
            {
              t: "table",
              head: ["Type", "Mechanism", "Examples"],
              rows: [
                ["Hypovolemic", "Not enough volume", "Hemorrhage, burns, severe vomiting and diarrhea"],
                ["Cardiogenic", "The pump fails", "Large MI, severe valve failure, dysrhythmia"],
                ["Distributive", "Vessels dilate and leak, so normal volume is not enough", "Sepsis, anaphylaxis, spinal cord injury (neurogenic)"],
                ["Obstructive", "Flow is blocked", "Massive pulmonary embolism, cardiac tamponade, tension pneumothorax"],
              ],
            },
            {
              t: "p",
              html: "Common signs: fast heart rate (except neurogenic shock, which slows it), low or falling blood pressure, cool clammy skin (early septic shock may be warm), low urine output, confusion and a rising lactate.",
            },
          ],
        },
        {
          id: "s4-l6-sum",
          title: "Lesson 6: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Take a moment to review" },
            {
              t: "ul",
              items: [
                "Hypertension: stage 1 is 130–139 or 80–89; stage 2 is 140/90 or higher. Most is primary; suspect secondary when it is sudden, severe, young-onset or resistant.",
                "An aneurysm is a bulging, weakened artery wall; rupture causes sudden pain and shock. Dissection causes tearing chest pain to the back.",
                "Virchow triad: stasis, vessel injury, hypercoagulability. A DVT's main danger is pulmonary embolism.",
                "Anemia: MCV first. Small = iron deficiency (low ferritin). Large = B12 (with neurologic signs) or folate. Chronic disease: low iron, normal or high ferritin. Aplastic: pancytopenia. Hemolytic: jaundice and high reticulocytes.",
                "Atherosclerosis: endothelial injury → foam cells and fatty streak → fibrous plaque → rupture and thrombus.",
                "Stable angina is relieved by rest; unstable angina and MI are emergencies. Women, older adults and people with diabetes often present atypically.",
                "Left heart failure fills the lungs; right heart failure fills the body. The commonest cause of right failure is left failure.",
                "Stenosis = will not open (pressure overload); regurgitation = will not close (volume overload).",
                "Pericarditis pain eases sitting forward. Endocarditis: fever plus a new murmur.",
                "Shock types: hypovolemic, cardiogenic, distributive, obstructive.",
              ],
            },
            {
              t: "cards",
              id: "fc-l6",
              title: "Lesson 6 flashcards",
              cards: [
                ["Stage 2 hypertension", "140 systolic or higher, or 90 diastolic or higher"],
                ["Aneurysm", "Localized outward bulge of a weakened arterial wall"],
                ["Virchow triad", "Stasis, endothelial injury, hypercoagulability"],
                ["Most serious complication of DVT", "Pulmonary embolism"],
                ["Microcytic anemia with low ferritin", "Iron deficiency"],
                ["Macrocytic anemia with neurologic signs", "Vitamin B12 deficiency (e.g., pernicious anemia)"],
                ["Low serum iron, high ferritin", "Anemia of chronic disease (inflammation)"],
                ["Foam cell", "Macrophage full of oxidized LDL; forms the fatty streak"],
                ["Left-sided heart failure signs", "Dyspnea, orthopnea, crackles, cough"],
                ["Right-sided heart failure signs", "JVD, peripheral edema, hepatomegaly, weight gain"],
                ["Stenosis vs regurgitation", "Will not open (pressure load) vs will not close (volume load)"],
                ["Infective endocarditis", "Infection of the heart lining and valves: fever, new murmur, emboli"],
                ["Why a dysrhythmia is dangerous", "Lower cardiac output, risk of sudden death, and clot formation (AF → stroke)"],
              ],
            },
          ],
        },
        {
          id: "s4-l6-quiz",
          title: "Lesson 6: Quiz",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on arteries and veins, anemia, atherosclerosis and heart function." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s4-q1",
                  type: "mc",
                  stem: "A 68-year-old man who smoked for 40 years has a pulsating mass in his abdomen found on a routine exam. He has no pain. What is he most likely experiencing?",
                  options: [
                    { t: "Abdominal aortic aneurysm", ok: true, why: "A pulsatile abdominal mass in an older male smoker suggests an AAA, often silent until it grows or ruptures." },
                    { t: "Aortic dissection", ok: false, why: "Dissection causes sudden severe tearing pain." },
                    { t: "Deep vein thrombosis", ok: false, why: "DVT affects leg veins and does not pulsate." },
                    { t: "Peripheral artery disease", ok: false, why: "PAD causes leg pain with walking." },
                  ],
                  rationale: "Older male + smoking + pulsatile mass = abdominal aortic aneurysm.",
                },
                {
                  id: "s4-q2",
                  type: "mc",
                  stem: "A client reports calf pain that comes on after walking two blocks and goes away after a few minutes of rest. His feet are cool and hairless with weak pulses. Which disorder is the most likely cause?",
                  options: [
                    { t: "Peripheral artery disease", ok: true, why: "Claudication relieved by rest and signs of poor arterial supply point to PAD." },
                    { t: "Chronic venous insufficiency", ok: false, why: "Venous disease causes aching and swelling relieved by elevation, with warm brown skin." },
                    { t: "Deep vein thrombosis", ok: false, why: "DVT causes constant swelling and pain, not a walk-rest pattern." },
                    { t: "Peripheral neuropathy", ok: false, why: "Neuropathy causes numbness and burning, and pulses are normal." },
                  ],
                  rationale: "Pain with walking that stops with rest is the arteries failing to meet demand.",
                },
                {
                  id: "s4-q3",
                  type: "mc",
                  stem: "A 70-year-old has fatigue, a smooth sore tongue, numb feet and unsteady balance. Her red cells are large. Which type of anemia is she most likely experiencing?",
                  options: [
                    { t: "Vitamin B12 deficiency (pernicious) anemia", ok: true, why: "Macrocytic anemia with neurologic signs points to B12 deficiency; pernicious anemia is a common cause in older adults." },
                    { t: "Folate deficiency anemia", ok: false, why: "Folate deficiency is macrocytic but does not cause neurologic signs." },
                    { t: "Iron deficiency anemia", ok: false, why: "Iron deficiency produces small cells." },
                    { t: "Aplastic anemia", ok: false, why: "Aplastic anemia lowers all cell lines and the cells are normal-sized." },
                  ],
                  rationale: "Large cells plus nerves = B12.",
                },
                {
                  id: "s4-q4",
                  type: "mc",
                  stem: "A client asks what stenosis of his aortic valve means. What does the provider explain?",
                  options: [
                    { t: "\"The valve is narrowed and doesn't open fully, so your heart must push harder.\"", ok: true, why: "Stenosis restricts forward flow and creates a pressure load on the ventricle." },
                    { t: "\"The valve doesn't close fully, so some blood leaks backward with each beat.\"", ok: false, why: "That is regurgitation." },
                    { t: "\"The valve is infected with bacteria that have grown on it.\"", ok: false, why: "That is endocarditis." },
                    { t: "\"The sac around your heart is inflamed and holding fluid.\"", ok: false, why: "That is pericarditis." },
                  ],
                  rationale: "Stenosis: won't open. Regurgitation: won't close.",
                },
                {
                  id: "s4-q5",
                  type: "mc",
                  stem: "A client with long-standing heart failure has distended neck veins, swollen ankles, a 3 kg weight gain this week and an enlarged liver. What is the client experiencing?",
                  options: [
                    { t: "Right-sided heart failure", ok: true, why: "Systemic venous congestion causes JVD, edema, weight gain and hepatomegaly." },
                    { t: "Left-sided heart failure", ok: false, why: "Left-sided failure congests the lungs: dyspnea, orthopnea, crackles." },
                    { t: "Pericarditis", ok: false, why: "Pericarditis causes positional chest pain and a rub." },
                    { t: "Hypovolemic shock from hidden bleeding", ok: false, why: "These are signs of too much volume, not too little." },
                  ],
                  rationale: "Right side fails, the body's veins fill.",
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────── Lesson 7 ───────────── */
    {
      id: "s4-l7",
      title: "Lesson 7: Lymphatic System Pathophysiology",
      pages: [
        {
          id: "s4-l7-intro",
          title: "Lesson 7: Lymphatic System Pathophysiology",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The lymphatic system has two jobs. It is a <strong>drainage system</strong>, returning the fluid and protein that leak from capillaries to the blood. It is also part of the <strong>immune system</strong>: lymph passes through lymph nodes, where lymphocytes and macrophages filter out pathogens, and lymphocytes are made and trained in the bone marrow and thymus. Key ideas in this lesson: inflammation, infection and immunity, and what happens when the lymphocytes themselves turn cancerous.",
            },
            {
              t: "table",
              head: ["Finding", "Meaning"],
              rows: [
                ["Lymphadenitis", "Inflamed, tender, enlarged lymph nodes draining an infected area"],
                ["Lymphangitis", "Infection spreading along lymph vessels: red streaks running from a wound toward the nearest nodes"],
                ["Lymphedema", "Protein-rich swelling when lymph drainage is blocked: after node removal or radiation, tumor, or parasitic infection (filariasis). It can become firm and non-pitting and raises the risk of cellulitis"],
                ["Painless, firm, growing nodes", "Raise concern for lymphoma or metastatic cancer rather than infection"],
              ],
            },
            { t: "h2", text: "In this lesson" },
            {
              t: "ul",
              items: [
                "7.1 Infection and inflammation.",
                "7.2 Autoimmunity and immunodeficiency, including HIV.",
                "7.3 Leukemias and lymphomas.",
              ],
            },
          ],
        },
        {
          id: "s4-l7-1",
          title: "Lesson 7.1: Infection and Inflammation",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What role does the lymphatic system play in inflammation, infection and immunity?" },
            {
              t: "read",
              items: [
                { ref: "pp. 281–284: Infection" },
                { ref: "pp. 284–287: Mechanisms of bacterial invasion and tissue damage; pp. 287–301: Viral infection; pp. 303–304: Fungal and parasitic infection" },
              ],
            },
            { t: "case", title: "Susan, 34", html: "Susan cut her left thumb three days ago. It is now red, hot and swollen, with yellow fluid leaking from the cut. A red streak runs up her forearm and there is a tender lump in her armpit. Temperature 38.4 °C (101.1 °F). White cell count 15,800/mm³ with increased neutrophils and bands." },
            { t: "h2", text: "Infectious or communicable?" },
            {
              t: "p",
              html: "An <strong>infectious</strong> disease is caused by a pathogen. A <strong>communicable</strong> disease is an infectious disease that can spread from one person to another. All communicable diseases are infectious, but not all infectious diseases are communicable. Influenza spreads person to person by respiratory droplets, so it is communicable. Lyme disease is infectious but spreads only through tick bites, not between people. Tetanus is infectious but not communicable.",
            },
            { t: "h2", text: "How pathogens cause damage" },
            {
              t: "table",
              head: ["Pathogen", "How it harms", "Notes"],
              rows: [
                ["Bacteria", "Invade tissue and release toxins. <strong>Exotoxins</strong> are proteins secreted by bacteria (tetanus, cholera). <strong>Endotoxin</strong> is part of the gram-negative cell wall and triggers fever and septic shock.", "Treated with antibiotics; resistance spreads by mutation and gene transfer"],
                ["Viruses", "Must enter a host cell and use its machinery to copy themselves; damage or kill the cell, and the immune response adds damage", "Antibiotics do not work. Some stay latent (herpes, varicella)"],
                ["Fungi", "Usually superficial; invasive in immunosuppressed people", "Candida, Aspergillus, Pneumocystis"],
                ["Parasites", "Protozoa and worms", "Malaria, giardia, filariasis"],
              ],
            },
            { t: "h2", text: "Reading the white cell count" },
            {
              t: "table",
              head: ["Finding", "Usual meaning"],
              rows: [
                ["Leukocytosis (WBC above about 11,000/mm³)", "Infection, inflammation, stress, steroids, or leukemia"],
                ["Neutrophilia with more bands (\"left shift\")", "Acute bacterial infection: the marrow releases immature neutrophils"],
                ["Lymphocytosis", "Viral infection (or chronic lymphocytic leukemia)"],
                ["Eosinophilia", "Allergy or parasitic infection"],
                ["Leukopenia / neutropenia", "Marrow suppression (chemotherapy), overwhelming infection, some viral infections; high risk of infection"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s4-c6",
                type: "ms",
                stem: "Which statements explain Susan's findings? <strong>Choose 3 answers.</strong>",
                options: [
                  { t: "Vasodilation and leaky capillaries cause the redness, heat and swelling", ok: true, why: "These are the vascular changes of acute inflammation." },
                  { t: "The yellow fluid is pus: neutrophils, dead tissue and bacteria", ok: true, why: "Pus is the debris of the neutrophils' fight." },
                  { t: "The red streak and tender armpit node show infection spreading through the lymphatics", ok: true, why: "Lymphangitis and lymphadenitis show the lymphatic system draining and filtering the infection." },
                  { t: "The raised white count with more bands suggests a viral infection", ok: false, why: "A left shift points to an acute bacterial infection." },
                  { t: "Her infection spreads to others mainly by respiratory droplets", ok: false, why: "Wound infections spread by direct contact with drainage, not droplets; covering the wound and hand hygiene prevent spread." },
                ],
                rationale: "Inflammation explains the local signs; the lymphatics explain the streak and the node; the left shift points to bacteria.",
              },
            },
            {
              t: "callout",
              title: "Lyme disease",
              html: "Caused by the bacterium <em>Borrelia burgdorferi</em>, carried by blacklegged (deer) ticks. Early: an expanding red rash, often with central clearing (erythema migrans), with fever and aches. Later, if untreated: arthritis (often the knee), facial nerve palsy, meningitis or heart block. It is infectious but not spread person to person.",
            },
          ],
        },
        {
          id: "s4-l7-2",
          title: "Lesson 7.2: Autoimmunity and Immunodeficiency",
          shortTitle: "Lesson 7.2: Lupus and HIV",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What happens when the immune system attacks the body, or cannot defend it?" },
            {
              t: "read",
              items: [
                { ref: "pp. 266–267: Autoimmune disease: systemic lupus erythematosus" },
                { ref: "pp. 291–297: Human immunodeficiency virus and acquired immunodeficiency syndrome" },
              ],
            },
            { t: "h2", text: "Autoimmunity: systemic lupus erythematosus" },
            {
              t: "p",
              html: "In autoimmune disease the immune system loses tolerance to the body's own antigens. In <strong>SLE</strong>, the body makes antibodies against nuclear material (antinuclear antibodies, ANA; anti-double-stranded DNA is more specific). Antigen-antibody complexes deposit in tissues and trigger inflammation, a type III hypersensitivity, so many organs can be involved.",
            },
            {
              t: "ul",
              items: [
                "Butterfly (malar) rash across the cheeks and nose, made worse by sunlight",
                "Painful joints, fatigue, fever, weight loss",
                "Kidney inflammation (lupus nephritis): protein and blood in the urine",
                "Inflammation of the pleura and pericardium (serositis)",
                "Low blood counts, mouth ulcers, hair loss, seizures or psychosis",
                "<strong>Variation:</strong> about nine of ten people with SLE are women, usually diagnosed between 15 and 45. It is more common and often more severe in Black, Hispanic and Asian women. Flares can be triggered by sunlight, infection, stress and pregnancy.",
              ],
            },
            { t: "h2", text: "Immunodeficiency: HIV" },
            {
              t: "p",
              html: "Primary immunodeficiencies are inherited. Secondary (acquired) immunodeficiency is far more common: from HIV, chemotherapy, long-term steroids, malnutrition, diabetes, cancers of the immune system and older age. The course video walks through HIV step by step in three clips.",
            },
            { t: "video", clip: "foundations-09" },
            { t: "video", clip: "foundations-10" },
            { t: "video", clip: "foundations-11" },
            {
              t: "table",
              head: ["Step", "What happens"],
              rows: [
                ["Attachment and entry", "The viral envelope protein gp120 binds the CD4 receptor and a co-receptor (CCR5 or CXCR4) on helper T cells, macrophages and dendritic cells; the envelope fuses with the cell membrane."],
                ["Reverse transcription", "Reverse transcriptase copies the viral RNA genome into DNA. It is error-prone, so the virus mutates quickly and resistance develops."],
                ["Integration", "Integrase inserts viral DNA into the host chromosome, where it can stay latent for years."],
                ["Production and maturation", "The cell makes viral proteins; protease cuts long viral polyproteins into working proteins so new virus particles mature and bud off."],
              ],
            },
            {
              t: "p",
              html: "<strong>Why losing CD4 cells matters:</strong> helper T cells coordinate both arms of adaptive immunity. They help B cells make antibodies (humoral immunity) and activate cytotoxic T cells and macrophages (cell-mediated immunity). As CD4 counts fall, the client becomes vulnerable to opportunistic infections and some cancers. AIDS is diagnosed when the CD4 count falls below 200 cells/mm³ or an AIDS-defining illness appears, such as <em>Pneumocystis</em> pneumonia or Kaposi sarcoma.",
            },
            {
              t: "ul",
              items: [
                "<strong>Transmission:</strong> blood (shared needles, transfusion), sexual contact, and from parent to child during pregnancy, birth or breastfeeding.",
                "<strong>Treatment:</strong> combination antiretroviral therapy blocks several steps at once. With sustained viral suppression, people with HIV have a near-normal life expectancy and do not transmit the virus sexually.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s4-c7",
                type: "mc",
                stem: "A client newly diagnosed with HIV asks why the virus weakens the whole immune system. What is the best response from the provider?",
                options: [
                  { t: "\"HIV destroys helper T cells, which direct both antibody production and the cells that kill infected cells.\"", ok: true, why: "CD4 helper T cells coordinate humoral and cell-mediated immunity, so losing them weakens both." },
                  { t: "\"HIV destroys red blood cells, so your tissues get less oxygen.\"", ok: false, why: "HIV targets CD4 cells, not red cells." },
                  { t: "\"HIV attacks your skin and mucous membranes, so germs get in more easily.\"", ok: false, why: "The barriers are not the main target." },
                  { t: "\"HIV makes your immune system attack your own organs.\"", ok: false, why: "That describes autoimmunity." },
                ],
                rationale: "Lose the coordinator, lose the response.",
              },
            },
          ],
        },
        {
          id: "s4-l7-3",
          title: "Lesson 7.3: Leukemias and Lymphomas",
          kind: "activity",
          blocks: [
            { t: "eq", text: "How do cancers of the white cells develop, and why do they raise the risk of infection?" },
            { t: "read", items: [{ ref: "pp. 947–963: Lymphoid neoplasms: leukemias and lymphomas" }] },
            { t: "case", title: "Amir, 6", html: "Amir has been pale and tired for a month. He bruises easily, has tiny red spots on his legs and has had three infections in six weeks. His legs ache at night. WBC 58,000/mm³ with many blast cells; hemoglobin 7.9 g/dL; platelets 22,000/mm³." },
            { t: "h2", text: "Leukemia" },
            {
              t: "p",
              html: "Leukemia is a malignant, uncontrolled proliferation of one line of white cell precursors in the bone marrow. The cancer cells crowd out normal marrow, so three things fail at once:",
            },
            {
              t: "table",
              head: ["Too few…", "Leads to"],
              rows: [
                ["Red cells", "Anemia: fatigue, pallor, breathlessness"],
                ["Platelets", "Bleeding: bruising, petechiae, nosebleeds, bleeding gums"],
                ["Functional white cells", "Infection, even when the total white count is very high, because the leukemic cells are immature and do not fight infection"],
              ],
            },
            {
              t: "p",
              html: "Other signs: bone pain from an expanding marrow, swollen lymph nodes, an enlarged liver and spleen, fever and weight loss.",
            },
            {
              t: "table",
              head: ["Type", "Who", "Features"],
              rows: [
                ["Acute lymphoblastic leukemia (ALL)", "The most common childhood cancer; peak age 2–5", "Rapid onset; many lymphoblasts; often responds well to treatment in children"],
                ["Acute myeloid leukemia (AML)", "Mostly adults, rising with age", "Rapid onset; myeloblasts"],
                ["Chronic lymphocytic leukemia (CLL)", "Older adults; the most common adult leukemia in Western countries", "Slow; many mature-looking but dysfunctional lymphocytes; often found on a routine blood count"],
                ["Chronic myeloid leukemia (CML)", "Middle-aged adults", "The Philadelphia chromosome (BCR-ABL fusion gene); a targeted drug blocks the abnormal enzyme"],
              ],
            },
            { t: "h2", text: "Lymphoma" },
            {
              t: "table",
              head: ["", "Hodgkin lymphoma", "Non-Hodgkin lymphoma"],
              rows: [
                ["Hallmark", "Reed-Sternberg cells", "A diverse group, mostly B-cell cancers"],
                ["Who", "Peaks in young adults and again after 55", "More common; risk rises with age"],
                ["Spread", "Orderly, to neighboring node groups", "Less predictable; often outside the nodes (gut, skin, brain)"],
                ["Presentation", "Painless swollen node, often in the neck; may have \"B symptoms\": fever, drenching night sweats, weight loss over 10% in 6 months", "Painless swollen nodes; B symptoms; symptoms from the organs involved"],
              ],
            },
            {
              t: "callout",
              title: "Shared risk factors",
              html: "Immunosuppression (HIV, organ transplant drugs), previous chemotherapy or radiation, some viral infections (Epstein-Barr virus), exposure to chemicals such as benzene, and some genetic conditions (Down syndrome raises the risk of childhood leukemia).",
            },
            {
              t: "q",
              q: {
                id: "s4-c8",
                type: "mc",
                stem: "Amir's mother asks why he keeps getting infections when his white blood cell count is so high. What is the best explanation?",
                options: [
                  { t: "\"Most of those white cells are immature leukemia cells that cannot fight infection, and they crowd out the normal ones.\"", ok: true, why: "The count is high, but the cells are dysfunctional blasts, and normal neutrophils are suppressed." },
                  { t: "\"A high white count means his body is already fighting an infection, which will pass.\"", ok: false, why: "This misreads a leukemic count as an infection response." },
                  { t: "\"His low platelets are causing the infections.\"", ok: false, why: "Low platelets cause bleeding, not infection." },
                  { t: "\"Children with leukemia have too many red cells.\"", ok: false, why: "Leukemia causes anemia." },
                ],
                rationale: "In leukemia, count does not equal function.",
              },
            },
          ],
        },
        {
          id: "s4-l7-sum",
          title: "Lesson 7: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Take a moment to review" },
            {
              t: "ul",
              items: [
                "Lymphatics drain leaked fluid and protein back to the blood and filter it through nodes. Blocked drainage causes lymphedema.",
                "Infectious = caused by a pathogen. Communicable = spreads person to person (influenza yes, Lyme disease no).",
                "Exotoxins are secreted proteins; endotoxin is part of the gram-negative wall and drives septic shock. Viruses need host cells; antibiotics do not work on them.",
                "Left shift (more bands) = acute bacterial infection. Lymphocytosis = viral. Eosinophilia = allergy or parasites.",
                "Lyme disease: tick-borne <em>Borrelia</em>; erythema migrans; later arthritis, facial palsy, heart block.",
                "SLE: ANA and anti-dsDNA; immune complexes (type III) inflame skin, joints, kidneys, serosa and blood.",
                "HIV binds CD4 and a co-receptor; reverse transcriptase, integrase and protease are drug targets. CD4 cells help both antibody and cell-mediated immunity. AIDS: CD4 below 200 or an AIDS-defining illness.",
                "Leukemia crowds the marrow: anemia, bleeding and infection despite a high white count. ALL is the commonest childhood cancer; CLL the commonest adult leukemia in Western countries.",
                "Hodgkin lymphoma: Reed-Sternberg cells, orderly spread. Non-Hodgkin: more common, less predictable. Both share immunosuppression, prior chemo or radiation and EBV as risks.",
              ],
            },
            {
              t: "cards",
              id: "fc-l7",
              title: "Lesson 7 flashcards",
              cards: [
                ["Infectious vs communicable", "Caused by a pathogen vs can spread person to person"],
                ["Left shift", "More immature neutrophils (bands): acute bacterial infection"],
                ["Endotoxin", "Gram-negative cell wall component (LPS); fever and septic shock"],
                ["Lyme disease vector and rash", "Blacklegged tick; erythema migrans"],
                ["Lymphangitis", "Red streaks from a wound toward the lymph nodes"],
                ["SLE antibodies", "ANA; anti-dsDNA is more specific"],
                ["HIV's main target", "CD4 helper T cells"],
                ["HIV enzyme that copies RNA into DNA", "Reverse transcriptase"],
                ["AIDS threshold", "CD4 below 200 cells/mm³ or an AIDS-defining illness"],
                ["Why leukemia causes infection", "Immature, nonfunctional white cells crowd out normal ones"],
                ["Most common childhood cancer", "Acute lymphoblastic leukemia (ALL)"],
                ["Philadelphia chromosome", "Chronic myeloid leukemia (BCR-ABL)"],
                ["Reed-Sternberg cells", "Hodgkin lymphoma"],
              ],
            },
          ],
        },
        {
          id: "s4-l7-quiz",
          title: "Lesson 7: Quiz",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on infection, immunity, HIV, leukemia and lymphoma." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s4-q6",
                  type: "mc",
                  stem: "A hiker has an expanding red rash with a clear center on his thigh a week after a camping trip, with fever and aches. Which statement about his likely condition is true?",
                  options: [
                    { t: "It is a tick-borne bacterial infection that does not spread from person to person", ok: true, why: "Erythema migrans after outdoor exposure suggests Lyme disease, which is infectious but not communicable." },
                    { t: "It is a viral infection spread by respiratory droplets", ok: false, why: "Lyme disease is bacterial and tick-borne." },
                    { t: "It will not need treatment because the rash will fade", ok: false, why: "The rash fades, but untreated infection can spread to joints, nerves and the heart." },
                    { t: "It is a type I hypersensitivity reaction to the tick bite", ok: false, why: "An expanding rash days later with fever is infection, not an allergic reaction." },
                  ],
                  rationale: "Infectious is not the same as communicable.",
                },
                {
                  id: "s4-q7",
                  type: "mc",
                  stem: "A client's white blood cell count is 16,500/mm³ with increased neutrophils and band forms. Which description is correct?",
                  options: [
                    { t: "Leukocytosis with a left shift, suggesting an acute bacterial infection", ok: true, why: "A raised count driven by neutrophils and bands is the typical response to bacteria." },
                    { t: "Leukopenia, suggesting marrow suppression", ok: false, why: "The count is high, not low." },
                    { t: "Lymphocytosis, suggesting a viral infection", ok: false, why: "The increase is in neutrophils, not lymphocytes." },
                    { t: "Eosinophilia, suggesting a parasitic infection", ok: false, why: "Eosinophils are not described as raised." },
                  ],
                  rationale: "Name the cell that is raised; it points to the cause.",
                },
                {
                  id: "s4-q8",
                  type: "mc",
                  stem: "What is true about CD4+ T cells?",
                  options: [
                    { t: "They coordinate both antibody and cell-mediated responses", ok: true, why: "Helper T cells coordinate both humoral and cell-mediated immunity." },
                    { t: "They directly produce and release antibodies", ok: false, why: "Plasma cells (from B cells) produce antibodies." },
                    { t: "They are part of the fast, innate immune response", ok: false, why: "T cells are adaptive immune cells." },
                    { t: "They are the main cells destroyed in leukemia", ok: false, why: "Leukemia is a cancer of white cell precursors; CD4 loss is the hallmark of HIV." },
                  ],
                  rationale: "CD4 = helper = coordinator.",
                },
                {
                  id: "s4-q9",
                  type: "mc",
                  stem: "A 70-year-old has fatigue and swollen lymph nodes. Bloodwork shows a very high count of mature-looking lymphocytes. When reviewing the bloodwork for chronic lymphocytic leukemia, what else would the provider expect to see?",
                  options: [
                    { t: "Possible anemia and low platelets as the marrow is crowded", ok: true, why: "As CLL progresses, crowding of the marrow lowers red cells and platelets." },
                    { t: "A very high platelet count", ok: false, why: "Platelets tend to fall, not rise." },
                    { t: "Many myeloblasts with the Philadelphia chromosome", ok: false, why: "That describes chronic myeloid leukemia." },
                    { t: "A low lymphocyte count", ok: false, why: "CLL raises the lymphocyte count." },
                  ],
                  rationale: "Leukemia crowds the marrow: watch red cells and platelets.",
                },
                {
                  id: "s4-q10",
                  type: "mc",
                  stem: "What is a common shared risk factor for leukemias and lymphomas?",
                  options: [
                    { t: "Immunosuppression (HIV, transplant drugs)", ok: true, why: "A weakened immune system is less able to remove abnormal lymphoid cells, and some cancers are virus-driven." },
                    { t: "A diet high in saturated fat", ok: false, why: "That is linked to atherosclerosis, not blood cancers." },
                    { t: "Regular vigorous aerobic exercise", ok: false, why: "Exercise does not raise cancer risk." },
                    { t: "Long-standing iron deficiency", ok: false, why: "Iron deficiency causes anemia, not leukemia or lymphoma." },
                  ],
                  rationale: "Immunosuppression, prior chemo or radiation, EBV and benzene are shared risks.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "s4-sum-g",
      title: "Section 4: Summary",
      pages: [
        {
          id: "s4-sum",
          title: "Section 4: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Section review" },
            {
              t: "p",
              html: "Edward showed how stasis and smoking produce a leg clot that can reach the lungs. Sophie showed how chronic inflammation and cancer treatment lower the blood's oxygen-carrying capacity. Frank showed how a damaged ventricle backs blood into the lungs. Susan showed inflammation and the lymphatic system at work against a bacterial infection, and Amir showed what happens when white cells themselves become cancerous.",
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I stage blood pressure and name causes of secondary hypertension?",
                "Can I apply Virchow triad and recognize a PE after a DVT?",
                "Can I classify an anemia from MCV, ferritin and neurologic signs?",
                "Can I tell left from right heart failure, and stenosis from regurgitation?",
                "Can I explain infectious vs communicable, a left shift, and why HIV and leukemia raise infection risk?",
              ],
            },
            { t: "callout", title: "If you answered no to any question", html: "Return to that lesson page and retry its learning checks. Then take the section test." },
          ],
        },
      ],
    },
    {
      id: "s4-test-g",
      title: "Section 4: Test",
      pages: [
        {
          id: "s4-test",
          title: "Section 4: Test",
          kind: "test",
          blocks: [
            { t: "p", html: "Ten questions covering Lessons 6 and 7. Answer every question, then submit. Your score and all rationales appear after you submit." },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s4-t1",
                  type: "mc",
                  stem: "Which term describes a weakening of the arterial wall that bulges outward?",
                  options: [
                    { t: "Aneurysm", ok: true, why: "An aneurysm is a localized outward bulge of a weakened artery." },
                    { t: "Embolus", ok: false, why: "An embolus is material traveling in the blood." },
                    { t: "Stenosis", ok: false, why: "Stenosis is narrowing." },
                    { t: "Thrombus", ok: false, why: "A thrombus is a clot attached to a vessel wall." },
                  ],
                  rationale: "Bulge = aneurysm; travels = embolus; sticks = thrombus; narrows = stenosis.",
                  level: "recall",
                },
                {
                  id: "s4-t2",
                  type: "mc",
                  stem: "A 52-year-old woman has 30 minutes of nausea, unusual fatigue and an aching jaw. She has type 2 diabetes. Her ECG shows ST changes and troponin is rising. What is she experiencing?",
                  options: [
                    { t: "An atypical myocardial infarction", ok: true, why: "Rising troponin confirms heart muscle injury; women and people with diabetes often lack classic chest pain." },
                    { t: "Stable angina", ok: false, why: "Stable angina does not raise troponin and is relieved by rest." },
                    { t: "Pericarditis", ok: false, why: "Pericarditis causes positional chest pain and a rub." },
                    { t: "Gastroesophageal reflux disease", ok: false, why: "Reflux does not raise troponin." },
                  ],
                  rationale: "Never let an atypical presentation talk you out of an MI.",
                },
                {
                  id: "s4-t3",
                  type: "mc",
                  stem: "A client has a new irregularly irregular heart rhythm (atrial fibrillation). Why is this dysrhythmia a concern?",
                  options: [
                    { t: "Blood pools in the quivering atria and can form clots that travel to the brain", ok: true, why: "AF raises the risk of embolic stroke; it can also lower cardiac output." },
                    { t: "It always progresses to ventricular fibrillation within hours", ok: false, why: "AF does not routinely become VF." },
                    { t: "It causes the heart valves to become infected", ok: false, why: "That is endocarditis, which is unrelated." },
                    { t: "It raises the red blood cell count", ok: false, why: "AF does not change red cell production." },
                  ],
                  rationale: "Dysrhythmias threaten output, sudden death and, in AF, clots.",
                },
                {
                  id: "s4-t4",
                  type: "mc",
                  stem: "What is the term for an infection of the endocardium and heart valves?",
                  options: [
                    { t: "Infective endocarditis", ok: true, why: "Endocarditis is infection of the inner lining, usually the valves." },
                    { t: "Pericarditis", ok: false, why: "Pericarditis is inflammation of the outer sac." },
                    { t: "Myocarditis", ok: false, why: "Myocarditis is inflammation of the heart muscle." },
                    { t: "Cardiomyopathy", ok: false, why: "Cardiomyopathy is disease of the heart muscle." },
                  ],
                  rationale: "Endo = inside; peri = around; myo = muscle.",
                  level: "recall",
                },
                {
                  id: "s4-t5",
                  type: "mc",
                  stem: "Three days after an MI, a client has sharp chest pain that is worse lying back and better sitting forward. The provider hears a scratchy sound with each heartbeat. What is the client experiencing?",
                  options: [
                    { t: "Pericarditis", ok: true, why: "Positional pleuritic pain and a friction rub after an MI point to pericarditis." },
                    { t: "A new myocardial infarction", ok: false, why: "Ischemic pain is not relieved by sitting forward and there is no rub." },
                    { t: "Infective endocarditis", ok: false, why: "Endocarditis causes fever and a new murmur, not a rub." },
                    { t: "Pulmonary embolism", ok: false, why: "PE causes sudden dyspnea and hypoxemia, not a friction rub." },
                  ],
                  rationale: "Sits forward for relief + rub = pericarditis.",
                },
                {
                  id: "s4-t6",
                  type: "mc",
                  stem: "A 34-year-old woman with very heavy periods has a low hemoglobin, small pale red cells and a low ferritin. She asks what is causing her anemia. What is the best response by the provider?",
                  options: [
                    { t: "\"Your heavy periods lose iron faster than you replace it, so you can't make enough hemoglobin.\"", ok: true, why: "Microcytic anemia with low ferritin is iron deficiency; heavy menstrual loss is a common cause." },
                    { t: "\"Your stomach can't make the factor you need to absorb vitamin B12.\"", ok: false, why: "B12 deficiency produces large cells." },
                    { t: "\"Your bone marrow has slowed down making all of your blood cells.\"", ok: false, why: "That is aplastic anemia, which lowers all cell lines." },
                    { t: "\"Your immune system is destroying your red cells before they wear out.\"", ok: false, why: "Hemolysis causes jaundice and normal-sized cells." },
                  ],
                  rationale: "Small cells, low ferritin: find the blood loss.",
                },
                {
                  id: "s4-t7",
                  type: "mc",
                  stem: "What is true about influenza?",
                  options: [
                    { t: "It is a communicable viral infection spread mainly by respiratory droplets", ok: true, why: "Influenza spreads person to person, so it is both infectious and communicable." },
                    { t: "It is a bacterial infection treated with antibiotics", ok: false, why: "Influenza is viral; antibiotics do not treat it." },
                    { t: "It is infectious but not communicable", ok: false, why: "Influenza spreads readily between people." },
                    { t: "One vaccine gives lifelong immunity", ok: false, why: "The virus changes its surface antigens, so vaccines are updated yearly." },
                  ],
                  rationale: "Infectious + spreads between people = communicable.",
                  level: "recall",
                },
                {
                  id: "s4-t8",
                  type: "mc",
                  stem: "Three years after an axillary lymph node dissection for breast cancer, a woman has a firm, swollen arm on the same side. What is a physiological mechanism behind the swelling?",
                  options: [
                    { t: "Lymph cannot drain from the arm, so protein-rich fluid collects in the tissues", ok: true, why: "Removing nodes obstructs lymph drainage: lymphedema." },
                    { t: "Increased capillary hydrostatic pressure from heart failure", ok: false, why: "Heart failure causes bilateral swelling, not one arm." },
                    { t: "Low albumin from liver disease", ok: false, why: "Low albumin causes generalized edema." },
                    { t: "A type I allergic reaction", ok: false, why: "Allergic swelling is sudden and short-lived." },
                  ],
                  rationale: "One limb + node removal = lymphatic obstruction.",
                },
                {
                  id: "s4-t9",
                  type: "mc",
                  stem: "A young woman with a butterfly rash, painful joints and protein in her urine asks how lupus damages her kidneys. What is the best response by the provider?",
                  options: [
                    { t: "\"Antibody clumps against your own cells lodge in the kidney filters and inflame them.\"", ok: true, why: "SLE is driven by immune complexes depositing in tissues, including the glomeruli." },
                    { t: "\"A bacterial infection has spread up into both of your kidneys.\"", ok: false, why: "Lupus nephritis is autoimmune, not infectious." },
                    { t: "\"Small kidney stones are blocking the drainage from your kidneys.\"", ok: false, why: "Stones are unrelated to lupus nephritis." },
                    { t: "\"Your immune system is too weak to protect your kidneys from germs.\"", ok: false, why: "In SLE the immune system is overactive against self." },
                  ],
                  rationale: "SLE: autoantibodies + immune complexes (type III) = multisystem inflammation.",
                },
                {
                  id: "s4-t10",
                  type: "mc",
                  stem: "A child with newly diagnosed acute lymphoblastic leukemia has bruises and petechiae. When evaluating the complete blood count, what does the provider expect to see and why?",
                  options: [
                    { t: "A low platelet count, because leukemic cells crowd out normal marrow production", ok: true, why: "Marrow replacement lowers platelets, causing bruising and petechiae." },
                    { t: "A high platelet count, because the marrow is overactive", ok: false, why: "The overactive line is the leukemic clone, not platelets." },
                    { t: "A normal platelet count, because leukemia only affects white cells", ok: false, why: "Crowding affects all normal cell lines." },
                    { t: "A high red cell count", ok: false, why: "Leukemia causes anemia." },
                  ],
                  rationale: "Leukemia: anemia, thrombocytopenia and dysfunctional white cells.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

import type { ASection } from "./author";

const T = "McCance & Huether, Pathophysiology";

export const s5: ASection = {
  id: "s5",
  num: 5,
  kind: "section",
  title: "Respiratory System",
  blurb: "Gas exchange and infection, obstructive and restrictive disease, the pleural space, pulmonary embolism, ARDS and lung cancer.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of respiratory disorders.",
  source: `${T}: Structure and function of the pulmonary system; Alterations of pulmonary function.`,
  groups: [
    {
      id: "s5-intro-g",
      title: "Section Introduction",
      pages: [
        {
          id: "s5-intro",
          title: "Section Introduction",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The lungs have one job: get oxygen into the blood and carbon dioxide out. That takes four things working together. Air must move in and out (<strong>ventilation</strong>), gases must cross the thin alveolar wall (<strong>diffusion</strong>), blood must flow past the alveoli (<strong>perfusion</strong>), and the lungs must stay inflated, which depends on the <strong>negative pressure</strong> in the pleural space. Every disorder in this section breaks one of these.",
            },
            {
              t: "p",
              html: "Bring forward what you learned in Section 4: perfusion, infection and immunity all reappear here. A clot from the leg becomes a pulmonary embolism; a failing left ventricle floods the lungs; an infection fills the alveoli.",
            },
            { t: "case", title: "Melissa, 46", html: "Melissa has smoked a pack a day for 25 years. She has had a cough for three days, now with rusty sputum, a fever of 39.1 °C (102.4 °F), sharp pain on the right side when she breathes in, and breathlessness." },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Explain how gas exchange works and what causes hypoxemia and hypercapnia.",
                "Describe pneumonia, tuberculosis and influenza.",
                "Tell obstructive from restrictive disease, including asthma, COPD and pulmonary fibrosis.",
                "Recognize pneumothorax, pleural effusion, pulmonary embolism, pulmonary hypertension, ARDS and lung cancer.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s5-l8",
      title: "Lesson 8: Respiratory System Pathophysiology",
      pages: [
        {
          id: "s5-l8-intro",
          title: "Lesson 8: Respiratory System Pathophysiology",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "Air travels through the upper airways (nose, pharynx, larynx, trachea) and the conducting airways (bronchi and bronchioles) to the gas-exchange airways: respiratory bronchioles and about 300–500 million alveoli. Each alveolus is wrapped in capillaries, and the wall between air and blood is only a fraction of a micron thick. <strong>Surfactant</strong>, made by type II alveolar cells, lowers surface tension so the alveoli do not collapse at the end of each breath.",
            },
            {
              t: "table",
              head: ["Term", "Meaning"],
              rows: [
                ["Hypoxemia", "Low oxygen in arterial blood (PaO₂ below about 80 mm Hg; SpO₂ below about 95%)"],
                ["Hypoxia", "Not enough oxygen at the tissues"],
                ["Hypercapnia", "PaCO₂ above 45 mm Hg; caused by hypoventilation; produces respiratory acidosis"],
                ["V/Q mismatch", "Ventilation and perfusion do not match. Air without blood (pulmonary embolism) or blood without air (pneumonia, atelectasis) both lower oxygen"],
                ["Shunt", "Blood passes through the lungs without meeting any air; extra oxygen barely helps"],
              ],
            },
            { t: "h2", text: "Learning objectives" },
            {
              t: "ul",
              items: [
                "Describe the pathogenesis of respiratory disorders and injury.",
                "Describe their manifestations.",
                "Explain complications and variations.",
              ],
            },
          ],
        },
        {
          id: "s5-l8-1",
          title: "Lesson 8.1: Gas Exchange and Respiratory Infection",
          shortTitle: "Lesson 8.1: Pneumonia, TB and Influenza",
          kind: "activity",
          blocks: [
            { t: "eq", text: "How do infections of the lungs disturb gas exchange?" },
            {
              t: "read",
              items: [
                { ref: "pp. 1131–1137: Structures of the pulmonary system; conducting and gas-exchange airways" },
                { ref: "pp. 1176–1178: Pneumonia; pp. 1178–1179: Tuberculosis" },
              ],
            },
            { t: "h2", text: "Pneumonia" },
            {
              t: "p",
              html: "Pneumonia is infection of the lower respiratory tract. Pathogens reach the alveoli, inflammation follows, and the alveoli fill with fluid, white cells and debris (<strong>consolidation</strong>). Blood still flows past those alveoli but cannot pick up oxygen, so hypoxemia develops.",
            },
            {
              t: "table",
              head: ["Type", "Typical organisms and setting"],
              rows: [
                ["Community-acquired", "<em>Streptococcus pneumoniae</em> (most common), <em>Haemophilus influenzae</em>, atypical organisms such as <em>Mycoplasma</em>, and viruses"],
                ["Hospital-acquired and ventilator-associated", "More often gram-negative bacteria and <em>Staphylococcus aureus</em>, including resistant strains"],
                ["Aspiration", "Stomach contents or mouth bacteria enter the lungs. Risk rises with a weak swallow or cough: stroke, sedation, reduced consciousness, alcohol intoxication, seizures, feeding tubes, older age"],
              ],
            },
            {
              t: "ul",
              items: [
                "<strong>Signs:</strong> fever, chills, productive cough, pleuritic chest pain, breathlessness, fast breathing, crackles and dullness over the affected area.",
                "<strong>Why crackles:</strong> fluid in the small airways and alveoli makes them pop open during inspiration.",
                "<strong>Variation:</strong> older adults may have no fever or cough and present with confusion, falls or loss of appetite.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s5-c1",
                type: "mc",
                stem: "Melissa has fever, rusty sputum, right-sided pleuritic pain and crackles over the right lower lobe. What is the pathophysiological mechanism behind her shortness of breath?",
                options: [
                  { t: "Alveoli filled with inflammatory exudate cannot take part in gas exchange", ok: true, why: "Consolidation leaves perfused alveoli without air: V/Q mismatch and hypoxemia." },
                  { t: "Her airways are narrowed by bronchospasm", ok: false, why: "Bronchospasm is the mechanism in asthma, with wheeze rather than focal crackles." },
                  { t: "A clot is blocking blood flow to part of the lung", ok: false, why: "That is a pulmonary embolism; fever and productive sputum point to infection." },
                  { t: "Air has entered the pleural space and collapsed the lung", ok: false, why: "Pneumothorax gives absent breath sounds, not crackles and fever." },
                ],
                rationale: "Pneumonia: perfusion without ventilation in the consolidated area.",
              },
            },
            { t: "h2", text: "Tuberculosis" },
            {
              t: "p",
              html: "TB is caused by <em>Mycobacterium tuberculosis</em>, spread through the air in tiny droplet nuclei. In most infected people, macrophages and T cells wall the bacteria off in <strong>granulomas</strong> with a cheesy (caseous) necrotic center. The bacteria survive there, dormant.",
            },
            {
              t: "table",
              head: ["", "Latent TB infection", "Active TB disease"],
              rows: [
                ["Symptoms", "None", "Cough for 3 weeks or more, hemoptysis, fever, night sweats, weight loss"],
                ["Contagious?", "No", "Yes (pulmonary TB): airborne isolation"],
                ["Tests", "Positive skin test or interferon-gamma release assay; normal chest x-ray", "Skin or blood test usually positive (can be negative); abnormal chest x-ray; positive sputum smear, culture or NAAT"],
                ["Risk of progression", "About 5–10% over a lifetime, much higher with HIV, diabetes, transplant drugs or other immunosuppression", "—"],
              ],
            },
            {
              t: "p",
              html: "<strong>Influenza</strong> is a communicable viral infection of the respiratory tract, spread by droplets. It causes abrupt fever, aches, cough and fatigue, and can lead to viral or secondary bacterial pneumonia. The virus changes its surface proteins constantly, so a new vaccine is made each year.",
            },
          ],
        },
        {
          id: "s5-l8-2",
          title: "Lesson 8.2: Disorders of Ventilation",
          shortTitle: "Lesson 8.2: Obstructive, Restrictive and Pleural",
          kind: "activity",
          blocks: [
            { t: "eq", text: "Why do some lung diseases trap air while others stop the lungs from filling?" },
            {
              t: "read",
              items: [
                { ref: "pp. 1137–1143 and 1153–1158: Ventilation; clinical manifestations of pulmonary alterations" },
                { ref: "pp. 1167–1175: Obstructive pulmonary disease" },
                { ref: "pp. 1159–1161: Pleural abnormalities" },
              ],
            },
            { t: "h2", text: "Obstructive vs restrictive" },
            {
              t: "table",
              head: ["", "Obstructive", "Restrictive"],
              rows: [
                ["The problem", "Air cannot get <strong>out</strong>: narrowed or collapsing airways", "The lungs cannot expand: air cannot get <strong>in</strong>"],
                ["Lung function", "FEV₁ falls more than FVC, so the FEV₁/FVC ratio is low; air trapping", "All volumes are small (low total lung capacity); FEV₁/FVC normal or high; low compliance"],
                ["Examples", "Asthma, chronic bronchitis, emphysema, bronchiectasis, cystic fibrosis", "Pulmonary fibrosis, ARDS, pneumonia, pleural effusion, obesity, kyphoscoliosis, neuromuscular weakness"],
              ],
            },
            { t: "h2", text: "Asthma" },
            {
              t: "p",
              html: "Asthma is chronic inflammation of the airways that makes them hyperresponsive. A trigger (allergen, exercise, cold air, smoke, infection, aspirin or NSAIDs in some people) causes bronchospasm, mucosal swelling and thick mucus. Obstruction is <strong>largely reversible</strong>. Allergic asthma is a type I hypersensitivity with an early phase (minutes) and a late phase (hours). Expect wheeze, cough worse at night, chest tightness and breathlessness.",
            },
            {
              t: "callout",
              title: "Danger signs in an asthma attack",
              html: "Unable to speak in full sentences, using accessory muscles, a rising PaCO₂ (the client is tiring), and a <strong>silent chest</strong>: almost no air movement, so wheeze disappears. Over years, poorly controlled asthma causes <strong>airway remodeling</strong> (thickened walls, fibrosis), and the obstruction becomes partly fixed.",
            },
            { t: "h2", text: "Chronic obstructive pulmonary disease (COPD)" },
            {
              t: "table",
              head: ["", "Chronic bronchitis", "Emphysema"],
              rows: [
                ["Definition", "Productive cough for at least 3 months in each of 2 consecutive years", "Destruction of alveolar walls with permanent enlargement of air spaces"],
                ["Mechanism", "Irritants enlarge mucus glands and paralyze cilia; airways inflame and clog", "Loss of elastic recoil; small airways collapse on expiration and trap air"],
                ["Picture", "Heavy sputum, frequent infections, hypoxemia, cyanosis, edema from cor pulmonale", "Severe breathlessness, barrel chest, pursed-lip breathing, thin build"],
              ],
            },
            {
              t: "p",
              html: "<strong>How smoking causes COPD:</strong> smoke inflames the airways and recruits neutrophils and macrophages, which release proteases such as elastase. Normally <strong>alpha-1 antitrypsin</strong> neutralizes them; smoke both increases the proteases and inactivates the antitrypsin, so elastin in the alveolar walls is digested. Smoke also paralyzes cilia and enlarges mucus glands. People with inherited alpha-1 antitrypsin deficiency develop emphysema young, especially if they smoke.",
            },
            {
              t: "q",
              q: {
                id: "s5-c2",
                type: "mc",
                stem: "Which disorder does long-term cigarette smoking place Melissa at greatest risk of, and why?",
                options: [
                  { t: "COPD, because smoke-driven proteases destroy alveolar walls", ok: true, why: "The protease–antiprotease imbalance and chronic airway inflammation underlie emphysema and chronic bronchitis." },
                  { t: "Asthma, because smoke causes an IgE response to tobacco", ok: false, why: "Smoke is an asthma trigger, but smoking causes COPD through chronic inflammation and protease damage." },
                  { t: "Pulmonary fibrosis, because smoke scars the pleura", ok: false, why: "Fibrosis scars the interstitium; smoking's main lung disease is COPD (and lung cancer)." },
                  { t: "Tuberculosis, because smoke damages the airway defenses", ok: false, why: "Smoking weakens airway defenses and raises TB risk, but TB needs exposure to M. tuberculosis; COPD is the far more likely consequence." },
                ],
                rationale: "Smoking → inflammation + proteases > antiproteases → COPD.",
              },
            },
            { t: "h2", text: "Restrictive disease and the pleural space" },
            {
              t: "p",
              html: "In <strong>pulmonary fibrosis</strong>, scar tissue stiffens the lung interstitium and thickens the alveolar wall, so the lungs are hard to inflate and oxygen diffuses poorly. Causes include idiopathic disease, occupational dusts (asbestos, silica), radiation, some drugs and autoimmune disease.",
            },
            {
              t: "p",
              html: "The pleural space is a thin, fluid-filled gap between the lung and the chest wall. Its pressure is slightly <strong>below atmospheric (negative)</strong>, which holds the lungs open against their elastic recoil. If air or fluid enters it, that negative pressure is lost and the lung collapses.",
            },
            {
              t: "table",
              head: ["Disorder", "What happens", "Signs"],
              rows: [
                ["Primary spontaneous pneumothorax", "A small bleb ruptures; typically tall, thin young men; smoking raises risk", "Sudden one-sided chest pain and breathlessness; reduced breath sounds"],
                ["Secondary pneumothorax", "Underlying lung disease such as COPD", "Often more severe because reserve is low"],
                ["Tension pneumothorax", "Air enters with each breath but cannot leave; pressure builds and shifts the mediastinum", "Severe distress, absent breath sounds, trachea pushed to the opposite side, distended neck veins, hypotension. Emergency decompression"],
                ["Pleural effusion", "Fluid in the pleural space: transudate (heart failure, cirrhosis) or exudate (infection, cancer). Pus = empyema", "Breathlessness, dull to percussion, reduced breath sounds"],
              ],
            },
          ],
        },
        {
          id: "s5-l8-3",
          title: "Lesson 8.3: Disorders of the Pulmonary Vasculature",
          shortTitle: "Lesson 8.3: PE, Pulmonary Hypertension, ARDS, Cancer",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What happens when blood flow through the lungs is blocked or the alveolar membrane is injured?" },
            { t: "read", items: [{ ref: "pp. 1179–1182 and 1166–1167: Pulmonary vascular disease and acute respiratory distress syndrome" }] },
            { t: "h2", text: "Pulmonary embolism" },
            {
              t: "p",
              html: "Most pulmonary emboli are clots from the deep veins of the legs or pelvis. The clot blocks a pulmonary artery: those alveoli are still ventilated but not perfused (<strong>dead space</strong>); blood diverted to the rest of the lung creates V/Q mismatch, so oxygen falls. A large clot strains the right ventricle and can cause obstructive shock. Expect sudden breathlessness, pleuritic chest pain, fast breathing and heart rate, anxiety, sometimes hemoptysis. Risk factors are those of DVT: immobility, surgery, cancer, pregnancy, estrogen and smoking.",
            },
            { t: "h2", text: "Pulmonary hypertension" },
            {
              t: "p",
              html: "Pulmonary hypertension is raised pressure in the pulmonary arteries. Causes include left heart disease, chronic lung disease and hypoxia (low oxygen constricts pulmonary arteries), chronic or recurrent pulmonary emboli, and idiopathic disease. The right ventricle must pump against higher pressure: it hypertrophies and eventually fails. Right heart failure caused by lung disease is called <strong>cor pulmonale</strong>.",
            },
            { t: "h2", text: "Acute respiratory distress syndrome (ARDS)" },
            {
              t: "p",
              html: "ARDS is a sudden, widespread injury to the alveolar-capillary membrane. Inflammation, driven largely by neutrophils, makes the membrane leaky, so protein-rich fluid floods the alveoli (non-cardiogenic pulmonary edema). Surfactant is lost and alveoli collapse. The lungs become stiff, and hypoxemia persists <strong>even on high-flow oxygen</strong> because much of the blood passes through flooded or collapsed alveoli (shunt).",
            },
            {
              t: "ul",
              items: [
                "<strong>Triggers:</strong> pneumonia (including COVID-19) and sepsis (the most common), aspiration, major trauma, pancreatitis, massive transfusion, near-drowning.",
                "<strong>Picture:</strong> within a week of the trigger, worsening breathlessness and fast breathing, bilateral infiltrates on chest x-ray (\"white-out\") not explained by heart failure, and hypoxemia that does not respond well to oxygen.",
                "<strong>Recovery</strong> can leave fibrosis and lasting weakness.",
              ],
            },
            { t: "h2", text: "Lung cancer" },
            {
              t: "table",
              head: ["Type", "Features"],
              rows: [
                ["Adenocarcinoma (non-small cell)", "The most common type; usually peripheral; also the most common type in people who have never smoked"],
                ["Squamous cell carcinoma (non-small cell)", "Usually central, near the bronchi; strongly linked to smoking; can cause high calcium"],
                ["Small cell carcinoma", "Central, fast-growing and usually spread at diagnosis; strongly linked to smoking; can produce hormones (SIADH, Cushing syndrome)"],
              ],
            },
            {
              t: "p",
              html: "Warning signs: a cough that changes or will not go away, hemoptysis, weight loss, recurring pneumonia, hoarseness, and chest pain. Smoking causes most lung cancer; radon, asbestos and air pollution add risk.",
            },
            {
              t: "q",
              q: {
                id: "s5-c3",
                type: "mc",
                stem: "A client with septic shock is now breathing 34 times a minute. Chest x-ray shows white-out in both lungs, the heart is a normal size, and her oxygen saturation stays at 84% on a non-rebreather mask. Which condition is most likely?",
                options: [
                  { t: "Acute respiratory distress syndrome", ok: true, why: "Sepsis, bilateral infiltrates without heart failure and hypoxemia that resists oxygen fit ARDS." },
                  { t: "Left-sided heart failure", ok: false, why: "The heart is normal-sized and the setting is sepsis; ARDS fluid is not from high cardiac pressures." },
                  { t: "Asthma exacerbation", ok: false, why: "Asthma does not cause bilateral white-out." },
                  { t: "Spontaneous pneumothorax", ok: false, why: "A pneumothorax is one-sided air, not bilateral infiltrates." },
                ],
                rationale: "Refractory hypoxemia + bilateral infiltrates + a trigger such as sepsis = ARDS.",
              },
            },
          ],
        },
        {
          id: "s5-l8-sum",
          title: "Lesson 8: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Take a moment to review" },
            {
              t: "ul",
              items: [
                "Gas exchange needs ventilation, diffusion, perfusion and an inflated lung. Hypercapnia (PaCO₂ over 45) means hypoventilation.",
                "Pneumonia fills alveoli with exudate: perfused but not ventilated. Aspiration risk rises with a weak swallow or reduced consciousness.",
                "Latent TB: positive test, no symptoms, not contagious. Active TB: cough 3 weeks or more, night sweats, weight loss; airborne precautions.",
                "Obstructive = trouble getting air out (asthma, COPD; low FEV₁/FVC). Restrictive = trouble getting air in (fibrosis, ARDS, effusion; low lung volumes, low compliance).",
                "Asthma is reversible airway inflammation; untreated, it remodels the airways. A silent chest is an emergency.",
                "COPD: chronic bronchitis (mucus, cough) and emphysema (alveolar destruction, air trapping). Smoking tips the protease–antiprotease balance.",
                "The pleural space has negative pressure; air (pneumothorax) or fluid (effusion) collapses the lung. Tension pneumothorax shifts the trachea away.",
                "PE causes dead space and sudden dyspnea. Pulmonary hypertension leads to right heart failure (cor pulmonale).",
                "ARDS: leaky alveolar membrane, bilateral infiltrates, hypoxemia that resists oxygen; pneumonia and sepsis are the commonest triggers.",
              ],
            },
            {
              t: "cards",
              id: "fc-l8",
              title: "Lesson 8 flashcards",
              cards: [
                ["Hypercapnia", "PaCO₂ above 45 mm Hg; from hypoventilation"],
                ["Cause of crackles", "Fluid in small airways and alveoli popping open on inspiration"],
                ["Most common cause of community-acquired pneumonia", "Streptococcus pneumoniae"],
                ["Latent TB", "Positive skin or blood test, normal x-ray, no symptoms, not contagious"],
                ["Obstructive pattern", "Low FEV₁/FVC; air trapping"],
                ["Restrictive pattern", "Low lung volumes and compliance; normal or high FEV₁/FVC"],
                ["Chronic bronchitis definition", "Productive cough 3 months a year for 2 consecutive years"],
                ["Emphysema mechanism", "Alveolar wall destruction, loss of elastic recoil, air trapping"],
                ["Alpha-1 antitrypsin", "Protects alveoli from elastase; deficiency causes early emphysema"],
                ["Tension pneumothorax signs", "Absent breath sounds, tracheal shift away, JVD, hypotension"],
                ["Cor pulmonale", "Right heart failure caused by lung disease or pulmonary hypertension"],
                ["Most common triggers of ARDS", "Pneumonia and sepsis"],
                ["Lung cancer that causes SIADH", "Small cell carcinoma"],
              ],
            },
          ],
        },
        {
          id: "s5-l8-quiz",
          title: "Lesson 8: Quiz",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on gas exchange, infection and ventilation." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s5-q1",
                  type: "mc",
                  stem: "What occurs during gas exchange in the lungs?",
                  options: [
                    { t: "Oxygen and carbon dioxide each diffuse down their own pressure gradient", ok: true, why: "Each gas moves down its own pressure gradient across the alveolar-capillary membrane." },
                    { t: "Alveolar cells actively pump oxygen into the blood", ok: false, why: "Gas exchange is passive diffusion." },
                    { t: "Carbon dioxide moves from the alveoli into the blood", ok: false, why: "CO₂ moves from blood to alveoli to be exhaled." },
                    { t: "Surfactant carries oxygen across the membrane", ok: false, why: "Surfactant lowers surface tension; it does not carry gas." },
                  ],
                  rationale: "Diffusion down pressure gradients, across a very thin membrane.",
                  level: "recall",
                },
                {
                  id: "s5-q2",
                  type: "mc",
                  stem: "A client with pneumonia has crackles over the left lower lobe. What is the pathophysiological mechanism that causes crackles?",
                  options: [
                    { t: "Fluid-filled small airways popping open on inspiration", ok: true, why: "Crackles are discontinuous sounds from airways reopening through fluid." },
                    { t: "Air forced through narrowed, spasming bronchi", ok: false, why: "That produces wheeze." },
                    { t: "Inflamed pleural surfaces rubbing together", ok: false, why: "That is a pleural friction rub." },
                    { t: "Air trapped in the pleural space around the lung", ok: false, why: "Pleural air reduces breath sounds." },
                  ],
                  rationale: "Crackles = fluid; wheeze = narrowing; rub = pleura.",
                },
                {
                  id: "s5-q3",
                  type: "mc",
                  stem: "What is true about obstructive lung disorders?",
                  options: [
                    { t: "Air flow out of the lungs is limited, so air is trapped and the FEV₁/FVC ratio falls", ok: true, why: "Obstruction mainly limits expiration." },
                    { t: "The lungs are stiff and small, so all lung volumes fall", ok: false, why: "That is the restrictive pattern." },
                    { t: "They are caused by fluid in the pleural space", ok: false, why: "Pleural effusion is restrictive." },
                    { t: "The obstruction is always fully reversible", ok: false, why: "Asthma is largely reversible; COPD is not." },
                  ],
                  rationale: "Obstructive: can't get air out. Restrictive: can't get air in.",
                },
                {
                  id: "s5-q4",
                  type: "mc",
                  stem: "A client was exposed to tuberculosis at work. His interferon-gamma release assay is positive, his chest x-ray is normal and he feels well. Which statement is accurate?",
                  options: [
                    { t: "He has latent TB infection and is not contagious, but he could develop active TB later", ok: true, why: "Latent infection is contained in granulomas; treatment lowers the chance of reactivation." },
                    { t: "He has active TB and needs airborne isolation", ok: false, why: "Active disease causes symptoms and an abnormal x-ray." },
                    { t: "The test is a false positive because he has no symptoms", ok: false, why: "Latent TB is, by definition, without symptoms." },
                    { t: "He is immune to TB for life", ok: false, why: "A positive test means infection, not immunity." },
                  ],
                  rationale: "Positive test + normal x-ray + no symptoms = latent infection.",
                },
                {
                  id: "s5-q5",
                  type: "mc",
                  stem: "A client with severe COPD develops jugular vein distension, an enlarged liver and swollen ankles. Which complication is most likely?",
                  options: [
                    { t: "Cor pulmonale", ok: true, why: "Chronic hypoxia constricts pulmonary arteries; the right ventricle fails against the higher pressure." },
                    { t: "Left-sided heart failure", ok: false, why: "These are signs of right-sided congestion." },
                    { t: "Tension pneumothorax", ok: false, why: "Tension pneumothorax is sudden with severe distress." },
                    { t: "Acute respiratory distress syndrome", ok: false, why: "ARDS is an acute alveolar injury, not chronic venous congestion." },
                  ],
                  rationale: "Lung disease → pulmonary hypertension → right heart failure.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s5-sum-g",
      title: "Section 5: Summary",
      pages: [
        {
          id: "s5-sum",
          title: "Section 5: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Section review" },
            {
              t: "p",
              html: "Melissa's pneumonia filled alveoli that still had blood flowing past them. Her smoking history put her on the road to COPD and lung cancer, and to the clots that cause pulmonary embolism. Every respiratory disorder in this section is a failure of ventilation, diffusion, perfusion or the negative pressure that keeps the lung open.",
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I explain V/Q mismatch and why ARDS hypoxemia resists oxygen?",
                "Can I tell latent from active TB?",
                "Can I sort a disorder as obstructive or restrictive and explain why?",
                "Can I explain how smoking causes COPD?",
                "Can I recognize a tension pneumothorax and a pulmonary embolism?",
              ],
            },
            { t: "callout", title: "If you answered no to any question", html: "Return to that lesson page and retry its learning checks. Then take the section test." },
          ],
        },
      ],
    },
    {
      id: "s5-test-g",
      title: "Section 5: Test",
      pages: [
        {
          id: "s5-test",
          title: "Section 5: Test",
          kind: "test",
          blocks: [
            { t: "p", html: "Ten questions covering Lesson 8. Answer every question, then submit. Your score and all rationales appear after you submit." },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s5-t1",
                  type: "mc",
                  stem: "Which client is at greatest risk of aspiration pneumonia?",
                  options: [
                    { t: "An 80-year-old with a recent stroke and a weak, wet-sounding cough after swallowing", ok: true, why: "Dysphagia and a weak protective cough after stroke greatly raise aspiration risk." },
                    { t: "A 30-year-old runner with seasonal allergies and a runny nose", ok: false, why: "Nothing impairs swallowing or airway protection." },
                    { t: "A 45-year-old with well-controlled hypertension on one medication", ok: false, why: "Hypertension does not impair swallowing." },
                    { t: "A 25-year-old on crutches after an uncomplicated ankle fracture", ok: false, why: "No risk factor for aspiration." },
                  ],
                  rationale: "Aspiration risk = weak swallow, weak cough or reduced consciousness.",
                },
                {
                  id: "s5-t2",
                  type: "mc",
                  stem: "What is true about latent tuberculosis?",
                  options: [
                    { t: "The bacteria are contained in granulomas, the person has no symptoms and cannot spread TB", ok: true, why: "Latent infection is controlled by the immune system and is not contagious." },
                    { t: "It is spread by close contact and needs airborne isolation", ok: false, why: "Only active pulmonary TB is contagious." },
                    { t: "The chest x-ray shows cavities", ok: false, why: "Cavities indicate active disease." },
                    { t: "It cannot become active disease", ok: false, why: "Reactivation is possible, especially with immunosuppression." },
                  ],
                  rationale: "Latent = contained, silent, not contagious, but not gone.",
                },
                {
                  id: "s5-t3",
                  type: "mc",
                  stem: "Which type of pulmonary disorder is asthma?",
                  options: [
                    { t: "An obstructive disorder with largely reversible airway narrowing", ok: true, why: "Bronchospasm, edema and mucus limit expiratory flow, and this reverses with treatment." },
                    { t: "A restrictive disorder of the lung tissue", ok: false, why: "Asthma affects airways, not lung expansion." },
                    { t: "A pulmonary vascular disorder", ok: false, why: "Asthma does not affect the pulmonary vessels." },
                    { t: "A pleural disorder", ok: false, why: "The pleura is not involved." },
                  ],
                  rationale: "Asthma: obstructive, inflammatory, reversible.",
                  level: "recall",
                },
                {
                  id: "s5-t4",
                  type: "mc",
                  stem: "A teenager's asthma has been poorly controlled for years. If attacks are not prevented, what is the long-term consequence?",
                  options: [
                    { t: "Airway remodeling that makes some obstruction permanent", ok: true, why: "Chronic inflammation remodels the airways and reduces reversibility." },
                    { t: "Complete recovery as the airways adapt over time", ok: false, why: "Uncontrolled inflammation causes damage, not adaptation." },
                    { t: "Fibrosis that stiffens the alveolar walls", ok: false, why: "Remodeling occurs in the airways, not the alveolar interstitium." },
                    { t: "Reactivation of latent tuberculosis", ok: false, why: "Asthma does not cause TB." },
                  ],
                  rationale: "Prevention protects the airways from remodeling.",
                },
                {
                  id: "s5-t5",
                  type: "ms",
                  stem: "Which conditions are grouped under chronic obstructive pulmonary disease? <strong>Choose 2 answers.</strong>",
                  options: [
                    { t: "Chronic bronchitis", ok: true, why: "Chronic airway inflammation with mucus hypersecretion." },
                    { t: "Emphysema", ok: true, why: "Destruction of alveolar walls with air trapping." },
                    { t: "Pulmonary fibrosis", ok: false, why: "Fibrosis is restrictive." },
                    { t: "Pneumothorax", ok: false, why: "Pneumothorax is a pleural disorder." },
                    { t: "Acute respiratory distress syndrome", ok: false, why: "ARDS is acute and restrictive." },
                  ],
                  rationale: "COPD covers chronic bronchitis and emphysema; many patients have features of both, and some with long-standing asthma develop fixed obstruction that overlaps.",
                },
                {
                  id: "s5-t6",
                  type: "mc",
                  stem: "How does cigarette smoking increase the risk of developing COPD?",
                  options: [
                    { t: "It tips the protease–antiprotease balance and paralyzes cilia", ok: true, why: "Both the airway inflammation and the protease–antiprotease imbalance come from smoke." },
                    { t: "It causes an allergic IgE reaction in the alveoli", ok: false, why: "COPD is not an IgE-mediated allergy." },
                    { t: "It blocks the pulmonary arteries with small clots", ok: false, why: "That describes pulmonary embolism." },
                    { t: "It fills the pleural space with inflammatory fluid", ok: false, why: "That describes pleural effusion." },
                  ],
                  rationale: "Smoke: inflammation, proteases, cilia damage, mucus.",
                },
                {
                  id: "s5-t7",
                  type: "mc",
                  stem: "A client with an opioid overdose is breathing 6 times a minute. Arterial PaCO₂ is 62 mm Hg. What is true about this hypercapnia?",
                  options: [
                    { t: "It reflects hypoventilation and causes acidosis", ok: true, why: "Too little ventilation lets CO₂ build up, lowering pH." },
                    { t: "It results from rapid, deep hyperventilation", ok: false, why: "Hyperventilation lowers PaCO₂." },
                    { t: "It causes a respiratory alkalosis", ok: false, why: "Raised CO₂ causes respiratory acidosis, not alkalosis." },
                    { t: "It is within normal limits for an adult", ok: false, why: "Normal PaCO₂ is 35–45 mm Hg." },
                  ],
                  rationale: "CO₂ is cleared by ventilation; less breathing, more CO₂.",
                },
                {
                  id: "s5-t8",
                  type: "mc",
                  stem: "What is true about the pleural space?",
                  options: [
                    { t: "Its pressure is normally below atmospheric, which keeps the lungs expanded", ok: true, why: "Negative intrapleural pressure opposes the lung's elastic recoil." },
                    { t: "It normally contains air", ok: false, why: "It contains only a thin layer of fluid." },
                    { t: "Its pressure is normally higher than atmospheric", ok: false, why: "Positive pressure would collapse the lung." },
                    { t: "It is where gas exchange takes place", ok: false, why: "Gas exchange happens in the alveoli." },
                  ],
                  rationale: "Lose the negative pressure, lose the lung.",
                  level: "recall",
                },
                {
                  id: "s5-t9",
                  type: "mc",
                  stem: "What is true about acute respiratory distress syndrome (ARDS)?",
                  options: [
                    { t: "A leaky alveolar membrane causes hypoxemia that resists oxygen", ok: true, why: "Non-cardiogenic edema and collapsed alveoli create a shunt." },
                    { t: "It is caused by high pressure in the left atrium", ok: false, why: "That is cardiogenic pulmonary edema." },
                    { t: "It is a chronic, slowly progressive obstructive disease", ok: false, why: "ARDS is acute and restrictive." },
                    { t: "High-flow oxygen quickly corrects the hypoxemia", ok: false, why: "Refractory hypoxemia is a hallmark." },
                  ],
                  rationale: "ARDS: leaky membrane, stiff lungs, shunt.",
                },
                {
                  id: "s5-t10",
                  type: "mc",
                  stem: "What is a complication of long-standing pulmonary hypertension?",
                  options: [
                    { t: "Right ventricular failure (cor pulmonale)", ok: true, why: "The right ventricle must pump against high pulmonary pressures and eventually fails." },
                    { t: "Left ventricular hypertrophy and failure", ok: false, why: "The left ventricle pumps into the systemic circulation." },
                    { t: "Abdominal aortic aneurysm", ok: false, why: "Aortic aneurysms relate to systemic arterial disease." },
                    { t: "Late-onset asthma", ok: false, why: "Pulmonary hypertension does not cause asthma." },
                  ],
                  rationale: "Lung pressure up → right heart works harder → right heart fails.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

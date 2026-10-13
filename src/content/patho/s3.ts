import type { ASection } from "./author";

const T = "McCance & Huether, Pathophysiology";

export const s3: ASection = {
  id: "s3",
  num: 3,
  kind: "section",
  title: "Neurological System",
  blurb: "Stroke and TIA, brain injury and pressure, demyelinating and movement disorders, seizures, dementia, and changes in vision and hearing.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of neurological disorders.",
  source: `${T}: Alterations in cognitive systems, cerebral hemodynamics and motor function; Disorders of the central and peripheral nervous systems; Pain, temperature, sleep and sensory function.`,
  groups: [
    {
      id: "s3-intro-g",
      title: "Section Introduction",
      pages: [
        {
          id: "s3-intro",
          title: "Section Introduction",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The nervous system is the body's command center and its wiring. Some of its work you control, like walking across a room. Much of it runs on its own, like the reflex that pulls your foot off a sharp object before you have even felt the pain. When disease or injury strikes, what you see depends on <em>where</em> the damage is: the same small stroke can take away speech in one patient and the use of a hand in another.",
            },
            { t: "p", html: "Three patients run through this section." },
            { t: "case", title: "Walter, 67", html: "Walter's wife found him at breakfast unable to lift his right arm, with slurred speech and a drooping right face. He has high blood pressure and poorly controlled type 2 diabetes. Symptoms started 50 minutes ago." },
            { t: "case", title: "Rosa, 34", html: "Rosa has had multiple sclerosis for three years. This week her vision in one eye has blurred and her legs feel heavy and numb." },
            { t: "case", title: "Henry, 72", html: "Henry has not seen a clinician in years. He asks you to read a form to him because the words look blurry and there is glare from the window, and he keeps asking you to repeat yourself in the noisy waiting room." },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Distinguish ischemic from hemorrhagic stroke and a TIA from a stroke.",
                "Recognize rising intracranial pressure and the main types of brain injury and bleeding.",
                "Describe demyelinating, neuromuscular and movement disorders by where the problem sits.",
                "Describe seizures and dementia, and the common disorders of vision and hearing.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s3-l5",
      title: "Lesson 5: Neurological System Pathophysiology",
      pages: [
        {
          id: "s3-l5-intro",
          title: "Lesson 5: Neurological System Pathophysiology",
          kind: "reading",
          blocks: [
            { t: "h2", text: "Location predicts the picture" },
            {
              t: "table",
              head: ["Where", "What it does", "Damage shows as"],
              rows: [
                ["Left cerebral hemisphere", "Language (in most people), right side of the body", "Aphasia, right-sided weakness and numbness"],
                ["Right cerebral hemisphere", "Spatial awareness, left side of the body", "Neglect of the left side, poor judgment of space, left-sided weakness"],
                ["Brainstem", "Breathing, heart rate, consciousness, cranial nerves", "Reduced consciousness, abnormal breathing, swallowing problems"],
                ["Cerebellum", "Coordination and balance", "Unsteady gait (ataxia), clumsy movements"],
                ["Spinal cord", "Pathway between brain and body; reflexes", "Weakness and sensory loss below the level of injury; bladder and bowel problems"],
                ["Peripheral nerves", "Sensory and motor signals to the limbs", "Numbness, burning pain, weakness, usually starting in the feet"],
              ],
            },
            {
              t: "p",
              html: "Neurons need a constant supply of oxygen and glucose and store almost none. Within minutes of losing blood flow they stop working; with prolonged loss they die. That is why stroke care is measured in minutes.",
            },
            { t: "h2", text: "Learning objectives" },
            {
              t: "ul",
              items: [
                "Describe the pathogenesis of neurologic disorders and injury.",
                "Describe their manifestations.",
                "Explain complications and variations.",
                "Distinguish a transient ischemic attack and ischemic stroke from hemorrhagic stroke.",
              ],
            },
          ],
        },
        {
          id: "s3-l5-1",
          title: "Lesson 5.1: Pathogenesis of Neurologic Disorders and Injury",
          shortTitle: "Lesson 5.1: Stroke, TIA and Neuropathy",
          kind: "activity",
          blocks: [
            { t: "eq", text: "How do strokes and nerve injuries happen?" },
            { t: "read", items: [{ ref: "pp. 591–593: Cerebrovascular accidents", note: "Ischemic and hemorrhagic stroke and transient ischemic attack." }] },
            { t: "h2", text: "Two kinds of stroke" },
            {
              t: "table",
              head: ["", "Ischemic stroke (about 85% of strokes)", "Hemorrhagic stroke"],
              rows: [
                ["What happens", "A vessel is blocked and brain tissue loses blood flow", "A vessel ruptures and blood spills into or around the brain"],
                ["Main causes", "Thrombus on an atherosclerotic plaque; embolus from the heart (atrial fibrillation) or carotid artery; small-vessel (lacunar) disease", "Intracerebral: long-standing hypertension, anticoagulants. Subarachnoid: ruptured aneurysm or arteriovenous malformation"],
                ["Typical onset", "Sudden focal deficit; often on waking (thrombotic)", "Sudden severe headache (\"worst of my life\" with subarachnoid), vomiting, falling consciousness"],
                ["First test", "Non-contrast CT of the head, to rule out bleeding before any clot-dissolving treatment", "Non-contrast CT shows the blood"],
              ],
            },
            {
              t: "p",
              html: "Around the core of dead tissue in an ischemic stroke is the <strong>penumbra</strong>: brain that has stopped working but can still be saved if blood flow returns quickly. Clot-dissolving drugs and clot retrieval aim to rescue it, which is why the time the patient was last known well is recorded so carefully.",
            },
            {
              t: "p",
              html: "A <strong>transient ischemic attack (TIA)</strong> is a brief episode of focal symptoms from ischemia that resolves, usually within an hour, without infarction on imaging. It is a warning: the risk of a full stroke is highest in the days that follow.",
            },
            {
              t: "ul",
              items: [
                "<strong>Modifiable risk factors:</strong> hypertension (the most important), diabetes, smoking, atrial fibrillation, high cholesterol, obesity, inactivity, heavy alcohol use.",
                "<strong>Non-modifiable:</strong> older age, family history, prior stroke or TIA, sickle cell disease.",
              ],
            },
            {
              t: "callout",
              title: "Recognize a stroke: BE FAST",
              html: "<strong>B</strong>alance loss, <strong>E</strong>yes (vision loss), <strong>F</strong>ace drooping, <strong>A</strong>rm weakness, <strong>S</strong>peech difficulty, <strong>T</strong>ime to call for help and note when symptoms began.",
            },
            {
              t: "q",
              q: {
                id: "s3-c1",
                type: "mc",
                stem: "Walter (67) arrives with right arm weakness, slurred speech and right facial droop that began 50 minutes ago. Which action comes first?",
                options: [
                  { t: "Prepare him for an emergency non-contrast CT of the head", ok: true, why: "Imaging separates ischemic from hemorrhagic stroke. Clot-dissolving treatment is only safe once bleeding is ruled out." },
                  { t: "Give aspirin by mouth", ok: false, why: "Aspirin is withheld until a bleed is excluded, and his swallow has not been assessed." },
                  { t: "Lower his blood pressure to below 120/80 mm Hg", ok: false, why: "Rapid aggressive lowering can reduce flow to the penumbra. Targets depend on the stroke type and treatment." },
                  { t: "Schedule an MRI for tomorrow", ok: false, why: "He is within the treatment window; waiting a day loses the chance to save brain." },
                ],
                rationale: "Time is brain, and the CT decides what treatment is safe.",
              },
            },
            {
              t: "q",
              q: {
                id: "s3-c2",
                type: "ms",
                stem: "Which factors in Walter's history increase his risk of stroke? <strong>Choose 3 answers.</strong>",
                options: [
                  { t: "Age 67", ok: true, why: "Stroke risk rises steadily with age." },
                  { t: "Hypertension", ok: true, why: "Hypertension is the leading modifiable risk factor for both ischemic and hemorrhagic stroke." },
                  { t: "Poorly controlled diabetes", ok: true, why: "Diabetes accelerates atherosclerosis in large and small vessels." },
                  { t: "Symptoms on the right side", ok: false, why: "The side of the symptoms tells you where the stroke is, not why it happened." },
                  { t: "Being married", ok: false, why: "Marital status is not a stroke risk factor." },
                ],
                rationale: "Risk factors explain why it happened; the deficit tells you where.",
              },
            },
            { t: "h2", text: "Peripheral neuropathy" },
            {
              t: "p",
              html: "Peripheral neuropathy is damage to nerves outside the brain and spinal cord. The longest nerves are affected first, so symptoms start in the toes and feet and spread upward in a <strong>stocking-and-glove</strong> pattern: numbness, tingling, burning pain, then weakness and loss of reflexes.",
            },
            {
              t: "ul",
              items: [
                "<strong>Causes:</strong> diabetes (the most common), heavy alcohol use, vitamin B12 deficiency, chemotherapy, kidney failure, hypothyroidism, some infections and autoimmune disease.",
                "<strong>Complication:</strong> loss of protective sensation. A client who cannot feel a blister or a stone in the shoe can develop a foot ulcer, infection and, in diabetes, amputation. Daily foot inspection is the key teaching point.",
              ],
            },
          ],
        },
        {
          id: "s3-l5-2",
          title: "Lesson 5.2: Manifestations of Neurologic Disorders and Injury",
          shortTitle: "Lesson 5.2: Brain Injury, MS, Parkinson and More",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What signs and symptoms appear when the brain, spinal cord or nerves are injured or diseased?" },
            {
              t: "read",
              items: [
                { ref: "pp. 570–579: Traumatic brain injury", note: "Including the Glasgow Coma Scale and intracranial bleeding." },
                { ref: "pp. 536–537: Parkinson disease" },
                { ref: "pp. 557–563: Demyelinating disorders and neuromuscular junction disorders" },
              ],
            },
            { t: "h2", text: "Glasgow Coma Scale" },
            {
              t: "table",
              caption: "Add the best response in each category. Total 3 (deepest coma) to 15 (fully alert). A score of 8 or less is severe brain injury and usually means the airway needs protecting.",
              head: ["Category", "Points", "Best response"],
              rows: [
                ["Eye opening", "1–4", "4 spontaneous · 3 to voice · 2 to pain · 1 none"],
                ["Verbal", "1–5", "5 oriented · 4 confused · 3 inappropriate words · 2 sounds only · 1 none"],
                ["Motor", "1–6", "6 obeys commands · 5 localizes pain · 4 withdraws · 3 abnormal flexion · 2 extension · 1 none"],
              ],
            },
            { t: "h2", text: "Bleeding inside the skull" },
            {
              t: "table",
              head: ["", "Epidural hematoma", "Subdural hematoma"],
              rows: [
                ["Vessel", "Artery, usually the middle meningeal artery", "Bridging veins"],
                ["Typical cause", "Blow to the side of the head with a temporal bone fracture", "Acute: severe head injury. Chronic: minor or forgotten fall in an older adult, heavy alcohol use or anticoagulants"],
                ["Course", "Classically, brief loss of consciousness, then a <strong>lucid interval</strong> (not always present), then rapid decline within hours", "Acute: worsens over hours. Chronic: headache, confusion and drowsiness developing over days to weeks"],
                ["Urgency", "Neurosurgical emergency", "Acute is an emergency; chronic can be mistaken for dementia"],
              ],
            },
            { t: "h2", text: "Rising intracranial pressure" },
            {
              t: "p",
              html: "The skull is a closed box. When blood, swelling or a mass adds volume, pressure rises and blood flow to the brain falls. In order of appearance:",
            },
            {
              t: "ol",
              items: [
                "<strong>Falling level of consciousness</strong> (restlessness, confusion, drowsiness): the earliest and most sensitive sign.",
                "Headache, vomiting and a falling GCS.",
                "A dilating pupil on the side of the lesion, sluggish then fixed, as the oculomotor nerve is compressed.",
                "<strong>Cushing triad</strong>, a late sign: rising systolic pressure with a widening pulse pressure, slowing heart rate, and irregular breathing. Herniation of the brainstem may follow.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s3-c3",
                type: "mc",
                stem: "A cyclist was knocked out briefly after hitting the side of his head, then was talking normally for two hours. He now has a severe headache, is hard to rouse and his left pupil is dilated. A CT shows a temporal bone fracture. Which diagnosis is most likely?",
                options: [
                  { t: "Epidural hematoma", ok: true, why: "A temporal fracture tears the middle meningeal artery. Arterial bleeding gives a lucid interval and then rapid decline." },
                  { t: "Chronic subdural hematoma", ok: false, why: "Chronic subdurals develop over days to weeks from venous bleeding." },
                  { t: "Concussion", ok: false, why: "Concussion does not cause a dilating pupil or progressive decline." },
                  { t: "Ischemic stroke", ok: false, why: "Trauma, a fracture and a lucid interval point to bleeding, not a blocked vessel." },
                ],
                rationale: "Lucid interval + temporal fracture + rapid decline = epidural. Act fast.",
              },
            },
            { t: "h2", text: "Disorders sorted by where the problem is" },
            {
              t: "table",
              head: ["Disorder", "What goes wrong", "How it shows"],
              rows: [
                ["Multiple sclerosis", "Autoimmune destruction of myelin in the brain and spinal cord (CNS); plaques of scar tissue", "Usually women aged 20–40; relapses and remissions; blurred or painful vision (optic neuritis), double vision, numbness, weakness, fatigue, bladder problems; worse with heat"],
                ["Parkinson disease", "Loss of dopamine-producing neurons in the substantia nigra; too little dopamine relative to acetylcholine", "Resting \"pill-rolling\" tremor, rigidity, slow movement (bradykinesia), shuffling gait, masked face, small handwriting, falls"],
                ["Myasthenia gravis", "Antibodies block acetylcholine receptors at the neuromuscular junction", "Weakness that worsens with use and improves with rest; drooping eyelids and double vision are often first; risk of respiratory crisis"],
                ["Guillain-Barré syndrome", "Acute autoimmune demyelination of peripheral nerves, often after an infection", "Weakness that ascends from the legs over days, lost reflexes; can paralyze breathing muscles"],
                ["Amyotrophic lateral sclerosis", "Degeneration of upper and lower motor neurons", "Progressive weakness, muscle wasting and twitching, swallowing and breathing failure; sensation and thinking are usually spared"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s3-c4",
                type: "mc",
                stem: "A 66-year-old has developed a tremor of the right hand at rest that stops when he reaches for a cup, stiffness, and slow, shuffling steps. Which mechanism explains his symptoms?",
                options: [
                  { t: "Loss of dopamine-producing neurons in the substantia nigra", ok: true, why: "Resting tremor, rigidity and bradykinesia are the hallmarks of Parkinson disease." },
                  { t: "Antibodies against acetylcholine receptors", ok: false, why: "That is myasthenia gravis, which causes fatigable weakness, not tremor." },
                  { t: "Demyelination of central nerve fibers", ok: false, why: "That is multiple sclerosis; its tremor is an intention tremor, worse when reaching." },
                  { t: "A lesion in the cerebellum", ok: false, why: "Cerebellar disease causes tremor on movement and ataxia, not a resting tremor." },
                ],
                rationale: "Resting tremor that improves with movement points to the basal ganglia and dopamine.",
              },
            },
            {
              t: "open",
              id: "s3-o1",
              stem: "Rosa has MS and new blurred vision and numb, heavy legs. In your own words, explain why MS can cause such different symptoms in different people and at different times.",
              expert:
                "MS is an autoimmune attack on myelin in the brain, optic nerves and spinal cord. Demyelination slows or blocks conduction wherever a plaque forms, so the symptoms depend on where the lesions are: the optic nerve causes blurred or painful vision, the spinal cord causes numbness, weakness and bladder problems. New inflammation causes relapses; partial remyelination and reduced inflammation allow remissions, and repeated damage leaves lasting deficits.",
            },
          ],
        },
        {
          id: "s3-l5-3",
          title: "Lesson 5.3: Complications and Variations of Neurologic Disorders",
          shortTitle: "Lesson 5.3: Seizures, Dementia, Vision and Hearing",
          kind: "activity",
          blocks: [
            { t: "eq", text: "What complications and variations of neurologic disorders should you recognize, including changes in vision and hearing?" },
            {
              t: "read",
              items: [
                { ref: "pp. 492–497: Aging and vision", note: "Cataract, glaucoma, macular degeneration." },
                { ref: "pp. 498–500: Hearing", note: "Conductive and sensorineural loss, Ménière disease." },
              ],
            },
            { t: "h2", text: "Seizures" },
            {
              t: "p",
              html: "A seizure is a sudden burst of abnormal, synchronized electrical activity in neurons. <strong>Epilepsy</strong> means recurrent unprovoked seizures. A seizure is a symptom, so always ask what provoked it: low glucose, low sodium, fever in a young child, alcohol withdrawal, a stroke, a tumor, infection or head injury.",
            },
            {
              t: "table",
              head: ["Type", "What you see"],
              rows: [
                ["Focal", "Starts in one area. Twitching of one limb, odd sensations or staring with automatic movements (lip smacking); awareness may be kept or impaired."],
                ["Generalized tonic-clonic", "Loss of consciousness, stiffening (tonic) then jerking (clonic), possibly incontinence and tongue biting, followed by confusion and sleepiness (postictal)."],
                ["Absence", "Brief staring spells of a few seconds, usually in children, with no postictal confusion."],
                ["Status epilepticus", "A seizure lasting 5 minutes or longer, or repeated seizures without recovery between them. A medical emergency: brain injury, hypoxia and death risk."],
              ],
            },
            { t: "h2", text: "Dementia and delirium" },
            {
              t: "table",
              head: ["", "Alzheimer disease", "Vascular dementia", "Delirium"],
              rows: [
                ["Onset", "Gradual over years", "Often stepwise after strokes", "Sudden, over hours to days"],
                ["Mechanism", "Amyloid plaques and tau neurofibrillary tangles; loss of cholinergic neurons; brain atrophy", "Multiple small infarcts", "Acute brain dysfunction from illness, drugs, infection, dehydration or surgery"],
                ["Key feature", "Recent memory lost first, then language, judgment and self-care", "Depends on which areas are infarcted", "Fluctuating attention and awareness; often reversible when the cause is treated"],
              ],
            },
            {
              t: "callout",
              title: "Don't miss delirium",
              html: "A sudden change in an older adult's thinking is delirium until proven otherwise, even in someone with dementia. Look for infection (often urinary or respiratory), new medications, dehydration, low oxygen or a chronic subdural hematoma.",
            },
            { t: "h2", text: "Vision changes" },
            {
              t: "table",
              head: ["Disorder", "Mechanism", "What the client notices"],
              rows: [
                ["Cataract", "Clouding of the lens; age, diabetes, steroids, smoking, UV", "Gradual, painless blurring, glare and halos around lights, faded colors"],
                ["Open-angle glaucoma", "Raised intraocular pressure (poor drainage of aqueous humor) damages the optic nerve", "Painless, gradual loss of peripheral vision (\"tunnel vision\"); often unnoticed until late. Higher risk with age, Black ancestry, family history, diabetes"],
                ["Acute angle-closure glaucoma", "Sudden blockage of drainage; pressure rises fast", "Emergency: severe eye pain, headache, nausea, red eye, halos, blurred vision"],
                ["Age-related macular degeneration", "Damage to the macula; dry (drusen, atrophy) or wet (leaky new vessels)", "Loss of central vision, distorted straight lines; peripheral vision kept"],
                ["Diabetic retinopathy", "Damage to retinal small vessels; leaks and new fragile vessels", "Often none until late; floaters, blurred vision"],
              ],
            },
            { t: "h2", text: "Hearing changes" },
            {
              t: "table",
              head: ["Type", "Where", "Examples"],
              rows: [
                ["Conductive", "Outer or middle ear: sound cannot reach the inner ear", "Earwax impaction, otitis media with fluid, otosclerosis, perforated eardrum"],
                ["Sensorineural", "Inner ear (cochlea) or the auditory nerve", "Presbycusis (age-related, high frequencies first, trouble following speech in noise), noise exposure, ototoxic drugs such as aminoglycosides and loop diuretics"],
              ],
            },
            {
              t: "p",
              html: "<strong>Ménière disease</strong> is excess fluid (endolymph) in the inner ear. It causes episodes of a characteristic tetrad: <strong>vertigo</strong> lasting minutes to hours, <strong>fluctuating hearing loss</strong>, <strong>tinnitus</strong> and a feeling of <strong>fullness</strong> in the ear.",
            },
            {
              t: "q",
              q: {
                id: "s3-c5",
                type: "ms",
                stem: "Henry (72) reports blurred vision with glare from lights, and difficulty following conversation in noisy rooms. Which conditions are most likely? <strong>Choose 2 answers.</strong>",
                options: [
                  { t: "Cataract", ok: true, why: "Gradual painless blurring with glare is typical of lens clouding." },
                  { t: "Presbycusis", ok: true, why: "Age-related sensorineural loss affects high frequencies first, so speech in noise is hardest." },
                  { t: "Acute angle-closure glaucoma", ok: false, why: "That is sudden and painful, with a red eye." },
                  { t: "Ménière disease", ok: false, why: "Ménière disease causes episodes of vertigo and fluctuating hearing, not steady difficulty in noise." },
                  { t: "Macular degeneration", ok: false, why: "AMD causes loss of central vision and distortion rather than glare." },
                ],
                rationale: "Glare points to the lens; trouble with speech in noise points to high-frequency sensorineural loss.",
              },
            },
          ],
        },
        {
          id: "s3-l5-sum",
          title: "Lesson 5: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Take a moment to review" },
            {
              t: "ul",
              items: [
                "Ischemic stroke (most strokes) is a blocked vessel; hemorrhagic stroke is a ruptured one. A non-contrast CT comes first to rule out bleeding.",
                "A TIA resolves without infarction but warns of a stroke soon. Hypertension is the leading modifiable risk factor.",
                "Left-hemisphere stroke: right-sided weakness and aphasia. Right-hemisphere stroke: left-sided weakness and neglect.",
                "Peripheral neuropathy starts in the feet (stocking-glove); diabetes is the main cause; teach daily foot checks.",
                "GCS 3–15; 8 or less is severe. Falling consciousness is the earliest sign of rising ICP; Cushing triad is late.",
                "Epidural: arterial, temporal fracture, lucid interval, rapid decline. Subdural: venous; chronic form in older adults over weeks.",
                "MS demyelinates the CNS; Parkinson loses dopamine (resting tremor, rigidity, bradykinesia); myasthenia gravis blocks ACh receptors (fatigable weakness); Guillain-Barré ascends from the feet.",
                "Status epilepticus is 5 minutes or more. Delirium is sudden and fluctuating; dementia is gradual.",
                "Cataract: glare and blur. Open-angle glaucoma: peripheral loss. AMD: central loss. Presbycusis: high-frequency loss. Ménière: vertigo, fluctuating hearing loss, tinnitus, fullness.",
              ],
            },
            {
              t: "cards",
              id: "fc-l5",
              title: "Lesson 5 flashcards",
              cards: [
                ["First test in suspected stroke", "Non-contrast CT of the head, to rule out hemorrhage"],
                ["TIA", "Focal symptoms that resolve without infarction; high risk of stroke in the days after"],
                ["Leading modifiable stroke risk factor", "Hypertension"],
                ["Earliest sign of rising ICP", "Change in level of consciousness"],
                ["Cushing triad", "Rising systolic BP with wide pulse pressure, bradycardia, irregular breathing (late sign)"],
                ["Epidural hematoma clue", "Lucid interval after a temporal blow; arterial bleed"],
                ["GCS that signals severe injury", "8 or less"],
                ["Parkinson triad", "Resting tremor, rigidity, bradykinesia"],
                ["Myasthenia gravis weakness pattern", "Worse with use, better with rest; ptosis and diplopia often first"],
                ["Guillain-Barré pattern", "Ascending weakness with lost reflexes, often after infection"],
                ["Status epilepticus", "Seizure of 5 minutes or more, or repeated without recovery"],
                ["Open-angle glaucoma vs AMD", "Peripheral vision lost vs central vision lost"],
                ["Ménière tetrad", "Vertigo, fluctuating hearing loss, tinnitus, aural fullness"],
              ],
            },
          ],
        },
        {
          id: "s3-l5-quiz",
          title: "Lesson 5: Quiz",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on stroke, brain injury and neurologic disorders." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s3-q1",
                  type: "mc",
                  stem: "A client recovering from a hemorrhagic stroke asks how it differed from his neighbor's \"clot\" stroke. Which response is accurate?",
                  options: [
                    { t: "\"In your stroke a blood vessel burst and bled into the brain; in his, a vessel was blocked and brain tissue lost its blood supply.\"", ok: true, why: "That is the core difference between hemorrhagic and ischemic stroke." },
                    { t: "\"Both are caused by clots, but yours was larger.\"", ok: false, why: "Hemorrhagic stroke is bleeding, not a clot." },
                    { t: "\"Yours was a mini-stroke that will leave no damage.\"", ok: false, why: "That describes a TIA." },
                    { t: "\"His stroke could have been treated with clot-dissolving drugs, and so could yours.\"", ok: false, why: "Clot-dissolving drugs are contraindicated in hemorrhagic stroke; they would worsen the bleeding." },
                  ],
                  rationale: "Ischemic = blocked; hemorrhagic = bleeding. Treatment depends on which.",
                },
                {
                  id: "s3-q2",
                  type: "mc",
                  stem: "An 81-year-old who takes warfarin has become more confused and sleepy over three weeks. His daughter remembers he slipped in the bathroom a month ago. Which diagnosis is most likely?",
                  options: [
                    { t: "Chronic subdural hematoma", ok: true, why: "Slow venous bleeding after minor trauma, made worse by anticoagulation, causes gradual confusion in older adults." },
                    { t: "Epidural hematoma", ok: false, why: "Epidurals are arterial and cause decline within hours." },
                    { t: "Alzheimer disease", ok: false, why: "Alzheimer disease develops over years, not weeks, and has no link to a fall." },
                    { t: "Concussion", ok: false, why: "Concussion symptoms begin at the time of injury and improve." },
                  ],
                  rationale: "Older adult + anticoagulant + minor fall + weeks of decline = chronic subdural.",
                },
                {
                  id: "s3-q3",
                  type: "mc",
                  stem: "A 29-year-old woman reports drooping eyelids and double vision that are worse in the evening and better after rest. Which mechanism is most likely?",
                  options: [
                    { t: "Antibodies against acetylcholine receptors at the neuromuscular junction", ok: true, why: "Fatigable weakness of the eye muscles is the classic first sign of myasthenia gravis." },
                    { t: "Loss of dopamine-producing neurons", ok: false, why: "That is Parkinson disease, which causes tremor and rigidity." },
                    { t: "Ascending peripheral demyelination", ok: false, why: "Guillain-Barré causes rapidly ascending limb weakness." },
                    { t: "Degeneration of upper and lower motor neurons", ok: false, why: "ALS causes progressive weakness and wasting that does not improve with rest." },
                  ],
                  rationale: "Worse with use, better with rest: think neuromuscular junction.",
                },
                {
                  id: "s3-q4",
                  type: "mc",
                  stem: "A client with a head injury opens his eyes only to pain, makes incomprehensible sounds and withdraws from a painful stimulus. What is his Glasgow Coma Scale score?",
                  fixed: true,
                  options: [
                    { t: "6", ok: false, why: "Recount: eyes 2, verbal 2, motor 4." },
                    { t: "8", ok: true, why: "Eyes to pain 2 + sounds only 2 + withdraws 4 = 8, which is severe injury." },
                    { t: "10", ok: false, why: "This overcounts the verbal or motor score." },
                    { t: "12", ok: false, why: "This would require him to open his eyes to voice and speak words." },
                  ],
                  rationale: "A GCS of 8 or less means severe injury; protecting the airway becomes a priority.",
                },
                {
                  id: "s3-q5",
                  type: "mc",
                  stem: "A client recovering from a large left-hemisphere stroke asks what long-term problem he may face. Which complication should the provider explain is most likely?",
                  options: [
                    { t: "Aphasia with right-sided weakness", ok: true, why: "In most people language centers are in the left hemisphere, which also controls the right side of the body." },
                    { t: "Neglect of the left side of his body", ok: false, why: "Neglect is typical of right-hemisphere damage." },
                    { t: "Hearing loss in both ears", ok: false, why: "A one-sided cerebral stroke does not usually cause bilateral deafness." },
                    { t: "A resting tremor of the hands", ok: false, why: "Resting tremor comes from basal ganglia dopamine loss." },
                  ],
                  rationale: "Left brain: language and the right body. Right brain: space and the left body.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s3-sum-g",
      title: "Section 3: Summary",
      pages: [
        {
          id: "s3-sum",
          title: "Section 3: Summary",
          kind: "summary",
          blocks: [
            { t: "h2", text: "Section review" },
            {
              t: "p",
              html: "Walter showed how a blocked vessel becomes a deficit you can map to one side of the brain, and why imaging decides treatment. Rosa showed how an autoimmune attack on myelin produces symptoms that depend on where it strikes. Henry showed the quiet sensory losses of aging that are easy to miss but change how a client takes in information. Across all three, location predicts the picture.",
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I tell ischemic from hemorrhagic stroke, and a TIA from a stroke?",
                "Can I score a GCS and list the signs of rising ICP in order?",
                "Can I tell an epidural from a subdural hematoma?",
                "Can I match MS, Parkinson disease, myasthenia gravis and Guillain-Barré to where the problem is?",
                "Can I tell delirium from dementia, and name the vision and hearing disorders by what the client notices?",
              ],
            },
            { t: "callout", title: "If you answered no to any question", html: "Return to that lesson page and retry its learning checks. Then take the section test." },
          ],
        },
      ],
    },
    {
      id: "s3-test-g",
      title: "Section 3: Test",
      pages: [
        {
          id: "s3-test",
          title: "Section 3: Test",
          kind: "test",
          blocks: [
            { t: "p", html: "Ten questions covering Lesson 5. Answer every question, then submit. Your score and all rationales appear after you submit." },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s3-t1",
                  type: "mc",
                  stem: "A client had 20 minutes of left arm weakness and slurred speech that fully resolved. CT and MRI show no infarct. What should the provider tell the client?",
                  options: [
                    { t: "\"This was a TIA, a warning sign. Stroke risk is highest in the next few days, so we will find the cause now.\"", ok: true, why: "A TIA resolves without infarction but carries a high early stroke risk." },
                    { t: "\"Because your symptoms went away completely, no further testing is needed.\"", ok: false, why: "A TIA needs urgent workup: carotid imaging, heart rhythm and risk factors." },
                    { t: "\"This was a small hemorrhagic stroke that has already stopped bleeding.\"", ok: false, why: "Imaging shows no bleeding or infarct." },
                    { t: "\"A TIA leaves permanent brain damage that will show up on scans later.\"", ok: false, why: "By definition there is no infarction." },
                  ],
                  rationale: "Treat a TIA as an emergency warning, not a relief.",
                },
                {
                  id: "s3-t2",
                  type: "mc",
                  stem: "A client with a head injury has become more restless and confused over the last hour. Blood pressure and heart rate are unchanged. What does this most likely indicate?",
                  options: [
                    { t: "Early, mildly raised intracranial pressure", ok: true, why: "A change in level of consciousness is the earliest sign of rising ICP." },
                    { t: "Normal recovery after a head injury", ok: false, why: "Worsening restlessness and confusion is not expected recovery." },
                    { t: "Late brainstem herniation", ok: false, why: "Herniation brings Cushing triad and fixed pupils; these are late signs." },
                    { t: "Anxiety about being in hospital", ok: false, why: "Attributing it to anxiety risks missing deterioration." },
                  ],
                  rationale: "Consciousness changes first; vital sign changes come late.",
                },
                {
                  id: "s3-t3",
                  type: "ms",
                  stem: "Which findings are typical of multiple sclerosis? <strong>Choose 3 answers.</strong>",
                  options: [
                    { t: "Blurred, painful vision in one eye", ok: true, why: "Optic neuritis is a common first presentation." },
                    { t: "Symptoms that come and go in relapses", ok: true, why: "Relapsing-remitting MS is the most common form." },
                    { t: "Symptoms that worsen after a hot shower", ok: true, why: "Heat slows conduction in demyelinated nerves." },
                    { t: "A resting pill-rolling tremor", ok: false, why: "That is Parkinson disease." },
                    { t: "Weakness that starts in the feet and climbs over a few days after a diarrheal illness", ok: false, why: "That is Guillain-Barré syndrome." },
                  ],
                  rationale: "MS: young adult, CNS lesions in different places at different times, heat-sensitive.",
                },
                {
                  id: "s3-t4",
                  type: "mc",
                  stem: "Which client with diabetes is showing the typical pattern of peripheral neuropathy?",
                  options: [
                    { t: "Burning and numbness in both feet that has slowly crept up to the ankles", ok: true, why: "The longest nerves are affected first, giving a symmetric stocking distribution." },
                    { t: "Sudden weakness of one side of the face", ok: false, why: "Sudden one-sided facial weakness suggests stroke or Bell palsy." },
                    { t: "Numbness of the thumb and first two fingers of one hand", ok: false, why: "That fits median nerve compression (carpal tunnel)." },
                    { t: "Double vision at the end of the day", ok: false, why: "That suggests myasthenia gravis." },
                  ],
                  rationale: "Symmetric, distal, starting in the feet: length-dependent neuropathy.",
                },
                {
                  id: "s3-t5",
                  type: "mc",
                  stem: "A client's seizure began 6 minutes ago and has not stopped. How should this be understood?",
                  options: [
                    { t: "Status epilepticus, an emergency that needs immediate treatment", ok: true, why: "A seizure lasting 5 minutes or more is status epilepticus." },
                    { t: "A typical tonic-clonic seizure that will stop on its own", ok: false, why: "Most seizures stop within 2–3 minutes; waiting longer risks brain injury." },
                    { t: "An absence seizure", ok: false, why: "Absence seizures last seconds." },
                    { t: "The postictal phase", ok: false, why: "The postictal phase follows the seizure; this one is still going." },
                  ],
                  rationale: "Five minutes is the threshold for treating a seizure as status epilepticus.",
                },
                {
                  id: "s3-t6",
                  type: "mc",
                  stem: "An 84-year-old with mild dementia became suddenly confused yesterday, is drowsy one hour and agitated the next, and has a new fever. Which explanation is most likely?",
                  options: [
                    { t: "Delirium from an acute illness such as an infection", ok: true, why: "Sudden, fluctuating confusion with a fever points to delirium, which is often reversible." },
                    { t: "Normal progression of Alzheimer disease", ok: false, why: "Alzheimer disease progresses over months to years, not overnight." },
                    { t: "Vascular dementia", ok: false, why: "Vascular dementia is stepwise but does not fluctuate hour to hour with fever." },
                    { t: "Presbycusis", ok: false, why: "Hearing loss does not cause sudden confusion and fever." },
                  ],
                  rationale: "Sudden change in thinking = look for the medical cause.",
                },
                {
                  id: "s3-t7",
                  type: "mc",
                  stem: "When asked to describe her vision, what does the provider expect to hear from a client with advanced open-angle glaucoma?",
                  options: [
                    { t: "\"It's like looking through a tube. I bump into things on the sides.\"", ok: true, why: "Open-angle glaucoma destroys peripheral vision first." },
                    { t: "\"The middle of what I look at is blurry and straight lines look wavy.\"", ok: false, why: "That describes macular degeneration." },
                    { t: "\"Everything looks cloudy and headlights have halos.\"", ok: false, why: "That describes cataract." },
                    { t: "\"My eye suddenly became very painful and red.\"", ok: false, why: "That describes acute angle-closure glaucoma." },
                  ],
                  rationale: "Glaucoma takes the edges; macular degeneration takes the center.",
                },
                {
                  id: "s3-t8",
                  type: "mc",
                  stem: "A client has episodes of spinning vertigo lasting a few hours, ringing in the left ear, a sense of fullness, and hearing in that ear that comes and goes. Which diagnosis is most consistent with these signs?",
                  options: [
                    { t: "Ménière disease", ok: true, why: "Episodic vertigo, fluctuating hearing loss, tinnitus and fullness is the classic tetrad." },
                    { t: "Presbycusis", ok: false, why: "Presbycusis is gradual, bilateral and does not cause vertigo." },
                    { t: "Otosclerosis", ok: false, why: "Otosclerosis causes gradual conductive loss without vertigo." },
                    { t: "Cerumen impaction", ok: false, why: "Wax causes muffled hearing, not episodic vertigo." },
                  ],
                  rationale: "Vertigo plus fluctuating hearing plus tinnitus plus fullness = Ménière.",
                },
                {
                  id: "s3-t9",
                  type: "mc",
                  stem: "A client is admitted with a sudden, severe headache he calls \"the worst of my life,\" vomiting and a stiff neck. Which cause is most likely?",
                  options: [
                    { t: "Subarachnoid hemorrhage from a ruptured aneurysm", ok: true, why: "A thunderclap headache with meningeal irritation is the classic presentation." },
                    { t: "Lacunar ischemic stroke", ok: false, why: "Small-vessel strokes cause focal deficits, usually without severe headache." },
                    { t: "Migraine", ok: false, why: "Migraine builds more gradually; a first-ever thunderclap headache must be treated as a bleed." },
                    { t: "Multiple sclerosis relapse", ok: false, why: "MS relapses cause neurologic deficits, not a thunderclap headache." },
                  ],
                  rationale: "Worst headache of life, sudden onset: rule out subarachnoid hemorrhage.",
                },
                {
                  id: "s3-t10",
                  type: "mc",
                  stem: "A client with a severe head injury has a blood pressure of 188/70 mm Hg (previously 130/80), heart rate 48 and irregular breathing. What do these findings indicate?",
                  options: [
                    { t: "Cushing triad from severely raised ICP", ok: true, why: "Widening pulse pressure, bradycardia and irregular respirations signal impending herniation." },
                    { t: "Hypovolemic shock from hidden bleeding", ok: false, why: "Shock causes low blood pressure and a fast heart rate." },
                    { t: "An expected stress response to pain", ok: false, why: "Bradycardia with rising pressure is not a normal stress response." },
                    { t: "Early, mildly raised intracranial pressure", ok: false, why: "These vital sign changes are late; consciousness changes come first." },
                  ],
                  rationale: "Cushing triad means the brainstem is under pressure. This is an emergency.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

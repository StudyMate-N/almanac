import type { ASection } from "./author";
import { l33 } from "./s2-kept";

// Section 2 rebuilt to course standard v1: one page per topic. Question and card ids unchanged.
// Items marked "REVIEW" need owner approval in the review screen.
const T = "McCance & Huether, Pathophysiology";

export const s2: ASection = {
  id: "s2",
  num: 2,
  kind: "section",
  title: "Musculoskeletal and Integumentary Systems",
  blurb: "Bone, joint and muscle disorders and their complications; skin cancer, burns, lesions and infections.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of musculoskeletal and integumentary disorders.",
  source: `${T}: Structure and function of the musculoskeletal system; Alterations of musculoskeletal function; Structure, function and disorders of the integument.`,
  groups: [
    {
      id: "s2-topics",
      title: "Topics",
      pages: [
        {
          id: "s2-tp0",
          title: "2.0 Meet Grace",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "Bone, muscle and skin are the body's frame and its outer wall. They look sturdy, but all three are living tissue that is constantly broken down and rebuilt. When an injury or disease outpaces that repair, the damage rarely stays local: a crushed muscle can shut down the kidneys, and a large burn can empty the circulation.",
            },
            { t: "p", html: "Three patients run through this section." },
            {
              t: "case",
              title: "Grace, 71",
              html: "Grace has lost 4 cm of height over five years and now has a rounded upper back. She fell from standing and has wrist pain and swelling. She has taken prednisone for asthma on and off for a decade.",
            },
            {
              t: "case",
              title: "Marcus, 23",
              html: "Marcus is a firefighter recruit with severe thigh pain after an extreme training day in the heat. You will meet him again in Lesson 3.3.",
            },
            {
              t: "case",
              title: "Daniel, 41",
              html: "Daniel was burned in a kitchen fire. His head and neck, the front of his chest and abdomen, and the whole of his right arm are burned. Some areas are blistered and very painful; others are white, leathery and painless.",
            },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Describe how common bone, joint and muscle disorders and injuries develop and how they show up.",
                "Recognize the complications of musculoskeletal trauma early, including compartment syndrome, rhabdomyolysis and fat embolism.",
                "Compare the three main skin cancers, classify a burn by depth and extent, and explain the fluid shift that follows a major burn.",
                "Identify common skin lesions, infections, infestations and pigment disorders.",
              ],
            },
            {
              t: "callout",
              title: "How each lesson is organized",
              html: "Every body-system lesson asks the same four questions about a disorder: how it develops (<strong>pathogenesis</strong>), how it shows up (<strong>manifestations</strong>), what it can lead to (<strong>complications</strong>), and how it differs between patients (<strong>variations</strong>). Use them as your checklist when you study any disorder.",
            },
          ],
        },
        {
          id: "s2-tp1",
          title: "2.1 Fractures and sprains",
          kind: "topic",
          blocks: [
            {
              t: "eq",
              text: "How do bone and soft-tissue injuries happen, and why do some bones break from forces that should not break them?",
            },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Fractures are described by skin (open or closed), completeness, the fracture line and cause. A fragility fracture is normal force on weak bone.",
                "Sprain = ligament; strain = muscle or tendon. Grade sprains I to III by how much is torn.",
                "Compartment syndrome: pain out of proportion and pain on passive stretch.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p1",
              stem: "An ankle injury tears a ligament. Is it a sprain or a strain?",
              options: [{ id: "a", text: "Sprain" }, { id: "b", text: "Strain" }],
              correct: "a",
              reveal: "Sprain = ligament. Strain = muscle or tendon.",
            },
            { t: "h2", text: "Bone is living tissue" },
            {
              t: "p",
              html: "Bone is remodeled all through life. Old bone is removed and new bone is laid down in small units across the skeleton, so that roughly a tenth of the adult skeleton is replaced each year. Two cell types do the work:",
            },
            {
              t: "table",
              head: ["Cell", "Job", "Memory aid"],
              rows: [
                [
                  "Osteoclast",
                  "Resorbs (dissolves) bone, releasing calcium and phosphate into the blood",
                  "Osteo<strong>c</strong>lasts <strong>c</strong>ut",
                ],
                [
                  "Osteoblast",
                  "Builds new bone matrix (osteoid) and mineralizes it",
                  "Osteo<strong>b</strong>lasts <strong>b</strong>uild",
                ],
                [
                  "Osteocyte",
                  "A mature osteoblast trapped in bone; senses mechanical load and signals remodeling",
                  "Load-bearing exercise keeps bone strong",
                ],
              ],
            },
            { t: "h2", text: "The hormones that set the balance" },
            {
              t: "table",
              head: ["Hormone", "Trigger", "Effect on bone and blood calcium"],
              rows: [
                [
                  "Parathyroid hormone (PTH)",
                  "Low blood calcium",
                  "Increases osteoclast activity, kidney calcium reabsorption and activation of vitamin D. Blood calcium rises.",
                ],
                [
                  "Vitamin D (calcitriol)",
                  "Activated by the kidney under PTH",
                  "Increases calcium and phosphate absorption from the gut, so new bone can be mineralized.",
                ],
                [
                  "Calcitonin",
                  "High blood calcium",
                  "Inhibits osteoclasts. Blood calcium falls. Its role in adults is small.",
                ],
                ["Estrogen and testosterone", "—", "Restrain osteoclasts. Falling estrogen at menopause speeds bone loss."],
              ],
            },
            {
              t: "callout",
              title: "Why this matters for the rest of the lesson",
              html: "Osteoporosis is too little bone. Osteomalacia and rickets are bone that is not mineralized properly, usually from a lack of vitamin D. Paget disease is remodeling that runs too fast and too chaotically. Each one is a different failure of the same cycle.",
            },
            {
              t: "case",
              title: "Grace, 71",
              html: "Grace fell from standing onto an outstretched hand. Her wrist is swollen and angled like the back of a dinner fork. She has a rounded upper back and has lost height. She has taken steroids on and off for ten years.",
            },
            { t: "h2", text: "Classifying fractures" },
            {
              t: "table",
              head: ["Term", "What it means"],
              rows: [
                ["Closed", "The skin is intact."],
                ["Open (compound)", "Bone has broken through the skin. High risk of infection, including osteomyelitis."],
                ["Complete", "The break goes all the way through the bone."],
                [
                  "Incomplete (greenstick)",
                  "The bone bends and cracks on one side only. Typical in children, whose bones are more flexible.",
                ],
                ["Comminuted", "The bone is broken into three or more fragments."],
                [
                  "Transverse, oblique, spiral",
                  "Describe the line of the break. A spiral fracture comes from a twisting force; in a young child who is not yet walking it should raise concern for abuse.",
                ],
                ["Avulsion", "A tendon or ligament pulls off a fragment of bone."],
                ["Compression", "The bone is crushed, typically a vertebral body in osteoporosis."],
                ["Stress (fatigue)", "Repeated loading of normal bone, as in a runner or military recruit."],
                ["Pathologic (fragility)", "Normal force breaks abnormal bone: osteoporosis, a bone tumor or metastasis."],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-fracture-types",
              alt: "Five fracture patterns on a long bone: transverse, oblique, spiral, comminuted into several pieces, and greenstick broken on one side only.",
              panels: [
                { label: "Transverse", sub: "Straight across" },
                { label: "Oblique", sub: "Diagonal" },
                { label: "Spiral", sub: "Twists around" },
                { label: "Comminuted", sub: "Three or more pieces" },
                { label: "Greenstick", sub: "Child, one side only" },
              ],
              aspect: "3:1",
            },
            {
              t: "p",
              html: "Bone heals in overlapping stages: a <strong>hematoma</strong> forms at the break, inflammation brings in cells, a soft <strong>callus</strong> of cartilage and fibrous tissue bridges the gap, it is replaced by a hard bony callus, and the bone is <strong>remodeled</strong> to its original shape over months. Smoking, diabetes, steroids, poor nutrition and poor blood supply all slow healing.",
            },
            { t: "h2", text: "Soft-tissue injuries" },
            {
              t: "table",
              head: ["Injury", "What is damaged", "Key features"],
              rows: [
                [
                  "Sprain",
                  "Ligament (bone to bone)",
                  "Grade I: stretched, microscopic tears. Grade II: partial tear, some instability. Grade III: complete tear, joint unstable.",
                ],
                [
                  "Strain",
                  "Muscle or tendon (muscle to bone)",
                  "Overstretching or forceful contraction. Pain on using the muscle.",
                ],
                [
                  "Dislocation",
                  "Joint surfaces fully out of contact",
                  "Deformity, loss of motion. Risk to nearby nerves and vessels; check distal pulses and sensation.",
                ],
                ["Subluxation", "Joint surfaces partly out of contact", "Partial displacement; may reduce on its own."],
                [
                  "Bursitis",
                  "Inflamed bursa (fluid sac that cushions a joint)",
                  "Local pain and swelling with repetitive use or pressure: shoulder, elbow, hip, knee.",
                ],
                ["Tendinopathy", "Tendon (\"tendinitis\")", "Pain with use, often from overuse."],
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c2",
                type: "mc",
                stem: "A volleyball player rolled her ankle. The ligament is partly torn and the joint feels slightly unstable when the provider tests it. How is this injury classified?",
                options: [
                  {
                    t: "Grade II sprain",
                    ok: true,
                    why: "A partial tear of a ligament with some instability is a grade II sprain.",
                  },
                  { t: "Grade I sprain", ok: false, why: "Grade I is a stretch with microscopic tears and no instability." },
                  {
                    t: "Grade III strain",
                    ok: false,
                    why: "A strain involves muscle or tendon, not ligament. Grade III also means a complete tear.",
                  },
                  {
                    t: "Subluxation",
                    ok: false,
                    why: "Subluxation is partial displacement of the joint surfaces, not a ligament tear.",
                  },
                ],
                rationale: "Ligament = sprain; muscle or tendon = strain. Then grade by how much of the structure is torn.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s2-open1",
              stem: "Why is pain on passive stretch an early warning in compartment syndrome?",
              expert: "Swelling raises pressure inside a closed muscle compartment until blood flow is cut off. Stretching the ischemic muscle raises the pressure further, so pain out of proportion or on passive stretch appears before pulses are lost.",
            },
            // REVIEW: page numbers needed
            { t: "read", items: [{ ref: "pp. ___: Fractures and soft-tissue injuries" }] },
          ],
        },
        {
          id: "s2-tp2",
          title: "2.2 Osteoporosis and bone disorders",
          kind: "topic",
          blocks: [
            // REVIEW: new
            { t: "eq", text: "Why do some bones break from forces that should not break them?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Osteoclasts resorb bone; osteoblasts build it. PTH raises blood calcium, vitamin D lets bone mineralize, estrogen restrains bone loss.",
                "Osteoporosis is too little bone (T-score −2.5 or lower). Osteomalacia and rickets are poorly mineralized bone. Paget disease is chaotic remodeling with a very high alkaline phosphatase.",
                "A fragility fracture is normal force on weak bone.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p2",
              stem: "After menopause, does bone loss speed up or slow down?",
              options: [{ id: "a", text: "It speeds up" }, { id: "b", text: "It slows down" }],
              correct: "a",
              reveal: "Estrogen restrains bone resorption. When it falls, osteoclasts outpace osteoblasts and bone is lost faster.",
            },
            { t: "h2", text: "Osteoporosis: too little bone" },
            {
              t: "p",
              html: "In osteoporosis, resorption outpaces formation. Bone mass and quality fall, the bone is normally mineralized but there is less of it, and it breaks under ordinary loads. It is silent until the first fracture.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-osteoporosis",
              alt: "Spongy bone, dense and well connected in normal bone, thin and broken with large gaps in osteoporosis.",
              panels: [{ label: "Normal bone", sub: "Dense trabeculae" }, { label: "Osteoporosis", sub: "Thin, sparse, broken" }],
              aspect: "3:2",
            },
            {
              t: "ul",
              items: [
                "<strong>Risk factors:</strong> female sex and menopause (loss of estrogen), older age, long-term glucocorticoids, low calcium or vitamin D intake, smoking, heavy alcohol use, low body weight, inactivity, family history, and some drugs such as long-term heparin and certain anticonvulsants.",
                "<strong>Diagnosis:</strong> bone density by DEXA scan. A T-score of −2.5 or lower is osteoporosis; between −1.0 and −2.5 is osteopenia (low bone mass).",
                "<strong>Typical fractures:</strong> vertebral compression fractures (height loss and kyphosis), hip fracture, and distal radius fracture from a fall on an outstretched hand.",
              ],
            },
            {
              t: "callout",
              title: "Steroids and bone",
              html: "Glucocorticoids slow osteoblasts, speed osteoclasts and reduce calcium absorption from the gut. Long-term use is the most common cause of secondary osteoporosis, which is why Grace's history matters.",
            },
            {
              t: "q",
              q: {
                id: "s2-c3",
                type: "ms",
                stem: "Which factors in Grace's history raise her risk of a fragility fracture? <strong>Choose 3 answers.</strong>",
                options: [
                  {
                    t: "Age 71 and postmenopausal",
                    ok: true,
                    why: "Estrogen loss after menopause accelerates bone resorption, and bone mass falls with age.",
                  },
                  {
                    t: "Ten years of intermittent prednisone",
                    ok: true,
                    why: "Glucocorticoids reduce bone formation and increase resorption.",
                  },
                  {
                    t: "Height loss with a rounded upper back",
                    ok: true,
                    why: "These suggest existing vertebral compression fractures, and one fracture predicts more.",
                  },
                  { t: "Regular weight-bearing walks", ok: false, why: "Weight-bearing exercise protects bone." },
                  {
                    t: "A diet with plenty of dairy and vitamin D",
                    ok: false,
                    why: "Adequate calcium and vitamin D protect bone.",
                  },
                ],
                rationale: "Look for the drivers of resorption (estrogen loss, steroids) and evidence of fractures that have already happened.",
                level: "application",
              },
            },
            { t: "h2", text: "Three bone disorders that are easy to mix up" },
            {
              t: "table",
              head: ["", "Osteoporosis", "Osteomalacia and rickets", "Paget disease of bone"],
              rows: [
                [
                  "The problem",
                  "Too little bone; what is there is normally mineralized",
                  "Bone matrix is not mineralized, so bone is soft",
                  "Remodeling is too fast and disorganized: overactive osteoclasts, then chaotic new bone",
                ],
                [
                  "Usual cause",
                  "Estrogen loss, age, steroids",
                  "Vitamin D deficiency (or poor phosphate)",
                  "Unknown; genetic and possibly viral factors",
                ],
                ["Who", "Older adults, especially women", "Rickets in children; osteomalacia in adults", "Usually over 55"],
                [
                  "Signs",
                  "None until a fracture; height loss, kyphosis",
                  "Bone pain and tenderness, muscle weakness; in children, bowed legs and delayed growth",
                  "Bone pain, enlarged skull, bowed long bones, hearing loss if the skull is involved",
                ],
                [
                  "Labs",
                  "Calcium, phosphate and alkaline phosphatase usually normal",
                  "Low or low-normal calcium and phosphate, high alkaline phosphatase, high PTH",
                  "Very high alkaline phosphatase with normal calcium and phosphate",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "open",
              id: "s2-open2",
              stem: "How is osteoporosis different from osteomalacia?",
              expert: "Osteoporosis is too little bone that is normally mineralized. Osteomalacia is bone that is present but poorly mineralized, so it is soft.",
            },
            // REVIEW: page numbers needed
            { t: "read", items: [{ ref: "pp. ___: Osteoporosis, osteomalacia and Paget disease" }] },
          ],
        },
        {
          id: "s2-tp3",
          title: "2.3 Joint and spine disorders",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do degenerative, metabolic and inflammatory disorders of bones and joints show up, and how do you tell look-alikes apart?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "OA: cartilage wear, asymmetric, brief stiffness, Heberden and Bouchard nodes. RA: autoimmune, symmetric small joints, long morning stiffness, systemic symptoms.",
                "Carpal tunnel compresses the median nerve: thumb to half the ring finger, worse at night.",
                "Lumbar herniation causes sciatica; saddle numbness or bladder changes mean cauda equina syndrome.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p3",
              stem: "Which arthritis causes morning stiffness lasting over an hour?",
              options: [{ id: "a", text: "Rheumatoid arthritis" }, { id: "b", text: "Osteoarthritis" }],
              correct: "a",
              reveal: "RA is autoimmune inflammation of the synovium, so stiffness lasts long. OA stiffness is brief.",
            },
            { t: "h2", text: "Osteoarthritis and rheumatoid arthritis" },
            {
              t: "table",
              head: ["", "Osteoarthritis (OA)", "Rheumatoid arthritis (RA)"],
              rows: [
                [
                  "Cause",
                  "Degeneration of articular cartilage; \"wear and repair\" with age, obesity, injury",
                  "Autoimmune inflammation of the synovium",
                ],
                [
                  "Joints",
                  "Weight-bearing joints (knees, hips, spine) and the DIP and PIP joints of the hands; often asymmetric",
                  "Small joints of hands and feet (MCP, PIP, wrists); symmetric; usually spares the DIP joints",
                ],
                [
                  "Stiffness",
                  "Brief morning stiffness (under 30 minutes); pain worse with use, better with rest",
                  "Morning stiffness lasting an hour or more; improves with movement",
                ],
                [
                  "Hands",
                  "Heberden nodes (DIP) and Bouchard nodes (PIP): bony enlargements",
                  "Swollen, warm, boggy joints; later ulnar deviation, swan-neck and boutonnière deformities",
                ],
                [
                  "Whole body",
                  "No systemic illness",
                  "Fatigue, low-grade fever, weight loss, anemia, nodules; can affect lungs, heart, eyes",
                ],
                ["Labs", "Normal inflammatory markers", "Rheumatoid factor and anti-CCP antibodies; raised ESR and CRP"],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-oa-vs-ra",
              alt: "A finger joint: normal; osteoarthritis with worn cartilage and bony spurs; rheumatoid arthritis with thick inflamed lining eroding the joint.",
              panels: [
                { label: "Normal joint", sub: "Smooth cartilage" },
                { label: "Osteoarthritis", sub: "Worn cartilage, spurs" },
                { label: "Rheumatoid arthritis", sub: "Inflamed synovium, erosions" },
              ],
              aspect: "3:1",
            },
            {
              t: "callout",
              title: "Pannus",
              html: "In RA, inflamed synovium thickens into a <strong>pannus</strong> that grows over the cartilage and erodes cartilage and bone. That erosion causes the deformities.",
            },
            {
              t: "q",
              q: {
                id: "s2-c4",
                type: "mc",
                stem: "A 38-year-old client reports two months of painful, swollen knuckles and wrists on both hands, with stiffness that lasts about two hours each morning. She feels tired and has lost weight. Which condition is most likely?",
                options: [
                  {
                    t: "Rheumatoid arthritis",
                    ok: true,
                    why: "Symmetric small-joint swelling, long morning stiffness and systemic symptoms in a younger woman point to RA.",
                  },
                  {
                    t: "Osteoarthritis",
                    ok: false,
                    why: "OA stiffness is brief, it is not systemic, and it favors weight-bearing joints and the DIPs.",
                  },
                  {
                    t: "Carpal tunnel syndrome",
                    ok: false,
                    why: "Carpal tunnel causes numbness in the median nerve distribution, not swollen joints.",
                  },
                  {
                    t: "Gout",
                    ok: false,
                    why: "Gout usually attacks one joint suddenly, classically the base of the big toe.",
                  },
                ],
                rationale: "Duration of morning stiffness and systemic symptoms are the quickest way to separate RA from OA.",
                level: "application",
              },
            },
            { t: "h2", text: "Nerve compression: carpal tunnel syndrome" },
            {
              t: "p",
              html: "The median nerve passes through the carpal tunnel at the wrist with the flexor tendons. Swelling inside the tunnel (repetitive wrist flexion, pregnancy, hypothyroidism, diabetes, RA) compresses the nerve. Expect numbness and tingling in the thumb, index, middle and half of the ring finger, often worse at night. Tapping over the nerve (Tinel sign) or holding the wrists flexed (Phalen test) reproduces the tingling. Long-standing compression causes weakness and wasting of the thenar muscles at the base of the thumb.",
            },
            { t: "h2", text: "The spine" },
            {
              t: "table",
              head: ["Condition", "What you see"],
              rows: [
                [
                  "Kyphosis",
                  "Exaggerated outward (posterior) curve of the thoracic spine: a rounded upper back. Common with osteoporotic compression fractures.",
                ],
                ["Lordosis", "Exaggerated inward curve of the lumbar spine: swayback. Seen in pregnancy and obesity."],
                [
                  "Scoliosis",
                  "Lateral (sideways) curvature, often with rotation. Uneven shoulders or hips; a rib hump when the child bends forward.",
                ],
              ],
            },
            {
              t: "p",
              html: "<strong>Degenerative disk disease.</strong> With age the intervertebral disks lose water and height. The tough outer ring (annulus fibrosus) can tear, and the soft center (nucleus pulposus) can herniate and press on a nerve root.",
            },
            {
              t: "table",
              head: ["", "Lumbar disk herniation", "Cervical disk herniation"],
              rows: [
                ["Usual levels", "L4–L5 and L5–S1", "C5–C6 and C6–C7"],
                [
                  "Symptoms",
                  "Low back pain radiating down the back of the leg (sciatica); numbness, weakness, reduced ankle or knee reflex",
                  "Neck pain radiating into the shoulder and arm; numbness or weakness in the arm and hand",
                ],
                [
                  "Emergency",
                  "Cauda equina syndrome: saddle anesthesia, new urinary retention or incontinence, bowel incontinence, bilateral leg weakness",
                  "Myelopathy: cord compression with clumsy hands, gait problems",
                ],
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c5",
                type: "mc",
                stem: "A client with known lumbar disk herniation calls the clinic. Which new symptom needs emergency evaluation today?",
                options: [
                  {
                    t: "Numbness in the groin and inner thighs and difficulty passing urine",
                    ok: true,
                    why: "Saddle anesthesia with urinary retention suggests cauda equina syndrome, a surgical emergency.",
                  },
                  {
                    t: "Pain that radiates down the back of one leg",
                    ok: false,
                    why: "Sciatica is the expected symptom of a lumbar herniation.",
                  },
                  {
                    t: "Pain that worsens after sitting for an hour",
                    ok: false,
                    why: "Sitting raises pressure on the disk; this is common and not an emergency.",
                  },
                  {
                    t: "Tingling along the outer edge of one foot",
                    ok: false,
                    why: "Single-root numbness is expected with an L5–S1 herniation.",
                  },
                ],
                rationale: "Bladder, bowel or saddle changes turn back pain into an emergency.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s2-open3",
              stem: "Why does saddle numbness after a disc herniation need emergency care?",
              expert: "It means the cauda equina, the nerve roots to the bladder, bowel and perineum, is compressed. Without urgent decompression, loss of bladder and bowel control can be permanent.",
            },
            // REVIEW: page numbers needed
            { t: "read", items: [{ ref: "pp. ___: Joint disorders, carpal tunnel syndrome and the spine" }] },
          ],
        },
        {
          id: "s2-l3-quiz",
          topic: "Musculoskeletal System Pathophysiology",
          title: "Quiz: Lesson 3 topics",
          kind: "quiz",
          blocks: [
            {
              t: "p",
              html: "Five questions on fractures, sprains, bone mineralization, the spine and trauma complications. Submit each answer to see the reasoning.",
            },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s2-q1",
                  type: "mc",
                  stem: "A 9-year-old fell from a tree. The x-ray shows the radius bent, with a crack through only one side of the bone. Which fracture is this?",
                  options: [
                    {
                      t: "Greenstick",
                      ok: true,
                      why: "Children's flexible bones bend and break on one side only: an incomplete, greenstick fracture.",
                    },
                    { t: "Comminuted", ok: false, why: "Comminuted means three or more fragments." },
                    { t: "Avulsion", ok: false, why: "Avulsion is a bone fragment pulled off by a tendon or ligament." },
                    { t: "Compression", ok: false, why: "Compression fractures crush a bone, typically a vertebral body." },
                  ],
                  rationale: "Incomplete fractures are typical of children because their bones are more flexible.",
                  level: "application",
                },
                {
                  id: "s2-q2",
                  type: "mc",
                  stem: "An older adult who rarely goes outdoors has diffuse bone pain and muscle weakness. Labs: calcium slightly low, phosphate low, alkaline phosphatase high, PTH high. Which condition best fits?",
                  options: [
                    {
                      t: "Osteomalacia",
                      ok: true,
                      why: "Vitamin D deficiency leads to poor mineralization, low calcium and phosphate, and a compensatory rise in PTH and alkaline phosphatase.",
                    },
                    {
                      t: "Osteoporosis",
                      ok: false,
                      why: "In osteoporosis these labs are usually normal and the bone does not hurt until it breaks.",
                    },
                    {
                      t: "Paget disease",
                      ok: false,
                      why: "Paget disease raises alkaline phosphatase but calcium and phosphate are normal.",
                    },
                    { t: "Osteoarthritis", ok: false, why: "OA is a joint disease with normal labs." },
                  ],
                  rationale: "Pain plus abnormal calcium, phosphate and PTH means a mineralization problem, not simply low bone mass.",
                  level: "application",
                },
                {
                  id: "s2-q3",
                  type: "mc",
                  stem: "A 74-year-old woman's upper back has become increasingly rounded and she is 5 cm shorter than she was at 50. Which explanation is most likely?",
                  options: [
                    {
                      t: "Kyphosis from osteoporotic vertebral compression fractures",
                      ok: true,
                      why: "Wedge-shaped compression of thoracic vertebrae increases the posterior curve and shortens the spine.",
                    },
                    {
                      t: "Lordosis from weak abdominal muscles and weight gain",
                      ok: false,
                      why: "Lordosis is an inward lumbar curve, not a rounded upper back.",
                    },
                    { t: "Scoliosis from uneven leg length since childhood", ok: false, why: "Scoliosis is a sideways curve." },
                    {
                      t: "Cervical disk herniation compressing the cord",
                      ok: false,
                      why: "Disk herniation causes radicular pain, not progressive height loss and rounding.",
                    },
                  ],
                  rationale: "Height loss plus a rounded upper back in an older woman is osteoporosis until proven otherwise.",
                  level: "application",
                },
                {
                  id: "s2-q4",
                  type: "ms",
                  stem: "A client's forearm is in a firm dressing after a crush injury at work. Which findings should the nurse report immediately? <strong>Choose 2 answers.</strong>",
                  options: [
                    {
                      t: "The forearm feels tense and firm under the dressing",
                      ok: true,
                      why: "A tense, firm compartment reflects rising pressure inside the fascia.",
                    },
                    {
                      t: "Severe pain when the fingers are passively extended",
                      ok: true,
                      why: "Pain on passive stretch of the compartment's muscles is an early sign.",
                    },
                    {
                      t: "A 2+ radial pulse",
                      ok: false,
                      why: "A normal pulse does not rule compartment syndrome out, but it is not the finding to report.",
                    },
                    { t: "Mild bruising around the injury", ok: false, why: "Bruising is expected after a crush injury." },
                  ],
                  rationale: "Report tension and pain on passive stretch. Do not wait for pallor, paralysis or a lost pulse; those are late.",
                  level: "application",
                },
                {
                  id: "s2-q5",
                  type: "mc",
                  stem: "Two days after a femur fracture, a client becomes restless and confused, his oxygen saturation falls to 86%, and tiny red spots appear across his chest. What is the most likely cause?",
                  options: [
                    {
                      t: "Fat embolism syndrome",
                      ok: true,
                      why: "Respiratory distress, neurologic change and a petechial rash 24–72 hours after a long-bone fracture is the classic triad.",
                    },
                    {
                      t: "Compartment syndrome",
                      ok: false,
                      why: "Compartment syndrome is a local limb problem and does not cause hypoxemia or petechiae.",
                    },
                    {
                      t: "Osteomyelitis",
                      ok: false,
                      why: "Bone infection develops more slowly and causes local pain, warmth and fever.",
                    },
                    { t: "Rhabdomyolysis", ok: false, why: "Rhabdomyolysis shows as dark urine, high CK and hyperkalemia." },
                  ],
                  rationale: "Timing and the triad of lungs, brain and skin identify fat embolism.",
                  level: "application",
                },
              ],
            },
          ],
        },
        l33,
        {
          id: "s2-tp4",
          title: "2.4 Skin cancer",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What are the three types of skin cancer, and how do they compare in severity?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Basal cell carcinoma is the most common skin cancer and rarely spreads; squamous cell carcinoma can spread.",
                "Melanoma spreads readily and causes most skin cancer deaths.",
                "Melanoma ABCDE: asymmetry, border, color, diameter over 6 mm, evolving.",
                "Depth of invasion predicts prognosis. Acral melanoma is relatively more common in darker skin.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p4",
              stem: "Which skin cancer is the most common?",
              options: [{ id: "a", text: "Basal cell carcinoma" }, { id: "b", text: "Melanoma" }],
              correct: "a",
              reveal: "Basal cell carcinoma is the most common and rarely spreads. Melanoma is less common but causes most skin cancer deaths.",
            },
            { t: "h2", text: "What the skin does" },
            {
              t: "table",
              head: ["Function", "How", "What happens when it fails"],
              rows: [
                [
                  "Barrier",
                  "Keratinized epidermis and an acidic surface keep out microbes and hold in water",
                  "Infection, fluid loss (burns)",
                ],
                ["Temperature control", "Sweat glands and dermal blood flow", "Heat or cold injury"],
                [
                  "Immune surveillance",
                  "Langerhans cells present antigens; skin houses T cells",
                  "Infection, allergic and autoimmune skin disease",
                ],
                ["Vitamin D", "UVB converts a cholesterol precursor to vitamin D3", "Deficiency with little sun exposure"],
                [
                  "Sensation",
                  "Receptors for touch, pain, pressure and temperature",
                  "Unnoticed injury (as in full-thickness burns)",
                ],
              ],
            },
            {
              t: "p",
              html: "The skin has three layers: the <strong>epidermis</strong> (no blood vessels; melanocytes and keratinocytes live here), the <strong>dermis</strong> (blood vessels, nerves, hair follicles and glands) and the <strong>subcutaneous</strong> fat layer. How deep an injury goes through these layers decides how it heals.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-skin-cancers",
              alt: "Skin in cross-section showing basal cell carcinoma nests from the basal layer, squamous cell carcinoma tongues from the epidermis, and melanoma pigment cells invading deep.",
              panels: [
                { label: "Basal cell carcinoma", sub: "Basal layer nests" },
                { label: "Squamous cell carcinoma", sub: "Keratinocyte tongues" },
                { label: "Melanoma", sub: "Pigment cells invade deep" },
              ],
              aspect: "3:1",
            },
            {
              t: "case",
              title: "Tomás, 50",
              html: "Tomás has had a firm, brown, slowly enlarging spot on the sole of his left foot for two years. It is 2 × 1.5 cm with an irregular edge and two shades of brown. He has never had a sunburn there.",
            },
            {
              t: "table",
              head: ["", "Basal cell carcinoma", "Squamous cell carcinoma", "Melanoma"],
              rows: [
                ["Cell of origin", "Basal cells of the epidermis", "Keratinocytes", "Melanocytes"],
                [
                  "How common",
                  "Most common skin cancer",
                  "Second most common",
                  "Less common, but causes most skin cancer deaths",
                ],
                [
                  "Look",
                  "Pearly, translucent papule with rolled edges and fine visible vessels; may ulcerate",
                  "Rough, scaly or crusted papule or plaque; a sore that won't heal; may bleed",
                  "A changing pigmented lesion: see ABCDE below",
                ],
                [
                  "Spread",
                  "Grows locally and destroys tissue; very rarely metastasizes",
                  "Can metastasize, more often from lips, ears or scars, or in immunosuppressed people",
                  "Metastasizes readily through lymph and blood",
                ],
                [
                  "Precursor",
                  "None typical",
                  "Actinic keratosis (rough sun-damaged patches)",
                  "Can arise in an existing mole or new skin",
                ],
              ],
            },
            { t: "h2", text: "ABCDE of melanoma" },
            {
              t: "table",
              head: ["Letter", "Warning sign"],
              rows: [
                ["A", "Asymmetry: one half does not match the other"],
                ["B", "Border: irregular, notched or blurred"],
                ["C", "Color: more than one color or uneven shading"],
                ["D", "Diameter: larger than about 6 mm (a pencil eraser), though early melanomas can be smaller"],
                ["E", "Evolving: changing in size, shape, color or symptoms such as itching or bleeding"],
              ],
            },
            {
              t: "ul",
              items: [
                "<strong>Risk factors:</strong> UV exposure, especially blistering sunburns in childhood; tanning beds; fair skin that burns easily; many or atypical moles; family or personal history; immunosuppression.",
                "<strong>Prognosis</strong> depends mostly on depth of invasion (Breslow thickness) and whether lymph nodes are involved. Thin, early melanoma is usually curable by excision; survival falls sharply after it spreads.",
                "<strong>Variation:</strong> in people with darker skin, melanoma is less common but more often <em>acral</em>: on the palms, soles or under the nails, sites without much sun exposure. It is often diagnosed later.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c6",
                type: "mc",
                stem: "Which lesion should the nurse be most concerned about?",
                options: [
                  {
                    t: "A 7 mm mole with blurred edges and patches of black and tan that has grown this year",
                    ok: true,
                    why: "Asymmetry, an irregular border, several colors, size over 6 mm and change over time all point to melanoma.",
                  },
                  {
                    t: "A pearly 4 mm bump on the nose with tiny surface vessels",
                    ok: false,
                    why: "This suggests basal cell carcinoma, which needs treatment but rarely spreads.",
                  },
                  {
                    t: "A rough, scaly pink patch on the back of the hand",
                    ok: false,
                    why: "This suggests actinic keratosis, a precursor of squamous cell carcinoma.",
                  },
                  {
                    t: "A round 3 mm evenly brown mole unchanged for years",
                    ok: false,
                    why: "Small, symmetric, single-colored and stable is reassuring.",
                  },
                ],
                rationale: "All three need assessment, but melanoma is the one most likely to metastasize. Evolution is the strongest single warning sign.",
                level: "application",
              },
            },
            {
              t: "open",
              id: "s2-o2",
              stem: "Compare and contrast the three main skin cancers in two or three sentences: cell of origin, appearance and risk of spread.",
              expert: "Basal cell carcinoma arises from basal cells, is the most common, looks like a pearly papule with rolled edges and fine vessels, and grows locally but almost never spreads. Squamous cell carcinoma arises from keratinocytes, often from actinic keratosis, looks rough, scaly or crusted, and can metastasize. Melanoma arises from melanocytes, is identified by the ABCDE changes, and is the most dangerous because it spreads readily; depth of invasion predicts survival.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "pp. 1529–1531: Skin cancer",
                  note: "Basal cell carcinoma, squamous cell carcinoma and cutaneous melanoma. Stop at primary cutaneous lymphomas.",
                },
              ],
            },
          ],
        },
        {
          id: "s2-tp5",
          title: "2.5 Burns",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do you judge how serious a burn is, and why can a skin injury cause shock?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Burn depth: superficial (epidermis), partial-thickness (into dermis, blisters, painful), full-thickness (leathery, painless, needs grafting).",
                "Rule of nines: head 9, each arm 9, front trunk 18, back trunk 18, each leg 18, perineum 1. Do not count superficial burns.",
                "Burn shock: leaky capillaries move plasma into tissue over the first 24–48 hours; urine output guides resuscitation. Potassium is high early and may fall later.",
                "Inhalation injury (hoarseness, soot, facial burns) is an airway emergency.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p5",
              stem: "Which burn hurts least?",
              options: [{ id: "a", text: "Full-thickness" }, { id: "b", text: "Partial-thickness" }],
              correct: "a",
              reveal: "Full-thickness burns destroy the nerve endings in the dermis, so the area is painless and leathery.",
            },
            { t: "h2", text: "Depth" },
            {
              t: "table",
              head: ["Depth", "Layers", "Looks and feels", "Healing"],
              rows: [
                [
                  "Superficial (first degree)",
                  "Epidermis only",
                  "Red, dry, painful, blanches; no blisters (sunburn)",
                  "3–6 days, no scar",
                ],
                [
                  "Superficial partial-thickness",
                  "Epidermis and upper dermis",
                  "Blisters, moist, pink-red, very painful",
                  "About 2–3 weeks, little scarring",
                ],
                [
                  "Deep partial-thickness",
                  "Into the deeper dermis",
                  "Mottled red and white, less moist, less painful, may not blanch",
                  "Weeks; scarring; may need grafting",
                ],
                [
                  "Full-thickness (third degree)",
                  "All of the epidermis and dermis, into fat",
                  "White, brown or charred; dry and leathery; painless because nerve endings are destroyed",
                  "Cannot regrow skin; needs grafting",
                ],
                [
                  "Deeper injury (fourth degree)",
                  "Into muscle, tendon or bone",
                  "Charred, exposed deep tissue",
                  "Surgery, sometimes amputation",
                ],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-burn-depth",
              alt: "Four burn depths in skin: superficial in the epidermis, superficial partial-thickness with a blister, deep partial-thickness into the dermis, and full-thickness down to fat.",
              panels: [
                { label: "Superficial", sub: "Epidermis only" },
                { label: "Superficial partial", sub: "Upper dermis, blister" },
                { label: "Deep partial", sub: "Deep dermis" },
                { label: "Full thickness", sub: "Down to fat, nerves gone" },
              ],
              aspect: "3:1",
            },
            { t: "h2", text: "Extent: the rule of nines" },
            {
              t: "table",
              caption: "Adult rule of nines. Count partial- and full-thickness burns only; superficial burns are not included. In children the head is a larger share.",
              head: ["Area", "% of total body surface area (TBSA)"],
              rows: [
                ["Head and neck", "9"],
                ["Each arm", "9"],
                ["Front of trunk", "18"],
                ["Back of trunk", "18"],
                ["Each leg", "18"],
                ["Perineum", "1"],
              ],
            },
            // REVIEW: new diagram (image manifest: built as page diagrams). Values from the table above.
            {
              t: "diagram",
              id: "d-rule-of-nines",
              layout: "nines",
              title: "Adult rule of nines (% of body surface area)",
              alt: "Adult rule of nines body map. Front: head and neck 9%, each arm 9%, front of trunk 18%, each leg 18%, perineum 1%. Back: back of trunk 18%. Total 100%.",
              items: [
                { key: "head", label: "Head and neck", sub: "9" },
                { key: "arm", label: "Each arm", sub: "9" },
                { key: "trunk-front", label: "Front of trunk", sub: "18" },
                { key: "trunk-back", label: "Back of trunk", sub: "18" },
                { key: "leg", label: "Each leg (front and back)", sub: "18" },
                { key: "perineum", label: "Perineum", sub: "1" },
              ],
              note: "Arms, legs and the head are counted whole on the front figure. Count partial- and full-thickness burns only. In children the head is a larger share.",
            },
            {
              t: "p",
              html: "For small or scattered burns, the client's palm (including fingers) is about 1% of their body surface.",
            },
            { t: "h2", text: "Why a burn can cause shock" },
            {
              t: "ol",
              items: [
                "Heat damages capillaries and triggers massive release of inflammatory mediators. Capillary permeability rises, in burned tissue and, with burns over about 20% TBSA, throughout the body.",
                "Plasma, protein and electrolytes leak into the tissues. Blood volume falls and the blood becomes concentrated (high hematocrit). This is <strong>burn shock</strong>, and it peaks over the first 24–48 hours.",
                "Damaged cells release potassium, so early serum potassium can be high.",
                "Fluid resuscitation with crystalloid replaces what has leaked out. Formulas such as the Parkland formula estimate a starting volume; the infusion is then adjusted to urine output, which is the best bedside sign of adequate perfusion (about 0.5 mL/kg/hour in an adult).",
                "After about 48–72 hours capillaries seal, fluid moves back into the vessels and the client passes large volumes of urine (the diuretic phase). Potassium may now fall.",
              ],
            },
            {
              t: "callout",
              title: "Other early dangers",
              html: "<strong>Inhalation injury:</strong> facial burns, singed nasal hair, soot in the mouth, hoarseness or stridor. The airway can swell shut within hours, so these are priority findings. <strong>Circumferential full-thickness burns</strong> act like a tight cast: rigid eschar can cut off circulation to a limb or restrict breathing on the chest, and may need escharotomy. <strong>Carbon monoxide</strong> poisoning gives falsely normal pulse oximetry readings.",
            },
            {
              t: "ul",
              items: [
                "<strong>Later complications:</strong> infection and sepsis (the barrier is gone), a hypermetabolic state that can double energy needs, stress ulcers (Curling ulcer), paralytic ileus, contractures and hypertrophic scarring.",
                "<strong>Variation:</strong> young children and older adults have thinner skin, so the same exposure causes a deeper burn, and they tolerate fluid shifts less well. Chemical burns keep burning until the chemical is removed; electrical burns may show small skin wounds over extensive deep muscle damage, with a risk of dysrhythmias and rhabdomyolysis.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c7",
                type: "mc",
                stem: "Daniel (41) has partial- and full-thickness burns of the whole head and neck, the front of the trunk and the whole right arm. Using the adult rule of nines, what percentage of his body surface area is burned?",
                fixed: true,
                options: [
                  { t: "18%", ok: false, why: "This counts only the front of the trunk." },
                  { t: "27%", ok: false, why: "This leaves out one region: the head and neck (9%) or the arm (9%)." },
                  { t: "36%", ok: true, why: "Head and neck 9% + front of trunk 18% + right arm 9% = 36%." },
                  { t: "45%", ok: false, why: "This adds a second arm (9%) that is not burned." },
                ],
                rationale: "Add the regions: 9 (head and neck) + 18 (front of trunk) + 9 (arm). If only the face were burned, it would count as about 4.5%; burn units refine estimates with a body chart.",
                level: "application",
              },
            },
            {
              t: "q",
              q: {
                id: "s2-c8",
                type: "mc",
                stem: "Four hours after his burn, Daniel's voice is getting hoarse and he has soot around his nostrils. His blood pressure is 104/68 mm Hg and urine output is 40 mL/hour (he weighs 75 kg). Which finding is the priority?",
                options: [
                  {
                    t: "Hoarseness with soot around the nose",
                    ok: true,
                    why: "These suggest inhalation injury. Airway swelling can progress quickly to obstruction, so airway comes first.",
                  },
                  {
                    t: "Blood pressure of 104/68 mm Hg",
                    ok: false,
                    why: "This is acceptable during resuscitation and is being monitored.",
                  },
                  {
                    t: "Urine output of 40 mL/hour",
                    ok: false,
                    why: "At 75 kg this exceeds the 0.5 mL/kg/hour target (about 38 mL/hour), so resuscitation is adequate.",
                  },
                  {
                    t: "Pain in the blistered areas",
                    ok: false,
                    why: "Pain needs treating, but it does not threaten life the way a closing airway does.",
                  },
                ],
                rationale: "Airway, breathing, circulation. A hoarse voice after a fire is an airway finding.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s2-open5",
              stem: "Why can a large burn cause shock with little bleeding?",
              expert: "Burned tissue makes capillaries leaky, so plasma moves from the blood into the tissues over the first 24–48 hours. Circulating volume falls: hypovolemic shock.",
            },
            {
              t: "read",
              items: [
                {
                  ref: "pp. 1575–1585: Thermal injury and burns",
                  note: "Classification, the fluid shift, and the body-wide response to a major burn.",
                },
              ],
            },
          ],
        },
        {
          id: "s2-tp6",
          title: "2.6 Lesions, infections and pigment",
          kind: "topic",
          blocks: [
            {
              t: "eq",
              text: "How do you describe a skin lesion, and what are the common infections, infestations and pigment disorders?",
            },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Albinism is inherited lack of melanin production; vitiligo is autoimmune loss of melanocytes.",
                "Tinea is named by site; scabies itches most at night.",
                "Impetigo has honey-colored crusts; shingles follows one dermatome.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s2-p6",
              stem: "Shingles appears as a band of blisters on one side. Why only one side?",
              options: [{ id: "a", text: "It follows one nerve's dermatome" }, { id: "b", text: "It spreads through the blood" }],
              correct: "a",
              reveal: "The virus reactivates in one sensory ganglion and travels along that nerve, so the rash follows a single dermatome.",
            },
            { t: "h2", text: "Describing lesions" },
            {
              t: "table",
              head: ["Lesion", "Description", "Example"],
              rows: [
                ["Macule / patch", "Flat color change; macule under 1 cm, patch 1 cm or more", "Freckle; vitiligo"],
                [
                  "Papule / plaque",
                  "Raised and solid; papule under 1 cm, plaque a raised flat-topped area 1 cm or more",
                  "Wart; psoriasis",
                ],
                ["Nodule", "Raised, solid and deeper", "Lipoma"],
                [
                  "Vesicle / bulla",
                  "Fluid-filled blister; vesicle under 1 cm, bulla 1 cm or more",
                  "Herpes simplex; burn blister",
                ],
                ["Pustule", "Blister filled with pus", "Acne, folliculitis"],
                ["Wheal", "Raised, itchy, short-lived swelling", "Hives (urticaria)"],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s2-primary-lesions",
              alt: "Six primary skin lesions in cross-section: macule, papule, plaque, nodule, vesicle and pustule.",
              panels: [
                { label: "Macule", sub: "Flat colour change" },
                { label: "Papule", sub: "Small solid bump" },
                { label: "Plaque", sub: "Broad, flat-topped" },
                { label: "Nodule", sub: "Larger, deeper" },
                { label: "Vesicle", sub: "Clear fluid blister" },
                { label: "Pustule", sub: "Pus-filled blister" },
              ],
              aspect: "3:1",
            },
            { t: "h2", text: "Inflammatory skin disease" },
            {
              t: "ul",
              items: [
                "<strong>Atopic dermatitis (eczema):</strong> a weak skin barrier and allergic tendency; itchy, dry, red patches in skin folds; often with asthma and hay fever.",
                "<strong>Allergic contact dermatitis:</strong> a type IV (T cell) reaction 24–72 hours after contact with nickel, poison ivy or latex; itchy vesicles where the substance touched.",
                "<strong>Psoriasis:</strong> T cell–driven inflammation speeds keratinocyte turnover from about a month to a few days. Well-defined red plaques with silvery scale on elbows, knees, scalp and lower back; nail pitting; may come with psoriatic arthritis.",
              ],
            },
            { t: "h2", text: "Infections and infestations" },
            {
              t: "table",
              head: ["Type", "Condition", "What to look for"],
              rows: [
                [
                  "Bacterial",
                  "Impetigo",
                  "Superficial staph or strep infection; honey-colored crusts, often around the nose and mouth in children; contagious",
                ],
                [
                  "Bacterial",
                  "Cellulitis",
                  "Infection of dermis and subcutaneous tissue; spreading red, warm, tender, swollen skin; fever. Watch for streaks (lymphangitis).",
                ],
                [
                  "Viral",
                  "Herpes zoster (shingles)",
                  "Reactivated varicella virus in a sensory nerve; painful vesicles in a band on one side of the body (one dermatome). Risk of postherpetic neuralgia.",
                ],
                ["Viral", "Warts", "Human papillomavirus; rough papules"],
                [
                  "Fungal",
                  "Tinea (dermatophytes)",
                  "Corporis (body): ring-shaped scaly patch with a clearer center. Capitis (scalp): scaly patches and hair loss in children; needs oral treatment. Pedis (feet), cruris (groin), unguium (nails).",
                ],
                [
                  "Fungal",
                  "Candidiasis",
                  "Bright red, moist patches with satellite spots in skin folds; more common with diabetes, antibiotics or immunosuppression",
                ],
                [
                  "Infestation",
                  "Scabies",
                  "Mite burrowing in the skin; intense itch, worse at night; burrows in finger webs and wrists; spreads by close contact",
                ],
                ["Infestation", "Pediculosis (lice)", "Itch; nits (eggs) firmly attached to hair shafts"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c9",
                type: "mc",
                stem: "A 7-year-old has round, scaly patches on the scalp with broken hairs and patchy hair loss. Several classmates have similar patches. Which condition is most likely?",
                options: [
                  {
                    t: "Tinea capitis",
                    ok: true,
                    why: "A dermatophyte infection of the scalp causes scaly patches and hair loss, usually in children, and spreads between them.",
                  },
                  { t: "Tinea corporis", ok: false, why: "Corporis affects the body, not the scalp." },
                  {
                    t: "Pediculosis",
                    ok: false,
                    why: "Lice cause itching with nits on the hair shafts, not scaly bald patches.",
                  },
                  {
                    t: "Psoriasis",
                    ok: false,
                    why: "Scalp psoriasis causes thick silvery plaques but does not spread between classmates.",
                  },
                ],
                rationale: "Name tinea by its site. Scalp infection needs oral antifungal treatment because topical creams do not reach the hair follicle.",
                level: "application",
              },
            },
            { t: "h2", text: "Pigment disorders" },
            {
              t: "table",
              head: ["Disorder", "Mechanism", "Key points"],
              rows: [
                [
                  "Albinism",
                  "Inherited (usually autosomal recessive) defect in melanin production; melanocytes are present but make little or no pigment",
                  "Very light skin and hair; eye problems such as reduced vision, nystagmus and light sensitivity; very high risk of sunburn and skin cancer",
                ],
                [
                  "Vitiligo",
                  "Autoimmune destruction of melanocytes",
                  "Sharply bordered white patches; often with other autoimmune disease such as thyroid disease",
                ],
                ["Melasma", "Hormone-driven increase in pigment", "Brown patches on the face, common in pregnancy"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s2-c10",
                type: "mc",
                stem: "Twin girls with oculocutaneous albinism are born to two parents with typical pigmentation. Which teaching point is most important for the family?",
                options: [
                  {
                    t: "Strict sun protection for life, with regular skin checks",
                    ok: true,
                    why: "Without melanin the skin has little defense against UV, so the risk of burns and skin cancer is very high.",
                  },
                  {
                    t: "The girls' pigment will develop normally by school age",
                    ok: false,
                    why: "Albinism is a lifelong inherited condition.",
                  },
                  {
                    t: "Neither parent can carry the gene, so this was a new mutation",
                    ok: false,
                    why: "Most albinism is autosomal recessive: two unaffected carrier parents can have affected children.",
                  },
                  {
                    t: "The white patches will spread over time",
                    ok: false,
                    why: "Spreading white patches describe vitiligo, not albinism.",
                  },
                ],
                rationale: "Albinism is a pigment-production problem from birth; vitiligo is acquired loss of melanocytes.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s2-open6",
              stem: "How does vitiligo differ from albinism?",
              expert: "Albinism is an inherited inability to make melanin, present from birth everywhere. Vitiligo is autoimmune destruction of melanocytes, causing patches of lost pigment that appear later.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 1513–1521: Disorders of the skin", note: "Lesion types and inflammatory disorders." },
                { ref: "pp. 1521–1526: Infections", note: "Bacterial, viral and fungal skin infections and infestations." },
              ],
            },
          ],
        },
        {
          id: "s2-l4-quiz",
          topic: "Integumentary System Pathophysiology",
          title: "Quiz: Lesson 4 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on skin cancer, burns, lesions and infections." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s2-q6",
                  type: "mc",
                  stem: "A 68-year-old farmer has a slowly growing, pearly bump on the side of his nose with tiny visible blood vessels and a small central crust. Which diagnosis is most likely?",
                  options: [
                    {
                      t: "Basal cell carcinoma",
                      ok: true,
                      why: "A pearly papule with rolled edges and fine vessels on sun-exposed skin is the classic picture.",
                    },
                    { t: "Melanoma", ok: false, why: "Melanoma is pigmented and changes in the ABCDE ways." },
                    {
                      t: "Actinic keratosis",
                      ok: false,
                      why: "Actinic keratosis is a rough, scaly flat patch, not a pearly papule.",
                    },
                    {
                      t: "Impetigo",
                      ok: false,
                      why: "Impetigo is an infection with honey-colored crusts, not a slow-growing bump.",
                    },
                  ],
                  rationale: "Pearly and rolled with surface vessels: think basal cell.",
                  level: "application",
                },
                {
                  id: "s2-q7",
                  type: "mc",
                  stem: "A burn on the forearm is moist, bright pink and covered with blisters, and the client says it is extremely painful. How is it classified?",
                  options: [
                    {
                      t: "Superficial partial-thickness",
                      ok: true,
                      why: "Blisters, moisture and severe pain mean the epidermis and upper dermis are involved with nerve endings intact.",
                    },
                    { t: "Superficial", ok: false, why: "Superficial burns are red and painful but do not blister." },
                    { t: "Deep partial-thickness", ok: false, why: "Deep partial burns are mottled, drier and less painful." },
                    { t: "Full-thickness", ok: false, why: "Full-thickness burns are leathery and painless." },
                  ],
                  rationale: "Pain tells you the nerve endings survive. The most painful burns are usually not the deepest.",
                  level: "application",
                },
                {
                  id: "s2-q8",
                  type: "mc",
                  stem: "An adult has partial-thickness burns covering both legs completely and the front of the trunk. Using the rule of nines, what is the TBSA burned?",
                  fixed: true,
                  options: [
                    { t: "36%", ok: false, why: "This counts only the two legs." },
                    { t: "45%", ok: false, why: "This counts only half of the trunk (9%) or leaves out half of one leg." },
                    { t: "54%", ok: true, why: "Each leg is 18% (36%) plus the front of the trunk 18% = 54%." },
                    { t: "63%", ok: false, why: "This adds an extra 9% that is not burned." },
                  ],
                  rationale: "Legs are 18% each because each leg is two nines.",
                  level: "application",
                },
                {
                  id: "s2-q9",
                  type: "mc",
                  stem: "Seventy-two hours after a major burn, a client's capillaries have begun to seal. Which change does the nurse anticipate?",
                  options: [
                    {
                      t: "A large increase in urine output as fluid returns to the circulation",
                      ok: true,
                      why: "As capillaries seal, interstitial fluid moves back into the vessels and is excreted: the diuretic phase.",
                    },
                    {
                      t: "A sharp fall in urine output as fluid leaks into tissue",
                      ok: false,
                      why: "That describes the first 24–48 hours.",
                    },
                    {
                      t: "A rising serum potassium from new cell damage",
                      ok: false,
                      why: "Potassium is highest early; it often falls in the diuretic phase.",
                    },
                    {
                      t: "Rising hematocrit from plasma loss",
                      ok: false,
                      why: "Hemoconcentration is an early finding; it eases as fluid returns.",
                    },
                  ],
                  rationale: "Fluid goes out in the first two days and comes back after that. Watch for fluid overload and falling potassium in the second phase.",
                  level: "application",
                },
                {
                  id: "s2-q10",
                  type: "mc",
                  stem: "A child has a red, ring-shaped patch on the forearm with a scaly raised edge and a clearer center. Which condition is most likely?",
                  options: [
                    {
                      t: "Tinea corporis",
                      ok: true,
                      why: "A ring-shaped scaly patch with central clearing on the body is ringworm, a dermatophyte infection.",
                    },
                    { t: "Tinea capitis", ok: false, why: "Capitis affects the scalp." },
                    {
                      t: "Scabies",
                      ok: false,
                      why: "Scabies causes intensely itchy burrows and papules in finger webs and wrists.",
                    },
                    { t: "Herpes zoster", ok: false, why: "Shingles causes painful vesicles in a dermatome." },
                  ],
                  rationale: "Ring shape plus scale plus central clearing is tinea. The site gives it its name.",
                  level: "application",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s2-sum-g",
      title: "Section 2: Summary",
      pages: [
        {
          id: "s2-sum",
          title: "Section 2: Summary and cards",
          kind: "summary",
          blocks: [
            {
              t: "p",
              html: "In this section you followed three patients. Grace showed how silent bone loss becomes a fragility fracture. Marcus showed how injured muscle releases myoglobin and potassium that threaten the kidneys and heart. Daniel showed how losing the skin barrier moves fluid out of the circulation and opens the door to infection. In each case the damage spread beyond the injured tissue.",
            },
            {
              t: "ul",
              items: [
                "Osteoclasts resorb bone; osteoblasts build it. PTH raises blood calcium, vitamin D lets bone mineralize, estrogen restrains bone loss.",
                "Fractures are described by skin (open or closed), completeness, the fracture line and cause. A fragility fracture is normal force on weak bone.",
                "Sprain = ligament; strain = muscle or tendon. Grade sprains I to III by how much is torn.",
                "Osteoporosis is too little bone (T-score −2.5 or lower). Osteomalacia and rickets are poorly mineralized bone. Paget disease is chaotic remodeling with a very high alkaline phosphatase.",
                "OA: cartilage wear, asymmetric, brief stiffness, Heberden and Bouchard nodes. RA: autoimmune, symmetric small joints, long morning stiffness, systemic symptoms.",
                "Carpal tunnel compresses the median nerve: thumb to half the ring finger, worse at night.",
                "Lumbar herniation causes sciatica; saddle numbness or bladder changes mean cauda equina syndrome.",
                "Trauma complications: compartment syndrome (pain out of proportion, pain on passive stretch), rhabdomyolysis (dark urine, high CK, high potassium), fat embolism (breathing, confusion, petechiae at 24–72 hours), osteomyelitis.",
                "Basal cell carcinoma is the most common skin cancer and rarely spreads; squamous cell carcinoma can spread; melanoma spreads readily and causes most skin cancer deaths.",
                "Melanoma ABCDE: asymmetry, border, color, diameter over 6 mm, evolving. Depth of invasion predicts prognosis. Acral melanoma (palms, soles, nails) is relatively more common in darker skin.",
                "Burn depth: superficial (epidermis), partial-thickness (into dermis, blisters, painful), full-thickness (leathery, painless, needs grafting).",
                "Rule of nines: head 9, each arm 9, front trunk 18, back trunk 18, each leg 18, perineum 1. Do not count superficial burns.",
                "Burn shock: leaky capillaries move plasma into tissue over the first 24–48 hours; urine output guides resuscitation. Potassium is high early and may fall later.",
                "Inhalation injury (hoarseness, soot, facial burns) is an airway emergency.",
                "Tinea is named by site; scabies itches most at night; impetigo has honey-colored crusts; shingles follows one dermatome.",
                "Albinism is inherited lack of melanin production; vitiligo is autoimmune loss of melanocytes.",
              ],
            },
            // REVIEW: new
            {
              t: "confused",
              rows: [
                ["Sprain", "Strain", "Sprain: ligament. Strain: muscle or tendon."],
                [
                  "Osteoarthritis",
                  "Rheumatoid arthritis",
                  "OA: cartilage wear, asymmetric, brief stiffness. RA: autoimmune, symmetric small joints, long morning stiffness.",
                ],
                ["Osteoporosis", "Osteomalacia", "Osteoporosis: too little bone. Osteomalacia: poorly mineralized bone."],
                [
                  "Vitiligo",
                  "Albinism",
                  "Vitiligo: autoimmune loss of melanocytes. Albinism: inherited lack of melanin production.",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "values",
              rows: [
                ["T-score", "−2.5 or lower", "osteoporosis"],
                ["Melanoma diameter", "over 6 mm", "the D in ABCDE"],
                [
                  "Rule of nines",
                  "head 9, each arm 9, front trunk 18, back trunk 18, each leg 18, perineum 1",
                  "% body surface",
                ],
              ],
            },
            {
              t: "cards",
              id: "fc-l3",
              title: "Lesson 3 flashcards",
              cards: [
                ["Osteoclast vs osteoblast", "Osteoclasts cut (resorb); osteoblasts build"],
                [
                  "Effect of PTH on blood calcium",
                  "Raises it: more bone resorption, kidney calcium reabsorption and vitamin D activation",
                ],
                ["T-score for osteoporosis", "−2.5 or lower on DEXA (between −1.0 and −2.5 = osteopenia)"],
                ["Most common cause of secondary osteoporosis", "Long-term glucocorticoids"],
                ["Paget disease lab clue", "Very high alkaline phosphatase, normal calcium and phosphate"],
                ["Rickets vs osteomalacia", "The same mineralization failure (usually vitamin D), in children vs adults"],
                ["Heberden and Bouchard nodes", "Bony nodes of OA at the DIP and PIP joints"],
                ["RA morning stiffness", "An hour or more, improves with use"],
                ["Carpal tunnel nerve and fingers", "Median nerve: thumb, index, middle, radial half of ring finger"],
                [
                  "Cauda equina red flags",
                  "Saddle anesthesia, urinary retention or incontinence, bowel incontinence, bilateral leg weakness",
                ],
                ["Earliest sign of compartment syndrome", "Pain out of proportion, worse on passive stretch"],
                [
                  "Fat embolism triad",
                  "Respiratory distress, confusion, petechial rash, 24–72 hours after a long-bone fracture",
                ],
              ],
            },
            {
              t: "cards",
              id: "fc-l4",
              title: "Lesson 4 flashcards",
              cards: [
                ["Most common skin cancer", "Basal cell carcinoma: pearly papule, rolled edges, rarely metastasizes"],
                ["Precursor of squamous cell carcinoma", "Actinic keratosis"],
                ["Melanoma ABCDE", "Asymmetry, Border, Color, Diameter > 6 mm, Evolving"],
                ["Best predictor of melanoma prognosis", "Depth of invasion (Breslow thickness) and lymph node spread"],
                ["Full-thickness burn", "White, brown or charred, leathery, painless; needs grafting"],
                ["Rule of nines: front of trunk", "18%"],
                ["Rule of nines: each arm", "9%"],
                ["Best bedside guide to burn resuscitation", "Urine output, about 0.5 mL/kg/hour in an adult"],
                ["Why potassium is high early after a burn", "Damaged cells release it"],
                ["Signs of inhalation injury", "Facial burns, singed nasal hair, soot, hoarseness, stridor"],
                ["Shingles distribution", "One dermatome, one side of the body"],
                ["Vitiligo mechanism", "Autoimmune destruction of melanocytes"],
              ],
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I tell osteoporosis, osteomalacia and Paget disease apart using labs and history?",
                "Can I separate OA from RA by joints, stiffness and systemic signs?",
                "Can I name the early signs of compartment syndrome and the triad of fat embolism?",
                "Can I compare the three skin cancers and apply ABCDE?",
                "Can I classify a burn by depth and use the rule of nines?",
                "Can I explain why urine output guides burn resuscitation?",
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
      id: "s2-test-g",
      title: "Section 2: Test",
      pages: [
        {
          id: "s2-test",
          title: "Section 2: Test",
          kind: "test",
          blocks: [
            {
              t: "p",
              html: "Ten questions covering Section 2, plus two from earlier sections. Answer every question, then submit. Your score and all rationales appear after you submit.",
            },
            {
              t: "quiz",
              mode: "test",
              qs: [
                {
                  id: "s2-t1",
                  type: "mc",
                  stem: "A 78-year-old woman fell from standing and fractured her hip. She has no other injuries. Which term best describes this fracture?",
                  options: [
                    {
                      t: "Fragility (pathologic) fracture",
                      ok: true,
                      why: "A fall from standing should not break healthy bone; the bone was weakened, most often by osteoporosis.",
                    },
                    { t: "Stress fracture", ok: false, why: "Stress fractures come from repeated loading, not one fall." },
                    { t: "Avulsion fracture", ok: false, why: "Avulsion is a fragment pulled off by a tendon or ligament." },
                    { t: "Greenstick fracture", ok: false, why: "Greenstick fractures occur in children's flexible bones." },
                  ],
                  rationale: "Ordinary force plus a broken bone means abnormal bone.",
                  level: "application",
                },
                {
                  id: "s2-t2",
                  type: "mc",
                  stem: "Which finding best distinguishes rheumatoid arthritis from osteoarthritis?",
                  options: [
                    {
                      t: "Symmetric MCP swelling with over an hour of morning stiffness",
                      ok: true,
                      why: "Symmetric small-joint synovitis with prolonged stiffness is typical of RA.",
                    },
                    { t: "Hard bony nodes on the distal finger joints", ok: false, why: "Heberden nodes are a sign of OA." },
                    {
                      t: "Knee pain that worsens after a long walk and eases with rest",
                      ok: false,
                      why: "Pain worse with use is typical of OA.",
                    },
                    {
                      t: "Onset of joint symptoms after the age of 60",
                      ok: false,
                      why: "Both can occur at older ages; OA becomes more common with age.",
                    },
                  ],
                  rationale: "RA is inflammatory and systemic; OA is mechanical and local.",
                  level: "application",
                },
                {
                  id: "s2-t3",
                  type: "mc",
                  stem: "A client has very high alkaline phosphatase, normal calcium and phosphate, an enlarging skull, and new hearing loss. Which condition is most likely?",
                  options: [
                    {
                      t: "Paget disease of bone",
                      ok: true,
                      why: "Chaotic remodeling raises alkaline phosphatase and enlarges and deforms bone; involvement of the temporal bone and middle and inner ear causes hearing loss.",
                    },
                    {
                      t: "Osteomalacia",
                      ok: false,
                      why: "Osteomalacia lowers calcium or phosphate and does not enlarge the skull.",
                    },
                    { t: "Osteoporosis", ok: false, why: "Osteoporosis does not change the labs or enlarge bones." },
                    { t: "Osteomyelitis", ok: false, why: "Bone infection causes local pain, warmth and fever." },
                  ],
                  rationale: "Very high alkaline phosphatase with normal minerals and enlarged bones is Paget disease.",
                  level: "application",
                },
                {
                  id: "s2-t4",
                  type: "mc",
                  stem: "A worker who types all day reports numbness and tingling in her thumb, index and middle fingers that wakes her at night. Tapping the front of her wrist reproduces it. Which structure is affected?",
                  options: [
                    {
                      t: "The median nerve in the carpal tunnel",
                      ok: true,
                      why: "This distribution and a positive Tinel sign at the wrist point to median nerve compression.",
                    },
                    {
                      t: "The ulnar nerve at the elbow",
                      ok: false,
                      why: "Ulnar compression affects the ring and little fingers.",
                    },
                    { t: "The C8 nerve root", ok: false, why: "C8 affects the little finger side of the hand." },
                    { t: "The flexor tendons", ok: false, why: "Tendon problems cause pain with movement, not numbness." },
                  ],
                  rationale: "Map the numbness: thumb to half the ring finger is the median nerve.",
                  level: "application",
                },
                {
                  id: "s2-t5",
                  type: "ms",
                  stem: "A client who was trapped under rubble for six hours is admitted with a crushed thigh. Which findings fit rhabdomyolysis? <strong>Choose 3 answers.</strong>",
                  options: [
                    { t: "Tea-colored urine", ok: true, why: "Myoglobin from damaged muscle darkens the urine." },
                    { t: "Creatine kinase of 35,000 U/L", ok: true, why: "A very high CK is the hallmark of muscle breakdown." },
                    { t: "Potassium of 6.1 mEq/L", ok: true, why: "Potassium leaks from damaged muscle cells." },
                    {
                      t: "Serum calcium of 11.5 mg/dL",
                      ok: false,
                      why: "Calcium usually falls early in rhabdomyolysis as it deposits in damaged muscle.",
                    },
                    {
                      t: "Urine output of 120 mL/hour without treatment",
                      ok: false,
                      why: "Myoglobin damages the kidney, so output tends to fall.",
                    },
                  ],
                  rationale: "Muscle contents in the blood: myoglobin (urine), CK (marker), potassium (heart).",
                  level: "application",
                },
                {
                  id: "s2-t6",
                  type: "mc",
                  stem: "A client with a lumbar disk herniation has pain radiating down the back of the left leg. Which nerve structure is being compressed?",
                  options: [
                    {
                      t: "A lower lumbar or sacral nerve root",
                      ok: true,
                      why: "The sciatic nerve arises from L4–S3; lumbar herniations usually compress the L5 or S1 root, causing sciatica.",
                    },
                    {
                      t: "The lower end of the spinal cord",
                      ok: false,
                      why: "The cord ends around L1–L2, so lumbar herniations compress nerve roots.",
                    },
                    {
                      t: "The femoral nerve in the groin",
                      ok: false,
                      why: "Femoral nerve pain is felt in the front of the thigh.",
                    },
                    { t: "The median nerve at the wrist", ok: false, why: "The median nerve is in the arm." },
                  ],
                  rationale: "Lumbar herniation → nerve root → sciatica. The cord itself is above the level of most lumbar herniations.",
                  level: "application",
                },
                {
                  id: "s2-t7",
                  type: "mc",
                  stem: "Which lesion is most likely to metastasize?",
                  options: [
                    {
                      t: "A nodular melanoma 3 mm deep",
                      ok: true,
                      why: "Melanoma spreads readily, and deeper invasion means a higher risk of spread.",
                    },
                    {
                      t: "A basal cell carcinoma on the cheek",
                      ok: false,
                      why: "Basal cell carcinoma very rarely metastasizes.",
                    },
                    {
                      t: "An actinic keratosis on the scalp",
                      ok: false,
                      why: "Actinic keratosis is precancerous, not a cancer.",
                    },
                    { t: "A seborrheic keratosis on the back", ok: false, why: "Seborrheic keratoses are benign." },
                  ],
                  rationale: "Melanoma's danger is its depth and its tendency to spread.",
                  level: "application",
                },
                {
                  id: "s2-t8",
                  type: "mc",
                  stem: "A burn on the leg is white and leathery, and the client cannot feel a pinprick there. What does the nurse anticipate?",
                  options: [
                    {
                      t: "The wound will need skin grafting",
                      ok: true,
                      why: "Full-thickness burns destroy the dermis, including the cells that regenerate skin.",
                    },
                    {
                      t: "It will heal in 2–3 weeks with little scarring",
                      ok: false,
                      why: "That describes a superficial partial-thickness burn.",
                    },
                    {
                      t: "Pain will be the main problem",
                      ok: false,
                      why: "Nerve endings are destroyed, so the area itself is painless.",
                    },
                    {
                      t: "It is not counted in the TBSA",
                      ok: false,
                      why: "Full-thickness burns are counted; only superficial burns are excluded.",
                    },
                  ],
                  rationale: "Painless and leathery means full thickness, and full thickness means grafting.",
                  level: "application",
                },
                {
                  id: "s2-t9",
                  type: "mc",
                  stem: "Twelve hours after a 40% TBSA burn, a client's hematocrit is high and urine output has dropped to 15 mL/hour. Which explanation is correct?",
                  options: [
                    {
                      t: "Plasma has leaked into the tissues, leaving low, concentrated blood volume",
                      ok: true,
                      why: "Increased capillary permeability causes hypovolemia and hemoconcentration; the kidneys are underperfused.",
                    },
                    {
                      t: "The client is fluid overloaded from the resuscitation",
                      ok: false,
                      why: "Fluid overload dilutes the blood and does not cause low urine output this early.",
                    },
                    {
                      t: "The kidneys have been directly damaged by the heat",
                      ok: false,
                      why: "The kidneys are underperfused, not directly injured.",
                    },
                    { t: "The high hematocrit is from bleeding into the wounds", ok: false, why: "Bleeding lowers hematocrit." },
                  ],
                  rationale: "Low output during the first 48 hours usually means resuscitation is not keeping up with the leak.",
                  level: "application",
                },
                {
                  id: "s2-t10",
                  type: "mc",
                  stem: "A nursing home resident has intense itching that is worse at night, with tiny burrows between his fingers and on his wrists. Two staff members now itch too. Which condition is most likely?",
                  options: [
                    {
                      t: "Scabies",
                      ok: true,
                      why: "Night-time itch, burrows in finger webs and wrists, and spread through close contact are classic.",
                    },
                    {
                      t: "Contact dermatitis",
                      ok: false,
                      why: "Contact dermatitis follows the area that touched an allergen and does not spread between people.",
                    },
                    { t: "Tinea corporis", ok: false, why: "Tinea forms ring-shaped scaly patches." },
                    { t: "Impetigo", ok: false, why: "Impetigo has honey-colored crusts." },
                  ],
                  rationale: "Itch at night plus burrows plus spread to contacts is scabies.",
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

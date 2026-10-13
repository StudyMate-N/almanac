import type { APage } from "./author";

/** Kept from the Meridian course: Lesson 3.3. */
export const l33: APage = {
  id: "s2-l3-3",
  title: "Lesson 3.3: Complications of Musculoskeletal Trauma",
  kind: "activity",
  blocks: [
    {
      t: "eq",
      text: "How do musculoskeletal injuries lead to complications elsewhere in the body?",
    },
    {
      t: "p",
      html: "A fracture or crush injury affects more than bone. Swelling, bleeding, released muscle contents and fat droplets can harm the kidneys, the lungs and the limb itself. This page covers the complications you are expected to recognize early.",
    },
    {
      t: "case",
      title: "Marcus, 23",
      html: "Marcus is a firefighter recruit. After an extreme training day in the heat he has severe thigh and calf pain and weakness. The next morning his urine is dark brown. His creatine kinase (CK) is 48,000 U/L and his potassium is 5.9 mEq/L.",
    },
    {
      t: "h2",
      text: "Rhabdomyolysis",
    },
    {
      t: "p",
      html: "Rhabdomyolysis is the breakdown of skeletal muscle. Injured muscle cells release their contents into the blood:",
    },
    {
      t: "ul",
      items: [
        "<strong>Myoglobin</strong> is filtered by the kidney. It blocks the tubules and damages tubular cells, especially when the client is dehydrated. This can cause acute kidney injury. Urine turns tea- or cola-colored.",
        "<strong>Potassium</strong> leaks out of the cells, which can cause dangerous hyperkalemia.",
        "<strong>Creatine kinase</strong> rises sharply. CK is the main marker used to diagnose and track rhabdomyolysis.",
      ],
    },
    {
      t: "p",
      html: "Causes include crush injuries, extreme exercise, heat illness, prolonged immobilization after a fall, seizures, and some drugs and toxins. Early, aggressive IV fluids help protect the kidneys.",
    },
    {
      t: "p",
      html: "<strong>Crush syndrome</strong> is the systemic form. When a crushed limb is freed, the released potassium and myoglobin reach the circulation all at once, risking cardiac dysrhythmias and kidney failure.",
    },
    {
      t: "open",
      id: "s2-o1",
      stem: "Explain how Marcus's muscle injury explains both his dark urine and his potassium of 5.9 mEq/L. What is the main risk to his kidneys?",
      expert:
        "Damaged muscle cells release myoglobin and potassium into the blood. Myoglobin is filtered by the kidneys and turns the urine dark brown. In the tubules it causes obstruction and direct toxic injury, so the main risk is acute kidney injury, which dehydration makes worse. Potassium moving out of the damaged cells raises his serum level, which threatens his heart rhythm.",
    },
    {
      t: "h2",
      text: "Compartment syndrome",
    },
    {
      t: "p",
      html: "Muscles, nerves and vessels in the limbs sit inside compartments wrapped in fascia, which does not stretch. After a fracture or crush injury, bleeding and swelling raise the pressure inside the compartment. When that pressure exceeds capillary perfusion pressure, blood flow to muscle and nerve stops. Without treatment, the muscle can die within hours. A tight cast or dressing can cause the same problem from outside.",
    },
    {
      t: "table",
      head: ["Timing", "Finding"],
      rows: [
        ["Early", "Pain out of proportion to the injury, not relieved by usual analgesia"],
        ["Early", "Pain when the muscles in the compartment are passively stretched (for example, moving the toes)"],
        ["Early", "Limb feels tense or firm; tingling or numbness"],
        ["Late", "Paralysis, pallor and pulselessness. A palpable pulse does not rule out compartment syndrome."],
      ],
    },
    {
      t: "callout",
      title: "Nursing priority",
      html: "Report suspected compartment syndrome immediately. Loosen or split a tight cast or dressing as ordered and keep the limb at heart level. Raising it higher reduces arterial flow. Definitive treatment is fasciotomy.",
    },
    {
      t: "q",
      q: {
        id: "s2-c1",
        type: "ms",
        stem: "A client has a casted tibial fracture. Which findings are early signs of compartment syndrome? <strong>Choose 2 answers.</strong>",
        options: [
          {
            t: "Pain that is not relieved by the prescribed opioid",
            ok: true,
            why: "Pain out of proportion to the injury is often the earliest sign.",
          },
          {
            t: "Severe pain when the nurse gently moves the client's toes",
            ok: true,
            why: "Passive stretch pulls on ischemic muscle within the compartment.",
          },
          {
            t: "Absent pedal pulse",
            ok: false,
            why: "Pulselessness is a late sign. Muscle damage may already have happened by then.",
          },
          {
            t: "Inability to move the foot",
            ok: false,
            why: "Paralysis is a late sign of nerve and muscle ischemia.",
          },
          {
            t: "Mild swelling that improves with elevation",
            ok: false,
            why: "Expected swelling that improves is not a warning sign. Compartment syndrome swelling feels tense and does not improve.",
          },
        ],
        rationale: "Act on pain and pain with passive stretch. Waiting for a lost pulse means waiting too long.",
      },
    },
    {
      t: "h2",
      text: "Fat embolism syndrome",
    },
    {
      t: "p",
      html: "After a fracture of a long bone (especially the femur) or the pelvis, fat droplets enter the circulation and lodge in the lungs, brain and skin. Signs usually appear 24–72 hours after the injury. Look for a triad:",
    },
    {
      t: "ul",
      items: ["Respiratory distress and low oxygen saturation", "Neurologic changes such as confusion or restlessness", "A petechial rash on the chest, armpits or conjunctiva"],
    },
    {
      t: "p",
      html: "Pulmonary embolism from a deep vein thrombosis is a separate risk after lower-limb fractures, surgery and immobility. It can appear later, often days to weeks after the injury.",
    },
    {
      t: "h2",
      text: "Osteomyelitis",
    },
    {
      t: "p",
      html: "Osteomyelitis is a bone infection, most often caused by <em>Staphylococcus aureus</em>. Bacteria reach bone directly, through an open fracture, surgery or a diabetic foot ulcer, or through the blood, which is more common in children. Infected bone can die and form a sequestrum that antibiotics struggle to reach, so treatment is long and sometimes surgical. Expect bone pain, warmth, swelling and fever, with raised inflammatory markers.",
    },
  ],
};

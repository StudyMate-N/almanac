import type { ASection } from "./author";

// Section 6 rebuilt to course standard v1: one page per topic. Question and card ids unchanged.
// Items marked "REVIEW" need owner approval in the review screen.
const T = "McCance & Huether, Pathophysiology";

export const s6: ASection = {
  id: "s6",
  num: 6,
  kind: "section",
  title: "Gastrointestinal and Renal Systems",
  blurb: "Reflux, ulcers and bowel disease; liver, gallbladder and pancreas; stones and infection; acute and chronic kidney disease; kidney and bladder cancer.",
  competency: "Describe the pathogenesis, manifestations, complications and variations of gastrointestinal and renal disorders.",
  source: `${T}: Structure and function of the digestive system; Alterations of digestive function; Structure and function of the renal and urologic systems; Alterations of renal and urinary tract function.`,
  groups: [
    {
      id: "s6-topics",
      title: "Topics",
      pages: [
        {
          id: "s6-tp0",
          title: "6.0 Meet Joan",
          kind: "reading",
          blocks: [
            {
              t: "p",
              html: "The gastrointestinal tract and the kidneys share the abdomen and share a job: managing what goes in and what comes out. The gut breaks food down and absorbs it; the liver processes it, makes proteins and clotting factors and clears drugs and toxins; the kidneys filter about 180 liters of plasma a day to remove waste and fine-tune fluid, electrolytes, acid–base balance, blood pressure and red cell production. Key ideas in this section: <strong>digestion, absorption, motility, metabolism, filtration</strong> and <strong>osmoregulation</strong>.",
            },
            { t: "p", html: "Four patients run through this section." },
            {
              t: "case",
              title: "Joan, 52",
              html: "Joan has burning upper abdominal pain that wakes her at night and eases when she eats. She takes ibuprofen most days for back pain.",
            },
            {
              t: "case",
              title: "Larry, 22",
              html: "Larry has had bloody diarrhea up to eight times a day for three weeks, cramping and urgency.",
            },
            {
              t: "case",
              title: "Jim, 62",
              html: "Jim's routine hepatitis C antibody test is positive, and an HCV RNA test confirms current (chronic) infection. He used injection drugs briefly in his twenties.",
            },
            {
              t: "case",
              title: "Brad, 42",
              html: "Brad arrives with severe right flank pain that comes in waves and spreads to his groin. He is pale, sweating and vomiting, and there is blood in his urine.",
            },
            { t: "h2", text: "By the end of this section you should be able to" },
            {
              t: "ol",
              items: [
                "Describe disorders of the upper GI tract: reflux, hernia, gastritis, peptic ulcer, gastroenteritis and celiac disease.",
                "Tell ulcerative colitis from Crohn disease, and recognize diverticulitis and appendicitis.",
                "Explain hepatitis, cirrhosis and its complications, gallbladder disease and pancreatitis.",
                "Describe kidney stones, urinary infections and glomerular disease.",
                "Classify acute kidney injury, stage chronic kidney disease and compare dialysis methods.",
                "Recognize kidney and bladder cancer.",
              ],
            },
          ],
        },
        {
          id: "s6-tp1",
          title: "6.1 Reflux, ulcers and the upper GI",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What happens when the upper GI tract's defenses fail?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "GERD: weak or relaxing LES; Barrett esophagus is metaplasia that can lead to cancer. Hiatal hernia risk rises with abdominal pressure.",
                "Peptic ulcer: <em>H. pylori</em> and NSAIDs. Duodenal pain eases with food; gastric pain worsens with it. Report bleeding, perforation and obstruction.",
                "Most gastroenteritis is viral. Celiac disease is an autoimmune reaction to gluten that flattens the villi.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p1",
              stem: "Which ulcer's pain eases when the person eats?",
              options: [{ id: "a", text: "Duodenal" }, { id: "b", text: "Gastric" }],
              correct: "a",
              reveal: "Duodenal ulcer pain eases with food; gastric ulcer pain worsens with it.",
            },
            {
              t: "p",
              html: "The GI system is the tract itself (mouth, esophagus, stomach, small and large intestine, rectum and anus) plus the accessory organs: liver, gallbladder and pancreas. Beyond digestion and absorption, it metabolizes medications, recycles red blood cells (bilirubin), makes clotting factors and albumin, and houses much of the body's immune tissue.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s6-peptic-ulcer",
              alt: "Stomach wall: intact lining with mucus; a peptic ulcer crater through the mucosa into the submucosa, with curved bacteria and an eroded vessel.",
              panels: [
                { label: "Normal lining", sub: "Intact mucosa and mucus" },
                { label: "Peptic ulcer", sub: "Crater into submucosa" },
              ],
              aspect: "3:2",
            },
            {
              t: "table",
              head: ["Defense", "What it protects against"],
              rows: [
                ["Lower esophageal sphincter (LES)", "Acid refluxing into the esophagus"],
                [
                  "Gastric mucus, bicarbonate and prostaglandins",
                  "Acid and pepsin digesting the stomach and duodenal lining (NSAIDs block prostaglandins)",
                ],
                ["Intestinal villi", "The surface area needed to absorb nutrients"],
                ["Gut-associated lymphoid tissue", "Pathogens entering through the gut"],
              ],
            },
            {
              t: "table",
              head: ["Disorder", "Mechanism", "Presentation"],
              rows: [
                [
                  "Gastroesophageal reflux disease (GERD)",
                  "The LES relaxes inappropriately or is weak, so acid and pepsin reflux into the esophagus",
                  "Heartburn and regurgitation, worse after meals and lying down; cough, hoarseness. Complications: esophagitis, stricture, <strong>Barrett esophagus</strong> (metaplasia that can progress to adenocarcinoma)",
                ],
                [
                  "Hiatal hernia",
                  "Part of the stomach slides up through the diaphragm. Risk rises with anything that raises abdominal pressure: obesity, pregnancy, heavy lifting, chronic cough or straining; and with age",
                  "Often reflux symptoms; a large paraesophageal hernia can strangulate",
                ],
                [
                  "Gastritis",
                  "Inflammation of the stomach lining. Acute: NSAIDs, alcohol, stress. Chronic: <em>H. pylori</em>, or autoimmune (which leads to pernicious anemia)",
                  "Epigastric pain, nausea; may bleed",
                ],
                [
                  "Peptic ulcer disease",
                  "Acid and pepsin overwhelm mucosal defenses. The two main causes are <em>H. pylori</em> and NSAIDs",
                  "Burning epigastric pain. Duodenal: 2–3 hours after meals and at night, eased by food. Gastric: soon after eating",
                ],
                [
                  "Gastroenteritis",
                  "Infection of the stomach and intestines; <strong>viruses are the most common cause</strong> (norovirus is the leading cause at all ages)",
                  "Vomiting, diarrhea, cramps; dehydration and electrolyte loss are the main dangers",
                ],
                [
                  "Celiac disease",
                  "Autoimmune reaction to gluten in genetically susceptible people flattens the small-intestinal villi",
                  "Diarrhea, bloating, weight loss, iron-deficiency anemia, an itchy blistering rash; in children, poor growth",
                ],
              ],
            },
            {
              t: "callout",
              title: "Ulcer complications to report at once",
              html: "<strong>Bleeding:</strong> vomiting blood or coffee-ground material, black tarry stools, dizziness and a fast pulse. <strong>Perforation:</strong> sudden severe abdominal pain with a rigid, board-like abdomen (peritonitis). <strong>Obstruction:</strong> vomiting of undigested food from scarring at the pylorus.",
            },
            {
              t: "q",
              q: {
                id: "s6-c1",
                type: "mc",
                stem: "Joan (52) has burning epigastric pain that wakes her at night and improves after eating. She takes ibuprofen daily. Which explanation is most likely?",
                options: [
                  {
                    t: "A duodenal ulcer from NSAIDs reducing protective prostaglandins",
                    ok: true,
                    why: "Night pain eased by food fits a duodenal ulcer; NSAIDs weaken mucosal defense.",
                  },
                  {
                    t: "GERD from a weak lower esophageal sphincter",
                    ok: false,
                    why: "GERD causes heartburn behind the breastbone, worse after meals and lying down.",
                  },
                  { t: "Gastroenteritis", ok: false, why: "Gastroenteritis is short-lived vomiting and diarrhea." },
                  {
                    t: "Celiac disease of the small intestine",
                    ok: false,
                    why: "Celiac disease causes malabsorption, not night-time epigastric pain relieved by food.",
                  },
                ],
                rationale: "Duodenal ulcer pain is eased by food; gastric ulcer pain is worsened by it.",
                level: "application",
              },
            },
            {
              t: "q",
              q: {
                id: "s6-c2",
                type: "mc",
                stem: "What is the most common cause of gastroenteritis?",
                options: [
                  {
                    t: "Viral infection, such as norovirus",
                    ok: true,
                    why: "Viruses cause most cases in both adults and children.",
                  },
                  { t: "Bacterial food poisoning", ok: false, why: "Bacteria cause some cases, but fewer than viruses." },
                  { t: "Parasitic infection", ok: false, why: "Parasites such as Giardia are less common causes." },
                  { t: "Food allergy", ok: false, why: "Allergy is not an infectious gastroenteritis." },
                ],
                rationale: "Viral, usually self-limiting; the danger is dehydration.",
                level: "recall",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open1",
              stem: "How do NSAIDs lead to peptic ulcers?",
              expert: "NSAIDs block prostaglandins, which normally maintain the stomach's protective mucus, bicarbonate and blood flow. With weaker defenses, acid damages the lining.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 1285–1301 and 1318–1322: Structure and function of the digestive system" },
                { ref: "p. 1324: Gastroesophageal reflux disease; pp. 1325–1326: Hiatal hernia; p. 1329: Gastritis" },
                { ref: "pp. 1331–1334: Peptic ulcer disease; pp. 1385–1387: Celiac disease" },
              ],
            },
          ],
        },
        {
          id: "s6-tp2",
          title: "6.2 IBD, diverticulitis and appendicitis",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do inflammatory and obstructive disorders of the intestine show up?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "UC: colon only, continuous from the rectum, mucosal, bloody.",
                "Crohn: mouth to anus, skip lesions, transmural, fistulas and strictures.",
                "Diverticulitis: left lower quadrant pain and fever.",
                "Appendicitis: umbilical pain moving to the right lower quadrant.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p2",
              stem: "Which disease can form fistulas?",
              options: [{ id: "a", text: "Crohn disease" }, { id: "b", text: "Ulcerative colitis" }],
              correct: "a",
              reveal: "Crohn inflammation is transmural, through the full wall, so it can tunnel into nearby structures. UC stays in the mucosa.",
            },
            {
              t: "case",
              title: "Larry, 22",
              html: "Three weeks of bloody diarrhea up to eight times a day, cramping lower abdominal pain, urgency and a constant feeling of needing to pass stool (tenesmus). Colonoscopy shows continuous inflammation from the rectum upward; biopsies show it is limited to the mucosa.",
            },
            { t: "h2", text: "Inflammatory bowel disease" },
            {
              t: "p",
              html: "Both forms are chronic, relapsing, immune-mediated inflammation of the bowel in genetically susceptible people. Neither is caused by an infection, though gut bacteria help drive the inflammation. Onset often peaks between 15 and 30.",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s6-crohn-vs-uc",
              alt: "Bowel segments: Crohn disease with patchy cobblestone areas and full-thickness inflammation; ulcerative colitis with continuous ulceration limited to the inner lining.",
              panels: [
                { label: "Crohn disease", sub: "Skip lesions, full wall" },
                { label: "Ulcerative colitis", sub: "Continuous, inner lining" },
              ],
              aspect: "3:2",
            },
            {
              t: "table",
              head: ["", "Ulcerative colitis", "Crohn disease"],
              rows: [
                [
                  "Where",
                  "Colon only; starts in the rectum and extends continuously upward",
                  "Anywhere from mouth to anus, most often the terminal ileum; <strong>skip lesions</strong>",
                ],
                ["Depth", "Mucosa only", "<strong>Transmural</strong>: the full thickness of the wall"],
                [
                  "Stool",
                  "Bloody diarrhea with mucus; urgency, tenesmus",
                  "Diarrhea, usually not bloody; right lower quadrant pain",
                ],
                ["Look", "Continuous ulcerated mucosa, pseudopolyps", "Cobblestone mucosa, narrowed segments"],
                [
                  "Complications",
                  "Hemorrhage, toxic megacolon, colon cancer",
                  "Fistulas, abscesses, strictures and obstruction, malabsorption (vitamin B12 and bile salts if the terminal ileum is affected)",
                ],
                ["Smoking", "Not a risk (former smokers have higher risk)", "Raises risk and worsens disease"],
              ],
            },
            {
              t: "q",
              q: {
                id: "s6-c3",
                type: "ms",
                stem: "Which statements about Larry's ulcerative colitis are true? <strong>Choose 3 answers.</strong>",
                options: [
                  {
                    t: "It is a chronic inflammatory disease limited to the colon",
                    ok: true,
                    why: "UC affects only the colon and rectum.",
                  },
                  {
                    t: "Inflammation is continuous and starts in the rectum",
                    ok: true,
                    why: "UC spreads proximally without skip areas.",
                  },
                  {
                    t: "Long-standing disease raises the risk of colon cancer",
                    ok: true,
                    why: "Chronic inflammation increases dysplasia risk, so surveillance colonoscopy is recommended.",
                  },
                  {
                    t: "Inflammation extends through the full thickness of the bowel wall",
                    ok: false,
                    why: "That is Crohn disease; UC is mucosal.",
                  },
                  {
                    t: "It is caused by a bacterial infection and cured by antibiotics",
                    ok: false,
                    why: "IBD is immune-mediated, not an infection.",
                  },
                ],
                rationale: "UC: colon, continuous, mucosal, bloody. Crohn: anywhere, skip lesions, transmural, fistulas.",
                level: "application",
              },
            },
            { t: "h2", text: "Diverticular disease and appendicitis" },
            {
              t: "ul",
              items: [
                "<strong>Diverticulosis:</strong> small outpouchings of the colon wall, mostly in the sigmoid colon, from high pressure inside a low-fiber colon. Usually silent; can bleed.",
                "<strong>Diverticulitis:</strong> a diverticulum becomes inflamed or perforates. Left lower quadrant pain, fever, raised white count. Complications: abscess, perforation with peritonitis, fistula, obstruction.",
                "<strong>Appendicitis:</strong> obstruction of the appendix (often by hardened stool) lets bacteria multiply and pressure rise. Pain starts around the umbilicus and moves to the right lower quadrant, with nausea, low-grade fever and rebound tenderness. Rupture causes peritonitis.",
              ],
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open2",
              stem: "Why does appendicitis pain start near the umbilicus and then move?",
              expert: "Early on, the inflamed appendix stimulates visceral nerves, felt vaguely around the umbilicus. When inflammation reaches the parietal peritoneum, pain becomes sharp and localized in the right lower quadrant.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 1301–1303: Large intestine" },
                { ref: "pp. 1336–1341: Inflammatory bowel disease through diverticular disease of the colon" },
              ],
            },
          ],
        },
        {
          id: "s6-tp3",
          title: "6.3 Liver, gallbladder and pancreas",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do disorders of the liver, gallbladder and pancreas affect the whole body?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "Hepatitis A and E are fecal–oral and usually acute; B, C and D are blood-borne and can become chronic. Hepatitis A never becomes chronic.",
                "Cirrhosis = portal hypertension (varices, ascites, splenomegaly) + liver failure (jaundice, low albumin, bleeding, encephalopathy).",
                "Cholecystitis: RUQ pain, fever, Murphy sign. Pancreatitis: epigastric pain to the back, high lipase; gallstones and alcohol are the main causes.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p3",
              stem: "Which hepatitis never becomes chronic?",
              options: [{ id: "a", text: "Hepatitis A" }, { id: "b", text: "Hepatitis C" }],
              correct: "a",
              reveal: "Hepatitis A is fecal–oral and always acute. B, C and D are blood-borne and can become chronic.",
            },
            { t: "h2", text: "Viral hepatitis" },
            {
              t: "table",
              head: ["Virus", "Spread", "Can it become chronic?"],
              rows: [
                [
                  "Hepatitis A",
                  "Fecal–oral: contaminated food and water",
                  "<strong>No.</strong> Acute only; vaccine available",
                ],
                [
                  "Hepatitis B",
                  "Blood, sexual contact, mother to baby at birth",
                  "Yes, especially when infected as an infant; vaccine available",
                ],
                [
                  "Hepatitis C",
                  "Blood: shared needles, older transfusions, unsterile tattooing; less often sexual or at birth",
                  "Yes, in most infected adults. A leading cause of cirrhosis and liver cancer. Curable with antiviral tablets",
                ],
                ["Hepatitis D", "Blood; only infects people who have hepatitis B", "Yes; worsens hepatitis B"],
                ["Hepatitis E", "Fecal–oral", "Usually acute; dangerous in pregnancy; chronic only in the immunosuppressed"],
              ],
            },
            {
              t: "p",
              html: "Every hepatitis virus targets <strong>hepatocytes</strong>. Acute hepatitis may cause fatigue, nausea, right upper quadrant pain, dark urine, pale stools and jaundice, but many people, especially with hepatitis C, have no symptoms for decades. That is why adults are screened.",
            },
            { t: "h2", text: "Cirrhosis" },
            {
              t: "p",
              html: "Years of injury (alcohol, chronic hepatitis B or C, fatty liver disease linked to obesity and diabetes) cause inflammation and fibrosis. Scar bands and regenerating nodules replace normal liver structure. Two kinds of problem follow:",
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s6-liver-disease",
              alt: "Three livers: normal; enlarged pale fatty liver; shrunken, nodular, scarred cirrhotic liver.",
              panels: [
                { label: "Normal liver", sub: "Smooth, red-brown" },
                { label: "Fatty liver", sub: "Enlarged, pale yellow" },
                { label: "Cirrhosis", sub: "Shrunken, nodular, scarred" },
              ],
              aspect: "3:1",
            },
            {
              t: "table",
              head: [
                "Portal hypertension (blood cannot flow through the scarred liver)",
                "Liver cell failure (the liver cannot do its jobs)",
              ],
              rows: [
                ["Esophageal and gastric varices that can bleed massively", "Jaundice: bilirubin is not cleared"],
                ["Ascites (with low albumin adding to it)", "Low albumin: edema and ascites"],
                [
                  "Enlarged spleen, which traps platelets (low platelet count)",
                  "Poor clotting-factor production: bleeding, raised INR",
                ],
                [
                  "Dilated abdominal wall veins",
                  "Ammonia is not cleared: hepatic encephalopathy (confusion, flapping tremor)",
                ],
                ["", "Hormone changes: spider angiomas, red palms, gynecomastia"],
              ],
            },
            { t: "h2", text: "Gallbladder and pancreas" },
            {
              t: "ul",
              items: [
                "<strong>Gallstones (cholelithiasis):</strong> mostly cholesterol stones. Risk rises with female sex, age over 40, obesity, pregnancy and estrogen, and rapid weight loss. A stone that briefly blocks the cystic duct causes biliary colic: right upper quadrant pain after a fatty meal, radiating to the right shoulder.",
                "<strong>Cholecystitis:</strong> a stone stays lodged and the gallbladder inflames: constant right upper quadrant pain, fever, a raised white count, and pain that stops inspiration when the area is pressed (Murphy sign). Untreated, it can lead to gangrene, perforation and peritonitis; a stone in the common bile duct can cause jaundice, cholangitis or pancreatitis.",
                "<strong>Acute pancreatitis:</strong> digestive enzymes (trypsin first) are activated inside the pancreas and digest it. The two main causes are <strong>gallstones and alcohol</strong>; very high triglycerides and some drugs also cause it. Severe epigastric pain radiating to the back, nausea and vomiting, and lipase at least three times normal. In severe cases, bleeding tracks into the abdominal wall: bruising around the umbilicus (Cullen sign) or flanks (Grey Turner sign). Complications: hypovolemic shock, ARDS, low calcium, infected necrosis, pseudocyst. Repeated attacks lead to chronic pancreatitis with malabsorption and diabetes.",
              ],
            },
            {
              t: "q",
              q: {
                id: "s6-c4",
                type: "ms",
                stem: "Jim (62) has chronic hepatitis C. Which statements are true? <strong>Choose 3 answers.</strong>",
                options: [
                  { t: "The virus targets liver cells", ok: true, why: "Hepatitis viruses infect hepatocytes." },
                  {
                    t: "It is spread mainly through blood, such as shared needles",
                    ok: true,
                    why: "Blood exposure is the main route.",
                  },
                  {
                    t: "Untreated, it can progress to cirrhosis and liver cancer",
                    ok: true,
                    why: "Chronic inflammation leads to fibrosis, cirrhosis and hepatocellular carcinoma.",
                  },
                  { t: "It is spread mainly by contaminated food", ok: false, why: "That is hepatitis A and E." },
                  {
                    t: "A vaccine can now prevent his liver from being damaged",
                    ok: false,
                    why: "There is no hepatitis C vaccine; antiviral treatment can cure it.",
                  },
                ],
                rationale: "Hepatitis C: blood-borne, often silent, often chronic, curable.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open3",
              stem: "Why does cirrhosis cause ascites?",
              expert: "Scarring raises pressure in the portal vein, pushing fluid into the abdomen, and the failing liver makes less albumin, so less fluid is held in the vessels.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 1342–1353: Common complications of liver disorders; disorders of the liver" },
                { ref: "pp. 1308–1310: Gallbladder and exocrine pancreas" },
                { ref: "pp. 1353–1354: Disorders of the gallbladder; pp. 1355–1357: Disorders of the pancreas" },
              ],
            },
          ],
        },
        {
          id: "s6-l9-quiz",
          topic: "Gastrointestinal System Pathophysiology",
          title: "Quiz: Lesson 9 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on the GI tract, liver, gallbladder and pancreas." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s6-q1",
                  type: "mc",
                  stem: "What is the pathophysiological cause of gastroesophageal reflux disease (GERD)?",
                  options: [
                    {
                      t: "A weak or inappropriately relaxing lower esophageal sphincter",
                      ok: true,
                      why: "LES dysfunction is the core mechanism.",
                    },
                    {
                      t: "H. pylori infection of the esophageal lining",
                      ok: false,
                      why: "H. pylori infects the stomach and causes gastritis and ulcers.",
                    },
                    { t: "Autoimmune destruction of the esophageal lining", ok: false, why: "GERD is not autoimmune." },
                    {
                      t: "Too little stomach acid to digest food",
                      ok: false,
                      why: "The problem is acid in the wrong place, not too little of it.",
                    },
                  ],
                  rationale: "GERD is a sphincter problem.",
                  level: "application",
                },
                {
                  id: "s6-q2",
                  type: "mc",
                  stem: "What is a risk factor for the development of a hiatal hernia?",
                  options: [
                    { t: "Obesity", ok: true, why: "Raised intra-abdominal pressure pushes the stomach up through the hiatus." },
                    { t: "A low-fat diet", ok: false, why: "Diet composition is not a direct risk factor." },
                    { t: "Hepatitis A infection", ok: false, why: "Hepatitis A is unrelated." },
                    { t: "Regular walking", ok: false, why: "Activity does not raise risk." },
                  ],
                  rationale: "Obesity, pregnancy, heavy lifting, chronic cough, straining and age.",
                  level: "application",
                },
                {
                  id: "s6-q3",
                  type: "mc",
                  stem: "A client has had right upper quadrant pain, fever and nausea for three days but has not sought care. What is a complication of untreated cholecystitis?",
                  options: [
                    {
                      t: "Gallbladder gangrene and perforation",
                      ok: true,
                      why: "Ongoing obstruction and inflammation can lead to necrosis and rupture.",
                    },
                    { t: "Barrett esophagus from bile reflux", ok: false, why: "That is a complication of GERD." },
                    {
                      t: "Celiac disease of the small intestine",
                      ok: false,
                      why: "Celiac disease is autoimmune and gluten-triggered.",
                    },
                    { t: "Acute hepatitis A infection", ok: false, why: "Hepatitis A is viral." },
                  ],
                  rationale: "Obstruction + infection + time = gangrene and perforation.",
                  level: "application",
                },
                {
                  id: "s6-q4",
                  type: "mc",
                  stem: "What is true about hepatitis C?",
                  options: [
                    {
                      t: "Most infections become chronic, often without symptoms for years",
                      ok: true,
                      why: "Hepatitis C frequently persists silently, which is why adults are screened.",
                    },
                    { t: "It is spread mainly by contaminated food", ok: false, why: "That is hepatitis A and E." },
                    { t: "A vaccine is routinely given to prevent it", ok: false, why: "There is no hepatitis C vaccine." },
                    { t: "It infects only people who already have hepatitis B", ok: false, why: "That is hepatitis D." },
                  ],
                  rationale: "C: chronic, blood-borne, curable.",
                  level: "application",
                },
                {
                  id: "s6-q5",
                  type: "mc",
                  stem: "Which changes occur in the liver in cirrhosis?",
                  options: [
                    {
                      t: "Fibrous scar and regenerating nodules replace normal tissue",
                      ok: true,
                      why: "Fibrosis and nodules distort the architecture and cause portal hypertension.",
                    },
                    {
                      t: "The liver enlarges but keeps its normal structure",
                      ok: false,
                      why: "Structure is destroyed in cirrhosis.",
                    },
                    { t: "Bile production increases to clear the damage", ok: false, why: "Liver function falls." },
                    {
                      t: "Hepatocytes multiply into a single benign tumor",
                      ok: false,
                      why: "Nodules form among widespread scarring, not as a single benign tumor.",
                    },
                  ],
                  rationale: "Scar plus nodules = blocked flow plus failing cells.",
                  level: "application",
                },
              ],
            },
          ],
        },
        {
          id: "s6-tp4",
          title: "6.4 Stones, infection and the glomeruli",
          kind: "topic",
          blocks: [
            { t: "eq", text: "What happens when the urinary tract is blocked, infected or inflamed?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "The kidneys filter waste and regulate fluid, blood pressure, electrolytes, acid–base, vitamin D and red cell production (erythropoietin).",
                "Most stones are calcium; dehydration is the main modifiable cause. Renal colic radiates from flank to groin. Obstruction plus infection is an emergency.",
                "Cystitis: bladder symptoms. Pyelonephritis: fever, flank pain, CVA tenderness. Older adults may present with confusion.",
                "Nephritic: blood, hypertension, some protein. Nephrotic: protein over 3.5 g a day, low albumin, edema, high lipids.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p4",
              stem: "Nephrotic syndrome causes edema mainly because of…",
              options: [{ id: "a", text: "Protein loss in the urine" }, { id: "b", text: "High blood pressure" }],
              correct: "a",
              reveal: "Large amounts of albumin leak into the urine. Low albumin lets fluid escape into the tissues.",
            },
            {
              t: "p",
              html: "The renal system is the kidneys, ureters, bladder and urethra. Each kidney holds about a million nephrons. The <strong>glomerulus</strong> filters plasma; the tubules reabsorb what the body needs and secrete what it does not. Beyond removing waste, the kidneys regulate fluid volume and blood pressure (renin), sodium, potassium and acid–base balance, activate vitamin D, and make <strong>erythropoietin</strong>, which drives red cell production.",
            },
            {
              t: "table",
              head: ["Measure", "What it tells you"],
              rows: [
                ["Serum creatinine", "Rises as filtration falls; affected by muscle mass"],
                [
                  "Estimated GFR (eGFR)",
                  "Calculated from creatinine; used to stage chronic kidney disease. Normal is about 90–120 mL/min/1.73 m²",
                ],
                [
                  "Blood urea nitrogen (BUN)",
                  "Rises with reduced filtration, dehydration, GI bleeding or high protein intake",
                ],
                ["Urine output", "Below 0.5 mL/kg/hour for 6 hours is one criterion for acute kidney injury"],
                ["Urinalysis", "Protein (glomerular leak), blood, white cells and casts point to the cause"],
              ],
            },
            {
              t: "case",
              title: "Brad, 42",
              html: "Severe right flank pain coming in waves and spreading to the groin, nausea and vomiting, blood in the urine. He works outdoors in the heat and drinks little water. CT shows a 7 mm stone in the right ureter with swelling of the right kidney (hydronephrosis).",
            },
            { t: "h2", text: "Kidney stones" },
            {
              t: "ul",
              items: [
                "<strong>Types:</strong> calcium oxalate or phosphate (most common), uric acid (gout, high purine intake), struvite (infection with urease-producing bacteria), cystine (inherited).",
                "<strong>Why they form:</strong> urine supersaturated with the stone's components. Dehydration (low urine volume) is the most common and most modifiable cause; also high calcium or oxalate excretion, gout, recurrent infection and some diets.",
                "<strong>Renal colic:</strong> a stone moving down the ureter causes waves of severe flank pain radiating to the groin, nausea and hematuria.",
                "<strong>Hydronephrosis:</strong> urine backs up and dilates the kidney. Prolonged obstruction damages it; obstruction <em>with</em> infection is an emergency.",
              ],
            },
            { t: "h2", text: "Urinary tract infection" },
            {
              t: "table",
              head: ["", "Cystitis (lower UTI)", "Pyelonephritis (upper UTI)"],
              rows: [
                ["Where", "Bladder", "Kidney and renal pelvis"],
                [
                  "Signs",
                  "Burning on urination, frequency, urgency, suprapubic discomfort, cloudy urine",
                  "Fever, chills, flank pain, tenderness at the costovertebral angle, nausea; white cell casts",
                ],
                [
                  "Notes",
                  "<em>E. coli</em> causes most. Women are at higher risk (short urethra)",
                  "Can lead to sepsis; recurrent infection scars the kidney",
                ],
              ],
            },
            {
              t: "p",
              html: "<strong>Variation:</strong> older adults with a UTI may have no urinary symptoms and present with confusion or a fall.",
            },
            { t: "h2", text: "Glomerular disease" },
            {
              t: "table",
              head: ["", "Nephritic picture (glomerulonephritis)", "Nephrotic syndrome"],
              rows: [
                [
                  "What",
                  "Inflammation of the glomeruli, usually immune-mediated",
                  "The glomerular filter becomes leaky to protein",
                ],
                [
                  "Examples",
                  "Post-streptococcal glomerulonephritis (1–3 weeks after strep throat; 3–6 weeks after a strep skin infection), IgA nephropathy, lupus nephritis",
                  "Minimal change disease (children), diabetic kidney disease, membranous nephropathy",
                ],
                [
                  "Urine",
                  "Blood (cola-colored urine, red cell casts), some protein, low volume",
                  "Heavy protein (more than 3.5 g a day), foamy urine",
                ],
                [
                  "Body",
                  "Hypertension, puffiness around the eyes, rising creatinine",
                  "Low albumin, marked edema, high cholesterol, clotting risk",
                ],
              ],
            },
            // REVIEW: new image
            {
              t: "img",
              id: "s6-glomerulonephritis",
              alt: "A glomerulus: normal with open loops; glomerulonephritis with inflamed loops leaking red cells and protein into the tubule.",
              panels: [
                { label: "Normal glomerulus", sub: "Open loops" },
                { label: "Glomerulonephritis", sub: "Inflamed, leaking" },
              ],
              aspect: "3:2",
            },
            {
              t: "q",
              q: {
                id: "s6-c5",
                type: "mc",
                stem: "A client has been diagnosed with glomerulonephritis and asks what it means. What is the best response from the provider?",
                options: [
                  {
                    t: "\"It is inflammation of the tiny kidney filters, usually immune-related.\"",
                    ok: true,
                    why: "Glomerulonephritis is glomerular inflammation, most often immune-mediated.",
                  },
                  { t: "\"It is a bacterial infection of your bladder.\"", ok: false, why: "That is cystitis." },
                  {
                    t: "\"It is swelling of the kidney because urine has backed up.\"",
                    ok: false,
                    why: "That is hydronephrosis.",
                  },
                  {
                    t: "\"It is caused by a kidney stone scratching the kidney.\"",
                    ok: false,
                    why: "Stones do not cause glomerulonephritis.",
                  },
                ],
                rationale: "Glomerulo = filter; -nephritis = kidney inflammation.",
                level: "application",
              },
            },
            {
              t: "q",
              q: {
                id: "s6-c6",
                type: "mc",
                stem: "What is the most likely cause of Brad's kidney stone?",
                options: [
                  {
                    t: "Chronic dehydration",
                    ok: true,
                    why: "Low urine volume lets stone components crystallize; it is the most common modifiable cause.",
                  },
                  {
                    t: "A bladder infection",
                    ok: false,
                    why: "Infection causes struvite stones, but nothing suggests infection here.",
                  },
                  { t: "Glomerulonephritis", ok: false, why: "Glomerular inflammation does not form stones." },
                  { t: "Drinking too much water", ok: false, why: "High fluid intake prevents stones." },
                ],
                rationale: "Teach at least 2–3 liters of fluid a day unless restricted.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open4",
              stem: "Why is a kidney stone with fever an emergency?",
              expert: "Obstruction traps infected urine behind the stone, so the kidney cannot drain and bacteria can enter the blood. It can progress quickly to sepsis and kidney damage.",
            },
            {
              t: "read",
              items: [
                { ref: "pp. 1211–1217: Structures of the renal system; bladder and urethra" },
                { ref: "pp. 1232–1241: Urinary tract obstruction" },
                { ref: "pp. 1242–1252: Urinary tract infection and glomerular disorders" },
              ],
            },
          ],
        },
        {
          id: "s6-tp5",
          title: "6.5 AKI, CKD and dialysis",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do acute and chronic kidney failure show up, and how is the kidney's work replaced?" },
            // REVIEW: rearranged from approved summary text
            {
              t: "keypoints",
              items: [
                "AKI: prerenal (perfusion), intrarenal (tissue), postrenal (obstruction). Prerenal is the most common.",
                "CKD stages by GFR; G5 (below 15) is kidney failure, when dialysis or transplant is usually needed. Diabetes and hypertension cause most CKD.",
                "CKD complications: fluid overload, hyperkalemia, acidosis, anemia (low EPO), bone disease, uremia.",
                "CRRT is slow and continuous for unstable ICU patients; hemodialysis is intermittent and faster.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p5",
              stem: "Which type of acute kidney injury is most common?",
              options: [{ id: "a", text: "Prerenal" }, { id: "b", text: "Postrenal" }],
              correct: "a",
              reveal: "Prerenal AKI, from poor perfusion, is the most common.",
            },
            { t: "h2", text: "Acute kidney injury (AKI)" },
            {
              t: "p",
              html: "AKI is a sudden fall in kidney function over hours to days: a rise in creatinine of 0.3 mg/dL or more within 48 hours, a rise to 1.5 times baseline within 7 days, or urine output below 0.5 mL/kg/hour for 6 hours.",
            },
            {
              t: "table",
              head: ["Type", "Problem", "Causes"],
              rows: [
                [
                  "Prerenal (most common)",
                  "Not enough blood reaching the kidneys; the kidney itself is intact at first",
                  "Dehydration, hemorrhage, heart failure, shock, sepsis; NSAIDs and ACE inhibitors in a dry patient",
                ],
                [
                  "Intrarenal (intrinsic)",
                  "Damage to the kidney tissue itself",
                  "Acute tubular necrosis from prolonged ischemia or toxins (aminoglycosides, IV contrast, myoglobin), glomerulonephritis, interstitial nephritis",
                ],
                ["Postrenal", "Urine cannot drain out", "Kidney stones, enlarged prostate, tumors, blocked catheter"],
              ],
            },
            {
              t: "p",
              html: "Brad's creatinine stays near normal: one blocked ureter rarely causes AKI because the other kidney compensates. <strong>Postrenal</strong> AKI needs both outflows blocked (for example, by an enlarged prostate) or obstruction of a single working kidney. Prolonged one-sided obstruction can still permanently damage the blocked kidney, so it is relieved promptly.",
            },
            { t: "h2", text: "Chronic kidney disease (CKD)" },
            {
              t: "table",
              caption: "CKD is kidney damage, or a GFR below 60, for more than 3 months. It is staged by GFR (and by the amount of albumin in the urine).",
              head: ["Stage", "GFR (mL/min/1.73 m²)", "Description"],
              rows: [
                ["G1", "90 or above", "Kidney damage with normal GFR"],
                ["G2", "60–89", "Mildly decreased"],
                ["G3a / G3b", "45–59 / 30–44", "Moderately decreased"],
                ["G4", "15–29", "Severely decreased; prepare for kidney replacement"],
                [
                  "G5",
                  "Below 15",
                  "Kidney failure (end-stage kidney disease): dialysis or transplant usually needed; conservative care is an option",
                ],
              ],
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
              html: "The leading causes are <strong>diabetes</strong> and <strong>hypertension</strong>. As nephrons are lost, the rest work harder and are damaged in turn. Complications follow from every job the kidney can no longer do:",
            },
            {
              t: "ul",
              items: [
                "Fluid overload, hypertension and heart failure",
                "Hyperkalemia and metabolic acidosis",
                "Anemia from low erythropoietin",
                "Mineral and bone disease: high phosphate, low active vitamin D, low calcium, high PTH, weak bones",
                "Uremia: nausea, itching, fatigue, poor concentration, and in advanced disease pericarditis and confusion",
                "Higher cardiovascular risk and altered drug clearance",
              ],
            },
            { t: "h2", text: "Replacing the kidney's work" },
            {
              t: "table",
              head: ["", "Intermittent hemodialysis", "Continuous renal replacement therapy (CRRT)", "Peritoneal dialysis"],
              rows: [
                [
                  "When",
                  "Stable patients; usually 3–4 hours, 3 times a week",
                  "Critically ill patients in intensive care who cannot tolerate rapid shifts",
                  "At home, every day",
                ],
                [
                  "How fast",
                  "Fast removal of fluid and solutes",
                  "Slow and continuous, around the clock",
                  "Slow and continuous",
                ],
                [
                  "Main risks",
                  "Hypotension and cramps from rapid fluid shifts; access problems",
                  "Needs ICU staff, anticoagulation of the circuit, continuous monitoring",
                  "Peritonitis",
                ],
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
              t: "callout",
              title: "Medications and the kidneys",
              html: "NSAIDs reduce prostaglandins that keep the kidney's arterioles open; combined with an ACE inhibitor or ARB and a diuretic in a dehydrated client, they can tip a stable kidney into AKI. Aminoglycosides, IV contrast and some antivirals are directly toxic to the tubules. Doses of many drugs must be reduced as GFR falls.",
            },
            {
              t: "q",
              q: {
                id: "s6-c7",
                type: "mc",
                stem: "What is a major difference between CRRT and intermittent hemodialysis?",
                options: [
                  {
                    t: "CRRT works slowly and continuously, so unstable patients tolerate it",
                    ok: true,
                    why: "Gradual removal avoids the hypotension caused by rapid shifts.",
                  },
                  { t: "CRRT is done at home three times a week", ok: false, why: "CRRT runs continuously in intensive care." },
                  { t: "Hemodialysis uses the peritoneum as its membrane", ok: false, why: "That is peritoneal dialysis." },
                  {
                    t: "CRRT removes fluid faster than hemodialysis does",
                    ok: false,
                    why: "It is slower; that is its advantage.",
                  },
                ],
                rationale: "Slow and steady for the unstable patient.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open5",
              stem: "Why does chronic kidney disease cause anemia?",
              expert: "The kidneys make erythropoietin, which drives red cell production. Damaged kidneys make less, so fewer red cells are produced.",
            },
            { t: "read", items: [{ ref: "pp. 1252–1263: Acute kidney injury and chronic kidney disease" }] },
          ],
        },
        {
          id: "s6-tp6",
          title: "6.6 Kidney and bladder cancer",
          kind: "topic",
          blocks: [
            { t: "eq", text: "How do tumors of the kidney and bladder present, and what does losing a kidney mean?" },
            // REVIEW: rearranged from approved summary text (some new)
            {
              t: "keypoints",
              items: [
                "Smoking is the strongest risk factor for bladder cancer.",
                "Painless hematuria needs investigation.",
                "Losing one kidney is compatible with normal life; the other kidney compensates.",
              ],
            },
            // REVIEW: new
            {
              t: "predict",
              id: "s6-p6",
              stem: "A 65-year-old smoker has painless blood in the urine. Reassuring or worrying?",
              options: [{ id: "a", text: "Worrying" }, { id: "b", text: "Reassuring" }],
              correct: "a",
              reveal: "Painless hematuria is the classic first sign of bladder cancer and always needs investigation.",
            },
            {
              t: "case",
              title: "Brad, six months later",
              html: "At follow-up imaging, a 5 cm solid mass is found in Brad's left kidney. He has had no symptoms. He smokes and his BMI is 34. A total left nephrectomy is planned.",
            },
            {
              t: "table",
              head: ["", "Renal cell carcinoma", "Bladder cancer"],
              rows: [
                ["Origin", "Lining of the proximal tubule", "Urothelium (transitional cells) lining the bladder"],
                [
                  "Risk factors",
                  "Smoking, obesity, hypertension, long-term dialysis, inherited syndromes such as von Hippel-Lindau",
                  "<strong>Smoking (the strongest)</strong>, occupational chemicals (aromatic amines in dyes, rubber and leather work), chronic bladder irritation, prior pelvic radiation or cyclophosphamide",
                ],
                [
                  "Presentation",
                  "Often found by chance on imaging. The classic triad of hematuria, flank pain and a flank mass appears in only a minority. Can produce hormones: high red cell count (erythropoietin) or high calcium",
                  "<strong>Painless hematuria</strong>, often visible; later frequency, urgency",
                ],
              ],
            },
            {
              t: "callout",
              title: "Painless blood in the urine",
              html: "Visible blood in the urine without pain or infection in an adult must be investigated for urinary tract cancer, especially in a smoker. Do not assume it is a UTI.",
            },
            {
              t: "p",
              html: "<strong>Living with one kidney:</strong> after a nephrectomy, the remaining kidney enlarges and increases its filtration, so most people keep near-normal kidney function. The remaining kidney must be protected: control blood pressure and glucose, avoid NSAIDs and other nephrotoxins where possible, stay hydrated and monitor creatinine and urine protein.",
            },
            {
              t: "q",
              q: {
                id: "s6-c8",
                type: "ms",
                stem: "Which factors in Brad's history raise his risk of kidney cancer? <strong>Choose 2 answers.</strong>",
                options: [
                  { t: "Smoking", ok: true, why: "Smoking raises the risk of both kidney and bladder cancer." },
                  { t: "Obesity", ok: true, why: "Obesity is a well-established risk factor for renal cell carcinoma." },
                  {
                    t: "A previous kidney stone",
                    ok: false,
                    why: "Stones are not an established cause of renal cell carcinoma.",
                  },
                  { t: "Working outdoors", ok: false, why: "Outdoor work is not a risk factor for kidney cancer." },
                ],
                rationale: "Smoking, obesity and hypertension are the modifiable risks.",
                level: "application",
              },
            },
            // REVIEW: new
            {
              t: "open",
              id: "s6-open6",
              stem: "Why is painless hematuria more worrying than painful hematuria?",
              expert: "Painful hematuria usually has an obvious cause such as a stone or infection. Painless bleeding has no such explanation and is the typical first sign of bladder or kidney cancer.",
            },
            { t: "read", items: [{ ref: "p. 1241: Renal tumors and bladder tumors" }] },
          ],
        },
        {
          id: "s6-l10-quiz",
          topic: "Renal System Pathophysiology",
          title: "Quiz: Lesson 10 topics",
          kind: "quiz",
          blocks: [
            { t: "p", html: "Five questions on stones, infection, kidney failure and urinary tract cancer." },
            {
              t: "quiz",
              mode: "practice",
              qs: [
                {
                  id: "s6-q6",
                  type: "mc",
                  stem: "A 24-year-old woman has a fever of 39 °C, chills, right flank pain and tenderness when the provider taps her right costovertebral angle. Her urine is cloudy. Which disorder is she most likely experiencing?",
                  options: [
                    {
                      t: "Pyelonephritis",
                      ok: true,
                      why: "Fever, flank pain and CVA tenderness point to an upper urinary tract infection.",
                    },
                    { t: "Cystitis", ok: false, why: "Cystitis causes bladder symptoms without fever or flank pain." },
                    { t: "Nephrotic syndrome", ok: false, why: "Nephrotic syndrome causes edema and proteinuria, not fever." },
                    { t: "Renal cell carcinoma", ok: false, why: "Fever and acute infection signs point to infection." },
                  ],
                  rationale: "Fever + flank = kidney involvement.",
                  level: "application",
                },
                {
                  id: "s6-q7",
                  type: "mc",
                  stem: "Two weeks after a sore throat, a 9-year-old has cola-colored urine, puffy eyes and high blood pressure. Which disorder is he most likely experiencing?",
                  options: [
                    {
                      t: "Post-streptococcal glomerulonephritis",
                      ok: true,
                      why: "Immune complexes deposit in the glomeruli 1–3 weeks after a strep infection.",
                    },
                    { t: "Pyelonephritis", ok: false, why: "Pyelonephritis causes fever and flank pain." },
                    { t: "Kidney stone", ok: false, why: "Stones cause colicky pain, not edema and hypertension." },
                    {
                      t: "Nephrotic syndrome",
                      ok: false,
                      why: "Nephrotic syndrome causes heavy proteinuria and edema, without much blood or hypertension.",
                    },
                  ],
                  rationale: "Strep then blood, swelling and high pressure: nephritic.",
                  level: "application",
                },
                {
                  id: "s6-q8",
                  type: "mc",
                  stem: "What is the strongest risk factor for bladder cancer?",
                  options: [
                    {
                      t: "Cigarette smoking",
                      ok: true,
                      why: "Carcinogens from smoke are excreted in urine and sit against the bladder lining.",
                    },
                    { t: "Recurrent kidney stones", ok: false, why: "Stones are not the leading risk factor." },
                    { t: "A high-fiber diet", ok: false, why: "Fiber does not raise bladder cancer risk." },
                    { t: "Female sex", ok: false, why: "Bladder cancer is more common in men." },
                  ],
                  rationale: "Smoking is the biggest preventable cause.",
                  level: "recall",
                },
                {
                  id: "s6-q9",
                  type: "mc",
                  stem: "Which laboratory value is used to determine the stage of chronic kidney disease?",
                  options: [
                    {
                      t: "Glomerular filtration rate (GFR)",
                      ok: true,
                      why: "CKD stages G1–G5 are defined by GFR, with albuminuria as a second axis.",
                    },
                    { t: "Serum sodium", ok: false, why: "Sodium is not used to stage CKD." },
                    { t: "Hemoglobin", ok: false, why: "Anemia is a complication, not the staging measure." },
                    { t: "White blood cell count", ok: false, why: "WBC is not used to stage CKD." },
                  ],
                  rationale: "Stage by GFR.",
                  level: "recall",
                },
                {
                  id: "s6-q10",
                  type: "mc",
                  stem: "At which stage of chronic kidney disease does a client typically need dialysis or a transplant?",
                  options: [
                    {
                      t: "Stage G5, GFR below 15 mL/min/1.73 m²",
                      ok: true,
                      why: "Kidney failure (end-stage kidney disease) usually needs replacement therapy.",
                    },
                    { t: "Stage G2, GFR 60–89", ok: false, why: "Mild loss; managed by treating the cause." },
                    { t: "Stage G3a, GFR 45–59", ok: false, why: "Moderate loss; managed medically." },
                    { t: "Stage G1, GFR 90 or above", ok: false, why: "Filtration is still normal." },
                  ],
                  rationale: "Below 15 = kidney failure.",
                  level: "application",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s6-sum-g",
      title: "Section 6: Summary",
      pages: [
        {
          id: "s6-sum",
          title: "Section 6: Summary and cards",
          kind: "summary",
          blocks: [
            {
              t: "p",
              html: "Joan's ulcer showed what happens when acid overwhelms the stomach's defenses. Larry's ulcerative colitis showed chronic immune-driven inflammation of the colon. Jim's hepatitis C showed how silent liver injury becomes cirrhosis. Brad's stone showed how blocked drainage injures the kidney, and his tumor showed why painless findings still matter. Both systems are about balance: what is absorbed, what is filtered and what is kept.",
            },
            {
              t: "ul",
              items: [
                "GERD: weak or relaxing LES; Barrett esophagus is metaplasia that can lead to cancer. Hiatal hernia risk rises with abdominal pressure.",
                "Peptic ulcer: <em>H. pylori</em> and NSAIDs. Duodenal pain eases with food; gastric pain worsens with it. Report bleeding, perforation and obstruction.",
                "Most gastroenteritis is viral. Celiac disease is an autoimmune reaction to gluten that flattens the villi.",
                "UC: colon only, continuous from the rectum, mucosal, bloody. Crohn: mouth to anus, skip lesions, transmural, fistulas and strictures.",
                "Diverticulitis: left lower quadrant pain and fever. Appendicitis: umbilical pain moving to the right lower quadrant.",
                "Hepatitis A and E are fecal–oral and usually acute; B, C and D are blood-borne and can become chronic. Hepatitis A never becomes chronic.",
                "Cirrhosis = portal hypertension (varices, ascites, splenomegaly) + liver failure (jaundice, low albumin, bleeding, encephalopathy).",
                "Cholecystitis: RUQ pain, fever, Murphy sign. Pancreatitis: epigastric pain to the back, high lipase; gallstones and alcohol are the main causes.",
                "The kidneys filter waste and regulate fluid, blood pressure, electrolytes, acid–base, vitamin D and red cell production (erythropoietin).",
                "Most stones are calcium; dehydration is the main modifiable cause. Renal colic radiates from flank to groin. Obstruction plus infection is an emergency.",
                "Cystitis: bladder symptoms. Pyelonephritis: fever, flank pain, CVA tenderness. Older adults may present with confusion.",
                "Nephritic: blood, hypertension, some protein. Nephrotic: protein over 3.5 g a day, low albumin, edema, high lipids.",
                "AKI: prerenal (perfusion), intrarenal (tissue), postrenal (obstruction). Prerenal is the most common.",
                "CKD stages by GFR; G5 (below 15) is kidney failure, when dialysis or transplant is usually needed. Diabetes and hypertension cause most CKD.",
                "CKD complications: fluid overload, hyperkalemia, acidosis, anemia (low EPO), bone disease, uremia.",
                "CRRT is slow and continuous for unstable ICU patients; hemodialysis is intermittent and faster.",
                "Smoking is the strongest risk factor for bladder cancer. Painless hematuria needs investigation.",
              ],
            },
            // REVIEW: new
            {
              t: "confused",
              rows: [
                [
                  "Crohn disease",
                  "Ulcerative colitis",
                  "Crohn: mouth to anus, skip lesions, transmural. UC: colon only, continuous, mucosal.",
                ],
                [
                  "Diverticulitis",
                  "Appendicitis",
                  "Diverticulitis: left lower quadrant. Appendicitis: umbilical pain moving to the right lower quadrant.",
                ],
                [
                  "Nephritic",
                  "Nephrotic",
                  "Nephritic: blood, hypertension, some protein. Nephrotic: heavy protein, low albumin, edema.",
                ],
                [
                  "Cystitis",
                  "Pyelonephritis",
                  "Cystitis: bladder symptoms. Pyelonephritis: fever, flank pain, CVA tenderness.",
                ],
              ],
            },
            // REVIEW: new
            {
              t: "values",
              rows: [["Nephrotic proteinuria", "over 3.5 g a day"], ["CKD stage G5", "GFR below 15", "kidney failure"]],
            },
            {
              t: "cards",
              id: "fc-l9",
              title: "Flashcards · topics 6.1–6.3",
              cards: [
                // REVIEW: rewritten to course standard (cue, answer, why, topic)
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "Heartburn worse after meals and lying down. What has failed?", a: "The lower esophageal sphincter: weak or relaxing at the wrong time", why: "Acid and pepsin reflux into the esophagus. Complications: esophagitis, stricture, Barrett esophagus." },
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "Barrett esophagus: which cell change, and what can it become?", a: "Metaplasia from chronic reflux; it can progress to adenocarcinoma", why: "The same orderly cell swap you met in 1.4, driven here by acid." },
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "The two main causes of peptic ulcer, and how NSAIDs do it", a: "H. pylori and NSAIDs; NSAIDs block protective prostaglandins", why: "Without prostaglandins, mucus and bicarbonate defenses fall and acid and pepsin win." },
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "Pain 2–3 hours after meals and at night, eased by eating. Duodenal or gastric?", a: "Duodenal", why: "Gastric ulcer pain comes soon after eating." },
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "Most gastroenteritis is caused by what, and what is the main danger?", a: "Viruses (norovirus leads at all ages); dehydration and electrolyte loss", why: "Celiac disease is different: an autoimmune reaction to gluten that flattens the villi." },
                { topic: "6.2 IBD, diverticulitis and appendicitis", q: "Larry: bloody diarrhea, tenesmus, continuous inflammation from the rectum, mucosa only. Which disease?", a: "Ulcerative colitis", why: "Complications: hemorrhage, toxic megacolon, colon cancer." },
                { topic: "6.2 IBD, diverticulitis and appendicitis", q: "Skip lesions, transmural inflammation, fistulas, terminal ileum. Which disease?", a: "Crohn disease", why: "Smoking raises the risk and worsens it. Terminal ileum disease causes B12 and bile salt malabsorption." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "Which hepatitis never becomes chronic, and how does it spread?", a: "Hepatitis A, fecal–oral", why: "B, C and D are blood-borne and can become chronic. Hepatitis C is often silent for decades." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "Cirrhosis: name the signs of portal hypertension.", a: "Varices, ascites, enlarged spleen (low platelets), dilated abdominal veins", why: "Blood cannot flow through the scarred liver, so it backs up." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "Confusion and a flapping tremor in cirrhosis. Why?", a: "Hepatic encephalopathy: the liver cannot clear ammonia", why: "Other liver-failure signs: jaundice, low albumin, bleeding with a raised INR." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "Constant RUQ pain, fever, and pain that stops inspiration on palpation?", a: "Cholecystitis (positive Murphy sign)", why: "Untreated: gangrene, perforation, peritonitis. A common duct stone can cause cholangitis or pancreatitis." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "The two main causes of acute pancreatitis?", a: "Gallstones and alcohol", why: "Enzymes (trypsin first) activate inside the pancreas and digest it. Lipase at least three times normal." },
                { topic: "6.3 Liver, gallbladder and pancreas", q: "Bruising around the umbilicus or flanks in pancreatitis means…", a: "Severe disease: bleeding into the abdominal wall (Cullen, Grey Turner)", why: "Complications: hypovolemic shock, ARDS, low calcium, infected necrosis, pseudocyst." },
                // REVIEW: new
                { topic: "6.1 Reflux, ulcers and the upper GI", q: "Ulcer client vomits coffee-ground material and has black tarry stools. What is it?", a: "Upper GI bleeding: report at once", why: "A sudden rigid, board-like abdomen means perforation; vomiting undigested food means obstruction." },
                { topic: "6.2 IBD, diverticulitis and appendicitis", q: "Left lower quadrant pain, fever and a raised white count in an older adult?", a: "Diverticulitis", why: "Diverticula form in a low-fiber sigmoid colon. Complications: abscess, perforation, fistula." },
                { topic: "6.2 IBD, diverticulitis and appendicitis", q: "Pain that starts around the umbilicus and moves to the right lower quadrant?", a: "Appendicitis", why: "Obstruction lets bacteria multiply and pressure rise. Rupture causes peritonitis." },
              ],
            },
            {
              t: "cards",
              id: "fc-l10",
              title: "Flashcards · topics 6.4–6.6",
              cards: [
                // REVIEW: rewritten to course standard (cue, answer, why, topic)
                { topic: "6.4 Stones, infection and the glomeruli", q: "The most common kidney stone?", a: "Calcium oxalate or phosphate", why: "Uric acid stones go with gout; struvite with urease-producing infection; cystine is inherited." },
                { topic: "6.4 Stones, infection and the glomeruli", q: "Brad works in the heat and drinks little. Why does that matter?", a: "Dehydration is the most common, most modifiable cause of stones", why: "Low urine volume lets urine become supersaturated." },
                { topic: "6.4 Stones, infection and the glomeruli", q: "Fever, chills, flank pain and CVA tenderness point to…", a: "Pyelonephritis (upper UTI)", why: "Cystitis gives burning, frequency and urgency without fever. Pyelonephritis can lead to sepsis." },
                { topic: "6.4 Stones, infection and the glomeruli", q: "Cola-colored urine, puffy eyes and hypertension 2 weeks after strep throat?", a: "Post-streptococcal glomerulonephritis: a nephritic picture", why: "It follows strep throat by 1–3 weeks, or a strep skin infection by 3–6 weeks." },
                { topic: "6.4 Stones, infection and the glomeruli", q: "Nephrotic syndrome: the four features", a: "Protein over 3.5 g a day, low albumin, marked edema, high lipids", why: "Nephritic is blood, hypertension and some protein. Nephrotic also raises clotting risk." },
                { topic: "6.5 AKI, CKD and dialysis", q: "The most common type of AKI, and why it happens", a: "Prerenal: not enough blood reaching the kidneys", why: "Dehydration, hemorrhage, heart failure, shock, sepsis; NSAIDs and ACE inhibitors in a dry patient." },
                { topic: "6.5 AKI, CKD and dialysis", q: "Which lab value is used to stage CKD?", a: "eGFR, calculated from creatinine", why: "Normal is about 90–120 mL/min/1.73 m²." },
                { topic: "6.5 AKI, CKD and dialysis", q: "At what GFR is CKD kidney failure, needing dialysis or transplant?", a: "Below 15 (stage G5)", why: "Diabetes and hypertension cause most CKD." },
                { topic: "6.5 AKI, CKD and dialysis", q: "Why does CKD cause anemia?", a: "The kidneys make less erythropoietin", why: "Other complications: fluid overload, hyperkalemia, acidosis, bone disease, uremia." },
                { topic: "6.5 AKI, CKD and dialysis", q: "Unstable ICU client who cannot tolerate rapid fluid shifts. Which dialysis?", a: "CRRT: slow and continuous", why: "Intermittent hemodialysis is faster and risks hypotension and cramps." },
                { topic: "6.6 Kidney and bladder cancer", q: "The strongest risk factor for bladder cancer?", a: "Smoking", why: "Also occupational chemicals (aromatic amines in dyes, rubber and leather work)." },
                { topic: "6.6 Kidney and bladder cancer", q: "An adult smoker has visible blood in the urine, no pain, no infection. What next?", a: "Investigate for urinary tract cancer; do not assume a UTI", why: "Painless hematuria is the classic sign of bladder cancer." },
                // REVIEW: new
                { topic: "6.5 AKI, CKD and dialysis", q: "AKI types: name the three and the problem in each.", a: "Prerenal (perfusion), intrarenal (tissue), postrenal (obstruction)", why: "Acute tubular necrosis from ischemia or toxins (aminoglycosides, IV contrast) is intrarenal." },
                { topic: "6.5 AKI, CKD and dialysis", q: "Why doesn't one blocked ureter usually raise creatinine?", a: "The other kidney compensates", why: "Postrenal AKI needs both outflows blocked, as with an enlarged prostate." },
                { topic: "6.6 Kidney and bladder cancer", q: "After a nephrectomy, how is the remaining kidney protected?", a: "Control BP and glucose, avoid NSAIDs and nephrotoxins, stay hydrated", why: "It enlarges and filters more, so most people keep near-normal function." },
                { topic: "6.4 Stones, infection and the glomeruli", q: "An older adult with a UTI may have no urinary symptoms. What may you see?", a: "Confusion or a fall", why: "E. coli causes most UTIs; women are at higher risk because of a short urethra." },
              ],
            },
            { t: "h2", text: "Check your readiness" },
            {
              t: "ol",
              items: [
                "Can I tell GERD from peptic ulcer disease, and duodenal from gastric ulcer pain?",
                "Can I tell ulcerative colitis from Crohn disease?",
                "Can I say which hepatitis viruses can become chronic and how each spreads?",
                "Can I sort cirrhosis complications into portal hypertension and liver failure?",
                "Can I classify AKI and stage CKD by GFR?",
                "Can I name the strongest risk factor for bladder cancer and explain why painless hematuria matters?",
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
      id: "s6-test-g",
      title: "Section 6: Test",
      pages: [
        {
          id: "s6-test",
          title: "Section 6: Test",
          kind: "test",
          blocks: [
            {
              t: "p",
              html: "Ten questions covering Section 6, plus two from earlier sections. Answer every question, then submit. Your score and all rationales appear after you submit.",
            },
            {
              t: "quiz",
              mode: "test",
              qs: [
                // REVIEW: stem reworded for lint rule
                {
                  id: "s6-t1",
                  type: "ms",
                  stem: "Which statement about Crohn disease is accurate? <strong>Choose 3 answers.</strong>",
                  options: [
                    {
                      t: "It is a chronic inflammatory disease",
                      ok: true,
                      why: "Crohn disease is a lifelong relapsing condition.",
                    },
                    {
                      t: "It is immune-mediated",
                      ok: true,
                      why: "An abnormal immune response to gut contents drives the inflammation.",
                    },
                    {
                      t: "It can affect any part of the GI tract from mouth to anus",
                      ok: true,
                      why: "It most often involves the terminal ileum but can occur anywhere.",
                    },
                    {
                      t: "It is an infectious disease",
                      ok: false,
                      why: "It is not caused by a single infection and is not contagious.",
                    },
                    { t: "It affects the large intestine only", ok: false, why: "That describes ulcerative colitis." },
                  ],
                  rationale: "Crohn: chronic, immune-mediated, anywhere, transmural.",
                  level: "application",
                },
                {
                  id: "s6-t2",
                  type: "mc",
                  stem: "Which viral pathogen does not have the potential to cause chronic hepatitis?",
                  options: [
                    { t: "Hepatitis A", ok: true, why: "Hepatitis A causes only acute infection." },
                    { t: "Hepatitis B", ok: false, why: "Hepatitis B can become chronic, especially after infection at birth." },
                    { t: "Hepatitis C", ok: false, why: "Most hepatitis C infections become chronic." },
                    { t: "Hepatitis D", ok: false, why: "Hepatitis D can be chronic alongside hepatitis B." },
                  ],
                  rationale: "A (and usually E) are acute only.",
                  level: "recall",
                },
                {
                  id: "s6-t3",
                  type: "mc",
                  stem: "After several days of heavy drinking, a client has severe epigastric pain radiating to his back, nausea and vomiting, and bluish bruising around the umbilicus. His lipase is ten times normal. What is he most likely experiencing?",
                  options: [
                    {
                      t: "Acute pancreatitis",
                      ok: true,
                      why: "Alcohol, epigastric pain to the back, high lipase and Cullen sign point to severe pancreatitis.",
                    },
                    {
                      t: "Acute cholecystitis",
                      ok: false,
                      why: "Cholecystitis causes RUQ pain and a Murphy sign; lipase is usually not this high.",
                    },
                    { t: "Acute gastritis", ok: false, why: "Gastritis does not raise lipase or cause periumbilical bruising." },
                    { t: "Acute appendicitis", ok: false, why: "Appendicitis pain moves to the RLQ." },
                  ],
                  rationale: "Pain to the back + lipase = pancreas. Cullen sign = severe.",
                  level: "application",
                },
                {
                  id: "s6-t4",
                  type: "mc",
                  stem: "A 23-year-old has crampy right lower quadrant pain, non-bloody diarrhea, weight loss and a fistula near the anus. Colonoscopy shows patchy, deep inflammation of the terminal ileum with normal areas in between. What is the client most likely experiencing?",
                  options: [
                    {
                      t: "Crohn disease",
                      ok: true,
                      why: "Skip lesions, terminal ileum involvement, transmural inflammation and fistula are typical.",
                    },
                    { t: "Ulcerative colitis", ok: false, why: "UC is continuous, mucosal and limited to the colon." },
                    { t: "Diverticulitis", ok: false, why: "Diverticulitis is usually left-sided in older adults." },
                    {
                      t: "Celiac disease of the small intestine",
                      ok: false,
                      why: "Celiac disease flattens villi; it does not cause fistulas.",
                    },
                  ],
                  rationale: "Fistula and skip lesions say Crohn.",
                  level: "application",
                },
                {
                  id: "s6-t5",
                  type: "mc",
                  stem: "A client with cirrhosis asks why his abdomen is swollen with fluid. What is the best response by the provider?",
                  options: [
                    {
                      t: "\"Scarring raises pressure in your liver's veins, and low albumin lets fluid leak out.\"",
                      ok: true,
                      why: "Portal hypertension and low albumin together cause ascites.",
                    },
                    {
                      t: "\"Your kidneys have stopped making enough urine to clear fluid.\"",
                      ok: false,
                      why: "Kidney failure is not the main mechanism of ascites.",
                    },
                    {
                      t: "\"A bacterial infection in your abdomen is producing fluid.\"",
                      ok: false,
                      why: "Infection of ascites can happen, but it is not why ascites forms.",
                    },
                    {
                      t: "\"Your gallbladder has burst and is leaking bile.\"",
                      ok: false,
                      why: "That would cause acute peritonitis, not chronic ascites.",
                    },
                  ],
                  rationale: "Ascites = portal pressure + low albumin.",
                  level: "application",
                },
                {
                  id: "s6-t6",
                  type: "mc",
                  stem: "A client has been diagnosed with renal cell carcinoma. Which manifestation would the provider expect to see?",
                  options: [
                    {
                      t: "Hematuria",
                      ok: true,
                      why: "Blood in the urine is the most common presenting sign when symptoms occur.",
                    },
                    { t: "Decreased creatinine", ok: false, why: "Creatinine does not fall in kidney cancer." },
                    { t: "Weight gain", ok: false, why: "Cancer more often causes weight loss." },
                    {
                      t: "Low red cell count from high erythropoietin",
                      ok: false,
                      why: "Excess erythropoietin raises the red cell count.",
                    },
                  ],
                  rationale: "Kidney tumors bleed into the urine.",
                  level: "application",
                },
                {
                  id: "s6-t7",
                  type: "mc",
                  stem: "A provider reviews the GFR of a client with chronic kidney disease. Which GFR value indicates kidney failure (end-stage kidney disease)?",
                  fixed: true,
                  options: [
                    { t: "12 mL/min/1.73 m²", ok: true, why: "A GFR below 15 is stage G5, kidney failure." },
                    { t: "35 mL/min/1.73 m²", ok: false, why: "That is stage G3b." },
                    { t: "55 mL/min/1.73 m²", ok: false, why: "That is stage G3a." },
                    { t: "75 mL/min/1.73 m²", ok: false, why: "That is stage G2." },
                  ],
                  rationale: "Below 15 = G5.",
                  level: "application",
                },
                {
                  id: "s6-t8",
                  type: "mc",
                  stem: "A client with end-stage kidney disease will begin hemodialysis. What is true about hemodialysis?",
                  options: [
                    {
                      t: "It can cause significant fluid shifts and put the client at risk of hypotension",
                      ok: true,
                      why: "Fluid is removed quickly over a few hours.",
                    },
                    { t: "It slowly filters the blood over a 24-hour cycle", ok: false, why: "That describes CRRT." },
                    {
                      t: "It involves infusing dialysate into the abdominal cavity",
                      ok: false,
                      why: "That is peritoneal dialysis.",
                    },
                    {
                      t: "It can be given through a standard peripheral IV",
                      ok: false,
                      why: "It needs a fistula, graft or dialysis catheter for high flow.",
                    },
                  ],
                  rationale: "Intermittent hemodialysis = fast shifts = hypotension risk.",
                  level: "application",
                },
                {
                  id: "s6-t9",
                  type: "mc",
                  stem: "A client is admitted with vomiting and diarrhea for four days. Her creatinine has doubled and her urine output is low, but the urinalysis is normal. Which type of acute kidney injury is most likely?",
                  options: [
                    {
                      t: "Prerenal, from reduced blood flow to the kidneys",
                      ok: true,
                      why: "Volume loss reduces renal perfusion; the kidney tissue is initially intact.",
                    },
                    {
                      t: "Intrarenal, from glomerulonephritis",
                      ok: false,
                      why: "Glomerulonephritis causes blood and protein in the urine.",
                    },
                    { t: "Postrenal, from a kidney stone", ok: false, why: "Nothing suggests an obstruction." },
                    {
                      t: "Chronic kidney disease stage G5",
                      ok: false,
                      why: "The change is sudden and has a clear reversible cause.",
                    },
                  ],
                  rationale: "Fluid lost → kidneys underperfused → prerenal AKI. Restore volume.",
                  level: "application",
                },
                {
                  id: "s6-t10",
                  type: "mc",
                  stem: "A 64-year-old who smoked for 40 years noticed bright red urine twice this week. He has no pain, fever or urinary symptoms. What would be the main concern?",
                  options: [
                    {
                      t: "Bladder or other urinary tract cancer",
                      ok: true,
                      why: "Painless visible hematuria in an older smoker must be investigated for cancer.",
                    },
                    {
                      t: "A simple urinary tract infection",
                      ok: false,
                      why: "He has no symptoms of infection; assuming UTI risks missing cancer.",
                    },
                    { t: "Dehydration", ok: false, why: "Dehydration darkens urine but does not cause red blood in it." },
                    { t: "A normal finding after exercise", ok: false, why: "Repeated visible blood is not normal." },
                  ],
                  rationale: "Painless hematuria + smoking = look for cancer.",
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

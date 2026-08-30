export interface SupplementFaqItem {
  question: string;
  answer: string;
}

export interface SupplementContent {
  /** Plain-language mechanism — what the supplement actually does in the body. */
  howItWorks: string;
  /** Who this is a sensible fit for, and who it probably isn't. */
  whoMightBenefit: string;
  /** General tolerability and interaction categories. Supplements to the
   * admin-managed `warnings` field shown in the amber callout — this is
   * broader context, not a replacement for it. */
  safetyNotes: string;
  faq: SupplementFaqItem[];
  /** Keys of 2-3 supplements commonly stacked with this one. */
  relatedSupplements: string[];
}

// Hand-authored SEO/content depth for each supplement, keyed by the same
// `key` used in the Supabase `supplements` table. Lives here rather than in
// the database (like OPTIMIZE_TOPICS in optimizeContent.ts) so a batch of
// drafted copy can be reviewed as a single diff before anything goes live.
// A supplement without an entry here just skips these page sections — see
// getSupplementContent.
export const SUPPLEMENT_CONTENT: Record<string, SupplementContent> = {
  caffeine_ltheanine: {
    howItWorks:
      "Caffeine blocks adenosine receptors in the brain, which is what makes you feel more alert and less drowsy. L-theanine, an amino acid found in tea, increases alpha brain wave activity, which offsets caffeine's jitteriness without blunting its stimulant effect.",
    whoMightBenefit:
      "People who rely on coffee for focus but get jittery, anxious, or crash a few hours later — the combination smooths out caffeine's rough edges rather than removing them.",
    safetyNotes:
      "Stacks with any other caffeine you're already having (coffee, tea, pre-workout), so track your total intake. Avoid within 8 hours of bedtime, and be cautious with anxiety, high blood pressure, or heart or antidepressant medication.",
    faq: [
      {
        question: "Can I just take caffeine without the L-theanine?",
        answer:
          "You can, but most people notice more jitteriness and a harder crash. L-theanine is what makes the combination smoother than coffee alone.",
      },
      {
        question: "Does the ratio of caffeine to L-theanine matter?",
        answer:
          "Most research uses roughly a 1:2 ratio (for example 100mg caffeine to 200mg L-theanine) — going heavier on L-theanine tends to feel calmer.",
      },
    ],
    relatedSupplements: ["l_tyrosine", "lions_mane", "b12"],
  },

  l_tyrosine: {
    howItWorks:
      "Tyrosine is a building block your brain uses to make dopamine and norepinephrine. Under acute stress, cold, or sleep loss, these neurotransmitters get depleted faster than normal, and supplementing gives your brain more raw material to keep producing them.",
    whoMightBenefit:
      "People facing a specific demanding stretch — an exam, a big presentation, a poor night's sleep — rather than an everyday supplement for normal, well-rested days.",
    safetyNotes:
      "Generally well tolerated at typical doses. Avoid combining with MAOI antidepressants, and check with a doctor first if you have a thyroid condition, since tyrosine is a thyroid hormone precursor.",
    faq: [
      {
        question: "Should I take L-tyrosine every day?",
        answer:
          "It's designed for occasional, situational use under acute stress or sleep loss, rather than daily supplementation — it does little when you're already well rested.",
      },
      {
        question: "How fast does it work?",
        answer:
          "Effects are usually felt within 30–60 minutes, since it acts on neurotransmitter availability rather than building up over weeks.",
      },
    ],
    relatedSupplements: ["caffeine_ltheanine", "rhodiola", "lions_mane"],
  },

  lions_mane: {
    howItWorks:
      "Lion's mane contains compounds (hericenones and erinacines) that stimulate nerve growth factor (NGF) production in animal and cell studies — NGF supports the growth and maintenance of neurons.",
    whoMightBenefit:
      "People curious about long-term cognitive support who are comfortable with early-stage evidence — this is more of a slow-building addition than a same-day focus aid.",
    safetyNotes:
      "Well tolerated in available studies, with no major interactions reported. As with any mushroom extract, avoid it if you have a known mushroom allergy.",
    faq: [
      {
        question: "Will Lion's Mane give me an immediate focus boost?",
        answer:
          "No — unlike caffeine, its proposed benefits are about long-term nerve support, so any effect builds gradually over weeks.",
      },
      {
        question: "How is it different from caffeine or L-tyrosine for focus?",
        answer:
          "It works through a slower, different mechanism (nerve growth) rather than an acute stimulant or neurotransmitter-precursor effect.",
      },
    ],
    relatedSupplements: ["caffeine_ltheanine", "l_tyrosine", "rhodiola"],
  },

  vitd3: {
    howItWorks:
      "Vitamin D3 is converted by your liver and kidneys into a hormone that regulates calcium absorption, immune signaling, and hundreds of genes. K2 activates proteins that direct that calcium into bone rather than soft tissue and artery walls.",
    whoMightBenefit:
      "Almost everyone, especially people with limited sun exposure, northern latitudes, darker skin, or winter months — deficiency is genuinely common rather than a marketing claim.",
    safetyNotes:
      "The K2 here interacts with warfarin and other vitamin-K-dependent blood thinners — talk to whoever manages that prescription before starting. Very high, sustained D3 doses can raise blood calcium, so stick to label guidance unless a doctor has tested your levels.",
    faq: [
      {
        question: "Do I need K2 if I'm already taking D3?",
        answer:
          "It's not mandatory, but many people pair them since K2 helps direct the calcium D3 helps you absorb to where it's actually useful.",
      },
      {
        question: "How do I know if I'm deficient?",
        answer:
          "A blood test (25-hydroxyvitamin D) is the only reliable way to know. Supplementing without testing is reasonable given how common deficiency is, but testing removes the guesswork.",
      },
    ],
    relatedSupplements: ["omega3", "multivitamin", "b12"],
  },

  omega3: {
    howItWorks:
      "EPA and DHA are incorporated into cell membranes throughout the body, where they reduce inflammatory signaling and support heart, brain, and joint tissue.",
    whoMightBenefit:
      "Most people, especially those who eat fatty fish less than twice a week — it has one of the largest bodies of human trial evidence of any supplement on this list.",
    safetyNotes:
      "Doses above roughly 3g a day may increase bleeding risk, particularly alongside anticoagulants or regular NSAID use. Stop about two weeks before any planned surgery.",
    faq: [
      {
        question: "Is fish oil the same as flaxseed oil?",
        answer:
          "No — flaxseed provides ALA, a plant omega-3 that your body converts to EPA/DHA very inefficiently. Fish oil supplies EPA and DHA directly.",
      },
      {
        question: "Why does fish oil sometimes cause fishy burps?",
        answer:
          "It's usually from oxidized oil or lower-quality capsules — taking it with meals and choosing a reputable, enteric-coated product usually solves it.",
      },
    ],
    relatedSupplements: ["vitd3", "collagen", "curcumin"],
  },

  b12: {
    howItWorks:
      "B12 is a cofactor your body needs to make red blood cells and maintain the protective sheath around nerves. It's found almost exclusively in animal products, so it has to come from diet, fortified food, or a supplement.",
    whoMightBenefit:
      "Vegans and vegetarians most directly, but also older adults, since absorption from food naturally declines with age.",
    safetyNotes: "No known toxicity even at high doses, since excess is simply excreted. No major interactions.",
    faq: [
      {
        question: "Can I get enough B12 from a vegetarian diet?",
        answer:
          "Eggs and dairy provide some, but many vegetarians still fall short — a blood test can confirm whether you need to supplement.",
      },
      {
        question: "What form of B12 should I look for?",
        answer:
          "Methylcobalamin is the active, ready-to-use form and is generally preferred over cyanocobalamin, though both work for most people.",
      },
    ],
    relatedSupplements: ["iron", "multivitamin", "vitd3"],
  },

  iron: {
    howItWorks:
      "Iron is a core component of hemoglobin, the protein that carries oxygen in your blood. Without enough of it, your body can't transport oxygen efficiently, which shows up as fatigue.",
    whoMightBenefit:
      "People with a confirmed low ferritin or iron level from a blood test — this is the one supplement here that should be need-driven rather than precautionary.",
    safetyNotes:
      "Only supplement iron if testing has shown you're low — excess iron builds up in the body and is genuinely harmful over time. Keep it well out of reach of children, since iron overdose is a leading cause of accidental poisoning in kids. Separate it by at least two hours from thyroid medication, antibiotics, and calcium.",
    faq: [
      {
        question: "Should I take iron just because I feel tired?",
        answer:
          "Get a blood test first. Fatigue has many causes, and supplementing iron without confirmed deficiency risks overload rather than fixing the actual problem.",
      },
      {
        question: "Why bisglycinate instead of ferrous sulfate?",
        answer:
          "Bisglycinate is gentler on the stomach and causes less constipation for most people, though it's typically a bit more expensive.",
      },
    ],
    relatedSupplements: ["b12", "vitamin_c", "multivitamin"],
  },

  multivitamin: {
    howItWorks:
      "It supplies small amounts of a broad range of vitamins and minerals in one dose, covering the gaps a varied diet would otherwise fill.",
    whoMightBenefit:
      "People with a restricted, monotonous, or calorie-deficit diet — it's insurance against small shortfalls, not a performance enhancer on its own.",
    safetyNotes:
      "Stick to one serving as labeled — stacking a multivitamin with individual high-dose supplements (like separate vitamin D or iron) can push some nutrients above safe upper limits.",
    faq: [
      {
        question: "Do I still need a multivitamin if I eat well?",
        answer:
          "Probably less benefit if your diet is already varied and sufficient — it's most useful as a backstop, not a replacement for food.",
      },
      {
        question: "Can it replace targeted supplements like vitamin D or B12?",
        answer:
          "Usually not at a meaningful dose — multivitamins provide a little of everything, while real deficiencies often need a dedicated, higher-dose supplement.",
      },
    ],
    relatedSupplements: ["vitd3", "b12", "vitamin_c"],
  },

  vitamin_c: {
    howItWorks:
      "Vitamin C supports immune cell function and collagen production, and it converts non-heme iron (the type in plant foods) into a form your body absorbs far more easily.",
    whoMightBenefit:
      "People eating mostly plant-based iron sources, or anyone under heavy physical stress — illness or intense training — where needs rise.",
    safetyNotes:
      "Very high single doses (over roughly 1g) can cause digestive upset — splitting the dose across the day avoids this. Generally very safe otherwise.",
    faq: [
      {
        question: "Does vitamin C prevent colds?",
        answer:
          "Not in the general population, though it modestly shortens colds and helps people under heavy physical stress specifically.",
      },
      {
        question: "What's the best time to take it with iron?",
        answer:
          "Take them together — vitamin C meaningfully boosts absorption of the non-heme iron found in plant foods and supplements.",
      },
    ],
    relatedSupplements: ["iron", "multivitamin", "vitd3"],
  },

  coq10: {
    howItWorks:
      "CoQ10 is a molecule your cells use in the mitochondria to produce ATP, your body's basic energy currency. Levels naturally decline with age and are further depleted by statin medications.",
    whoMightBenefit:
      "Adults over 40, and especially anyone taking a statin, since statins specifically block the pathway that produces CoQ10 in the body.",
    safetyNotes:
      "Well tolerated. May mildly reduce the effectiveness of blood thinners like warfarin, so mention it to your doctor if you're on one.",
    faq: [
      {
        question: "Do I need CoQ10 if I'm not on a statin?",
        answer:
          "It's more optional — the clearest, most consistent benefit is specifically for people whose statin has depleted their natural levels.",
      },
      {
        question: "Ubiquinol vs. ubiquinone — does it matter?",
        answer:
          "Ubiquinol is the more bioavailable, active form and is generally preferred, especially for older adults whose conversion from ubiquinone declines.",
      },
    ],
    relatedSupplements: ["omega3", "creatine", "vitd3"],
  },

  nac: {
    howItWorks:
      "NAC is a precursor your body converts into glutathione, its main internal antioxidant, which supports liver detoxification and helps break down mucus.",
    whoMightBenefit:
      "People looking for antioxidant, respiratory, or general liver support — the mood and compulsive-behavior use cases are more experimental.",
    safetyNotes:
      "May trigger bronchospasm in some people with asthma — introduce cautiously if you have a history of it. Can extend bleeding time, so take care alongside anticoagulants or before surgery.",
    faq: [
      {
        question: "Is NAC good for a hangover?",
        answer:
          "It's a popular use, and there's a plausible mechanism via glutathione and liver support, but the direct evidence for hangover prevention specifically is thin.",
      },
      {
        question: "Why take it on an empty stomach?",
        answer: "Food, especially protein, can reduce its absorption, so taking it away from meals is more reliable.",
      },
    ],
    relatedSupplements: ["omega3", "vitamin_c", "coq10"],
  },

  probiotic: {
    howItWorks:
      "Probiotics introduce live bacterial strains that can temporarily colonize your gut, competing with less helpful bacteria and supporting the gut lining and immune signaling.",
    whoMightBenefit:
      "People recovering from a course of antibiotics, dealing with IBS-type symptoms, or generally looking to support digestion — effects are strain-specific, so look for a product that names its strains.",
    safetyNotes:
      "Generally very safe for healthy adults. People who are severely immunocompromised or critically ill should check with a doctor before starting, given rare reports of infection risk in that specific population.",
    faq: [
      {
        question: "Do probiotics need to be refrigerated?",
        answer: "It depends on the strain and formulation — check the label, since many modern products are shelf-stable.",
      },
      {
        question: "How long before I notice a difference?",
        answer: "Give it three to four weeks of consistent use — gut flora shifts gradually, not overnight.",
      },
    ],
    relatedSupplements: ["fibre", "collagen", "berberine"],
  },

  fibre: {
    howItWorks:
      "Psyllium forms a gel in the digestive tract that adds bulk and moisture to stool, slows glucose absorption, and binds cholesterol-containing bile acids for excretion.",
    whoMightBenefit:
      "Almost anyone whose diet is light on fiber — it's one of the most consistently evidence-backed supplements for both regularity and cholesterol.",
    safetyNotes:
      "Increase the dose gradually and drink plenty of water — taking it without enough fluid can cause choking or worsen constipation. Take it away from other medications, since it can slow their absorption.",
    faq: [
      {
        question: "Can psyllium help with both constipation and diarrhea?",
        answer:
          "Yes — it's a bulking fiber that normalizes stool consistency in both directions, which is somewhat unique among fiber types.",
      },
      {
        question: "Will it interfere with my medications?",
        answer:
          "It can slow absorption of some drugs if taken at the same time, so space it at least a couple of hours from other medications.",
      },
    ],
    relatedSupplements: ["probiotic", "berberine", "omega3"],
  },

  berberine: {
    howItWorks:
      "Berberine activates an enzyme (AMPK) involved in cellular energy regulation, which is thought to underlie its effects on blood glucose and lipid metabolism — often compared informally to metformin's mechanism.",
    whoMightBenefit:
      "People focused on blood sugar or lipid management, ideally alongside — not instead of — dietary changes, and always with medical input given its interaction profile.",
    safetyNotes:
      "Interacts with a long list of prescription medicines, including metformin, statins, ciclosporin, and blood thinners. Not for use in pregnancy or breastfeeding. Check with a pharmacist or doctor before starting, especially if you take any regular medication.",
    faq: [
      {
        question: "Is berberine a substitute for metformin?",
        answer: "No — it shouldn't replace a prescribed medication. Discuss any combination with your doctor first.",
      },
      {
        question: "How long until I'd see a change in blood markers?",
        answer: "Trials typically measure effects after 8–12 weeks of consistent use, alongside dietary changes.",
      },
    ],
    relatedSupplements: ["fibre", "probiotic", "vitamin_c"],
  },

  collagen: {
    howItWorks:
      "Collagen peptides supply the amino acids (particularly glycine and proline) used to build connective tissue, and may stimulate your body's own collagen production in skin and joints.",
    whoMightBenefit:
      "People focused on skin elasticity or activity-related joint discomfort — the gut-lining benefit often marketed alongside it isn't well supported by evidence.",
    safetyNotes:
      "Very well tolerated. No significant known interactions. Check the source (bovine, marine, and so on) if you have specific dietary restrictions or allergies.",
    faq: [
      {
        question: "Does collagen actually get absorbed as collagen?",
        answer:
          "No — it's broken down into amino acids and peptides during digestion, some of which act as signals for your body to produce its own collagen.",
      },
      {
        question: "How long before I notice skin or joint changes?",
        answer: "Most studies show effects after 8–12 weeks of daily use, not immediately.",
      },
    ],
    relatedSupplements: ["curcumin", "omega3", "vitamin_c"],
  },

  curcumin: {
    howItWorks:
      "Curcumin, the active compound in turmeric, blocks several inflammatory signaling pathways (like NF-κB), which is the proposed mechanism behind its effect on joint pain.",
    whoMightBenefit:
      "People with activity-related or osteoarthritis-type knee discomfort — plain turmeric powder from the spice aisle is a poor substitute, since curcumin alone is absorbed very poorly.",
    safetyNotes:
      "Generally well tolerated. High doses can cause mild digestive upset. May mildly increase bleeding risk in combination with blood thinners — mention it to your doctor if you're on one.",
    faq: [
      {
        question: "Why does curcumin need piperine (black pepper extract)?",
        answer:
          "Curcumin on its own is very poorly absorbed — piperine (or another bioavailability-enhancing form) increases how much actually reaches your bloodstream.",
      },
      {
        question: "Is turmeric powder in food enough?",
        answer:
          "Not for a therapeutic effect — culinary amounts of turmeric provide a fraction of the curcuminoid dose used in the studies showing benefit.",
      },
    ],
    relatedSupplements: ["omega3", "collagen", "magnesium"],
  },

  creatine: {
    howItWorks:
      "Creatine increases the phosphocreatine stores in your muscles, which your body uses to rapidly regenerate ATP during short, powerful efforts — more available energy means more reps or higher output before fatigue.",
    whoMightBenefit:
      "Anyone strength training regularly, especially vegetarians and vegans, whose diets naturally contain less creatine since it's mainly found in meat and fish.",
    safetyNotes:
      "Extremely well studied and safe for healthy adults at recommended doses, including long-term use. The initial water retention in muscle is expected and not a health concern.",
    faq: [
      {
        question: "Do I need to do a loading phase?",
        answer:
          "No — loading (a higher dose for the first week) saturates your muscles faster, but a steady 3–5g daily reaches the same saturation point within about a month.",
      },
      {
        question: "Does creatine cause hair loss or kidney damage?",
        answer:
          "There's no solid evidence for either in healthy people at recommended doses — these are persistent myths not backed by the research.",
      },
    ],
    relatedSupplements: ["protein", "beta_alanine", "citrulline"],
  },

  protein: {
    howItWorks:
      "Whey supplies a fast-digesting, complete source of essential amino acids, including leucine, a key trigger for muscle protein synthesis after training.",
    whoMightBenefit:
      "Anyone who struggles to hit their daily protein target from food alone, especially around training — it's a convenience tool, not a requirement.",
    safetyNotes:
      "Safe for most people at typical serving sizes. Contains milk-derived lactose and dairy proteins, so those with lactose intolerance or a dairy allergy should choose an isolate or a plant-based alternative.",
    faq: [
      {
        question: "Is whey protein necessary if my diet already covers my protein target?",
        answer: "No — it's a convenient way to hit a number you're already falling short of. If food already covers it, the supplement adds little.",
      },
      {
        question: "When's the best time to take it?",
        answer: "Total daily protein matters far more than timing — post-workout or between meals both work fine.",
      },
    ],
    relatedSupplements: ["creatine", "electrolytes", "beta_alanine"],
  },

  beta_alanine: {
    howItWorks:
      "Beta-alanine raises muscle carnosine levels, which buffers the acid (hydrogen ions) that builds up during high-intensity efforts, delaying the burning fatigue that shuts down a hard set.",
    whoMightBenefit:
      "People doing high-rep training, rowing, or sprint intervals lasting roughly one to four minutes — it does little for very short, max-effort lifts or long, steady endurance work.",
    safetyNotes:
      "Very safe. The tingling sensation (paresthesia) some people feel is harmless and fades with continued use or by splitting the dose.",
    faq: [
      {
        question: "Is the tingling feeling dangerous?",
        answer:
          "No — it's a well-documented, harmless side effect called paresthesia. Splitting your dose into smaller amounts reduces it if it bothers you.",
      },
      {
        question: "Do I need to take it right before training?",
        answer:
          "No — like creatine, it works by saturating your muscles over time, so daily total intake matters more than timing.",
      },
    ],
    relatedSupplements: ["creatine", "citrulline", "electrolytes"],
  },

  citrulline: {
    howItWorks:
      "L-citrulline is converted in the body to arginine and then nitric oxide, which widens blood vessels and increases blood flow to working muscles during exercise.",
    whoMightBenefit:
      "People looking to push a few extra reps per set or reduce next-day soreness — the effect is real but more modest than typical pre-workout marketing suggests.",
    safetyNotes: "Very well tolerated, with mild digestive upset possible at higher doses. No major known interactions.",
    faq: [
      {
        question: "Is citrulline better than arginine directly?",
        answer:
          "Yes, generally — citrulline is absorbed better and raises blood arginine levels more effectively than taking arginine itself.",
      },
      {
        question: "Should I take citrulline and beta-alanine together?",
        answer:
          "Yes, they're commonly stacked since they work through different mechanisms — blood flow versus acid buffering.",
      },
    ],
    relatedSupplements: ["beta_alanine", "beetroot", "creatine"],
  },

  beetroot: {
    howItWorks:
      "Dietary nitrate is converted by bacteria in your mouth and body into nitric oxide, which improves the efficiency of oxygen use in working muscles during endurance exercise.",
    whoMightBenefit:
      "Recreational endurance athletes see the clearest benefit — highly trained elite athletes tend to respond less, likely because their oxygen efficiency is already near its ceiling.",
    safetyNotes:
      "Lowers blood pressure, which can add to the effect of blood pressure medication — check with a doctor if you're on one. Harmless red-tinted urine and stools are common and not a cause for concern.",
    faq: [
      {
        question: "Why should I skip mouthwash before taking it?",
        answer:
          "Antibacterial mouthwash kills the oral bacteria that convert dietary nitrate into nitric oxide, blocking the effect.",
      },
      {
        question: "How long before a workout should I take it?",
        answer: "About two to three hours — the conversion to nitric oxide takes time to peak in the bloodstream.",
      },
    ],
    relatedSupplements: ["citrulline", "electrolytes", "taurine"],
  },

  electrolytes: {
    howItWorks:
      "Sweat carries sodium, potassium, and magnesium out of your body along with water — replacing electrolytes, not just water, maintains the fluid balance your muscles and nerves need to function properly.",
    whoMightBenefit:
      "Anyone sweating heavily — intense training, hot climates, or long sessions — where water alone can actually dilute your remaining sodium and worsen cramping.",
    safetyNotes:
      "Safe for most people at typical serving sizes. Those managing high blood pressure or kidney conditions should check the sodium content and talk to a doctor before regular use.",
    faq: [
      {
        question: "Is water enough if I'm just training for an hour?",
        answer:
          "Usually, yes — electrolytes matter most for longer or heavier-sweating sessions, hot conditions, or if you're prone to cramping.",
      },
      {
        question: "Are electrolytes only useful during exercise?",
        answer:
          "No — they're also useful afterward, especially following heavy sweating, to fully restore what was lost rather than just rehydrating with plain water.",
      },
    ],
    relatedSupplements: ["taurine", "beetroot", "protein"],
  },

  taurine: {
    howItWorks:
      "Taurine is involved in regulating muscle contraction, cell hydration, and calcium handling, which may explain its modest effects on endurance and exercise-induced muscle damage.",
    whoMightBenefit:
      "People training regularly who want a low-risk addition to an energy or recovery stack — effects are real but smaller than the headline claims on energy-drink labels.",
    safetyNotes: "Very well tolerated with no significant known interactions at typical doses.",
    faq: [
      {
        question: "Is the taurine in energy drinks the same as the supplement?",
        answer:
          "Chemically yes, though energy drinks combine it with caffeine and sugar, which is really what most people are responding to.",
      },
      {
        question: "Can I take taurine with caffeine?",
        answer: "Yes — it's commonly paired with caffeine and is thought to smooth out some of caffeine's harsher effects.",
      },
    ],
    relatedSupplements: ["caffeine_ltheanine", "electrolytes", "creatine"],
  },

  magnesium: {
    howItWorks:
      "Magnesium supports the nervous system's ability to switch from an alert to a relaxed state and is a cofactor in muscle relaxation, which is why deficiency often shows up as cramping or restless sleep.",
    whoMightBenefit:
      "The roughly half of adults who don't meet the RDA from diet alone, and especially anyone whose sleep or stress is affected — glycinate is the gentlest form on the gut.",
    safetyNotes:
      "Very safe for most people. Can cause loose stools at high doses (more common with oxide or citrate forms than glycinate). May enhance the effect of muscle relaxants or blood pressure medication — mention it to your doctor if you take either.",
    faq: [
      {
        question: "Why glycinate instead of a cheaper form like oxide?",
        answer:
          "Oxide is poorly absorbed and more likely to cause digestive upset — glycinate is gentler and better absorbed, especially for a nightly dose.",
      },
      {
        question: "Can I take magnesium every night long-term?",
        answer: "Yes, for most people — it's one of the better-tolerated supplements for ongoing use.",
      },
    ],
    relatedSupplements: ["glycine", "ashwagandha", "zinc_mag"],
  },

  glycine: {
    howItWorks:
      "Glycine slightly lowers core body temperature, which is one of the body's natural cues for sleep onset, and it also acts as a calming neurotransmitter in the central nervous system.",
    whoMightBenefit:
      "People who take a while to fall asleep or wake up still feeling groggy — it's a gentle, low-risk addition to a wind-down routine.",
    safetyNotes: "Very well tolerated, with no significant known interactions. Mildly sweet tasting, which some people find pleasant before bed.",
    faq: [
      {
        question: "Can I take glycine with magnesium?",
        answer:
          "Yes — they're often combined and work through different mechanisms (body temperature and neurotransmitter calming versus nervous-system relaxation).",
      },
      {
        question: "Will glycine make me groggy the next morning?",
        answer:
          "Most people report the opposite — less next-day fatigue — since it's associated with better sleep quality rather than sedation.",
      },
    ],
    relatedSupplements: ["magnesium", "ashwagandha", "inositol"],
  },

  ashwagandha: {
    howItWorks:
      "As an adaptogen, ashwagandha is thought to help regulate the HPA axis — the system that controls your cortisol (stress hormone) response — lowering perceived stress and cortisol over consistent use.",
    whoMightBenefit:
      "People dealing with ongoing, low-grade stress that affects sleep or mood — it works gradually and isn't a fast-acting calming agent for acute panic or anxiety.",
    safetyNotes:
      "Can affect thyroid hormone levels and interacts with sedatives, thyroid medication, and immunosuppressants. There are rare reports of liver injury. Avoid in pregnancy, and stop before surgery.",
    faq: [
      {
        question: "How long does ashwagandha take to work?",
        answer: "Most studies show measurable effects on stress markers after four to eight weeks of consistent use, not immediately.",
      },
      {
        question: "Will it help me lose fat or build muscle?",
        answer:
          "The testosterone and body-composition effects reported in some studies are small and inconsistent — treat it primarily as stress and sleep support, not a performance enhancer.",
      },
    ],
    relatedSupplements: ["magnesium", "rhodiola", "glycine"],
  },

  rhodiola: {
    howItWorks:
      "Rhodiola is thought to influence stress-response pathways and neurotransmitter activity (including serotonin and dopamine), which is the proposed basis for its effect on fatigue and burnout.",
    whoMightBenefit:
      "People experiencing burnout-type fatigue or stress-related tiredness — best treated as promising rather than settled, given mixed trial quality.",
    safetyNotes: "Generally well tolerated. Can be mildly stimulating, so taking it late in the day may disrupt sleep for some people.",
    faq: [
      {
        question: "Is rhodiola a stimulant like caffeine?",
        answer:
          "No — it doesn't work like a stimulant, though some people find it mildly energizing, which is why morning use is recommended.",
      },
      {
        question: "Can I take rhodiola with ashwagandha?",
        answer:
          "Yes, they're sometimes combined, though they target different flavors of stress — rhodiola for fatigue and drive, ashwagandha for calming and sleep.",
      },
    ],
    relatedSupplements: ["ashwagandha", "l_tyrosine", "caffeine_ltheanine"],
  },

  zinc_mag: {
    howItWorks:
      "ZMA combines zinc and magnesium, two minerals commonly low in athletes due to losses through sweat, along with B6 to support their absorption — both play roles in sleep quality and immune function.",
    whoMightBenefit:
      "Athletes training intensely who may be running low on zinc or magnesium — not people specifically chasing a testosterone boost, which the original marketing overstated.",
    safetyNotes:
      "Take on an empty stomach, away from calcium-rich food, which blocks absorption. Long-term high-dose zinc can interfere with copper absorption — stick to labeled amounts.",
    faq: [
      {
        question: "Does ZMA actually boost testosterone?",
        answer:
          "Not meaningfully in men who already have adequate zinc levels — that specific claim hasn't held up, though the sleep and mineral-repletion benefits still apply if you're running low.",
      },
      {
        question: "Can I take ZMA every night?",
        answer: "Yes, at labeled doses, though it's most useful if you're actually training intensely and losing minerals through sweat.",
      },
    ],
    relatedSupplements: ["magnesium", "creatine", "electrolytes"],
  },

  inositol: {
    howItWorks:
      "Myo-inositol is involved in cell signaling pathways that affect how your cells respond to insulin, which is the basis for its studied benefits in insulin sensitivity and hormonal cycle regularity.",
    whoMightBenefit:
      "People managing PCOS-related insulin resistance or cycle irregularity most directly; it's also studied for anxiety, though at notably higher doses than the PCOS research.",
    safetyNotes:
      "Very well tolerated. Affects blood sugar handling, so coordinate with your doctor if you take diabetes medication. Higher doses can cause mild digestive upset.",
    faq: [
      {
        question: "Is inositol the same as taking metformin for PCOS?",
        answer:
          "No — it's a supplement, not a prescription medication, though some research compares favorably on insulin sensitivity. Discuss with your doctor rather than substituting it for a prescribed treatment.",
      },
      {
        question: "What dose is used for anxiety versus PCOS?",
        answer:
          "PCOS research typically uses 2–4g daily; anxiety studies have used considerably higher doses, so don't assume the same amount covers both uses.",
      },
    ],
    relatedSupplements: ["magnesium", "ashwagandha", "glycine"],
  },
};

export function getSupplementContent(key: string): SupplementContent | undefined {
  return SUPPLEMENT_CONTENT[key];
}

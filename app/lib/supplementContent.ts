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

  plant_protein: {
    howItWorks:
      "Protein supplies the amino acids muscle is rebuilt from, and leucine in particular is the signal that tells your body to start rebuilding. Pea and rice have complementary gaps in their amino acid profiles, so blending them gives you a complete source that neither provides alone.",
    whoMightBenefit:
      "Vegans, vegetarians, and anyone who avoids dairy but trains regularly. Like whey, it's a convenience tool for hitting a daily number, not a requirement.",
    safetyNotes:
      "Safe at typical serving sizes. Soy isolate is a good alternative and is complete on its own. Look for a product with third-party heavy metal testing — plant proteins draw more from the soil than dairy does.",
    faq: [
      {
        question: "Do I need more plant protein than whey?",
        answer:
          "Slightly. Plant sources are a little lower in leucine, so aiming for the upper end of the range — closer to 40g than 25g — closes the gap.",
      },
      {
        question: "Is pea protein complete on its own?",
        answer:
          "It's low in methionine. A pea and rice blend or a soy isolate solves that, which is why the blend rather than pea alone is the default here.",
      },
    ],
    relatedSupplements: ["creatine", "protein", "algal_oil"],
  },

  algal_oil: {
    howItWorks:
      "EPA and DHA are built into cell membranes throughout the body, where they reduce inflammatory signalling and support heart, brain and joint tissue. Marine algae are the original source; fish simply concentrate it by eating them.",
    whoMightBenefit:
      "Vegans and vegetarians first, but also anyone who gets reflux from fish oil or would rather avoid ocean contaminants.",
    safetyNotes:
      "Same consideration as fish oil: above roughly 3g a day it may increase bleeding risk, particularly alongside anticoagulants or before surgery. Otherwise well tolerated, and generally free of the heavy metal concerns that apply to some fish oils.",
    faq: [
      {
        question: "Is algal oil as effective as fish oil?",
        answer:
          "Blood levels of EPA and DHA rise comparably when the doses are matched, so for practical purposes yes. It usually costs more per gram.",
      },
      {
        question: "Can I take flaxseed oil instead?",
        answer:
          "No. Flaxseed provides ALA, which converts to EPA and DHA at single-digit percentages. Algal oil supplies both directly.",
      },
    ],
    relatedSupplements: ["omega3", "b12", "vitd3"],
  },

  melatonin: {
    howItWorks:
      "Melatonin doesn't sedate you. It tells your body clock that it's dark, which is why timing matters more than dose, and why taking it a few hours before bed shifts your whole rhythm earlier rather than simply knocking you out.",
    whoMightBenefit:
      "People whose sleep timing is wrong rather than whose sleep is light — travellers crossing time zones, shift workers, and anyone who can't fall asleep until far too late.",
    safetyNotes:
      "More is not better: higher doses show no extra benefit in pooled trials and are likelier to leave you groggy the next morning. Not for pregnancy or breastfeeding, and not for children without medical supervision. May interact with anticoagulants and blood pressure medication.",
    faq: [
      {
        question: "Why start at such a low dose?",
        answer:
          "The dose-response isn't linear. Trials consistently find low doses do the job, while 5–10mg mostly adds next-day grogginess without improving sleep.",
      },
      {
        question: "Is melatonin habit-forming?",
        answer:
          "There's no evidence of dependence or rebound insomnia at these doses. It still works best for a specific problem — a trip, a schedule shift — than taken indefinitely.",
      },
    ],
    relatedSupplements: ["magnesium", "glycine", "l_theanine"],
  },

  zinc_lozenge: {
    howItWorks:
      "Dissolving zinc slowly in the mouth and throat releases free zinc ions locally, where they appear to interfere with viral replication. Swallowing a zinc capsule doesn't reproduce this — the lozenge form is the mechanism, not just the format.",
    whoMightBenefit:
      "Anyone at the first scratchy-throat stage of a cold. It does nothing preventive, so there's no reason to take it while you're well.",
    safetyNotes:
      "Short courses only — sustained high-dose zinc suppresses copper absorption. A metallic taste and mild nausea are common. Avoid lozenges sweetened with citric acid, which binds the zinc and appears to cancel the effect.",
    faq: [
      {
        question: "Can I just take a zinc capsule instead?",
        answer:
          "For a cold, no. The benefit comes from zinc ions released in the throat as the lozenge dissolves, which a swallowed capsule bypasses entirely.",
      },
      {
        question: "Should I take zinc every day to prevent colds?",
        answer:
          "Not at this dose. Daily high-dose zinc causes copper problems over time — this is a short, acute course, and a multivitamin covers baseline needs.",
      },
    ],
    relatedSupplements: ["vitamin_c", "vitd3", "probiotic"],
  },

  iodine: {
    howItWorks:
      "Your thyroid uses iodine as a raw material for thyroxine, the hormone that regulates metabolic rate, body temperature and energy use. There's no way to make it without dietary iodine.",
    whoMightBenefit:
      "Vegans and vegetarians, particularly anyone who also avoids iodised salt. Not needed by most omnivores eating dairy or fish.",
    safetyNotes:
      "The adult upper limit is 600mcg in the EU and it's easy to exceed with seaweed. Choose a standardised potassium iodide supplement rather than raw kelp, whose iodine content varies enormously between batches and products.",
    faq: [
      {
        question: "Isn't kelp a more natural source?",
        answer:
          "It's the riskier one. Kelp iodine content varies by orders of magnitude between products, and excess iodine causes the same thyroid problems as deficiency.",
      },
      {
        question: "Do I need this if I use iodised salt?",
        answer:
          "Probably not. Iodised salt is the reason deficiency is rare in many countries — but it isn't standard everywhere, including much of Europe, so it's worth checking your label.",
      },
    ],
    relatedSupplements: ["b12", "algal_oil", "multivitamin"],
  },

  citicoline: {
    howItWorks:
      "Citicoline supplies choline for acetylcholine, the neurotransmitter most involved in attention, and cytidine for the phospholipids that make up neuronal membranes. It supports the raw materials rather than pushing a system harder.",
    whoMightBenefit:
      "People who want sustained focus without adding more caffeine, and older adults, where most of the memory and attention trials have been run.",
    safetyNotes:
      "Well tolerated. Occasional headache or insomnia if taken late in the day. Little interaction data, so mention it to your doctor if you take medication affecting the nervous system.",
    faq: [
      {
        question: "How is this different from lion's mane?",
        answer:
          "Citicoline works on neurotransmitter supply and has more human trial data behind it. Lion's mane targets nerve growth factor and the human evidence is still early.",
      },
      {
        question: "Is it a stimulant?",
        answer:
          "No. It won't wake you up the way caffeine does — it supports the machinery of attention rather than raising arousal.",
      },
    ],
    relatedSupplements: ["caffeine_ltheanine", "l_tyrosine", "lions_mane"],
  },

  bacopa: {
    howItWorks:
      "Bacosides, its active compounds, appear to support synaptic communication in the hippocampus and act as antioxidants in brain tissue. The delay before benefit suggests it works by gradual adaptation rather than an acute effect.",
    whoMightBenefit:
      "Anyone willing to take something daily for three months for a modest memory benefit. Not useful as an occasional pick-me-up.",
    safetyNotes:
      "Digestive upset is the main complaint. May add to the effect of sedatives and thyroid medication. Not enough safety data for pregnancy.",
    faq: [
      {
        question: "How long before I notice anything?",
        answer:
          "Most trials measure benefit at 8–12 weeks. If you're two weeks in and feel nothing, that's expected rather than a sign it isn't working.",
      },
      {
        question: "Can I take it with caffeine?",
        answer:
          "Yes — they target different things. Bacopa's slight sedating effect can actually sit well alongside a morning coffee.",
      },
    ],
    relatedSupplements: ["lions_mane", "citicoline", "ashwagandha"],
  },

  boswellia: {
    howItWorks:
      "Its boswellic acids, particularly AKBA, inhibit 5-lipoxygenase, an inflammatory enzyme that most anti-inflammatories leave untouched. That's why it complements curcumin instead of overlapping with it.",
    whoMightBenefit:
      "People with activity-related or osteoarthritic joint pain who want something that works on a shorter timescale than collagen.",
    safetyNotes:
      "Generally well tolerated; mild digestive upset is the usual complaint. May interact with anti-inflammatory and immune-modulating medication. Standardisation matters — unstandardised resin varies widely in active content.",
    faq: [
      {
        question: "Boswellia or curcumin?",
        answer:
          "They act on different pathways and are often studied together. If you're picking one, boswellia tends to act faster; curcumin has the larger body of osteoarthritis data.",
      },
      {
        question: "Is this the same as frankincense?",
        answer:
          "Same plant resin, yes — but the supplement is a standardised extract, not the essential oil, which is not for internal use.",
      },
    ],
    relatedSupplements: ["curcumin", "collagen", "omega3"],
  },

  glucosamine: {
    howItWorks:
      "Glucosamine is a building block of cartilage, and the theory is that supplementing it supports cartilage maintenance. The mechanism is plausible; whether enough reaches joint tissue at oral doses is the part the trials argue about.",
    whoMightBenefit:
      "People with knee osteoarthritis willing to give it a three-month trial and stop if nothing changes. If you're starting from scratch, boswellia and curcumin have the cleaner evidence.",
    safetyNotes:
      "Well tolerated. Watch it alongside warfarin, where case reports suggest an increased effect. May slightly raise blood glucose — worth knowing if you're diabetic. Formulation matters: the positive trials used crystalline glucosamine sulfate, not hydrochloride.",
    faq: [
      {
        question: "Does it actually work?",
        answer:
          "Honestly, the field is split. Trials using crystalline glucosamine sulfate tend to find a modest benefit; several large independent trials found none. Give it three months and judge it yourself.",
      },
      {
        question: "Should I take chondroitin with it?",
        answer:
          "They're commonly combined and the combination is what most products sell. The evidence for the pair isn't clearly better than for glucosamine alone.",
      },
    ],
    relatedSupplements: ["collagen", "boswellia", "curcumin"],
  },

  peppermint_oil: {
    howItWorks:
      "Menthol relaxes the smooth muscle of the intestinal wall, easing the spasms behind IBS cramping. The enteric coating is what gets it past the stomach so it releases where it's needed.",
    whoMightBenefit:
      "People with IBS-type abdominal pain, cramping and bloating — particularly if fibre alone hasn't helped.",
    safetyNotes:
      "Heartburn is the most common side effect, and it's the reason the enteric coating matters. Not for people with a hiatus hernia or significant reflux. May interact with medications processed by CYP3A4 — worth a pharmacist check if you take several prescriptions.",
    faq: [
      {
        question: "Can I use peppermint tea instead?",
        answer:
          "No. Tea doesn't deliver a meaningful dose of the oil, and what it does deliver is released in the stomach rather than the intestine.",
      },
      {
        question: "How long until it helps?",
        answer:
          "Faster than most things here — trials typically measure symptom improvement over two to four weeks.",
      },
    ],
    relatedSupplements: ["fibre", "probiotic", "prebiotic"],
  },

  s_boulardii: {
    howItWorks:
      "Because it's a yeast, it survives a course of antibiotics that would wipe out a bacterial probiotic. It occupies the gut temporarily, competes with opportunistic organisms, and clears out within days of stopping.",
    whoMightBenefit:
      "Anyone starting a course of antibiotics, and travellers prone to stomach upset. Not a daily supplement — it's for a specific window.",
    safetyNotes:
      "Very well tolerated in healthy people. The exception matters: avoid it if you're immunocompromised, critically ill, or have a central venous catheter. Don't take it with antifungal medication, which will kill it.",
    faq: [
      {
        question: "Won't antibiotics kill a probiotic?",
        answer:
          "They kill bacterial ones, which is why timing advice around them is so fiddly. This is a yeast, so antibiotics don't touch it — that's the whole point of using it here.",
      },
      {
        question: "Should I take this instead of a multi-strain probiotic?",
        answer:
          "Alongside, and for a different reason. Multi-strain products are for ongoing digestive symptoms; this one is for a defined antibiotic or travel window.",
      },
    ],
    relatedSupplements: ["probiotic", "fibre", "prebiotic"],
  },

  prebiotic: {
    howItWorks:
      "Your gut bacteria ferment these fibres into short-chain fatty acids like butyrate, which feed the cells lining your colon. That fermentation is also why they cause gas when introduced too quickly.",
    whoMightBenefit:
      "People whose diet is low in varied plant fibre, and anyone taking a probiotic who wants to give it something to work with.",
    safetyNotes:
      "Gas and bloating are common in the first weeks and usually settle — going up slowly is the whole trick. If you have IBS, choose PHGG; inulin and GOS commonly make symptoms worse.",
    faq: [
      {
        question: "How is this different from psyllium?",
        answer:
          "Psyllium mostly bulks and softens stool. Prebiotic fibres are fermented by your bacteria, which is what produces the short-chain fatty acids — different job, and they're fine together.",
      },
      {
        question: "Why does it make me gassy?",
        answer:
          "Because it's working — fermentation produces gas. Starting at 3g and increasing over a few weeks gives your bacteria time to adjust.",
      },
    ],
    relatedSupplements: ["fibre", "probiotic", "s_boulardii"],
  },

  l_theanine: {
    howItWorks:
      "An amino acid from tea leaves that increases alpha wave activity in the brain, the pattern associated with relaxed alertness. It calms without the drowsiness of a sedative, which is why it pairs with caffeine and also works alone.",
    whoMightBenefit:
      "People with a racing mind at the end of the day, anyone who wants to take the edge off without feeling dulled, and those who want the calming half of the caffeine stack in the evening.",
    safetyNotes:
      "Very well tolerated with no known serious interactions. May mildly lower blood pressure, which is worth knowing if you're already on medication for it.",
    faq: [
      {
        question: "Will it make me sleepy?",
        answer:
          "Not usually. It reduces the feeling of being wound up rather than inducing sleep, which is why it works during the day as well as at night.",
      },
      {
        question: "Can I get enough from tea?",
        answer:
          "A cup of green tea has roughly 10–25mg, so reaching 200mg through tea means a lot of tea and a lot of caffeine with it.",
      },
    ],
    relatedSupplements: ["caffeine_ltheanine", "magnesium", "ashwagandha"],
  },

  saffron: {
    howItWorks:
      "Its active compounds, crocin and safranal, appear to act on serotonin availability — the same broad system most antidepressants work on, though far more weakly and by a less well-characterised route.",
    whoMightBenefit:
      "People dealing with low mood rather than the wired, over-stressed feeling adaptogens address. It's for a different symptom than ashwagandha.",
    safetyNotes:
      "Well tolerated at supplement doses. Because it acts on serotonin, don't combine it with SSRIs, SNRIs or other serotonergic drugs without medical advice. Very high doses of raw saffron are toxic — stick to standardised extracts at the studied dose.",
    faq: [
      {
        question: "Can I cook with saffron instead?",
        answer:
          "Culinary quantities are far below the studied dose, and the trials all used standardised extracts. It's a lovely spice, but not a delivery method.",
      },
      {
        question: "Can I take it alongside my antidepressant?",
        answer:
          "Not without asking your doctor. It acts on the same system, and stacking serotonergic effects is the one interaction worth taking seriously here.",
      },
    ],
    relatedSupplements: ["ashwagandha", "rhodiola", "vitd3"],
  },

  tart_cherry: {
    howItWorks:
      "Montmorency cherries are unusually high in anthocyanins, which blunt exercise-induced inflammation and oxidative stress. They also contain a small amount of natural melatonin, which is the likely explanation for the sleep findings.",
    whoMightBenefit:
      "Anyone training hard through a competition block or a dense week of sessions, and people who want a recovery aid that also helps them sleep.",
    safetyNotes:
      "Very safe as a food. The one caveat is strategic rather than medical: blunting exercise inflammation may slightly reduce muscle-building adaptation, so it's better used around competition than throughout a whole building block. The juice is also high in sugar.",
    faq: [
      {
        question: "Juice or capsules?",
        answer:
          "Most trials used concentrate. Capsules are more convenient and lower in sugar, but check the anthocyanin content rather than the cherry weight on the label.",
      },
      {
        question: "Should I take it year-round?",
        answer:
          "Probably not. Reducing the inflammatory signal is what helps you recover, but that signal is also part of how training makes you stronger — save it for when recovering fast matters most.",
      },
    ],
    relatedSupplements: ["electrolytes", "magnesium", "curcumin"],
  },

  sodium_bicarb: {
    howItWorks:
      "Beta-alanine buffers acid inside the muscle cell; bicarbonate raises the buffering capacity of the blood outside it, helping pull hydrogen ions out of working muscle. The two act in different compartments, which is why they stack.",
    whoMightBenefit:
      "Athletes doing all-out efforts lasting roughly one to seven minutes — 800m, rowing, swimming, hard interval sessions. Little use for steady endurance or single heavy lifts.",
    safetyNotes:
      "Gastrointestinal distress — bloating, cramping, sometimes vomiting — is the limiting factor and affects a significant minority. Splitting the dose and taking it with food reduces it. High sodium load, so unsuitable with hypertension or fluid restriction.",
    faq: [
      {
        question: "Is this just baking soda?",
        answer:
          "Chemically yes, and that's what the trials used. Enteric-coated capsule versions exist specifically to reduce the stomach problems.",
      },
      {
        question: "Can I take it with beta-alanine?",
        answer:
          "Yes — they buffer in different compartments and the combination has been studied. Adding both at once means you won't know which is doing what, so introduce them separately.",
      },
    ],
    relatedSupplements: ["beta_alanine", "citrulline", "beetroot"],
  },

  plant_sterols: {
    howItWorks:
      "Plant sterols are structurally similar enough to cholesterol to compete with it for absorption in the intestine, so less dietary and biliary cholesterol makes it into circulation.",
    whoMightBenefit:
      "Anyone working on cholesterol through diet, including people already on a statin — the two lower LDL by different mechanisms and the effects add up.",
    safetyNotes:
      "Well established and widely used in fortified foods. It slightly lowers fat-soluble vitamin and carotenoid absorption, so pair it with a varied diet. Above 3g a day there's no additional benefit.",
    faq: [
      {
        question: "Can I get this from fortified spreads instead?",
        answer:
          "Yes — that's how most of the trial evidence was generated. The supplement is just a way to hit 2g without changing what you eat.",
      },
      {
        question: "Does it work if I'm already on a statin?",
        answer:
          "The mechanisms are different — statins reduce production, sterols reduce absorption — so the effects generally add. Tell your doctor you've started it.",
      },
    ],
    relatedSupplements: ["fibre", "omega3", "berberine"],
  },

  folate: {
    howItWorks:
      "Folate is required to synthesize DNA and support rapid cell division, which is why demand rises sharply in early pregnancy as the neural tube forms. Methylfolate is the form your body actually uses after conversion from folic acid.",
    whoMightBenefit:
      "Anyone who could become pregnant, ideally starting before conception rather than after a positive test — the neural tube closes in the first few weeks, often before pregnancy is confirmed.",
    safetyNotes:
      "Very safe at this dose. People with a common MTHFR gene variant convert folic acid to its active form less efficiently, which is why methylfolate is often preferred. A personal or family history of neural tube defects calls for a higher, doctor-guided dose.",
    faq: [
      {
        question: "Folic acid or methylfolate?",
        answer:
          "Either works for most people, but methylfolate skips a conversion step that a meaningful share of people are genetically less efficient at, so it's the safer default.",
      },
      {
        question: "Do I need this if I'm not actively trying to conceive?",
        answer:
          "If pregnancy is possible at all, starting before conception matters more than starting after — the critical window closes early, often before you'd know.",
      },
    ],
    relatedSupplements: ["iodine", "algal_oil", "b12"],
  },

  calcium: {
    howItWorks:
      "Calcium is the primary mineral in bone, constantly being deposited and withdrawn in a cycle that shifts toward net loss with age, especially after menopause. Vitamin D governs how much of it you actually absorb from your gut.",
    whoMightBenefit:
      "Older adults, especially post-menopausal women, and anyone whose diet is genuinely light on dairy or fortified alternatives — it's a targeted fix for a dietary gap, not a blanket recommendation.",
    safetyNotes:
      "Total intake matters more than the supplement dose alone — count what you're already getting from food. Above roughly 2000mg total daily it's been linked to kidney stones and, in some research, cardiovascular risk. Separate it from iron and thyroid medication by a couple of hours.",
    faq: [
      {
        question: "Should I take this if I already drink milk daily?",
        answer:
          "Probably not, or only a small dose — dairy already provides a substantial amount, and stacking a full supplement dose on top can push you over the upper limit.",
      },
      {
        question: "Citrate or carbonate?",
        answer:
          "Citrate absorbs well with or without food and is gentler for people on acid-reducing medication; carbonate is cheaper but needs stomach acid, so it's best taken with meals.",
      },
    ],
    relatedSupplements: ["vitd3", "multivitamin", "b12"],
  },
};

export function getSupplementContent(key: string): SupplementContent | undefined {
  return SUPPLEMENT_CONTENT[key];
}

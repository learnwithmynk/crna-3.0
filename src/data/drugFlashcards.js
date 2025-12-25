/**
 * Drug Flashcard Content
 *
 * Flashcard Q&A content for ICU medications commonly used by CRNA applicants.
 * Covers mechanism, receptor, dosing, side effects, and clinical pearls.
 *
 * TODO: Expand to cover all medications in clinicalCategories.js
 */

// =============================================================================
// FLASHCARD CONTENT
// =============================================================================

export const DRUG_FLASHCARDS = {
  // =========================================================================
  // VASOPRESSORS
  // =========================================================================
  norepinephrine: {
    medicationId: 'norepinephrine',
    name: 'Norepinephrine (Levophed)',
    category: 'vasopressors',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of action of norepinephrine?',
        answer: 'Potent α1 agonist with mild β1 activity. Causes peripheral vasoconstriction (α1) and mild positive inotropy (β1).',
      },
      {
        type: 'receptor',
        question: 'What receptors does norepinephrine primarily act on?',
        answer: 'α1 >> β1 > β2. Strong α1 effects cause vasoconstriction. Minimal β2 means less tachycardia than epinephrine.',
      },
      {
        type: 'dosing',
        question: 'What is the typical dosing range for norepinephrine?',
        answer: '0.01-3 mcg/kg/min (commonly 2-20 mcg/min). Start low and titrate to MAP goal (usually ≥65 mmHg).',
      },
      {
        type: 'side_effects',
        question: 'What are the major side effects of norepinephrine?',
        answer: 'Peripheral ischemia (digits, skin), arrhythmias, tissue necrosis with extravasation. Treat extravasation with phentolamine.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why is norepinephrine first-line for septic shock?',
        answer: 'Restores vascular tone without excessive tachycardia. Sepsis causes vasodilatory shock - norepi addresses the primary problem (low SVR).',
      },
    ],
  },

  epinephrine: {
    medicationId: 'epinephrine',
    name: 'Epinephrine',
    category: 'vasopressors',
    questions: [
      {
        type: 'mechanism',
        question: 'How does epinephrine differ at low vs high doses?',
        answer: 'Low dose (0.01-0.1 mcg/kg/min): β effects dominate (↑HR, ↑contractility, vasodilation). High dose: α effects dominate (vasoconstriction).',
      },
      {
        type: 'receptor',
        question: 'What is the receptor profile of epinephrine?',
        answer: 'α1 = β1 = β2 (dose-dependent). Equal affinity, but β receptors more sensitive at low concentrations.',
      },
      {
        type: 'dosing',
        question: 'What is the ACLS dose for cardiac arrest?',
        answer: '1 mg IV push every 3-5 minutes. For infusion: 0.01-0.5 mcg/kg/min titrated to effect.',
      },
      {
        type: 'side_effects',
        question: 'What metabolic effect is unique to epinephrine?',
        answer: 'Causes hyperglycemia (β2 → glycogenolysis, gluconeogenesis) and lactic acidosis (even without hypoperfusion). Monitor glucose and lactate.',
      },
      {
        type: 'clinical_pearl',
        question: 'When would you choose epinephrine over norepinephrine?',
        answer: 'When you need both pressor AND inotropic support (e.g., cardiogenic + distributive shock, anaphylaxis, post-cardiac arrest).',
      },
    ],
  },

  vasopressin: {
    medicationId: 'vasopressin',
    name: 'Vasopressin',
    category: 'vasopressors',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of vasopressin?',
        answer: 'Acts on V1 receptors in vascular smooth muscle → vasoconstriction. Non-catecholamine pressor that works even in acidosis.',
      },
      {
        type: 'receptor',
        question: 'What are the different vasopressin receptor types?',
        answer: 'V1a: vasoconstriction. V1b: ACTH release. V2: water reabsorption (ADH effect). V1a is the target for shock.',
      },
      {
        type: 'dosing',
        question: 'What is the fixed dose of vasopressin in septic shock?',
        answer: '0.03-0.04 units/min (NOT titrated). Added to norepinephrine as "catecholamine-sparing" agent per Surviving Sepsis.',
      },
      {
        type: 'side_effects',
        question: 'What are the risks of vasopressin?',
        answer: 'Mesenteric ischemia, digital ischemia, hyponatremia (V2 effects), decreased cardiac output in high doses.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why add vasopressin in septic shock?',
        answer: 'Sepsis depletes endogenous vasopressin. Adding it restores sensitivity to catecholamines and allows lower norepi doses.',
      },
    ],
  },

  phenylephrine: {
    medicationId: 'phenylephrine',
    name: 'Phenylephrine (Neosynephrine)',
    category: 'vasopressors',
    questions: [
      {
        type: 'mechanism',
        question: 'What is unique about phenylephrine\'s receptor profile?',
        answer: 'Pure α1 agonist with NO β activity. Causes vasoconstriction without direct cardiac effects.',
      },
      {
        type: 'receptor',
        question: 'Why does phenylephrine cause reflex bradycardia?',
        answer: 'Pure α1 → increased SVR → baroreceptor-mediated reflex decrease in HR. No β1 to counteract this.',
      },
      {
        type: 'dosing',
        question: 'What is the typical phenylephrine dosing?',
        answer: 'Bolus: 50-200 mcg IV. Infusion: 0.5-5 mcg/kg/min. Often used in OR for quick BP support.',
      },
      {
        type: 'side_effects',
        question: 'When should you avoid phenylephrine?',
        answer: 'Severe bradycardia, cardiogenic shock (increases afterload without helping contractility), aortic stenosis.',
      },
      {
        type: 'clinical_pearl',
        question: 'When is phenylephrine the ideal choice?',
        answer: 'Hypotension with adequate/high CO and low SVR (e.g., spinal anesthesia). Avoid when cardiac output is compromised.',
      },
    ],
  },

  // =========================================================================
  // INOTROPES
  // =========================================================================
  dobutamine: {
    medicationId: 'dobutamine',
    name: 'Dobutamine',
    category: 'inotropes',
    questions: [
      {
        type: 'mechanism',
        question: 'What makes dobutamine an inotrope rather than a pressor?',
        answer: 'Primarily β1 agonist (↑contractility) with some β2 (vasodilation). Net effect: ↑CO with ↓SVR. Not a pressor!',
      },
      {
        type: 'receptor',
        question: 'What is the receptor profile of dobutamine?',
        answer: 'β1 > β2 >> α1. Synthetic catecholamine designed for inotropy without significant vasoconstriction.',
      },
      {
        type: 'dosing',
        question: 'What is the dosing range for dobutamine?',
        answer: '2.5-20 mcg/kg/min. Start at 2.5 and titrate. Higher doses → more tachycardia and arrhythmias.',
      },
      {
        type: 'side_effects',
        question: 'What are the main concerns with dobutamine?',
        answer: 'Tachycardia, arrhythmias, hypotension (β2 vasodilation), increased myocardial oxygen demand, tolerance with prolonged use.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why pair dobutamine with norepinephrine?',
        answer: 'Norepi maintains SVR (α1) while dobutamine provides inotropy (β1). Common combo for cardiogenic shock with low SVR.',
      },
    ],
  },

  milrinone: {
    medicationId: 'milrinone',
    name: 'Milrinone',
    category: 'inotropes',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of milrinone?',
        answer: 'Phosphodiesterase-3 inhibitor → ↑cAMP → positive inotropy + vasodilation ("inodilator"). Does NOT work via β receptors.',
      },
      {
        type: 'receptor',
        question: 'Why is milrinone useful in β-blocked patients?',
        answer: 'Works downstream of β receptors via PDE-3 inhibition. Still effective when catecholamines are blocked.',
      },
      {
        type: 'dosing',
        question: 'How is milrinone typically dosed?',
        answer: 'Load: 50 mcg/kg over 10 min (often skipped due to hypotension). Infusion: 0.25-0.75 mcg/kg/min. Reduce in renal impairment.',
      },
      {
        type: 'side_effects',
        question: 'What is the main hemodynamic risk with milrinone?',
        answer: 'Significant hypotension from vasodilation. Often need concurrent vasopressor. Also: arrhythmias, thrombocytopenia.',
      },
      {
        type: 'clinical_pearl',
        question: 'When is milrinone preferred over dobutamine?',
        answer: 'Right heart failure (↓PVR), β-blocked patients, pulmonary hypertension. Also: no tolerance with prolonged use.',
      },
    ],
  },

  // =========================================================================
  // SEDATIVES
  // =========================================================================
  propofol: {
    medicationId: 'propofol',
    name: 'Propofol',
    category: 'sedatives',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of propofol?',
        answer: 'Potentiates GABA-A receptor activity → CNS depression. Also has some NMDA antagonist and sodium channel blocking properties.',
      },
      {
        type: 'dosing',
        question: 'What is the sedation dosing for propofol?',
        answer: 'ICU sedation: 5-50 mcg/kg/min. Induction: 1.5-2.5 mg/kg IV push. Titrate to RASS goal.',
      },
      {
        type: 'side_effects',
        question: 'What is propofol infusion syndrome (PRIS)?',
        answer: 'Rare but fatal: metabolic acidosis, rhabdomyolysis, hyperkalemia, cardiac failure. Risk ↑ with doses >80 mcg/kg/min >48hr.',
      },
      {
        type: 'side_effects',
        question: 'What cardiovascular effects does propofol cause?',
        answer: 'Hypotension (↓SVR, ↓preload, negative inotropy), bradycardia. Use cautiously in unstable patients.',
      },
      {
        type: 'clinical_pearl',
        question: 'What is the daily lipid load concern with propofol?',
        answer: 'Propofol is in 10% lipid emulsion (1.1 kcal/mL). Count toward daily lipid/caloric intake. Monitor triglycerides.',
      },
    ],
  },

  dexmedetomidine: {
    medicationId: 'dexmedetomidine',
    name: 'Dexmedetomidine (Precedex)',
    category: 'sedatives',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of dexmedetomidine?',
        answer: 'Selective α2-agonist in locus coeruleus → sedation without respiratory depression. Unique "arousable" sedation.',
      },
      {
        type: 'receptor',
        question: 'Why doesn\'t dexmedetomidine cause respiratory depression?',
        answer: 'Acts on α2 receptors (not GABA or opioid). Provides sedation similar to natural sleep. Patient can be awakened.',
      },
      {
        type: 'dosing',
        question: 'What is the typical dosing for dexmedetomidine?',
        answer: 'Load: 0.5-1 mcg/kg over 10 min (often causes hypotension/bradycardia). Infusion: 0.2-0.7 mcg/kg/hr.',
      },
      {
        type: 'side_effects',
        question: 'What are the main hemodynamic effects?',
        answer: 'Bradycardia and hypotension (α2 → ↓sympathetic outflow). May also see hypertension with loading dose (peripheral α2).',
      },
      {
        type: 'clinical_pearl',
        question: 'When is dexmedetomidine preferred?',
        answer: 'Spontaneous breathing trials, avoiding delirium, neuro exams needed. Avoid in heart block, severe bradycardia.',
      },
    ],
  },

  ketamine: {
    medicationId: 'ketamine',
    name: 'Ketamine',
    category: 'sedatives',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the primary mechanism of ketamine?',
        answer: 'NMDA receptor antagonist → dissociative anesthesia. Also has opioid, monoaminergic, and anticholinergic effects.',
      },
      {
        type: 'dosing',
        question: 'What are ketamine doses for different indications?',
        answer: 'Analgesia: 0.1-0.3 mg/kg. Sedation: 0.5-1 mg/kg. Induction: 1-2 mg/kg IV. Infusion: 0.1-0.5 mg/kg/hr.',
      },
      {
        type: 'side_effects',
        question: 'Why is ketamine called a "sympathomimetic"?',
        answer: 'Inhibits catecholamine reuptake → ↑HR, ↑BP. Useful in shock. But in catecholamine-depleted patients, may cause hypotension.',
      },
      {
        type: 'side_effects',
        question: 'What psychiatric effects can ketamine cause?',
        answer: 'Emergence reactions, hallucinations, vivid dreams. Mitigate with benzodiazepines. More common in adults than children.',
      },
      {
        type: 'clinical_pearl',
        question: 'When is ketamine the ideal sedative?',
        answer: 'Hypotensive patients (preserves hemodynamics), bronchospasm (bronchodilator), procedural sedation, RSI alternative.',
      },
    ],
  },

  // =========================================================================
  // ANALGESICS
  // =========================================================================
  fentanyl: {
    medicationId: 'fentanyl',
    name: 'Fentanyl',
    category: 'analgesics',
    questions: [
      {
        type: 'mechanism',
        question: 'What makes fentanyl preferred in the ICU?',
        answer: 'Highly lipophilic, rapid onset (1-2 min), short duration. Minimal histamine release and hemodynamic effects.',
      },
      {
        type: 'receptor',
        question: 'What is fentanyl\'s potency compared to morphine?',
        answer: '80-100x more potent than morphine. 100 mcg fentanyl ≈ 10 mg morphine.',
      },
      {
        type: 'dosing',
        question: 'What is the typical ICU fentanyl dosing?',
        answer: 'Bolus: 25-100 mcg. Infusion: 25-200 mcg/hr. Titrate to pain scale (BPS, CPOT).',
      },
      {
        type: 'side_effects',
        question: 'What is unique about fentanyl\'s side effect profile?',
        answer: 'Chest wall rigidity ("wooden chest") with rapid high-dose bolus. Treat with naloxone or paralytic.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why might fentanyl accumulate in prolonged infusions?',
        answer: 'Context-sensitive half-time. Lipophilic → tissue accumulation → prolonged effect after stopping. Worse in renal failure.',
      },
    ],
  },

  // =========================================================================
  // PARALYTICS
  // =========================================================================
  rocuronium: {
    medicationId: 'rocuronium',
    name: 'Rocuronium',
    category: 'paralytics',
    questions: [
      {
        type: 'mechanism',
        question: 'How does rocuronium work?',
        answer: 'Non-depolarizing neuromuscular blocker. Competitive antagonist at nicotinic ACh receptors at NMJ.',
      },
      {
        type: 'dosing',
        question: 'What is the RSI dose of rocuronium?',
        answer: '1.2 mg/kg for RSI conditions (60-90 sec onset). Standard intubation: 0.6 mg/kg (90-120 sec onset).',
      },
      {
        type: 'side_effects',
        question: 'What is the reversal agent for rocuronium?',
        answer: 'Sugammadex (encapsulates rocuronium) OR neostigmine + glycopyrrolate (increases ACh). Sugammadex is faster/more reliable.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why is rocuronium preferred for RSI over succinylcholine?',
        answer: 'No fasciculations, no hyperkalemia risk, no malignant hyperthermia trigger. Can reverse with sugammadex if can\'t intubate.',
      },
    ],
  },

  cisatracurium: {
    medicationId: 'cisatracurium',
    name: 'Cisatracurium (Nimbex)',
    category: 'paralytics',
    questions: [
      {
        type: 'mechanism',
        question: 'What is unique about cisatracurium metabolism?',
        answer: 'Undergoes Hofmann elimination (temperature and pH-dependent degradation). Organ-independent - ideal for renal/hepatic failure.',
      },
      {
        type: 'dosing',
        question: 'What is the infusion dose for cisatracurium?',
        answer: 'Bolus: 0.1-0.2 mg/kg. Infusion: 1-3 mcg/kg/min. Titrate with train-of-four monitoring (goal: 1-2 twitches).',
      },
      {
        type: 'side_effects',
        question: 'What are the risks of prolonged paralysis?',
        answer: 'ICU-acquired weakness, difficult weaning, pressure injuries, DVT, corneal abrasions. Always sedate FIRST.',
      },
      {
        type: 'clinical_pearl',
        question: 'When is cisatracurium used in ARDS?',
        answer: 'Early ARDS with P/F <150. Improves chest wall compliance, reduces O2 consumption, may reduce inflammation (ACURASYS trial).',
      },
    ],
  },

  // =========================================================================
  // ANTIARRHYTHMICS
  // =========================================================================
  amiodarone: {
    medicationId: 'amiodarone',
    name: 'Amiodarone',
    category: 'antiarrhythmics',
    questions: [
      {
        type: 'mechanism',
        question: 'Why is amiodarone considered a "dirty" drug?',
        answer: 'Blocks multiple channels: K+ (Class III), Na+ (Class I), Ca2+ (Class IV), and has β-blocking activity (Class II). All 4 classes!',
      },
      {
        type: 'dosing',
        question: 'What is the ACLS dose for VF/pVT?',
        answer: 'First dose: 300 mg IV push. Second dose: 150 mg. For stable VT: 150 mg over 10 min, then 1 mg/min x 6hr, then 0.5 mg/min.',
      },
      {
        type: 'side_effects',
        question: 'What are the major toxicities of amiodarone?',
        answer: 'Pulmonary fibrosis, thyroid dysfunction (hypo/hyper), hepatotoxicity, corneal deposits, photosensitivity, "blue man" skin.',
      },
      {
        type: 'clinical_pearl',
        question: 'What is the half-life of amiodarone?',
        answer: '40-55 days! Effects persist weeks after stopping. Stored in fat/tissues. Important for drug interactions (warfarin, digoxin).',
      },
    ],
  },

  // =========================================================================
  // VASODILATORS
  // =========================================================================
  nicardipine: {
    medicationId: 'nicardipine',
    name: 'Nicardipine (Cardene)',
    category: 'vasodilators',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of nicardipine?',
        answer: 'Dihydropyridine calcium channel blocker. Blocks L-type Ca2+ channels in vascular smooth muscle → vasodilation.',
      },
      {
        type: 'receptor',
        question: 'How does nicardipine differ from diltiazem?',
        answer: 'Nicardipine: vascular-selective (no AV node effects). Diltiazem: affects both heart and vessels (slows HR, AV conduction).',
      },
      {
        type: 'dosing',
        question: 'How is nicardipine titrated for hypertensive emergency?',
        answer: 'Start 5 mg/hr, increase by 2.5 mg/hr q5-15min. Max 15 mg/hr. Decrease by 3 mg/hr when at goal.',
      },
      {
        type: 'clinical_pearl',
        question: 'Why is nicardipine preferred for neuro emergencies?',
        answer: 'Cerebral vasodilation without ↓cerebral perfusion. Doesn\'t increase ICP. Ideal for stroke, SAH, ICH.',
      },
    ],
  },

  nitroprusside: {
    medicationId: 'nitroprusside',
    name: 'Nitroprusside (Nipride)',
    category: 'vasodilators',
    questions: [
      {
        type: 'mechanism',
        question: 'What is the mechanism of nitroprusside?',
        answer: 'Releases NO → activates guanylate cyclase → ↑cGMP → smooth muscle relaxation. Dilates both arteries AND veins.',
      },
      {
        type: 'dosing',
        question: 'What is the typical dosing for nitroprusside?',
        answer: 'Start 0.3 mcg/kg/min, titrate to effect. Max 10 mcg/kg/min. Use shortest duration possible.',
      },
      {
        type: 'side_effects',
        question: 'What is cyanide toxicity and how do you monitor for it?',
        answer: 'Nitroprusside releases cyanide. Signs: lactic acidosis, tachyphylaxis, ↓O2 extraction. Check thiocyanate levels (>10 mg/dL toxic).',
      },
      {
        type: 'clinical_pearl',
        question: 'When should you avoid nitroprusside?',
        answer: 'Renal failure (thiocyanate accumulation), hepatic failure (impaired cyanide metabolism), pregnancy, ↑ICP.',
      },
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get flashcard data for a medication
 */
export function getFlashcardForMedication(medicationId) {
  return DRUG_FLASHCARDS[medicationId] || null;
}

/**
 * Get all available flashcard medication IDs
 */
export function getAvailableFlashcardMeds() {
  return Object.keys(DRUG_FLASHCARDS);
}

/**
 * Get flashcards for a list of medications (filtered by what user has logged)
 */
export function getFlashcardsForLoggedMeds(loggedMedicationIds) {
  return loggedMedicationIds
    .map((id) => DRUG_FLASHCARDS[id])
    .filter(Boolean);
}

/**
 * Get a random question from a flashcard
 */
export function getRandomQuestion(medicationId) {
  const flashcard = DRUG_FLASHCARDS[medicationId];
  if (!flashcard) return null;

  const randomIndex = Math.floor(Math.random() * flashcard.questions.length);
  return {
    ...flashcard.questions[randomIndex],
    medicationName: flashcard.name,
    medicationId: flashcard.medicationId,
  };
}

/**
 * Get questions by type
 */
export function getQuestionsByType(medicationId, type) {
  const flashcard = DRUG_FLASHCARDS[medicationId];
  if (!flashcard) return [];

  return flashcard.questions.filter((q) => q.type === type);
}

export default DRUG_FLASHCARDS;

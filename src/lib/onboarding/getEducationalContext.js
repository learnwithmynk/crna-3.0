/**
 * Educational Context for Onboarding
 *
 * Provides context-aware educational messages and encouragement
 * based on user's data inputs. Follows the "honest, actionable, brief" principle.
 */

/**
 * Get ICU experience context based on years/months
 */
export function getIcuExperienceContext(years, months) {
  const totalMonths = (years || 0) * 12 + (months || 0);

  if (totalMonths === 0) {
    return {
      encouragement: "That's okay - ICU experience is one of the most important factors, but you're getting started.",
      educational:
        "Your ICU experience is the foundation of your application. Programs want to see you can handle high-acuity patients and make critical decisions under pressure. Most programs require 1-2 years minimum.",
    };
  }

  if (totalMonths < 12) {
    return {
      encouragement: "You're building experience. Most programs want 1-2 years minimum - you're on your way.",
      educational:
        "Every shift builds your clinical judgment. Focus on getting exposure to high-acuity patients and complex medications. Document interesting cases for your application.",
    };
  }

  if (totalMonths < 24) {
    return {
      encouragement:
        "You're building a solid foundation. Many successful applicants apply around this point.",
      educational:
        "You're in the sweet spot where you have meaningful experience but still have time to fill any gaps. Focus on quality of experience, not just quantity.",
    };
  }

  return {
    encouragement:
      "Your experience is a strength. Let's make sure schools see the full picture.",
    educational:
      "With 2+ years, you exceed most minimums. Now it's about showcasing the depth and breadth of your experience - complex patients, leadership moments, and continuous learning.",
  };
}

/**
 * Get ICU type context
 */
export function getIcuTypeContext(icuType) {
  const contexts = {
    micu: {
      educational:
        "MICU nurses manage multi-system failure and complex medical patients. This gives you excellent experience with ventilator management and critical thinking.",
    },
    sicu: {
      educational:
        "SICU experience demonstrates your ability to manage post-operative patients and understand surgical complexity. Many programs value this perspective.",
    },
    cvicu: {
      educational:
        "CVICU is highly valued - you see complex hemodynamics, vasoactive drips, and mechanical circulatory support. This directly relates to anesthesia practice.",
    },
    neuro: {
      educational:
        "Neuro ICU provides unique experience with ICP management, sedation assessment, and critical decision-making. Programs appreciate this specialized knowledge.",
    },
    trauma: {
      educational:
        "Trauma ICU means rapid assessment, multi-system injuries, and high-acuity patients. This fast-paced environment builds strong clinical skills.",
    },
    picu: {
      educational:
        "PICU experience shows you can adapt care to different populations. Pediatric anesthesia is a subspecialty, so this background is valuable.",
    },
    nicu: {
      educational:
        "NICU provides unique experience with the most vulnerable patients. Some programs may want additional adult ICU experience, but this foundation is solid.",
    },
    mixed: {
      educational:
        "Mixed ICU gives you breadth across patient populations. This versatility is valuable - you've seen a wide range of critical conditions.",
    },
  };

  return (
    contexts[icuType] || {
      educational:
        "Different ICU types expose you to different skills. We'll help you highlight what makes YOUR experience valuable.",
    }
  );
}

/**
 * Get shadowing context based on hours
 */
export function getShadowingContext(hours) {
  if (!hours || hours === 0) {
    return {
      encouragement:
        "That's okay - shadowing is easier to arrange than you think. We'll help you find opportunities.",
      educational:
        "Shadowing isn't just a box to check. It shows your commitment to the profession AND gives you valuable stories for your essay and interview. Every hour gives you talking points.",
    };
  }

  if (hours < 12) {
    return {
      encouragement:
        "You're getting started! Most programs want 20-40 hours. Plenty of time to build up.",
      educational:
        "Focus on quality over quantity. Ask thoughtful questions, take notes on interesting cases, and build relationships with the CRNAs you shadow.",
    };
  }

  if (hours < 24) {
    return {
      encouragement:
        "Good progress! You're approaching the range most programs expect.",
      educational:
        "Keep building your hours and try to shadow in different settings if possible - OR, cath lab, OB, etc. Variety shows genuine interest.",
    };
  }

  if (hours < 40) {
    return {
      encouragement:
        "You're in a strong position with your shadowing hours.",
      educational:
        "You have meaningful experience to discuss. Now focus on reflection - what surprised you? What excited you? These insights make compelling essays.",
    };
  }

  return {
    encouragement:
      "Excellent! Your shadowing experience is a real strength.",
    educational:
      "You have rich material for your application. Make sure you can articulate specific cases, lessons learned, and why these experiences confirmed your career choice.",
  };
}

/**
 * Get certification context based on certs array
 */
export function getCertificationContext(certifications = []) {
  const hasCcrn = certifications.includes('CCRN');
  const certCount = certifications.length;

  if (certCount === 0) {
    return {
      encouragement:
        "No problem - we'll help you plan which certifications to pursue.",
      educational:
        "CCRN is the gold standard certification for ICU nurses. Most programs require or strongly prefer it. Having CCRN tells admissions you're serious and competent.",
    };
  }

  if (hasCcrn) {
    if (certCount === 1) {
      return {
        encouragement: "CCRN verified! This opens doors to almost every program.",
        educational:
          "You've checked the most important box. Additional certifications (CSC, CMC, TNCC) aren't required but show dedication and breadth of knowledge.",
      };
    }
    return {
      encouragement: `CCRN plus ${certCount - 1} more - you're demonstrating strong commitment.`,
      educational:
        "Your certifications show ongoing professional development. This dedication stands out to admissions committees looking for motivated candidates.",
    };
  }

  return {
    encouragement: `${certCount} certification${certCount > 1 ? 's' : ''} logged. CCRN is the most important one to prioritize.`,
    educational:
      "While your current certifications are valuable, CCRN is the gold standard most programs expect. We recommend making CCRN your next goal.",
  };
}

/**
 * Get GRE context based on status and scores
 */
export function getGreContext(status, scores = {}) {
  if (status === 'taken') {
    const { quantitative, verbal, writing } = scores;
    const hasScores = quantitative || verbal || writing;

    if (hasScores) {
      return {
        encouragement: "GRE complete - one less thing to worry about.",
        educational:
          "Your GRE scores are in. Most programs have minimum requirements around 150 verbal, 150 quantitative, and 4.0 writing. We'll show which programs match your scores.",
      };
    }
    return {
      encouragement: "Great - you've completed the GRE.",
      educational:
        "Add your scores when you have them. This helps us identify programs that match your profile.",
    };
  }

  if (status === 'planning') {
    return {
      encouragement: "Good to plan ahead. The GRE takes time to prepare for.",
      educational:
        "Give yourself 2-3 months to prepare. Focus on the analytical writing section - many CRNA applicants find it the trickiest part.",
    };
  }

  // looking_for_no_gre
  return {
    encouragement: "Many programs don't require the GRE, or waive it if you meet certain requirements (like GPA or experience).",
    educational:
      "We'll help you filter for programs that don't require GRE or offer waivers. This can save you time and stress without limiting your options too much.",
  };
}

/**
 * Get help needed context (for summary/coaching)
 */
export function getHelpNeededContext(helpNeeded = []) {
  if (helpNeeded.length === 0) {
    return null;
  }

  const focusAreas = {
    essay: "We'll guide you through crafting a compelling personal statement that stands out.",
    resume: "Your resume builder will help highlight your most impressive accomplishments.",
    interview_prep: "Mock interview practice and tips will build your confidence.",
    lor: "Our LOR tracker helps you manage requests and deadlines.",
    logistics: "We'll help you stay organized with checklists and deadline reminders.",
    other: "Explore our resources - there's help available for every part of the journey.",
  };

  const selectedHelp = helpNeeded
    .map((area) => focusAreas[area])
    .filter(Boolean)
    .slice(0, 2); // Show max 2 for brevity

  return {
    educational: selectedHelp.join(' '),
  };
}

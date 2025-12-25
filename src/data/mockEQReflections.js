/**
 * Mock EQ/Leadership Tracker Data
 *
 * EQ (Emotional Intelligence) tracking helps applicants document
 * leadership experiences and soft skills for interview prep.
 *
 * TODO: Replace with API call to Supabase
 */

// EQ Categories with labels, icons, and colors
// Sunshine yellow theme - various shades of yellow/amber
export const EQ_CATEGORIES = [
  {
    value: 'conflict_resolution',
    label: 'Conflict Resolution',
    icon: 'Scale',
    color: 'bg-[#FFF8DC] text-[#8B6914]',
    description: 'Handling disagreements professionally',
  },
  {
    value: 'team_communication',
    label: 'Team Communication',
    icon: 'Users',
    color: 'bg-[#FFFACD] text-[#7A5500]',
    description: 'Collaborating and communicating effectively',
  },
  {
    value: 'stress_management',
    label: 'Stress Management',
    icon: 'Heart',
    color: 'bg-[#FFF5BA] text-[#856600]',
    description: 'Staying calm under pressure',
  },
  {
    value: 'empathy_compassion',
    label: 'Empathy & Compassion',
    icon: 'HeartHandshake',
    color: 'bg-[#FFECB0] text-[#7D5800]',
    description: 'Connecting with patients and families',
  },
  {
    value: 'adaptability',
    label: 'Adaptability',
    icon: 'RefreshCw',
    color: 'bg-[#FFE896] text-[#785200]',
    description: 'Adjusting to change and unexpected situations',
  },
  {
    value: 'leadership',
    label: 'Leadership',
    icon: 'Crown',
    color: 'bg-[#FFE055] text-[#704D00]',
    description: 'Taking initiative and guiding others',
  },
  {
    value: 'self_reflection',
    label: 'Self-Reflection',
    icon: 'Brain',
    color: 'bg-[#FFF2B8] text-[#7A5500]',
    description: 'Understanding your own growth',
  },
  {
    value: 'cultural_competency',
    label: 'Cultural Competency',
    icon: 'Globe',
    color: 'bg-[#FFEFAA] text-[#805A00]',
    description: 'Working with diverse populations',
  },
  {
    value: 'resilience',
    label: 'Resilience',
    icon: 'Shield',
    color: 'bg-[#FFEAA0] text-[#755000]',
    description: 'Bouncing back from setbacks',
  },
  {
    value: 'ethics',
    label: 'Ethics & Integrity',
    icon: 'BadgeCheck',
    color: 'bg-[#FFF6D5] text-[#6D4800]',
    description: 'Making principled decisions',
  },
];

// Reflection prompts to inspire entries
export const REFLECTION_PROMPTS = [
  {
    id: 'prompt_1',
    category: 'conflict_resolution',
    title: 'Navigating Disagreement',
    prompt: 'Think about a recent disagreement with a colleague or physician. How did you handle it? What was the outcome?',
    followUp: 'What would you do differently next time?',
  },
  {
    id: 'prompt_2',
    category: 'team_communication',
    title: 'Difficult Conversation',
    prompt: 'Describe a time you had to deliver difficult news to a patient or family. How did you approach it?',
    followUp: 'How did you support them emotionally?',
  },
  {
    id: 'prompt_3',
    category: 'stress_management',
    title: 'High-Pressure Moment',
    prompt: 'Recall your most stressful shift recently. What happened and what coping strategies helped you stay focused?',
    followUp: 'How do you decompress after a difficult shift?',
  },
  {
    id: 'prompt_4',
    category: 'leadership',
    title: 'Stepping Up',
    prompt: 'When did you step up to lead or mentor someone this week? What did you teach or demonstrate?',
    followUp: 'How did it feel to be in that role?',
  },
  {
    id: 'prompt_5',
    category: 'empathy_compassion',
    title: 'Deep Connection',
    prompt: 'Describe a moment you connected deeply with a patient. What made it meaningful?',
    followUp: 'How did this experience affect your nursing practice?',
  },
  {
    id: 'prompt_6',
    category: 'adaptability',
    title: 'Plans Changed',
    prompt: 'Tell about a time your plan changed suddenly (patient decompensated, emergency admission, etc.). How did you adapt?',
    followUp: 'What skills helped you pivot quickly?',
  },
  {
    id: 'prompt_7',
    category: 'resilience',
    title: 'Bouncing Back',
    prompt: 'Think about a setback or mistake you made. How did you recover and what did you learn?',
    followUp: 'How has this made you a better nurse?',
  },
  {
    id: 'prompt_8',
    category: 'cultural_competency',
    title: 'Bridging Differences',
    prompt: 'Describe caring for a patient from a different cultural background. How did you adapt your approach?',
    followUp: 'What did you learn about providing culturally sensitive care?',
  },
  {
    id: 'prompt_9',
    category: 'ethics',
    title: 'Ethical Dilemma',
    prompt: 'Share a situation where you faced an ethical challenge. How did you navigate it?',
    followUp: 'What principles guided your decision?',
  },
  {
    id: 'prompt_10',
    category: 'self_reflection',
    title: 'Growth Moment',
    prompt: 'What moment this week challenged you to grow as a nurse and as a person?',
    followUp: 'How will this shape your practice going forward?',
  },
];

// Sample EQ entries (mock data)
export const mockEQReflections = [
  {
    id: 'eq_1',
    userId: 'user_123',
    date: '2025-11-28',
    title: 'Advocating for my septic patient',
    categories: ['leadership', 'team_communication'],
    structuredReflection: {
      situation: 'My septic patient was deteriorating and the resident wanted to wait for labs before escalating. I knew from experience this patient needed immediate intervention.',
      emotions: 'I felt anxious but confident in my assessment. There was tension because I had to push back respectfully.',
      response: 'I used SBAR to clearly communicate my concerns to the attending, emphasizing the clinical signs I was seeing beyond the lab values.',
      different: 'I might have involved the charge nurse earlier to add weight to my concerns.',
      learned: 'Trusting my clinical instincts and advocating firmly but professionally leads to better patient outcomes. The attending later thanked me for escalating.',
    },
    tags: ['patient advocacy', 'sepsis', 'escalation'],
  },
  {
    id: 'eq_2',
    userId: 'user_123',
    date: '2025-11-25',
    title: 'Supporting a new grad through her first code',
    categories: ['leadership', 'empathy_compassion', 'stress_management'],
    structuredReflection: {
      situation: 'A new grad was assigned to a patient who coded. She froze and looked terrified. I jumped in to help while keeping her involved.',
      emotions: 'I felt protective of her and wanted to make this a learning moment, not a traumatic one. Also felt the weight of the situation.',
      response: 'I gave her specific, simple tasks during the code ("You compress, I\'ll manage the airway"). Afterward, I debriefed with her privately.',
      different: 'I should have checked on her again before end of shift. She seemed okay but probably needed more processing time.',
      learned: 'Being a calm presence helps others stay calm. Teaching in crisis moments is possible if you break things into small steps.',
    },
    tags: ['mentoring', 'code blue', 'new grad support'],
  },
  {
    id: 'eq_3',
    userId: 'user_123',
    date: '2025-11-20',
    title: 'Conflict with night shift about documentation',
    categories: ['conflict_resolution', 'team_communication'],
    structuredReflection: {
      situation: 'Night shift nurse left a passive-aggressive note about my charting. Instead of escalating, I asked to talk with her directly.',
      emotions: 'Initially defensive and annoyed. Then realized there might be a legitimate concern under the attitude.',
      response: 'I asked her to explain what specifically was missing. Turns out our unit has inconsistent expectations. We brought it to our manager to clarify.',
      different: 'I could have assumed positive intent from the start instead of taking it personally.',
      learned: 'Direct conversation beats back-and-forth notes. Most conflicts stem from unclear expectations, not malice.',
    },
    tags: ['conflict', 'documentation', 'shift handoff'],
  },
  {
    id: 'eq_4',
    userId: 'user_123',
    date: '2025-11-15',
    title: 'Delivering bad news to a family',
    categories: ['empathy_compassion', 'team_communication', 'resilience'],
    structuredReflection: {
      situation: 'Family arrived expecting discharge but their loved one had taken a turn. The physician asked me to prepare them before she came in.',
      emotions: 'Heavy. I felt the weight of their hope about to be crushed. Also felt honored they trusted me with this moment.',
      response: 'I sat down with them (not standing over them), made eye contact, and gently explained what had changed. I stayed present through their tears.',
      different: 'I wish I had tissues in my pocket. Small thing, but it mattered.',
      learned: 'Presence matters more than words. Just being there, not rushing, helps families process difficult news.',
    },
    tags: ['family communication', 'bad news', 'presence'],
  },
  {
    id: 'eq_5',
    userId: 'user_123',
    date: '2025-11-10',
    title: 'Adapting when our unit got slammed',
    categories: ['adaptability', 'stress_management', 'leadership'],
    structuredReflection: {
      situation: 'Three admissions in one hour, one nurse called out, and we had a rapid response. Complete chaos.',
      emotions: 'Overwhelmed at first, then shifted to problem-solving mode. Felt proud of how our team pulled together.',
      response: 'I helped triage which tasks were most urgent, delegated what I could to techs, and communicated constantly with the charge nurse.',
      different: 'Should have asked for help from the float pool sooner. I tried to handle too much myself initially.',
      learned: 'Flexibility and communication are everything in crisis. Also, asking for help is a strength, not a weakness.',
    },
    tags: ['crisis management', 'teamwork', 'flexibility'],
  },
  {
    id: 'eq_6',
    userId: 'user_123',
    date: '2025-11-08',
    title: 'Navigating cultural differences in end-of-life care',
    categories: ['cultural_competency', 'empathy_compassion', 'ethics'],
    structuredReflection: {
      situation: 'Patient\'s family wanted to continue aggressive treatment despite poor prognosis. Their cultural/religious beliefs conflicted with the medical team\'s recommendations.',
      emotions: 'Felt caught between wanting to honor their beliefs and seeing the patient suffer. Also felt frustrated that the team wasn\'t listening to their perspective.',
      response: 'I requested a family meeting with the palliative care team and chaplain. Advocated for the family to have their concerns truly heard, not just overruled.',
      different: 'Could have involved spiritual care earlier. Also should have asked the family directly about their beliefs instead of making assumptions.',
      learned: 'Cultural humility means listening more than speaking. The family just needed to feel heard and respected, even if the outcome was the same.',
    },
    tags: ['end-of-life', 'cultural humility', 'family-centered care'],
  },
  {
    id: 'eq_7',
    userId: 'user_123',
    date: '2025-11-05',
    title: 'Recovering from a medication near-miss',
    categories: ['resilience', 'self_reflection', 'ethics'],
    structuredReflection: {
      situation: 'Almost gave wrong dose of heparin - caught it at the last second during my second verification. The pharmacy label was confusing.',
      emotions: 'Shaken and embarrassed. My heart was racing. I kept replaying what could have happened.',
      response: 'I reported it through our near-miss system, took a 5-minute break to reset, and then talked with my preceptor about what happened.',
      different: 'I should have questioned the unusual dose earlier in my verification process, not trusted that pharmacy "got it right."',
      learned: 'Near-misses are gifts - they teach without harm. Being vulnerable about mistakes makes me a safer nurse. The system worked because I stayed vigilant.',
    },
    tags: ['patient safety', 'medication error', 'near-miss'],
  },
  {
    id: 'eq_8',
    userId: 'user_123',
    date: '2025-11-02',
    title: 'Stepping up as informal charge on a rough night',
    categories: ['leadership', 'adaptability', 'team_communication'],
    structuredReflection: {
      situation: 'Our charge nurse had a family emergency and had to leave mid-shift. I was asked to take over coordinating the unit for the remaining 8 hours.',
      emotions: 'Nervous but also energized. Felt the weight of responsibility but also proud that leadership trusted me.',
      response: 'I immediately touched base with each nurse to assess their patient loads, rearranged assignments for fairness, and kept open communication about admissions.',
      different: 'I got too caught up in administrative tasks and neglected my own patient checks. Need to balance coordination with direct care better.',
      learned: 'Leadership is about removing barriers for your team, not controlling everything. My colleagues stepped up because I asked for help openly.',
    },
    tags: ['charge nurse', 'leadership', 'crisis management'],
  },
  {
    id: 'eq_9',
    userId: 'user_123',
    date: '2025-10-28',
    title: 'Difficult conversation with a struggling colleague',
    categories: ['team_communication', 'empathy_compassion', 'conflict_resolution'],
    structuredReflection: {
      situation: 'A coworker has been making mistakes and seems overwhelmed. Others were complaining behind their back, but no one was helping them.',
      emotions: 'Torn between loyalty to my colleague and concern about patient safety. Also annoyed that others were gossiping instead of helping.',
      response: 'I asked them to grab coffee, listened without judgment, and learned they were going through a divorce. Helped them find EAP resources.',
      different: 'I waited too long to reach out. I noticed the signs weeks ago but avoided the awkwardness of asking if they were okay.',
      learned: 'Compassion for colleagues is part of patient safety. People make more mistakes when they\'re struggling. A simple "Are you okay?" can make a huge difference.',
    },
    tags: ['peer support', 'difficult conversations', 'empathy'],
  },
  {
    id: 'eq_10',
    userId: 'user_123',
    date: '2025-10-22',
    title: 'Managing my own burnout signals',
    categories: ['self_reflection', 'stress_management', 'resilience'],
    structuredReflection: {
      situation: 'Realized I\'d been snapping at colleagues and dreading every shift. Three consecutive weeks of overtime had caught up with me.',
      emotions: 'Exhausted, irritable, and guilty for not being the positive team member I usually am. Also scared that burnout would affect my CRNA goals.',
      response: 'I talked to my manager about reducing overtime, started saying no to extra shifts, and scheduled a therapy appointment for the first time.',
      different: 'Should have recognized the signs earlier. I kept pushing through instead of admitting I needed a break.',
      learned: 'Self-awareness is a skill that requires practice. I can\'t pour from an empty cup - taking care of myself IS taking care of my patients.',
    },
    tags: ['burnout', 'self-care', 'mental health'],
  },
];

// Helper function to get category info
export function getCategoryInfo(categoryValue) {
  return EQ_CATEGORIES.find((c) => c.value === categoryValue) || null;
}

// Helper to get random prompt for a category
export function getPromptForCategory(categoryValue) {
  const prompts = REFLECTION_PROMPTS.filter((p) => p.category === categoryValue);
  return prompts.length > 0 ? prompts[Math.floor(Math.random() * prompts.length)] : null;
}

// Helper to calculate stats
export function calculateEQStats(reflections) {
  const categoriesUsed = new Set();
  reflections.forEach((r) => r.categories.forEach((c) => categoriesUsed.add(c)));

  return {
    totalReflections: reflections.length,
    categoriesCovered: categoriesUsed.size,
    totalCategories: EQ_CATEGORIES.length,
    // Simple streak calculation (consecutive days with entries)
    currentStreak: calculateStreak(reflections),
  };
}

// Helper to calculate streak
function calculateStreak(reflections) {
  if (reflections.length === 0) return 0;

  const sortedDates = reflections
    .map((r) => new Date(r.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  const uniqueDates = [...new Set(sortedDates)];
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // If most recent entry isn't today or yesterday, streak is 0
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = (current - prev) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default mockEQReflections;

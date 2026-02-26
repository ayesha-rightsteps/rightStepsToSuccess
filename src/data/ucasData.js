// UCAS Tariff Points — Official 2024/25 values
export const A_LEVEL_POINTS = {
  'A*': 56,
  'A': 48,
  'B': 40,
  'C': 32,
  'D': 24,
  'E': 16,
}

export const AS_LEVEL_POINTS = {
  'A': 20,
  'B': 16,
  'C': 12,
  'D': 10,
  'E': 6,
}

export const BTEC_POINTS = {
  'D* D* D*': 168,
  'D* D* D': 160,
  'D* D D': 152,
  'D D D': 144,
  'D D M': 128,
  'D M M': 112,
  'M M M': 96,
  'M M P': 80,
  'M P P': 64,
  'P P P': 48,
}

export const EPQ_POINTS = {
  'A*': 28,
  'A': 24,
  'B': 20,
  'C': 16,
  'D': 12,
  'E': 8,
}

export const UNIVERSITY_TIERS = [
  {
    range: [168, 999],
    label: 'Russell Group (Top 24)',
    description: 'Oxford, Cambridge, Imperial, UCL, LSE, Edinburgh — the most selective universities.',
    examples: ['Oxford', 'Cambridge', 'Imperial College', 'UCL', 'Edinburgh'],
    color: '#0B2545',
    icon: '🎓',
  },
  {
    range: [128, 167],
    label: 'Leading Universities',
    description: 'Highly regarded institutions with excellent graduate outcomes across most subjects.',
    examples: ['Exeter', 'Bath', 'York', 'Lancaster', 'Leicester'],
    color: '#1E52C8',
    icon: '🏛️',
  },
  {
    range: [96, 127],
    label: 'Good Universities',
    description: 'Strong programmes with good teaching quality and student satisfaction scores.',
    examples: ['Coventry', 'Kingston', 'Northumbria', 'Plymouth', 'Derby'],
    color: '#059669',
    icon: '📚',
  },
  {
    range: [64, 95],
    label: 'University or College Entry',
    description: 'Many universities and further education colleges have flexible entry requirements.',
    examples: ['Further Education Colleges', 'Foundation Year routes', 'Higher National qualifications'],
    color: '#C4892A',
    icon: '📖',
  },
  {
    range: [0, 63],
    label: 'Foundation or Apprenticeship Route',
    description: 'A foundation year or degree apprenticeship may be the ideal next step.',
    examples: ['Foundation Year programmes', 'Degree Apprenticeships', 'Higher National Certificate (HNC)'],
    color: '#64748B',
    icon: '🔧',
  },
]

export const A_LEVEL_SUBJECTS = [
  'Mathematics', 'Further Mathematics', 'Biology', 'Chemistry', 'Physics',
  'English Literature', 'History', 'Geography', 'Computer Science',
  'Economics', 'Psychology', 'Sociology', 'Politics', 'Art & Design',
  'Design & Technology', 'Music', 'French', 'German', 'Spanish',
]

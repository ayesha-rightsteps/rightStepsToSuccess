// Day in the Life schedules for each career
export const DAY_IN_LIFE = {
  doctor: [
    { time: '07:30', activity: 'Ward round — visit patients, check overnight notes', icon: '🏥' },
    { time: '09:00', activity: 'Morning clinic — see 10–15 patients with varied conditions', icon: '👨‍⚕️' },
    { time: '11:30', activity: 'Review test results and update treatment plans', icon: '📋' },
    { time: '13:00', activity: 'Lunch break + catch-up with colleagues', icon: '🍽️' },
    { time: '14:00', activity: 'Afternoon clinic or surgical procedures', icon: '🔬' },
    { time: '16:30', activity: 'Admin — letters, referrals, prescriptions', icon: '💊' },
    { time: '18:00', activity: 'Handover to evening team, head home', icon: '🌙' },
  ],
  engineer: [
    { time: '08:30', activity: 'Morning standup — review project milestones with the team', icon: '📊' },
    { time: '09:15', activity: 'Site visit or structural design review meeting', icon: '🏗️' },
    { time: '11:00', activity: 'CAD modelling — refining bridge support calculations', icon: '💻' },
    { time: '13:00', activity: 'Lunch on-site with client and project manager', icon: '🍽️' },
    { time: '14:00', activity: 'Risk assessment and safety compliance review', icon: '⚠️' },
    { time: '16:00', activity: 'Report writing and presenting progress to stakeholders', icon: '📝' },
    { time: '17:30', activity: 'Plan tomorrow\'s priorities, close laptop', icon: '🌆' },
  ],
  developer: [
    { time: '09:00', activity: 'Stand-up meeting — 15 mins with the dev team', icon: '💬' },
    { time: '09:20', activity: 'Deep coding session — building a new app feature', icon: '⌨️' },
    { time: '12:30', activity: 'Lunch + browse tech articles or side projects', icon: '🍽️' },
    { time: '13:30', activity: 'Code review — feedback on teammate\'s pull request', icon: '🔍' },
    { time: '15:00', activity: 'Debugging — tracking down an elusive bug', icon: '🐛' },
    { time: '16:30', activity: 'Deploy code update to production environment', icon: '🚀' },
    { time: '17:30', activity: 'Log off — flexible working from home most days', icon: '🏠' },
  ],
  barrister: [
    { time: '07:00', activity: 'Read through case files and prepare arguments', icon: '📚' },
    { time: '09:30', activity: 'Conference with solicitor and client before court', icon: '🤝' },
    { time: '10:00', activity: 'Court hearing — present opening argument to the judge', icon: '⚖️' },
    { time: '13:00', activity: 'Lunch recess — brief client on how the morning went', icon: '🍽️' },
    { time: '14:00', activity: 'Cross-examination of opposing witnesses', icon: '💬' },
    { time: '16:30', activity: 'Court adjourns — review tomorrow\'s evidence', icon: '📋' },
    { time: '19:00', activity: 'Evening prep — research legal precedents for closing argument', icon: '🌙' },
  ],
  architect: [
    { time: '08:30', activity: 'Client meeting — present latest concept designs', icon: '🏛️' },
    { time: '10:00', activity: '3D modelling — refine floor plans in Revit software', icon: '💻' },
    { time: '12:00', activity: 'Site visit — check construction progress against drawings', icon: '🔨' },
    { time: '13:30', activity: 'Lunch + sketch ideas for upcoming competition entry', icon: '✏️' },
    { time: '14:30', activity: 'Planning application — prepare drawings for submission', icon: '📐' },
    { time: '16:30', activity: 'Team design critique — honest feedback on work in progress', icon: '🎨' },
    { time: '18:00', activity: 'Finish model rendering for tomorrow\'s client presentation', icon: '🌆' },
  ],
  datascientist: [
    { time: '09:00', activity: 'Pull data from company database using SQL', icon: '🗄️' },
    { time: '09:45', activity: 'Exploratory analysis — look for patterns in the dataset', icon: '📊' },
    { time: '11:30', activity: 'Team meeting — align on this week\'s model goals', icon: '💬' },
    { time: '13:00', activity: 'Lunch + listen to a data science podcast', icon: '🍽️' },
    { time: '14:00', activity: 'Train and evaluate a machine learning model', icon: '🤖' },
    { time: '16:00', activity: 'Build a dashboard to visualise results for leadership', icon: '📈' },
    { time: '17:30', activity: 'Document findings and push code to the team repo', icon: '📝' },
  ],
}

// Subject combination checker data
// Each career has required and helpful subjects
export const CAREER_REQUIREMENTS = {
  'Doctor': {
    color: '#1E52C8',
    emoji: '🩺',
    required: ['Biology', 'Chemistry'],
    helpful: ['Mathematics', 'Physics', 'Psychology'],
    description: 'Almost all UK medical schools require Biology and Chemistry at A-Level. A third science or Maths is strongly recommended.',
  },
  'Civil Engineer': {
    color: '#059669',
    emoji: '🏗️',
    required: ['Mathematics'],
    helpful: ['Physics', 'Further Mathematics', 'Design & Technology'],
    description: 'Mathematics is essential. Physics and Design & Technology greatly strengthen your application for engineering degrees.',
  },
  'Software Developer': {
    color: '#0891B2',
    emoji: '💻',
    required: ['Mathematics'],
    helpful: ['Computer Science', 'Further Mathematics', 'Physics'],
    description: 'Strong Maths is key. Computer Science A-Level is very relevant, though many successful developers study related STEM subjects.',
  },
  'Barrister / Solicitor': {
    color: '#7C3AED',
    emoji: '⚖️',
    required: [],
    helpful: ['English Literature', 'History', 'Politics', 'Philosophy'],
    description: 'Law is open to any A-Level combination. Universities value analytical writing — English, History, and Philosophy are ideal preparation.',
  },
  'Architect': {
    color: '#DC2626',
    emoji: '🏛️',
    required: ['Art & Design'],
    helpful: ['Mathematics', 'Physics', 'Design & Technology'],
    description: 'Most architecture schools require or strongly prefer Art & Design. Mathematics and Physics support the technical side of the degree.',
  },
  'Data Scientist': {
    color: '#C4892A',
    emoji: '📊',
    required: ['Mathematics'],
    helpful: ['Further Mathematics', 'Computer Science', 'Physics', 'Statistics'],
    description: 'Mathematics is essential, with Further Maths a major advantage. Computer Science and Statistics are highly relevant.',
  },
  'Journalist': {
    color: '#0B2545',
    emoji: '✍️',
    required: [],
    helpful: ['English Literature', 'History', 'Politics', 'Media Studies'],
    description: 'Journalism is open-entry. Strong writing ability is key — English Literature and History build excellent analytical communication skills.',
  },
  'Teacher': {
    color: '#C4892A',
    emoji: '📚',
    required: [],
    helpful: ['English Literature', 'Mathematics', 'History', 'Biology', 'Psychology'],
    description: 'For a PGCE teacher training, you need a degree in your chosen subject area. Choose subjects you are passionate about.',
  },
}

export const ALL_SUBJECTS = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Further Mathematics',
  'Computer Science', 'English Literature', 'History', 'Geography', 'Psychology',
  'Art & Design', 'Design & Technology', 'Politics', 'Philosophy', 'Economics',
  'French', 'German', 'Spanish', 'Music', 'Media Studies', 'Statistics',
]

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const PATHWAYS = {
  doctor: {
    title: 'Becoming a Doctor',
    subtitle: 'A complete roadmap from home education to an NHS career',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    totalYears: '10–14 years',
    steps: [
      {
        id: 1,
        stage: 'GCSEs',
        ageRange: 'Age 14–16',
        accentColor: '#1E52C8',
        summary: 'Build your scientific foundation',
        childSummary: 'This is where you start learning the big stuff — science, maths, and more!',
        required: [
          'Biology — Grade 7 or above',
          'Chemistry — Grade 7 or above',
          'Mathematics — Grade 7 or above',
          'English Language — Grade 5 or above',
        ],
        childRequired: [
          'Biology — you\'ll learn about the human body 🫀',
          'Chemistry — mixing elements and reactions 🔬',
          'Maths — solving problems with numbers 📐',
          'English — to communicate with patients clearly 💬',
        ],
        insight: 'Most UK medical schools require at least 9 GCSEs with strong grades in the sciences and maths. As a home educator, your child can sit IGCSEs through registered examination centres.',
        childInsight: 'These GCSEs are like collecting stars — the more you get, the more medical schools will want you! Ask a parent to help you find local exam centres.',
        resources: [
          { type: 'book', label: 'GCSE Biology by Edexcel', url: 'https://www.amazon.co.uk' },
          { type: 'web', label: 'Khan Academy — Biology', url: 'https://www.khanacademy.org/science/biology' },
          { type: 'video', label: 'BBC Bitesize — GCSE Science', url: 'https://www.bbc.co.uk/bitesize/levels/z98jmp3' },
        ],
        duration: '2 years',
      },
      {
        id: 2,
        stage: 'A-Levels',
        ageRange: 'Age 16–18',
        accentColor: '#C4892A',
        summary: 'Specialist study in the sciences',
        childSummary: 'Now you go really deep into science — this is where it gets exciting!',
        required: [
          'Biology — required by all medical schools',
          'Chemistry — required by all medical schools',
          'Mathematics or Physics — strongly recommended',
        ],
        childRequired: [
          'Biology — dive deep into cells, genetics, and physiology 🧬',
          'Chemistry — molecules, reactions, and organic chemistry 🧪',
          'Maths or Physics — shows you\'re analytical and precise 🧮',
        ],
        insight: 'Target grades of AAA or A*AA. Home-educated students can sit A-Levels as private candidates through approved examination centres. Online providers such as Oxford Home Schooling offer full A-Level programmes.',
        childInsight: 'You\'re aiming for really high grades — AAA or even A*AA. It sounds tough but with great revision habits you can absolutely do it. Lots of online schools can help you!',
        resources: [
          { type: 'book', label: 'A-Level Biology by CGP', url: 'https://www.cgpbooks.co.uk' },
          { type: 'web', label: 'Oxford Home Schooling', url: 'https://www.oxfordhomeschooling.co.uk' },
          { type: 'video', label: 'Cognito — A-Level Biology', url: 'https://www.youtube.com/@Cognito' },
        ],
        duration: '2 years',
      },
      {
        id: 3,
        stage: 'Medical School Preparation',
        ageRange: 'Age 17–18',
        accentColor: '#059669',
        summary: 'UCAT, work experience & UCAS application',
        childSummary: 'Getting ready to apply — exciting! Time to show what you\'re made of.',
        required: [
          'UCAT aptitude test — required by most UK medical schools',
          'Minimum 100 hours of clinical work experience',
          'Strong personal statement demonstrating commitment',
          'Interview preparation — panel and MMI formats',
        ],
        childRequired: [
          'UCAT test — a special exam to show you can think like a doctor 🧠',
          '100 hours of helping in hospitals or care homes 🏥',
          'A personal statement about why you want to be a doctor ✍️',
          'Practice interviews — being confident and clear 🎤',
        ],
        insight: 'Start arranging work experience early — GP shadowing, hospital volunteering, and care home placements all strengthen your application significantly.',
        childInsight: 'Start volunteering as early as you can! Helping in a care home or shadowing a doctor shows that you truly care about people — and it\'s really rewarding.',
        resources: [
          { type: 'web', label: 'UCAT Practice — Official Site', url: 'https://www.ucat.ac.uk' },
          { type: 'web', label: 'Medic Mind — Work Experience Guide', url: 'https://www.medicmind.co.uk' },
          { type: 'video', label: 'Doctor Mike — Medicine Interview Tips', url: 'https://www.youtube.com/@DoctorMike' },
        ],
        duration: '6–12 months',
      },
      {
        id: 4,
        stage: 'Medical Degree',
        ageRange: 'Age 18–23',
        accentColor: '#7C3AED',
        summary: 'MBBS or MBChB at a UK university',
        childSummary: 'You\'re at university training to be a real doctor — amazing!',
        required: [
          'Pre-clinical sciences — Years 1 and 2',
          'Clinical placement rotations — Years 3 to 5',
          'Optional intercalated BSc — Year 4',
          'Final OSCE and written examinations',
        ],
        childRequired: [
          'Learning body systems in lectures and labs 🔬',
          'Going into hospitals and meeting real patients 🤝',
          'Practising examinations and procedures 💉',
          'Big exams at the end — you can do it! 🎓',
        ],
        insight: 'The UK has 34 medical schools. Most courses are 5 years. Top universities include Oxford, Cambridge, Imperial College London, UCL, and Edinburgh.',
        childInsight: 'You get to go to university for 5 years and actually treat patients! By the end you\'ll be a qualified doctor — one of the most respected jobs in the world.',
        resources: [
          { type: 'web', label: 'UCAS — Medical School Guide', url: 'https://www.ucas.com/undergraduate/what-and-where-study/university-subjects/medicine' },
          { type: 'book', label: 'How to Get into Medical School by Kass Hussain', url: 'https://www.amazon.co.uk' },
          { type: 'video', label: 'Aorta YouTube — Medical School Life', url: 'https://www.youtube.com' },
        ],
        duration: '5–6 years',
      },
      {
        id: 5,
        stage: 'Foundation Programme',
        ageRange: 'Age 23–25',
        accentColor: '#0891B2',
        summary: 'First years as a qualified doctor',
        childSummary: 'You\'re officially a doctor now — working in a real hospital! 🎉',
        required: [
          'Foundation Year 1 (FY1) — provisionally GMC registered',
          'Foundation Year 2 (FY2) — fully GMC registered',
          'E-portfolio and workplace-based assessments',
          'Rotations across at least 3 different specialties',
        ],
        childRequired: [
          'Working in a hospital ward and looking after patients 🏥',
          'Rotating through different departments — A&E, surgery, GP 🔄',
          'Building your portfolio of experience 📂',
          'Getting full registration with the GMC ✅',
        ],
        insight: 'Foundation training is allocated through a national application system. You will rotate across hospital departments building core clinical skills.',
        childInsight: 'This is when you really become a doctor! You\'ll work in different parts of the hospital and find out which area you love the most.',
        resources: [
          { type: 'web', label: 'NHS Foundation Programme', url: 'https://www.foundationprogramme.nhs.uk' },
          { type: 'web', label: 'GMC Registration Guide', url: 'https://www.gmc-uk.org' },
        ],
        duration: '2 years',
      },
      {
        id: 6,
        stage: 'Specialty Training',
        ageRange: 'Age 25–33',
        accentColor: '#DC2626',
        summary: 'Core and higher specialty training',
        childSummary: 'Choosing your special area — surgeon, GP, paediatrician? Your choice!',
        required: [
          'Core specialty training — 2 to 3 years',
          'Higher specialty training — 3 to 6 years',
          'Royal College membership examinations',
          'Annual Review of Competency Progression (ARCP)',
        ],
        childRequired: [
          'Training in your chosen specialist area 🫀',
          'Taking Royal College exams to prove your expertise 📚',
          'Supervising junior doctors and teaching others 👩‍⚕️',
          'Building towards becoming a consultant or GP ⭐',
        ],
        insight: 'Training length varies significantly by specialty. GP training is 3 years post-foundation — the fastest route to becoming a fully qualified doctor.',
        childInsight: 'This is when you decide what KIND of doctor you want to be! GP, surgeon, psychiatrist — there are so many amazing options to choose from.',
        resources: [
          { type: 'web', label: 'NHS Specialty Training', url: 'https://www.healthcareers.nhs.uk/explore-roles/doctors/career-opportunities-doctors/specialty-training' },
          { type: 'web', label: 'Royal College of Physicians', url: 'https://www.rcplondon.ac.uk' },
        ],
        duration: '5–8 years',
      },
      {
        id: 7,
        stage: 'Consultant or GP',
        ageRange: 'Age 30+',
        accentColor: '#0B2545',
        summary: 'Fully qualified specialist practitioner',
        childSummary: 'You did it! You\'re a fully qualified doctor changing people\'s lives! 🌟',
        required: [
          'Lead and supervise clinical teams',
          'Continuing Medical Education (CME)',
          'Optional: teaching, research, management roles',
          'NHS, private practice, or international opportunities',
        ],
        childRequired: [
          'Leading your own team of doctors and nurses 👑',
          'Treating patients with your specialist skills 💪',
          'Teaching the next generation of doctors 👨‍🏫',
          'Making a real difference to people\'s lives every day ❤️',
        ],
        insight: 'You have completed one of the most rigorous educational journeys in the world. Options now include NHS practice, private medicine, academic research, global health, or medical leadership roles.',
        childInsight: 'You\'ve done it! You\'ve completed one of the hardest but most rewarding journeys possible. Now you get to help people every day and inspire future doctors too!',
        resources: [
          { type: 'web', label: 'NHS Medical Careers', url: 'https://www.nhscareers.nhs.uk' },
          { type: 'web', label: 'BMA — British Medical Association', url: 'https://www.bma.org.uk' },
        ],
        duration: 'Career',
      },
    ],
  },
  maths: {
    title: 'Exceptional at Maths?',
    subtitle: 'Discover the career pathways that reward mathematical talent',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    totalYears: '6–8 years to career',
    steps: [
      {
        id: 1,
        stage: 'GCSEs',
        ageRange: 'Age 14–16',
        accentColor: '#1E52C8',
        summary: 'Excel in mathematics',
        childSummary: 'This is where your love of numbers really starts to shine! 🌟',
        required: [
          'Mathematics — target Grade 8 or 9',
          'Further Mathematics GCSE — if available, highly recommended',
          'Physics or Statistics — complements maths well',
          'English Language — Grade 5 minimum for most universities',
        ],
        childRequired: [
          'Maths — aim for a 9, you can do it! 🏆',
          'Further Maths — extra challenge for number lovers 🔢',
          'Physics — the universe runs on maths 🪐',
          'English — even mathematicians need to communicate clearly ✍️',
        ],
        insight: 'A Grade 9 in GCSE Maths signals exceptional ability. Consider entering national competitions such as the UK Junior Mathematical Challenge.',
        childInsight: 'Getting a 9 in maths is amazing and really stands out. Plus you can enter maths competitions — they\'re actually really fun and look great on applications!',
        resources: [
          { type: 'web', label: 'UK Junior Maths Challenge', url: 'https://www.ukmt.org.uk' },
          { type: 'web', label: 'Khan Academy — Maths', url: 'https://www.khanacademy.org/math' },
          { type: 'video', label: '3Blue1Brown — Visual Maths', url: 'https://www.youtube.com/@3blue1brown' },
        ],
        duration: '2 years',
      },
      {
        id: 2,
        stage: 'A-Levels',
        ageRange: 'Age 16–18',
        accentColor: '#C4892A',
        summary: 'Deepen mathematical thinking',
        childSummary: 'Maths gets really interesting at A-Level — patterns and proofs galore!',
        required: [
          'Mathematics A-Level — required for virtually all maths-based degrees',
          'Further Mathematics — opens the most selective university courses',
          'Physics or Computer Science — pair excellently with maths',
        ],
        childRequired: [
          'A-Level Maths — the foundation for everything 📐',
          'Further Maths — for the most selective unis like Cambridge 🎓',
          'Computer Science or Physics — amazing subjects to combine with maths 💻',
        ],
        insight: 'A-Level Further Mathematics is available through online providers for home educators including Pearson Edexcel and AQA via independent centres. It opens doors to Cambridge, Imperial, Warwick, and Oxford mathematics courses.',
        childInsight: 'Further Maths is like unlocking a secret level! It opens the doors to the very best universities and the most exciting careers. Online schools can teach it from home.',
        resources: [
          { type: 'web', label: 'Oxford Home Schooling — Further Maths', url: 'https://www.oxfordhomeschooling.co.uk' },
          { type: 'video', label: 'Exam Solutions — A-Level Maths', url: 'https://www.youtube.com/@ExamSolutions_Maths' },
          { type: 'web', label: 'STEP Preparation — Cambridge', url: 'https://www.maths.cam.ac.uk/undergrad/admissions/step' },
        ],
        duration: '2 years',
      },
      {
        id: 3,
        stage: 'University Degree',
        ageRange: 'Age 18–21',
        accentColor: '#7C3AED',
        summary: 'Choose your mathematical direction',
        childSummary: 'University — where you get to specialise in what you love most!',
        required: [
          'BSc Mathematics — 3 years, broad foundation',
          'MMath — 4-year integrated masters, highest level',
          'BSc Computer Science — strong maths component',
          'BSc Economics or Finance — quantitative pathway',
        ],
        childRequired: [
          'BSc Maths — 3 years of amazing mathematical adventures 🧮',
          'MMath — 4 years for those who want the very top qualification 🎓',
          'Computer Science — combine code and maths 💻',
          'Economics — how maths explains the world 🌍',
        ],
        insight: 'Top UK universities for Mathematics: Cambridge, Oxford, Imperial College London, Warwick, UCL, and Bath. Mathematics degrees are among the most versatile.',
        childInsight: 'The best universities for Maths include Cambridge, Oxford, and Imperial — and with strong A-Levels you absolutely have a shot! A Maths degree opens EVERY door.',
        resources: [
          { type: 'web', label: 'UCAS — Maths Degrees', url: 'https://www.ucas.com' },
          { type: 'web', label: 'Warwick Maths — Why Study Maths?', url: 'https://warwick.ac.uk/fac/sci/maths' },
        ],
        duration: '3–4 years',
      },
      {
        id: 4,
        stage: 'Career Paths',
        ageRange: 'Age 21+',
        accentColor: '#059669',
        summary: 'Where mathematical talent leads',
        childSummary: 'So many amazing career options — and they all pay brilliantly! 💰',
        required: [
          'Data Science and Machine Learning — £40k–£90k starting',
          'Actuarial Science — professional exams alongside work',
          'Software Engineering — £35k–£120k+ depending on sector',
          'Quantitative Finance — investment banks, hedge funds',
          'Academic Research and Teaching — PhD pathway',
        ],
        childRequired: [
          'Data Scientist — help companies understand their data 📊',
          'Actuary — calculate risk for insurance and banks 🏦',
          'Software Engineer — build the apps of the future 📱',
          'Finance — work in the city making big decisions 💹',
          'Researcher or Teacher — share your love of maths ❤️',
        ],
        insight: 'Mathematics graduates are consistently among the highest earners across all degree subjects. Actuaries, data scientists, and quantitative analysts command starting salaries of £35,000 to £60,000 or more.',
        childInsight: 'Did you know Maths graduates earn some of the highest starting salaries of ANY degree? You could earn £40,000–£60,000 in your very first job after university!',
        resources: [
          { type: 'web', label: 'Institute of Actuaries — Careers', url: 'https://actuaries.org.uk' },
          { type: 'web', label: 'Prospects — Maths Graduate Jobs', url: 'https://www.prospects.ac.uk/careers-advice/what-can-i-do-with-my-degree/mathematics' },
          { type: 'video', label: 'TED — The Beauty of Data', url: 'https://www.ted.com' },
        ],
        duration: 'Ongoing',
      },
    ],
  },
}

const RESOURCE_ICONS = {
  book: { icon: '📚', label: 'Book', color: '#7C3AED' },
  web: { icon: '🌐', label: 'Website', color: '#1E52C8' },
  video: { icon: '▶️', label: 'Video', color: '#DC2626' },
}

function StepCard({ step, index, isLast, isChildView }) {
  const [open, setOpen] = useState(false)

  const summary = isChildView ? step.childSummary : step.summary
  const required = isChildView ? step.childRequired : step.required
  const insight = isChildView ? step.childInsight : step.insight

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-5 group"
    >
      {/* Timeline marker */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 48 }}>
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold z-10 relative shrink-0 border-4 border-white"
          style={{
            background: step.accentColor,
            boxShadow: open ? `0 0 0 4px ${step.accentColor}30` : '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'box-shadow 0.2s',
          }}
        >
          {step.id}
        </motion.button>
        {!isLast && (
          <div className="flex-1 w-0.5 mt-1" style={{ background: `${step.accentColor}40`, minHeight: 32 }} />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 pb-8">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left bg-white rounded-2xl p-5 transition-all duration-200"
          style={{
            boxShadow: open
              ? `0 0 0 2px ${step.accentColor}, 0 8px 32px rgba(0,0,0,0.1)`
              : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${step.accentColor}18`, color: step.accentColor }}
                >
                  {step.ageRange}
                </span>
                <span className="text-xs" style={{ color: '#94A3B8' }}>{step.duration}</span>
              </div>
              <h4 className="font-display text-xl font-semibold mb-1" style={{ color: '#0B2545' }}>
                {step.stage}
              </h4>
              <p className="text-sm" style={{ color: '#64748B' }}>{summary}</p>
            </div>
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: open ? step.accentColor : '#F0EDE6',
                color: open ? 'white' : '#64748B',
              }}
            >
              <svg className="w-4 h-4" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Expandable */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t" style={{ borderColor: '#F0EDE6' }}>
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    {/* Required */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>
                        {isChildView ? 'What you\'ll need ✏️' : 'What\'s required'}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        {required.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-2.5 text-sm"
                            style={{ color: '#1a2332' }}
                          >
                            <div
                              className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                              style={{ background: step.accentColor }}
                            />
                            {item}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Insight */}
                    <div
                      className="rounded-xl p-4"
                      style={{ background: `${step.accentColor}08`, border: `1px solid ${step.accentColor}20` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4" style={{ color: step.accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-semibold" style={{ color: step.accentColor }}>
                          {isChildView ? 'Helpful tip 💡' : 'Parent guidance'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                        {insight}
                      </p>
                    </div>
                  </div>

                  {/* Resource Library */}
                  {step.resources && step.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>
                        {isChildView ? 'Resources to explore 🎒' : 'Resource library'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.resources.map((r, ri) => {
                          const typeInfo = RESOURCE_ICONS[r.type] || RESOURCE_ICONS.web
                          return (
                            <a
                              key={ri}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 hover:shadow-sm"
                              style={{
                                background: `${typeInfo.color}10`,
                                color: typeInfo.color,
                                border: `1px solid ${typeInfo.color}25`,
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = `${typeInfo.color}20`)}
                              onMouseLeave={e => (e.currentTarget.style.background = `${typeInfo.color}10`)}
                            >
                              <span>{typeInfo.icon}</span>
                              {r.label}
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

export default function PathwaySection() {
  const [activeTab, setActiveTab] = useState('doctor')
  const [isChildView, setIsChildView] = useState(false)
  const pathway = PATHWAYS[activeTab]

  return (
    <section id="pathways" className="py-24 lg:py-32" style={{ background: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12" style={{ background: '#7C3AED' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#7C3AED' }}>
              Visual Pathways
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
                Step-by-Step Roadmaps
              </h2>
              <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: '1.75' }}>
                {isChildView
                  ? 'Click any step to find out what you\'ll be learning and doing — written just for you! 🌟'
                  : 'Every step your child needs to take, clearly laid out. Click any stage to expand full details and parent guidance.'
                }
              </p>
            </div>

            {/* Parent / Child toggle */}
            <div
              className="flex items-center gap-1.5 self-start sm:self-auto p-1.5 rounded-full shrink-0"
              style={{ background: '#F0EDE6' }}
            >
              <button
                onClick={() => setIsChildView(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: !isChildView ? '#0B2545' : 'transparent',
                  color: !isChildView ? 'white' : '#64748B',
                  boxShadow: !isChildView ? '0 2px 8px rgba(11,37,69,0.25)' : 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Parent View
              </button>
              <button
                onClick={() => setIsChildView(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: isChildView ? '#C4892A' : 'transparent',
                  color: isChildView ? 'white' : '#64748B',
                  boxShadow: isChildView ? '0 2px 8px rgba(196,137,42,0.3)' : 'none',
                }}
              >
                <span className="text-sm">⭐</span>
                Child View
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-10 p-1.5 rounded-2xl w-fit"
          style={{ background: '#F0EDE6' }}
        >
          {[
            { key: 'doctor', label: isChildView ? '🩺 Doctor' : 'Doctor Pathway' },
            { key: 'maths', label: isChildView ? '🧮 Maths' : 'Maths Pathway' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                color: activeTab === tab.key ? 'white' : '#64748B',
                background: activeTab === tab.key ? '#0B2545' : 'transparent',
                boxShadow: activeTab === tab.key ? '0 2px 12px rgba(11,37,69,0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Timeline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${isChildView}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {pathway.steps.map((step, i) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={i}
                  isLast={i === pathway.steps.length - 1}
                  isChildView={isChildView}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Sidebar summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-28"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <div className="relative h-48">
                <img
                  src={pathway.image}
                  alt={pathway.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,37,69,0.85) 0%, rgba(11,37,69,0.3) 100%)' }} />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="font-display text-2xl font-semibold leading-tight">{pathway.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{pathway.subtitle}</p>
                </div>
              </div>
              <div className="p-5 bg-white">
                {isChildView && (
                  <div
                    className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
                    style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
                  >
                    <span>⭐</span>
                    <span className="text-xs font-medium" style={{ color: '#C4892A' }}>
                      You&apos;re reading the Child View — language is written just for you!
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#F0EDE6' }}>
                  <span className="text-sm" style={{ color: '#64748B' }}>Total journey</span>
                  <span className="text-sm font-semibold" style={{ color: '#0B2545' }}>{pathway.totalYears}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: '#F0EDE6' }}>
                  <span className="text-sm" style={{ color: '#64748B' }}>Number of stages</span>
                  <span className="text-sm font-semibold" style={{ color: '#0B2545' }}>{pathway.steps.length} key milestones</span>
                </div>
                <div className="pt-4">
                  <p className="text-xs mb-3 font-medium tracking-widest uppercase" style={{ color: '#94A3B8' }}>Stage overview</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {pathway.steps.map((step) => (
                      <span
                        key={step.id}
                        className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
                        style={{ background: step.accentColor }}
                      >
                        {step.stage}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href="#ai-guide"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                >
                  {isChildView ? '🤖 Ask the AI Guide' : 'Ask our AI Guide'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

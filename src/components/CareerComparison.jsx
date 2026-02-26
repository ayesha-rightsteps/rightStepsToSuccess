import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const CAREERS = [
  {
    id: 'doctor',
    name: 'Doctor',
    emoji: '🩺',
    color: '#1E52C8',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
    salary: { entry: '£32,000', mid: '£58,000', senior: '£120,000+' },
    training: '10–14 years',
    workLifeBalance: 3,
    jobSecurity: 5,
    socialImpact: 5,
    creativity: 2,
    earning: 5,
    subjects: ['Biology', 'Chemistry', 'Maths'],
    route: 'A-Levels → Medical School (5yr) → Foundation Training (2yr) → Specialty Training (5–8yr)',
    pros: ['Extremely job secure', 'High earning potential', 'Enormous social impact', 'Globally transferable'],
    cons: ['Very long training pathway', 'High stress and responsibility', 'Work-life balance challenges'],
    apprenticeship: false,
    degreeLevel: 'MBBS / MBChB',
  },
  {
    id: 'engineer',
    name: 'Civil Engineer',
    emoji: '🏗️',
    color: '#059669',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
    salary: { entry: '£28,000', mid: '£45,000', senior: '£80,000+' },
    training: '4–6 years',
    workLifeBalance: 4,
    jobSecurity: 4,
    socialImpact: 4,
    creativity: 4,
    earning: 3,
    subjects: ['Maths', 'Physics', 'Design'],
    route: 'A-Levels → BEng/MEng (4yr) → Graduate Programme → Chartership (CEng)',
    pros: ['Visible tangible results', 'Good earning progression', 'Apprenticeship route available', 'Creative problem solving'],
    cons: ['Can involve irregular site hours', 'Chartership requires years of experience'],
    apprenticeship: true,
    degreeLevel: 'BEng / MEng',
  },
  {
    id: 'developer',
    name: 'Software Developer',
    emoji: '💻',
    color: '#0891B2',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    salary: { entry: '£30,000', mid: '£60,000', senior: '£120,000+' },
    training: '3–4 years',
    workLifeBalance: 5,
    jobSecurity: 5,
    socialImpact: 3,
    creativity: 4,
    earning: 5,
    subjects: ['Computing', 'Maths', 'Physics'],
    route: 'A-Levels/Bootcamp → BSc or Degree Apprenticeship → Junior → Senior → Tech Lead',
    pros: ['Remote working most roles', 'Fastest growing sector', 'High salaries globally', 'Multiple routes in'],
    cons: ['Rapidly changing technologies', 'Can be competitive to enter top firms'],
    apprenticeship: true,
    degreeLevel: 'BSc or Bootcamp',
  },
  {
    id: 'barrister',
    name: 'Barrister',
    emoji: '⚖️',
    color: '#7C3AED',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    salary: { entry: '£25,000', mid: '£60,000', senior: '£200,000+' },
    training: '5–7 years',
    workLifeBalance: 2,
    jobSecurity: 3,
    socialImpact: 4,
    creativity: 3,
    earning: 4,
    subjects: ['English', 'History', 'Philosophy'],
    route: 'A-Levels → LLB Law (3yr) → Bar Course (1yr) → Pupillage (1yr) → Tenancy',
    pros: ['Intellectually demanding', 'High earning ceiling at senior levels', 'Respected profession'],
    cons: ['Competitive to secure pupillage', 'Junior barristers earn little initially', 'Long irregular hours'],
    apprenticeship: false,
    degreeLevel: 'LLB + Bar Course',
  },
  {
    id: 'architect',
    name: 'Architect',
    emoji: '🏛️',
    color: '#DC2626',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80',
    salary: { entry: '£26,000', mid: '£42,000', senior: '£75,000+' },
    training: '7 years',
    workLifeBalance: 3,
    jobSecurity: 3,
    socialImpact: 4,
    creativity: 5,
    earning: 3,
    subjects: ['Art', 'Maths', 'Physics'],
    route: 'A-Levels → Part 1 BA (3yr) → Work Year → Part 2 MArch (2yr) → Part 3 RIBA',
    pros: ['Highly creative work', 'Visible long-lasting impact', 'Respected RIBA qualification', 'Varied project types'],
    cons: ['Longest training of any profession', 'Salary lags behind other professions'],
    apprenticeship: false,
    degreeLevel: 'BA + MArch',
  },
  {
    id: 'datascientist',
    name: 'Data Scientist',
    emoji: '📊',
    color: '#C4892A',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    salary: { entry: '£35,000', mid: '£65,000', senior: '£100,000+' },
    training: '3–5 years',
    workLifeBalance: 5,
    jobSecurity: 5,
    socialImpact: 3,
    creativity: 3,
    earning: 5,
    subjects: ['Maths', 'Statistics', 'Computing'],
    route: 'A-Levels → BSc Maths/Stats/CS → MSc (recommended) → Junior Data Scientist',
    pros: ['Extremely high demand', 'Work in any industry', 'Remote working common', 'Intellectually stimulating'],
    cons: ['MSc often needed for top roles', 'Competitive field'],
    apprenticeship: true,
    degreeLevel: 'BSc + MSc preferred',
  },
]

function StarBar({ value, max = 5, color }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-2 flex-1 rounded-full"
          style={{ background: i < value ? color : '#E2E8F0' }}
        />
      ))}
    </div>
  )
}

export default function CareerComparison() {
  const [careerA, setCareerA] = useState('doctor')
  const [careerB, setCareerB] = useState('developer')

  const a = CAREERS.find(c => c.id === careerA)
  const b = CAREERS.find(c => c.id === careerB)

  const metrics = [
    { label: 'Work-Life Balance', key: 'workLifeBalance' },
    { label: 'Job Security', key: 'jobSecurity' },
    { label: 'Social Impact', key: 'socialImpact' },
    { label: 'Creative Fulfilment', key: 'creativity' },
    { label: 'Earning Potential', key: 'earning' },
  ]

  return (
    <section className="py-24 lg:py-32" style={{ background: '#FAF9F7' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#DC2626' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#DC2626' }}>
              Career Comparison
            </span>
            <div className="h-px w-10" style={{ background: '#DC2626' }} />
          </div>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
            Compare Two Careers Side by Side
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B', lineHeight: '1.75' }}>
            Unsure between two paths? Compare salary, training time, work-life balance, and more at a glance.
          </p>
        </motion.div>

        {/* Career selectors */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {[{ career: a, setCareer: setCareerA }, { career: b, setCareer: setCareerB }].map(({ career, setCareer }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="relative rounded-2xl overflow-hidden mb-3" style={{ boxShadow: `0 4px 20px ${career.color}30` }}>
                <img src={career.image} alt={career.name} className="w-full h-32 object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${career.color}cc, transparent)` }} />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl">{career.emoji}</span>
                  <span className="font-display text-xl font-semibold text-white">{career.name}</span>
                </div>
              </div>
              <select
                value={career.id}
                onChange={e => setCareer(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl outline-none font-medium"
                style={{ background: 'white', border: `2px solid ${career.color}40`, color: '#0B2545', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                {CAREERS.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${careerA}-${careerB}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)' }}
          >
            {/* Salary section */}
            <div className="grid grid-cols-[1fr_auto_1fr] border-b" style={{ borderColor: '#F0EDE6' }}>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Salary</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Entry</span><span className="font-semibold" style={{ color: a.color }}>{a.salary.entry}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Mid</span><span className="font-semibold" style={{ color: a.color }}>{a.salary.mid}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Senior</span><span className="font-semibold" style={{ color: a.color }}>{a.salary.senior}</span></div>
                </div>
              </div>
              <div className="flex items-center justify-center px-4" style={{ background: '#FAF9F7' }}>
                <span className="text-xs font-bold" style={{ color: '#CBD5E1' }}>vs</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>Salary</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Entry</span><span className="font-semibold" style={{ color: b.color }}>{b.salary.entry}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Mid</span><span className="font-semibold" style={{ color: b.color }}>{b.salary.mid}</span></div>
                  <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Senior</span><span className="font-semibold" style={{ color: b.color }}>{b.salary.senior}</span></div>
                </div>
              </div>
            </div>

            {/* Training + Degree */}
            <div className="grid grid-cols-[1fr_auto_1fr] border-b" style={{ borderColor: '#F0EDE6' }}>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8' }}>Training Time</p>
                <p className="text-xl font-bold" style={{ color: a.color }}>{a.training}</p>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>{a.degreeLevel}</p>
                {a.apprenticeship && (
                  <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#059669' }}>
                    Apprenticeship available
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center px-4" style={{ background: '#FAF9F7' }}>
                <span className="text-xs font-bold" style={{ color: '#CBD5E1' }}>vs</span>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8' }}>Training Time</p>
                <p className="text-xl font-bold" style={{ color: b.color }}>{b.training}</p>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>{b.degreeLevel}</p>
                {b.apprenticeship && (
                  <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#DCFCE7', color: '#059669' }}>
                    Apprenticeship available
                  </span>
                )}
              </div>
            </div>

            {/* Metrics bars */}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#94A3B8' }}>Key Metrics</p>
              <div className="flex flex-col gap-5">
                {metrics.map(m => (
                  <div key={m.key} className="grid grid-cols-[1fr_120px_1fr] items-center gap-4">
                    <StarBar value={a[m.key]} color={a.color} />
                    <span className="text-xs text-center font-medium" style={{ color: '#64748B' }}>{m.label}</span>
                    <StarBar value={b[m.key]} color={b.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-2 border-t" style={{ borderColor: '#F0EDE6' }}>
              {[a, b].map((career) => (
                <div key={career.id} className="p-5" style={{ borderRight: career.id === a.id ? `1px solid #F0EDE6` : 'none' }}>
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#059669' }}>Advantages</p>
                    <div className="flex flex-col gap-1.5">
                      {career.pros.map(p => (
                        <div key={p} className="flex items-start gap-2 text-xs" style={{ color: '#374151' }}>
                          <span className="mt-0.5" style={{ color: '#059669' }}>✓</span> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#DC2626' }}>Considerations</p>
                    <div className="flex flex-col gap-1.5">
                      {career.cons.map(c => (
                        <div key={c} className="flex items-start gap-2 text-xs" style={{ color: '#374151' }}>
                          <span className="mt-0.5" style={{ color: '#DC2626' }}>–</span> {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subjects */}
            <div className="grid grid-cols-2 border-t" style={{ borderColor: '#F0EDE6', background: '#FAF9F7' }}>
              {[a, b].map((career) => (
                <div key={career.id} className="p-5" style={{ borderRight: career.id === a.id ? '1px solid #F0EDE6' : 'none' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8' }}>Key Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.subjects.map(s => (
                      <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${career.color}14`, color: career.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

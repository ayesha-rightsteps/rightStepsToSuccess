import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DAY_IN_LIFE } from '../data/careerData'

const careers = [
  {
    id: 1,
    name: 'Doctor',
    dayKey: 'doctor',
    category: 'Medicine',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
    degree: 'MBBS / MBChB',
    duration: '10–14 years training',
    salary: '£32k–£120k+',
    keySubjects: ['Biology', 'Chemistry', 'Maths'],
    accentColor: '#1E52C8',
  },
  {
    id: 2,
    name: 'Civil Engineer',
    dayKey: 'engineer',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    degree: 'BEng / MEng',
    duration: '4–6 years training',
    salary: '£28k–£80k+',
    keySubjects: ['Maths', 'Physics', 'Design'],
    accentColor: '#059669',
  },
  {
    id: 3,
    name: 'Software Developer',
    dayKey: 'developer',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    degree: 'BSc or Bootcamp',
    duration: '3–4 years',
    salary: '£30k–£120k+',
    keySubjects: ['Computing', 'Maths'],
    accentColor: '#0891B2',
  },
  {
    id: 4,
    name: 'Barrister / Solicitor',
    dayKey: 'barrister',
    category: 'Law',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    degree: 'LLB + Bar/LPC',
    duration: '5–7 years',
    salary: '£25k–£200k+',
    keySubjects: ['English', 'History', 'Philosophy'],
    accentColor: '#7C3AED',
  },
  {
    id: 5,
    name: 'Architect',
    dayKey: 'architect',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    degree: 'MArch (Part 1, 2, 3)',
    duration: '7 years',
    salary: '£26k–£75k+',
    keySubjects: ['Arts', 'Maths', 'Physics'],
    accentColor: '#DC2626',
  },
  {
    id: 6,
    name: 'Data Scientist',
    dayKey: 'datascientist',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    degree: 'BSc + MSc preferred',
    duration: '3–5 years',
    salary: '£35k–£100k+',
    keySubjects: ['Maths', 'Statistics', 'Computing'],
    accentColor: '#C4892A',
  },
]

function DayInLife({ dayKey, color }) {
  const schedule = DAY_IN_LIFE[dayKey] || []
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="px-5 pb-5 pt-1">
        <div
          className="rounded-xl p-4"
          style={{ background: `${color}08`, border: `1px solid ${color}20` }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color }}>
            A Typical Day
          </p>
          <div className="flex flex-col gap-2.5">
            {schedule.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-base shrink-0 leading-tight">{item.icon}</span>
                <div className="flex-1">
                  <span className="text-xs font-semibold tabular-nums mr-2" style={{ color }}>
                    {item.time}
                  </span>
                  <span className="text-xs" style={{ color: '#374151' }}>{item.activity}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CareerExplorer() {
  const [openDay, setOpenDay] = useState(null)

  return (
    <section id="careers" style={{ background: '#F0EDE6' }} className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-0 justify-between mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-12" style={{ background: '#1E52C8' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#1E52C8' }}>
                Explore by Career
              </span>
            </div>
            <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
              Know What They Want to Become?
            </h2>
            <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: '1.75' }}>
              Start with the destination, then work backwards. Tap &ldquo;A Day in the Life&rdquo; to help your child picture the real role.
            </p>
          </div>
          <a
            href="#pathways"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-md"
            style={{ borderColor: '#0B2545', color: '#0B2545' }}
          >
            View detailed roadmaps
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {careers.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={career.image}
                  alt={career.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                <span
                  className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full text-white"
                  style={{ background: career.accentColor }}
                >
                  {career.category}
                </span>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-display text-2xl font-semibold leading-none">{career.name}</h3>
                </div>
              </div>

              {/* Stats */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Degree', value: career.degree },
                    { label: 'Training', value: career.duration },
                    { label: 'Salary', value: career.salary },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-2.5 rounded-xl" style={{ background: '#FAF9F7' }}>
                      <div className="text-xs font-semibold mb-0.5 truncate" style={{ color: '#0B2545' }}>{stat.value}</div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Key subjects */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Key subjects:</span>
                  {career.keySubjects.map(sub => (
                    <span
                      key={sub}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ background: `${career.accentColor}18`, color: career.accentColor }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Day in the Life toggle */}
                <button
                  onClick={() => setOpenDay(openDay === career.id ? null : career.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-3"
                  style={{
                    background: openDay === career.id ? `${career.accentColor}14` : '#F8FAFC',
                    color: openDay === career.id ? career.accentColor : '#64748B',
                    border: `1px solid ${openDay === career.id ? career.accentColor + '30' : '#E2E8F0'}`,
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>☀️</span>
                    A Day in the Life
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300"
                    style={{ transform: openDay === career.id ? 'rotate(180deg)' : 'rotate(0)' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* CTA */}
                <a
                  href="#pathways"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group/btn"
                  style={{ background: `${career.accentColor}12`, color: career.accentColor }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${career.accentColor}22`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${career.accentColor}12`)}
                >
                  View full pathway
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Day in the Life expandable */}
              <AnimatePresence>
                {openDay === career.id && (
                  <DayInLife key={career.id} dayKey={career.dayKey} color={career.accentColor} />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

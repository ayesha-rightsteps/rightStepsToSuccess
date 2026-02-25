import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const subjects = [
  {
    id: 1,
    name: 'Mathematics',
    careers: 24,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    description: 'Engineering, Finance, Data Science, Actuarial',
    accentColor: '#1E52C8',
    icon: '∑',
    previewCareers: ['Data Scientist', 'Actuary', 'Software Engineer', 'Quantitative Analyst', 'Civil Engineer'],
  },
  {
    id: 2,
    name: 'Science',
    careers: 31,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80',
    description: 'Medicine, Research, Pharmaceuticals, Biotech',
    accentColor: '#059669',
    icon: '⚗',
    previewCareers: ['Doctor', 'Pharmacist', 'Biomedical Scientist', 'Researcher', 'Dentist'],
  },
  {
    id: 3,
    name: 'English',
    careers: 19,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
    description: 'Law, Journalism, Teaching, PR, Publishing',
    accentColor: '#7C3AED',
    icon: '✍',
    previewCareers: ['Barrister', 'Journalist', 'Teacher', 'Publisher', 'Public Relations'],
  },
  {
    id: 4,
    name: 'History',
    careers: 14,
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80',
    description: 'Law, Politics, Archaeology, Diplomacy',
    accentColor: '#C4892A',
    icon: '🏛',
    previewCareers: ['Solicitor', 'Diplomat', 'Archaeologist', 'Politician', 'Curator'],
  },
  {
    id: 5,
    name: 'Creative Arts',
    careers: 18,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80',
    description: 'Design, Architecture, Film, Animation, Media',
    accentColor: '#DC2626',
    icon: '◈',
    previewCareers: ['Architect', 'Graphic Designer', 'Film Director', 'UX Designer', 'Art Director'],
  },
  {
    id: 6,
    name: 'Computing',
    careers: 22,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    description: 'Software Dev, Cybersecurity, AI, Robotics',
    accentColor: '#0891B2',
    icon: '</>',
    previewCareers: ['Software Developer', 'Cybersecurity Analyst', 'AI Engineer', 'Product Manager', 'DevOps Engineer'],
  },
]

export default function SubjectExplorer() {
  const [selected, setSelected] = useState(null)

  const toggle = (id) => setSelected(prev => (prev === id ? null : id))

  return (
    <section id="subjects" className="py-24 lg:py-32" style={{ background: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12" style={{ background: '#C4892A' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C4892A' }}>
              Explore by Subject
            </span>
          </div>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
            What Does Your Child Love?
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: '1.75' }}>
            Every subject opens a different set of doors. Select a subject below to discover the career pathways waiting at the end.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subject, i) => (
            <motion.button
              key={subject.id}
              onClick={() => toggle(subject.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl text-left cursor-pointer"
              style={{
                boxShadow: selected === subject.id
                  ? `0 0 0 2px ${subject.accentColor}, 0 8px 32px rgba(0,0,0,0.12)`
                  : '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
                background: 'white',
              }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={subject.image}
                  alt={subject.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)` }}
                />
                <div
                  className="absolute top-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-mono font-bold"
                  style={{ background: subject.accentColor }}
                >
                  {subject.icon}
                </div>
                <div className="absolute bottom-3 right-3">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
                    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
                  >
                    {subject.careers} career paths
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold mb-1.5" style={{ color: '#0B2545' }}>
                  {subject.name}
                </h3>
                <p className="text-sm" style={{ color: '#64748B', lineHeight: '1.6' }}>
                  {subject.description}
                </p>

                <div
                  className="mt-4 flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
                  style={{ color: subject.accentColor }}
                >
                  {selected === subject.id ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      Hide careers
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      View career paths
                    </>
                  )}
                </div>
              </div>

              {/* Expandable preview */}
              <AnimatePresence>
                {selected === subject.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: '#F0EDE6' }}>
                      <p className="text-xs font-medium mb-3 tracking-wide uppercase" style={{ color: '#94A3B8' }}>
                        Top career paths
                      </p>
                      <div className="flex flex-col gap-2">
                        {subject.previewCareers.map((career, idx) => (
                          <motion.div
                            key={career}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="flex items-center gap-2.5 text-sm"
                            style={{ color: '#1a2332' }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: subject.accentColor }} />
                            {career}
                          </motion.div>
                        ))}
                      </div>
                      <a
                        href="#pathways"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white px-4 py-2 rounded-full"
                        style={{ background: subject.accentColor }}
                        onClick={e => e.stopPropagation()}
                      >
                        View full pathway
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

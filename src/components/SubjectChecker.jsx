import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CAREER_REQUIREMENTS, ALL_SUBJECTS } from '../data/careerData'

function AccessBadge({ level }) {
  const config = {
    full: { label: 'Great Match', color: '#059669', bg: '#DCFCE7', icon: '✓' },
    partial: { label: 'Possible', color: '#C4892A', bg: '#FEF3C7', icon: '~' },
    none: { label: 'Gap Exists', color: '#DC2626', bg: '#FEE2E2', icon: '✗' },
  }[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: config.bg, color: config.color }}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

function getAccessLevel(selected, career) {
  const req = CAREER_REQUIREMENTS[career]
  if (!req) return 'none'
  const hasAllRequired = req.required.every(s => selected.includes(s))
  const helpfulCount = req.helpful.filter(s => selected.includes(s)).length
  if (req.required.length === 0 && helpfulCount >= 1) return 'full'
  if (hasAllRequired && helpfulCount >= 1) return 'full'
  if (hasAllRequired && req.required.length > 0) return 'partial'
  if (helpfulCount >= 2) return 'partial'
  return 'none'
}

export default function SubjectChecker() {
  const [selected, setSelected] = useState([])

  const toggle = (subject) => {
    setSelected(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    )
  }

  const results = Object.keys(CAREER_REQUIREMENTS).map(career => ({
    career,
    level: getAccessLevel(selected, career),
    ...CAREER_REQUIREMENTS[career],
  })).sort((a, b) => {
    const order = { full: 0, partial: 1, none: 2 }
    return order[a.level] - order[b.level]
  })

  return (
    <section className="py-24 lg:py-32" style={{ background: '#FAF9F7' }}>
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
            <div className="h-px flex-1 max-w-12" style={{ background: '#059669' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#059669' }}>
              Subject Checker
            </span>
          </div>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
            Which Careers Do Your Subjects Unlock?
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: '1.75' }}>
            Select the subjects your child is studying or planning to take — and instantly see which careers become accessible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">

          {/* Left: Subject selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold" style={{ color: '#0B2545' }}>
                  Select Subjects
                  {selected.length > 0 && (
                    <span className="ml-2 text-sm font-normal px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', color: '#1E52C8' }}>
                      {selected.length} chosen
                    </span>
                  )}
                </h3>
                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    className="text-xs font-medium"
                    style={{ color: '#94A3B8' }}
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map(subject => (
                  <motion.button
                    key={subject}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggle(subject)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      background: selected.includes(subject) ? '#0B2545' : '#F0EDE6',
                      color: selected.includes(subject) ? 'white' : '#64748B',
                    }}
                  >
                    {selected.includes(subject) ? '✓ ' : ''}{subject}
                  </motion.button>
                ))}
              </div>

              {selected.length === 0 && (
                <p className="text-xs mt-4 text-center" style={{ color: '#94A3B8' }}>
                  Select one or more subjects to see career matches
                </p>
              )}
            </div>
          </motion.div>

          {/* Right: Career results */}
          <div>
            {selected.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: '#0B2545' }}>
                  Select subjects to get started
                </h3>
                <p className="text-sm" style={{ color: '#94A3B8' }}>
                  Your career matches will appear here
                </p>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {results.map((result, i) => (
                    <motion.div
                      key={result.career}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl p-5"
                      style={{
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
                        borderLeft: `4px solid ${result.color}`,
                        opacity: result.level === 'none' ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{result.emoji}</span>
                          <h4 className="font-semibold text-sm" style={{ color: '#0B2545' }}>{result.career}</h4>
                        </div>
                        <AccessBadge level={result.level} />
                      </div>

                      <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>
                        {result.description}
                      </p>

                      {result.required.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-xs" style={{ color: '#94A3B8' }}>Required:</span>
                          {result.required.map(s => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: selected.includes(s) ? '#DCFCE7' : '#FEE2E2',
                                color: selected.includes(s) ? '#059669' : '#DC2626',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {result.helpful.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs" style={{ color: '#94A3B8' }}>Helpful:</span>
                          {result.helpful.map(s => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: selected.includes(s) ? '#EFF6FF' : '#F8FAFC',
                                color: selected.includes(s) ? '#1E52C8' : '#94A3B8',
                                fontWeight: selected.includes(s) ? 600 : 400,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

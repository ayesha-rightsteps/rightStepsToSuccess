import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { A_LEVEL_POINTS, AS_LEVEL_POINTS, BTEC_POINTS, EPQ_POINTS, UNIVERSITY_TIERS, A_LEVEL_SUBJECTS } from '../data/ucasData'

const QUAL_TYPES = ['A-Level', 'AS-Level', 'EPQ', 'BTEC (National)']

function getPointsForRow(row) {
  if (row.type === 'A-Level') return A_LEVEL_POINTS[row.grade] || 0
  if (row.type === 'AS-Level') return AS_LEVEL_POINTS[row.grade] || 0
  if (row.type === 'EPQ') return EPQ_POINTS[row.grade] || 0
  if (row.type === 'BTEC (National)') return BTEC_POINTS[row.grade] || 0
  return 0
}

function getGradeOptions(type) {
  if (type === 'A-Level') return Object.keys(A_LEVEL_POINTS)
  if (type === 'AS-Level') return Object.keys(AS_LEVEL_POINTS)
  if (type === 'EPQ') return Object.keys(EPQ_POINTS)
  if (type === 'BTEC (National)') return Object.keys(BTEC_POINTS)
  return []
}

function getTier(total) {
  return UNIVERSITY_TIERS.find(t => total >= t.range[0] && total <= t.range[1])
}

let nextId = 1

export default function UCASCalculator() {
  const [rows, setRows] = useState([
    { id: nextId++, type: 'A-Level', subject: 'Mathematics', grade: 'A' },
    { id: nextId++, type: 'A-Level', subject: 'Biology', grade: 'B' },
    { id: nextId++, type: 'A-Level', subject: 'Chemistry', grade: 'B' },
  ])

  const addRow = () => {
    setRows(prev => [...prev, { id: nextId++, type: 'A-Level', subject: '', grade: 'B' }])
  }

  const removeRow = (id) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r
      const updated = { ...r, [field]: value }
      if (field === 'type') {
        const grades = getGradeOptions(value)
        updated.grade = grades[0] || ''
      }
      return updated
    }))
  }

  const total = rows.reduce((sum, row) => sum + getPointsForRow(row), 0)
  const tier = getTier(total)

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F0EDE6' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-12">

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
              UCAS Calculator
            </span>
          </div>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
            Calculate UCAS Tariff Points
          </h2>
          <p className="text-base max-w-xl" style={{ color: '#64748B', lineHeight: '1.75' }}>
            Enter your child&apos;s predicted or achieved grades to calculate UCAS points and see which universities become accessible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Left: Entry table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}>
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_140px_100px_40px] gap-3 px-5 py-3 border-b" style={{ borderColor: '#F0EDE6' }}>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Subject / Qualification</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Type</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8' }}>Grade</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-center" style={{ color: '#94A3B8' }}>Pts</span>
              </div>

              <AnimatePresence>
                {rows.map((row, i) => {
                  const points = getPointsForRow(row)
                  const grades = getGradeOptions(row.type)
                  return (
                    <motion.div
                      key={row.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-[1fr_140px_100px_40px] gap-3 px-5 py-3 border-b items-center"
                      style={{ borderColor: '#F0EDE6', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}
                    >
                      {/* Subject input */}
                      {row.type === 'A-Level' || row.type === 'AS-Level' ? (
                        <select
                          value={row.subject}
                          onChange={e => updateRow(row.id, 'subject', e.target.value)}
                          className="text-sm w-full rounded-lg px-2 py-1 outline-none"
                          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0B2545' }}
                        >
                          <option value="">Select subject</option>
                          {A_LEVEL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="text-sm font-medium" style={{ color: '#0B2545' }}>{row.type}</span>
                      )}

                      {/* Type */}
                      <select
                        value={row.type}
                        onChange={e => updateRow(row.id, 'type', e.target.value)}
                        className="text-sm w-full rounded-lg px-2 py-1 outline-none"
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0B2545' }}
                      >
                        {QUAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>

                      {/* Grade */}
                      <select
                        value={row.grade}
                        onChange={e => updateRow(row.id, 'grade', e.target.value)}
                        className="text-sm w-full rounded-lg px-2 py-1 outline-none"
                        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0B2545' }}
                      >
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>

                      {/* Points + delete */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold" style={{ color: points > 0 ? '#1E52C8' : '#94A3B8' }}>
                          {points}
                        </span>
                        {rows.length > 1 && (
                          <button
                            onClick={() => removeRow(row.id)}
                            className="text-xs"
                            style={{ color: '#CBD5E1' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Total row */}
              <div className="grid grid-cols-[1fr_140px_100px_40px] gap-3 px-5 py-4 items-center" style={{ background: '#0B2545' }}>
                <span className="text-sm font-semibold text-white col-span-3">Total UCAS Points</span>
                <span className="text-lg font-bold text-center" style={{ color: '#C4892A' }}>{total}</span>
              </div>
            </div>

            <button
              onClick={addRow}
              className="mt-4 flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-md"
              style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1E52C8' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add qualification
            </button>
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-28 flex flex-col gap-4"
          >
            {/* Score display */}
            {tier && (
              <motion.div
                key={tier.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-6 text-center"
                style={{ background: '#0B2545', boxShadow: '0 4px 24px rgba(11,37,69,0.25)' }}
              >
                <div className="text-4xl mb-3">{tier.icon}</div>
                <div className="text-5xl font-bold mb-1" style={{ color: '#C4892A' }}>{total}</div>
                <div className="text-xs text-white/50 mb-4">UCAS tariff points</div>
                <div
                  className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-3"
                  style={{ background: `${tier.color}30`, color: 'white', border: `1px solid ${tier.color}60` }}
                >
                  {tier.label}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {tier.description}
                </p>
              </motion.div>
            )}

            {/* University examples */}
            {tier && (
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>
                  Examples at this range
                </p>
                <div className="flex flex-wrap gap-2">
                  {tier.examples.map(uni => (
                    <span
                      key={uni}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: `${tier.color}12`, color: tier.color }}
                    >
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All tiers */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>
                All bands
              </p>
              <div className="flex flex-col gap-2">
                {UNIVERSITY_TIERS.map(t => (
                  <div
                    key={t.label}
                    className="flex items-center justify-between py-2 px-3 rounded-xl"
                    style={{
                      background: tier?.label === t.label ? `${t.color}12` : 'transparent',
                      border: tier?.label === t.label ? `1px solid ${t.color}30` : '1px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{t.icon}</span>
                      <span className="text-xs font-medium" style={{ color: '#0B2545' }}>{t.label}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: t.color }}>
                      {t.range[1] === 999 ? `${t.range[0]}+` : `${t.range[0]}–${t.range[1]}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

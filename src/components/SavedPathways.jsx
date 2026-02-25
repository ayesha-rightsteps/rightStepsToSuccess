import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getSavedPathways, deletePathway } from '../utils/pathwayStorage'

const ROUTE_LABELS = { standard: 'A-Level / Degree', apprenticeship: 'Apprenticeship', btec: 'BTEC / T-Level' }
const ROUTE_COLORS = { standard: '#1E52C8', apprenticeship: '#059669', btec: '#7C3AED' }

export default function SavedPathways({ onLoadPathway }) {
  const [pathways, setPathways] = useState([])

  const refresh = () => setPathways(getSavedPathways())

  useEffect(() => {
    refresh()
    window.addEventListener('pathwaySaved', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('pathwaySaved', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deletePathway(id)
    refresh()
  }

  if (!pathways.length) return null

  return (
    <section className="py-24 lg:py-28" style={{ background: '#FAF9F7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10" style={{ background: '#059669' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#059669' }}>
                Saved Pathways
              </span>
            </div>
            <h2 className="font-display mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#0B2545', fontWeight: 600 }}>
              Your Saved Roadmaps
            </h2>
            <p className="text-sm" style={{ color: '#64748B' }}>
              {pathways.length} pathway{pathways.length !== 1 ? 's' : ''} saved — click any card to reload it in the AI generator
            </p>
          </div>
          <button
            onClick={() => { pathways.forEach(p => deletePathway(p.id)); refresh() }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200"
            style={{ borderColor: '#E2E8F0', color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FCA5A5' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Clear all
          </button>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {pathways.map((pathway, i) => {
              const color = ROUTE_COLORS[pathway.routeType] || '#1E52C8'
              const label = ROUTE_LABELS[pathway.routeType] || 'Standard'
              const firstStep = pathway.steps?.[0]?.title || ''
              const lastStep = pathway.steps?.[pathway.steps.length - 1]?.title || ''

              return (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onLoadPathway(pathway)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' }}
                >
                  {/* Colored top bar */}
                  <div className="h-1" style={{ background: color }} />

                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${color}12`, color }}>
                        {label}
                      </span>
                      <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>
                        {new Date(pathway.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </span>
                    </div>

                    {/* Question */}
                    <h3 className="font-display text-lg font-semibold mb-2 leading-snug line-clamp-2" style={{ color: '#0B2545' }}>
                      {pathway.question}
                    </h3>

                    {/* Step range */}
                    {firstStep && (
                      <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#94A3B8' }}>
                        <span className="truncate max-w-24">{firstStep}</span>
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="truncate max-w-24">{lastStep}</span>
                        <span className="ml-auto shrink-0 font-medium" style={{ color: color }}>
                          {pathway.steps?.length} steps
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <div
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl text-white transition-all duration-200"
                        style={{ background: color }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                        Load pathway
                      </div>
                      <button
                        onClick={(e) => handleDelete(e, pathway.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0"
                        style={{ background: '#FEF2F2', color: '#EF4444' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#FEF2F2')}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

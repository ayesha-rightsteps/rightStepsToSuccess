import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import jsPDF from 'jspdf'
import { savePathway, checkIsSaved } from '../utils/pathwayStorage'

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are an expert UK educational pathway advisor for homeschooling families. Given a career goal or subject interest, generate a structured educational pathway.

Respond with ONLY a valid JSON object — no markdown, no code blocks, no extra text. Use this exact structure:
{
  "explanation": "A warm, clear 2-3 paragraph explanation written directly to a parent. Include specific UK qualifications, approximate timelines, and practical considerations for home educators. Separate paragraphs with two newlines.",
  "steps": [
    {
      "title": "Stage name",
      "description": "What this stage involves, what to study, and why it matters.",
      "stage": "Brief category (e.g. Foundation, Qualification, Career)",
      "duration": "How long this takes (e.g. 2 years)"
    }
  ]
}
Include 4–8 steps. Be specific to the UK education system. Acknowledge home education routes where relevant.`

const ROUTE_INSTRUCTIONS = {
  standard: 'Focus on the traditional academic route: GCSEs → A-Levels → University degree. This is the default higher education pathway.',
  apprenticeship: 'Focus entirely on the apprenticeship route: GCSEs → Level 3 Apprenticeship → Higher Apprenticeship → Degree Apprenticeship. Emphasise earning while learning. Do NOT recommend university as the primary path.',
  btec: 'Focus on the BTEC / T-Level vocational route: GCSEs → BTEC Level 3 or T-Level → Further vocational qualification or UCAS university entry. Emphasise practical, applied learning and industry work placements.',
}

const ROUTE_LABELS = { standard: 'A-Level / Degree', apprenticeship: 'Apprenticeship', btec: 'BTEC / T-Level' }
const ROUTE_COLORS = { standard: '#1E52C8', apprenticeship: '#059669', btec: '#7C3AED' }
const ACCENT_COLORS = ['#1E52C8', '#C4892A', '#7C3AED', '#059669', '#0891B2', '#DC2626', '#B45309']

const EXAMPLE_PROMPTS = [
  'How does my child become a Doctor?',
  'My child loves Maths — what careers are possible?',
  'What does it take to become a Software Engineer?',
  'Career pathway for someone interested in Law',
  'My child wants to be an Architect',
]

const REFINE_CHIPS = [
  'What if the required grades are not achieved?',
  'How can a home-educated student stand out?',
  'What does this pathway cost in total?',
  'Show me the fastest route possible',
  'What work experience helps most?',
]

const buildSystemPrompt = (routeType) =>
  `${BASE_SYSTEM_PROMPT}\n\nRoute focus: ${ROUTE_INSTRUCTIONS[routeType]}`

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExplanationText({ text }) {
  return (
    <div>
      {text.split('\n\n').filter(Boolean).map((para, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 + 0.1, duration: 0.45 }}
          className="text-sm leading-relaxed mb-3.5 last:mb-0"
          style={{ color: '#374151' }}
        >
          {para}
        </motion.p>
      ))}
    </div>
  )
}

function ExplanationSkeleton() {
  return (
    <div className="space-y-2.5">
      {['100%','92%','85%','100%','78%','95%','88%','60%'].map((w, i) => (
        <motion.div key={i} className="h-3.5 rounded-md" style={{ width: w, background: '#E8EDF5' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, delay: i * 0.08, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function PathwayStepCard({ step, index, total }) {
  const [expanded, setExpanded] = useState(false)
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length]
  const isLast = index === total - 1
  const nextColor = ACCENT_COLORS[(index + 1) % ACCENT_COLORS.length]

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.26 + 0.1, type: 'spring', stiffness: 320, damping: 20 }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 z-10"
          style={{ background: color, boxShadow: `0 0 0 3px ${color}35, 0 0 18px ${color}55` }}
        >
          {index + 1}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.26 + 0.45, duration: 0.4 }}
            className="flex-1 w-0.5 mt-1"
            style={{ background: `linear-gradient(to bottom, ${color}, ${nextColor})`, opacity: 0.45, transformOrigin: 'top', minHeight: 32 }}
          />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.26 + 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 mb-5 rounded-2xl cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderLeft: `3px solid ${color}` }}
        whileHover={{ boxShadow: `0 6px 32px rgba(0,0,0,0.35), inset 0 0 0 1px ${color}40` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: `${color}25`, color }}>
              {step.stage}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{step.duration}</span>
          </div>
          <h4 className="font-display text-lg font-semibold mb-1.5 leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {step.title}
          </h4>
          <AnimatePresence initial={false}>
            {!expanded ? (
              <motion.p key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {step.description}
              </motion.p>
            ) : (
              <motion.p key="f" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-sm leading-relaxed overflow-hidden" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {step.description}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1 mt-2.5 text-xs" style={{ color: `${color}cc` }}>
            <svg className="w-3 h-3" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {expanded ? 'Show less' : 'Read more'}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PathwaySkeleton() {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
            <motion.div className="w-11 h-11 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }} />
            {i < 4 && <div className="flex-1 w-0.5 mt-1" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 60 }} />}
          </div>
          <motion.div className="flex-1 mb-5 rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }}>
            <div className="h-3 w-20 rounded mb-3" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="h-5 w-36 rounded mb-2.5" style={{ background: 'rgba(255,255,255,0.14)' }} />
            <div className="h-3 w-full rounded mb-1.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="h-3 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </motion.div>
        </div>
      ))}
    </div>
  )
}

function IdlePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(30,82,200,0.15)', border: '1px solid rgba(30,82,200,0.25)' }}>
        <svg className="w-9 h-9" style={{ color: 'rgba(30,82,200,0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
        Your visual pathway will appear here
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
        Enter a career goal or subject on the left and the AI will generate an animated step-by-step roadmap
      </p>
      <div className="mt-8 w-full max-w-xs space-y-3 opacity-15">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="flex-1 h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AIPathGenerator({ onBack, initialPathway }) {
  const [question, setQuestion] = useState('')
  const [routeType, setRouteType] = useState('standard')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [refineInput, setRefineInput] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const rightPanelRef = useRef(null)
  const inputRef = useRef(null)
  const refineRef = useRef(null)

  // Load saved pathway if navigated from SavedPathways
  useEffect(() => {
    if (initialPathway) {
      setQuestion(initialPathway.question)
      setRouteType(initialPathway.routeType || 'standard')
      setResult({ explanation: initialPathway.explanation, steps: initialPathway.steps })
      setStatus('result')
      setIsSaved(true)
    } else {
      inputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (status === 'result' && rightPanelRef.current) {
      rightPanelRef.current.scrollTop = 0
    }
  }, [status])

  // ── API call (OpenAI) ────────────────────────────────────────────────────
  const callAPI = async (messages) => {
    const openaiMessages = [
      { role: 'system', content: buildSystemPrompt(routeType) },
      ...messages,
    ]

    const response = await fetch('/api/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2048,
        messages: openaiMessages,
      }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error?.message || `Request failed (${response.status})`)
    }
    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content ?? ''
    const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!parsed.explanation || !Array.isArray(parsed.steps) || !parsed.steps.length) {
      throw new Error('Unexpected response format. Please try again.')
    }
    return parsed
  }

  // ── Generate ─────────────────────────────────────────────────────────────
  const generatePathway = async () => {
    if (!question.trim() || status === 'loading') return
    setStatus('loading')
    setResult(null)
    setErrorMsg('')
    setIsSaved(false)
    try {
      const parsed = await callAPI([{ role: 'user', content: question.trim() }])
      setResult(parsed)
      setStatus('result')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  // ── Refine ───────────────────────────────────────────────────────────────
  const refinePathway = async (text) => {
    const q = text || refineInput
    if (!q.trim() || isRefining || !result) return
    setIsRefining(true)
    setRefineInput('')
    try {
      const context = `Original question: "${question}"\nCurrent steps: ${result.steps.map((s, i) => `${i + 1}. ${s.title}`).join(', ')}\n\nFollow-up request: "${q.trim()}"\n\nUpdate the pathway to address this request. Return the same JSON structure.`
      const parsed = await callAPI([{ role: 'user', content: context }])
      setResult(parsed)
      setIsSaved(false)
      rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      // silently fail refinement — keep existing result
    } finally {
      setIsRefining(false)
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!result) return
    savePathway({ question, routeType, explanation: result.explanation, steps: result.steps })
    setIsSaved(true)
  }

  // ── Export PDF ───────────────────────────────────────────────────────────
  const exportPDF = () => {
    if (!result || isExporting) return
    setIsExporting(true)
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const routeColor = ROUTE_COLORS[routeType] || '#1E52C8'
      const rgb = hexToRgb(routeColor)

      // Header bar
      doc.setFillColor(11, 37, 69)
      doc.rect(0, 0, 210, 22, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Right Steps to Success', 14, 14)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(196, 137, 42)
      doc.text(`${ROUTE_LABELS[routeType]} Pathway`, 155, 14)

      // Question title
      doc.setTextColor(11, 37, 69)
      doc.setFontSize(17)
      doc.setFont('helvetica', 'bold')
      const titleLines = doc.splitTextToSize(question, 182)
      doc.text(titleLines, 14, 35)
      let y = 35 + titleLines.length * 7 + 4

      // Route badge line
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(rgb.r, rgb.g, rgb.b)
      doc.text(`Route: ${ROUTE_LABELS[routeType]}  ·  ${result.steps.length} milestones  ·  Generated by Right Steps to Success`, 14, y)
      y += 8

      // Divider
      doc.setDrawColor(220, 220, 220)
      doc.line(14, y, 196, y)
      y += 7

      // Explanation (first paragraph only)
      const firstPara = result.explanation.split('\n\n')[0] || result.explanation
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      const paraLines = doc.splitTextToSize(firstPara, 182)
      doc.text(paraLines, 14, y)
      y += paraLines.length * 4.8 + 8

      // Steps
      result.steps.forEach((step, i) => {
        if (y > 265) { doc.addPage(); y = 18 }

        // Step header pill
        doc.setFillColor(rgb.r, rgb.g, rgb.b)
        doc.roundedRect(14, y - 4, 182, 8, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${i + 1}.  ${step.title}`, 18, y + 1)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        const durationText = `${step.stage}  ·  ${step.duration}`
        doc.text(durationText, 196 - doc.getTextWidth(durationText), y + 1)
        y += 11

        // Description
        doc.setTextColor(55, 65, 81)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const descLines = doc.splitTextToSize(step.description, 178)
        doc.text(descLines, 18, y)
        y += descLines.length * 4.5 + 7
      })

      // Footer
      doc.setFontSize(7.5)
      doc.setTextColor(148, 163, 184)
      doc.text('Generated by Right Steps to Success · For UK homeschooling families', 14, 289)
      doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 196 - doc.getTextWidth(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })), 289)

      const filename = `pathway-${question.slice(0, 28).replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()}.pdf`
      doc.save(filename)
    } finally {
      setIsExporting(false)
    }
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const reset = () => {
    setStatus('idle'); setResult(null); setErrorMsg(''); setQuestion(''); setIsSaved(false); setRefineInput('')
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generatePathway()
  }

  const hasResult = status === 'result' && result

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col" style={{ height: '100dvh', overflow: 'hidden', background: '#FAF9F7' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-6 lg:px-10"
        style={{ height: 64, background: 'white', borderBottom: '1px solid #E8EDF5', position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium group" style={{ color: '#64748B' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0B2545')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200" style={{ borderColor: '#E2E8F0' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Back to home
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="font-display text-base font-semibold hidden sm:inline" style={{ color: '#0B2545' }}>AI Path Generator</span>
        </div>

        <div className="w-40 flex justify-end">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div key="l" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#EFF4FF', color: '#1E52C8' }}>
                <motion.span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#1E52C8' }}
                  animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                {isRefining ? 'Refining' : 'Generating'}
              </motion.div>
            )}
            {hasResult && !isRefining && (
              <motion.div key="d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#ECFDF5', color: '#059669' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-green-500" />
                {result.steps.length} steps
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[45%_55%]" style={{ height: 'calc(100dvh - 64px)', overflow: 'hidden' }}>

        {/* LEFT PANEL */}
        <div className="flex flex-col overflow-y-auto" style={{ background: 'white', borderRight: '1px solid #E8EDF5' }}>
          <div className="px-8 lg:px-10 py-10">

            {/* Title */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ background: '#C4892A' }} />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C4892A' }}>AI Path Generator</span>
              </div>
              <h2 className="font-display mb-1.5" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', color: '#0B2545', fontWeight: 600 }}>
                What pathway would you like to explore?
              </h2>
              <p className="text-sm" style={{ color: '#64748B', lineHeight: '1.7' }}>
                Describe a career goal or subject interest and the AI will generate a personalised UK education roadmap.
              </p>
            </div>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              placeholder="e.g. My child loves science and wants to become a Doctor — what's the full pathway from home education?"
              className="w-full text-sm rounded-2xl resize-none outline-none transition-all duration-200"
              style={{
                padding: '14px 16px', border: '1.5px solid #E2E8F0', color: '#111827',
                lineHeight: '1.7', fontFamily: 'var(--font-body)',
                background: status === 'loading' ? '#F9FAFB' : 'white',
              }}
              onFocus={e => (e.target.style.borderColor = '#1E52C8')}
              onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
              disabled={status === 'loading'}
            />
            <div className="flex justify-between mt-1.5 px-1 mb-4">
              <span className="text-xs" style={{ color: '#94A3B8' }}>Cmd + Enter to generate</span>
              <span className="text-xs" style={{ color: question.length > 400 ? '#DC2626' : '#94A3B8' }}>{question.length}/500</span>
            </div>

            {/* Route type selector */}
            <div className="mb-5">
              <p className="text-xs font-medium mb-2.5" style={{ color: '#64748B' }}>Pathway route</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(ROUTE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setRouteType(key)}
                    className="text-xs font-medium px-3.5 py-2 rounded-full border transition-all duration-200"
                    style={{
                      borderColor: routeType === key ? ROUTE_COLORS[key] : '#E2E8F0',
                      background: routeType === key ? `${ROUTE_COLORS[key]}12` : 'white',
                      color: routeType === key ? ROUTE_COLORS[key] : '#64748B',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Example chips (idle only) */}
            {status === 'idle' && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                <p className="text-xs font-medium mb-2" style={{ color: '#94A3B8' }}>Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map(p => (
                    <button key={p} onClick={() => setQuestion(p)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
                      style={{ borderColor: '#E2E8F0', color: '#64748B', background: '#FAFAFA' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E52C8'; e.currentTarget.style.color = '#1E52C8'; e.currentTarget.style.background = '#EFF4FF' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#FAFAFA' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate / Reset button */}
            <motion.button
              onClick={hasResult || status === 'error' ? reset : generatePathway}
              disabled={status === 'loading' || isRefining || (!question.trim() && status === 'idle')}
              whileHover={status !== 'loading' && !isRefining ? { y: -1 } : {}}
              whileTap={status !== 'loading' && !isRefining ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: hasResult ? '#374151' : 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
            >
              {status === 'loading' && !isRefining ? (
                <>
                  <motion.svg className="w-4 h-4" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </motion.svg>
                  Generating
                  {[0,1,2].map(i => <motion.span key={i} animate={{ opacity:[0,1,0] }} transition={{ duration:1.2, delay:i*0.3, repeat:Infinity }}>.</motion.span>)}
                </>
              ) : hasResult ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Generate a new pathway
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Generate pathway
                </>
              )}
            </motion.button>

            {/* ── Save + Export row (result only) ── */}
            <AnimatePresence>
              {hasResult && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex gap-2.5 mt-3">
                  <button onClick={handleSave} disabled={isSaved}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200"
                    style={{
                      borderColor: isSaved ? '#059669' : '#E2E8F0',
                      color: isSaved ? '#059669' : '#64748B',
                      background: isSaved ? '#ECFDF5' : 'white',
                    }}>
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    {isSaved ? 'Saved' : 'Save pathway'}
                  </button>
                  <button onClick={exportPDF} disabled={isExporting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200"
                    style={{ borderColor: '#E2E8F0', color: '#64748B', background: 'white' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E52C8'; e.currentTarget.style.color = '#1E52C8' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}>
                    {isExporting ? (
                      <motion.svg className="w-4 h-4" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </motion.svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    )}
                    {isExporting ? 'Exporting' : 'Export PDF'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="my-7 h-px" style={{ background: '#F0EDE6' }} />

            {/* Explanation / skeleton / error */}
            <AnimatePresence mode="wait">
              {status === 'loading' && !isRefining && (
                <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div className="w-2 h-2 rounded-full" style={{ background: '#1E52C8' }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-xs font-medium" style={{ color: '#1E52C8' }}>Generating explanation</span>
                  </div>
                  <ExplanationSkeleton />
                </motion.div>
              )}
              {hasResult && (
                <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8' }}>AI Explanation</p>
                  <ExplanationText text={result.explanation} />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.928-13.748c.866-1.5 3.032-1.5 3.898 0l5.78 10.006z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#DC2626' }}>Generation failed</p>
                    <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Refine section (result only) ── */}
            <AnimatePresence>
              {hasResult && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }} className="mt-8">
                  <div className="h-px mb-7" style={{ background: '#F0EDE6' }} />
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#94A3B8' }}>Refine this pathway</p>
                  <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>Ask a follow-up question to update the roadmap</p>

                  {/* Refine chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {REFINE_CHIPS.slice(0, 3).map(chip => (
                      <button key={chip} onClick={() => refinePathway(chip)} disabled={isRefining}
                        className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 disabled:opacity-40"
                        style={{ borderColor: '#E2E8F0', color: '#64748B', background: '#FAFAFA' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1E52C8'; e.currentTarget.style.color = '#1E52C8'; e.currentTarget.style.background = '#EFF4FF' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = '#FAFAFA' }}>
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Refine input */}
                  <div className="flex gap-2">
                    <input
                      ref={refineRef}
                      type="text"
                      value={refineInput}
                      onChange={e => setRefineInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') refinePathway() }}
                      placeholder="Ask a follow-up question..."
                      disabled={isRefining}
                      className="flex-1 text-sm rounded-xl outline-none transition-all duration-200"
                      style={{ padding: '10px 14px', border: '1.5px solid #E2E8F0', color: '#111827', fontFamily: 'var(--font-body)', background: isRefining ? '#F9FAFB' : 'white' }}
                      onFocus={e => (e.target.style.borderColor = '#1E52C8')}
                      onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                    />
                    <button onClick={() => refinePathway()} disabled={!refineInput.trim() || isRefining}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}>
                      {isRefining ? (
                        <motion.svg className="w-4 h-4" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </motion.svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-10" /> {/* bottom breathing room */}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div ref={rightPanelRef} className="overflow-y-auto relative"
          style={{ background: '#0B1E35', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>

          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(30,82,200,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative z-10 px-7 lg:px-10 py-10">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Visual Pathway</p>
                <h3 className="font-display text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {hasResult ? `${ROUTE_LABELS[routeType]} Roadmap` : 'Your Roadmap'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Route type pill on right panel */}
                {hasResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: `${ROUTE_COLORS[routeType]}30`, color: ROUTE_COLORS[routeType], border: `1px solid ${ROUTE_COLORS[routeType]}40` }}>
                    {ROUTE_LABELS[routeType]}
                  </motion.div>
                )}
                {hasResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(5,150,105,0.2)', color: '#34D399', border: '1px solid rgba(5,150,105,0.3)' }}>
                    {result.steps.length} milestones
                  </motion.div>
                )}
              </div>
            </div>

            {/* Refining overlay indicator */}
            <AnimatePresence>
              {isRefining && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
                  style={{ background: 'rgba(30,82,200,0.15)', border: '1px solid rgba(30,82,200,0.25)' }}>
                  <motion.svg className="w-4 h-4 shrink-0" style={{ color: '#4F83E8' }} animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </motion.svg>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Refining your pathway</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <AnimatePresence mode="wait">
              {status === 'idle' && <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><IdlePlaceholder /></motion.div>}
              {status === 'loading' && !isRefining && <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PathwaySkeleton /></motion.div>}
              {(hasResult || isRefining) && result?.steps && (
                <motion.div key={`res-${result.steps.length}-${routeType}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {result.steps.map((step, i) => (
                    <PathwayStepCard key={`${i}-${step.title}`} step={step} index={i} total={result.steps.length} />
                  ))}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: result.steps.length * 0.26 + 0.5 }}
                    className="flex items-center gap-3 mt-2 pl-1">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(5,150,105,0.2)', border: '2px solid rgba(5,150,105,0.4)' }}>
                      <svg className="w-5 h-5" style={{ color: '#34D399' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Pathway complete</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

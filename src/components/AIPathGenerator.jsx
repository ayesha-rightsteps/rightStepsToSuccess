import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const SYSTEM_PROMPT = `You are an expert UK educational pathway advisor for homeschooling families. Given a career goal or subject interest, generate a structured educational pathway.

Respond with ONLY a valid JSON object — no markdown, no code blocks, no extra text. Use this exact structure:
{
  "explanation": "A warm, clear 2-3 paragraph explanation written directly to a parent. Include specific UK qualifications (GCSEs, A-Levels, BTECs), approximate timelines, and practical considerations for home educators. Separate paragraphs with two newlines.",
  "steps": [
    {
      "title": "Stage name (e.g. GCSEs, A-Levels, Medical Degree)",
      "description": "What this stage involves, what to study, and why it matters for this pathway.",
      "stage": "Brief category label (e.g. Foundation, Development, Qualification, Career)",
      "duration": "How long this stage takes (e.g. 2 years, 3–4 years)"
    }
  ]
}

Requirements:
- Include 4–8 steps covering the complete journey from home education to career
- Be specific to the UK education system (GCSE, A-Level, UCAS, etc.)
- Acknowledge home education routes where relevant (private candidacy, online A-Levels, etc.)
- The explanation must be reassuring, clear, and written for a parent — not a student`

const ACCENT_COLORS = ['#1E52C8', '#C4892A', '#7C3AED', '#059669', '#0891B2', '#DC2626', '#B45309']

const EXAMPLE_PROMPTS = [
  'How does my child become a Doctor?',
  'My child loves Maths — what careers are possible?',
  'What does it take to become a Software Engineer?',
  'Career pathway for someone interested in Law',
  'My child wants to be an Architect',
]

// ─── Sub-components ─────────────────────────────────────────────────────────

function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group"
      style={{ color: '#64748B' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#0B2545')}
      onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 group-hover:border-navy"
        style={{ borderColor: '#E2E8F0' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
      Back to home
    </button>
  )
}

function ExplanationText({ text }) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  return (
    <div>
      {paragraphs.map((para, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.18 + 0.1, duration: 0.5, ease: 'easeOut' }}
          className="text-sm leading-relaxed mb-4 last:mb-0"
          style={{ color: '#374151' }}
        >
          {para}
        </motion.p>
      ))}
    </div>
  )
}

function ExplanationSkeleton() {
  const widths = ['100%', '92%', '85%', '100%', '78%', '95%', '88%', '60%']
  return (
    <div className="space-y-2.5">
      {widths.map((w, i) => (
        <motion.div
          key={i}
          className="h-3.5 rounded-md"
          style={{ width: w, background: '#E8EDF5' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, delay: i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
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
  const nodeDelay = index * 0.28 + 0.1
  const cardDelay = index * 0.28 + 0.22
  const lineDelay = index * 0.28 + 0.48

  return (
    <div className="flex gap-4">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: nodeDelay, type: 'spring', stiffness: 320, damping: 20 }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 z-10"
          style={{
            background: color,
            boxShadow: `0 0 0 3px ${color}35, 0 0 18px ${color}55`,
          }}
        >
          {index + 1}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: lineDelay, duration: 0.4, ease: 'easeOut' }}
            className="flex-1 w-0.5 mt-1"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${nextColor})`,
              opacity: 0.45,
              transformOrigin: 'top',
              minHeight: 32,
            }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: cardDelay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 mb-5 rounded-2xl cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderLeft: `3px solid ${color}`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 0 ${color}`,
          transition: 'box-shadow 0.25s ease',
        }}
        whileHover={{
          boxShadow: `0 6px 32px rgba(0,0,0,0.35), inset 0 0 0 1px ${color}40`,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: `${color}25`, color }}
            >
              {step.stage}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {step.duration}
            </span>
          </div>
          <h4 className="font-display text-lg font-semibold mb-1.5 leading-snug" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {step.title}
          </h4>

          <AnimatePresence initial={false}>
            {!expanded ? (
              <motion.p
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm leading-relaxed line-clamp-2"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {step.description}
              </motion.p>
            ) : (
              <motion.p
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm leading-relaxed overflow-hidden"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {step.description}
              </motion.p>
            )}
          </AnimatePresence>

          <div
            className="flex items-center gap-1 mt-2.5 text-xs"
            style={{ color: `${color}cc` }}
          >
            <svg
              className="w-3 h-3 transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
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
    <div className="flex flex-col gap-0">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
            <motion.div
              className="w-11 h-11 rounded-full shrink-0"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }}
            />
            {i < 4 && (
              <div className="flex-1 w-0.5 mt-1" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 60 }} />
            )}
          </div>
          <motion.div
            className="flex-1 mb-5 rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity }}
          >
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
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(30,82,200,0.15)', border: '1px solid rgba(30,82,200,0.25)' }}
      >
        <svg className="w-9 h-9" style={{ color: 'rgba(30,82,200,0.7)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Your visual pathway will appear here
      </h3>
      <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Enter a career goal or subject on the left and the AI will generate an animated step-by-step roadmap
      </p>
      {/* Ghost steps */}
      <div className="mt-8 w-full max-w-xs space-y-3 opacity-20">
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

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AIPathGenerator({ onBack }) {
  const [question, setQuestion] = useState('')
  const [status, setStatus] = useState('idle')      // idle | loading | result | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const rightPanelRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Scroll right panel to top when new result arrives
  useEffect(() => {
    if (status === 'result' && rightPanelRef.current) {
      rightPanelRef.current.scrollTop = 0
    }
  }, [status])

  const generatePathway = async () => {
    if (!question.trim() || status === 'loading') return
    setStatus('loading')
    setResult(null)
    setErrorMsg('')

    try {
      const response = await fetch('/api/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: question.trim() }],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message || `Request failed (${response.status})`)
      }

      const data = await response.json()
      const raw = data.content?.[0]?.text ?? ''

      // Strip any accidental markdown code fences
      const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
      const parsed = JSON.parse(cleaned)

      if (!parsed.explanation || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
        throw new Error('Unexpected response format. Please try again.')
      }

      setResult(parsed)
      setStatus('result')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
    setQuestion('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generatePathway()
  }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', overflow: 'hidden', background: '#FAF9F7' }}>
      {/* ── Header ──────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-6 lg:px-10"
        style={{
          height: 64,
          background: 'white',
          borderBottom: '1px solid #E8EDF5',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <BackButton onBack={onBack} />

        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="font-display text-base font-semibold hidden sm:inline" style={{ color: '#0B2545' }}>
            AI Path Generator
          </span>
        </div>

        {/* Status pill */}
        <div className="w-36 flex justify-end">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#EFF4FF', color: '#1E52C8' }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: '#1E52C8' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Generating
              </motion.div>
            )}
            {status === 'result' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: '#ECFDF5', color: '#059669' }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block bg-green-500" />
                {result?.steps?.length} steps generated
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-[45%_55%]" style={{ height: 'calc(100dvh - 64px)', overflow: 'hidden' }}>

        {/* ── LEFT PANEL ── explanation + input ─────────── */}
        <div
          className="flex flex-col overflow-y-auto"
          style={{ background: 'white', borderRight: '1px solid #E8EDF5' }}
        >
          <div className="px-8 lg:px-10 py-10">
            {/* Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 max-w-8" style={{ background: '#C4892A' }} />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C4892A' }}>
                  AI Path Generator
                </span>
              </div>
              <h2 className="font-display mb-2" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#0B2545', fontWeight: 600 }}>
                What pathway would you like to explore?
              </h2>
              <p className="text-sm" style={{ color: '#64748B', lineHeight: '1.7' }}>
                Describe a career goal or subject interest and the AI will generate a personalised UK education roadmap.
              </p>
            </div>

            {/* Input area (always visible) */}
            <div className="mb-5">
              <textarea
                ref={inputRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="e.g. My child loves science and wants to become a Doctor — what's the full pathway from home education?"
                className="w-full text-sm rounded-2xl resize-none outline-none transition-all duration-200"
                style={{
                  padding: '16px',
                  border: '1.5px solid #E2E8F0',
                  color: '#111827',
                  lineHeight: '1.7',
                  fontFamily: 'var(--font-body)',
                  background: status === 'loading' ? '#F9FAFB' : 'white',
                }}
                onFocus={e => (e.target.style.borderColor = '#1E52C8')}
                onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                disabled={status === 'loading'}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs" style={{ color: '#94A3B8' }}>Cmd + Enter to generate</span>
                <span className="text-xs" style={{ color: question.length > 400 ? '#DC2626' : '#94A3B8' }}>
                  {question.length}/500
                </span>
              </div>
            </div>

            {/* Example chips */}
            {status === 'idle' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <p className="text-xs font-medium mb-2.5" style={{ color: '#94A3B8' }}>Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setQuestion(prompt)}
                      className="text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200"
                      style={{ borderColor: '#E2E8F0', color: '#64748B', background: '#FAFAFA' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1E52C8'
                        e.currentTarget.style.color = '#1E52C8'
                        e.currentTarget.style.background = '#EFF4FF'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E2E8F0'
                        e.currentTarget.style.color = '#64748B'
                        e.currentTarget.style.background = '#FAFAFA'
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate button */}
            <motion.button
              onClick={status === 'result' || status === 'error' ? reset : generatePathway}
              disabled={status === 'loading' || (!question.trim() && status === 'idle')}
              whileHover={status !== 'loading' ? { y: -1 } : {}}
              whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: status === 'result' ? '#374151' : 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
            >
              {status === 'loading' ? (
                <>
                  <motion.svg
                    className="w-4 h-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </motion.svg>
                  Generating your pathway
                  {[0, 1, 2].map(i => (
                    <motion.span key={i} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}>.</motion.span>
                  ))}
                </>
              ) : status === 'result' ? (
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

            {/* Divider */}
            <div className="my-8 h-px" style={{ background: '#F0EDE6' }} />

            {/* Result: explanation */}
            <AnimatePresence mode="wait">
              {status === 'loading' && (
                <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <motion.div className="w-2 h-2 rounded-full" style={{ background: '#1E52C8' }} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-xs font-medium" style={{ color: '#1E52C8' }}>Generating explanation</span>
                  </div>
                  <ExplanationSkeleton />
                </motion.div>
              )}
              {status === 'result' && result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8' }}>
                    AI Explanation
                  </p>
                  <ExplanationText text={result.explanation} />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                >
                  <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#DC2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium mb-0.5" style={{ color: '#DC2626' }}>Generation failed</p>
                    <p className="text-xs" style={{ color: '#EF4444' }}>{errorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT PANEL ── visual pathway ──────────────── */}
        <div
          ref={rightPanelRef}
          className="overflow-y-auto relative"
          style={{
            background: '#0B1E35',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* Ambient glow top-right */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(30,82,200,0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          <div className="relative z-10 px-7 lg:px-10 py-10">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Visual Pathway
                </p>
                <h3 className="font-display text-xl font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {status === 'result' && result ? result.steps[0]?.title?.split(' ')[0] + ' Roadmap' : 'Your Roadmap'}
                </h3>
              </div>
              {status === 'result' && result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(5,150,105,0.2)', color: '#34D399', border: '1px solid rgba(5,150,105,0.3)' }}
                >
                  {result.steps.length} milestones
                </motion.div>
              )}
            </div>

            {/* Pathway content */}
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <IdlePlaceholder />
                </motion.div>
              )}
              {status === 'loading' && (
                <motion.div key="loading-path" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PathwaySkeleton />
                </motion.div>
              )}
              {(status === 'result' || status === 'error') && result?.steps && (
                <motion.div key="result-path" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {result.steps.map((step, i) => (
                    <PathwayStepCard key={i} step={step} index={i} total={result.steps.length} />
                  ))}
                  {/* End marker */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: result.steps.length * 0.28 + 0.5 }}
                    className="flex items-center gap-3 mt-2 pl-1"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(5,150,105,0.2)', border: '2px solid rgba(5,150,105,0.4)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: '#34D399' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Pathway complete
                    </span>
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

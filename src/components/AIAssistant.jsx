import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const SUGGESTIONS = [
  'What GCSEs does a Doctor need?',
  'Best careers for a Maths-strong child',
  'How does home education affect university entry?',
  'What is the UCAT exam?',
  'Careers that don\'t require a degree',
  'A-Levels for becoming an Engineer',
]

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hello! I\'m your Right Steps Guide. I can help you explore educational pathways, compare career options, and understand exactly what your child needs to succeed. What would you like to explore today?',
    time: '10:24',
  },
  {
    id: 2,
    role: 'user',
    text: 'My daughter loves biology and really wants to help people. What careers should we be looking at?',
    time: '10:25',
  },
  {
    id: 3,
    role: 'assistant',
    text: 'That\'s a wonderful combination — a passion for biology paired with a desire to help others opens some truly rewarding paths. Here are my top recommendations for her:\n\n• **Medicine (Doctor or Surgeon)** — the most direct route to patient care, requiring Biology and Chemistry at A-Level\n• **Nursing** — central to patient wellbeing, with degree programmes at most UK universities\n• **Biomedical Science** — laboratory research that develops treatments and saves lives\n• **Physiotherapy** — helping patients recover through movement and rehabilitation\n• **Clinical Psychology** — supporting mental health, requiring a Psychology degree plus further training\n\nShall I show you the full step-by-step roadmap for any of these?',
    time: '10:25',
    isRich: true,
  },
]

function AssistantMessage({ msg }) {
  const lines = msg.text.split('\n').filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div className="flex-1 max-w-sm">
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
          style={{ background: '#EFF4FF', color: '#1a2332' }}
        >
          {lines.map((line, i) => {
            if (line.startsWith('•')) {
              const parts = line.slice(2)
              const boldMatch = parts.match(/^\*\*(.+?)\*\*(.*)$/)
              return (
                <div key={i} className="flex items-start gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#1E52C8' }} />
                  <span>
                    {boldMatch ? (
                      <><strong style={{ color: '#0B2545' }}>{boldMatch[1]}</strong>{boldMatch[2]}</>
                    ) : parts}
                  </span>
                </div>
              )
            }
            return <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
          })}
        </div>
        <span className="text-xs mt-1 ml-1" style={{ color: '#94A3B8' }}>{msg.time}</span>
      </div>
    </motion.div>
  )
}

function UserMessage({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end"
    >
      <div className="max-w-xs">
        <div
          className="rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white"
          style={{ background: '#0B2545' }}
        >
          {msg.text}
        </div>
        <span className="text-xs mt-1 mr-1 block text-right" style={{ color: '#94A3B8' }}>{msg.time}</span>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: '#EFF4FF' }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: '#1E52C8' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

export default function AIAssistant({ onNavigateToGenerator }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = (text) => {
    if (!text.trim()) return

    const userMsg = {
      id: messages.length + 1,
      role: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const reply = {
        id: messages.length + 2,
        role: 'assistant',
        text: 'That\'s a great question. Based on the UK curriculum and the career pathways I know about, I\'d recommend exploring the detailed roadmaps in our Pathways section above. Each pathway is broken down into clear stages — from GCSE choices through to qualification. Would you like me to highlight the most important steps for your child\'s specific interests?',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, reply])
    }, 1800)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section id="ai-guide" className="py-24 lg:py-32" style={{ background: '#F0EDE6' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 max-w-12" style={{ background: '#1E52C8' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#1E52C8' }}>
                AI Guide
              </span>
            </div>
            <h2 className="font-display mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
              Not Sure Where to Start?
            </h2>
            <p className="text-base mb-8" style={{ color: '#64748B', lineHeight: '1.8' }}>
              Our AI Guide is here to help you navigate every question. Whether you&apos;re unsure which subjects to choose, or want to understand what a specific career actually requires — just ask.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  ),
                  title: 'Ask any question',
                  desc: 'From GCSE choices to university entry requirements — no question is too basic.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  ),
                  title: 'Personalised pathways',
                  desc: 'Describe your child\'s strengths and interests to receive tailored pathway suggestions.',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'UK-specific guidance',
                  desc: 'All advice is tailored to the UK education system and home education requirements.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#EFF4FF', color: '#1E52C8' }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5" style={{ color: '#0B2545' }}>{feature.title}</h4>
                    <p className="text-sm" style={{ color: '#64748B', lineHeight: '1.6' }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA — navigate to generator */}
            <motion.button
              onClick={onNavigateToGenerator}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl text-left text-white group"
              style={{ background: 'linear-gradient(135deg, #0B2545 0%, #1E52C8 100%)', boxShadow: '0 4px 24px rgba(30,82,200,0.35)' }}
            >
              <div>
                <div className="text-sm font-semibold mb-0.5">Ask and see the path visually</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Enter your question — AI generates an animated step-by-step roadmap
                </div>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.button>
          </motion.div>

          {/* Right — Chat UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.1)', background: 'white' }}
            >
              {/* Chat header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ background: '#0B2545' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Right Steps Guide</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Online — ready to help</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-70`} />
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="p-5 flex flex-col gap-4 overflow-y-auto"
                style={{ height: 340, background: '#FAFAFA' }}
              >
                {messages.map(msg =>
                  msg.role === 'assistant'
                    ? <AssistantMessage key={msg.id} msg={msg} />
                    : <UserMessage key={msg.id} msg={msg} />
                )}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggestion chips */}
              <div className="px-4 pt-3 pb-0 border-t" style={{ borderColor: '#F0EDE6' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#94A3B8' }}>Suggested questions</p>
                <div className="flex gap-2 flex-wrap pb-3">
                  {SUGGESTIONS.slice(0, 3).map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-royal hover:text-royal"
                      style={{ borderColor: '#E2E8F0', color: '#64748B', background: 'white' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#1E52C8'
                        e.currentTarget.style.color = '#1E52C8'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#E2E8F0'
                        e.currentTarget.style.color = '#64748B'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3 px-4 py-3 border-t"
                style={{ borderColor: '#F0EDE6' }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about pathways, subjects, careers..."
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: '#1a2332', fontFamily: 'var(--font-body)' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

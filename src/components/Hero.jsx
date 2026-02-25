import { useState } from 'react'
import { motion } from 'motion/react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function Hero() {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    const el = document.getElementById('subjects')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')`,
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, rgba(7,24,48,0.92) 0%, rgba(11,37,69,0.82) 50%, rgba(11,37,69,0.88) 100%)',
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.div {...fadeUp(0.1)} className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#C4892A',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />
            UK Homeschooling Companion
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="font-display text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          Find Your Child&apos;s{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #C4892A, #F5C16C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Right Steps
          </span>{' '}
          to Success
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Explore clear, step-by-step educational and career pathways tailored to your child&apos;s strengths —
          from GCSE choices through to a fulfilling career.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          {...fadeUp(0.4)}
          onSubmit={handleSearch}
          className="flex items-center gap-0 max-w-xl mx-auto mb-8 rounded-full overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center gap-3 flex-1 px-5 py-4">
            <svg className="w-5 h-5 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search subjects or careers... e.g. Maths, Doctor"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/40"
              style={{ color: 'white', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <button
            type="submit"
            className="m-1.5 px-5 py-3 rounded-full text-sm font-medium text-white shrink-0 transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
          >
            Search
          </button>
        </motion.form>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.a
            href="#subjects"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Explore by Subject
          </motion.a>
          <motion.a
            href="#careers"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Explore by Career
          </motion.a>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6"
      >
        <div
          className="flex flex-col sm:flex-row items-center justify-around gap-4 rounded-2xl px-6 py-4"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {[
            { value: '40+', label: 'Career Pathways' },
            { value: '12', label: 'UK Subjects Covered' },
            { value: '100%', label: 'UK Curriculum Aligned' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-semibold text-white" style={{ color: '#C4892A' }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

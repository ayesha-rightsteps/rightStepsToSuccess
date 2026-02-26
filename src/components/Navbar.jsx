import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// Navbar dispatches a custom event to trigger the quiz screen from App.jsx
function openQuiz() {
  window.dispatchEvent(new CustomEvent('openQuiz'))
}

const navLinks = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Careers', href: '#careers' },
  { label: 'Pathways', href: '#pathways' },
  { label: 'AI Guide', href: '#ai-guide' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        background: scrolled ? '#0B2545' : 'transparent',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.18)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold text-white leading-none">
            Right Steps <span style={{ color: '#C4892A' }}>to Success</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => (e.target.style.color = '#fff')}
              onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.75)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            onClick={openQuiz}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full"
            style={{ background: 'rgba(196,137,42,0.15)', color: '#C4892A', border: '1px solid rgba(196,137,42,0.3)' }}
          >
            🎯 Career Quiz
          </motion.button>
          <motion.a
            href="#subjects"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
          >
            Start Exploring
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: '#0B2545', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium py-1"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { openQuiz(); setMobileOpen(false) }}
                className="text-sm font-medium text-center py-2.5 rounded-full mt-2"
                style={{ background: 'rgba(196,137,42,0.15)', color: '#C4892A', border: '1px solid rgba(196,137,42,0.3)' }}
              >
                🎯 Career Quiz
              </button>
              <a
                href="#subjects"
                className="text-sm font-medium text-white text-center py-2.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                onClick={() => setMobileOpen(false)}
              >
                Start Exploring
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

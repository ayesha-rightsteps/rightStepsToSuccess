import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { QUIZ_QUESTIONS, CAREER_RESULTS } from '../data/quizData'

function scoreAnswers(answers) {
  const totals = {}
  answers.forEach(answer => {
    if (!answer) return
    Object.entries(answer.scores).forEach(([cat, pts]) => {
      totals[cat] = (totals[cat] || 0) + pts
    })
  })
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat)
    .filter(cat => CAREER_RESULTS[cat])
}

export default function InterestQuiz({ onBack, isChildView }) {
  const [phase, setPhase] = useState('intro') // intro | quiz | results
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [topCareers, setTopCareers] = useState([])

  const q = QUIZ_QUESTIONS[currentQ]
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100

  const handleSelect = (option) => {
    setSelected(option)
    setTimeout(() => {
      const newAnswers = [...answers, option]
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setAnswers(newAnswers)
        setCurrentQ(currentQ + 1)
        setSelected(null)
      } else {
        const top = scoreAnswers(newAnswers)
        setTopCareers(top)
        setPhase('results')
      }
    }, 450)
  }

  const restart = () => {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
    setTopCareers([])
  }

  const questionText = isChildView ? q?.childText : q?.question

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: '#0B2545' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="font-display text-white text-lg font-semibold">
          {isChildView ? '🌟 Career Quiz!' : 'Interest Quiz'}
        </span>
        <div style={{ width: 60 }} />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="text-center"
            >
              <div className="text-7xl mb-6">🎯</div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
                {isChildView ? 'What Career Is Perfect For You?' : 'Discover Your Child\'s Career Match'}
              </h1>
              <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {isChildView
                  ? 'Answer 7 fun questions and find out which amazing career fits you best!'
                  : '7 questions to reveal your child\'s natural strengths and the career paths that match them best.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                {[
                  { icon: '⚡', text: '2 minutes' },
                  { icon: '🎯', text: '7 questions' },
                  { icon: '🏆', text: 'Top 3 matches' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 px-5 py-3 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <span>{item.icon}</span>
                    <span className="text-sm text-white font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('quiz')}
                className="px-10 py-4 rounded-full text-white font-semibold text-lg"
                style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
              >
                {isChildView ? 'Let\'s Go! 🚀' : 'Start the Quiz'}
              </motion.button>
            </motion.div>
          )}

          {/* QUIZ */}
          {phase === 'quiz' && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#C4892A' }}>
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #1E52C8, #C4892A)', width: `${progress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-5">{q.emoji}</div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-white leading-snug">
                  {questionText}
                </h2>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {q.options.map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => handleSelect(option)}
                    disabled={selected !== null}
                    className="w-full text-left px-6 py-4 rounded-2xl text-white font-medium transition-all duration-200"
                    style={{
                      background: selected === option
                        ? 'linear-gradient(135deg, #1E52C8, #4F83E8)'
                        : 'rgba(255,255,255,0.07)',
                      border: selected === option
                        ? '2px solid #4F83E8'
                        : '2px solid rgba(255,255,255,0.1)',
                      transform: selected === option ? 'scale(1.01)' : 'scale(1)',
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                    onMouseLeave={e => { if (selected !== option) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{
                          background: selected === option ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {['A', 'B', 'C', 'D'][i]}
                      </div>
                      {option.text}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-10">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-3">
                  {isChildView ? 'Your Top Career Matches!' : 'Your Child\'s Career Matches'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {isChildView
                    ? 'Based on your answers, here are the careers that suit you best!'
                    : 'Based on the quiz responses, here are the strongest career fits.'
                  }
                </p>
              </div>

              <div className="flex flex-col gap-5 mb-8">
                {topCareers.map((careerKey, i) => {
                  const career = CAREER_RESULTS[careerKey]
                  const medals = ['🥇', '🥈', '🥉']
                  return (
                    <motion.div
                      key={careerKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ border: `2px solid ${career.color}40` }}
                    >
                      <div className="flex items-center gap-4 p-4" style={{ background: `${career.color}18` }}>
                        <span className="text-3xl">{medals[i]}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{career.emoji}</span>
                            <h3 className="font-display text-xl font-semibold text-white">{career.title}</h3>
                          </div>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            {isChildView ? career.childDescription : career.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Key Subjects</div>
                            <div className="text-xs font-medium text-white">{career.subjects.slice(0, 2).join(', ')}</div>
                          </div>
                          <div>
                            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Salary Range</div>
                            <div className="text-xs font-medium" style={{ color: career.color }}>{career.salary}</div>
                          </div>
                          <div>
                            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Route</div>
                            <div className="text-xs font-medium text-white truncate">{career.route.split('→')[0].trim()}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={restart}
                  className="flex-1 py-3.5 rounded-full text-white font-medium"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Retake Quiz
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="flex-1 py-3.5 rounded-full text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                >
                  Explore Pathways
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

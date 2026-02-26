import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const MILESTONE_TEMPLATES = {
  'Doctor': [
    { id: 'm1', label: 'Achieve Grade 7+ in Biology GCSE', stage: 'GCSE' },
    { id: 'm2', label: 'Achieve Grade 7+ in Chemistry GCSE', stage: 'GCSE' },
    { id: 'm3', label: 'Achieve Grade 7+ in Maths GCSE', stage: 'GCSE' },
    { id: 'm4', label: 'Complete A-Level Biology', stage: 'A-Level' },
    { id: 'm5', label: 'Complete A-Level Chemistry', stage: 'A-Level' },
    { id: 'm6', label: 'Sit UCAT aptitude test', stage: 'University Prep' },
    { id: 'm7', label: 'Complete 100 hours of work experience', stage: 'University Prep' },
    { id: 'm8', label: 'Submit UCAS medical school application', stage: 'University Prep' },
    { id: 'm9', label: 'Attend medical school interview', stage: 'University Prep' },
  ],
  'Software Developer': [
    { id: 'm1', label: 'Complete first coding project (any language)', stage: 'Foundation' },
    { id: 'm2', label: 'Achieve Grade 7+ in Maths GCSE', stage: 'GCSE' },
    { id: 'm3', label: 'Complete Computer Science GCSE or A-Level', stage: 'A-Level' },
    { id: 'm4', label: 'Build a personal portfolio website', stage: 'Skills' },
    { id: 'm5', label: 'Complete an online course (e.g. freeCodeCamp)', stage: 'Skills' },
    { id: 'm6', label: 'Apply for a degree apprenticeship or university', stage: 'Entry' },
    { id: 'm7', label: 'Secure first tech internship or placement', stage: 'Entry' },
  ],
  'Civil Engineer': [
    { id: 'm1', label: 'Achieve Grade 7+ in Maths GCSE', stage: 'GCSE' },
    { id: 'm2', label: 'Achieve Grade 6+ in Physics GCSE', stage: 'GCSE' },
    { id: 'm3', label: 'Complete A-Level Maths', stage: 'A-Level' },
    { id: 'm4', label: 'Complete A-Level Physics or Design', stage: 'A-Level' },
    { id: 'm5', label: 'Visit a construction site or STEM event', stage: 'Experience' },
    { id: 'm6', label: 'Apply for engineering degree or apprenticeship', stage: 'Entry' },
  ],
  'Barrister / Solicitor': [
    { id: 'm1', label: 'Achieve Grade 6+ in English Language GCSE', stage: 'GCSE' },
    { id: 'm2', label: 'Participate in a mock trial or debate club', stage: 'Skills' },
    { id: 'm3', label: 'Complete A-Level English Literature or History', stage: 'A-Level' },
    { id: 'm4', label: 'Complete a Law Taster Day or summer school', stage: 'Experience' },
    { id: 'm5', label: 'Apply for LLB Law degree', stage: 'Entry' },
    { id: 'm6', label: 'Complete vacation scheme application', stage: 'Entry' },
  ],
  'Architect': [
    { id: 'm1', label: 'Build a strong Art & Design portfolio', stage: 'Foundation' },
    { id: 'm2', label: 'Complete Art & Design A-Level', stage: 'A-Level' },
    { id: 'm3', label: 'Visit architecture exhibitions or studios', stage: 'Experience' },
    { id: 'm4', label: 'Learn basic CAD or SketchUp software', stage: 'Skills' },
    { id: 'm5', label: 'Apply for RIBA Part 1 Architecture degree', stage: 'Entry' },
  ],
  'Data Scientist': [
    { id: 'm1', label: 'Achieve Grade 8+ in Maths GCSE', stage: 'GCSE' },
    { id: 'm2', label: 'Complete A-Level Mathematics', stage: 'A-Level' },
    { id: 'm3', label: 'Learn Python basics (free online courses)', stage: 'Skills' },
    { id: 'm4', label: 'Complete a statistics project or Kaggle competition', stage: 'Skills' },
    { id: 'm5', label: 'Apply for BSc Mathematics, Statistics, or Computer Science', stage: 'Entry' },
  ],
  'Custom': [],
}

const CAREER_OPTIONS = Object.keys(MILESTONE_TEMPLATES)

function loadProfile() {
  try { return JSON.parse(localStorage.getItem('childProfile') || 'null') } catch { return null }
}
function saveProfile(profile) {
  localStorage.setItem('childProfile', JSON.stringify(profile))
}

export default function ChildProfile() {
  const [profile, setProfile] = useState(loadProfile)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', age: '', career: 'Doctor' })
  const [completed, setCompleted] = useState({})

  useEffect(() => {
    if (profile) {
      try {
        const saved = JSON.parse(localStorage.getItem('milestoneProgress') || '{}')
        setCompleted(saved)
      } catch { /* empty */ }
    }
  }, [profile])

  const toggleMilestone = (id) => {
    const next = { ...completed, [id]: !completed[id] }
    setCompleted(next)
    localStorage.setItem('milestoneProgress', JSON.stringify(next))
  }

  const createProfile = () => {
    if (!form.name.trim()) return
    const p = { ...form, createdAt: Date.now() }
    setProfile(p)
    saveProfile(p)
    setCreating(false)
  }

  const deleteProfile = () => {
    localStorage.removeItem('childProfile')
    localStorage.removeItem('milestoneProgress')
    setProfile(null)
    setCompleted({})
  }

  const milestones = profile ? (MILESTONE_TEMPLATES[profile.career] || []) : []
  const completedCount = milestones.filter(m => completed[m.id]).length
  const progressPct = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0

  const stages = [...new Set(milestones.map(m => m.stage))]

  return (
    <section className="py-24 lg:py-32" style={{ background: '#0B2545' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12" style={{ background: '#C4892A' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C4892A' }}>
              Child Profile
            </span>
          </div>
          <h2 className="font-display mb-4 text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600 }}>
            Track Your Child&apos;s Progress
          </h2>
          <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.75' }}>
            Create a profile for your child and track every milestone on the path to their dream career.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* NO PROFILE — show create prompt or form */}
          {!profile && !creating && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-7xl mb-6">👤</div>
              <h3 className="font-display text-2xl font-semibold text-white mb-3">
                No profile yet
              </h3>
              <p className="mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Create a profile to start tracking milestones
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCreating(true)}
                className="px-8 py-3.5 rounded-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
              >
                Create Profile
              </motion.button>
            </motion.div>
          )}

          {/* CREATION FORM */}
          {creating && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="rounded-2xl p-7" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 className="font-display text-xl font-semibold text-white mb-6">Create a Child Profile</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Child&apos;s name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Emma"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder:text-white/30"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Age (optional)</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={e => setForm({ ...form, age: e.target.value })}
                      placeholder="e.g. 14"
                      min="8" max="20"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none placeholder:text-white/30"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Target career</label>
                    <select
                      value={form.career}
                      onChange={e => setForm({ ...form, career: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      {CAREER_OPTIONS.filter(c => c !== 'Custom').map(c => (
                        <option key={c} value={c} style={{ background: '#0B2545' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setCreating(false)}
                      className="flex-1 py-3 rounded-full text-sm font-medium"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={createProfile}
                      disabled={!form.name.trim()}
                      className="flex-1 py-3 rounded-full text-sm font-semibold text-white"
                      style={{ background: form.name.trim() ? 'linear-gradient(135deg, #1E52C8, #4F83E8)' : 'rgba(255,255,255,0.15)' }}
                    >
                      Create Profile
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PROFILE + MILESTONES */}
          {profile && !creating && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Profile header */}
              <div className="flex items-center justify-between mb-8 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #1E52C8, #4F83E8)' }}
                  >
                    {profile.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{profile.name}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {profile.age ? `Age ${profile.age} · ` : ''}{profile.career} pathway
                    </p>
                  </div>
                </div>
                <button
                  onClick={deleteProfile}
                  className="text-xs font-medium px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF444430' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                >
                  Reset
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Overall Progress</span>
                  <span className="text-sm font-bold" style={{ color: '#C4892A' }}>{completedCount} / {milestones.length} milestones</span>
                </div>
                <div className="h-3 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #1E52C8, #C4892A)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {progressPct === 100 ? '🎉 All milestones complete!' : `${progressPct}% complete`}
                </p>
              </div>

              {/* Milestones by stage */}
              <div className="flex flex-col gap-6">
                {stages.map(stage => (
                  <div key={stage}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {stage}
                    </p>
                    <div className="flex flex-col gap-2">
                      {milestones.filter(m => m.stage === stage).map(m => (
                        <motion.button
                          key={m.id}
                          onClick={() => toggleMilestone(m.id)}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl transition-all duration-200"
                          style={{
                            background: completed[m.id] ? 'rgba(30,82,200,0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${completed[m.id] ? 'rgba(30,82,200,0.4)' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 transition-all duration-200"
                            style={{
                              borderColor: completed[m.id] ? '#1E52C8' : 'rgba(255,255,255,0.2)',
                              background: completed[m.id] ? '#1E52C8' : 'transparent',
                            }}
                          >
                            {completed[m.id] && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{
                              color: completed[m.id] ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                              textDecoration: completed[m.id] ? 'none' : 'none',
                            }}
                          >
                            {m.label}
                          </span>
                          {completed[m.id] && (
                            <span className="ml-auto text-xs font-semibold shrink-0" style={{ color: '#C4892A' }}>✓ Done</span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}

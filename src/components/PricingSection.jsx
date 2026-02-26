import { useState } from 'react'
import { motion } from 'motion/react'

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Start exploring with the essential tools — no commitment needed.',
    color: '#64748B',
    badge: null,
    features: [
      { text: 'Browse all career pathways', included: true },
      { text: 'Subject Combination Checker', included: true },
      { text: 'UCAS Points Calculator', included: true },
      { text: 'Career Interest Quiz', included: true },
      { text: 'AI pathway generator (3/month)', included: true },
      { text: 'Save unlimited pathways', included: false },
      { text: 'Child profile & milestones', included: false },
      { text: 'Career comparison tool', included: false },
      { text: 'Priority AI responses', included: false },
      { text: 'Downloadable PDF reports', included: false },
    ],
    cta: 'Get started free',
    ctaStyle: { background: '#F1F5F9', color: '#0B2545' },
  },
  {
    name: 'Family',
    price: { monthly: 9.99, annual: 7.99 },
    description: 'Everything a homeschooling family needs to plan and track progress.',
    color: '#1E52C8',
    badge: 'Most Popular',
    features: [
      { text: 'Browse all career pathways', included: true },
      { text: 'Subject Combination Checker', included: true },
      { text: 'UCAS Points Calculator', included: true },
      { text: 'Career Interest Quiz', included: true },
      { text: 'AI pathway generator (unlimited)', included: true },
      { text: 'Save unlimited pathways', included: true },
      { text: 'Child profile & milestones', included: true },
      { text: 'Career comparison tool', included: true },
      { text: 'Priority AI responses', included: false },
      { text: 'Downloadable PDF reports', included: false },
    ],
    cta: 'Start 14-day free trial',
    ctaStyle: { background: 'linear-gradient(135deg, #1E52C8, #4F83E8)', color: 'white' },
  },
  {
    name: 'Academy',
    price: { monthly: 29.99, annual: 24.99 },
    description: 'For homeschool groups, tutors, and educational co-ops with multiple children.',
    color: '#C4892A',
    badge: 'Best Value',
    features: [
      { text: 'Browse all career pathways', included: true },
      { text: 'Subject Combination Checker', included: true },
      { text: 'UCAS Points Calculator', included: true },
      { text: 'Career Interest Quiz', included: true },
      { text: 'AI pathway generator (unlimited)', included: true },
      { text: 'Save unlimited pathways', included: true },
      { text: 'Child profile & milestones (up to 10)', included: true },
      { text: 'Career comparison tool', included: true },
      { text: 'Priority AI responses', included: true },
      { text: 'Downloadable PDF reports', included: true },
    ],
    cta: 'Contact us',
    ctaStyle: { background: 'linear-gradient(135deg, #C4892A, #F5C16C)', color: 'white' },
  },
]

function CheckIcon({ included, color }) {
  if (included) {
    return (
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <svg className="w-3 h-3" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#F1F5F9' }}>
      <svg className="w-3 h-3" style={{ color: '#CBD5E1' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  )
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F0EDE6' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: '#C4892A' }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#C4892A' }}>
              Pricing
            </span>
            <div className="h-px w-10" style={{ background: '#C4892A' }} />
          </div>
          <h2 className="font-display mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0B2545', fontWeight: 600 }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: '#64748B', lineHeight: '1.75' }}>
            Start free. Upgrade when you need more. No hidden fees, no long-term contracts.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-full" style={{ background: 'rgba(11,37,69,0.08)' }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: !annual ? '#0B2545' : 'transparent',
                color: !annual ? 'white' : '#64748B',
                boxShadow: !annual ? '0 2px 8px rgba(11,37,69,0.2)' : 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: annual ? '#0B2545' : 'transparent',
                color: annual ? 'white' : '#64748B',
                boxShadow: annual ? '0 2px 8px rgba(11,37,69,0.2)' : 'none',
              }}
            >
              Annual
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#DCFCE7', color: '#059669' }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
              style={{
                boxShadow: plan.badge === 'Most Popular'
                  ? `0 8px 48px ${plan.color}25, 0 2px 8px rgba(0,0,0,0.08)`
                  : '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
                border: plan.badge === 'Most Popular' ? `2px solid ${plan.color}40` : '2px solid transparent',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="text-center text-xs font-bold py-2 tracking-widest uppercase text-white"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Plan name + price */}
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-semibold mb-1" style={{ color: '#0B2545' }}>
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-5" style={{ color: '#64748B' }}>{plan.description}</p>
                  <div className="flex items-end gap-1">
                    {plan.price.monthly === 0 ? (
                      <span className="font-display text-4xl font-bold" style={{ color: '#0B2545' }}>Free</span>
                    ) : (
                      <>
                        <span className="font-display text-4xl font-bold" style={{ color: plan.color }}>
                          £{annual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-sm mb-1.5" style={{ color: '#94A3B8' }}>/month</span>
                      </>
                    )}
                  </div>
                  {plan.price.monthly > 0 && annual && (
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                      Billed £{(plan.price.annual * 12).toFixed(2)}/year
                    </p>
                  )}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold mb-7 transition-all duration-200"
                  style={plan.ctaStyle}
                >
                  {plan.cta}
                </motion.button>

                {/* Features */}
                <div className="flex flex-col gap-3 flex-1">
                  {plan.features.map(feature => (
                    <div key={feature.text} className="flex items-center gap-3">
                      <CheckIcon included={feature.included} color={plan.color} />
                      <span
                        className="text-sm"
                        style={{ color: feature.included ? '#374151' : '#CBD5E1' }}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12"
        >
          {[
            { icon: '🔒', text: 'No credit card required for Free plan' },
            { icon: '✓', text: '14-day free trial on Family plan' },
            { icon: '↩', text: 'Cancel any time, no questions asked' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2.5">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium" style={{ color: '#64748B' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

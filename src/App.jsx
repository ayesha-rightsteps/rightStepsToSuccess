import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SubjectExplorer from './components/SubjectExplorer'
import CareerExplorer from './components/CareerExplorer'
import PathwaySection from './components/PathwaySection'
import SubjectChecker from './components/SubjectChecker'
import CareerComparison from './components/CareerComparison'
import SavedPathways from './components/SavedPathways'
import AIAssistant from './components/AIAssistant'
import Footer from './components/Footer'
import AIPathGenerator from './components/AIPathGenerator'
import InterestQuiz from './components/InterestQuiz'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [initialPathway, setInitialPathway] = useState(null)

  const goToGenerator = (pathway = null) => {
    setInitialPathway(pathway)
    setScreen('ai-generator')
    window.scrollTo(0, 0)
  }

  const goHome = () => {
    setScreen('home')
    setInitialPathway(null)
    window.scrollTo(0, 0)
  }

  const goToQuiz = () => {
    setScreen('quiz')
    window.scrollTo(0, 0)
  }

  // Listen for the quiz event dispatched by Navbar
  useEffect(() => {
    window.addEventListener('openQuiz', goToQuiz)
    return () => window.removeEventListener('openQuiz', goToQuiz)
  }, [])

  if (screen === 'ai-generator') {
    return <AIPathGenerator onBack={goHome} initialPathway={initialPathway} />
  }

  if (screen === 'quiz') {
    return <InterestQuiz onBack={goHome} isChildView={false} />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SubjectExplorer />
      <CareerExplorer />
      <PathwaySection />
      <SubjectChecker />
      <CareerComparison />
      <SavedPathways onLoadPathway={goToGenerator} />
      <AIAssistant onNavigateToGenerator={() => goToGenerator()} />
      <Footer />
    </div>
  )
}

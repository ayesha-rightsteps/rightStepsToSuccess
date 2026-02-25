import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SubjectExplorer from './components/SubjectExplorer'
import CareerExplorer from './components/CareerExplorer'
import PathwaySection from './components/PathwaySection'
import SavedPathways from './components/SavedPathways'
import AIAssistant from './components/AIAssistant'
import Footer from './components/Footer'
import AIPathGenerator from './components/AIPathGenerator'

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
  }

  if (screen === 'ai-generator') {
    return <AIPathGenerator onBack={goHome} initialPathway={initialPathway} />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SubjectExplorer />
      <CareerExplorer />
      <PathwaySection />
      <SavedPathways onLoadPathway={goToGenerator} />
      <AIAssistant onNavigateToGenerator={() => goToGenerator()} />
      <Footer />
    </div>
  )
}

import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SubjectExplorer from './components/SubjectExplorer'
import CareerExplorer from './components/CareerExplorer'
import PathwaySection from './components/PathwaySection'
import AIAssistant from './components/AIAssistant'
import Footer from './components/Footer'
import AIPathGenerator from './components/AIPathGenerator'

export default function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'ai-generator') {
    return <AIPathGenerator onBack={() => setScreen('home')} />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SubjectExplorer />
      <CareerExplorer />
      <PathwaySection />
      <AIAssistant onNavigateToGenerator={() => setScreen('ai-generator')} />
      <Footer />
    </div>
  )
}

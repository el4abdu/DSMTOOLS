import { useState, useEffect } from 'react'
import PasswordGenerator from './components/PasswordGenerator'
import PasswordStrengthChecker from './components/PasswordStrengthChecker'
import ProFeatures from './components/ProFeatures'
import { KeyIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface PasswordHistory {
  password: string
  timestamp: number
  strength: number
}

function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'checker' | 'pro'>('generator')
  const [isPro, setIsPro] = useState(false)
  const [proExpiry, setProExpiry] = useState<number | null>(null)
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistory[]>([])
  const [particlesCount] = useState(20)

  useEffect(() => {
    // Check localStorage for pro status
    const storedProExpiry = localStorage.getItem('proExpiry')
    if (storedProExpiry) {
      const expiryTime = parseInt(storedProExpiry)
      if (expiryTime > Date.now()) {
        setIsPro(true)
        setProExpiry(expiryTime)
      } else {
        localStorage.removeItem('proExpiry')
      }
    }

    // Load password history from cookies
    const storedHistory = localStorage.getItem('passwordHistory')
    if (storedHistory) {
      setPasswordHistory(JSON.parse(storedHistory))
    }

    // Create animated particles
    createParticles()
  }, [])

  const handleUnlockPro = () => {
    // Set pro status for 4 hours
    const expiryTime = Date.now() + 4 * 60 * 60 * 1000
    localStorage.setItem('proExpiry', expiryTime.toString())
    setIsPro(true)
    setProExpiry(expiryTime)
  }

  const addToHistory = (password: string, strength: number) => {
    const newHistory = [
      { password, timestamp: Date.now(), strength },
      ...passwordHistory.slice(0, 9) // Keep last 10 passwords
    ]
    setPasswordHistory(newHistory)
    localStorage.setItem('passwordHistory', JSON.stringify(newHistory))
  }

  const formatTimeRemaining = () => {
    if (!proExpiry) return ''
    const remaining = proExpiry - Date.now()
    const hours = Math.floor(remaining / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    return `${hours}h ${minutes}m`
  }

  const createParticles = () => {
    const container = document.createElement('div')
    container.className = 'particles-container'
    document.body.appendChild(container)

    for (let i = 0; i < particlesCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        const size = Math.random() * 60 + 20
        const duration = Math.random() * 15 + 10
        const xPos = Math.random() * 100
        const delay = Math.random() * 10

        particle.className = 'particle'
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.left = `${xPos}%`
        particle.style.animationDuration = `${duration}s`
        particle.style.animationDelay = `${delay}s`
        particle.style.opacity = `${Math.random() * 0.3}`
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`
        
        container.appendChild(particle)
      }, i * 200)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 fade-in">
          <div className="inline-block relative mb-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Password Tools
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate strong passwords, check their strength, and manage your security with advanced tools
          </p>
          {isPro && (
            <div className="mt-4 inline-block px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-medium animate-pulse">
              Pro Access: {formatTimeRemaining()}
            </div>
          )}
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('generator')}
              className={`btn ${
                activeTab === 'generator'
                  ? 'btn-primary glow'
                  : 'btn-secondary'
              } flex items-center space-x-2 hover-lift`}
            >
              <KeyIcon className={`h-5 w-5 ${activeTab === 'generator' ? 'float-icon' : ''}`} />
              <span>Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('checker')}
              className={`btn ${
                activeTab === 'checker'
                  ? 'btn-primary glow'
                  : 'btn-secondary'
              } flex items-center space-x-2 hover-lift`}
            >
              <ShieldCheckIcon className={`h-5 w-5 ${activeTab === 'checker' ? 'float-icon' : ''}`} />
              <span>Checker</span>
            </button>
            <button
              onClick={() => setActiveTab('pro')}
              className={`btn ${
                activeTab === 'pro'
                  ? 'btn-primary glow'
                  : 'btn-secondary'
              } flex items-center space-x-2 hover-lift`}
            >
              <SparklesIcon className={`h-5 w-5 ${activeTab === 'pro' ? 'float-icon' : ''}`} />
              <span>Pro Features</span>
            </button>
          </div>

          <div className="glass-effect p-6 rounded-lg shadow-2xl fade-in">
            {activeTab === 'generator' && (
              <PasswordGenerator 
                isPro={isPro} 
                onPasswordGenerated={(password, strength) => addToHistory(password, strength)}
              />
            )}
            {activeTab === 'checker' && (
              <PasswordStrengthChecker isPro={isPro} />
            )}
            {activeTab === 'pro' && (
              <ProFeatures
                isPro={isPro}
                onUnlockPro={handleUnlockPro}
                timeRemaining={formatTimeRemaining()}
                passwordHistory={passwordHistory}
              />
            )}
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-400 fade-in">
          <div className="glass-effect inline-block px-6 py-2 rounded-full">
            {isPro ? (
              <p className="flex items-center justify-center space-x-2">
                <SparklesIcon className="h-4 w-4 text-yellow-400" />
                <span>Pro features unlocked! Time remaining: {formatTimeRemaining()}</span>
              </p>
            ) : (
              <p className="flex items-center justify-center space-x-2">
                <SparklesIcon className="h-4 w-4" />
                <span>Watch an ad to unlock pro features for 4 hours</span>
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App 
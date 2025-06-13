import { useState, useEffect } from 'react'
import { SparklesIcon, LockClosedIcon, CheckCircleIcon, ClockIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

interface PasswordHistory {
  password: string
  timestamp: number
  strength: number
}

interface ProFeaturesProps {
  isPro: boolean
  onUnlockPro: () => void
  timeRemaining: string
  passwordHistory: PasswordHistory[]
}

const ProFeatures = ({ isPro, onUnlockPro, timeRemaining, passwordHistory }: ProFeaturesProps) => {
  const [showAd, setShowAd] = useState(false)
  const [adComplete, setAdComplete] = useState(false)
  const [adProgress, setAdProgress] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    let interval: number | undefined
    if (showAd && !adComplete) {
      interval = window.setInterval(() => {
        setAdProgress(prev => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            if (interval) window.clearInterval(interval)
            setAdComplete(true)
            return 100
          }
          return newProgress
        })
      }, 100)
    }
    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [showAd, adComplete])

  const proFeatures = [
    {
      title: 'Advanced Password Generation',
      description: 'Custom patterns, exclude similar characters, and more options',
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Password History',
      description: 'Save and manage your generated passwords securely',
      icon: <LockClosedIcon className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Breach Check',
      description: 'Check if your password has been compromised in data breaches',
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Advanced Strength Analysis',
      description: 'Detailed entropy calculation and crack time estimation',
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'from-orange-500 to-amber-500'
    },
  ]

  const handleWatchAd = () => {
    setShowAd(true)
    setAdProgress(0)
  }

  const completeAd = () => {
    setTimeout(() => {
      setShowAd(false)
      setAdComplete(false)
      setAdProgress(0)
      onUnlockPro()
    }, 2000)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'text-red-500'
      case 2:
      case 3:
        return 'text-yellow-500'
      case 4:
      case 5:
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak'
      case 2:
      case 3:
        return 'Weak'
      case 4:
        return 'Strong'
      case 5:
        return 'Very Strong'
      default:
        return 'Unknown'
    }
  }

  const copyToClipboard = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(password)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy password:', err)
    }
  }

  return (
    <div className="space-y-6 fade-in">
      {isPro ? (
        <div className="text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-20 rounded-full"></div>
            <SparklesIcon className="h-16 w-16 mx-auto text-yellow-400 mb-4 float-icon" />
            <h2 className="text-3xl font-bold mb-2 gradient-text">Pro Features Unlocked!</h2>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 rounded-full text-black">
              <ClockIcon className="h-4 w-4" />
              <span className="font-medium">Time remaining: {timeRemaining}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {proFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-effect p-4 rounded-lg hover-lift group"
              >
                <div className={`flex items-start space-x-4 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}></div>
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <div className="relative z-10">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {passwordHistory.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6 gradient-text text-center">Password History</h3>
              <div className="space-y-4">
                {passwordHistory.map((item, index) => (
                  <div
                    key={index}
                    className="glass-effect p-4 rounded-lg hover-lift group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm bg-black/30 px-2 py-1 rounded">{item.password}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(item.strength)} bg-black/30`}>
                          {getStrengthText(item.strength)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          {copied === item.password ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                          )}
                        </button>
                        <button
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Delete from history"
                        >
                          <TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-effect p-8 rounded-lg text-center">
              <ClockIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Password History Yet</h3>
              <p className="text-gray-400">Generate passwords to see your history here</p>
            </div>
          )}

          <button
            onClick={handleWatchAd}
            className="btn btn-primary flex items-center justify-center space-x-2 mx-auto mt-8 hover-lift glow"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Extend Pro Access</span>
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 blur-xl opacity-20 rounded-full"></div>
            <LockClosedIcon className="h-16 w-16 mx-auto text-gray-400 mb-4 float-icon" />
            <h2 className="text-3xl font-bold mb-2">Unlock Pro Features</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Watch a short ad to unlock premium features for 4 hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {proFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-effect p-4 rounded-lg flex items-start space-x-4 opacity-50 hover:opacity-60 transition-opacity duration-300"
              >
                <div className="text-gray-400">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleWatchAd}
            className="btn btn-primary flex items-center justify-center space-x-2 mx-auto hover-lift glow py-3 px-6"
            disabled={showAd}
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Watch Ad to Unlock</span>
          </button>
        </div>
      )}

      {showAd && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-lg max-w-md w-full mx-4 border border-white/10 shadow-2xl">
            {adComplete ? (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="h-12 w-12 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
                <p className="mb-6">Pro features have been unlocked for 4 hours.</p>
                <button 
                  onClick={completeAd}
                  className="btn btn-primary w-full py-3"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Ad Playing...</h3>
                <div className="w-full h-48 bg-gray-800 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SparklesIcon className="h-16 w-16 text-gray-700 animate-pulse" />
                  </div>
                  <div className="relative z-10 bg-black/50 px-4 py-2 rounded-lg">
                    <p className="text-gray-300">Simulated Ad Content</p>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${adProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400">
                  Please wait while the ad plays... {adProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProFeatures 
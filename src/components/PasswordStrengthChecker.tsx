import { useState, useEffect } from 'react'
import { ShieldCheckIcon, ShieldExclamationIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface StrengthResult {
  score: number
  feedback: string[]
  suggestions: string[]
  entropy?: number
  crackTime?: string
  commonPatterns?: string[]
}

interface PasswordStrengthCheckerProps {
  isPro: boolean
}

const PasswordStrengthChecker = ({ isPro }: PasswordStrengthCheckerProps) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [strength, setStrength] = useState<StrengthResult>({
    score: 0,
    feedback: [],
    suggestions: [],
  })

  const checkPasswordStrength = (pass: string): StrengthResult => {
    const result: StrengthResult = {
      score: 0,
      feedback: [],
      suggestions: [],
    }

    // Length check
    if (pass.length < 8) {
      result.feedback.push('Password is too short')
      result.suggestions.push('Use at least 8 characters')
    } else if (pass.length >= 12) {
      result.score += 1
    }

    // Character variety checks
    const hasUppercase = /[A-Z]/.test(pass)
    const hasLowercase = /[a-z]/.test(pass)
    const hasNumbers = /[0-9]/.test(pass)
    const hasSymbols = /[^A-Za-z0-9]/.test(pass)

    if (!hasUppercase) {
      result.feedback.push('No uppercase letters')
      result.suggestions.push('Add uppercase letters')
    } else {
      result.score += 1
    }

    if (!hasLowercase) {
      result.feedback.push('No lowercase letters')
      result.suggestions.push('Add lowercase letters')
    } else {
      result.score += 1
    }

    if (!hasNumbers) {
      result.feedback.push('No numbers')
      result.suggestions.push('Add numbers')
    } else {
      result.score += 1
    }

    if (!hasSymbols) {
      result.feedback.push('No special characters')
      result.suggestions.push('Add special characters')
    } else {
      result.score += 1
    }

    // Common patterns check
    const commonPatterns = [
      'password',
      '123456',
      'qwerty',
      'admin',
      'welcome',
      'letmein',
      'monkey',
      'dragon',
      'baseball',
      'football',
    ]

    const lowerPass = pass.toLowerCase()
    const foundPatterns = commonPatterns.filter(pattern => lowerPass.includes(pattern))
    if (foundPatterns.length > 0) {
      result.feedback.push('Contains common patterns')
      result.suggestions.push('Avoid common words and patterns')
      result.score = Math.max(0, result.score - 1)
      if (isPro) {
        result.commonPatterns = foundPatterns
      }
    }

    // Pro features
    if (isPro) {
      // Entropy calculation
      const charSet = new Set(pass.split(''))
      const entropy = Math.log2(Math.pow(charSet.size, pass.length))
      result.entropy = Math.round(entropy)

      // Estimated crack time (simplified)
      const crackTimeInSeconds = Math.pow(2, entropy) / 1000000 // Assuming 1M attempts per second
      if (crackTimeInSeconds < 60) {
        result.crackTime = 'less than a minute'
      } else if (crackTimeInSeconds < 3600) {
        result.crackTime = 'less than an hour'
      } else if (crackTimeInSeconds < 86400) {
        result.crackTime = 'less than a day'
      } else if (crackTimeInSeconds < 31536000) {
        result.crackTime = 'less than a year'
      } else {
        result.crackTime = 'centuries'
      }
    }

    return result
  }

  useEffect(() => {
    if (password) {
      setIsChecking(true)
      // Add a small delay for animation effect
      const timer = setTimeout(() => {
        setStrength(checkPasswordStrength(password))
        setIsChecking(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setStrength({
        score: 0,
        feedback: [],
        suggestions: [],
      })
    }
  }, [password])

  const getStrengthColor = (score: number) => {
    switch (score) {
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

  const getStrengthBgColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500'
      case 2:
      case 3:
        return 'bg-yellow-500'
      case 4:
      case 5:
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStrengthText = (score: number) => {
    switch (score) {
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

  const getStrengthIcon = (score: number) => {
    if (score >= 4) {
      return <ShieldCheckIcon className="h-6 w-6 text-green-500" />
    }
    return <ShieldExclamationIcon className="h-6 w-6 text-red-500" />
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input pr-24 text-lg group-hover:shadow-lg transition-all duration-300 relative z-10"
          placeholder="Enter password to check"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2 z-10">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-secondary p-2"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
          {password && getStrengthIcon(strength.score)}
        </div>
      </div>

      {password && (
        <div className={`space-y-4 transition-all duration-300 ${isChecking ? 'opacity-50' : 'opacity-100'}`}>
          <div className="glass-effect p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Password Strength</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${getStrengthColor(strength.score)}`}>
                  {getStrengthText(strength.score)}
                </span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthBgColor(strength.score)} transition-all duration-500`} 
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {isPro && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="glass-effect p-3 rounded-lg text-center hover:scale-105 transition-transform duration-300">
                  <p className="text-sm text-gray-400">Entropy</p>
                  <p className="text-xl font-semibold gradient-text">{strength.entropy} bits</p>
                </div>
                <div className="glass-effect p-3 rounded-lg text-center hover:scale-105 transition-transform duration-300">
                  <p className="text-sm text-gray-400">Estimated Crack Time</p>
                  <p className="text-xl font-semibold gradient-text">{strength.crackTime}</p>
                </div>
              </div>
            )}

            {strength.feedback.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-medium flex items-center">
                  <ShieldExclamationIcon className="h-5 w-5 mr-2 text-red-500" />
                  Issues Found:
                </h4>
                <ul className="list-disc list-inside space-y-1 bg-red-900/20 p-3 rounded-lg">
                  {strength.feedback.map((item, index) => (
                    <li key={index} className="text-red-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {strength.suggestions.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="font-medium flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-400" />
                  Suggestions:
                </h4>
                <ul className="list-disc list-inside space-y-1 bg-indigo-900/20 p-3 rounded-lg">
                  {strength.suggestions.map((item, index) => (
                    <li key={index} className="text-indigo-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isPro && strength.commonPatterns && strength.commonPatterns.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="font-medium flex items-center">
                  <LockClosedIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Common Patterns Found:
                </h4>
                <ul className="list-disc list-inside space-y-1 bg-yellow-900/20 p-3 rounded-lg">
                  {strength.commonPatterns.map((pattern, index) => (
                    <li key={index} className="text-yellow-400">
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!password && (
        <div className="text-center py-8 glass-effect rounded-lg">
          <ShieldCheckIcon className="h-16 w-16 mx-auto text-gray-400 mb-4 float-icon" />
          <h3 className="text-xl font-semibold mb-2">Enter a password to check its strength</h3>
          <p className="text-gray-400">We'll analyze it and provide feedback on how secure it is</p>
        </div>
      )}

      {!isPro && (
        <div className="text-center mt-4">
          <button
            onClick={() => window.location.href = '#pro'}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center justify-center space-x-1 hover-lift mx-auto"
          >
            <LockClosedIcon className="h-4 w-4" />
            <span>Unlock Pro Features</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default PasswordStrengthChecker 
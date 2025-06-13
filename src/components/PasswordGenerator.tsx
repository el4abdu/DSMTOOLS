import { useState, useEffect } from 'react'
import { ClipboardDocumentIcon, ArrowPathIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline'

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  customPattern?: string
  excludeSimilar?: boolean
  excludeAmbiguous?: boolean
}

interface PasswordGeneratorProps {
  isPro: boolean
  onPasswordGenerated: (password: string, strength: number) => void
}

const PasswordGenerator = ({ isPro, onPasswordGenerated }: PasswordGeneratorProps) => {
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  })

  // Generate a password on component mount
  useEffect(() => {
    generatePassword()
  }, [])

  const calculatePasswordStrength = (pass: string): number => {
    let score = 0

    // Length check
    if (pass.length >= 12) score += 1

    // Character variety checks
    if (/[A-Z]/.test(pass)) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

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
      score = Math.max(0, score - 1)
    }

    return score
  }

  const generatePassword = () => {
    setIsGenerating(true)
    
    // Add a small delay for animation effect
    setTimeout(() => {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const numbers = '0123456789'
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const similar = 'iIlL1oO0'
      const ambiguous = '{}[]()/\\\'"`~,;:.<>'
  
      let chars = ''
      if (options.includeUppercase) chars += uppercase
      if (options.includeLowercase) chars += lowercase
      if (options.includeNumbers) chars += numbers
      if (options.includeSymbols) chars += symbols
  
      if (options.excludeSimilar) {
        similar.split('').forEach(char => {
          chars = chars.replace(char, '')
        })
      }
  
      if (options.excludeAmbiguous) {
        ambiguous.split('').forEach(char => {
          chars = chars.replace(char, '')
        })
      }
  
      if (chars === '') {
        setPassword('')
        setIsGenerating(false)
        return
      }
  
      let result = ''
      if (options.customPattern && isPro) {
        // Pro feature: Custom pattern generation
        const pattern = options.customPattern
        for (let i = 0; i < pattern.length; i++) {
          const char = pattern[i]
          switch (char) {
            case 'U':
              result += uppercase[Math.floor(Math.random() * uppercase.length)]
              break
            case 'L':
              result += lowercase[Math.floor(Math.random() * lowercase.length)]
              break
            case 'N':
              result += numbers[Math.floor(Math.random() * numbers.length)]
              break
            case 'S':
              result += symbols[Math.floor(Math.random() * symbols.length)]
              break
            default:
              result += char
          }
        }
      } else {
        for (let i = 0; i < options.length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length)
          result += chars[randomIndex]
        }
      }
  
      setPassword(result)
      const strength = calculatePasswordStrength(result)
      onPasswordGenerated(result, strength)
      setIsGenerating(false)
    }, 500)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy password:', err)
    }
  }

  const getStrengthColor = (length: number) => {
    if (length < 10) return 'bg-red-500'
    if (length < 14) return 'bg-yellow-500'
    if (length < 20) return 'bg-green-500'
    return 'bg-indigo-500'
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
        <input
          type="text"
          value={password}
          readOnly
          className="input pr-24 text-lg font-mono group-hover:shadow-lg transition-all duration-300 relative z-10"
          placeholder="Generated password will appear here"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2 z-10">
          <button
            onClick={copyToClipboard}
            className={`btn btn-primary p-2 ${copied ? 'bg-green-500 hover:bg-green-600' : ''}`}
            disabled={!password}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 animate-pulse" />
            ) : (
              <ClipboardDocumentIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={generatePassword}
            className="btn btn-primary p-2"
            disabled={isGenerating}
            title="Generate new password"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-6 glass-effect p-6 rounded-lg">
        <div className="slider-wrapper">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Password Length: <span className="text-white font-bold">{options.length}</span>
            </label>
            <span className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(options.length)}`}>
              {options.length < 10 ? 'Weak' : options.length < 14 ? 'Good' : options.length < 20 ? 'Strong' : 'Very Strong'}
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) =>
              setOptions({ ...options, length: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) =>
                setOptions({ ...options, includeUppercase: e.target.checked })
              }
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) =>
                setOptions({ ...options, includeLowercase: e.target.checked })
              }
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) =>
                setOptions({ ...options, includeNumbers: e.target.checked })
              }
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) =>
                setOptions({ ...options, includeSymbols: e.target.checked })
              }
            />
            <span>Special Characters (!@#$%^&*)</span>
          </label>

          {isPro && (
            <>
              <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) =>
                    setOptions({ ...options, excludeSimilar: e.target.checked })
                  }
                />
                <span>Exclude Similar Characters (i, l, 1, o, 0)</span>
              </label>

              <label className="checkbox-wrapper hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) =>
                    setOptions({ ...options, excludeAmbiguous: e.target.checked })
                  }
                />
                <span>Exclude Ambiguous Characters ({'{}[]()/\\\'"`~,;:.<>'})</span>
              </label>

              <div className="col-span-2 mt-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Pattern <span className="text-indigo-400">(Pro)</span>
                </label>
                <input
                  type="text"
                  value={options.customPattern || ''}
                  onChange={(e) =>
                    setOptions({ ...options, customPattern: e.target.value })
                  }
                  className="input"
                  placeholder="Use U=uppercase, L=lowercase, N=number, S=symbol"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Example: ULLLNNNSS (1 uppercase, 3 lowercase, 3 numbers, 2 symbols)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={generatePassword}
        disabled={isGenerating}
        className="btn btn-primary w-full flex items-center justify-center space-x-2 py-3 hover-lift glow"
      >
        <ArrowPathIcon className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
        <span>{isGenerating ? 'Generating...' : 'Generate Password'}</span>
      </button>

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

export default PasswordGenerator 
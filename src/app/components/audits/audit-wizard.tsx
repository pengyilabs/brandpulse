import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Youtube,
  Instagram,
  Facebook,
  Music2,
  Linkedin,
  Twitter,
  Plus,
  X,
} from 'lucide-react'
import { Platform, PLATFORM_LABELS, MOCK_AUDIT } from '../../data/audit-data'

const PLATFORM_ICONS: Record<Platform, React.ReactElement> = {
  youtube: <Youtube className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  tiktok: <Music2 className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  x: <Twitter className="w-4 h-4" />,
}

const AUDIT_PERIODS = ['2 Weeks', '1 Month', '3 Months', '6 Months', '1 Year'] as const

interface ProfileEntry {
  id: string
  platform: Platform
  url: string
}

export function AuditWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [profiles, setProfiles] = useState<ProfileEntry[]>([
    { id: 'p1', platform: 'youtube', url: '' },
  ])
  const [auditPeriod, setAuditPeriod] = useState<string>('3 Months')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [currentPosts, setCurrentPosts] = useState(0)
  const totalPosts = 158

  useEffect(() => {
    if (step === 2 && !isAnalyzing && currentPosts === 0) {
      setIsAnalyzing(true)
    }
  }, [step, isAnalyzing, currentPosts])

  useEffect(() => {
    if (!isAnalyzing) return
    const interval = setInterval(() => {
      setCurrentPosts((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 1
        if (next >= totalPosts) {
          setIsAnalyzing(false)
          setAnalyzeProgress(100)
          setTimeout(() => navigate('/audits'), 600)
          return totalPosts
        }
        setAnalyzeProgress(Math.round((next / totalPosts) * 100))
        return next
      })
    }, 200)
    return () => clearInterval(interval)
  }, [isAnalyzing, profiles])

  const addProfile = () => {
    const platforms: Platform[] = ['youtube', 'xiaohongshu', 'weibo', 'douyin', 'wechat', 'bilibili']
    const usedPlatforms = new Set(profiles.map((p) => p.platform))
    const nextPlatform = platforms.find((p) => !usedPlatforms.has(p)) || 'youtube'
    setProfiles([
      ...profiles,
      { id: `p${profiles.length + 1}`, platform: nextPlatform, url: '' },
    ])
  }

  const removeProfile = (id: string) => {
    if (profiles.length <= 1) return
    setProfiles(profiles.filter((p) => p.id !== id))
  }

  const updateProfile = (id: string, field: 'platform' | 'url', value: string) => {
    setProfiles(
      profiles.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const isValid = profiles.every((p) => p.url.trim().length > 0)

  const startAnalysis = () => {
    if (!isValid) return
    setIsAnalyzing(true)
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[900px] mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/audits')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Audits
          </button>
          <h1 className="text-2xl font-bold text-foreground">New Social Media Audit</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          <StepIndicator step={1} isActive={step === 1} isComplete={step > 1} label="Input Profile" />
          <div
            className="flex-1 h-px mx-2"
            style={{ background: step > 1 ? '#4B56F2' : 'rgba(255,255,255,0.08)' }}
          />
          <StepIndicator step={2} isActive={step === 2} isComplete={false} label="Processing" />
          <div
            className="flex-1 h-px mx-2"
            style={{ background: step > 2 ? '#4B56F2' : 'rgba(255,255,255,0.08)' }}
          />
          <StepIndicator step={3} isActive={false} isComplete={false} label="Audit Results" />
        </div>

        {step === 1 && (
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Configure Your Audit
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We'll analyze public posts from your social profiles and provide
                  detailed content insights.
                </p>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Analysis Period
                  </label>
                  <div className="flex gap-2">
                    {AUDIT_PERIODS.map((period) => (
                      <button
                        key={period}
                        onClick={() => setAuditPeriod(period)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          auditPeriod === period
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-[#1a1a1a] text-muted-foreground hover:bg-[#222]'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Social Media Profiles
                  </label>
                  <div className="space-y-3">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center gap-3">
                        <div className="relative">
                          <select
                            value={profile.platform}
                            onChange={(e) =>
                              updateProfile(profile.id, 'platform', e.target.value as Platform)
                            }
                            className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg pl-10 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[160px]"
                          >
                            {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            {PLATFORM_ICONS[profile.platform]}
                          </div>
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder={`Enter ${PLATFORM_LABELS[profile.platform]} profile URL...`}
                            value={profile.url}
                            onChange={(e) => updateProfile(profile.id, 'url', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        {profiles.length > 1 && (
                          <button
                            onClick={() => removeProfile(profile.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addProfile}
                    className="flex items-center gap-2 mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Platform
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Campaign Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an audit name to identify this report..."
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="w-64 bg-[#0a0a0a] border border-white/10 rounded-lg p-5 flex-shrink-0">
                <h3 className="text-sm font-semibold text-foreground mb-3">Why Audit?</h3>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Analyze content strategies and identify gaps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Discover high-performing content formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Benchmark against competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Get actionable recommendations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => navigate('/audits')}
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-sm text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!isValid}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed text-primary-foreground rounded-lg text-sm font-medium transition-all"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-1">Analyzing Profile</h2>
              <p className="text-sm text-muted-foreground">Analysis step 2 of 4</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      Fetching data from {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {profiles.map((p, i) => (
                      <span key={p.id} className="flex items-center gap-1">
                        {PLATFORM_ICONS[p.platform]}
                        {i < profiles.length - 1 && <span className="text-white/30">·</span>}
                      </span>
                    ))}
                    <span className="animate-pulse text-primary">analyzing...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-md">
                  {currentPosts} / {totalPosts}
                </span>
                <span className="text-sm text-muted-foreground">posts imported</span>
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                Scanning and classifying profile content
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We're pulling the last {totalPosts} posts from {profiles.length} profile{profiles.length !== 1 ? 's' : ''} and categorizing
                them by engagement and topic.
              </p>
            </div>

            <div className="max-w-md mx-auto mt-8">
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${analyzeProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">{analyzeProgress}% complete</p>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/audits')}
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StepIndicator({
  step,
  isActive,
  isComplete,
  label,
}: {
  step: number
  isActive: boolean
  isComplete: boolean
  label: string
}) {
  return (
    <>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          isComplete
            ? 'bg-primary'
            : isActive
            ? 'bg-primary/20 border-2 border-primary'
            : 'bg-[#262626]'
        }`}
      >
        {isComplete ? (
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        ) : (
          <span
            className={`text-xs font-bold ${
              isActive ? 'text-primary' : 'text-muted-foreground/50'
            }`}
          >
            {step}
          </span>
        )}
      </div>
      <span
        className={`text-xs font-medium whitespace-nowrap transition-colors ${
          isActive || isComplete ? 'text-foreground' : 'text-muted-foreground/50'
        }`}
      >
        {label}
      </span>
    </>
  )
}

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Sparkles,
  Plus,
  Check,
  ArrowRight,
  Youtube,
  Instagram,
  Facebook,
  Music2,
  Linkedin,
  Twitter,
  Flame,
  Target,
  Zap,
  Palette,
  FileText,
  Lightbulb,
} from 'lucide-react'
import { MOCK_AUDIT, Platform, PLATFORM_LABELS, getContentTypeLabel } from '../../data/audit-data'
import { useAuditAssets } from '../../data/audit-asset-store'

export interface AuditCampaignConfig {
  contentTypes: { type: string; percentage: number }[]
  funnelStages: { stage: string; percentage: number }[]
  campaignName: string
  audiencePersona: string
  topics: string[]
}

const PLATFORM_ICONS: Record<Platform, React.ReactElement> = {
  youtube: <Youtube className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  tiktok: <Music2 className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  x: <Twitter className="w-4 h-4" />,
}

const EXTRACTED_COLORS = ['#4B56F2', '#8B5CF6', '#EC4899', '#3B82F6']
const EXTRACTED_VOICE_DESCRIPTORS = ['Bold', 'Performance-Driven', 'Knowledgeable']
const EXTRACTED_WRITING_STYLES = ['Conversational', 'Instructional', 'Motivational']
const EXTRACTED_AUDIENCE = 'Active individuals looking for actionable advice and daily inspiration.'

export function ActionHub() {
  const navigate = useNavigate()
  const { addBrandKit, addWriterProfile } = useAuditAssets()
  const [brandKitSaved, setBrandKitSaved] = useState(false)
  const [writerProfileSaved, setWriterProfileSaved] = useState(false)
  const [contentMix, setContentMix] = useState(() => ({
    'short-video': 40,
    carousel: 25,
    'social-post': 25,
    'wechat-article': 10,
  }))
  const [funnelMix, setFunnelMix] = useState(() => ({
    awareness: 50,
    consideration: 30,
    conversion: 20,
  }))

  const totalContent = Object.values(contentMix).reduce((a, b) => a + b, 0)
  const totalFunnel = Object.values(funnelMix).reduce((a, b) => a + b, 0)
  const mixNormalized = totalContent === 100
  const funnelNormalized = totalFunnel === 100

  const adjustContent = (key: string, delta: number) => {
    setContentMix((prev) => {
      const next = Math.max(0, Math.min(100, prev[key as keyof typeof prev] + delta))
      return { ...prev, [key]: next }
    })
  }

  const adjustFunnel = (key: string, delta: number) => {
    setFunnelMix((prev) => {
      const next = Math.max(0, Math.min(100, prev[key as keyof typeof prev] + delta))
      return { ...prev, [key]: next }
    })
  }

  const normalizeContent = () => {
    setContentMix((prev) => {
      const total = Object.values(prev).reduce((a, b) => a + b, 0)
      if (total === 0) return prev
      const result: Record<string, number> = {}
      for (const [key, val] of Object.entries(prev)) {
        result[key] = Math.round((val / total) * 100)
      }
      const sum = Object.values(result).reduce((a, b) => a + b, 0)
      if (sum !== 100) {
        const keys = Object.keys(result)
        result[keys[0]] += 100 - sum
      }
      return result
    })
  }

  const normalizeFunnel = () => {
    setFunnelMix((prev) => {
      const total = Object.values(prev).reduce((a, b) => a + b, 0)
      if (total === 0) return prev
      const result: Record<string, number> = {}
      for (const [key, val] of Object.entries(prev)) {
        result[key] = Math.round((val / total) * 100)
      }
      const sum = Object.values(result).reduce((a, b) => a + b, 0)
      if (sum !== 100) {
        const keys = Object.keys(result)
        result[keys[0]] += 100 - sum
      }
      return result
    })
  }

  const handleSaveBrandKit = () => {
    if (brandKitSaved) return
    addBrandKit({
      name: `${MOCK_AUDIT.handle.replace('@', '')} Brand Kit`,
      description: `Brand kit extracted from ${MOCK_AUDIT.handle} audit. Bold, performance-driven visual style.`,
      primaryColor: EXTRACTED_COLORS[0],
      secondaryColor: EXTRACTED_COLORS[1],
      headingFont: 'Montserrat',
      bodyFont: 'Noto Sans',
      tagline: 'Performance-driven. Bold. Authentic.',
      voiceToneDescriptors: EXTRACTED_VOICE_DESCRIPTORS,
    })
    setBrandKitSaved(true)
  }

  const handleSaveWriterProfile = () => {
    if (writerProfileSaved) return
    addWriterProfile({
      name: `${MOCK_AUDIT.handle.replace('@', '')} Writer Profile`,
      tone: 'bold',
      level: 'intermediate',
      description: `Writing profile extracted from ${MOCK_AUDIT.handle} audit. Conversational, instructional, and motivational style patterns.`,
      audiencePersona: EXTRACTED_AUDIENCE,
      writingStyles: EXTRACTED_WRITING_STYLES,
    })
    setWriterProfileSaved(true)
  }

  const handleCreateCampaign = () => {
    const config: AuditCampaignConfig = {
      contentTypes: Object.entries(contentMix).map(([type, percentage]) => ({ type, percentage })),
      funnelStages: Object.entries(funnelMix).map(([stage, percentage]) => ({ stage, percentage })),
      campaignName: `${MOCK_AUDIT.handle.replace('@', '')} Campaign`,
      audiencePersona: EXTRACTED_AUDIENCE,
      topics: MOCK_AUDIT.topicCloud.map((t) => t.name),
    }
    onCreateCampaign(config)
  }

  const handleEmulatePost = (post: typeof MOCK_AUDIT.topPosts[0]) => {
    onEmulatePost({
      title: post.title,
      contentType: post.contentType,
      platform: post.platform,
      hook: post.hook,
    })
  }

  const contentMixEntries = useMemo(
    () =>
      Object.entries(contentMix).map(([key, value]) => ({
        key,
        value,
        label: getContentTypeLabel(key as any),
      })),
    [contentMix]
  )

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Results
              </button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Action Hub</h1>
            <p className="text-sm text-muted-foreground">Turn your audit insights into a content strategy</p>
          </div>
        </div>

        {/* Section 1: Brand Kit & Writer Profile */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              1
            </span>
            <h2 className="text-lg font-semibold text-foreground">Brand Kit & Writer Profile</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 ml-8">
            Instantly save visual styles and structured writer patterns to maintain perfect execution scale.
          </p>

          <div className="grid grid-cols-2 gap-4 ml-8">
            {/* Brand Kit Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">Brand Kit Ready</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                We extracted these brand characteristics from your audit. Save them as a reusable brand kit.
              </p>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Extracted Palette
                </p>
                <div className="flex gap-1.5">
                  {EXTRACTED_COLORS.map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Voice Tone Descriptors
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {EXTRACTED_VOICE_DESCRIPTORS.map((desc) => (
                    <span
                      key={desc}
                      className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-medium rounded-full"
                    >
                      {desc}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveBrandKit}
                disabled={brandKitSaved}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  brandKitSaved
                    ? 'bg-[#12B667]/20 text-[#8FE6B5] cursor-default'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {brandKitSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved to Brand Kits
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save as Brand Kit - {MOCK_AUDIT.handle.replace('@', '')}
                  </>
                )}
              </button>
            </div>

            {/* Writer Profile Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">Writer Profile Ready</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                We identified these writing patterns from your audit. Save them as a reusable writer profile.
              </p>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Writing Style
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {EXTRACTED_WRITING_STYLES.map((style) => (
                    <span
                      key={style}
                      className="px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[11px] font-medium rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Audience Persona
                </p>
                <p className="text-xs text-foreground bg-[#1a1a1a] rounded-lg p-2.5 border border-white/5">
                  {EXTRACTED_AUDIENCE}
                </p>
              </div>

              <button
                onClick={handleSaveWriterProfile}
                disabled={writerProfileSaved}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  writerProfileSaved
                    ? 'bg-[#12B667]/20 text-[#8FE6B5] cursor-default'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {writerProfileSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved to Writer Profiles
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save as Writer Profile - {MOCK_AUDIT.handle.replace('@', '')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Generate Campaign */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                2
              </span>
              <h2 className="text-lg font-semibold text-foreground">Generate Campaign</h2>
            </div>
            <button
              onClick={handleCreateCampaign}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
            >
              <Zap className="w-4 h-4" />
              Create New Campaign
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-5 ml-8">
            Configure a tailored content mix and funnel goals to spin up structured campaigns automatically.
          </p>

          <div className="grid grid-cols-2 gap-6 ml-8">
            {/* Tune Content Mix */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Tune Content Mix</h3>
              <div className="space-y-2.5">
                {contentMixEntries.map(({ key, value, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28">{label}</span>
                    <div className="flex-1 flex items-center gap-1.5">
                      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => adjustContent(key, -5)}
                          className="w-5 h-5 rounded bg-[#1a1a1a] text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <button
                          onClick={() => adjustContent(key, 5)}
                          className="w-5 h-5 rounded bg-[#1a1a1a] text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground w-10 text-right">{value}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {!mixNormalized && (
                  <button
                    onClick={normalizeContent}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Normalize to 100%
                  </button>
                )}
                {mixNormalized && (
                  <span className="text-xs text-[#8FE6B5] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Mix Normalized
                  </span>
                )}
              </div>
            </div>

            {/* Funnel Goal Distribution */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Funnel Goal Distribution</h3>
              <div className="space-y-2.5">
                {Object.entries(funnelMix).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    awareness: 'Awareness',
                    consideration: 'Consideration',
                    conversion: 'Conversion',
                  }
                  const colors: Record<string, string> = {
                    awareness: '#12B667',
                    consideration: '#f59e0b',
                    conversion: '#ef4444',
                  }
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-28">{labels[key]}</span>
                      <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${value}%`, backgroundColor: colors[key] }}
                          />
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => adjustFunnel(key, -5)}
                            className="w-5 h-5 rounded bg-[#1a1a1a] text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <button
                            onClick={() => adjustFunnel(key, 5)}
                            className="w-5 h-5 rounded bg-[#1a1a1a] text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-foreground w-10 text-right">{value}%</span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {!funnelNormalized && (
                  <button
                    onClick={normalizeFunnel}
                    className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Normalize to 100%
                  </button>
                )}
                {funnelNormalized && (
                  <span className="text-xs text-[#8FE6B5] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Funnel Normalized
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Emulate Top Posts */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              3
            </span>
            <h2 className="text-lg font-semibold text-foreground">Emulate Top Posts</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 ml-8">
            Take your highest-performing posts and generate new content inspired by their success patterns.
          </p>

          <div className="ml-8">
            <div className="grid grid-cols-2 gap-3">
              {MOCK_AUDIT.topPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-muted-foreground">
                      {PLATFORM_ICONS[post.platform]}
                    </span>
                    <span className="text-xs font-semibold text-foreground flex-1 truncate">
                      {post.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-white/5 rounded-full">
                      {getContentTypeLabel(post.contentType as any)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
                    {post.hook}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {(post.engagement / 1000).toFixed(1)}K engagements
                    </span>
                    <button
                      onClick={() => handleEmulatePost(post)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      Generate Similar
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Export Data */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              4
            </span>
            <h2 className="text-lg font-semibold text-foreground">Export Audit Data</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 ml-8">
            Download a comprehensive report of your audit findings for further analysis or sharing with your team.
          </p>

          <div className="grid grid-cols-3 gap-3 ml-8">
            <button className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-lg hover:border-primary/30 transition-all text-left">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">PDF Report</p>
                <p className="text-xs text-muted-foreground">Full audit report with charts</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-lg hover:border-primary/30 transition-all text-left">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">CSV Data Export</p>
                <p className="text-xs text-muted-foreground">Raw post-level data</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-lg hover:border-primary/30 transition-all text-left">
              <Flame className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Top Posts Report</p>
                <p className="text-xs text-muted-foreground">Best performing content</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  Share2,
  Download,
  ArrowRight,
  Edit3,
  CheckCircle,
  FileText,
  TrendingUp,
  Zap,
  Tag,
  Plus,
  Info,
  AlertTriangle,
  Lightbulb,
  Youtube,
  Instagram,
  Facebook,
  Music2,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  MOCK_AUDIT,
  generateAuditPosts,
  AuditPost,
  ContentType,
  FunnelStage,
  Platform,
  PLATFORM_LABELS,
  getContentTypeLabel,
  getContentTypeColor,
  getFunnelLabel,
  getFunnelColor,
} from '../data/audit-data'

interface AuditResultsProps {
  auditProfiles: Platform[]
  onBack: () => void
  onGoToActionHub: () => void
}

const PLATFORM_ICONS: Record<Platform, React.ReactElement> = {
  youtube: <Youtube className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  facebook: <Facebook className="w-3.5 h-3.5" />,
  tiktok: <Music2 className="w-3.5 h-3.5" />,
  linkedin: <Linkedin className="w-3.5 h-3.5" />,
  x: <Twitter className="w-3.5 h-3.5" />,
}

const CONTENT_TYPE_OPTIONS: ContentType[] = [
  'short-clips', 'carousels', 'static-posts', 'blog-long-form', 'ai-text-video', 'quote-cards', 'social-posts',
]

const FUNNEL_STAGES: FunnelStage[] = ['top', 'middle', 'bottom']

export function AuditResults({ auditProfiles, onBack, onGoToActionHub }: AuditResultsProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'dashboard'>('calendar')

  const [platforms, setPlatforms] = useState(() => {
    const source = auditProfiles.length > 0
      ? MOCK_AUDIT.platforms.filter((p) => auditProfiles.includes(p.platform))
      : MOCK_AUDIT.platforms
    return source.map((p, i) => ({ ...p, enabled: i === 0 }))
  })
  const [selectedContentTypes, setSelectedContentTypes] = useState<Set<ContentType>>(new Set())
  const [selectedFunnelStages, setSelectedFunnelStages] = useState<Set<FunnelStage>>(new Set())
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 5, 1))

  const posts = useMemo(() => generateAuditPosts(MOCK_AUDIT), [])

  const togglePlatform = (platformId: string) => {
    const currentEnabled = platforms.filter((p) => p.enabled)
    const target = platforms.find((p) => p.id === platformId)
    if (target && target.enabled && currentEnabled.length <= 1) return
    setPlatforms((prev) =>
      prev.map((p) => (p.id === platformId ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const filteredPosts = useMemo(() => {
    const enabledPlatforms = new Set(platforms.filter((p) => p.enabled).map((p) => p.platform))
    return posts.filter((post) => {
      if (!enabledPlatforms.has(post.platform)) return false
      if (selectedContentTypes.size > 0 && !selectedContentTypes.has(post.contentType)) return false
      if (selectedFunnelStages.size > 0 && !selectedFunnelStages.has(post.funnelStage)) return false
      return true
    })
  }, [posts, platforms, selectedContentTypes, selectedFunnelStages])

  const toggleContentType = (ct: ContentType) => {
    setSelectedContentTypes((prev) => {
      const next = new Set(prev)
      if (next.has(ct)) next.delete(ct)
      else next.add(ct)
      return next
    })
  }

  const toggleFunnelStage = (fs: FunnelStage) => {
    setSelectedFunnelStages((prev) => {
      const next = new Set(prev)
      if (next.has(fs)) next.delete(fs)
      else next.add(fs)
      return next
    })
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Audits
            </button>
            <div className="w-px h-4 bg-white/10" />
            <h1 className="text-xl font-bold text-foreground">{MOCK_AUDIT.name}</h1>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#1a1a1a] transition-colors">
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#1a1a1a] transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button onClick={onGoToActionHub} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all">
              <ArrowRight className="w-4 h-4" />
              Create Campaign From Audit
            </button>
          </div>
        </div>

        {/* Subheader */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Jan 1 - Mar 31, 2025
            </span>
          </div>

          {/* Platform toggles */}
          <div className="flex items-center gap-2">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  platform.enabled
                    ? 'bg-[#1a1a1a] border-white/10 text-foreground'
                    : 'bg-[#0f0f0f] border-white/5 text-muted-foreground'
                }`}
              >
                {PLATFORM_ICONS[platform.platform]}
                <span className="text-xs font-medium">
                  {PLATFORM_LABELS[platform.platform]} ({platform.postsCount} Posts)
                </span>
                <button
                  onClick={() => togglePlatform(platform.id)}
                  className={`w-8 h-4.5 rounded-full relative transition-colors ${
                    platform.enabled ? 'bg-primary' : 'bg-white/10'
                  }`}
                  style={{ height: '18px' }}
                >
                  <span
                    className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${
                      platform.enabled ? 'left-[calc(100%-14px)]' : 'left-0.5'
                    }`}
                    style={{ width: '14px', height: '14px' }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[#111] rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <CalendarViewComponent
            posts={filteredPosts}
            currentMonth={calendarMonth}
            onPrevMonth={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
            onNextMonth={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
            selectedContentTypes={selectedContentTypes}
            selectedFunnelStages={selectedFunnelStages}
            onToggleContentType={toggleContentType}
            onToggleFunnelStage={toggleFunnelStage}
            contentTypeDistribution={MOCK_AUDIT.contentTypeDistribution}
            avgEngagement={MOCK_AUDIT.avgEngagement}
            postsWithCtas={MOCK_AUDIT.postsWithCtas}
          />
        ) : (
          <DashboardViewComponent onBack={onBack} onGoToActionHub={onGoToActionHub} />
        )}
      </div>
    </div>
  )
}

function CalendarViewComponent({
  posts,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  selectedContentTypes,
  selectedFunnelStages,
  onToggleContentType,
  onToggleFunnelStage,
  contentTypeDistribution,
  avgEngagement,
  postsWithCtas,
}: {
  posts: AuditPost[]
  currentMonth: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  selectedContentTypes: Set<ContentType>
  selectedFunnelStages: Set<FunnelStage>
  onToggleContentType: (ct: ContentType) => void
  onToggleFunnelStage: (fs: FunnelStage) => void
  contentTypeDistribution: Record<ContentType, number>
  avgEngagement: string
  postsWithCtas: string
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const postsByDate = useMemo(() => {
    const map = new Map<number, AuditPost[]>()
    for (const post of posts) {
      const day = post.date.getDate()
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(post)
    }
    return map
  }, [posts])

  const totalPosts = posts.length

  return (
    <div>
      {/* Filter pills row */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {/* Content type pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {CONTENT_TYPE_OPTIONS.map((ct) => (
            <button
              key={ct}
              onClick={() => onToggleContentType(ct)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedContentTypes.has(ct)
                  ? 'bg-primary/15 text-primary'
                  : 'bg-[#1a1a1a] text-muted-foreground hover:bg-[#222]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getContentTypeColor(ct) }}
              />
              {getContentTypeLabel(ct)}
              <span className="ml-0.5 text-muted-foreground/60">
                {contentTypeDistribution[ct]}
              </span>
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Funnel stage pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {FUNNEL_STAGES.map((fs) => (
            <button
              key={fs}
              onClick={() => onToggleFunnelStage(fs)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedFunnelStages.has(fs)
                  ? 'bg-primary/15 text-primary'
                  : 'bg-[#1a1a1a] text-muted-foreground hover:bg-[#222]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getFunnelColor(fs) }}
              />
              {getFunnelLabel(fs)}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Avg Engagement</span>
            <span className="font-semibold text-foreground">{avgEngagement}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Posts With CTAs</span>
            <span className="font-semibold text-foreground">{postsWithCtas}</span>
          </div>
        </div>
      </div>

      {/* Calendar nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors">
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-white/10" />
          <button className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg text-xs text-foreground hover:bg-[#222] transition-colors">
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {weekdays.map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: startWeekday }, (_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] border-b border-r border-white/5" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dayPosts = postsByDate.get(day) || []
            return (
              <div
                key={day}
                className="min-h-[120px] border-b border-r border-white/5 p-1.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="text-xs text-muted-foreground/80 mb-1 px-1">{day}</div>
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-1 px-1.5 py-1 bg-[#1a1a1a] rounded text-[11px] text-foreground truncate cursor-pointer hover:bg-[#222] transition-colors group"
                      title={`${post.title} - ${PLATFORM_LABELS[post.platform]}`}
                    >
                      <span className="flex-shrink-0" style={{ color: getContentTypeColor(post.contentType) }}>
                        {PLATFORM_ICONS[post.platform]}
                      </span>
                      <span className="truncate flex-1">{post.title}</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getFunnelColor(post.funnelStage) }}
                      />
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1.5">
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {totalPosts === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm mt-4">
          No posts match the current filters
        </div>
      )}
    </div>
  )
}

function DashboardViewComponent({ onBack, onGoToActionHub }: { onBack: () => void; onGoToActionHub: () => void }) {
  const { audit } = useAuditContext()

  return (
    <div className="space-y-6">
      {/* Action banner */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Your first audit is ready! What would you like to do next?
            </h3>
            <p className="text-sm text-muted-foreground">
              Explore extracted brand parameters or create campaign calendars aligned to your analyzed channel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#222] transition-colors">
              <FileText className="w-4 h-4" />
              Create Brand Kit
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#222] transition-colors">
              <Tag className="w-4 h-4" />
              Create Writer Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<FileText className="w-5 h-5" />} value={MOCK_AUDIT.totalPosts.toString()} label="Total Posts" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} value={MOCK_AUDIT.avgEngagement} label="Avg Engagement" />
        <StatCard icon={<Zap className="w-5 h-5" />} value={MOCK_AUDIT.postsWithCtas} label="Posts With CTAs" />
        <StatCard icon={<Tag className="w-5 h-5" />} value={MOCK_AUDIT.uniqueTopics.toString()} label="Unique Topics" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Funnel Breakdown donut */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Funnel Stage Breakdown</h3>
          <div className="flex items-center gap-6">
            <FunnelDonut data={MOCK_AUDIT.funnelBreakdown} />
            <div className="space-y-3">
              <LegendItem color={getFunnelColor('top')} label="Top / Awareness" value={`${MOCK_AUDIT.funnelBreakdown.top}%`} />
              <LegendItem color={getFunnelColor('middle')} label="Mid / Consideration" value={`${MOCK_AUDIT.funnelBreakdown.middle}%`} />
              <LegendItem color={getFunnelColor('bottom')} label="Bottom / Conversion" value={`${MOCK_AUDIT.funnelBreakdown.bottom}%`} />
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400">
              72% awareness content, only 8% conversion posts - critical content gap identified
            </p>
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Content Type Distribution</h3>
          <div className="space-y-2.5">
            {Object.entries(MOCK_AUDIT.contentTypeDistribution)
              .filter(([_, v]) => v > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 text-right">{getContentTypeLabel(type as ContentType)}</span>
                  <div className="flex-1 h-4 bg-[#1a1a1a] rounded overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${(count / 64) * 100}%`,
                        backgroundColor: getContentTypeColor(type as ContentType),
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-sky-300">
              Zero quote cards posted in this period - high-performing format missing
            </p>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Topic Cloud */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Topic Cloud</h3>
          <div className="flex flex-wrap gap-2">
            {MOCK_AUDIT.topicCloud.map((topic) => (
              <span
                key={topic.name}
                className={`px-3 py-1 rounded-full bg-primary/10 text-primary font-medium ${
                  topic.size === 'large' ? 'text-sm' : topic.size === 'medium' ? 'text-xs' : 'text-[11px]'
                }`}
              >
                {topic.name}
              </span>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-foreground mt-5 mb-3">By Engagement Score</h3>
          <div className="space-y-2">
            {MOCK_AUDIT.engagementByTopic.map((item) => (
              <div key={item.topic} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                  {item.rank}
                </span>
                <span className="text-xs text-foreground flex-1">{item.topic}</span>
                <span className="text-xs font-semibold text-foreground">{item.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Performance Matrix */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Engagement Performance Matrix</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                By Content Type
              </h4>
              <div className="space-y-2">
                {MOCK_AUDIT.engagementByContentType.map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-20 truncate">
                      {getContentTypeLabel(item.type)}
                    </span>
                    <div className="flex-1 h-3 bg-[#1a1a1a] rounded overflow-hidden">
                      <div
                        className="h-full rounded bg-primary"
                        style={{ width: `${item.percentage * 3}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground w-7 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                By Funnel Stage
              </h4>
              <div className="space-y-2">
                {MOCK_AUDIT.engagementByFunnelStage.map((item) => (
                  <div key={item.stage} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-20 truncate">
                      {getFunnelLabel(item.stage)}
                    </span>
                    <div className="flex-1 h-3 bg-[#1a1a1a] rounded overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${item.percentage * 2}%`,
                          backgroundColor: getFunnelColor(item.stage),
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground w-7 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Breakdown */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">CTA Breakdown</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#4B56F2" strokeWidth="4" strokeDasharray={`${MOCK_AUDIT.ctaBreakdown.with}, 100`}
                strokeDashoffset="25"
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground">{MOCK_AUDIT.ctaBreakdown.with}%</span>
              <span className="text-[10px] text-muted-foreground">With CTA</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 text-xs mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">{MOCK_AUDIT.ctaBreakdown.with}% With CTA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/10" />
                <span className="text-muted-foreground">{MOCK_AUDIT.ctaBreakdown.without}% No CTA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Only {MOCK_AUDIT.ctaBreakdown.with}% of posts include a call-to-action. Adding CTAs to awareness content could significantly improve conversion rates.
            </p>
          </div>
        </div>
      </div>

      {/* Gap Analysis Summary */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-primary rounded" />
          <h3 className="text-sm font-semibold text-foreground">Gap Analysis Summary</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <GapColumn title="Critical Gaps" color="#ef4444" items={MOCK_AUDIT.criticalGaps} />
          <GapColumn title="Over-Saturated" color="#f59e0b" items={MOCK_AUDIT.overSaturated} />
          <GapColumn title="Recommended Actions" color="#12B667" items={MOCK_AUDIT.recommendedActions} />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-foreground hover:bg-[#222] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onGoToActionHub} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all">
          Continue to Action Hub
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function useAuditContext() {
  return { audit: MOCK_AUDIT }
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

function FunnelDonut({ data }: { data: { top: number; middle: number; bottom: number } }) {
  const total = data.top + data.middle + data.bottom
  const topPct = (data.top / total) * 100
  const midPct = (data.middle / total) * 100

  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={getFunnelColor('top')} strokeWidth="4"
          strokeDasharray={`${topPct}, 100`}
          strokeDashoffset="0"
          strokeLinecap="butt"
        />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={getFunnelColor('middle')} strokeWidth="4"
          strokeDasharray={`${midPct}, 100`}
          strokeDashoffset={`-${topPct}`}
          strokeLinecap="butt"
        />
        <circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={getFunnelColor('bottom')} strokeWidth="4"
          strokeDasharray={`${100 - topPct - midPct}, 100`}
          strokeDashoffset={`-${topPct + midPct}`}
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{total}</span>
        <span className="text-[10px] text-muted-foreground">Posts</span>
      </div>
    </div>
  )
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

function GapColumn({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        <AlertTriangle className="w-3.5 h-3.5" style={{ color }} />
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <span style={{ color }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

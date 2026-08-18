export type Platform = 'youtube' | 'xiaohongshu' | 'weibo' | 'douyin' | 'wechat' | 'bilibili'
export type ContentType = 'short-video' | 'carousel' | 'social-post' | 'wechat-article'
export type FunnelStage = 'top' | 'middle' | 'bottom'

export interface AuditPlatform {
  id: string
  platform: Platform
  name: string
  handle: string
  postsCount: number
  enabled: boolean
  status: 'idle' | 'processing' | 'complete'
}

export interface AuditPost {
  id: string
  title: string
  date: Date
  platform: Platform
  contentType: ContentType
  funnelStage: FunnelStage
  engagement: number
}

export interface Audit {
  id: string
  name: string
  handle: string
  createdAt: Date
  dateRange: { start: Date; end: Date }
  platforms: AuditPlatform[]
  totalPosts: number
  avgEngagement: string
  postsWithCtas: string
  uniqueTopics: number
  profileScore: number
  followers: string
  growth: string
  engagements: string
  funnelBreakdown: { top: number; middle: number; bottom: number }
  contentTypeDistribution: Record<ContentType, number>
  topicCloud: { name: string; size: 'small' | 'medium' | 'large' }[]
  engagementByTopic: { rank: number; topic: string; score: number }[]
  engagementByContentType: { type: ContentType; percentage: number }[]
  engagementByFunnelStage: { stage: FunnelStage; percentage: number }[]
  ctaBreakdown: { with: number; without: number }
  criticalGaps: string[]
  overSaturated: string[]
  recommendedActions: string[]
  topPosts: { id: string; title: string; platform: Platform; contentType: ContentType; engagement: number; date: Date; hook: string }[]
}

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  'short-video': 'Short Video',
  carousel: 'Carousel',
  'social-post': 'Social Post',
  'wechat-article': 'WeChat Article',
}

const CONTENT_TYPE_COLORS: Record<ContentType, string> = {
  'short-video': '#4B56F2',
  carousel: '#06b6d4',
  'social-post': '#3b82f6',
  'wechat-article': '#07C160',
}

const FUNNEL_LABELS: Record<FunnelStage, string> = {
  top: 'Top Funnel',
  middle: 'Mid Funnel',
  bottom: 'Bottom Funnel',
}

const FUNNEL_COLORS: Record<FunnelStage, string> = {
  top: '#12B667',
  middle: '#f59e0b',
  bottom: '#ef4444',
}

export function getContentTypeLabel(type: ContentType): string {
  return CONTENT_TYPE_LABELS[type]
}

export function getContentTypeColor(type: ContentType): string {
  return CONTENT_TYPE_COLORS[type]
}

export function getFunnelLabel(stage: FunnelStage): string {
  return FUNNEL_LABELS[stage]
}

export function getFunnelColor(stage: FunnelStage): string {
  return FUNNEL_COLORS[stage]
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
}

export const MOCK_AUDIT: Audit = {
  id: 'audit-001',
  name: '@fashionbrand_official Audit',
  handle: '@fashionbrand_official',
  createdAt: new Date(),
  dateRange: { start: new Date(2025, 0, 1), end: new Date(2025, 2, 31) },
  platforms: [
    { id: 'p1', platform: 'youtube', name: 'YouTube', handle: '@fashionbrand', postsCount: 64, enabled: true, status: 'complete' },
    { id: 'p2', platform: 'xiaohongshu', name: 'Xiaohongshu', handle: '@fashionbrand_official', postsCount: 52, enabled: true, status: 'complete' },
    { id: 'p3', platform: 'weibo', name: 'Weibo', handle: '/fashionbrand', postsCount: 42, enabled: false, status: 'complete' },
  ],
  totalPosts: 158,
  avgEngagement: '2.4K',
  postsWithCtas: '23%',
  uniqueTopics: 14,
  profileScore: 91,
  followers: '245M',
  growth: '+2.1%',
  engagements: '18.7M',
  funnelBreakdown: { top: 72, middle: 20, bottom: 8 },
  contentTypeDistribution: {
    'short-video': 45,
    carousel: 32,
    'social-post': 56,
    'wechat-article': 12,
  },
  topicCloud: [
    { name: 'Summer Fashion', size: 'large' },
    { name: 'Behind the Scenes', size: 'medium' },
    { name: 'Product Launch', size: 'medium' },
    { name: 'Sustainability', size: 'small' },
    { name: 'Street Style', size: 'medium' },
    { name: 'Tutorials', size: 'small' },
    { name: 'User Generated', size: 'small' },
    { name: 'Seasonal', size: 'small' },
  ],
  engagementByTopic: [
    { rank: 1, topic: 'Summer Fashion', score: 8.4 },
    { rank: 2, topic: 'Sustainability', score: 7.2 },
    { rank: 3, topic: 'Street Style', score: 6.9 },
    { rank: 4, topic: 'Tutorials', score: 5.5 },
    { rank: 5, topic: 'Product Launch', score: 4.8 },
  ],
  engagementByContentType: [
    { type: 'short-video', percentage: 34 },
    { type: 'carousel', percentage: 22 },
    { type: 'social-post', percentage: 24 },
    { type: 'wechat-article', percentage: 20 },
  ],
  engagementByFunnelStage: [
    { stage: 'top', percentage: 52 },
    { stage: 'middle', percentage: 31 },
    { stage: 'bottom', percentage: 17 },
  ],
  ctaBreakdown: { with: 23, without: 77 },
  criticalGaps: [
    'Low conversion stage content',
    'Insufficient CTAs on TikTok',
  ],
  overSaturated: [
    'Excessive Awareness posts (72%)',
    'Repetitive Summer Fashion tags',
  ],
  recommendedActions: [
    'Repurpose Awareness to Mid-funnel',
    'Add direct links to bio in carousels',
  ],
  topPosts: [
    {
      id: 'top-1',
      title: 'Weekly Motivation',
      platform: 'youtube',
      contentType: 'short-video',
      engagement: 9840,
      date: new Date(2025, 2, 15),
      hook: '"Your only limit is your mind." 6-second hook that exploded in views.',
    },
    {
      id: 'top-2',
      title: 'Summer Training Tips',
      platform: 'xiaohongshu',
      contentType: 'carousel',
      engagement: 8720,
      date: new Date(2025, 2, 10),
      hook: '5-slide carousel with before/after transformation. 8.7K likes.',
    },
    {
      id: 'top-3',
      title: 'Performance Tech Explained',
      platform: 'youtube',
      contentType: 'short-video',
      engagement: 7650,
      date: new Date(2025, 1, 28),
      hook: 'Product demo short clip with text overlays. 7.6K interactions.',
    },
    {
      id: 'top-4',
      title: 'New Arrivals Showcase',
      platform: 'xiaohongshu',
      contentType: 'carousel',
      engagement: 6980,
      date: new Date(2025, 1, 20),
      hook: 'Product launch carousel with swipe-to-shop. 6.9K saves.',
    },
    {
      id: 'top-5',
      title: 'Running Form Tips',
      platform: 'youtube',
      contentType: 'short-video',
      engagement: 6240,
      date: new Date(2025, 0, 15),
      hook: 'Tutorial-style short clip with on-screen graphics. 6.2K shares.',
    },
    {
      id: 'top-6',
      title: 'Brand Announcement',
      platform: 'weibo',
      contentType: 'social-post',
      engagement: 5890,
      date: new Date(2025, 0, 8),
      hook: 'Bold typography announcement with brand colors. 5.8K comments.',
    },
  ],
}

const POST_TITLES: Record<ContentType, string[]> = {
  'short-video': ['Weekly Motivation', 'Running Form Tips', 'Performance Tech Explained'],
  carousel: ['Summer Training Tips', 'Summer Sale Preview', 'New Arrivals Showcase'],
  'social-post': ['Brand Announcement', 'Seasonal Greeting', 'Community Spotlight', 'Quick Update', 'Community Post', 'Shareable Moment'],
  'wechat-article': ['Deep Dive: Training Science', 'Seasonal Gear Guide', 'Behind the Brand Story'],
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function generateAuditPosts(audit: Audit): AuditPost[] {
  const posts: AuditPost[] = []
  const rand = seededRandom(42)
  const contentTypes: ContentType[] = ['short-video', 'carousel', 'social-post', 'wechat-article']
  const funnelStages: FunnelStage[] = ['top', 'middle', 'bottom']

  const startDate = audit.dateRange.start
  const endDate = audit.dateRange.end
  const daysInRange = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  let idCounter = 0
  for (const platform of audit.platforms) {
    if (!platform.enabled) continue
    const postsCount = platform.postsCount
    for (let i = 0; i < postsCount; i++) {
      const ctIndex = Math.floor(rand() * contentTypes.length)
      const contentType = contentTypes[ctIndex]
      const funnelIndex = rand() < 0.72 ? 0 : rand() < 0.92 ? 1 : 2
      const titleOptions = POST_TITLES[contentType]
      const title = titleOptions[Math.floor(rand() * titleOptions.length)]
      const dayOffset = Math.floor(rand() * daysInRange)
      const postDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000)

      posts.push({
        id: `post-${idCounter++}`,
        title,
        date: postDate,
        platform: platform.platform,
        contentType,
        funnelStage: funnelStages[funnelIndex],
        engagement: Math.floor(rand() * 10000) + 500,
      })
    }
  }

  return posts.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const MOCK_SAVED_AUDITS = [
  {
    id: 'saved-1',
    url: 'linkedin.com/company/nexora',
    dateRange: 'Last 30 Days',
    profileScore: 82,
    followers: '12.4K',
    growth: '+8.2%',
    engagements: '3.1K',
  },
  {
    id: 'saved-2',
    url: 'instagram.com/velocity.athletics',
    dateRange: 'Last 90 Days',
    profileScore: 91,
    followers: '245M',
    growth: '+2.1%',
    engagements: '18.7M',
  },
  {
    id: 'saved-3',
    url: 'tiktok.com/@aurea.studio',
    dateRange: 'Last 6 Months',
    profileScore: 74,
    followers: '21.3M',
    growth: '+15.4%',
    engagements: '8.9M',
  },
]

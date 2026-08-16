import { useState } from 'react';
import {
  Flag,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Layout,
  Check,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  BarChart3,
  Grid3x3,
  List,
} from 'lucide-react';
import { CreateCampaignPage } from './create-campaign-page';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = 'Blog Post' | 'Social Post' | 'Short Video' | 'Carousel' | 'Email';
type ContentStatus = 'draft' | 'generating' | 'ready-for-review' | 'approved' | 'published' | 'rejected';
type FunnelStage = 'Awareness' | 'Consideration' | 'Decision' | 'Retention';

interface ContentItem {
  id: number;
  topic: string;
  type: ContentType;
  status: ContentStatus;
  scheduledDate: string;
  funnelStage: FunnelStage;
}

interface Campaign {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  color: string;
  contentItems: ContentItem[];
  funnelDistribution: {
    awareness: number;
    consideration: number;
    decision: number;
    retention: number;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'Summer Collection Launch',
    description: 'Multi-channel campaign promoting new summer athletic wear and performance gear',
    startDate: 'Jun 1, 2026',
    endDate: 'Aug 31, 2026',
    color: '#F97316',
    funnelDistribution: { awareness: 40, consideration: 30, decision: 20, retention: 10 },
    contentItems: [
      {
        id: 101,
        topic: 'Summer Collection Teaser',
        type: 'Social Post',
        status: 'approved',
        scheduledDate: 'Jun 1, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 102,
        topic: 'Product Features Deep Dive',
        type: 'Blog Post',
        status: 'ready-for-review',
        scheduledDate: 'Jun 5, 2026',
        funnelStage: 'Consideration',
      },
      {
        id: 103,
        topic: 'Summer Training Tips',
        type: 'Short Video',
        status: 'approved',
        scheduledDate: 'Jun 8, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 104,
        topic: 'Limited Time Offer Announcement',
        type: 'Social Post',
        status: 'draft',
        scheduledDate: 'Jun 12, 2026',
        funnelStage: 'Decision',
      },
      {
        id: 105,
        topic: 'Customer Success Stories',
        type: 'Carousel',
        status: 'generating',
        scheduledDate: 'Jun 15, 2026',
        funnelStage: 'Decision',
      },
      {
        id: 106,
        topic: 'Athlete Testimonials',
        type: 'Short Video',
        status: 'approved',
        scheduledDate: 'Jun 18, 2026',
        funnelStage: 'Consideration',
      },
      {
        id: 107,
        topic: 'Style Guide: Summer Looks',
        type: 'Blog Post',
        status: 'ready-for-review',
        scheduledDate: 'Jun 22, 2026',
        funnelStage: 'Consideration',
      },
      {
        id: 108,
        topic: 'New Member Welcome',
        type: 'Email',
        status: 'approved',
        scheduledDate: 'Jun 25, 2026',
        funnelStage: 'Retention',
      },
      {
        id: 109,
        topic: 'Flash Sale Alert',
        type: 'Social Post',
        status: 'draft',
        scheduledDate: 'Jun 28, 2026',
        funnelStage: 'Decision',
      },
      {
        id: 110,
        topic: 'Behind the Design',
        type: 'Short Video',
        status: 'draft',
        scheduledDate: 'Jul 1, 2026',
        funnelStage: 'Awareness',
      },
    ],
  },
  {
    id: 2,
    name: 'Brand Awareness Q2',
    description: 'Educational content series focused on athletic performance and training techniques',
    startDate: 'Apr 1, 2026',
    endDate: 'Jun 30, 2026',
    color: '#8B5CF6',
    funnelDistribution: { awareness: 60, consideration: 25, decision: 10, retention: 5 },
    contentItems: [
      {
        id: 201,
        topic: 'Marathon Training Guide',
        type: 'Blog Post',
        status: 'approved',
        scheduledDate: 'Apr 5, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 202,
        topic: 'Nutrition for Athletes',
        type: 'Short Video',
        status: 'approved',
        scheduledDate: 'Apr 12, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 203,
        topic: 'Recovery Techniques',
        type: 'Carousel',
        status: 'approved',
        scheduledDate: 'Apr 19, 2026',
        funnelStage: 'Consideration',
      },
      {
        id: 204,
        topic: 'Equipment Recommendations',
        type: 'Blog Post',
        status: 'ready-for-review',
        scheduledDate: 'Apr 26, 2026',
        funnelStage: 'Consideration',
      },
      {
        id: 205,
        topic: 'Spring Motivation',
        type: 'Social Post',
        status: 'approved',
        scheduledDate: 'May 3, 2026',
        funnelStage: 'Awareness',
      },
    ],
  },
  {
    id: 3,
    name: 'Back to School 2026',
    description: 'Target students and young professionals with performance gear for fall season',
    startDate: 'Aug 15, 2026',
    endDate: 'Sep 30, 2026',
    color: '#4B56F2',
    funnelDistribution: { awareness: 35, consideration: 30, decision: 25, retention: 10 },
    contentItems: [
      {
        id: 301,
        topic: 'Back to School Essentials',
        type: 'Blog Post',
        status: 'draft',
        scheduledDate: 'Aug 15, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 302,
        topic: 'Student Athlete Spotlight',
        type: 'Short Video',
        status: 'draft',
        scheduledDate: 'Aug 20, 2026',
        funnelStage: 'Awareness',
      },
      {
        id: 303,
        topic: 'Fall Collection Preview',
        type: 'Carousel',
        status: 'generating',
        scheduledDate: 'Aug 25, 2026',
        funnelStage: 'Consideration',
      },
    ],
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'Blog Post':
      return FileText;
    case 'Social Post':
      return MessageSquare;
    case 'Short Video':
      return Video;
    case 'Carousel':
      return Layout;
    case 'Email':
      return MessageSquare;
    default:
      return FileText;
  }
};

const getContentTypeColor = (type: ContentType) => {
  switch (type) {
    case 'Blog Post':
      return '#60A5FA';
    case 'Social Post':
      return '#F472B6';
    case 'Short Video':
      return '#34D399';
    case 'Carousel':
      return '#A78BFA';
    case 'Email':
      return '#FBBF24';
    default:
      return '#9CA3AF';
  }
};

const getStatusBadge = (status: ContentStatus) => {
  switch (status) {
    case 'draft':
      return { label: 'Draft', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    case 'generating':
      return { label: 'Generating', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    case 'ready-for-review':
      return { label: 'Ready', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    case 'approved':
      return { label: 'Approved', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    case 'published':
      return { label: 'Published', color: 'bg-[#4B56F2]/10 text-[#818CFF] border-[#4B56F2]/20' };
    case 'rejected':
      return { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    default:
      return { label: status, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  }
};

const getFunnelStageColor = (stage: FunnelStage) => {
  switch (stage) {
    case 'Awareness':
      return '#60A5FA';
    case 'Consideration':
      return '#FBBF24';
    case 'Decision':
      return '#4B56F2';
    case 'Retention':
      return '#8B5CF6';
    default:
      return '#9CA3AF';
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export function CampaignsView() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const toggleCampaign = (id: number) => {
    setExpandedCampaign(expandedCampaign === id ? null : id);
  };

  const getApprovalStatus = (items: ContentItem[]) => {
    const approved = items.filter((item) => item.status === 'approved').length;
    const total = items.length;
    return { approved, total };
  };

  const handleCampaignCreated = () => {
    setShowCreateCampaign(false);
    // In a real app, you would refresh the campaigns list here
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show campaign creation page if active
  if (showCreateCampaign) {
    return <CreateCampaignPage onComplete={handleCampaignCreated} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            View and manage campaigns within this project
          </p>
        </div>
        <button
          onClick={() => setShowCreateCampaign(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      {/* Search and View Toggle */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const isExpanded = expandedCampaign === campaign.id;
          const { approved, total } = getApprovalStatus(campaign.contentItems);

          return (
            <div key={campaign.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Campaign Header - Clickable */}
              <div
                onClick={() => toggleCampaign(campaign.id)}
                className="p-6 cursor-pointer hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  {/* Left: Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${campaign.color}20` }}>
                        <Flag className="w-5 h-5" style={{ color: campaign.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{campaign.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      {/* Date Range */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {campaign.startDate} – {campaign.endDate}
                        </span>
                      </div>

                      {/* Content Count */}
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{total} items</span>
                      </div>

                      {/* Approval Status */}
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-foreground font-medium">
                          {approved} of {total} approved
                        </span>
                      </div>
                    </div>

                    {/* Funnel Distribution Bar */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Funnel Stage Distribution</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${campaign.funnelDistribution.awareness}%`,
                            backgroundColor: getFunnelStageColor('Awareness'),
                          }}
                        />
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${campaign.funnelDistribution.consideration}%`,
                            backgroundColor: getFunnelStageColor('Consideration'),
                          }}
                        />
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${campaign.funnelDistribution.decision}%`,
                            backgroundColor: getFunnelStageColor('Decision'),
                          }}
                        />
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${campaign.funnelDistribution.retention}%`,
                            backgroundColor: getFunnelStageColor('Retention'),
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getFunnelStageColor('Awareness') }} />
                          <span className="text-muted-foreground">Awareness {campaign.funnelDistribution.awareness}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getFunnelStageColor('Consideration') }} />
                          <span className="text-muted-foreground">Consideration {campaign.funnelDistribution.consideration}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getFunnelStageColor('Decision') }} />
                          <span className="text-muted-foreground">Decision {campaign.funnelDistribution.decision}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getFunnelStageColor('Retention') }} />
                          <span className="text-muted-foreground">Retention {campaign.funnelDistribution.retention}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Expand/Collapse Button */}
                  <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content Items */}
              {isExpanded && (
                <div className="border-t border-border bg-secondary/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-foreground">Campaign Content Items</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BarChart3 className="w-4 h-4" />
                        {campaign.contentItems.length} total items
                      </div>
                    </div>

                    {/* Content Items Grid/List */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-3 gap-4">
                        {campaign.contentItems.map((item) => {
                          const Icon = getContentTypeIcon(item.type);
                          const color = getContentTypeColor(item.type);
                          const statusBadge = getStatusBadge(item.status);

                          return (
                            <div
                              key={item.id}
                              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: `${color}20`, color }}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className={`px-2 py-0.5 rounded-full border text-xs font-medium ${statusBadge.color}`}>
                                  {statusBadge.label}
                                </div>
                              </div>
                              <h5 className="text-sm font-medium text-foreground mb-2 line-clamp-2">{item.topic}</h5>
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {item.scheduledDate}
                                </div>
                                <div
                                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${getFunnelStageColor(item.funnelStage)}20`,
                                    color: getFunnelStageColor(item.funnelStage),
                                  }}
                                >
                                  {item.funnelStage}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {campaign.contentItems.map((item) => {
                          const Icon = getContentTypeIcon(item.type);
                          const color = getContentTypeColor(item.type);
                          const statusBadge = getStatusBadge(item.status);

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg hover:bg-secondary/30 transition-colors"
                            >
                              {/* Icon */}
                              <div className="p-2 rounded" style={{ backgroundColor: `${color}20`, color }}>
                                <Icon className="w-4 h-4" />
                              </div>

                              {/* Topic */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.topic}</p>
                              </div>

                              {/* Type */}
                              <div className="text-xs text-muted-foreground">{item.type}</div>

                              {/* Scheduled Date */}
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {item.scheduledDate}
                              </div>

                              {/* Funnel Stage */}
                              <div
                                className="px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${getFunnelStageColor(item.funnelStage)}20`,
                                  color: getFunnelStageColor(item.funnelStage),
                                }}
                              >
                                {item.funnelStage}
                              </div>

                              {/* Status */}
                              <div className={`px-2 py-1 rounded-full border text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-6 bg-card border border-border rounded-full mb-6">
            <Flag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery ? 'Try adjusting your search' : 'Create your first campaign to get started'}
          </p>
        </div>
      )}

      {/* Helper Note */}
      {campaigns.length > 0 && (
        <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-400">
            Campaigns group related content items by marketing initiative. Click any campaign to expand and view its content items, status, and funnel distribution.
          </p>
        </div>
      )}
    </div>
  );
}

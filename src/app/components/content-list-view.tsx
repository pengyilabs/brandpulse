import { useState } from 'react';
import { Video, FileText, Image as ImageIcon, MessageSquare, Sparkles, ChevronDown } from 'lucide-react';

interface ContentItem {
  id: number;
  date: string;
  contentType: 'blog' | 'video' | 'image' | 'social' | 'clips';
  title: string;
  funnelStage: 'awareness' | 'consideration' | 'decision';
  campaignName: string;
  status: 'draft' | 'approved' | 'rejected';
  isOneOff?: boolean;
}

interface ContentListViewProps {
  projectId: number;
  contentItems?: any[];
  campaigns?: any[];
}

export function ContentListView({ projectId, contentItems: propsContentItems, campaigns: propsCampaigns }: ContentListViewProps) {
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'status'>('date');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const defaultContentItems: ContentItem[] = [
    {
      id: 1,
      date: '2026-05-20',
      contentType: 'video',
      title: 'Product Demo: New Features Walkthrough',
      funnelStage: 'awareness',
      campaignName: 'Q3 Product Launch',
      status: 'approved',
    },
    {
      id: 2,
      date: '2026-05-22',
      contentType: 'blog',
      title: 'How to Get Started with Our Platform',
      funnelStage: 'consideration',
      campaignName: 'Q3 Product Launch',
      status: 'draft',
    },
    {
      id: 3,
      date: '2026-05-23',
      contentType: 'social',
      title: 'Customer Success Story - TechCorp',
      funnelStage: 'decision',
      campaignName: 'Summer Social Blitz',
      status: 'approved',
    },
    {
      id: 4,
      date: '2026-05-25',
      contentType: 'clips',
      title: 'Quick Tips: 5 Productivity Hacks',
      funnelStage: 'awareness',
      campaignName: 'Summer Social Blitz',
      status: 'draft',
      isOneOff: true,
    },
    {
      id: 5,
      date: '2026-05-26',
      contentType: 'image',
      title: 'Motivational Quote: Success Mindset',
      funnelStage: 'awareness',
      campaignName: 'One-Off Content',
      status: 'approved',
      isOneOff: true,
    },
  ];

  const contentItems = propsContentItems ? propsContentItems.map(item => {
    const campaign = propsCampaigns?.find(c => c.id === item.campaignId);
    return {
      id: item.id,
      date: `2026-05-${String(item.day).padStart(2, '0')}`,
      contentType: item.type,
      title: item.title,
      funnelStage: item.funnelStage?.toLowerCase(),
      campaignName: campaign ? campaign.name : 'One-Off Content',
      status: item.status,
      isOneOff: !item.campaignId,
    };
  }) : defaultContentItems;

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-green-500" />;
      case 'blog':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-purple-500" />;
      case 'social':
        return <MessageSquare className="w-4 h-4 text-pink-500" />;
      case 'clips':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'draft':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getFunnelStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness':
        return 'bg-blue-500/10 text-blue-400';
      case 'consideration':
        return 'bg-amber-500/10 text-amber-400';
      case 'decision':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const filteredItems = contentItems.filter((item) => {
    if (filterCampaign !== 'all' && item.campaignName !== filterCampaign) return false;
    if (filterType !== 'all' && item.contentType !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'border-l-4 border-l-green-500';
      case 'rejected':
        return 'opacity-50';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={filterCampaign}
          onChange={(e) => setFilterCampaign(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
        >
          <option value="all">All Campaigns</option>
          {propsCampaigns?.map((campaign) => (
            <option key={campaign.id} value={campaign.name}>
              {campaign.name}
            </option>
          ))}
          <option value="One-Off Content">One-Off Content</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
        >
          <option value="all">All Types</option>
          <option value="video">Videos</option>
          <option value="blog">Blog Posts</option>
          <option value="social">Social Posts</option>
          <option value="clips">Clips & Shorts</option>
          <option value="image">Images</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Funnel Stage</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Campaign</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer ${getApprovalStatusColor(item.status)}`}
              >
                <td className="px-4 py-3 text-sm text-foreground">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getContentIcon(item.contentType)}
                    <span className="text-sm text-foreground capitalize">{item.contentType}</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-sm text-foreground ${item.status === 'rejected' ? 'line-through' : ''}`}>
                  {item.title}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFunnelStageColor(item.funnelStage)}`}>
                    {item.funnelStage}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {item.campaignName}
                  {item.isOneOff && (
                    <span className="ml-2 text-xs text-muted-foreground">(one-off)</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

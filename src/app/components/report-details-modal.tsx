import * as Dialog from '@radix-ui/react-dialog';
import { X, Download, TrendingUp, BarChart3, AlertTriangle, Lightbulb, Check, AlertCircle } from 'lucide-react';

interface Report {
  id: number;
  type: 'initial' | 'ongoing';
  title: string;
  date: string;
  projectName: string;
}

interface ReportDetailsModalProps {
  report: Report;
  onClose: () => void;
}

export function ReportDetailsModal({ report, onClose }: ReportDetailsModalProps) {
  const handleExport = () => {
    alert(`Exporting ${report.title} as PDF...`);
  };

  const isInitial = report.type === 'initial';

  // Mock data for initial report
  const initialData = {
    totalContent: 247,
    contentByPlatform: [
      { platform: 'Instagram', count: 132 },
      { platform: 'YouTube', count: 45 },
      { platform: 'Facebook', count: 58 },
      { platform: 'TikTok', count: 12 },
    ],
    contentTypeBreakdown: [
      { type: 'Static Images', count: 98, percentage: 40 },
      { type: 'Carousels', count: 34, percentage: 14 },
      { type: 'Short Videos', count: 12, percentage: 5 },
      { type: 'Long-form Videos', count: 45, percentage: 18 },
      { type: 'Stories', count: 58, percentage: 23 },
    ],
    funnelDistribution: [
      { stage: 'Awareness', count: 167, percentage: 68, color: 'bg-blue-500' },
      { stage: 'Consideration', count: 62, percentage: 25, color: 'bg-purple-500' },
      { stage: 'Conversion', count: 18, percentage: 7, color: 'bg-green-500' },
    ],
    gaps: [
      'No short-form video content detected on Instagram Reels',
      'Limited bottom-of-funnel conversion posts',
      'No blog content linked from social profiles',
      'Missing quote cards for audience engagement',
      'No consistent posting schedule on TikTok',
    ],
    recommendations: [
      'Add 2-3 Instagram Reels per week to capitalize on short-form video trends',
      'Create product comparison posts and case studies for consideration stage',
      'Develop quote cards from existing long-form content for higher engagement',
      'Establish consistent TikTok posting schedule (3-5 posts per week)',
      'Add clear CTAs to 20% of content to drive conversions',
    ],
  };

  // Mock data for ongoing report
  const ongoingData = {
    totalPlanned: 30,
    totalDelivered: 29,
    complianceRate: 97,
    contentTypeComparison: [
      { type: 'Blog Posts', planned: 4, delivered: 4, status: 'met' as const },
      { type: 'Short Clips', planned: 8, delivered: 6, status: 'under' as const },
      { type: 'Instagram Carousels', planned: 6, delivered: 7, status: 'over' as const },
      { type: 'Quote Cards', planned: 10, delivered: 10, status: 'met' as const },
      { type: 'Long-form Videos', planned: 2, delivered: 2, status: 'met' as const },
    ],
    funnelComparison: [
      { stage: 'Awareness', planned: 18, delivered: 16, color: 'bg-blue-500' },
      { stage: 'Consideration', planned: 8, delivered: 9, color: 'bg-purple-500' },
      { stage: 'Conversion', planned: 4, delivered: 4, color: 'bg-green-500' },
    ],
    campaignSummaries: [
      { name: 'Spring Product Launch', planned: 12, delivered: 11, color: 'bg-pink-500' },
      { name: 'Brand Awareness Series', planned: 10, delivered: 10, color: 'bg-blue-500' },
      { name: 'Customer Success Stories', planned: 8, delivered: 8, color: 'bg-green-500' },
    ],
  };

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {report.title}
                </Dialog.Title>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isInitial
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-green-500/10 text-green-500'
                  }`}
                >
                  {isInitial ? 'Initial Audit' : 'Monthly Report'}
                </span>
              </div>
              <Dialog.Description className="text-xs text-muted-foreground">
                {report.projectName} • Created on {new Date(report.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors text-foreground flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <Dialog.Close asChild>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {isInitial ? (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-1">Total Content</p>
                    <p className="text-2xl font-bold text-foreground">{initialData.totalContent}</p>
                  </div>
                  {initialData.contentByPlatform.slice(0, 3).map((platform) => (
                    <div key={platform.platform} className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">{platform.platform}</p>
                      <p className="text-2xl font-bold text-foreground">{platform.count}</p>
                    </div>
                  ))}
                </div>

                {/* Content Type Breakdown */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Content Type Breakdown</h3>
                  <div className="space-y-3">
                    {initialData.contentTypeBreakdown.map((item) => (
                      <div key={item.type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-foreground">{item.type}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funnel Distribution */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Funnel Stage Distribution</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {initialData.funnelDistribution.map((stage) => (
                      <div key={stage.stage} className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <p className="text-xs font-medium text-foreground">{stage.stage}</p>
                        </div>
                        <p className="text-xl font-bold text-foreground">{stage.count}</p>
                        <p className="text-xs text-muted-foreground">{stage.percentage}% of total</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gaps */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-semibold text-foreground">Identified Gaps</h3>
                  </div>
                  <ul className="space-y-2">
                    {initialData.gaps.map((gap, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-semibold text-foreground">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {initialData.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="p-5 bg-card border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">Overall Performance</h3>
                      <p className="text-xs text-muted-foreground">
                        Deliverable compliance for this period
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground">{ongoingData.complianceRate}%</p>
                      <p className="text-xs text-muted-foreground">Compliance rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-muted-foreground">Planned: </span>
                      <span className="font-semibold text-foreground">{ongoingData.totalPlanned}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivered: </span>
                      <span className="font-semibold text-foreground">{ongoingData.totalDelivered}</span>
                    </div>
                  </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Content Type Breakdown</h3>
                  <div className="space-y-2">
                    {ongoingData.contentTypeComparison.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{item.type}</span>
                            {item.status === 'met' ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : item.status === 'under' ? (
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Planned: <span className="font-medium text-foreground">{item.planned}</span>
                            </span>
                            <span>
                              Delivered: <span className="font-medium text-foreground">{item.delivered}</span>
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-2.5 py-1 rounded text-xs font-medium ${
                            item.status === 'met'
                              ? 'bg-green-500/10 text-green-500'
                              : item.status === 'under'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {item.status === 'met' ? '✓' : item.status === 'under' ? `-${item.planned - item.delivered}` : `+${item.delivered - item.planned}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funnel Stage Comparison */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Funnel Stage Distribution</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {ongoingData.funnelComparison.map((stage) => (
                      <div key={stage.stage} className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <p className="text-xs font-medium text-foreground">{stage.stage}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Planned</span>
                            <span className="font-semibold text-foreground">{stage.planned}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Delivered</span>
                            <span className="font-semibold text-foreground">{stage.delivered}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Summary */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Campaign Performance</h3>
                  <div className="space-y-2">
                    {ongoingData.campaignSummaries.map((campaign) => (
                      <div key={campaign.name} className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                        <div className={`w-1 h-12 rounded-full ${campaign.color} flex-shrink-0`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">{campaign.name}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              Planned: <span className="font-medium text-foreground">{campaign.planned}</span>
                            </span>
                            <span>
                              Delivered: <span className="font-medium text-foreground">{campaign.delivered}</span>
                            </span>
                          </div>
                        </div>
                        {campaign.delivered >= campaign.planned ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Loader2, ExternalLink, Instagram, Youtube, Facebook, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface InitialReportModalProps {
  projectName: string;
  onClose: () => void;
  onComplete: () => void;
}

interface PlatformUrl {
  platform: string;
  url: string;
  icon: React.ElementType;
}

interface ScanResults {
  totalContent: number;
  contentByPlatform: { platform: string; count: number }[];
  contentTypeBreakdown: { type: string; count: number; percentage: number }[];
  funnelDistribution: { stage: string; count: number; percentage: number; color: string }[];
  gaps: string[];
  recommendations: string[];
}

export function InitialReportModal({ projectName, onClose, onComplete }: InitialReportModalProps) {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [platformUrls, setPlatformUrls] = useState<PlatformUrl[]>([
    { platform: 'Instagram', url: '', icon: Instagram },
    { platform: 'YouTube', url: '', icon: Youtube },
    { platform: 'Facebook', url: '', icon: Facebook },
    { platform: 'TikTok', url: '', icon: TrendingUp },
  ]);

  // Mock scan results - in production, this would come from actual API analysis
  const scanResults: ScanResults = {
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
      'Create carousel posts breaking down complex topics',
    ],
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...platformUrls];
    newUrls[index].url = value;
    setPlatformUrls(newUrls);
  };

  const handleScan = () => {
    setScanning(true);
    // Simulate API call
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  const handleExport = () => {
    alert('Exporting report as PDF...');
  };

  const hasUrls = platformUrls.some((p) => p.url.trim() !== '');

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Initial Content Audit
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                {projectName}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {!scanComplete ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Social Media Profiles</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Enter the client's social media profile URLs to analyze their existing content
                  </p>
                  <div className="space-y-3">
                    {platformUrls.map((platform, index) => {
                      const Icon = platform.icon;
                      return (
                        <div key={platform.platform} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-foreground mb-1">
                              {platform.platform}
                            </label>
                            <input
                              type="url"
                              value={platform.url}
                              onChange={(e) => handleUrlChange(index, e.target.value)}
                              placeholder={`https://${platform.platform.toLowerCase()}.com/username`}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {scanning && (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
                    <p className="text-sm font-medium text-foreground mb-1">Scanning content...</p>
                    <p className="text-xs text-muted-foreground">
                      Analyzing posts, content types, and funnel stages
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <p className="text-xs text-muted-foreground mb-1">Total Content</p>
                    <p className="text-2xl font-bold text-foreground">{scanResults.totalContent}</p>
                  </div>
                  {scanResults.contentByPlatform.slice(0, 3).map((platform) => (
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
                    {scanResults.contentTypeBreakdown.map((item) => (
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
                    {scanResults.funnelDistribution.map((stage) => (
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
                    {scanResults.gaps.map((gap, index) => (
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
                    {scanResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              {scanComplete && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  Export Report
                </button>
              )}
              {!scanComplete && (
                <button
                  onClick={handleScan}
                  disabled={!hasUrls || scanning}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    'Analyze Content'
                  )}
                </button>
              )}
              {scanComplete && (
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Report
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

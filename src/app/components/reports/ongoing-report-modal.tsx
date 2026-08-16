import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Check, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface OngoingReportModalProps {
  projectName: string;
  onClose: () => void;
  onComplete: () => void;
}

interface ContentTypeComparison {
  type: string;
  planned: number;
  delivered: number;
  status: 'met' | 'under' | 'over';
}

interface FunnelComparison {
  stage: string;
  planned: number;
  delivered: number;
  color: string;
}

interface CampaignSummary {
  name: string;
  planned: number;
  delivered: number;
  color: string;
}

export function OngoingReportModal({ projectName, onClose, onComplete }: OngoingReportModalProps) {
  const [selectedMonth, setSelectedMonth] = useState('2026-05');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Mock data - in production, this would be calculated from actual campaign and content data
  const contentTypeComparison: ContentTypeComparison[] = [
    { type: 'Blog Posts', planned: 4, delivered: 4, status: 'met' },
    { type: 'Short Clips', planned: 8, delivered: 6, status: 'under' },
    { type: 'Instagram Carousels', planned: 6, delivered: 7, status: 'over' },
    { type: 'Quote Cards', planned: 10, delivered: 10, status: 'met' },
    { type: 'Long-form Videos', planned: 2, delivered: 2, status: 'met' },
  ];

  const funnelComparison: FunnelComparison[] = [
    { stage: 'Awareness', planned: 18, delivered: 16, color: 'bg-blue-500' },
    { stage: 'Consideration', planned: 8, delivered: 9, color: 'bg-purple-500' },
    { stage: 'Conversion', planned: 4, delivered: 4, color: 'bg-green-500' },
  ];

  const campaignSummaries: CampaignSummary[] = [
    { name: 'Spring Product Launch', planned: 12, delivered: 11, color: 'bg-pink-500' },
    { name: 'Brand Awareness Series', planned: 10, delivered: 10, color: 'bg-blue-500' },
    { name: 'Customer Success Stories', planned: 8, delivered: 8, color: 'bg-green-500' },
  ];

  const totalPlanned = contentTypeComparison.reduce((sum, item) => sum + item.planned, 0);
  const totalDelivered = contentTypeComparison.reduce((sum, item) => sum + item.delivered, 0);
  const complianceRate = Math.round((totalDelivered / totalPlanned) * 100);

  const handleGenerateReport = () => {
    setReportGenerated(true);
  };

  const handleExport = () => {
    alert('Exporting monthly report as PDF...');
  };

  const months = [
    { value: '2026-06', label: 'June 2026' },
    { value: '2026-05', label: 'May 2026' },
    { value: '2026-04', label: 'April 2026' },
    { value: '2026-03', label: 'March 2026' },
    { value: '2026-02', label: 'February 2026' },
    { value: '2026-01', label: 'January 2026' },
  ];

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Monthly Performance Report
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
            {!reportGenerated ? (
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Month
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This report will compare planned content vs. actual delivered content for{' '}
                    {months.find((m) => m.value === selectedMonth)?.label}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="p-5 bg-card border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {months.find((m) => m.value === selectedMonth)?.label} Summary
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Overall deliverable compliance
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground">{complianceRate}%</p>
                      <p className="text-xs text-muted-foreground">Compliance rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-muted-foreground">Planned: </span>
                      <span className="font-semibold text-foreground">{totalPlanned}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivered: </span>
                      <span className="font-semibold text-foreground">{totalDelivered}</span>
                    </div>
                  </div>
                </div>

                {/* Content Type Breakdown */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Content Type Breakdown
                  </h3>
                  <div className="space-y-2">
                    {contentTypeComparison.map((item) => (
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
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Funnel Stage Distribution
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {funnelComparison.map((stage) => (
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
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Campaign Performance
                  </h3>
                  <div className="space-y-2">
                    {campaignSummaries.map((campaign) => (
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

                {/* Contractual Compliance */}
                <div className="border border-border rounded-lg p-5 bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Contractual Deliverable Compliance
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {contentTypeComparison.map((item) => (
                      <div
                        key={item.type}
                        className={`p-3 rounded-lg border ${
                          item.status === 'met'
                            ? 'bg-green-500/5 border-green-500/20'
                            : 'bg-orange-500/5 border-orange-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">{item.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.planned} planned, {item.delivered} delivered
                            </p>
                          </div>
                          {item.status === 'met' ? (
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
              {reportGenerated && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  Export Report
                </button>
              )}
              {!reportGenerated ? (
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Generate Report
                </button>
              ) : (
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

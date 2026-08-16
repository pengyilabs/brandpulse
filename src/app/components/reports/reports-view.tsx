import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Download, Calendar, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { InitialReportModal } from './initial-report-modal';
import { OngoingReportModal } from './ongoing-report-modal';
import { ReportDetailsModal } from './report-details-modal';

interface Report {
  id: number;
  type: 'initial' | 'ongoing';
  title: string;
  date: string;
  projectName: string;
}

interface ReportsViewProps {
  projectId: number;
  projectName: string;
}

export function ReportsView({ projectId, projectName }: ReportsViewProps) {
  const { t } = useTranslation();
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showOngoingModal, setShowOngoingModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Mock data - in production, this would come from your backend
  const reports: Report[] = [
    {
      id: 1,
      type: 'initial',
      title: 'Initial Content Audit',
      date: '2026-05-15',
      projectName: projectName,
    },
    {
      id: 2,
      type: 'ongoing',
      title: 'May 2026 Performance Report',
      date: '2026-05-31',
      projectName: projectName,
    },
    {
      id: 3,
      type: 'ongoing',
      title: 'April 2026 Performance Report',
      date: '2026-04-30',
      projectName: projectName,
    },
  ];

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleExportReport = (reportId: number) => {
    alert(`Exporting report ${reportId} as PDF...`);
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">{t('reports.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('reports.clientAudits', { projectName })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInitialModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                {t('reports.newInitialAudit')}
              </button>
              <button
                onClick={() => setShowOngoingModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                {t('reports.newMonthlyReport')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="px-8 py-6 border-b border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 border border-border rounded-lg bg-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('reports.initialContentAudit')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('reports.initialAuditDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInitialModal(true)}
              className="w-full mt-3 px-3 py-2 bg-accent text-foreground rounded-md text-xs font-medium hover:bg-accent/80 transition-colors"
            >
              {t('reports.createInitialAudit')}
            </button>
          </div>

          <div className="p-5 border border-border rounded-lg bg-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t('reports.monthlyPerformanceReport')}</h3>
                <p className="text-xs text-muted-foreground">
                  {t('reports.monthlyReportDesc')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOngoingModal(true)}
              className="w-full mt-3 px-3 py-2 bg-accent text-foreground rounded-md text-xs font-medium hover:bg-accent/80 transition-colors"
            >
              {t('reports.createMonthlyReport')}
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 px-8 py-6 overflow-auto">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">{t('reports.allReports')}</h2>

          {reports.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground mb-4">{t('reports.noReports')}</p>
              <button
                onClick={() => setShowInitialModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t('reports.createFirstReport')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        report.type === 'initial'
                          ? 'bg-blue-500/10'
                          : 'bg-green-500/10'
                      }`}
                    >
                      {report.type === 'initial' ? (
                        <TrendingUp className={`w-5 h-5 ${report.type === 'initial' ? 'text-blue-500' : 'text-green-500'}`} />
                      ) : (
                        <BarChart3 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{report.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            report.type === 'initial'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {report.type === 'initial' ? t('reports.initialAuditTag') : t('reports.monthlyTag')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('reports.createdOn')} {new Date(report.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportReport(report.id)}
                      className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      {t('reports.export')}
                    </button>
                    <button
                      onClick={() => handleViewReport(report)}
                      className="px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                    >
                      {t('reports.viewReport')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showInitialModal && (
        <InitialReportModal
          projectName={projectName}
          onClose={() => setShowInitialModal(false)}
          onComplete={() => {
            setShowInitialModal(false);
            alert(t('reports.initialAuditCreated'));
          }}
        />
      )}

      {showOngoingModal && (
        <OngoingReportModal
          projectName={projectName}
          onClose={() => setShowOngoingModal(false)}
          onComplete={() => {
            setShowOngoingModal(false);
            alert(t('reports.monthlyReportCreated'));
          }}
        />
      )}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

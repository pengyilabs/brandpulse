import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/sidebar';
import { ProjectsDashboard } from './components/projects-dashboard';
import { ProjectView } from './components/project-view';
import { EnhancedDashboard } from './components/enhanced-dashboard';
import { WriterProfilesView } from './components/writer-profiles-view';
import { EnhancedResourcesView } from './components/enhanced-resources-view';
import { TemplatesView } from './components/templates-view';
import { IntegrationsView } from './components/integrations-view';
import { SettingsView } from './components/settings-view';
import { ProfileView } from './components/profile-view';
import { SmartContentCreationModal } from './components/smart-content-creation-modal';
import { ProjectCreationModal } from './components/project-creation-modal';
import { ContentReview } from './components/content-review';
import { BrandGuidelinesManager } from './components/brand-guidelines-manager';
import { CalendarView } from './components/calendar-view';
import { AuditsView } from './components/audits-view';
import { AuditWizard } from './components/audit-wizard';
import { AuditResults } from './components/audit-results';
import { ActionHub } from './components/action-hub';
import { AuditAssetProvider } from './data/audit-asset-store';
import type { Platform } from './data/audit-data';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [selectedContentType, setSelectedContentType] = useState<'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video'>('short-clip');
  const [auditView, setAuditView] = useState<'list' | 'wizard' | 'results' | 'action-hub'>('list');
  const [auditProfiles, setAuditProfiles] = useState<Platform[]>([]);

  const projects = [
    { id: 1, name: 'Velocity Athletics Project' },
    { id: 2, name: 'Tech Startup Project' },
    { id: 3, name: 'Wellness Brand Project' },
    { id: 4, name: 'Fashion E-commerce Project' },
    { id: 5, name: 'Food & Beverage Project' },
    { id: 6, name: 'B2B SaaS Platform Project' },
    { id: 7, name: 'Lumina Wellness Project' },
  ];

  const handleCreateContent = (contentType: 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video') => {
    setSelectedContentType(contentType);
    setIsContentModalOpen(true);
  };

  const handleCreateProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'projects') setSelectedProjectId(null);
    if (tab === 'audits') setAuditView('list');
    setActiveTab(tab);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const handleContentModalClose = () => {
    setIsContentModalOpen(false);
  };

  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
  };

  const handleContentModalComplete = (config: any) => {
    setContentConfig(config);
    setIsContentModalOpen(false);
    setShowReview(true);
  };

  const handleProjectModalComplete = (project: any) => {
    console.log('Project created:', project);
    setIsProjectModalOpen(false);
  };

  const handleFinalize = () => {
    alert('Content exported successfully!');
    setShowReview(false);
    setContentConfig(null);
  };

  const renderContent = () => {
    if (showReview) {
      return (
        <>
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <ContentReview config={contentConfig} onFinalize={handleFinalize} />
        </>
      );
    }

    if (activeTab === 'projects' && selectedProjectId !== null) {
      const project = projects.find(p => p.id === selectedProjectId);
      return (
        <>
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <ProjectView
            projectId={selectedProjectId}
            projectName={project?.name || 'Unknown Project'}
            onBack={handleBackToProjects}
          />
        </>
      );
    }

    switch (activeTab) {
      case 'calendar':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <CalendarView key="v3-aug-sep-2026" />
          </>
        );
      case 'projects':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProjectsDashboard
              onProjectClick={handleProjectClick}
              onCreateProject={handleCreateProject}
            />
          </>
        );
      case 'dashboard':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <EnhancedDashboard
              onCreateContent={handleCreateContent}
              onCreateProject={handleCreateProject}
            />
          </>
        );
      case 'writer-profiles':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <WriterProfilesView />
          </>
        );
      case 'brand-kit':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <BrandGuidelinesManager />
          </>
        );
      case 'resources':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <EnhancedResourcesView />
          </>
        );
      case 'templates':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <TemplatesView />
          </>
        );
      case 'integrations':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <IntegrationsView />
          </>
        );
      case 'settings':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <SettingsView />
          </>
        );
      case 'profile':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProfileView />
          </>
        );
      case 'audits':
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            {auditView === 'list' && (
              <AuditsView
                onStartNewAudit={() => setAuditView('wizard')}
                onOpenAudit={() => setAuditView('results')}
              />
            )}
            {auditView === 'wizard' && (
              <AuditWizard
                onComplete={(profiles) => {
                  setAuditProfiles(profiles)
                  setAuditView('results')
                }}
                onBack={() => setAuditView('list')}
              />
            )}
            {auditView === 'results' && (
              <AuditResults
                auditProfiles={auditProfiles}
                onBack={() => setAuditView('list')}
                onGoToActionHub={() => setAuditView('action-hub')}
              />
            )}
            {auditView === 'action-hub' && (
              <ActionHub
                onBack={() => setAuditView('results')}
                onCreateCampaign={() => {
                  setAuditView('results')
                  setIsContentModalOpen(true)
                  setSelectedContentType('short-clip')
                }}
                onEmulatePost={() => {
                  setAuditView('results')
                  setIsContentModalOpen(true)
                  setSelectedContentType('short-clip')
                }}
              />
            )}
          </>
        );
      default:
        return (
          <>
            <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            <ProjectsDashboard
              onProjectClick={handleProjectClick}
              onCreateProject={handleCreateProject}
            />
          </>
        );
    }
  };

  return (
    <AuditAssetProvider>
      <div className="size-full flex bg-background text-foreground">
        {renderContent()}

        <Toaster position="bottom-right" theme="dark" />

        <SmartContentCreationModal
          isOpen={isContentModalOpen}
          onClose={handleContentModalClose}
          onComplete={handleContentModalComplete}
          contentType={selectedContentType}
        />

        <ProjectCreationModal
          isOpen={isProjectModalOpen}
          onClose={handleProjectModalClose}
          onComplete={handleProjectModalComplete}
        />
      </div>
    </AuditAssetProvider>
  );
}
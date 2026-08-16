import { createBrowserRouter } from 'react-router-dom';
import { ProjectsDashboard } from './components/projects/projects-dashboard';
import { ProjectView } from './components/projects/project-view';
import { EnhancedDashboard } from './components/dashboard/enhanced-dashboard';
import { WriterProfilesView } from './components/brand/writer-profiles-view';
import { EnhancedResourcesView } from './components/resources/enhanced-resources-view';
import { TemplatesView } from './components/templates/templates-view';
import { IntegrationsView } from './components/settings/integrations-view';
import { SettingsView } from './components/settings/settings-view';
import { ProfileView } from './components/brand/profile-view';
import { BrandGuidelinesManager } from './components/brand/brand-guidelines-manager';
import { CalendarView } from './components/calendar/calendar-view';
import { AuditsView } from './components/audits/audits-view';
import { AuditWizard } from './components/audits/audit-wizard';
import { AuditResults } from './components/audits/audit-results';
import { ActionHub } from './components/audits/action-hub';
import { ContentReview } from './components/content/content-review';
import { AppLayout } from './components/layout/app-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <EnhancedDashboard />,
      },
      {
        path: 'dashboard',
        element: <EnhancedDashboard />,
      },
      {
        path: 'projects',
        element: <ProjectsDashboard />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectView />,
      },
      {
        path: 'writer-profiles',
        element: <WriterProfilesView />,
      },
      {
        path: 'brand-kit',
        element: <BrandGuidelinesManager />,
      },
      {
        path: 'resources',
        element: <EnhancedResourcesView />,
      },
      {
        path: 'templates',
        element: <TemplatesView />,
      },
      {
        path: 'integrations',
        element: <IntegrationsView />,
      },
      {
        path: 'settings',
        element: <SettingsView />,
      },
      {
        path: 'profile',
        element: <ProfileView />,
      },
      {
        path: 'calendar',
        element: <CalendarView />,
      },
      {
        path: 'audits',
        element: <AuditsView />,
      },
      {
        path: 'audits/new',
        element: <AuditWizard />,
      },
      {
        path: 'audits/:auditId',
        element: <AuditResults />,
      },
      {
        path: 'audits/:auditId/actions',
        element: <ActionHub />,
      },
      {
        path: 'content/review',
        element: <ContentReview />,
      },
    ],
  },
]);

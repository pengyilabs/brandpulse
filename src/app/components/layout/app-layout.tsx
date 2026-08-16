import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './sidebar';
import { SmartContentCreationModal } from '../content/smart-content-creation-modal';
import { ProjectCreationModal } from '../projects/project-creation-modal';
import { ContentReview } from '../content/content-review';
import { AuditAssetProvider } from '../../data/audit-asset-store';
import { useUIStore } from '../../stores/ui-store';

export function AppLayout() {
  const {
    isContentModalOpen,
    selectedContentType,
    closeContentModal,
    isProjectModalOpen,
    closeProjectModal,
    showReview,
    contentConfig,
    startReview,
    finalizeReview,
  } = useUIStore();

  return (
    <AuditAssetProvider>
      <div className="size-full flex bg-background text-foreground">
        <Sidebar />
        <Outlet />

        <Toaster position="bottom-right" theme="dark" />

        {showReview && (
          <ContentReview config={contentConfig} onFinalize={() => {
            alert('Content exported successfully!');
            finalizeReview();
          }} />
        )}

        <SmartContentCreationModal
          isOpen={isContentModalOpen}
          onClose={closeContentModal}
          onComplete={(config: any) => startReview(config)}
          contentType={selectedContentType}
        />

        <ProjectCreationModal
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
          onComplete={(project: any) => {
            console.log('Project created:', project);
            closeProjectModal();
          }}
        />
      </div>
    </AuditAssetProvider>
  );
}
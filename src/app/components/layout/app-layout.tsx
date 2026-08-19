import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './sidebar';
import { SmartContentCreationModal } from '../content/smart-content-creation-modal';
import { ProjectCreationModal } from '../projects/project-creation-modal';
import { ContentReview } from '../content/content-review';
import { AuditAssetProvider } from '../../data/audit-asset-store';
import { useUIStore } from '../../stores/ui-store';
import { getBrandKits, type BrandKit } from '../../../lib/services/brand-kits-service';
import { getWriterProfiles, type WriterProfile } from '../../../lib/services/writer-profiles-service';
import { useState, useEffect } from 'react';

export function AppLayout() {
  const navigate = useNavigate();
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

  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [writerProfiles, setWriterProfiles] = useState<WriterProfile[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [bk, wp] = await Promise.all([getBrandKits(), getWriterProfiles()]);
      if (!cancelled) {
        setBrandKits(bk);
        setWriterProfiles(wp);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
          brandKits={brandKits}
          writerProfiles={writerProfiles}
        />

        <ProjectCreationModal
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
          onComplete={(project: any) => {
            closeProjectModal();
            // Navigate to the new project page
            navigate(`/projects/${project.id}`, { replace: true });
          }}
        />
      </div>
    </AuditAssetProvider>
  );
}
import { create } from 'zustand';

type ContentType = 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video';

interface UIStore {
  // Content Creation Modal
  isContentModalOpen: boolean;
  selectedContentType: ContentType;
  openContentModal: (contentType: ContentType) => void;
  closeContentModal: () => void;

  // Project Creation Modal
  isProjectModalOpen: boolean;
  openProjectModal: () => void;
  closeProjectModal: () => void;

  // Content Review
  showReview: boolean;
  contentConfig: any;
  startReview: (config: any) => void;
  finalizeReview: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Content Creation Modal
  isContentModalOpen: false,
  selectedContentType: 'short-clip',
  openContentModal: (contentType) =>
    set({ isContentModalOpen: true, selectedContentType: contentType }),
  closeContentModal: () => set({ isContentModalOpen: false }),

  // Project Creation Modal
  isProjectModalOpen: false,
  openProjectModal: () => set({ isProjectModalOpen: true }),
  closeProjectModal: () => set({ isProjectModalOpen: false }),

  // Content Review
  showReview: false,
  contentConfig: null,
  startReview: (config) =>
    set({ contentConfig: config, isContentModalOpen: false, showReview: true }),
  finalizeReview: () => set({ showReview: false, contentConfig: null }),
}));
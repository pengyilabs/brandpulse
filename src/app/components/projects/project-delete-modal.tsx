import { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { deleteProject, type Project } from '../../../lib/services/projects-service';

interface ProjectDeleteModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function ProjectDeleteModal({ project, isOpen, onClose, onDelete }: ProjectDeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    setDeleting(true);
    const success = await deleteProject(project.id);

    if (success) {
      onDelete();
      onClose();
    }
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Delete Project</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground mb-1">
                Are you sure you want to delete "{project.name}"?
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All campaigns, content items, and associated data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

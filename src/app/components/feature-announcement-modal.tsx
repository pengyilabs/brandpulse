import { X } from 'lucide-react';

interface FeatureAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryNow: () => void;
}

export function FeatureAnnouncementModal({ isOpen, onClose, onTryNow }: FeatureAnnouncementModalProps) {
  if (!isOpen) return null;

  const handleTryNow = () => {
    onClose();
    onTryNow();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-secondary/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-secondary transition-all z-10 border border-border/50"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="p-8">
          <div className="mb-6 rounded-xl overflow-hidden border border-border">
            <img
              src="/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMG1hcmtldGluZyUyMGNvbnRlbnQlMjBjcmVhdGlvbiUyMHNvY2lhbCUyMG1lZGlhfGVufDF8fHx8MTc3NzM5Nzg3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Long Videos to Marketing Content"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="text-center">
            <h2 className="text-foreground mb-3 text-xl font-semibold tracking-tight">
              Transform Long Videos into Marketing Content
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Automatically convert your long-form videos into engaging marketing materials.
              Create blog posts, social media clips, and highlight reels with AI-powered analysis
              and content generation.
            </p>

            <button
              onClick={handleTryNow}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
            >
              Try Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

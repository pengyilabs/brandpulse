import { useState, useEffect } from 'react';
import { User, Palette, BarChart3, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type WritingTone =
  | 'professional'
  | 'conversational'
  | 'authoritative'
  | 'friendly'
  | 'empathetic'
  | 'bold'
  | 'casual'
  | 'formal'
  | 'inspirational'
  | 'technical';

type WritingLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

type SelectionMode = 'profile' | 'manual' | null;

export interface WritingSettings {
  writerProfile: string | null;
  writingTone: WritingTone | null;
  writingLevel: WritingLevel | null;
  mode: SelectionMode;
}

export interface WritingSettingsSectionProps {
  value: WritingSettings;
  onChange: (settings: WritingSettings) => void;
  availableProfiles: string[];
  context: 'project' | 'campaign' | 'content';
  onProjectLevelChange?: (newProfile: string, applyToExisting: boolean) => void;
  existingDraftCount?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TONE_OPTIONS: { value: WritingTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'bold', label: 'Bold' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'technical', label: 'Technical' },
];

const LEVEL_OPTIONS: { value: WritingLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

// ─── Project Update Confirmation Dialog ──────────────────────────────────────

interface ProjectUpdateDialogProps {
  isOpen: boolean;
  draftCount: number;
  newProfileName: string;
  onConfirm: (applyToExisting: boolean) => void;
  onCancel: () => void;
}

function ProjectUpdateDialog({
  isOpen,
  draftCount,
  newProfileName,
  onConfirm,
  onCancel,
}: ProjectUpdateDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-lg z-50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-foreground mb-2">
                Update Writer Profile
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                This project has <span className="font-semibold text-foreground">{draftCount} draft items</span> using
                the current writer profile. What would you like to do?
              </Dialog.Description>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => onConfirm(true)}
              className="w-full p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Apply new profile to all existing drafts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All {draftCount} draft items will switch to "{newProfileName}" writer profile.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onConfirm(false)}
              className="w-full p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Keep current profile for existing drafts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Existing drafts stay unchanged. Only new content will use "{newProfileName}".
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WritingSettingsSection({
  value,
  onChange,
  availableProfiles,
  context,
  onProjectLevelChange,
  existingDraftCount = 0,
}: WritingSettingsSectionProps) {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [pendingProfileChange, setPendingProfileChange] = useState<string | null>(null);

  const isProfileMode = value.mode === 'profile';
  const isManualMode = value.mode === 'manual';

  // Handle writer profile selection
  const handleProfileChange = (profile: string) => {
    if (!profile) {
      // Clear selection
      onChange({
        writerProfile: null,
        writingTone: null,
        writingLevel: null,
        mode: null,
      });
      return;
    }

    // If this is a project-level change and there are existing drafts, show confirmation
    if (context === 'project' && existingDraftCount > 0 && value.writerProfile !== profile) {
      setPendingProfileChange(profile);
      setShowProjectDialog(true);
      return;
    }

    // Otherwise, apply immediately
    onChange({
      writerProfile: profile,
      writingTone: null,
      writingLevel: null,
      mode: 'profile',
    });
  };

  // Handle project dialog confirmation
  const handleProjectDialogConfirm = (applyToExisting: boolean) => {
    if (pendingProfileChange && onProjectLevelChange) {
      onProjectLevelChange(pendingProfileChange, applyToExisting);
      onChange({
        writerProfile: pendingProfileChange,
        writingTone: null,
        writingLevel: null,
        mode: 'profile',
      });
    }
    setShowProjectDialog(false);
    setPendingProfileChange(null);
  };

  // Handle manual tone/level selection
  const handleToneChange = (tone: WritingTone) => {
    if (!tone) {
      // If clearing tone and level is also empty, reset mode
      if (!value.writingLevel) {
        onChange({
          writerProfile: null,
          writingTone: null,
          writingLevel: null,
          mode: null,
        });
      } else {
        onChange({
          ...value,
          writingTone: null,
        });
      }
      return;
    }

    onChange({
      writerProfile: null,
      writingTone: tone,
      writingLevel: value.writingLevel || 'intermediate',
      mode: 'manual',
    });
  };

  const handleLevelChange = (level: WritingLevel) => {
    if (!level) {
      // If clearing level and tone is also empty, reset mode
      if (!value.writingTone) {
        onChange({
          writerProfile: null,
          writingTone: null,
          writingLevel: null,
          mode: null,
        });
      } else {
        onChange({
          ...value,
          writingLevel: null,
        });
      }
      return;
    }

    onChange({
      writerProfile: null,
      writingTone: value.writingTone || 'professional',
      writingLevel: level,
      mode: 'manual',
    });
  };

  // Reset to no selection
  const handleReset = () => {
    onChange({
      writerProfile: null,
      writingTone: null,
      writingLevel: null,
      mode: null,
    });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Writer Profile */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="w-4 h-4 text-primary" />
              Writer Profile
            </label>
            {isProfileMode && (
              <button
                onClick={handleReset}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={value.writerProfile || ''}
            onChange={(e) => handleProfileChange(e.target.value)}
            disabled={isManualMode}
            className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground transition-all ${
              isManualMode
                ? 'opacity-50 cursor-not-allowed bg-secondary/30'
                : 'hover:border-border/50'
            }`}
          >
            <option value="">Select a writer profile</option>
            {availableProfiles.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
          {isManualMode && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              Custom tone and level selected
            </p>
          )}
        </div>

        {/* Writing Tone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Palette className="w-4 h-4 text-primary" />
              Writing Tone
            </label>
            {isManualMode && !isProfileMode && (
              <button
                onClick={handleReset}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <select
            value={value.writingTone || ''}
            onChange={(e) => handleToneChange(e.target.value as WritingTone)}
            disabled={isProfileMode}
            className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground transition-all ${
              isProfileMode
                ? 'opacity-50 cursor-not-allowed bg-secondary/30'
                : 'hover:border-border/50'
            }`}
          >
            <option value="">Select writing tone</option>
            {TONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isProfileMode && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              Controlled by selected writer profile
            </p>
          )}
        </div>

        {/* Writing Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Writing Level
            </label>
          </div>
          <select
            value={value.writingLevel || ''}
            onChange={(e) => handleLevelChange(e.target.value as WritingLevel)}
            disabled={isProfileMode}
            className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground transition-all ${
              isProfileMode
                ? 'opacity-50 cursor-not-allowed bg-secondary/30'
                : 'hover:border-border/50'
            }`}
          >
            <option value="">Select writing level</option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isProfileMode && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              Controlled by selected writer profile
            </p>
          )}
        </div>

        {/* Context-specific help text */}
        {context === 'project' && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              These settings will be inherited by all new campaigns and content in this project.
            </p>
          </div>
        )}
        {context === 'campaign' && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              These settings will be inherited by all content items in this campaign. Overrides project defaults.
            </p>
          </div>
        )}
        {context === 'content' && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              These settings apply to this content item only. Overrides campaign and project defaults.
            </p>
          </div>
        )}
      </div>

      {/* Project Update Dialog */}
      {context === 'project' && showProjectDialog && pendingProfileChange && (
        <ProjectUpdateDialog
          isOpen={showProjectDialog}
          draftCount={existingDraftCount}
          newProfileName={pendingProfileChange}
          onConfirm={handleProjectDialogConfirm}
          onCancel={() => {
            setShowProjectDialog(false);
            setPendingProfileChange(null);
          }}
        />
      )}
    </>
  );
}

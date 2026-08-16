import { useState } from 'react';
import { WritingSettingsSection, WritingSettings } from './writing-settings-section';
import { FileText, Flag, Folder } from 'lucide-react';

/**
 * This demo component shows the WritingSettingsSection in all three contexts:
 * - Project defaults
 * - Campaign settings
 * - Individual content creation
 */
export function WritingSettingsDemo() {
  const availableProfiles = [
    'Velocity Athletics Team',
    'Friendly Customer Support',
    'Technical Documentation',
    'Executive Communications',
  ];

  // Project-level settings
  const [projectSettings, setProjectSettings] = useState<WritingSettings>({
    writerProfile: 'Velocity Athletics Team',
    writingTone: null,
    writingLevel: null,
    mode: 'profile',
  });

  // Campaign-level settings
  const [campaignSettings, setCampaignSettings] = useState<WritingSettings>({
    writerProfile: null,
    writingTone: 'bold',
    writingLevel: 'intermediate',
    mode: 'manual',
  });

  // Content-level settings
  const [contentSettings, setContentSettings] = useState<WritingSettings>({
    writerProfile: null,
    writingTone: null,
    writingLevel: null,
    mode: null,
  });

  const handleProjectLevelChange = (newProfile: string, applyToExisting: boolean) => {
    console.log(`Project level change: "${newProfile}", apply to existing: ${applyToExisting}`);
    // Implement logic to update existing drafts if needed
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Writing Settings Demo</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Demonstrating the writing settings component in different contexts
        </p>

        <div className="grid grid-cols-3 gap-6">
          {/* Project Defaults */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Project Defaults</h2>
            </div>
            <WritingSettingsSection
              value={projectSettings}
              onChange={setProjectSettings}
              availableProfiles={availableProfiles}
              context="project"
              onProjectLevelChange={handleProjectLevelChange}
              existingDraftCount={47}
            />
          </div>

          {/* Campaign Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Campaign Settings</h2>
            </div>
            <WritingSettingsSection
              value={campaignSettings}
              onChange={setCampaignSettings}
              availableProfiles={availableProfiles}
              context="campaign"
            />
          </div>

          {/* Content Creation */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Content Creation</h2>
            </div>
            <WritingSettingsSection
              value={contentSettings}
              onChange={setContentSettings}
              availableProfiles={availableProfiles}
              context="content"
            />
          </div>
        </div>

        {/* Current State Display */}
        <div className="mt-8 bg-secondary/30 border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Current State (for debugging)</h3>
          <div className="grid grid-cols-3 gap-6 text-xs font-mono">
            <div>
              <p className="text-muted-foreground mb-2">Project:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {JSON.stringify(projectSettings, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Campaign:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {JSON.stringify(campaignSettings, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Content:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {JSON.stringify(contentSettings, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">How to Use</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Mutually Exclusive Modes:</p>
              <p>
                • Select a <span className="text-primary">Writer Profile</span> to use a preset (Tone/Level become disabled)
              </p>
              <p>
                • Or manually select <span className="text-primary">Tone + Level</span> (Writer Profile becomes disabled)
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Switching Modes:</p>
              <p>• Click the "Clear" button next to the active selection to reset</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Project Level Changes:</p>
              <p>
                • Changing writer profile at project level with 47 existing drafts triggers confirmation dialog
              </p>
              <p>• Choose whether to apply to existing drafts or only future content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

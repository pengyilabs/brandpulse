import { useState, useEffect } from 'react';
import { Plus, User, Trash2, Edit2, Check, FileText, Eye, Star, Sparkles } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAuditAssets } from '../data/audit-asset-store';

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

interface WriterProfile {
  id: number;
  name: string;
  tone: WritingTone;
  level: WritingLevel;
  description: string;
  isDefault: boolean;
  createdDate: string;
  usedByContentCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TONE_OPTIONS: { value: WritingTone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Clear, polished, business-appropriate' },
  { value: 'conversational', label: 'Conversational', description: 'Casual, natural, like talking to a friend' },
  { value: 'authoritative', label: 'Authoritative', description: 'Confident, expert, commanding respect' },
  { value: 'friendly', label: 'Friendly', description: 'Warm, approachable, personable' },
  { value: 'empathetic', label: 'Empathetic', description: 'Understanding, compassionate, supportive' },
  { value: 'bold', label: 'Bold', description: 'Strong, direct, memorable statements' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, informal, easygoing' },
  { value: 'formal', label: 'Formal', description: 'Traditional, respectful, proper' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating, uplifting, encouraging' },
  { value: 'technical', label: 'Technical', description: 'Precise, detailed, specialized terminology' },
];

const LEVEL_OPTIONS: { value: WritingLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Simple words, short sentences, basic concepts' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate vocabulary, clear explanations' },
  { value: 'advanced', label: 'Advanced', description: 'Rich vocabulary, complex ideas, nuanced' },
  { value: 'expert', label: 'Expert', description: 'Industry jargon, assumes deep knowledge' },
];

// Sample text for previews
const SAMPLE_PREVIEWS: Record<WritingTone, Record<WritingLevel, string>> = {
  professional: {
    beginner: "Our product helps you save time. It's easy to use and works well. Many customers like it because it solves their problems quickly.",
    intermediate: "Our solution streamlines your workflow by automating routine tasks. The intuitive interface ensures a smooth learning curve while delivering measurable results.",
    advanced: "This platform facilitates operational efficiency through strategic automation, offering a sophisticated interface that balances accessibility with powerful capabilities.",
    expert: "Our enterprise-grade solution leverages advanced algorithms to optimize workflows, delivering ROI through systematic process automation and intelligent resource allocation."
  },
  conversational: {
    beginner: "Hey! You know how annoying it is to do the same thing over and over? Well, we made something that does it for you. Pretty cool, right?",
    intermediate: "We've all been there—spending hours on tasks that feel like they should be automatic. That's exactly why we built this. It's like having a helpful assistant who never takes a break.",
    advanced: "Let's be honest: nobody enjoys repetitive work. We designed this platform to handle the tedious stuff so you can focus on what actually matters—the creative, strategic work you love.",
    expert: "You already know the pain points—we don't need to tell you. What you need is a system that understands your workflow as well as you do, anticipates bottlenecks, and quietly handles them."
  },
  authoritative: {
    beginner: "This is the best way to do it. Follow these steps and you will see results. There is no better solution available.",
    intermediate: "Industry leaders trust this approach because it consistently delivers results. When implemented correctly, it outperforms all alternative methods.",
    advanced: "Decades of research validate this methodology. Organizations that adopt these principles experience demonstrable improvements across all key performance indicators.",
    expert: "The empirical evidence is unequivocal: this framework represents the gold standard in the field, supported by peer-reviewed research and validated across diverse operational contexts."
  },
  friendly: {
    beginner: "We're so glad you're here! This is going to make your life easier. If you need any help, just ask—we're always happy to assist!",
    intermediate: "Welcome! We built this with people like you in mind. It's designed to feel natural and intuitive, and we're here to support you every step of the way.",
    advanced: "It's great to have you here! We've worked hard to create something that genuinely makes a difference, and we'd love to hear your feedback as you explore what's possible.",
    expert: "We're excited to partner with you on this journey. Your expertise combined with our platform's capabilities opens up some really interesting possibilities we think you'll appreciate."
  },
  empathetic: {
    beginner: "We understand this can feel overwhelming. Take your time, and remember—we're here to help you through every step. You've got this.",
    intermediate: "We recognize the challenges you're facing, and we designed this specifically to make things easier. Your concerns matter to us, and we're committed to supporting you.",
    advanced: "We've listened to your struggles and built this solution with deep understanding of the obstacles you encounter daily. Your success is genuinely important to us.",
    expert: "Having worked alongside professionals like you for years, we understand the nuanced pressures you face. This platform reflects that understanding in every design decision."
  },
  bold: {
    beginner: "Stop wasting time. Start getting results. This is what you've been looking for.",
    intermediate: "Enough with mediocre solutions. It's time for something that actually works. This is your answer.",
    advanced: "Transform your entire approach. This isn't just another tool—it's a complete paradigm shift that will redefine how you work.",
    expert: "Revolutionary architecture. Uncompromising performance. Zero tolerance for inefficiency. This is the future of productivity, available now."
  },
  casual: {
    beginner: "This thing's pretty neat. Give it a try and see what you think. No pressure!",
    intermediate: "So basically, we made something that handles the boring stuff for you. Works great, super easy to pick up.",
    advanced: "Look, we wanted something that just works without all the fuss. Turns out, a bunch of other people wanted the same thing, so here we are.",
    expert: "Built this because we were tired of overcomplicated solutions. Kept it simple, kept it powerful. You'll probably figure out cooler uses than we thought of."
  },
  formal: {
    beginner: "This solution provides assistance with your work. It has been designed to be effective and reliable.",
    intermediate: "We are pleased to present a comprehensive solution designed to address your organizational needs with precision and reliability.",
    advanced: "This platform represents a formal commitment to excellence, delivering enterprise-grade capabilities through meticulously engineered systems.",
    expert: "We hereby present a solution architected to the highest standards of professional excellence, adhering to industry best practices and regulatory compliance requirements."
  },
  inspirational: {
    beginner: "Imagine what you could achieve with the right tools. This is your chance to make that dream real. You can do amazing things!",
    intermediate: "Every great achievement starts with a single step. This platform empowers you to take that step with confidence and reach heights you've only imagined.",
    advanced: "Your potential is limitless, and the right tools unlock extraordinary possibilities. This is more than software—it's the catalyst for your breakthrough moment.",
    expert: "Visionaries like you don't settle for incremental gains. You seek transformation. This platform is engineered for those brave enough to redefine what's possible."
  },
  technical: {
    beginner: "The system uses a simple process. It takes your input, processes it, and gives you output. The data is stored safely.",
    intermediate: "The architecture employs a microservices approach with REST APIs handling data transactions. Authentication is managed through OAuth 2.0 protocols.",
    advanced: "Our distributed system leverages containerized services orchestrated via Kubernetes, with a Redis caching layer optimizing query performance and reducing database load.",
    expert: "The platform implements event-sourcing patterns with CQRS architecture, utilizing Apache Kafka for event streaming and Elasticsearch for real-time analytics aggregation across sharded indices."
  }
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILES: WriterProfile[] = [
  {
    id: 1,
    name: 'Velocity Athletics Team',
    tone: 'bold',
    level: 'intermediate',
    description: 'Motivational, performance-driven content for athletes. Strong verbs, energetic language.',
    isDefault: true,
    createdDate: '2026-05-01',
    usedByContentCount: 47,
  },
  {
    id: 2,
    name: 'Friendly Customer Support',
    tone: 'friendly',
    level: 'beginner',
    description: 'Approachable, helpful tone for customer service interactions and FAQ content.',
    isDefault: false,
    createdDate: '2026-04-15',
    usedByContentCount: 23,
  },
  {
    id: 3,
    name: 'Technical Documentation',
    tone: 'technical',
    level: 'expert',
    description: 'Precise, detailed technical writing for developer documentation and API guides.',
    isDefault: false,
    createdDate: '2026-04-10',
    usedByContentCount: 12,
  },
  {
    id: 4,
    name: 'Executive Communications',
    tone: 'authoritative',
    level: 'advanced',
    description: 'Leadership voice for CEO updates, press releases, and corporate announcements.',
    isDefault: false,
    createdDate: '2026-03-20',
    usedByContentCount: 8,
  },
];

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

interface ProfileFormModalProps {
  isOpen: boolean;
  profile: WriterProfile | null;
  onClose: () => void;
  onSave: (profile: Partial<WriterProfile>) => void;
}

function ProfileFormModal({ isOpen, profile, onClose, onSave }: ProfileFormModalProps) {
  const [name, setName] = useState(profile?.name || '');
  const [tone, setTone] = useState<WritingTone>(profile?.tone || 'professional');
  const [level, setLevel] = useState<WritingLevel>(profile?.level || 'intermediate');
  const [description, setDescription] = useState(profile?.description || '');

  const handleSave = () => {
    onSave({ name, tone, level, description });
  };

  const currentPreview = SAMPLE_PREVIEWS[tone][level];
  const toneInfo = TONE_OPTIONS.find(t => t.value === tone);
  const levelInfo = LEVEL_OPTIONS.find(l => l.value === level);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
            <Dialog.Title className="text-xl font-bold text-foreground">
              {profile ? 'Edit Writer Profile' : 'Create Writer Profile'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground mt-1">
              Define a consistent writing style with tone and complexity level
            </Dialog.Description>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Profile Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Profile Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Velocity Athletics Team, Customer Support Voice"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Writing Tone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Writing Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as WritingTone)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                >
                  {TONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {toneInfo && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {toneInfo.description}
                  </p>
                )}
              </div>

              {/* Writing Level */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Writing Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as WritingLevel)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                >
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {levelInfo && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {levelInfo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
                <span className="text-muted-foreground font-normal ml-2">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes about when to use this profile..."
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            {/* Preview Section */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Writing Preview</h3>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    {toneInfo?.label}
                  </span>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                    {levelInfo?.label}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {currentPreview}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                This sample shows how content will be written with your selected tone and level
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {profile ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WriterProfilesView() {
  const { writerProfiles: auditWriterProfiles } = useAuditAssets();
  const [profiles, setProfiles] = useState<WriterProfile[]>(MOCK_PROFILES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<WriterProfile | null>(null);

  useEffect(() => {
    if (auditWriterProfiles.length === 0) return;
    const auditProfiles: WriterProfile[] = auditWriterProfiles.map((p, i) => ({
      id: -1 - i,
      name: p.name,
      tone: p.tone as any,
      level: p.level as any,
      description: p.description,
      isDefault: false,
      createdDate: new Date(p.createdAt).toISOString().split('T')[0],
      usedByContentCount: 0,
    }));
    setProfiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.name));
      const newOnes = auditProfiles.filter((p) => !existingNames.has(p.name));
      return [...newOnes, ...prev];
    });
  }, [auditWriterProfiles]);

  const handleCreateNew = () => {
    setSelectedProfile(null);
    setIsModalOpen(true);
  };

  const handleEdit = (profile: WriterProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const profile = profiles.find(p => p.id === id);
    if (profile?.isDefault) {
      alert('Cannot delete the default profile. Please set another profile as default first.');
      return;
    }
    if (confirm('Are you sure you want to delete this writer profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setProfiles(profiles.map(p => ({
      ...p,
      isDefault: p.id === id,
    })));
  };

  const handleSave = (data: Partial<WriterProfile>) => {
    if (selectedProfile) {
      // Edit existing
      setProfiles(profiles.map(p =>
        p.id === selectedProfile.id
          ? { ...p, ...data }
          : p
      ));
    } else {
      // Create new
      const newProfile: WriterProfile = {
        id: Date.now(),
        name: data.name || '',
        tone: data.tone || 'professional',
        level: data.level || 'intermediate',
        description: data.description || '',
        isDefault: false,
        createdDate: new Date().toISOString().split('T')[0],
        usedByContentCount: 0,
      };
      setProfiles([...profiles, newProfile]);
    }
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const getToneBadgeColor = (tone: WritingTone) => {
    const colors: Record<WritingTone, string> = {
      professional: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      conversational: 'bg-green-500/10 text-green-400 border-green-500/20',
      authoritative: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      friendly: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      empathetic: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      bold: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      casual: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      formal: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      inspirational: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      technical: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[tone];
  };

  const getLevelBadgeColor = (level: WritingLevel) => {
    const colors: Record<WritingLevel, string> = {
      beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
      intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      expert: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[level];
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Writer Profiles</h2>
              <p className="text-sm text-muted-foreground">
                Define consistent writing styles with tone and complexity levels
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Profile
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">Set a Default Writer Profile</p>
                <p className="text-muted-foreground">
                  All new content in this project will inherit the default writer profile, but you can override it at the individual content level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Create New Card */}
          <button
            onClick={handleCreateNew}
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all hover:bg-primary/5 min-h-[240px] group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground mb-1">
                Create New Profile
              </p>
              <p className="text-xs text-muted-foreground">
                Define a writing style
              </p>
            </div>
          </button>

          {/* Profile Cards */}
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all"
            >
              {/* Card Header */}
              <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  {profile.isDefault && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-primary" />
                      Default
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-1">
                  {profile.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getToneBadgeColor(profile.tone)}`}>
                    {TONE_OPTIONS.find(t => t.value === profile.tone)?.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getLevelBadgeColor(profile.level)}`}>
                    {LEVEL_OPTIONS.find(l => l.value === profile.level)?.label}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Description */}
                {profile.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {profile.description}
                  </p>
                )}

                {/* Sample Preview */}
                <div className="bg-secondary/30 border border-border rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                      Sample
                    </p>
                  </div>
                  <p className="text-xs text-foreground line-clamp-3 leading-relaxed">
                    {SAMPLE_PREVIEWS[profile.tone][profile.level]}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>
                    {new Date(profile.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {profile.usedByContentCount > 0 && (
                    <span>{profile.usedByContentCount} items</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  {!profile.isDefault && (
                    <button
                      onClick={() => handleSetDefault(profile.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-xs font-medium"
                      title="Set as default"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(profile)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="flex items-center justify-center px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ProfileFormModal
        isOpen={isModalOpen}
        profile={selectedProfile}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfile(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

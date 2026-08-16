import { useState } from 'react';
import { Plus, Trash2, Edit2, Hash, Link as LinkIcon, Sparkles, Check, X, Loader2, ChevronRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Theme {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdDate: string;
  usedByContentCount: number;
}

interface SuggestedTheme {
  name: string;
  description: string;
  confidence: number;
  selected: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_THEMES: Theme[] = [
  {
    id: 1,
    name: 'Work Stress',
    description: 'Content related to managing stress in the workplace',
    color: '#F97316',
    createdDate: '2026-05-01',
    usedByContentCount: 23,
  },
  {
    id: 2,
    name: 'Anxiety',
    description: 'Managing anxiety and nervous feelings',
    color: '#8B5CF6',
    createdDate: '2026-04-20',
    usedByContentCount: 18,
  },
  {
    id: 3,
    name: 'Company Culture',
    description: 'Building positive workplace culture',
    color: '#4B56F2',
    createdDate: '2026-04-15',
    usedByContentCount: 12,
  },
  {
    id: 4,
    name: 'Team Building',
    description: 'Activities and strategies for team cohesion',
    color: '#3B82F6',
    createdDate: '2026-04-10',
    usedByContentCount: 8,
  },
];

const THEME_COLORS = [
  '#F97316', '#8B5CF6', '#4B56F2', '#3B82F6', '#F59E0B',
  '#EC4899', '#06B6D4', '#84CC16', '#EF4444', '#6366F1',
];

// ─── Add From Source Modal ────────────────────────────────────────────────────

interface AddFromSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddThemes: (themes: string[]) => void;
}

function AddFromSourceModal({ isOpen, onClose, onAddThemes }: AddFromSourceModalProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedThemes, setSuggestedThemes] = useState<SuggestedTheme[]>([]);
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call to analyze the URL
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock suggested themes based on URL
    const suggestions: SuggestedTheme[] = [
      {
        name: 'Mental Wellness',
        description: 'Content about mental health and wellbeing',
        confidence: 95,
        selected: true,
      },
      {
        name: 'Mindfulness',
        description: 'Practices for staying present and aware',
        confidence: 88,
        selected: true,
      },
      {
        name: 'Meditation',
        description: 'Guided meditation and breathing exercises',
        confidence: 82,
        selected: true,
      },
      {
        name: 'Self-Care',
        description: 'Taking care of your physical and mental health',
        confidence: 76,
        selected: false,
      },
      {
        name: 'Work-Life Balance',
        description: 'Managing professional and personal life',
        confidence: 71,
        selected: false,
      },
    ];

    setSuggestedThemes(suggestions);
    setIsAnalyzing(false);
    setStep('review');
  };

  const toggleTheme = (index: number) => {
    setSuggestedThemes(themes =>
      themes.map((theme, i) =>
        i === index ? { ...theme, selected: !theme.selected } : theme
      )
    );
  };

  const handleAddSelected = () => {
    const selected = suggestedThemes.filter(t => t.selected).map(t => t.name);
    onAddThemes(selected);
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setSuggestedThemes([]);
    setStep('input');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-2xl z-50">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <Dialog.Title className="text-xl font-bold text-foreground">
                  Add Themes from Source
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground mt-1">
                  Paste a link to extract theme suggestions
                </Dialog.Description>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Source URL
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://instagram.com/profile or https://example.com/article"
                        className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={!url.trim() || isAnalyzing}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-400">
                    <span className="font-semibold">Supported sources:</span> Instagram profiles, social media posts,
                    blog articles, websites. We'll analyze the content and suggest relevant themes.
                  </p>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Suggested Themes
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {suggestedThemes.filter(t => t.selected).length} of {suggestedThemes.length} selected
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('input')}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    ← Analyze Different URL
                  </button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {suggestedThemes.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => toggleTheme(index)}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        theme.selected
                          ? 'bg-primary/10 border-primary/30 hover:bg-primary/15'
                          : 'bg-secondary/30 border-border hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          theme.selected
                            ? 'bg-primary border-primary'
                            : 'border-border'
                        }`}>
                          {theme.selected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-foreground">
                              {theme.name}
                            </h4>
                            <span className="px-2 py-0.5 bg-secondary rounded text-[10px] font-medium text-muted-foreground">
                              {theme.confidence}% match
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 'review' && (
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelected}
                disabled={suggestedThemes.filter(t => t.selected).length === 0}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {suggestedThemes.filter(t => t.selected).length} Theme{suggestedThemes.filter(t => t.selected).length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Edit Theme Modal ─────────────────────────────────────────────────────────

interface EditThemeModalProps {
  isOpen: boolean;
  theme: Theme | null;
  onClose: () => void;
  onSave: (theme: Partial<Theme>) => void;
}

function EditThemeModal({ isOpen, theme, onClose, onSave }: EditThemeModalProps) {
  const [name, setName] = useState(theme?.name || '');
  const [description, setDescription] = useState(theme?.description || '');
  const [color, setColor] = useState(theme?.color || THEME_COLORS[0]);

  const handleSave = () => {
    onSave({ name, description, color });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-lg z-50 p-6">
          <Dialog.Title className="text-xl font-bold text-foreground mb-4">
            {theme ? 'Edit Theme' : 'Add Theme'}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Theme Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Work Stress, Company Culture"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this theme..."
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {THEME_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      color === c ? 'border-foreground scale-110' : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {theme ? 'Save Changes' : 'Add Theme'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ThemesManager() {
  const [themes, setThemes] = useState<Theme[]>(MOCK_THEMES);
  const [isAddFromSourceOpen, setIsAddFromSourceOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const handleAddThemesFromSource = (themeNames: string[]) => {
    const newThemes = themeNames.map((name, index) => ({
      id: Date.now() + index,
      name,
      description: '',
      color: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
      createdDate: new Date().toISOString().split('T')[0],
      usedByContentCount: 0,
    }));
    setThemes([...themes, ...newThemes]);
  };

  const handleAddManual = () => {
    setSelectedTheme(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const theme = themes.find(t => t.id === id);
    if (theme && theme.usedByContentCount > 0) {
      if (!confirm(`This theme is used by ${theme.usedByContentCount} content items. Are you sure you want to delete it?`)) {
        return;
      }
    }
    setThemes(themes.filter(t => t.id !== id));
  };

  const handleSaveTheme = (data: Partial<Theme>) => {
    if (selectedTheme) {
      // Edit existing
      setThemes(themes.map(t =>
        t.id === selectedTheme.id ? { ...t, ...data } : t
      ));
    } else {
      // Add new
      const newTheme: Theme = {
        id: Date.now(),
        name: data.name || '',
        description: data.description || '',
        color: data.color || THEME_COLORS[0],
        createdDate: new Date().toISOString().split('T')[0],
        usedByContentCount: 0,
      };
      setThemes([...themes, newTheme]);
    }
    setIsEditModalOpen(false);
    setSelectedTheme(null);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Themes</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddFromSourceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-sm font-medium"
          >
            <LinkIcon className="w-4 h-4" />
            Add from Source
          </button>
          <button
            onClick={handleAddManual}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Theme
          </button>
        </div>
      </div>

      {themes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No themes yet</p>
          <p className="text-xs text-muted-foreground mb-4">
            Add themes manually or extract them from a source
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="flex items-center gap-4 p-4 bg-secondary/30 hover:bg-secondary/50 rounded-lg transition-colors group"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: theme.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {theme.name}
                  </h4>
                  {theme.usedByContentCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({theme.usedByContentCount} items)
                    </span>
                  )}
                </div>
                {theme.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {theme.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(theme)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(theme.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          Themes are broad, reusable categories used across your project. Each content item can have a specific topic derived from these themes.
        </p>
      </div>

      <AddFromSourceModal
        isOpen={isAddFromSourceOpen}
        onClose={() => setIsAddFromSourceOpen(false)}
        onAddThemes={handleAddThemesFromSource}
      />

      <EditThemeModal
        isOpen={isEditModalOpen}
        theme={selectedTheme}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTheme(null);
        }}
        onSave={handleSaveTheme}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Plus, Upload, Trash2, Edit2, Copy, MoreVertical, Star,
  Link as LinkIcon, Type, Palette, Image as ImageIcon, X,
  AlertTriangle, CheckCircle2, Calendar, ExternalLink, Check
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuditAssets } from '../data/audit-asset-store';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferenceLink {
  id: number;
  label: string;
  url: string;
}

interface BrandGuideline {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
  referenceLinks: ReferenceLink[];
  isDefault: boolean;
  lastModified: string;
  usedByContentCount: number;
}

type ModalMode = 'create' | 'edit' | 'duplicate' | 'rename' | null;

interface EditWarningModalProps {
  isOpen: boolean;
  guideline: BrandGuideline | null;
  onClose: () => void;
  onModifyCurrent: () => void;
  onCreateNewVersion: () => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GUIDELINES: BrandGuideline[] = [
  {
    id: 1,
    name: 'Velocity Athletics',
    description: 'Bold, motivational, performance-driven. Active voice, strong verbs, energetic language.',
    logo: '/brand-tile-navy.svg?w=200&h=200&fit=crop&auto=format',
    primaryColor: '#4B56F2',
    secondaryColor: '#000000',
    headingFont: 'Montserrat',
    bodyFont: 'Noto Sans',
    referenceLinks: [
      { id: 1, label: 'Brand Portal', url: 'https://brand.velocity-athletics.example' },
      { id: 2, label: 'Style Guide', url: 'https://velocity-athletics.example/style' },
    ],
    isDefault: true,
    lastModified: '2026-05-27',
    usedByContentCount: 47,
  },
  {
    id: 2,
    name: 'Velocity Athletics Sustainability',
    description: 'Environmental focus. Authentic, transparent, hopeful tone. Emphasize innovation and responsibility.',
    logo: '/brand-tile-violet.svg?w=200&h=200&fit=crop&auto=format',
    primaryColor: '#34D399',
    secondaryColor: '#047857',
    headingFont: 'Raleway',
    bodyFont: 'Open Sans',
    referenceLinks: [
      { id: 1, label: 'Forward Stride Zero', url: 'https://velocity-athletics.example/sustainability' },
    ],
    isDefault: false,
    lastModified: '2026-05-20',
    usedByContentCount: 12,
  },
  {
    id: 3,
    name: 'Velocity Athletics Women',
    description: 'Empowering, inclusive, bold. Celebrate strength and diversity. Inspiring and uplifting voice.',
    logo: '/brand-tile-cyan.svg?w=200&h=200&fit=crop&auto=format',
    primaryColor: '#F472B6',
    secondaryColor: '#EC4899',
    headingFont: 'Poppins',
    bodyFont: 'Lora',
    referenceLinks: [],
    isDefault: false,
    lastModified: '2026-05-15',
    usedByContentCount: 0,
  },
];

const FONT_OPTIONS = [
  'Noto Sans SC', 'Noto Sans', 'Playfair Display', 'Montserrat', 'Poppins', 'Raleway',
  'Merriweather', 'Lora', 'Oswald', 'Source Sans Pro', 'Open Sans',
  'Roboto', 'Georgia', 'PT Serif',
];

// ─── Edit Warning Modal ───────────────────────────────────────────────────────

function EditWarningModal({ isOpen, guideline, onClose, onModifyCurrent, onCreateNewVersion }: EditWarningModalProps) {
  if (!guideline) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-lg z-50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-foreground mb-2">
                Guideline In Use
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                This brand guideline is currently being used by{' '}
                <span className="font-semibold text-foreground">{guideline.usedByContentCount} content items</span>.
                How would you like to proceed?
              </Dialog.Description>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={onModifyCurrent}
              className="w-full p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Edit2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Modify Current Version
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Changes will apply to all {guideline.usedByContentCount} content items using this guideline.
                    You'll be asked if you want to regenerate affected content.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={onCreateNewVersion}
              className="w-full p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <Copy className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Create New Version
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Existing content keeps the current guideline. Create a new copy for future content.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
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

// ─── Create/Edit Modal ────────────────────────────────────────────────────────

interface GuidelineFormModalProps {
  isOpen: boolean;
  mode: ModalMode;
  guideline: BrandGuideline | null;
  onClose: () => void;
  onSave: (guideline: Partial<BrandGuideline>) => void;
}

function GuidelineFormModal({ isOpen, mode, guideline, onClose, onSave }: GuidelineFormModalProps) {
  const [name, setName] = useState(guideline?.name || '');
  const [description, setDescription] = useState(guideline?.description || '');
  const [logo, setLogo] = useState<string | null>(guideline?.logo || null);
  const [primaryColor, setPrimaryColor] = useState(guideline?.primaryColor || '#4B56F2');
  const [secondaryColor, setSecondaryColor] = useState(guideline?.secondaryColor || '#8B5CF6');
  const [headingFont, setHeadingFont] = useState(guideline?.headingFont || 'Noto Sans SC');
  const [bodyFont, setBodyFont] = useState(guideline?.bodyFont || 'Noto Sans');
  const [referenceLinks, setReferenceLinks] = useState<ReferenceLink[]>(
    guideline?.referenceLinks || []
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addReferenceLink = () => {
    setReferenceLinks([...referenceLinks, { id: Date.now(), label: '', url: '' }]);
  };

  const removeReferenceLink = (id: number) => {
    setReferenceLinks(referenceLinks.filter(link => link.id !== id));
  };

  const updateReferenceLink = (id: number, field: 'label' | 'url', value: string) => {
    setReferenceLinks(referenceLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      logo,
      primaryColor,
      secondaryColor,
      headingFont,
      bodyFont,
      referenceLinks,
    });
  };

  const getTitle = () => {
    if (mode === 'create') return 'Create Brand Guideline';
    if (mode === 'duplicate') return 'Duplicate Brand Guideline';
    if (mode === 'rename') return 'Rename Brand Guideline';
    return 'Edit Brand Guideline';
  };

  const isRenameOnly = mode === 'rename';

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold text-foreground">
                {getTitle()}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Velocity Athletics, Velocity Women, Velocity Sustainability"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {!isRenameOnly && (
              <>
                {/* Brand Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brand Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the tone, voice, and personality of this brand..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Logo
                  </label>
                  {logo ? (
                    <div className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-lg">
                      <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                        <img
                          src={logo}
                          alt="Brand logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Logo uploaded</p>
                      </div>
                      <button
                        onClick={() => setLogo(null)}
                        className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-border hover:border-border/50 rounded-lg transition-all">
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-4 p-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Upload logo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, SVG, or JPG (max. 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-border rounded-lg">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-border shadow-sm cursor-pointer relative overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-input-background border border-border rounded text-sm text-foreground font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-border rounded-lg">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-border shadow-sm cursor-pointer relative overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-input-background border border-border rounded text-sm text-foreground font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Fonts */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Heading Font */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Heading Font
                    </label>
                    <select
                      value={headingFont}
                      onChange={(e) => setHeadingFont(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    <div
                      className="mt-2 px-4 py-3 bg-background/50 border border-border/50 rounded-lg"
                      style={{ fontFamily: headingFont }}
                    >
                      <p className="text-sm font-bold text-foreground">
                        Sample heading text
                      </p>
                    </div>
                  </div>

                  {/* Body Font */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Body Font
                    </label>
                    <select
                      value={bodyFont}
                      onChange={(e) => setBodyFont(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    <div
                      className="mt-2 px-4 py-3 bg-background/50 border border-border/50 rounded-lg"
                      style={{ fontFamily: bodyFont }}
                    >
                      <p className="text-sm text-foreground">
                        Sample body text
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reference Links */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reference Links
                  </label>
                  <div className="space-y-3">
                    {referenceLinks.map((link) => (
                      <div key={link.id} className="flex gap-3">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateReferenceLink(link.id, 'label', e.target.value)}
                          placeholder="Label (e.g., Brand Portal)"
                          className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateReferenceLink(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                        />
                        <button
                          onClick={() => removeReferenceLink(link.id)}
                          className="p-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addReferenceLink}
                      className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Reference Link
                    </button>
                  </div>
                </div>
              </>
            )}
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
              {mode === 'create' || mode === 'duplicate' ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BrandGuidelinesManager() {
  const { brandKits } = useAuditAssets();
  const [guidelines, setGuidelines] = useState<BrandGuideline[]>(MOCK_GUIDELINES);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedGuideline, setSelectedGuideline] = useState<BrandGuideline | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showRegeneratePrompt, setShowRegeneratePrompt] = useState(false);

  useEffect(() => {
    if (brandKits.length === 0) return;
    const auditGuidelines: BrandGuideline[] = brandKits.map((kit, i) => ({
      id: -1 - i,
      name: kit.name,
      description: kit.description,
      logo: null,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      headingFont: kit.headingFont,
      bodyFont: kit.bodyFont,
      referenceLinks: [],
      isDefault: false,
      lastModified: new Date(kit.createdAt).toISOString().split('T')[0],
      usedByContentCount: 0,
    }));
    setGuidelines((prev) => {
      const existingNames = new Set(prev.map((g) => g.name));
      const newOnes = auditGuidelines.filter((g) => !existingNames.has(g.name));
      return [...newOnes, ...prev];
    });
  }, [brandKits]);

  const handleCreateNew = () => {
    setSelectedGuideline(null);
    setModalMode('create');
  };

  const handleEdit = (guideline: BrandGuideline) => {
    setSelectedGuideline(guideline);
    if (guideline.usedByContentCount > 0) {
      setShowEditWarning(true);
    } else {
      setModalMode('edit');
    }
  };

  const handleDuplicate = (guideline: BrandGuideline) => {
    setSelectedGuideline({
      ...guideline,
      name: `${guideline.name} (Copy)`,
      id: 0,
      isDefault: false,
    });
    setModalMode('duplicate');
  };

  const handleRename = (guideline: BrandGuideline) => {
    setSelectedGuideline(guideline);
    setModalMode('rename');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this brand guideline?')) {
      setGuidelines(guidelines.filter(g => g.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setGuidelines(guidelines.map(g => ({
      ...g,
      isDefault: g.id === id,
    })));
  };

  const handleSave = (data: Partial<BrandGuideline>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      const newGuideline: BrandGuideline = {
        id: Date.now(),
        name: data.name || '',
        description: data.description || '',
        logo: data.logo || null,
        primaryColor: data.primaryColor || '#4B56F2',
        secondaryColor: data.secondaryColor || '#8B5CF6',
        headingFont: data.headingFont || 'Noto Sans SC',
        bodyFont: data.bodyFont || 'Noto Sans',
        referenceLinks: data.referenceLinks || [],
        isDefault: false,
        lastModified: new Date().toISOString().split('T')[0],
        usedByContentCount: 0,
      };
      setGuidelines([...guidelines, newGuideline]);
    } else if (modalMode === 'edit' || modalMode === 'rename') {
      setGuidelines(guidelines.map(g =>
        g.id === selectedGuideline?.id
          ? { ...g, ...data, lastModified: new Date().toISOString().split('T')[0] }
          : g
      ));
    }
    setModalMode(null);
    setSelectedGuideline(null);
  };

  const handleModifyCurrent = () => {
    setShowEditWarning(false);
    setModalMode('edit');
    setShowRegeneratePrompt(true);
  };

  const handleCreateNewVersion = () => {
    setShowEditWarning(false);
    if (selectedGuideline) {
      setSelectedGuideline({
        ...selectedGuideline,
        name: `${selectedGuideline.name} (New Version)`,
        id: 0,
        isDefault: false,
      });
    }
    setModalMode('duplicate');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Brand Guidelines</h2>
          <p className="text-sm text-muted-foreground">
            Manage multiple brand identity sets for different content strategies
          </p>
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Create New Card */}
          <button
            onClick={handleCreateNew}
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all hover:bg-primary/5 min-h-[280px] group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground mb-1">
                Create New Guideline
              </p>
              <p className="text-xs text-muted-foreground">
                Add a new brand identity set
              </p>
            </div>
          </button>

          {/* Guideline Cards */}
          {guidelines.map((guideline) => (
            <div
              key={guideline.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all group"
            >
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  {guideline.logo ? (
                    <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                      <img
                        src={guideline.logo}
                        alt={guideline.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-card border border-border rounded-lg shadow-lg p-1 min-w-[180px] z-50"
                        align="end"
                      >
                        {!guideline.isDefault && (
                          <DropdownMenu.Item
                            onClick={() => handleSetDefault(guideline.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded cursor-pointer outline-none"
                          >
                            <Star className="w-4 h-4" />
                            Set as Default
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Item
                          onClick={() => handleRename(guideline)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded cursor-pointer outline-none"
                        >
                          <Edit2 className="w-4 h-4" />
                          Rename
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleDelete(guideline.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded cursor-pointer outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground flex-1 line-clamp-1">
                    {guideline.name}
                  </h3>
                  {guideline.isDefault && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {guideline.description}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Colors Preview */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">Colors</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div
                        className="w-full h-8 rounded border border-border"
                        style={{ backgroundColor: guideline.primaryColor }}
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {guideline.primaryColor}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div
                        className="w-full h-8 rounded border border-border"
                        style={{ backgroundColor: guideline.secondaryColor }}
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {guideline.secondaryColor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fonts Preview */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">Typography</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground">
                      <span className="text-muted-foreground">H:</span> {guideline.headingFont}
                    </p>
                    <p className="text-xs text-foreground">
                      <span className="text-muted-foreground">B:</span> {guideline.bodyFont}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(guideline.lastModified).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  {guideline.usedByContentCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {guideline.usedByContentCount} items
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleEdit(guideline)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(guideline)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <GuidelineFormModal
        isOpen={modalMode !== null && !showEditWarning}
        mode={modalMode}
        guideline={selectedGuideline}
        onClose={() => {
          setModalMode(null);
          setSelectedGuideline(null);
        }}
        onSave={handleSave}
      />

      <EditWarningModal
        isOpen={showEditWarning}
        guideline={selectedGuideline}
        onClose={() => setShowEditWarning(false)}
        onModifyCurrent={handleModifyCurrent}
        onCreateNewVersion={handleCreateNewVersion}
      />

      {/* Regenerate Prompt */}
      <Dialog.Root open={showRegeneratePrompt} onOpenChange={setShowRegeneratePrompt}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-md z-50 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-semibold text-foreground mb-2">
                  Regenerate Affected Content?
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  Would you like to regenerate the {selectedGuideline?.usedByContentCount} content items
                  using this updated brand guideline?
                </Dialog.Description>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRegeneratePrompt(false);
                  // Handle regeneration logic here
                }}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Regenerate All
              </button>
              <button
                onClick={() => setShowRegeneratePrompt(false)}
                className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Skip for Now
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

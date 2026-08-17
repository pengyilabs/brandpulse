import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Upload, Trash2, Edit2, Copy, MoreVertical, Star,
  Link as LinkIcon, Type, Palette, Image as ImageIcon, X,
  AlertTriangle, CheckCircle2, Calendar, ExternalLink, Check
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuditAssets } from '../../data/audit-asset-store';
import {
  getBrandKits, createBrandKit, updateBrandKit, deleteBrandKit,
  BrandKit
} from '../../../lib/services/brand-kits-service';

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

// ─── Sample Data ───────────────────────────────────────────────────────────────

const SAMPLE_GUIDELINE: BrandGuideline & { serviceId: string } = {
  id: -1,
  serviceId: 'sample-brand-kit',
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
  usedByContentCount: 0,
};

const FONT_OPTIONS = [
  'Noto Sans SC', 'Noto Sans', 'Playfair Display', 'Montserrat', 'Poppins', 'Raleway',
  'Merriweather', 'Lora', 'Oswald', 'Source Sans Pro', 'Open Sans',
  'Roboto', 'Georgia', 'PT Serif',
];

// ─── Edit Warning Modal ───────────────────────────────────────────────────────

function EditWarningModal({ isOpen, guideline, onClose, onModifyCurrent, onCreateNewVersion }: EditWarningModalProps) {
  const { t } = useTranslation();
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
                {t('brand.guidelineInUse')}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                {t('brand.guidelineInUseDesc', { count: guideline.usedByContentCount })}
                {' '}{t('brand.howToProceed')}
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
                    {t('brand.modifyCurrent')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('brand.modifyCurrentDesc', { count: guideline.usedByContentCount })}
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
                    {t('brand.createNewVersion')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('brand.createNewVersionDesc')}
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
              {t('common.cancel')}
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
  const { t } = useTranslation();
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
    if (mode === 'create') return t('brand.createBrandGuideline');
    if (mode === 'duplicate') return t('brand.duplicateBrandGuideline');
    if (mode === 'rename') return t('brand.renameBrandGuideline');
    return t('brand.editBrandGuideline');
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
                {t('brand.brandName')}
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
                    {t('brand.brandDescription')}
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
                    {t('brand.logo')}
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
                        <p className="text-sm text-foreground">{t('brand.logoUploaded')}</p>
                      </div>
                      <button
                        onClick={() => setLogo(null)}
                        className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm"
                      >
                        {t('brand.remove')}
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
                            {t('brand.uploadLogo')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('brand.logoFormat')}
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
                      {t('brand.primaryColor')}
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
                      {t('brand.secondaryColor')}
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
                      {t('brand.headingFont')}
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
                        {t('brand.sampleHeading')}
                      </p>
                    </div>
                  </div>

                  {/* Body Font */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('brand.bodyFont')}
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
                        {t('brand.sampleBody')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reference Links */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('brand.referenceLinks')}
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
                      {t('brand.addReferenceLink')}
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
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'create' || mode === 'duplicate' ? t('common.create') : t('brand.saveChanges')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function mapServiceToUI(kit: BrandKit): BrandGuideline & { serviceId: string } {
  const colors = (kit.colors as string[]) || [];
  const fonts = (kit.fonts as string[]) || [];
  return {
    id: -Date.now() - Math.floor(Math.random() * 1000),
    serviceId: kit.id,
    name: kit.name,
    description: kit.tone_of_voice || '',
    logo: kit.logo_url,
    primaryColor: colors[0] || '#4B56F2',
    secondaryColor: colors[1] || '#000000',
    headingFont: fonts[0] || 'Noto Sans SC',
    bodyFont: fonts[1] || 'Noto Sans',
    referenceLinks: [],
    isDefault: false,
    lastModified: kit.updated_at?.split('T')[0] || '2026-01-01',
    usedByContentCount: 0,
  };
}

export function BrandGuidelinesManager() {
  const { t } = useTranslation();
  const { brandKits } = useAuditAssets();
  const [guidelines, setGuidelines] = useState<BrandGuideline[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedGuideline, setSelectedGuideline] = useState<BrandGuideline | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showRegeneratePrompt, setShowRegeneratePrompt] = useState(false);

  // Load brand kits from service
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const kits = await getBrandKits();
      if (cancelled) return;
      const uiGuidelines = kits.map(k => mapServiceToUI(k));
      setGuidelines(uiGuidelines);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Merge audit-imported brand kits
  useEffect(() => {
    if (brandKits.length === 0) return;
    setGuidelines((prev) => {
      const existingNames = new Set(prev.map((g) => g.name));
      const auditGuidelines: (BrandGuideline & { serviceId: string })[] = brandKits.map((kit, i) => ({
        id: -1000 - i,
        serviceId: `audit-${kit.name}`,
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

  const handleDelete = async (id: number) => {
    const item = guidelines.find(g => g.id === id);
    if (!item) return;
    const isServiceItem = 'serviceId' in item && (item as any).serviceId && !(item as any).serviceId.startsWith('sample-') && !(item as any).serviceId.startsWith('audit-');
    if (isServiceItem) {
      const deleted = await deleteBrandKit((item as any).serviceId);
      if (!deleted) return;
    }
    setGuidelines(guidelines.filter(g => g.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setGuidelines(guidelines.map(g => ({
      ...g,
      isDefault: g.id === id,
    })));
  };

  const handleSave = async (data: Partial<BrandGuideline>) => {
    if (modalMode === 'create' || modalMode === 'duplicate') {
      const newGuideline: BrandGuideline & { serviceId: string } = {
        id: Date.now(),
        serviceId: 'temp-new',
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
      // Persist to Supabase
      const kit = await createBrandKit(
        newGuideline.name,
        [newGuideline.primaryColor, newGuideline.secondaryColor],
        [newGuideline.headingFont, newGuideline.bodyFont],
        newGuideline.logo,
        newGuideline.description
      );
      if (kit) {
        newGuideline.serviceId = kit.id;
        newGuideline.id = -Date.now();
      }
      setGuidelines([...guidelines, newGuideline]);
    } else if (modalMode === 'edit' || modalMode === 'rename') {
      const updated = guidelines.map(g =>
        g.id === selectedGuideline?.id
          ? { ...g, ...data, lastModified: new Date().toISOString().split('T')[0] }
          : g
      );
      setGuidelines(updated);
      // Persist to Supabase
      const item = selectedGuideline as any;
      if (item?.serviceId && !item.serviceId.startsWith('sample-') && !item.serviceId.startsWith('audit-') && !item.serviceId.startsWith('temp-')) {
        await updateBrandKit(item.serviceId, {
          name: data.name ?? item.name,
          colors: [data.primaryColor ?? item.primaryColor, data.secondaryColor ?? item.secondaryColor],
          fonts: [data.headingFont ?? item.headingFont, data.bodyFont ?? item.bodyFont],
          logo_url: data.logo ?? item.logo,
          tone_of_voice: data.description ?? item.description,
        });
      }
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

  // Combine sample + service data
  const allItems = [SAMPLE_GUIDELINE, ...guidelines];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">{t('brand.brandGuidelines')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('brand.brandGuidelinesDesc')}
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
                {t('brand.createNewGuideline')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('brand.createNewGuidelineDesc')}
              </p>
            </div>
          </button>

          {/* Guideline Cards */}
          {allItems.map((guideline) => (
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
                            {t('brand.setAsDefault')}
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Item
                          onClick={() => handleRename(guideline)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded cursor-pointer outline-none"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('brand.rename')}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => handleDelete(guideline.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded cursor-pointer outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('brand.delete')}
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
                      {t('brand.default')}
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
                    <p className="text-xs font-medium text-muted-foreground">{t('brand.colors')}</p>
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
                    <p className="text-xs font-medium text-muted-foreground">{t('brand.typography')}</p>
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
                      {guideline.usedByContentCount} {t('brand.items')}
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
                    {t('brand.edit')}
                  </button>
                  <button
                    onClick={() => handleDuplicate(guideline)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {t('brand.duplicate')}
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
                  {t('brand.regenerateAffected')}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  {t('brand.regenerateAffectedDesc', { count: selectedGuideline?.usedByContentCount ?? 0 })}
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
                {t('brand.regenerateAll')}
              </button>
              <button
                onClick={() => setShowRegeneratePrompt(false)}
                className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                {t('brand.skipForNow')}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

import { useState, useRef } from 'react';
import {
  Plus, X, Upload, Trash2, Palette, Type, Info,
  FileText, Briefcase, BookOpen, Link as LinkIcon,
  User, Sparkles, Copy, Edit, Globe, Target,
  Settings, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { WordCountRangeSelector } from './word-count-range-selector';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Resource {
  id: number;
  name: string;
  type: 'document' | 'link' | 'image' | 'template';
  url: string;
}

interface BrandGuideline {
  id: number;
  name: string;
  content: string;
  isDefault?: boolean;
}

interface Theme {
  id: number;
  name: string;
  source: string;
  colors: string[];
}

type Section =
  | 'basics'
  | 'brand-kit'
  | 'brand-guidelines'
  | 'resources'
  | 'writer-profile'
  | 'themes'
  | 'long-form'
  | 'short-form';

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'basics' as const, label: 'Project Basics', icon: Settings },
  { id: 'brand-kit' as const, label: 'Brand Kit', icon: Palette },
  { id: 'brand-guidelines' as const, label: 'Brand Guidelines', icon: BookOpen },
  { id: 'resources' as const, label: 'Resources', icon: FileText },
  { id: 'writer-profile' as const, label: 'Default Writer Profile', icon: User },
  { id: 'themes' as const, label: 'Themes', icon: Sparkles },
  { id: 'long-form' as const, label: 'Long-Form Defaults', icon: FileText },
  { id: 'short-form' as const, label: 'Short-Form Defaults', icon: Briefcase },
];

const WRITER_PROFILES = [
  'Velocity Athletics Team',
  'Brand Marketing Lead',
  'Social Media Director',
  'Content Strategist',
];

const WRITING_TONES = [
  'Energetic',
  'Professional',
  'Motivational',
  'Bold',
  'Conversational',
  'Inspirational',
  'Authoritative',
  'Playful',
];

const WRITING_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const FONT_OPTIONS = [
  'Noto Sans SC',
  'Noto Sans',
  'Playfair Display',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Merriweather',
  'Lora',
  'Oswald',
  'Source Sans Pro',
  'Open Sans',
  'Roboto',
  'Georgia',
  'PT Serif',
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectSettingsPanel() {
  const [activeSection, setActiveSection] = useState<Section>('basics');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  // Project Basics State
  const [projectName, setProjectName] = useState('Velocity Athletics Project');
  const [domain, setDomain] = useState('velocity-athletics.example');
  const [projectContext, setProjectContext] = useState(
    'A multi-channel content campaign focused on promoting Velocity Athletics athletic wear and sports equipment to athletes and fitness enthusiasts.'
  );
  const [targetAudience, setTargetAudience] = useState(
    'Athletes and fitness enthusiasts, ages 18–45, performance-focused, US & global markets'
  );

  // Brand Kit State
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#4B56F2');
  const [secondaryColor, setSecondaryColor] = useState('#8B5CF6');
  const [headingFont, setHeadingFont] = useState('Noto Sans SC');
  const [bodyFont, setBodyFont] = useState('Noto Sans');
  const [isDragging, setIsDragging] = useState(false);

  // Brand Guidelines State
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([
    {
      id: 1,
      name: 'Velocity Athletics Brand Voice',
      content:
        'Bold, motivational, performance-driven. Emphasize achievement and the drive to exceed limits. Use active voice, strong verbs, and energetic language. Inspire and empower — never talk down.',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Social Media Guidelines',
      content:
        'Keep it concise and impactful. Use emojis sparingly. Always include a call-to-action. Maintain authentic, relatable tone while staying aspirational.',
    },
  ]);
  const [selectedGuideline, setSelectedGuideline] = useState(1);

  // Resources State
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, name: 'Brand Style Guide 2026', type: 'document', url: '/resources/style-guide.pdf' },
    { id: 2, name: 'Product Photography', type: 'image', url: '/resources/photography/' },
    { id: 3, name: 'Content Calendar Template', type: 'template', url: '/templates/calendar.xlsx' },
  ]);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Default Writer Profile State
  const [defaultWriterProfile, setDefaultWriterProfile] = useState('Velocity Athletics Team');

  // Themes State
  const [themes, setThemes] = useState<Theme[]>([
    { id: 1, name: 'Summer Energy', source: 'https://example.com/summer', colors: ['#FF6B35', '#F7931E', '#FDC830'] },
    { id: 2, name: 'Performance Black', source: 'manual', colors: ['#000000', '#1a1a1a', '#333333'] },
  ]);
  const [newThemeUrl, setNewThemeUrl] = useState('');
  const [showThemeForm, setShowThemeForm] = useState(false);

  // Long-Form Defaults State
  const [longFormProfile, setLongFormProfile] = useState('Velocity Athletics Team');
  const [longFormTone, setLongFormTone] = useState('Motivational');
  const [longFormLevel, setLongFormLevel] = useState('Intermediate');
  const [longFormWordCount, setLongFormWordCount] = useState<[number, number]>([1200, 1700]);
  const [longFormTopic, setLongFormTopic] = useState('');

  // Short-Form Defaults State
  const [shortFormProfile, setShortFormProfile] = useState('Velocity Athletics Team');
  const [shortFormTone, setShortFormTone] = useState('Energetic');
  const [shortFormLevel, setShortFormLevel] = useState('Beginner');
  const [shortFormWordCount, setShortFormWordCount] = useState<[number, number]>([100, 200]);
  const [shortFormTopic, setShortFormTopic] = useState('');

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handleLogoUpload = (file: File) => {
    if (!file.type.match(/image\/(png|svg\+xml|jpeg|jpg)/)) {
      alert('Please upload a PNG, SVG, or JPG file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
      setLogoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddResource = () => {
    if (!newResourceName || !newResourceUrl) return;

    const newResource: Resource = {
      id: Date.now(),
      name: newResourceName,
      type: 'link',
      url: newResourceUrl,
    };

    setResources([...resources, newResource]);
    setNewResourceName('');
    setNewResourceUrl('');
    setShowResourceForm(false);
  };

  const handleRemoveResource = (id: number) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const handleAddTheme = () => {
    if (!newThemeUrl) return;

    const newTheme: Theme = {
      id: Date.now(),
      name: `Theme from ${new URL(newThemeUrl).hostname}`,
      source: newThemeUrl,
      colors: ['#000000', '#ffffff'],
    };

    setThemes([...themes, newTheme]);
    setNewThemeUrl('');
    setShowThemeForm(false);
  };

  const handleRemoveTheme = (id: number) => {
    setThemes(themes.filter((t) => t.id !== id));
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'link':
        return LinkIcon;
      case 'image':
        return ImageIcon;
      case 'template':
        return Copy;
      default:
        return FileText;
    }
  };

  // ─── Section Renders ──────────────────────────────────────────────────────────

  const renderSection = () => {
    switch (activeSection) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Project Basics</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Core information about this project. These fields help AI understand the context for all content generation.
              </p>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                placeholder="My Project Name"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                placeholder="example.com"
              />
              <p className="text-xs text-muted-foreground mt-2">
                The primary domain or website associated with this project.
              </p>
            </div>

            {/* Project Context */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Project Context</label>
              <textarea
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground resize-none"
                placeholder="Describe the purpose and goals of this project..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                AI uses this to understand what you're trying to achieve and generate more relevant content.
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
              <textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground resize-none"
                placeholder="Who is your target audience? Demographics, interests, pain points..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Helps AI tailor content tone, complexity, and messaging to your specific audience.
              </p>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                These settings apply project-wide and are inherited by all campaigns and content items. You can override them at the campaign or content level.
              </p>
            </div>
          </div>
        );

      case 'brand-kit':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Brand Kit</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Visual identity elements that define your brand. These are applied to all generated content.
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Brand Logo</label>

              {!logo ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg transition-all ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-border/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Drop your logo here, or click to browse</p>
                    <p className="text-xs text-muted-foreground">PNG, SVG, or JPG (max. 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="border border-border rounded-lg p-6 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                        <img src={logo} alt="Brand logo" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{logoFile?.name || 'Logo uploaded'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Colors */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Brand Colors</label>
              <div className="grid grid-cols-2 gap-4">
                {/* Primary Color */}
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-sm cursor-pointer relative overflow-hidden"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground mb-2">Primary Color</p>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full px-3 py-2 bg-input-background border border-border rounded text-sm text-foreground font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-sm cursor-pointer relative overflow-hidden"
                      style={{ backgroundColor: secondaryColor }}
                    >
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground mb-2">Secondary Color</p>
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full px-3 py-2 bg-input-background border border-border rounded text-sm text-foreground font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Typography</label>
              <div className="space-y-4">
                {/* Heading Font */}
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-4 h-4 text-primary" />
                    <label className="text-xs font-medium text-foreground">Heading Font</label>
                  </div>
                  <select
                    value={headingFont}
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground mb-3"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <div className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg" style={{ fontFamily: headingFont }}>
                    <p className="text-lg font-bold text-foreground">The quick brown fox jumps over the lazy dog</p>
                  </div>
                </div>

                {/* Body Font */}
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-4 h-4 text-primary" />
                    <label className="text-xs font-medium text-foreground">Body Font</label>
                  </div>
                  <select
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-sm text-foreground mb-3"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <div className="px-4 py-3 bg-background/50 border border-border/50 rounded-lg" style={{ fontFamily: bodyFont }}>
                    <p className="text-sm text-foreground leading-relaxed">
                      The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                Your brand kit is applied to all content generated in this project. You can override these settings at the content or campaign level.
              </p>
            </div>
          </div>
        );

      case 'brand-guidelines':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Brand Guidelines</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select which brand guidelines set to use for this project. Guidelines inform tone, voice, and style for all AI-generated content.
              </p>
            </div>

            {/* Guidelines Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Active Guidelines</label>
              <select
                value={selectedGuideline}
                onChange={(e) => setSelectedGuideline(Number(e.target.value))}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {brandGuidelines.map((guideline) => (
                  <option key={guideline.id} value={guideline.id}>
                    {guideline.name} {guideline.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-3 mt-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Create New
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>

            {/* Guidelines Preview */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Preview</label>
              <div className="bg-secondary/30 border border-border rounded-lg p-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">
                  {brandGuidelines.find((g) => g.id === selectedGuideline)?.name}
                </h4>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {brandGuidelines.find((g) => g.id === selectedGuideline)?.content}
                </p>
              </div>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                Brand guidelines are used by AI when generating content to ensure consistency with your brand voice and style. You can create multiple guideline sets for different content types or campaigns.
              </p>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Resources</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload or link reference documents, templates, and other resources that inform content creation.
              </p>
            </div>

            {/* Add Resource Button */}
            <div>
              <button
                onClick={() => setShowResourceForm(!showResourceForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Resource
              </button>
            </div>

            {/* Add Resource Form */}
            {showResourceForm && (
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Resource Name</label>
                    <input
                      type="text"
                      value={newResourceName}
                      onChange={(e) => setNewResourceName(e.target.value)}
                      placeholder="e.g., Brand Style Guide"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">URL or File Path</label>
                    <input
                      type="text"
                      value={newResourceUrl}
                      onChange={(e) => setNewResourceUrl(e.target.value)}
                      placeholder="https://example.com/resource or /path/to/file"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddResource}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Resource
                    </button>
                    <button
                      onClick={() => {
                        setShowResourceForm(false);
                        setNewResourceName('');
                        setNewResourceUrl('');
                      }}
                      className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resources List */}
            <div className="space-y-3">
              {resources.map((resource) => {
                const Icon = getResourceIcon(resource.type);
                return (
                  <div key={resource.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{resource.url}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveResource(resource.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                Resources will be available when creating content and campaigns. You can add more later. These help AI understand your brand context and reference materials.
              </p>
            </div>
          </div>
        );

      case 'writer-profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Default Writer Profile</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select the default writer profile for this project. This profile determines the writing style and voice for all new content.
              </p>
            </div>

            {/* Writer Profile Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Default Profile</label>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <select
                  value={defaultWriterProfile}
                  onChange={(e) => setDefaultWriterProfile(e.target.value)}
                  className="flex-1 px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                >
                  {WRITER_PROFILES.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Preview */}
            <div className="bg-secondary/30 border border-border rounded-lg p-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Profile Settings</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tone</span>
                  <span className="text-foreground font-medium">Energetic, Motivational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expertise Level</span>
                  <span className="text-foreground font-medium">Intermediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Voice</span>
                  <span className="text-foreground font-medium">Active, Bold</span>
                </div>
              </div>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                This writer profile will be inherited by all new content items, but can be overridden per item. Existing content items will keep their current profile unless manually updated.
              </p>
            </div>
          </div>
        );

      case 'themes':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Themes</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage project-level themes that define visual styles and color palettes for campaigns and content.
              </p>
            </div>

            {/* Add Theme Button */}
            <div>
              <button
                onClick={() => setShowThemeForm(!showThemeForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add from Source
              </button>
            </div>

            {/* Add Theme Form */}
            {showThemeForm && (
              <div className="bg-secondary/30 border border-border rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Source URL</label>
                    <input
                      type="text"
                      value={newThemeUrl}
                      onChange={(e) => setNewThemeUrl(e.target.value)}
                      placeholder="https://example.com/theme or design link"
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTheme}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Import Theme
                    </button>
                    <button
                      onClick={() => {
                        setShowThemeForm(false);
                        setNewThemeUrl('');
                      }}
                      className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Themes List */}
            <div className="space-y-3">
              {themes.map((theme) => (
                <div key={theme.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{theme.name}</p>
                        <p className="text-xs text-muted-foreground">{theme.source === 'manual' ? 'Manual' : theme.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveTheme(theme.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {theme.colors.map((color, idx) => (
                      <div key={idx} className="w-8 h-8 rounded border border-border" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                Themes can be applied to campaigns and content to maintain visual consistency. Import themes from design files or create them manually.
              </p>
            </div>
          </div>
        );

      case 'long-form':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Long-Form Defaults</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Default settings for long-form content like blog posts and articles. These are applied to new long-form content items.
              </p>
            </div>

            {/* Writer Profile */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writer Profile</label>
              <select
                value={longFormProfile}
                onChange={(e) => setLongFormProfile(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITER_PROFILES.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>

            {/* Writing Tone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writing Tone</label>
              <select
                value={longFormTone}
                onChange={(e) => setLongFormTone(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITING_TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            {/* Writing Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writing Level</label>
              <select
                value={longFormLevel}
                onChange={(e) => setLongFormLevel(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITING_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Word Count Range */}
            <div>
              <WordCountRangeSelector contentForm="long-form" value={longFormWordCount} onChange={setLongFormWordCount} />
            </div>

            {/* Default Topic Preferences */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Topic Preferences</label>
              <textarea
                value={longFormTopic}
                onChange={(e) => setLongFormTopic(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground resize-none"
                placeholder="e.g., Focus on performance, training, and athletic achievement..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Optional: Specify topic areas or themes to guide content generation.
              </p>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                These defaults are applied when creating new long-form content (blog posts, articles, guides). You can override any of these settings when creating individual content items.
              </p>
            </div>
          </div>
        );

      case 'short-form':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Short-Form Defaults</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Default settings for short-form content like social media posts, captions, and short updates.
              </p>
            </div>

            {/* Writer Profile */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writer Profile</label>
              <select
                value={shortFormProfile}
                onChange={(e) => setShortFormProfile(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITER_PROFILES.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>

            {/* Writing Tone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writing Tone</label>
              <select
                value={shortFormTone}
                onChange={(e) => setShortFormTone(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITING_TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            {/* Writing Level */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Writing Level</label>
              <select
                value={shortFormLevel}
                onChange={(e) => setShortFormLevel(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                {WRITING_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Word Count Range */}
            <div>
              <WordCountRangeSelector contentForm="short-form" value={shortFormWordCount} onChange={setShortFormWordCount} />
            </div>

            {/* Default Topic Preferences */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Topic Preferences</label>
              <textarea
                value={shortFormTopic}
                onChange={(e) => setShortFormTopic(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground resize-none"
                placeholder="e.g., Daily motivation, product highlights, community engagement..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                Optional: Specify topic areas or themes to guide content generation.
              </p>
            </div>

            {/* Helper Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-400">
                These defaults are applied when creating new short-form content (social posts, captions, quick updates). You can override any of these settings when creating individual content items.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Main Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border bg-card flex-shrink-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-1">Project Settings</h2>
          <p className="text-xs text-muted-foreground mb-6">Configure defaults and preferences</p>

          <nav className="space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">{renderSection()}</div>
      </div>
    </div>
  );
}

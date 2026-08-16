import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Upload, X, FileText, Film, Mic, MessageSquare,
  Share2, ChevronDown, ChevronRight, Check, Zap, User, Plus,
  Hash, Link as LinkIcon, Scissors, Image as ImgIcon,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ContentTypeKey =
  | 'blog-post' | 'clips-shorts' | 'ai-voice-video'
  | 'quote-card' | 'image-carousel' | 'social-post';

export type SourceType = 'video' | 'image' | 'document' | 'url' | 'text';

export interface GeneratedContent {
  id: number;
  title: string;
  type: string;
  contentTypeKey: ContentTypeKey;
  sourceType: SourceType;
  funnelStage: string;
  campaign: string;
  status: 'generating';
  date: string;
}

export interface CreateContentWizardProps {
  projectId: number;
  projectName: string;
  onBack: () => void;
  onComplete: (item: GeneratedContent) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

interface ContentTypeMeta {
  label: string;
  icon: React.FC<{ className?: string }>;
  desc: string;
  credits: number;
  showWriterProfile: boolean;
  writerCategory: 'long-form' | 'social' | null;
  showKeywords: boolean;
  showQuestions: boolean;
}

const CT_META: Record<ContentTypeKey, ContentTypeMeta> = {
  'blog-post':      { label: 'Blog Post',               icon: FileText,      desc: 'Long-form article optimized for SEO',           credits: 40, showWriterProfile: true,  writerCategory: 'long-form', showKeywords: true,  showQuestions: true  },
  'clips-shorts':   { label: 'Clips & Shorts',          icon: Scissors,      desc: 'Extract short clips from your video',           credits: 20, showWriterProfile: false, writerCategory: null,        showKeywords: false, showQuestions: false },
  'ai-voice-video': { label: 'AI Text-to-Voice Video',  icon: Mic,           desc: 'Turn text into a professional voiceover video', credits: 35, showWriterProfile: true,  writerCategory: 'long-form', showKeywords: false, showQuestions: false },
  'quote-card':     { label: 'Quote Card',              icon: MessageSquare, desc: 'Designed graphic with a compelling quote',       credits: 5,  showWriterProfile: false, writerCategory: null,        showKeywords: false, showQuestions: false },
  'image-carousel': { label: 'Image / Carousel Post',   icon: ImgIcon,       desc: 'Multi-image social carousel post',              credits: 15, showWriterProfile: false, writerCategory: null,        showKeywords: false, showQuestions: false },
  'social-post':    { label: 'Social Media Post',       icon: Share2,        desc: 'LinkedIn, Twitter, Instagram, Facebook',        credits: 8,  showWriterProfile: true,  writerCategory: 'social',    showKeywords: false, showQuestions: false },
};

const FUNNEL_OPTIONS = [
  { value: 'general',       label: 'General (No Funnel)' },
  { value: 'awareness',     label: 'Awareness' },
  { value: 'consideration', label: 'Consideration' },
  { value: 'conversion',    label: 'Conversion' },
];

const MOCK_TOPICS = [
  'Product Innovation', 'Customer Success', 'Industry Trends', 'Brand Story',
  'How-To Guides', 'Expert Interviews', 'Case Studies', 'Company Culture',
];

const TEMPLATES: Record<ContentTypeKey, { id: string; name: string; color: string }[]> = {
  'blog-post':      [{ id: 'default', name: 'Standard Article', color: '#6366f1' }, { id: 'listicle', name: 'Listicle Format', color: '#8b5cf6' }, { id: 'how-to', name: 'How-To Guide', color: '#06b6d4' }],
  'clips-shorts':   [{ id: 'default', name: 'Auto Clip', color: '#f59e0b' }, { id: 'highlights', name: 'Highlights Reel', color: '#ef4444' }],
  'ai-voice-video': [{ id: 'default', name: 'Professional Voiceover', color: '#4B56F2' }, { id: 'casual', name: 'Casual Narration', color: '#3b82f6' }],
  'quote-card':     [{ id: 'default', name: 'Minimal Dark', color: '#1e1e2e' }, { id: 'gradient', name: 'Gradient Brand', color: '#6366f1' }, { id: 'light', name: 'Clean Light', color: '#94a3b8' }],
  'image-carousel': [{ id: 'default', name: 'Standard Carousel', color: '#6366f1' }, { id: 'story', name: 'Story Style', color: '#f59e0b' }],
  'social-post':    [{ id: 'default', name: 'Short & Punchy', color: '#6366f1' }, { id: 'linkedin', name: 'Long-Form LinkedIn', color: '#0077b5' }, { id: 'thread', name: 'Twitter Thread', color: '#1da1f2' }],
};

const PROJ_DEFAULTS = {
  longForm: { name: 'Alex Chen',   avatar: 'AC', tone: 'Professional',   level: 'Expert',       wordCount: '1,500' },
  social:   { name: 'Sam Rivera',  avatar: 'SR', tone: 'Conversational', level: 'Intermediate', wordCount: '280'   },
  brand:    { tone: 'Professional, Bold, Innovative', colors: ['#6366f1', '#8b5cf6', '#1e1e2e'] },
  context:  'A leading B2B SaaS platform focused on content operations and marketing automation.',
  audience: 'Marketing managers and content strategists at companies with 50–500 employees.',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectSourceType(file: File): SourceType {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('image/')) return 'image';
  return 'document';
}

function detectUrlSourceType(url: string): SourceType {
  if (/\.(mp4|mov|avi|webm)$/i.test(url)) return 'video';
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'image';
  return 'url';
}

function autoTitle(ct: ContentTypeKey, sourceName: string): string {
  const base = sourceName.replace(/\.[^.]+$/, '');
  const labels: Record<ContentTypeKey, string> = {
    'blog-post':      `Blog Post from "${base}"`,
    'clips-shorts':   `Clips from "${base}"`,
    'ai-voice-video': `Voiceover Video — ${base}`,
    'quote-card':     `Quote Card — ${base}`,
    'image-carousel': `Carousel — ${base}`,
    'social-post':    `Social Post — ${base}`,
  };
  return labels[ct];
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function DefaultBadge() {
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 leading-none">
      Project Default
    </span>
  );
}

function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = ['Source', 'Type', 'Settings', 'Preview'];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const done   = n < current;
        const active = n === current;
        return (
          <React.Fragment key={n}>
            {i > 0 && (
              <div className={`w-10 h-px mx-1 ${done ? 'bg-primary/50' : 'bg-border'}`} />
            )}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                done   ? 'bg-primary/20 text-primary' :
                active ? 'bg-primary text-primary-foreground' :
                         'bg-secondary text-muted-foreground border border-border'
              }`}>
                {done ? <Check className="w-3 h-3" /> : n}
              </div>
              <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SimpleDropdown({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-2 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:border-primary/40 transition-colors"
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden w-max min-w-full">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left whitespace-nowrap hover:bg-secondary transition-colors ${o.value === value ? 'text-primary font-medium' : 'text-foreground'}`}
            >
              {o.value === value ? <Check className="w-3 h-3" /> : <span className="w-3" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InheritedField({ label, value, expanded, onToggle, children }: {
  label: string; value: string; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2.5 bg-secondary/40 hover:bg-secondary transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <DefaultBadge />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-foreground/60 truncate max-w-[160px]">{value}</span>
          <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>
      {expanded && (
        <div className="p-3 border-t border-border bg-card/50 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Step 1: Upload Source ─────────────────────────────────────────────────────

function Step1Upload({ file, setFile, pastedUrl, setPastedUrl, sourceType, setSourceType }: {
  file: File | null; setFile: (f: File | null) => void;
  pastedUrl: string; setPastedUrl: (v: string) => void;
  sourceType: SourceType | null; setSourceType: (t: SourceType) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    setFile(f); setSourceType(detectSourceType(f)); setPastedUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setSourceType(detectSourceType(f)); setPastedUrl('');
  };

  const handleUrlChange = (v: string) => {
    setPastedUrl(v);
    if (v.trim()) { setFile(null); setSourceType(detectUrlSourceType(v)); }
  };

  const hasSource = file !== null || pastedUrl.trim().length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Upload Source Content</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Provide the source material you want to repurpose.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 py-16 ${
          dragging ? 'border-primary bg-primary/5 scale-[1.005]' :
          file     ? 'border-primary/40 bg-primary/[0.03] cursor-default' :
                     'border-border hover:border-primary/40 hover:bg-secondary/30'
        }`}
      >
        <input ref={inputRef} type="file" className="hidden"
          accept="video/*,image/*,.pdf,.doc,.docx,.txt,.md"
          onChange={handleFileChange} />

        {file ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              {sourceType === 'video'    && <Film     className="w-7 h-7 text-primary" />}
              {sourceType === 'image'    && <ImgIcon  className="w-7 h-7 text-primary" />}
              {sourceType === 'document' && <FileText className="w-7 h-7 text-primary" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB · {sourceType}</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
            >
              <X className="w-3 h-3" /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary/20' : 'bg-secondary'}`}>
              <Upload className={`w-7 h-7 transition-colors ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{dragging ? 'Drop it here' : 'Drop your source content here'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">or click to browse files</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
              {['Video', 'Images', 'PDF', 'Word', 'Text'].map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">or paste a URL / text</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* URL / text input */}
      <textarea
        value={pastedUrl}
        onChange={e => handleUrlChange(e.target.value)}
        placeholder="https://example.com/article  ·  or paste any text content…"
        rows={4}
        className="w-full rounded-xl bg-secondary border border-border px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50 transition-colors"
      />

      {hasSource && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-xs text-primary font-medium">
            Source ready — {file ? file.name : pastedUrl.length > 70 ? pastedUrl.slice(0, 70) + '…' : pastedUrl}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Step 2: Choose Content Type ───────────────────────────────────────────────

function Step2ContentType({ selected, onSelect }: {
  selected: ContentTypeKey | null; onSelect: (k: ContentTypeKey) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Choose Content Type</h2>
        <p className="text-sm text-muted-foreground mt-0.5">What do you want to create from your source?</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(CT_META) as [ContentTypeKey, ContentTypeMeta][]).map(([key, meta]) => {
          const Icon = meta.icon;
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/30 hover:bg-secondary/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{meta.desc}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" /> {meta.credits} credits
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Quick Settings ────────────────────────────────────────────────────

interface SettingsState {
  funnel: string;
  selectedTopics: string[];
  templateId: string;
  overrideWriter: boolean;
  writerName: string;
  writerTone: string;
  writerLevel: string;
  writerWordCount: string;
  keywords: string;
  questions: string;
  additionalDetails: string;
  inspirationLinks: string[];
  brandExpanded: boolean;
  contextExpanded: boolean;
  audienceExpanded: boolean;
  showAdvanced: boolean;
}

function Step3Settings({ contentType, settings, setSettings }: {
  contentType: ContentTypeKey;
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const meta = CT_META[contentType];
  const templates = TEMPLATES[contentType];
  const projWriter = meta.writerCategory === 'social' ? PROJ_DEFAULTS.social : PROJ_DEFAULTS.longForm;

  const set = <K extends keyof SettingsState>(k: K, v: SettingsState[K]) =>
    setSettings(prev => ({ ...prev, [k]: v }));

  const toggleTopic = (t: string) =>
    set('selectedTopics', settings.selectedTopics.includes(t)
      ? settings.selectedTopics.filter(x => x !== t)
      : [...settings.selectedTopics, t]);

  const addLink = () => set('inspirationLinks', [...settings.inspirationLinks, '']);
  const setLink = (i: number, v: string) => {
    const next = [...settings.inspirationLinks]; next[i] = v; set('inspirationLinks', next);
  };
  const removeLink = (i: number) =>
    set('inspirationLinks', settings.inspirationLinks.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Quick Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fields marked <span className="text-primary font-medium">Project Default</span> are inherited — edit to override.
        </p>
      </div>

        {/* Funnel */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Funnel Stage</label>
          <SimpleDropdown value={settings.funnel} onChange={v => set('funnel', v)} options={FUNNEL_OPTIONS} />
        </div>

        {/* Topics */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Topic <span className="text-muted-foreground/50 font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_TOPICS.map(t => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  settings.selectedTopics.includes(t)
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                <Hash className="w-2.5 h-2.5" />{t}
              </button>
            ))}
          </div>
        </div>

        {/* Template */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Template</label>
            <DefaultBadge />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => set('templateId', tpl.id)}
                className={`flex flex-col items-start gap-2 p-3 rounded-xl border shrink-0 transition-all ${
                  settings.templateId === tpl.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="w-20 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: tpl.color + '22' }}>
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: tpl.color }} />
                </div>
                <span className="text-[11px] font-medium text-foreground">{tpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Writer Profile */}
        {meta.showWriterProfile && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Writer Profile</label>
                {!settings.overrideWriter && <DefaultBadge />}
              </div>
              <button
                onClick={() => set('overrideWriter', !settings.overrideWriter)}
                className="text-[11px] text-primary hover:underline"
              >
                {settings.overrideWriter ? 'Reset to default' : 'Override'}
              </button>
            </div>
            <div className="rounded-xl border border-border p-3 space-y-3 bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {projWriter.avatar}
                </div>
                {settings.overrideWriter ? (
                  <input value={settings.writerName} onChange={e => set('writerName', e.target.value)}
                    className="flex-1 bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">{projWriter.name}</p>
                    <p className="text-xs text-muted-foreground">{projWriter.tone} · {projWriter.level} · {projWriter.wordCount} words</p>
                  </div>
                )}
              </div>
              {settings.overrideWriter && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Tone', key: 'writerTone' as const, val: settings.writerTone },
                    { label: 'Level', key: 'writerLevel' as const, val: settings.writerLevel },
                    { label: 'Word Count', key: 'writerWordCount' as const, val: settings.writerWordCount },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">{f.label}</label>
                      <input value={f.val} onChange={e => set(f.key, e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => set('showAdvanced', !settings.showAdvanced)}
            className="flex items-center justify-between w-full px-3 py-2.5 bg-secondary/20 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground">Advanced Settings</span>
            <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${settings.showAdvanced ? 'rotate-90' : ''}`} />
          </button>
          {settings.showAdvanced && (
            <div className="p-4 border-t border-border space-y-3">
              {meta.showKeywords && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Secondary Keywords</label>
                  <input value={settings.keywords} onChange={e => set('keywords', e.target.value)}
                    placeholder="SEO keywords, comma-separated"
                    className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50" />
                </div>
              )}
              {meta.showQuestions && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Questions to Answer</label>
                  <textarea value={settings.questions} onChange={e => set('questions', e.target.value)}
                    placeholder="What questions should this content address?"
                    rows={2}
                    className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">Additional Details</label>
                <textarea value={settings.additionalDetails} onChange={e => set('additionalDetails', e.target.value)}
                  placeholder="Any additional context or requirements…"
                  rows={2}
                  className="w-full bg-secondary border border-border rounded-lg px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Inspiration References</label>
                {settings.inspirationLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <input value={link} onChange={e => setLink(i, e.target.value)}
                      placeholder="https://example.com/reference"
                      className="flex-1 bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50" />
                    {settings.inspirationLinks.length > 1 && (
                      <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addLink} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Plus className="w-3 h-3" /> Add reference
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Inherited fields */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inherited from Project</p>

        <InheritedField
          label="Brand Guidelines"
          value={PROJ_DEFAULTS.brand.tone}
          expanded={settings.brandExpanded}
          onToggle={() => set('brandExpanded', !settings.brandExpanded)}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              {PROJ_DEFAULTS.brand.colors.map(c => (
                <div key={c} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">Brand colors</span>
            </div>
            <textarea defaultValue={PROJ_DEFAULTS.brand.tone} rows={2}
              className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary/50" />
          </div>
        </InheritedField>

        <InheritedField
          label="Project Context"
          value={PROJ_DEFAULTS.context.slice(0, 70) + '…'}
          expanded={settings.contextExpanded}
          onToggle={() => set('contextExpanded', !settings.contextExpanded)}
        >
          <textarea defaultValue={PROJ_DEFAULTS.context} rows={3}
            className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary/50" />
        </InheritedField>

        <InheritedField
          label="Target Audience"
          value={PROJ_DEFAULTS.audience.slice(0, 70) + '…'}
          expanded={settings.audienceExpanded}
          onToggle={() => set('audienceExpanded', !settings.audienceExpanded)}
        >
          <textarea defaultValue={PROJ_DEFAULTS.audience} rows={3}
            className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary/50" />
        </InheritedField>
      </div>
    </div>
  );
}

// ── Step 4: Preview & Generate ────────────────────────────────────────────────

function Step4Preview({ contentType, file, pastedUrl, settings, onGenerate }: {
  contentType: ContentTypeKey; file: File | null; pastedUrl: string;
  settings: SettingsState; onGenerate: () => void;
}) {
  const meta = CT_META[contentType];
  const template = TEMPLATES[contentType].find(t => t.id === settings.templateId) ?? TEMPLATES[contentType][0];
  const projWriter = meta.writerCategory === 'social' ? PROJ_DEFAULTS.social : PROJ_DEFAULTS.longForm;
  const writerName = settings.overrideWriter ? settings.writerName : projWriter.name;
  const writerAvatar = settings.overrideWriter ? writerName.split(' ').map((n: string) => n[0]).join('') : projWriter.avatar;
  const sourceName = file ? file.name : pastedUrl.length > 50 ? pastedUrl.slice(0, 50) + '…' : pastedUrl;
  const Icon = meta.icon;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Ready to Generate</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Review your settings — then generate.</p>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/20 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{meta.label}</p>
            <p className="text-xs text-muted-foreground">{meta.desc}</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">{meta.credits} credits</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-px bg-border">
          {[
            { label: 'Source',       value: sourceName },
            { label: 'Funnel Stage', value: settings.funnel === 'general' ? 'General' : settings.funnel.charAt(0).toUpperCase() + settings.funnel.slice(1) },
            { label: 'Template',     value: template.name },
            ...(meta.showWriterProfile ? [{ label: 'Writer', value: writerName }] : [{ label: 'Category', value: 'Visual' }]),
          ].map(row => (
            <div key={row.label} className="p-3 bg-card space-y-0.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{row.label}</p>
              <p className="text-sm text-foreground font-medium truncate">{row.value}</p>
            </div>
          ))}
        </div>
        {settings.selectedTopics.length > 0 && (
          <div className="p-3 border-t border-border space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {settings.selectedTopics.map(t => (
                <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary">
                  <Hash className="w-2.5 h-2.5" />{t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" />
        Generate Content · {meta.credits} credits
      </button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Content will appear on your calendar with a <span className="text-foreground font-medium">Generating</span> status while AI works on it.
      </p>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SettingsState = {
  funnel: 'general', selectedTopics: [], templateId: 'default',
  overrideWriter: false,
  writerName: PROJ_DEFAULTS.longForm.name, writerTone: PROJ_DEFAULTS.longForm.tone,
  writerLevel: PROJ_DEFAULTS.longForm.level, writerWordCount: PROJ_DEFAULTS.longForm.wordCount,
  keywords: '', questions: '', additionalDetails: '', inspirationLinks: [''],
  brandExpanded: false, contextExpanded: false, audienceExpanded: false, showAdvanced: false,
};

export function CreateContentWizard({ projectId: _projectId, projectName, onBack, onComplete }: CreateContentWizardProps) {
  const [step, setStep]               = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile]               = useState<File | null>(null);
  const [pastedUrl, setPastedUrl]     = useState('');
  const [sourceType, setSourceType]   = useState<SourceType | null>(null);
  const [contentType, setContentType] = useState<ContentTypeKey | null>(null);
  const [settings, setSettings]       = useState<SettingsState>(DEFAULT_SETTINGS);

  const hasSource = file !== null || pastedUrl.trim().length > 0;

  const handleGenerate = () => {
    if (!contentType) return;
    const sourceName = file ? file.name : pastedUrl;
    onComplete({
      id: Date.now(),
      title: autoTitle(contentType, sourceName),
      type: CT_META[contentType].label,
      contentTypeKey: contentType,
      sourceType: sourceType ?? 'text',
      funnelStage: settings.funnel === 'general' ? 'Awareness' : settings.funnel.charAt(0).toUpperCase() + settings.funnel.slice(1),
      campaign: 'One-Off',
      status: 'generating',
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Content is being generated…', {
      description: `${CT_META[contentType].label} will appear on your calendar shortly.`,
    });
  };

  const canProceed =
    (step === 1 && hasSource) ||
    (step === 2 && contentType !== null) ||
    step >= 3;

  const goBack = () => { if (step === 1) onBack(); else setStep(s => (s - 1) as 1 | 2 | 3 | 4); };
  const goNext = () => setStep(s => (s + 1) as 1 | 2 | 3 | 4);

  return (
    <div className="flex flex-col h-full bg-background">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 h-14 border-b border-border shrink-0 bg-card/20">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground truncate">{projectName}</p>
            <p className="text-sm font-semibold text-foreground leading-tight">Create One-Off Content</p>
          </div>
        </div>

        {/* Center — truly centered via grid */}
        <StepIndicator current={step} />

        {/* Right — empty column to mirror left */}
        <div />
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {step === 1 && (
            <Step1Upload
              file={file} setFile={setFile}
              pastedUrl={pastedUrl} setPastedUrl={setPastedUrl}
              sourceType={sourceType} setSourceType={setSourceType}
            />
          )}
          {step === 2 && (
            <Step2ContentType selected={contentType} onSelect={setContentType} />
          )}
          {step === 3 && contentType && (
            <Step3Settings contentType={contentType} settings={settings} setSettings={setSettings} />
          )}
          {step === 4 && contentType && (
            <Step4Preview
              contentType={contentType} file={file} pastedUrl={pastedUrl}
              settings={settings} onGenerate={handleGenerate}
            />
          )}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border px-5 py-3 flex items-center bg-card/20">
        <button
          onClick={goBack}
          className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {step === 1 ? 'Cancel' : '← Back'}
        </button>

        <div className="flex-1 flex justify-center">
          <span className="text-xs text-muted-foreground">Step {step} of 4</span>
        </div>

        {step < 4 && (
          <button
            onClick={goNext}
            disabled={!canProceed}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Next →
          </button>
        )}
        {step === 4 && <div className="w-[86px]" />}
      </div>
    </div>
  );
}

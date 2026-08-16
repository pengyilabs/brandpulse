import { useState, useMemo, useRef, useCallback } from 'react';
import {
  FileText, Scissors, Star, Wand2, Quote, ChevronDown, X, RefreshCw,
  Trash2, Send, Copy, Check, ChevronLeft, ChevronRight, Loader2,
  AlertCircle, Upload, Paperclip, Tag, Share2, Link2,
  Instagram, Facebook, Linkedin, Twitter, Youtube, Music2,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { PostDetailModal } from './post-detail-modal';

// ─── Types ──────────────────────────────────────────────────────────────────

type ContentType = 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video' | 'quote-card' | 'social-post';
type Platform = 'instagram' | 'facebook' | 'linkedin' | 'x' | 'tiktok' | 'youtube';
type FunnelStage = 'top' | 'middle' | 'bottom';
type Status = 'draft' | 'generating' | 'review' | 'approved' | 'published' | 'rejected';

interface CalendarItem {
  id: string;
  title: string;
  date: Date;
  contentType: ContentType;
  funnelStage: FunnelStage;
  status: Status;
  campaign: string;
  batchId?: string;
  platform?: Platform;
}

interface RegenerationSettings {
  description: string;
  directions: string;
  brandGuideline: string;
  topics: string;
  funnelStage: FunnelStage;
  contentGuidelines: string;
  tone: string;
  platform: string;
  length: string;
  angle: string;
  additionalInstructions: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface ContentVersion {
  id: number;
  settings: RegenerationSettings;
  output: string;
  generatedAt: Date;
}

// ─── Batch color palette ─────────────────────────────────────────────────────

const BATCH_PALETTE = [
  { bg: 'rgba(139,92,246,0.07)',  bar: '#8B5CF6', text: '#A78BFA' },
  { bg: 'rgba(236,72,153,0.07)',  bar: '#EC4899', text: '#F472B6' },
  { bg: 'rgba(245,158,11,0.07)',  bar: '#F59E0B', text: '#FCD34D' },
  { bg: 'rgba(6,182,212,0.07)',   bar: '#06B6D4', text: '#22D3EE' },
  { bg: 'rgba(132,204,22,0.07)',  bar: '#84CC16', text: '#A3E635' },
];

function getBatchColor(batchId: string) {
  let h = 0;
  for (let i = 0; i < batchId.length; i++) { h = ((h << 5) - h) + batchId.charCodeAt(i); h |= 0; }
  return BATCH_PALETTE[Math.abs(h) % BATCH_PALETTE.length];
}

// ─── Platform icon map ───────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<Platform, React.ReactElement> = {
  instagram: <Instagram className="w-3 h-3" />,
  facebook:  <Facebook  className="w-3 h-3" />,
  linkedin:  <Linkedin  className="w-3 h-3" />,
  x:         <Twitter   className="w-3 h-3" />,
  tiktok:    <Music2    className="w-3 h-3" />,
  youtube:   <Youtube   className="w-3 h-3" />,
};

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook:  'Facebook',
  linkedin:  'LinkedIn',
  x:         'X (Twitter)',
  tiktok:    'TikTok',
  youtube:   'YouTube',
};

// ─── Content type maps ───────────────────────────────────────────────────────

const CONTENT_TYPE_ICON_MAP: Record<ContentType, React.ReactElement> = {
  'long-form':      <FileText  className="w-3.5 h-3.5" />,
  'short-clip':     <Scissors  className="w-3.5 h-3.5" />,
  'highlight-reel': <Star      className="w-3.5 h-3.5" />,
  'ai-video':       <Wand2     className="w-3.5 h-3.5" />,
  'quote-card':     <Quote     className="w-3.5 h-3.5" />,
  'social-post':    <Share2    className="w-3.5 h-3.5" />,
};

const CONTENT_TYPE_LABEL: Record<ContentType, string> = {
  'long-form':      'Long Form',
  'short-clip':     'Short Clip',
  'highlight-reel': 'Highlight Reel',
  'ai-video':       'AI Video',
  'quote-card':     'Quote Card',
  'social-post':    'Social Post',
};

// ─── Mock outputs ─────────────────────────────────────────────────────────────

const MOCK_OUTPUTS = [
  "Unlock your full potential this summer with our latest athletic collection. Engineered for peak performance and crafted for comfort, every piece is designed to move with you — not against you. Whether you're crushing a PR or recovering smart, this is gear built for athletes who never settle. Shop the Summer Collection now and train like you mean it. #AthleticPerformance #SummerCollection",
  "This summer, we didn't just design clothes — we designed a mindset. Our new collection combines cutting-edge fabric technology with a silhouette that transitions seamlessly from track to street. Sweat-wicking, four-way stretch, and built to outlast your longest sessions. Ready to elevate your game? The Summer Collection is live now.",
  "Summer training demands summer-ready gear. We've spent months testing, refining, and pushing every fabric and seam so you don't have to think about your kit — only your next rep. The Summer Collection is here: lighter, faster, and more durable than ever. Tap to explore and gear up for the season that defines your year.",
];

function getVersionOutput(versionIndex: number): string {
  return MOCK_OUTPUTS[versionIndex % MOCK_OUTPUTS.length];
}

const DEFAULT_SETTINGS: RegenerationSettings = {
  description: 'A high-energy piece showcasing our latest athletic collection, designed to inspire action and drive product discovery.',
  directions: 'Lead with an aspirational hook. Reference seasonal relevance. End with a clear CTA.',
  brandGuideline: 'Velocity Athletics Brand Standards 2026',
  topics: 'performance, summer, athletic gear, lifestyle',
  funnelStage: 'top',
  contentGuidelines: 'Keep language active and energetic. Avoid passive voice. Use second-person ("you") to address the reader directly.',
  tone: 'Motivational',
  platform: 'Instagram',
  length: 'Medium (150–250 words)',
  angle: 'Product launch',
  additionalInstructions: '',
};

// ─── Utils ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── RegenerateModal ─────────────────────────────────────────────────────────

function RegenerateModal({ items, onClose, onConfirmRegenerate }: { items: CalendarItem[]; onClose: () => void; onConfirmRegenerate: (ids: string[]) => void }) {
  const primaryItem = items[0];

  const makeInitialVersions = (): ContentVersion[] => [
    { id: 1, settings: { ...DEFAULT_SETTINGS, tone: 'Motivational', angle: 'Product launch' },          output: getVersionOutput(0), generatedAt: new Date(Date.now() - 86400000 * 2) },
    { id: 2, settings: { ...DEFAULT_SETTINGS, tone: 'Inspirational', length: 'Short (under 100 words)', angle: 'Lifestyle & brand story' }, output: getVersionOutput(1), generatedAt: new Date(Date.now() - 3600000) },
  ];

  const [versions, setVersions] = useState<ContentVersion[]>(makeInitialVersions);
  const [currentIndex, setCurrentIndex] = useState(versions.length - 1);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<RegenerationSettings>(versions[versions.length - 1].settings);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toneOptions = ['Motivational', 'Inspirational', 'Professional', 'Casual', 'Humorous', 'Educational', 'Authoritative', 'Empathetic'];
  const platformOptions = ['Instagram', 'LinkedIn', 'Twitter/X', 'Facebook', 'TikTok', 'Email', 'YouTube', 'Blog'];
  const angleOptions = ['Product launch', 'Lifestyle & brand story', 'Educational / Tips', 'Social proof', 'Behind the scenes', 'Seasonal / Trend', 'Problem / Solution', 'Comparison'];
  const brandGuidelineOptions = ['Velocity Athletics Brand Standards 2026', 'Minimalist Tech Voice', 'Wellness & Mindfulness', 'B2B Professional Tone', 'Youth Culture / Gen Z'];
  const funnelOptions: { value: FunnelStage; label: string }[] = [
    { value: 'top',    label: 'Top of Funnel — Awareness' },
    { value: 'middle', label: 'Middle of Funnel — Consideration' },
    { value: 'bottom', label: 'Bottom of Funnel — Conversion' },
  ];

  // Compute which fields are shared across all selected items
  const platforms = [...new Set(items.map(i => i.platform).filter(Boolean))];
  const showPlatform = platforms.length === 1; // only when every item shares the same single platform
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const [previewItemId, setPreviewItemId] = useState<string | null>(null);
  const previewItem = items.find(i => i.id === previewItemId) ?? null;

  const current = versions[currentIndex];
  const handleVersionChange = (index: number) => { setCurrentIndex(index); setSettings(versions[index].settings); };
  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const nv: ContentVersion = { id: versions.length + 1, settings: { ...settings }, output: getVersionOutput(versions.length), generatedAt: new Date() };
      const nVersions = [...versions, nv];
      setVersions(nVersions);
      setCurrentIndex(nVersions.length - 1);
      setIsRegenerating(false);
    }, 1800);
  };
  const handleCopy = () => { navigator.clipboard.writeText(current.output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const handleFiles = (files: FileList | null) => { if (!files) return; setUploadedFiles(prev => [...prev, ...Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }))]); };
  const set = <K extends keyof RegenerationSettings>(key: K, val: RegenerationSettings[K]) => setSettings(s => ({ ...s, [key]: val }));

  const inputCls = 'w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50';
  const textareaCls = `${inputCls} resize-none leading-relaxed`;
  const labelCls = 'block text-xs font-medium text-muted-foreground mb-1.5';
  const sectionTitleCls = 'text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative flex rounded-2xl shadow-2xl overflow-hidden border border-border w-full" style={{ maxWidth: '900px', height: '88vh' }} onClick={e => e.stopPropagation()}>

        {/* Left panel */}
        <div className="flex flex-col bg-[#0F0F0F] border-r border-border w-60 flex-shrink-0">
          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary/15 text-primary text-[10px] font-black flex-shrink-0">{items.length}</span>
              <p className="text-xs font-semibold text-foreground">{items.length === 1 ? 'item will be regenerated' : 'items will be regenerated'}</p>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">{primaryItem.campaign}</p>
          </div>

          {/* Item list — all equal weight, click to preview */}
          <div className="overflow-y-auto flex-1 py-1.5">
            {items.map((it) => {
              const isPreviewing = previewItemId === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setPreviewItemId(isPreviewing ? null : it.id)}
                  className={`w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors group ${isPreviewing ? 'bg-secondary/50' : 'hover:bg-secondary/25'}`}
                >
                  {/* Content type icon */}
                  <span className="flex-shrink-0 mt-0.5 text-muted-foreground/70">
                    {CONTENT_TYPE_ICON_MAP[it.contentType]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-tight truncate">{it.title}</p>
                    {/* Content type + platform row */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{CONTENT_TYPE_LABEL[it.contentType]}</span>
                      {it.platform && (
                        <>
                          <span className="text-muted-foreground/30 text-[10px]">·</span>
                          <span className="text-muted-foreground/70">{PLATFORM_ICONS[it.platform]}</span>
                          <span className="text-[11px] text-muted-foreground/60">{PLATFORM_LABEL[it.platform]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Preview toggle hint */}
                  <span className={`flex-shrink-0 text-[9px] font-semibold uppercase tracking-wide transition-opacity mt-0.5 ${isPreviewing ? 'text-primary opacity-100' : 'text-muted-foreground/40 opacity-0 group-hover:opacity-100'}`}>
                    {isPreviewing ? 'Hide' : 'View'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline content preview — shown when an item is clicked */}
          {previewItem && (
            <div className="border-t border-border flex-shrink-0">
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Current Content</p>
                <button onClick={() => setPreviewItemId(null)} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"><X className="w-3 h-3" /></button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed px-4 pb-3 max-h-28 overflow-y-auto">
                {MOCK_OUTPUTS[0].slice(0, 200)}…
              </p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col flex-1 bg-card min-w-0">
          <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold leading-tight">Regenerate Content</h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">Version {currentIndex + 1} — {format(current.generatedAt, "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
            <div className="flex items-center gap-1 bg-secondary rounded-lg px-1 py-1">
              <button onClick={() => handleVersionChange(currentIndex - 1)} disabled={currentIndex === 0} className="w-6 h-6 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card enabled:cursor-pointer text-muted-foreground hover:text-foreground"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="text-xs font-medium tabular-nums text-foreground px-1 min-w-[2.4rem] text-center">{currentIndex + 1} / {versions.length}</span>
              <button onClick={() => handleVersionChange(currentIndex + 1)} disabled={currentIndex === versions.length - 1} className="w-6 h-6 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card enabled:cursor-pointer text-muted-foreground hover:text-foreground"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <section>
                <p className={sectionTitleCls}>Content Settings</p>
                <div className="space-y-3">
                  <div><label className={labelCls}>Description</label><textarea rows={3} value={settings.description} onChange={e => set('description', e.target.value)} placeholder="What is this content piece about?" className={textareaCls} /></div>
                  <div><label className={labelCls}>Directions</label><textarea rows={2} value={settings.directions} onChange={e => set('directions', e.target.value)} placeholder="Specific directions for the AI" className={textareaCls} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Brand Guideline</label><select value={settings.brandGuideline} onChange={e => set('brandGuideline', e.target.value)} className={inputCls}>{brandGuidelineOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                    <div><label className={labelCls}>Funnel Stage</label><select value={settings.funnelStage} onChange={e => set('funnelStage', e.target.value as FunnelStage)} className={inputCls}>{funnelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                  </div>
                  <div><label className={labelCls}>Topics <span className="text-muted-foreground/50 font-normal">(comma-separated)</span></label><div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" /><input type="text" value={settings.topics} onChange={e => set('topics', e.target.value)} className={`${inputCls} pl-8`} /></div></div>
                  <div><label className={labelCls}>Content Guidelines</label><textarea rows={2} value={settings.contentGuidelines} onChange={e => set('contentGuidelines', e.target.value)} className={textareaCls} /></div>
                </div>
              </section>
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className={sectionTitleCls} style={{ marginBottom: 0 }}>Generation Options</p>
                  {items.length > 1 && !showPlatform && (
                    <span className="text-[10px] text-muted-foreground/50 font-medium">Mixed types — platform hidden</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelCls}>Tone</label><select value={settings.tone} onChange={e => set('tone', e.target.value)} className={inputCls}>{toneOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  {showPlatform && (
                    <div><label className={labelCls}>Platform</label><select value={settings.platform} onChange={e => set('platform', e.target.value)} className={inputCls}>{platformOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                  )}
                  {/* Length intentionally omitted — not meaningful across mixed content types */}
                  <div className={showPlatform ? 'col-span-2' : ''}><label className={labelCls}>Content Angle</label><select value={settings.angle} onChange={e => set('angle', e.target.value)} className={inputCls}>{angleOptions.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                </div>
              </section>
              <section>
                <p className={sectionTitleCls}>Additional Instructions</p>
                <textarea rows={2} value={settings.additionalInstructions} onChange={e => set('additionalInstructions', e.target.value)} placeholder="Anything else to guide this regeneration…" className={textareaCls} />
              </section>
              <section>
                <p className={sectionTitleCls}>Upload New Resource</p>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${isDragging ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/60 hover:bg-secondary/30 bg-transparent'}`}
                >
                  <Upload className={`w-5 h-5 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Drop files here or <span className="text-primary">browse</span></p>
                    <p className="text-xs text-muted-foreground mt-0.5">Text documents, images, PDFs — used as additional context</p>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-secondary/40 rounded-lg">
                        <Paperclip className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-foreground truncate flex-1">{f.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{formatFileSize(f.size)}</span>
                        <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className={sectionTitleCls} style={{ marginBottom: 0 }}>Generated Output</p>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className={`min-h-28 px-4 py-3 bg-[#111] border border-border rounded-xl text-sm leading-relaxed text-foreground transition-opacity duration-300 ${isRegenerating ? 'opacity-40' : 'opacity-100'}`}>
                  {isRegenerating ? <div className="flex items-center gap-2 text-muted-foreground py-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Generating new version…</span></div> : current.output}
                </div>
              </section>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-shrink-0 bg-card">
            <button
              onClick={() => setShowVersionHistory(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Version History
            </button>
            <div className="flex-1" />
            <button
              onClick={() => { onConfirmRegenerate(items.map(i => i.id)); onClose(); }}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate {items.length > 1 ? `All ${items.length}` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EditModal ───────────────────────────────────────────────────────────────

function EditModal({ item, onClose, onSave, onRegenerate }: { item: CalendarItem; onClose: () => void; onSave: (item: CalendarItem) => void; onRegenerate: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState<Status>(item.status);
  const [funnelStage, setFunnelStage] = useState<FunnelStage>(item.funnelStage);

  const statusOptions: Status[] = ['draft', 'generating', 'review', 'approved', 'published', 'rejected'];
  const funnelOptions: { value: FunnelStage; label: string }[] = [
    { value: 'top', label: 'Top of Funnel' }, { value: 'middle', label: 'Middle of Funnel' }, { value: 'bottom', label: 'Bottom of Funnel' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold">Edit Content</h2>
            {item.platform && (
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                {PLATFORM_ICONS[item.platform]}
                <span>{PLATFORM_LABEL[item.platform]}</span>
                {item.batchId && (
                  <span className="flex items-center gap-1 ml-2 text-[10px] text-muted-foreground/50 font-medium">
                    <Link2 className="w-2.5 h-2.5" /> Part of a batch
                  </span>
                )}
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all" /></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label><select value={status} onChange={e => setStatus(e.target.value as Status)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all">{statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Funnel Stage</label><select value={funnelStage} onChange={e => setFunnelStage(e.target.value as FunnelStage)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all">{funnelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-muted-foreground mb-1.5">Scheduled Date</label><div className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-muted-foreground">{format(item.date, 'MMMM d, yyyy')}</div></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onRegenerate} className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-medium transition-colors"><RefreshCw className="w-3.5 h-3.5 text-primary" />Regenerate</button>
          <div className="flex-1" />
          <button onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => { onSave({ ...item, title, status, funnelStage }); onClose(); }} className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── SelectionBar ─────────────────────────────────────────────────────────────

function SelectionBar({ count, onClear, onRegenerate, onPublish, onDuplicate, onDelete, campaignError }: {
  count: number; onClear: () => void; onRegenerate: () => void; onPublish: () => void; onDuplicate: () => void; onDelete: () => void; campaignError: boolean;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
      {campaignError && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-destructive/15 border border-destructive/30 rounded-xl text-sm text-destructive backdrop-blur-sm shadow-lg max-w-sm text-center">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{"You're trying to regenerate from different campaigns. Please select items from only one campaign."}</span>
        </div>
      )}
      <div className="flex items-center gap-3 bg-[#1C1C1C] border border-white/10 rounded-2xl shadow-2xl px-4 py-3 min-w-max">
        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>
          <span className="text-sm font-semibold text-foreground">{count} selected</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onRegenerate} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/8 text-sm text-foreground transition-colors group"><RefreshCw className="w-3.5 h-3.5 text-primary group-hover:rotate-180 transition-transform duration-300" /><span>Regenerate</span></button>
          <button onClick={onPublish} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/8 text-sm text-foreground transition-colors"><Send className="w-3.5 h-3.5 text-[#3B82F6]" /><span>Publish</span></button>
          <button onClick={onDuplicate} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/8 text-sm text-foreground transition-colors"><Copy className="w-3.5 h-3.5 text-muted-foreground" /><span>Duplicate</span></button>
          <button onClick={onDelete} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-sm text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /><span>Delete</span></button>
        </div>
        <button onClick={onClear} className="ml-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"><X className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

// ─── CalendarView ─────────────────────────────────────────────────────────────

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedContentTypes, setSelectedContentTypes] = useState<Set<ContentType>>(new Set());
  const [selectedFunnelStages, setSelectedFunnelStages] = useState<Set<FunnelStage>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<Status>>(new Set());
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);
  const [regeneratingItems, setRegeneratingItems] = useState<CalendarItem[]>([]);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [campaignError, setCampaignError] = useState(false);

  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([

    // ── May 5 — Batch: article + highlight reel from same production session ──
    { id: 'w1-lf',  title: 'Summer Drop: Full Story',       date: new Date(2026, 4, 5),  contentType: 'long-form',      funnelStage: 'top',    status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'batch-launch-may5' },
    { id: 'w1-hr',  title: 'Summer Drop Highlight Reel',    date: new Date(2026, 4, 5),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'batch-launch-may5' },

    // ── May 7 — Batch: 5-platform social blast (Velocity Air Max reveal) ──
    { id: 'am-ig',  title: 'Velocity Air Max Reveal',                date: new Date(2026, 4, 7),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top', status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'batch-airmax-may7' },
    { id: 'am-fb',  title: 'Velocity Air Max Reveal',                date: new Date(2026, 4, 7),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top', status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'batch-airmax-may7' },
    { id: 'am-tk',  title: 'Velocity Air Max Reveal',                date: new Date(2026, 4, 7),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'batch-airmax-may7' },
    { id: 'am-x',   title: 'Velocity Air Max Reveal',                date: new Date(2026, 4, 7),  contentType: 'social-post', platform: 'x',         funnelStage: 'top', status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'batch-airmax-may7' },
    { id: 'am-yt',  title: 'Velocity Air Max Reveal',                date: new Date(2026, 4, 7),  contentType: 'social-post', platform: 'youtube',   funnelStage: 'top', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'batch-airmax-may7' },

    // ── May 8 — singleton ──
    { id: 'c3',     title: 'Motivational Quote Card',       date: new Date(2026, 4, 8),  contentType: 'quote-card',     funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop' },

    // ── May 12 — Batch: brand film AI video + two social teasers ──
    { id: 'bf-av',  title: 'Brand Story Film',              date: new Date(2026, 4, 12), contentType: 'ai-video',    funnelStage: 'top', status: 'generating', campaign: 'Brand Awareness Q2', batchId: 'batch-brandfim-may12' },
    { id: 'bf-ig',  title: 'Brand Story Teaser',            date: new Date(2026, 4, 12), contentType: 'social-post', platform: 'instagram', funnelStage: 'top', status: 'draft',   campaign: 'Brand Awareness Q2', batchId: 'batch-brandfim-may12' },
    { id: 'bf-li',  title: 'Brand Story Teaser',            date: new Date(2026, 4, 12), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top', status: 'draft',   campaign: 'Brand Awareness Q2', batchId: 'batch-brandfim-may12' },

    // ── May 14 — Batch: 4-platform social blast (Summer Collection) ──
    { id: 'sl-ig',  title: 'Summer Collection',             date: new Date(2026, 4, 14), contentType: 'social-post', platform: 'instagram', funnelStage: 'top', status: 'approved',  campaign: 'Velocity Summer Drop', batchId: 'batch-social-may14' },
    { id: 'sl-fb',  title: 'Summer Collection',             date: new Date(2026, 4, 14), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top', status: 'approved',  campaign: 'Velocity Summer Drop', batchId: 'batch-social-may14' },
    { id: 'sl-tk',  title: 'Summer Collection',             date: new Date(2026, 4, 14), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top', status: 'review',    campaign: 'Velocity Summer Drop', batchId: 'batch-social-may14' },
    { id: 'sl-x',   title: 'Summer Collection',             date: new Date(2026, 4, 14), contentType: 'social-post', platform: 'x',         funnelStage: 'top', status: 'draft',     campaign: 'Velocity Summer Drop', batchId: 'batch-social-may14' },

    // ── May 15 — singleton ──
    { id: 'c5',     title: 'Case Study: Rise of Q2',        date: new Date(2026, 4, 15), contentType: 'long-form',      funnelStage: 'bottom', status: 'draft',      campaign: 'Brand Awareness Q2' },

    // ── May 19 — Batch: athlete interview repurposed into 3 formats ──
    { id: 'ai-lf',  title: 'Athlete Interview: Training Secrets', date: new Date(2026, 4, 19), contentType: 'long-form',  funnelStage: 'middle', status: 'approved', campaign: 'Velocity Summer Drop', batchId: 'batch-interview-may19' },
    { id: 'ai-sc',  title: 'Training Secrets Clip',         date: new Date(2026, 4, 19), contentType: 'short-clip',     funnelStage: 'middle', status: 'approved', campaign: 'Velocity Summer Drop', batchId: 'batch-interview-may19' },
    { id: 'ai-qc',  title: '"Push Beyond Limits"',          date: new Date(2026, 4, 19), contentType: 'quote-card',     funnelStage: 'middle', status: 'review',   campaign: 'Velocity Summer Drop', batchId: 'batch-interview-may19' },

    // ── May 21 — Batch: 3-platform retention social ──
    { id: 'rt-ig',  title: 'Member Exclusive Drop',         date: new Date(2026, 4, 21), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved', campaign: 'Retention Drive', batchId: 'batch-retention-may21' },
    { id: 'rt-fb',  title: 'Member Exclusive Drop',         date: new Date(2026, 4, 21), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',   campaign: 'Retention Drive', batchId: 'batch-retention-may21' },
    { id: 'rt-li',  title: 'Member Exclusive Drop',         date: new Date(2026, 4, 21), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'bottom', status: 'draft',    campaign: 'Retention Drive', batchId: 'batch-retention-may21' },

    // ── May 22 — singleton ──
    { id: 'c8',     title: 'Customer Testimonial Video',    date: new Date(2026, 4, 22), contentType: 'short-clip',     funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive' },

    // ── May 25 — Batch: long-form article + two social adaptations ──
    { id: 'rp-lf',  title: 'Loyalty Program Deep Dive',    date: new Date(2026, 4, 25), contentType: 'long-form',      funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'batch-loyalty-may25' },
    { id: 'rp-li',  title: 'Loyalty Program',              date: new Date(2026, 4, 25), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'bottom', status: 'draft', campaign: 'Retention Drive', batchId: 'batch-loyalty-may25' },
    { id: 'rp-ig',  title: 'Loyalty Program',              date: new Date(2026, 4, 25), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'draft', campaign: 'Retention Drive', batchId: 'batch-loyalty-may25' },

    // ── May 28 — singleton ──
    { id: 'c10',    title: 'Product Launch AI Video',       date: new Date(2026, 4, 28), contentType: 'ai-video',       funnelStage: 'bottom', status: 'rejected',   campaign: 'Brand Awareness Q2' },

    // ── May 30 — singleton ──
    { id: 'c11',    title: 'Best Moments Compilation',      date: new Date(2026, 4, 30), contentType: 'highlight-reel', funnelStage: 'top',    status: 'approved',   campaign: 'Retention Drive' },

    // ════════════════ JUNE 2026 — dense content calendar ════════════════

    // Jun 1
    { id: 'j601a', title: 'Summer Drop: The Full Story',     date: new Date(2026, 5, 1),  contentType: 'long-form',      funnelStage: 'top',    status: 'published',  campaign: 'Velocity Summer Drop' },
    { id: 'j601b', title: 'Summer Drop',                     date: new Date(2026, 5, 1),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'bj601' },
    { id: 'j601c', title: 'Summer Drop',                     date: new Date(2026, 5, 1),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'published',  campaign: 'Velocity Summer Drop', batchId: 'bj601' },
    { id: 'j601d', title: 'Summer Drop',                     date: new Date(2026, 5, 1),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj601' },
    { id: 'j601e', title: 'Brand Intro Clip',                date: new Date(2026, 5, 1),  contentType: 'short-clip',     funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },

    // Jun 2
    { id: 'j602a', title: 'Recovery Science Guide',          date: new Date(2026, 5, 2),  contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j602b', title: 'Recovery Tips',                   date: new Date(2026, 5, 2),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj602' },
    { id: 'j602c', title: 'Recovery Tips',                   date: new Date(2026, 5, 2),  contentType: 'social-post', platform: 'x',         funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj602' },
    { id: 'j602d', title: '"Rest is Part of the Work"',      date: new Date(2026, 5, 2),  contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jun 3
    { id: 'j603a', title: 'Brand Story: Our Heritage',       date: new Date(2026, 5, 3),  contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },
    { id: 'j603b', title: 'Heritage Series',                 date: new Date(2026, 5, 3),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj603' },
    { id: 'j603c', title: 'Heritage Series',                 date: new Date(2026, 5, 3),  contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj603' },
    { id: 'j603d', title: 'Heritage Series',                 date: new Date(2026, 5, 3),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj603' },
    { id: 'j603e', title: 'Heritage Highlight Reel',         date: new Date(2026, 5, 3),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2' },

    // Jun 4
    { id: 'j604a', title: 'Community Challenge Launch',      date: new Date(2026, 5, 4),  contentType: 'long-form',      funnelStage: 'top',    status: 'published',  campaign: 'Retention Drive' },
    { id: 'j604b', title: '30-Day Challenge',                date: new Date(2026, 5, 4),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'published',  campaign: 'Retention Drive', batchId: 'bj604' },
    { id: 'j604c', title: '30-Day Challenge',                date: new Date(2026, 5, 4),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'review',     campaign: 'Retention Drive', batchId: 'bj604' },
    { id: 'j604d', title: 'Challenge Kick-off Clip',         date: new Date(2026, 5, 4),  contentType: 'short-clip',     funnelStage: 'top',    status: 'approved',   campaign: 'Retention Drive' },

    // Jun 5
    { id: 'j605a', title: 'Footwear Innovation Deep Dive',   date: new Date(2026, 5, 5),  contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj605' },
    { id: 'j605b', title: 'Footwear Innovation Clip',        date: new Date(2026, 5, 5),  contentType: 'short-clip',     funnelStage: 'middle', status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj605' },
    { id: 'j605c', title: '"Built for the Future"',          date: new Date(2026, 5, 5),  contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj605' },
    { id: 'j605d', title: 'Footwear Tech',                   date: new Date(2026, 5, 5),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj605' },
    { id: 'j605e', title: 'Footwear Tech',                   date: new Date(2026, 5, 5),  contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj605' },

    // Jun 6
    { id: 'j606a', title: 'Hydration Guide for Runners',     date: new Date(2026, 5, 6),  contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j606b', title: 'Hydration Tips',                  date: new Date(2026, 5, 6),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj606' },
    { id: 'j606c', title: 'Hydration Tips',                  date: new Date(2026, 5, 6),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj606' },

    // Jun 7
    { id: 'j607a', title: 'Weekend Run Club Recap',          date: new Date(2026, 5, 7),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'published',  campaign: 'Retention Drive' },
    { id: 'j607b', title: 'Run Club',                        date: new Date(2026, 5, 7),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'published',  campaign: 'Retention Drive', batchId: 'bj607' },
    { id: 'j607c', title: 'Run Club',                        date: new Date(2026, 5, 7),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'approved',   campaign: 'Retention Drive', batchId: 'bj607' },

    // Jun 8
    { id: 'j608a', title: 'Athlete Spotlight: Maya Torres', date: new Date(2026, 5, 8),  contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j608b', title: 'Athlete Spotlight',               date: new Date(2026, 5, 8),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj608' },
    { id: 'j608c', title: 'Athlete Spotlight',               date: new Date(2026, 5, 8),  contentType: 'social-post', platform: 'youtube',   funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj608' },
    { id: 'j608d', title: 'Athlete Spotlight',               date: new Date(2026, 5, 8),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj608' },
    { id: 'j608e', title: '"Champions Never Quit"',          date: new Date(2026, 5, 8),  contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jun 9
    { id: 'j609a', title: 'Loyalty Week Kick-off',           date: new Date(2026, 5, 9),  contentType: 'long-form',      funnelStage: 'bottom', status: 'published',  campaign: 'Retention Drive' },
    { id: 'j609b', title: 'Loyalty Week',                    date: new Date(2026, 5, 9),  contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'published',  campaign: 'Retention Drive', batchId: 'bj609' },
    { id: 'j609c', title: 'Loyalty Week',                    date: new Date(2026, 5, 9),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj609' },
    { id: 'j609d', title: 'Loyalty Week',                    date: new Date(2026, 5, 9),  contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'bj609' },
    { id: 'j609e', title: 'Member Exclusive Clip',           date: new Date(2026, 5, 9),  contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },

    // Jun 10
    { id: 'j610a', title: 'Nutrition for Peak Performance',  date: new Date(2026, 5, 10), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j610b', title: 'Nutrition Guide',                 date: new Date(2026, 5, 10), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj610' },
    { id: 'j610c', title: 'Nutrition Guide',                 date: new Date(2026, 5, 10), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj610' },
    { id: 'j610d', title: 'Nutrition Guide',                 date: new Date(2026, 5, 10), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj610' },
    { id: 'j610e', title: '"Fuel Your Potential"',           date: new Date(2026, 5, 10), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j610f', title: 'Nutrition Science Video',         date: new Date(2026, 5, 10), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Velocity Summer Drop' },

    // Jun 11
    { id: 'j611a', title: 'Heritage Brand Story',            date: new Date(2026, 5, 11), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },
    { id: 'j611b', title: 'Brand Heritage',                  date: new Date(2026, 5, 11), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj611' },
    { id: 'j611c', title: 'Brand Heritage',                  date: new Date(2026, 5, 11), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj611' },
    { id: 'j611d', title: 'Heritage Highlights',             date: new Date(2026, 5, 11), contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2' },

    // Jun 12
    { id: 'j612a', title: 'Running Form Fundamentals',       date: new Date(2026, 5, 12), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j612b', title: 'Form Check Friday',               date: new Date(2026, 5, 12), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj612' },
    { id: 'j612c', title: 'Form Check Friday',               date: new Date(2026, 5, 12), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj612' },
    { id: 'j612d', title: 'Form Check Friday',               date: new Date(2026, 5, 12), contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj612' },
    { id: 'j612e', title: 'Quick Form Tip Clip',             date: new Date(2026, 5, 12), contentType: 'short-clip',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jun 13
    { id: 'j613a', title: 'Training Day Documentary',        date: new Date(2026, 5, 13), contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Velocity Summer Drop', batchId: 'bj613' },
    { id: 'j613b', title: 'Training Day Teaser',             date: new Date(2026, 5, 13), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj613' },
    { id: 'j613c', title: 'Training Day Teaser',             date: new Date(2026, 5, 13), contentType: 'social-post', platform: 'youtube',   funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj613' },
    { id: 'j613d', title: '"Every Rep Counts"',              date: new Date(2026, 5, 13), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jun 14
    { id: 'j614a', title: 'Sustainability in Sports',        date: new Date(2026, 5, 14), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'j614b', title: 'Sustainability Story',            date: new Date(2026, 5, 14), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj614' },
    { id: 'j614c', title: 'Sustainability Story',            date: new Date(2026, 5, 14), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj614' },

    // Jun 15
    { id: 'j615a', title: "Father's Day Gear Guide",         date: new Date(2026, 5, 15), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j615b', title: "Father's Day",                    date: new Date(2026, 5, 15), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj615' },
    { id: 'j615c', title: "Father's Day",                    date: new Date(2026, 5, 15), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj615' },
    { id: 'j615d', title: "Father's Day",                    date: new Date(2026, 5, 15), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj615' },
    { id: 'j615e', title: "Father's Day Gift Clip",          date: new Date(2026, 5, 15), contentType: 'short-clip',     funnelStage: 'bottom', status: 'review',     campaign: 'Velocity Summer Drop' },

    // Jun 16
    { id: 'j616a', title: 'Community Focus Story',           date: new Date(2026, 5, 16), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Retention Drive' },
    { id: 'j616b', title: 'Community Focus',                 date: new Date(2026, 5, 16), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Retention Drive', batchId: 'bj616' },
    { id: 'j616c', title: 'Community Focus',                 date: new Date(2026, 5, 16), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj616' },
    { id: 'j616d', title: 'Community Focus',                 date: new Date(2026, 5, 16), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj616' },
    { id: 'j616e', title: 'Community Highlights',            date: new Date(2026, 5, 16), contentType: 'highlight-reel', funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive' },

    // Jun 17 — 10 items
    { id: 'j17-1',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-2',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-3',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-4',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-5',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'x',         funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-6',  title: 'Summer Campaign Launch',         date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj617' },
    { id: 'j17-7',  title: 'Summer Highlight Reel',          date: new Date(2026, 5, 17), contentType: 'highlight-reel', funnelStage: 'top',  status: 'generating',  campaign: 'Velocity Summer Drop' },
    { id: 'j17-8',  title: 'Summer Short Clip',              date: new Date(2026, 5, 17), contentType: 'short-clip',     funnelStage: 'top',  status: 'draft',       campaign: 'Velocity Summer Drop' },
    { id: 'j17-9',  title: '"Train Like a Champion"',        date: new Date(2026, 5, 17), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',  campaign: 'Velocity Summer Drop' },
    { id: 'j17-10', title: 'Member-Only Early Access',       date: new Date(2026, 5, 17), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },

    // Jun 18
    { id: 'j618a', title: 'Post-Launch Performance Review',  date: new Date(2026, 5, 18), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j618b', title: 'Weekly Training Tips',            date: new Date(2026, 5, 18), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j618c', title: 'Post-Launch Recap',               date: new Date(2026, 5, 18), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj618' },
    { id: 'j618d', title: 'Post-Launch Recap',               date: new Date(2026, 5, 18), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj618' },
    { id: 'j618e', title: 'Behind the Scenes Clip',          date: new Date(2026, 5, 18), contentType: 'short-clip',     funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jun 19
    { id: 'j619a', title: 'Trail Running Essentials',        date: new Date(2026, 5, 19), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j619b', title: 'Trail Running',                   date: new Date(2026, 5, 19), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj619' },
    { id: 'j619c', title: 'Trail Running',                   date: new Date(2026, 5, 19), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj619' },
    { id: 'j619d', title: '"The Trail Calls"',               date: new Date(2026, 5, 19), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jun 20
    { id: 'j620a', title: 'End of Season Highlights',        date: new Date(2026, 5, 20), contentType: 'highlight-reel', funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj620' },
    { id: 'j620b', title: 'Best Moments Cut',                date: new Date(2026, 5, 20), contentType: 'short-clip',     funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj620' },
    { id: 'j620c', title: 'End of Season',                   date: new Date(2026, 5, 20), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj620' },
    { id: 'j620d', title: 'End of Season',                   date: new Date(2026, 5, 20), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj620' },
    { id: 'j620e', title: 'End of Season',                   date: new Date(2026, 5, 20), contentType: 'social-post', platform: 'x',         funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj620' },

    // Jun 21
    { id: 'j621a', title: 'Summer Solstice Run Guide',       date: new Date(2026, 5, 21), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j621b', title: 'Solstice Run',                    date: new Date(2026, 5, 21), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj621' },
    { id: 'j621c', title: 'Solstice Run',                    date: new Date(2026, 5, 21), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj621' },

    // Jun 22
    { id: 'j622a', title: 'Loyalty Program Deep Dive',       date: new Date(2026, 5, 22), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },
    { id: 'j622b', title: 'Loyalty Rewards',                 date: new Date(2026, 5, 22), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj622' },
    { id: 'j622c', title: 'Loyalty Rewards',                 date: new Date(2026, 5, 22), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'bj622' },
    { id: 'j622d', title: 'Loyalty Rewards',                 date: new Date(2026, 5, 22), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj622' },
    { id: 'j622e', title: '"Members Get More"',              date: new Date(2026, 5, 22), contentType: 'quote-card',     funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },

    // Jun 23
    { id: 'j623a', title: 'Q3 Brand Vision',                 date: new Date(2026, 5, 23), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj623' },
    { id: 'j623b', title: 'Q3 Brand Vision',                 date: new Date(2026, 5, 23), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj623' },
    { id: 'j623c', title: 'Sprint Training Guide',           date: new Date(2026, 5, 23), contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop' },
    { id: 'j623d', title: 'Sprint Tips',                     date: new Date(2026, 5, 23), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj623b' },
    { id: 'j623e', title: 'Sprint Tips',                     date: new Date(2026, 5, 23), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj623b' },

    // Jun 24
    { id: 'j624a', title: 'Performance Tech Explained',      date: new Date(2026, 5, 24), contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Brand Awareness Q2' },
    { id: 'j624b', title: 'Performance Tech',                date: new Date(2026, 5, 24), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj624' },
    { id: 'j624c', title: 'Performance Tech',                date: new Date(2026, 5, 24), contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj624' },
    { id: 'j624d', title: 'Tech Showcase Clip',              date: new Date(2026, 5, 24), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'j624e', title: 'AI Product Showcase',             date: new Date(2026, 5, 24), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Brand Awareness Q2' },

    // Jun 25
    { id: 'j625a', title: 'Back to School Fitness Guide',    date: new Date(2026, 5, 25), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j625b', title: 'Back to School Preview',          date: new Date(2026, 5, 25), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj625' },
    { id: 'j625c', title: 'Back to School Preview',          date: new Date(2026, 5, 25), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj625' },
    { id: 'j625d', title: 'Member Milestone Story',          date: new Date(2026, 5, 25), contentType: 'long-form',      funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive' },
    { id: 'j625e', title: '"Your Journey Inspires Us"',      date: new Date(2026, 5, 25), contentType: 'quote-card',     funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive' },

    // Jun 26
    { id: 'j626a', title: 'Mid-Year Gear Review',            date: new Date(2026, 5, 26), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j626b', title: 'Gear Review Friday',              date: new Date(2026, 5, 26), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj626' },
    { id: 'j626c', title: 'Gear Review Friday',              date: new Date(2026, 5, 26), contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj626' },
    { id: 'j626d', title: 'Gear Unboxing Clip',              date: new Date(2026, 5, 26), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jun 27
    { id: 'j627a', title: 'Month-End Flash Sale',            date: new Date(2026, 5, 27), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj627' },
    { id: 'j627b', title: 'Month-End Flash Sale',            date: new Date(2026, 5, 27), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj627' },
    { id: 'j627c', title: 'Month-End Flash Sale',            date: new Date(2026, 5, 27), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj627' },
    { id: 'j627d', title: 'Month-End Flash Sale',            date: new Date(2026, 5, 27), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj627' },

    // Jun 28
    { id: 'j628a', title: 'Sunday Mindset Reset',            date: new Date(2026, 5, 28), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j628b', title: 'Week Ahead Preview',              date: new Date(2026, 5, 28), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jun 29
    { id: 'j629a', title: 'June Performance Recap',          date: new Date(2026, 5, 29), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j629b', title: 'Monthly Recap',                   date: new Date(2026, 5, 29), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj629' },
    { id: 'j629c', title: 'Monthly Recap',                   date: new Date(2026, 5, 29), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj629' },
    { id: 'j629d', title: 'Monthly Recap',                   date: new Date(2026, 5, 29), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj629' },
    { id: 'j629e', title: 'June Highlights Reel',            date: new Date(2026, 5, 29), contentType: 'highlight-reel', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jun 30
    { id: 'j630a', title: 'Half-Year Review',                date: new Date(2026, 5, 30), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'j630b', title: 'Half-Year Recap',                 date: new Date(2026, 5, 30), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj630' },
    { id: 'j630c', title: 'Half-Year Recap',                 date: new Date(2026, 5, 30), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj630' },
    { id: 'j630d', title: 'Half-Year Recap Video',           date: new Date(2026, 5, 30), contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2' },

    // ════════════════ JULY 2026 — dense content calendar ════════════════

    // Jul 1
    { id: 'j701a', title: 'Q3 Kick-off: New Goals',         date: new Date(2026, 6, 1),  contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j701b', title: 'Q3 Launch',                      date: new Date(2026, 6, 1),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj701' },
    { id: 'j701c', title: 'Q3 Launch',                      date: new Date(2026, 6, 1),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj701' },
    { id: 'j701d', title: 'Q3 Launch',                      date: new Date(2026, 6, 1),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj701' },
    { id: 'j701e', title: '"New Month, New Goals"',         date: new Date(2026, 6, 1),  contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 2
    { id: 'j702a', title: 'Summer Sprint Program',          date: new Date(2026, 6, 2),  contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j702b', title: 'Sprint Program',                 date: new Date(2026, 6, 2),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj702' },
    { id: 'j702c', title: 'Sprint Program',                 date: new Date(2026, 6, 2),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj702' },
    { id: 'j702d', title: 'Sprint Technique Clip',         date: new Date(2026, 6, 2),  contentType: 'short-clip',     funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop' },

    // Jul 3
    { id: 'j703a', title: 'Brand Values Deep Dive',         date: new Date(2026, 6, 3),  contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },
    { id: 'j703b', title: 'Brand Values',                   date: new Date(2026, 6, 3),  contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj703' },
    { id: 'j703c', title: 'Brand Values',                   date: new Date(2026, 6, 3),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj703' },
    { id: 'j703d', title: 'Brand Story Highlights',         date: new Date(2026, 6, 3),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2' },

    // Jul 4
    { id: 'j704a', title: 'Independence Day Run',           date: new Date(2026, 6, 4),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj704' },
    { id: 'j704b', title: 'Independence Day Run',           date: new Date(2026, 6, 4),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj704' },
    { id: 'j704c', title: '"Run Free"',                     date: new Date(2026, 6, 4),  contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 5
    { id: 'j705a', title: 'Post-Holiday Recovery Guide',    date: new Date(2026, 6, 5),  contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j705b', title: 'Recovery Sunday',                date: new Date(2026, 6, 5),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj705' },
    { id: 'j705c', title: 'Recovery Sunday',                date: new Date(2026, 6, 5),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj705' },

    // Jul 6
    { id: 'j706a', title: 'New Velocity Air Max Colorway Drop',      date: new Date(2026, 6, 6),  contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j706b', title: 'New Colorway Drop',              date: new Date(2026, 6, 6),  contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj706' },
    { id: 'j706c', title: 'New Colorway Drop',              date: new Date(2026, 6, 6),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj706' },
    { id: 'j706d', title: 'New Colorway Drop',              date: new Date(2026, 6, 6),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj706' },
    { id: 'j706e', title: 'Colorway Reveal Clip',           date: new Date(2026, 6, 6),  contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 7
    { id: 'j707a', title: 'Mental Performance Guide',       date: new Date(2026, 6, 7),  contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop' },
    { id: 'j707b', title: 'Mindset Tuesday',                date: new Date(2026, 6, 7),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj707' },
    { id: 'j707c', title: 'Mindset Tuesday',                date: new Date(2026, 6, 7),  contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj707' },
    { id: 'j707d', title: '"Mind Over Miles"',              date: new Date(2026, 6, 7),  contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 8
    { id: 'j708a', title: 'Athlete Interview: Jake Chen',   date: new Date(2026, 6, 8),  contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj708' },
    { id: 'j708b', title: 'Jake Chen Interview Clip',       date: new Date(2026, 6, 8),  contentType: 'short-clip',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj708' },
    { id: 'j708c', title: 'Athlete Spotlight',              date: new Date(2026, 6, 8),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj708' },
    { id: 'j708d', title: 'Athlete Spotlight',              date: new Date(2026, 6, 8),  contentType: 'social-post', platform: 'youtube',   funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj708' },
    { id: 'j708e', title: 'AI Athlete Documentary',         date: new Date(2026, 6, 8),  contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Velocity Summer Drop' },

    // Jul 9
    { id: 'j709a', title: 'Member Exclusive: July Drop',    date: new Date(2026, 6, 9),  contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },
    { id: 'j709b', title: 'July Member Drop',               date: new Date(2026, 6, 9),  contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj709' },
    { id: 'j709c', title: 'July Member Drop',               date: new Date(2026, 6, 9),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'bj709' },
    { id: 'j709d', title: 'July Member Drop',               date: new Date(2026, 6, 9),  contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj709' },

    // Jul 10
    { id: 'j710a', title: 'Marathon Month Prep Guide',      date: new Date(2026, 6, 10), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j710b', title: 'Marathon Prep',                  date: new Date(2026, 6, 10), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj710' },
    { id: 'j710c', title: 'Marathon Prep',                  date: new Date(2026, 6, 10), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj710' },
    { id: 'j710d', title: 'Marathon Prep',                  date: new Date(2026, 6, 10), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj710' },
    { id: 'j710e', title: '"26.2 Miles of Grit"',           date: new Date(2026, 6, 10), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j710f', title: 'Marathon Training Plan Video',   date: new Date(2026, 6, 10), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Velocity Summer Drop' },

    // Jul 11
    { id: 'j711a', title: 'Yoga & Flexibility for Runners', date: new Date(2026, 6, 11), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j711b', title: 'Flexibility Friday',             date: new Date(2026, 6, 11), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj711' },
    { id: 'j711c', title: 'Flexibility Friday',             date: new Date(2026, 6, 11), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj711' },

    // Jul 12
    { id: 'j712a', title: 'Weekend Challenge Round-up',     date: new Date(2026, 6, 12), contentType: 'highlight-reel', funnelStage: 'top',    status: 'approved',   campaign: 'Retention Drive' },
    { id: 'j712b', title: 'Weekend Challenge',              date: new Date(2026, 6, 12), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Retention Drive', batchId: 'bj712' },
    { id: 'j712c', title: 'Weekend Challenge',              date: new Date(2026, 6, 12), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'review',     campaign: 'Retention Drive', batchId: 'bj712' },

    // Jul 13
    { id: 'j713a', title: 'Youth Sports Initiative',        date: new Date(2026, 6, 13), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },
    { id: 'j713b', title: 'Youth Sports',                   date: new Date(2026, 6, 13), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj713' },
    { id: 'j713c', title: 'Youth Sports',                   date: new Date(2026, 6, 13), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj713' },
    { id: 'j713d', title: 'Youth Sports',                   date: new Date(2026, 6, 13), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj713' },
    { id: 'j713e', title: '"Play, Grow, Repeat"',           date: new Date(2026, 6, 13), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },

    // Jul 14
    { id: 'j714a', title: 'Mid-Summer Gear Drop',           date: new Date(2026, 6, 14), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j714b', title: 'Gear Drop Tuesday',              date: new Date(2026, 6, 14), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj714' },
    { id: 'j714c', title: 'Gear Drop Tuesday',              date: new Date(2026, 6, 14), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj714' },
    { id: 'j714d', title: 'Gear Unboxing',                  date: new Date(2026, 6, 14), contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 15
    { id: 'j715a', title: 'Brand Innovation Story',         date: new Date(2026, 6, 15), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2', batchId: 'bj715' },
    { id: 'j715b', title: 'Innovation Clip',                date: new Date(2026, 6, 15), contentType: 'short-clip',     funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj715' },
    { id: 'j715c', title: 'Innovation Story',               date: new Date(2026, 6, 15), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj715' },
    { id: 'j715d', title: 'Innovation Story',               date: new Date(2026, 6, 15), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj715' },
    { id: 'j715e', title: 'Innovation Story',               date: new Date(2026, 6, 15), contentType: 'social-post', platform: 'youtube',   funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj715' },
    { id: 'j715f', title: 'AI Brand Documentary',           date: new Date(2026, 6, 15), contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Brand Awareness Q2' },

    // Jul 16
    { id: 'j716a', title: 'Race Day Prep Guide',            date: new Date(2026, 6, 16), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j716b', title: 'Race Day Tips',                  date: new Date(2026, 6, 16), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj716' },
    { id: 'j716c', title: 'Race Day Tips',                  date: new Date(2026, 6, 16), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj716' },
    { id: 'j716d', title: '"Race Day is Payday"',           date: new Date(2026, 6, 16), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 17
    { id: 'j717a', title: 'Community Challenge Week 3',     date: new Date(2026, 6, 17), contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Retention Drive' },
    { id: 'j717b', title: 'Challenge Update',               date: new Date(2026, 6, 17), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Retention Drive', batchId: 'bj717' },
    { id: 'j717c', title: 'Challenge Update',               date: new Date(2026, 6, 17), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj717' },
    { id: 'j717d', title: 'Challenge Highlights',           date: new Date(2026, 6, 17), contentType: 'highlight-reel', funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive' },
    { id: 'j717e', title: 'Challenge Clip',                 date: new Date(2026, 6, 17), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Retention Drive' },

    // Jul 18
    { id: 'j718a', title: 'Trail Running Weekend',          date: new Date(2026, 6, 18), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj718' },
    { id: 'j718b', title: 'Trail Running Weekend',          date: new Date(2026, 6, 18), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj718' },
    { id: 'j718c', title: '"The Trails are Calling"',       date: new Date(2026, 6, 18), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 19
    { id: 'j719a', title: 'Mindset & Motivation Guide',     date: new Date(2026, 6, 19), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'j719b', title: 'Motivation Sunday',              date: new Date(2026, 6, 19), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj719' },
    { id: 'j719c', title: 'Motivation Sunday',              date: new Date(2026, 6, 19), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj719' },

    // Jul 20
    { id: 'j720a', title: 'Back to School Campaign Launch', date: new Date(2026, 6, 20), contentType: 'long-form',      funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j720b', title: 'Back to School',                 date: new Date(2026, 6, 20), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj720' },
    { id: 'j720c', title: 'Back to School',                 date: new Date(2026, 6, 20), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj720' },
    { id: 'j720d', title: 'Back to School',                 date: new Date(2026, 6, 20), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj720' },
    { id: 'j720e', title: 'Back to School',                 date: new Date(2026, 6, 20), contentType: 'social-post', platform: 'x',         funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj720' },

    // Jul 21
    { id: 'j721a', title: 'Strength Training Guide',        date: new Date(2026, 6, 21), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j721b', title: 'Strength Tuesday',               date: new Date(2026, 6, 21), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj721' },
    { id: 'j721c', title: 'Strength Tuesday',               date: new Date(2026, 6, 21), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj721' },
    { id: 'j721d', title: 'Strength Clip',                  date: new Date(2026, 6, 21), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jul 22
    { id: 'j722a', title: 'Sustainability Report Feature',  date: new Date(2026, 6, 22), contentType: 'long-form',      funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2' },
    { id: 'j722b', title: 'Sustainability Feature',         date: new Date(2026, 6, 22), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'review',     campaign: 'Brand Awareness Q2', batchId: 'bj722' },
    { id: 'j722c', title: 'Sustainability Feature',         date: new Date(2026, 6, 22), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj722' },
    { id: 'j722d', title: '"Move Forward, Tread Lightly"',  date: new Date(2026, 6, 22), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Brand Awareness Q2' },
    { id: 'j722e', title: 'Sustainability AI Video',        date: new Date(2026, 6, 22), contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Brand Awareness Q2' },

    // Jul 23
    { id: 'j723a', title: 'Member Loyalty Rewards Drop',    date: new Date(2026, 6, 23), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },
    { id: 'j723b', title: 'Loyalty Drop',                   date: new Date(2026, 6, 23), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj723' },
    { id: 'j723c', title: 'Loyalty Drop',                   date: new Date(2026, 6, 23), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'bj723' },
    { id: 'j723d', title: 'Loyalty Drop',                   date: new Date(2026, 6, 23), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj723' },

    // Jul 24
    { id: 'j724a', title: 'Product Innovation Preview',     date: new Date(2026, 6, 24), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j724b', title: 'New Drop Preview',               date: new Date(2026, 6, 24), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop', batchId: 'bj724' },
    { id: 'j724c', title: 'New Drop Preview',               date: new Date(2026, 6, 24), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj724' },
    { id: 'j724d', title: 'New Drop Preview',               date: new Date(2026, 6, 24), contentType: 'social-post', platform: 'youtube',   funnelStage: 'bottom', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj724' },
    { id: 'j724e', title: 'Product Teaser Clip',            date: new Date(2026, 6, 24), contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Velocity Summer Drop' },

    // Jul 25
    { id: 'j725a', title: 'Weekend Warriors Guide',         date: new Date(2026, 6, 25), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j725b', title: 'Weekend Warriors',               date: new Date(2026, 6, 25), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj725' },
    { id: 'j725c', title: 'Weekend Warriors',               date: new Date(2026, 6, 25), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj725' },

    // Jul 26
    { id: 'j726a', title: 'Community Story: Local Heroes',  date: new Date(2026, 6, 26), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Retention Drive' },
    { id: 'j726b', title: 'Local Heroes',                   date: new Date(2026, 6, 26), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Retention Drive', batchId: 'bj726' },
    { id: 'j726c', title: 'Local Heroes',                   date: new Date(2026, 6, 26), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Retention Drive', batchId: 'bj726' },

    // Jul 27
    { id: 'j727a', title: 'August Preview Campaign',        date: new Date(2026, 6, 27), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j727b', title: 'August Preview',                 date: new Date(2026, 6, 27), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj727' },
    { id: 'j727c', title: 'August Preview',                 date: new Date(2026, 6, 27), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj727' },
    { id: 'j727d', title: 'August Preview',                 date: new Date(2026, 6, 27), contentType: 'social-post', platform: 'x',         funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj727' },
    { id: 'j727e', title: '"What\'s Coming in August"',    date: new Date(2026, 6, 27), contentType: 'quote-card',     funnelStage: 'top',    status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jul 28
    { id: 'j728a', title: 'Recovery & Sleep Science',       date: new Date(2026, 6, 28), contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop' },
    { id: 'j728b', title: 'Sleep Science',                  date: new Date(2026, 6, 28), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Velocity Summer Drop', batchId: 'bj728' },
    { id: 'j728c', title: 'Sleep Science',                  date: new Date(2026, 6, 28), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj728' },
    { id: 'j728d', title: '"Sleep is the Secret Weapon"',   date: new Date(2026, 6, 28), contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Velocity Summer Drop' },
    { id: 'j728e', title: 'Recovery Science Video',         date: new Date(2026, 6, 28), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Velocity Summer Drop' },

    // Jul 29
    { id: 'j729a', title: 'Month-End Campaign Recap',       date: new Date(2026, 6, 29), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },
    { id: 'j729b', title: 'July Recap',                     date: new Date(2026, 6, 29), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj729' },
    { id: 'j729c', title: 'July Recap',                     date: new Date(2026, 6, 29), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop', batchId: 'bj729' },
    { id: 'j729d', title: 'July Highlights',                date: new Date(2026, 6, 29), contentType: 'highlight-reel', funnelStage: 'middle', status: 'draft',      campaign: 'Velocity Summer Drop' },

    // Jul 30
    { id: 'j730a', title: 'Flash Sale: End of Summer',      date: new Date(2026, 6, 30), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj730' },
    { id: 'j730b', title: 'Flash Sale: End of Summer',      date: new Date(2026, 6, 30), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'bj730' },
    { id: 'j730c', title: 'Flash Sale: End of Summer',      date: new Date(2026, 6, 30), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'bj730' },
    { id: 'j730d', title: 'Flash Sale: End of Summer',      date: new Date(2026, 6, 30), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bj730' },
    { id: 'j730e', title: 'Last Chance Clip',               date: new Date(2026, 6, 30), contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },

    // Jul 31
    { id: 'j731a', title: 'July Wins: Monthly Roundup',     date: new Date(2026, 6, 31), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'j731b', title: 'July Roundup',                   date: new Date(2026, 6, 31), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj731' },
    { id: 'j731c', title: 'July Roundup',                   date: new Date(2026, 6, 31), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bj731' },
    { id: 'j731d', title: '"End Strong, Start Stronger"',   date: new Date(2026, 6, 31), contentType: 'quote-card',     funnelStage: 'top',    status: 'approved',   campaign: 'Velocity Summer Drop' },

    // ════════════════ AUGUST 2026 — upcoming content ═══════════════

    // Aug 1
    { id: 'a801a', title: 'Back to School: Gear Guide',     date: new Date(2026, 7, 1),  contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026' },
    { id: 'a801b', title: 'Back to School',                 date: new Date(2026, 7, 1),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026', batchId: 'ba801' },
    { id: 'a801c', title: 'Back to School',                 date: new Date(2026, 7, 1),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026', batchId: 'ba801' },
    { id: 'a801d', title: 'Back to School',                 date: new Date(2026, 7, 1),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026', batchId: 'ba801' },
    { id: 'a801e', title: 'Gear Up Clip',                   date: new Date(2026, 7, 1),  contentType: 'short-clip',     funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026' },

    // Aug 3
    { id: 'a803a', title: 'Fall Collection Teaser',         date: new Date(2026, 7, 3),  contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Fall Collection Launch' },
    { id: 'a803b', title: 'Fall Collection',                date: new Date(2026, 7, 3),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'ba803' },
    { id: 'a803c', title: 'Fall Collection',                date: new Date(2026, 7, 3),  contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'ba803' },

    // Aug 5
    { id: 'a805a', title: 'Training for Marathon Season',   date: new Date(2026, 7, 5),  contentType: 'long-form',      funnelStage: 'middle', status: 'review',     campaign: 'Marathon Prep 2026' },
    { id: 'a805b', title: 'Marathon Tips',                  date: new Date(2026, 7, 5),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'review',     campaign: 'Marathon Prep 2026', batchId: 'ba805' },
    { id: 'a805c', title: 'Marathon Tips',                  date: new Date(2026, 7, 5),  contentType: 'social-post', platform: 'x',         funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba805' },
    { id: 'a805d', title: '"Miles Make Champions"',          date: new Date(2026, 7, 5),  contentType: 'quote-card',     funnelStage: 'middle', status: 'approved',   campaign: 'Marathon Prep 2026' },

    // Aug 8
    { id: 'a808a', title: 'Community Run Recap',            date: new Date(2026, 7, 8),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'review',     campaign: 'Community Engagement' },
    { id: 'a808b', title: 'Community Run',                  date: new Date(2026, 7, 8),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'review',     campaign: 'Community Engagement', batchId: 'ba808' },
    { id: 'a808c', title: 'Community Run',                  date: new Date(2026, 7, 8),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement', batchId: 'ba808' },

    // Aug 10
    { id: 'a810a', title: 'Product Spotlight: Air Zoom',    date: new Date(2026, 7, 10), contentType: 'long-form',      funnelStage: 'middle', status: 'approved',   campaign: 'Fall Collection Launch' },
    { id: 'a810b', title: 'Air Zoom Feature',               date: new Date(2026, 7, 10), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'approved',   campaign: 'Fall Collection Launch', batchId: 'ba810' },
    { id: 'a810c', title: 'Air Zoom Feature',               date: new Date(2026, 7, 10), contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'review',     campaign: 'Fall Collection Launch', batchId: 'ba810' },
    { id: 'a810d', title: 'Air Zoom Tech Video',            date: new Date(2026, 7, 10), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Fall Collection Launch' },

    // Aug 12
    { id: 'a812a', title: 'Athlete Interview: Race Day',    date: new Date(2026, 7, 12), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba812' },
    { id: 'a812b', title: 'Race Day Clip',                  date: new Date(2026, 7, 12), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba812' },
    { id: 'a812c', title: '"Every Mile Matters"',            date: new Date(2026, 7, 12), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba812' },

    // Aug 15
    { id: 'a815a', title: 'Mid-August Member Exclusive',    date: new Date(2026, 7, 15), contentType: 'long-form',      funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive' },
    { id: 'a815b', title: 'Member Exclusive',               date: new Date(2026, 7, 15), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'approved',   campaign: 'Retention Drive', batchId: 'ba815' },
    { id: 'a815c', title: 'Member Exclusive',               date: new Date(2026, 7, 15), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Retention Drive', batchId: 'ba815' },
    { id: 'a815d', title: 'Member Exclusive',               date: new Date(2026, 7, 15), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'ba815' },

    // Aug 18
    { id: 'a818a', title: 'Fall Fashion Lookbook',          date: new Date(2026, 7, 18), contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch' },
    { id: 'a818b', title: 'Lookbook Sneak Peek',            date: new Date(2026, 7, 18), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'ba818' },
    { id: 'a818c', title: 'Lookbook Sneak Peek',            date: new Date(2026, 7, 18), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'ba818' },

    // Aug 20
    { id: 'a820a', title: 'Nutrition for Endurance',        date: new Date(2026, 7, 20), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },
    { id: 'a820b', title: 'Endurance Tips',                 date: new Date(2026, 7, 20), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba820' },
    { id: 'a820c', title: 'Endurance Tips',                 date: new Date(2026, 7, 20), contentType: 'social-post', platform: 'x',         funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba820' },
    { id: 'a820d', title: '"Fuel the Long Run"',             date: new Date(2026, 7, 20), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },

    // Aug 22
    { id: 'a822a', title: 'Back to School Flash Sale',      date: new Date(2026, 7, 22), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'review',     campaign: 'Back to School 2026', batchId: 'ba822' },
    { id: 'a822b', title: 'Back to School Flash Sale',      date: new Date(2026, 7, 22), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'review',     campaign: 'Back to School 2026', batchId: 'ba822' },
    { id: 'a822c', title: 'Back to School Flash Sale',      date: new Date(2026, 7, 22), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'draft',      campaign: 'Back to School 2026', batchId: 'ba822' },
    { id: 'a822d', title: 'Back to School Flash Sale',      date: new Date(2026, 7, 22), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Back to School 2026', batchId: 'ba822' },
    { id: 'a822e', title: 'Flash Sale Clip',                date: new Date(2026, 7, 22), contentType: 'short-clip',     funnelStage: 'bottom', status: 'approved',   campaign: 'Back to School 2026' },

    // Aug 25
    { id: 'a825a', title: 'End of Summer Celebration',      date: new Date(2026, 7, 25), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement' },
    { id: 'a825b', title: 'Summer Celebration',             date: new Date(2026, 7, 25), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement', batchId: 'ba825' },
    { id: 'a825c', title: 'Summer Celebration',             date: new Date(2026, 7, 25), contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement', batchId: 'ba825' },
    { id: 'a825d', title: 'Summer Highlights Reel',         date: new Date(2026, 7, 25), contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement' },

    // Aug 28
    { id: 'a828a', title: 'September Training Plan Launch', date: new Date(2026, 7, 28), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },
    { id: 'a828b', title: 'Training Plan',                  date: new Date(2026, 7, 28), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba828' },
    { id: 'a828c', title: 'Training Plan',                  date: new Date(2026, 7, 28), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'ba828' },
    { id: 'a828d', title: '"Plan Your Victory"',             date: new Date(2026, 7, 28), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },

    // Aug 30
    { id: 'a830a', title: 'August Wins Roundup',            date: new Date(2026, 7, 30), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 'a830b', title: 'August Roundup',                 date: new Date(2026, 7, 30), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'ba830' },
    { id: 'a830c', title: 'August Roundup',                 date: new Date(2026, 7, 30), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'ba830' },

    // ════════════════ SEPTEMBER 2026 — upcoming content ════════════════

    // Sep 1
    { id: 's901a', title: 'Fall Collection Official Launch', date: new Date(2026, 8, 1), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch' },
    { id: 's901b', title: 'Fall Collection Launch',         date: new Date(2026, 8, 1),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs901' },
    { id: 's901c', title: 'Fall Collection Launch',         date: new Date(2026, 8, 1),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs901' },
    { id: 's901d', title: 'Fall Collection Launch',         date: new Date(2026, 8, 1),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs901' },
    { id: 's901e', title: 'Fall Collection Launch',         date: new Date(2026, 8, 1),  contentType: 'social-post', platform: 'linkedin',  funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs901' },
    { id: 's901f', title: 'Fall Launch Video',              date: new Date(2026, 8, 1),  contentType: 'ai-video',       funnelStage: 'top',    status: 'generating', campaign: 'Fall Collection Launch' },

    // Sep 3
    { id: 's903a', title: 'Marathon Training Week 1',       date: new Date(2026, 8, 3),  contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },
    { id: 's903b', title: 'Training Week 1',                date: new Date(2026, 8, 3),  contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs903' },
    { id: 's903c', title: 'Training Week 1',                date: new Date(2026, 8, 3),  contentType: 'social-post', platform: 'x',         funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs903' },
    { id: 's903d', title: '"Start Strong, Finish Stronger"', date: new Date(2026, 8, 3),  contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },

    // Sep 5
    { id: 's905a', title: 'Back to School Success Stories', date: new Date(2026, 8, 5),  contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026' },
    { id: 's905b', title: 'Success Stories',                date: new Date(2026, 8, 5),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026', batchId: 'bs905' },
    { id: 's905c', title: 'Success Stories',                date: new Date(2026, 8, 5),  contentType: 'social-post', platform: 'facebook',  funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026', batchId: 'bs905' },
    { id: 's905d', title: 'Student Athlete Highlight',      date: new Date(2026, 8, 5),  contentType: 'short-clip',     funnelStage: 'top',    status: 'draft',      campaign: 'Back to School 2026' },

    // Sep 8
    { id: 's908a', title: 'Fall Fashion Week Recap',        date: new Date(2026, 8, 8),  contentType: 'highlight-reel', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch' },
    { id: 's908b', title: 'Fashion Week',                   date: new Date(2026, 8, 8),  contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs908' },
    { id: 's908c', title: 'Fashion Week',                   date: new Date(2026, 8, 8),  contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs908' },

    // Sep 10
    { id: 's910a', title: 'Mid-September Member Drop',      date: new Date(2026, 8, 10), contentType: 'long-form',      funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive' },
    { id: 's910b', title: 'Member Drop',                    date: new Date(2026, 8, 10), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bs910' },
    { id: 's910c', title: 'Member Drop',                    date: new Date(2026, 8, 10), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bs910' },
    { id: 's910d', title: 'Member Drop',                    date: new Date(2026, 8, 10), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive', batchId: 'bs910' },
    { id: 's910e', title: 'Exclusive Access Clip',          date: new Date(2026, 8, 10), contentType: 'short-clip',     funnelStage: 'bottom', status: 'draft',      campaign: 'Retention Drive' },

    // Sep 12
    { id: 's912a', title: 'Marathon Training Week 2',       date: new Date(2026, 8, 12), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },
    { id: 's912b', title: 'Training Week 2',                date: new Date(2026, 8, 12), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs912' },
    { id: 's912c', title: 'Training Week 2',                date: new Date(2026, 8, 12), contentType: 'social-post', platform: 'x',         funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs912' },
    { id: 's912d', title: '"Consistency Beats Intensity"',   date: new Date(2026, 8, 12), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },

    // Sep 15
    { id: 's915a', title: 'Fall Product Spotlight',         date: new Date(2026, 8, 15), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Fall Collection Launch' },
    { id: 's915b', title: 'Product Spotlight',              date: new Date(2026, 8, 15), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs915' },
    { id: 's915c', title: 'Product Spotlight',              date: new Date(2026, 8, 15), contentType: 'social-post', platform: 'youtube',   funnelStage: 'middle', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs915' },
    { id: 's915d', title: 'Product Tech Video',             date: new Date(2026, 8, 15), contentType: 'ai-video',       funnelStage: 'middle', status: 'generating', campaign: 'Fall Collection Launch' },

    // Sep 18
    { id: 's918a', title: 'Community Challenge September',  date: new Date(2026, 8, 18), contentType: 'long-form',      funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement' },
    { id: 's918b', title: 'September Challenge',            date: new Date(2026, 8, 18), contentType: 'social-post', platform: 'instagram', funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement', batchId: 'bs918' },
    { id: 's918c', title: 'September Challenge',            date: new Date(2026, 8, 18), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement', batchId: 'bs918' },
    { id: 's918d', title: 'Challenge Kickoff Clip',         date: new Date(2026, 8, 18), contentType: 'short-clip',     funnelStage: 'top',    status: 'draft',      campaign: 'Community Engagement' },

    // Sep 20
    { id: 's920a', title: 'Athlete Interview: Fall Goals',  date: new Date(2026, 8, 20), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs920' },
    { id: 's920b', title: 'Fall Goals Clip',                date: new Date(2026, 8, 20), contentType: 'short-clip',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs920' },
    { id: 's920c', title: '"Set the Bar High"',              date: new Date(2026, 8, 20), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs920' },

    // Sep 22
    { id: 's922a', title: 'Fall Sale Preview',              date: new Date(2026, 8, 22), contentType: 'social-post', platform: 'instagram', funnelStage: 'bottom', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs922' },
    { id: 's922b', title: 'Fall Sale Preview',              date: new Date(2026, 8, 22), contentType: 'social-post', platform: 'facebook',  funnelStage: 'bottom', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs922' },
    { id: 's922c', title: 'Fall Sale Preview',              date: new Date(2026, 8, 22), contentType: 'social-post', platform: 'tiktok',    funnelStage: 'bottom', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs922' },
    { id: 's922d', title: 'Fall Sale Preview',              date: new Date(2026, 8, 22), contentType: 'social-post', platform: 'x',         funnelStage: 'bottom', status: 'draft',      campaign: 'Fall Collection Launch', batchId: 'bs922' },
    { id: 's922e', title: 'Sale Teaser Clip',               date: new Date(2026, 8, 22), contentType: 'short-clip',     funnelStage: 'bottom', status: 'draft',      campaign: 'Fall Collection Launch' },

    // Sep 25
    { id: 's925a', title: 'End of September Recap',         date: new Date(2026, 8, 25), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 's925b', title: 'September Recap',                date: new Date(2026, 8, 25), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bs925' },
    { id: 's925c', title: 'September Recap',                date: new Date(2026, 8, 25), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bs925' },
    { id: 's925d', title: 'September Highlights',           date: new Date(2026, 8, 25), contentType: 'highlight-reel', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },

    // Sep 28
    { id: 's928a', title: 'October Training Plan Preview',  date: new Date(2026, 8, 28), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },
    { id: 's928b', title: 'October Plan',                   date: new Date(2026, 8, 28), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs928' },
    { id: 's928c', title: 'October Plan',                   date: new Date(2026, 8, 28), contentType: 'social-post', platform: 'linkedin',  funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026', batchId: 'bs928' },
    { id: 's928d', title: '"Next Chapter, Next Mile"',       date: new Date(2026, 8, 28), contentType: 'quote-card',     funnelStage: 'middle', status: 'draft',      campaign: 'Marathon Prep 2026' },

    // Sep 30
    { id: 's930a', title: 'September Wins Roundup',         date: new Date(2026, 8, 30), contentType: 'long-form',      funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2' },
    { id: 's930b', title: 'September Roundup',              date: new Date(2026, 8, 30), contentType: 'social-post', platform: 'instagram', funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bs930' },
    { id: 's930c', title: 'September Roundup',              date: new Date(2026, 8, 30), contentType: 'social-post', platform: 'facebook',  funnelStage: 'middle', status: 'draft',      campaign: 'Brand Awareness Q2', batchId: 'bs930' },
  ]);

  const toggleContentType = (type: ContentType) => { const s = new Set(selectedContentTypes); s.has(type) ? s.delete(type) : s.add(type); setSelectedContentTypes(s); };
  const toggleFunnelStage = (stage: FunnelStage) => { const s = new Set(selectedFunnelStages); s.has(stage) ? s.delete(stage) : s.add(stage); setSelectedFunnelStages(s); };
  const toggleStatus     = (status: Status)    => { const s = new Set(selectedStatuses);    s.has(status) ? s.delete(status) : s.add(status); setSelectedStatuses(s); };
  const clearAllFilters  = () => { setSelectedContentTypes(new Set()); setSelectedFunnelStages(new Set()); setSelectedStatuses(new Set()); setDateRange({ start: null, end: null }); };
  const toggleItemSelection = (id: string) => { const s = new Set(selectedItems); s.has(id) ? s.delete(id) : s.add(id); setSelectedItems(s); };
  const clearSelection = () => { setSelectedItems(new Set()); setSelectMode(false); setCampaignError(false); };
  const toggleSelectMode = () => { if (selectMode) { setSelectedItems(new Set()); setSelectMode(false); } else { setSelectMode(true); } };

  const filteredItems = useMemo(() => {
    const result = calendarItems.filter(item => {
      if (selectedContentTypes.size > 0 && !selectedContentTypes.has(item.contentType)) return false;
      if (selectedFunnelStages.size > 0 && !selectedFunnelStages.has(item.funnelStage)) return false;
      if (selectedStatuses.size > 0 && !selectedStatuses.has(item.status)) return false;
      if (dateRange.start && item.date < dateRange.start) return false;
      if (dateRange.end && item.date > dateRange.end) return false;
      return true;
    });
    console.log('[Calendar Debug] currentMonth:', format(currentMonth, 'yyyy-MM-dd'), '| total items:', calendarItems.length, '| filtered:', result.length);
    if (result.length > 0) {
      console.log('[Calendar Debug] First 3 items:', result.slice(0, 3).map(i => ({ id: i.id, title: i.title, date: format(i.date, 'yyyy-MM-dd') })));
    }
    return result;
  }, [calendarItems, selectedContentTypes, selectedFunnelStages, selectedStatuses, dateRange, currentMonth]);

  const selectAll = () => { if (filteredItems.length === 0) return; setSelectedItems(new Set(filteredItems.map(i => i.id))); setCampaignError(false); };
  const handleSaveItem = (updated: CalendarItem) => setCalendarItems(prev => prev.map(item => item.id === updated.id ? updated : item));
  const handleOpenRegenerate = (item: CalendarItem) => { setEditingItem(null); setRegeneratingItems([item]); };
  const handleRegenerateFromSelection = () => {
    const items = Array.from(selectedItems).map(id => calendarItems.find(i => i.id === id)).filter((i): i is CalendarItem => !!i);
    if (items.length > 0) {
      clearSelection();
      setRegeneratingItems(items); // opens modal — confirm in modal closes it and starts loading
    }
  };

  const handleConfirmRegenerate = (itemIds: string[]) => {
    setRegeneratingItems([]);
    const idSet = new Set(itemIds);
    setRegeneratingIds(prev => new Set([...prev, ...idSet]));
    // Simulate async generation — resolve after 3.5s
    setTimeout(() => {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        idSet.forEach(id => next.delete(id));
        return next;
      });
      // Mark resolved items as 'review' (new content ready)
      setCalendarItems(prev => prev.map(item =>
        idSet.has(item.id) ? { ...item, status: 'review' as Status } : item
      ));
    }, 3500);
  };

  const hasActiveFilters = selectedContentTypes.size > 0 || selectedFunnelStages.size > 0 || selectedStatuses.size > 0 || dateRange.start !== null || dateRange.end !== null;
  const monthStart    = startOfMonth(currentMonth);
  const monthEnd      = endOfMonth(currentMonth);
  const calendarDays  = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = monthStart.getDay(); // 0=Sun … 6=Sat — empty slots before day 1

  const contentTypeConfig = [
    { type: 'long-form'      as ContentType, label: 'Long Form' },
    { type: 'short-clip'     as ContentType, label: 'Short Clip' },
    { type: 'highlight-reel' as ContentType, label: 'Highlight Reel' },
    { type: 'ai-video'       as ContentType, label: 'Text to AI Video' },
    { type: 'quote-card'     as ContentType, label: 'Quote Card' },
    { type: 'social-post'    as ContentType, label: 'Social Post' },
  ];

  const funnelStageConfig = [
    { stage: 'top'    as FunnelStage, label: 'Top of Funnel',    color: 'bg-[#3B82F6] text-white border-[#3B82F6]' },
    { stage: 'middle' as FunnelStage, label: 'Middle of Funnel', color: 'bg-[#F59E0B] text-white border-[#F59E0B]' },
    { stage: 'bottom' as FunnelStage, label: 'Bottom of Funnel', color: 'bg-[#4B56F2] text-white border-[#4B56F2]' },
  ];

  const statusConfig = [
    { status: 'draft'      as Status, label: 'Draft' },
    { status: 'generating' as Status, label: 'Generating' },
    { status: 'review'     as Status, label: 'Ready for Review' },
    { status: 'approved'   as Status, label: 'Approved' },
    { status: 'published'  as Status, label: 'Published' },
    { status: 'rejected'   as Status, label: 'Rejected' },
  ];

  const getItemsForDay = (day: Date) => filteredItems.filter(item => isSameDay(item.date, day));

  const getStatusColor = (status: Status) => ({
    draft:      'bg-muted text-muted-foreground',
    generating: 'bg-[#3B82F6] text-white',
    review:     'bg-warning text-white',
    approved:   'bg-success text-white',
    published:  'bg-primary text-primary-foreground',
    rejected:   'bg-destructive text-destructive-foreground',
  }[status]);

  const STATUS_LETTER: Record<Status, string> = {
    draft: 'D', generating: 'G', review: 'R', approved: 'A', published: 'P', rejected: 'X',
  };

  // ── Hover panel state ──────────────────────────────────────────────────────
  const [panelState, setPanelState] = useState<{ item: CalendarItem; x: number; y: number } | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPanel = useCallback((item: CalendarItem, e: React.MouseEvent) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const panelW = 288; // 18rem
    const x = rect.right + 10 + panelW > window.innerWidth ? rect.left - panelW - 10 : rect.right + 10;
    const y = Math.min(rect.top, window.innerHeight - 340);
    setPanelState({ item, x, y });
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setPanelState(null), 180);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  // ── Single calendar item pill ─────────────────────────────────────────────

  const renderItem = (item: CalendarItem, grouped = false, batchColor?: typeof BATCH_PALETTE[0]) => {
    const isSelected   = selectedItems.has(item.id);
    const isRegen      = regeneratingIds.has(item.id);
    const showCheckbox = !isRegen && (selectMode || isSelected);

    const icon = item.platform ? PLATFORM_ICONS[item.platform] : CONTENT_TYPE_ICON_MAP[item.contentType];
    const displayTitle = grouped && item.platform ? PLATFORM_LABEL[item.platform] : item.title;

    if (isRegen) {
      return (
        <div
          key={item.id}
          className="animate-pulse rounded-sm text-xs flex items-center gap-1 overflow-hidden"
          style={{
            minHeight: '22px',
            background: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #1d4ed8 100%)',
            backgroundSize: '200% 100%',
            ...(grouped && batchColor ? { borderLeft: `2px solid ${batchColor.bar}` } : {}),
          }}
        >
          <span className="flex-shrink-0 pl-1.5 text-white/80"><Loader2 className="w-3 h-3 animate-spin" /></span>
          <span className="truncate flex-1 py-1 pr-2 pl-1 text-white/70 italic text-[10px] font-medium">Regenerating…</span>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={`text-xs flex items-center cursor-pointer transition-all duration-150 rounded-sm ${getStatusColor(item.status)} ${isSelected ? 'ring-2 ring-white/40 ring-inset' : ''}`}
        style={{ minHeight: '22px', ...(grouped && batchColor ? { borderLeft: `2px solid ${batchColor.bar}` } : {}) }}
        onMouseEnter={(e) => { setHoveredItem(item.id); if (!selectMode) openPanel(item, e); }}
        onMouseLeave={() => { setHoveredItem(null); scheduleClose(); }}
        onClick={() => selectMode ? toggleItemSelection(item.id) : setEditingItem(item)}
      >
        {/* Checkbox */}
        <button
          className="flex-shrink-0 flex items-center justify-center pl-1.5 pr-0.5 self-stretch"
          style={{ opacity: showCheckbox ? 1 : 0, transition: 'opacity 0.12s ease' }}
          onClick={e => { e.stopPropagation(); toggleItemSelection(item.id); }}
        >
          <span className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white border-white' : 'border-white/70 bg-transparent'}`}>
            {isSelected && <svg viewBox="0 0 8 6" className="w-1.5 h-1.5" fill="none"><path d="M1 3l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
        </button>
        {/* Content type / platform icon */}
        <span className="flex-shrink-0 pl-1">{icon}</span>
        {/* Title */}
        <span className="truncate flex-1 py-1 px-1 text-[11px]">{displayTitle}</span>
        {/* Platform icon (if grouped social, show content type icon instead) */}
        {!grouped && item.platform && (
          <span className="flex-shrink-0 opacity-70 pr-0.5">{PLATFORM_ICONS[item.platform]}</span>
        )}
        {/* Status letter badge */}
        <span className="flex-shrink-0 w-4 h-4 rounded-sm bg-black/20 flex items-center justify-center text-[9px] font-black mr-1">
          {STATUS_LETTER[item.status]}
        </span>
        {grouped && <span className="flex-shrink-0 pr-1 opacity-30"><Link2 className="w-2 h-2" /></span>}
      </div>
    );
  };

  // ── Day cell renderer ──────────────────────────────────────────────────────

  const renderDayCell = (day: Date) => {
    const dayItems = getItemsForDay(day);

    // Partition into true groups (≥2 items sharing a batchId) and singletons
    const batchAccum: Record<string, CalendarItem[]> = {};
    const singletons: CalendarItem[] = [];

    dayItems.forEach(item => {
      if (item.batchId) {
        (batchAccum[item.batchId] = batchAccum[item.batchId] ?? []).push(item);
      } else {
        singletons.push(item);
      }
    });

    const trueGroups: [string, CalendarItem[]][] = [];
    Object.entries(batchAccum).forEach(([batchId, items]) => {
      if (items.length >= 2) trueGroups.push([batchId, items]);
      else singletons.push(...items);
    });

    return (
      <div className="space-y-1">
        {/* ── Grouped batches ── */}
        {trueGroups.map(([batchId, groupItems]) => {
          const color = getBatchColor(batchId);
          // Derive a human-readable batch label from campaign + dominant content type
          const hasSocial = groupItems.some(i => i.contentType === 'social-post');
          const types = [...new Set(groupItems.map(i => i.platform ? PLATFORM_LABEL[i.platform] : CONTENT_TYPE_LABEL[i.contentType]))];
          const batchLabel = hasSocial && groupItems.every(i => i.contentType === 'social-post')
            ? types.slice(0, 3).join(' · ') + (types.length > 3 ? ` +${types.length - 3}` : '')
            : groupItems[0].campaign;

          return (
            <div
              key={batchId}
              className="rounded-md overflow-hidden relative"
              style={{
                backgroundColor: color.bg,
                // Left bracket: thick colored bar
                boxShadow: `inset 3px 0 0 ${color.bar}, inset 0 0 0 1px ${color.bar}22`,
              }}
            >
              {/* ── Header ribbon ── */}
              <div
                className="flex items-center justify-between gap-1 px-2 py-[3px]"
                style={{ backgroundColor: `${color.bar}18`, borderBottom: `1px solid ${color.bar}20` }}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <Link2 className="w-2.5 h-2.5 flex-shrink-0" style={{ color: color.bar }} />
                  <span
                    className="text-[8.5px] font-bold uppercase tracking-wide truncate"
                    style={{ color: color.text }}
                  >
                    {batchLabel}
                  </span>
                </div>
                <span
                  className="text-[8px] font-black tabular-nums flex-shrink-0 px-1 py-px rounded"
                  style={{ color: color.bar, backgroundColor: `${color.bar}20` }}
                >
                  {groupItems.length}×
                </span>
              </div>

              {/* ── Items ── */}
              {groupItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={idx > 0 ? { borderTop: `1px solid ${color.bar}15` } : {}}
                >
                  {renderItem(item, true, color)}
                </div>
              ))}
            </div>
          );
        })}

        {/* ── Singleton items ── */}
        {singletons.map(item => (
          <div key={item.id}>
            {renderItem(item, false)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

        {/* Filters — compact single row */}
        <div className="bg-card border-b border-border px-4 py-2 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Month nav */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-secondary/70 rounded text-sm transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="text-sm font-semibold min-w-28 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-7 h-7 flex items-center justify-center bg-secondary hover:bg-secondary/70 rounded text-sm transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>

            <div className="w-px h-5 bg-border flex-shrink-0" />

            {/* Filters */}
            <div className="flex-shrink-0 relative">
              <select value="" onChange={e => e.target.value && toggleContentType(e.target.value as ContentType)} className="pr-8 pl-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none appearance-none">
                <option value="">Content Type</option>
                {contentTypeConfig.map(({ type, label }) => <option key={type} value={type}>{label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
            <div className="flex-shrink-0 relative">
              <select value="" onChange={e => e.target.value && toggleFunnelStage(e.target.value as FunnelStage)} className="pr-8 pl-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none appearance-none">
                <option value="">Funnel Stage</option>
                {funnelStageConfig.map(({ stage, label }) => <option key={stage} value={stage}>{label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
            <div className="flex-shrink-0 relative">
              <select value="" onChange={e => e.target.value && toggleStatus(e.target.value as Status)} className="pr-8 pl-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-foreground focus:outline-none appearance-none">
                <option value="">Status</option>
                {statusConfig.map(({ status, label }) => <option key={status} value={status}>{label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>

            <button
              onClick={toggleSelectMode}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectMode ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-secondary border-border text-foreground hover:bg-secondary/70'}`}
            >
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectMode ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                {selectMode && <svg viewBox="0 0 8 6" className="w-1.5 h-1.5" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              Select
            </button>
            {selectMode && <button onClick={selectAll} className="flex-shrink-0 text-xs text-primary hover:text-primary/80 font-medium transition-colors">All</button>}

            {/* Active filter tags */}
            {Array.from(selectedContentTypes).map(type => <span key={type} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full">{contentTypeConfig.find(c => c.type === type)?.label}<button onClick={() => toggleContentType(type)}>×</button></span>)}
            {Array.from(selectedFunnelStages).map(stage => <span key={stage} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full">{funnelStageConfig.find(f => f.stage === stage)?.label}<button onClick={() => toggleFunnelStage(stage)}>×</button></span>)}
            {Array.from(selectedStatuses).map(status => <span key={status} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full">{statusConfig.find(s => s.status === status)?.label}<button onClick={() => toggleStatus(status)}>×</button></span>)}

            <div className="flex-1" />
            {hasActiveFilters && <button onClick={clearAllFilters} className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex-shrink-0">Clear</button>}
          </div>

          {(selectedContentTypes.size > 0 || selectedFunnelStages.size > 0 || selectedStatuses.size > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from(selectedContentTypes).map(type => <span key={type} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">{contentTypeConfig.find(c => c.type === type)?.label}<button onClick={() => toggleContentType(type)} className="hover:text-primary/70">×</button></span>)}
              {Array.from(selectedFunnelStages).map(stage => <span key={stage} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">{funnelStageConfig.find(f => f.stage === stage)?.label}<button onClick={() => toggleFunnelStage(stage)} className="hover:text-primary/70">×</button></span>)}
              {Array.from(selectedStatuses).map(status => <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">{statusConfig.find(s => s.status === status)?.label}<button onClick={() => toggleStatus(status)} className="hover:text-primary/70">×</button></span>)}
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">{filteredItems.length} of {calendarItems.length} items shown</span>
              <button onClick={clearAllFilters} className="text-xs text-primary hover:text-primary/80 transition-colors font-medium">Clear All</button>
            </div>
          )}
        </div>

        {/* Calendar grid — fills all remaining screen height */}
        <div className="flex-1 flex flex-col min-h-0 px-4 pb-2 pt-2">
          {/* Legend */}
          <div className="flex items-center gap-3 mb-1.5 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className="w-12 h-4 rounded flex items-center gap-1 px-1 flex-shrink-0"
                style={{ backgroundColor: BATCH_PALETTE[0].bg, boxShadow: `inset 3px 0 0 ${BATCH_PALETTE[0].bar}` }}
              >
                <Link2 className="w-2 h-2 flex-shrink-0" style={{ color: BATCH_PALETTE[0].bar }} />
                <span className="text-[8px] font-bold" style={{ color: BATCH_PALETTE[0].text }}>3×</span>
              </div>
              <span className="text-[11px]">Colored bracket = items from the same creation session</span>
            </div>
          </div>

          {/* Outer wrapper — scrolls vertically when rows expand */}
          <div className="flex-1 min-h-0 flex flex-col rounded-lg overflow-hidden border border-border">
            {/* Day-of-week header — fixed */}
            <div className="grid grid-cols-7 gap-px bg-border flex-shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-secondary/80 px-2 py-1.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{day}</div>
              ))}
            </div>

            {/* Day cells — rows auto-expand to fit content; row height at least fills viewport evenly */}
            <div
              className="flex-1 min-h-0 overflow-y-auto grid grid-cols-7 gap-px bg-border"
              style={{ gridAutoRows: 'minmax(8rem, auto)' }}
            >
              {/* Leading blank cells to align day-1 to the correct weekday column */}
              {Array.from({ length: leadingBlanks }).map((_, i) => (
                <div key={`blank-${i}`} className="bg-card/40" />
              ))}

              {calendarDays.map(day => (
                <div
                  key={day.toISOString()}
                  className="bg-card p-1.5"
                >
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-0.5">{format(day, 'd')}</div>
                  {renderDayCell(day)}
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* ── Hover side panel ── */}
      {panelState && (
        <div
          className="fixed z-50 w-72 bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ top: panelState.y, left: panelState.x, maxHeight: 320 }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Header */}
          <div className={`flex items-center gap-2 px-3 py-2 flex-shrink-0 ${getStatusColor(panelState.item.status)}`}>
            <span className="flex-shrink-0">{panelState.item.platform ? PLATFORM_ICONS[panelState.item.platform] : CONTENT_TYPE_ICON_MAP[panelState.item.contentType]}</span>
            <span className="text-xs font-semibold flex-1 truncate">{panelState.item.title}</span>
            <span className="flex-shrink-0 text-[9px] font-black bg-black/20 px-1.5 py-0.5 rounded uppercase tracking-wide">
              {panelState.item.status}
            </span>
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border flex-shrink-0 bg-secondary/30">
            <span className="text-[10px] text-muted-foreground font-medium">{CONTENT_TYPE_LABEL[panelState.item.contentType]}</span>
            {panelState.item.platform && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-muted-foreground/70 flex items-center gap-1">
                  {PLATFORM_ICONS[panelState.item.platform]}
                  <span className="text-[10px]">{PLATFORM_LABEL[panelState.item.platform]}</span>
                </span>
              </>
            )}
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[10px] text-muted-foreground">{panelState.item.campaign}</span>
          </div>
          {/* Content excerpt — scrollable */}
          <div className="overflow-y-auto flex-1 px-3 py-2.5">
            <p className="text-xs text-foreground/80 leading-relaxed">
              {MOCK_OUTPUTS[Math.abs(panelState.item.id.charCodeAt(0)) % MOCK_OUTPUTS.length]}
            </p>
          </div>
          {/* Footer */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-border flex-shrink-0 bg-secondary/20">
            <button
              onClick={() => { setPanelState(null); setEditingItem(panelState.item); }}
              className="flex-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors text-left"
            >
              Open &amp; Edit →
            </button>
            <button onClick={() => setPanelState(null)} className="text-muted-foreground/40 hover:text-muted-foreground transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {editingItem && (
        <PostDetailModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleSaveItem} onRegenerate={() => handleOpenRegenerate(editingItem)} />
      )}
      {regeneratingItems.length > 0 && (
        <RegenerateModal items={regeneratingItems} onClose={() => setRegeneratingItems([])} onConfirmRegenerate={handleConfirmRegenerate} />
      )}
      {selectedItems.size > 0 && (
        <SelectionBar
          count={selectedItems.size}
          onClear={clearSelection}
          onRegenerate={handleRegenerateFromSelection}
          onPublish={() => { alert(`Publishing ${selectedItems.size} item(s)`); clearSelection(); }}
          onDuplicate={() => { alert(`Duplicating ${selectedItems.size} item(s)`); clearSelection(); }}
          onDelete={() => { setCalendarItems(prev => prev.filter(item => !selectedItems.has(item.id))); clearSelection(); }}
          campaignError={campaignError}
        />
      )}
    </div>
  );
}

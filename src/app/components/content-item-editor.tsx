import React, { useState, useRef } from 'react';
import {
  X, Check, ChevronDown, ChevronRight, Hash, GripVertical,
  Plus, Link as LinkIcon, ExternalLink, Play, FileText,
  Film, LayoutGrid, Zap, RefreshCw, Trash2, Share2, Mail,
  MessageSquare, Scissors, Mic, Calendar as CalendarIcon,
  AlertTriangle, Image as ImgIcon,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type EditorContentStatus = 'approved' | 'draft' | 'rejected' | 'generating' | 'superseded';
export type EditorContentType = 'Blog Post' | 'Social Post' | 'Short Video' | 'Carousel' | 'Email' | 'Quote Card';

export interface EditableItem {
  id: number;
  date: string;
  title: string;
  type: EditorContentType;
  funnelStage: string;
  campaign: string;
  status: EditorContentStatus;
}

export interface ContentItemEditorProps {
  item: EditableItem;
  onClose: () => void;
  onUpdate: (updated: EditableItem) => void;
  onDelete: (id: number) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const FUNNEL_OPTIONS = [
  { value: 'Awareness',     label: 'Awareness' },
  { value: 'Consideration', label: 'Consideration' },
  { value: 'Conversion',    label: 'Conversion' },
  { value: 'Retention',     label: 'Retention' },
];

const MOCK_TOPICS = [
  'Product Innovation', 'Customer Success', 'Industry Trends', 'Brand Story',
  'How-To Guides', 'Expert Interviews', 'Case Studies', 'Company Culture',
];

const CONTENT_TEMPLATES: Record<EditorContentType, { id: string; name: string; color: string }[]> = {
  'Blog Post':   [{ id: 'standard', name: 'Standard Article', color: '#6366f1' }, { id: 'listicle', name: 'Listicle Format', color: '#8b5cf6' }, { id: 'how-to', name: 'How-To Guide', color: '#06b6d4' }],
  'Social Post': [{ id: 'short', name: 'Short & Punchy', color: '#6366f1' }, { id: 'linkedin', name: 'Long-Form LinkedIn', color: '#0077b5' }, { id: 'thread', name: 'Twitter Thread', color: '#1da1f2' }],
  'Short Video': [{ id: 'auto', name: 'Auto Clip', color: '#f59e0b' }, { id: 'highlights', name: 'Highlights Reel', color: '#ef4444' }],
  'Carousel':    [{ id: 'standard', name: 'Standard Carousel', color: '#6366f1' }, { id: 'story', name: 'Story Style', color: '#f59e0b' }],
  'Email':       [{ id: 'newsletter', name: 'Newsletter', color: '#4B56F2' }, { id: 'promo', name: 'Promotional', color: '#f59e0b' }],
  'Quote Card':  [{ id: 'minimal', name: 'Minimal Dark', color: '#1e1e2e' }, { id: 'gradient', name: 'Gradient Brand', color: '#6366f1' }],
};

const WRITERS = [
  { id: 'alex', name: 'Alex Chen',   avatar: 'AC', tone: 'Professional',   level: 'Expert',       wordCount: '1,500' },
  { id: 'sam',  name: 'Sam Rivera',  avatar: 'SR', tone: 'Conversational', level: 'Intermediate', wordCount: '280'   },
  { id: 'jordan', name: 'Jordan Lee',avatar: 'JL', tone: 'Technical',      level: 'Expert',       wordCount: '2,000' },
];

const PROJ_DEFAULTS = {
  context:  'A leading B2B SaaS platform focused on content operations and marketing automation.',
  audience: 'Marketing managers and content strategists at companies with 50–500 employees.',
};

interface BriefSection { id: number; heading: string; wordCount: number; }

const DEFAULT_BRIEF: BriefSection[] = [
  { id: 1, heading: 'Introduction',    wordCount: 200 },
  { id: 2, heading: 'The Challenge',   wordCount: 300 },
  { id: 3, heading: 'Our Approach',    wordCount: 400 },
  { id: 4, heading: 'Key Takeaways',   wordCount: 250 },
  { id: 5, heading: 'Conclusion',      wordCount: 150 },
];

const CREDITS_PER_TYPE: Record<EditorContentType, number> = {
  'Blog Post': 40, 'Social Post': 8, 'Short Video': 20,
  'Carousel': 15, 'Email': 25, 'Quote Card': 5,
};

// ── Field visibility ──────────────────────────────────────────────────────────

const isTextBased = (t: EditorContentType) => t === 'Blog Post' || t === 'Social Post' || t === 'Email';
const isLongForm  = (t: EditorContentType) => t === 'Blog Post';
const hasWriter   = (t: EditorContentType) => t === 'Blog Post' || t === 'Social Post' || t === 'Email';
const hasBrief    = (t: EditorContentType) => t === 'Blog Post';
const hasInspiration = (t: EditorContentType) => t !== 'Short Video' && t !== 'Carousel';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDisplayDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function postNumber(id: number) {
  return String(id % 1000 + 100);
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function DefaultBadge() {
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 leading-none shrink-0">
      Project Default
    </span>
  );
}

function StatusBadge({ status }: { status: EditorContentStatus }) {
  const cfg = {
    approved:   { label: 'Approved',   cls: 'bg-[#12B667]/10 text-[#8FE6B5] border-[#12B667]/20', dot: 'bg-[#8FE6B5]' },
    draft:      { label: 'Draft',      cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',   dot: 'bg-yellow-400'  },
    rejected:   { label: 'Rejected',   cls: 'bg-red-500/10 text-red-400 border-red-500/20',             dot: 'bg-red-400'     },
    generating: { label: 'Generating', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',          dot: 'bg-blue-400'    },
    superseded: { label: 'Superseded', cls: 'bg-muted/40 text-muted-foreground border-border',          dot: 'bg-muted-foreground/40' },
  }[status];
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function FieldRow({ label, inherited = false, children }: {
  label: string; inherited?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {inherited && <DefaultBadge />}
      </div>
      {children}
    </div>
  );
}

function SimpleDropdown({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:border-primary/40 transition-colors">
        <span>{selected?.label ?? value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden w-max min-w-full">
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left whitespace-nowrap hover:bg-secondary transition-colors ${o.value === value ? 'text-primary font-medium' : 'text-foreground'}`}>
              {o.value === value ? <Check className="w-3 h-3" /> : <span className="w-3" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WriterDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const writer = WRITERS.find(w => w.name === value) ?? WRITERS[0];
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg bg-secondary border border-border hover:border-primary/40 transition-colors">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{writer.avatar}</div>
        <span className="text-sm text-foreground flex-1 text-left">{writer.name}</span>
        <span className="text-xs text-muted-foreground">{writer.tone}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-xl overflow-hidden w-full">
          {WRITERS.map(w => (
            <button key={w.id} onClick={() => { onChange(w.name); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 hover:bg-secondary transition-colors ${w.name === value ? 'bg-primary/5' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">{w.avatar}</div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground">{w.name}</p>
                <p className="text-[10px] text-muted-foreground">{w.tone} · {w.level}</p>
              </div>
              {w.name === value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Content Preview ───────────────────────────────────────────────────────────

function ContentPreview({ type, templateId }: { type: EditorContentType; templateId: string }) {
  const tpl = (CONTENT_TEMPLATES[type] ?? []).find(t => t.id === templateId) ?? CONTENT_TEMPLATES[type]?.[0];
  const color = tpl?.color ?? '#6366f1';

  if (type === 'Blog Post') {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm space-y-2.5 max-h-64 overflow-y-auto">
        <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: color + '60' }} />
        <h3 className="font-bold text-foreground text-base leading-snug">AI-Powered Content Operations: The Future is Now</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">In today's fast-paced digital landscape, content teams are under unprecedented pressure to produce more content, faster, without sacrificing quality. AI-powered tools are changing the game for marketing operations teams worldwide.</p>
        <h4 className="font-semibold text-foreground text-sm mt-1">The Challenge</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">Marketing managers at mid-market companies report spending up to 60% of their time on content production logistics rather than strategy and creativity. The bottlenecks are real, and the opportunity cost is significant.</p>
        <h4 className="font-semibold text-foreground text-sm mt-1">Our Approach</h4>
        <p className="text-muted-foreground text-xs leading-relaxed">By automating the repetitive parts of content creation — research, drafting, formatting, and distribution — teams can focus on the strategic decisions that drive real business outcomes.</p>
      </div>
    );
  }

  if (type === 'Social Post') {
    return (
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">AC</div>
          <div>
            <p className="text-sm font-semibold text-foreground">Alex Chen</p>
            <p className="text-[10px] text-muted-foreground">Marketing Lead · 1st · Just now</p>
          </div>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          🚀 We just shipped something that will change how your team creates content.
          {'\n\n'}Introducing AI-powered content operations — where your entire content workflow runs on autopilot, from brief to publish.
          {'\n\n'}Here's what that means for your team:{'\n'}→ 10x faster content production{'\n'}→ Consistent brand voice across all channels{'\n'}→ Zero bottlenecks in your review process
        </p>
        <div className="flex items-center gap-4 pt-1 border-t border-border text-[11px] text-muted-foreground">
          <span>👍 124 likes</span>
          <span>💬 18 comments</span>
          <span>↗ 31 shares</span>
        </div>
      </div>
    );
  }

  if (type === 'Short Video') {
    return (
      <div className="rounded-xl overflow-hidden border border-border bg-black relative" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div className="w-1/3 h-full rounded-full" style={{ backgroundColor: color }} />
            </div>
            <span className="text-white text-[10px] font-mono">0:31</span>
          </div>
          <p className="text-white/60 text-[10px] mt-1">Product Demo — Top 5 Features</p>
        </div>
      </div>
    );
  }

  if (type === 'Carousel') {
    return (
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4'].map((s, i) => (
            <div key={s} className="shrink-0 w-28 rounded-lg border border-border flex flex-col items-center justify-center gap-2 py-6" style={{ backgroundColor: color + (i === 0 ? '18' : '08') }}>
              {i === 0 && <div className="w-6 h-6 rounded" style={{ backgroundColor: color }} />}
              <span className="text-[10px] font-medium text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-4' : 'w-1.5 bg-border'}`} style={i === 0 ? { backgroundColor: color } : {}} />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'Quote Card') {
    return (
      <div className="aspect-square rounded-xl flex items-center justify-center p-6 text-center max-h-52"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
        <div>
          <div className="text-4xl text-white/20 font-serif mb-2 leading-none">"</div>
          <p className="text-white font-semibold text-sm leading-relaxed">"Content is the atomic particle of all digital marketing."</p>
          <p className="text-white/60 text-xs mt-3">— Rebecca Lieb, Content Marketing Author</p>
        </div>
      </div>
    );
  }

  if (type === 'Email') {
    return (
      <div className="rounded-xl border border-border overflow-hidden max-h-60 text-xs">
        <div className="bg-secondary/60 px-3 py-2 border-b border-border space-y-0.5">
          <p className="font-semibold text-foreground text-xs">Subject: Transform Your Content Strategy in 2025</p>
          <p className="text-muted-foreground text-[10px]">From: alex@company.com · To: subscribers@list.com</p>
        </div>
        <div className="bg-card p-4 space-y-2">
          <div className="w-24 h-1 rounded-full mb-3" style={{ backgroundColor: color }} />
          <p className="text-foreground text-xs leading-relaxed">Hi [First Name],</p>
          <p className="text-muted-foreground text-xs leading-relaxed">We have something exciting to share with you today. Over the past year, we have been working on a solution to one of content marketing's biggest challenges...</p>
          <div className="mt-3 py-2 px-3 rounded-lg text-center text-xs font-semibold text-white" style={{ backgroundColor: color }}>
            Read the Full Story →
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ── Brief Editor ──────────────────────────────────────────────────────────────

function BriefEditor({ sections, onChange }: {
  sections: BriefSection[];
  onChange: (sections: BriefSection[]) => void;
}) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overId, setOverId]         = useState<number | null>(null);

  const reorder = (dragId: number, overId: number) => {
    const arr = [...sections];
    const fromIdx = arr.findIndex(s => s.id === dragId);
    const toIdx   = arr.findIndex(s => s.id === overId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange(arr);
  };

  const updateSection = (id: number, field: keyof BriefSection, value: string | number) =>
    onChange(sections.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addSection = () =>
    onChange([...sections, { id: Date.now(), heading: 'New Section', wordCount: 200 }]);

  const removeSection = (id: number) => onChange(sections.filter(s => s.id !== id));

  const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground">Article Brief</p>
          <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{totalWords.toLocaleString()} words total</span>
        </div>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> Open in Google Docs
        </button>
      </div>

      <div className="space-y-1.5">
        {sections.map(section => (
          <div
            key={section.id}
            draggable
            onDragStart={() => setDraggingId(section.id)}
            onDragEnd={() => { setDraggingId(null); setOverId(null); }}
            onDragOver={e => { e.preventDefault(); setOverId(section.id); }}
            onDrop={() => { if (draggingId !== null && draggingId !== section.id) reorder(draggingId, section.id); setOverId(null); }}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-all ${
              overId === section.id && draggingId !== section.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-secondary/20 hover:border-border'
            } ${draggingId === section.id ? 'opacity-40' : ''}`}
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 cursor-grab" />
            <input
              value={section.heading}
              onChange={e => updateSection(section.id, 'heading', e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground focus:outline-none min-w-0"
            />
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                value={section.wordCount}
                onChange={e => updateSection(section.id, 'wordCount', parseInt(e.target.value) || 0)}
                className="w-14 bg-secondary border border-border rounded px-1.5 py-0.5 text-[10px] text-muted-foreground text-right focus:outline-none focus:border-primary/50"
              />
              <span className="text-[10px] text-muted-foreground">wds</span>
            </div>
            <button onClick={() => removeSection(section.id)} className="text-muted-foreground/40 hover:text-red-400 transition-colors shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addSection}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline">
        <Plus className="w-3 h-3" /> Add Section
      </button>

      <p className="text-[10px] text-muted-foreground/70 flex items-start gap-1.5">
        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-yellow-500/70" />
        Editing the brief will regenerate the draft content based on your changes.
      </p>
    </div>
  );
}

// ── Generation Details ────────────────────────────────────────────────────────

function GenerationDetails({ item, templateId }: { item: EditableItem; templateId: string }) {
  const [open, setOpen] = useState(false);
  const tpl = (CONTENT_TEMPLATES[item.type] ?? []).find(t => t.id === templateId) ?? CONTENT_TEMPLATES[item.type]?.[0];

  const promptMap: Record<EditorContentType, string> = {
    'Blog Post':   `A 1,500-word SEO-optimized article about AI-powered content operations, targeting marketing managers. Tone: professional. Include a problem-solution structure with 3 key takeaways.`,
    'Social Post': `A LinkedIn post promoting the article "AI-Powered Content Operations: The Future is Now". Conversational tone. Include 3 bullet points and a question to drive comments. Max 300 words.`,
    'Short Video': `A 30-second promotional clip highlighting the top 5 features of the content operations platform. Include text overlays and upbeat pacing.`,
    'Carousel':    `A 4-slide LinkedIn carousel introducing AI content operations. Each slide has a headline and 2 supporting points. Brand colors.`,
    'Email':       `A promotional email announcing the new AI content operations platform. Subject line, intro paragraph, 3 benefit sections, and a CTA button.`,
    'Quote Card':  `A branded quote card featuring the quote "Content is the atomic particle of all digital marketing." by Rebecca Lieb. Use gradient brand colors.`,
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-4 py-3 bg-secondary/20 hover:bg-secondary/40 transition-colors">
        <span className="text-xs font-semibold text-muted-foreground">Generation Details</span>
        <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="p-4 border-t border-border space-y-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Prompt Summary</p>
            <p className="text-xs text-foreground/70 leading-relaxed bg-secondary/40 rounded-lg px-3 py-2.5">{promptMap[item.type]}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Source Material</p>
            <div className="flex items-center gap-2.5 bg-secondary/40 rounded-lg px-3 py-2">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">source-article.pdf</p>
                <p className="text-[10px] text-muted-foreground">2.4 MB · Uploaded May 10</p>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Template Used</p>
            <div className="flex items-center gap-2.5 bg-secondary/40 rounded-lg px-3 py-2">
              <div className="w-8 h-5 rounded shrink-0" style={{ backgroundColor: (tpl?.color ?? '#6366f1') + '40', borderLeft: `3px solid ${tpl?.color ?? '#6366f1'}` }} />
              <p className="text-xs font-medium text-foreground">{tpl?.name ?? 'Standard'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Regenerate Popover ────────────────────────────────────────────────────────

function RegeneratePopover({ credits, onConfirm, onCancel }: {
  credits: number; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="absolute bottom-full right-0 mb-2 w-56 bg-card border border-border rounded-xl shadow-2xl p-3 z-50">
      <div className="flex items-start gap-2 mb-3">
        <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground leading-relaxed">
          This will use <span className="font-semibold text-primary">{credits} credits</span>. The current version will be replaced.
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
          Continue
        </button>
      </div>
      <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export function ContentItemEditor({ item, onClose, onUpdate, onDelete }: ContentItemEditorProps) {
  const [status,       setStatus]       = useState<EditorContentStatus>(item.status);
  const [date,         setDate]         = useState(item.date);
  const [funnelStage,  setFunnelStage]  = useState(item.funnelStage || 'Awareness');
  const [topics,       setTopics]       = useState<string[]>(['Product Innovation']);
  const [templateId,   setTemplateId]   = useState(CONTENT_TEMPLATES[item.type]?.[0]?.id ?? 'standard');
  const [writer,       setWriter]       = useState(WRITERS[0].name);
  const [tone,         setTone]         = useState('Professional');
  const [level,        setLevel]        = useState('Expert');
  const [wordCount,    setWordCount]    = useState('1,500');
  const [context,      setContext]      = useState(PROJ_DEFAULTS.context);
  const [audience,     setAudience]     = useState(PROJ_DEFAULTS.audience);
  const [keywords,     setKeywords]     = useState('');
  const [questions,    setQuestions]    = useState('');
  const [details,      setDetails]      = useState('');
  const [inspiration,  setInspiration]  = useState(['']);
  const [brief,        setBrief]        = useState<BriefSection[]>(DEFAULT_BRIEF);
  const [showRegen,    setShowRegen]    = useState(false);

  const type = item.type;
  const credits = CREDITS_PER_TYPE[type];

  const toggleTopic = (t: string) =>
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const addLink = () => setInspiration(prev => [...prev, '']);
  const setLink = (i: number, v: string) => setInspiration(prev => { const n = [...prev]; n[i] = v; return n; });
  const removeLink = (i: number) => setInspiration(prev => prev.filter((_, idx) => idx !== i));

  const buildUpdated = (overrideStatus?: EditorContentStatus): EditableItem => ({
    ...item,
    date,
    funnelStage,
    status: overrideStatus ?? status,
  });

  const handleApprove = () => { setStatus('approved'); onUpdate(buildUpdated('approved')); };
  const handleReject  = () => { setStatus('rejected'); onUpdate(buildUpdated('rejected'));  };
  const handleSave    = () => onUpdate(buildUpdated());
  const handleRegen   = () => { setStatus('generating'); onUpdate(buildUpdated('generating')); setShowRegen(false); };
  const handleDelete  = () => { onDelete(item.id); onClose(); };

  const typeIcon = {
    'Blog Post':   <FileText className="w-3.5 h-3.5" />,
    'Social Post': <Share2 className="w-3.5 h-3.5" />,
    'Short Video': <Film className="w-3.5 h-3.5" />,
    'Carousel':    <LayoutGrid className="w-3.5 h-3.5" />,
    'Email':       <Mail className="w-3.5 h-3.5" />,
    'Quote Card':  <MessageSquare className="w-3.5 h-3.5" />,
  }[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[480px] bg-card border-l border-border flex flex-col shadow-2xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">
              Edit Post Draft #{postNumber(item.id)} · {formatDisplayDate(date)}
            </p>
            <h2 className="text-sm font-semibold text-foreground truncate pr-4">{item.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={status} />
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-6">

            {/* Content Preview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Preview</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded-full">
                  {typeIcon} {type}
                </div>
              </div>
              <ContentPreview type={type} templateId={templateId} />
            </div>

            <div className="h-px bg-border" />

            {/* ── Fields ────────────────────────────────────────────────── */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Settings</p>

              {/* Date */}
              <FieldRow label="Date">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </FieldRow>

              {/* Content Type — read-only */}
              <FieldRow label="Content Type">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
                  {typeIcon} {type}
                  <span className="ml-auto text-[10px] text-muted-foreground/50">not editable</span>
                </div>
              </FieldRow>

              {/* Funnel Stage */}
              <FieldRow label="Funnel Stage" inherited>
                <SimpleDropdown value={funnelStage} onChange={setFunnelStage} options={FUNNEL_OPTIONS} />
              </FieldRow>

              {/* Topics */}
              <FieldRow label="Topic">
                <div className="flex flex-wrap gap-1.5">
                  {MOCK_TOPICS.map(t => (
                    <button key={t} onClick={() => toggleTopic(t)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all ${
                        topics.includes(t)
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
                      }`}>
                      <Hash className="w-2.5 h-2.5" />{t}
                    </button>
                  ))}
                </div>
              </FieldRow>

              {/* Template */}
              <FieldRow label="Template" inherited>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(CONTENT_TEMPLATES[type] ?? []).map(tpl => (
                    <button key={tpl.id} onClick={() => setTemplateId(tpl.id)}
                      className={`flex flex-col items-start gap-1.5 p-2.5 rounded-xl border shrink-0 transition-all ${
                        templateId === tpl.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
                      }`}>
                      <div className="w-16 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: tpl.color + '22' }}>
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: tpl.color }} />
                      </div>
                      <span className="text-[10px] font-medium text-foreground">{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </FieldRow>

              {/* Writer Profile */}
              {hasWriter(type) && (
                <FieldRow label="Writer Profile" inherited>
                  <WriterDropdown value={writer} onChange={setWriter} />
                </FieldRow>
              )}

              {/* Writing Tone + Level */}
              {isTextBased(type) && (
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Writing Tone" inherited>
                    <input value={tone} onChange={e => setTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-primary/50" />
                  </FieldRow>
                  <FieldRow label="Writing Level" inherited>
                    <input value={level} onChange={e => setLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-primary/50" />
                  </FieldRow>
                </div>
              )}

              {/* Word Count */}
              {isLongForm(type) && (
                <FieldRow label="Word Count" inherited>
                  <input value={wordCount} onChange={e => setWordCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-primary/50" />
                </FieldRow>
              )}

              {/* Project Context */}
              {isTextBased(type) && (
                <FieldRow label="Project Context" inherited>
                  <textarea value={context} onChange={e => setContext(e.target.value)} rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary/50" />
                </FieldRow>
              )}

              {/* Target Audience */}
              {isTextBased(type) && (
                <FieldRow label="Target Audience" inherited>
                  <textarea value={audience} onChange={e => setAudience(e.target.value)} rows={2}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary/50" />
                </FieldRow>
              )}

              {/* Keywords */}
              {isLongForm(type) && (
                <FieldRow label="Secondary Keywords">
                  <input value={keywords} onChange={e => setKeywords(e.target.value)}
                    placeholder="SEO keywords, comma-separated"
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50" />
                </FieldRow>
              )}

              {/* Questions */}
              {isLongForm(type) && (
                <FieldRow label="Questions to Answer">
                  <textarea value={questions} onChange={e => setQuestions(e.target.value)}
                    placeholder="What questions should this content address?"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50" />
                </FieldRow>
              )}

              {/* Additional Details */}
              <FieldRow label="Additional Details">
                <textarea value={details} onChange={e => setDetails(e.target.value)}
                  placeholder="Any additional context or requirements…"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50" />
              </FieldRow>

              {/* Inspiration */}
              {hasInspiration(type) && (
                <FieldRow label="Inspiration References">
                  <div className="space-y-1.5">
                    {inspiration.map((link, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <input value={link} onChange={e => setLink(i, e.target.value)}
                          placeholder="https://example.com/reference"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50" />
                        {inspiration.length > 1 && (
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
                </FieldRow>
              )}
            </div>

            {/* ── Brief (Blog Post only) ─────────────────────────────────── */}
            {hasBrief(type) && (
              <>
                <div className="h-px bg-border" />
                <BriefEditor sections={brief} onChange={setBrief} />
              </>
            )}

            <div className="h-px bg-border" />

            {/* ── Generation Details ─────────────────────────────────────── */}
            <GenerationDetails item={item} templateId={templateId} />

            {/* Bottom padding for sticky footer */}
            <div className="h-4" />
          </div>
        </div>

        {/* ── Sticky Footer ────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-border bg-card px-5 py-3.5 space-y-3">
          {/* Primary actions */}
          <div className="flex items-center gap-2">
            <button onClick={handleApprove}
              className="flex-1 py-2 rounded-lg bg-[#12B667]/10 border border-[#12B667]/20 text-[#8FE6B5] text-sm font-semibold hover:bg-[#12B667]/20 transition-colors">
              Approve
            </button>
            <div className="relative flex-1">
              <button onClick={() => setShowRegen(o => !o)}
                className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              {showRegen && (
                <RegeneratePopover credits={credits} onConfirm={handleRegen} onCancel={() => setShowRegen(false)} />
              )}
            </div>
            <button onClick={handleReject}
              className="flex-1 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors">
              Reject
            </button>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center justify-between">
            <button onClick={handleDelete}
              className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
            <button onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground hover:border-primary/40 transition-colors flex items-center gap-1.5">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Plus, X, ChevronDown, ChevronLeft, ChevronRight, RefreshCw,
  Info, Upload, FileText, Video, Image, Quote, LayoutGrid, Film,
  Megaphone, Eye, Target, Check, Zap, Hash,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

type DurationPreset = '1week' | '2weeks' | '1month' | 'custom';
type ContentTypeKey = 'clips' | 'blog' | 'aivoice' | 'images' | 'quotes' | 'carousel';
type FunnelKey = 'awareness' | 'consideration' | 'conversion';
type WizardStep = 'choice' | 'editor';

interface ContentTypeCfg {
  label: string;
  enabled: boolean;
  percentage: number;
  color: string;
  icon: React.FC<{ className?: string }>;
}

interface ScheduledPost {
  id: number;
  date: string;
  type: ContentTypeKey;
  funnel: FunnelKey;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EXISTING_CAMPAIGNS = [
  { id: 1, name: 'Summer Launch',       color: '#F97316' },
  { id: 2, name: 'Brand Awareness Q2',  color: '#8B5CF6' },
  { id: 3, name: 'Product Demo Series', color: '#06B6D4' },
  { id: 4, name: 'Newsletter Reboot',   color: '#EC4899' },
];

const DEFAULT_TOPICS = [
  'Content Marketing', 'Brand Building', 'Social Media', 'SEO Strategy',
  'Product Launch', 'Customer Stories', 'Thought Leadership', 'Community',
];

const CT_META: Record<ContentTypeKey, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  clips:    { label: 'Clips & Shorts',         color: '#8B5CF6', icon: Video      },
  blog:     { label: 'Blog Posts',             color: '#3B82F6', icon: FileText   },
  aivoice:  { label: 'AI Text-to-Voice Video', color: '#06B6D4', icon: Film       },
  images:   { label: 'Images & Carousels',     color: '#F97316', icon: Image      },
  quotes:   { label: 'Quote Cards',            color: '#EC4899', icon: Quote      },
  carousel: { label: 'Carousels',              color: '#EAB308', icon: LayoutGrid },
};

const FUNNEL_META: Record<FunnelKey, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
  awareness:     { label: 'Awareness',     icon: Megaphone, color: '#8B5CF6' },
  consideration: { label: 'Consideration', icon: Eye,       color: '#3B82F6' },
  conversion:    { label: 'Conversion',    icon: Target,    color: '#4B56F2' },
};

const CREDIT_MAP: Record<ContentTypeKey, number> = {
  clips: 5, blog: 3, aivoice: 6, images: 2, quotes: 1, carousel: 2,
};

const AUTO_NAMES = [
  'Jun — Brand Building & Social Media',
  'Jun — Content Marketing & SEO',
  'Jun — Product Launch & Community',
  'Jun — Thought Leadership & Events',
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ── Date helpers ──────────────────────────────────────────────────────────────

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function snapToNextSunday(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  if (day !== 0) d.setDate(d.getDate() + (7 - day));
  return d.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  return Math.max(1,
    Math.round((new Date(end + 'T12:00:00').getTime() - new Date(start + 'T12:00:00').getTime()) / 86400000) + 1
  );
}

function fmtDisplay(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Schedule generation ───────────────────────────────────────────────────────

function generateSchedule(
  startDate: string, endDate: string, postsPerDay: number,
  contentTypes: Record<ContentTypeKey, ContentTypeCfg>,
  funnel: Record<FunnelKey, number>,
): ScheduledPost[] {
  const days  = daysBetween(startDate, endDate);
  const total = Math.max(1, Math.round(postsPerDay * days));

  const enabled = (Object.keys(contentTypes) as ContentTypeKey[]).filter(k => contentTypes[k].enabled);
  if (enabled.length === 0) return [];

  const totalPct = enabled.reduce((s, k) => s + contentTypes[k].percentage, 0) || 100;
  const typeCounts = enabled.map(k => ({ key: k, count: Math.round(total * contentTypes[k].percentage / totalPct) }));
  const diff = total - typeCounts.reduce((s, t) => s + t.count, 0);
  if (typeCounts.length > 0) typeCounts[typeCounts.length - 1].count += diff;

  const typeSeq: ContentTypeKey[] = [];
  const maxTC = Math.max(...typeCounts.map(t => t.count));
  for (let i = 0; i < maxTC; i++) for (const t of typeCounts) if (i < t.count) typeSeq.push(t.key);

  const fkeys: FunnelKey[] = ['awareness', 'consideration', 'conversion'];
  const fCounts = fkeys.map(k => ({ key: k, count: Math.round(total * funnel[k] / 100) }));
  const fdiff = total - fCounts.reduce((s, f) => s + f.count, 0);
  if (fCounts.length > 0) fCounts[fCounts.length - 1].count += fdiff;

  const funnelSeq: FunnelKey[] = [];
  const maxFC = Math.max(...fCounts.map(f => f.count));
  for (let i = 0; i < maxFC; i++) for (const f of fCounts) if (i < f.count) funnelSeq.push(f.key);

  return Array.from({ length: total }, (_, i) => {
    const dayOffset = total === 1 ? 0 : Math.round(i * (days - 1) / (total - 1));
    return {
      id: i,
      date: addDays(startDate, Math.min(dayOffset, days - 1)),
      type: typeSeq[i % Math.max(1, typeSeq.length)],
      funnel: funnelSeq[i % Math.max(1, funnelSeq.length)],
    };
  });
}

// ── Rebalance funnel ──────────────────────────────────────────────────────────

function rebalanceFunnel(changed: FunnelKey, newVal: number, cur: Record<FunnelKey, number>): Record<FunnelKey, number> {
  const remaining = 100 - newVal;
  const others = (['awareness', 'consideration', 'conversion'] as FunnelKey[]).filter(k => k !== changed);
  const otherTotal = others.reduce((s, k) => s + cur[k], 0);
  const result = { ...cur, [changed]: newVal };
  if (otherTotal === 0) {
    result[others[0]] = Math.round(remaining / 2);
    result[others[1]] = remaining - result[others[0]];
  } else {
    others.forEach(k => { result[k] = Math.round(cur[k] / otherTotal * remaining); });
    const sum = others.reduce((s, k) => s + result[k], 0);
    if (sum !== remaining) result[others[others.length - 1]] += remaining - sum;
  }
  return result;
}

// ── DefaultBadge ──────────────────────────────────────────────────────────────

function DefaultBadge() {
  return (
    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium whitespace-nowrap">
      Project Default
    </span>
  );
}

// ── CampaignSection ───────────────────────────────────────────────────────────

function CampaignSection({ title, summary, defaultOpen = false, children, tooltip }: {
  title: string; summary?: string; defaultOpen?: boolean; children: React.ReactNode; tooltip?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex-1 flex items-baseline gap-2 min-w-0 text-left">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap">{title}</span>
          {tooltip && (
            <span title={tooltip} className="text-muted-foreground cursor-help shrink-0">
              <Info className="w-3 h-3 inline" />
            </span>
          )}
          {!open && summary && (
            <span className="text-xs text-muted-foreground truncate">{summary}</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── ChoiceScreen ──────────────────────────────────────────────────────────────

function ChoiceScreen({ onChoose }: { onChoose: () => void }) {
  const [duplicateId, setDuplicateId] = useState<number | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = EXISTING_CAMPAIGNS.find(c => c.id === duplicateId);

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="max-w-xl w-full px-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Start a New Campaign</h2>
        <p className="text-sm text-muted-foreground mb-8">How would you like to begin?</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onChoose}
            className="group flex flex-col items-start gap-3 p-6 border-2 border-border rounded-2xl hover:border-primary/60 hover:bg-primary/[0.03] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Start Fresh</div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Begin blank. All fields pre-fill from your project defaults and remain editable.</p>
            </div>
          </button>

          <div className="flex flex-col items-start gap-3 p-6 border-2 border-border rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="w-full">
              <div className="text-base font-semibold text-foreground mb-1">Duplicate Existing</div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Copy all settings from a previous campaign. All values remain editable.</p>
              <div ref={ref} className="relative">
                <button
                  type="button"
                  onClick={() => setDropOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-secondary border border-border rounded-lg text-sm hover:bg-secondary/70 transition-colors"
                >
                  <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
                    {selected ? selected.name : 'Select a campaign…'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
                {dropOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1">
                    {EXISTING_CAMPAIGNS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { setDuplicateId(c.id); setDropOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary transition-colors ${duplicateId === c.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        {c.name}
                        {duplicateId === c.id && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {duplicateId && (
                <button
                  onClick={onChoose}
                  className="mt-3 w-full py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Use This Campaign
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Campaign Calendar ─────────────────────────────────────────────────────────

function CampaignCalendar({
  posts, setPostDate, startDate, endDate,
  year, month, onPrevMonth, onNextMonth,
  toggle, setToggle, draggingId, setDraggingId,
}: {
  posts: ScheduledPost[];
  setPostDate: (id: number, date: string) => void;
  startDate: string; endDate: string;
  year: number; month: number;
  onPrevMonth: () => void; onNextMonth: () => void;
  toggle: 'this' | 'all'; setToggle: (v: 'this' | 'all') => void;
  draggingId: number | null; setDraggingId: (id: number | null) => void;
}) {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth    = new Date(year, month + 1, 0).getDate();
  const totalCells     = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const monthPfx       = `${year}-${String(month + 1).padStart(2, '0')}`;

  const postsByDate: Record<string, ScheduledPost[]> = {};
  posts.forEach(p => { postsByDate[p.date] = [...(postsByDate[p.date] ?? []), p]; });

  const today   = new Date();
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  const inRange = (dateStr: string) => dateStr >= startDate && dateStr <= endDate;

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
      <div className="flex items-center justify-between shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground w-36 text-center">{MONTH_NAMES[month]} {year}</h2>
          <button onClick={onNextMonth} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {(Object.keys(CT_META) as ContentTypeKey[]).map(k => {
              const m = CT_META[k]; const Icon = m.icon;
              return (
                <div key={k} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="w-3 h-3 shrink-0" style={{ color: m.color }} />
                </div>
              );
            })}
          </div>
          <div className="flex items-center p-1 bg-card border border-border rounded-lg">
            {(['this', 'all'] as const).map(v => (
              <button
                key={v}
                onClick={() => setToggle(v)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${toggle === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {v === 'this' ? 'This Campaign' : 'All Campaigns'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 shrink-0">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="py-1.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border flex-1">
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - firstDayOfWeek + 1;
          if (day < 1 || day > daysInMonth) return <div key={i} className="bg-card/20" />;

          const dateStr  = `${monthPfx}-${String(day).padStart(2, '0')}`;
          const dayPosts = postsByDate[dateStr] ?? [];
          const inCamp   = inRange(dateStr);

          return (
            <div
              key={i}
              className={`bg-background min-h-[90px] p-1.5 transition-colors ${inCamp ? 'bg-primary/[0.025]' : ''} ${draggingId !== null ? 'hover:bg-primary/10 cursor-copy' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (draggingId !== null) {
                  setPostDate(draggingId, dateStr);
                  setDraggingId(null);
                }
              }}
            >
              <div className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full mb-1 ${isToday(day) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                {day}
              </div>
              {inCamp && (
                <div className="space-y-0.5">
                  {dayPosts.slice(0, 3).map(post => {
                    const meta = CT_META[post.type];
                    const TypeIcon = meta.icon;
                    const FunnelIcon = FUNNEL_META[post.funnel].icon;
                    return (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => setDraggingId(post.id)}
                        onDragEnd={() => setDraggingId(null)}
                        className="rounded-md px-1.5 py-1 cursor-grab active:cursor-grabbing border border-dashed hover:opacity-80 transition-opacity select-none"
                        style={{ borderColor: meta.color + '55', backgroundColor: meta.color + '15', color: meta.color }}
                      >
                        <div className="flex items-center gap-0.5 mb-0.5">
                          <TypeIcon className="w-2.5 h-2.5 shrink-0" style={{ color: meta.color }} />
                          <FunnelIcon className="w-2.5 h-2.5 shrink-0 opacity-50" />
                          <div
                            className="w-1.5 h-1.5 rounded-full ml-auto shrink-0"
                            style={{ backgroundColor: FUNNEL_META[post.funnel].color }}
                          />
                        </div>
                        <span className="text-[10px] font-medium leading-tight block truncate" style={{ color: meta.color }}>
                          {FUNNEL_META[post.funnel].label}
                        </span>
                      </div>
                    );
                  })}
                  {dayPosts.length > 3 && <div className="text-[10px] text-muted-foreground pl-1">+{dayPosts.length - 3}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────

export interface CreateCampaignWizardProps {
  projectId: number;
  projectName: string;
  onBack: () => void;
  onComplete: () => void;
}

export function CreateCampaignWizard({ projectName, onBack, onComplete }: CreateCampaignWizardProps) {
  const [step, setStep]         = useState<WizardStep>('choice');
  const [nameIdx, setNameIdx]   = useState(0);
  const [campaignName, setCampaignName] = useState(AUTO_NAMES[0]);

  const [durationPreset, setDurationPreset] = useState<DurationPreset>('1month');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate]     = useState('2026-06-30');
  const [postsPerDay, setPostsPerDay] = useState(1);

  const [funnel, setFunnel] = useState<Record<FunnelKey, number>>({ awareness: 60, consideration: 25, conversion: 15 });

  const [contentTypes, setContentTypes] = useState<Record<ContentTypeKey, ContentTypeCfg>>({
    clips:    { ...CT_META.clips,    enabled: true,  percentage: 30 },
    blog:     { ...CT_META.blog,     enabled: true,  percentage: 25 },
    aivoice:  { ...CT_META.aivoice,  enabled: false, percentage: 0  },
    images:   { ...CT_META.images,   enabled: true,  percentage: 25 },
    quotes:   { ...CT_META.quotes,   enabled: true,  percentage: 20 },
    carousel: { ...CT_META.carousel, enabled: false, percentage: 0  },
  });

  const [topics, setTopics]           = useState(DEFAULT_TOPICS);
  const [newTopic, setNewTopic]       = useState('');
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [showProjectRes, setShowProjectRes] = useState(false);
  const [overrideBrand, setOverrideBrand]   = useState(false);

  const [calYear, setCalYear]   = useState(2026);
  const [calMonth, setCalMonth] = useState(5);
  const [calToggle, setCalToggle] = useState<'this' | 'all'>('this');
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  const ctKey     = Object.entries(contentTypes).map(([k,v]) => `${k}:${v.enabled}:${v.percentage}`).join(',');
  const funnelKey = `${funnel.awareness}:${funnel.consideration}:${funnel.conversion}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setScheduledPosts(generateSchedule(startDate, endDate, postsPerDay, contentTypes, funnel));
  }, [startDate, endDate, postsPerDay, ctKey, funnelKey]);

  const applyPreset = (preset: DurationPreset) => {
    setDurationPreset(preset);
    const today = new Date().toISOString().slice(0, 10);
    const s = today;
    if (preset === '1week')  { setStartDate(s); setEndDate(snapToNextSunday(addDays(s, 7)));  }
    if (preset === '2weeks') { setStartDate(s); setEndDate(snapToNextSunday(addDays(s, 14))); }
    if (preset === '1month') { setStartDate(s); setEndDate(addDays(s, 30)); }
  };

  const toggleCT = (key: ContentTypeKey) => {
    setContentTypes(prev => {
      const next = { ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } };
      const enabled = (Object.keys(next) as ContentTypeKey[]).filter(k => next[k].enabled);
      if (enabled.length > 0) {
        const eq = Math.floor(100 / enabled.length);
        const rem = 100 - eq * enabled.length;
        enabled.forEach((k, i) => { next[k] = { ...next[k], percentage: eq + (i === 0 ? rem : 0) }; });
      }
      return next;
    });
  };

  const totalDays  = daysBetween(startDate, endDate);
  const totalPosts = Math.max(1, Math.round(postsPerDay * totalDays));
  const enabledCTs = (Object.keys(contentTypes) as ContentTypeKey[]).filter(k => contentTypes[k].enabled);
  const totalPct   = enabledCTs.reduce((s, k) => s + contentTypes[k].percentage, 0) || 100;

  const typeBreakdown = enabledCTs.map(k => ({
    key: k,
    count:   Math.round(totalPosts * contentTypes[k].percentage / totalPct),
    credits: Math.round(totalPosts * contentTypes[k].percentage / totalPct) * CREDIT_MAP[k],
  }));
  const totalCredits = typeBreakdown.reduce((s, t) => s + t.credits, 0);

  const funnelBreakdown = (['awareness', 'consideration', 'conversion'] as FunnelKey[]).map(k => ({
    key: k, count: Math.round(totalPosts * funnel[k] / 100),
  }));

  const setPostDate = (id: number, date: string) =>
    setScheduledPosts(ps => ps.map(p => p.id === id ? { ...p, date } : p));

  const prevMonth = () => calMonth === 0  ? (setCalYear(y => y - 1), setCalMonth(11)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalYear(y => y + 1), setCalMonth(0))  : setCalMonth(m => m + 1);

  const handleCreate = () => {
    onComplete();
    toast.success('Campaign created! Content is being generated…', {
      description: 'Click any content item to review and edit it.',
      duration: 5000,
    });
  };

  const inputCls = "w-full px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  // Shared header
  const header = (
    <header className="flex items-center gap-3 px-5 h-14 border-b border-border bg-card/30 shrink-0">
      <button
        onClick={step === 'editor' ? () => setStep('choice') : onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <ArrowLeft className="w-4 h-4" />
        {step === 'editor' ? 'Back' : projectName}
      </button>
      <div className="w-px h-4 bg-border shrink-0" />
      {step === 'editor' ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            value={campaignName}
            onChange={e => setCampaignName(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-foreground focus:outline-none"
          />
          <button
            onClick={() => { const n = (nameIdx + 1) % AUTO_NAMES.length; setNameIdx(n); setCampaignName(AUTO_NAMES[n]); }}
            title="Regenerate name"
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-muted-foreground shrink-0">{projectName}</span>
        </div>
      ) : (
        <span className="text-sm font-semibold text-foreground">New Campaign</span>
      )}
    </header>
  );

  if (step === 'choice') {
    return (
      <div className="flex flex-1 flex-col h-full min-w-0">
        {header}
        <ChoiceScreen onChoose={() => setStep('editor')} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
      {header}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Settings Panel ─────────────────────────────────────────── */}
        <div className="w-[400px] shrink-0 flex flex-col border-r border-border">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">

            {/* A: Duration */}
            <CampaignSection title="A · Duration" defaultOpen summary={`${totalDays} days`}>
              <div className="flex gap-1.5">
                {([['1week','1 Week'],['2weeks','2 Weeks'],['1month','1 Month'],['custom','Custom']] as const).map(([p, l]) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      durationPreset === p
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {durationPreset === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Start</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">End</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2 leading-relaxed">
                <span className="text-foreground font-medium">{fmtDisplay(startDate)}</span>
                {' → '}
                <span className="text-foreground font-medium">{fmtDisplay(endDate)}</span>
                {' · '}
                <span className="text-foreground font-medium">{totalDays} days total</span>
              </p>
            </CampaignSection>

            {/* B: Content Volume */}
            <CampaignSection title="B · Content Volume" defaultOpen summary={`${postsPerDay}/day · ${totalPosts} posts`}>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0">Posts per day</span>
                <input
                  type="range" min={0.5} max={5} step={0.5} value={postsPerDay}
                  onChange={e => setPostsPerDay(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-bold text-foreground w-6 text-right shrink-0">{postsPerDay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">≈ {Math.round(postsPerDay * 30)} posts / month</span>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">{totalPosts} total posts</span>
              </div>
            </CampaignSection>

            {/* C: Funnel Stage Mix */}
            <CampaignSection
              title="C · Funnel Stage Mix"
              summary={`${funnel.awareness}% Aware · ${funnel.consideration}% Consider · ${funnel.conversion}% Convert`}
              tooltip="Funnel stages distribute content across the buyer journey. Awareness attracts new audiences, Consideration nurtures interest, Conversion drives action. Sliders auto-rebalance to maintain 100%."
            >
              {(['awareness', 'consideration', 'conversion'] as FunnelKey[]).map(k => {
                const meta = FUNNEL_META[k]; const Icon = meta.icon;
                const count = Math.round(totalPosts * funnel[k] / 100);
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{meta.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">~{count} posts</span>
                        <span className="text-sm font-semibold text-foreground w-9 text-right">{funnel[k]}%</span>
                      </div>
                    </div>
                    <input
                      type="range" min={0} max={100} step={5} value={funnel[k]}
                      onChange={e => setFunnel(rebalanceFunnel(k, Number(e.target.value), funnel))}
                      className="w-full"
                      style={{ accentColor: meta.color }}
                    />
                  </div>
                );
              })}
            </CampaignSection>

            {/* D: Content Type Mix */}
            <CampaignSection title="D · Content Type Mix" summary={`${enabledCTs.length} active types`}>
              <div className="space-y-2">
                {(Object.keys(contentTypes) as ContentTypeKey[]).map(k => {
                  const cfg = contentTypes[k]; const Icon = cfg.icon;
                  const count = cfg.enabled ? Math.round(totalPosts * cfg.percentage / totalPct) : 0;
                  return (
                    <div key={k} className={`p-2.5 rounded-xl border transition-colors ${cfg.enabled ? 'border-border bg-secondary/20' : 'border-border/40 opacity-50'}`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCT(k)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${cfg.enabled ? 'bg-primary border-primary' : 'border-border'}`}
                        >
                          {cfg.enabled && <Check className="w-2.5 h-2.5 text-white" />}
                        </button>
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.color }} />
                        <span className="text-sm text-foreground flex-1">{cfg.label}</span>
                        {cfg.enabled && <span className="text-xs text-muted-foreground">{count} posts</span>}
                      </div>
                      {cfg.enabled && (
                        <div className="flex items-center gap-2 mt-1.5 pl-6">
                          <input
                            type="range" min={0} max={100} step={5} value={cfg.percentage}
                            onChange={e => setContentTypes(prev => ({ ...prev, [k]: { ...prev[k], percentage: Number(e.target.value) } }))}
                            className="flex-1"
                            style={{ accentColor: cfg.color }}
                          />
                          <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{cfg.percentage}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CampaignSection>

            {/* E: Topics */}
            <CampaignSection title="E · Content Topics" summary={`${topics.length} topics`}>
              <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 border border-border leading-relaxed">
                Inherited from project. Changes here apply only to this campaign.
              </p>
              <div className="flex gap-2">
                <input
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newTopic.trim()) { setTopics(ts => [newTopic.trim(), ...ts]); setNewTopic(''); } }}
                  placeholder="Add topic…"
                  className={inputCls}
                />
                <button
                  onClick={() => { if (newTopic.trim()) { setTopics(ts => [newTopic.trim(), ...ts]); setNewTopic(''); } }}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(showAllTopics ? topics : topics.slice(0, 10)).map(t => (
                  <span key={t} className="flex items-center gap-1 px-2 py-1 bg-secondary border border-border rounded-full text-sm text-foreground">
                    <Hash className="w-3 h-3 text-muted-foreground shrink-0" />
                    {t}
                    <button onClick={() => setTopics(ts => ts.filter(x => x !== t))} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {topics.length > 10 && (
                <button onClick={() => setShowAllTopics(s => !s)} className="text-sm text-primary hover:underline">
                  {showAllTopics ? 'Show less' : `Show all (${topics.length} topics)`}
                </button>
              )}
            </CampaignSection>

            {/* F: Resources */}
            <CampaignSection title="F · Resources" defaultOpen>
              <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:border-primary/40 hover:bg-secondary/20 transition-colors">
                <Upload className="w-5 h-5 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-0.5">Images, videos, PDFs, docs</p>
              </div>
              <input placeholder="Paste a URL or text…" className={inputCls} />
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setShowProjectRes(s => !s)}
                  className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${showProjectRes ? 'bg-primary' : 'bg-muted border border-border'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showProjectRes ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-foreground">Show project resources</span>
              </label>
              {showProjectRes && (
                <p className="text-xs text-muted-foreground italic">3 project resources available — Brand Guide, Logo, Brief</p>
              )}
            </CampaignSection>

            {/* G: Brand Guidelines */}
            <CampaignSection title="G · Brand Guidelines & Tone">
              <div className="flex items-center justify-between">
                <DefaultBadge />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs text-muted-foreground">Edit for this campaign</span>
                  <button
                    type="button"
                    onClick={() => setOverrideBrand(s => !s)}
                    className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${overrideBrand ? 'bg-primary' : 'bg-muted border border-border'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${overrideBrand ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              </div>
              <div className={`flex items-center gap-2 ${!overrideBrand ? 'opacity-60 pointer-events-none' : ''}`}>
                {['#111111','#FA5400','#FFFFFF'].map(c => (
                  <div key={c} className="w-5 h-5 rounded-full border border-border shrink-0" style={{ backgroundColor: c }} />
                ))}
                <span className="text-sm text-muted-foreground">3 colors · Bold tone</span>
                {overrideBrand && <span className="text-xs text-primary ml-auto">Override on</span>}
              </div>
            </CampaignSection>

            {/* H: Writer Profile */}
            <CampaignSection title="H · Writer Profile">
              {enabledCTs.includes('blog') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Long Form / Blog</span>
                    <DefaultBadge />
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-secondary/50 rounded-lg border border-border">
                    <div className="w-7 h-7 rounded-full bg-[#4B56F2] flex items-center justify-center text-xs font-bold text-white shrink-0">GD</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground">Guru Dev</div>
                      <div className="text-xs text-muted-foreground">Professional · Expert · 2,000 words</div>
                    </div>
                    <button className="text-xs text-primary hover:underline shrink-0">Change</button>
                  </div>
                </div>
              )}
              {(enabledCTs.includes('clips') || enabledCTs.includes('images') || enabledCTs.includes('quotes') || enabledCTs.includes('carousel')) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Social / Short Form</span>
                    <DefaultBadge />
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-secondary/50 rounded-lg border border-border">
                    <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shrink-0">SK</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground">Sarah Kim</div>
                      <div className="text-xs text-muted-foreground">Bold · Intermediate · 200 words</div>
                    </div>
                    <button className="text-xs text-primary hover:underline shrink-0">Change</button>
                  </div>
                </div>
              )}
              {enabledCTs.length === 0 && (
                <p className="text-sm text-muted-foreground">Enable content types in Section D to see writer profiles.</p>
              )}
            </CampaignSection>

          </div>

          {/* ── Sticky Cost Summary ─────────────────────────────────────────── */}
          <div className="border-t border-border bg-card/60 px-4 py-3 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</span>
              <div className="flex items-center gap-1 text-primary">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-sm font-bold">{totalCredits} credits</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground font-medium">{totalDays} days</span>
              <span className="text-muted-foreground">Total posts</span>
              <span className="text-foreground font-medium">{totalPosts}</span>
            </div>
            <div className="space-y-0.5">
              {typeBreakdown.map(t => {
                const Icon = CT_META[t.key].icon;
                return (
                  <div key={t.key} className="flex items-center gap-1.5 text-xs">
                    <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground flex-1 truncate">{CT_META[t.key].label}</span>
                    <span className="text-foreground font-medium">{t.count}</span>
                    <span className="text-muted-foreground/50 w-10 text-right">{t.credits}c</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-2 space-y-0.5">
              {funnelBreakdown.map(f => {
                const Icon = FUNNEL_META[f.key].icon;
                return (
                  <div key={f.key} className="flex items-center gap-1.5 text-xs">
                    <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground flex-1">{FUNNEL_META[f.key].label}</span>
                    <span className="text-foreground font-medium">{f.count} posts</span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleCreate}
              className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Create Campaign
            </button>
          </div>
        </div>

        {/* ── Right Calendar Preview ──────────────────────────────────────── */}
        <CampaignCalendar
          posts={scheduledPosts}
          setPostDate={setPostDate}
          startDate={startDate}
          endDate={endDate}
          year={calYear}
          month={calMonth}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          toggle={calToggle}
          setToggle={setCalToggle}
          draggingId={draggingId}
          setDraggingId={setDraggingId}
        />
      </div>
    </div>
  );
}

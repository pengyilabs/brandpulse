import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeft, FileText, ImageIcon, LayoutGrid, Video, Sparkles,
  Check, ChevronLeft, ChevronRight, User, Paintbrush, BookOpen,
  Target, AlignLeft, Flag,
} from "lucide-react";
import { clsx } from "clsx";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentTypeId = "blog-post" | "social-post" | "carousel" | "video-clip";
type FunnelKey = "tofu" | "mofu" | "bofu";
type DurationUnit = "weeks" | "months";
type VolumeUnit = "per-day" | "per-week";

interface FunnelMix { tofu: number; mofu: number; bofu: number }
interface ContentTypeEntry { enabled: boolean; pct: number }
type ContentTypeMix = Record<ContentTypeId, ContentTypeEntry>;

interface CampaignConfig {
  name: string;
  description: string;
  durationValue: number;
  durationUnit: DurationUnit;
  volumeValue: number;
  volumeUnit: VolumeUnit;
  funnelMix: FunnelMix;
  contentTypeMix: ContentTypeMix;
  brandGuidelines: string;
  writerProfile: string;
  themes: string;
  resources: string;
}

interface PlannedItem {
  id: number;
  date: Date;
  dateStr: string;
  type: ContentTypeId;
  funnelStage: FunnelKey;
  topic: string;
  brief: string;
}

export interface CreateCampaignPageProps {
  onBack: () => void;
  onComplete: (campaign: any) => void;
  duplicateFrom?: any;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROJECT_DEFAULTS = {
  brandGuidelines:
    "Bold, motivational, performance-driven. Active voice, strong verbs, energetic language. Inspire and empower — never talk down.",
  writerProfile: "Velocity Athletics Team",
  themes: "Summer collection, athlete performance, product innovation, training science",
  resources: "Brand guidelines doc, product photography, athlete photo library",
};

const INITIAL_CONFIG: CampaignConfig = {
  name: "",
  description: "",
  durationValue: 4,
  durationUnit: "weeks",
  volumeValue: 3,
  volumeUnit: "per-week",
  funnelMix: { tofu: 40, mofu: 40, bofu: 20 },
  contentTypeMix: {
    "blog-post": { enabled: true, pct: 25 },
    "social-post": { enabled: true, pct: 45 },
    "carousel": { enabled: true, pct: 20 },
    "video-clip": { enabled: true, pct: 10 },
  },
  brandGuidelines: PROJECT_DEFAULTS.brandGuidelines,
  writerProfile: PROJECT_DEFAULTS.writerProfile,
  themes: PROJECT_DEFAULTS.themes,
  resources: PROJECT_DEFAULTS.resources,
};

const TYPE_CFG: Record<ContentTypeId, { label: string; Icon: React.ElementType; color: string }> = {
  "blog-post":   { label: "Blog Post",    Icon: FileText,   color: "#60A5FA" },
  "social-post": { label: "Social Post",  Icon: ImageIcon,  color: "#F472B6" },
  "carousel":    { label: "Carousel",     Icon: LayoutGrid, color: "#A78BFA" },
  "video-clip":  { label: "Video Script", Icon: Video,      color: "#34D399" },
};

const FUNNEL_CFG: Record<FunnelKey, { label: string; short: string; color: string }> = {
  tofu: { label: "Top of Funnel",    short: "ToFu", color: "#38BDF8" },
  mofu: { label: "Middle of Funnel", short: "MoFu", color: "#A78BFA" },
  bofu: { label: "Bottom of Funnel", short: "BoFu", color: "#34D399" },
};

const TYPE_IDS: ContentTypeId[] = ["blog-post", "social-post", "carousel", "video-clip"];
const FUNNEL_KEYS: FunnelKey[] = ["tofu", "mofu", "bofu"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const TOPICS: Record<FunnelKey, string[]> = {
  tofu: [
    "Summer Collection Launch", "Velocity Air Innovation", "Behind the Training",
    "Meet the Athletes", "Performance Science", "Your Summer Starts Now",
    "Run Culture Spotlight", "The Art of Movement",
  ],
  mofu: [
    "Velocity Air Max 2026 Deep Dive", "Why Velocity Tech Fleece?", "7-Day Training Plan",
    "Velocity Foam Plate Breakdown", "Athletes on Their Gear", "Science of Recovery",
    "Customer Story: Marathon PR",
  ],
  bofu: [
    "Limited Edition Drop", "48-Hour Flash Sale", "Bundle & Save This Summer",
    "New Arrivals: Shop Now", "Exclusive Member Access", "Last Chance: Summer",
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function pad2(n: number) { return String(n).padStart(2, "0"); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function buildGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function balanceFunnel(key: FunnelKey, newVal: number, cur: FunnelMix): FunnelMix {
  const v = Math.max(0, Math.min(100, newVal));
  const rest = FUNNEL_KEYS.filter(k => k !== key);
  const remaining = 100 - v;
  const otherSum = rest.reduce((s, k) => s + cur[k], 0);
  const result = { ...cur, [key]: v } as FunnelMix;
  if (otherSum === 0) {
    const half = Math.floor(remaining / 2);
    result[rest[0]] = half;
    result[rest[1]] = remaining - half;
  } else {
    let assigned = 0;
    for (let i = 0; i < rest.length - 1; i++) {
      const share = Math.round(remaining * cur[rest[i]] / otherSum);
      result[rest[i]] = share;
      assigned += share;
    }
    result[rest[rest.length - 1]] = remaining - assigned;
  }
  return result;
}

function balanceTypePct(changedId: ContentTypeId, newPct: number, cur: ContentTypeMix): ContentTypeMix {
  const v = Math.max(0, Math.min(100, newPct));
  const others = TYPE_IDS.filter(id => id !== changedId && cur[id].enabled);
  if (others.length === 0) return { ...cur, [changedId]: { ...cur[changedId], pct: 100 } };
  const remaining = 100 - v;
  const otherSum = others.reduce((s, id) => s + cur[id].pct, 0);
  const result = { ...cur, [changedId]: { ...cur[changedId], pct: v } };
  if (otherSum === 0) {
    const each = Math.floor(remaining / others.length);
    others.forEach((id, i) => {
      result[id] = { ...result[id], pct: i === others.length - 1 ? remaining - each * (others.length - 1) : each };
    });
  } else {
    let assigned = 0;
    for (let i = 0; i < others.length - 1; i++) {
      const share = Math.round(remaining * cur[others[i]].pct / otherSum);
      result[others[i]] = { ...result[others[i]], pct: share };
      assigned += share;
    }
    result[others[others.length - 1]] = { ...result[others[others.length - 1]], pct: remaining - assigned };
  }
  return result;
}

function toggleType(id: ContentTypeId, cur: ContentTypeMix): ContentTypeMix {
  const enabling = !cur[id].enabled;
  const result = { ...cur, [id]: { ...cur[id], enabled: enabling } };
  if (!enabling) {
    const freed = cur[id].pct;
    const others = TYPE_IDS.filter(tid => tid !== id && result[tid].enabled);
    result[id] = { enabled: false, pct: 0 };
    if (others.length === 0) return result;
    const otherSum = others.reduce((s, tid) => s + result[tid].pct, 0);
    let dist = 0;
    if (otherSum === 0) {
      const each = Math.floor(freed / others.length);
      others.forEach((tid, i) => { result[tid] = { ...result[tid], pct: each + (i === others.length - 1 ? freed - each * others.length : 0) }; });
    } else {
      for (let i = 0; i < others.length - 1; i++) {
        const extra = Math.round(freed * result[others[i]].pct / otherSum);
        result[others[i]] = { ...result[others[i]], pct: result[others[i]].pct + extra };
        dist += extra;
      }
      const last = others[others.length - 1];
      result[last] = { ...result[last], pct: result[last].pct + freed - dist };
    }
    return result;
  } else {
    const defaultPct = 15;
    result[id] = { enabled: true, pct: defaultPct };
    const enabledAll = TYPE_IDS.filter(tid => result[tid].enabled);
    const total = enabledAll.reduce((s, tid) => s + result[tid].pct, 0);
    enabledAll.forEach(tid => { result[tid] = { ...result[tid], pct: Math.round(result[tid].pct * 100 / total) }; });
    const finalTotal = enabledAll.reduce((s, tid) => s + result[tid].pct, 0);
    if (finalTotal !== 100) {
      const adj = enabledAll.find(tid => tid !== id);
      if (adj) result[adj] = { ...result[adj], pct: result[adj].pct + (100 - finalTotal) };
    }
    return result;
  }
}

function generateBrief(type: ContentTypeId, topic: string, funnelStage: FunnelKey): string {
  const aud = funnelStage === "tofu" ? "broad awareness audience" : funnelStage === "mofu" ? "consideration-stage audience" : "purchase-ready audience";
  switch (type) {
    case "blog-post":   return `~1,100-word article on "${topic}" for ${aud}. Opens with a performance-backed hook, covers 3 key sections (core concept, supporting data, actionable takeaway), closes with a CTA to explore the collection.`;
    case "social-post": return `Instagram/TikTok caption for "${topic}". Visual: athlete in motion with featured product in a high-energy setting. Copy: 1 hook line + 2-sentence message + punchy CTA. 4–5 branded hashtags.`;
    case "carousel":    return `5-slide carousel on "${topic}". Slide 1: bold title card. Slides 2–4: step-by-step breakdown with iconography. Slide 5: swipe-to-shop CTA. ~45 words per slide, bold display type.`;
    case "video-clip":  return `~30s script for "${topic}". Hook (0:00–0:05): product/athlete reveal. Story (0:05–0:22): core message with b-roll direction. Brand moment (0:22–0:28). CTA (0:28–0:30): drive to site or app.`;
  }
}

function generateItems(config: CampaignConfig, startDate: Date): PlannedItem[] {
  const totalDays = config.durationUnit === "weeks"
    ? config.durationValue * 7
    : config.durationValue * 30;
  const totalItems = config.volumeUnit === "per-day"
    ? totalDays * config.volumeValue
    : Math.round((totalDays / 7) * config.volumeValue);
  if (totalItems <= 0) return [];

  const dates: Date[] = [];
  if (totalItems === 1) {
    dates.push(new Date(startDate));
  } else {
    const step = (totalDays - 1) / (totalItems - 1);
    for (let i = 0; i < totalItems; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + Math.round(i * step));
      dates.push(d);
    }
  }

  const enabledTypes = TYPE_IDS.filter(id => config.contentTypeMix[id].enabled);
  const totalTypePct = enabledTypes.reduce((s, id) => s + config.contentTypeMix[id].pct, 0) || 1;
  let typeCum = 0;
  const typeDist = enabledTypes.map(id => {
    typeCum += config.contentTypeMix[id].pct / totalTypePct;
    return { id, upper: typeCum };
  });

  const funnelDist = [
    { key: "tofu" as FunnelKey, upper: config.funnelMix.tofu / 100 },
    { key: "mofu" as FunnelKey, upper: (config.funnelMix.tofu + config.funnelMix.mofu) / 100 },
    { key: "bofu" as FunnelKey, upper: 1 },
  ];

  const phi = 0.618034;
  return dates.map((date, i) => {
    const t = (i * phi) % 1;
    const f = (i * (1 - phi)) % 1;
    const type = (typeDist.find(e => t <= e.upper) ?? typeDist[typeDist.length - 1])?.id ?? "blog-post";
    const funnelStage = (funnelDist.find(e => f <= e.upper) ?? funnelDist[funnelDist.length - 1])?.key ?? "tofu";
    const pool = TOPICS[funnelStage];
    const topic = pool[i % pool.length];
    return { id: i + 1, date, dateStr: toDateStr(date), type, funnelStage, topic, brief: generateBrief(type, topic, funnelStage) };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProjectDefaultTag() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-[3px] rounded bg-[#4B56F2]/[0.08] text-[#818CFF]/90 border border-[#4B56F2]/[0.15]">
      <span className="w-1 h-1 rounded-full bg-[#818CFF] inline-block flex-shrink-0" />
      Project Default
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-3">
      {children}
    </div>
  );
}

function StackedBar({ segments }: { segments: Array<{ pct: number; color: string }> }) {
  const total = segments.reduce((s, seg) => s + seg.pct, 0);
  return (
    <div className="h-2 rounded-full overflow-hidden flex gap-px bg-secondary">
      {total === 0 ? (
        <div className="flex-1 bg-secondary rounded-full" />
      ) : (
        segments.filter(s => s.pct > 0).map((seg, i) => (
          <div
            key={i}
            className="h-full transition-all duration-200 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(seg.pct / total) * 100}%`, backgroundColor: seg.color }}
          />
        ))
      )}
    </div>
  );
}

function NumberInput({
  value, onChange, min = 0, max = 999, className = "",
}: { value: number; onChange: (v: number) => void; min?: number; max?: number; className?: string }) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        const v = parseInt(e.target.value);
        if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
      }}
      className={clsx(
        "bg-secondary border border-border rounded-lg text-sm text-foreground text-center tabular-nums",
        "focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all",
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
    />
  );
}

// ─── Calendar Preview (right panel) ──────────────────────────────────────────

function CalendarPreview({
  items, startDate, totalDays, config,
}: { items: PlannedItem[]; startDate: Date; totalDays: number; config: CampaignConfig }) {
  const [calYear, setCalYear] = useState(startDate.getFullYear());
  const [calMonth, setCalMonth] = useState(startDate.getMonth());

  const endDate = useMemo(() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + totalDays);
    return d;
  }, [startDate, totalDays]);

  const byDate = useMemo(() => {
    const map: Record<string, PlannedItem[]> = {};
    for (const item of items) (map[item.dateStr] ??= []).push(item);
    return map;
  }, [items]);

  const grid = useMemo(() => buildGrid(calYear, calMonth), [calYear, calMonth]);
  const todayStr = toDateStr(new Date());

  const typeCounts = useMemo(() => {
    const counts: Record<ContentTypeId, number> = { "blog-post": 0, "social-post": 0, "carousel": 0, "video-clip": 0 };
    for (const item of items) counts[item.type]++;
    return counts;
  }, [items]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Total items", value: items.length },
          { label: "Duration", value: `${config.durationValue} ${config.durationUnit}` },
          { label: "Avg/week", value: config.volumeUnit === "per-week" ? `${config.volumeValue}/wk` : `${config.volumeValue * 7}/wk` },
          { label: "Start date", value: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-secondary/40 border border-border p-2.5 text-center">
            <div className="text-[8px] text-muted-foreground/50 uppercase tracking-widest font-bold mb-0.5">{label}</div>
            <div className="text-xs font-bold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button onClick={prevMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="flex-1 text-center text-xs font-semibold text-foreground">
            {MONTH_NAMES[calMonth]} {calYear}
          </span>
          <button onClick={nextMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[9px] font-bold text-muted-foreground/40 uppercase">{d[0]}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {grid.map((day, idx) => {
            if (day === null) return <div key={`pad-${idx}`} className="h-12" />;
            const ds = `${calYear}-${pad2(calMonth+1)}-${pad2(day)}`;
            const dayItems = byDate[ds] ?? [];
            const isToday = ds === todayStr;
            const date = new Date(calYear, calMonth, day);
            const inRange = date >= startDate && date < endDate;
            return (
              <div
                key={ds}
                className={clsx(
                  "h-12 rounded-lg p-0.5 flex flex-col transition-colors",
                  inRange && dayItems.length > 0 ? "bg-white/[0.025]" : inRange ? "bg-white/[0.01]" : "",
                  isToday && "ring-1 ring-primary/30"
                )}
              >
                <span className={clsx(
                  "text-[9px] text-right leading-none mb-0.5 self-end",
                  isToday ? "text-primary font-bold" : inRange ? "text-muted-foreground/70" : "text-muted-foreground/25"
                )}>
                  {day}
                </span>
                <div className="flex flex-wrap gap-px items-start">
                  {dayItems.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: TYPE_CFG[item.type].color }}
                    />
                  ))}
                  {dayItems.length > 4 && (
                    <span className="text-[7px] text-muted-foreground/50 leading-none">+{dayItems.length - 4}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type breakdown */}
      <div>
        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Content breakdown</div>
        <div className="space-y-1.5">
          {TYPE_IDS.filter(id => typeCounts[id] > 0).map(id => {
            const { label, Icon, color } = TYPE_CFG[id];
            const pct = items.length > 0 ? Math.round((typeCounts[id] / items.length) * 100) : 0;
            return (
              <div key={id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="w-2 h-2" style={{ color }} />
                </div>
                <span className="flex-1 text-[10px] text-muted-foreground truncate">{label}</span>
                <span className="text-[10px] font-bold tabular-nums" style={{ color }}>{typeCounts[id]}</span>
                <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Preview list (step 2) ────────────────────────────────────────────────────

function PreviewList({ items }: { items: PlannedItem[] }) {
  const weeks = useMemo(() => {
    const grouped: Array<{ label: string; start: Date; end: Date; items: PlannedItem[] }> = [];
    if (items.length === 0) return grouped;

    const startDate = items[0].date;
    const endDate = items[items.length - 1].date;
    const totalWeeks = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1;

    for (let w = 0; w < Math.max(totalWeeks, 1); w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + w * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekItems = items.filter(item => {
        return item.date >= weekStart && item.date <= weekEnd;
      });

      if (weekItems.length > 0) {
        const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        grouped.push({
          label: `Week ${w + 1}  ·  ${fmt(weekStart)} – ${fmt(weekEnd)}`,
          start: weekStart,
          end: weekEnd,
          items: weekItems,
        });
      }
    }
    return grouped;
  }, [items]);

  return (
    <div className="space-y-6">
      {weeks.map((week, wi) => (
        <div key={wi}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-foreground">{week.label}</span>
            <span className="text-[10px] text-muted-foreground/50">{week.items.length} item{week.items.length !== 1 ? "s" : ""}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="space-y-2">
            {week.items.map(item => {
              const { label: typeLabel, Icon, color } = TYPE_CFG[item.type];
              const { short: funnelShort, color: funnelColor } = FUNNEL_CFG[item.funnelStage];
              const dateFormatted = item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-border bg-card/40 hover:bg-card/70 transition-colors group">
                  {/* Date column */}
                  <div className="w-20 flex-shrink-0 pt-0.5">
                    <div className="text-[10px] text-muted-foreground/60 leading-none">{dateFormatted}</div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-start gap-1.5 pt-0.5 flex-shrink-0 w-48">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
                      style={{ color, backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                      {typeLabel}
                    </span>
                    <span
                      className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap"
                      style={{ color: funnelColor, backgroundColor: `${funnelColor}12` }}
                    >
                      {funnelShort}
                    </span>
                  </div>

                  {/* Topic + brief */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground mb-0.5 truncate">{item.topic}</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{item.brief}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateCampaignPage({ onBack, onComplete }: CreateCampaignPageProps) {
  const [step, setStep] = useState<"configure" | "preview">("configure");
  const [hasViewedPreview, setHasViewedPreview] = useState(false);
  const [config, setConfig] = useState<CampaignConfig>(INITIAL_CONFIG);

  const startDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const totalDays = useMemo(() => (
    config.durationUnit === "weeks" ? config.durationValue * 7 : config.durationValue * 30
  ), [config.durationValue, config.durationUnit]);

  const items = useMemo(() => generateItems(config, startDate), [config, startDate]);

  const upd = useCallback(<K extends keyof CampaignConfig>(key: K, value: CampaignConfig[K]) => {
    setConfig(c => ({ ...c, [key]: value }));
  }, []);

  const handleFunnelChange = useCallback((key: FunnelKey, val: number) => {
    setConfig(c => ({ ...c, funnelMix: balanceFunnel(key, val, c.funnelMix) }));
  }, []);

  const handleTypePctChange = useCallback((id: ContentTypeId, pct: number) => {
    setConfig(c => ({ ...c, contentTypeMix: balanceTypePct(id, pct, c.contentTypeMix) }));
  }, []);

  const handleTypeToggle = useCallback((id: ContentTypeId) => {
    setConfig(c => ({ ...c, contentTypeMix: toggleType(id, c.contentTypeMix) }));
  }, []);

  const handlePreview = () => {
    setStep("preview");
    setHasViewedPreview(true);
  };

  const canCreate = hasViewedPreview && config.name.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background min-w-0">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border flex-shrink-0 bg-card/40">
        <button
          onClick={step === "preview" ? () => setStep("configure") : onBack}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Editable campaign name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-5 h-5 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-3 h-3 text-primary" />
          </div>
          <input
            type="text"
            value={config.name}
            onChange={(e) => upd("name", e.target.value)}
            placeholder="Campaign name..."
            className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
          {!config.name && (
            <span className="text-[10px] text-red-400/60 flex-shrink-0">Required</span>
          )}
        </div>

        <div className="h-4 w-px bg-border flex-shrink-0" />

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(["configure", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={clsx(
                "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold",
                step === s ? "bg-primary text-primary-foreground" :
                s === "preview" && step === "configure" ? "bg-secondary text-muted-foreground/40" :
                "bg-primary/30 text-primary"
              )}>
                {step === "preview" && s === "configure" ? <Check className="w-2.5 h-2.5" /> : i + 1}
              </div>
              <span className={clsx(
                "text-[10px] capitalize hidden sm:block",
                step === s ? "text-foreground font-medium" : "text-muted-foreground/40"
              )}>{s}</span>
              {i === 0 && <span className="text-border mx-1 text-xs select-none hidden sm:block">→</span>}
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {step === "configure" && (
          <button
            onClick={handlePreview}
            disabled={!config.name.trim()}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0",
              config.name.trim()
                ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15"
                : "bg-secondary text-muted-foreground/40 cursor-not-allowed border border-border"
            )}
          >
            Preview Campaign
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {step === "preview" && (
          <button
            onClick={() => onComplete({ ...config, items })}
            disabled={!canCreate}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0",
              canCreate
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_4px_rgba(75,86,242,0.1)]"
                : "bg-secondary text-muted-foreground/40 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Create Campaign
          </button>
        )}
      </div>

      {/* ── Configure step ── */}
      {step === "configure" && (
        <div className="flex-1 overflow-hidden flex min-h-0">

          {/* Left: Form */}
          <div className="flex-1 overflow-y-auto p-5 min-w-0" style={{ maxWidth: 540 }}>
            <div className="space-y-6">

              {/* Campaign Details */}
              <section>
                <SectionHeader>Campaign Details</SectionHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">Description</label>
                    <textarea
                      value={config.description}
                      onChange={(e) => upd("description", e.target.value)}
                      placeholder="What is this campaign about? What's the goal?"
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Duration & Volume */}
              <section>
                <SectionHeader>Duration & Volume</SectionHeader>
                <div className="space-y-4">
                  {/* Duration row */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-foreground w-20 flex-shrink-0">Duration</label>
                    <NumberInput
                      value={config.durationValue}
                      onChange={(v) => upd("durationValue", v)}
                      min={1}
                      max={52}
                      className="w-16 px-2 py-2"
                    />
                    <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-px">
                      {(["weeks", "months"] as DurationUnit[]).map(u => (
                        <button
                          key={u}
                          onClick={() => upd("durationUnit", u)}
                          className={clsx(
                            "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                            config.durationUnit === u
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      = {totalDays} days
                    </span>
                  </div>

                  {/* Volume row */}
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-foreground w-20 flex-shrink-0">Volume</label>
                    <NumberInput
                      value={config.volumeValue}
                      onChange={(v) => upd("volumeValue", v)}
                      min={1}
                      max={config.volumeUnit === "per-day" ? 10 : 14}
                      className="w-16 px-2 py-2"
                    />
                    <div className="flex items-center bg-secondary rounded-lg p-0.5 gap-px">
                      {(["per-week", "per-day"] as VolumeUnit[]).map(u => (
                        <button
                          key={u}
                          onClick={() => upd("volumeUnit", u)}
                          className={clsx(
                            "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                            config.volumeUnit === u
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {u === "per-week" ? "/week" : "/day"}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      = {items.length} total items
                    </span>
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Funnel Stage Mix */}
              <section>
                <SectionHeader>Funnel Stage Mix</SectionHeader>
                <div className="space-y-3">
                  <StackedBar segments={FUNNEL_KEYS.map(k => ({ pct: config.funnelMix[k], color: FUNNEL_CFG[k].color }))} />
                  <div className="space-y-2">
                    {FUNNEL_KEYS.map(key => {
                      const { label, color } = FUNNEL_CFG[key];
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="text-xs text-foreground flex-1">{label}</span>
                          <div className="flex items-center gap-1">
                            <NumberInput
                              value={config.funnelMix[key]}
                              onChange={(v) => handleFunnelChange(key, v)}
                              min={0}
                              max={100}
                              className="w-14 px-1.5 py-1.5 text-xs"
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                            <div
                              className="h-full rounded-full transition-all duration-200"
                              style={{ width: `${config.funnelMix[key]}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <span className={clsx(
                      "text-[10px] font-bold tabular-nums",
                      Math.abs(FUNNEL_KEYS.reduce((s, k) => s + config.funnelMix[k], 0) - 100) < 2
                        ? "text-muted-foreground/40"
                        : "text-red-400"
                    )}>
                      Total: {FUNNEL_KEYS.reduce((s, k) => s + config.funnelMix[k], 0)}%
                    </span>
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Content Type Mix */}
              <section>
                <SectionHeader>Content Type Mix</SectionHeader>
                <div className="space-y-3">
                  <StackedBar
                    segments={TYPE_IDS.filter(id => config.contentTypeMix[id].enabled).map(id => ({
                      pct: config.contentTypeMix[id].pct,
                      color: TYPE_CFG[id].color,
                    }))}
                  />
                  <div className="space-y-2">
                    {TYPE_IDS.map(id => {
                      const { label, Icon, color } = TYPE_CFG[id];
                      const entry = config.contentTypeMix[id];
                      const itemCount = items.filter(i => i.type === id).length;
                      return (
                        <div key={id} className={clsx("flex items-center gap-2.5 transition-opacity", !entry.enabled && "opacity-40")}>
                          <button
                            onClick={() => handleTypeToggle(id)}
                            className={clsx(
                              "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all",
                              entry.enabled
                                ? "border-transparent"
                                : "border-border bg-secondary"
                            )}
                            style={entry.enabled ? { backgroundColor: `${color}25`, borderColor: `${color}50` } : {}}
                          >
                            {entry.enabled && <Check className="w-2.5 h-2.5" style={{ color }} />}
                          </button>
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon className="w-3 h-3" style={{ color }} />
                          </div>
                          <span className="text-xs text-foreground flex-1">{label}</span>
                          {entry.enabled && (
                            <div className="flex items-center gap-1">
                              <NumberInput
                                value={entry.pct}
                                onChange={(v) => handleTypePctChange(id, v)}
                                min={0}
                                max={100}
                                className="w-14 px-1.5 py-1.5 text-xs"
                              />
                              <span className="text-xs text-muted-foreground">%</span>
                            </div>
                          )}
                          <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                            {entry.enabled && (
                              <div
                                className="h-full rounded-full transition-all duration-200"
                                style={{ width: `${entry.pct}%`, backgroundColor: color }}
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/50 tabular-nums w-10 text-right flex-shrink-0">
                            {entry.enabled ? `${itemCount} items` : "off"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              {/* Campaign Defaults */}
              <section>
                <SectionHeader>Campaign Defaults</SectionHeader>
                <div className="space-y-3.5">
                  {[
                    {
                      key: "writerProfile" as const,
                      label: "Writer Profile",
                      Icon: User,
                      isDefault: config.writerProfile === PROJECT_DEFAULTS.writerProfile,
                      multiline: false,
                    },
                    {
                      key: "brandGuidelines" as const,
                      label: "Brand Guidelines",
                      Icon: Paintbrush,
                      isDefault: config.brandGuidelines === PROJECT_DEFAULTS.brandGuidelines,
                      multiline: true,
                    },
                    {
                      key: "themes" as const,
                      label: "Themes / Topics",
                      Icon: BookOpen,
                      isDefault: config.themes === PROJECT_DEFAULTS.themes,
                      multiline: false,
                    },
                    {
                      key: "resources" as const,
                      label: "Resources",
                      Icon: AlignLeft,
                      isDefault: config.resources === PROJECT_DEFAULTS.resources,
                      multiline: false,
                    },
                  ].map(({ key, label, Icon, isDefault, multiline }) => (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs font-semibold text-foreground">{label}</span>
                        {isDefault && <ProjectDefaultTag />}
                      </div>
                      {multiline ? (
                        <textarea
                          value={config[key]}
                          onChange={(e) => upd(key, e.target.value)}
                          rows={2}
                          className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none leading-relaxed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={config[key]}
                          onChange={(e) => upd(key, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Bottom padding */}
              <div className="h-4" />
            </div>
          </div>

          {/* Right: Calendar preview */}
          <div className="w-72 border-l border-border overflow-y-auto flex-shrink-0 bg-card/10">
            <div className="sticky top-0 px-4 py-3 border-b border-border bg-card/20">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Live Preview</span>
            </div>
            <div className="p-4">
              <CalendarPreview
                items={items}
                startDate={startDate}
                totalDays={totalDays}
                config={config}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Preview step ── */}
      {step === "preview" && (
        <div className="flex-1 overflow-y-auto px-5 py-6">

            {/* Preview header */}
            <div className="flex items-start gap-4 mb-6 pb-5 border-b border-border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-foreground truncate">{config.name}</h2>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex-shrink-0">
                    {items.length} items
                  </span>
                </div>
                {config.description && (
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                )}
              </div>

              {/* Summary chips */}
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                {[
                  { label: `${config.durationValue} ${config.durationUnit}`, color: "text-foreground" },
                  { label: `${config.volumeValue} ${config.volumeUnit === "per-week" ? "/wk" : "/day"}`, color: "text-foreground" },
                ].map(({ label, color }) => (
                  <span key={label} className={clsx("text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary border border-border", color)}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mix summary bars */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Funnel Mix</div>
                <StackedBar segments={FUNNEL_KEYS.map(k => ({ pct: config.funnelMix[k], color: FUNNEL_CFG[k].color }))} />
                <div className="flex gap-3 mt-1.5">
                  {FUNNEL_KEYS.map(k => (
                    <div key={k} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: FUNNEL_CFG[k].color }} />
                      <span className="text-[9px] text-muted-foreground/60">{config.funnelMix[k]}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Content Mix</div>
                <StackedBar segments={TYPE_IDS.filter(id => config.contentTypeMix[id].enabled).map(id => ({ pct: config.contentTypeMix[id].pct, color: TYPE_CFG[id].color }))} />
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {TYPE_IDS.filter(id => config.contentTypeMix[id].enabled).map(id => (
                    <div key={id} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_CFG[id].color }} />
                      <span className="text-[9px] text-muted-foreground/60">{config.contentTypeMix[id].pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <PreviewList items={items} />

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {items.length} items will be generated when you click Create Campaign. Nothing is generated until then.
              </p>
              <button
                onClick={() => onComplete({ ...config, items })}
                disabled={!canCreate}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  canCreate
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_6px_rgba(75,86,242,0.08)]"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                <Sparkles className="w-4 h-4" />
                Create Campaign
                <span className="text-[10px] font-normal opacity-70 ml-0.5">· {items.length} items</span>
              </button>
            </div>
        </div>
      )}
    </div>
  );
}

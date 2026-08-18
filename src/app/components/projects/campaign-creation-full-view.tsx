import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  X, Upload, Link as LinkIcon, FileText, Video, ImageIcon, LayoutGrid,
  Check, Flag, ChevronDown, ChevronUp,
  Calendar, Target, ArrowLeft, Quote, Scissors, Star,
  Wand2, Plus, Minus, Lightbulb, Users, ShoppingCart,
  AlertCircle, Zap, Layers, Cloud, Archive, HardDrive,
  MessageCircle, Music2, Share2, Play,
} from "lucide-react";
import { clsx } from "clsx";

// Social platforms
type SocialPlatformId = "wechat" | "xiaohongshu" | "douyin" | "weibo" | "bilibili";

interface SocialPlatform {
  id: SocialPlatformId;
  label: string;
  color: string;
  Icon: React.ElementType;
}

const PLATFORM_ICON_STYLE = {
  wechat: { color: "#07C160", Icon: MessageCircle },
  xiaohongshu: { color: "#FF2442", Icon: LayoutGrid },
  douyin: { color: "#010101", Icon: Music2 },
  weibo: { color: "#E6162D", Icon: Share2 },
  bilibili: { color: "#00A1D6", Icon: Play },
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "wechat", label: "WeChat", color: "#07C160", Icon: PLATFORM_ICON_STYLE.wechat.Icon },
  { id: "xiaohongshu", label: "Xiaohongshu", color: "#FF2442", Icon: PLATFORM_ICON_STYLE.xiaohongshu.Icon },
  { id: "douyin", label: "Douyin", color: "#010101", Icon: PLATFORM_ICON_STYLE.douyin.Icon },
  { id: "weibo", label: "Weibo", color: "#E6162D", Icon: PLATFORM_ICON_STYLE.weibo.Icon },
  { id: "bilibili", label: "Bilibili", color: "#00A1D6", Icon: PLATFORM_ICON_STYLE.bilibili.Icon },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentTypeId = "blog-post" | "social-post" | "short-clip" | "highlight-reel" | "quote-card" | "ai-video" | "carousel";
type FunnelStage = "awareness" | "consideration" | "conversion";

interface ContentTypeDef {
  id: ContentTypeId;
  label: string;
  sublabel: string;
  description: string;
  Icon: React.ElementType;
  color: string;
  credits: number;
  hasPlatforms: boolean;
}

interface ScheduledItem {
  id: number;
  date: string;
  typeId: ContentTypeId;
  topic: string;
  funnelStage?: FunnelStage;
  platform?: SocialPlatformId;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTENT_TYPES: ContentTypeDef[] = [
  { id: "blog-post", label: "Long Form", sublabel: "Article / Blog Post", description: "In-depth article or recap", Icon: FileText, color: "#4B56F2", credits: 20, hasPlatforms: false },
  { id: "short-clip", label: "Short Clip", sublabel: "Short Video", description: "8s per clip · Extracts & re-edits", Icon: Scissors, color: "#60A5FA", credits: 15, hasPlatforms: true },
  { id: "highlight-reel", label: "Highlight Reel", sublabel: "Compilation", description: "60–90s compilation, auto-curated", Icon: Star, color: "#F59E0B", credits: 25, hasPlatforms: true },
  { id: "quote-card", label: "Quote Card", sublabel: "Graphic", description: "Minimal Dark", Icon: Quote, color: "#A78BFA", credits: 8, hasPlatforms: true },
  { id: "ai-video", label: "Text to AI Video", sublabel: "AI Video", description: "AI-generated from topic & guidelines", Icon: Wand2, color: "#EC4899", credits: 30, hasPlatforms: true },
  { id: "social-post", label: "Social Post", sublabel: "Text + Image", description: "Text and image posts", Icon: ImageIcon, color: "#06B6D4", credits: 5, hasPlatforms: true },
  { id: "carousel", label: "Carousel", sublabel: "Carousel", description: "Multi-slide swipeable posts", Icon: LayoutGrid, color: "#8B5CF6", credits: 12, hasPlatforms: true },
];

const FUNNEL_STAGES = [
  {
    id: "awareness" as FunnelStage,
    label: "Awareness",
    sublabel: "Top of Funnel",
    color: "#3B82F6",
    Icon: Lightbulb,
  },
  {
    id: "consideration" as FunnelStage,
    label: "Consideration",
    sublabel: "Middle of Funnel",
    color: "#F59E0B",
    Icon: Users,
  },
  {
    id: "conversion" as FunnelStage,
    label: "Conversion",
    sublabel: "Bottom of Funnel",
    color: "#4B56F2",
    Icon: ShoppingCart,
  },
];

const PROJECT_LIBRARY = [
  { id: "brand-logo", name: "Brand Logo Pack.zip", size: "2.4 MB", type: "zip" },
  { id: "summer-video", name: "Summer Campaign Video.mp4", size: "124 MB", type: "mp4" },
  { id: "product-photo", name: "Product Photography.pdf", size: "8.1 MB", type: "pdf" },
  { id: "brand-guide", name: "Brand Guidelines 2026.pdf", size: "3.2 MB", type: "pdf" },
  { id: "athlete-footage", name: "Athlete Footage Raw.mp4", size: "890 MB", type: "mp4" },
  { id: "campaign-brief", name: "Campaign Brief Q3.docx", size: "540 KB", type: "docx" },
];

const DRIVE_FILES = [
  { id: "d1", name: "Product Photoshoot Q3.zip", type: "zip", size: "312 MB", modified: "Aug 12" },
  { id: "d2", name: "Brand Voice & Tone Guide.pdf", type: "pdf", size: "4.8 MB", modified: "Jul 28" },
  { id: "d3", name: "Interview with Olympic Athlete.m4a", type: "audio", size: "86 MB", modified: "Aug 15" },
  { id: "d4", name: "Competitor Social Audit.xlsx", type: "sheet", size: "2.1 MB", modified: "Aug 03" },
  { id: "d5", name: "Customer Research Notes.gdoc", type: "doc", size: "Shared", modified: "Aug 01" },
];

const DROPBOX_FILES = [
  { id: "db1", name: "Brand Video Cut_03_Compressed.mp4", type: "video", size: "254 MB", modified: "Aug 10" },
  { id: "db2", name: "Hero Images _ Hero Shots.zip", type: "zip", size: "610 MB", modified: "Aug 09" },
  { id: "db3", name: "Team_Bio_Sheets.docx", type: "doc", size: "1.9 MB", modified: "Jul 26" },
  { id: "db4", name: "Athlete Consent Forms _ Signed.pdf", type: "pdf", size: "15 MB", modified: "Jul 20" },
];

type LibrarySource = "library" | "device" | "google-drive" | "dropbox";

const PROJECT_TOPICS = [
  "Performance Innovation",
  "Athlete Stories",
  "Training Tips",
  "Product Launches",
];

const STEP_CONFIG = [
  { id: 1, label: "Campaign Details" },
  { id: 2, label: "Source Material" },
  { id: 3, label: "Content Type Mix" },
  { id: 4, label: "Funnel Stage" },
  { id: 5, label: "Topics" },
  { id: 6, label: "Review" },
];

// ─── Previous Campaign Templates (for Duplicate Existing) ─────────────────────

export interface PreviousCampaign {
  id: string;
  name: string;
  description: string;
  color: string;
  dateRange: string;
  contentTypeCounts: Record<ContentTypeId, number>;
  funnelPct: { awareness: number; consideration: number; conversion: number };
  topics: string[];
  durationValue: string;
  durationUnit: "days" | "weeks" | "months";
}

export const PREVIOUS_CAMPAIGNS: PreviousCampaign[] = [
  {
    id: "velocity-summer",
    name: "Velocity Summer Launch",
    description: "High-energy summer product launch with athlete stories and training content",
    color: "#F97316",
    dateRange: "Jun 1 – Jun 28, 2026",
    contentTypeCounts: { "blog-post": 2, "short-clip": 6, "highlight-reel": 2, "quote-card": 3, "social-post": 5, "ai-video": 1 },
    funnelPct: { awareness: 50, consideration: 30, conversion: 20 },
    topics: ["Performance Innovation", "Athlete Stories", "Product Launches"],
    durationValue: "4",
    durationUnit: "weeks",
  },
  {
    id: "brand-awareness-q1",
    name: "Brand Awareness Q1",
    description: "Top-of-funnel brand building campaign focused on education and community",
    color: "#8B5CF6",
    dateRange: "Jan 6 – Feb 2, 2026",
    contentTypeCounts: { "blog-post": 4, "short-clip": 3, "highlight-reel": 1, "quote-card": 4, "social-post": 6, "ai-video": 0 },
    funnelPct: { awareness: 70, consideration: 20, conversion: 10 },
    topics: ["Performance Innovation", "Training Tips", "Community Engagement"],
    durationValue: "4",
    durationUnit: "weeks",
  },
  {
    id: "product-demo-series",
    name: "Product Demo Series",
    description: "Mid-funnel consideration campaign featuring product walkthroughs and comparisons",
    color: "#06B6D4",
    dateRange: "Mar 2 – Mar 29, 2026",
    contentTypeCounts: { "blog-post": 3, "short-clip": 4, "highlight-reel": 2, "quote-card": 2, "social-post": 4, "ai-video": 2 },
    funnelPct: { awareness: 30, consideration: 50, conversion: 20 },
    topics: ["Product Launches", "Training Tips"],
    durationValue: "4",
    durationUnit: "weeks",
  },
  {
    id: "conversion-sprint",
    name: "Q2 Conversion Sprint",
    description: "Bottom-of-funnel campaign driving sign-ups with offers and social proof",
    color: "#4B56F2",
    dateRange: "Apr 1 – Apr 14, 2026",
    contentTypeCounts: { "blog-post": 1, "short-clip": 5, "highlight-reel": 1, "quote-card": 3, "social-post": 7, "ai-video": 1 },
    funnelPct: { awareness: 20, consideration: 30, conversion: 50 },
    topics: ["Athlete Stories", "Product Launches"],
    durationValue: "2",
    durationUnit: "weeks",
  },
  {
    id: "wellness-monthly",
    name: "Wellness Brand Monthly",
    description: "Ongoing wellness and lifestyle content with sustainability messaging",
    color: "#EC4899",
    dateRange: "May 1 – May 31, 2026",
    contentTypeCounts: { "blog-post": 3, "short-clip": 4, "highlight-reel": 1, "quote-card": 5, "social-post": 8, "ai-video": 0 },
    funnelPct: { awareness: 55, consideration: 30, conversion: 15 },
    topics: ["Performance Innovation", "Athlete Stories", "Training Tips", "Product Launches"],
    durationValue: "1",
    durationUnit: "months",
  },
];

// ─── Mini Donut Chart ─────────────────────────────────────────────────────────

function MiniDonut({ segments, size = 72, thickness = 14 }: {
  segments: { color: string; value: number; label?: string }[];
  size?: number;
  thickness?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const cx = size / 2, cy = size / 2, r = (size - thickness) / 2;
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return null;

  const toXY = (angleDeg: number, radius: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  let cum = 0;
  const paths = segments
    .filter(s => s.value > 0)
    .map((seg, idx) => {
      const startAngle = (cum / total) * 360;
      cum += seg.value;
      const endAngle = (cum / total) * 360;
      const sweep = endAngle - startAngle;
      const midAngle = (startAngle + endAngle) / 2;
      const ri = r - thickness;
      const large = sweep > 180 ? 1 : 0;

      let d: string;
      if (sweep >= 359.99) {
        d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
      } else {
        const s = toXY(startAngle, r), e = toXY(endAngle, r);
        const siI = toXY(startAngle, ri), eiI = toXY(endAngle, ri);
        d = [`M ${s.x} ${s.y}`, `A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`, `L ${eiI.x} ${eiI.y}`, `A ${ri} ${ri} 0 ${large} 0 ${siI.x} ${siI.y}`, 'Z'].join(' ');
      }
      return { color: seg.color, d, idx, label: seg.label, value: seg.value, pct: Math.round((seg.value / total) * 100), midAngle };
    });

  const hoveredSeg = hovered !== null ? paths.find(p => p.idx === hovered) : null;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onMouseLeave={() => { setHovered(null); setTooltipPos(null); }}
      >
        {paths.map((p) => (
          <path
            key={p.idx}
            d={p.d}
            fill={p.color}
            opacity={hovered === null || hovered === p.idx ? 1 : 0.45}
            className="transition-opacity cursor-pointer"
            onMouseEnter={(e) => {
              setHovered(p.idx);
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseMove={(e) => {
              const rect = svgRef.current?.getBoundingClientRect();
              if (rect) setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
          />
        ))}
      </svg>
      {hoveredSeg && tooltipPos && (
        <div
          className="absolute z-50 pointer-events-none px-2.5 py-1.5 rounded-lg bg-popover border border-border shadow-xl text-xs whitespace-nowrap"
          style={{ left: tooltipPos.x + 10, top: tooltipPos.y - 36 }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: hoveredSeg.color }} />
            <span className="font-medium text-foreground">{hoveredSeg.label ?? `Segment ${hoveredSeg.idx + 1}`}</span>
          </div>
          <div className="text-muted-foreground mt-0.5">
            <span className="font-bold text-foreground">{hoveredSeg.pct}%</span> · {hoveredSeg.value} items
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Calendar Grid Component ──────────────────────────────────────────────────

function CalendarGrid({
  startDate,
  endDate,
  scheduledItems,
  onItemEdit
}: {
  startDate: string;
  endDate: string;
  scheduledItems: ScheduledItem[];
  onItemEdit: (itemId: number, updates: { typeId?: ContentTypeId; funnelStage?: FunnelStage }) => void;
}) {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get the first day of the month containing the start date
  const calendarStart = new Date(start.getFullYear(), start.getMonth(), 1);
  // Get the last day of the month containing the end date
  const calendarEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);

  // Build calendar grid including padding days
  const firstDayOfWeek = calendarStart.getDay();
  const calendarDays: (Date | null)[] = [];

  // Add padding days at the start
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add actual days
  for (let d = new Date(calendarStart); d <= calendarEnd; d.setDate(d.getDate() + 1)) {
    calendarDays.push(new Date(d));
  }

  // Group items by date
  const itemsByDate: Record<string, ScheduledItem[]> = {};
  scheduledItems.forEach(item => {
    if (!itemsByDate[item.date]) {
      itemsByDate[item.date] = [];
    }
    itemsByDate[item.date].push(item);
  });

  const isInRange = (date: Date) => {
    return date >= start && date <= end;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const numRows = Math.ceil(calendarDays.length / 7);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-border bg-secondary/50 flex-shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 text-center font-bold text-muted-foreground uppercase tracking-wider" style={{ fontSize: 13 }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid — stretches to fill remaining height */}
        <div className="grid grid-cols-7 flex-1" style={{ gridTemplateRows: `repeat(${numRows}, 1fr)` }}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="border-r border-b border-border bg-muted/[0.025]" />;
          }

          const dateStr = formatDate(day);
          const dayItems = itemsByDate[dateStr] || [];
          const inRange = isInRange(day);
          const today = new Date();
          const isToday = day.getDate() === today.getDate() &&
                         day.getMonth() === today.getMonth() &&
                         day.getFullYear() === today.getFullYear();

          return (
            <div
              key={dateStr}
              className={clsx(
                "border-r border-b border-border p-1.5 flex flex-col min-h-0",
                !inRange && "opacity-40",
                isToday && "bg-primary/[0.08] ring-1 ring-inset ring-primary/30"
              )}
            >
              <div className="flex justify-end mb-1 flex-shrink-0">
                <span
                  className={clsx(
                    "w-6 h-6 flex items-center justify-center rounded-full font-semibold leading-none",
                    isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  )}
                  style={{ fontSize: 13 }}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="flex flex-col gap-1 overflow-hidden flex-1">
                {dayItems.slice(0, 2).map((item) => {
                  const type = CONTENT_TYPES.find(t => t.id === item.typeId);
                  if (!type) return null;
                  const Icon = type.Icon;
                  const stage = FUNNEL_STAGES.find(s => s.id === item.funnelStage);

                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingItemId === item.id) {
                          setEditingItemId(null);
                          setPopoverPosition(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setPopoverPosition({ x: rect.left, y: rect.bottom + 4 });
                          setEditingItemId(item.id);
                        }
                      }}
                      className="w-full flex items-center gap-1 px-1.5 py-1 rounded truncate hover:opacity-80 transition-opacity group"
                      style={{ backgroundColor: `${type.color}1A`, borderLeft: `2px solid ${type.color}` }}
                    >
                      <Icon className="w-3 h-3 flex-shrink-0" style={{ color: type.color }} />
                      <span className="text-foreground font-medium truncate flex-1 text-left" style={{ fontSize: 13 }}>{item.topic}</span>
                      {stage ? (
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} title={stage.label} />
                      ) : (
                        <span className="w-2 h-2 rounded-full flex-shrink-0 border border-dashed border-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" title="Click to assign funnel stage" />
                      )}
                    </button>
                  );
                })}
                {dayItems.length > 2 && (
                  <span className="text-muted-foreground px-1.5" style={{ fontSize: 13 }}>+{dayItems.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Render popover outside calendar grid — fixed positioning so it escapes overflow:hidden */}
      {editingItemId !== null && popoverPosition && (() => {
        const item = scheduledItems.find(i => i.id === editingItemId);
        if (!item) return null;
        const type = CONTENT_TYPES.find(t => t.id === item.typeId);
        if (!type) return null;

        return (
          <div className="fixed inset-0 z-40" onClick={() => {
            setEditingItemId(null);
            setPopoverPosition(null);
          }}>
            <div
              className="fixed bg-card border border-border rounded-lg shadow-2xl p-3 min-w-[240px] z-50"
              style={{
                left: `${popoverPosition.x}px`,
                top: `${popoverPosition.y}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                {/* Content Type Selector */}
                <div>
                  <div className="text-xs font-bold text-foreground mb-2">Content Type</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CONTENT_TYPES.map((ct) => {
                      const CTIcon = ct.Icon;
                      const isSelected = ct.id === item.typeId;
                      return (
                        <button
                          key={ct.id}
                          onClick={() => {
                            onItemEdit(item.id, { typeId: ct.id });
                            setEditingItemId(null);
                            setPopoverPosition(null);
                          }}
                          className={clsx(
                            "flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] font-medium transition-all border",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <CTIcon className="w-3 h-3" style={{ color: ct.color }} />
                          <span className="truncate">{ct.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Funnel Stage Selector */}
                <div>
                  <div className="text-xs font-bold text-foreground mb-2">Funnel Stage</div>
                  <div className="space-y-1">
                    {FUNNEL_STAGES.map((stage) => {
                      const StageIcon = stage.Icon;
                      const isSelected = stage.id === item.funnelStage;
                      return (
                        <button
                          key={stage.id}
                          onClick={() => {
                            onItemEdit(item.id, { funnelStage: stage.id });
                            setEditingItemId(null);
                            setPopoverPosition(null);
                          }}
                          className={clsx(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-medium transition-all border",
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <StageIcon className="w-3 h-3" style={{ color: stage.color }} />
                          <span className="flex-1 text-left truncate">{stage.label}</span>
                          <span className="text-[9px] text-muted-foreground">{stage.sublabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

function snapToNextSunday(date: Date): Date {
  const day = date.getDay();
  if (day === 0) return new Date(date);
  const result = new Date(date);
  result.setDate(date.getDate() + (7 - day));
  return result;
}

function calcWeekEndDate(startDateStr: string, weeks: number): string {
  if (!startDateStr) return "";
  const start = new Date(startDateStr + "T00:00:00");
  const target = new Date(start);
  target.setDate(start.getDate() + weeks * 7);
  const snapped = snapToNextSunday(target);
  return snapped.toISOString().split("T")[0];
}

function fmtDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CampaignCreationFullViewProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: any) => void;
  initialDuplicate?: PreviousCampaign | null;
}

export function CampaignCreationFullView({ isOpen, onClose, onComplete, initialDuplicate }: CampaignCreationFullViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number>(1);

  const [selectedDuplicate, setSelectedDuplicate] = useState<PreviousCampaign | null>(null);

  // Step 1 - Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateMode, setDateMode] = useState<"date-range" | "duration">("duration");
  const [durationValue, setDurationValue] = useState("4");
  const [durationUnit, setDurationUnit] = useState<"days" | "weeks" | "months">("weeks");

  // Step 2 - Source Material
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<Set<string>>(new Set());
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryDraft, setLibraryDraft] = useState<Set<string>>(new Set());
  // Library tabs
  const [librarySource, setLibrarySource] = useState<LibrarySource>("library");
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<Set<string>>(new Set());
  const [selectedDropboxFiles, setSelectedDropboxFiles] = useState<Set<string>>(new Set());
  const [extraUploads, setExtraUploads] = useState<File[]>([]);
  const extraFileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 - Content Type Mix
  const [contentTypeCounts, setContentTypeCounts] = useState<Record<ContentTypeId, number>>({
    "blog-post": 1,
    "short-clip": 4,
    "highlight-reel": 1,
    "quote-card": 2,
    "social-post": 3,
    "ai-video": 0,
    "carousel": 0,
  });
  const [platformsByType, setPlatformsByType] = useState<Record<ContentTypeId, Set<SocialPlatformId>>>({
    "blog-post": new Set(),
    "short-clip": new Set(["instagram", "tiktok"]),
    "highlight-reel": new Set(),
    "quote-card": new Set(),
    "ai-video": new Set(),
    "social-post": new Set(["facebook", "linkedin"]),
    "carousel": new Set(),
  });

  const togglePlatformForType = (typeId: ContentTypeId, platformId: SocialPlatformId) => {
    setPlatformsByType(prev => {
      const newSet = new Set(prev[typeId]);
      if (newSet.has(platformId)) newSet.delete(platformId);
      else newSet.add(platformId);
      return { ...prev, [typeId]: newSet };
    });
  };

  const getTypeItemCount = (typeId: ContentTypeId): number => {
    const qty = contentTypeCounts[typeId];
    if (qty === 0) return 0;
    const type = CONTENT_TYPES.find(t => t.id === typeId)!;
    if (!type.hasPlatforms) return qty;
    const platforms = platformsByType[typeId];
    return qty * (platforms.size > 0 ? platforms.size : 1);
  };

  // Step 4 - Funnel Stage Assignment
  const [funnelAssignments, setFunnelAssignments] = useState<Record<number, FunnelStage>>({});
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
  const [funnelPct, setFunnelPct] = useState({ awareness: 60, consideration: 25, conversion: 15 });

  // Step 5 - Topics
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(PROJECT_TOPICS.slice(0, 2)));
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState("");

  // Scheduled items state
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);

  // Summary modal
  const [showReviewModal, setShowReviewModal] = useState(false);

  const applyDuplicate = (campaign: PreviousCampaign) => {
    setSelectedDuplicate(campaign);
    setCampaignName(`${campaign.name} (Copy)`);
    setCampaignDescription(campaign.description);
    setContentTypeCounts(campaign.contentTypeCounts);
    setFunnelPct(campaign.funnelPct);
    setSelectedTopics(new Set(campaign.topics));
    setDurationValue(campaign.durationValue);
    setDurationUnit(campaign.durationUnit);
    setDateMode("duration");
    setUploadedFile(null);
    setSourceUrl("");
    setSelectedLibraryItems(new Set());
  };

  // Apply initial duplicate when the modal opens
  useEffect(() => {
    if (isOpen && initialDuplicate) {
      applyDuplicate(initialDuplicate);
    }
    if (!isOpen) {
      // Reset when closed
      setSelectedDuplicate(null);
      setCurrentStep(1);
      setCompletedSteps(new Set());
      setExpandedStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialDuplicate]);

  // Derive effective start/end dates — works in both date-range and duration modes
  const effectiveDates = useMemo(() => {
    if (dateMode === "date-range") {
      return { start: startDate, end: endDate };
    }
    const n = Math.max(1, parseInt(durationValue) || 1);
    const today = new Date().toISOString().split("T")[0];
    const s = today;
    let e = "";
    if (durationUnit === "days") {
      const d = new Date(s + "T00:00:00");
      d.setDate(d.getDate() + n - 1);
      e = d.toISOString().split("T")[0];
    } else if (durationUnit === "weeks") {
      const d = new Date(s + "T00:00:00");
      d.setDate(d.getDate() + n * 7);
      // snap to next Sunday
      const day = d.getDay();
      if (day !== 0) d.setDate(d.getDate() + (7 - day));
      e = d.toISOString().split("T")[0];
    } else {
      const d = new Date(s + "T00:00:00");
      d.setMonth(d.getMonth() + n);
      d.setDate(d.getDate() - 1);
      e = d.toISOString().split("T")[0];
    }
    return { start: s, end: e };
  }, [dateMode, startDate, endDate, durationValue, durationUnit]);

  // Calculated values
  const totalItems = useMemo(() =>
    CONTENT_TYPES.reduce((sum, t) => sum + getTypeItemCount(t.id), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentTypeCounts, platformsByType]
  );

  const totalCredits = useMemo(() =>
    CONTENT_TYPES.reduce((sum, type) => sum + (getTypeItemCount(type.id) * type.credits), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentTypeCounts, platformsByType]
  );

  const contentTypeDistribution = useMemo(() => {
    return CONTENT_TYPES.map((type) => {
      const count = getTypeItemCount(type.id);
      return {
        ...type,
        count,
        percentage: totalItems > 0 ? (count / totalItems) * 100 : 0,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeCounts, platformsByType, totalItems]);

  // Generate scheduled items — runs as soon as dates + content are configured
  useEffect(() => {
    const { start, end } = effectiveDates;
    if (!start || !end || totalItems === 0) {
      setScheduledItems([]);
      return;
    }

    const items: ScheduledItem[] = [];
    const startD = new Date(start + "T00:00:00");
    const endD = new Date(end + "T00:00:00");
    const dayCount = Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
    const total = CONTENT_TYPES.reduce((sum, t) => sum + getTypeItemCount(t.id), 0);

    const allItems: { typeId: ContentTypeId; label: string; idx: number; platform?: SocialPlatformId }[] = [];
    CONTENT_TYPES.forEach((type) => {
      const qty = contentTypeCounts[type.id];
      const platforms = type.hasPlatforms ? Array.from(platformsByType[type.id]) : [undefined];
      const platformsToUse = platforms.length > 0 ? platforms : [undefined];
      for (let i = 0; i < qty; i++) {
        platformsToUse.forEach((platform) => {
          allItems.push({ typeId: type.id, label: type.label, idx: i, platform });
        });
      }
    });

    allItems.forEach((item, i) => {
      const dayOffset = total <= 1 ? 0 : Math.round((i / (total - 1)) * dayCount);
      const itemDate = new Date(startD);
      itemDate.setDate(itemDate.getDate() + Math.min(dayOffset, dayCount));
      const id = i + 1;
      const pLabel = item.platform ? SOCIAL_PLATFORMS.find(p => p.id === item.platform)?.label : "";
      items.push({
        id,
        date: itemDate.toISOString().split("T")[0],
        typeId: item.typeId,
        topic: `${item.label} ${item.idx + 1}${pLabel ? " · " + pLabel : ""}`,
        funnelStage: funnelAssignments[id],
        platform: item.platform,
      });
    });

    setScheduledItems(items);
  }, [effectiveDates, contentTypeCounts, platformsByType, funnelAssignments]);

  if (!isOpen) return null;

  const canProceed = () => {
    if (currentStep === 1) {
      const hasSchedule = dateMode === "date-range"
        ? (startDate && endDate)
        : (parseInt(durationValue) > 0);
      return campaignName.trim() && hasSchedule;
    }
    if (currentStep === 2) return uploadedFile !== null || sourceUrl.trim();
    if (currentStep === 3) return totalItems > 0;
    if (currentStep === 4) return true;
    if (currentStep === 5) return selectedTopics.size > 0;
    return true;
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setExpandedStep(nextStep);
    } else if (currentStep === 5) {
      // Step 5 → open the review modal (step 6)
      setCurrentStep(6);
      setExpandedStep(6);
      setShowReviewModal(true);
    } else {
      onComplete({
        campaignName,
        startDate,
        endDate,
        uploadedFile,
        sourceUrl,
        contentTypeCounts,
        funnelAssignments,
        selectedTopics: Array.from(selectedTopics),
        totalItems,
        totalCredits,
      });
    }
  };

  const handleStepClick = (stepNum: number) => {
    if (completedSteps.has(stepNum) || stepNum === currentStep) {
      setExpandedStep(expandedStep === stepNum ? 0 : stepNum);
      if (stepNum !== currentStep) {
        setCurrentStep(stepNum);
      }
    }
  };

  const incrementCount = (typeId: ContentTypeId) => {
    setContentTypeCounts(prev => ({
      ...prev,
      [typeId]: prev[typeId] + 1
    }));
  };

  const decrementCount = (typeId: ContentTypeId) => {
    setContentTypeCounts(prev => ({
      ...prev,
      [typeId]: Math.max(0, prev[typeId] - 1)
    }));
  };

  const toggleTopic = (topic: string) => {
    const newSet = new Set(selectedTopics);
    if (newSet.has(topic)) {
      newSet.delete(topic);
    } else {
      newSet.add(topic);
    }
    setSelectedTopics(newSet);
  };

  const toggleItemSelection = (itemId: number) => {
    const newSet = new Set(selectedItemIds);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setSelectedItemIds(newSet);
  };

  const assignFunnelStage = (stage: FunnelStage) => {
    const newAssignments = { ...funnelAssignments };
    selectedItemIds.forEach(itemId => {
      newAssignments[itemId] = stage;
    });
    setFunnelAssignments(newAssignments);
    setSelectedItemIds(new Set());
  };

  const applyFunnelPercentages = (pct: typeof funnelPct, items: ScheduledItem[]) => {
    if (items.length === 0) return;
    const stages: FunnelStage[] = ['awareness', 'consideration', 'conversion'];
    const counts = [
      Math.round((pct.awareness / 100) * items.length),
      Math.round((pct.consideration / 100) * items.length),
      0,
    ];
    counts[2] = items.length - counts[0] - counts[1];
    const assignments: Record<number, FunnelStage> = {};
    let idx = 0;
    stages.forEach((stage, si) => {
      for (let i = 0; i < counts[si]; i++) {
        if (idx < items.length) assignments[items[idx++].id] = stage;
      }
    });
    setFunnelAssignments(assignments);
  };

  const updateFunnelPct = (changed: keyof typeof funnelPct, val: number) => {
    val = Math.max(0, Math.min(100, val));
    const others = (['awareness', 'consideration', 'conversion'] as const).filter(k => k !== changed);
    const remaining = 100 - val;
    const currentOthersTotal = funnelPct[others[0]] + funnelPct[others[1]];
    let a = currentOthersTotal > 0 ? Math.round((funnelPct[others[0]] / currentOthersTotal) * remaining) : Math.floor(remaining / 2);
    let b = remaining - a;
    const next = { ...funnelPct, [changed]: val, [others[0]]: a, [others[1]]: b };
    setFunnelPct(next);
    applyFunnelPercentages(next, scheduledItems);
  };

  const handleItemEdit = (itemId: number, updates: { typeId?: ContentTypeId; funnelStage?: FunnelStage }) => {
    setScheduledItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newItem = { ...item };

          if (updates.typeId !== undefined) {
            newItem.typeId = updates.typeId;
            const newType = CONTENT_TYPES.find(t => t.id === updates.typeId);
            if (newType) {
              // Update topic name to match new type
              const itemsOfSameType = prevItems.filter(i => i.typeId === updates.typeId);
              newItem.topic = `${newType.label} ${itemsOfSameType.length + 1}`;
            }
          }

          if (updates.funnelStage !== undefined) {
            newItem.funnelStage = updates.funnelStage;
          }

          return newItem;
        }
        return item;
      });

      // Recalculate content type counts
      const newCounts: Record<ContentTypeId, number> = {
        "blog-post": 0,
        "short-clip": 0,
        "highlight-reel": 0,
        "quote-card": 0,
        "social-post": 0,
        "ai-video": 0,
      };

      updatedItems.forEach(item => {
        newCounts[item.typeId] = (newCounts[item.typeId] || 0) + 1;
      });

      setContentTypeCounts(newCounts);

      // Update funnel assignments if funnel stage changed
      if (updates.funnelStage !== undefined) {
        setFunnelAssignments(prev => ({
          ...prev,
          [itemId]: updates.funnelStage!
        }));
      }

      return updatedItems;
    });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex overflow-hidden">
      {/* Left Column - Steps */}
      <div className="w-[600px] border-r border-border flex flex-col bg-card">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Flag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Create Campaign</h2>
              <p className="text-xs text-muted-foreground">Configure your content campaign</p>
            </div>
          </div>

          {/* Loaded-from banner — shown when duplicating */}
          {selectedDuplicate && (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-primary/25 bg-primary/5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedDuplicate.color }} />
              <span className="text-xs text-foreground font-medium flex-1 min-w-0">
                Duplicating <span className="font-bold">{selectedDuplicate.name}</span>
                <span className="text-muted-foreground font-normal"> — all settings loaded, just update the date &amp; assets.</span>
              </span>
              <button
                onClick={() => setSelectedDuplicate(null)}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                title="Clear — start from scratch instead"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Sticky Progress Bar */}
        <div className="px-6 py-4 border-b border-border bg-secondary/30 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-1">
            {STEP_CONFIG.map((stepItem, i) => (
              <div key={stepItem.id} className="flex items-center flex-1">
                <div
                  className={clsx(
                    "h-2 rounded-full flex-1 transition-all",
                    completedSteps.has(stepItem.id)
                      ? "bg-[#4B56F2]"
                      : stepItem.id === currentStep
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
                {i < STEP_CONFIG.length - 1 && <div className="w-1" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Step {currentStep} of 6</span>
            <span className="text-xs text-muted-foreground">{Math.round((completedSteps.size / 6) * 100)}% complete</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto">
          {STEP_CONFIG.map((stepItem) => {
            const isCompleted = completedSteps.has(stepItem.id);
            const isCurrent = currentStep === stepItem.id;
            const isExpanded = expandedStep === stepItem.id;
            const isUnlocked = isCompleted || isCurrent;

            return (
              <div key={stepItem.id} className="border-b border-border">
                {/* Step Header */}
                <button
                  onClick={() => handleStepClick(stepItem.id)}
                  disabled={!isUnlocked}
                  className={clsx(
                    "w-full px-6 py-4 flex items-center gap-3 transition-colors text-left",
                    isUnlocked ? "hover:bg-secondary/50 cursor-pointer" : "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      isCompleted
                        ? "bg-[#4B56F2] text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepItem.id}
                  </div>
                  <div className="flex-1">
                    <div className={clsx("text-sm font-bold", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                      {stepItem.label}
                    </div>
                    {isCompleted && !isExpanded && (
                      <div className="text-xs text-muted-foreground mt-0.5">Completed</div>
                    )}
                  </div>
                  {isUnlocked && (
                    isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Step Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4">
                    {/* Step 1: Campaign Details */}
                    {stepItem.id === 1 && (
                      <>
                        <div>
                          <label className="text-sm font-bold text-foreground block mb-2">Campaign Name</label>
                          <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="e.g., Summer Product Launch 2026"
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-foreground block mb-2">Description</label>
                          <textarea
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                            placeholder="Brief description of the campaign goals and messaging..."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        {/* ── Schedule Mode Switcher ── */}
                        <div>
                          <label className="text-sm font-bold text-foreground block mb-2">Schedule</label>
                          <div className="flex gap-1 bg-secondary rounded-xl p-1 border border-border mb-3">
                            {(["date-range", "duration"] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setDateMode(mode)}
                                className={clsx(
                                  "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                                  dateMode === mode
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {mode === "date-range" ? "By Date Range" : "By Duration"}
                              </button>
                            ))}
                          </div>

                          {/* Date Range Panel */}
                          <div className={clsx("transition-all", dateMode !== "date-range" && "opacity-40 pointer-events-none select-none")}>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground block mb-1.5">Start Date</label>
                                <div className="relative group">
                                  <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    disabled={dateMode !== "date-range"}
                                    className="w-full px-4 py-2.5 pr-10 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                  />
                                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground block mb-1.5">End Date</label>
                                <div className="relative group">
                                  <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    disabled={dateMode !== "date-range"}
                                    className="w-full px-4 py-2.5 pr-10 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all cursor-pointer hover:border-primary/50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                  />
                                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Duration Panel */}
                          <div className={clsx("mt-3 transition-all", dateMode !== "duration" && "opacity-40 pointer-events-none select-none")}>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                max="365"
                                value={durationValue}
                                onChange={(e) => setDurationValue(e.target.value)}
                                disabled={dateMode !== "duration"}
                                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              <div className="flex rounded-lg border border-border overflow-hidden">
                                {(["days", "weeks", "months"] as const).map((unit) => (
                                  <button
                                    key={unit}
                                    onClick={() => setDurationUnit(unit)}
                                    disabled={dateMode !== "duration"}
                                    className={clsx(
                                      "px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                                      durationUnit === unit
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {dateMode === "duration" && durationUnit === "weeks" && (
                              <p className="mt-1.5 text-xs text-muted-foreground">
                                Ends{" "}
                                <span className="text-primary font-semibold">
                                  {fmtDateDisplay(effectiveDates.end)}
                                </span>
                                {" "}· snapped to Sunday
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Step 2: Source Material */}
                    {stepItem.id === 2 && (
                      <>
                        {/* Upload drop zone */}
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <input type="file" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                          <label htmlFor="file-upload" className="text-sm text-foreground font-medium cursor-pointer block">
                            {uploadedFile ? uploadedFile.name : "Drag & drop or click to browse"}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">Upload video, podcast, or document</p>
                        </div>

                        {/* URL input */}
                        <div>
                          <label className="text-sm font-bold text-foreground block mb-2">Paste a link</label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="url"
                              value={sourceUrl}
                              onChange={(e) => setSourceUrl(e.target.value)}
                              placeholder="https://youtube.com/watch?v=... or podcast URL"
                              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>
                        </div>

                        {/* Add Resources button — opens the same dialog as the Resources page */}
                        <div>
                          <button
                            onClick={() => { setLibraryDraft(new Set(selectedLibraryItems)); setLibrarySource("library"); setShowLibraryModal(true); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/30 transition-colors"
                          >
                            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                              <Plus className="w-4 h-4 text-muted-foreground" />
                              Add Resources
                            </div>
                            {selectedLibraryItems.size > 0 && (
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedLibraryItems.size} selected</span>
                            )}
                          </button>
                        </div>

                        {/* Selected items chips */}
                        {selectedLibraryItems.size > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {PROJECT_LIBRARY.filter(i => selectedLibraryItems.has(i.id)).map(item => (
                              <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded-lg text-xs text-foreground">
                                <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="max-w-[130px] truncate">{item.name}</span>
                                <button
                                  onClick={() => { const next = new Set(selectedLibraryItems); next.delete(item.id); setSelectedLibraryItems(next); }}
                                  className="text-muted-foreground hover:text-red-400 ml-0.5 transition-colors"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Step 3: Content Type Mix */}
                    {stepItem.id === 3 && (
                      <div className="space-y-3">
                        {CONTENT_TYPES.map((type) => {
                          const Icon = type.Icon;
                          const count = contentTypeCounts[type.id];
                          const typeTotal = getTypeItemCount(type.id);
                          const platforms = platformsByType[type.id];
                          return (
                            <div key={type.id} className={clsx(
                              "p-3 border rounded-xl transition-all bg-background",
                              count > 0 ? "border-primary/40 shadow-sm" : "border-border"
                            )}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${type.color}18`, border: `1px solid ${type.color}30` }}>
                                  <Icon className="w-5 h-5" style={{ color: type.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-foreground">{type.label}</span>
                                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-secondary border border-border text-muted-foreground font-medium">{type.sublabel}</span>
                                  </div>
                                  <div className="text-[12px] text-muted-foreground mt-0.5">{type.description}</div>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[11px] text-muted-foreground font-medium">{type.credits} credits / item</span>
                                    {count > 0 && type.hasPlatforms && platforms.size > 0 && (
                                      <>
                                        <span className="text-muted-foreground/40">·</span>
                                        <span className="text-[11px] text-primary font-semibold">{count} × {platforms.size} = {typeTotal} total items</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => decrementCount(type.id)}
                                    disabled={count === 0}
                                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center border border-border"
                                  >
                                    <Minus className="w-4 h-4 text-foreground" />
                                  </button>
                                  <span className="text-sm font-bold w-6 text-center tabular-nums">{count}</span>
                                  <button
                                    onClick={() => incrementCount(type.id)}
                                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center border border-border"
                                  >
                                    <Plus className="w-4 h-4 text-foreground" />
                                  </button>
                                </div>
                              </div>

                              {/* Platform pills row (only when count > 0 and hasPlatforms) */}
                              {count > 0 && type.hasPlatforms && (
                                <div className="mt-3 pt-3 border-t border-border/80">
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Distribute across</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {SOCIAL_PLATFORMS.map(({ id, label, color, Icon: PIcon }) => {
                                      const on = platforms.has(id);
                                      return (
                                        <button
                                          key={id}
                                          onClick={() => togglePlatformForType(type.id, id)}
                                          className={clsx(
                                            "group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11.5px] font-semibold transition-all",
                                            on
                                              ? "bg-foreground/5 border-foreground/15 text-foreground"
                                              : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.03]"
                                          )}
                                          style={on ? { backgroundColor: `${color}10`, borderColor: `${color}40`, color: color } : {}}
                                        >
                                          <PIcon className="w-3.5 h-3.5" style={on ? { color } : {}} />
                                          {label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {platforms.size === 0 && (
                                    <p className="mt-2 text-[11px] text-muted-foreground italic">No platforms selected — will be assigned globally later.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Distribution bar */}
                        {totalItems > 0 && (
                          <div className="p-3 border border-border rounded-xl bg-background/60">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mix distribution</span>
                              <span className="text-[11px] text-muted-foreground">{totalItems} items · {totalCredits} credits</span>
                            </div>
                            <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-secondary border border-border">
                              {contentTypeDistribution.filter(d => d.count > 0).map(d => (
                                <div key={d.id} style={{ width: `${d.percentage}%`, backgroundColor: d.color }} className="h-full first:rounded-l-full last:rounded-r-full" />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-border flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">Total Items</span>
                              <Zap className="w-4 h-4 text-amber-400" />
                            </div>
                            <span className="text-[11px] text-muted-foreground">Quantity × platforms = total deliverables</span>
                          </div>
                          <span className="text-lg font-bold text-primary tabular-nums">{totalItems}</span>
                        </div>
                        <div className="flex justify-between items-center -mt-1">
                          <span className="text-sm font-bold text-foreground">Total Credits</span>
                          <span className="text-lg font-bold text-primary tabular-nums">{totalCredits}</span>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Funnel Stage */}
                    {stepItem.id === 4 && (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Set the distribution across funnel stages. Items are auto-assigned — you can also adjust individually in the calendar.</p>

                        {/* Percentage sliders */}
                        <div className="space-y-3">
                          {FUNNEL_STAGES.map((stage) => {
                            const Icon = stage.Icon;
                            const key = stage.id as keyof typeof funnelPct;
                            const pct = funnelPct[key];
                            const count = Math.round((pct / 100) * scheduledItems.length);
                            return (
                              <div key={stage.id} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5" style={{ color: stage.color }} />
                                    <span className="text-sm font-medium text-foreground">{stage.label}</span>
                                    <span className="text-xs text-muted-foreground">{stage.sublabel}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground tabular-nums">{count} items</span>
                                    <div className="flex items-center gap-1 bg-background border border-border rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => updateFunnelPct(key, pct - 5)}
                                        className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm"
                                      >−</button>
                                      <span className="text-sm font-bold tabular-nums w-10 text-center" style={{ color: stage.color }}>{pct}%</span>
                                      <button
                                        onClick={() => updateFunnelPct(key, pct + 5)}
                                        className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm"
                                      >+</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Apply button */}
                        <button
                          onClick={() => applyFunnelPercentages(funnelPct, scheduledItems)}
                          className="w-full py-2 rounded-lg border border-primary/30 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          Re-apply distribution
                        </button>

                        {scheduledItems.length === 0 && (
                          <div className="py-6 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                            Complete previous steps to see content items
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 5: Topics */}
                    {stepItem.id === 5 && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Select or add topics for your campaign content.</p>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">From Project</div>
                        <div className="flex flex-wrap gap-2">
                          {PROJECT_TOPICS.map((topic) => (
                            <button
                              key={topic}
                              onClick={() => toggleTopic(topic)}
                              className={clsx(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                                selectedTopics.has(topic)
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-foreground border-border hover:border-primary/50"
                              )}
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                        {customTopics.length > 0 && (
                          <>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-1">Custom Topics</div>
                            <div className="flex flex-wrap gap-2">
                                    {customTopics.map((topic) => (
                                <button
                                  key={topic}
                                  onClick={() => toggleTopic(topic)}
                                  className={clsx(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-1.5",
                                    selectedTopics.has(topic)
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background text-foreground border-border hover:border-primary/50"
                                  )}
                                >
                                  {topic}
                                  <span
                                    role="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCustomTopics(prev => prev.filter(t => t !== topic));
                                      setSelectedTopics(prev => { const s = new Set(prev); s.delete(topic); return s; });
                                    }}
                                    className="opacity-60 hover:opacity-100 ml-0.5"
                                  >×</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                        {/* Add custom topic */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newTopicInput}
                            onChange={(e) => setNewTopicInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTopicInput.trim()) {
                                const t = newTopicInput.trim();
                                if (![...PROJECT_TOPICS, ...customTopics].includes(t)) {
                                  setCustomTopics(prev => [...prev, t]);
                                }
                                setSelectedTopics(prev => new Set([...prev, t]));
                                setNewTopicInput("");
                              }
                            }}
                            placeholder="Add a custom topic…"
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                          />
                          <button
                            onClick={() => {
                              const t = newTopicInput.trim();
                              if (!t) return;
                              if (![...PROJECT_TOPICS, ...customTopics].includes(t)) {
                                setCustomTopics(prev => [...prev, t]);
                              }
                              setSelectedTopics(prev => new Set([...prev, t]));
                              setNewTopicInput("");
                            }}
                            disabled={!newTopicInput.trim()}
                            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Review — clicking Continue opens modal */}
                    {stepItem.id === 6 && (
                      <div className="py-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                        Click "Review Campaign" to see a full summary before creating.
                      </div>
                    )}

                    {/* Continue Button */}
                    {isCurrent && stepItem.id === 6 ? (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Review Campaign
                      </button>
                    ) : isCurrent ? (
                      <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {stepItem.id === 5 ? "Review Campaign" : "Continue"}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column - Calendar Preview */}
      <div className="flex-1 bg-background flex flex-col overflow-hidden">
        {/* Top bar: title + contextual stats + credits */}
        <div className="px-6 pt-5 pb-3 border-b border-border flex-shrink-0 space-y-3">
          {/* Row 1: title + credits */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground leading-tight">Calendar Preview</h3>
              <p className="text-xs text-muted-foreground">See how your content will be scheduled</p>
            </div>
            {totalItems > 0 && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex flex-col items-end gap-0.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-right flex-shrink-0"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-bold text-primary">{totalCredits} credits</span>
                </div>
                <span className="text-[10px] text-muted-foreground leading-none">campaign cost · {totalItems} posts</span>
              </button>
            )}
          </div>

          {/* Row 2: contextual step data */}
          {(() => {
            // Step 1 — campaign details summary
            if (currentStep === 1 || (currentStep > 1 && !effectiveDates.start && !effectiveDates.end)) return null;

            // Step 3 — content type mix breakdown
            if (currentStep === 3 && totalItems > 0) {
              const types = CONTENT_TYPES
                .map(t => ({ t, count: contentTypeCounts[t.id] || 0, pct: totalItems > 0 ? Math.round(((contentTypeCounts[t.id] || 0) / totalItems) * 100) : 0 }))
                .filter(x => x.count > 0)
                .sort((a, b) => b.count - a.count);
              return (
                <div className="flex items-center gap-4">
                  <MiniDonut segments={types.map(({ t, count }) => ({ color: t.color, value: count, label: t.label }))} size={80} thickness={18} />
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {types.map(({ t, count, pct }) => {
                      const Icon = t.Icon;
                      return (
                        <div key={t.id} className="flex items-center gap-1.5 min-w-[130px]" style={{ fontSize: 13 }}>
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.color }} />
                          <span className="text-muted-foreground">{t.label}</span>
                          <span className="font-bold tabular-nums ml-auto" style={{ color: t.color }}>{count}</span>
                          <span className="text-muted-foreground/60 tabular-nums w-9 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Step 4 — funnel distribution (horizontal stacked bar)
            if (currentStep === 4) {
              const total = scheduledItems.length;
              if (total === 0) return null;
              const stages = FUNNEL_STAGES.map(s => ({
                s,
                count: scheduledItems.filter(i => i.funnelStage === s.id).length,
                pct: Math.round((scheduledItems.filter(i => i.funnelStage === s.id).length / total) * 100),
              }));
              const unassigned = total - stages.reduce((sum, { count }) => sum + count, 0);
              return (
                <div className="space-y-2 w-full">
                  {/* Stacked bar */}
                  <div className="flex h-4 rounded-full overflow-hidden gap-px">
                    {stages.filter(({ count }) => count > 0).map(({ s, pct }) => (
                      <div key={s.id} className="h-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: s.color }} title={`${s.label}: ${pct}%`} />
                    ))}
                    {unassigned > 0 && (
                      <div className="h-full flex-1 bg-border/50" title="Unassigned" />
                    )}
                  </div>
                  {/* Legend row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    {stages.filter(({ count }) => count > 0).map(({ s, count, pct }) => {
                      const Icon = s.Icon;
                      return (
                        <div key={s.id} className="flex items-center gap-1.5" style={{ fontSize: 13 }}>
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: s.color }} />
                          <span className="text-muted-foreground">{s.label}:</span>
                          <span className="font-bold tabular-nums" style={{ color: s.color }}>{count}</span>
                          <span className="text-muted-foreground/60 tabular-nums">· {pct}%</span>
                        </div>
                      );
                    })}
                    {unassigned > 0 && (
                      <div className="flex items-center gap-1.5" style={{ fontSize: 13 }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-border" />
                        <span className="text-muted-foreground">Unassigned: <span className="font-bold text-foreground">{unassigned}</span></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // Step 5 — topics
            if (currentStep === 5 && selectedTopics.size > 0) {
              return (
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(selectedTopics).map(topic => (
                    <span key={topic} className="px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary border border-primary/20" style={{ fontSize: 13 }}>
                      {topic}
                    </span>
                  ))}
                </div>
              );
            }

            // Step 2 / other — show date range if available
            if (effectiveDates.start && effectiveDates.end) {
              const days = Math.ceil((new Date(effectiveDates.end).getTime() - new Date(effectiveDates.start).getTime()) / (1000 * 60 * 60 * 24));
              const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: 13 }}>
                  <span className="font-medium text-foreground">{fmt(effectiveDates.start)}</span>
                  <span>→</span>
                  <span className="font-medium text-foreground">{fmt(effectiveDates.end)}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{days} days</span>
                </div>
              );
            }

            return null;
          })()}
        </div>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          {effectiveDates.start && effectiveDates.end ? (
            <CalendarGrid
              startDate={effectiveDates.start}
              endDate={effectiveDates.end}
              scheduledItems={scheduledItems}
              onItemEdit={handleItemEdit}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-sm text-muted-foreground">Set campaign dates to see the calendar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal (also used by credits badge) */}
      {showReviewModal && (() => {
        const { start: effStart, end: effEnd } = effectiveDates;
        const durationDays = effStart && effEnd
          ? Math.ceil((new Date(effEnd).getTime() - new Date(effStart).getTime()) / (1000 * 60 * 60 * 24))
          : null;
        const typeBreakdown = CONTENT_TYPES.map(t => ({
          type: t,
          count: getTypeItemCount(t.id) || 0,
          pct: totalItems > 0 ? Math.round(((getTypeItemCount(t.id) || 0) / totalItems) * 100) : 0,
        })).filter(x => x.count > 0);
        const funnelBreakdown = FUNNEL_STAGES.map(s => ({
          stage: s,
          count: scheduledItems.filter(i => i.funnelStage === s.id).length,
          pct: scheduledItems.length > 0 ? Math.round((scheduledItems.filter(i => i.funnelStage === s.id).length / scheduledItems.length) * 100) : 0,
        }));
        return (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6" onClick={() => setShowReviewModal(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex-shrink-0 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">Review your campaign</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Double-check everything before creating. Nothing will be generated until you click Create Campaign.</p>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Campaign card */}
                <div className="rounded-xl border border-border bg-orange-900/10 p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <Flag className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-foreground truncate">{campaignName || "Untitled Campaign"}</div>
                    {effStart && effEnd && (
                      <div className="text-xs text-muted-foreground">{effStart} → {effEnd}</div>
                    )}
                    {campaignDescription && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{campaignDescription}</p>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'ITEMS', value: totalItems, color: '#4B56F2' },
                    { label: 'CREDITS', value: totalCredits, color: '#4B56F2' },
                    { label: 'DAYS', value: durationDays ?? '—', color: 'var(--foreground)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-center">
                      <div className="text-2xl font-bold tabular-nums leading-none" style={{ color }}>{value}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Content type + Funnel side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">Content Types</div>
                    {typeBreakdown.length > 0 ? typeBreakdown.map(({ type, count, pct }) => {
                      const Icon = type.Icon;
                      return (
                        <div key={type.id} className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: type.color }} />
                          <span className="flex-1 text-sm text-muted-foreground truncate">{type.label}</span>
                          <span className="font-bold text-foreground tabular-nums text-sm">{count}</span>
                          <span className="text-xs text-muted-foreground/60 w-9 text-right">({pct}%)</span>
                        </div>
                      );
                    }) : <p className="text-xs text-muted-foreground">No content types set</p>}
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider">Funnel Distribution</div>
                    {funnelBreakdown.map(({ stage, count, pct }) => {
                      const Icon = stage.Icon;
                      return (
                        <div key={stage.id} className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: stage.color }} />
                          <span className="flex-1 text-sm text-muted-foreground truncate">{stage.label}</span>
                          <span className="font-bold text-foreground tabular-nums text-sm">{count}</span>
                          <span className="text-xs text-muted-foreground/60 w-9 text-right">({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ready to generate */}
                <div className="rounded-xl border border-[#4B56F2]/30 bg-[#4B56F2]/10 p-4 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#818CFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-foreground">Ready to generate</div>
                    <p className="text-xs text-muted-foreground mt-0.5">All {totalItems} items will begin generating immediately after you click Create Campaign.</p>
                  </div>
                </div>

                {/* Topics — single row below ready to generate */}
                {selectedTopics.size > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex-shrink-0">Topics</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.from(selectedTopics).map(topic => (
                        <span key={topic} className="px-2.5 py-1 rounded-full text-xs font-medium border border-primary/30 text-primary bg-primary/10 whitespace-nowrap">{topic}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-border px-6 py-4 flex items-center gap-3 bg-card">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    onComplete({
                      campaignName, startDate, endDate, uploadedFile, sourceUrl,
                      contentTypeCounts, funnelAssignments,
                      selectedTopics: Array.from(selectedTopics),
                      totalItems, totalCredits,
                    });
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#4B56F2] hover:bg-[#4B56F2]/90 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Resources Modal — same dialog as the Resources page */}
      {showLibraryModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowLibraryModal(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 flex-shrink-0 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground leading-tight">Add Resources</h2>
                <p className="text-sm text-muted-foreground mt-1.5">Pick from your library, upload from device, or import from the cloud</p>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body: sidebar + content */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Sidebar */}
              <div className="w-[200px] flex-shrink-0 border-r border-border px-4 py-3 flex flex-col gap-1">
                {([
                  { key: "library" as LibrarySource, Icon: Layers, label: "My Library" },
                  { key: "device" as LibrarySource, Icon: Upload, label: "Upload from Device" },
                  { key: "google-drive" as LibrarySource, Icon: Cloud, label: "Google Drive" },
                  { key: "dropbox" as LibrarySource, Icon: Archive, label: "Dropbox" },
                ]).map(({ key, Icon: SIcon, label }) => (
                  <button
                    key={key}
                    onClick={() => setLibrarySource(key)}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors text-left",
                      librarySource === key
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground font-medium hover:bg-accent/40"
                    )}
                  >
                    <SIcon className="w-5 h-5 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
                {/* My Library */}
                {librarySource === "library" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Resources</p>
                      {libraryDraft.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{libraryDraft.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {PROJECT_LIBRARY.map((item) => {
                        const isSelected = libraryDraft.has(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              const next = new Set(libraryDraft);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              setLibraryDraft(next);
                            }}
                            className={clsx(
                              "flex items-center gap-3 border rounded-lg p-3 transition-colors cursor-pointer text-left w-full",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border bg-secondary/40 hover:border-primary/40"
                            )}
                          >
                            <div className={clsx(
                              "flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors",
                              isSelected ? "bg-primary border-primary" : "bg-transparent border-muted-foreground/40"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border flex-shrink-0">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">{item.size}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload from Device */}
                {librarySource === "device" && (
                  <>
                    <label className="border-2 border-dashed border-border rounded-xl bg-background/60 h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <input ref={extraFileInputRef} type="file" multiple className="hidden" onChange={(e) => setExtraUploads(a => [...a, ...Array.from(e.target.files || [])])} />
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-foreground text-sm font-semibold">Click or drag to upload</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Video, audio, docs, images</p>
                    </label>
                    {extraUploads.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Added this session</p>
                        {extraUploads.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 border border-border rounded-lg bg-secondary/40 p-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border flex-shrink-0">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground">{f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`}</p>
                            </div>
                            <button
                              onClick={() => setExtraUploads(a => a.filter((_, idx) => idx !== i))}
                              className="text-muted-foreground hover:text-red-400 text-lg leading-none px-1"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Google Drive */}
                {librarySource === "google-drive" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Google Drive Files</p>
                      {selectedDriveFiles.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{selectedDriveFiles.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DRIVE_FILES.map((file) => {
                        const isSelected = selectedDriveFiles.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => {
                              const next = new Set(selectedDriveFiles);
                              if (next.has(file.id)) next.delete(file.id);
                              else next.add(file.id);
                              setSelectedDriveFiles(next);
                              const d = new Set(libraryDraft);
                              if (d.has(file.id)) d.delete(file.id); else d.add(file.id);
                              setLibraryDraft(d);
                            }}
                            className={clsx(
                              "flex items-center gap-3 border rounded-lg p-3 transition-colors cursor-pointer text-left w-full",
                              isSelected ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/40"
                            )}
                          >
                            <div className={clsx(
                              "flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors",
                              isSelected ? "bg-primary border-primary" : "bg-transparent border-muted-foreground/40"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border flex-shrink-0">
                              <Cloud className="w-5 h-5 text-sky-500" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">{file.size} · {file.modified}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dropbox */}
                {librarySource === "dropbox" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dropbox Files</p>
                      {selectedDropboxFiles.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{selectedDropboxFiles.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DROPBOX_FILES.map((file) => {
                        const isSelected = selectedDropboxFiles.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => {
                              const next = new Set(selectedDropboxFiles);
                              if (next.has(file.id)) next.delete(file.id);
                              else next.add(file.id);
                              setSelectedDropboxFiles(next);
                              const d = new Set(libraryDraft);
                              if (d.has(file.id)) d.delete(file.id); else d.add(file.id);
                              setLibraryDraft(d);
                            }}
                            className={clsx(
                              "flex items-center gap-3 border rounded-lg p-3 transition-colors cursor-pointer text-left w-full",
                              isSelected ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-primary/40"
                            )}
                          >
                            <div className={clsx(
                              "flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors",
                              isSelected ? "bg-primary border-primary" : "bg-transparent border-muted-foreground/40"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border flex-shrink-0">
                              <Archive className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">{file.size} · {file.modified}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between border-t border-border bg-secondary/40 px-8 py-5">
              <button
                onClick={() => { setShowLibraryModal(false); setLibrarySource("library"); }}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setSelectedLibraryItems(new Set(libraryDraft)); setShowLibraryModal(false); }}
                className={clsx(
                  "inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity",
                  libraryDraft.size === 0 ? "bg-primary/40 cursor-not-allowed" : "bg-primary shadow-lg hover:opacity-90 cursor-pointer"
                )}
                disabled={libraryDraft.size === 0}
              >
                {libraryDraft.size > 0 ? `Add ${libraryDraft.size} Resource${libraryDraft.size > 1 ? 's' : ''}` : 'Add Resources'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

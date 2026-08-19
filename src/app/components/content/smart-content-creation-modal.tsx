import { useState, useCallback, useRef, useEffect } from "react";
import {
  X, Upload, Link as LinkIcon, FileText, Video, ImageIcon, LayoutGrid,
  Check, Sparkles, Music, Film, User, ChevronDown, Coins, Clock,
  Target, Layers, Hash, Feather, ArrowLeft, ChevronRight, Quote,
  Wand2, Play, Scissors, Star, Plus, Minus, AlignLeft, Type, Zap,
  Share2, Instagram, Facebook, Linkedin, Twitter, Youtube,
  RefreshCw, Image, MessageCircle, Music2, FolderOpen,
} from "lucide-react";
import { clsx } from "clsx";
import { WordCountRangeSelector } from "./word-count-range-selector";
import { ResourcePicker } from "./resource-picker";
import { type BrandKit } from "../../../lib/services/brand-kits-service";
import { type WriterProfile } from "../../../lib/services/writer-profiles-service";

// ─── Helper: build brand guidelines from a BrandKit ──────────────────────────

function buildBrandGuidelines(kit: BrandKit): string {
  const parts: string[] = [];
  if (kit.tone_of_voice) parts.push(`Brand Voice: ${kit.tone_of_voice}`);
  if (kit.colors && kit.colors.length > 0) parts.push(`Brand Colors: ${kit.colors.join(', ')}`);
  if (kit.fonts && kit.fonts.length > 0) parts.push(`Brand Fonts: ${kit.fonts.join(', ')}`);
  return parts.join('\n') || kit.tone_of_voice || '';
}

// ─── Campaign Preview Sub-component ──────────────────────────────────────────

function CampaignPreviewCard({ preset }: { preset: { name: string; description: string | null; brandGuidelines?: string; writerProfile?: string; wordCountRange?: [number, number] } }) {
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const wordCount = preset.wordCountRange ? `${preset.wordCountRange[0]}–${preset.wordCountRange[1]} words` : null;
  const maxChars = 120;
  const full = preset.brandGuidelines || '';
  const hasGuidelines = full.length > 0;
  const isTruncatable = full.length > maxChars;
  const displayed = instructionsExpanded || !isTruncatable ? full : full.slice(0, maxChars).trimEnd() + "…";

  return (
    <div className="rounded-xl border border-border bg-background/30 overflow-hidden">
      {/* Header: campaign name + badge */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">{preset.name}</p>
        {preset.brandGuidelines && (
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
            Will pre-fill
          </span>
        )}
      </div>

      {/* Description — hero text */}
      <div className="px-4 pb-4">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Description</p>
        <p className="text-lg font-bold text-foreground leading-snug">{preset.description || 'No description'}</p>
        {wordCount && <p className="text-[10px] text-muted-foreground/50 mt-1.5 tabular-nums">{wordCount}</p>}
      </div>

      {preset.writerProfile && (
        <>
          <div className="border-t border-border/60 mx-4" />
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-0.5">Writer Profile</p>
            <p className="text-sm font-semibold text-foreground">{preset.writerProfile}</p>
          </div>
        </>
      )}

      {hasGuidelines && (
        <>
          <div className="border-t border-border/60 mx-4" />
          <div className="px-4 py-3">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Instructions</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{displayed}</p>
            {isTruncatable && (
              <button
                onClick={() => setInstructionsExpanded(v => !v)}
                className="mt-1 text-[10px] font-semibold text-primary/70 hover:text-primary transition-colors"
              >
                {instructionsExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SmartContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: any) => void;
  contentType?: "wechat-article" | "short-video" | "live-clip" | "ai-video" | "quote-card" | "social-post" | "carousel";
  defaultCampaign?: string;
  defaultFile?: File;
  campaigns?: { id: string; name: string; description: string | null }[];
  brandKits?: BrandKit[];
  writerProfiles?: WriterProfile[];
  defaultBrandKitId?: string | null;
  defaultWriterProfileId?: string | null;
}

type ContentTypeId = "wechat-article" | "short-video" | "social-post" | "carousel" | "quote-card" | "ai-video" | "live-clip";
type SocialPlatformId = "wechat" | "xiaohongshu" | "douyin" | "weibo" | "bilibili" | "youtube";

// ─── Config ───────────────────────────────────────────────────────────────────

const PROJECT_DEFAULTS = {
  writerProfile: "Velocity Athletics Team",
  brandGuidelines:
    "Bold, motivational, performance-driven. Emphasize achievement and the drive to exceed limits. Use active voice, strong verbs, and energetic language. Inspire and empower — never talk down.",
  targetAudience:
    "Athletes and fitness enthusiasts, ages 18–45, performance-focused, US & global markets",
};

interface CampaignPreset {
  id: string;
  name: string;
  description: string;
  brandGuidelines: string;
  targetAudience: string;
  writerProfile: string;
  writingTone: string;
  writingLevel: string;
  wordCountRange: [number, number];
  topics: string;
}

const CAMPAIGNS: CampaignPreset[] = [
  {
    id: "velocity-summer",
    name: "Velocity Summer Drop",
    description: "Summer athletic collection launch — performance & lifestyle content",
    brandGuidelines: "Bold, performance-driven. Emphasize achievement and seasonal energy. Use active voice, strong verbs. Inspire and empower. Tie every message back to peak summer performance.",
    targetAudience: "Athletes and fitness enthusiasts, ages 18–35, performance-focused, US markets",
    writerProfile: "Velocity Athletics Team",
    writingTone: "Motivational",
    writingLevel: "Intermediate",
    wordCountRange: [800, 1200],
    topics: "summer collection, athletic performance, new releases, training, outdoor fitness",
  },
  {
    id: "brand-awareness",
    name: "Brand Awareness Q2",
    description: "Broad brand visibility campaign — story, values, and heritage",
    brandGuidelines: "Authentic, inclusive, premium yet approachable. Focus on brand story and values. Avoid jargon. Short sentences. Lead with the human benefit, not the product spec.",
    targetAudience: "Broad audience, ages 25–55, brand-conscious consumers, US & global",
    writerProfile: "Brand Marketing Lead",
    writingTone: "Professional",
    writingLevel: "Advanced",
    wordCountRange: [1200, 1800],
    topics: "brand heritage, innovation, sustainability, community, values",
  },
  {
    id: "retention-drive",
    name: "Retention Drive",
    description: "Loyalty-focused content for existing customers and community",
    brandGuidelines: "Warm, conversational, community-forward. Speak to loyal customers as insiders. Celebrate their commitment. Reward language (exclusive, member, early access). No hard sell.",
    targetAudience: "Existing customers, all ages, loyalty-focused, community members",
    writerProfile: "Content Strategist",
    writingTone: "Conversational",
    writingLevel: "Beginner",
    wordCountRange: [500, 800],
    topics: "loyalty rewards, member exclusives, community stories, product tips, behind the scenes",
  },
];

interface SocialPlatformDef {
  id: SocialPlatformId;
  label: string;
  Icon: React.ElementType;
  color: string;
  textLength: string;
  dimensions: string;
  toneNote: string;
}

const SOCIAL_PLATFORMS: SocialPlatformDef[] = [
  { id: "wechat",      label: "WeChat",       Icon: MessageCircle, color: "#07C160", textLength: "Up to 10,000 chars (articles)", dimensions: "16:9 cover · 1:1 thumb", toneNote: "Professional, informative, trust-building" },
  { id: "xiaohongshu", label: "Xiaohongshu",   Icon: LayoutGrid,   color: "#FF2442", textLength: "100–1,000 chars",              dimensions: "3:4 or 1:1",          toneNote: "Aesthetic, personal, lifestyle-driven" },
  { id: "douyin",      label: "Douyin",        Icon: Music2,       color: "#010101", textLength: "Under 100 chars (caption)",    dimensions: "9:16 portrait",        toneNote: "Trendy, fast-paced, entertaining" },
  { id: "weibo",       label: "Weibo",         Icon: Share2,       color: "#E6162D", textLength: "Under 140 chars default",      dimensions: "16:9 or 1:1",          toneNote: "Newsy, trending, conversational" },
  { id: "bilibili",    label: "Bilibili",      Icon: Play,         color: "#00A1D6", textLength: "100–300 chars (description)",  dimensions: "16:9 landscape",       toneNote: "Creative, in-depth, community-driven" },
  { id: "youtube",     label: "YouTube",       Icon: Youtube,      color: "#FF0000", textLength: "100–200 chars",               dimensions: "16:9 landscape",       toneNote: "Informational, SEO-driven" },
];

interface ContentTypeDef {
  id: ContentTypeId;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  color: string;
  description: string;
  credits: number;
}

const CONTENT_TYPES: ContentTypeDef[] = [
  {
    id: "wechat-article",
    label: "WeChat Article",
    sublabel: "公众号文章",
    Icon: FileText,
    color: "#07C160",
    description: "In-depth articles for WeChat Official Accounts",
    credits: 20,
  },
  {
    id: "short-video",
    label: "Short Video",
    sublabel: "短视频",
    Icon: Film,
    color: "#010101",
    description: "Short-form video for Douyin, Xiaohongshu & Bilibili",
    credits: 15,
  },
  {
    id: "social-post",
    label: "Social Post",
    sublabel: "社交帖子",
    Icon: Share2,
    color: "#06B6D4",
    description: "Platform-native posts for WeChat Moments, Weibo & more",
    credits: 10,
  },
  {
    id: "carousel",
    label: "Carousel",
    sublabel: "图文/轮播",
    Icon: LayoutGrid,
    color: "#8B5CF6",
    description: "Multi-slide image-text posts for Xiaohongshu & WeChat",
    credits: 12,
  },
  {
    id: "quote-card",
    label: "Quote Card",
    sublabel: "引用卡片",
    Icon: Quote,
    color: "#A78BFA",
    description: "Branded quote graphics from templates",
    credits: 8,
  },
  {
    id: "ai-video",
    label: "AI Video",
    sublabel: "AI生成视频",
    Icon: Wand2,
    color: "#EC4899",
    description: "AI-generated video from text prompts",
    credits: 30,
  },
  {
    id: "live-clip",
    label: "Live Stream Clip",
    sublabel: "直播切片",
    Icon: Scissors,
    color: "#F59E0B",
    description: "Extract and edit clips from live streams",
    credits: 15,
  },
];

// Fallback tones and levels used when no writer profiles are available
const FALLBACK_TONES = [
  "Energetic", "Professional", "Motivational", "Bold",
  "Conversational", "Inspirational", "Authoritative", "Playful",
];

const FALLBACK_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const QUOTE_TEMPLATES = [
  "Minimal Dark",
  "Bold Gradient",
  "Athletic Edge",
  "Clean Modern",
  "Motivational",
  "Branded",
];

const STEP_LABELS = ["How to Create", "Sources & Assets", "Content Type", "Review & Configure"];
const CREDIT_BALANCE = 147;

// ─── ProjectDefaultTag ────────────────────────────────────────────────────────

function ProjectDefaultTag() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#4B56F2]/10 text-[#818CFF] border border-[#4B56F2]/20">
      <span className="w-1.5 h-1.5 rounded-full bg-[#818CFF] inline-block flex-shrink-0" />
      Project Default
    </span>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────

function FieldLabel({ label, defaulted, optional }: { label: string; defaulted?: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {defaulted && <ProjectDefaultTag />}
      {optional && <span className="text-xs text-muted-foreground font-medium">(Optional)</span>}
    </div>
  );
}

// ─── Brief Components ─────────────────────────────────────────────────────────

function BriefRow({ index, text, mono }: { index?: number | string; text: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {index !== undefined ? (
        mono ? (
          <span className="text-xs font-mono text-muted-foreground/50 w-20 flex-shrink-0 pt-0.5 leading-none">{index}</span>
        ) : (
          <span className="text-xs text-primary font-bold w-5 flex-shrink-0 pt-0.5 tabular-nums">{index}</span>
        )
      ) : (
        <div className="w-2 h-2 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
      )}
      <span className="text-sm text-foreground leading-relaxed">{text}</span>
    </div>
  );
}

function BriefMeta({ items }: { items: Array<{ Icon: React.ElementType; text: string }> }) {
  return (
    <div className="flex items-center gap-5 pt-3 border-t border-border/50 mt-1">
      {items.map(({ Icon, text }) => (
        <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Icon className="w-4 h-4 flex-shrink-0" />
          {text}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SmartContentCreationModal({
  isOpen, onClose, onComplete, contentType: initialType, defaultCampaign, defaultFile, campaigns = [],
  brandKits = [], writerProfiles = [], defaultBrandKitId, defaultWriterProfileId,
}: SmartContentCreationModalProps) {
  // ── Origin selection (Step 1) ──
  const [originMode, setOriginMode] = useState<"new" | "campaign">("new");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

// Use real campaigns from props if available, otherwise fall back to hardcoded presets
  // If we have real campaigns from the project, use those instead of showing fake presets
  const availableCampaigns = campaigns.length > 0 ? campaigns : CAMPAIGNS;

  // ── Dynamic writer profile data (derived from props) ──────────────────────────
  const writerProfileNames = writerProfiles.length > 0
    ? writerProfiles.map(p => p.name)
    : [];
  const writingTones = (() => {
    const tones = new Set<string>();
    writerProfiles.forEach(p => { if (p.tone) tones.add(p.tone); });
    if (tones.size === 0) {
      FALLBACK_TONES.forEach(t => tones.add(t));
    }
    return Array.from(tones);
  })();
  const writingLevels = (() => {
    const levels = new Set<string>();
    writerProfiles.forEach(p => { if (p.level) levels.add(p.level); });
    if (levels.size === 0) {
      FALLBACK_LEVELS.forEach(l => levels.add(l));
    }
    return Array.from(levels);
  })();

  // Steps: 1=Origin, 2=Sources & Assets, 3=Content Type, 4=Review & Configure
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 3 - Content Type quantities
  const [quantities, setQuantities] = useState<Record<ContentTypeId, number>>({
    "wechat-article": 0, "short-video": 0, "live-clip": 0,
    "quote-card": 0, "ai-video": 0, "social-post": 0, "carousel": 0,
  });

  const changeQty = (id: ContentTypeId, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
  };

  const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);

  // Per-type platform selection
  const [platformsByType, setPlatformsByType] = useState<Record<ContentTypeId, Set<SocialPlatformId>>>({
    "wechat-article": new Set(),
    "short-video": new Set(),
    "live-clip": new Set(),
    "quote-card": new Set(),
    "ai-video": new Set(),
    "social-post": new Set(),
    "carousel": new Set(),
  });

  const togglePlatformForType = (typeId: ContentTypeId, platformId: SocialPlatformId) => {
    setPlatformsByType(prev => {
      const next = { ...prev };
      const typeSet = new Set(next[typeId]);
      typeSet.has(platformId) ? typeSet.delete(platformId) : typeSet.add(platformId);
      next[typeId] = typeSet;
      return next;
    });
  };

  const getTypeItemCount = (typeId: ContentTypeId): number => {
    const qty = quantities[typeId];
    if (qty === 0) return 0;
    if (typeId === "wechat-article") return qty;
    const platforms = platformsByType[typeId];
    return qty * (platforms.size > 0 ? platforms.size : 1);
  };

  const grandTotal = CONTENT_TYPES.reduce((sum, t) => sum + getTypeItemCount(t.id), 0);

  // Primary type drives review & configure step — first type with qty > 0
  const selectedType: ContentTypeId | null = CONTENT_TYPES.find(t => quantities[t.id] > 0)?.id ?? null;

  // Step 4 - Configuration
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [writerProfile, setWriterProfile] = useState(PROJECT_DEFAULTS.writerProfile);
  const [writingTone, setWritingTone] = useState("");
  const [writingLevel, setWritingLevel] = useState("");
  const [wordCount, setWordCount] = useState<[number, number]>([1200, 1700]);
  const [brandGuidelines, setBrandGuidelines] = useState(PROJECT_DEFAULTS.brandGuidelines);
  const [targetAudience, setTargetAudience] = useState(PROJECT_DEFAULTS.targetAudience);

  // ── Scheduling state ──
  type ScheduleMode = "immediate" | "range" | "unscheduled";
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("immediate");
  const [scheduleStart, setScheduleStart] = useState<string>("");
  const [scheduleEnd, setScheduleEnd] = useState<string>("");

  // Platform-specific best days (0=Sun, 1=Mon, ..., 6=Sat)
  const PLATFORM_BEST_DAYS: Record<string, number[]> = {
    instagram: [0, 1, 2, 3, 4, 5, 6], // 7 days/week
    facebook:  [2, 3, 4],               // Tue-Thu
    linkedin:  [2, 3, 4],               // Tue-Thu
    x:         [0, 1, 2, 3, 4, 5, 6],  // 7 days/week
    tiktok:    [0, 1, 2, 3, 4, 5, 6],  // 7 days/week
    youtube:   [4, 5, 6],               // Thu-Sat
    general:   [1, 2, 3, 4, 5],         // Mon-Fri for generic
  };

  // Platform-specific daily post limits
  const PLATFORM_DAILY_LIMITS: Record<string, number> = {
    instagram: 2,
    facebook:  2,
    linkedin:  1,
    x:         5,
    tiktok:    3,
    youtube:   1,
    general:   5,
  };

  function distributeDates(
    totalItems: number,
    startStr: string,
    endStr: string,
    platformIds: string[]
  ): string[] {
    if (totalItems <= 0 || !startStr || !endStr) return [];

    const start = new Date(startStr + "T00:00:00");
    const end = new Date(endStr + "T00:00:00");
    if (start > end) return [];

    // Collect all eligible days sorted
    const eligibleDays: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      // A day is eligible if ANY selected platform considers it a best day
      const isEligible = platformIds.length === 0 ||
        platformIds.some(pid => (PLATFORM_BEST_DAYS[pid] || PLATFORM_BEST_DAYS.general).includes(dayOfWeek));
      if (isEligible) {
        eligibleDays.push(new Date(d));
      }
    }

    if (eligibleDays.length === 0) {
      // Fallback: use every day in range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        eligibleDays.push(new Date(d));
      }
    }

    // Calculate per-platform limits
    const limits = platformIds.length > 0
      ? platformIds.map(pid => PLATFORM_DAILY_LIMITS[pid] || PLATFORM_DAILY_LIMITS.general)
      : [PLATFORM_DAILY_LIMITS.general];
    const maxPerDay = Math.max(...limits);
    const maxCapacity = eligibleDays.length * maxPerDay;

    // If items exceed capacity, clamp to max capacity
    const itemsToSchedule = Math.min(totalItems, maxCapacity);

    // Distribute items evenly across eligible days
    const distribution: number[] = new Array(eligibleDays.length).fill(0);
    let remaining = itemsToSchedule;
    while (remaining > 0) {
      for (let i = 0; i < eligibleDays.length && remaining > 0; i++) {
        if (distribution[i] < maxPerDay) {
          distribution[i]++;
          remaining--;
        }
      }
    }

    // Build result array
    const result: string[] = [];
    for (let i = 0; i < eligibleDays.length; i++) {
      for (let j = 0; j < distribution[i]; j++) {
        result.push(formatDate(eligibleDays[i]));
      }
    }

    // Sort chronologically
    result.sort((a, b) => a.localeCompare(b));
    return result;
  }

  function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function todayStr(): string {
    return formatDate(new Date());
  }

  function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return formatDate(d);
  }

  // Quote Card specific
  const [quoteText, setQuoteText] = useState("");
  const [quoteSource, setQuoteSource] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(QUOTE_TEMPLATES[0]);

  // Short Clip specific
  const [sourceVideoRef, setSourceVideoRef] = useState("");
  const [clipDuration, setClipDuration] = useState("30");

  // Step 2 - Source & Assets
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedLibraryAssets, setSelectedLibraryAssets] = useState<Set<number>>(new Set());
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFilesInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  }, []);

  const applyPreset = (campaignId: string) => {
    const preset = availableCampaigns.find(c => c.id === campaignId);
    if (!preset) return;
    // If it's a real campaign (from Supabase), it has name/description but not the extra preset fields
    // Use PROJECT_DEFAULTS as fallback for the extra fields
    if ('brandGuidelines' in preset) {
      const p = preset as CampaignPreset;
      setBrandGuidelines(p.brandGuidelines);
      setTargetAudience(p.targetAudience);
      setWriterProfile(p.writerProfile);
      setWritingTone(p.writingTone);
      setWritingLevel(p.writingLevel);
      setWordCount(p.wordCountRange);
      setTopic((p.topics || '').split(",")[0].trim());
    } else {
      // Real campaign — use the default brand kit and writer profile data
      const defaultBrandKit = defaultBrandKitId
        ? brandKits.find(k => k.id === defaultBrandKitId)
        : brandKits[0];
      const defaultWriterProfile = defaultWriterProfileId
        ? writerProfiles.find(p => p.id === defaultWriterProfileId)
        : writerProfiles[0];

      if (defaultBrandKit) {
        setBrandGuidelines(buildBrandGuidelines(defaultBrandKit));
      } else {
        setBrandGuidelines(PROJECT_DEFAULTS.brandGuidelines);
      }
      setTargetAudience(defaultWriterProfile?.audience || PROJECT_DEFAULTS.targetAudience);

      if (defaultWriterProfile) {
        setWriterProfile(defaultWriterProfile.name);
        setWritingTone(defaultWriterProfile.tone || '');
        setWritingLevel(defaultWriterProfile.level || '');
        if (defaultWriterProfile.word_count) {
          setWordCount([defaultWriterProfile.word_count, defaultWriterProfile.word_count + 500] as [number, number]);
        } else {
          setWordCount([1200, 1700]);
        }
        if (defaultWriterProfile.topics && defaultWriterProfile.topics.length > 0) {
          setTopic(defaultWriterProfile.topics[0]);
        } else {
          setTopic(preset.description || "");
        }
      } else {
        setWriterProfile('');
        setWritingTone('');
        setWritingLevel('');
        setWordCount([1200, 1700]);
        setTopic(preset.description || "");
      }
    }
  };

  const clearPreset = () => {
    const defaultBrandKit = defaultBrandKitId
      ? brandKits.find(k => k.id === defaultBrandKitId)
      : brandKits[0];
    const defaultWriterProfile = defaultWriterProfileId
      ? writerProfiles.find(p => p.id === defaultWriterProfileId)
      : writerProfiles[0];

    if (defaultBrandKit) {
      setBrandGuidelines(buildBrandGuidelines(defaultBrandKit));
    } else {
      setBrandGuidelines(PROJECT_DEFAULTS.brandGuidelines);
    }
    setTargetAudience(defaultWriterProfile?.audience || PROJECT_DEFAULTS.targetAudience);

    if (defaultWriterProfile) {
      setWriterProfile(defaultWriterProfile.name);
      setWritingTone(defaultWriterProfile.tone || '');
      setWritingLevel(defaultWriterProfile.level || '');
      if (defaultWriterProfile.word_count) {
        setWordCount([defaultWriterProfile.word_count, defaultWriterProfile.word_count + 500] as [number, number]);
      } else {
        setWordCount([1200, 1700]);
      }
      if (defaultWriterProfile.topics && defaultWriterProfile.topics.length > 0) {
        setTopic(defaultWriterProfile.topics[0]);
      } else {
        setTopic('');
      }
    } else {
      setWriterProfile(PROJECT_DEFAULTS.writerProfile);
      setWritingTone('');
      setWritingLevel('');
      setWordCount([1200, 1700]);
      setTopic('');
    }
    setTitle('');
  };

  // Reset modal state when opening
  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setOriginMode("new");
    setSelectedCampaignId("");
    setQuantities({
      "wechat-article": initialType === "wechat-article" ? 1 : 0,
      "short-video": initialType === "short-video" ? 1 : 0,
      "live-clip": initialType === "live-clip" ? 1 : 0,
      "quote-card": initialType === "quote-card" ? 1 : 0,
      "ai-video": initialType === "ai-video" ? 1 : 0,
      "social-post": initialType === "social-post" ? 1 : 0,
      "carousel": 0,
    });
    setPlatformsByType({
      "wechat-article": new Set(),
      "short-video": new Set(),
      "live-clip": new Set(),
      "quote-card": new Set(),
      "ai-video": new Set(),
      "social-post": new Set(),
      "carousel": new Set(),
    });
    // Resolve default brand kit and writer profile from props
    const defaultBrandKit = defaultBrandKitId
      ? brandKits.find(k => k.id === defaultBrandKitId)
      : brandKits[0];
    const defaultWriterProfile = defaultWriterProfileId
      ? writerProfiles.find(p => p.id === defaultWriterProfileId)
      : writerProfiles[0];

    if (defaultBrandKit) {
      setBrandGuidelines(buildBrandGuidelines(defaultBrandKit));
    } else {
      setBrandGuidelines(PROJECT_DEFAULTS.brandGuidelines);
    }
    setTargetAudience(defaultWriterProfile?.audience || PROJECT_DEFAULTS.targetAudience);

    if (defaultWriterProfile) {
      setWriterProfile(defaultWriterProfile.name);
      setWritingTone(defaultWriterProfile.tone || '');
      setWritingLevel(defaultWriterProfile.level || '');
      if (defaultWriterProfile.word_count) {
        setWordCount([defaultWriterProfile.word_count, defaultWriterProfile.word_count + 500] as [number, number]);
      }
      if (defaultWriterProfile.topics && defaultWriterProfile.topics.length > 0) {
        setTopic(defaultWriterProfile.topics[0]);
      } else {
        setTopic('');
      }
    } else {
      setWriterProfile(PROJECT_DEFAULTS.writerProfile);
      setWritingTone('');
      setWritingLevel('');
    }
    setTitle('');
    setScheduleMode("immediate");
    setScheduleStart("");
    setScheduleEnd("");
    setShowResourcePicker(false);

    if (defaultCampaign) {
      const match = availableCampaigns.find(c => c.name === defaultCampaign);
      setOriginMode("campaign");
      setSelectedCampaignId(match?.id ?? "");
      if (match) applyPreset(match.id);
    }

    if (initialType) {
      setWordCount(initialType === "wechat-article" ? [1200, 1700] : [200, 300]);
    }

    // Pre-attach the dropped file into the Sources step
    setUploadedFile(defaultFile ?? null);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const writerProfileActive = (writerProfile || '').trim().length > 0;
  const voiceLabel = writerProfileActive ? writerProfile : writingTone;

  const canProceed = () => {
    if (step === 1) return originMode !== null && (originMode !== "campaign" || selectedCampaignId !== "");
    if (step === 2) return true; // Sources & Assets is optional
    if (step === 3) {
      if (grandTotal < 1) return false;
      for (const t of CONTENT_TYPES) {
        if (t.id === "wechat-article") continue;
        if (quantities[t.id] > 0 && platformsByType[t.id].size === 0) return false;
      }
      return true;
    }
    // Step 4 is the final review & configure step — always allow proceeding
    return true;
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4);
  const handleNext = () => {
    if (step === 1) {
      if (originMode === "campaign" && selectedCampaignId) applyPreset(selectedCampaignId);
      else clearPreset();
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else {
      // Step 4 — final step: create content
      // Compute scheduled dates based on schedule mode
      let scheduledDates: string[] | null = null;
      if (scheduleMode === "range" && scheduleStart && scheduleEnd) {
        const allPlatforms = new Set<string>();
        CONTENT_TYPES.forEach(t => {
if (quantities[t.id] > 0 && t.id !== "wechat-article") {
            platformsByType[t.id].forEach(p => allPlatforms.add(p));
          }
        });
        scheduledDates = distributeDates(grandTotal, scheduleStart, scheduleEnd, Array.from(allPlatforms));
      }

      onComplete({
        contentType: selectedType,
        quantities,
        platformsByType: Object.fromEntries(
          Object.entries(platformsByType).map(([k, v]) => [k, Array.from(v)])
        ),
        title, topic, writerProfile, writingTone, writingLevel,
        wordCount, brandGuidelines, targetAudience,
        quoteText, quoteSource, selectedTemplate,
        sourceVideoRef, clipDuration,
        grandTotal,
        uploadedFile, sourceUrl, selectedLibraryAssets, additionalFiles,
        campaign: originMode === "campaign" ? selectedCampaignId : null,
        scheduleMode,
        scheduleStart,
        scheduleEnd,
        scheduledDates,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-card w-full max-w-[720px] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground leading-tight mb-0.5">Create Content</h2>
            <p className="text-xs text-muted-foreground">{STEP_LABELS[step - 1]}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Step indicators ── */}
        <div className="flex items-center px-6 py-4 border-b border-border bg-background/20 flex-shrink-0">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const past = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={clsx(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0",
                      past
                        ? "bg-primary text-primary-foreground"
                        : active
                        ? "bg-primary/15 text-primary border-2 border-primary/40"
                        : "bg-secondary text-muted-foreground/50"
                    )}
                  >
                    {past ? <Check className="w-4 h-4" /> : n}
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-semibold whitespace-nowrap hidden sm:block",
                      active
                        ? "text-foreground"
                        : past
                        ? "text-foreground/60"
                        : "text-muted-foreground/40"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < 4 && (
                  <div className="flex-1 h-px mx-3 bg-border overflow-hidden">
                    <div
                      className={clsx(
                        "h-full bg-primary transition-all duration-500",
                        past ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ═══ Step 1: How to Create ═══ */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">How would you like to create content?</h3>
                <p className="text-sm text-muted-foreground">Start fresh or pull settings from an existing campaign.</p>
              </div>

              {/* Two option cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Brand New */}
                <button
                  onClick={() => setOriginMode("new")}
                  className={clsx(
                    "relative text-left p-5 rounded-xl border-2 transition-all",
                    originMode === "new"
                      ? "border-primary bg-primary/[0.06]"
                      : "border-border bg-card hover:border-border/60 hover:bg-white/[0.02]"
                  )}
                >
                  {originMode === "new" && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[#60A5FA]/10 border border-[#60A5FA]/20">
                    <Zap className="w-6 h-6 text-[#60A5FA]" />
                  </div>
                  <div className="pr-8">
                    <div className="text-sm font-bold text-foreground mb-1">Brand New</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] mb-2">Start Fresh</div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      All fields start empty. Build from scratch with no pre-filled settings.
                    </div>
                  </div>
                </button>

                {/* From Existing Campaign */}
                <button
                  onClick={() => setOriginMode("campaign")}
                  className={clsx(
                    "relative text-left p-5 rounded-xl border-2 transition-all",
                    originMode === "campaign"
                      ? "border-primary bg-primary/[0.06]"
                      : "border-border bg-card hover:border-border/60 hover:bg-white/[0.02]"
                  )}
                >
                  {originMode === "campaign" && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-[#4B56F2]/10 border border-[#4B56F2]/20">
                    <Layers className="w-6 h-6 text-[#4B56F2]" />
                  </div>
                  <div className="pr-8">
                    <div className="text-sm font-bold text-foreground mb-1">From Existing Campaign</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#4B56F2] mb-2">Pre-filled Settings</div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      Load a campaign&apos;s brand guidelines, audience, and settings automatically.
                    </div>
                  </div>
                </button>
              </div>

              {/* Campaign dropdown — shown when "From Existing Campaign" is selected */}
              {originMode === "campaign" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Select Campaign</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <select
                        value={selectedCampaignId}
                        onChange={e => setSelectedCampaignId(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
                      >
                        <option value="">— Select a campaign —</option>
                        {availableCampaigns.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Campaign preview card */}
                  {selectedCampaignId && (() => {
                    const preset = availableCampaigns.find(c => c.id === selectedCampaignId);
                    if (!preset) return null;
                    // Show full preview card for hardcoded presets, simple preview for real campaigns
                    if ('brandGuidelines' in preset) {
                      return <CampaignPreviewCard key={preset.id} preset={preset as CampaignPreset} />;
                    }
                    // Real campaign — show a simple preview
                    return (
                      <div className="rounded-xl border border-border bg-background/30 overflow-hidden">
                        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
                          <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">{preset.name}</p>
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                            Will pre-fill
                          </span>
                        </div>
                        {preset.description && (
                          <div className="px-4 pb-4">
                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Description</p>
                            <p className="text-sm text-foreground leading-snug">{preset.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Unassigned note */}
              <p className="text-xs text-muted-foreground/50">
                Content can remain unassigned to any campaign — you can link it later.
              </p>
            </div>
          )}

          {/* ═══ Step 2: Sources & Assets ═══ */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Add source material and resources</h3>
                <p className="text-sm text-muted-foreground">Provide references and assets to guide content generation. This step is optional.</p>
              </div>

              {/* Section: Main Content Source */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Main Content Source</h4>
                  <span className="text-xs text-muted-foreground font-medium">(Optional)</span>
                </div>

                {/* Drop zone */}
                <div
                  className={clsx(
                    "relative rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer mb-3",
                    isDragOver
                      ? "border-primary bg-primary/[0.04]"
                      : uploadedFile
                      ? "border-primary/30 bg-primary/[0.02] cursor-default"
                      : "border-border hover:border-border/60 hover:bg-white/[0.01]"
                  )}
                  style={{ minHeight: 160 }}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => !uploadedFile && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.mp3,.wav,.m4a"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setUploadedFile(f);
                    }}
                  />

                  {uploadedFile ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-foreground mb-1">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                        >
                          Replace
                        </button>
                        <span className="text-border select-none">·</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                          className="text-red-400/70 hover:text-red-400 transition-colors font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                      <div
                        className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-150",
                          isDragOver ? "bg-primary/15 scale-110" : "bg-secondary"
                        )}
                      >
                        <Upload
                          className={clsx(
                            "w-5 h-5 transition-colors",
                            isDragOver ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {isDragOver ? "Drop to upload" : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs text-muted-foreground/60">Upload video, documents, images or audio</p>
                    </div>
                  )}
                </div>

                {/* OR divider */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground/50 font-semibold uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* URL input */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">Paste a link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/article or YouTube URL..."
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { setUploadedFile(null); setSourceUrl(""); }}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Skip — no main source to provide
                </button>

                {/* OR divider before library */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground/50 font-semibold uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Select from Library — opens ResourcePicker */}
                <div>
                  <button
                    onClick={() => setShowResourcePicker(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left border-border hover:border-border/60 hover:bg-white/[0.01]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground">Select from Library</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedLibraryAssets.size > 0
                          ? `${selectedLibraryAssets.size} resource${selectedLibraryAssets.size !== 1 ? "s" : ""} selected`
                          : "Choose existing resources from your library"}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <ResourcePicker
                  isOpen={showResourcePicker}
                  onClose={() => setShowResourcePicker(false)}
                  selectedIds={Array.from(selectedLibraryAssets).map(String)}
                  onSelect={(ids) => setSelectedLibraryAssets(new Set(ids.map(Number)))}
                />
              </div>  {/* end Main Content Source */}
            </div>
          )}

          {/* ═══ Step 3: Content Type ═══ */}
          {step === 3 && (
            <div className="p-0 flex flex-col h-full">
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-lg font-bold text-foreground">Review your content batch</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {grandTotal} item{grandTotal !== 1 ? "s" : ""} will be generated immediately after you click Create Content
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
                {/* Batch list container */}
                <div className="rounded-[20px] border border-white/[0.08] bg-black/30 overflow-hidden">
                  {/* Batch badge */}
                  <div className="flex items-center gap-2 border-b border-white/[0.05] bg-white/[0.02] px-5 py-2.5">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/75">
                      Batch — {grandTotal} item{grandTotal !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Content type rows */}
                  {CONTENT_TYPES.map((type, idx) => {
                    const qty = quantities[type.id];
                    const Icon = type.Icon;
                    const itemCount = getTypeItemCount(type.id);
                    const hasPlatforms = type.id !== "wechat-article";
                    const platforms = platformsByType[type.id];
                    const rowBorder = idx < CONTENT_TYPES.length - 1 ? "border-b border-white/[0.05]" : "";

                    const showBadge = type.id === "wechat-article" || type.id === "carousel";
                    const badgeLabel = type.id === "wechat-article" ? type.sublabel : type.id === "carousel" ? "CAROUSEL" : "";
                    const badgeStyle = type.id === "carousel"
                      ? { borderColor: `${type.color}80`, backgroundColor: `${type.color}40`, color: type.color }
                      : { borderColor: `${type.color}4D`, backgroundColor: "rgba(10,10,10,0.5)", color: "var(--muted-foreground)" };

                    return (
                      <div key={type.id}>
                        {/* Main row */}
                        <div className={clsx("flex items-center justify-between px-5 py-3", rowBorder)}>
                          {/* Left: icon + info */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${type.color}1A`, border: `1px solid ${type.color}33` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: type.color }} />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground leading-none">{type.label}</span>
                                {showBadge && (
                                  <span
                                    className="text-[9px] font-black uppercase tracking-wider rounded px-[5px] py-px"
                                    style={{
                                      border: `1px solid ${badgeStyle.borderColor}`,
                                      backgroundColor: badgeStyle.backgroundColor,
                                      color: badgeStyle.color,
                                    }}
                                  >
                                    {badgeLabel}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground truncate">
                                {type.id === "wechat-article"
                                  ? `${qty > 0 ? type.description + " · " + wordCount[0] + "–" + wordCount[1] + " words" : type.description}`
                                  : type.description}
                              </span>
                            </div>
                          </div>

                          {/* Right: stepper + count */}
                          <div className="flex items-center gap-5 flex-shrink-0">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => changeQty(type.id, -1)}
                                disabled={qty === 0}
                                className={clsx(
                                  "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                                  qty === 0
                                    ? "bg-secondary/50 text-muted-foreground/30 cursor-not-allowed"
                                    : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                                )}
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className={clsx(
                                "w-4 text-center text-sm font-bold tabular-nums select-none",
                                qty > 0 ? "text-foreground" : "text-muted-foreground/40"
                              )}>{qty}</span>
                              <button
                                onClick={() => changeQty(type.id, 1)}
                                className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center transition-all hover:bg-secondary/80 text-muted-foreground"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <span className={clsx(
                              "text-[13px] font-semibold tabular-nums w-[60px] text-right",
                              itemCount > 0 ? "text-foreground/90" : "text-muted-foreground/30"
                            )}>
                              {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>

                        {/* Platform pills — shown when qty > 0 and type supports platforms */}
                        {qty > 0 && hasPlatforms && (
                          <div className={clsx(
                            "flex flex-wrap gap-2 px-5 pb-3 pt-1 pl-[44px]",
                            idx < CONTENT_TYPES.length - 1 ? "border-b border-white/[0.05]" : ""
                          )}>
                            {SOCIAL_PLATFORMS.map((p) => {
                              const active = platforms.has(p.id);
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => togglePlatformForType(type.id, p.id)}
                                  className={clsx(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all",
                                    active
                                      ? "border border-primary bg-primary/10 text-foreground"
                                      : "border border-white/[0.08] bg-white/[0.02] text-muted-foreground/60 hover:bg-white/[0.04]"
                                  )}
                                >
                                  <span className="text-[11px] font-semibold leading-[13px]">{p.label}</span>
                                  {active && (
                                    <span className="flex items-center justify-center w-[9px] h-[9px] rounded-full bg-primary/80" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Brand kit hint */}
                  <div className="flex items-center gap-2 px-5 py-2.5">
                    <span className="w-3 h-3 rounded-full bg-primary/15 flex-shrink-0" />
                    <span className="text-[11px] text-muted-foreground/50">
                      {(brandGuidelines || '').trim() || "Load a brand kit to auto-fill guidelines, tone, and style"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 4: Review & Configure ═══ */}
          {step === 4 && (() => {
            const hasTextTypes = quantities["wechat-article"] > 0 || quantities["social-post"] > 0 || quantities["quote-card"] > 0 || quantities["carousel"] > 0;
            const batchTypes = CONTENT_TYPES.filter(t => quantities[t.id] > 0);
            const totalCost = CONTENT_TYPES.reduce((sum, t) => {
              const q = quantities[t.id] ?? 0;
              if (t.id === "wechat-article") return sum + t.credits * q;
              const platforms = platformsByType[t.id];
              const platformCount = Math.max(1, platforms.size);
              return sum + t.credits * q * platformCount;
            }, 0);

            return (
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* ── Header ── */}
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Review & configure your batch</h3>
                <p className="text-sm text-muted-foreground">
                  Shared settings apply to all {grandTotal} item{grandTotal !== 1 ? "s" : ""}. Review everything below before creating.
                </p>
              </div>

              {/* ── Shared Settings ─────────────────────────────────── */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-secondary/40 border-b border-border flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/60">Shared Settings</span>
                  <span className="text-[10px] text-muted-foreground/40 font-medium">— applies to all items</span>
                </div>
                <div className="p-4 space-y-4">
                  {/* Topic */}
                  <div>
                    <FieldLabel label="Batch Topic" />
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Summer collection launch and performance innovation"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    />
                    {/* Topic suggestions from writer profile */}
                    {(() => {
                      const selectedProfile = writerProfiles.find(p => p.name === writerProfile);
                      if (!selectedProfile?.topics?.length) return null;
                      return (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[10px] text-muted-foreground/50 self-center mr-1">Suggestions:</span>
                          {selectedProfile.topics.map((t) => (
                            <button
                              key={t}
                              onClick={() => setTopic(t)}
                              className={clsx(
                                "px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors",
                                topic === t
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-border/80"
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Writer Profile — for text-producing types */}
                  {hasTextTypes && (
                    <div>
                      <FieldLabel label="Writer Profile" defaulted />
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <select
                          value={writerProfile}
                          onChange={(e) => {
                            const name = e.target.value;
                            setWriterProfile(name);
                            if (name) {
                              const profile = writerProfiles.find(p => p.name === name);
                              if (profile) {
                                setWritingTone(profile.tone || '');
                                setWritingLevel(profile.level || '');
                                if (profile.word_count) {
                                  setWordCount([profile.word_count, profile.word_count + 500] as [number, number]);
                                }
                                if (profile.topics && profile.topics.length > 0) {
                                  setTopic(profile.topics[0]);
                                }
                              }
                            } else {
                              setWritingTone('');
                              setWritingLevel('');
                            }
                          }}
                          className="w-full pl-11 pr-10 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
                        >
                          <option value="">No writer profile — set tone manually</option>
                          {writerProfileNames.map((name) => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {writerProfileActive && (
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          Tone & Level managed by profile ·{" "}
                          <button
                            onClick={() => setWriterProfile("")}
                            className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium"
                          >
                            clear to set manually
                          </button>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tone + Level — only when writer profile is cleared */}
                  {hasTextTypes && !writerProfileActive && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FieldLabel label="Writing Tone" />
                        <div className="relative">
                          <select
                            value={writingTone}
                            onChange={(e) => setWritingTone(e.target.value)}
                            className="w-full pr-10 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
                          >
                            <option value="">Select tone...</option>
                            {writingTones.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel label="Writing Level" />
                        <div className="relative">
                          <select
                            value={writingLevel}
                            onChange={(e) => setWritingLevel(e.target.value)}
                            className="w-full pr-10 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none"
                          >
                            <option value="">Select level...</option>
                            {writingLevels.map((l) => (
                              <option key={l} value={l}>{l}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Brand Guidelines */}
                  <div>
                    <FieldLabel label="Brand Guidelines" defaulted />
                    <textarea
                      value={brandGuidelines}
                      onChange={(e) => setBrandGuidelines(e.target.value)}
                      placeholder="Describe your brand voice, style guidelines, and any dos/don'ts..."
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* ── WeChat Article ─────────────────────────────────────── */}
              {quantities["wechat-article"] > 0 && (() => {
                const t = CONTENT_TYPES.find(x => x.id === "wechat-article")!;
                return (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 border-b border-border">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                        <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">{t.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${t.color}18`, color: t.color }}>×{quantities["wechat-article"]}</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <FieldLabel label="Title" optional />
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., The Complete Guide to Summer Athletic Training"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <WordCountRangeSelector contentForm="wechat-article" value={wordCount} onChange={setWordCount} />
                    </div>
                  </div>
                );
              })()}

              {/* ── Short Video ──────────────────────────────────────── */}
              {quantities["short-video"] > 0 && (() => {
                const t = CONTENT_TYPES.find(x => x.id === "short-video")!;
                return (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 border-b border-border">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                        <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">{t.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${t.color}18`, color: t.color }}>×{quantities["short-video"]}</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <FieldLabel label="Source Video Reference" />
                        <input
                          type="text"
                          value={sourceVideoRef}
                          onChange={(e) => setSourceVideoRef(e.target.value)}
                          placeholder="e.g., Summer Campaign Video - Main Edit"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div>
                        <FieldLabel label="Clip Duration (seconds)" />
                        <input
                          type="number"
                          value={clipDuration}
                          onChange={(e) => setClipDuration(e.target.value)}
                          placeholder="30"
                          min="5"
                          max="180"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Quote Card ──────────────────────────────────────── */}
              {quantities["quote-card"] > 0 && (() => {
                const t = CONTENT_TYPES.find(x => x.id === "quote-card")!;
                return (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 border-b border-border">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                        <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">{t.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${t.color}18`, color: t.color }}>×{quantities["quote-card"]}</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <FieldLabel label="Quote Text" />
                        <textarea
                          value={quoteText}
                          onChange={(e) => setQuoteText(e.target.value)}
                          placeholder="Enter the quote you want to display..."
                          rows={3}
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
                        />
                      </div>
                      <div>
                        <FieldLabel label="Source Attribution" optional />
                        <input
                          type="text"
                          value={quoteSource}
                          onChange={(e) => setQuoteSource(e.target.value)}
                          placeholder="e.g., Velocity Athletics Team"
                          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div>
                        <FieldLabel label="Template" />
                        <div className="grid grid-cols-3 gap-2">
                          {QUOTE_TEMPLATES.map((tmpl) => (
                            <button
                              key={tmpl}
                              onClick={() => setSelectedTemplate(tmpl)}
                              className={clsx(
                                "px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all",
                                selectedTemplate === tmpl
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-card"
                              )}
                            >
                              {tmpl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Social Post ─────────────────────────────────────── */}
              {quantities["social-post"] > 0 && (() => {
                const t = CONTENT_TYPES.find(x => x.id === "social-post")!;
                const selectedPlatforms = platformsByType["social-post"];
                return (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 border-b border-border">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                        <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">{t.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${t.color}18`, color: t.color }}>×{quantities["social-post"]}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-bold text-foreground mb-2">Platforms <span className="font-normal text-muted-foreground">(configured in previous step)</span></p>
                      <div className="flex flex-wrap gap-2">
                        {SOCIAL_PLATFORMS.filter(p => selectedPlatforms.has(p.id)).map(p => {
                          const PIcon = p.Icon;
                          return (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
                              <PIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.color === "#010101" || p.color === "#000000" ? "var(--foreground)" : p.color }} />
                              <span className="text-xs font-semibold text-foreground">{p.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-muted-foreground/50 mt-2">Format and length adapted per platform automatically.</p>
                    </div>
                  </div>
                );
              })()}

              {/* ── Carousel ──────────────────────────────────────── */}
              {quantities["carousel"] > 0 && (() => {
                const t = CONTENT_TYPES.find(x => x.id === "carousel")!;
                const selectedPlatforms = platformsByType["carousel"];
                return (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 border-b border-border">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                        <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">{t.label}</span>
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${t.color}18`, color: t.color }}>×{quantities["carousel"]}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-bold text-foreground mb-2">Platforms <span className="font-normal text-muted-foreground">(configured in previous step)</span></p>
                      <div className="flex flex-wrap gap-2">
                        {SOCIAL_PLATFORMS.filter(p => selectedPlatforms.has(p.id)).map(p => {
                          const PIcon = p.Icon;
                          return (
                            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
                              <PIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.color === "#010101" || p.color === "#000000" ? "var(--foreground)" : p.color }} />
                              <span className="text-xs font-semibold text-foreground">{p.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-muted-foreground/50 mt-2">Multi-slide posts adapted per platform automatically.</p>
                    </div>
                  </div>
                );
              })()}

              {/* ── Auto-resolved types (no extra config needed) ─────── */}
              {(quantities["live-clip"] > 0 || quantities["ai-video"] > 0) && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 bg-secondary/40 border-b border-border">
                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/60">Auto-Resolved</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {quantities["live-clip"] > 0 && (() => {
                      const t = CONTENT_TYPES.find(x => x.id === "live-clip")!;
                      return (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                            <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                          </div>
                          <span className="text-sm font-semibold text-foreground flex-1">{t.label} <span className="text-muted-foreground font-normal">×{quantities["live-clip"]}</span></span>
                          <span className="text-xs text-muted-foreground/60">Curated from sources automatically</span>
                        </div>
                      );
                    })()}
                    {quantities["ai-video"] > 0 && (() => {
                      const t = CONTENT_TYPES.find(x => x.id === "ai-video")!;
                      return (
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}>
                            <t.Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                          </div>
                          <span className="text-sm font-semibold text-foreground flex-1">{t.label} <span className="text-muted-foreground font-normal">×{quantities["ai-video"]}</span></span>
                          <span className="text-xs text-muted-foreground/60">Generated from topic & guidelines</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="border-t border-border/60" />

              {/* ── Batch manifest ─────────────────────────────────── */}
              <div className="rounded-xl border border-border overflow-hidden bg-background/30">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/20">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/70">
                      Batch — {grandTotal} item{grandTotal !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {topic && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{topic}</span>
                  )}
                </div>

                {/* One row per selected content type */}
                {batchTypes.map((t, idx) => {
                  const isLast = idx === batchTypes.length - 1;
                  const itemCount = getTypeItemCount(t.id);
                  const selectedPlatforms = platformsByType[t.id];
                  return (
                    <div
                      key={t.id}
                      className={clsx("px-5 py-4", !isLast && "border-b border-border/60")}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${t.color}1A`, border: `1px solid ${t.color}30` }}
                        >
                          <t.Icon className="w-[18px] h-[18px]" style={{ color: t.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-foreground">{t.label}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: t.color }}>{t.sublabel}</span>
                            <span className="ml-auto text-xs font-bold text-foreground/70 tabular-nums flex-shrink-0">
                              {itemCount} item{itemCount !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Type-specific detail summary */}
                          {t.id === "wechat-article" && (
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Hash className="w-3 h-3" />{wordCount[0]}–{wordCount[1]} words</span>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Feather className="w-3 h-3" />{voiceLabel || "Default voice"}</span>
                              {title && <span className="text-[11px] text-muted-foreground/60 truncate max-w-[200px]">"{title}"</span>}
                            </div>
                          )}
                          {t.id === "short-video" && (
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{clipDuration}s per clip</span>
                              {sourceVideoRef && <span className="text-[11px] text-muted-foreground/60 truncate max-w-[200px]">{sourceVideoRef}</span>}
                            </div>
                          )}
                          {t.id === "quote-card" && (
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1"><LayoutGrid className="w-3 h-3" />{selectedTemplate}</span>
                              {quoteText && <span className="text-[11px] text-muted-foreground/60 italic truncate max-w-[220px]">"{quoteText.slice(0, 60)}{quoteText.length > 60 ? "…" : ""}"</span>}
                            </div>
                          )}
                          {(t.id === "social-post" || t.id === "carousel") && selectedPlatforms.size > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              {SOCIAL_PLATFORMS.filter(p => selectedPlatforms.has(p.id)).map(p => {
                                const PIcon = p.Icon;
                                return (
                                  <div key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-border">
                                    <PIcon className="w-3 h-3" style={{ color: p.color === "#010101" || p.color === "#000000" ? "var(--foreground)" : p.color }} />
                                    <span className="text-[10px] font-semibold text-foreground">{p.label}</span>
                                    {quantities[t.id] > 1 && <span className="text-[9px] text-muted-foreground">×{quantities[t.id]}</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {t.id === "live-clip" && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3" />60–90s compilation, auto-curated</span>
                          )}
                          {t.id === "ai-video" && (
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Wand2 className="w-3 h-3" />AI-generated from topic & guidelines</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Shared context footer */}
                <div className="border-t border-border/60 px-5 py-3 bg-secondary/10 flex items-center gap-4 flex-wrap">
                  {writerProfile && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span>{writerProfile}</span>
                    </div>
                  )}
                  {brandGuidelines && (
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
                      <AlignLeft className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{brandGuidelines.slice(0, 60)}{brandGuidelines.length > 60 ? "…" : ""}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Summary stats ─────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    Icon: Clock,
                    label: "Est. Time",
                    value: (() => {
                      const mins = batchTypes.reduce((sum, t) => {
                        const q = getTypeItemCount(t.id);
                        const perItem = t.id === "wechat-article" ? 3 : t.id === "short-video" ? 5 : t.id === "live-clip" ? 2 : t.id === "social-post" ? 1 : 1;
                        return sum + q * perItem;
                      }, 0);
                      return `~${mins} min`;
                    })(),
                    accent: false,
                  },
                  {
                    Icon: Coins,
                    label: "Credit Cost",
                    value: `${totalCost} credits`,
                    accent: true,
                  },
                  {
                    Icon: Target,
                    label: "Sources",
                    value: `${(uploadedFile ? 1 : 0) + (sourceUrl ? 1 : 0) + selectedLibraryAssets.size + additionalFiles.length}`,
                    accent: false,
                  },
                ].map(({ Icon, label, value, accent }) => (
                  <div key={label} className="rounded-xl bg-secondary/40 border border-border p-4 text-center">
                    <Icon className={clsx("w-4 h-4 mx-auto mb-2", accent ? "text-primary" : "text-muted-foreground")} />
                    <div className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold mb-1">{label}</div>
                    <div className={clsx("text-sm font-bold truncate", accent ? "text-primary" : "text-foreground")}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Credit balance */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4B56F2]/[0.06] border border-[#4B56F2]/[0.15]">
                <Coins className="w-4 h-4 text-[#818CFF] flex-shrink-0" />
                <span className="text-sm text-foreground/80">
                  Balance:{" "}
                  <span className="font-bold text-[#818CFF]">{CREDIT_BALANCE} credits</span>
                  {" "}→ after generation:{" "}
                  <span className="font-bold text-foreground">{CREDIT_BALANCE - totalCost} credits</span>
                </span>
              </div>

              {/* ── Scheduling Section ───────────────────────────── */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary/40 border-b border-border">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/60">Schedule</span>
                </div>
                <div className="p-4 space-y-4">
                  {/* Mode selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "immediate" as ScheduleMode, label: "Generate Now", desc: "Create immediately" },
                      { value: "range" as ScheduleMode, label: "Date Range", desc: "Spread across dates" },
                      { value: "unscheduled" as ScheduleMode, label: "Save as Draft", desc: "Not yet scheduled" },
                    ].map(({ value, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setScheduleMode(value)}
                        className={clsx(
                          "text-left px-3 py-2.5 rounded-lg border-2 transition-all",
                          scheduleMode === value
                            ? "border-primary bg-primary/[0.06]"
                            : "border-border bg-secondary/40 hover:border-border/60"
                        )}
                      >
                        <div className="text-xs font-bold text-foreground">{label}</div>
                        <div className="text-[10px] text-muted-foreground/60 mt-0.5">{desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Date range pickers — only shown for "range" mode */}
                  {scheduleMode === "range" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1.5">Start Date</label>
                        <input
                          type="date"
                          value={scheduleStart}
                          min={todayStr()}
                          onChange={(e) => {
                            const val = e.target.value;
                            setScheduleStart(val);
// Auto-set end to start + 7 days if not set
                            if (!scheduleEnd && val) {
                              setScheduleEnd(addDays(val, 7));
                            }
                          }}
                          className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground block mb-1.5">End Date</label>
                        <input
                          type="date"
                          value={scheduleEnd}
                          min={scheduleStart || todayStr()}
                          onChange={(e) => setScheduleEnd(e.target.value)}
                          className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Distribution preview */}
                  {scheduleMode === "range" && scheduleStart && scheduleEnd && (() => {
                    const allPlatforms = new Set<string>();
                    CONTENT_TYPES.forEach(t => {
if (quantities[t.id] > 0 && t.id !== "wechat-article") {
                        platformsByType[t.id].forEach(p => allPlatforms.add(p));
                      }
                    });
                    const platformIds = Array.from(allPlatforms);
                    const dates = distributeDates(grandTotal, scheduleStart, scheduleEnd, platformIds);
                    const numDays = dates.length > 0
                      ? new Set(dates.map(d => d.split("T")[0])).size
                      : 0;
                    return (
                      <div className="rounded-lg bg-secondary/30 border border-border/60 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">Distribution Preview</span>
                          <span className="text-muted-foreground">
                            {dates.length} item{dates.length !== 1 ? "s" : ""} across {numDays} day{numDays !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {dates.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {(() => {
// Group by date
                              const grouped: Record<string, number> = {};
                              dates.forEach(d => {
                                const key = d.split("T")[0];
                                grouped[key] = (grouped[key] || 0) + 1;
                              });
// Show a subset if too many days
                              const entries = Object.entries(grouped);
                              const maxVisible = 10;
                              const visible = entries.slice(0, maxVisible);
                              const remaining = entries.length - maxVisible;
                              return (
                                <>
                                  {visible.map(([date, count]) => (
                                    <span
                                      key={date}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/60 border border-border/60 text-[10px] font-medium text-muted-foreground"
                                    >
                                      {date}
                                      <span className="text-primary font-bold">×{count}</span>
                                    </span>
                                  ))}
                                  {remaining > 0 && (
                                    <span className="text-[10px] text-muted-foreground/50 px-1">
                                      +{remaining} more day{remaining !== 1 ? "s" : ""}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                        {dates.length < grandTotal && (
                          <p className="text-[10px] text-amber-400/70 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {grandTotal - dates.length} item{(grandTotal - dates.length) !== 1 ? "s" : ""} excluded due to platform daily limits
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            );
          })()}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/60 flex-shrink-0">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            {step > 1 && <ArrowLeft className="w-4 h-4" />}
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {([1, 2, 3, 4] as const).map((s) => (
              <div
                key={s}
                className={clsx(
                  "rounded-full transition-all duration-300",
                  s === step
                    ? "w-6 h-2 bg-primary"
                    : s < step
                    ? "w-2 h-2 bg-primary/50"
                    : "w-2 h-2 bg-border"
                )}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all",
              step === 4
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_4px_rgba(75,86,242,0.12)]"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              !canProceed() && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {step === 4 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Create Content
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
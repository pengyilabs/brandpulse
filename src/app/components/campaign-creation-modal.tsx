import { useState, useCallback, useRef, useMemo } from "react";
import {
  X, Upload, Link as LinkIcon, FileText, Video, ImageIcon, LayoutGrid,
  Check, Sparkles, Flag, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Target, ArrowLeft, GripVertical, Quote, Scissors, Star,
  Wand2, Plus, Minus, Folder, TrendingUp, Users, ShoppingCart,
  Lightbulb, Award, Hash, AlertCircle, Layers, Cloud, Archive, HardDrive,
} from "lucide-react";
import { clsx } from "clsx";

// Social platforms
type SocialPlatformId = "instagram" | "facebook" | "linkedin" | "twitter" | "tiktok" | "youtube";

interface SocialPlatform {
  id: SocialPlatformId;
  label: string;
  color: string;
  Icon: React.ElementType;
  textLength: string;
  dimensions: string;
  toneNote: string;
}

const PLATFORM_ICON_STYLE = {
  instagram: { color: "#E11D48", Icon: ImageIcon },
  facebook: { color: "#010101", Icon: LayoutGrid },
  linkedin: { color: "#0A66C2", Icon: LayoutGrid },
  twitter: { color: "#000000", Icon: LayoutGrid },
  tiktok: { color: "#FE2C55", Icon: Video },
  youtube: { color: "#FF0000", Icon: Video },
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "instagram", label: "Instagram", color: "#E11D48", Icon: PLATFORM_ICON_STYLE.instagram.Icon,
    textLength: "Up to 2,200 characters", dimensions: "1080×1080", toneNote: "Visual, lifestyle-first" },
  { id: "facebook", label: "Facebook", color: "#010101", Icon: PLATFORM_ICON_STYLE.facebook.Icon,
    textLength: "Up to 5,000 characters", dimensions: "1200×630", toneNote: "Conversational, community" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", Icon: PLATFORM_ICON_STYLE.linkedin.Icon,
    textLength: "Up to 3,000 characters", dimensions: "1200×628", toneNote: "Professional, thought-leader" },
  { id: "twitter", label: "X (Twitter)", color: "#000000", Icon: PLATFORM_ICON_STYLE.twitter.Icon,
    textLength: "Up to 280 characters", dimensions: "1200×675", toneNote: "Snappy, provocative" },
  { id: "tiktok", label: "TikTok", color: "#FE2C55", Icon: PLATFORM_ICON_STYLE.tiktok.Icon,
    textLength: "Up to 2,200 characters", dimensions: "1080×1920", toneNote: "Trend-aware, short hook" },
  { id: "youtube", label: "YouTube", color: "#FF0000", Icon: PLATFORM_ICON_STYLE.youtube.Icon,
    textLength: "Up to 5,000 characters", dimensions: "1280×720", toneNote: "In-depth, story-driven" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: any) => void;
}

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
    label: "Awareness & Education",
    sublabel: "Top of Funnel",
    color: "#3B82F6",
    Icon: Lightbulb,
    description: "Introduces your brand, educates the audience, and builds recognition",
  },
  {
    id: "consideration" as FunnelStage,
    label: "Social Proof & Relationships",
    sublabel: "Middle of Funnel",
    color: "#F59E0B",
    Icon: Users,
    description: "Showcases testimonials, case studies, and builds trust with your audience",
  },
  {
    id: "conversion" as FunnelStage,
    label: "Conversion",
    sublabel: "Bottom of Funnel",
    color: "#4B56F2",
    Icon: ShoppingCart,
    description: "Drives action with offers, demos, and direct calls-to-action",
  },
];

const PROJECT_TOPICS = [
  "Performance Innovation",
  "Athlete Stories",
  "Training Tips",
  "Product Launches",
  "Community Engagement",
  "Sustainability",
];

const LIBRARY_ASSETS = [
  { id: 1, name: "Brand Logo Pack.zip", type: "zip", size: "2.4 MB" },
  { id: 2, name: "Summer Campaign Video.mp4", type: "video", size: "124 MB" },
  { id: 3, name: "Product Photography.pdf", type: "pdf", size: "8.1 MB" },
  { id: 4, name: "Brand Guidelines 2026.pdf", type: "pdf", size: "3.2 MB" },
  { id: 5, name: "Athlete Footage Raw.mp4", type: "video", size: "890 MB" },
  { id: 6, name: "Campaign Brief Q3.docx", type: "doc", size: "540 KB" },
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

const STEP_LABELS = [
  "Campaign Details",
  "Source Material",
  "Content Type Mix",
  "Calendar Preview",
  "Funnel Stage",
  "Topics",
  "Review & Create",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

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

function buildCalendarGrid(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(toDateStr(d.getFullYear(), d.getMonth(), d.getDate()));
  }

  return dates;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CampaignCreationModal({ isOpen, onClose, onComplete }: CampaignCreationModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number>(1);
  const step = currentStep;

  // Step 1 - Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateMode, setDateMode] = useState<"date-range" | "duration">("duration");
  const [durationType, setDurationType] = useState<"days" | "weeks" | "months">("weeks");
  const [durationValue, setDurationValue] = useState("4");

  // Step 2 - Source Material
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedLibraryAssets, setSelectedLibraryAssets] = useState<Set<number>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Library tabs
  const [librarySource, setLibrarySource] = useState<LibrarySource>("library");
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<Set<string>>(new Set());
  const [selectedDropboxFiles, setSelectedDropboxFiles] = useState<Set<string>>(new Set());
  // Local device uploads for library tab
  const [extraUploads, setExtraUploads] = useState<File[]>([]);
  const extraFileInputRef = useRef<HTMLInputElement>(null);
  // Add Resources dialog (same as Resources page)
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryDraftAssets, setLibraryDraftAssets] = useState<Set<number>>(new Set());
  const [libraryDraftDrive, setLibraryDraftDrive] = useState<Set<string>>(new Set());
  const [libraryDraftDropbox, setLibraryDraftDropbox] = useState<Set<string>>(new Set());

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

  // Step 4 - Calendar Preview
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  // Step 5 - Funnel Stage Assignment
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<FunnelStage>("awareness");
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());

  // Step 6 - Topics
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(PROJECT_TOPICS.slice(0, 3)));
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState("");

  // Drag handlers
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

  const toggleLibraryAsset = (id: number) => {
    const newSet = new Set(selectedLibraryAssets);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedLibraryAssets(newSet);
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

  const addCustomTopic = () => {
    if (newTopicInput.trim() && !customTopics.includes(newTopicInput.trim())) {
      setCustomTopics([...customTopics, newTopicInput.trim()]);
      setSelectedTopics(new Set([...selectedTopics, newTopicInput.trim()]));
      setNewTopicInput("");
    }
  };

  // Generate scheduled items when moving to step 4
  const generateScheduledItems = () => {
    if (scheduledItems.length > 0) return; // Already generated

    const dates = buildCalendarGrid(startDate, endDate);
    const items: ScheduledItem[] = [];
    let itemId = 1;

    // Create items based on content type counts × platforms
    CONTENT_TYPES.forEach((type) => {
      const qty = contentTypeCounts[type.id];
      const platforms = type.hasPlatforms ? Array.from(platformsByType[type.id]) : [undefined];
      const platformsToUse = platforms.length > 0 ? platforms : [undefined];
      for (let i = 0; i < qty; i++) {
        platformsToUse.forEach((platform) => {
          items.push({
            id: itemId++,
            date: dates[Math.floor((items.length / (dates.length || 1)) * dates.length)] || dates[0],
            typeId: type.id,
            topic: `${type.label} ${i + 1}${platform ? " · " + SOCIAL_PLATFORMS.find(p => p.id === platform)?.label : ""}`,
            funnelStage: undefined,
            platform,
          });
        });
      }
    });

    // Distribute items evenly across dates
    const totalItems = items.length;
    const totalDates = dates.length;
    items.forEach((item, idx) => {
      const dateIndex = Math.floor((idx / totalItems) * totalDates);
      item.date = dates[dateIndex] || dates[0];
    });

    setScheduledItems(items);
  };

  const handleItemDrag = (itemId: number, newDate: string) => {
    setScheduledItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, date: newDate } : item
      )
    );
  };

  const assignFunnelStageToItem = (itemId: number, stage: FunnelStage) => {
    setScheduledItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, funnelStage: stage } : item
      )
    );
    // Remove from selection after assignment
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const assignStageToSelected = () => {
    if (selectedItemIds.size === 0) return;

    setScheduledItems((prev) =>
      prev.map((item) =>
        selectedItemIds.has(item.id) ? { ...item, funnelStage: selectedFunnelStage } : item
      )
    );
    setSelectedItemIds(new Set());
  };

  const selectAllUnassigned = () => {
    const unassignedIds = scheduledItems
      .filter((item) => !item.funnelStage)
      .map((item) => item.id);
    setSelectedItemIds(new Set(unassignedIds));
  };

  const updateItemTopic = (itemId: number, topic: string) => {
    setScheduledItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, topic } : item
      )
    );
  };

  // Computed values
  const totalItems = useMemo(
    () => CONTENT_TYPES.reduce((sum, t) => sum + getTypeItemCount(t.id), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentTypeCounts, platformsByType]
  );

  const totalCredits = useMemo(() => {
    return CONTENT_TYPES.reduce((sum, type) => {
      return sum + type.credits * getTypeItemCount(type.id);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeCounts, platformsByType]);

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

  const funnelStageDistribution = useMemo(() => {
    const counts: Record<FunnelStage | "unassigned", number> = {
      awareness: 0,
      consideration: 0,
      conversion: 0,
      unassigned: 0,
    };

    scheduledItems.forEach((item) => {
      if (item.funnelStage) {
        counts[item.funnelStage]++;
      } else {
        counts.unassigned++;
      }
    });

    return counts;
  }, [scheduledItems]);

  const calendarDates = useMemo(() => {
    if (!startDate || !endDate) return [];
    return buildCalendarGrid(startDate, endDate);
  }, [startDate, endDate]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, ScheduledItem[]> = {};
    scheduledItems.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [scheduledItems]);

  if (!isOpen) return null;

  const canProceed = () => {
    if (step === 1) {
      const hasSchedule = dateMode === "date-range"
        ? (startDate && endDate)
        : (parseInt(durationValue) > 0);
      return campaignName.trim() && hasSchedule;
    }
    if (step === 2) return uploadedFile !== null || sourceUrl.trim() || selectedLibraryAssets.size > 0;
    if (step === 3) return totalItems > 0;
    if (step === 4) return true;
    if (step === 5) return funnelStageDistribution.unassigned === 0;
    if (step === 6) return selectedTopics.size > 0;
    return true;
  };

  const handleBack = () => setCurrentStep((s) => Math.max(1, s - 1) as any);
  const handleNext = () => {
    if (step === 3 && scheduledItems.length === 0) {
      generateScheduledItems();
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, step]));

    if (step < 7) {
      const nextStep = (step + 1) as any;
      setCurrentStep(nextStep);
      setExpandedStep(nextStep);
    } else {
      onComplete({
        campaignName,
        description,
        startDate,
        endDate,
        uploadedFile,
        sourceUrl,
        selectedLibraryAssets,
        contentTypeCounts,
        scheduledItems,
        selectedTopics: Array.from(selectedTopics),
        totalItems,
        totalCredits,
      });
    }
  };

  const handleStepClick = (stepNum: number) => {
    // Can only click on completed steps or current step
    if (stepNum <= currentStep || completedSteps.has(stepNum)) {
      setExpandedStep(expandedStep === stepNum ? 0 : stepNum);
      if (stepNum !== currentStep) {
        setCurrentStep(stepNum as any);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-card w-full max-w-[900px] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground leading-tight mb-0.5">Create Campaign</h2>
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
        <div className="px-6 py-4 border-b border-border bg-background/20 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const past = step > n;
              const active = step === n;
              return (
                <div key={n} className="flex items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
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
                        "text-xs font-semibold whitespace-nowrap",
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
                  {i < 6 && (
                    <div className="w-8 h-px mx-3 bg-border overflow-hidden">
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
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ═══ Step 1: Campaign Details ═══ */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Campaign information</h3>
                <p className="text-sm text-muted-foreground">Set up the basic details for your campaign.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer 2026 Product Launch"
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the campaign goals and messaging..."
                  rows={3}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all resize-none"
                />
              </div>

              {/* ── Schedule Mode Switcher ── */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-2">Schedule</label>
                <div className="flex gap-1 bg-secondary rounded-xl p-1 border border-border mb-4">
                  {(["date-range", "duration"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDateMode(mode)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={dateMode !== "date-range"}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={dateMode !== "date-range"}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Panel */}
                <div className={clsx("mt-4 transition-all", dateMode !== "duration" && "opacity-40 pointer-events-none select-none")}>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      min="1"
                      max="365"
                      disabled={dateMode !== "duration"}
                      className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                    />
                    <div className="flex gap-1 bg-secondary rounded-xl p-1 border border-border">
                      {(["days", "weeks", "months"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setDurationType(type)}
                          disabled={dateMode !== "duration"}
                          className={clsx(
                            "px-3 py-2 rounded-lg text-sm font-semibold transition-all capitalize",
                            durationType === type
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {dateMode === "duration" && durationType === "weeks" && startDate && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Ends{" "}
                      <span className="text-primary font-semibold">
                        {fmtDateDisplay(calcWeekEndDate(startDate, parseInt(durationValue) || 1))}
                      </span>
                      {" "}· snapped to Sunday
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 2: Source Material ═══ */}
          {step === 2 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Add source material</h3>
                <p className="text-sm text-muted-foreground">
                  Upload or link the primary source from which all campaign content will be derived.
                </p>
              </div>

              {/* Drop zone */}
              <div
                className={clsx(
                  "relative rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer",
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
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground/60">Upload video, podcast, or document</p>
                  </div>
                )}
              </div>

              {/* OR divider */}
              <div className="flex items-center gap-3">
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
                    placeholder="https://youtube.com/watch?v=... or podcast URL"
                    className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Add Resources — opens the same dialog as the Resources page */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-3">Include from resource library</label>
                <button
                  onClick={() => {
                    setLibraryDraftAssets(new Set(selectedLibraryAssets));
                    setLibraryDraftDrive(new Set(selectedDriveFiles));
                    setLibraryDraftDropbox(new Set(selectedDropboxFiles));
                    setLibrarySource("library");
                    setShowLibraryModal(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-xl hover:border-primary/50 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                    Add Resources
                  </div>
                  {(selectedLibraryAssets.size + selectedDriveFiles.size + selectedDropboxFiles.size) > 0 && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {selectedLibraryAssets.size + selectedDriveFiles.size + selectedDropboxFiles.size} selected
                    </span>
                  )}
                </button>

                {/* Summary of selections */}
                {(selectedLibraryAssets.size > 0 || selectedDriveFiles.size > 0 || selectedDropboxFiles.size > 0) && (
                  <p className="mt-2.5 text-[11px] font-semibold text-primary flex items-center gap-2 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                    {selectedLibraryAssets.size + selectedDriveFiles.size + selectedDropboxFiles.size} resource
                    {selectedLibraryAssets.size + selectedDriveFiles.size + selectedDropboxFiles.size !== 1 ? "s" : ""} selected from library
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ═══ Step 3: Content Type Mix ═══ */}
          {step === 3 && (
            <div className="p-0 flex flex-col h-full">
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-lg font-bold text-foreground">Review your content batch</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} will be scheduled for this campaign.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
                {/* Batch list container */}
                <div className="rounded-[20px] border border-white/[0.08] bg-black/30 overflow-hidden">
                  {/* Batch badge */}
                  <div className="flex items-center gap-2 border-b border-white/[0.05] bg-white/[0.02] px-5 py-2.5">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/75">
                      Batch — {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Content type rows */}
                  {CONTENT_TYPES.map((type, idx) => {
                    const qty = contentTypeCounts[type.id];
                    const Icon = type.Icon;
                    const itemCount = getTypeItemCount(type.id);
                    const hasPlatforms = type.hasPlatforms;
                    const platforms = platformsByType[type.id];
                    const rowBorder = idx < CONTENT_TYPES.length - 1 ? "border-b border-white/[0.05]" : "";

                    const showBadge = type.id === "blog-post" || type.id === "carousel";
                    const badgeLabel = type.id === "blog-post" ? type.sublabel.toUpperCase() : type.id === "carousel" ? "CAROUSEL" : "";
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
                                {type.description}
                              </span>
                            </div>
                          </div>

                          {/* Right: stepper + count */}
                          <div className="flex items-center gap-5 flex-shrink-0">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  setContentTypeCounts((prev) => ({
                                    ...prev,
                                    [type.id]: Math.max(0, prev[type.id] - 1),
                                  }))
                                }
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
                                onClick={() =>
                                  setContentTypeCounts((prev) => ({
                                    ...prev,
                                    [type.id]: prev[type.id] + 1,
                                  }))
                                }
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

                        {/* Platform pills */}
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

                  {/* Credits hint */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-foreground/80">Estimated Credits</span>
                    </div>
                    <span className="text-[11px] font-black text-[#818CFF]">{totalCredits}</span>
                  </div>
                </div>

                {/* Distribution bar */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-xs font-bold text-foreground/80 block">Content Type Distribution</label>
                  <div className="h-2 rounded-full overflow-hidden bg-muted flex">
                    {contentTypeDistribution
                      .filter((item) => item.count > 0)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="h-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-0.5">
                    {contentTypeDistribution
                      .filter((item) => item.count > 0)
                      .map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5">
                          <div
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[10px] text-foreground/70 font-semibold">
                            {item.label}: {item.count} ({item.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 4: Calendar Preview ═══ */}
          {step === 4 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Calendar preview</h3>
                <p className="text-sm text-muted-foreground">
                  Review how items are scheduled. Drag items to different dates to adjust the distribution.
                </p>
              </div>

              {/* Calendar grid */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider border-r border-border last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 max-h-[400px] overflow-y-auto">
                  {calendarDates.map((dateStr) => {
                    const dateItems = itemsByDate[dateStr] || [];
                    const date = new Date(dateStr);
                    const dayOfWeek = date.getDay();

                    return (
                      <div
                        key={dateStr}
                        className="min-h-[80px] p-2 border-r border-b border-border last:border-r-0"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedItemId !== null) {
                            handleItemDrag(draggedItemId, dateStr);
                            setDraggedItemId(null);
                          }
                        }}
                      >
                        <div className="text-xs font-semibold text-muted-foreground mb-1">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dateItems.map((item) => {
                            const type = CONTENT_TYPES.find((t) => t.id === item.typeId);
                            if (!type) return null;
                            const Icon = type.Icon;
                            return (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={() => setDraggedItemId(item.id)}
                                onDragEnd={() => setDraggedItemId(null)}
                                className={clsx(
                                  "flex items-center gap-1 px-2 py-1 rounded-md cursor-grab text-left text-xs transition-all",
                                  draggedItemId === item.id && "opacity-30"
                                )}
                                style={{
                                  backgroundColor: `${type.color}18`,
                                  border: `1px solid ${type.color}30`,
                                }}
                              >
                                <Icon className="w-3 h-3 flex-shrink-0" style={{ color: type.color }} />
                                <span className="flex-1 truncate text-foreground font-medium leading-tight">
                                  {item.topic}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 5: Funnel Stage Assignment ═══ */}
          {step === 5 && (
            <div className="flex flex-col h-full min-h-0">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex-shrink-0">
                <h3 className="text-base font-bold text-foreground mb-1">Assign funnel stages to content items</h3>
                <p className="text-sm text-muted-foreground">
                  Use the dropdown in each item to assign a funnel stage, or use checkboxes to assign multiple items at once.
                </p>
              </div>

              {/* Large Stage Info Cards (non-interactive) */}
              <div className="px-6 pb-4 flex-shrink-0">
                <div className="grid grid-cols-3 gap-4">
                  {FUNNEL_STAGES.map((stage) => {
                    const Icon = stage.Icon;
                    return (
                      <div
                        key={stage.id}
                        className="p-5 rounded-2xl border border-border transition-all"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${stage.color}20`,
                              border: `2px solid ${stage.color}40`,
                            }}
                          >
                            <Icon className="w-6 h-6" style={{ color: stage.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-foreground leading-tight mb-1">
                              {stage.label}
                            </p>
                            <p
                              className="text-xs font-bold uppercase tracking-wider"
                              style={{ color: stage.color }}
                            >
                              {stage.sublabel}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Multi-select actions */}
              {selectedItemIds.size > 0 && (
                <div className="px-6 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30">
                    <span className="text-sm font-bold text-foreground">
                      {selectedItemIds.size} item{selectedItemIds.size !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">Assign to:</span>
                      {FUNNEL_STAGES.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => {
                            setSelectedFunnelStage(stage.id);
                            assignStageToSelected();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: stage.color }}
                        >
                          {stage.sublabel}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedItemIds(new Set())}
                      className="ml-auto text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear selection
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-foreground">
                      Content Items ({scheduledItems.length})
                    </label>
                    {funnelStageDistribution.unassigned > 0 && (
                      <button
                        onClick={selectAllUnassigned}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        Select all unassigned ({funnelStageDistribution.unassigned})
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {scheduledItems.map((item) => {
                      const type = CONTENT_TYPES.find((t) => t.id === item.typeId);
                      if (!type) return null;
                      const Icon = type.Icon;
                      const stage = FUNNEL_STAGES.find((s) => s.id === item.funnelStage);
                      const hasStage = !!stage;
                      const isSelected = selectedItemIds.has(item.id);

                      return (
                        <div
                          key={item.id}
                          className={clsx(
                            "group flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                            hasStage
                              ? "border-transparent bg-card"
                              : "border-dashed border-muted-foreground/30 bg-card",
                            isSelected && "ring-2 ring-primary"
                          )}
                          style={
                            hasStage
                              ? {
                                  backgroundColor: `${stage.color}08`,
                                  borderLeft: `4px solid ${stage.color}`,
                                  borderTop: "2px solid transparent",
                                  borderRight: "2px solid transparent",
                                  borderBottom: "2px solid transparent",
                                }
                              : {}
                          }
                        >
                          {/* Checkbox */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItemSelection(item.id);
                            }}
                            className={clsx(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-border group-hover:border-muted-foreground"
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>

                          {/* Content Type Icon */}
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${type.color}18`,
                              border: `1px solid ${type.color}30`,
                            }}
                          >
                            <Icon className="w-5 h-5" style={{ color: type.color }} />
                          </div>

                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{item.topic}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>

                          {/* Stage Dropdown or Badge */}
                          <div className="flex-shrink-0 w-44">
                            {hasStage ? (
                              <button
                                onClick={() => {
                                  setScheduledItems((prev) =>
                                    prev.map((i) =>
                                      i.id === item.id ? { ...i, funnelStage: undefined } : i
                                    )
                                  );
                                }}
                                className="w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80"
                                style={{
                                  backgroundColor: `${stage.color}25`,
                                  color: stage.color,
                                }}
                              >
                                {stage.sublabel}
                              </button>
                            ) : (
                              <div className="relative">
                                <select
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      assignFunnelStageToItem(item.id, e.target.value as FunnelStage);
                                    }
                                  }}
                                  className="w-full px-3 py-2 pr-8 rounded-lg border-2 border-dashed border-muted-foreground/40 bg-card text-xs font-bold uppercase tracking-wider text-muted-foreground cursor-pointer hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none"
                                >
                                  <option value="">Select Stage</option>
                                  {FUNNEL_STAGES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.sublabel}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 6: Topics ═══ */}
          {step === 6 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Campaign topics</h3>
                <p className="text-sm text-muted-foreground">
                  Select project-level topics or add custom ones. Items will be auto-assigned topics.
                </p>
              </div>

              {/* Project topics */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-3">Project Topics</label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.has(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={clsx(
                          "px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                        )}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom topics */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-3">Add Custom Topics</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTopic();
                      }
                    }}
                    placeholder="Type a custom topic..."
                    className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={addCustomTopic}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {customTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customTopics.map((topic) => (
                      <div
                        key={topic}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-primary bg-primary/10"
                      >
                        <span className="text-sm font-semibold text-primary">{topic}</span>
                        <button
                          onClick={() => {
                            setCustomTopics(customTopics.filter((t) => t !== topic));
                            toggleTopic(topic);
                          }}
                          className="text-primary hover:text-primary/70 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ Step 7: Review & Create ═══ */}
          {step === 7 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Review your campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Double-check everything before creating. Nothing will be generated until you click Create Campaign.
                </p>
              </div>

              {/* Campaign summary card */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 bg-orange-500/10 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">{campaignName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {startDate} to {endDate}
                      </p>
                    </div>
                  </div>
                  {description && (
                    <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{description}</p>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-secondary/40 border border-border">
                      <div className="text-2xl font-black text-primary tabular-nums">{totalItems}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                        Total Items
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/40 border border-border">
                      <div className="text-2xl font-black text-[#818CFF] tabular-nums">{totalCredits}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                        Credits
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/40 border border-border">
                      <div className="text-2xl font-black text-foreground tabular-nums">
                        {calendarDates.length}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                        Days
                      </div>
                    </div>
                  </div>

                  {/* Content type breakdown */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">Content Type Breakdown</p>
                    <div className="space-y-2">
                      {contentTypeDistribution
                        .filter((item) => item.count > 0)
                        .map((item) => {
                          const Icon = item.Icon;
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: `${item.color}18`,
                                  border: `1px solid ${item.color}30`,
                                }}
                              >
                                <Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                              <span className="text-sm font-bold text-foreground tabular-nums">{item.count}</span>
                              <span className="text-xs text-muted-foreground">
                                ({item.percentage.toFixed(0)}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Funnel stage breakdown */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">Funnel Stage Distribution</p>
                    <div className="space-y-2">
                      {FUNNEL_STAGES.map((stage) => {
                        const count = funnelStageDistribution[stage.id];
                        const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;
                        const Icon = stage.Icon;
                        return (
                          <div key={stage.id} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: `${stage.color}18`,
                                border: `1px solid ${stage.color}30`,
                              }}
                            >
                              <Icon className="w-4 h-4" style={{ color: stage.color }} />
                            </div>
                            <span className="flex-1 text-sm font-medium text-foreground">{stage.label}</span>
                            <span className="text-sm font-bold text-foreground tabular-nums">{count}</span>
                            <span className="text-xs text-muted-foreground">
                              ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected topics */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-2">Campaign Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedTopics).map((topic) => (
                        <div
                          key={topic}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Important note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-foreground mb-1">Ready to generate</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Nothing will be generated until you click "Create Campaign" below. All {totalItems} items will begin generating immediately.
                  </p>
                </div>
              </div>
            </div>
          )}
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
            {([1, 2, 3, 4, 5, 6, 7] as const).map((s) => (
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
              step === 7
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
              !canProceed() && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            {step === 7 ? (
              <>
                <Flag className="w-4 h-4" />
                Create Campaign
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
                  { key: "library" as LibrarySource, Icon: HardDrive, label: "My Library" },
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
                      {libraryDraftAssets.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{libraryDraftAssets.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {LIBRARY_ASSETS.map((asset) => {
                        const isSelected = libraryDraftAssets.has(asset.id);
                        return (
                          <button
                            key={asset.id}
                            onClick={() => {
                              const next = new Set(libraryDraftAssets);
                              if (next.has(asset.id)) next.delete(asset.id);
                              else next.add(asset.id);
                              setLibraryDraftAssets(next);
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
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-foreground truncate">{asset.name}</p>
                              <p className="text-[10px] text-muted-foreground">{asset.size}</p>
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
                      <input ref={extraFileInputRef} type="file" multiple className="hidden" onChange={(e) => setExtraUploads(prev => [...prev, ...Array.from(e.target.files || [])])} />
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
                            <button onClick={() => setExtraUploads(a => a.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 text-lg leading-none px-1">×</button>
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
                      {libraryDraftDrive.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{libraryDraftDrive.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DRIVE_FILES.map((file) => {
                        const isSelected = libraryDraftDrive.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => {
                              const next = new Set(libraryDraftDrive);
                              if (next.has(file.id)) next.delete(file.id);
                              else next.add(file.id);
                              setLibraryDraftDrive(next);
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
                      {libraryDraftDropbox.size > 0 && (
                        <span className="text-xs font-semibold text-primary">{libraryDraftDropbox.size} selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DROPBOX_FILES.map((file) => {
                        const isSelected = libraryDraftDropbox.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => {
                              const next = new Set(libraryDraftDropbox);
                              if (next.has(file.id)) next.delete(file.id);
                              else next.add(file.id);
                              setLibraryDraftDropbox(next);
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
                onClick={() => {
                  setSelectedLibraryAssets(new Set(libraryDraftAssets));
                  setSelectedDriveFiles(new Set(libraryDraftDrive));
                  setSelectedDropboxFiles(new Set(libraryDraftDropbox));
                  setShowLibraryModal(false);
                }}
                className={clsx(
                  "inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-primary-foreground transition-opacity",
                  (libraryDraftAssets.size + libraryDraftDrive.size + libraryDraftDropbox.size) === 0
                    ? "bg-primary/40 cursor-not-allowed"
                    : "bg-primary shadow-lg hover:opacity-90 cursor-pointer"
                )}
                disabled={(libraryDraftAssets.size + libraryDraftDrive.size + libraryDraftDropbox.size) === 0}
              >
                {(libraryDraftAssets.size + libraryDraftDrive.size + libraryDraftDropbox.size) > 0
                  ? `Add ${libraryDraftAssets.size + libraryDraftDrive.size + libraryDraftDropbox.size} Resource${(libraryDraftAssets.size + libraryDraftDrive.size + libraryDraftDropbox.size) > 1 ? 's' : ''}`
                  : 'Add Resources'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

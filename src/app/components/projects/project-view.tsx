import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContentEditModal } from "../content/content-edit-modal";
import {
  ArrowLeft,
  CalendarDays,
  Calendar,
  List,
  Plus,
  Flag,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  Mail,
  ImageIcon,
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  GripVertical,
  Trash2,
  ChevronDown,
  LayoutGrid,
  CheckCircle2,
  Quote,
  Eye,
  Filter,
  MoreHorizontal,
  Sparkles,
  Search,
  ListOrdered,
  Check,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Smile,
  Meh,
  Frown,
  Film,
  Upload,
  FolderOpen,
  Link as LinkIcon,
  LayoutTemplate,
  ExternalLink,
  Clock,
  RefreshCw,
  Send,
  Copy,
  Pencil,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";
import { SmartContentCreationModal } from "../content/smart-content-creation-modal";
import { CampaignCreationFullView, PreviousCampaign } from "./campaign-creation-full-view";
import { PREVIOUS_CAMPAIGNS } from "./campaign-creation-full-view";
import { ContentReview } from "../content/content-review";
import { ReviewWizard } from "../content/review-wizard";
import { ReportsView } from "../reports/reports-view";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType =
  | "Long Form"
  | "Short Clip"
  | "Highlight Reel"
  | "Text to AI Video"
  | "Quote Card";

type ContentStatus =
  | "draft"
  | "generating"
  | "ready-for-review"
  | "approved"
  | "published"
  | "rejected";
type FunnelStage = "Awareness" | "Consideration" | "Decision" | "Retention";
type ViewMode = "calendar" | "list";

interface ContentItem {
  id: number;
  date: string;
  topic: string;
  title?: string;
  type: ContentType;
  funnelStage: FunnelStage;
  campaign: string;
  campaignColor: string;
  status: ContentStatus;
  credits?: number;
  imageUrl?: string;
  templateId?: string;
  postContent?: string;
  platform?: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  imageUrl: string;
  imageFile?: File;
  link?: string;
  createdAt: Date;
}

interface Campaign {
  name: string;
  color: string;
  description: string;
  instructions: string;
  duration: string;
  topics: string;
  brandGuidelines: string;
  targetAudience: string;
  contentTypes: string[];
  funnelStages: string[];
  resources: string[];
  templates: string[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  {
    name: "Summer Launch",
    color: "#F97316",
    description: "Summer 2026 athletic collection launch across social and editorial channels.",
    instructions: "Lead with high-energy visuals. Always tie copy back to peak summer performance. End every piece with a CTA. Avoid passive voice.",
    duration: "May 1 – Aug 31, 2026",
    topics: "summer collection, athletic performance, new releases, training, outdoor fitness",
    brandGuidelines: "Bold, motivational, performance-driven. Emphasize achievement and the drive to exceed limits. Use active voice, strong verbs, energetic language. Inspire and empower — never talk down.",
    targetAudience: "Athletes and fitness enthusiasts, ages 18–35, performance-focused, US markets",
    contentTypes: ["Long Form", "Short Clip", "Highlight Reel"],
    funnelStages: ["Awareness", "Consideration", "Decision"],
    resources: ["Summer Campaign Video.mp4", "Brand Guidelines 2026.pdf"],
    templates: ["Orange Hero", "Athlete Portrait"],
  },
  {
    name: "Brand Awareness Q2",
    color: "#8B5CF6",
    description: "Broad brand visibility push emphasising heritage, innovation and community.",
    instructions: "Focus on brand story and values over product. Avoid jargon. Short, punchy sentences. Lead with the human benefit. Never hard-sell.",
    duration: "Apr 1 – Jun 30, 2026",
    topics: "brand heritage, innovation, sustainability, community, values, athlete spotlights",
    brandGuidelines: "Authentic, inclusive, premium yet approachable. Focus on brand story and values. Short sentences, active voice. Lead with benefit, not feature.",
    targetAudience: "Broad audience, ages 25–55, brand-conscious consumers, US & global",
    contentTypes: ["Long Form", "Quote Card", "Text to AI Video"],
    funnelStages: ["Awareness", "Consideration"],
    resources: ["Brand Guidelines 2026.pdf", "Athlete Testimonials.docx"],
    templates: ["Motivational Quote", "Dark Minimal"],
  },
  {
    name: "Back to School",
    color: "#4B56F2",
    description: "Back-to-school season targeting students, parents and coaches.",
    instructions: "Tone should be optimistic and forward-looking. Tie athletic performance to academic success. Highlight durability and value.",
    duration: "Jul 15 – Sep 15, 2026",
    topics: "back to school, student athletes, durability, value, preparation, new season",
    brandGuidelines: "Energetic and positive. Speak to aspiration and new beginnings. Family-friendly tone. Avoid anything edgy or aggressive.",
    targetAudience: "Students ages 13–22, parents of student athletes, school coaches",
    contentTypes: ["Short Clip", "Quote Card", "Long Form"],
    funnelStages: ["Awareness", "Decision"],
    resources: [],
    templates: ["Clean Modern", "Athletic Edge"],
  },
  {
    name: "Fall Collection",
    color: "#EC4899",
    description: "Fall 2026 product collection with a fashion-forward athletic aesthetic.",
    instructions: "Blend performance with style. Photography-heavy. Reference seasonal colour palette. Partner with fashion micro-influencers where possible.",
    duration: "Sep 1 – Nov 30, 2026",
    topics: "fall collection, seasonal style, fashion-forward, new colourways, lifestyle",
    brandGuidelines: "Elevated, fashion-forward tone. Premium feel. Short, confident copy. Imagery-led. Reference seasonal textures and colour stories.",
    targetAudience: "Style-conscious athletes, ages 22–40, urban markets, fashion-aware",
    contentTypes: ["Highlight Reel", "Short Clip", "Quote Card"],
    funnelStages: ["Awareness", "Consideration", "Decision"],
    resources: [],
    templates: ["Bold Gradient", "Minimal Dark"],
  },
];

// Seed templates — these represent Canva/design templates stored per project
const SEED_TEMPLATES: ProjectTemplate[] = [
  { id: "tpl-1", name: "Orange Hero", imageUrl: "/brand-tile-navy.svg?w=400&h=400&fit=crop", link: "https://canva.com", createdAt: new Date("2026-05-10") },
  { id: "tpl-2", name: "Athlete Portrait", imageUrl: "/brand-tile-violet.svg?w=400&h=400&fit=crop", link: "https://canva.com", createdAt: new Date("2026-05-10") },
  { id: "tpl-3", name: "Product Shot", imageUrl: "/brand-tile-cyan.svg?w=400&h=400&fit=crop", link: "https://canva.com", createdAt: new Date("2026-05-12") },
  { id: "tpl-4", name: "Motivational Quote", imageUrl: "/brand-tile-amber.svg?w=400&h=400&fit=crop", createdAt: new Date("2026-05-15") },
  { id: "tpl-5", name: "Running Lifestyle", imageUrl: "/brand-tile-coral.svg?w=400&h=400&fit=crop", link: "https://canva.com", createdAt: new Date("2026-05-18") },
  { id: "tpl-6", name: "Dark Minimal", imageUrl: "/brand-tile-navy-cyan.svg?w=400&h=400&fit=crop", createdAt: new Date("2026-06-01") },
];

const STATUS_CFG: Record<
  ContentStatus,
  { label: string; cls: string; dotColor: string; badgeAnimCls?: string }
> = {
  draft:            { label: "Draft",            cls: "text-zinc-400 bg-zinc-500/15",    dotColor: "#A1A1AA" },
  generating:       { label: "Generating",       cls: "text-blue-400 bg-blue-500/15",    dotColor: "#60A5FA", badgeAnimCls: "animate-pulse" },
  "ready-for-review": { label: "Ready for Review", cls: "text-yellow-400 bg-yellow-500/15", dotColor: "#FBBF24" },
  approved:         { label: "Approved",         cls: "text-[#8FE6B5] bg-[#12B667]/10", dotColor: "#34D399" },
  published:        { label: "Published",        cls: "bg-zinc-100 text-zinc-900 font-bold", dotColor: "#E4E4E7" },
  rejected:         { label: "Rejected",         cls: "text-red-400 bg-red-500/10",      dotColor: "#F87171" },
};

const STATUS_ORDER: ContentStatus[] = [
  "draft", "generating", "ready-for-review", "approved", "published", "rejected",
];

// Content-type color is the ONLY color axis on calendar chips.
// Deliberately avoids green (≈ Approved badge) and amber/yellow (≈ Draft badge).
const TYPE_COLOR: Record<ContentType, string> = {
  "Long Form":        "#3B82F6",  // blue
  "Short Clip":       "#06B6D4",  // cyan
  "Highlight Reel":   "#F97316",  // orange
  "Text to AI Video": "#8B5CF6",  // violet
  "Quote Card":       "#EC4899",  // pink
};

const TYPE_CFG: Record<ContentType, { icon: React.ElementType; cls: string }> = {
  "Long Form":        { icon: FileText,  cls: "text-blue-400" },
  "Short Clip":       { icon: Video,     cls: "text-cyan-400" },
  "Highlight Reel":   { icon: Film,      cls: "text-orange-400" },
  "Text to AI Video": { icon: Sparkles,  cls: "text-violet-400" },
  "Quote Card":       { icon: Quote,     cls: "text-pink-400" },
};

const FUNNEL_CFG: Record<FunnelStage, string> = {
  Awareness: "text-sky-400 bg-sky-500/10",
  Consideration: "text-violet-400 bg-violet-500/10",
  Decision: "text-[#818CFF] bg-[#4B56F2]/10",
  Retention: "text-orange-400 bg-orange-500/10",
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Mock data (Velocity Athletics Project, May 2026) ─────────────────────────────

const INITIAL_ITEMS: ContentItem[] = [
  // ── Published (sent early May) ─────────────────────────────────────────
  { id: 1,  date: "2026-05-01", topic: "Summer Collection Launch",   title: "Introducing the Summer 2026 Collection — Built for Every Athlete",    type: "Long Form",       funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "published", platform: "instagram", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop", postContent: "Summer is here and so is your best performance yet. Introducing the Summer 2026 Collection — engineered for every athlete, every terrain, every goal. Shop now and train like you mean it. 🔥 #Summer2026 #AthleticPerformance" },
  { id: 2,  date: "2026-05-02", topic: "Morning Run Motivation",     title: "Why Your Morning Run Sets the Tone for the Entire Day",               type: "Long Form",   funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "published", platform: "youtube", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop", postContent: "The alarm goes off. It's dark. Your bed is warm. And yet — you lace up anyway. That decision sets the tone for everything that follows. Read why your morning run is the most important thing you'll do today." },
  { id: 3,  date: "2026-05-02", topic: "Training Tip #1",                                                                                           type: "Quote Card", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "published", platform: "instagram", postContent: "\"The only bad workout is the one that didn't happen.\" — Save this for the days you need it most. 💪 #TrainingTip #Motivation" },
  { id: 4,  date: "2026-05-05", topic: "Velocity Air Max 2026 Drop",                                                                                         type: "Highlight Reel",    funnelStage: "Consideration", campaign: "Summer Launch",    campaignColor: "#F97316", status: "published", platform: "youtube", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop", postContent: "The Velocity Air Max 2026 has landed. Lighter, faster, more responsive than ever. Tap to see every angle — and every reason to make them yours." },
  // ── Approved ──────────────────────────────────────────────────────────
  { id: 6,  date: "2026-05-07", topic: "Athlete Spotlight: Alex Chen", title: "Meet Alex Chen: Ultra-marathoner by Night, Engineer by Day",         type: "Long Form",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved", platform: "linkedin", imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 8,  date: "2026-05-09", topic: "Limited Edition Colorway",                                                                                   type: "Short Clip", funnelStage: "Decision",      campaign: "Summer Launch",    campaignColor: "#F97316", status: "approved", platform: "tiktok", imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 11, date: "2026-05-14", topic: "Speed Training Quote",                                                                                       type: "Quote Card",  funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved", platform: "instagram" },
  { id: 12, date: "2026-05-15", topic: "Flash Sale — 48 Hours",                                                                                      type: "Text to AI Video", funnelStage: "Decision",      campaign: "Summer Launch",    campaignColor: "#F97316", status: "approved", platform: "youtube" },
  { id: 13, date: "2026-05-15", topic: "Summer Sale Announcement",    title: "It's Here: Our Biggest Sale of the Year",                             type: "Long Form",       funnelStage: "Decision",      campaign: "Summer Launch",    campaignColor: "#F97316", status: "approved", platform: "facebook", imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 18, date: "2026-05-22", topic: "Customer Story: Marathon PR", title: "From Couch to Sub-3: Maya's Marathon Journey with Velocity Athletics",              type: "Long Form",   funnelStage: "Decision",      campaign: "Summer Launch",    campaignColor: "#F97316", status: "approved", platform: "linkedin" },
  // ── Ready for Review ──────────────────────────────────────────────────
  { id: 5,  date: "2026-05-06", topic: "30-Day Challenge Promo",                                                                                     type: "Short Clip", funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "ready-for-review", platform: "tiktok" },
  { id: 7,  date: "2026-05-08", topic: "Hydration Science Explainer",                                                                                type: "Highlight Reel",    funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", platform: "youtube" },
  { id: 10, date: "2026-05-12", topic: "Post-Run Recovery Reel",                                                                                     type: "Short Clip", funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", platform: "instagram" },
  { id: 16, date: "2026-05-20", topic: "Shoe Tech Breakdown",                                                                                        type: "Highlight Reel",    funnelStage: "Consideration", campaign: "Summer Launch",    campaignColor: "#F97316", status: "ready-for-review", platform: "youtube" },
  { id: 19, date: "2026-05-23", topic: "Mindset Motivation Quote",                                                                                   type: "Quote Card",  funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", platform: "x" },
  // ── Generating ────────────────────────────────────────────────────────
  { id: 9,  date: "2026-05-12", topic: "Weekly Training Plan",        title: "Your 7-Day Progressive Overload Plan for Runners",                    type: "Text to AI Video",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating", platform: "youtube" },
  { id: 15, date: "2026-05-19", topic: "BTS Training Film",                                                                                          type: "Short Clip", funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "generating", platform: "tiktok" },
  { id: 21, date: "2026-05-27", topic: "New Arrivals Preview",                                                                                       type: "Highlight Reel",    funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "generating", platform: "instagram" },
  // ── Draft ─────────────────────────────────────────────────────────────
  { id: 14, date: "2026-05-16", topic: "Workout Science Deep Dive",   title: "The Science of Progressive Overload: A Complete Runner's Guide",      type: "Long Form",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft", platform: "linkedin" },
  { id: 17, date: "2026-05-21", topic: "Community Spotlight",                                                                                        type: "Quote Card", funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft", platform: "instagram" },
  { id: 20, date: "2026-05-26", topic: "Memorial Day Sale",           title: "Memorial Day: Up to 40% Off Sitewide — Today Only",                   type: "Text to AI Video",       funnelStage: "Decision",      campaign: "Summer Launch",    campaignColor: "#F97316", status: "draft", platform: "youtube" },
  { id: 23, date: "2026-05-29", topic: "June Preview Teaser",                                                                                        type: "Short Clip", funnelStage: "Awareness",     campaign: "Summer Launch",    campaignColor: "#F97316", status: "draft", platform: "tiktok" },
  { id: 24, date: "2026-05-30", topic: "Monthly Recap Newsletter",    title: "May in Review: Your Training Highlights & What's Coming in June",     type: "Long Form",       funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft", platform: "facebook" },
  // ── Rejected ──────────────────────────────────────────────────────────
  { id: 22, date: "2026-05-28", topic: "Trail Running 101",           title: "Trail Running 101: Gear, Technique & Safety Essentials for Beginners", type: "Long Form",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "rejected", platform: "linkedin" },

  // ══════════════ JUNE 2026 — dense content ══════════════
  // Jun 1
  { id: 100, date: "2026-06-01", topic: "Summer Drop: Full Story",        title: "Introducing the Summer 2026 Drop — Performance Meets Style",           type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "published",       imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 101, date: "2026-06-01", topic: "Summer Drop Clip",                                                                                               type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "published",       imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 102, date: "2026-06-01", topic: "Launch Day Motivation",                                                                                          type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "published" },
  { id: 103, date: "2026-06-01", topic: "Brand Intro Reel",                                                                                               type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  // Jun 2
  { id: 104, date: "2026-06-02", topic: "Summer Training Tips",            title: "5 Essential Training Tips for Summer Running",                         type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "published",       imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop", postContent: "Training in the heat? Here are 5 tips that will keep you performing at your peak all summer long. Drop a 🔥 if you're running this week!" },
  { id: 105, date: "2026-06-02", topic: "Recovery Science Guide",          title: "The Science of Post-Run Recovery",                                     type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop", postContent: "Your body doesn't get stronger during the run — it gets stronger during recovery. Here's the science behind why rest is the most underrated training tool you have." },
  { id: 106, date: "2026-06-02", topic: "Rest is Training",                                                                                               type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved", postContent: "\"Rest is not giving up. Rest is gearing up for the next one.\" Save this and share it with someone who needs a reminder today. 🙌 #RecoveryDay" },
  { id: 107, date: "2026-06-02", topic: "Recovery Clip",                                                                                                  type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review", postContent: "60 seconds of recovery science that every runner needs to watch. Swipe up to read the full guide. 👆" },
  // Jun 3
  { id: 108, date: "2026-06-03", topic: "Brand Heritage Story",            title: "50 Years of Athletic Innovation: Our Story",                           type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 109, date: "2026-06-03", topic: "Heritage Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 110, date: "2026-06-03", topic: "Heritage Quote",                                                                                                 type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 111, date: "2026-06-03", topic: "Brand Documentary",                                                                                              type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating",      imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  // Jun 4
  { id: 112, date: "2026-06-04", topic: "Hydration Guide",                 title: "Stay Hydrated: Your Summer Running Hydration Plan",                    type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "published",       imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 113, date: "2026-06-04", topic: "Hydration Tip Quote",                                                                                            type: "Quote Card",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "published" },
  { id: 114, date: "2026-06-04", topic: "Community Challenge",             title: "Join the 30-Day Community Challenge",                                  type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 115, date: "2026-06-04", topic: "Challenge Clip",                                                                                                 type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  // Jun 5
  { id: 116, date: "2026-06-05", topic: "New Colorway Drop",               title: "Velocity Air Max Summer Colorway: Now Available",                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 117, date: "2026-06-05", topic: "Footwear Innovation",             title: "The Science Behind Our Latest Running Shoe",                           type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 118, date: "2026-06-05", topic: "Tech AI Showcase",                                                                                               type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 119, date: "2026-06-05", topic: "Built for the Future",                                                                                           type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jun 6
  { id: 120, date: "2026-06-06", topic: "Weekend Run Club",                title: "Join Our Weekend Run Club This Saturday",                              type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 121, date: "2026-06-06", topic: "Run Club Recap",                                                                                                 type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 122, date: "2026-06-06", topic: "Run Club Clip",                                                                                                  type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  // Jun 7
  { id: 123, date: "2026-06-07", topic: "Sunday Mindset",                                                                                                 type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 124, date: "2026-06-07", topic: "Week Ahead Preview",                                                                                             type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 125, date: "2026-06-07", topic: "Recovery Sunday",                 title: "Active Recovery: What to Do on Rest Days",                             type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  // Jun 8
  { id: 126, date: "2026-06-08", topic: "Athlete Spotlight: Sarah Chen",   title: "From Weekend Jogger to Marathon Champion: Sarah's Journey",            type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating",      imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 127, date: "2026-06-08", topic: "Weekly Motivation",                                                                                              type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 128, date: "2026-06-08", topic: "Athlete Interview Clip",                                                                                         type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 129, date: "2026-06-08", topic: "Champions Never Quit",                                                                                           type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 130, date: "2026-06-08", topic: "Monday Athlete Feature",                                                                                         type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft",           imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  // Jun 9
  { id: 131, date: "2026-06-09", topic: "Loyalty Week Kick-off",           title: "Loyalty Week: Exclusive Rewards for Our Community",                    type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 132, date: "2026-06-09", topic: "Member Exclusive Clip",                                                                                          type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 133, date: "2026-06-09", topic: "Members Get More",                                                                                               type: "Quote Card",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 134, date: "2026-06-09", topic: "Loyalty Highlights",                                                                                             type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 10
  { id: 135, date: "2026-06-10", topic: "Summer Sale Preview",             title: "Summer Sale Preview: What to Expect",                                  type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 136, date: "2026-06-10", topic: "Nutrition for Runners",           title: "Fuel Your Run: Complete Nutrition Guide for Summer",                    type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 137, date: "2026-06-10", topic: "Fuel Your Potential",                                                                                            type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 138, date: "2026-06-10", topic: "Nutrition Video",                                                                                                type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 139, date: "2026-06-10", topic: "Nutrition Clip",                                                                                                 type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 11
  { id: 140, date: "2026-06-11", topic: "Heritage Brand Story",            title: "Our Brand Heritage: 50 Years of Athletic Innovation",                  type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 141, date: "2026-06-11", topic: "Heritage Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 142, date: "2026-06-11", topic: "Heritage Quote",                                                                                                 type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 143, date: "2026-06-11", topic: "Brand Story Clip",                                                                                               type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jun 12
  { id: 144, date: "2026-06-12", topic: "Performance Tech Explained",      title: "The Science Behind Our Latest Running Shoe Technology",                type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 145, date: "2026-06-12", topic: "Running Form Fundamentals",       title: "Perfect Your Form: A Guide to Efficient Running",                      type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 146, date: "2026-06-12", topic: "Form Check Friday",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 147, date: "2026-06-12", topic: "Every Rep Counts",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 148, date: "2026-06-12", topic: "Tech Showcase Reel",                                                                                             type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  // Jun 13
  { id: 149, date: "2026-06-13", topic: "Training Day Documentary",                                                                                       type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating",      imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 150, date: "2026-06-13", topic: "Training Day Teaser",                                                                                            type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 151, date: "2026-06-13", topic: "Every Rep Counts",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jun 14
  { id: 152, date: "2026-06-14", topic: "Sustainability in Sports",        title: "How We're Building a More Sustainable Athletic Future",                type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 153, date: "2026-06-14", topic: "Sustainability Clip",                                                                                            type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 154, date: "2026-06-14", topic: "Tread Lightly",                                                                                                  type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jun 15
  { id: 155, date: "2026-06-15", topic: "Father's Day Gift Guide",         title: "The Ultimate Father's Day Gift Guide for Active Dads",                 type: "Long Form",        funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 156, date: "2026-06-15", topic: "Dad's Day Clip",                                                                                                 type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 157, date: "2026-06-15", topic: "Gift for Dad",                                                                                                   type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review", imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 158, date: "2026-06-15", topic: "Gear for Dad",                                                                                                   type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  // Jun 16
  { id: 159, date: "2026-06-16", topic: "Running Form Tips",               title: "5 Running Form Mistakes and How to Fix Them",                          type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 160, date: "2026-06-16", topic: "Community Focus Story",           title: "Our Community: Stories from the Track",                                type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 161, date: "2026-06-16", topic: "Community Highlights",                                                                                           type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 162, date: "2026-06-16", topic: "Community Strong",                                                                                               type: "Quote Card",       funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jun 17 — 10 items
  { id: 163, date: "2026-06-17", topic: "Summer Campaign Launch",          title: "Summer 2026 Campaign — The Full Reveal",                               type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 164, date: "2026-06-17", topic: "Campaign Launch Reel",                                                                                           type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 165, date: "2026-06-17", topic: "Campaign Launch Clip",                                                                                           type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 166, date: "2026-06-17", topic: "Launch Day AI Video",                                                                                            type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating" },
  { id: 167, date: "2026-06-17", topic: "Train Like a Champion",                                                                                          type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 168, date: "2026-06-17", topic: "Athlete Interview: Maya Torres",  title: "Marathon to Movement: Maya Torres on Staying Motivated",               type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft",           imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 169, date: "2026-06-17", topic: "Maya Torres Clip",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 170, date: "2026-06-17", topic: "Member-Only Early Access",                                                                                       type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 171, date: "2026-06-17", topic: "Early Access Quote",                                                                                             type: "Quote Card",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 172, date: "2026-06-17", topic: "Summer Sprint Technique",                                                                                        type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 18
  { id: 173, date: "2026-06-18", topic: "Community Challenge Launch",      title: "Join the 30-Day Community Fitness Challenge",                          type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 174, date: "2026-06-18", topic: "Post-Launch Review",              title: "What We Learned from Launch Day",                                      type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 175, date: "2026-06-18", topic: "Behind the Scenes",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 176, date: "2026-06-18", topic: "Weekly Training Tips",                                                                                           type: "Quote Card",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 177, date: "2026-06-18", topic: "Launch Recap AI Video",                                                                                          type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  // Jun 19
  { id: 178, date: "2026-06-19", topic: "Trail Running Essentials",        title: "Hit the Trail: Everything You Need to Know",                           type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 179, date: "2026-06-19", topic: "Trail Running Clip",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 180, date: "2026-06-19", topic: "The Trail Calls",                                                                                                type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 181, date: "2026-06-19", topic: "Trail Highlights",                                                                                               type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  // Jun 20
  { id: 182, date: "2026-06-20", topic: "Summer Solstice Run",             title: "Celebrate the Longest Day: Join Our Global Summer Solstice Run",       type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 183, date: "2026-06-20", topic: "Solstice Run Reel",                                                                                              type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 184, date: "2026-06-20", topic: "Solstice Clip",                                                                                                  type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 185, date: "2026-06-20", topic: "Run Free",                                                                                                       type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 186, date: "2026-06-20", topic: "Solstice AI Video",                                                                                              type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating" },
  // Jun 21
  { id: 187, date: "2026-06-21", topic: "Loyalty Program Deep Dive",       title: "Unlock Your Rewards: A Guide to the Loyalty Program",                  type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 188, date: "2026-06-21", topic: "Members Get More",                                                                                               type: "Quote Card",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 189, date: "2026-06-21", topic: "Loyalty Rewards Clip",                                                                                           type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 22
  { id: 190, date: "2026-06-22", topic: "Inspirational Quote",                                                                                            type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 191, date: "2026-06-22", topic: "Sprint Training Guide",           title: "Sprint Like a Pro: A Complete Speed Training Program",                  type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 192, date: "2026-06-22", topic: "Sprint Tips Clip",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 193, date: "2026-06-22", topic: "Speed Highlights",                                                                                               type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 194, date: "2026-06-22", topic: "Sprint AI Video",                                                                                                type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  // Jun 23
  { id: 195, date: "2026-06-23", topic: "Q3 Brand Vision",                 title: "Our Vision for Q3: What's Coming This Summer",                         type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 196, date: "2026-06-23", topic: "Brand Vision Quote",                                                                                             type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 197, date: "2026-06-23", topic: "Mid-Season Highlights",                                                                                          type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 198, date: "2026-06-23", topic: "Mid-Season Clip",                                                                                                type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 24
  { id: 199, date: "2026-06-24", topic: "Performance Tech Feature",        title: "Under the Hood: How Our Tech Makes You Faster",                        type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 200, date: "2026-06-24", topic: "Tech Clip",                                                                                                      type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 201, date: "2026-06-24", topic: "Innovation Quote",                                                                                               type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 202, date: "2026-06-24", topic: "Tech AI Showcase",                                                                                               type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  // Jun 25
  { id: 203, date: "2026-06-25", topic: "Back to School Preview",          title: "Get Ready for Fall: Back-to-School Athletic Essentials",                type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "draft" },
  { id: 204, date: "2026-06-25", topic: "Student Athlete Guide",           title: "Student Athlete's Ultimate Back-to-School Prep Guide",                  type: "Long Form",        funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 205, date: "2026-06-25", topic: "New Season Quote",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "draft" },
  { id: 206, date: "2026-06-25", topic: "Member Milestone Story",          title: "Your Journey Inspires Us: Member Milestone Stories",                    type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 207, date: "2026-06-25", topic: "Milestone Clip",                                                                                                 type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 26
  { id: 208, date: "2026-06-26", topic: "Mid-Year Gear Review",            title: "Mid-Year Gear Review: Best Picks for Summer Running",                   type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 209, date: "2026-06-26", topic: "Gear Review Clip",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 210, date: "2026-06-26", topic: "Gear Highlights",                                                                                                type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  // Jun 27
  { id: 211, date: "2026-06-27", topic: "Mid-Year Fitness Review",         title: "Your Mid-Year Fitness Check-In: Progress, Goals & What's Next",        type: "Long Form",        funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 212, date: "2026-06-27", topic: "Flash Sale Clip",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 213, date: "2026-06-27", topic: "Flash Sale Quote",                                                                                               type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 214, date: "2026-06-27", topic: "Flash Sale Reel",                                                                                                type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 28
  { id: 215, date: "2026-06-28", topic: "Sunday Mindset",                                                                                                 type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 216, date: "2026-06-28", topic: "Week Ahead Preview",                                                                                             type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jun 29
  { id: 217, date: "2026-06-29", topic: "June Performance Recap",          title: "June in Review: Campaign Highlights and What's Next",                   type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 218, date: "2026-06-29", topic: "Monthly Recap Clip",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 219, date: "2026-06-29", topic: "June Highlights Reel",                                                                                           type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 220, date: "2026-06-29", topic: "End of Month Quote",                                                                                             type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jun 30
  { id: 221, date: "2026-06-30", topic: "June Highlights Recap",           title: "June Wrapped: Our Best Content of the Month",                          type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 222, date: "2026-06-30", topic: "Half-Year Review",                title: "6 Months In: Our Brand Journey and What Comes Next",                   type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 223, date: "2026-06-30", topic: "Half-Year Quote",                                                                                                type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 224, date: "2026-06-30", topic: "Half-Year AI Video",                                                                                             type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },

  // ══════════════ JULY 2026 — dense content ══════════════
  // Jul 1
  { id: 300, date: "2026-07-01", topic: "Q3 Kick-off",                     title: "Q3 is Here: New Goals, New Gear, New You",                             type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 301, date: "2026-07-01", topic: "Q3 Launch Clip",                                                                                                 type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 302, date: "2026-07-01", topic: "New Month New Goals",                                                                                            type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 303, date: "2026-07-01", topic: "Q3 Highlights Reel",                                                                                             type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 304, date: "2026-07-01", topic: "Q3 AI Video",                                                                                                    type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  // Jul 2
  { id: 305, date: "2026-07-02", topic: "Summer Sprint Program",           title: "8-Week Summer Sprint Training Program",                                 type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 306, date: "2026-07-02", topic: "Sprint Technique Clip",                                                                                          type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 307, date: "2026-07-02", topic: "Sprint Quote",                                                                                                   type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 308, date: "2026-07-02", topic: "Speed Highlights",                                                                                               type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 3
  { id: 309, date: "2026-07-03", topic: "Brand Values Story",              title: "What We Stand For: Our Core Brand Values",                              type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 310, date: "2026-07-03", topic: "Brand Values Clip",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 311, date: "2026-07-03", topic: "Heritage Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 312, date: "2026-07-03", topic: "Values Quote",                                                                                                   type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jul 4
  { id: 313, date: "2026-07-04", topic: "Independence Day Run",            title: "Run Free This July 4th: Our Independence Day Challenge",               type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 314, date: "2026-07-04", topic: "Run Free Clip",                                                                                                  type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 315, date: "2026-07-04", topic: "Run Free",                                                                                                       type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jul 5
  { id: 316, date: "2026-07-05", topic: "Post-Holiday Recovery",           title: "Recover Right After the Long Weekend",                                  type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 317, date: "2026-07-05", topic: "Recovery Clip",                                                                                                  type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 318, date: "2026-07-05", topic: "Rest is Training",                                                                                               type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jul 6
  { id: 319, date: "2026-07-06", topic: "New Velocity Air Max Colorway",            title: "Velocity Air Max Summer 2026 Colorway: Now Available",                           type: "Long Form",        funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 320, date: "2026-07-06", topic: "Colorway Drop Reel",                                                                                             type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 321, date: "2026-07-06", topic: "Colorway Reveal Clip",                                                                                           type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 322, date: "2026-07-06", topic: "New Drop Quote",                                                                                                 type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 323, date: "2026-07-06", topic: "Colorway AI Showcase",                                                                                           type: "Text to AI Video", funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating" },
  // Jul 7
  { id: 324, date: "2026-07-07", topic: "Mental Performance Guide",        title: "Mind Over Miles: Mental Training for Runners",                          type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 325, date: "2026-07-07", topic: "Mind Over Miles",                                                                                                type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 326, date: "2026-07-07", topic: "Mindset Clip",                                                                                                   type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 327, date: "2026-07-07", topic: "Mental Strength Highlights",                                                                                     type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 8
  { id: 328, date: "2026-07-08", topic: "Athlete Interview: Jake Chen",    title: "Jake Chen: How I Trained for My First Ultra",                           type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 329, date: "2026-07-08", topic: "Jake Chen Clip",                                                                                                 type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 330, date: "2026-07-08", topic: "Athlete Highlight Reel",                                                                                         type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review" },
  { id: 331, date: "2026-07-08", topic: "Champion's Mindset",                                                                                             type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 332, date: "2026-07-08", topic: "Athlete AI Documentary",                                                                                         type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  // Jul 9
  { id: 333, date: "2026-07-09", topic: "July Member Exclusive",           title: "July Member Exclusive: Early Access to New Drops",                      type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 334, date: "2026-07-09", topic: "Member Drop Clip",                                                                                               type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 335, date: "2026-07-09", topic: "Member Exclusive Quote",                                                                                         type: "Quote Card",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 336, date: "2026-07-09", topic: "Member Drop Highlights",                                                                                         type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 10
  { id: 337, date: "2026-07-10", topic: "Marathon Month Prep",             title: "Marathon Month: Your Week-by-Week Training Plan",                       type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 338, date: "2026-07-10", topic: "Marathon Prep Clip",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 339, date: "2026-07-10", topic: "26.2 Miles of Grit",                                                                                             type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 340, date: "2026-07-10", topic: "Marathon Training Video",                                                                                        type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 341, date: "2026-07-10", topic: "Marathon Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 11
  { id: 342, date: "2026-07-11", topic: "Yoga for Runners",                title: "Yoga & Flexibility: The Runner's Missing Link",                         type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 343, date: "2026-07-11", topic: "Flexibility Clip",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 344, date: "2026-07-11", topic: "Stretch and Recover",                                                                                            type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 12
  { id: 345, date: "2026-07-12", topic: "Weekend Challenge Recap",         title: "Community Challenge Week 2: The Results Are In",                        type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 346, date: "2026-07-12", topic: "Challenge Update Clip",                                                                                          type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 347, date: "2026-07-12", topic: "Keep Going",                                                                                                     type: "Quote Card",       funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jul 13
  { id: 348, date: "2026-07-13", topic: "Youth Sports Initiative",         title: "Investing in Youth Athletics: Our Community Program",                   type: "Long Form",        funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 349, date: "2026-07-13", topic: "Youth Sports Clip",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 350, date: "2026-07-13", topic: "Play Grow Repeat",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 351, date: "2026-07-13", topic: "Youth Highlights",                                                                                               type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "ready-for-review" },
  { id: 352, date: "2026-07-13", topic: "Youth AI Video",                                                                                                 type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "generating" },
  // Jul 14
  { id: 353, date: "2026-07-14", topic: "Mid-Summer Gear Drop",            title: "New Gear Tuesday: Mid-Summer Performance Picks",                        type: "Long Form",        funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 354, date: "2026-07-14", topic: "Gear Drop Highlights",                                                                                           type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 355, date: "2026-07-14", topic: "Gear Unboxing Clip",                                                                                             type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 356, date: "2026-07-14", topic: "Gear Drop Quote",                                                                                                type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  // Jul 15
  { id: 357, date: "2026-07-15", topic: "Back to School Campaign",         title: "Back to School 2026: Performance Gear for Student Athletes",             type: "Long Form",        funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved",        imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 358, date: "2026-07-15", topic: "BTS Campaign Clip",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 359, date: "2026-07-15", topic: "BTS Campaign Highlights",                                                                                        type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "ready-for-review" },
  { id: 360, date: "2026-07-15", topic: "New Season Quote",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 361, date: "2026-07-15", topic: "BTS AI Video",                                                                                                   type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "generating" },
  // Jul 16
  { id: 362, date: "2026-07-16", topic: "Race Day Prep Guide",             title: "Race Day: Your Hour-by-Hour Preparation Guide",                         type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 363, date: "2026-07-16", topic: "Race Day Tips Clip",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 364, date: "2026-07-16", topic: "Race Day is Payday",                                                                                             type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 365, date: "2026-07-16", topic: "Race Day Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 17
  { id: 366, date: "2026-07-17", topic: "Community Challenge Week 3",      title: "Community Challenge Update: Week 3 Leaderboard",                        type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 367, date: "2026-07-17", topic: "Challenge Clip",                                                                                                 type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 368, date: "2026-07-17", topic: "Challenge Highlights",                                                                                           type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 369, date: "2026-07-17", topic: "Community Strong",                                                                                               type: "Quote Card",       funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 18
  { id: 370, date: "2026-07-18", topic: "Trail Season Guide",              title: "Summer Trail Running: Top Routes and Gear Picks",                        type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 371, date: "2026-07-18", topic: "Trail Season Clip",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 372, date: "2026-07-18", topic: "The Trails Are Calling",                                                                                         type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  // Jul 19
  { id: 373, date: "2026-07-19", topic: "Mindset and Motivation",          title: "The Psychology of Athletic Motivation",                                  type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft",           imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 374, date: "2026-07-19", topic: "Motivation Sunday",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 375, date: "2026-07-19", topic: "Unstoppable",                                                                                                    type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 20
  { id: 376, date: "2026-07-20", topic: "Back to School Launch",           title: "Back to School 2026 Campaign is Live",                                  type: "Long Form",        funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved",        imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 377, date: "2026-07-20", topic: "BTS Launch Clip",                                                                                                type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 378, date: "2026-07-20", topic: "BTS Launch Highlights",                                                                                          type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "ready-for-review" },
  { id: 379, date: "2026-07-20", topic: "BTS Launch Quote",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "approved" },
  { id: 380, date: "2026-07-20", topic: "BTS AI Video",                                                                                                   type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Back to School",     campaignColor: "#4B56F2", status: "generating" },
  // Jul 21
  { id: 381, date: "2026-07-21", topic: "Strength Training Guide",         title: "Strength for Runners: 6 Essential Exercises",                           type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 382, date: "2026-07-21", topic: "Strength Clip",                                                                                                  type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 383, date: "2026-07-21", topic: "Strength Quote",                                                                                                 type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 384, date: "2026-07-21", topic: "Strength Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 22
  { id: 385, date: "2026-07-22", topic: "Sustainability Report",           title: "Our 2026 Sustainability Report: Progress and Promise",                   type: "Long Form",        funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 386, date: "2026-07-22", topic: "Sustainability Clip",                                                                                            type: "Short Clip",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 387, date: "2026-07-22", topic: "Tread Lightly Quote",                                                                                            type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 388, date: "2026-07-22", topic: "Sustainability AI Video",                                                                                        type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 389, date: "2026-07-22", topic: "Eco Highlights",                                                                                                 type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 23
  { id: 390, date: "2026-07-23", topic: "Loyalty Rewards Drop",            title: "July Loyalty Rewards: Exclusive Member Benefits",                       type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 391, date: "2026-07-23", topic: "Loyalty Drop Clip",                                                                                              type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 392, date: "2026-07-23", topic: "Members First",                                                                                                  type: "Quote Card",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 393, date: "2026-07-23", topic: "Loyalty Highlights",                                                                                             type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 24
  { id: 394, date: "2026-07-24", topic: "New Product Preview",             title: "Sneak Peek: What's Dropping Next Month",                                type: "Long Form",        funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 395, date: "2026-07-24", topic: "Product Preview Clip",                                                                                           type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 396, date: "2026-07-24", topic: "Coming Soon Quote",                                                                                              type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 397, date: "2026-07-24", topic: "Product Preview Reel",                                                                                           type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  { id: 398, date: "2026-07-24", topic: "Product AI Video",                                                                                               type: "Text to AI Video", funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "generating" },
  // Jul 25
  { id: 399, date: "2026-07-25", topic: "Weekend Warriors Guide",          title: "Weekend Warriors: Make Every Saturday Count",                           type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 400, date: "2026-07-25", topic: "Weekend Warrior Clip",                                                                                           type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 401, date: "2026-07-25", topic: "Warriors Quote",                                                                                                 type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 26
  { id: 402, date: "2026-07-26", topic: "Community Local Heroes",          title: "Community Spotlight: Local Athletes Making a Difference",                type: "Long Form",        funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft",           imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 403, date: "2026-07-26", topic: "Local Heroes Clip",                                                                                              type: "Short Clip",       funnelStage: "Retention",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 404, date: "2026-07-26", topic: "Community Quote",                                                                                                type: "Quote Card",       funnelStage: "Retention",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 27
  { id: 405, date: "2026-07-27", topic: "August Preview",                  title: "What's Coming in August: Your Content Calendar Preview",                type: "Long Form",        funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 406, date: "2026-07-27", topic: "August Preview Clip",                                                                                            type: "Short Clip",       funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 407, date: "2026-07-27", topic: "Whats Coming Quote",                                                                                             type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 408, date: "2026-07-27", topic: "August Preview Reel",                                                                                            type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 28
  { id: 409, date: "2026-07-28", topic: "Recovery and Sleep Science",      title: "Sleep is the Secret Weapon: Optimise Your Recovery",                    type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "ready-for-review", imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 410, date: "2026-07-28", topic: "Sleep Science Clip",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 411, date: "2026-07-28", topic: "Sleep is Training",                                                                                              type: "Quote Card",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 412, date: "2026-07-28", topic: "Recovery AI Video",                                                                                              type: "Text to AI Video", funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "generating" },
  { id: 413, date: "2026-07-28", topic: "Recovery Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  // Jul 29
  { id: 414, date: "2026-07-29", topic: "July Campaign Recap",             title: "July in Review: What Worked, What's Next",                              type: "Long Form",        funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 415, date: "2026-07-29", topic: "July Recap Clip",                                                                                                type: "Short Clip",       funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 416, date: "2026-07-29", topic: "July Highlights Reel",                                                                                           type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },
  { id: 417, date: "2026-07-29", topic: "End of Month Quote",                                                                                             type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  // Jul 30
  { id: 418, date: "2026-07-30", topic: "Flash Sale: End of Summer",       title: "Last Chance Summer Sale: Up to 40% Off",                               type: "Long Form",        funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved",        imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 419, date: "2026-07-30", topic: "Flash Sale Clip",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 420, date: "2026-07-30", topic: "Last Chance Quote",                                                                                              type: "Quote Card",       funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "approved" },
  { id: 421, date: "2026-07-30", topic: "Flash Sale Highlights",                                                                                          type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Summer Launch",      campaignColor: "#F97316", status: "ready-for-review" },
  // Jul 31
  { id: 422, date: "2026-07-31", topic: "July Wins Monthly Roundup",       title: "July by the Numbers: Our Biggest Month Yet",                            type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 423, date: "2026-07-31", topic: "Monthly Roundup Clip",                                                                                           type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "draft" },
  { id: 424, date: "2026-07-31", topic: "End Strong Quote",                                                                                               type: "Quote Card",       funnelStage: "Awareness",     campaign: "Brand Awareness Q2", campaignColor: "#8B5CF6", status: "approved" },
  { id: 425, date: "2026-07-31", topic: "July Highlights Reel",                                                                                           type: "Highlight Reel",   funnelStage: "Consideration", campaign: "Summer Launch",      campaignColor: "#F97316", status: "draft" },

  // ══════════════ AUGUST 2026 ══════════════
  // Aug 1
  { id: 500, date: "2026-08-01", topic: "Back to School: Gear Guide",      title: "Back to School 2026: Essential Gear for Student Athletes",             type: "Long Form",        funnelStage: "Awareness",     campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft",           platform: "instagram", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 501, date: "2026-08-01", topic: "Back to School IG",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "instagram" },
  { id: 502, date: "2026-08-01", topic: "Back to School FB",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "facebook" },
  { id: 503, date: "2026-08-01", topic: "Back to School TikTok",                                                                                          type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "tiktok" },
  { id: 504, date: "2026-08-01", topic: "Gear Up Clip",                                                                                                   type: "Short Clip",       funnelStage: "Awareness",     campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "youtube" },
  // Aug 3
  { id: 505, date: "2026-08-03", topic: "Fall Collection Teaser",          title: "Fall Collection 2026: First Look",                                     type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "generating", platform: "youtube" },
  { id: 506, date: "2026-08-03", topic: "Fall Collection IG",                                                                                             type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "instagram" },
  { id: 507, date: "2026-08-03", topic: "Fall Collection LinkedIn",                                                                                       type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "linkedin" },
  // Aug 5
  { id: 508, date: "2026-08-05", topic: "Training for Marathon Season",    title: "Marathon Prep 2026: Your Complete Training Guide",                     type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "ready-for-review",          platform: "linkedin", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 509, date: "2026-08-05", topic: "Marathon Tips IG",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "ready-for-review", platform: "instagram" },
  { id: 510, date: "2026-08-05", topic: "Marathon Tips X",                                                                                                type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "x" },
  { id: 511, date: "2026-08-05", topic: "Miles Make Champions",                                                                                           type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "approved", platform: "instagram" },
  // Aug 8
  { id: 512, date: "2026-08-08", topic: "Community Run Recap",             title: "August Community Run: Highlights & Highlights",                        type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "ready-for-review",          platform: "youtube", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 513, date: "2026-08-08", topic: "Community Run IG",                                                                                               type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "ready-for-review", platform: "instagram" },
  { id: 514, date: "2026-08-08", topic: "Community Run TikTok",                                                                                           type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "tiktok" },
  // Aug 10
  { id: 515, date: "2026-08-10", topic: "Product Spotlight: Velocity Flux",     title: "Velocity Flux Pulse 2: The Science of Speed",                            type: "Long Form",        funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved",        platform: "linkedin", imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 516, date: "2026-08-10", topic: "Velocity Flux IG",                                                                                                    type: "Short Clip",       funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "instagram" },
  { id: 517, date: "2026-08-10", topic: "Velocity Flux YouTube",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "ready-for-review", platform: "youtube" },
  { id: 518, date: "2026-08-10", topic: "Velocity Flux Tech Video",                                                                                            type: "Text to AI Video", funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "generating", platform: "youtube" },
  // Aug 12
  { id: 519, date: "2026-08-12", topic: "Athlete Interview: Race Day",     title: "Race Day Mindset: Interview with Elite Runner Jordan Lee",             type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 520, date: "2026-08-12", topic: "Race Day Clip",                                                                                                  type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "tiktok" },
  { id: 521, date: "2026-08-12", topic: "Every Mile Matters",                                                                                             type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Aug 15
  { id: 522, date: "2026-08-15", topic: "Mid-August Member Exclusive",     title: "Member Exclusive: Early Access to Fall Collection",                    type: "Long Form",        funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "approved",        platform: "linkedin", imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 523, date: "2026-08-15", topic: "Member Exclusive IG",                                                                                            type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "approved", platform: "instagram" },
  { id: 524, date: "2026-08-15", topic: "Member Exclusive FB",                                                                                            type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "ready-for-review", platform: "facebook" },
  { id: 525, date: "2026-08-15", topic: "Member Exclusive LinkedIn",                                                                                      type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "draft", platform: "linkedin" },
  // Aug 18
  { id: 526, date: "2026-08-18", topic: "Fall Fashion Lookbook",           title: "Fall 2026 Lookbook: Style Meets Performance",                          type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft",           platform: "youtube", imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 527, date: "2026-08-18", topic: "Lookbook Sneak Peek IG",                                                                                         type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "instagram" },
  { id: 528, date: "2026-08-18", topic: "Lookbook Sneak Peek TikTok",                                                                                     type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "tiktok" },
  // Aug 20
  { id: 529, date: "2026-08-20", topic: "Nutrition for Endurance",         title: "Fuel the Long Run: Complete Nutrition Guide for Marathon Training",    type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 530, date: "2026-08-20", topic: "Endurance Tips IG",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 531, date: "2026-08-20", topic: "Endurance Tips X",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "x" },
  { id: 532, date: "2026-08-20", topic: "Fuel the Long Run",                                                                                              type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Aug 22
  { id: 533, date: "2026-08-22", topic: "Back to School Flash Sale",       title: "Flash Sale: 30% Off Student Gear — This Weekend Only",                 type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "ready-for-review",          platform: "instagram", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 534, date: "2026-08-22", topic: "Flash Sale FB",                                                                                                  type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "ready-for-review", platform: "facebook" },
  { id: 535, date: "2026-08-22", topic: "Flash Sale TikTok",                                                                                              type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "tiktok" },
  { id: 536, date: "2026-08-22", topic: "Flash Sale X",                                                                                                   type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "x" },
  { id: 537, date: "2026-08-22", topic: "Flash Sale Clip",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "approved", platform: "youtube" },
  // Aug 25
  { id: 538, date: "2026-08-25", topic: "End of Summer Celebration",       title: "Summer 2026: Thank You for an Incredible Season",                      type: "Long Form",        funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 539, date: "2026-08-25", topic: "Summer Celebration IG",                                                                                          type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "instagram" },
  { id: 540, date: "2026-08-25", topic: "Summer Celebration FB",                                                                                          type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "facebook" },
  { id: 541, date: "2026-08-25", topic: "Summer Highlights Reel",                                                                                         type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "youtube" },
  // Aug 28
  { id: 542, date: "2026-08-28", topic: "September Training Plan Launch",  title: "September Training Plans: Your Path to Fall Fitness",                  type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 543, date: "2026-08-28", topic: "Training Plan IG",                                                                                               type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 544, date: "2026-08-28", topic: "Training Plan LinkedIn",                                                                                         type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "linkedin" },
  { id: 545, date: "2026-08-28", topic: "Plan Your Victory",                                                                                              type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Aug 30
  { id: 546, date: "2026-08-30", topic: "August Wins Roundup",             title: "August by the Numbers: Our Biggest Month Yet",                         type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 547, date: "2026-08-30", topic: "August Roundup IG",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft", platform: "instagram" },
  { id: 548, date: "2026-08-30", topic: "August Roundup FB",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft", platform: "facebook" },

  // ══════════════ SEPTEMBER 2026 ══════════════
  // Sep 1
  { id: 600, date: "2026-09-01", topic: "Fall Collection Launch Day",      title: "Fall 2026 Collection: Now Available",                                  type: "Long Form",        funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved",        platform: "linkedin", imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 601, date: "2026-09-01", topic: "Launch Day IG",                                                                                                  type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "instagram" },
  { id: 602, date: "2026-09-01", topic: "Launch Day FB",                                                                                                  type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "facebook" },
  { id: 603, date: "2026-09-01", topic: "Launch Day TikTok",                                                                                              type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "ready-for-review", platform: "tiktok" },
  { id: 604, date: "2026-09-01", topic: "Launch Day AI Video",                                                                                            type: "Text to AI Video", funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "generating", platform: "youtube" },
  // Sep 3
  { id: 605, date: "2026-09-03", topic: "Marathon Training Week 1",        title: "Marathon Prep: Week 1 Training Plan",                                  type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 606, date: "2026-09-03", topic: "Week 1 Tips IG",                                                                                                 type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 607, date: "2026-09-03", topic: "Week 1 Motivation",                                                                                              type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Sep 5
  { id: 608, date: "2026-09-05", topic: "Back to School Success Stories",  title: "Student Athletes Share Their Back-to-School Wins",                     type: "Highlight Reel",   funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "ready-for-review",          platform: "youtube", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 609, date: "2026-09-05", topic: "Success Stories IG",                                                                                             type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "ready-for-review", platform: "instagram" },
  { id: 610, date: "2026-09-05", topic: "Success Stories TikTok",                                                                                         type: "Short Clip",       funnelStage: "Decision",      campaign: "Back to School 2026", campaignColor: "#06B6D4", status: "draft", platform: "tiktok" },
  // Sep 8
  { id: 611, date: "2026-09-08", topic: "Fall Running Essentials",         title: "Fall Running Gear: Everything You Need for Autumn Miles",              type: "Long Form",        funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved",        platform: "linkedin", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 612, date: "2026-09-08", topic: "Fall Essentials IG",                                                                                             type: "Short Clip",       funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "instagram" },
  { id: 613, date: "2026-09-08", topic: "Fall Essentials LinkedIn",                                                                                       type: "Short Clip",       funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "linkedin" },
  { id: 614, date: "2026-09-08", topic: "Autumn Miles Quote",                                                                                             type: "Quote Card",       funnelStage: "Consideration", campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "instagram" },
  // Sep 10
  { id: 615, date: "2026-09-10", topic: "Community Challenge September",   title: "September Community Challenge: 30 Days of Movement",                   type: "Highlight Reel",   funnelStage: "Retention",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft",           platform: "youtube", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 616, date: "2026-09-10", topic: "Challenge IG",                                                                                                   type: "Short Clip",       funnelStage: "Retention",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "instagram" },
  { id: 617, date: "2026-09-10", topic: "Challenge TikTok",                                                                                               type: "Short Clip",       funnelStage: "Retention",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "tiktok" },
  // Sep 12
  { id: 618, date: "2026-09-12", topic: "Mid-Marathon Check-in",           title: "Halfway There: Marathon Training Week 3 Check-in",                     type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 619, date: "2026-09-12", topic: "Week 3 Tips IG",                                                                                                 type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 620, date: "2026-09-12", topic: "Halfway There Quote",                                                                                            type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Sep 15
  { id: 621, date: "2026-09-15", topic: "Member Appreciation Week",        title: "Member Appreciation Week: Exclusive Rewards Inside",                   type: "Long Form",        funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "approved",        platform: "linkedin", imageUrl: "/brand-tile-amber.svg?w=120&h=80&fit=crop" },
  { id: 622, date: "2026-09-15", topic: "Appreciation IG",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "approved", platform: "instagram" },
  { id: 623, date: "2026-09-15", topic: "Appreciation FB",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "ready-for-review", platform: "facebook" },
  { id: 624, date: "2026-09-15", topic: "Appreciation LinkedIn",                                                                                          type: "Short Clip",       funnelStage: "Decision",      campaign: "Retention Drive",     campaignColor: "#8B5CF6", status: "draft", platform: "linkedin" },
  // Sep 18
  { id: 625, date: "2026-09-18", topic: "Fall Lookbook Part 2",            title: "Fall 2026 Lookbook: Layering for Performance",                         type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft",           platform: "youtube", imageUrl: "/brand-tile-coral.svg?w=120&h=80&fit=crop" },
  { id: 626, date: "2026-09-18", topic: "Lookbook Part 2 IG",                                                                                             type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "instagram" },
  { id: 627, date: "2026-09-18", topic: "Lookbook Part 2 TikTok",                                                                                         type: "Short Clip",       funnelStage: "Awareness",     campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "tiktok" },
  // Sep 20
  { id: 628, date: "2026-09-20", topic: "Taper Week Guide",                title: "Marathon Taper Week: What to Do (and Not Do)",                         type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-navy-cyan.svg?w=120&h=80&fit=crop" },
  { id: 629, date: "2026-09-20", topic: "Taper Tips IG",                                                                                                  type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 630, date: "2026-09-20", topic: "Taper Week X",                                                                                                   type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "x" },
  { id: 631, date: "2026-09-20", topic: "Trust the Taper",                                                                                                type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Sep 22
  { id: 632, date: "2026-09-22", topic: "Fall Flash Sale",                 title: "Fall Flash Sale: 25% Off Select Styles — 48 Hours Only",               type: "Short Clip",       funnelStage: "Decision",      campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "ready-for-review",          platform: "instagram", imageUrl: "/brand-tile-amber-rose.svg?w=120&h=80&fit=crop" },
  { id: 633, date: "2026-09-22", topic: "Flash Sale FB",                                                                                                  type: "Short Clip",       funnelStage: "Decision",      campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "ready-for-review", platform: "facebook" },
  { id: 634, date: "2026-09-22", topic: "Flash Sale TikTok",                                                                                              type: "Short Clip",       funnelStage: "Decision",      campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "tiktok" },
  { id: 635, date: "2026-09-22", topic: "Flash Sale X",                                                                                                   type: "Short Clip",       funnelStage: "Decision",      campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "draft", platform: "x" },
  { id: 636, date: "2026-09-22", topic: "Flash Sale Clip",                                                                                                type: "Short Clip",       funnelStage: "Decision",      campaign: "Fall Collection Launch", campaignColor: "#EC4899", status: "approved", platform: "youtube" },
  // Sep 25
  { id: 637, date: "2026-09-25", topic: "Community Run September",         title: "September Community Run: Fall Edition Highlights",                     type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft",           platform: "youtube", imageUrl: "/brand-tile-navy.svg?w=120&h=80&fit=crop" },
  { id: 638, date: "2026-09-25", topic: "Community Run IG",                                                                                               type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "instagram" },
  { id: 639, date: "2026-09-25", topic: "Community Run FB",                                                                                               type: "Short Clip",       funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "facebook" },
  { id: 640, date: "2026-09-25", topic: "Fall Run Highlights",                                                                                            type: "Highlight Reel",   funnelStage: "Awareness",     campaign: "Community Engagement", campaignColor: "#4B56F2", status: "draft", platform: "youtube" },
  // Sep 28
  { id: 641, date: "2026-09-28", topic: "Race Day Preview",                title: "Marathon Race Day: Your Complete Guide",                               type: "Long Form",        funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-violet.svg?w=120&h=80&fit=crop" },
  { id: 642, date: "2026-09-28", topic: "Race Day IG",                                                                                                    type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  { id: 643, date: "2026-09-28", topic: "Race Day LinkedIn",                                                                                              type: "Short Clip",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "linkedin" },
  { id: 644, date: "2026-09-28", topic: "Race Day Ready",                                                                                                 type: "Quote Card",       funnelStage: "Consideration", campaign: "Marathon Prep 2026",  campaignColor: "#F59E0B", status: "draft", platform: "instagram" },
  // Sep 30
  { id: 645, date: "2026-09-30", topic: "September Wins Roundup",          title: "September by the Numbers: Fall Fitness Kickoff",                       type: "Long Form",        funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft",           platform: "linkedin", imageUrl: "/brand-tile-cyan.svg?w=120&h=80&fit=crop" },
  { id: 646, date: "2026-09-30", topic: "September Roundup IG",                                                                                           type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft", platform: "instagram" },
  { id: 647, date: "2026-09-30", topic: "September Roundup FB",                                                                                           type: "Short Clip",       funnelStage: "Consideration", campaign: "Brand Awareness Q2",  campaignColor: "#8B5CF6", status: "draft", platform: "facebook" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}
function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}


// ─── Status Summary Bar ───────────────────────────────────────────────────────

function StatusSummaryBar({
  items,
  activeFilter,
  onFilterChange,
}: {
  items: ContentItem[];
  activeFilter: string;
  onFilterChange: (status: string) => void;
}) {
  const counts = useMemo(() => {
    const map: Partial<Record<ContentStatus, number>> = {};
    for (const item of items) map[item.status] = (map[item.status] ?? 0) + 1;
    return map;
  }, [items]);

  const visible = STATUS_ORDER.filter((s) => (counts[s] ?? 0) > 0);

  return (
    <div className="flex items-center gap-0 px-4 py-2 border-b border-border bg-card/20 overflow-x-auto flex-shrink-0 min-h-[40px]">
      {visible.map((status, i) => {
        const { label, dotColor, badgeAnimCls } = STATUS_CFG[status];
        const count = counts[status] ?? 0;
        const isActive = activeFilter === status;
        const isRFR = status === "ready-for-review";

        return (
          <div key={status} className="flex items-center flex-shrink-0">
            {i > 0 && <span className="text-border mx-2 select-none text-sm">·</span>}
            <button
              onClick={() => onFilterChange(isActive ? "all" : status)}
              className={clsx(
                "flex items-center gap-2 text-sm rounded-md px-3 py-1.5 transition-all whitespace-nowrap",
                isActive
                  ? "bg-card ring-1 ring-border text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60"
              )}
            >
              <span
                className={clsx("w-2 h-2 rounded-full flex-shrink-0", badgeAnimCls)}
                style={{ backgroundColor: dotColor }}
              />
              <span className="font-bold tabular-nums" style={{ color: isActive ? undefined : dotColor }}>
                {count}
              </span>
              <span className={clsx(isRFR && !isActive && "font-semibold text-yellow-400/80")}>
                {label}
              </span>
            </button>
          </div>
        );
      })}
      <div className="ml-auto pl-4 flex-shrink-0">
        <span className="text-xs text-muted-foreground/50 tabular-nums">{items.length} total</span>
      </div>
    </div>
  );
}

// ─── Preview sub-components ───────────────────────────────────────────────────

function SocialPreview({ item }: { item: ContentItem }) {
  return (
    <div className="flex items-center justify-center p-6 h-full">
      <div className="w-[310px] rounded-2xl overflow-hidden border border-border bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">N</span>
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-foreground">nike_athletic</div>
            <div className="text-[10px] text-muted-foreground">Sponsored</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </div>
        <div
          className="relative w-full aspect-square overflow-hidden"
          style={{ background: `linear-gradient(135deg, #1c1c1c 0%, ${item.campaignColor}22 100%)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-7xl select-none">🏃</span>
            <span className="text-zinc-500 text-sm font-medium tracking-wide">{item.topic}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: item.campaignColor }} />
        </div>
        <div className="px-3 pt-2.5 pb-3">
          <div className="flex items-center gap-3 mb-2.5">
            <Heart className="w-5 h-5 text-foreground" />
            <MessageCircle className="w-5 h-5 text-foreground" />
            <Share2 className="w-5 h-5 text-foreground" />
            <Bookmark className="w-5 h-5 text-foreground ml-auto" />
          </div>
          <div className="text-xs font-semibold text-foreground mb-1">1,247 likes</div>
          <p className="text-xs text-foreground leading-relaxed">
            <span className="font-semibold mr-1">velocity.athletics</span>
            {item.topic}. Push your limits every single day. 🔥
          </p>
          <p className="text-xs text-blue-400 mt-1">#OutrunYesterday #VelocityRunning #AthleticLife</p>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">2 hours ago</p>
        </div>
      </div>
    </div>
  );
}

function BlogPreview({ item }: { item: ContentItem }) {
  return (
    <div className="overflow-y-auto h-full">
      <div
        className="w-full h-44 flex items-end p-6 flex-shrink-0"
        style={{ background: `linear-gradient(160deg, #111 0%, ${item.campaignColor}28 100%)` }}
      >
        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{item.campaign}</span>
      </div>
      <div className="px-8 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold mb-3">
          <span className="text-primary">Blog Post</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">8 min read</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{item.funnelStage}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground leading-tight mb-4">{item.title || item.topic}</h1>
        <div className="flex items-center gap-2.5 pb-5 mb-5 border-b border-border">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#818CFF] to-[#4B56F2] flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-foreground">Velocity Athletics Editorial Team</div>
            <div className="text-xs text-muted-foreground">{item.date}</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-7 mb-4">
          Every morning presents a choice: hit snooze or lace up. Athletes across the globe have discovered that the first hour of the day sets a physiological and psychological baseline that carries through every meeting, every decision, every rep that follows.
        </p>
        <p className="text-sm text-muted-foreground leading-7 mb-4">
          Research from the Journal of Sport and Exercise Psychology confirms what elite runners have known intuitively for decades — morning exercise elevates cortisol in a natural, adaptive pattern that primes cognitive function for peak performance throughout the day.
        </p>
        <p className="text-sm text-muted-foreground leading-7">
          The Velocity Flux Pulse series was engineered with this philosophy at its core. Responsive cushioning, a carbon-fiber plate, and an asymmetric lacing system combine to make the 5AM miles feel effortless — so the barrier to showing up disappears entirely...
        </p>
      </div>
    </div>
  );
}

function VideoPreview({ item }: { item: ContentItem }) {
  return (
    <div className="flex items-center justify-center p-6 h-full">
      <div
        className="relative rounded-2xl overflow-hidden border border-border shadow-2xl"
        style={{ height: 490, aspectRatio: "9/16" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, #0d0d0d 0%, ${item.campaignColor}18 100%)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9rem] opacity-[0.07] select-none">🏃</span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="text-white/60 text-[10px] bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">0:28</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
            <Play className="w-6 h-6 text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0" />
                <span className="text-white text-xs font-semibold">@velocity.athletics</span>
              </div>
              <p className="text-white text-xs leading-snug">{item.topic} 💪</p>
              <p className="text-white/50 text-[10px] mt-0.5">#VelocityRunning #OutrunYesterday</p>
            </div>
            <div className="flex flex-col items-center gap-3.5 flex-shrink-0">
              {[{ Icon: Heart, v: "84K" }, { Icon: MessageCircle, v: "412" }, { Icon: Share2, v: "Share" }].map(({ Icon, v }) => (
                <div key={v} className="flex flex-col items-center gap-0.5">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-white text-[9px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselPreview({ item }: { item: ContentItem }) {
  const [slide, setSlide] = useState(0);
  const slides = ["👟", "🏃", "💪", "🎯"];
  return (
    <div className="flex items-center justify-center p-6 h-full">
      <div className="w-[310px] rounded-2xl overflow-hidden border border-border bg-zinc-900 shadow-2xl">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-xs font-black">N</span>
          </div>
          <span className="text-xs font-semibold text-foreground flex-1">nike_athletic</span>
          <span className="text-[10px] text-muted-foreground">{slide + 1}/{slides.length}</span>
        </div>
        <div
          className="relative w-full aspect-square overflow-hidden"
          style={{ background: `linear-gradient(135deg, #1c1c1c, ${item.campaignColor}22)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-7xl select-none">{slides[slide]}</span>
            <span className="text-zinc-500 text-sm">{item.topic}</span>
          </div>
          <button
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex justify-center gap-1.5 py-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={clsx("rounded-full transition-all", i === slide ? "w-4 h-1.5 bg-foreground" : "w-1.5 h-1.5 bg-muted-foreground/30")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ item }: { item: ContentItem }) {
  return (
    <div className="overflow-y-auto h-full p-6">
      <div className="max-w-xl mx-auto rounded-xl border border-border overflow-hidden bg-card shadow-xl">
        <div className="bg-secondary px-4 py-3 border-b border-border space-y-1">
          {[
            ["From", "Velocity Athletics <hello@velocity-athletics.example>"],
            ["To", "Velocity Community Subscribers"],
            ["Subject", item.title || item.topic],
            ["Date", item.date],
          ].map(([label, value]) => (
            <div key={label} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-foreground font-medium w-14 flex-shrink-0">{label}:</span>
              <span className="truncate">{value}</span>
            </div>
          ))}
        </div>
        <div className="p-6 bg-background">
          <div
            className="w-full h-20 rounded-lg mb-5 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${item.campaignColor}22, ${item.campaignColor}08)`, border: `1px solid ${item.campaignColor}30` }}
          >
            <span className="text-xl font-black tracking-[0.2em]" style={{ color: item.campaignColor }}>VELOCITY ATHLETICS</span>
          </div>
          <h2 className="text-base font-bold text-foreground mb-3">{item.title || item.topic}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Hi there,<br /><br />
            {"We're"} thrilled to bring you {item.topic.toLowerCase()}. As a valued member of the Velocity Athletics community, you receive exclusive early access before the general public.
          </p>
          <div className="rounded-lg overflow-hidden border border-border mb-5">
            <div
              className="h-28 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, #1c1c1c, ${item.campaignColor}18)` }}
            >
              <span className="text-5xl select-none">👟</span>
            </div>
            <div className="p-3 bg-secondary">
              <div className="text-xs font-semibold text-foreground">{item.topic}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Available now · Limited quantities</div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: item.campaignColor }}
            >
              Shop Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotePreview({ item }: { item: ContentItem }) {
  const quotes = [
    "Pain is temporary. Glory lasts forever.",
    "Your only competition is who you were yesterday.",
    "Champions aren't built in comfort zones.",
    "Speed is a skill. Endurance is a mindset.",
  ];
  const quote = quotes[item.id % quotes.length];
  return (
    <div className="flex items-center justify-center p-6 h-full">
      <div
        className="relative w-72 aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, #141414 0%, ${item.campaignColor}18 100%)`,
          border: `1px solid ${item.campaignColor}25`,
        }}
      >
        <span className="absolute top-3 left-5 text-8xl font-serif leading-none opacity-[0.07] select-none" style={{ color: item.campaignColor }}>"</span>
        <span className="absolute bottom-2 right-5 text-8xl font-serif leading-none opacity-[0.07] select-none" style={{ color: item.campaignColor }}>"</span>
        <div className="relative text-center z-10">
          <p className="text-xl font-bold text-foreground leading-tight mb-5">{quote}</p>
          <div className="w-8 h-[2px] mx-auto mb-3 rounded-full" style={{ backgroundColor: item.campaignColor }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{item.campaign}</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1">{item.topic}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Content Preview Modal ────────────────────────────────────────────────────

function ContentPreviewModal({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const { icon: Icon, cls: iconCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
  const { label: statusLabel, cls: statusCls, badgeAnimCls } = STATUS_CFG[item.status];
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title || item.topic);
  const [editedTopic, setEditedTopic] = useState(item.topic);
  const [contentStatus, setContentStatus] = useState<string>(item.status);
  const [writerProfile, setWriterProfile] = useState("Professional");
  const [writingTone, setWritingTone] = useState("Inspiring");
  const [writingLevel, setWritingLevel] = useState("Intermediate");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [duration, setDuration] = useState("30");
  const [platform, setPlatform] = useState("Instagram");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState(item.date);
  const [postContent, setPostContent] = useState(item.postContent || "");

  // Mock analysis data
  const analysisScore = item.status === "approved" ? 92 : item.status === "ready-for-review" ? 78 : 65;
  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: "bg-[#12B667]/10", text: "text-[#8FE6B5]", ring: "ring-[#12B667]/30" };
    if (score >= 70) return { bg: "bg-yellow-500/10", text: "text-yellow-400", ring: "ring-yellow-500/30" };
    return { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/30" };
  };

  const renderPreview = () => {
    switch (item.type) {
      case "Long Form": return <BlogPreview item={item} />;
      case "Short Clip": return <VideoPreview item={item} />;
      case "Highlight Reel": return <CarouselPreview item={item} />;
      case "Text to AI Video": return <VideoPreview item={item} />;
      case "Quote Card": return <QuotePreview item={item} />;
    }
  };

  const isLongForm = item.type === "Long Form";
  const isVideo = item.type === "Short Clip" || item.type === "Highlight Reel" || item.type === "Text to AI Video";
  const isQuoteCard = item.type === "Quote Card";

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-50 bg-card border border-border rounded-2xl shadow-2xl flex overflow-hidden"
          style={{ inset: "5vh 5vw", maxWidth: 1280, maxHeight: "90vh", margin: "auto" }}
        >
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Header bar — Dialog.Title is here for accessibility */}
            <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border flex-shrink-0 bg-secondary/50">
              <div className={clsx("flex items-center gap-1.5 flex-shrink-0", iconCls)}>
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{item.type}</span>
              </div>
              <span className="text-border select-none">·</span>
              <Dialog.Title className="text-sm font-medium text-foreground truncate m-0">{item.topic}</Dialog.Title>
              <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-semibold", statusCls, badgeAnimCls)}>{statusLabel}</span>
                <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-semibold", FUNNEL_CFG[item.funnelStage])}>{item.funnelStage}</span>
                <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.campaignColor }} />
                  {item.campaign}
                </div>
                {/* Compact Score Indicator */}
                <button
                  onClick={() => setShowAnalyzeModal(true)}
                  className={clsx(
                    "ml-1 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ring-2",
                    getScoreColor(analysisScore).bg,
                    getScoreColor(analysisScore).ring,
                    "hover:opacity-80"
                  )}
                  title="View content analysis"
                >
                  <BarChart3 className={clsx("w-3.5 h-3.5", getScoreColor(analysisScore).text)} />
                  <span className={clsx("text-xs font-bold", getScoreColor(analysisScore).text)}>
                    {analysisScore}
                  </span>
                </button>
                <Dialog.Close asChild>
                  <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
            {/* Preview */}
            <div className="flex-1 overflow-hidden bg-background">{renderPreview()}</div>
          </div>

          {/* Edit Sidebar */}
          <div className="w-80 border-l border-border flex-shrink-0 flex flex-col bg-card">
            <div className="px-4 py-3 border-b border-border bg-secondary/50">
              <h3 className="text-sm font-bold text-foreground">Edit Content</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Status Switcher */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Status</label>
                <div className="relative">
                  <select
                    value={contentStatus}
                    onChange={(e) => setContentStatus(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer font-medium"
                  >
                    <option value="generating">Generating</option>
                    <option value="draft">Draft Complete</option>
                    <option value="ready-for-review">Request Human Edits</option>
                    <option value="approved">Being Worked On</option>
                    <option value="published">Published</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {contentStatus === "generating" && (
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Content is being generated...
                  </p>
                )}
                {contentStatus === "ready-for-review" && (
                  <p className="text-xs text-warning mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    Waiting for human review
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Content title..."
                />
              </div>

              {/* Topic */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Topic</label>
                <input
                  type="text"
                  value={editedTopic}
                  onChange={(e) => setEditedTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Content topic..."
                />
              </div>

              {/* Post Content / Caption */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Post Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/50"
                  placeholder="Write the caption, copy, or body text for this content…"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">
                  {isVideo ? "Thumbnail" : "Cover Image"}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {uploadedImage ? (
                      <div className="text-center px-3">
                        <ImageIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-xs font-medium text-foreground truncate">{uploadedImage.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs font-medium text-foreground">Upload Image</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Click to browse</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Long Form specific fields */}
              {isLongForm && (
                <>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Writer Profile</label>
                    <select
                      value={writerProfile}
                      onChange={(e) => setWriterProfile(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Expert</option>
                      <option>Storyteller</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Writing Tone</label>
                    <select
                      value={writingTone}
                      onChange={(e) => setWritingTone(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option>Inspiring</option>
                      <option>Informative</option>
                      <option>Conversational</option>
                      <option>Motivational</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Writing Level</label>
                    <select
                      value={writingLevel}
                      onChange={(e) => setWritingLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </>
              )}

              {/* Video specific fields */}
              {isVideo && (
                <>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Duration (seconds)</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      min="5"
                      max="60"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>YouTube Shorts</option>
                      <option>Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option>9:16 (Portrait)</option>
                      <option>16:9 (Landscape)</option>
                      <option>1:1 (Square)</option>
                      <option>4:5 (Instagram)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Quote Card specific fields */}
              {isQuoteCard && (
                <>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Quote Text</label>
                    <textarea
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      placeholder="Enter quote text..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-2">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Quote author..."
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </>
              )}

              {/* Publish Date */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-2">Publish Date</label>
                <div className="relative group">
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer hover:border-primary/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-border bg-secondary/50 space-y-2">
              <button className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm">
                Save Changes
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors text-sm">
                Regenerate Content
              </button>
            </div>
          </div>

          {/* Analysis Modal */}
          {showAnalyzeModal && (
            <Dialog.Root open={showAnalyzeModal} onOpenChange={setShowAnalyzeModal}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
                <Dialog.Content
                  aria-describedby={undefined}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-lg z-[60] max-h-[80vh] overflow-y-auto"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                    <div className="flex items-center gap-3">
                      <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center ring-2", getScoreColor(analysisScore).bg, getScoreColor(analysisScore).ring)}>
                        <span className={clsx("text-lg font-bold", getScoreColor(analysisScore).text)}>{analysisScore}</span>
                      </div>
                      <div>
                        <Dialog.Title className="text-base font-bold text-foreground">Content Analysis</Dialog.Title>
                        <Dialog.Description className="text-xs text-muted-foreground">Performance & quality metrics</Dialog.Description>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAnalyzeModal(false)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Sentiment Score */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sentiment Score</span>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Smile className="w-5 h-5 text-[#8FE6B5]" />
                            <span className="text-sm font-semibold text-[#8FE6B5]">Positive</span>
                          </div>
                          <span className="text-xs text-muted-foreground">89% confidence</span>
                        </div>
                        <div className="relative h-2 bg-background rounded-full overflow-hidden">
                          <div className="absolute inset-y-0 left-0 rounded-full bg-[#12B667] transition-all" style={{ width: "85%" }} />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">Negative</span>
                          <span className="text-[10px] text-muted-foreground">Positive</span>
                        </div>
                      </div>
                    </div>

                    {/* Brand Alignment */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Brand Alignment</span>
                      </div>
                      <div className="bg-secondary rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx("w-12 h-12 rounded-full flex items-center justify-center ring-4", getScoreColor(analysisScore).ring)}
                            style={{
                              background: `conic-gradient(${analysisScore >= 85 ? "#12B667" : analysisScore >= 70 ? "#f59e0b" : "#ef4444"} ${analysisScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                            }}
                          >
                            <span className="text-sm font-bold text-foreground">{analysisScore}</span>
                          </div>
                          <div>
                            <div className={clsx("text-sm font-semibold", getScoreColor(analysisScore).text)}>
                              {analysisScore >= 85 ? "Fully On-Brand" : analysisScore >= 70 ? "Minor Deviations" : "Significant Issues"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">Alignment Score</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips & Suggestions */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tips & Suggestions</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-secondary rounded-lg p-3 flex gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground leading-relaxed">Consider adding a stronger call to action at the end</p>
                        </div>
                        <div className="bg-secondary rounded-lg p-3 flex gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground leading-relaxed">Try incorporating specific brand terminology from guidelines</p>
                        </div>
                      </div>
                    </div>

                    {/* Issue Flags */}
                    {analysisScore < 85 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issue Flags</span>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-foreground leading-relaxed">Tone may be too formal for the target audience</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

// ─── Calendar Chip Hover Popup ────────────────────────────────────────────────

function ChipHoverPopup({ item, anchorRect, onClose }: {
  item: ContentItem;
  anchorRect: DOMRect;
  onClose: () => void;
}) {
  const { icon: TypeIcon, cls: typeCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
  const { label: statusLabel, dotColor } = STATUS_CFG[item.status];

  const POPUP_W = 260;
  const POPUP_H = item.imageUrl ? 220 : 160;
  const GAP = 8;

  // Horizontal: prefer right of chip, flip left if needed
  let left = anchorRect.right + GAP;
  if (left + POPUP_W > window.innerWidth - 12) {
    left = anchorRect.left - POPUP_W - GAP;
  }
  // Vertical: align top of popup to top of chip, clamp to viewport
  let top = anchorRect.top;
  if (top + POPUP_H > window.innerHeight - 12) {
    top = window.innerHeight - POPUP_H - 12;
  }
  top = Math.max(8, top);

  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{ left, top, width: POPUP_W }}
    >
      <div
        className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ boxShadow: `0 8px 32px -4px ${item.campaignColor}30, 0 2px 8px rgba(0,0,0,0.5)` }}
      >
        {/* Thumbnail */}
        {item.imageUrl ? (
          <div className="relative w-full h-28 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.topic}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-end justify-between">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: `${item.campaignColor}cc` }}
              >
                {item.campaign}
              </span>
              <span className="text-[10px] text-white/60 font-medium">{item.date}</span>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-10 flex items-center justify-between px-3"
            style={{ background: `linear-gradient(90deg, ${item.campaignColor}22 0%, transparent 100%)`, borderBottom: `2px solid ${item.campaignColor}40` }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: item.campaignColor }}
            >
              {item.campaign}
            </span>
            <span className="text-[10px] text-muted-foreground">{item.date}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-3 space-y-2">
          <div className="flex items-start gap-2">
            <TypeIcon className={clsx("w-3.5 h-3.5 mt-0.5 flex-shrink-0", typeCls)} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                {item.title || item.topic}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status */}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
              {statusLabel}
            </span>
            <span className="text-border">·</span>
            {/* Funnel */}
            <span className={clsx("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", FUNNEL_CFG[item.funnelStage])}>
              {item.funnelStage}
            </span>
          </div>

          <p className="text-[10px] text-muted-foreground/60 border-t border-border pt-2 leading-relaxed">
            Click to open · drag to reschedule
          </p>
        </div>
      </div>
    </div>
  );
}

function CalendarView({
  items, year, month,
  onItemClick, onDelete, onReschedule,
  templatesMap, recentlyUsedTemplateIds,
  onCreateContent, onCreateCampaign,
  selectMode, selectedCalItems, onToggleCalItem,
}: {
  items: ContentItem[];
  year: number;
  month: number;
  onItemClick: (item: ContentItem) => void;
  onDelete: (id: number) => void;
  onReschedule: (id: number, date: string) => void;
  templatesMap: Map<string, ProjectTemplate>;
  recentlyUsedTemplateIds: Set<string>;
  onCreateContent: (file?: File) => void;
  onCreateCampaign: () => void;
  selectMode: boolean;
  selectedCalItems: Set<number>;
  onToggleCalItem: (id: number) => void;
}) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fileDropPrompt, setFileDropPrompt] = useState<{ file: File } | null>(null);
  // Full-calendar file drag overlay
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const fileDragCounter = useRef(0);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);
  const todayStr = "2026-06-10";

  const byDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of items) (map[item.date] ??= []).push(item);
    return map;
  }, [items]);

  const handleCalendarDragEnter = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    fileDragCounter.current += 1;
    if (fileDragCounter.current === 1) setIsFileDragOver(true);
  };
  const handleCalendarDragLeave = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    fileDragCounter.current -= 1;
    if (fileDragCounter.current === 0) setIsFileDragOver(false);
  };
  const handleCalendarDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) e.preventDefault();
  };
  const handleCalendarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    fileDragCounter.current = 0;
    setIsFileDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      setFileDropPrompt({ file: e.dataTransfer.files[0] });
    }
  };

  return (
    <div
      className="flex-1 overflow-hidden flex flex-col min-h-0 relative"
      onDragEnter={handleCalendarDragEnter}
      onDragLeave={handleCalendarDragLeave}
      onDragOver={handleCalendarDragOver}
      onDrop={handleCalendarDrop}
    >
      {/* Full-calendar file-drag overlay */}
      {isFileDragOver && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center gap-3"
          style={{ background: "rgba(139,92,246,0.08)", border: "2px dashed rgba(139,92,246,0.5)" }}
        >
          <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl bg-card/90 border border-violet-500/30 shadow-xl backdrop-blur-sm">
            <Upload className="w-10 h-10 text-violet-400" />
            <p className="text-base font-bold text-foreground">Drop to add to calendar</p>
            <p className="text-xs text-muted-foreground">Creates content or campaign from your file</p>
          </div>
        </div>
      )}

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-border flex-shrink-0 bg-card/20">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2.5 text-center text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7" style={{ gridAutoRows: "minmax(120px, auto)" }}>
          {grid.map((day, idx) => {
            if (day === null) {
              return <div key={`pad-${idx}`} className="border-r border-b border-border bg-muted/[0.025]" />;
            }
            const dateStr = toDateStr(year, month, day);
            const dayItems = byDate[dateStr] ?? [];
            const isToday = dateStr === todayStr;
            const isOver = dragOverDate === dateStr;

            return (
              <div
                key={dateStr}
                className={clsx(
                  "border-r border-b border-border p-2 flex flex-col transition-colors duration-100 min-h-0 relative",
                  isToday
                    ? "bg-primary/[0.08] ring-2 ring-inset ring-primary/30"
                    : isOver
                    ? "bg-primary/[0.05] ring-1 ring-inset ring-primary/20"
                    : "hover:bg-white/[0.015]"
                )}
                onDragOver={(e) => {
                  // Only handle internal item drags (external files handled by container)
                  if (!e.dataTransfer.types.includes("Files")) {
                    e.preventDefault();
                    setDragOverDate(dateStr);
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverDate(null);
                  }
                }}
                onDrop={(e) => {
                  // External file drops are handled at the container level; only process item reschedule here
                  if (e.dataTransfer.files.length > 0) return;
                  e.preventDefault();
                  setDragOverDate(null);
                  setDraggingId(null);
                  const id = parseInt(e.dataTransfer.getData("text/plain"));
                  if (!isNaN(id)) onReschedule(id, dateStr);
                }}
              >
                <div className="flex justify-end mb-1.5 flex-shrink-0">
                  <span
                    className={clsx(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold leading-none select-none",
                      isToday ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
                    )}
                  >
                    {day}
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  {(() => {
                    const visible = dayItems;
                    const campaigns = [...new Set(visible.map(i => i.campaign))];
                    const multiCampaign = campaigns.length > 1;

                    // Status letter badge config
                    const STATUS_LETTER: Partial<Record<ContentStatus, { letter: string; bg: string; color: string }>> = {
                      draft:    { letter: "D", bg: "#F59E0B", color: "#000" },
                      approved: { letter: "A", bg: "#12B667", color: "#fff" },
                    };

                    const isPastDate = dateStr < todayStr;

                    const chips = visible.map((item) => {
                      const { icon: TypeIcon, cls: typeCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
                      const { badgeAnimCls } = STATUS_CFG[item.status];

                      // Color solely from content type — no campaign or status colors on the chip
                      const typeColor  = TYPE_COLOR[item.type] ?? "#6B7280";
                      const accentColor = typeColor;
                      const bgColor    = `${typeColor}18`;

                      const letterBadge = STATUS_LETTER[item.status];
                      const isChipSelected = selectedCalItems.has(item.id);

                      const isHovered = hoveredItemId === item.id && !draggingId;
                      const { label: statusLabel, dotColor } = STATUS_CFG[item.status];

                      return (
                        <div
                          key={item.id}
                          draggable={!selectMode && !isHovered}
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", String(item.id));
                            e.dataTransfer.effectAllowed = "move";
                            setTimeout(() => setDraggingId(item.id), 0);
                            setHoveredItemId(null);
                          }}
                          onDragEnd={() => { setDraggingId(null); setDragOverDate(null); }}
                          onClick={() => selectMode ? onToggleCalItem(item.id) : onItemClick(item)}
                          onMouseEnter={() => {
                            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                            hoverTimerRef.current = setTimeout(() => setHoveredItemId(item.id), 180);
                          }}
                          onMouseLeave={() => {
                            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                            setHoveredItemId(null);
                          }}
                          className={clsx(
                            "group/chip rounded-md overflow-hidden transition-all duration-150 select-none",
                            selectMode ? "cursor-pointer" : isHovered ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
                            draggingId === item.id && "opacity-30 scale-95",
                            isPastDate && draggingId !== item.id && !isHovered && "opacity-45 saturate-50",
                            isChipSelected && "ring-2 ring-white/50"
                          )}
                          style={{ borderLeft: `3px solid ${accentColor}`, backgroundColor: isHovered ? `${typeColor}28` : bgColor }}
                        >
                          {/* ── Compact header row (always visible) ── */}
                          <div className="flex items-center gap-1.5 px-2 py-1.5">
                            {selectMode && (
                              <span className={clsx("w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors", isChipSelected ? "bg-white border-white" : "border-white/60 bg-transparent")}>
                                {isChipSelected && <svg viewBox="0 0 8 6" className="w-1.5 h-1.5" fill="none"><path d="M1 3l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              </span>
                            )}
                            <TypeIcon className={clsx("w-3.5 h-3.5 flex-shrink-0", typeCls)} />
                            <div className="flex-1 min-w-0">
                              <span className={clsx("block text-xs text-foreground font-medium leading-tight", isHovered ? "whitespace-normal" : "truncate")}>
                                {item.topic}
                              </span>
                              {multiCampaign && !item.imageUrl && !isHovered && (
                                <span className="text-[9px] font-semibold leading-none" style={{ color: accentColor }}>{item.campaign}</span>
                              )}
                            </div>
                            {/* Status badge / delete */}
                            <div className="relative flex-shrink-0" style={{ width: letterBadge ? "auto" : 16, height: 16 }}>
                              <span className={clsx("flex items-center justify-center transition-opacity group-hover/chip:opacity-0", badgeAnimCls, "absolute inset-0")}>
                                {letterBadge && (
                                  <span className="inline-flex items-center justify-center rounded text-[9px] font-black leading-none px-1 h-4 min-w-[14px]" style={{ backgroundColor: letterBadge.bg, color: letterBadge.color }}>
                                    {letterBadge.letter}
                                  </span>
                                )}
                              </span>
                              <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/chip:opacity-100 text-muted-foreground hover:text-red-400 transition-all">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* ── Expanded preview (hover only) ── */}
                          {isHovered && (
                            <div className="px-2 pb-2 space-y-1.5">
                              {/* Thumbnail */}
                              {item.imageUrl && (
                                <div className="relative w-full rounded overflow-hidden" style={{ height: 72 }}>
                                  <img src={item.imageUrl} alt={item.topic} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-white/80">{item.date}</span>
                                </div>
                              )}
                              {/* Full title */}
                              {item.title && item.title !== item.topic && (
                                <p className="text-[11px] text-foreground/80 leading-snug font-medium">{item.title}</p>
                              )}
                              {/* Post content / caption */}
                              {item.postContent && (
                                <p className="text-[11px] text-muted-foreground leading-relaxed border-l-2 pl-2" style={{ borderColor: `${typeColor}60` }}>
                                  {item.postContent}
                                </p>
                              )}
                              {/* Meta row: status · campaign · funnel */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
                                  {statusLabel}
                                </span>
                                <span className="text-[10px] font-bold truncate max-w-[100px]" style={{ color: item.campaignColor }}>{item.campaign}</span>
                                <span className={clsx("text-[9px] font-semibold px-1.5 py-0.5 rounded-full", FUNNEL_CFG[item.funnelStage])}>{item.funnelStage}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });

                    return chips;
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover popup removed — preview now expands inline on the chip */}

      {/* File-drop choice dialog */}
      {fileDropPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFileDropPrompt(null)} />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-foreground">What would you like to create?</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    File will be attached as a resource. Date defaults to today — adjust after creation.
                  </p>
                </div>
                <button onClick={() => setFileDropPrompt(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* File pill */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">{fileDropPrompt.file.name}</span>
                <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                  {(fileDropPrompt.file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => { const f = fileDropPrompt.file; setFileDropPrompt(null); onCreateContent(f); }}
                className="group flex flex-col items-center gap-3 px-3 py-5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">Single Content</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">One content piece</div>
                </div>
              </button>

              <button
                onClick={() => { setFileDropPrompt(null); onCreateCampaign(); }}
                className="group flex flex-col items-center gap-3 px-3 py-5 rounded-xl border border-border hover:border-orange-400/40 hover:bg-orange-500/5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/15 transition-colors">
                  <Flag className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">Create Campaign</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Multi-post campaign</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({
  items, onItemClick, onDelete, onReorder,
}: {
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
  onDelete: (id: number) => void;
  onReorder: (fromId: number, toId: number) => void;
}) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);

  return (
    <div className="flex-1 overflow-auto min-h-0">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border sticky top-0 bg-background z-10">
            {["", "Type", "Topic / Title", "Scheduled", "Status", "Stage", "Campaign", ""].map((h, i) => (
              <th
                key={i}
                className={clsx(
                  "py-3 text-xs font-black text-muted-foreground/60 uppercase tracking-wider",
                  i === 0 ? "w-10 px-3" : i === 7 ? "w-12 px-3" : "px-4 text-left"
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const { icon: TypeIcon, cls: typeCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
            const { label: statusLabel, cls: statusCls, badgeAnimCls } = STATUS_CFG[item.status];
            const isDragging = draggingId === item.id;
            const isTarget = dropTargetId === item.id && !isDragging;
            const isRFR = item.status === "ready-for-review";

            return (
              <tr
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(item.id));
                  e.dataTransfer.effectAllowed = "move";
                  setTimeout(() => setDraggingId(item.id), 0);
                }}
                onDragOver={(e) => { e.preventDefault(); setDropTargetId(item.id); }}
                onDragLeave={() => setDropTargetId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromId = parseInt(e.dataTransfer.getData("text/plain"));
                  if (!isNaN(fromId) && fromId !== item.id) onReorder(fromId, item.id);
                  setDropTargetId(null);
                  setDraggingId(null);
                }}
                onDragEnd={() => { setDraggingId(null); setDropTargetId(null); }}
                onClick={() => onItemClick(item)}
                className={clsx(
                  "border-b border-border cursor-pointer group/row transition-all",
                  isDragging ? "opacity-30 bg-muted/20" : isRFR ? "bg-yellow-500/[0.04] hover:bg-yellow-500/[0.07]" : "hover:bg-white/[0.025]",
                  isTarget && "border-t-2 border-t-primary/60 bg-primary/[0.03]"
                )}
                style={{
                  borderLeft: isRFR
                    ? "3px solid #FBBF24"
                    : `3px solid ${item.campaignColor}`
                }}
              >
                {/* Drag handle */}
                <td className="py-4 px-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground/25 group-hover/row:text-muted-foreground mx-auto cursor-grab transition-colors" />
                </td>
                <td className="py-4 px-4">
                  <div className={clsx("flex items-center gap-2 whitespace-nowrap", typeCls)}>
                    <TypeIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{item.type}</span>
                  </div>
                </td>
                <td className="py-4 px-4 max-w-[280px]">
                  <div className="text-sm font-semibold text-foreground truncate">{item.topic}</div>
                  {item.title && (
                    <div className="text-xs text-muted-foreground truncate mt-1">{item.title}</div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="text-xs text-muted-foreground font-medium">{item.date}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={clsx("text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap", statusCls, badgeAnimCls)}>
                    {statusLabel}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={clsx("text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap", FUNNEL_CFG[item.funnelStage])}>
                    {item.funnelStage}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.campaignColor }} />
                    <span className="text-xs text-foreground font-medium">{item.campaign}</span>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="opacity-0 group-hover/row:opacity-100 p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Queue View ───────────────────────────────────────────────────────────────

function getCreditsForType(type: ContentType): number {
  const creditMap: Record<ContentType, number> = {
    "Quote Card": 8,
    "Short Clip": 15,
    "Long Form": 20,
    "Highlight Reel": 25,
    "Text to AI Video": 30,
  };
  return creditMap[type] || 10;
}

function QueueView({
  items,
  searchQuery,
  onSearchChange,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onItemClick,
}: {
  items: ContentItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (ids: number[]) => void;
  onItemClick: (item: ContentItem) => void;
}) {
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (i) => i.topic.toLowerCase().includes(q) || i.title?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const grouped = useMemo(() => {
    const groups = {
      draft: filteredItems.filter((i) => i.status === "draft"),
      generating: filteredItems.filter((i) => i.status === "generating"),
      "ready-for-review": filteredItems.filter((i) => i.status === "ready-for-review"),
      approved: filteredItems.filter((i) => i.status === "approved"),
    };
    return groups;
  }, [filteredItems]);

  const totalCredits = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.status === "published" || item.status === "rejected") return sum;
      return sum + getCreditsForType(item.type);
    }, 0);
  }, [items]);

  const creditsRemaining = 1000 - totalCredits;

  const groupConfig = [
    { key: "draft" as const, label: "Pending Generation", items: grouped.draft },
    { key: "generating" as const, label: "Generating", items: grouped.generating },
    { key: "ready-for-review" as const, label: "Ready for Review", items: grouped["ready-for-review"] },
    { key: "approved" as const, label: "Approved & Scheduled", items: grouped.approved },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Summary Bar */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0 bg-card/40">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">
              Total Credits Used
            </div>
            <div className="text-xl font-bold text-foreground tabular-nums">{totalCredits}</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">
              Credits Remaining
            </div>
            <div className="text-xl font-bold text-primary tabular-nums">{creditsRemaining}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          {groupConfig.map(({ key, label, items: groupItems }) => (
            <div key={key}>
              <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-0.5">
                {label}
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">{groupItems.length}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0 bg-card/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by topic or title..."
            className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Grouped Content */}
      <div className="flex-1 overflow-y-auto">
        {groupConfig.map(({ key, label, items: groupItems }) => {
          if (groupItems.length === 0) return null;

          const allSelected = groupItems.every((item) => selectedIds.has(item.id));
          const someSelected = groupItems.some((item) => selectedIds.has(item.id));

          return (
            <div key={key} className="border-b border-border">
              {/* Group Header */}
              <div className="sticky top-0 z-10 px-4 py-2.5 bg-secondary/80 backdrop-blur-sm border-b border-border">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSelectAll(groupItems.map((i) => i.id))}
                    className={clsx(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                      allSelected
                        ? "bg-primary border-primary"
                        : someSelected
                        ? "bg-primary/50 border-primary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {(allSelected || someSelected) && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-xs text-muted-foreground">({groupItems.length})</span>
                </div>
              </div>

              {/* Group Items */}
              {groupItems.map((item) => {
                const { icon: TypeIcon, cls: typeCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
                const { label: statusLabel, cls: statusCls, badgeAnimCls } = STATUS_CFG[item.status];
                const isSelected = selectedIds.has(item.id);
                const credits = getCreditsForType(item.type);

                return (
                  <div
                    key={item.id}
                    className={clsx(
                      "group/qrow flex items-center gap-3 px-4 py-3 border-b border-border/50 transition-colors hover:bg-white/[0.015]",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(item.id);
                      }}
                      className={clsx(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border group-hover/qrow:border-muted-foreground"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>

                    {/* Content Type Icon */}
                    <div className={clsx("flex-shrink-0", typeCls)}>
                      <TypeIcon className="w-4 h-4" />
                    </div>

                    {/* Topic & Title */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onItemClick(item)}
                    >
                      <div className="text-sm font-medium text-foreground truncate">
                        {item.topic}
                      </div>
                      {item.title && (
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.title}
                        </div>
                      )}
                    </div>

                    {/* Scheduled Date */}
                    <div className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {item.date}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={clsx(
                        "text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0",
                        statusCls,
                        badgeAnimCls
                      )}
                    >
                      {statusLabel}
                    </span>

                    {/* Credits */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs font-bold text-primary tabular-nums">
                        {credits}
                      </span>
                      <span className="text-[10px] text-muted-foreground">credits</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No items found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Edit Campaign Modal ──────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#F97316", "#EC4899", "#8B5CF6", "#3B82F6", "#4B56F2",
  "#F59E0B", "#EF4444", "#06B6D4", "#84CC16", "#A78BFA",
];

const ALL_CONTENT_TYPES: ContentType[] = [
  "Long Form", "Short Clip", "Highlight Reel", "Text to AI Video", "Quote Card",
];

const ALL_FUNNEL_STAGES: FunnelStage[] = ["Awareness", "Consideration", "Decision", "Retention"];

const ALL_TEMPLATES = [
  "Orange Hero", "Athlete Portrait", "Product Shot", "Motivational Quote",
  "Running Lifestyle", "Dark Minimal", "Bold Gradient", "Athletic Edge",
  "Clean Modern", "Branded",
];

// ─── Bulk Regenerate Modal ────────────────────────────────────────────────────

const REGEN_MOCK_OUTPUTS = [
  "Unlock your full potential this summer with our latest athletic collection. Engineered for peak performance and crafted for comfort, every piece is designed to move with you — not against you. Whether you're crushing a PR or recovering smart, this is gear built for athletes who never settle. Shop the Summer Collection now and train like you mean it. #AthleticPerformance #SummerCollection",
  "This summer, we didn't just design clothes — we designed a mindset. Our new collection combines cutting-edge fabric technology with a silhouette that transitions seamlessly from track to street. Sweat-wicking, four-way stretch, and built to outlast your longest sessions. Ready to elevate your game? The Summer Collection is live now.",
  "Summer training demands summer-ready gear. We've spent months testing, refining, and pushing every fabric and seam so you don't have to think about your kit — only your next rep. The Summer Collection is here: lighter, faster, and more durable than ever. Tap to explore and gear up for the season that defines your year.",
];

interface RegenSettings {
  description: string;
  instructions: string;
  brandGuideline: string;
  topics: string;
  contentGuidelines: string;
  tone: string;
  platform: string;
  length: string;
  angle: string;
  additionalInstructions: string;
  funnelStage: string;
}

const DEFAULT_REGEN_SETTINGS: RegenSettings = {
  description: "A high-energy piece showcasing our latest athletic collection, designed to inspire action and drive product discovery.",
  instructions: "Lead with an aspirational hook. Reference seasonal relevance. End with a clear CTA. Avoid passive voice.",
  brandGuideline: "Velocity Athletics Brand Standards 2026",
  topics: "performance, summer, athletic gear, lifestyle",
  contentGuidelines: "Keep language active and energetic. Use second-person (\"you\") to address the reader directly.",
  tone: "Motivational",
  platform: "Instagram",
  length: "Medium (150–250 words)",
  angle: "Product launch",
  additionalInstructions: "",
  funnelStage: "top",
};

function settingsEqual(a: RegenSettings, b: RegenSettings) {
  return (Object.keys(a) as (keyof RegenSettings)[]).every(k => a[k] === b[k]);
}

function BulkRegenerateModal({
  items, onClose, savedSettings, onSaveSettings,
}: {
  items: ContentItem[];
  onClose: () => void;
  savedSettings: RegenSettings;
  onSaveSettings: (s: RegenSettings) => void;
}) {
  const inputCls = "w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40 resize-none";
  const labelCls = "block text-xs font-bold text-foreground mb-1.5";
  const sectionCls = "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3 pt-5 border-t border-border";

  const [description, setDescription] = useState(savedSettings.description);
  const [instructions, setInstructions] = useState(savedSettings.instructions);
  const [brandGuideline, setBrandGuideline] = useState(savedSettings.brandGuideline);
  const [topics, setTopics] = useState(savedSettings.topics);
  const [contentGuidelines, setContentGuidelines] = useState(savedSettings.contentGuidelines);
  const [tone, setTone] = useState(savedSettings.tone);
  const [platform, setPlatform] = useState(savedSettings.platform);
  const [length, setLength] = useState(savedSettings.length);
  const [angle, setAngle] = useState(savedSettings.angle);
  const [additionalInstructions, setAdditionalInstructions] = useState(savedSettings.additionalInstructions);
  const [funnelStage, setFunnelStage] = useState(savedSettings.funnelStage);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [outputIndex, setOutputIndex] = useState(0);
  const [versionCount, setVersionCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSettings: RegenSettings = {
    description, instructions, brandGuideline, topics, contentGuidelines,
    tone, platform, length, angle, additionalInstructions, funnelStage,
  };
  const hasUnsavedChanges = !settingsEqual(currentSettings, savedSettings);

  const toneOptions = ["Motivational", "Inspirational", "Professional", "Casual", "Humorous", "Educational", "Authoritative", "Empathetic"];
  const platformOptions = ["Instagram", "LinkedIn", "Twitter/X", "Facebook", "TikTok", "Email", "YouTube", "Blog"];
  const lengthOptions = ["Short (under 100 words)", "Medium (150–250 words)", "Long (300+ words)"];
  const angleOptions = ["Product launch", "Lifestyle & brand story", "Educational / Tips", "Social proof", "Behind the scenes", "Seasonal / Trend", "Problem / Solution", "Comparison"];
  const brandGuidelineOptions = ["Velocity Athletics Brand Standards 2026", "Minimalist Tech Voice", "Wellness & Mindfulness", "B2B Professional Tone", "Youth Culture / Gen Z"];
  const funnelOptions = [
    { value: "top", label: "Top of Funnel — Awareness" },
    { value: "middle", label: "Middle of Funnel — Consideration" },
    { value: "bottom", label: "Bottom of Funnel — Conversion" },
  ];

  const currentOutput = REGEN_MOCK_OUTPUTS[outputIndex % REGEN_MOCK_OUTPUTS.length];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setOutputIndex(i => i + 1);
      setVersionCount(v => v + 1);
      setIsRegenerating(false);
    }, 1800);
  };

  const handleSave = () => {
    onSaveSettings(currentSettings);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setUploadedFiles(prev => [...prev, ...Array.from(files).map(f => ({ name: f.name, size: f.size }))]);
  };

  // Accent color based on campaign(s) of selected items
  const accentColor = items[0]?.campaignColor ?? "#4B56F2";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full flex overflow-hidden"
        style={{ maxWidth: 900, maxHeight: "92vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Color accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />

        {/* ── LEFT: Selected items list ── */}
        <div className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-[#0F0F0F] pt-0.5">
          <div className="px-4 pt-5 pb-3 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accentColor}22`, border: `1.5px solid ${accentColor}50` }}>
                <RefreshCw className="w-3 h-3" style={{ color: accentColor }} />
              </div>
              <h2 className="text-sm font-bold text-foreground leading-tight">Regenerate</h2>
            </div>
            <p className="text-[11px] text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""} selected</p>
          </div>
          <div className="overflow-y-auto flex-1 py-2">
            {items.map((item, i) => {
              const { icon: Icon, cls: iconCls } = TYPE_CFG[item.type] || { icon: FileText, cls: "text-gray-400" };
              return (
                <div
                  key={item.id}
                  className={clsx("flex items-start gap-2.5 px-4 py-2.5 transition-colors", i === 0 ? "bg-white/[0.04]" : "hover:bg-white/[0.02]")}
                >
                  <span className={clsx("flex-shrink-0 mt-0.5", iconCls)}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground leading-tight truncate">{item.topic}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.campaignColor }} />
                      <p className="text-[10px] text-muted-foreground truncate">{item.campaign}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Settings + Output ── */}
        <div className="flex flex-col flex-1 min-w-0 pt-0.5">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground leading-tight">Content Settings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Configure how the content will be regenerated</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {/* ── Description ── */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className={inputCls} placeholder="What is this content piece about?" />
            </div>

            <div>
              <label className={labelCls}>Directions</label>
              <textarea rows={2} value={instructions} onChange={e => setInstructions(e.target.value)} className={inputCls} placeholder="Specific directions for the AI (e.g. lead with a hook, end with a CTA)" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Brand Guideline</label>
                <div className="relative">
                  <select value={brandGuideline} onChange={e => setBrandGuideline(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {brandGuidelineOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Funnel Stage</label>
                <div className="relative">
                  <select value={funnelStage} onChange={e => setFunnelStage(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {funnelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Topics <span className="font-normal text-muted-foreground">(comma-separated)</span></label>
              <input type="text" value={topics} onChange={e => setTopics(e.target.value)} className={inputCls} placeholder="e.g. performance, summer, lifestyle" />
            </div>

            <div>
              <label className={labelCls}>Content Guidelines</label>
              <textarea rows={2} value={contentGuidelines} onChange={e => setContentGuidelines(e.target.value)} className={inputCls} placeholder="Any content rules or restrictions to follow" />
            </div>

            {/* ── Generation Options ── */}
            <p className={sectionCls}>Generation Options</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Tone</label>
                <div className="relative">
                  <select value={tone} onChange={e => setTone(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {toneOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Platform</label>
                <div className="relative">
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {platformOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Length</label>
                <div className="relative">
                  <select value={length} onChange={e => setLength(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {lengthOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Content Angle</label>
                <div className="relative">
                  <select value={angle} onChange={e => setAngle(e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                    {angleOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── Additional Instructions ── */}
            <p className={sectionCls}>Additional Instructions</p>
            <textarea rows={2} value={additionalInstructions} onChange={e => setAdditionalInstructions(e.target.value)} className={inputCls} placeholder="Anything else to guide this regeneration…" />

            {/* ── Upload Resources ── */}
            <p className={sectionCls}>Upload Resources</p>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-border/60 hover:bg-secondary/20 cursor-pointer transition-all"
            >
              <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Drop files or <span className="text-primary">browse</span></p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Documents, images, PDFs — used as context</p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 -mt-1">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-secondary/40 rounded-lg">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-foreground truncate flex-1">{f.name}</span>
                    <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── Generated Output ── */}
            <p className={sectionCls}>Generated Output</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Version {versionCount}</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className={clsx("px-4 py-3 text-sm leading-relaxed text-foreground bg-[#111] min-h-[80px] transition-opacity duration-300", isRegenerating && "opacity-40")}>
                {isRegenerating ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating new version…</span>
                  </div>
                ) : currentOutput}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-card/60 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-semibold transition-colors">
              Cancel
            </button>

            {/* Unsaved changes pill */}
            {hasUnsavedChanges && !savedFeedback && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400/80 font-medium select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                Unsaved changes
              </span>
            )}
            {savedFeedback && (
              <span className="flex items-center gap-1.5 text-xs text-[#8FE6B5] font-medium select-none">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}

            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-5 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-semibold transition-colors"
            >
              Use This Version
            </button>
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || savedFeedback}
              className="flex items-center gap-2 px-5 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5 text-[#8FE6B5]" /> : null}
              {savedFeedback ? "Saved" : "Save"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-lg text-sm font-bold transition-colors"
            >
              {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {isRegenerating ? "Regenerating…" : "Regenerate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditCampaignModal({
  campaign,
  itemCount,
  onClose,
  onSave,
  onSaveAndRegenerate,
}: {
  campaign: Campaign;
  itemCount: number;
  onClose: () => void;
  onSave: (updated: Campaign) => void;
  onSaveAndRegenerate: (updated: Campaign) => void;
}) {
  const [name, setName] = useState(campaign.name);
  const [color, setColor] = useState(campaign.color);
  const [description, setDescription] = useState(campaign.description);
  const [instructions, setInstructions] = useState(campaign.instructions);
  const [duration, setDuration] = useState(campaign.duration);
  const [topics, setTopics] = useState(campaign.topics);
  const [brandGuidelines, setBrandGuidelines] = useState(campaign.brandGuidelines);
  const [targetAudience, setTargetAudience] = useState(campaign.targetAudience);
  const [contentTypes, setContentTypes] = useState<string[]>(campaign.contentTypes);
  const [funnelStages, setFunnelStages] = useState<string[]>(campaign.funnelStages);
  const [resources, setResources] = useState<string[]>(campaign.resources);
  const [templates, setTemplates] = useState<string[]>(campaign.templates);

  const toggleArr = <T extends string>(arr: T[], setArr: (v: T[]) => void, val: T) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const build = (): Campaign => ({
    name, color, description, instructions, duration, topics,
    brandGuidelines, targetAudience,
    contentTypes, funnelStages, resources, templates,
  });

  const inputCls = "w-full px-3 py-2 bg-[#111] border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40 resize-none";
  const labelCls = "block text-xs font-bold text-foreground mb-1.5";
  const sectionCls = "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3 pt-5 border-t border-border";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
        style={{ maxWidth: 640, maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: color }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}50` }}>
            <div className="w-full h-full rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground leading-tight">Edit Campaign</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{itemCount} content item{itemCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── Campaign Identity ── */}
          <div>
            <label className={labelCls}>Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. Summer Launch"
            />
          </div>

          <div>
            <label className={labelCls}>Colour</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c ? `0 0 0 2px #111, 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className={inputCls} placeholder="What is this campaign about?" />
          </div>

          <div>
            <label className={labelCls}>Campaign Duration</label>
            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className={inputCls} placeholder="e.g. May 1 – Aug 31, 2026" />
          </div>

          {/* ── Content Strategy ── */}
          <p className={sectionCls}>Content Strategy</p>

          <div>
            <label className={labelCls}>Topics <span className="font-normal text-muted-foreground">(comma-separated)</span></label>
            <input type="text" value={topics} onChange={e => setTopics(e.target.value)} className={inputCls} placeholder="e.g. product launch, athlete spotlight, training tips" />
          </div>

          <div>
            <label className={labelCls}>Instructions</label>
            <textarea rows={3} value={instructions} onChange={e => setInstructions(e.target.value)} className={inputCls} placeholder="Specific directions for AI content generation…" />
          </div>

          <div>
            <label className={labelCls}>Content Types</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CONTENT_TYPES.map(ct => {
                const { icon: Icon, cls } = TYPE_CFG[ct];
                const active = contentTypes.includes(ct);
                return (
                  <button
                    key={ct}
                    onClick={() => toggleArr(contentTypes, setContentTypes as (v: string[]) => void, ct)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all",
                      active ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-card"
                    )}
                  >
                    <Icon className={clsx("w-3.5 h-3.5", active ? "text-primary" : cls)} />
                    {ct}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>Funnel Stages</label>
            <div className="flex flex-wrap gap-2">
              {ALL_FUNNEL_STAGES.map(fs => {
                const active = funnelStages.includes(fs);
                return (
                  <button
                    key={fs}
                    onClick={() => toggleArr(funnelStages, setFunnelStages as (v: string[]) => void, fs)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all",
                      active ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {fs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Brand ── */}
          <p className={sectionCls}>Brand</p>

          <div>
            <label className={labelCls}>Brand Guidelines</label>
            <textarea rows={3} value={brandGuidelines} onChange={e => setBrandGuidelines(e.target.value)} className={inputCls} placeholder="Describe your brand voice, style, and dos/don'ts…" />
          </div>

          <div>
            <label className={labelCls}>Target Audience</label>
            <textarea rows={2} value={targetAudience} onChange={e => setTargetAudience(e.target.value)} className={inputCls} placeholder="Who is this campaign for?" />
          </div>

          {/* ── Resources & Templates ── */}
          <p className={sectionCls}>Resources & Templates</p>

          <div>
            <label className={labelCls}>Linked Resources</label>
            <div className="space-y-1.5">
              {["Brand Guidelines 2026.pdf", "Summer Campaign Video.mp4", "Athlete Testimonials.docx", "Product Photography.pdf"].map(r => {
                const active = resources.includes(r);
                return (
                  <label key={r} className={clsx("flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors", active ? "border-primary/40 bg-primary/5" : "border-border hover:bg-secondary/40")}>
                    <div className={clsx("w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors", active ? "bg-primary border-primary" : "border-border")}>
                      {active && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <input type="checkbox" checked={active} onChange={() => toggleArr(resources, setResources, r)} className="hidden" />
                    <span className="text-xs font-medium text-foreground">{r}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pb-2">
            <label className={labelCls}>Templates</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TEMPLATES.map(t => {
                const active = templates.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleArr(templates, setTemplates, t)}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all",
                      active ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-card/60 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-semibold transition-colors">
            Cancel
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onSave(build())}
            className="px-5 py-2 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm font-semibold transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => onSaveAndRegenerate(build())}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Save &amp; Regenerate All
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaigns Section ────────────────────────────────────────────────────────

function CampaignsSection({
  items,
  campaigns,
  selectedCampaigns,
  onCampaignToggle,
}: {
  items: ContentItem[];
  campaigns: Campaign[];
  selectedCampaigns: Set<string>;
  onCampaignToggle: (campaign: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const campaignStats = useMemo(() => {
    const stats: Record<string, { total: number; byStatus: Record<ContentStatus, number>; dateRange: { earliest: string; latest: string } }> = {};

    campaigns.forEach((c) => {
      stats[c.name] = {
        total: 0,
        byStatus: {} as Record<ContentStatus, number>,
        dateRange: { earliest: "", latest: "" },
      };
    });

    items.forEach((item) => {
      if (stats[item.campaign]) {
        stats[item.campaign].total++;
        stats[item.campaign].byStatus[item.status] = (stats[item.campaign].byStatus[item.status] || 0) + 1;

        if (!stats[item.campaign].dateRange.earliest || item.date < stats[item.campaign].dateRange.earliest) {
          stats[item.campaign].dateRange.earliest = item.date;
        }
        if (!stats[item.campaign].dateRange.latest || item.date > stats[item.campaign].dateRange.latest) {
          stats[item.campaign].dateRange.latest = item.date;
        }
      }
    });

    return stats;
  }, [items]);

  return (
    <div className="border-t border-border bg-card/20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.015] transition-colors"
      >
        <ChevronDown className={clsx("w-5 h-5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        <span className="text-base font-bold text-foreground">Campaigns</span>
        <span className="text-xs text-muted-foreground font-medium">({campaigns.length})</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {campaigns.map((campaign) => {
            const stats = campaignStats[campaign.name];
            const isSelected = selectedCampaigns.has(campaign.name);

            return (
              <button
                key={campaign.name}
                onClick={() => onCampaignToggle(campaign.name)}
                className={clsx(
                  "group relative p-5 rounded-xl border transition-all text-left",
                  isSelected
                    ? "bg-card border-primary/40 ring-2 ring-primary/20"
                    : "bg-card/60 border-border hover:border-border/80 hover:bg-card"
                )}
                style={{
                  borderLeftWidth: "5px",
                  borderLeftColor: campaign.color,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate mb-1.5">{campaign.name}</h3>
                    {stats.dateRange.earliest && (
                      <p className="text-xs text-muted-foreground font-medium">
                        {new Date(stats.dateRange.earliest).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" - "}
                        {new Date(stats.dateRange.latest).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-black"
                      style={{ backgroundColor: `${campaign.color}18`, color: campaign.color }}
                    >
                      {stats.total}
                    </div>
                  </div>
                </div>

                {/* Status distribution bar */}
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-muted mb-3">
                  {STATUS_ORDER.map((status) => {
                    const count = stats.byStatus[status] || 0;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    if (percentage === 0) return null;
                    return (
                      <div
                        key={status}
                        className="h-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: STATUS_CFG[status].dotColor,
                        }}
                        title={`${STATUS_CFG[status].label}: ${count}`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold">{stats.total} {stats.total === 1 ? 'item' : 'items'}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Filter section helper ────────────────────────────────────────────────────

function FilterSection({
  title, options, labels, dots, value, onChange,
}: {
  title: string;
  options: string[];
  labels: Record<string, string>;
  dots?: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <div className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest mb-1 px-2 pt-1">{title}</div>
      {options.map((opt) => (
        <DropdownMenu.Item
          key={opt}
          onSelect={() => onChange(opt)}
          className={clsx(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer outline-none transition-colors",
            value === opt ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          {dots?.[opt] && (
            <span
              className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", opt === "generating" && "animate-pulse")}
              style={{ backgroundColor: dots[opt] }}
            />
          )}
          <span className="flex-1">{labels[opt] ?? opt}</span>
          {value === opt && <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
        </DropdownMenu.Item>
      ))}
    </>
  );
}

// ─── Campaign Launch Modal ────────────────────────────────────────────────────

function CampaignLaunchModal({ open, onClose, onCreateNew, onDuplicate }: {
  open: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onDuplicate: (campaign: PreviousCampaign) => void;
}) {
  const [mode, setMode] = useState<"choose" | "existing">("choose");
  const [search, setSearch] = useState("");

  // Reset when closed
  useEffect(() => {
    if (!open) { setMode("choose"); setSearch(""); }
  }, [open]);

  const filtered = PREVIOUS_CAMPAIGNS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">New Campaign</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "choose" ? "How do you want to start?" : "Choose a campaign to duplicate"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === "choose" ? (
          /* ── Option cards ── */
          <div className="p-4 grid grid-cols-2 gap-3">
            <button
              onClick={onCreateNew}
              className="group flex flex-col items-center gap-3 px-4 py-6 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Create New</div>
                <div className="text-xs text-muted-foreground mt-0.5">Start from scratch</div>
              </div>
            </button>

            <button
              onClick={() => setMode("existing")}
              className="group flex flex-col items-center gap-3 px-4 py-6 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                <Flag className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Duplicate Existing</div>
                <div className="text-xs text-muted-foreground mt-0.5">Copy all settings</div>
              </div>
            </button>
          </div>
        ) : (
          /* ── Campaign picker ── */
          <div className="flex flex-col" style={{ maxHeight: "70vh" }}>
            <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search campaigns…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
              {filtered.map(campaign => (
                <button
                  key={campaign.id}
                  onClick={() => onDuplicate(campaign)}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: campaign.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {campaign.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {campaign.description}
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-[10px] text-muted-foreground/70 bg-secondary px-2 py-0.5 rounded-full">{campaign.dateRange}</span>
                        <span className="text-[10px] text-muted-foreground/70 bg-secondary px-2 py-0.5 rounded-full">{campaign.durationValue} {campaign.durationUnit}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">No campaigns found</div>
              )}
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={() => setMode("choose")}
                className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ProjectView ─────────────────────────────────────────────────────────

// Remove the old interface since we're using useParams now

interface ProjectResource {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: Date;
}

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const projectIdNum = Number(projectId);
  const projectName = 'Project ' + projectId; // Can be enhanced to fetch actual name
  
  const onBack = () => navigate('/projects');
  
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [items, setItems] = useState<ContentItem[]>(INITIAL_ITEMS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [createOpen, setCreateOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [selectedContentTypeForCreation, setSelectedContentTypeForCreation] = useState<"long-form" | "short-clip" | "highlight-reel" | "ai-video" | "quote-card" | undefined>(undefined);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignDuplicate, setCampaignDuplicate] = useState<PreviousCampaign | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // Resources
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Templates
  const [templates, setTemplates] = useState<ProjectTemplate[]>(SEED_TEMPLATES);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [tplName, setTplName] = useState("");
  const [tplLink, setTplLink] = useState("");
  const [tplImageFile, setTplImageFile] = useState<File | null>(null);
  const [tplImagePreview, setTplImagePreview] = useState<string>("");
  const [tplIsDragOver, setTplIsDragOver] = useState(false);
  const tplFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!createMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [createMenuOpen]);

  const handleTplImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setTplIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setTplImageFile(file);
      setTplImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleTplImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTplImageFile(file);
      setTplImagePreview(URL.createObjectURL(file));
    }
  };

  const confirmAddTemplate = () => {
    if (!tplImagePreview) return;
    const newTpl: ProjectTemplate = {
      id: `tpl-${Date.now()}`,
      name: tplName.trim() || "Untitled Template",
      imageUrl: tplImagePreview,
      imageFile: tplImageFile ?? undefined,
      link: tplLink.trim() || undefined,
      createdAt: new Date(),
    };
    setTemplates(prev => [newTpl, ...prev]);
    setTplName(""); setTplLink(""); setTplImageFile(null); setTplImagePreview("");
    setTemplateDialogOpen(false);
    toast.success("Template added");
  };

  const removeTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success("Template removed");
  };

  // Compute recently used templates: any templateId used in items within the last 21 days
  const recentlyUsedTemplateIds = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 21);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const ids = new Set<string>();
    for (const item of items) {
      if (item.templateId && item.date >= cutoffStr) ids.add(item.templateId);
    }
    return ids;
  }, [items]);

  const templatesMap = useMemo(() => {
    const m = new Map<string, ProjectTemplate>();
    for (const t of templates) m.set(t.id, t);
    return m;
  }, [templates]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setPendingFiles(prev => [...prev, ...files]);
  };

  const confirmUpload = () => {
    if (!pendingFiles.length) return;
    const newResources: ProjectResource[] = pendingFiles.map(f => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      addedAt: new Date(),
    }));
    setResources(prev => [...prev, ...newResources]);
    const count = pendingFiles.length;
    setPendingFiles([]);
    setUploadDialogOpen(false);
    toast.success(`${count} ${count === 1 ? "file" : "files"} added to project`);
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const resourceIcon = (type: string) => {
    if (type.startsWith("video/")) return <Video className="w-4 h-4 text-violet-400" />;
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-blue-400" />;
    if (type === "application/pdf") return <FileText className="w-4 h-4 text-red-400" />;
    return <FileText className="w-4 h-4 text-muted-foreground" />;
  };

  const [selectedCampaigns, setSelectedCampaigns] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<ContentType>>(new Set());
  const [selectedFunnelStages, setSelectedFunnelStages] = useState<Set<FunnelStage>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<ContentStatus>>(new Set());
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCalItems, setSelectedCalItems] = useState<Set<number>>(new Set());
  const [bulkRegenerateItems, setBulkRegenerateItems] = useState<ContentItem[]>([]);
  const [savedRegenSettings, setSavedRegenSettings] = useState<RegenSettings>(DEFAULT_REGEN_SETTINGS);

  const toggleSelectMode = () => {
    if (selectMode) { setSelectedCalItems(new Set()); setSelectMode(false); }
    else setSelectMode(true);
  };
  const toggleCalItem = (id: number) => {
    setSelectedCalItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const clearCalSelection = () => { setSelectedCalItems(new Set()); setSelectMode(false); };

  const filteredItems = useMemo(
    () =>
      items.filter(
        (i) => {
          if (selectedCampaigns.size > 0 && !selectedCampaigns.has(i.campaign)) return false;
          if (selectedTypes.size > 0 && !selectedTypes.has(i.type)) return false;
          if (selectedFunnelStages.size > 0 && !selectedFunnelStages.has(i.funnelStage)) return false;
          if (selectedStatuses.size > 0 && !selectedStatuses.has(i.status)) return false;
          if (dateRange.start && i.date < dateRange.start) return false;
          if (dateRange.end && i.date > dateRange.end) return false;
          return true;
        }
      ),
    [items, selectedCampaigns, selectedTypes, selectedFunnelStages, selectedStatuses, dateRange]
  );

  const handleDelete = (id: number) => setItems((p) => p.filter((i) => i.id !== id));

  const handleSaveCampaign = (updated: Campaign, regenerate = false) => {
    const oldName = campaignToEdit!.name;
    setCampaigns(p => p.map(c => c.name === oldName ? updated : c));
    // If name changed, update all items that referenced the old name
    if (oldName !== updated.name) {
      setItems(p => p.map(i => i.campaign === oldName
        ? { ...i, campaign: updated.name, campaignColor: updated.color }
        : i
      ));
      setSelectedCampaigns(prev => {
        if (!prev.has(oldName)) return prev;
        const next = new Set(prev);
        next.delete(oldName);
        next.add(updated.name);
        return next;
      });
    } else {
      // Color may have changed — sync color on items too
      setItems(p => p.map(i => i.campaign === oldName ? { ...i, campaignColor: updated.color } : i));
    }
    if (regenerate) {
      setItems(p => p.map(i =>
        i.campaign === updated.name ? { ...i, status: "generating" as ContentStatus } : i
      ));
      toast.success(`Regenerating all ${updated.name} content…`);
    } else {
      toast.success("Campaign saved.");
    }
    setCampaignToEdit(null);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setItems((p) => p.filter((i) => i.campaign !== campaign.name));
    setCampaigns((p) => p.filter((c) => c.name !== campaign.name));
    setSelectedCampaigns((prev) => {
      const next = new Set(prev);
      next.delete(campaign.name);
      return next;
    });
    setCampaignToDelete(null);
  };
  const handleReschedule = (id: number, date: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, date } : i)));
  const handleReorder = (fromId: number, toId: number) =>
    setItems((prev) => {
      const fi = prev.findIndex((i) => i.id === fromId);
      const ti = prev.findIndex((i) => i.id === toId);
      const next = [...prev];
      const [removed] = next.splice(fi, 1);
      next.splice(ti, 0, removed);
      return next;
    });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
  };

  const toggleCampaign = (campaign: string) => {
    const newSet = new Set(selectedCampaigns);
    if (newSet.has(campaign)) {
      newSet.delete(campaign);
    } else {
      newSet.add(campaign);
    }
    setSelectedCampaigns(newSet);
  };

  const toggleType = (type: ContentType) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const toggleFunnelStage = (stage: FunnelStage) => {
    const newSet = new Set(selectedFunnelStages);
    if (newSet.has(stage)) {
      newSet.delete(stage);
    } else {
      newSet.add(stage);
    }
    setSelectedFunnelStages(newSet);
  };

  const toggleStatusFilter = (status: ContentStatus) => {
    const newSet = new Set(selectedStatuses);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setSelectedStatuses(newSet);
  };

  const clearAllFilters = () => {
    setSelectedCampaigns(new Set());
    setSelectedTypes(new Set());
    setSelectedFunnelStages(new Set());
    setSelectedStatuses(new Set());
    setDateRange({ start: "", end: "" });
  };

  const hasActiveFilters =
    selectedCampaigns.size > 0 ||
    selectedTypes.size > 0 ||
    selectedFunnelStages.size > 0 ||
    selectedStatuses.size > 0 ||
    dateRange.start !== "" ||
    dateRange.end !== "";

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background min-w-0">

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0 bg-card/40">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 mr-2">
          <div className="text-base font-bold text-foreground truncate leading-tight">{projectName}</div>
          <div className="text-xs text-muted-foreground leading-none mt-1">{filteredItems.length} content items</div>
        </div>

        {!showReports && (
          <>
            <div className="h-6 w-px bg-border mx-1 flex-shrink-0" />

            {/* View toggle */}
            <div className="flex items-center bg-secondary rounded-lg p-1 gap-1 flex-shrink-0">
              {(["calendar", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all capitalize",
                    viewMode === mode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode === "calendar" ? <CalendarDays className="w-4 h-4" /> : <List className="w-4 h-4" />}
                  {mode}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Right actions */}
        <button
          onClick={() => setShowReports(!showReports)}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border transition-colors flex-shrink-0",
            showReports
              ? "bg-primary/10 text-primary border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>
        <button
          onClick={() => setReviewMode(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Review</span>
        </button>

        {/* ── Merged Create button + dropdown ── */}
        <div ref={createMenuRef} className="relative flex-shrink-0">
          <button
            onClick={() => setCreateMenuOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>

          {createMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
              <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-4 pt-3 pb-2">
                Create New
              </p>
              <button
                onClick={() => { setCreateMenuOpen(false); setLaunchModalOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Flag className="w-3.5 h-3.5 text-orange-400" />
                </div>
                New Campaign
              </button>
              <button
                onClick={() => { setCreateMenuOpen(false); setCreateOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                New Content
              </button>
              <div className="h-1" />
            </div>
          )}
        </div>
      </div>

      {/* ── Filters + Calendar month nav (consolidated) ── */}
      {!showReports && (
      <div className="px-4 py-2 border-b border-border flex-shrink-0 bg-card/30 h-12 flex items-center">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {/* Campaign Filter Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0",
                  selectedCampaigns.size > 0
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-foreground hover:bg-accent"
                )}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Campaigns</span>
                {selectedCampaigns.size > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold">
                    {selectedCampaigns.size}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 bg-card border border-border rounded-lg shadow-xl p-2 w-64"
                sideOffset={4}
                align="start"
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border px-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Campaigns</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        campaigns.forEach(c => {
                          if (!selectedCampaigns.has(c.name)) toggleCampaign(c.name);
                        });
                      }}
                      className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors px-1.5 py-0.5"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => {
                        Array.from(selectedCampaigns).forEach(c => toggleCampaign(c));
                      }}
                      className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {campaigns.map((campaign) => {
                  const isSelected = selectedCampaigns.has(campaign.name);
                  const itemCount = items.filter(i => i.campaign === campaign.name).length;
                  return (
                    <div key={campaign.name} className="group/camprow flex items-center gap-1 rounded-md transition-colors hover:bg-accent">
                      <DropdownMenu.CheckboxItem
                        checked={isSelected}
                        onCheckedChange={() => toggleCampaign(campaign.name)}
                        className="flex items-center gap-2 px-2 py-1.5 flex-1 text-xs cursor-pointer outline-none"
                      >
                        <div
                          className={clsx(
                            "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                            isSelected ? "bg-primary border-primary" : "border-border"
                          )}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: campaign.color }} />
                        <span className="flex-1 font-medium text-foreground">{campaign.name}</span>
                      </DropdownMenu.CheckboxItem>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCampaignToEdit(campaign); }}
                        title={`Edit "${campaign.name}"`}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCampaignToDelete(campaign); }}
                        title={`Delete "${campaign.name}"`}
                        className="flex-shrink-0 w-5 h-5 mr-1 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="h-4 w-px bg-border flex-shrink-0" />

          {/* Content Type Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0",
                  selectedTypes.size > 0
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-foreground hover:bg-accent"
                )}
              >
                <span>Content Type</span>
                {selectedTypes.size > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold">
                    {selectedTypes.size}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 bg-card border border-border rounded-lg shadow-xl p-2 w-52"
                sideOffset={4}
                align="start"
              >
                {(["Long Form", "Short Clip", "Highlight Reel", "Text to AI Video", "Quote Card"] as ContentType[]).map((type) => {
                  const { icon: Icon, cls } = TYPE_CFG[type];
                  const isSelected = selectedTypes.has(type);
                  return (
                    <DropdownMenu.CheckboxItem
                      key={type}
                      checked={isSelected}
                      onCheckedChange={() => toggleType(type)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer outline-none transition-colors hover:bg-accent"
                    >
                      <div
                        className={clsx(
                          "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border"
                        )}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <Icon className={clsx("w-3.5 h-3.5 flex-shrink-0", cls)} />
                      <span className="flex-1 font-medium text-foreground">{type}</span>
                    </DropdownMenu.CheckboxItem>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="h-4 w-px bg-border flex-shrink-0" />

          {/* Funnel Stage Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex-shrink-0",
                  selectedFunnelStages.size > 0
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-foreground hover:bg-accent"
                )}
              >
                <span>Funnel Stage</span>
                {selectedFunnelStages.size > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold">
                    {selectedFunnelStages.size}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 bg-card border border-border rounded-lg shadow-xl p-2 w-52"
                sideOffset={4}
                align="start"
              >
                {[
                  { stage: "Awareness" as FunnelStage, label: "Top of Funnel", color: "#3B82F6" },
                  { stage: "Consideration" as FunnelStage, label: "Middle of Funnel", color: "#F59E0B" },
                  { stage: "Decision" as FunnelStage, label: "Bottom of Funnel", color: "#4B56F2" }
                ].map(({ stage, label, color }) => {
                  const isSelected = selectedFunnelStages.has(stage);
                  return (
                    <DropdownMenu.CheckboxItem
                      key={stage}
                      checked={isSelected}
                      onCheckedChange={() => toggleFunnelStage(stage)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer outline-none transition-colors hover:bg-accent"
                    >
                      <div
                        className={clsx(
                          "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border"
                        )}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="flex-1 font-medium text-foreground">{label}</span>
                    </DropdownMenu.CheckboxItem>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="h-4 w-px bg-border flex-shrink-0" />

          {/* Status Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={clsx(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all flex-shrink-0",
                  selectedStatuses.size > 0
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <span>Status</span>
                {selectedStatuses.size > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[14px] h-3.5 px-1 flex items-center justify-center font-bold">
                    {selectedStatuses.size}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 bg-card border border-border rounded-lg shadow-xl p-2 w-48"
                sideOffset={4}
              >
                {(["draft", "generating", "ready-for-review", "approved", "published"] as ContentStatus[]).map((status) => {
                  const { label, dotColor } = STATUS_CFG[status];
                  const isSelected = selectedStatuses.has(status);
                  return (
                    <DropdownMenu.CheckboxItem
                      key={status}
                      checked={isSelected}
                      onCheckedChange={() => toggleStatusFilter(status)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer outline-none transition-colors hover:bg-accent"
                    >
                      <div
                        className={clsx(
                          "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border"
                        )}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="flex-1 font-medium text-foreground">{label}</span>
                    </DropdownMenu.CheckboxItem>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="h-4 w-px bg-border flex-shrink-0" />

          {/* Select Mode Toggle */}
          <button
            onClick={toggleSelectMode}
            className={clsx(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all flex-shrink-0",
              selectMode
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <span
              className={clsx(
                "w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors",
                selectMode ? "bg-primary border-primary" : "border-muted-foreground"
              )}
            >
              {selectMode && (
                <svg viewBox="0 0 8 6" className="w-1.5 h-1.5" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            Select
            {selectedCalItems.size > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[14px] h-3.5 px-1 flex items-center justify-center font-bold">
                {selectedCalItems.size}
              </span>
            )}
          </button>

          <div className="h-4 w-px bg-border flex-shrink-0" />

          {/* Date Range Picker */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="relative group">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-2 py-1 pr-7 bg-secondary border border-border rounded-md text-[11px] text-foreground w-[110px] focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-primary/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Calendar className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[11px] text-muted-foreground">—</span>
            <div className="relative group">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-2 py-1 pr-7 bg-secondary border border-border rounded-md text-[11px] text-foreground w-[110px] focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-primary/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Calendar className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <>
              <div className="h-4 w-px bg-border flex-shrink-0" />
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 rounded-md text-[11px] font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
              >
                Clear All
              </button>
            </>
          )}
        </div>

        {/* Month Navigation - Far Right */}
        {viewMode === "calendar" && (
          <>
            <div className="h-6 w-px bg-border mx-2 flex-shrink-0" />
            <button
              onClick={() => {
                const today = new Date();
                setYear(today.getFullYear());
                setMonth(today.getMonth());
              }}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-border text-foreground hover:bg-secondary transition-colors flex-shrink-0"
            >
              Today
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={prevMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-foreground min-w-[100px] text-center select-none">
                {MONTH_NAMES[month]} {year}
              </span>
              <button onClick={nextMonth} className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
      )}

      {/* Active Filters Chips */}
      {!showReports && hasActiveFilters && (
      <div className="px-4 py-2 border-b border-border flex-shrink-0 bg-card/20">
        <div className="flex flex-wrap gap-1.5">

          {Array.from(selectedCampaigns).map((campaign) => {
            const campaignObj = campaigns.find(c => c.name === campaign);
            return (
              <div
                key={campaign}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border"
              >
                {campaignObj && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: campaignObj.color }}
                  />
                )}
                <span className="text-foreground">{campaign}</span>
                <button
                  onClick={() => toggleCampaign(campaign)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
          {Array.from(selectedTypes).map((type) => (
            <div
              key={type}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border"
            >
              <span className="text-foreground">{type}</span>
              <button
                onClick={() => toggleType(type)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          {Array.from(selectedFunnelStages).map((stage) => (
            <div
              key={stage}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border"
            >
              <span className="text-foreground">{stage}</span>
              <button
                onClick={() => toggleFunnelStage(stage)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          {Array.from(selectedStatuses).map((status) => {
            const { label } = STATUS_CFG[status];
            return (
              <div
                key={status}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border"
              >
                <span className="text-foreground">{label}</span>
                <button
                  onClick={() => toggleStatusFilter(status)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}
          {dateRange.start && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border">
              <span className="text-foreground">From {new Date(dateRange.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <button
                onClick={() => setDateRange(prev => ({ ...prev, start: "" }))}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
          {dateRange.end && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-card border border-border">
              <span className="text-foreground">To {new Date(dateRange.end).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <button
                onClick={() => setDateRange(prev => ({ ...prev, end: "" }))}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ── Main view ── */}
      {showReports ? (
        <ReportsView projectId={projectId} projectName={projectName} />
      ) : viewMode === "calendar" ? (
        <CalendarView
          items={filteredItems}
          year={year}
          month={month}
          onItemClick={setSelectedItem}
          onDelete={handleDelete}
          onReschedule={handleReschedule}
          templatesMap={templatesMap}
          recentlyUsedTemplateIds={recentlyUsedTemplateIds}
          onCreateContent={(file) => { setDroppedFile(file ?? null); setCreateOpen(true); }}
          onCreateCampaign={() => setLaunchModalOpen(true)}
          selectMode={selectMode}
          selectedCalItems={selectedCalItems}
          onToggleCalItem={toggleCalItem}
        />
      ) : (
        <ListView
          items={filteredItems}
          onItemClick={setSelectedItem}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}

      {/* ── Edit content modal ── */}
      {selectedItem && (
        <ContentEditModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          contentItem={{
            id: selectedItem.id,
            contentType: selectedItem.type,
            intentStage: selectedItem.funnelStage,
            topic: selectedItem.topic,
            date: selectedItem.date,
            status: (selectedItem.status === 'ready-for-review' || selectedItem.status === 'published' ? 'draft' : selectedItem.status) as any,
            title: selectedItem.title,
            platform: selectedItem.platform,
          }}
          onUpdate={(updates) => {
            setItems(prev => prev.map(it => it.id === selectedItem.id ? { ...it, date: updates.date ?? it.date, topic: updates.topic ?? it.topic, title: updates.title ?? it.title } : it));
            setSelectedItem(null);
          }}
          availableContentTypes={['Long Form', 'Short Clip', 'Highlight Reel', 'Text to AI Video', 'Quote Card']}
          availableIntentStages={['Awareness', 'Consideration', 'Decision', 'Retention']}
          availableTopics={[...new Set(items.map(i => i.topic))]}
        />
      )}

      {/* ── Create content modal ── */}
      <SmartContentCreationModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setSelectedContentTypeForCreation(undefined);
          setDroppedFile(null);
        }}
        onComplete={() => {
          setCreateOpen(false);
          setSelectedContentTypeForCreation(undefined);
          setDroppedFile(null);
        }}
        contentType={selectedContentTypeForCreation}
        defaultFile={droppedFile ?? undefined}
      />

      {/* ── Campaign launch modal ── */}
      <CampaignLaunchModal
        open={launchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        onCreateNew={() => { setLaunchModalOpen(false); setCampaignDuplicate(null); setCampaignModalOpen(true); }}
        onDuplicate={(c) => { setLaunchModalOpen(false); setCampaignDuplicate(c); setCampaignModalOpen(true); }}
      />

      {/* ── Campaign creation full view ── */}
      <CampaignCreationFullView
        isOpen={campaignModalOpen}
        onClose={() => { setCampaignModalOpen(false); setCampaignDuplicate(null); }}
        onComplete={(config) => {
          console.log('Campaign created:', config);
          setCampaignModalOpen(false);
          setCampaignDuplicate(null);
        }}
        initialDuplicate={campaignDuplicate}
      />

      {/* ── Review wizard ── */}
      <ReviewWizard
        isOpen={reviewMode}
        onClose={() => setReviewMode(false)}
        projectId={projectId}
      />

      {/* ── Upload dialog ── */}
      <Dialog.Root open={uploadDialogOpen} onOpenChange={(open) => { setUploadDialogOpen(open); if (!open) setPendingFiles([]); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 focus:outline-none">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-base font-bold text-foreground">Add Resource</Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Drop zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                "rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/30"
              )}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground mb-1">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">Video, images, PDFs, documents — any file type</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Pending files list */}
            {pendingFiles.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {pendingFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/50">
                    {f.type.startsWith("video/") ? (
                      <Video className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    ) : f.type.startsWith("image/") ? (
                      <ImageIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="flex-1 text-xs text-foreground font-medium truncate">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">{fmtSize(f.size)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPendingFiles(prev => prev.filter((_, j) => j !== i)); }}
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <Dialog.Close className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={confirmUpload}
                disabled={pendingFiles.length === 0}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {pendingFiles.length > 0
                  ? `Upload ${pendingFiles.length} ${pendingFiles.length === 1 ? "file" : "files"}`
                  : "Upload"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>


      {/* ── Add Template dialog ── */}
      <Dialog.Root open={templateDialogOpen} onOpenChange={(open) => { setTemplateDialogOpen(open); if (!open) { setTplName(""); setTplLink(""); setTplImageFile(null); setTplImagePreview(""); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 focus:outline-none">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-base font-bold text-foreground">Add Template</Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Image drop zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setTplIsDragOver(true); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setTplIsDragOver(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleTplImageDrop}
              onClick={() => !tplImagePreview && tplFileInputRef.current?.click()}
              className={clsx(
                "relative rounded-xl border-2 border-dashed transition-all overflow-hidden",
                tplImagePreview ? "border-primary/30 cursor-default" : "cursor-pointer",
                tplIsDragOver ? "border-primary bg-primary/5" : !tplImagePreview && "border-border hover:border-primary/50 hover:bg-secondary/30"
              )}
              style={{ aspectRatio: "1/1" }}
            >
              {tplImagePreview ? (
                <>
                  <img src={tplImagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setTplImagePreview(""); setTplImageFile(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <p className="text-xs font-semibold text-foreground">Drop screenshot here</p>
                  <p className="text-[11px] text-muted-foreground">or click to browse</p>
                </div>
              )}
              <input ref={tplFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleTplImageInput} />
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Template name</label>
                <input
                  type="text"
                  placeholder="e.g. Orange Hero"
                  value={tplName}
                  onChange={e => setTplName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Link (optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://canva.com/..."
                    value={tplLink}
                    onChange={e => setTplLink(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <Dialog.Close className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                Cancel
              </Dialog.Close>
              <button
                onClick={confirmAddTemplate}
                disabled={!tplImagePreview}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Template
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Bulk selection bar ── */}
      {selectedCalItems.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-[#1C1C1C] border border-white/10 rounded-2xl shadow-2xl px-4 py-3 min-w-max">
            <div className="flex items-center gap-2 pr-3 border-r border-white/10">
              <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">{selectedCalItems.size} selected</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const selected = items.filter(i => selectedCalItems.has(i.id));
                  if (selected.length > 0) {
                    setBulkRegenerateItems(selected);
                    clearCalSelection();
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.08] text-sm text-foreground transition-colors group"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary group-hover:rotate-180 transition-transform duration-300" />
                <span>Regenerate</span>
              </button>
              <button
                onClick={() => { alert(`Publishing ${selectedCalItems.size} item(s)`); clearCalSelection(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.08] text-sm text-foreground transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Publish</span>
              </button>
              <button
                onClick={() => { alert(`Duplicating ${selectedCalItems.size} item(s)`); clearCalSelection(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.08] text-sm text-foreground transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => {
                  setItems(prev => prev.filter(i => !selectedCalItems.has(i.id)));
                  clearCalSelection();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-sm text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
            <button
              onClick={clearCalSelection}
              className="ml-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Bulk Regenerate Modal ── */}
      {bulkRegenerateItems.length > 0 && (
        <BulkRegenerateModal
          items={bulkRegenerateItems}
          onClose={() => setBulkRegenerateItems([])}
          savedSettings={savedRegenSettings}
          onSaveSettings={setSavedRegenSettings}
        />
      )}

      {/* ── Edit Campaign Modal ── */}
      {campaignToEdit && (
        <EditCampaignModal
          campaign={campaignToEdit}
          itemCount={items.filter(i => i.campaign === campaignToEdit.name).length}
          onClose={() => setCampaignToEdit(null)}
          onSave={(updated) => handleSaveCampaign(updated, false)}
          onSaveAndRegenerate={(updated) => handleSaveCampaign(updated, true)}
        />
      )}

      {/* ── Delete Campaign Confirmation Modal ── */}
      {campaignToDelete && (() => {
        const count = items.filter(i => i.campaign === campaignToDelete.name).length;
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCampaignToDelete(null)} />
            <div
              className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full bg-destructive" />
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground leading-tight">Delete Campaign?</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                  style={{ backgroundColor: `${campaignToDelete.color}14`, border: `1px solid ${campaignToDelete.color}30` }}
                >
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: campaignToDelete.color }} />
                  <span className="text-sm font-semibold text-foreground">{campaignToDelete.name}</span>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                  You are about to delete the{" "}
                  <span className="font-semibold text-foreground">"{campaignToDelete.name}"</span>{" "}
                  campaign. This will delete{" "}
                  <span className="font-semibold text-destructive">{count} content {count === 1 ? "item" : "items"}</span>.
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCampaignToDelete(null)}
                    className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaignToDelete)}
                    className="flex-1 px-4 py-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg text-sm font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { X, ChevronDown, Search, Upload, Sparkles, Palette, User, FileText, ImageIcon, Loader2 } from "lucide-react";
import svgPathsShortClip from "@/imports/PostContentContainer-3/svg-ehzova85ar";
import svgPathsLongForm from "@/imports/PostContentContainer-6/svg-zh0484zckq";
import { BrandLogo } from "../ui/brand-logo";
import { BrandKitPicker } from "./brand-kit-picker";
import { WriterProfilePicker } from "./writer-profile-picker";
import { ResourcePicker } from "./resource-picker";
import { generateContentDraft, generateContentImage } from "../../../lib/services/ai-content-service";
import { buildContentPrompt, buildImagePrompt } from "../../../lib/ai/prompts/platform-prompts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: {
    id: number;
    contentType: string;
    intentStage: string;
    topic: string;
    date: string;
    status: "draft" | "approved" | "rejected" | "generating";
    title?: string;
    platform?: string;
  };
  onUpdate: (updates: any) => void;
  availableContentTypes: string[];
  availableIntentStages: string[];
  availableTopics: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ContentCategory =
  | "long-form"
  | "short-video"
  | "highlight"
  | "quote-card"
  | "ai-video"
  | "other";

function categorize(ct: string): ContentCategory {
  const s = ct.toLowerCase().replace(/[\s_-]+/g, "-");
  if (s.includes("long") || s.includes("blog") || s.includes("article")) return "long-form";
  if (s.includes("short") || s.includes("clip")) return "short-video";
  if (s.includes("highlight") || s.includes("reel")) return "highlight";
  if (s.includes("quote")) return "quote-card";
  if (s.includes("ai") || s.includes("text-to")) return "ai-video";
  return "other";
}

const CATEGORY_META: Record<ContentCategory, { sublabel: string; color: string }> = {
  "long-form":   { sublabel: "Long Form",       color: "#60A5FA" },
  "short-video": { sublabel: "Short Clip",     color: "#4B56F2" },
  "highlight":   { sublabel: "Highlight Reel",  color: "#F59E0B" },
  "quote-card":  { sublabel: "Quote Card",  color: "#A78BFA" },
  "ai-video":    { sublabel: "Text to AI Video",      color: "#4B56F2" },
  "other":       { sublabel: "Social Post",             color: "#60A5FA" },
};

// ─── Shared icons (from Figma svg paths) ─────────────────────────────────────

function AISparkleIcon({ paths }: { paths: typeof svgPathsShortClip }) {
  return (
    <svg fill="none" viewBox="0 0 23.9915 23.9915" className="size-[20px]">
      <path d={paths.pca4ac40} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d={paths.p10059e00} stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M4.99823 5.99788V9.99646" stroke="#8B5CF6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M18.9933 13.995V17.9936" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M9.99646 1.99929V3.99929" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M6.99752 7.99717H2.99894" stroke="#8B5CF6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M20.9926 15.9943H16.994" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M10.9968 2.99894H8.99681" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
    </svg>
  );
}

function ContentTypeIcon() {
  return (
    <svg fill="none" viewBox="0 0 19.998 19.998" className="size-[16px]">
      <g clipPath="url(#cem-clip)">
        <path d={svgPathsShortClip.pc7d1a80} stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
        <path d="M16.665 2.49975V5.83275" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
        <path d="M18.3315 4.16625H14.9985" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
        <path d="M3.333 14.1652V15.8317" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
        <path d="M4.16625 14.9985H2.49975" stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
      </g>
      <defs>
        <clipPath id="cem-clip"><rect fill="white" height="19.998" width="19.998" /></clipPath>
      </defs>
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg fill="none" viewBox="0 0 23.99 23.99" className="size-[24px]">
      <path d={svgPathsShortClip.p13773080} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
      <path d={svgPathsShortClip.p25535d00} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
      <path d="M11.995 2.99875V14.9937" stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
    </svg>
  );
}

function AIGenerateIcon() {
  return (
    <svg fill="none" viewBox="0 0 23.9915 23.9915" className="size-[24px]">
      <path d={svgPathsShortClip.pca4ac40} stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d={svgPathsShortClip.p10059e00} stroke="#4B56F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M4.99823 5.99788V9.99646" stroke="#8B5CF6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M18.9933 13.995V17.9936" stroke="#60A5FA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M9.99646 1.99929V3.99929" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M6.99752 7.99717H2.99894" stroke="#8B5CF6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M20.9926 15.9943H16.994" stroke="#60A5FA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
      <path d="M10.9968 2.99894H8.99681" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99929" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg fill="none" viewBox="0 0 19.998 19.998" className="size-[20px]">
      <path d={svgPathsShortClip.p2cf23000} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
      <path d={svgPathsShortClip.p2f683180} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6665" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg fill="none" viewBox="0 0 14 14" className="size-[14px]">
      <g clipPath="url(#cal-clip)">
        <path clipRule="evenodd" d={svgPathsShortClip.p165df400} fill="#A1A1AA" fillRule="evenodd" />
      </g>
      <defs><clipPath id="cal-clip"><rect fill="white" height="14" width="14" /></clipPath></defs>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg fill="none" viewBox="0 0 14 14" className="size-[14px]">
      <g clipPath="url(#clk-clip)">
        <path d={svgPathsShortClip.p1ac1700} fill="#A1A1AA" />
      </g>
      <defs><clipPath id="clk-clip"><rect fill="white" height="14" width="14" /></clipPath></defs>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg fill="none" viewBox="0 0 16 16" className="size-[16px]">
      <path d={svgPathsShortClip.p107a080} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      <path d="M14 14L11.1333 11.1333" stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
    </svg>
  );
}

// ─── Field primitives ─────────────────────────────────────────────────────────

function FieldLabel({ children, projectDefault }: { children: React.ReactNode; projectDefault?: boolean }) {
  return (
    <div className="flex items-center gap-2 h-[24px] relative shrink-0 w-full mb-0">
      <span className="font-bold text-[#fafafa] text-[16px] leading-[21px]">{children}</span>
      {projectDefault && (
        <span className="bg-[rgba(75,86,242,0.1)] border border-[rgba(75,86,242,0.2)] text-[#818CFF] text-[10px] font-bold uppercase tracking-[0.5px] px-[9px] py-[5px] rounded-xl flex items-center gap-[6px]">
          <span className="size-[6px] rounded-full bg-[#818CFF] inline-block" />
          Project Default
        </span>
      )}
    </div>
  );
}

function ConfigFieldLabel({ children, projectDefault }: { children: React.ReactNode; projectDefault?: boolean }) {
  return (
    <div className="flex items-center gap-2 h-[28px] pb-2 w-full">
      <span className="font-bold text-[#fafafa] text-[14px] leading-5">{children}</span>
      {projectDefault && (
        <span className="bg-[rgba(75,86,242,0.1)] border border-[rgba(75,86,242,0.2)] text-[#818CFF] text-[10px] font-bold uppercase tracking-[0.5px] px-[9px] py-[5px] rounded-xl flex items-center gap-[6px]">
          <span className="size-[6px] rounded-full bg-[#818CFF] inline-block" />
          Project Default
        </span>
      )}
    </div>
  );
}

// Basic input (lighter bg to stand out from modal background)
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="bg-[#141414] h-[36px] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.15)]">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent px-[13px] py-[5px] text-[14px] text-[#fafafa] placeholder-[#71717a] outline-none rounded-[12px]"
      />
    </div>
  );
}

// Basic textarea (lighter bg to stand out from modal background)
function Textarea({ value, onChange, placeholder, minRows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; minRows?: number }) {
  return (
    <div className="bg-[#141414] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.15)]" style={{ minHeight: minRows * 28 }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full bg-transparent px-[13px] py-[9px] text-[14px] text-[#fafafa] placeholder-[#71717a] outline-none rounded-[12px] leading-[20px] resize-none"
      />
    </div>
  );
}

// Config input (lighter bg with visible border to stand out)
function ConfigInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="bg-[#141414] h-[46px] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.15)]">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent px-[17px] py-[13px] text-[14px] text-[#fafafa] placeholder-[#71717a] outline-none rounded-[12px]"
      />
    </div>
  );
}

// Config textarea (lighter bg with visible border to stand out)
function ConfigTextarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="bg-[#141414] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.15)]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-transparent px-[17px] py-[13px] text-[14px] text-[#fafafa] placeholder-[#71717a] outline-none rounded-[12px] leading-[20px] resize-none"
      />
    </div>
  );
}

// ─── Read-only field primitives (for Approved mode) ───────────────────────────

function ReadOnlyText({ value }: { value: string }) {
  return (
    <div className="py-[8px]">
      <p className="text-[#fafafa] text-[14px] leading-[20px]">{value || <span className="text-[#a1a1aa] italic">Not provided</span>}</p>
    </div>
  );
}

function ReadOnlyTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-[8px] py-[8px]">
      {tags.length > 0 ? (
        tags.map((t) => (
          <span
            key={t}
            className="bg-[rgba(75,86,242,0.2)] border border-[rgba(75,86,242,0.3)] text-[#4B56F2] text-[12px] font-medium px-[10px] py-[5px] rounded-[8px] whitespace-nowrap"
          >
            #{t}
          </span>
        ))
      ) : (
        <span className="text-[#a1a1aa] italic text-[13px]">No tags</span>
      )}
    </div>
  );
}

function ReadOnlySelect({ value, options }: { value: string; options: Record<string, string> }) {
  const label = options[value] || value;
  return (
    <div className="py-[8px]">
      <p className="text-[#fafafa] text-[14px] leading-[20px]">
        {label || <span className="text-[#a1a1aa] italic">Not selected</span>}
      </p>
    </div>
  );
}

// Date + Time row (matching Figma PublishDateTime)
function PublishDateTimeRow({ date, time, onDate, onTime, isApproved }: { date: string; time: string; onDate: (v: string) => void; onTime: (v: string) => void; isApproved?: boolean }) {
  return (
    <div className="flex gap-[16px] h-[76px] items-center shrink-0 w-full">
      <div className="flex flex-col flex-1 min-w-0 pt-[16px]">
        <FieldLabel>Publish Date</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={date} />
        ) : (
          <div className="bg-[#1a1a1a] h-[36px] relative rounded-[12px] w-full flex items-center px-[13px] gap-2 border border-[rgba(255,255,255,0.12)]">
            <input
              type="date"
              value={date}
              onChange={(e) => onDate(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-[#fafafa] outline-none min-w-0"
            />
            <CalendarIcon />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 pt-[16px]">
        <FieldLabel>Publish Time</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={time} />
        ) : (
          <div className="bg-[#1a1a1a] h-[36px] relative rounded-[12px] w-full flex items-center px-[13px] gap-2 border border-[rgba(255,255,255,0.12)]">
            <input
              type="time"
              value={time}
              onChange={(e) => onTime(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-[#fafafa] outline-none min-w-0"
            />
            <ClockIcon />
          </div>
        )}
      </div>
    </div>
  );
}

// Tags section
function TagsSection({ tags, onChange, isApproved }: { tags: string[]; onChange: (t: string[]) => void; isApproved?: boolean }) {
  const [input, setInput] = useState("");
  const add = (raw: string) => {
    const clean = raw.trim().replace(/^#/, "");
    if (clean && !tags.includes(clean)) onChange([...tags, clean]);
    setInput("");
  };
  return (
    <div className="flex flex-col items-start shrink-0 w-full pt-[16px]">
      <FieldLabel>Tags</FieldLabel>
      {isApproved ? (
        <ReadOnlyTags tags={tags} />
      ) : (
        <>
          <div className="bg-[#1a1a1a] h-[36px] relative rounded-[12px] shrink-0 w-full flex items-center px-[13px] gap-2 mt-0 border border-[rgba(255,255,255,0.12)]">
            <SearchIcon />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input); } }}
              placeholder="Search of Tags"
              className="flex-1 bg-transparent text-[14px] text-[#a1a1aa] placeholder-[#a1a1aa] outline-none"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex gap-[8px] flex-wrap pt-[8px]">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => onChange(tags.filter((x) => x !== t))}
                  className="bg-[rgba(75,86,242,0.2)] border border-[rgba(75,86,242,0.3)] text-[#4B56F2] text-[12px] font-medium px-[10px] py-[5px] rounded-[8px] whitespace-nowrap hover:bg-[rgba(75,86,242,0.3)] transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Source material / Resources section (matching Figma Resources component)
function ResourcesSection({ linkValue, onLinkChange, selectedCount = 0, onOpenPicker }: { linkValue: string; onLinkChange: (v: string) => void; selectedCount?: number; onOpenPicker?: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-start shrink-0 w-full pt-[16px]">
      {/* Section heading */}
      <p className="font-bold text-[#fafafa] text-[16px] leading-[24px]">Source material and resources</p>
      <p className="text-[#a1a1aa] text-[14px] leading-[20px] pt-[4px]">Provide references and assets to guide content generation. This step is optional.</p>

      {/* Select from library button */}
      <div className="pt-[16px] w-full">
        <button
          onClick={() => onOpenPicker?.()}
          className="w-full bg-[#1a1a1a] h-[46px] rounded-[12px] border border-[rgba(255,255,255,0.12)] flex items-center px-[17px] gap-3 hover:border-primary/30 transition-colors"
        >
          <FileText className="size-[16px] text-muted-foreground" />
          <span className="flex-1 text-left text-[14px] text-[#fafafa]">
            {selectedCount > 0 ? `${selectedCount} resource${selectedCount > 1 ? 's' : ''} selected` : 'Select from resource library'}
          </span>
          <ChevronDown className="size-[14px] text-[#a1a1aa]" />
        </button>
      </div>

      {/* A — Main Content Source */}
      <div className="pt-[24px] w-full">
        <div className="flex gap-[8px] items-center mb-[12px]">
          <div className="bg-[rgba(75,86,242,0.1)] border border-[rgba(75,86,242,0.2)] rounded-[12px] size-[24px] flex items-center justify-center shrink-0">
            <span className="font-black text-[#4B56F2] text-[12px] leading-4">A</span>
          </div>
          <span className="font-bold text-[#fafafa] text-[14px]">Main Content Source</span>
          <span className="text-[#a1a1aa] text-[12px]">(Optional)</span>
        </div>

        {/* Upload drop zone */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-[24px] flex flex-col items-center justify-center py-[32px] px-[24px] gap-[12px] hover:border-[rgba(75,86,242,0.3)] transition-colors group"
        >
          <input ref={fileRef} type="file" className="hidden" multiple />
          <div className="bg-[#1a1a1a] size-[48px] rounded-full flex items-center justify-center group-hover:bg-[rgba(75,86,242,0.1)] transition-colors border border-[rgba(255,255,255,0.12)]">
            <UploadIcon />
          </div>
          <p className="font-semibold text-[#fafafa] text-[14px]">Drag &amp; drop or click to browse</p>
          <p className="text-[rgba(161,161,170,0.6)] text-[12px]">Upload video, documents, images or audio</p>
        </button>

        {/* OR divider */}
        <div className="flex gap-[12px] items-center w-full pt-[12px]">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          <span className="text-[rgba(161,161,170,0.5)] text-[12px] font-semibold uppercase tracking-[0.6px]">or</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
        </div>

        {/* Paste a link */}
        <div className="pt-[20px] w-full">
          <div className="h-[24px] relative mb-0">
            <span className="font-bold text-[#fafafa] text-[16px] leading-[21px]">Paste a link</span>
          </div>
          <div className="bg-[#1a1a1a] h-[36px] relative rounded-[12px] w-full flex items-center px-[13px] gap-2 mt-0 border border-[rgba(255,255,255,0.12)]">
            <SearchIcon />
            <input
              value={linkValue}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="Search content..."
              className="flex-1 bg-transparent text-[14px] text-[#a1a1aa] placeholder-[#a1a1aa] outline-none"
            />
          </div>
        </div>

        <button className="pt-[12px] text-[#a1a1aa] text-[12px] font-medium w-full text-center">
          Skip — no main source to provide
        </button>
      </div>

      {/* B — Select from Library */}
      <div className="pt-[24px] w-full">
        <div className="flex gap-[8px] items-center mb-[12px]">
          <div className="bg-[rgba(75,86,242,0.1)] border border-[rgba(75,86,242,0.2)] rounded-[12px] size-[24px] flex items-center justify-center shrink-0">
            <BrandLogo variant="monogram" size={18} />
          </div>
          <span className="font-bold text-[#fafafa] text-[14px]">Select from Library</span>
        </div>

        {/* Library button */}
        <button className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-[12px] flex items-center gap-[12px] px-[16px] py-[14px] hover:bg-[#222] transition-colors">
          <svg fill="none" viewBox="0 0 16 16" className="size-[16px] shrink-0">
            <path d={svgPathsShortClip.p1f315b00} stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
          <span className="text-[#fafafa] text-[14px] font-medium">Include from project library</span>
        </button>
      </div>
    </div>
  );
}

// Configuration section (shared structure, content-type-specific fields)
function ConfigurationSection({ category, fields, setField, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker }: {
  category: ContentCategory;
  fields: Record<string, any>;
  setField: (k: string, v: string) => void;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-start shrink-0 w-full pt-[16px]">
      <p className="font-bold text-[#fafafa] text-[16px] leading-[24px]">Configuration</p>
      <p className="text-[#a1a1aa] text-[14px] leading-[20px] pt-[4px]">
        Fields marked <span className="text-[#00d492] font-semibold">Project Default</span> are pre-filled from your project settings.
      </p>

      <div className="w-full space-y-[20px] pt-[20px]">
        {/* Item Topic — all types */}
        <div>
          <ConfigFieldLabel>Item Topic</ConfigFieldLabel>
          <ConfigInput
            value={fields.topic ?? ""}
            onChange={(v) => setField("topic", v)}
            placeholder="e.g., Summer collection launch and performance innovation"
          />
        </div>

        {/* Long form specific */}
        {category === "long-form" && (
          <>
            <div>
              <ConfigFieldLabel>Word Count Target</ConfigFieldLabel>
              <ConfigInput value={fields.wordCount ?? ""} onChange={(v) => setField("wordCount", v)} placeholder="e.g., 1500" type="number" />
            </div>
            <div>
              <ConfigFieldLabel>SEO Keywords</ConfigFieldLabel>
              <ConfigInput value={fields.seoKeywords ?? ""} onChange={(v) => setField("seoKeywords", v)} placeholder="e.g., running tips, summer training" />
            </div>
            <div>
              <ConfigFieldLabel projectDefault>Target Audience</ConfigFieldLabel>
              <ConfigTextarea value={fields.targetAudience ?? ""} onChange={(v) => setField("targetAudience", v)} placeholder="Describe your target audience..." />
            </div>
          </>
        )}

        {/* Short video specific */}
        {category === "short-video" && (
          <>
            <div>
              <ConfigFieldLabel>Source Video Reference</ConfigFieldLabel>
              <ConfigInput value={fields.sourceVideoRef ?? ""} onChange={(v) => setField("sourceVideoRef", v)} placeholder="e.g., Summer Campaign Video - Main Edit" />
            </div>
            <div>
              <ConfigFieldLabel>Clip Duration (seconds)</ConfigFieldLabel>
              <ConfigInput value={fields.clipDuration ?? "30"} onChange={(v) => setField("clipDuration", v)} placeholder="30" type="number" />
            </div>
          </>
        )}

        {/* Highlight reel specific */}
        {category === "highlight" && (
          <>
            <div>
              <ConfigFieldLabel>Total Duration (seconds)</ConfigFieldLabel>
              <ConfigInput value={fields.totalDuration ?? "90"} onChange={(v) => setField("totalDuration", v)} placeholder="90" type="number" />
            </div>
            <div>
              <ConfigFieldLabel>Number of Highlights</ConfigFieldLabel>
              <ConfigInput value={fields.numHighlights ?? "5"} onChange={(v) => setField("numHighlights", v)} placeholder="5" type="number" />
            </div>
          </>
        )}

        {/* AI video specific */}
        {category === "ai-video" && (
          <div>
            <ConfigFieldLabel>Video Duration (seconds)</ConfigFieldLabel>
            <ConfigInput value={fields.videoDuration ?? "60"} onChange={(v) => setField("videoDuration", v)} placeholder="60" type="number" />
          </div>
        )}

        {/* Brand Guidelines — all types */}
        <div>
          <ConfigFieldLabel projectDefault>Brand Guidelines</ConfigFieldLabel>
          <ConfigTextarea
            value={fields.brandGuidelines ?? ""}
            onChange={(v) => setField("brandGuidelines", v)}
            placeholder="Describe your brand voice, style guidelines, and any dos/don'ts..."
          />
        </div>

        {/* Additional Instructions — all types */}
        <div>
          <ConfigFieldLabel>Additional Instructions</ConfigFieldLabel>
          <ConfigTextarea
            value={fields.additionalInstructions ?? ""}
            onChange={(v) => setField("additionalInstructions", v)}
            placeholder="Any additional instructions on how you want the post to be"
          />
        </div>

        {/* Voice & Style — all types */}
        <div className="pt-[8px]">
          <p className="font-bold text-[#a1a1aa] text-[16px] leading-[24px] mb-[16px]">Voice & Style</p>

          {/* Brand Kit */}
          <div className="mb-[16px]">
            <ConfigFieldLabel>Brand Kit</ConfigFieldLabel>
            <button
              onClick={() => setShowBrandKitPicker(true)}
              className="w-full bg-[#1a1a1a] h-[46px] rounded-[12px] border border-[rgba(255,255,255,0.12)] flex items-center px-[17px] gap-3 hover:border-primary/30 transition-colors"
            >
              <Palette className="size-[16px] text-muted-foreground" />
              <span className={`flex-1 text-left text-[14px] ${fields.brandKit ? 'text-[#fafafa]' : 'text-[#a1a1aa]'}`}>
                {selectedBrandKitName || 'Select brand kit...'}
              </span>
              <ChevronDown className="size-[14px] text-[#a1a1aa]" />
            </button>
          </div>

          {/* Writer Profile */}
          <div className="mb-[20px]">
            <ConfigFieldLabel projectDefault>Writer Profile</ConfigFieldLabel>
            <button
              onClick={() => setShowWriterProfilePicker(true)}
              className="w-full bg-[#1a1a1a] h-[46px] rounded-[12px] border border-[rgba(255,255,255,0.12)] flex items-center px-[17px] gap-3 hover:border-primary/30 transition-colors"
            >
              <User className="size-[16px] text-muted-foreground" />
              <span className={`flex-1 text-left text-[14px] ${fields.writerProfileId ? 'text-[#fafafa]' : 'text-[#a1a1aa]'}`}>
                {selectedWriterProfileName || 'No writer profile - Set tone manually'}
              </span>
              <ChevronDown className="size-[14px] text-[#a1a1aa]" />
            </button>
          </div>

          {/* Writing Tone + Level */}
          <div className="flex gap-[16px]">
            <div className="flex-1">
              <ConfigFieldLabel>Writing Tone</ConfigFieldLabel>
              <div className="bg-[#1a1a1a] h-[46px] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.12)] flex items-center px-[17px]">
                <select
                  value={fields.writingTone ?? ""}
                  onChange={(e) => setField("writingTone", e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[#fafafa] outline-none appearance-none pr-[24px] cursor-pointer"
                >
                  <option value="">Select tone...</option>
                  <option value="formal">Formal</option>
                  <option value="informal">Informal</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="educational">Educational</option>
                  <option value="persuasive">Persuasive</option>
                </select>
                <ChevronDown className="absolute right-[17px] size-[14px] text-[#a1a1aa] pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <ConfigFieldLabel>Writing Level</ConfigFieldLabel>
              <div className="bg-[#1a1a1a] h-[46px] relative rounded-[12px] shrink-0 w-full border border-[rgba(255,255,255,0.12)] flex items-center px-[17px]">
                <select
                  value={fields.writingLevel ?? ""}
                  onChange={(e) => setField("writingLevel", e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[#fafafa] outline-none appearance-none pr-[24px] cursor-pointer"
                >
                  <option value="">Select level...</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <ChevronDown className="absolute right-[17px] size-[14px] text-[#a1a1aa] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Word Count Range — all types */}
        <div className="pt-[8px]">
          <div className="flex items-center justify-between mb-[16px]">
            <p className="font-bold text-[#a1a1aa] text-[16px] leading-[24px]">Word Count Range</p>
            <AISparkleIcon paths={svgPathsShortClip} />
          </div>

          {/* Slider */}
          <div className="space-y-[8px]">
            <div className="relative h-[8px] bg-[#1a1a1a] rounded-full border border-[rgba(255,255,255,0.12)]">
              <div
                className="absolute h-full bg-[#4B56F2] rounded-full"
                style={{
                  left: `${((fields.wordCountMin ?? 1200) - 800) / (2500 - 800) * 100}%`,
                  right: `${100 - ((fields.wordCountMax ?? 1700) - 800) / (2500 - 800) * 100}%`,
                }}
              />
              <input
                type="range"
                min="800"
                max="2500"
                value={fields.wordCountMin ?? 1200}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val < (fields.wordCountMax ?? 1700)) setField("wordCountMin", val);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              <input
                type="range"
                min="800"
                max="2500"
                value={fields.wordCountMax ?? 1700}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > (fields.wordCountMin ?? 1200)) setField("wordCountMax", val);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[12px] text-[#a1a1aa]">
              <span>800</span>
              <span>1200</span>
              <span>1700</span>
              <span>2500</span>
            </div>
          </div>

          {/* Selected range display */}
          <div className="flex items-center justify-center pt-[16px]">
            <div className="inline-flex items-center gap-[8px] px-[12px] py-[8px] bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-[12px]">
              <span className="text-[14px] text-[#fafafa] font-medium">
                {(fields.wordCountMin ?? 1200).toLocaleString()} – {(fields.wordCountMax ?? 1700).toLocaleString()}
              </span>
              <span className="text-[12px] text-[#a1a1aa]">words</span>
            </div>
          </div>
        </div>

        {/* AI Image Generation */}
        <div className="pt-[16px]">
          <button
            onClick={() => {
              const prompt = buildImagePrompt({
                platform: contentItem.platform || '',
                topic: contentItem.topic,
                style: fields.writingTone,
              });
              setImagePrompt(prompt);
              setShowImagePrompt(true);
            }}
            disabled={isGeneratingImage}
            className="w-full bg-[#1a1a1a] h-[46px] rounded-[12px] border border-[rgba(255,255,255,0.12)] flex items-center justify-center gap-[8px] hover:bg-[#262626] transition-colors disabled:opacity-50"
          >
            {isGeneratingImage ? (
              <Loader2 className="size-[16px] text-[#4B56F2] animate-spin" />
            ) : (
              <ImageIcon className="size-[16px] text-[#4B56F2]" />
            )}
            <span className="text-[14px] font-medium text-[#fafafa]">
              {isGeneratingImage ? 'Generating Image...' : 'Generate Image with AI'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Platform icons ───────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: string }) {
  const icons: Record<string, { color: string; icon: string }> = {
    instagram: { color: "#E1306C", icon: "IG" },
    facebook: { color: "#1877F2", icon: "FB" },
    tiktok: { color: "#00f2ea", icon: "TT" },
    youtube: { color: "#FF0000", icon: "YT" },
    linkedin: { color: "#0A66C2", icon: "LI" },
    x: { color: "#fafafa", icon: "X" },
  };
  const p = icons[platform.toLowerCase()] || { color: "#a1a1aa", icon: platform.slice(0, 2).toUpperCase() };
  return (
    <div
      className="size-[36px] rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}
    >
      <span className="text-[12px] font-bold">{p.icon}</span>
    </div>
  );
}

function PlatformLabel({ platform }: { platform: string }) {
  const icons: Record<string, { color: string; label: string; icon: string }> = {
    instagram: { color: "#E1306C", label: "Instagram", icon: "IG" },
    facebook: { color: "#1877F2", label: "Facebook", icon: "FB" },
    tiktok: { color: "#00f2ea", label: "TikTok", icon: "TT" },
    youtube: { color: "#FF0000", label: "YouTube", icon: "YT" },
    linkedin: { color: "#0A66C2", label: "LinkedIn", icon: "LI" },
    x: { color: "#fafafa", label: "X", icon: "X" },
  };
  const p = icons[platform.toLowerCase()] || { color: "#a1a1aa", label: platform, icon: platform.slice(0, 2).toUpperCase() };
  return (
    <div className="flex items-center gap-[6px]">
      <div
        className="size-[24px] rounded-[6px] flex items-center justify-center text-[10px] font-bold"
        style={{ backgroundColor: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}
      >
        {p.icon}
      </div>
      <span className="text-[#a1a1aa] text-[12px] font-medium">{p.label}</span>
    </div>
  );
}

// ─── Preview panel ─────────────────────────────────────────────────────────────

function PreviewPanel({ category, fields, platform }: {
  category: ContentCategory;
  fields: Record<string, any>;
  platform?: string;
}) {
  const title = fields.title || "";
  const tags: string[] = fields.tags ?? [];

  // Determine the body text to show based on content type
  const bodyText =
    category === "long-form" || category === "other"
      ? fields.content || ""
      : category === "short-video" || category === "highlight"
      ? fields.caption || ""
      : category === "ai-video"
      ? fields.script || ""
      : category === "quote-card"
      ? fields.quoteText || ""
      : "";

  // Split body into paragraphs for rendering
  const paragraphs = bodyText
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  // Detect hashtag lines (lines starting with #)
  const contentParas = paragraphs.filter((p: string) => !p.startsWith("#"));
  const hashtagLine = paragraphs.find((p: string) => p.startsWith("#")) || "";

  return (
    <div className="bg-[rgba(10,10,10,0.2)] border-r border-[rgba(255,255,255,0.08)] self-stretch shrink-0 w-[320px] flex flex-col gap-[10px] pl-[24px] pr-[25px] py-[16px]">
      <div className="flex items-center justify-between">
        <p className="font-bold text-[14px] text-white leading-5">Preview</p>
        {platform && <PlatformLabel platform={platform} />}
      </div>

      {/* ── Long Form Preview ── */}
      {category === "long-form" && (
        <div className="bg-[#0a0a0a] w-[271px] rounded-[8px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)]">
          {/* Featured image placeholder */}
          <div className="w-full h-[140px] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden flex items-center justify-center">
            <svg className="size-[48px] text-[#262626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          {/* Article header */}
          <div className="p-[16px] pb-[12px] border-b border-[rgba(255,255,255,0.06)]">
            {title ? (
              <p className="text-[#fafafa] text-[13px] font-bold leading-[18px] line-clamp-2">{title}</p>
            ) : (
              <div className="h-[12px] bg-[#222] rounded-full w-3/4" />
            )}
            <div className="flex items-center gap-[6px] mt-[8px]">
              <div className="size-[16px] rounded-full bg-[#222]" />
              <div className="h-[8px] bg-[#222] rounded-full w-[60px]" />
            </div>
          </div>
          {/* Article body */}
          <div className="p-[16px] pt-[12px]">
            {contentParas.length > 0 ? (
              <div className="flex flex-col gap-[8px]">
                {contentParas.slice(0, 6).map((para: string, i: number) => (
                  <p key={i} className="text-[#a1a1aa] text-[10px] leading-[15px] line-clamp-3">{para}</p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[6px]">
                {[100, 92, 88, 75, 95, 65, 82, 70].map((w, i) => (
                  <div key={i} className="h-[8px] bg-[#1a1a1a] rounded-full" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
          </div>
          {/* Hashtags */}
          {(hashtagLine || tags.length > 0) && (
            <div className="px-[16px] pb-[12px]">
              {hashtagLine ? (
                <p className="text-[#4B56F2] text-[10px] leading-[14px] line-clamp-2">{hashtagLine}</p>
              ) : (
                <p className="text-[#4B56F2] text-[10px] leading-[14px]">
                  {tags.map((t) => `#${t}`).join(" ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Short Video Preview (Vertical 9:16) ── */}
      {category === "short-video" && (
        <div className="bg-[#0a0a0a] w-[180px] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)] mx-auto">
          {/* Video area - vertical aspect ratio */}
          <div className="w-full aspect-[9/16] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center gap-[8px] relative">
            {/* Play button */}
            <div className="size-[40px] rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center backdrop-blur-sm">
              <svg fill="none" viewBox="0 0 16 16" className="size-[18px] ml-[2px]">
                <path d="M4 2L14 8L4 14V2Z" fill="#fafafa" />
              </svg>
            </div>
            <p className="text-[#a1a1aa] text-[9px]">Short Video Preview</p>
            {/* Duration badge */}
            <div className="absolute bottom-[8px] right-[8px] bg-[rgba(0,0,0,0.7)] rounded-[4px] px-[6px] py-[2px]">
              <span className="text-white text-[9px] font-medium">{fields.clipDuration || "30"}s</span>
            </div>
          </div>
          {/* Caption area */}
          <div className="p-[10px]">
            {title && <p className="text-[#fafafa] text-[10px] font-bold leading-[14px] line-clamp-1 mb-[4px]">{title}</p>}
            {bodyText && <p className="text-[#a1a1aa] text-[9px] leading-[13px] line-clamp-2">{bodyText}</p>}
            {(hashtagLine || tags.length > 0) && (
              <p className="text-[#4B56F2] text-[9px] mt-[4px] line-clamp-1">
                {hashtagLine || tags.map((t) => `#${t}`).join(" ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Highlight Reel Preview (Horizontal 16:9) ── */}
      {category === "highlight" && (
        <div className="bg-[#0a0a0a] w-[271px] rounded-[8px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)]">
          {/* Video area - horizontal aspect ratio */}
          <div className="w-full aspect-[16/9] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center gap-[6px] relative">
            {/* Play button */}
            <div className="size-[36px] rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center backdrop-blur-sm">
              <svg fill="none" viewBox="0 0 16 16" className="size-[16px] ml-[2px]">
                <path d="M4 2L14 8L4 14V2Z" fill="#fafafa" />
              </svg>
            </div>
            <p className="text-[#a1a1aa] text-[9px]">Highlight Reel Preview</p>
            {/* Duration badge */}
            <div className="absolute bottom-[6px] right-[6px] bg-[rgba(0,0,0,0.7)] rounded-[4px] px-[6px] py-[2px]">
              <span className="text-white text-[9px] font-medium">{fields.totalDuration || "90"}s</span>
            </div>
            {/* Clip count badge */}
            <div className="absolute top-[6px] left-[6px] bg-[rgba(75,86,242,0.8)] rounded-[4px] px-[6px] py-[2px]">
              <span className="text-white text-[9px] font-medium">{fields.numHighlights || "5"} clips</span>
            </div>
          </div>
          {/* Info area */}
          <div className="p-[12px]">
            {title && <p className="text-[#fafafa] text-[11px] font-bold leading-[15px] line-clamp-1 mb-[4px]">{title}</p>}
            {bodyText && <p className="text-[#a1a1aa] text-[9px] leading-[13px] line-clamp-2">{bodyText}</p>}
          </div>
        </div>
      )}

      {/* ─ Quote Card Preview ── */}
      {category === "quote-card" && (
        <div className="bg-[#0a0a0a] w-[271px] rounded-[8px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)]">
          <div className="w-full aspect-square bg-gradient-to-br from-[#1a1a1a] via-[#141414] to-[#0f0f0f] flex flex-col items-center justify-center p-[24px] relative">
            {/* Decorative quote mark */}
            <div className="text-[#4B56F2] text-[48px] leading-none font-black absolute top-[16px] left-[20px] opacity-30">"</div>
            {/* Quote text */}
            {bodyText ? (
              <p className="text-[#fafafa] text-[13px] leading-[20px] italic text-center line-clamp-6 relative z-10">
                {bodyText}
              </p>
            ) : (
              <div className="flex flex-col gap-[6px] w-full relative z-10">
                {[90, 100, 80].map((w, i) => (
                  <div key={i} className="h-[8px] bg-[#222] rounded-full mx-auto" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
            {/* Author */}
            {fields.author && (
              <div className="mt-[16px] text-center relative z-10">
                <div className="w-[24px] h-px bg-[#4B56F2] mx-auto mb-[6px]" />
                <p className="text-[#a1a1aa] text-[10px] font-medium">— {fields.author}</p>
              </div>
            )}
            {/* Tags */}
            {tags.length > 0 && (
              <p className="text-[#4B56F2] text-[9px] mt-[8px] text-center relative z-10">
                {tags.map((t) => `#${t}`).join(" ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── AI Video Preview ── */}
      {category === "ai-video" && (
        <div className="bg-[#0a0a0a] w-[180px] rounded-[12px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)] mx-auto">
          {/* Video area - vertical aspect ratio */}
          <div className="w-full aspect-[9/16] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center gap-[8px] relative">
            {/* AI sparkle icon */}
            <div className="size-[40px] rounded-full bg-[rgba(75,86,242,0.15)] border border-[rgba(75,86,242,0.3)] flex items-center justify-center">
              <AIGenerateIcon />
            </div>
            <p className="text-[#4B56F2] text-[10px] font-medium">AI-Generated Video</p>
            <p className="text-[#a1a1aa] text-[8px] text-center px-[12px]">Will be generated from script and references</p>
            {/* Duration badge */}
            <div className="absolute bottom-[8px] right-[8px] bg-[rgba(0,0,0,0.7)] rounded-[4px] px-[6px] py-[2px]">
              <span className="text-white text-[9px] font-medium">{fields.videoDuration || "60"}s</span>
            </div>
            {/* AI badge */}
            <div className="absolute top-[8px] left-[8px] bg-[rgba(139,92,246,0.8)] rounded-[4px] px-[6px] py-[2px]">
              <span className="text-white text-[9px] font-medium">AI</span>
            </div>
          </div>
          {/* Script preview */}
          <div className="p-[10px]">
            {title && <p className="text-[#fafafa] text-[10px] font-bold leading-[14px] line-clamp-1 mb-[4px]">{title}</p>}
            {bodyText && <p className="text-[#a1a1aa] text-[9px] leading-[13px] line-clamp-3">{bodyText}</p>}
          </div>
        </div>
      )}

      {/* ── Social Post Preview (Other) ── */}
      {category === "other" && (
        <div className="bg-[#0a0a0a] w-[271px] rounded-[8px] overflow-hidden shrink-0 border border-[rgba(255,255,255,0.06)]">
          {/* Post header */}
          <div className="flex items-center gap-[8px] p-[12px] pb-[8px]">
            <div className="size-[24px] rounded-full bg-[#222]" />
            <div className="flex-1">
              <div className="h-[8px] bg-[#222] rounded-full w-[80px] mb-[4px]" />
              <div className="h-[6px] bg-[#1a1a1a] rounded-full w-[50px]" />
            </div>
          </div>
          {/* Post content */}
          <div className="px-[12px] pb-[8px]">
            {title && <p className="text-[#fafafa] text-[11px] font-bold leading-[15px] mb-[6px]">{title}</p>}
            {contentParas.length > 0 ? (
              <div className="flex flex-col gap-[6px]">
                {contentParas.slice(0, 4).map((para: string, i: number) => (
                  <p key={i} className="text-[#a1a1aa] text-[10px] leading-[14px] line-clamp-2">{para}</p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[5px]">
                {[100, 90, 85, 70].map((w, i) => (
                  <div key={i} className="h-[7px] bg-[#1a1a1a] rounded-full" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
          </div>
          {/* Hashtags */}
          {(hashtagLine || tags.length > 0) && (
            <div className="px-[12px] pb-[12px]">
              {hashtagLine ? (
                <p className="text-[#4B56F2] text-[10px] leading-[14px] line-clamp-2">{hashtagLine}</p>
              ) : (
                <p className="text-[#4B56F2] text-[10px] leading-[14px]">
                  {tags.map((t) => `#${t}`).join(" ")}
                </p>
              )}
            </div>
          )}
          {/* Engagement bar */}
          <div className="border-t border-[rgba(255,255,255,0.06)] px-[12px] py-[8px] flex items-center gap-[16px]">
            <div className="flex items-center gap-[4px]">
              <svg fill="none" viewBox="0 0 12 12" className="size-[12px]">
                <path d="M6 10.5L1.5 6C0.5 5 0.5 3.5 1.5 2.5C2.5 1.5 4 1.5 5 2.5L6 3.5L7 2.5C8 1.5 9.5 1.5 10.5 2.5C11.5 3.5 11.5 5 10.5 6L6 10.5Z" stroke="#a1a1aa" strokeWidth="1" />
              </svg>
              <span className="text-[#a1a1aa] text-[9px]">Like</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <svg fill="none" viewBox="0 0 12 12" className="size-[12px]">
                <path d="M1 10V7C1 6.5 1.5 6 2 6H3.5L5 3H10C10.5 3 11 3.5 11 4V7.5C11 8.5 10.5 9.5 9.5 10H3C2 10 1 9.5 1 8.5V10Z" stroke="#a1a1aa" strokeWidth="1" />
              </svg>
              <span className="text-[#a1a1aa] text-[9px]">Comment</span>
            </div>
            <div className="flex items-center gap-[4px]">
              <svg fill="none" viewBox="0 0 12 12" className="size-[12px]">
                <path d="M1 6L6 1L11 6M6 1V11" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[#a1a1aa] text-[9px]">Share</span>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#a1a1aa] leading-4">
        This is an approximation of what your post will look like.
      </p>
    </div>
  );
}

// ─── Content-type form fields ─────────────────────────────────────────────────

function LongFormFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker, setShowResourcePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
  setShowResourcePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter article title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Post Content</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.content ?? ""} />
        ) : (
          <Textarea
            value={fields.content ?? ""}
            onChange={(v) => setField("content", v)}
            placeholder="Write your article content here..."
            minRows={8}
          />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ResourcesSection linkValue={fields.sourceLink ?? ""} onLinkChange={(v) => setField("sourceLink", v)} isApproved={isApproved} selectedCount={fields.selectedResources?.length ?? 0} onOpenPicker={() => setShowResourcePicker(true)} />
      <ConfigurationSection category="long-form" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

function ShortVideoFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker, setShowResourcePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
  setShowResourcePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter clip title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Caption / Script</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.caption ?? ""} />
        ) : (
          <Textarea
            value={fields.caption ?? ""}
            onChange={(v) => setField("caption", v)}
            placeholder="Write your video caption or script here..."
            minRows={5}
          />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ResourcesSection linkValue={fields.sourceLink ?? ""} onLinkChange={(v) => setField("sourceLink", v)} isApproved={isApproved} selectedCount={fields.selectedResources?.length ?? 0} onOpenPicker={() => setShowResourcePicker(true)} />
      <ConfigurationSection category="short-video" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

function HighlightFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker, setShowResourcePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
  setShowResourcePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter highlight reel title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Description</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.description ?? ""} />
        ) : (
          <Textarea
            value={fields.description ?? ""}
            onChange={(v) => setField("description", v)}
            placeholder="Describe this highlight reel..."
            minRows={4}
          />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ResourcesSection linkValue={fields.sourceLink ?? ""} onLinkChange={(v) => setField("sourceLink", v)} isApproved={isApproved} selectedCount={fields.selectedResources?.length ?? 0} onOpenPicker={() => setShowResourcePicker(true)} />
      <ConfigurationSection category="highlight" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

function QuoteCardFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter quote card title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Quote Text</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.quoteText ?? ""} />
        ) : (
          <Textarea
            value={fields.quoteText ?? ""}
            onChange={(v) => setField("quoteText", v)}
            placeholder="Enter the quote to display on the card..."
            minRows={4}
          />
        )}
      </div>

      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Author Attribution</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.author ?? ""} />
        ) : (
          <Input value={fields.author ?? ""} onChange={(v) => setField("author", v)} placeholder="e.g., Gurudev Shri Amritji" />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ConfigurationSection category="quote-card" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

function AIVideoFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker, setShowResourcePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
  setShowResourcePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter AI video title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Script / Prompt</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.script ?? ""} />
        ) : (
          <Textarea
            value={fields.script ?? ""}
            onChange={(v) => setField("script", v)}
            placeholder="Write the script or prompt for AI video generation..."
            minRows={5}
          />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ResourcesSection linkValue={fields.sourceLink ?? ""} onLinkChange={(v) => setField("sourceLink", v)} isApproved={isApproved} selectedCount={fields.selectedResources?.length ?? 0} onOpenPicker={() => setShowResourcePicker(true)} />
      <ConfigurationSection category="ai-video" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

function OtherFields({ fields, setField, isApproved, selectedBrandKitName, setShowBrandKitPicker, selectedWriterProfileName, setShowWriterProfilePicker, setShowResourcePicker }: {
  fields: Record<string, any>;
  setField: (k: string, v: string | string[]) => void;
  isApproved?: boolean;
  selectedBrandKitName: string;
  setShowBrandKitPicker: (v: boolean) => void;
  selectedWriterProfileName: string;
  setShowWriterProfilePicker: (v: boolean) => void;
  setShowResourcePicker: (v: boolean) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start pt-[16px] shrink-0 w-full">
        <FieldLabel>Title*</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.title ?? ""} />
        ) : (
          <Input value={fields.title ?? ""} onChange={(v) => setField("title", v)} placeholder="Enter post title" />
        )}
      </div>

      <PublishDateTimeRow
        date={fields.date ?? ""} time={fields.time ?? "09:00"}
        onDate={(v) => setField("date", v)} onTime={(v) => setField("time", v)}
        isApproved={isApproved}
      />

      <div className="flex flex-col items-start pt-[20px] shrink-0 w-full">
        <FieldLabel>Post Content</FieldLabel>
        {isApproved ? (
          <ReadOnlyText value={fields.content ?? ""} />
        ) : (
          <Textarea
            value={fields.content ?? ""}
            onChange={(v) => setField("content", v)}
            placeholder="Write your post content here..."
            minRows={5}
          />
        )}
      </div>

      <TagsSection tags={fields.tags ?? []} onChange={(v) => setField("tags", v as any)} isApproved={isApproved} />
      <ResourcesSection linkValue={fields.sourceLink ?? ""} onLinkChange={(v) => setField("sourceLink", v)} isApproved={isApproved} selectedCount={fields.selectedResources?.length ?? 0} onOpenPicker={() => setShowResourcePicker(true)} />
      <ConfigurationSection category="other" fields={fields} setField={setField as any} isApproved={isApproved} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />
    </>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function ContentEditModal({
  isOpen,
  onClose,
  contentItem,
  onUpdate,
}: ContentEditModalProps) {
  const category = categorize(contentItem.contentType);
  const meta = CATEGORY_META[category];

  const [fields, setFieldsRaw] = useState<Record<string, any>>({
    title: contentItem.title || contentItem.topic || "",
    date: contentItem.date ?? "",
    time: "09:00",
    topic: contentItem.topic ?? "",
    tags: [],
    content: "",
    caption: "",
    quoteText: "",
    author: "",
    script: "",
    brandGuidelines: "",
    brandKit: "",
    targetAudience: "",
    additionalInstructions: "",
    sourceLink: "",
    wordCount: "",
    seoKeywords: "",
    clipDuration: "30",
    videoDuration: "60",
    sourceVideoRef: "",
    totalDuration: "90",
    numHighlights: "5",
    writerProfile: "",
    writerProfileId: "",
    writingTone: "",
    writingLevel: "",
    wordCountMin: 1200,
    wordCountMax: 1700,
    selectedResources: [] as string[],
  });

  const [version, setVersion] = useState(1);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Draft");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionReasonDisplay, setRejectionReasonDisplay] = useState("");
  const [showBrandKitPicker, setShowBrandKitPicker] = useState(false);
  const [showWriterProfilePicker, setShowWriterProfilePicker] = useState(false);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [promptPreview, setPromptPreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [selectedBrandKitName, setSelectedBrandKitName] = useState("");
  const [selectedWriterProfileName, setSelectedWriterProfileName] = useState("");
  const [comments, setComments] = useState<Array<{
    id: number;
    author: string;
    initials: string;
    color: string;
    time: string;
    text: string;
    isSystem?: boolean;
  }>>([
    { id: 1, author: "Sarah Chen", initials: "SC", color: "#8b5cf6", time: "2h ago", text: "Should we adjust the hashtags to include #SummerFitness?" },
    { id: 2, author: "Mike Torres", initials: "MT", color: "#f59e0b", time: "1h ago", text: "Good call, also the publish date might conflict with the campaign launch" },
    { id: 3, author: "Sarah Chen", initials: "SC", color: "#8b5cf6", time: "30m ago", text: "Updated the tags, can you review?" },
  ]);

  const setField = (k: string, v: any) => setFieldsRaw((prev) => ({ ...prev, [k]: v }));

  const isApproved = currentStatus === "Approved";

  // Reset picker state when content item changes (fixes crash when switching items)
  useEffect(() => {
    setSelectedBrandKitName("");
    setSelectedWriterProfileName("");
    setFieldsRaw((prev) => ({ ...prev, brandKit: "", writerProfile: "", writerProfileId: "", selectedResources: [] }));
  }, [contentItem.id]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Rejected") {
      setShowRejectionModal(true);
      setShowStatusDropdown(false);
      return;
    }
    
    const oldStatus = currentStatus;
    setCurrentStatus(newStatus);
    setShowStatusDropdown(false);
    
    // Add system comment for status change
    const systemComment = {
      id: Date.now(),
      author: "System",
      initials: "SY",
      color: "#6b7280",
      time: "just now",
      text: `Status changed from ${oldStatus} to ${newStatus}`,
      isSystem: true,
    };
    setComments(prev => [...prev, systemComment]);
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim()) return;
    
    setCurrentStatus("Rejected");
    setRejectionReasonDisplay(rejectionReason);
    setShowRejectionModal(false);
    setShowStatusDropdown(false);
    
    // Add rejection reason as comment
    const rejectionComment = {
      id: Date.now(),
      author: "System",
      initials: "SY",
      color: "#ef4444",
      time: "just now",
      text: `Post rejected: ${rejectionReason}`,
      isSystem: true,
    };
    setComments(prev => [...prev, rejectionComment]);
    setRejectionReason("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] flex flex-col overflow-hidden w-full rounded-[16px] border border-[rgba(255,255,255,0.08)]"
        style={{ maxWidth: 1200, maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative shrink-0 h-[84px]">
          <div className="absolute inset-0 border-b border-[rgba(255,255,255,0.08)] pointer-events-none" />
          <div className="flex items-center justify-between h-full px-[24px]">
            {/* Left: content identity */}
            <div className="flex items-center gap-[12px]">
              {contentItem.platform ? (
                <PlatformIcon platform={contentItem.platform} />
              ) : (
                <div className="bg-[rgba(75,86,242,0.1)] border border-[rgba(75,86,242,0.2)] rounded-full size-[36px] flex items-center justify-center shrink-0">
                  <ContentTypeIcon />
                </div>
              )}
              <div>
                <p className="font-bold text-[#fafafa] text-[16px] leading-5 tracking-[-0.16px]">
                  {fields.title || contentItem.title || contentItem.topic || "Untitled"}
                </p>
                <p className="text-[#a1a1aa] text-[12px] leading-4">{meta.sublabel}</p>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-[12px]">
              {/* Version dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                  className="bg-[#262626] border border-[rgba(255,255,255,0.08)] flex items-center px-[17px] py-[9px] rounded-[56px] shrink-0 hover:bg-[#333] transition-colors"
                >
                  <span className="font-medium text-[#fafafa] text-[14px] mr-[8px]">Version {version}</span>
                  <ChevronDown className="size-[14px] text-[#a1a1aa]" />
                </button>
                {showVersionDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[12px] shadow-xl py-2 min-w-[120px] z-50">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => { setVersion(v); setShowVersionDropdown(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#262626] transition-colors ${v === version ? 'text-[#4B56F2] font-medium' : 'text-[#fafafa]'}`}
                      >
                        Version {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Generate Content button */}
              <button
                onClick={() => {
                  const prompt = buildContentPrompt({
                    platform: contentItem.platform || '',
                    topic: contentItem.topic,
                    contentType: contentItem.contentType,
                    tone: fields.writingTone,
                    wordCount: `${fields.wordCountMin}-${fields.wordCountMax}`,
                  });
                  setPromptPreview(prompt);
                  setShowGenerateModal(true);
                }}
                className="bg-[#4B56F2] flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] rounded-[56px] shrink-0 hover:bg-[#3b46e0] transition-colors"
              >
                <Sparkles className="size-[14px] text-white" />
                <span className="font-medium text-white text-[14px]">Generate Content</span>
              </button>

              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="bg-[#262626] border border-[rgba(255,255,255,0.08)] flex items-center px-[17px] py-[9px] rounded-[56px] shrink-0 hover:bg-[#333] transition-colors"
                >
                  <span className="font-medium text-[#fafafa] text-[14px] mr-[8px]">{currentStatus}</span>
                  <ChevronDown className="size-[14px] text-[#a1a1aa]" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[12px] shadow-xl py-2 min-w-[160px] z-50">
                    {["Draft", "Ready for Review", "Approved", "Rejected"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-[#262626] transition-colors ${status === currentStatus ? 'text-[#4B56F2] font-medium' : 'text-[#fafafa]'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-[16px] size-[36px] hover:bg-[#262626] transition-colors"
              >
                <X className="size-[18px] text-[#a1a1aa]" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Alert Banners ── */}
        {currentStatus === "Ready for Review" && (
          <div className="bg-[rgba(245,158,11,0.1)] border-b border-[rgba(245,158,11,0.2)] px-[24px] py-[12px]">
            <div className="flex items-start gap-[12px]">
              <div className="bg-[rgba(245,158,11,0.2)] rounded-[8px] size-[24px] flex items-center justify-center shrink-0 mt-[2px]">
                <svg fill="none" viewBox="0 0 16 16" className="size-[14px]">
                  <path d="M8 1L15 14H1L8 1Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 6V9" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.5" fill="#f59e0b" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#f59e0b] text-[13px] mb-[4px]">Post is under review</p>
                <p className="text-[#d4d4d8] text-[12px] leading-[16px]">This post has been customized and may differ from project defaults. Review the fields below before approving.</p>
              </div>
            </div>
          </div>
        )}

        {currentStatus === "Rejected" && (
          <div className="bg-[rgba(239,68,68,0.1)] border-b border-[rgba(239,68,68,0.2)] px-[24px] py-[12px]">
            <div className="flex items-start gap-[12px]">
              <div className="bg-[rgba(239,68,68,0.2)] rounded-[8px] size-[24px] flex items-center justify-center shrink-0 mt-[2px]">
                <svg fill="none" viewBox="0 0 16 16" className="size-[14px]">
                  <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M5 5L11 11M11 5L5 11" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#ef4444] text-[13px] mb-[4px]">Post rejected</p>
                {rejectionReasonDisplay && (
                  <p className="text-[#d4d4d8] text-[12px] leading-[16px] mb-[4px]">{rejectionReasonDisplay}</p>
                )}
                <p className="text-[#a1a1aa] text-[11px] leading-[14px]">Check the comments section for more details.</p>
              </div>
            </div>
          </div>
        )}

        {currentStatus === "Approved" && (
          <div className="bg-[rgba(18,182,103,0.1)] border-b border-[rgba(18,182,103,0.2)] px-[24px] py-[12px]">
            <div className="flex items-start gap-[12px]">
              <div className="bg-[rgba(18,182,103,0.2)] rounded-[8px] size-[24px] flex items-center justify-center shrink-0 mt-[2px]">
                <svg fill="none" viewBox="0 0 16 16" className="size-[14px]">
                  <circle cx="8" cy="8" r="7" stroke="#12B667" strokeWidth="1.5" />
                  <path d="M5 8L7 10L11 6" stroke="#12B667" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#12B667] text-[13px] mb-[4px]">Post approved</p>
                <p className="text-[#d4d4d8] text-[12px] leading-[16px]">This post has been approved and is ready for publishing.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Body: Preview + Form ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Preview panel (left, 320px) */}
          <PreviewPanel category={category} fields={fields} platform={contentItem.platform} />

          {/* Form panel (right, scrollable) */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-[#0a0a0a]">
            <div className="flex flex-col items-start px-[24px] py-[16px] pb-[120px]">
              {category === "long-form" && <LongFormFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} setShowResourcePicker={setShowResourcePicker} />}
              {category === "short-video" && <ShortVideoFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} setShowResourcePicker={setShowResourcePicker} />}
              {category === "highlight" && <HighlightFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} setShowResourcePicker={setShowResourcePicker} />}
              {category === "quote-card" && <QuoteCardFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} />}
              {category === "ai-video" && <AIVideoFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} setShowResourcePicker={setShowResourcePicker} />}
              {category === "other" && <OtherFields fields={fields} setField={setField} selectedBrandKitName={selectedBrandKitName} setShowBrandKitPicker={setShowBrandKitPicker} selectedWriterProfileName={selectedWriterProfileName} setShowWriterProfilePicker={setShowWriterProfilePicker} setShowResourcePicker={setShowResourcePicker} />}

              {/* ── Comments Section ── */}
              <div className="w-full pt-[24px]">
                <div className="h-px bg-[rgba(255,255,255,0.08)] mb-[16px]" />
                <div className="flex items-center gap-[8px] mb-[16px]">
                  <p className="font-bold text-[#fafafa] text-[15px]">Comments</p>
                  <div className="bg-[rgba(255,255,255,0.08)] rounded-[10px] px-[6px] py-[2px]">
                    <span className="text-[#a1a1aa] text-[11px] font-semibold">{comments.length}</span>
                  </div>
                </div>

                {/* Comment list */}
                <div className="flex flex-col gap-[16px] mb-[16px]">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-[12px]">
                      <div
                        className={`rounded-[14px] size-[28px] flex items-center justify-center shrink-0 ${
                          comment.isSystem ? 'bg-[#374151]' : ''
                        }`}
                        style={!comment.isSystem ? { backgroundColor: comment.color } : {}}
                      >
                        <span className="text-white text-[11px] font-bold">{comment.initials}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-[8px] mb-[4px]">
                          <span className={`text-[13px] ${comment.isSystem ? 'text-[#9ca3af] italic' : 'font-bold text-[#fafafa]'}`}>
                            {comment.isSystem ? 'System' : comment.author}
                          </span>
                          <span className="text-[#a1a1aa] text-[11px]">{comment.time}</span>
                        </div>
                        <p className={`text-[13px] leading-[18px] ${comment.isSystem ? 'text-[#9ca3af] italic' : 'text-[#d4d4d8]'}`}>
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment composer */}
                <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-[12px] flex items-center gap-[12px] px-[15px] py-[9px]">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-[13px] text-[#fafafa] placeholder-[rgba(161,161,170,0.4)] outline-none"
                  />
                  <button className="flex items-center justify-center size-[24px] rounded-[4px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                    <svg fill="none" viewBox="0 0 14 14" className="size-[14px]">
                      <path d="M13 1L6 8M13 1L8 13L6 8M13 1L1 6L6 8" stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky footer with Save ── */}
        <div className="shrink-0 border-t border-[rgba(255,255,255,0.08)] px-[24px] py-[16px] flex justify-end gap-[12px] bg-[#0a0a0a]">
          <button
            onClick={onClose}
            className="px-[24px] py-[10px] rounded-[12px] bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] text-[14px] font-medium hover:bg-[#262626] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onUpdate({ ...contentItem, ...fields }); onClose(); }}
            className="px-[24px] py-[10px] rounded-[12px] bg-[#4B56F2] text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Rejection Modal ── */}
      {showRejectionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowRejectionModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#1a1a1a] rounded-[16px] border border-[rgba(255,255,255,0.12)] p-[24px] w-full max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="bg-[rgba(239,68,68,0.2)] rounded-[12px] size-[40px] flex items-center justify-center shrink-0">
                <svg fill="none" viewBox="0 0 20 20" className="size-[20px]">
                  <circle cx="10" cy="10" r="9" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M7 7L13 13M13 7L7 13" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#fafafa] text-[16px]">Reject post</p>
                <p className="text-[#a1a1aa] text-[13px]">Please provide a reason for rejection</p>
              </div>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Describe why this post is being rejected..."
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.12)] rounded-[12px] px-[16px] py-[12px] text-[14px] text-[#fafafa] placeholder-[rgba(161,161,170,0.4)] outline-none resize-none mb-[20px]"
            />

            <div className="flex justify-end gap-[12px]">
              <button
                onClick={() => { setShowRejectionModal(false); setRejectionReason(""); }}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#262626] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] text-[14px] font-medium hover:bg-[#333] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#ef4444] text-white text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Brand Kit Picker ── */}
      <BrandKitPicker
        isOpen={showBrandKitPicker}
        onClose={() => setShowBrandKitPicker(false)}
        selectedId={fields.brandKit || null}
        onSelect={(id, name) => {
          setField('brandKit', id);
          setSelectedBrandKitName(name);
          if (!id) {
            setField('brandKit', '');
          }
        }}
      />

      {/* ── Writer Profile Picker ── */}
      <WriterProfilePicker
        isOpen={showWriterProfilePicker}
        onClose={() => setShowWriterProfilePicker(false)}
        selectedId={fields.writerProfileId || null}
        onSelect={(id, name) => {
          setField('writerProfileId', id);
          setSelectedWriterProfileName(name);
          if (!id) {
            setField('writerProfileId', '');
          }
        }}
      />

      {/* ── Resource Picker ── */}
      <ResourcePicker
        isOpen={showResourcePicker}
        onClose={() => setShowResourcePicker(false)}
        selectedIds={fields.selectedResources || []}
        onSelect={(ids) => {
          setField('selectedResources', ids);
        }}
      />

      {/* ── Generate Content Prompt Preview ── */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => !isGenerating && setShowGenerateModal(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#1a1a1a] rounded-[16px] border border-[rgba(255,255,255,0.12)] p-[24px] w-full max-w-[640px] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-[12px] mb-[20px]">
              <div className="bg-[rgba(75,86,242,0.2)] rounded-[12px] size-[40px] flex items-center justify-center shrink-0">
                <Sparkles className="size-[20px] text-[#4B56F2]" />
              </div>
              <div>
                <p className="font-bold text-[#fafafa] text-[16px]">Prompt Preview</p>
                <p className="text-[#a1a1aa] text-[13px]">Review the prompt that will be sent to the AI model</p>
              </div>
            </div>

            {/* Prompt textarea */}
            <div className="flex-1 min-h-0 mb-[20px]">
              <textarea
                readOnly
                value={promptPreview}
                className="w-full h-full min-h-[300px] bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-[16px] text-[13px] text-[#d4d4d8] font-mono leading-relaxed resize-none focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-[12px]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptPreview);
                  toast.success('Prompt copied to clipboard');
                }}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#262626] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] text-[14px] font-medium hover:bg-[#333] transition-colors"
              >
                Copy Prompt
              </button>
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setIsGenerating(true);
                  generateContentDraft(contentItem.id.toString()).then((result) => {
                    setIsGenerating(false);
                    if (result.success) {
                      onUpdate({
                        title: result.title,
                        description: result.description,
                      });
                      toast.success('Content generated successfully');
                    } else {
                      toast.error(`Generation failed: ${result.error}`);
                    }
                  });
                }}
                disabled={isGenerating}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#4B56F2] text-white text-[14px] font-medium hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="size-[14px] animate-spin" />
                ) : (
                  <Sparkles className="size-[14px]" />
                )}
                {isGenerating ? 'Generating...' : 'Send to OpenRouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Prompt Preview ── */}
      {showImagePrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => !isGeneratingImage && setShowImagePrompt(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative bg-[#1a1a1a] rounded-[16px] border border-[rgba(255,255,255,0.12)] p-[24px] w-full max-w-[640px] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-[12px] mb-[20px]">
              <div className="bg-[rgba(168,85,247,0.2)] rounded-[12px] size-[40px] flex items-center justify-center shrink-0">
                <ImageIcon className="size-[20px] text-[#A855F7]" />
              </div>
              <div>
                <p className="font-bold text-[#fafafa] text-[16px]">Image Prompt Preview</p>
                <p className="text-[#a1a1aa] text-[13px]">Review the prompt that will be sent to the image generation model</p>
              </div>
            </div>

            {/* Prompt textarea */}
            <div className="flex-1 min-h-0 mb-[20px]">
              <textarea
                readOnly
                value={imagePrompt}
                className="w-full h-full min-h-[200px] bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-[16px] text-[13px] text-[#d4d4d8] font-mono leading-relaxed resize-none focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-[12px]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(imagePrompt);
                  toast.success('Image prompt copied to clipboard');
                }}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#262626] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] text-[14px] font-medium hover:bg-[#333] transition-colors"
              >
                Copy Prompt
              </button>
              <button
                onClick={() => {
                  setShowImagePrompt(false);
                  setIsGeneratingImage(true);
                  generateContentImage(contentItem.id.toString()).then((result) => {
                    setIsGeneratingImage(false);
                    if (result.success && result.imageUrl) {
                      onUpdate({ generated_content_url: result.imageUrl });
                      toast.success('Image generated successfully');
                    } else {
                      toast.error(`Image generation failed: ${result.error}`);
                    }
                  });
                }}
                disabled={isGeneratingImage}
                className="px-[20px] py-[10px] rounded-[12px] bg-[#A855F7] text-white text-[14px] font-medium hover:opacity-90 transition-opacity flex items-center gap-[8px] disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <Loader2 className="size-[14px] animate-spin" />
                ) : (
                  <ImageIcon className="size-[14px]" />
                )}
                {isGeneratingImage ? 'Generating...' : 'Send to OpenRouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

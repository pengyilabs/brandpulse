import { useState, useRef, type ReactNode } from 'react';
import {
  X, Check, Plus, Upload, Trash2, ChevronRight, Zap,
  Globe, AlignLeft, Users, Image, Palette, Mic2, BookOpen,
  Tag, Folder, Grid3X3, UserPlus, Mail, AlertCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember { email: string; role: string; }
interface Resource    { name: string; type: string; }
interface Template    { contentType: string; name: string; description: string; }

interface FormData {
  // Step 1
  projectName: string;
  domain: string;
  projectContext: string;
  targetAudience: string;
  // Step 2
  brandColors: string[];
  toneOfVoice: string;
  customTone: string;
  brandDescription: string;
  referenceLinks: string[];
  // Step 3
  longWriterProfile: string;
  longWritingTone: string;
  longWritingLevel: string;
  longWordCount: number;
  // Step 4
  shortWriterProfile: string;
  shortWritingTone: string;
  shortWritingLevel: string;
  shortWordCount: number;
  // Step 5
  topics: string[];
  // Step 6
  resources: Resource[];
  resourceText: string;
  // Step 7
  templates: Template[];
  // Step 8
  teamMembers: TeamMember[];
  inviteEmail: string;
}

const INITIAL: FormData = {
  projectName: '', domain: 'https://', projectContext: '', targetAudience: '',
  brandColors: ['#4B56F2', '#0A0A0A', '#FFFFFF', ''],
  toneOfVoice: 'Professional', customTone: '',
  brandDescription: '', referenceLinks: [''],
  longWriterProfile: '', longWritingTone: 'Professional', longWritingLevel: 'Professional', longWordCount: 2000,
  shortWriterProfile: '', shortWritingTone: 'Casual', shortWritingLevel: 'Conversational', shortWordCount: 200,
  topics: [], resources: [], resourceText: '', templates: [],
  teamMembers: [], inviteEmail: '',
};

const STEPS = [
  { n: 1, label: 'Project Basics',       icon: <Globe className="w-3.5 h-3.5" /> },
  { n: 2, label: 'Brand Guidelines',     icon: <Palette className="w-3.5 h-3.5" /> },
  { n: 3, label: 'Long Form Defaults',   icon: <BookOpen className="w-3.5 h-3.5" /> },
  { n: 4, label: 'Short Form Defaults',  icon: <Mic2 className="w-3.5 h-3.5" /> },
  { n: 5, label: 'Topics',               icon: <Tag className="w-3.5 h-3.5" /> },
  { n: 6, label: 'Resources',            icon: <Folder className="w-3.5 h-3.5" /> },
  { n: 7, label: 'Templates',            icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { n: 8, label: 'Team Access',          icon: <Users className="w-3.5 h-3.5" /> },
];

const TONE_OPTIONS   = ['Professional', 'Casual', 'Friendly', 'Bold', 'Inspirational', 'Custom'];
const LEVEL_OPTIONS  = ['Academic', 'Professional', 'Conversational', 'Simple'];
const ROLE_OPTIONS   = ['Admin', 'Editor', 'Viewer'];
const CONTENT_TYPES  = ['Clips & Shorts', 'Blog Posts', 'AI Text-to-Voice Video', 'Images & Carousels', 'Quote Cards', 'Carousel'];

// ── Component ─────────────────────────────────────────────────────────────────

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (project: any) => void;
}

export function ProjectCreationModal({ isOpen, onClose, onComplete }: ProjectCreationModalProps) {
  const [step, setStep]     = useState(1);
  const [data, setData]     = useState<FormData>(INITIAL);
  const [topicInput, setTopicInput] = useState('');
  const [openTemplate, setOpenTemplate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const update = (patch: Partial<FormData>) => setData(d => ({ ...d, ...patch }));

  const canAdvance = () => {
    if (step === 1) return data.projectName.trim().length > 0;
    return true;
  };

  const next = () => { if (step < 8) setStep(s => s + 1); };
  const back = () => { if (step > 1) setStep(s => s - 1); };

  const create = () => {
    onComplete({ ...data, id: Date.now() });
    setStep(1);
    setData(INITIAL);
  };

  const addTopic = () => {
    const v = topicInput.trim();
    if (v && !data.topics.includes(v)) update({ topics: [...data.topics, v] });
    setTopicInput('');
  };

  const removeTopic = (t: string) => update({ topics: data.topics.filter(x => x !== t) });

  const addLink = () => update({ referenceLinks: [...data.referenceLinks, ''] });
  const updateLink = (i: number, v: string) => {
    const links = [...data.referenceLinks];
    links[i] = v;
    update({ referenceLinks: links });
  };
  const removeLink = (i: number) =>
    update({ referenceLinks: data.referenceLinks.filter((_, idx) => idx !== i) });

  const addMember = () => {
    const email = data.inviteEmail.trim();
    if (email && !data.teamMembers.find(m => m.email === email)) {
      update({ teamMembers: [...data.teamMembers, { email, role: 'Editor' }], inviteEmail: '' });
    }
  };

  const updateMemberRole = (email: string, role: string) =>
    update({ teamMembers: data.teamMembers.map(m => m.email === email ? { ...m, role } : m) });

  const removeMember = (email: string) =>
    update({ teamMembers: data.teamMembers.filter(m => m.email !== email) });

  return (
    <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm">
      <div className="flex flex-1 m-4 bg-background border border-border rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">

        {/* ── Left: Step Navigator ──────────────────────────────────────── */}
        <div className="w-64 shrink-0 bg-card border-r border-border flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">New Project</span>
          </div>

          {/* Steps */}
          <div className="flex-1 py-4 px-3 space-y-1 overflow-auto">
            {STEPS.map(s => {
              const done    = step > s.n;
              const current = step === s.n;
              return (
                <button
                  key={s.n}
                  onClick={() => done && setStep(s.n)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    current
                      ? 'bg-primary/10 text-primary'
                      : done
                      ? 'text-foreground hover:bg-secondary cursor-pointer'
                      : 'text-muted-foreground cursor-default'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    current ? 'bg-primary text-white' : done ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {done ? <Check className="w-3 h-3" /> : s.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{s.label}</div>
                  </div>
                  {current && <ChevronRight className="w-3 h-3 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {step} of 8</span>
              <span>{Math.round(((step - 1) / 8) * 100)}%</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Right: Form Content ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0">
            <div>
              <h2 className="text-lg font-bold text-foreground">{STEPS[step - 1].label}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {getStepSubtitle(step)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {step === 1 && <Step1 data={data} update={update} />}
            {step === 2 && <Step2 data={data} update={update} addLink={addLink} updateLink={updateLink} removeLink={removeLink} />}
            {step === 3 && <Step3 data={data} update={update} />}
            {step === 4 && <Step4 data={data} update={update} />}
            {step === 5 && (
              <Step5
                topics={data.topics}
                topicInput={topicInput}
                setTopicInput={setTopicInput}
                addTopic={addTopic}
                removeTopic={removeTopic}
              />
            )}
            {step === 6 && <Step6 data={data} update={update} fileInputRef={fileInputRef} />}
            {step === 7 && (
              <Step7
                openTemplate={openTemplate}
                setOpenTemplate={setOpenTemplate}
              />
            )}
            {step === 8 && (
              <Step8
                data={data}
                update={update}
                addMember={addMember}
                updateMemberRole={updateMemberRole}
                removeMember={removeMember}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-border shrink-0 bg-card/20">
            <button
              onClick={back}
              disabled={step === 1}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              {step < 8 ? (
                <button
                  onClick={next}
                  disabled={!canAdvance()}
                  className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={create}
                  className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      {hint && <p className="text-sm text-muted-foreground -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-muted-foreground">
      <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

function getStepSubtitle(step: number) {
  const map: Record<number, string> = {
    1: 'Basic information about this project',
    2: 'Define visual identity and brand voice',
    3: 'Default settings for blog posts and long-form content',
    4: 'Default settings for social media and short-form content',
    5: 'Content themes and focus areas',
    6: 'Upload reference materials and assets',
    7: 'Visual templates per content type',
    8: 'Invite collaborators to this project',
  };
  return map[step] ?? '';
}

// ── Step 1: Project Basics ────────────────────────────────────────────────────

function Step1({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <FormField label="Project Name *">
        <input
          value={data.projectName}
          onChange={e => update({ projectName: e.target.value })}
          placeholder="e.g. Velocity Summer Campaign"
          className={inputCls}
        />
      </FormField>
      <FormField label="Domain or URL" hint="The client's website — used for research and context">
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={data.domain}
            onChange={e => update({ domain: e.target.value })}
            placeholder="https://example.com"
            className={`${inputCls} pl-9`}
          />
        </div>
      </FormField>
      <FormField label="Project Context" hint="Company description, mission, what it offers">
        <textarea
          value={data.projectContext}
          onChange={e => update({ projectContext: e.target.value })}
          placeholder="Describe the company, its products/services, mission, and value proposition..."
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </FormField>
      <FormField label="Target Audience" hint="Who the content is for">
        <textarea
          value={data.targetAudience}
          onChange={e => update({ targetAudience: e.target.value })}
          placeholder="Describe the ideal audience — demographics, interests, pain points, job titles..."
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </FormField>
    </div>
  );
}

// ── Step 2: Brand Guidelines ──────────────────────────────────────────────────

function Step2({ data, update, addLink, updateLink, removeLink }: {
  data: FormData; update: (p: Partial<FormData>) => void;
  addLink: () => void; updateLink: (i: number, v: string) => void; removeLink: (i: number) => void;
}) {
  const updateColor = (i: number, v: string) => {
    const colors = [...data.brandColors];
    colors[i] = v;
    update({ brandColors: colors });
  };

  return (
    <div className="space-y-5">
      {/* Logo Upload */}
      <FormField label="Upload Logo">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-secondary">
            <Image className="w-6 h-6 text-muted-foreground" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <Upload className="w-3.5 h-3.5" />
            Upload Logo
          </button>
        </div>
      </FormField>

      {/* Brand Colors */}
      <FormField label="Brand Colors" hint="Up to 4 brand colors">
        <div className="flex items-center gap-3 flex-wrap">
          {data.brandColors.map((color, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-xl border border-border overflow-hidden cursor-pointer shadow-sm"
                style={{ backgroundColor: color || '#262626' }}
              >
                <input
                  type="color"
                  value={color || '#262626'}
                  onChange={e => updateColor(i, e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{color || '—'}</span>
            </div>
          ))}
        </div>
      </FormField>

      {/* Tone of Voice */}
      <FormField label="Tone of Voice">
        <div className="grid grid-cols-3 gap-2">
          {TONE_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => update({ toneOfVoice: t })}
              className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                data.toneOfVoice === t
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FormField>

      {data.toneOfVoice === 'Custom' && (
        <FormField label="Custom Tone Description">
          <input
            value={data.customTone}
            onChange={e => update({ customTone: e.target.value })}
            placeholder="Describe the custom tone..."
            className={inputCls}
          />
        </FormField>
      )}

      {/* Brand Description */}
      <FormField label="Brand Description">
        <textarea
          value={data.brandDescription}
          onChange={e => update({ brandDescription: e.target.value })}
          placeholder="Key brand messages, differentiators, and personality traits..."
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </FormField>

      {/* Reference Links */}
      <FormField label="Reference Links" hint="Competitor sites, inspiration, style references">
        <div className="space-y-2">
          {data.referenceLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={link}
                onChange={e => updateLink(i, e.target.value)}
                placeholder="https://..."
                className={`${inputCls} flex-1`}
              />
              {data.referenceLinks.length > 1 && (
                <button
                  onClick={() => removeLink(i)}
                  className="p-2.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addLink}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add link
          </button>
        </div>
      </FormField>
    </div>
  );
}

// ── Step 3: Long Form Defaults ────────────────────────────────────────────────

function Step3({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <InfoNote>
        These defaults apply to blog posts and long-form LinkedIn content. You can override them per content item.
      </InfoNote>

      <FormField label="Virtual Writer Profile">
        <select
          value={data.longWriterProfile}
          onChange={e => update({ longWriterProfile: e.target.value })}
          className={inputCls}
        >
          <option value="">Select or create a writer persona...</option>
          <option value="alex">Alex — Thought Leader</option>
          <option value="sarah">Sarah — Content Strategist</option>
          <option value="new">+ Create New Profile</option>
        </select>
      </FormField>

      <FormField label="Writer Avatar">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-secondary">
            <Image className="w-5 h-5 text-muted-foreground" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <Upload className="w-3.5 h-3.5" />
            Upload Avatar
          </button>
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Writing Tone">
          <select
            value={data.longWritingTone}
            onChange={e => update({ longWritingTone: e.target.value })}
            className={inputCls}
          >
            {TONE_OPTIONS.filter(t => t !== 'Custom').map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Writing Level">
          <select
            value={data.longWritingLevel}
            onChange={e => update({ longWritingLevel: e.target.value })}
            className={inputCls}
          >
            {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Default Word Count" hint="Approximate target length per piece">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={data.longWordCount}
            onChange={e => update({ longWordCount: +e.target.value })}
            min={500}
            max={10000}
            step={100}
            className={`${inputCls} w-32`}
          />
          <span className="text-sm text-muted-foreground">words (default 2,000)</span>
        </div>
      </FormField>
    </div>
  );
}

// ── Step 4: Short Form Defaults ───────────────────────────────────────────────

function Step4({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <InfoNote>
        These defaults apply to social media posts and short-form content. You can override them per content item.
      </InfoNote>

      <FormField label="Virtual Writer Profile">
        <select
          value={data.shortWriterProfile}
          onChange={e => update({ shortWriterProfile: e.target.value })}
          className={inputCls}
        >
          <option value="">Select or create a writer persona...</option>
          <option value="maya">Maya — Social Media Voice</option>
          <option value="chris">Chris — Brand Ambassador</option>
          <option value="new">+ Create New Profile</option>
        </select>
      </FormField>

      <FormField label="Writer Avatar">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-secondary">
            <Image className="w-5 h-5 text-muted-foreground" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
            <Upload className="w-3.5 h-3.5" />
            Upload Avatar
          </button>
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Writing Tone">
          <select
            value={data.shortWritingTone}
            onChange={e => update({ shortWritingTone: e.target.value })}
            className={inputCls}
          >
            {TONE_OPTIONS.filter(t => t !== 'Custom').map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Writing Level">
          <select
            value={data.shortWritingLevel}
            onChange={e => update({ shortWritingLevel: e.target.value })}
            className={inputCls}
          >
            {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Default Word Count" hint="150–300 words for social, 500+ for short-form articles">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={data.shortWordCount}
            onChange={e => update({ shortWordCount: +e.target.value })}
            min={50}
            max={1000}
            step={25}
            className={`${inputCls} w-32`}
          />
          <span className="text-sm text-muted-foreground">words (default 200)</span>
        </div>
      </FormField>
    </div>
  );
}

// ── Step 5: Topics ────────────────────────────────────────────────────────────

function Step5({ topics, topicInput, setTopicInput, addTopic, removeTopic }: {
  topics: string[];
  topicInput: string;
  setTopicInput: (v: string) => void;
  addTopic: () => void;
  removeTopic: (t: string) => void;
}) {
  return (
    <div className="space-y-5">
      <InfoNote>
        Topics help the AI understand what content themes to focus on. You can always add or remove topics later, and they will be available when creating new content.
      </InfoNote>

      <FormField label="Add Topics">
        <div className="flex gap-2">
          <input
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            placeholder="e.g. Content Marketing"
            className={`${inputCls} flex-1`}
          />
          <button
            onClick={addTopic}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </div>
      </FormField>

      {topics.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">{topics.length} topic{topics.length !== 1 ? 's' : ''}</p>
          <div className="flex flex-wrap gap-2">
            {topics.map(t => (
              <span
                key={t}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-full"
              >
                {t}
                <button
                  onClick={() => removeTopic(t)}
                  className="text-primary/60 hover:text-primary transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested topics */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {['Brand Awareness', 'Lead Generation', 'Thought Leadership', 'Product Education', 'Customer Success', 'Industry News', 'How-to Guides', 'Case Studies'].map(s => (
            !topics.includes(s) && (
              <button
                key={s}
                onClick={() => { if (!topics.includes(s)) { setTopicInput(s); } }}
                className="px-3 py-1.5 border border-dashed border-border text-sm text-muted-foreground rounded-full hover:border-primary/40 hover:text-primary transition-all"
              >
                + {s}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 6: Resources ─────────────────────────────────────────────────────────

function Step6({ data, update, fileInputRef }: {
  data: FormData;
  update: (p: Partial<FormData>) => void;
  fileInputRef: { current: HTMLInputElement | null };
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const newRes = files.map(f => ({ name: f.name, type: f.type || 'unknown' }));
    update({ resources: [...data.resources, ...newRes] });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newRes = files.map(f => ({ name: f.name, type: f.type || 'unknown' }));
    update({ resources: [...data.resources, ...newRes] });
  };

  const removeResource = (i: number) =>
    update({ resources: data.resources.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-5">
      <InfoNote>
        These resources will be available when creating campaigns and content. You can add more resources later.
      </InfoNote>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-secondary/30'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground mt-1">Images, videos, PDFs, documents, links</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Text Resource */}
      <FormField label="Or paste text directly">
        <textarea
          value={data.resourceText}
          onChange={e => update({ resourceText: e.target.value })}
          placeholder="Paste product descriptions, talking points, briefs, or any text content..."
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </FormField>

      {/* Uploaded Files */}
      {data.resources.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">{data.resources.length} file{data.resources.length !== 1 ? 's' : ''} uploaded</p>
          <div className="grid grid-cols-3 gap-2">
            {data.resources.map((r, i) => (
              <div key={i} className="group relative flex flex-col items-center gap-1.5 p-3 bg-secondary border border-border rounded-xl">
                <Folder className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground truncate w-full text-center">{r.name}</p>
                <button
                  onClick={() => removeResource(i)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 7: Templates ─────────────────────────────────────────────────────────

function Step7({ openTemplate, setOpenTemplate }: {
  openTemplate: string | null;
  setOpenTemplate: (t: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      <InfoNote>
        Templates define the visual style for each content type. You can add more or customize them later.
      </InfoNote>

      {CONTENT_TYPES.map(ct => (
        <div key={ct} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenTemplate(openTemplate === ct ? null : ct)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">{ct}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">0 templates</span>
              <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${openTemplate === ct ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {openTemplate === ct && (
            <div className="border-t border-border p-4 bg-secondary/20">
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">No templates yet</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Add a template to define the visual style</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 text-primary text-sm font-medium rounded-lg hover:bg-primary/10 transition-colors">
                  <Plus className="w-3 h-3" />
                  Add Template
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 8: Team Access ───────────────────────────────────────────────────────

function Step8({ data, update, addMember, updateMemberRole, removeMember }: {
  data: FormData;
  update: (p: Partial<FormData>) => void;
  addMember: () => void;
  updateMemberRole: (email: string, role: string) => void;
  removeMember: (email: string) => void;
}) {
  return (
    <div className="space-y-5">
      <InfoNote>
        Team members will inherit all project defaults when creating content.
      </InfoNote>

      <FormField label="Invite by Email">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={data.inviteEmail}
              onChange={e => update({ inviteEmail: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
              placeholder="colleague@company.com"
              type="email"
              className={`${inputCls} pl-9`}
            />
          </div>
          <button
            onClick={addMember}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Invite
          </button>
        </div>
      </FormField>

      {data.teamMembers.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">{data.teamMembers.length} invite{data.teamMembers.length !== 1 ? 's' : ''} pending</p>
          {data.teamMembers.map(member => (
            <div
              key={member.email}
              className="flex items-center gap-3 px-4 py-3 bg-secondary border border-border rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">
                  {member.email[0].toUpperCase()}
                </span>
              </div>
              <span className="flex-1 text-sm text-foreground truncate">{member.email}</span>
              <select
                value={member.role}
                onChange={e => updateMemberRole(member.email, e.target.value)}
                className="text-sm bg-background border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
              </select>
              <button
                onClick={() => removeMember(member.email)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <UserPlus className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No team members yet</p>
          <p className="text-sm text-muted-foreground/60">You can always invite collaborators later from project settings</p>
        </div>
      )}
    </div>
  );
}

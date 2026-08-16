import { useState, useMemo, useRef } from 'react';
import { FileText, Video, Sparkles, Quote, MessageCircle, Play, Plus, X, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type ContentTypeId = 'blog-post' | 'short-clips' | 'highlight-reel' | 'quote-cards' | 'social-posts' | 'ai-video';

interface ContentType {
  id: ContentTypeId;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
}

const CONTENT_TYPES: ContentType[] = [
  { id: 'blog-post', label: 'Blog Post / Recap', shortLabel: 'Blog Posts', icon: FileText, color: '#8B5CF6' },
  { id: 'short-clips', label: 'Short Clips', shortLabel: 'Short Clips', icon: Video, color: '#F97316' },
  { id: 'highlight-reel', label: 'Highlight Reel', shortLabel: 'Highlight Reels', icon: Play, color: '#EC4899' },
  { id: 'quote-cards', label: 'Quote Cards', shortLabel: 'Quote Cards', icon: Quote, color: '#4B56F2' },
  { id: 'social-posts', label: 'Social Posts', shortLabel: 'Social Posts', icon: MessageCircle, color: '#3B82F6' },
  { id: 'ai-video', label: 'Text-to-AI Video', shortLabel: 'AI Videos', icon: Sparkles, color: '#8B5CF6' },
];

interface ContentTypeMixStepProps {
  onComplete: (quantities: Record<ContentTypeId, number>) => void;
  onBack?: () => void;
  maxItems?: number;
}

function EditableCount({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = () => {
    const parsed = parseInt(draft, 10);
    onChange(isNaN(parsed) ? 0 : Math.max(0, Math.min(99, parsed)));
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        type="number"
        min="0"
        max="99"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-10 text-center bg-transparent border-b border-current outline-none text-sm font-bold"
        style={{ color }}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      title="Click to edit"
      className="font-bold tabular-nums underline-offset-2 hover:underline cursor-text rounded px-0.5 transition-opacity"
      style={{ color }}
    >
      {value}
    </button>
  );
}

export function ContentTypeMixStep({ onComplete, onBack, maxItems = 50 }: ContentTypeMixStepProps) {
  const [activeTypes, setActiveTypes] = useState<ContentTypeId[]>([
    'blog-post',
    'short-clips',
    'highlight-reel',
    'quote-cards',
    'social-posts',
  ]);
  const [quantities, setQuantities] = useState<Record<ContentTypeId, number>>({
    'blog-post': 2,
    'short-clips': 8,
    'highlight-reel': 2,
    'quote-cards': 4,
    'social-posts': 4,
    'ai-video': 0,
  });

  const totalItems = useMemo(() => {
    return activeTypes.reduce((sum, typeId) => sum + (quantities[typeId] || 0), 0);
  }, [activeTypes, quantities]);

  const exceedsLimit = totalItems > maxItems;

  const handleQuantityChange = (typeId: ContentTypeId, value: number) => {
    setQuantities({ ...quantities, [typeId]: value });
  };

  const handleIncrement = (typeId: ContentTypeId) => {
    const current = quantities[typeId] || 0;
    if (current < 99) setQuantities({ ...quantities, [typeId]: current + 1 });
  };

  const handleDecrement = (typeId: ContentTypeId) => {
    const current = quantities[typeId] || 0;
    if (current > 0) setQuantities({ ...quantities, [typeId]: current - 1 });
  };

  const removeContentType = (typeId: ContentTypeId) => {
    setActiveTypes(activeTypes.filter((id) => id !== typeId));
    setQuantities({ ...quantities, [typeId]: 0 });
  };

  const addContentType = (typeId: ContentTypeId) => {
    if (!activeTypes.includes(typeId)) {
      setActiveTypes([...activeTypes, typeId]);
      if (quantities[typeId] === 0) setQuantities({ ...quantities, [typeId]: 1 });
    }
  };

  const availableToAdd = CONTENT_TYPES.filter((type) => !activeTypes.includes(type.id));

  const summaryItems = activeTypes
    .map((typeId) => ({ type: CONTENT_TYPES.find((t) => t.id === typeId)!, count: quantities[typeId] || 0 }))
    .filter((s) => s.count > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Content Type Mix</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Choose how many of each content type to create in this campaign
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-2">
          {activeTypes.map((typeId) => {
            const type = CONTENT_TYPES.find((t) => t.id === typeId)!;
            const Icon = type.icon;
            const quantity = quantities[typeId] || 0;

            return (
              <div
                key={typeId}
                className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent/40 transition-colors"
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${type.color}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color: type.color }} />
                </div>

                {/* Label */}
                <span className="text-sm font-medium text-foreground flex-1">{type.label}</span>

                {/* Stepper */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDecrement(typeId)}
                    disabled={quantity === 0}
                    className="w-7 h-7 rounded border border-border bg-background hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-foreground text-base leading-none"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      handleQuantityChange(typeId, isNaN(v) ? 0 : Math.max(0, Math.min(99, v)));
                    }}
                    className="w-14 h-7 px-1 text-center bg-background border border-border rounded text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleIncrement(typeId)}
                    disabled={quantity === 99}
                    className="w-7 h-7 rounded border border-border bg-background hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-foreground text-base leading-none"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeContentType(typeId)}
                  className="w-7 h-7 rounded hover:bg-red-500/10 transition-colors flex items-center justify-center text-muted-foreground hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Add Content Type */}
          {availableToAdd.length > 0 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent/20 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Content Type
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 bg-card border border-border rounded-lg shadow-xl p-2 w-56"
                  sideOffset={4}
                >
                  {availableToAdd.map((type) => {
                    const Icon = type.icon;
                    return (
                      <DropdownMenu.Item
                        key={type.id}
                        onClick={() => addContentType(type.id)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer outline-none hover:bg-accent"
                      >
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${type.color}18` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: type.color }} />
                        </div>
                        <span className="font-medium text-foreground">{type.label}</span>
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="border-t border-border flex-shrink-0">
        <div className="px-6 py-3 bg-accent/20">
          <div className="flex items-center justify-between gap-4">
            {/* Inline count summary */}
            <div className="flex-1 min-w-0">
              {summaryItems.length === 0 ? (
                <span className="text-xs text-muted-foreground">Set quantities above to get started</span>
              ) : (
                <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted-foreground">
                  {summaryItems.map(({ type, count }, index) => (
                    <span key={type.id} className="flex items-center gap-1">
                      {index > 0 && <span className="text-border select-none mx-0.5">|</span>}
                      <span className="text-foreground/70">{type.shortLabel}:</span>
                      <EditableCount
                        value={count}
                        onChange={(v) => handleQuantityChange(type.id, v)}
                        color={type.color}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Total + warning */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {exceedsLimit && (
                <div className="flex items-center gap-1 text-orange-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Exceeds {maxItems}</span>
                </div>
              )}
              <span className={clsx('text-sm font-semibold tabular-nums', exceedsLimit ? 'text-orange-500' : 'text-foreground')}>
                {totalItems} total
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 flex items-center border-t border-border">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => onComplete(quantities)}
            disabled={totalItems === 0 || exceedsLimit}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

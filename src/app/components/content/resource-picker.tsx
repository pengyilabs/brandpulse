import { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, Check, FileText, Video, Image as ImageIcon, Upload, Loader2, XCircle } from 'lucide-react';
import { getResources, uploadResource, Resource } from '../../../lib/services/resources-service';

interface ResourcePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ResourceThumbnail({ resource }: { resource: Resource }) {
  if (resource.type === 'image') {
    return (
      <img
        src={resource.file_url}
        alt={resource.name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
        }}
      />
    );
  }
  if (resource.type === 'video') {
    return (
      <div className="w-full h-full bg-secondary flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-secondary flex items-center justify-center">
      <FileText className="w-8 h-8 text-muted-foreground" />
    </div>
  );
}

export function ResourcePicker({ isOpen, onClose, selectedIds, onSelect }: ResourcePickerProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    setLocalSelected(new Set(selectedIds));
    setLoading(true);
    let cancelled = false;
    async function load() {
      const data = await getResources();
      if (!cancelled) {
        setResources(data);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isOpen, selectedIds]);

  const filtered = resources.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setLocalSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    cancelRef.current = false;
    setUploading(true);
    try {
      await uploadResource(file);
      if (!cancelRef.current) {
        const data = await getResources();
        setResources(data);
      }
    } catch (err) {
      if (!cancelRef.current) {
        console.error('Upload failed:', err);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const cancelUpload = () => {
    cancelRef.current = true;
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
            <Dialog.Title className="text-lg font-semibold text-foreground">Select Resources</Dialog.Title>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Toolbar: search + upload */}
          <div className="flex items-center gap-3 px-6 pb-4 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
            {uploading ? (
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg text-sm flex-shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Uploading...</span>
                <button onClick={cancelUpload} className="ml-1 flex items-center gap-1 px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading resources...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">{search ? 'No resources match your search' : 'No resources yet'}</p>
                <p className="text-xs mt-1 opacity-60">Upload your first resource using the button above</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filtered.map((resource) => {
                  const isSelected = localSelected.has(resource.id);
                  return (
                    <button
                      key={resource.id}
                      onClick={() => toggle(resource.id)}
                      className={`relative group rounded-xl border-2 overflow-hidden transition-all text-left ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-primary/40 hover:bg-accent/30'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-secondary/50 overflow-hidden relative">
                        <ResourceThumbnail resource={resource} />
                        {/* Fallback icon for non-image (hidden by default, shown on error) */}
                        <div className="hidden absolute inset-0 bg-secondary flex items-center justify-center">
                          {resource.type === 'video' ? (
                            <Video className="w-8 h-8 text-muted-foreground" />
                          ) : (
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        {/* Selected overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-5 h-5 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        {/* Type badge */}
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-sm">
                          {resource.type}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(resource.file_size)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
            <p className="text-sm text-muted-foreground">
              {localSelected.size} selected
            </p>
            <button
              onClick={() => { onSelect(Array.from(localSelected)); onClose(); }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Apply
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
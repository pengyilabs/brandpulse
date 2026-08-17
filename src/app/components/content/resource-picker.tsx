import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, Check, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { getResources, Resource } from '../../../lib/services/resources-service';

interface ResourcePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}

export function ResourcePicker({ isOpen, onClose, selectedIds, onSelect }: ResourcePickerProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));

  useEffect(() => {
    if (!isOpen) return;
    setLocalSelected(new Set(selectedIds));
    let cancelled = false;
    async function load() {
      const data = await getResources();
      if (!cancelled) setResources(data);
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-lg z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">Select Resources</Dialog.Title>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filtered.map((resource) => {
              const Icon = getIcon(resource.type);
              const isSelected = localSelected.has(resource.id);
              return (
                <button
                  key={resource.id}
                  onClick={() => toggle(resource.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/10' : 'bg-secondary'}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No resources found</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{localSelected.size} selected</p>
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
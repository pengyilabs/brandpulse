import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, Check, User } from 'lucide-react';
import { getWriterProfiles, WriterProfile } from '../../../lib/services/writer-profiles-service';

interface WriterProfilePickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedId: string | null;
  onSelect: (id: string | null, name: string) => void;
}

export function WriterProfilePicker({ isOpen, onClose, selectedId, onSelect }: WriterProfilePickerProps) {
  const [profiles, setProfiles] = useState<WriterProfile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    async function load() {
      const data = await getWriterProfiles();
      if (!cancelled) setProfiles(data);
    }
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  const filtered = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-md z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-foreground">Select Writer Profile</Dialog.Title>
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
              placeholder="Search writer profiles..."
              className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            <button
              onClick={() => { onSelect(null, ''); onClose(); }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                selectedId === null ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">No writer profile</p>
                <p className="text-xs text-muted-foreground">Set tone manually</p>
              </div>
              {selectedId === null && <Check className="w-4 h-4 text-primary" />}
            </button>

            {filtered.map((profile) => (
              <button
                key={profile.id}
                onClick={() => { onSelect(profile.id, profile.name); onClose(); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                  selectedId === profile.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.tone || 'No tone'} · {profile.level || 'No level'}</p>
                </div>
                {selectedId === profile.id && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No writer profiles found</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
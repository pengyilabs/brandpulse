import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Upload, Link as LinkIcon, FileText, Video, Image as ImageIcon,
  Search, Download, Trash2, Clock, ArrowLeft, Play,
  BookOpen, Mic, MoreHorizontal, Cloud, Archive, FolderOpen,
} from 'lucide-react';
import { getResources, uploadResource, deleteResource, updateResource, type Resource as ServiceResource } from '../../../lib/services/resources-service';

type ResourceType = 'video' | 'document' | 'text' | 'image';

interface UIResource {
  id: string;
  name: string;
  type: ResourceType;
  size: string;
  fileSize: number;
  fileUrl: string;
  mimeType: string;
  uploadedDate: string;
  duration?: string;
  pageCount?: number;
  wordCount?: number;
  resolution?: string;
  thumbnail?: string | null;
  postsCreated?: number;
  posts?: Array<{ name: string; thumbnail?: string }>;
  transcribed: boolean;
  tags: string[];
  videoUrl?: string;
  fullText?: string;
  transcription?: string;
  summary?: string;
  description?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatUploadDate(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getTypeFromMime(mime: string): ResourceType {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'text/plain' || mime === 'application/pdf') return 'document';
  return 'document';
}

function getTypeFromExt(name: string): ResourceType {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) return 'video';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  if (['txt', 'md', 'rtf', 'csv'].includes(ext)) return 'text';
  return 'document';
}

function mapServiceToUI(r: ServiceResource): UIResource {
  return {
    id: r.id,
    name: r.name,
    type: getTypeFromMime(r.mime_type),
    size: formatFileSize(r.file_size),
    fileSize: r.file_size,
    fileUrl: r.file_url,
    mimeType: r.mime_type,
    uploadedDate: formatUploadDate(r.created_at),
    transcribed: false,
    tags: [],
    postsCreated: 0,
    description: r.description || undefined,
  };
}

function CardMenu({ resource, onDelete }: { resource: UIResource; onDelete: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
    setOpen(false);
  };

  const items: { label: string; action: () => void }[] = [
    {
      label: t('resources.downloadDocument'),
      action: () => downloadHref(resource.fileUrl, resource.name),
    },
  ];

  if (resource.type === 'video') {
    items.push({
      label: t('resources.downloadVideo'),
      action: () => downloadHref(resource.fileUrl, resource.name),
    });
  }
  if (resource.type === 'image') {
    items.push({
      label: t('resources.downloadImage'),
      action: () => downloadHref(resource.fileUrl, resource.name),
    });
  }

  items.push({
    label: t('common.delete'),
    action: () => { onDelete(); setOpen(false); },
  });

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Download options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-30 bg-popover border border-border rounded-xl shadow-2xl min-w-[11rem] py-1.5 overflow-hidden">
          {items.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">{t('resources.noDownloads')}</p>
          ) : (
            items.map(item => (
              <button key={item.label} onClick={e => { e.stopPropagation(); item.action(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors text-left">
                <Download className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                {item.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ResourceDetail({ resource, onBack, onDelete }: { resource: UIResource; onBack: () => void; onDelete: () => void }) {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
  };

  const TypeIcon = getTypeIcon(resource.type);

  return (
    <div className="flex-1 overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-8 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('resources.backToLibrary')}</span>
      </button>

      <div className="flex gap-8 p-8 pb-16">
        <div className="flex-[3]">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#51a2ff] uppercase">
              {resource.type}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-6">{resource.name}</h1>

          <div className="w-full rounded-xl overflow-hidden bg-black mb-8" style={{ aspectRatio: '16/9' }}>
            {resource.type === 'video' && (
              <video
                src={resource.fileUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
            {resource.type === 'image' && (
              <img src={resource.fileUrl} alt={resource.name} className="w-full h-full object-cover" />
            )}
            {(resource.type === 'document' || resource.type === 'text') && (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <TypeIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-[1.3] sticky top-8">
          <div className="bg-[#1a1a1a] rounded-xl p-5">
            <div className="mb-5 pt-0 border-t-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{t('resources.fileSize')}</span>
                  <span className="text-white font-medium">{resource.size}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{t('resources.uploaded')}</span>
                  <span className="text-white font-medium">{resource.uploadedDate}</span>
                </div>
                {resource.description && (
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-gray-400">{t('resources.description')}</span>
                    <span className="text-white font-medium text-right max-w-[150px]">{resource.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-5 border-t border-[#ffffff14]">
              <div className="flex flex-col gap-2">
                <button onClick={() => downloadHref(resource.fileUrl, resource.name)} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                  <Download className="w-4 h-4 text-gray-400" />
                  {t('resources.downloadDocument')}
                </button>

                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left mt-2"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                  {t('resources.archiveResource')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full mx-4 border border-[#ffffff14]">
            <h3 className="text-lg font-semibold text-white mb-2">{t('resources.archiveResource')}</h3>
            <p className="text-sm text-gray-400 mb-6">{t('resources.archiveDesc')}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => { onDelete(); setShowDeleteDialog(false); }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'document':
    case 'text': return FileText;
    case 'image': return ImageIcon;
    default: return FileText;
  }
};

type UploadSource = 'device' | 'google-drive' | 'dropbox';

export function EnhancedResourcesView() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSource, setUploadSource] = useState<UploadSource>('device');
  const [selectedResource, setSelectedResource] = useState<UIResource | null>(null);
  const [resources, setResources] = useState<UIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadResources = async () => {
    setLoading(true);
    const data = await getResources();
    setResources(data.map(mapServiceToUI));
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadResource(file);
    }
    await loadResources();
    setUploading(false);
    setShowUploadModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (resource: UIResource) => {
    const success = await deleteResource(resource.id);
    if (success) {
      setResources(prev => prev.filter(r => r.id !== resource.id));
      if (selectedResource?.id === resource.id) setSelectedResource(null);
    }
  };

  const filteredResources =
    activeFilter === 'all'
      ? resources
      : resources.filter((r) =>
          activeFilter === 'document' ? (r.type === 'document' || r.type === 'text') : r.type === activeFilter
        );

  const filterCounts = {
    all: resources.length,
    video: resources.filter((r) => r.type === 'video').length,
    document: resources.filter((r) => r.type === 'document' || r.type === 'text').length,
    image: resources.filter((r) => r.type === 'image').length,
  };

  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onBack={() => setSelectedResource(null)} onDelete={() => handleDelete(selectedResource)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">{t('resources.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('resources.description')}
              </p>
            </div>
            <button onClick={() => setShowUploadModal(true)} disabled={uploading} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50">
              <Plus className="w-4 h-4" />
              {uploading ? t('resources.uploading') : t('resources.addResources')}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('resources.searchPlaceholder')}
                className="w-full pl-11 pr-5 py-2.5 bg-[#1a1a1a] border border-[#ffffff14] rounded-xl text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
            <div className="flex items-center gap-2 p-1 bg-[#1a1a1a] rounded-xl border border-[#ffffff14]">
              {[
                { value: 'all', label: t('resources.all') },
                { value: 'video', label: t('resources.videos') },
                { value: 'document', label: t('resources.documents') },
                { value: 'image', label: t('resources.images') },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeFilter === filter.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter.label} ({filterCounts[filter.value as keyof typeof filterCounts]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Cloud className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">{t('resources.emptyTitle')}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t('resources.emptyDescription')}</p>
            <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              {t('resources.addResources')}
            </button>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, 247px)' }}>
            {filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <div
                  key={resource.id}
                  onClick={() => setSelectedResource(resource)}
                  className="flex flex-col bg-[#1a1a1a] cursor-pointer"
                  style={{ height: '366px' }}
                >
                  <div className="relative flex-shrink-0" style={{ height: '136px' }}>
                    {resource.type === 'image' && resource.fileUrl ? (
                      <img src={resource.fileUrl} alt={resource.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#262626] flex items-center justify-center">
                        <TypeIcon className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    {(resource.type === 'image' || resource.type === 'video') && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl border border-[#2b7fff33] bg-[#2b7fff1a] text-[#51a2ff] text-xs font-medium">
                      {resource.type}
                    </span>
                  </div>

                  <div className="flex flex-col flex-grow p-4" style={{ rowGap: '12px' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground truncate max-w-[210px] leading-5">
                        {resource.name}
                      </h3>
                      <CardMenu resource={resource} onDelete={() => handleDelete(resource)} />
                    </div>

                    <div className="flex flex-col" style={{ rowGap: '4px' }}>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('resources.size')}: {resource.size}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{t('resources.uploaded')} {resource.uploadedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative border-t border-[#ffffff14] bg-[#212121] group" style={{ height: '52px', padding: '11px 16px 12px' }}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-muted-foreground">
                        {t('resources.noContentCreated')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0d] w-full max-w-[600px] max-h-[90vh] rounded-2xl shadow-2xl border border-[#ffffff14] flex flex-col overflow-hidden">
            <div className="px-8 py-6 flex-shrink-0">
              <h2 className="text-[28px] font-bold text-white leading-tight">{t('resources.addResources')}</h2>
              <p className="text-sm text-[#a1a1aa] mt-2">{t('resources.uploadFiles')}</p>
            </div>

            <div className="px-8 py-6 flex-1">
              <div className="border-2 border-dashed border-[#ffffff14] rounded-xl bg-[#0a0a0a33] h-[200px] flex flex-col items-center justify-center cursor-pointer hover:border-[#4B56F2]/40 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex flex-col items-center justify-center w-full h-full">
                  <Cloud className="w-10 h-10 text-[#a1a1aa] mb-3" />
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#4B56F2] border-t-transparent rounded-full animate-spin" />
                      <p className="text-[#fafafa] text-sm font-semibold">{t('resources.uploading')}</p>
                    </div>
                  ) : (
                    <p className="text-[#fafafa] text-sm font-semibold">{t('resources.clickOrDrag')}</p>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center justify-between border-t border-[#ffffff14] bg-[#1a1a1a] px-8 py-5">
              <button
                onClick={() => { setShowUploadModal(false); }}
                className="text-sm font-semibold text-[#a1a1aa] hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
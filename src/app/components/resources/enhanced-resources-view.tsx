import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Upload, Link as LinkIcon, FileText, Video, Image as ImageIcon,
  Search, Download, Trash2, Clock, ArrowLeft, Play,
  BookOpen, Mic, MoreHorizontal, Cloud, Archive, FolderOpen,
} from 'lucide-react';
import {
  getResources, uploadResource, deleteResource,
  Resource as ServiceResource
} from '../../../lib/services/resources-service';

type ResourceType = 'video' | 'document' | 'text' | 'image';

interface Resource {
  id: string;
  serviceId: string;
  name: string;
  type: ResourceType;
  size: string;
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
}

// ─── Sample Data ───────────────────────────────────────────────────────────────

const SAMPLE_RESOURCE: Resource = {
  id: '-1',
  serviceId: 'sample-resource',
  name: 'Brand Guidelines 2026.pdf',
  type: 'document',
  size: '2.1 MB',
  uploadedDate: '3 days ago',
  pageCount: 32,
  thumbnail: null,
  postsCreated: 0,
  transcribed: true,
  tags: ['brand', 'guidelines'],
  summary: 'The Brand Guidelines 2026 document establishes visual and verbal identity standards.',
  fullText: 'BRAND GUIDELINES 2026\nOfficial Brand Identity Standards\n\nSECTION 1 — OUR BRAND STORY',
};

// ─── Service-to-UI mapping ────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function mapServiceToUI(sr: ServiceResource): Resource {
  const ext = sr.name.split('.').pop()?.toLowerCase() || '';
  let type: ResourceType = 'document';
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) type = 'video';
  else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) type = 'image';
  else if (['txt', 'md', 'rtf'].includes(ext)) type = 'text';

  return {
    id: sr.id,
    serviceId: sr.id,
    name: sr.name,
    type,
    size: formatFileSize(sr.file_size),
    uploadedDate: new Date(sr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    transcribed: false,
    tags: [],
    postsCreated: 0,
  };
}

const RESOURCES: Resource[] = [SAMPLE_RESOURCE];

function CardMenu({ resource }: { resource: Resource }) {
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

  const downloadBlob = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
    setOpen(false);
  };

  type MenuItem = { label: string; action: () => void };
  const items: MenuItem[] = [];

  if (resource.transcribed && (resource.transcription || resource.fullText)) {
    items.push({
      label: t('resources.downloadTranscription'),
      action: () => downloadBlob(resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt', resource.transcription ?? resource.fullText ?? ''),
    });
  }

  if (resource.type === 'video') {
    items.push({ label: t('resources.downloadAudio'), action: () => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3')) });
    items.push({ label: t('resources.downloadVideo'), action: () => downloadHref(resource.videoUrl ?? '#', resource.name) });
  }

  if (resource.type === 'image' && resource.thumbnail) {
    items.push({ label: t('resources.downloadImage'), action: () => downloadHref(resource.thumbnail!, resource.name) });
  }

  if (resource.type === 'document' || resource.type === 'text') {
    items.push({ label: t('resources.downloadDocument'), action: () => downloadBlob(resource.name, resource.fullText ?? '') });
  }

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

interface Post {
  name: string;
  thumbnail?: string;
  platform: string;
  type: string;
  project: string;
  campaign: string;
  createdAt: string;
  publishDate?: string;
  status: 'Published' | 'In Review' | 'Draft';
}

function ResourceDetail({ resource, onBack }: { resource: Resource; onBack: () => void }) {
  const { t } = useTranslation();
  const [textTab, setTextTab] = useState<'transcript' | 'summary'>('transcript');
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const downloadBlob = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  const downloadHref = (href: string, filename: string) => {
    const a = document.createElement('a');
    a.href = href; a.download = filename; a.target = '_blank'; a.click();
  };

  const handleArchive = () => {
    setIsArchived(true);
    setShowArchiveDialog(false);
  };

  const posts: Post[] = resource.posts?.map((post, i) => ({
    name: post.name,
    thumbnail: post.thumbnail,
    platform: ['TikTok', 'Instagram', 'LinkedIn', 'YouTube', 'Twitter', 'Pinterest'][i % 6] ?? 'Instagram',
    type: ['Short Video', 'Carousel', 'Post', 'Shorts', 'Thread', 'Pin'][i % 6] ?? 'Post',
    project: ['Wellness Startup', 'Velocity Athletics', 'Tech Innovations', 'Fashion Brand', 'Food & Beverage Co', 'B2B SaaS'][i % 6] ?? 'Wellness Startup',
    campaign: ['Summer Launch', 'Brand Campaign', 'Retreat Promo', 'Wellness Series'][i % 4] ?? 'Summer Launch',
    createdAt: ['3 hours ago', '5 hours ago', '1 day ago', '2 days ago', '1 week ago'][i % 5] ?? '3 hours ago',
    publishDate: ['Jun 15', 'Jun 18', 'Jul 5', 'Jul 10'][i % 4] ?? 'Jun 15',
    status: ['Published', 'Published', 'In Review', 'Draft', 'Published'][i % 5] as 'Published' | 'In Review' | 'Draft',
  })) ?? [];

  const statusStyles = {
    Published: 'bg-[#12B667]',
    'In Review': 'bg-[#F59E0B]',
    Draft: 'bg-[#6B7280]',
  };

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
            {resource.transcribed && (
              <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#66b266] uppercase">
                {t('resources.transcribed')}
              </span>
            )}
            {isArchived && (
              <span className="px-3 py-1 rounded-lg bg-[#1a1a1a] border border-[#ffffff14] text-xs font-semibold text-[#F59E0B] uppercase">
                {t('resources.archived')}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-6">{resource.name}</h1>

          <div className="w-full rounded-xl overflow-hidden bg-black mb-8" style={{ aspectRatio: '16/9' }}>
            {resource.type === 'video' && (
              <video
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster={resource.thumbnail}
                controls
                className="w-full h-full object-cover"
              />
            )}
            {resource.type === 'image' && resource.thumbnail && (
              <img src={resource.thumbnail} alt={resource.name} className="w-full h-full object-cover" />
            )}
            {resource.type === 'document' && (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            {resource.type === 'text' && (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <FileText className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">{t('resources.contentCreated', { count: posts.length })}</h2>
              <p className="text-xs text-muted-foreground">{t('resources.contentCreatedDesc')}</p>
            </div>

            <div className="space-y-3">
              {posts.map((post, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl hover:bg-[#212121] transition-colors">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt={post.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#262626] flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">{post.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{post.name}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">{post.platform} · {post.type}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#262626] text-[10px] text-muted-foreground">{post.project}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#262626] text-[10px] text-muted-foreground">{post.campaign}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{post.createdAt}</span>
                      {post.status === 'Published' && <span>Published {post.publishDate}</span>}
                      {post.status === 'In Review' && <span>Scheduled {post.publishDate}</span>}
                      {post.status === 'Draft' && <span>Draft</span>}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold text-white flex-shrink-0 ${statusStyles[post.status]}`}>
                    {post.status}
                  </span>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="p-8 bg-[#1a1a1a] rounded-xl text-center">
                  <p className="text-sm text-muted-foreground">{t('resources.noContentCreated')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-[1.3] sticky top-8">
          <div className="bg-[#1a1a1a] rounded-xl p-5">
            {(resource.type === 'video' || resource.type === 'document') && resource.transcribed && (
              <div className="mb-5">
                <div className="flex bg-[#0D0D0D] rounded-lg mb-3">
                  <button
                    onClick={() => setTextTab('transcript')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase transition-colors ${textTab === 'transcript' ? 'bg-[#262626] text-foreground rounded-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t('resources.transcript')}
                  </button>
                  <button
                    onClick={() => setTextTab('summary')}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase transition-colors ${textTab === 'summary' ? 'bg-[#262626] text-foreground rounded-lg' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t('resources.summary')}
                  </button>
                </div>

                <div className="bg-[#0D0D0D] rounded-lg p-4 max-h-52 overflow-y-auto">
                  {textTab === 'transcript' && resource.transcription && (
                    <div className="space-y-3">
                      {resource.transcription.split('\n').map((line, i) => (
                        <p key={i} className="text-xs text-white/80 leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  {textTab === 'summary' && resource.summary && (
                    <p className="text-xs text-white/80 leading-relaxed">
                      {resource.summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-5 pt-5 border-t border-[#ffffff14]">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{t('resources.fileSize')}</span>
                  <span className="text-white font-medium">{resource.size}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{t('resources.uploaded')}</span>
                  <span className="text-white font-medium">{resource.uploadedDate}</span>
                </div>
                {resource.duration && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{t('resources.duration')}</span>
                    <span className="text-white font-medium">{resource.duration}</span>
                  </div>
                )}
                {resource.pageCount && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{t('resources.pagesLabel')}</span>
                    <span className="text-white font-medium">{resource.pageCount} {t('resources.pages', { count: resource.pageCount })}</span>
                  </div>
                )}
                {resource.wordCount && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{t('resources.wordsLabel')}</span>
                    <span className="text-white font-medium">{resource.wordCount.toLocaleString()} {t('resources.words', { count: resource.wordCount })}</span>
                  </div>
                )}
                {resource.resolution && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{t('resources.resolution')}</span>
                    <span className="text-white font-medium">{resource.resolution}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-5 border-t border-[#ffffff14]">
              <div className="flex flex-col gap-2">
                {resource.transcribed && (resource.transcription || resource.fullText) && (
                  <button onClick={() => downloadBlob(resource.name.replace(/\.[^.]+$/, '') + '_transcription.txt', resource.transcription ?? resource.fullText ?? '')} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {t('resources.downloadTranscription')}
                  </button>
                )}
                {resource.type === 'video' && (
                  <>
                    <button onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name.replace(/\.[^.]+$/, '.mp3'))} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                      <Mic className="w-4 h-4 text-gray-400" />
                      {t('resources.downloadAudio')}
                    </button>
                    <button onClick={() => downloadHref(resource.videoUrl ?? '#', resource.name)} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                      <Video className="w-4 h-4 text-gray-400" />
                      {t('resources.downloadVideo')}
                    </button>
                  </>
                )}
                {resource.type === 'image' && resource.thumbnail && (
                  <button onClick={() => downloadHref(resource.thumbnail!, resource.name)} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    {t('resources.downloadImage')}
                  </button>
                )}
                {(resource.type === 'document' || resource.type === 'text') && (
                  <button onClick={() => downloadBlob(resource.name, resource.fullText ?? '')} className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {t('resources.downloadDocument')}
                  </button>
                )}

                {!isArchived && (
                  <button
                    onClick={() => setShowArchiveDialog(true)}
                    className="flex items-center gap-3 px-4 py-3 bg-[#262626] hover:bg-[#333333] rounded-lg text-sm font-medium text-white transition-colors text-left mt-2"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                    {t('resources.archiveResource')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full mx-4 border border-[#ffffff14]">
            <h3 className="text-lg font-semibold text-white mb-2">{t('resources.archiveResource')}</h3>
            <p className="text-sm text-gray-400 mb-6">
              {t('resources.archiveDesc')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowArchiveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleArchive}
                className="px-4 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-medium rounded-lg transition-colors"
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

interface RecentAsset {
  id: string;
  name: string;
  type: ResourceType;
  uploadedDate: string;
  usedIn?: string;
  thumbnail?: string;
}

const RECENT_ASSETS: RecentAsset[] = [
  { id: 'a1', name: 'hero-banner.png', type: 'image', uploadedDate: '2 mins ago', usedIn: 'Running Form Tips' },
  { id: 'a2', name: 'project-brief.pdf', type: 'document', uploadedDate: '1 hour ago' },
  { id: 'a3', name: 'intro-video.mp4', type: 'video', uploadedDate: 'Yesterday', usedIn: "Father's Day" },
  { id: 'a4', name: 'thumbnail-01.jpg', type: 'image', uploadedDate: '2 days ago' },
  { id: 'a5', name: 'logo-dark.svg', type: 'image', uploadedDate: '3 days ago', usedIn: 'Summer Sol' },
  { id: 'a6', name: 'notes.txt', type: 'text', uploadedDate: 'Last week' },
  { id: 'a7', name: 'brand-kit.pdf', type: 'document', uploadedDate: 'Last week', usedIn: 'Community' },
  { id: 'a8', name: 'campaign-deck.pptx', type: 'document', uploadedDate: '2 weeks ago' },
  { id: 'a9', name: 'promo-video.mp4', type: 'video', uploadedDate: '2 weeks ago', usedIn: 'Back to School' },
  { id: 'a10', name: 'style-guide.pdf', type: 'document', uploadedDate: '3 weeks ago' },
  { id: 'a11', name: 'cover-art.png', type: 'image', uploadedDate: 'Last month', usedIn: 'Athlete Profile' },
  { id: 'a12', name: 'raw-footage.mov', type: 'video', uploadedDate: 'Last month' },
];

const DRIVE_FILES = [
  { id: 'd1', name: 'brand-assets-folder', type: 'folder', size: '—', modified: '2 days ago' },
  { id: 'd2', name: 'marketing-video-4k.mp4', type: 'video', size: '852 MB', modified: '1 week ago' },
  { id: 'd3', name: 'product-photo-shoot', type: 'folder', size: '—', modified: '3 days ago' },
  { id: 'd4', name: 'campaign-deck-q3.pdf', type: 'document', size: '12.4 MB', modified: '5 hours ago' },
  { id: 'd5', name: 'testimonial-clip.mp4', type: 'video', size: '340 MB', modified: '1 day ago' },
  { id: 'd6', name: 'logo-collection', type: 'folder', size: '—', modified: '1 month ago' },
  { id: 'd7', name: 'voiceover-script.pdf', type: 'document', size: '2.1 MB', modified: '2 weeks ago' },
  { id: 'd8', name: 'behind-the-scenes.mov', type: 'video', size: '1.2 GB', modified: '4 days ago' },
];

const DROPBOX_FILES = [
  { id: 'b1', name: 'social-media-assets', type: 'folder', size: '—', modified: '1 week ago' },
  { id: 'b2', name: 'user-testimonial.mp4', type: 'video', size: '245 MB', modified: '3 hours ago' },
  { id: 'b3', name: 'launch-creatives', type: 'folder', size: '—', modified: '2 days ago' },
  { id: 'b4', name: 'editing-template.prproj', type: 'document', size: '56 MB', modified: '2 weeks ago' },
  { id: 'b5', name: 'raw-interview.mov', type: 'video', size: '2.4 GB', modified: '5 days ago' },
  { id: 'b6', name: 'product-lifestyle.jpg', type: 'image', size: '8.7 MB', modified: '1 day ago' },
  { id: 'b7', name: 'brand-voice-guide.pdf', type: 'document', size: '3.4 MB', modified: '1 month ago' },
  { id: 'b8', name: 'event-recording.mp4', type: 'video', size: '680 MB', modified: '4 days ago' },
];

const getAssetIcon = (type: ResourceType) => {
  switch (type) {
    case 'video': return Video;
    case 'document':
    case 'text': return FileText;
    case 'image': return ImageIcon;
    default: return FileText;
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'folder': return FolderOpen;
    case 'image': return ImageIcon;
    case 'document':
    default: return FileText;
  }
};

export function EnhancedResourcesView() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSource, setUploadSource] = useState<UploadSource>('device');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resources, setResources] = useState<Resource[]>([SAMPLE_RESOURCE]);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<Set<string>>(new Set());

  // Load resources from Supabase
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const serviceResources = await getResources();
      if (cancelled) return;
      const uiResources = serviceResources.map(r => mapServiceToUI(r));
      setResources(prev => {
        const sample = prev.find(r => r.serviceId === 'sample-resource') || SAMPLE_RESOURCE;
        return [sample, ...uiResources];
      });
    }
    load();
    return () => { cancelled = true; };
  }, []);
  const [selectedDropboxFiles, setSelectedDropboxFiles] = useState<Set<string>>(new Set());

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

  const toggleFileSelection = (fileId: string, source: 'google-drive' | 'dropbox') => {
    if (source === 'google-drive') {
      setSelectedDriveFiles((prev) => {
        const next = new Set(prev);
        if (next.has(fileId)) next.delete(fileId);
        else next.add(fileId);
        return next;
      });
    } else {
      setSelectedDropboxFiles((prev) => {
        const next = new Set(prev);
        if (next.has(fileId)) next.delete(fileId);
        else next.add(fileId);
        return next;
      });
    }
  };

  const handleUploadFromCloud = (source: 'google-drive' | 'dropbox') => {
    const selectedIds = source === 'google-drive' ? selectedDriveFiles : selectedDropboxFiles;
    const files = source === 'google-drive' ? DRIVE_FILES : DROPBOX_FILES;
    const selectedFiles = files.filter((f) => selectedIds.has(f.id));

    if (selectedFiles.length === 0) return;

    const newResources: Resource[] = selectedFiles.map((file) => ({
      id: `${source}-${file.id}-${Date.now()}`,
      name: file.name,
      type: (file.type === 'folder' ? 'document' : file.type) as ResourceType,
      size: file.size === '—' ? '—' : file.size,
      uploadedDate: 'Just now',
      postsCreated: 0,
      transcribed: file.type === 'video' ? false : true,
      tags: [source === 'google-drive' ? 'google-drive' : 'dropbox'],
    }));

    setResources((prev) => [...newResources, ...prev]);

    if (source === 'google-drive') {
      setSelectedDriveFiles(new Set());
    } else {
      setSelectedDropboxFiles(new Set());
    }
    setShowUploadModal(false);
  };

  if (selectedResource) {
    return <ResourceDetail resource={selectedResource} onBack={() => setSelectedResource(null)} />;
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
            <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              {t('resources.addResources')}
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
              {[                { value: 'all', label: t('resources.all') },
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
                  {resource.thumbnail ? (
                    <img src={resource.thumbnail} alt={resource.name} className="w-full h-full object-cover" />
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
                    <CardMenu resource={resource} />
                  </div>

                  <div className="flex flex-col" style={{ rowGap: '4px' }}>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('resources.size')}: {resource.size}</span>
                      <span>
                        {resource.duration ??
                          (resource.pageCount ? t('resources.pages', { count: resource.pageCount }) : '') ??
                          (resource.wordCount ? t('resources.words', { count: resource.wordCount }) : '') ??
                          resource.resolution ?? ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{t('resources.uploaded')} {resource.uploadedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="relative border-t border-[#ffffff14] bg-[#212121] group" style={{ height: '52px', padding: '11px 16px 12px' }}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {resource.posts?.slice(0, 4).map((post, index) => (
                        <div
                          key={index}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-[#1a1a1a] overflow-hidden"
                          style={{
                            marginLeft: index > 0 ? '-8px' : '0',
                          }}
                        >
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt={post.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#333333] flex items-center justify-center">
                              <span className="text-[8px]">{post.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {resource.posts && resource.posts.length > 4 && (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 border-2 border-[#1a1a1a] bg-primary ml-[-8px]">
                          +{resource.posts.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <span className={`text-xs font-medium ${resource.postsCreated && resource.postsCreated > 0 ? 'text-primary cursor-pointer hover:text-primary/80' : 'text-muted-foreground'}`}>
                        {resource.postsCreated && resource.postsCreated > 0
                          ? t('resources.postsCreated', { count: resource.postsCreated })
                          : t('resources.noContentCreated')}
                      </span>
                      {resource.posts && resource.posts.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" style={{ width: '246px' }}>
                          <div className="bg-[#262626] rounded-lg shadow-lg overflow-hidden" style={{ boxShadow: '0px 4px 12px 0px #00000033' }}>
                            <div className="px-3 py-2.5 space-y-[6px]">
                              {resource.posts.slice(0, 3).map((post, index) => (
                                <div key={index} className="text-xs text-white truncate">
                                  {post.name}
                                </div>
                              ))}
                              {resource.posts.length > 3 && (
                                <div className="text-xs text-[#999999] pt-1 border-t border-[#ffffff14] mt-[6px]">
                                  {t('resources.morePosts', { count: resource.posts.length - 3 })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#262626]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0d] w-full max-w-[900px] max-h-[90vh] rounded-2xl shadow-2xl border border-[#ffffff14] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 flex-shrink-0">
              <h2 className="text-[28px] font-bold text-white leading-tight">{t('resources.addResources')}</h2>
              <p className="text-sm text-[#a1a1aa] mt-2">{t('resources.uploadFiles')}</p>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Sidebar */}
              <div className="w-[200px] flex-shrink-0 border-r border-[#ffffff14] px-4 py-3 flex flex-col gap-1">
                {([                  { key: 'device' as UploadSource, icon: Upload, label: t('resources.uploadFromDevice') },
                  { key: 'google-drive' as UploadSource, icon: Cloud, label: t('resources.googleDrive') },
                  { key: 'dropbox' as UploadSource, icon: Archive, label: t('resources.dropbox') },
                ]).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setUploadSource(key)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors text-left ${
                      uploadSource === key
                        ? 'bg-[#4B56F2]/10 text-[#4B56F2] font-semibold'
                        : 'text-[#fafafa] font-medium hover:bg-[#ffffff0a]'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
                {uploadSource === 'device' && (
                  <>
                    {/* Upload Zone */}
                    <label className="border-2 border-dashed border-[#ffffff14] rounded-xl bg-[#0a0a0a33] h-[120px] flex flex-col items-center justify-center cursor-pointer hover:border-[#4B56F2]/40 transition-colors">
                      <input type="file" multiple className="hidden" />
                      <Cloud className="w-8 h-8 text-[#a1a1aa] mb-2" />
                      <p className="text-[#fafafa] text-sm font-semibold">{t('resources.clickOrDrag')}</p>
                    </label>

                    {/* Recent Assets */}
                    <div className="flex flex-col gap-4">
                      <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">{t('resources.recentAssets')}</p>
                      <div className="grid grid-cols-4 gap-3">
                        {RECENT_ASSETS.map((asset) => {
                          const AssetIcon = getAssetIcon(asset.type);
                          return (
                            <div
                              key={asset.id}
                              className="flex flex-col gap-2 border border-[#ffffff14] rounded-[10px] bg-[#1a1a1a] p-[9px]"
                            >
                              <div className="relative flex items-center justify-center rounded-md bg-[#0a0a0a] h-[72px] overflow-hidden">
                                <AssetIcon className="w-6 h-6 text-[#a1a1aa]" />
                                {asset.usedIn ? (
                                  <div className="absolute bottom-1.5 left-1.5 flex items-center border border-[#12B667]/40 rounded-[4px] bg-[#12B667]/20 px-1.5 py-0.5 max-w-[130px]">
                                    <span className="text-[9px] font-bold text-[#8FE6B5] whitespace-nowrap overflow-hidden text-ellipsis">
                                      {t('resources.usedIn', { name: asset.usedIn })}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="absolute bottom-1.5 left-1.5 flex items-center border border-[#ffffff14] rounded-[4px] bg-[#ffffff0a] px-1.5 py-0.5 w-[46px] h-[17px] justify-center">
                                    <span className="text-[9px] font-medium text-[#a1a1aa] opacity-60">{t('resources.unused')}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-[11px] font-semibold text-[#fafafa] truncate">{asset.name}</p>
                                <p className="text-[10px] text-[#a1a1aa]">{asset.uploadedDate}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {uploadSource === 'google-drive' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">{t('resources.googleDriveFiles')}</p>
                      {selectedDriveFiles.size > 0 && (
                        <span className="text-xs font-semibold text-[#12B667]">
                          {t('resources.selected', { count: selectedDriveFiles.size })}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DRIVE_FILES.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        const isSelected = selectedDriveFiles.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => toggleFileSelection(file.id, 'google-drive')}
                            className={`flex items-center gap-3 border rounded-lg p-3 transition-colors cursor-pointer text-left w-full ${
                              isSelected
                                ? 'border-[#4B56F2] bg-[#4B56F2]/10'
                                : 'border-[#ffffff14] bg-[#1a1a1a] hover:border-[#4B56F2]/40'
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#12B667] border-[#12B667]'
                                  : 'bg-transparent border-[#ffffff33]'
                              }`}
                            >
                              {isSelected && (
                                <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2 6l3 3 5-5" />
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0a0a0a] flex-shrink-0">
                              <FileIcon className="w-5 h-5 text-[#a1a1aa]" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#fafafa] truncate">{file.name}</p>
                              <p className="text-[10px] text-[#a1a1aa]">{file.size} · {file.modified}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {uploadSource === 'dropbox' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">{t('resources.dropboxFiles')}</p>
                      {selectedDropboxFiles.size > 0 && (
                        <span className="text-xs font-semibold text-[#12B667]">
                          {t('resources.selected', { count: selectedDropboxFiles.size })}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {DROPBOX_FILES.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        const isSelected = selectedDropboxFiles.has(file.id);
                        return (
                          <button
                            key={file.id}
                            onClick={() => toggleFileSelection(file.id, 'dropbox')}
                            className={`flex items-center gap-3 border rounded-lg p-3 transition-colors cursor-pointer text-left w-full ${
                              isSelected
                                ? 'border-[#4B56F2] bg-[#4B56F2]/10'
                                : 'border-[#ffffff14] bg-[#1a1a1a] hover:border-[#4B56F2]/40'
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded border flex-shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-[#12B667] border-[#12B667]'
                                  : 'bg-transparent border-[#ffffff33]'
                              }`}
                            >
                              {isSelected && (
                                <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2 6l3 3 5-5" />
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0a0a0a] flex-shrink-0">
                              <FileIcon className="w-5 h-5 text-[#a1a1aa]" />
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#fafafa] truncate">{file.name}</p>
                              <p className="text-[10px] text-[#a1a1aa]">{file.size} · {file.modified}</p>
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
            <div className="flex-shrink-0 flex items-center justify-between border-t border-[#ffffff14] bg-[#1a1a1a] px-8 py-5">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadSource('device');
                }}
                className="text-sm font-semibold text-[#a1a1aa] hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
              {uploadSource === 'device' ? (
                <label className="inline-flex items-center justify-center rounded-lg bg-[#4B56F2] px-6 py-2.5 text-sm font-bold text-white shadow-[0px_4px_12px_0px_#4B56F24d] cursor-pointer hover:opacity-90 transition-opacity">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const newResources: Resource[] = [];
                        for (const file of Array.from(files)) {
                          const created = await uploadResource(file);
                          if (created) {
                            newResources.push(mapServiceToUI(created));
                          }
                        }
                        if (newResources.length > 0) {
                          setResources((prev) => [...newResources, ...prev]);
                        }
                        setShowUploadModal(false);
                      }
                    }}
                  />
                  {t('resources.upload')}
                </label>
              ) : (
                <button
                  onClick={() => handleUploadFromCloud(uploadSource)}
                  disabled={(uploadSource === 'google-drive' ? selectedDriveFiles : selectedDropboxFiles).size === 0}
                  className={`inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-opacity ${
                    (uploadSource === 'google-drive' ? selectedDriveFiles : selectedDropboxFiles).size === 0
                      ? 'bg-[#4B56F2]/30 cursor-not-allowed'
                      : 'bg-[#4B56F2] shadow-[0px_4px_12px_0px_#4B56F24d] hover:opacity-90 cursor-pointer'
                  }`}
                >
                  {t('resources.upload')}{(uploadSource === 'google-drive' ? selectedDriveFiles : selectedDropboxFiles).size > 0 ? ` (${(uploadSource === 'google-drive' ? selectedDriveFiles : selectedDropboxFiles).size})` : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
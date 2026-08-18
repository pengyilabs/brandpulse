import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles, Video, FileText, Image as ImageIcon, Film, TrendingUp, LayoutGrid, Scissors, Wand2, Loader2, Inbox } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useUIStore } from '../../stores/ui-store';
import { getProjects, ProjectWithCounts } from '../../../lib/services/projects-service';
import { getAllUserContentItems, ContentItem } from '../../../lib/services/content-items-service';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getContentTypeIcon(type: string) {
  switch (type) {
    case 'short-video': return <Video className="w-3 h-3 text-blue-400" />;
    case 'wechat-article': return <FileText className="w-3 h-3 text-green-400" />;
    case 'carousel': return <LayoutGrid className="w-3 h-3 text-orange-400" />;
    case 'ai-video': return <Wand2 className="w-3 h-3 text-purple-400" />;
    default: return <FileText className="w-3 h-3 text-muted-foreground" />;
  }
}

function getAspectRatio(type: string): string {
  switch (type) {
    case 'short-video': return '9/16';
    case 'wechat-article': return '16/9';
    case 'carousel': return '1/1';
    case 'ai-video': return '16/9';
    default: return '16/9';
  }
}

export function EnhancedDashboard() {
  const { t } = useTranslation();
  const { openContentModal, openProjectModal } = useUIStore();
  const [activeFilter, setActiveFilter] = useState('all');

  // Real data state
  const [projects, setProjects] = useState<ProjectWithCounts[]>([]);
  const [contentItems, setContentItems] = useState<(ContentItem & { project_name?: string })[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const [projResult, contentResult] = await Promise.all([
        getProjects(),
        getAllUserContentItems(),
      ]);

      if (!cancelled) {
        setProjects(projResult);
        setProjectsLoading(false);
        setContentItems(contentResult);
        setContentLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Quick start options
  const quickStartOptions = [
    {
      id: 'wechat-article' as const,
      titleKey: 'dashboard.quickStart.longForm',
      descKey: 'dashboard.quickStart.longFormDesc',
      icon: FileText,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      isPrimary: true,
    },
    {
      id: 'short-video' as const,
      titleKey: 'dashboard.quickStart.shortClip',
      descKey: 'dashboard.quickStart.shortClipDesc',
      icon: Video,
      gradient: 'from-green-500/20 to-[#4B56F2]/20',
      borderColor: 'border-green-500/50',
      isPrimary: true,
    },
    {
      id: 'carousel' as const,
      titleKey: 'dashboard.quickStart.highlightReel',
      descKey: 'dashboard.quickStart.highlightReelDesc',
      icon: LayoutGrid,
      gradient: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/50',
      isPrimary: true,
    },
    {
      id: 'ai-video' as const,
      titleKey: 'dashboard.quickStart.aiVideo',
      descKey: 'dashboard.quickStart.aiVideoDesc',
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
      isPrimary: true,
    },
  ];

  // Filter items based on active filter
  const filteredContent = activeFilter === 'all'
    ? contentItems
    : contentItems.filter(item => item.content_type === activeFilter);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-background to-card/30">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">{t('dashboard.tagline')}</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              {t('dashboard.createPrompt')}
              <br />
              <span className="text-primary">{t('dashboard.createPromptHighlight')}</span> {t('dashboard.createPromptEnd')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Quick Start Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {quickStartOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => openContentModal(option.id)}
                  className={`relative group bg-gradient-to-br ${option.gradient} backdrop-blur-sm rounded-2xl p-6 border ${option.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20`}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="p-3 bg-card/80 rounded-xl border border-border/50">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-foreground font-semibold mb-1">{t(option.titleKey)}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t(option.descKey)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Recent Projects */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">{t('dashboard.recentProjects')}</h2>
              <p className="text-sm text-muted-foreground">{t('dashboard.recentProjectsDesc')}</p>
            </div>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dashboard.newProject')}</span>
            </button>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-card rounded-2xl border border-border mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first project to get started</p>
              <button
                onClick={() => openProjectModal()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>{t('dashboard.newProject')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Visual Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary/20 select-none">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Stats */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                        {project.content_items_count} {t('dashboard.items')}
                      </div>
                      <div className="px-2.5 py-1 bg-success/20 backdrop-blur-sm rounded-md text-xs text-success font-medium border border-success/30">
                        {t('dashboard.active')}
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 text-left">
                    <h3 className="font-semibold text-foreground mb-1 truncate">{project.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('dashboard.lastEdited')} {timeAgo(project.updated_at)}</span>
                      <span className="capitalize">{project.campaigns_count} campaign{project.campaigns_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Your Content Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">{t('dashboard.yourContent')}</h2>
              <p className="text-sm text-muted-foreground">{t('dashboard.yourContentDesc')}</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border">
              {['all', 'wechat-article', 'short-video', 'carousel', 'ai-video'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'all' ? t('dashboard.filterAll') : filter === 'wechat-article' ? t('dashboard.quickStart.longForm') : filter === 'short-video' ? t('dashboard.quickStart.shortClip') : filter === 'carousel' ? t('dashboard.quickStart.highlightReel') : t('dashboard.quickStart.aiVideo')}
                </button>
              ))}
            </div>
          </div>

          {contentLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-card rounded-2xl border border-border mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No content yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first piece of content using the options above</p>
            </div>
          ) : (
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 4, 900: 6 }}>
              <Masonry gutter="16px">
                {filteredContent.map((content) => {
                  const aspectRatio = getAspectRatio(content.content_type);
                  const hasGeneratedContent = !!content.generated_content_url;
                  return (
                    <div key={content.id} className="group cursor-pointer">
                      <div
                        className="bg-card rounded-xl overflow-hidden relative border border-border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
                        style={{ aspectRatio }}
                      >
                        {hasGeneratedContent ? (
                          <img
                            src={content.generated_content_url!}
                            alt={content.title || 'Content'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary flex items-center justify-center">
                            <div className="text-center">
                              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card/80 border border-border/50 mb-2">
                                {getContentTypeIcon(content.content_type)}
                              </div>
                              <p className="text-xs text-muted-foreground px-2 truncate max-w-[120px]">
                                {content.title || 'Untitled'}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <p className="text-sm text-white font-medium truncate mb-1">{content.title || 'Untitled'}</p>
                          <p className="text-xs text-white/70 truncate">{content.project_name}</p>
                        </div>

                        {/* Content Type Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                            {getContentTypeIcon(content.content_type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </div>
      </div>
    </div>
  );
}
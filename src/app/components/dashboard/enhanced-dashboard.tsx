import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles, Video, FileText, TrendingUp, LayoutGrid, Loader2, Inbox } from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { getProjects, ProjectWithCounts } from '../../../lib/services/projects-service';

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

export function EnhancedDashboard() {
  const { t } = useTranslation();
  const { openContentModal, openProjectModal } = useUIStore();

  // Real data state
  const [projects, setProjects] = useState<ProjectWithCounts[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const projResult = await getProjects();

      if (!cancelled) {
        setProjects(projResult);
        setProjectsLoading(false);
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
      </div>
    </div>
  );
}
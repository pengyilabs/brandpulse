import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Sparkles, Video, FileText, Image as ImageIcon, Film, TrendingUp, LayoutGrid, Scissors, Wand2 } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useUIStore } from '../../stores/ui-store';

export function EnhancedDashboard() {
  const { t } = useTranslation();
  const { openContentModal, openProjectModal } = useUIStore();
  const [activeFilter, setActiveFilter] = useState('all');

  // Recent projects with visual previews (Canva-style)
  const recentProjects = [
    {
      id: 1,
      name: 'Lumina Wellness Content',
      type: 'short-video',
      lastContent: '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbnxlbnwxfHx8fDE3Nzc0MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 24,
      lastEdited: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Valentine\'s Campaign',
      type: 'wechat-article',
      lastContent: '/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWxlbnRpbmUlMjBkYXklMjByb21hbnRpY3xlbnwxfHx8fDE3Nzc0MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 12,
      lastEdited: '1 day ago',
      status: 'active',
    },
    {
      id: 3,
      name: 'Product Launch Series',
      type: 'carousel',
      lastContent: '/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNofGVufDF8fHx8MTc3NzQwMDAwMHww&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 18,
      lastEdited: '3 days ago',
      status: 'active',
    },
  ];

  // Quick start options - what you can create
  const quickStartOptions = [
    {
      id: 'wechat-article',
      titleKey: 'dashboard.quickStart.longForm',
      descKey: 'dashboard.quickStart.longFormDesc',
      icon: FileText,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      isPrimary: true,
    },
    {
      id: 'short-video',
      titleKey: 'dashboard.quickStart.shortClip',
      descKey: 'dashboard.quickStart.shortClipDesc',
      icon: Video,
      gradient: 'from-green-500/20 to-[#4B56F2]/20',
      borderColor: 'border-green-500/50',
      isPrimary: true,
    },
    {
      id: 'carousel',
      titleKey: 'dashboard.quickStart.highlightReel',
      descKey: 'dashboard.quickStart.highlightReelDesc',
      icon: LayoutGrid,
      gradient: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/50',
      isPrimary: true,
    },
    {
      id: 'ai-video',
      titleKey: 'dashboard.quickStart.aiVideo',
      descKey: 'dashboard.quickStart.aiVideoDesc',
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
      isPrimary: true,
    },
  ];

  // Content gallery - masonry grid with different content types
  const recentContent = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    type: i % 4 === 0 ? 'short-video' : i % 4 === 1 ? 'wechat-article' : i % 4 === 2 ? 'carousel' : 'ai-video',
    thumbnail: [
      '/brand-tile-amber.svg?w=400',
      '/brand-tile-coral.svg?w=400',
      '/brand-tile-navy-cyan.svg?w=400',
      '/brand-tile-amber-rose.svg?w=400',
    ][i % 4],
    title: `Content ${i + 1}`,
    project: recentProjects[i % recentProjects.length].name,
    aspectRatio: i % 4 === 0 ? '9/16' : i % 4 === 1 ? '16/9' : i % 4 === 2 ? '1/1' : '16/9',
  }));

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
                  onClick={() => {
                    setSelectedContentType(option.id as 'wechat-article' | 'short-video' | 'carousel' | 'ai-video');
                    setIsContentModalOpen(true);
                  }}
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
        {/* Recent Projects - Visual Canva-style */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">{t('dashboard.recentProjects')}</h2>
              <p className="text-sm text-muted-foreground">{t('dashboard.recentProjectsDesc')}</p>
            </div>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dashboard.newProject')}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Visual Preview */}
                <div className="relative h-48 bg-secondary overflow-hidden">
                  <img
                    src={project.lastContent}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Floating Stats */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                      {project.contentCount} {t('dashboard.items')}
                    </div>
                    <div className="px-2.5 py-1 bg-success/20 backdrop-blur-sm rounded-md text-xs text-success font-medium border border-success/30">
                      {t('dashboard.active')}
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 text-left">{project.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t('dashboard.lastEdited')} {project.lastEdited}</span>
                    <span className="capitalize">{project.type}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
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

          {/* Masonry Grid */}
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 4, 900: 6 }}>
            <Masonry gutter="16px">
              {recentContent.map((content) => (
                <div key={content.id} className="group cursor-pointer">
                  <div
                    className="bg-card rounded-xl overflow-hidden relative border border-border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
                    style={{ aspectRatio: content.aspectRatio }}
                  >
                    <img
                      src={content.thumbnail}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <p className="text-sm text-white font-medium truncate mb-1">{content.title}</p>
                      <p className="text-xs text-white/70 truncate">{content.project}</p>
                    </div>

                    {/* Content Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md">
                        {content.type === 'short-video' && <Video className="w-3 h-3 text-blue-400" />}
                        {content.type === 'wechat-article' && <FileText className="w-3 h-3 text-green-400" />}
                        {content.type === 'carousel' && <LayoutGrid className="w-3 h-3 text-orange-400" />}
                        {content.type === 'ai-video' && <Wand2 className="w-3 h-3 text-purple-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </div>
  );
}

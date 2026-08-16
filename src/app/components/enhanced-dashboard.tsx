import { useState } from 'react';
import { Plus, Sparkles, Video, FileText, Image as ImageIcon, Film, TrendingUp } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface EnhancedDashboardProps {
  onCreateContent: (contentType: 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video') => void;
  onCreateProject: () => void;
}

export function EnhancedDashboard({ onCreateContent, onCreateProject }: EnhancedDashboardProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Recent projects with visual previews (Canva-style)
  const recentProjects = [
    {
      id: 1,
      name: 'Lumina Wellness Content',
      type: 'short-clip',
      lastContent: '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbnxlbnwxfHx8fDE3Nzc0MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 24,
      lastEdited: '2 hours ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Valentine\'s Campaign',
      type: 'long-form',
      lastContent: '/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWxlbnRpbmUlMjBkYXklMjByb21hbnRpY3xlbnwxfHx8fDE3Nzc0MDAwMDB8MA&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 12,
      lastEdited: '1 day ago',
      status: 'active',
    },
    {
      id: 3,
      name: 'Product Launch Series',
      type: 'highlight-reel',
      lastContent: '/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwbGF1bmNofGVufDF8fHx8MTc3NzQwMDAwMHww&ixlib=rb-4.1.0&q=80&w=400',
      contentCount: 18,
      lastEdited: '3 days ago',
      status: 'active',
    },
  ];

  // Quick start options - what you can create
  const quickStartOptions = [
    {
      id: 'long-form',
      title: 'Long Form',
      description: 'In-depth articles and editorial content',
      icon: FileText,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/50',
      isPrimary: true,
    },
    {
      id: 'short-clip',
      title: 'Short Clip',
      description: 'Extract clips from longer videos',
      icon: Video,
      gradient: 'from-green-500/20 to-[#4B56F2]/20',
      borderColor: 'border-green-500/50',
      isPrimary: true,
    },
    {
      id: 'highlight-reel',
      title: 'Highlight Reel',
      description: 'Curated compilation of key moments',
      icon: Film,
      gradient: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/50',
      isPrimary: true,
    },
    {
      id: 'ai-video',
      title: 'Text to AI Video',
      description: 'AI-generated video from text prompts',
      icon: TrendingUp,
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
      isPrimary: true,
    },
  ];

  // Content gallery - masonry grid with different content types
  const recentContent = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    type: i % 4 === 0 ? 'short-clip' : i % 4 === 1 ? 'long-form' : i % 4 === 2 ? 'highlight-reel' : 'ai-video',
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
              <span className="text-sm text-primary font-medium">Quality over quantity</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              What would you like to
              <br />
              <span className="text-primary">create</span> today?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategy-first content creation with AI. Designed for marketing directors who value quality.
            </p>
          </div>

          {/* Quick Start Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {quickStartOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => onCreateContent(option.id as 'long-form' | 'short-clip' | 'highlight-reel' | 'ai-video')}
                  className={`relative group bg-gradient-to-br ${option.gradient} backdrop-blur-sm rounded-2xl p-6 border ${option.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20`}
                >
                  <div className="flex flex-col items-start gap-3">
                    <div className="p-3 bg-card/80 rounded-xl border border-border/50">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-foreground font-semibold mb-1">{option.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
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
              <h2 className="text-2xl font-semibold text-foreground mb-1">Recent Projects</h2>
              <p className="text-sm text-muted-foreground">Jump back into your work or start fresh</p>
            </div>
            <button
              onClick={onCreateProject}
              className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-secondary border border-border rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
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
                      {project.contentCount} items
                    </div>
                    <div className="px-2.5 py-1 bg-success/20 backdrop-blur-sm rounded-md text-xs text-success font-medium border border-success/30">
                      Active
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 text-left">{project.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last edited {project.lastEdited}</span>
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
              <h2 className="text-2xl font-semibold text-foreground mb-1">Your Content</h2>
              <p className="text-sm text-muted-foreground">All the content you've created</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 bg-card rounded-lg border border-border">
              {['all', 'long-form', 'short-clip', 'highlight-reel', 'ai-video'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'long-form' ? 'Long Form' : filter === 'short-clip' ? 'Short Clip' : filter === 'highlight-reel' ? 'Highlight Reel' : 'AI Video'}
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
                        {content.type === 'short-clip' && <Video className="w-3 h-3 text-blue-400" />}
                        {content.type === 'long-form' && <FileText className="w-3 h-3 text-green-400" />}
                        {content.type === 'highlight-reel' && <Film className="w-3 h-3 text-orange-400" />}
                        {content.type === 'ai-video' && <TrendingUp className="w-3 h-3 text-purple-400" />}
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

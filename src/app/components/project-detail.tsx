import { ArrowLeft, Play, FileText, Video, Film, Check, Edit2, Trash2, Palette, Type } from 'lucide-react';

interface ProjectDetailProps {
  project: any;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const projectSettings = {
    tone: 'Professional & Friendly',
    articles: 12,
    fonts: ['Noto Sans SC', 'Noto Sans'],
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#4B56F2',
    brandGuidelines: 'Modern, approachable brand voice with focus on wellness and mindfulness',
    promptText: 'Create engaging content that resonates with yoga practitioners and wellness enthusiasts',
  };

  const videoPlaceholders = [
    '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-amber.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-coral.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const blogContent = `# The Future of Content Creation

In today's digital landscape, creating engaging content has never been more important. This comprehensive guide explores the latest trends and best practices for content creators looking to make an impact.

## Key Takeaways

- Content quality matters more than quantity
- Authenticity resonates with audiences
- Consistency builds trust and engagement

Our video analysis revealed several compelling insights about modern content strategies that can help you grow your audience and increase engagement across all platforms.`;

  const hasBlog = project.type === 'blog' || Math.random() > 0.3;
  const hasShortVideos = project.type === 'video' || Math.random() > 0.5;
  const hasHighlightReel = project.type === 'video' || Math.random() > 0.4;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>

        <div className="mb-8">
          <h1 className="text-foreground mb-6">{project.name}</h1>

          {/* Project Settings Summary */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-card rounded-lg border border-border">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Project Settings</h3>
                  <p className="text-sm text-muted-foreground">{project.folder} • Created {project.created}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                  project.state === 'completed'
                    ? 'bg-success/20 border-success/30'
                    : 'bg-yellow-500/20 border-yellow-500/30'
                }`}>
                  <Check className="w-3 h-3 text-success" />
                  <span className={`text-xs font-medium capitalize ${
                    project.state === 'completed' ? 'text-success' : 'text-yellow-400'
                  }`}>
                    {project.state}
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit Settings
                </button>
              </div>
            </div>

            {/* Settings Details - Horizontal Layout */}
            <div className="p-6">
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Tone</p>
                  <p className="text-foreground font-medium">{projectSettings.tone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Articles</p>
                  <p className="text-foreground font-medium">{projectSettings.articles} articles</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Fonts</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {projectSettings.fonts.map((font, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-secondary rounded text-sm text-foreground">
                        {font}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Colors</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: projectSettings.primaryColor }} title="Primary"></div>
                    <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: projectSettings.secondaryColor }} title="Secondary"></div>
                    <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: projectSettings.accentColor }} title="Accent"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Brand Guidelines</p>
                  <p className="text-foreground text-sm leading-relaxed">{projectSettings.brandGuidelines}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Prompt Text</p>
                  <p className="text-foreground text-sm leading-relaxed">{projectSettings.promptText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Generated Content</h2>
          <p className="text-muted-foreground">All content created for this project</p>
        </div>

        <div className="space-y-6">
          {hasBlog && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2>Blog Post</h2>
                  <p className="text-sm text-muted-foreground">5 min read</p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-muted-foreground whitespace-pre-wrap">{blogContent}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  View Full Post
                </button>
                <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          )}

          {hasShortVideos && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2>Short Videos</h2>
                  <p className="text-sm text-muted-foreground">{project.items} clips</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: Math.min(project.items, 10) }).map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[9/16] bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src={videoPlaceholders[index % videoPlaceholders.length]}
                        alt={`Short video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                        30s
                      </div>
                      <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play className="w-12 h-12 text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">Clip {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasHighlightReel && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Film className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2>Highlight Reel</h2>
                  <p className="text-sm text-muted-foreground">10 minutes</p>
                </div>
              </div>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                <img
                  src="/brand-tile-navy-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB0aW1lbGluZSUyMGhpZ2hsaWdodCUyMHJlZWx8ZW58MXx8fHwxNzc3Mzk3ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Highlight reel"
                  className="w-full h-full object-cover"
                />
                <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded">
                  10:00
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                  Download
                </button>
                <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

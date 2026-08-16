import { Video, FileText, Image, Sparkles } from 'lucide-react';

interface DashboardProps {
  onCreateContent: () => void;
}

export function Dashboard({ onCreateContent }: DashboardProps) {
  const categories = [
    {
      title: 'From Video',
      description: 'Transform long-form videos into marketing content',
      icon: Video,
      featured: true,
    },
    {
      title: 'Blog Post Generator',
      description: 'Create engaging blog posts from scratch',
      icon: FileText,
      featured: false,
    },
    {
      title: 'Image Content',
      description: 'Generate social media posts from images',
      icon: Image,
      featured: false,
    },
    {
      title: 'AI Templates',
      description: 'Pre-built templates for quick content creation',
      icon: Sparkles,
      featured: false,
    },
    {
      title: 'Social Media Pack',
      description: 'Complete social media content suite',
      icon: Sparkles,
      featured: false,
    },
    {
      title: 'Email Campaign',
      description: 'Email marketing content generator',
      icon: FileText,
      featured: false,
    },
    {
      title: 'YouTube Optimizer',
      description: 'Optimize videos for YouTube',
      icon: Video,
      featured: false,
    },
    {
      title: 'Podcast Clips',
      description: 'Create shareable podcast moments',
      icon: Video,
      featured: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Templates</h1>
          <p className="text-muted-foreground">Choose from our pre-built content creation workflows</p>
        </div>

        <div className="mb-6">
          <h2 className="mb-4">All Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.title}
                  onClick={category.featured ? onCreateContent : undefined}
                  className={`p-6 bg-card rounded-lg border transition-all hover:scale-105 hover:shadow-xl text-left ${
                    category.featured
                      ? 'border-border hover:border-muted-foreground'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-secondary">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-card-foreground mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Grid, Image as ImageIcon, FileText, Video } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  contentType: string;
  description: string;
  previewUrl: string;
}

export function TemplateManagementPanel() {
  const [templates] = useState<Template[]>([
    {
      id: 1,
      name: 'Bold Announcement',
      contentType: 'Images & Carousels',
      description: 'Eye-catching design with bold typography',
      previewUrl: 'https://via.placeholder.com/200x200/10B981/ffffff?text=Bold',
    },
    {
      id: 2,
      name: 'Minimalist Quote',
      contentType: 'Quote Cards',
      description: 'Clean, minimal design with elegant fonts',
      previewUrl: 'https://via.placeholder.com/200x200/3B82F6/ffffff?text=Minimal',
    },
    {
      id: 3,
      name: 'Modern Blog',
      contentType: 'Long-Form Written Content (Blog Posts)',
      description: 'Professional blog post layout with featured images',
      previewUrl: 'https://via.placeholder.com/200x200/F59E0B/ffffff?text=Blog',
    },
    {
      id: 4,
      name: 'Dynamic Short',
      contentType: 'Clips/Shorts',
      description: 'Fast-paced video template with captions',
      previewUrl: 'https://via.placeholder.com/200x200/8B5CF6/ffffff?text=Short',
    },
    {
      id: 5,
      name: 'Colorful Carousel',
      contentType: 'Images & Carousels',
      description: 'Vibrant multi-slide carousel template',
      previewUrl: 'https://via.placeholder.com/200x200/EC4899/ffffff?text=Carousel',
    },
  ]);

  const [selectedContentType, setSelectedContentType] = useState<string>('all');

  const contentTypes = [
    'all',
    'Clips/Shorts',
    'AI Text-to-Voice Videos',
    'Images & Carousels',
    'Long-Form Written Content (Blog Posts)',
    'Quote Cards',
  ];

  const filteredTemplates = selectedContentType === 'all'
    ? templates
    : templates.filter(t => t.contentType === selectedContentType);

  const getContentIcon = (contentType: string) => {
    if (contentType.includes('Video') || contentType.includes('Clips')) return Video;
    if (contentType.includes('Image') || contentType.includes('Quote')) return ImageIcon;
    if (contentType.includes('Blog') || contentType.includes('Written')) return FileText;
    return Grid;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Templates</h2>
            <p className="text-sm text-muted-foreground">
              Manage content templates for all campaigns
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>

        <div className="mb-6">
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg text-foreground"
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Content Types' : type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const ContentIcon = getContentIcon(template.contentType);
            return (
              <div
                key={template.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <div className="aspect-video bg-secondary/30 relative overflow-hidden">
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-card/90 rounded-lg backdrop-blur-sm">
                    <ContentIcon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {template.contentType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Grid className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No templates found for this content type
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

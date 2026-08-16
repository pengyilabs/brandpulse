import { useState } from 'react';
import { AssetManager } from './asset-manager';
import { FileText, Image as ImageIcon, Layout, Video } from 'lucide-react';

interface Asset {
  id: string;
  source: 'upload' | 'ai-generated' | 'template';
  url: string;
  type: 'image' | 'video' | 'document' | 'audio';
  metadata?: any;
}

export function AssetManagerDemo() {
  const [socialAsset, setSocialAsset] = useState<Asset | null>(null);
  const [blogAsset, setBlogAsset] = useState<Asset | null>(null);
  const [carouselAsset, setCarouselAsset] = useState<Asset | null>(null);

  const sampleContentText = "Transform your wellness journey with these simple yet powerful breathing techniques. Perfect for reducing workplace stress and improving focus throughout your day.";

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Asset Manager Demo</h1>
          <p className="text-sm text-muted-foreground">
            Upload, generate, or use templates to add visual assets to your content
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Upload</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drag & drop files, support for images, videos, documents, and audio. Multi-file support for carousels.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-lg">✨</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">AI Generate</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe what you want and AI generates custom images. Perfect for unique visuals.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Layout className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Templates</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose from pre-designed templates organized by format (Instagram, blog, etc.).
            </p>
          </div>
        </div>

        {/* Demo Sections */}
        <div className="space-y-8">
          {/* Social Post */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Social Post</h2>
                <p className="text-sm text-muted-foreground">Single image with text overlay</p>
              </div>
            </div>
            <AssetManager
              contentType="social-post"
              currentAsset={socialAsset}
              onAssetChange={setSocialAsset}
              contentText={sampleContentText}
            />
          </div>

          {/* Blog Post */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Blog Post</h2>
                <p className="text-sm text-muted-foreground">Featured image for article header</p>
              </div>
            </div>
            <AssetManager
              contentType="blog-post"
              currentAsset={blogAsset}
              onAssetChange={setBlogAsset}
              contentText={sampleContentText}
            />
          </div>

          {/* Carousel */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Layout className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Carousel Post</h2>
                <p className="text-sm text-muted-foreground">Multiple images with drag-to-reorder</p>
              </div>
            </div>
            <AssetManager
              contentType="carousel"
              currentAsset={carouselAsset}
              onAssetChange={setCarouselAsset}
              contentText={sampleContentText}
            />
          </div>
        </div>

        {/* Current State */}
        <div className="mt-8 bg-secondary/30 border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Current State</h3>
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <p className="text-muted-foreground mb-2">Social Post:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {socialAsset ? JSON.stringify({
                  source: socialAsset.source,
                  type: socialAsset.type,
                  hasUrl: !!socialAsset.url,
                }, null, 2) : 'null'}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Blog Post:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {blogAsset ? JSON.stringify({
                  source: blogAsset.source,
                  type: blogAsset.type,
                  hasUrl: !!blogAsset.url,
                }, null, 2) : 'null'}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">Carousel:</p>
              <pre className="text-foreground whitespace-pre-wrap">
                {carouselAsset ? JSON.stringify({
                  source: carouselAsset.source,
                  type: carouselAsset.type,
                  hasUrl: !!carouselAsset.url,
                }, null, 2) : 'null'}
              </pre>
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">How to Use</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <p>
                <span className="text-foreground font-medium">Upload:</span> Drag files into the upload zone or click to browse. Supports multiple files for carousels.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <p>
                <span className="text-foreground font-medium">Generate with AI:</span> Click the AI option, describe your image, and generate custom visuals.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <p>
                <span className="text-foreground font-medium">Use Template:</span> Choose from pre-designed templates filtered by format (Instagram, blog, etc.).
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <p>
                <span className="text-foreground font-medium">Preview:</span> See how your content will look with the asset before publishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

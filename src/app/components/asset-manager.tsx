import { useState, useRef } from 'react';
import {
  Upload, Sparkles, Grid, Image as ImageIcon, Video, FileText, Music,
  X, GripVertical, Loader2, ChevronRight, CheckCircle2, AlertCircle, Wand2, RotateCcw
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type AssetSource = 'upload' | 'ai-generated' | 'template';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  file?: File;
}

interface Template {
  id: string;
  name: string;
  category: 'instagram-square' | 'instagram-story' | 'blog-header' | 'twitter' | 'linkedin';
  thumbnail: string;
  width: number;
  height: number;
}

interface Asset {
  id: string;
  source: AssetSource;
  url: string;
  type: 'image' | 'video' | 'document' | 'audio';
  metadata?: {
    prompt?: string;
    templateId?: string;
    files?: UploadedFile[];
  };
}

export interface AssetManagerProps {
  contentType: 'blog-post' | 'social-post' | 'carousel' | 'video-script';
  currentAsset: Asset | null;
  onAssetChange: (asset: Asset | null) => void;
  contentText?: string; // For preview
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Minimal Quote',
    category: 'instagram-square',
    thumbnail: '/brand-tile-navy.svg?w=400&h=400&fit=crop',
    width: 1080,
    height: 1080,
  },
  {
    id: '2',
    name: 'Bold Statement',
    category: 'instagram-square',
    thumbnail: '/brand-tile-violet.svg?w=400&h=400&fit=crop',
    width: 1080,
    height: 1080,
  },
  {
    id: '3',
    name: 'Gradient Story',
    category: 'instagram-story',
    thumbnail: '/brand-tile-cyan.svg?w=400&h=711&fit=crop',
    width: 1080,
    height: 1920,
  },
  {
    id: '4',
    name: 'Blog Header',
    category: 'blog-header',
    thumbnail: '/brand-tile-amber.svg?w=800&h=400&fit=crop',
    width: 1200,
    height: 630,
  },
];

const TEMPLATE_CATEGORIES = [
  { id: 'instagram-square', label: 'Instagram Square', size: '1080×1080' },
  { id: 'instagram-story', label: 'Instagram Story', size: '1080×1920' },
  { id: 'blog-header', label: 'Blog Header', size: '1200×630' },
  { id: 'twitter', label: 'Twitter Post', size: '1200×675' },
  { id: 'linkedin', label: 'LinkedIn Post', size: '1200×627' },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('video/')) return Video;
  if (type.startsWith('audio/')) return Music;
  return FileText;
};

const getFileTypeLabel = (type: string): string => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Audio';
  return 'Document';
};

// ─── AI Generation Modal ──────────────────────────────────────────────────────

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, resultUrl: string) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  isRegenerating: boolean;
}

function AIGenerationModal({ isOpen, onClose, onGenerate }: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation for 6 images
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated images with variety
    const mockImages: GeneratedImage[] = [
      { id: '1', url: `/brand-tile-coral.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
      { id: '2', url: `/brand-tile-navy-cyan.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
      { id: '3', url: `/brand-tile-amber-rose.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
      { id: '4', url: `/brand-tile-navy.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
      { id: '5', url: `/brand-tile-violet.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
      { id: '6', url: `/brand-tile-cyan.svg?w=400&h=400&fit=crop&q=${Date.now()}`, isRegenerating: false },
    ];
    setGeneratedImages(mockImages);
    setIsGenerating(false);
  };

  const handleRegenerateImage = async (imageId: string) => {
    // Set this specific image as regenerating
    setGeneratedImages(images =>
      images.map(img =>
        img.id === imageId ? { ...img, isRegenerating: true } : img
      )
    );

    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate new URL for this specific image
    const newUrl = `/brand-tile-${Math.random() > 0.5 ? 'navy' : 'violet'}.svg?w=400&h=400&fit=crop&q=${Date.now()}`;

    setGeneratedImages(images =>
      images.map(img =>
        img.id === imageId ? { ...img, url: newUrl, isRegenerating: false } : img
      )
    );
  };

  const handleUseGenerated = () => {
    const selectedImage = generatedImages.find(img => img.id === selectedImageId);
    if (selectedImage) {
      onGenerate(prompt, selectedImage.url);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedImages([]);
    setSelectedImageId(null);
    setIsGenerating(false);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-foreground">
                    Generate with AI
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground">
                    Describe the image you want to create
                  </Dialog.Description>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A photo of a woman doing yoga on a beach at sunset, professional photography, soft lighting"
                rows={4}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Generate Button */}
            {generatedImages.length === 0 && (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating 6 variations...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Images
                  </>
                )}
              </button>
            )}

            {/* Generated Results Grid */}
            {generatedImages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-foreground font-medium">6 variations generated! Select one to use.</span>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {generatedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative"
                    >
                      <button
                        onClick={() => setSelectedImageId(image.id)}
                        className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageId === image.id
                            ? 'border-primary ring-2 ring-primary/30'
                            : 'border-border hover:border-primary/50'
                        }`}
                        disabled={image.isRegenerating}
                      >
                        <img
                          src={image.url}
                          alt={`Generated variation ${image.id}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Regenerating Overlay */}
                        {image.isRegenerating && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {selectedImageId === image.id && !image.isRegenerating && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </button>

                      {/* Individual Regenerate Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateImage(image.id);
                        }}
                        disabled={image.isRegenerating}
                        className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Regenerate this image"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 text-white ${image.isRegenerating ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setGeneratedImages([]);
                      setSelectedImageId(null);
                      setPrompt('');
                    }}
                    className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                  >
                    Generate New Set
                  </button>
                  <button
                    onClick={handleUseGenerated}
                    disabled={!selectedImageId}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Use Selected Image
                  </button>
                </div>
              </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                <span className="font-semibold">Note:</span> Be specific in your description. Include details about
                style, lighting, composition, and mood for best results.
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Template Gallery Modal ───────────────────────────────────────────────────

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

function TemplateGalleryModal({ isOpen, onClose, onSelectTemplate }: TemplateGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = selectedCategory
    ? MOCK_TEMPLATES.filter(t => t.category === selectedCategory)
    : MOCK_TEMPLATES;

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl w-full max-w-4xl z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Grid className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-foreground">
                    Use Template
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground">
                    Choose a template to customize with your content
                  </Dialog.Description>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  All Templates
                </button>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    {cat.label}
                    <span className="ml-1.5 text-xs opacity-70">({cat.size})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group relative bg-secondary/30 hover:bg-secondary/50 border border-border hover:border-primary/50 rounded-lg overflow-hidden transition-all"
                >
                  <div className="aspect-square bg-secondary relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-semibold text-white">{template.name}</p>
                      <p className="text-xs text-white/80">{template.width}×{template.height}</p>
                    </div>
                  </div>
                  <div className="p-3 text-left">
                    <p className="text-sm font-medium text-foreground">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {TEMPLATE_CATEGORIES.find(c => c.id === template.category)?.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Grid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No templates found in this category
                </p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AssetManager({
  contentType,
  currentAsset,
  onAssetChange,
  contentText = 'Sample content text goes here...',
}: AssetManagerProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportsMultiple = contentType === 'carousel';

  // ─── Upload Handling ──────────────────────────────────────────────────────────

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file,
      };

      newFiles.push(uploadedFile);
    }

    if (supportsMultiple) {
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } else {
      setUploadedFiles(newFiles.slice(0, 1));
      if (newFiles.length > 0) {
        const file = newFiles[0];
        const asset: Asset = {
          id: file.id,
          source: 'upload',
          url: file.url,
          type: file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          metadata: { files: [file] },
        };
        onAssetChange(asset);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(files => files.filter(f => f.id !== id));
    if (uploadedFiles.length <= 1) {
      onAssetChange(null);
    }
  };

  // ─── AI Generation Handling ───────────────────────────────────────────────────

  const handleAIGenerate = (prompt: string, url: string) => {
    const asset: Asset = {
      id: Date.now().toString(),
      source: 'ai-generated',
      url,
      type: 'image',
      metadata: { prompt },
    };
    onAssetChange(asset);
    setUploadedFiles([]);
  };

  // ─── Template Handling ────────────────────────────────────────────────────────

  const handleTemplateSelect = (template: Template) => {
    const asset: Asset = {
      id: template.id,
      source: 'template',
      url: template.thumbnail,
      type: 'image',
      metadata: { templateId: template.id },
    };
    onAssetChange(asset);
    setUploadedFiles([]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const hasAsset = currentAsset !== null || uploadedFiles.length > 0;

  return (
    <div className="space-y-6">
      {/* Asset Options */}
      {!hasAsset && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Add Visual Asset</h3>

          <div className="grid grid-cols-3 gap-4">
            {/* Option 1: Upload */}
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/50 hover:bg-secondary/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  multiple={supportsMultiple}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Upload</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Image, video, document, or audio file
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Supports JPG, PNG, WebP, MP4, PDF, MP3. Max 10MB per file.
              </p>
            </div>

            {/* Option 2: Generate with AI */}
            <div>
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="w-full border-2 border-dashed border-border hover:border-border/50 hover:bg-secondary/30 rounded-xl p-6 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Generate with AI</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Describe what you want to create
                  </p>
                </div>
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                AI-powered image generation from text description.
              </p>
            </div>

            {/* Option 3: Use Template */}
            <div>
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="w-full border-2 border-dashed border-border hover:border-border/50 hover:bg-secondary/30 rounded-xl p-6 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Grid className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Use Template</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose from saved templates
                  </p>
                </div>
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                Pre-designed templates ready to customize.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files (Multiple) */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <button
              onClick={() => {
                setUploadedFiles([]);
                onAssetChange(null);
              }}
              className="text-xs text-destructive hover:text-destructive/80 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {uploadedFiles.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="relative flex-shrink-0 w-32 h-32 bg-secondary/30 border border-border rounded-lg overflow-hidden group"
                >
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-3">
                      <Icon className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-foreground font-medium text-center line-clamp-2">
                        {file.name}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
                    >
                      <X className="w-4 h-4 text-destructive-foreground" />
                    </button>
                  </div>
                  {supportsMultiple && (
                    <div className="absolute top-2 left-2 p-1 bg-black/50 rounded cursor-move">
                      <GripVertical className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                    <p className="text-[10px] text-white font-medium truncate">
                      {getFileTypeLabel(file.type)} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Asset Display */}
      {currentAsset && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Current Asset</h3>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                {currentAsset.source === 'upload' && 'Uploaded'}
                {currentAsset.source === 'ai-generated' && 'AI Generated'}
                {currentAsset.source === 'template' && 'Template'}
              </span>
              <button
                onClick={() => onAssetChange(null)}
                className="text-xs text-destructive hover:text-destructive/80 font-medium"
              >
                Remove
              </button>
            </div>
          </div>

          {currentAsset.source === 'ai-generated' && currentAsset.metadata?.prompt && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-400">
                <span className="font-semibold">Prompt:</span> {currentAsset.metadata.prompt}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {hasAsset && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Preview</h3>
          <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border rounded-xl p-6">
            <div className="max-w-lg mx-auto">
              {/* Social Post Preview */}
              {contentType === 'social-post' && (
                <div className="bg-card rounded-lg overflow-hidden border border-border">
                  {currentAsset && (
                    <div className="aspect-square bg-secondary relative">
                      <img
                        src={currentAsset.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {contentText}
                    </p>
                  </div>
                </div>
              )}

              {/* Blog Post Preview */}
              {contentType === 'blog-post' && currentAsset && (
                <div className="bg-card rounded-lg overflow-hidden border border-border">
                  <div className="aspect-video bg-secondary relative">
                    <img
                      src={currentAsset.url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Article Title Goes Here
                    </h3>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {contentText}
                    </p>
                  </div>
                </div>
              )}

              {/* Carousel Preview */}
              {contentType === 'carousel' && uploadedFiles.length > 0 && (
                <div className="bg-card rounded-lg overflow-hidden border border-border">
                  <div className="aspect-square bg-secondary relative">
                    <img
                      src={uploadedFiles[0].url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 rounded text-white text-xs font-medium">
                      1 / {uploadedFiles.length}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {contentText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AIGenerationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
      />

      <TemplateGalleryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}

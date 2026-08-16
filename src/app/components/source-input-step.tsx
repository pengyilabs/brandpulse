import { useState } from 'react';
import { Upload, Link as LinkIcon, File, Image as ImageIcon, Video, Music, FileText, X, Check, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface Asset {
  id: number;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
}

interface SourceInputStepProps {
  onComplete: (data: {
    mainContent?: File | string;
    libraryAssets: number[];
    additionalResources: Array<File | string>;
  }) => void;
  onBack?: () => void;
}

// Mock library assets - in production, this would come from props or API
const LIBRARY_ASSETS: Asset[] = [
  { id: 1, name: 'Brand Logo.png', type: 'image', url: '', thumbnail: '' },
  { id: 2, name: 'Product Demo.mp4', type: 'video', url: '' },
  { id: 3, name: 'Podcast Episode 12.mp3', type: 'audio', url: '' },
  { id: 4, name: 'Brand Guidelines.pdf', type: 'document', url: '' },
  { id: 5, name: 'Team Photo.jpg', type: 'image', url: '' },
  { id: 6, name: 'Interview Recording.mp3', type: 'audio', url: '' },
  { id: 7, name: 'Product Sheet.pdf', type: 'document', url: '' },
  { id: 8, name: 'Behind the Scenes.mp4', type: 'video', url: '' },
];

export function SourceInputStep({ onComplete, onBack }: SourceInputStepProps) {
  const [mainContentFile, setMainContentFile] = useState<File | null>(null);
  const [mainContentUrl, setMainContentUrl] = useState('');
  const [mainContentSkipped, setMainContentSkipped] = useState(false);
  const [selectedLibraryAssets, setSelectedLibraryAssets] = useState<Set<number>>(new Set());
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);
  const [newLinkInput, setNewLinkInput] = useState('');
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingAdditional, setIsDraggingAdditional] = useState(false);

  const handleMainFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMain(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setMainContentFile(file);
      setMainContentUrl('');
      setMainContentSkipped(false);
    }
  };

  const handleMainFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainContentFile(file);
      setMainContentUrl('');
      setMainContentSkipped(false);
    }
  };

  const handleSkipMainContent = () => {
    setMainContentFile(null);
    setMainContentUrl('');
    setMainContentSkipped(true);
  };

  const toggleLibraryAsset = (assetId: number) => {
    const newSet = new Set(selectedLibraryAssets);
    if (newSet.has(assetId)) {
      newSet.delete(assetId);
    } else {
      newSet.add(assetId);
    }
    setSelectedLibraryAssets(newSet);
  };

  const handleAdditionalFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAdditional(false);
    const files = Array.from(e.dataTransfer.files);
    setAdditionalFiles([...additionalFiles, ...files]);
  };

  const handleAdditionalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalFiles([...additionalFiles, ...files]);
  };

  const addLink = () => {
    if (newLinkInput.trim()) {
      setAdditionalLinks([...additionalLinks, newLinkInput.trim()]);
      setNewLinkInput('');
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(additionalFiles.filter((_, i) => i !== index));
  };

  const removeAdditionalLink = (index: number) => {
    setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    onComplete({
      mainContent: mainContentFile || mainContentUrl || undefined,
      libraryAssets: Array.from(selectedLibraryAssets),
      additionalResources: [...additionalFiles, ...additionalLinks],
    });
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'document':
        return FileText;
    }
  };

  const mainContentDisplay = mainContentFile?.name || mainContentUrl || (mainContentSkipped ? 'Skipped' : 'None');
  const totalAdditionalResources = additionalFiles.length + additionalLinks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground">Source Material</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Upload or link the source content for AI to work with
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Section A — Main Content */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Main Content</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload or link the primary source for this piece (e.g., video, article, podcast)
              </p>
            </div>
            {!mainContentSkipped && !mainContentFile && !mainContentUrl && (
              <button
                onClick={handleSkipMainContent}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          {mainContentFile || mainContentUrl || mainContentSkipped ? (
            <div className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mainContentFile && <File className="w-5 h-5 text-primary" />}
                  {mainContentUrl && <LinkIcon className="w-5 h-5 text-primary" />}
                  {mainContentSkipped && <span className="text-sm text-muted-foreground">No main content</span>}
                  {!mainContentSkipped && (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {mainContentFile?.name || mainContentUrl}
                      </p>
                      {mainContentFile && (
                        <p className="text-xs text-muted-foreground">
                          {(mainContentFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setMainContentFile(null);
                    setMainContentUrl('');
                    setMainContentSkipped(false);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingMain(true);
                }}
                onDragLeave={() => setIsDraggingMain(false)}
                onDrop={handleMainFileDrop}
                className={clsx(
                  "relative border-2 border-dashed rounded-lg p-8 transition-colors",
                  isDraggingMain
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                )}
              >
                <input
                  type="file"
                  onChange={handleMainFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="*/*"
                />
                <div className="flex flex-col items-center text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports all file types
                  </p>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={mainContentUrl}
                    onChange={(e) => {
                      setMainContentUrl(e.target.value);
                      if (e.target.value) {
                        setMainContentFile(null);
                        setMainContentSkipped(false);
                      }
                    }}
                    placeholder="Or paste a URL (YouTube, article, etc.)"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section B — Library Assets */}
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">From Your Project Library</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select existing assets to include
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {LIBRARY_ASSETS.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              const isSelected = selectedLibraryAssets.has(asset.id);

              return (
                <button
                  key={asset.id}
                  onClick={() => toggleLibraryAsset(asset.id)}
                  className={clsx(
                    "relative p-3 border rounded-lg transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  )}
                >
                  {/* Checkbox */}
                  <div
                    className={clsx(
                      "absolute top-2 right-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border bg-background"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {/* Icon/Thumbnail */}
                  <div className="w-full aspect-square bg-accent rounded-md flex items-center justify-center mb-2">
                    <Icon className="w-8 h-8 text-muted-foreground" />
                  </div>

                  {/* File Name */}
                  <p className="text-xs font-medium text-foreground truncate pr-6">
                    {asset.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section C — Additional Resources */}
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Additional Resources</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload or link anything else relevant to this piece
            </p>
          </div>

          <div className="space-y-3">
            {/* Add Link Input */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  value={newLinkInput}
                  onChange={(e) => setNewLinkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                  placeholder="Add a link"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={addLink}
                disabled={!newLinkInput.trim()}
                className="px-3 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingAdditional(true);
              }}
              onDragLeave={() => setIsDraggingAdditional(false)}
              onDrop={handleAdditionalFileDrop}
              className={clsx(
                "relative border-2 border-dashed rounded-lg p-6 transition-colors",
                isDraggingAdditional
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <input
                type="file"
                onChange={handleAdditionalFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
                multiple
                accept="*/*"
              />
              <div className="flex flex-col items-center text-center">
                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-xs font-medium text-foreground mb-1">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Multiple files supported
                </p>
              </div>
            </div>

            {/* List of Added Resources */}
            {(additionalFiles.length > 0 || additionalLinks.length > 0) && (
              <div className="space-y-2">
                {additionalFiles.map((file, index) => (
                  <div
                    key={`file-${index}`}
                    className="flex items-center justify-between p-2 border border-border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAdditionalFile(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {additionalLinks.map((link, index) => (
                  <div
                    key={`link-${index}`}
                    className="flex items-center justify-between p-2 border border-border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs font-medium text-foreground truncate">{link}</p>
                    </div>
                    <button
                      onClick={() => removeAdditionalLink(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary & Footer */}
      <div className="border-t border-border flex-shrink-0">
        {/* Summary */}
        <div className="px-6 py-3 bg-accent/30 border-b border-border">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-muted-foreground">Main Content: </span>
              <span className="font-semibold text-foreground">{mainContentDisplay}</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Library Assets: </span>
              <span className="font-semibold text-foreground">{selectedLibraryAssets.size} selected</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Additional Resources: </span>
              <span className="font-semibold text-foreground">{totalAdditionalResources} {totalAdditionalResources === 1 ? 'file' : 'files'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

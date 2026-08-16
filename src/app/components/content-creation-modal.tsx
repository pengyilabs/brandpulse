import { useState } from 'react';
import { X, Upload, Link as LinkIcon, Loader2, FileText, Video, Film } from 'lucide-react';

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: ContentConfig) => void;
}

interface ContentConfig {
  title: string;
  videoFile?: File;
  videoUrl?: string;
  generateBlog: boolean;
  blogReadTime: string;
  generateShortVideos: boolean;
  shortVideosCount: number;
  shortVideosDuration: number;
  generateHighlightReel: boolean;
  highlightReelDuration: number;
}

export function ContentCreationModal({ isOpen, onClose, onComplete }: ContentCreationModalProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ContentConfig>({
    title: '',
    generateBlog: false,
    blogReadTime: '5 min read',
    generateShortVideos: false,
    shortVideosCount: 10,
    shortVideosDuration: 30,
    generateHighlightReel: false,
    highlightReelDuration: 10,
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const hasVideoInput = config.videoFile || videoUrl;
  const hasSelectedContent = config.generateBlog || config.generateShortVideos || config.generateHighlightReel;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfig({ ...config, videoFile: file });
    }
  };

  const handleNext = () => {
    if (step === 1 && config.title && hasVideoInput) {
      setConfig({ ...config, videoUrl });
      setStep(2);
    } else if (step === 2 && hasSelectedContent) {
      setStep(3);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onComplete(config);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`bg-card w-full rounded-lg shadow-2xl overflow-hidden border border-border max-h-[90vh] flex ${step === 1 ? 'max-w-5xl' : 'max-w-4xl flex-col'}`}>
        {step === 1 && (
          <div className="w-1/3 bg-secondary/30 border-r border-border p-6 flex flex-col">
            <h3 className="mb-4">What You'll Get</h3>
            <div className="flex-1 flex items-center justify-center">
              <img
                src="/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwbWFya2V0aW5nJTIwcmVzdWx0cyUyMHNvY2lhbCUyMG1lZGlhJTIwcG9zdHN8ZW58MXx8fHwxNzc3Mzk0Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Content creation workflow"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">✓ Blog posts</p>
              <p className="text-sm text-muted-foreground">✓ Short video clips</p>
              <p className="text-sm text-muted-foreground">✓ Highlight reels</p>
              <p className="text-sm text-muted-foreground">✓ Social media content</p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-foreground">Create Content from Video</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto flex-1">
          {step === 1 && (
            <div>
              <h3 className="mb-6">Step 1: Project Setup</h3>

              <div className="mb-6">
                <label className="block mb-2">Give your project a name</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g., Product Launch Campaign 2026"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <p className="text-muted-foreground text-sm mt-2">This helps you identify your project later</p>
              </div>

              <div>
                <label className="block mb-4">Upload your video</label>

                <label className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground transition-colors bg-secondary/30">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-foreground mb-2">Drag & drop your MP4 video here, or click to browse</p>
                  {config.videoFile && (
                    <p className="text-primary text-sm">{config.videoFile.name}</p>
                  )}
                </label>

                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="text-muted-foreground text-sm">OR</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>

                <div>
                  <label className="block mb-2">Enter a video URL (YouTube, Vimeo, etc.)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="mb-6">Step 2: Choose Your Content</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="relative h-32 bg-secondary">
                    <img
                      src="/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzczOTM0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Blog Post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-400" />
                        <h4 className="text-foreground">Blog Post</h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.generateBlog}
                        onChange={(e) => setConfig({ ...config, generateBlog: e.target.checked })}
                        className="w-5 h-5 rounded-md border-2 border-border bg-input cursor-pointer checked:bg-primary checked:border-primary"
                        style={{ accentColor: 'var(--primary)', colorScheme: 'dark' }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Generate a written article from your video</p>
                    {config.generateBlog && (
                      <div>
                        <label className="block mb-2 text-sm">Estimated Read Time</label>
                        <select
                          value={config.blogReadTime}
                          onChange={(e) => setConfig({ ...config, blogReadTime: e.target.value })}
                          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm cursor-pointer hover:bg-secondary/70 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:right_0.75rem_center] bg-no-repeat pr-8"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option>3 min read</option>
                          <option>5 min read</option>
                          <option>10 min read</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="relative h-32 bg-secondary">
                    <img
                      src="/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Short Videos"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-400" />
                        <h4 className="text-foreground">Short Videos</h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.generateShortVideos}
                        onChange={(e) => setConfig({ ...config, generateShortVideos: e.target.checked })}
                        className="w-5 h-5 rounded-md border-2 border-border bg-input cursor-pointer checked:bg-primary checked:border-primary"
                        style={{ accentColor: 'var(--primary)', colorScheme: 'dark' }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Create bite-sized clips for social media</p>
                    {config.generateShortVideos && (
                      <div className="space-y-3">
                        <div>
                          <label className="block mb-2 text-sm">Number of Videos</label>
                          <input
                            type="number"
                            value={config.shortVideosCount}
                            onChange={(e) => setConfig({ ...config, shortVideosCount: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm">Duration (seconds)</label>
                          <input
                            type="number"
                            value={config.shortVideosDuration}
                            onChange={(e) => setConfig({ ...config, shortVideosDuration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="relative h-32 bg-secondary">
                    <img
                      src="/brand-tile-amber.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB0aW1lbGluZSUyMGhpZ2hsaWdodCUyMHJlZWx8ZW58MXx8fHwxNzc3Mzk3ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Highlight Reel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Film className="w-5 h-5 text-purple-400" />
                        <h4 className="text-foreground">Highlight Reel</h4>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.generateHighlightReel}
                        onChange={(e) => setConfig({ ...config, generateHighlightReel: e.target.checked })}
                        className="w-5 h-5 rounded-md border-2 border-border bg-input cursor-pointer checked:bg-primary checked:border-primary"
                        style={{ accentColor: 'var(--primary)', colorScheme: 'dark' }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">Best moments compiled into one video</p>
                    {config.generateHighlightReel && (
                      <div>
                        <label className="block mb-2 text-sm">Duration (minutes)</label>
                        <input
                          type="number"
                          value={config.highlightReelDuration}
                          onChange={(e) => setConfig({ ...config, highlightReelDuration: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="mb-2">Generating Your Content...</h3>
              <p className="text-muted-foreground">This may take a few minutes. We're analyzing your video and crafting your content.</p>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex justify-between">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!config.title || !hasVideoInput)) ||
                  (step === 2 && !hasSelectedContent)
                }
                className={`px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity ${step === 1 ? 'ml-auto' : ''}`}
              >
                {step === 2 ? 'Generate' : 'Next'}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Edit3, RotateCcw, Check, Trash2, Scissors, Play, Edit2 } from 'lucide-react';

interface ContentReviewProps {
  config: any;
  onFinalize: () => void;
}

export function ContentReview({ config, onFinalize }: ContentReviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [blogApproved, setBlogApproved] = useState(false);
  const [shortVideosApproved, setShortVideosApproved] = useState<boolean[]>(Array(config.shortVideosCount).fill(false));
  const [highlightReelApproved, setHighlightReelApproved] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [blogContent, setBlogContent] = useState(`# The Future of Content Creation

In today's digital landscape, creating engaging content has never been more important. This comprehensive guide explores the latest trends and best practices for content creators looking to make an impact.

## Key Takeaways

- Content quality matters more than quantity
- Authenticity resonates with audiences
- Consistency builds trust and engagement

Our video analysis revealed several compelling insights about modern content strategies...`);

  const steps = [];
  if (config.generateBlog) steps.push('blog');
  if (config.generateShortVideos) steps.push('shortVideos');
  if (config.generateHighlightReel) steps.push('highlightReel');

  const currentStepType = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const allApproved =
    (!config.generateBlog || blogApproved) &&
    (!config.generateShortVideos || shortVideosApproved.every(Boolean)) &&
    (!config.generateHighlightReel || highlightReelApproved);

  const approveAllShortVideos = () => {
    setShortVideosApproved(Array(config.shortVideosCount).fill(true));
  };

  const handleApproveAndNext = () => {
    if (currentStepType === 'blog') {
      setBlogApproved(true);
      setCurrentStep(currentStep + 1);
    } else if (currentStepType === 'shortVideos') {
      approveAllShortVideos();
      setCurrentStep(currentStep + 1);
    } else if (currentStepType === 'highlightReel') {
      setHighlightReelApproved(true);
      if (allApproved) {
        onFinalize();
      }
    }
  };

  const canProceed = () => {
    if (currentStepType === 'blog') return blogApproved;
    if (currentStepType === 'shortVideos') return shortVideosApproved.every(Boolean);
    if (currentStepType === 'highlightReel') return highlightReelApproved;
    return false;
  };

  const videoPlaceholders = [
    '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-amber.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-coral.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-foreground mb-2">Review Your Content</h1>
              <p className="text-muted-foreground">Review and approve each piece before finalizing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    index < currentStep ? 'bg-green-500' : ''
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-sm">
                    {step === 'blog' && 'Blog Post'}
                    {step === 'shortVideos' && 'Short Videos'}
                    {step === 'highlightReel' && 'Highlight Reel'}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {currentStepType === 'blog' && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2>Blog Post</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBlog(!editingBlog)}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    {editingBlog ? 'Preview' : 'Edit'}
                  </button>
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => setBlogApproved(!blogApproved)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      blogApproved
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {blogApproved ? 'Approved' : 'Approve'}
                  </button>
                </div>
              </div>

              {editingBlog ? (
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full h-64 px-4 py-3 bg-input border border-border rounded-lg text-foreground font-mono text-sm resize-none"
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <div className="text-muted-foreground whitespace-pre-wrap">{blogContent}</div>
                </div>
              )}
            </div>
          )}

          {currentStepType === 'shortVideos' && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2>Short Videos ({config.shortVideosCount} clips)</h2>
                <div className="flex gap-2">
                  <button
                    onClick={approveAllShortVideos}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Approve All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: config.shortVideosCount }).map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[9/16] bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src={videoPlaceholders[index % videoPlaceholders.length]}
                        alt={`Short video ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                        {config.shortVideosDuration}s
                      </div>
                      <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play className="w-12 h-12 text-white" />
                      </button>
                    </div>
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => {
                          const newApproved = [...shortVideosApproved];
                          newApproved[index] = !newApproved[index];
                          setShortVideosApproved(newApproved);
                        }}
                        className={`flex-1 px-2.5 py-2 rounded transition-colors ${
                          shortVideosApproved[index]
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                        }`}
                        title={shortVideosApproved[index] ? 'Approved' : 'Approve'}
                      >
                        <Check className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        className="px-2.5 py-2 bg-secondary text-foreground rounded hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                        title="Edit video"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="px-2.5 py-2 bg-secondary text-foreground rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepType === 'highlightReel' && (
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2>Highlight Reel</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    Trim
                  </button>
                  <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={() => setHighlightReelApproved(!highlightReelApproved)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      highlightReelApproved
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {highlightReelApproved ? 'Approved' : 'Approve'}
                  </button>
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
                  {config.highlightReelDuration}:00
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-opacity"
            >
              Back
            </button>
          )}
          <button
            onClick={isLastStep ? onFinalize : handleApproveAndNext}
            disabled={!canProceed()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {isLastStep ? 'Finalize & Export' : 'Approve & Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

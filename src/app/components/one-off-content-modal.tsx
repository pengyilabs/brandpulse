import { useState } from 'react';
import { X, Upload, FileText, Video, Image as ImageIcon, MessageSquare, Sparkles, Link as LinkIcon, Calendar } from 'lucide-react';

interface OneOffContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (content: any) => void;
}

export function OneOffContentModal({ isOpen, onClose, onComplete }: OneOffContentModalProps) {
  const [step, setStep] = useState(1);
  const [sourceType, setSourceType] = useState<'upload' | 'link' | 'text'>('upload');
  const [contentType, setContentType] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  const contentTypes = [
    { id: 'blog', label: 'Blog Post', icon: FileText, color: 'text-blue-500' },
    { id: 'clips', label: 'Clips & Shorts', icon: Video, color: 'text-green-500' },
    { id: 'video', label: 'AI Video', icon: Sparkles, color: 'text-purple-500' },
    { id: 'social', label: 'Social Post', icon: MessageSquare, color: 'text-pink-500' },
    { id: 'quote', label: 'Quote Card', icon: ImageIcon, color: 'text-amber-500' },
  ];

  const templates = [
    'Professional',
    'Casual & Fun',
    'Educational',
    'Minimalist',
    'Bold & Colorful',
  ];

  const handleGenerate = () => {
    onComplete({
      sourceType,
      contentType,
      template: selectedTemplate,
      date: selectedDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Create One-Off Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Source Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSourceType('upload')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      sourceType === 'upload'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium text-foreground">Upload File</span>
                  </button>
                  <button
                    onClick={() => setSourceType('link')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      sourceType === 'link'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <LinkIcon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium text-foreground">Add Link</span>
                  </button>
                  <button
                    onClick={() => setSourceType('text')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      sourceType === 'text'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium text-foreground">Paste Text</span>
                  </button>
                </div>
              </div>

              {sourceType === 'upload' && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-foreground mb-1">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">Supports images, videos, PDFs, and documents</p>
                </div>
              )}

              {sourceType === 'link' && (
                <div>
                  <input
                    type="url"
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {sourceType === 'text' && (
                <div>
                  <textarea
                    placeholder="Paste or type your content here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Content Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        contentType === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 ${type.color}`} />
                      <span className="text-sm font-medium text-foreground">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!contentType}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Choose Template
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Select Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <button
                      key={template}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTemplate === template
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-sm font-medium text-foreground">{template}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Publish Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Topic (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Product Launch, Tutorial, Behind the Scenes"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

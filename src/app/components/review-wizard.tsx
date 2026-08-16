import { useState } from 'react';
import {
  X, Filter, Calendar, FileText, Check, RefreshCw, Trash2, ChevronLeft,
  ChevronRight, LayoutGrid, List, CheckSquare, Square, XCircle, Image,
  Video, Layout, MessageSquare, AlertCircle, BarChart3
} from 'lucide-react';
import { AnalyzePanel } from './analyze-panel';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = 'blog-post' | 'social-post' | 'carousel' | 'video-script' | 'image-post';
type ContentStatus = 'draft' | 'pending-review' | 'approved' | 'rejected' | 'generating';

interface ContentItem {
  id: number;
  type: ContentType;
  topic: string;
  scheduledDate: string;
  status: ContentStatus;
  content: string;
  feedback?: string;
  imageUrl?: string;
}

interface ReviewStats {
  approved: number;
  rejected: number;
  regenerated: number;
}

interface FilterOptions {
  status: ContentStatus | 'all';
  contentType: ContentType | 'all';
  dateFrom: string;
  dateTo: string;
}

export interface ReviewWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ITEMS: ContentItem[] = [
  {
    id: 1,
    type: 'social-post',
    topic: 'Summer Collection Launch',
    scheduledDate: 'May 28, 2026',
    status: 'pending-review',
    content: 'Unleash your potential this summer. Our new collection combines performance with style—engineered for athletes who refuse to compromise. Available now.',
    imageUrl: '/brand-tile-navy.svg?w=800&h=800&fit=crop&auto=format',
  },
  {
    id: 2,
    type: 'blog-post',
    topic: 'Training Tips for Marathon Runners',
    scheduledDate: 'May 29, 2026',
    status: 'pending-review',
    content: 'Marathon training requires more than just logging miles. Here are five science-backed strategies to optimize your preparation and achieve peak performance on race day.',
    feedback: 'Previous version was too technical',
  },
  {
    id: 3,
    type: 'video-script',
    topic: 'Product Demo: React Training Shoes',
    scheduledDate: 'May 30, 2026',
    status: 'draft',
    content: '[Opening shot: Close-up of React shoe]\n\nVOICEOVER: "Meet React. The shoe that adapts to you."\n\n[Cut to: Athlete running]\n\n"Responsive cushioning. Lightweight design. Maximum performance."',
  },
  {
    id: 4,
    type: 'carousel',
    topic: 'Athlete Success Stories',
    scheduledDate: 'May 31, 2026',
    status: 'pending-review',
    content: 'Slide 1: Meet Sarah, 10K champion\nSlide 2: Her journey started with one step\nSlide 3: Now she\'s breaking records\nSlide 4: What\'s your next move?',
  },
  {
    id: 5,
    type: 'social-post',
    topic: 'Motivational Monday',
    scheduledDate: 'Jun 1, 2026',
    status: 'approved',
    content: 'Champions aren\'t made in the gym. They\'re made from something deep inside—a desire, a dream, a vision. Start your week strong.',
    imageUrl: '/brand-tile-violet.svg?w=800&h=800&fit=crop&auto=format',
  },
  {
    id: 6,
    type: 'blog-post',
    topic: 'Nutrition Guide for Athletes',
    scheduledDate: 'Jun 2, 2026',
    status: 'draft',
    content: 'Performance starts in the kitchen. Discover how to fuel your body for optimal athletic performance with our comprehensive nutrition guide.',
  },
  {
    id: 7,
    type: 'image-post',
    topic: 'New Gear Announcement',
    scheduledDate: 'Jun 3, 2026',
    status: 'pending-review',
    content: 'Introducing the Air Zoom Elite. Designed for speed. Built for champions.',
    imageUrl: '/brand-tile-cyan.svg?w=800&h=800&fit=crop&auto=format',
  },
  {
    id: 8,
    type: 'social-post',
    topic: 'Training Tip Tuesday',
    scheduledDate: 'Jun 4, 2026',
    status: 'rejected',
    content: 'Quick tip: Always warm up before intense training. Your muscles will thank you.',
    feedback: 'Too generic, needs more specific Velocity Athletics brand voice',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'blog-post': return FileText;
    case 'social-post': return MessageSquare;
    case 'carousel': return Layout;
    case 'video-script': return Video;
    case 'image-post': return Image;
    default: return FileText;
  }
};

const getContentTypeColor = (type: ContentType) => {
  switch (type) {
    case 'blog-post': return '#60A5FA';
    case 'social-post': return '#F472B6';
    case 'carousel': return '#A78BFA';
    case 'video-script': return '#34D399';
    case 'image-post': return '#FBBF24';
    default: return '#9CA3AF';
  }
};

const getStatusBadge = (status: ContentStatus) => {
  switch (status) {
    case 'draft':
      return { label: 'Draft', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    case 'pending-review':
      return { label: 'Pending Review', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    case 'approved':
      return { label: 'Approved', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    case 'rejected':
      return { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    case 'generating':
      return { label: 'Generating', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    default:
      return { label: status, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ReviewWizard({ isOpen, onClose, projectId }: ReviewWizardProps) {
  const [step, setStep] = useState<'filter' | 'review'>('filter');
  const [viewMode, setViewMode] = useState<'single' | 'bulk'>('single');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnalyze, setShowAnalyze] = useState(false);
  const [items, setItems] = useState<ContentItem[]>(MOCK_ITEMS);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    status: 'pending-review',
    contentType: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [stats, setStats] = useState<ReviewStats>({
    approved: 0,
    rejected: 0,
    regenerated: 0,
  });

  if (!isOpen) return null;

  const currentItem = filteredItems[currentIndex];
  const totalItems = filteredItems.length;
  const reviewedCount = stats.approved + stats.rejected + stats.regenerated;

  // ─── Filter Actions ───────────────────────────────────────────────────────────

  const handleStartReview = () => {
    let filtered = items;

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    if (filters.contentType !== 'all') {
      filtered = filtered.filter(item => item.type === filters.contentType);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.scheduledDate) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(item => new Date(item.scheduledDate) <= new Date(filters.dateTo));
    }

    setFilteredItems(filtered);
    setCurrentIndex(0);
    setStep('review');
  };

  const handleSelectAll = () => {
    setFilters({
      status: 'all',
      contentType: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'pending-review',
      contentType: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  // ─── Review Actions ───────────────────────────────────────────────────────────

  const handleApprove = () => {
    setStats(prev => ({ ...prev, approved: prev.approved + 1 }));
    setItems(prev => prev.map(item =>
      item.id === currentItem.id ? { ...item, status: 'approved' as ContentStatus } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.id === currentItem.id ? { ...item, status: 'approved' as ContentStatus } : item
    ));
    advanceToNext();
  };

  const handleRegenerate = () => {
    setStats(prev => ({ ...prev, regenerated: prev.regenerated + 1 }));
    setItems(prev => prev.map(item =>
      item.id === currentItem.id ? { ...item, status: 'generating' as ContentStatus } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.id === currentItem.id ? { ...item, status: 'generating' as ContentStatus } : item
    ));
    advanceToNext();
  };

  const handleReject = () => {
    setShowRejectInput(true);
  };

  const submitRejection = () => {
    if (!rejectReason.trim()) return;

    setStats(prev => ({ ...prev, rejected: prev.rejected + 1 }));
    setItems(prev => prev.map(item =>
      item.id === currentItem.id
        ? { ...item, status: 'rejected' as ContentStatus, feedback: rejectReason }
        : item
    ));
    setFilteredItems(prev => prev.map(item =>
      item.id === currentItem.id
        ? { ...item, status: 'rejected' as ContentStatus, feedback: rejectReason }
        : item
    ));
    setShowRejectInput(false);
    setRejectReason('');
    advanceToNext();
  };

  const handleDelete = () => {
    setItems(prev => prev.filter(item => item.id !== currentItem.id));
    setFilteredItems(prev => prev.filter(item => item.id !== currentItem.id));
    if (currentIndex >= filteredItems.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const advanceToNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // ─── Bulk Actions ─────────────────────────────────────────────────────────────

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(filteredItems.map(item => item.id)));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const bulkApprove = () => {
    const count = selectedItems.size;
    setStats(prev => ({ ...prev, approved: prev.approved + count }));
    setItems(prev => prev.map(item =>
      selectedItems.has(item.id) ? { ...item, status: 'approved' as ContentStatus } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      selectedItems.has(item.id) ? { ...item, status: 'approved' as ContentStatus } : item
    ));
    clearSelection();
  };

  const bulkRegenerate = () => {
    const count = selectedItems.size;
    setStats(prev => ({ ...prev, regenerated: prev.regenerated + count }));
    setItems(prev => prev.map(item =>
      selectedItems.has(item.id) ? { ...item, status: 'generating' as ContentStatus } : item
    ));
    setFilteredItems(prev => prev.map(item =>
      selectedItems.has(item.id) ? { ...item, status: 'generating' as ContentStatus } : item
    ));
    clearSelection();
  };

  const bulkDelete = () => {
    setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    setFilteredItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    clearSelection();
  };

  // ─── Render Functions ─────────────────────────────────────────────────────────

  const renderContentPreview = (item: ContentItem) => {
    const Icon = getContentTypeIcon(item.type);
    const color = getContentTypeColor(item.type);

    if (item.type === 'social-post' && item.imageUrl) {
      return (
        <div className="bg-card rounded-lg overflow-hidden border border-border max-w-md mx-auto">
          <div className="aspect-square bg-secondary relative">
            <img
              src={item.imageUrl}
              alt={item.topic}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
          </div>
        </div>
      );
    }

    if (item.type === 'image-post' && item.imageUrl) {
      return (
        <div className="bg-card rounded-lg overflow-hidden border border-border">
          <div className="aspect-video bg-secondary relative">
            <img
              src={item.imageUrl}
              alt={item.topic}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <p className="text-lg text-foreground font-medium">{item.content}</p>
          </div>
        </div>
      );
    }

    if (item.type === 'blog-post') {
      return (
        <div className="bg-card rounded-lg border border-border p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: `${color}20`, color }}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Article
            </span>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">{item.topic}</h3>
          <p className="text-base text-foreground/90 leading-relaxed">{item.content}</p>
        </div>
      );
    }

    if (item.type === 'video-script') {
      return (
        <div className="bg-card rounded-lg border border-border p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded" style={{ backgroundColor: `${color}20`, color }}>
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{item.topic}</h4>
              <p className="text-xs text-muted-foreground">Video Script</p>
            </div>
          </div>
          <div className="space-y-3">
            {item.content.split('\n').map((line, idx) => (
              <p key={idx} className="text-sm text-foreground/90 font-mono leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      );
    }

    if (item.type === 'carousel') {
      return (
        <div className="bg-card rounded-lg border border-border p-6 max-w-xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded" style={{ backgroundColor: `${color}20`, color }}>
              <Layout className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Carousel Post
            </span>
          </div>
          <div className="space-y-4">
            {item.content.split('\n').map((slide, idx) => (
              <div key={idx} className="bg-secondary rounded-lg p-4 border border-border/50">
                <p className="text-sm text-foreground">{slide}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-foreground">{item.content}</p>
      </div>
    );
  };

  // ─── Filter Step ──────────────────────────────────────────────────────────────

  if (step === 'filter') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-card border border-border rounded-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">Review Content</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Filter which items you'd like to review
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Filter Form */}
          <div className="p-6 space-y-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending-review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content Type
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => setFilters({ ...filters, contentType: e.target.value as any })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
              >
                <option value="all">All Types</option>
                <option value="blog-post">Blog Post</option>
                <option value="social-post">Social Post</option>
                <option value="carousel">Carousel</option>
                <option value="video-script">Video Script</option>
                <option value="image-post">Image Post</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm"
              >
                <CheckSquare className="w-4 h-4" />
                Select All
              </button>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm"
              >
                <XCircle className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {items.filter(item => {
                if (filters.status !== 'all' && item.status !== filters.status) return false;
                if (filters.contentType !== 'all' && item.type !== filters.contentType) return false;
                return true;
              }).length} items match your filters
            </p>
            <button
              onClick={handleStartReview}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Start Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Review Step (Single Mode) ────────────────────────────────────────────────

  if (viewMode === 'single') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-card border border-border rounded-2xl w-full h-[90vh] flex overflow-hidden" style={{ maxWidth: showAnalyze ? '90vw' : '1280px' }}>
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setStep('filter')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground">Review Content</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentIndex + 1} of {totalItems} items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === totalItems - 1}
                  className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 px-4 py-2 bg-secondary rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{stats.approved}</span> approved
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{stats.rejected}</span> rejected
                  </span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{stats.regenerated}</span> regenerated
                  </span>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setViewMode('single')}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                >
                  Single
                </button>
                <button
                  onClick={() => setViewMode('bulk')}
                  className="px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-colors"
                >
                  Bulk
                </button>
              </div>

              <button
                onClick={() => setShowAnalyze(!showAnalyze)}
                className={`p-2 rounded-lg transition-colors ${showAnalyze ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                title="Analyze content"
              >
                <BarChart3 className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-secondary flex-shrink-0">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
            />
          </div>

          {/* Content Area */}
          {currentItem && (
            <div className="flex-1 overflow-y-auto p-8">
              {/* Meta Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${getContentTypeColor(currentItem.type)}20`,
                      color: getContentTypeColor(currentItem.type)
                    }}
                  >
                    {(() => {
                      const Icon = getContentTypeIcon(currentItem.type);
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{currentItem.topic}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {currentItem.scheduledDate}
                      </div>
                      <div className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusBadge(currentItem.status).color}`}>
                        {getStatusBadge(currentItem.status).label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Feedback */}
              {currentItem.feedback && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400 mb-1">Previous Feedback</p>
                      <p className="text-sm text-foreground/90">{currentItem.feedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div className="mb-8">
                {renderContentPreview(currentItem)}
              </div>

              {/* Reject Input */}
              {showRejectInput && (
                <div className="mb-6 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Why are you rejecting this content?
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain what needs to be changed..."
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={submitRejection}
                      disabled={!rejectReason.trim()}
                      className="px-6 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Submit & Continue
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectInput(false);
                        setRejectReason('');
                      }}
                      className="px-6 py-2.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!showRejectInput && (
                <div className="flex items-center justify-end pt-6 border-t border-border">
                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-destructive/20 text-foreground hover:text-destructive rounded-lg transition-colors border border-border"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex items-center gap-2 px-5 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors border border-destructive/20"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-2 px-5 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <button
                      onClick={handleApprove}
                      className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {totalItems === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">No items to review</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          )}
          </div>

          {/* Analyze Panel */}
          {showAnalyze && currentItem && (
            <AnalyzePanel
              itemId={currentItem.id}
              itemType={currentItem.type}
              itemStatus={currentItem.status}
              onClose={() => setShowAnalyze(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // ─── Review Step (Bulk Mode) ──────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setStep('filter')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-foreground">Bulk Review</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedItems.size} of {totalItems} items selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('single')}
                className="px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-colors"
              >
                Single
              </button>
              <button
                onClick={() => setViewMode('bulk')}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium"
              >
                Bulk
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <div className="px-6 py-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={clearSelection}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Clear Selection
              </button>
              <div className="w-px h-4 bg-primary/20" />
              <span className="text-sm text-foreground">
                <span className="font-semibold">{selectedItems.size}</span> items selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={bulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors border border-destructive/20 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
              <button
                onClick={bulkRegenerate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Selected
              </button>
              <button
                onClick={bulkApprove}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity text-sm font-medium"
              >
                <Check className="w-4 h-4" />
                Approve Selected
              </button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {totalItems > 0 ? (
            <>
              {/* Select All */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={selectedItems.size === totalItems ? clearSelection : selectAllItems}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm"
                >
                  {selectedItems.size === totalItems ? (
                    <>
                      <Square className="w-4 h-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Select All
                    </>
                  )}
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const Icon = getContentTypeIcon(item.type);
                  const color = getContentTypeColor(item.type);
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setPreviewItem(item)}
                      className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-border/50'
                      }`}
                    >
                      {/* Image if available */}
                      {item.imageUrl && (
                        <div className="aspect-video bg-secondary relative">
                          <img
                            src={item.imageUrl}
                            alt={item.topic}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemSelection(item.id);
                              }}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center hover:scale-110 transition-transform ${
                                isSelected
                                  ? 'bg-primary border-primary'
                                  : 'bg-card/50 border-border backdrop-blur-sm'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4">
                        {!item.imageUrl && (
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="p-2 rounded"
                              style={{
                                backgroundColor: `${color}20`,
                                color
                              }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemSelection(item.id);
                              }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center hover:scale-110 transition-transform ${
                                isSelected
                                  ? 'bg-primary border-primary'
                                  : 'bg-secondary border-border'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </div>
                        )}

                        <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-1">
                          {item.topic}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {item.content}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {item.scheduledDate}
                          </div>
                          <div className={`px-2 py-0.5 rounded-full border ${getStatusBadge(item.status).color}`}>
                            {getStatusBadge(item.status).label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">No items to review</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Item Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center p-6">
            <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: `${getContentTypeColor(previewItem.type)}20`,
                      color: getContentTypeColor(previewItem.type)
                    }}
                  >
                    {(() => {
                      const Icon = getContentTypeIcon(previewItem.type);
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{previewItem.topic}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {previewItem.scheduledDate}
                      </div>
                      <div className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusBadge(previewItem.status).color}`}>
                        {getStatusBadge(previewItem.status).label}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Previous Feedback */}
                {previewItem.feedback && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-400 mb-1">Previous Feedback</p>
                        <p className="text-sm text-foreground/90">{previewItem.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                {renderContentPreview(previewItem)}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border flex-shrink-0">
                <button
                  onClick={() => {
                    handleDelete();
                    setPreviewItem(null);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-destructive/20 text-foreground hover:text-destructive rounded-lg transition-colors border border-border"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(filteredItems.findIndex(item => item.id === previewItem.id));
                    setPreviewItem(null);
                    handleReject();
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors border border-destructive/20"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(filteredItems.findIndex(item => item.id === previewItem.id));
                    setPreviewItem(null);
                    handleRegenerate();
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(filteredItems.findIndex(item => item.id === previewItem.id));
                    setPreviewItem(null);
                    handleApprove();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-opacity font-medium"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

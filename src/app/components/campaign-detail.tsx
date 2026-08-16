import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Loader2, Video, Image as ImageIcon, FileText, MessageSquare, X } from 'lucide-react';

interface CampaignDetailProps {
  campaign: any;
  onBack: () => void;
}

export function CampaignDetail({ campaign, onBack }: CampaignDetailProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [contentStatus, setContentStatus] = useState<Record<string, 'completed' | 'loading' | 'pending'>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<Record<string, any>>({});

  useEffect(() => {
    // Simulate content generation progress
    const days = getDaysInCampaign();
    const initialStatus: Record<string, 'completed' | 'loading' | 'pending'> = {};
    const initialContent: Record<string, any> = {};

    const contentTypes = ['Short Video', 'Blog Post', 'Image', 'Text Post', 'Carousel'];

    days.forEach((date, index) => {
      const dateKey = formatDate(date);
      const contentType = contentTypes[index % contentTypes.length];

      if (index < 2) {
        initialStatus[dateKey] = 'completed';
        initialContent[dateKey] = {
          type: contentType,
          title: `${contentType} - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          status: 'ready',
          thumbnail: 'https://via.placeholder.com/400x300',
        };
      } else if (index < 5) {
        initialStatus[dateKey] = 'loading';
        initialContent[dateKey] = {
          type: contentType,
          title: `Generating ${contentType}...`,
          status: 'generating',
        };
      } else {
        initialStatus[dateKey] = 'pending';
        initialContent[dateKey] = {
          type: contentType,
          title: `Scheduled ${contentType}`,
          status: 'scheduled',
        };
      }
    });

    setContentStatus(initialStatus);
    setGeneratedContent(initialContent);

    // Simulate gradual completion
    const interval = setInterval(() => {
      setContentStatus(prev => {
        const updated = { ...prev };
        const loadingDays = Object.entries(updated).filter(([_, status]) => status === 'loading');

        if (loadingDays.length > 0) {
          // Complete one loading day
          const [firstLoadingDay] = loadingDays[0];
          updated[firstLoadingDay] = 'completed';

          // Move one pending to loading
          const pendingDays = Object.entries(updated).filter(([_, status]) => status === 'pending');
          if (pendingDays.length > 0) {
            const [firstPendingDay] = pendingDays[0];
            updated[firstPendingDay] = 'loading';
          }
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'Short Video':
      case 'Carousel':
        return Video;
      case 'Image':
        return ImageIcon;
      case 'Blog Post':
        return FileText;
      case 'Text Post':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'Short Video':
        return '#4B56F2';
      case 'Image':
        return '#3B82F6';
      case 'Carousel':
        return '#8B5CF6';
      case 'Blog Post':
        return '#F59E0B';
      case 'Text Post':
        return '#EC4899';
      default:
        return '#6B7280';
    }
  };

  const getDaysInCampaign = () => {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    const days = [];
    const current = new Date(start);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToMonday);

    const days = [];
    let currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newDate);
  };

  const isInCampaign = (date: Date) => {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    return date >= start && date <= end;
  };

  const getDateStatus = (date: Date) => {
    const dateKey = formatDate(date);
    return contentStatus[dateKey] || 'pending';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground">{campaign.name}</h1>
              <p className="text-muted-foreground mt-1">{campaign.description}</p>
            </div>
            <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
              <span className="text-sm font-medium capitalize">{campaign.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Campaign Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Duration</h3>
              <p className="text-lg font-semibold text-foreground">
                {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Content Types</h3>
              <div className="flex gap-2 flex-wrap">
                {campaign.contentAllocation && Object.entries(campaign.contentAllocation).map(([key, value]: [string, any]) => (
                  value > 0 && (
                    <span key={key} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {value}%
                    </span>
                  )
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Topics</h3>
              <p className="text-lg font-semibold text-foreground">{campaign.topics?.length || 0} topics</p>
            </div>
          </div>

          {/* Campaign Calendar */}
          <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Campaign Calendar</h2>
              <p className="text-sm text-muted-foreground mt-1">Content generation in progress</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-500" />
                </div>
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500 rounded flex items-center justify-center">
                  <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" />
                </div>
                <span className="text-muted-foreground">Generating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary border-2 border-border rounded" />
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <h4 className="text-lg font-semibold text-foreground">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h4>
              <button
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Cells */}
            <div className="grid grid-cols-7 gap-2">
              {getMonthDays().map((date, index) => {
                const dateKey = formatDate(date);
                const inCampaign = isInCampaign(date);
                const isThisMonth = isCurrentMonth(date);
                const status = getDateStatus(date);
                const isSelected = selectedDay === dateKey;
                const content = generatedContent[dateKey];
                const ContentIcon = content ? getContentIcon(content.type) : null;

                return (
                  <button
                    key={index}
                    onClick={() => inCampaign && isThisMonth && setSelectedDay(dateKey)}
                    disabled={!inCampaign || !isThisMonth}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all relative ${
                      !isThisMonth
                        ? 'border-transparent bg-transparent opacity-30 cursor-not-allowed'
                        : !inCampaign
                        ? 'border-border bg-card cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500/30 shadow-lg shadow-blue-500/20'
                        : status === 'completed'
                        ? 'border-green-500 bg-green-500/20 hover:bg-green-500/30'
                        : status === 'loading'
                        ? 'border-blue-500 bg-blue-500/20 hover:bg-blue-500/30'
                        : 'border-border bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-between h-full">
                      <div className="text-sm font-semibold text-foreground">
                        {date.getDate()}
                      </div>
                      {inCampaign && isThisMonth && (
                        <div className="flex items-center gap-1">
                          {status === 'completed' && ContentIcon && (
                            <ContentIcon className="w-3 h-3" style={{ color: getContentColor(content.type) }} />
                          )}
                          {status === 'loading' && (
                            <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </div>

        {/* Right Column - Content Detail */}
        <div className="lg:col-span-2">
          {selectedDay && generatedContent[selectedDay] ? (
            <div className="bg-card border border-border rounded-xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  {new Date(selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {(() => {
                const content = generatedContent[selectedDay];
                const ContentIcon = getContentIcon(content.type);
                const contentColor = getContentColor(content.type);

                return (
                  <div className="space-y-4">
                    {/* Content Type Badge */}
                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: contentColor + '15' }}>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: contentColor + '20' }}>
                        <ContentIcon className="w-6 h-6" style={{ color: contentColor }} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Content Type</p>
                        <p className="font-semibold text-foreground">{content.type}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        {content.status === 'ready' && (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-foreground font-medium">Ready to publish</span>
                          </>
                        )}
                        {content.status === 'generating' && (
                          <>
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            <span className="text-foreground font-medium">Generating content...</span>
                          </>
                        )}
                        {content.status === 'scheduled' && (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-border" />
                            <span className="text-foreground font-medium">Scheduled</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content Preview */}
                    {content.status === 'ready' && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Preview</p>
                        <div className="aspect-video bg-secondary rounded-lg overflow-hidden border border-border">
                          <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">{content.title}</p>
                          <p className="text-sm text-muted-foreground">
                            AI-generated content based on your campaign strategy and discovered topics.
                          </p>
                        </div>
                        <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                          View Full Content
                        </button>
                      </div>
                    )}

                    {content.status === 'generating' && (
                      <div className="space-y-3 py-8 text-center">
                        <div className="w-12 h-12 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          AI is creating your {content.type.toLowerCase()}...
                        </p>
                      </div>
                    )}

                    {content.status === 'scheduled' && (
                      <div className="space-y-3 py-8 text-center">
                        <div className="w-12 h-12 mx-auto flex items-center justify-center bg-secondary rounded-full">
                          <ContentIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Content will be generated soon
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-secondary/50 border border-border rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground opacity-30" />
              </div>
              <p className="text-muted-foreground">Select a day to view generated content</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

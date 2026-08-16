import { useState } from 'react';
import { ThemesManager } from './themes-manager';
import { TopicTitleFields } from './topic-title-fields';
import { Hash, FileText, Calendar, List, Layers } from 'lucide-react';

/**
 * Complete demonstration of the two-level theme and topic system
 */
export function ThemeTopicDemo() {
  // Content items with topics
  const [contentItems, setContentItems] = useState([
    {
      id: 1,
      theme: 'Work Stress',
      topic: 'Breathing Techniques for Work Stress',
      title: '5 Simple Breathing Exercises to Reduce Workplace Anxiety',
      format: 'long-form' as const,
      date: '2026-05-28',
    },
    {
      id: 2,
      theme: 'Company Culture',
      topic: 'Team Building Activities',
      format: 'short-form' as const,
      date: '2026-05-29',
    },
    {
      id: 3,
      theme: 'Anxiety',
      topic: 'Quick Desk Meditation',
      title: 'How to Meditate at Your Desk in Under 5 Minutes',
      format: 'long-form' as const,
      date: '2026-05-30',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(contentItems[0]);

  const handleTopicChange = (topic: string) => {
    const updated = { ...selectedItem, topic };
    setSelectedItem(updated);
    setContentItems(items =>
      items.map(item => item.id === selectedItem.id ? updated : item)
    );
  };

  const handleTitleChange = (title: string) => {
    const updated = { ...selectedItem, title };
    setSelectedItem(updated);
    setContentItems(items =>
      items.map(item => item.id === selectedItem.id ? updated : item)
    );
  };

  const handleRegenerate = () => {
    console.log('Regenerating content for:', selectedItem.topic);
    alert(`Regenerating content with new topic: "${selectedItem.topic}"`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Theme & Topic Management System
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Two-level hierarchy: Themes (project-wide) → Topics (item-specific)
          </p>
        </div>

        {/* System Architecture */}
        <div className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">How It Works</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Level 1: Themes</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Project-level, broad categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Examples: "Work Stress", "Anxiety", "Company Culture"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Managed in project settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Can be added from URL sources</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Level 2: Topics</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <span>Item-level, specific subjects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <span>Examples: "Breathing Techniques for Work Stress"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <span>Auto-generated but fully editable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <span>Displayed in calendar and list views</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Level 1: Themes Manager */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Level 1: Themes</h2>
              <p className="text-sm text-muted-foreground">
                Project-wide theme management
              </p>
            </div>
            <ThemesManager />
          </div>

          {/* Level 2: Topic & Title Fields */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Level 2: Topics</h2>
              <p className="text-sm text-muted-foreground">
                Item-specific topic and title editing
              </p>
            </div>

            {/* Item Selector */}
            <div className="bg-card border border-border rounded-xl p-4 mb-4">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Select Content Item to Edit
              </label>
              <select
                value={selectedItem.id}
                onChange={(e) => {
                  const item = contentItems.find(i => i.id === Number(e.target.value));
                  if (item) setSelectedItem(item);
                }}
                className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground"
              >
                {contentItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.topic} ({item.format})
                  </option>
                ))}
              </select>
            </div>

            {/* Topic/Title Editor */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                  Theme: {selectedItem.theme}
                </span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                  {selectedItem.format}
                </span>
              </div>

              <TopicTitleFields
                format={selectedItem.format}
                topic={selectedItem.topic}
                title={selectedItem.title}
                onTopicChange={handleTopicChange}
                onTitleChange={selectedItem.format === 'long-form' ? handleTitleChange : undefined}
                onRegenerateRequest={handleRegenerate}
                autoGeneratedTopic={selectedItem.topic}
              />
            </div>
          </div>
        </div>

        {/* View Demonstrations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Display in Views</h2>

          {/* Calendar View Example */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Calendar View</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {contentItems.map(item => (
                <div key={item.id} className="bg-secondary/30 border border-border rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-2">{item.date}</div>
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                    <div className="text-sm font-medium text-foreground line-clamp-2">
                      {item.topic}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">
                      {item.theme}
                    </span>
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-[10px]">
                      {item.format === 'long-form' ? 'Long' : 'Short'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              ✓ Shows topic for each item (not theme)
            </p>
          </div>

          {/* List View Example */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <List className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">List View</h3>
            </div>
            <div className="space-y-2">
              {contentItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground mb-1">
                      {item.topic}
                    </div>
                    {item.format === 'long-form' && item.title && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {item.theme}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              ✓ Shows topic as primary identifier
              {' · '}
              Long-form items also show title as subtitle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

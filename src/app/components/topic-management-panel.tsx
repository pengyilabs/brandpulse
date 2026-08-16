import { useState } from 'react';
import { Plus, X, Search, Hash } from 'lucide-react';

interface Topic {
  id: number;
  name: string;
  campaignCount: number;
}

export function TopicManagementPanel() {
  const [topics, setTopics] = useState<Topic[]>([
    { id: 1, name: 'Technology', campaignCount: 5 },
    { id: 2, name: 'Tutorial', campaignCount: 8 },
    { id: 3, name: 'Product Reviews', campaignCount: 3 },
    { id: 4, name: 'Industry News', campaignCount: 4 },
    { id: 5, name: 'Behind the Scenes', campaignCount: 2 },
    { id: 6, name: 'Customer Stories', campaignCount: 6 },
    { id: 7, name: 'How-To Guides', campaignCount: 7 },
    { id: 8, name: 'Announcements', campaignCount: 3 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicName, setNewTopicName] = useState('');

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;

    const newTopic: Topic = {
      id: Date.now(),
      name: newTopicName.trim(),
      campaignCount: 0,
    };

    setTopics([...topics, newTopic]);
    setNewTopicName('');
  };

  const handleRemoveTopic = (id: number) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-1">Project Topics</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage topics used across all campaigns in this project
        </p>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="mb-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                  placeholder="Add new topic..."
                  className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={handleAddTopic}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground mb-3">
              All Topics ({filteredTopics.length})
            </p>
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">{topic.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {topic.campaignCount} campaign{topic.campaignCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTopic(topic.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={topic.campaignCount > 0}
                  title={topic.campaignCount > 0 ? 'Cannot remove topic used in campaigns' : 'Remove topic'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No topics found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

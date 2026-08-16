import { useState } from 'react';
import { Settings, Grid, Tag, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectSidebarProps {
  projectName: string;
  activePanel?: string | null;
  onPanelChange?: (panel: string | null) => void;
}

export function ProjectSidebar({ projectName, activePanel, onPanelChange }: ProjectSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'templates', icon: Grid, label: 'Templates' },
    { id: 'topics', icon: Tag, label: 'Topics' },
    { id: 'resources', icon: FolderOpen, label: 'Resources' },
  ];

  const handleItemClick = (id: string) => {
    if (onPanelChange) {
      onPanelChange(activePanel === id ? null : id);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>

        <div className="flex-1 p-2">
          {menuItems.map((item) => {
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setIsCollapsed(false);
                  if (onPanelChange) {
                    onPanelChange(activePanel === item.id ? null : item.id);
                  }
                }}
                className={`w-full flex items-center justify-center p-2.5 rounded-lg transition-colors mb-1 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-sidebar-foreground truncate">{projectName}</h3>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
          )}
        </button>
      </div>

      <div className="flex-1 p-2">
        {menuItems.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

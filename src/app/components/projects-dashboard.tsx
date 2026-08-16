import { useState } from 'react';
import { Plus, Search, Target, FileText, FolderOpen, MoreHorizontal } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  client: string;
  campaigns: number;
  contentItems: number;
  status: 'active' | 'paused' | 'completed';
  lastUpdated: string;
  accentColor: string;
}

const PROJECTS: Project[] = [
  { id: 1, name: 'Velocity Athletics Project', client: 'Velocity Athletics Inc.', campaigns: 4, contentItems: 47, status: 'active', lastUpdated: '2 hours ago', accentColor: '#F97316' },
  { id: 2, name: 'Tech Startup Project', client: 'StartupCo', campaigns: 2, contentItems: 23, status: 'active', lastUpdated: '1 day ago', accentColor: '#8B5CF6' },
  { id: 3, name: 'Wellness Brand Project', client: 'ZenLife', campaigns: 3, contentItems: 31, status: 'active', lastUpdated: '3 days ago', accentColor: '#06B6D4' },
  { id: 4, name: 'Fashion E-commerce Project', client: 'StyleHub', campaigns: 5, contentItems: 62, status: 'paused', lastUpdated: '1 week ago', accentColor: '#EC4899' },
  { id: 5, name: 'Food & Beverage Project', client: 'FreshBites', campaigns: 2, contentItems: 18, status: 'active', lastUpdated: '5 hours ago', accentColor: '#EAB308' },
  { id: 6, name: 'B2B SaaS Platform Project', client: 'CloudSync', campaigns: 3, contentItems: 29, status: 'active', lastUpdated: '2 days ago', accentColor: '#4B56F2' },
  { id: 7, name: 'Lumina Wellness Project', client: 'Lumina Wellness', campaigns: 1, contentItems: 12, status: 'active', lastUpdated: '1 hour ago', accentColor: '#D946EF' },
];

interface ProjectsDashboardProps {
  onProjectClick: (id: number) => void;
  onCreateProject: () => void;
}

export function ProjectsDashboard({ onProjectClick, onCreateProject }: ProjectsDashboardProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  const filtered = PROJECTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCampaigns = PROJECTS.reduce((a, p) => a + p.campaigns, 0);
  const totalItems = PROJECTS.reduce((a, p) => a + p.contentItems, 0);
  const activeCount = PROJECTS.filter(p => p.status === 'active').length;

  return (
    <div className="flex flex-col flex-1 h-full bg-background overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-8">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Projects</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeCount} active · {totalCampaigns} campaigns · {totalItems} content items
              </p>
            </div>
            <button
              onClick={onCreateProject}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Projects', value: PROJECTS.length, icon: <FolderOpen className="w-5 h-5" /> },
              { label: 'Campaigns', value: totalCampaigns, icon: <Target className="w-5 h-5" /> },
              { label: 'Content Items', value: totalItems, icon: <FileText className="w-5 h-5" /> },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
              {(['all', 'active', 'paused'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded text-sm font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-auto">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} onClick={() => onProjectClick(project.id)} />
            ))}
            <button
              onClick={onCreateProject}
              className="group flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/[0.03] transition-all"
            >
              <div className="w-10 h-10 rounded-xl border border-dashed border-border group-hover:border-primary/40 flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                New Project
              </span>
              <span className="text-xs text-muted-foreground/50 mt-1">Start from scratch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const words = project.client.split(' ');
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : project.client.slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      className="group relative flex flex-col p-5 bg-card border border-border rounded-xl hover:shadow-xl hover:shadow-black/20 hover:border-border/60 transition-all text-left overflow-hidden cursor-pointer"
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: project.accentColor }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: project.accentColor + '22', color: project.accentColor }}
        >
          {initials}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            project.status === 'active'
              ? 'bg-primary/10 text-primary'
              : 'bg-yellow-500/10 text-yellow-400'
          }`}>
            {project.status}
          </span>
          <button
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all text-muted-foreground"
            onClick={e => e.stopPropagation()}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{project.client}</p>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{project.campaigns}</span> campaigns
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{project.contentItems}</span> items
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/50 mt-2">Updated {project.lastUpdated}</p>
    </div>
  );
}

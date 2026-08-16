import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/ui-store';
import { Plus, Search, Target, FileText, FolderOpen, MoreHorizontal } from 'lucide-react';
import { getProjects, createTemplateProject, type ProjectWithCounts } from '../../../lib/services/projects-service';

interface Project extends ProjectWithCounts {
  status: 'active' | 'paused' | 'completed';
  lastUpdated: string;
  accentColor: string;
}

export function ProjectsDashboard() {
  const { t } = useTranslation();
  const { openProjectModal } = useUIStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getProjects();

    // If no projects exist, create template project
    if (data.length === 0) {
      await createTemplateProject();
      const refreshed = await getProjects();
      setProjects(mapProjects(refreshed));
    } else {
      setProjects(mapProjects(data));
    }
    setLoading(false);
  };

  const mapProjects = (data: ProjectWithCounts[]): Project[] => {
    const colors = ['#F97316', '#8B5CF6', '#06B6D4', '#EC4899', '#EAB308', '#4B56F2', '#D946EF'];
    return data.map((p, i) => ({
      ...p,
      status: 'active' as const,
      lastUpdated: formatRelativeTime(p.updated_at),
      accentColor: colors[i % colors.length],
    }));
  };

  const formatRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCampaigns = projects.reduce((a, p) => a + p.campaigns_count, 0);
  const totalItems = projects.reduce((a, p) => a + p.content_items_count, 0);
  const activeCount = projects.filter(p => p.status === 'active').length;

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full bg-background overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-8">
            <div className="text-center text-muted-foreground">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-background overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-8">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{t('projects.title')}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeCount} {t('projects.active')} · {totalCampaigns} {t('projects.campaigns')} · {totalItems} {t('projects.contentItems')}
              </p>
            </div>
            <button
              onClick={() => openProjectModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: t('projects.totalProjects'), value: PROJECTS.length, icon: <FolderOpen className="w-5 h-5" /> },
              { label: t('projects.campaignsLabel'), value: totalCampaigns, icon: <Target className="w-5 h-5" /> },
              { label: t('projects.contentItemsLabel'), value: totalItems, icon: <FileText className="w-5 h-5" /> },
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
                placeholder={t('projects.searchPlaceholder')}
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
                  {s === 'all' ? t('projects.all') : s === 'active' ? t('projects.activeTab') : t('projects.paused')}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-auto">
              {t('projects.projectsCount', { count: filtered.length })}
            </span>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(project => (
              <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
            ))}
            <button
              onClick={() => openProjectModal()}
              className="group flex flex-col items-center justify-center min-h-[200px] rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/[0.03] transition-all"
            >
              <div className="w-10 h-10 rounded-xl border border-dashed border-border group-hover:border-primary/40 flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {t('projects.newProject')}
              </span>
              <span className="text-xs text-muted-foreground/50 mt-1">{t('projects.startFromScratch')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { t } = useTranslation();
  const words = project.name.split(' ');
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : project.name.slice(0, 2).toUpperCase();

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
            {project.status === 'active' ? t('projects.activeTab') : t('projects.paused')}
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
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {project.description || 'No description'}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{project.campaigns_count}</span> {t('projects.campaigns')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{project.content_items_count}</span> {t('dashboard.items')}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/50 mt-2">{t('projects.updated')} {project.lastUpdated}</p>
    </div>
  );
}

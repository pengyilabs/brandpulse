'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Zap, TrendingUp, Users, FileText, Calendar, ArrowRight, Loader2, AlertCircle, BarChart3, Target, ExternalLink, FolderKanban, Library } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useUIStore } from '../../stores/ui-store';

interface Project {
  id: string;
  name: string;
  created_at: string;
  domain: string | null;
  project_context: string | null;
}

interface DashboardStats {
  totalProjects: number;
  totalContent: number;
  recentProjects: number;
  totalResources: number;
}

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalProjects: 0, totalContent: 0, recentProjects: 0, totalResources: 0 });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const { setProjectCreationModalOpen } = useUIStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');

        // Fetch projects
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (projectData) {
          setProjects(projectData);
          setStats(prev => ({ ...prev, totalProjects: projectData.length }));
        }

        // Fetch content count
        const { count: contentCount } = await supabase
          .from('content_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats(prev => ({ ...prev, totalContent: contentCount || 0 }));

        // Fetch resources count
        const { count: resourceCount } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats(prev => ({ ...prev, totalResources: resourceCount || 0 }));

        // Recent projects (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentProjects = projectData?.filter(p => new Date(p.created_at) >= thirtyDaysAgo) || [];
        setStats(prev => ({ ...prev, recentProjects: recentProjects.length }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { icon: FolderKanban, label: 'Total Projects', value: stats.totalProjects, color: 'bg-blue-500/10 text-blue-500', gradient: 'from-blue-500/5 to-blue-500/0' },
    { icon: FileText, label: 'Content Items', value: stats.totalContent, color: 'bg-emerald-500/10 text-emerald-500', gradient: 'from-emerald-500/5 to-emerald-500/0' },
    { icon: TrendingUp, label: 'Recent Projects', value: stats.recentProjects, color: 'bg-amber-500/10 text-amber-500', gradient: 'from-amber-500/5 to-amber-500/0' },
    { icon: Library, label: 'Resources', value: stats.totalResources, color: 'bg-purple-500/10 text-purple-500', gradient: 'from-purple-500/5 to-purple-500/0' },
  ];

  const recentActivity = [
    { icon: Plus, text: 'New project created', time: '2 hours ago', color: 'text-emerald-500' },
    { icon: FileText, text: 'Content generated', time: '5 hours ago', color: 'text-blue-500' },
    { icon: Users, text: 'Team member added', time: '1 day ago', color: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 border-b border-border bg-card/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back{userName ? `, ${userName}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here's what's happening with your projects
            </p>
          </div>
          <button
            onClick={() => setProjectCreationModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Projects</h2>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <FolderKanban className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
                Create your first project to start generating content with AI
              </p>
              <button
                onClick={() => setProjectCreationModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {projects.slice(0, 6).map(project => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] text-left"
                >
                  <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {project.domain && (
                      <div className="flex items-center gap-1 mt-2">
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">{project.domain}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


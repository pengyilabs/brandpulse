'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, FileText, BookOpen, Library, Settings,
  LogOut, Menu, X, Zap, ChevronDown, ChevronRight, Plus, User,
  Palette, Volume2, Mic, FileImage, Image, AlertCircle,
} from 'lucide-react';
import { ProjectCreationModal } from '../projects/project-creation-modal';
import { useUIStore } from '../../stores/ui-store';
import { supabase } from '../../../lib/supabase';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  children?: { label: string; path: string }[];
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: FileText, label: 'Content', path: '/content' },
  { icon: Library, label: 'Resources', path: '/resources' },
];

const settingsNavItems: NavItem[] = [
  { icon: FileImage, label: 'Brand Kits', path: '/brand-kits' },
  { icon: User, label: 'Writer Profiles', path: '/writer-profiles' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    workspace: true,
  });

  const { setProjectCreationModalOpen } = useUIStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email ?? null);
        setUserName(data.user.user_metadata?.full_name ?? data.user.email ?? null);
      }
    });
  }, []);

  useEffect(() => {
    const unsub = useUIStore.subscribe((state) => {
      if (state.projectCreationModalOpen) {
        setProjectModalOpen(true);
        setProjectCreationModalOpen(false);
      }
    });
    return () => unsub();
  }, [setProjectCreationModalOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleProjectComplete = (project: any) => {
    setProjectModalOpen(false);
    navigate(`/projects/${project.id}`, { replace: true });
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/projects') return location.pathname.startsWith('/projects');
    if (path === '/content') return location.pathname.startsWith('/content');
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300 border-r border-border flex flex-col bg-card shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">BrandPulse</span>
        </div>

        {/* New Project Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setProjectModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Main</p>
          {mainNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}

          <div className="my-3 border-t border-border" />

          <p className="px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Settings</p>
          {settingsNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="relative px-3 py-3 border-t border-border">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-all text-sm"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-foreground truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || ''}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onComplete={handleProjectComplete}
      />
    </div>
  );
}
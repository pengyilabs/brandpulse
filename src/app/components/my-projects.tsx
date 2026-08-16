import { useState } from 'react';
import { MoreVertical, Video, Image, FileText, Film, Search, Edit2, Trash2 } from 'lucide-react';
import { ProjectDetail } from './project-detail';

export function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const projects = [
    {
      id: 1,
      name: 'Product Launch Video Campaign',
      type: 'video',
      folder: 'Marketing',
      created: '2 days ago',
      items: 15,
      status: 'completed',
      state: 'completed',
    },
    {
      id: 2,
      name: 'Social Media Graphics Pack',
      type: 'image',
      folder: 'Design',
      created: '5 days ago',
      items: 24,
      status: 'completed',
      state: 'approval pending',
    },
    {
      id: 3,
      name: 'Webinar Highlights Reel',
      type: 'video',
      folder: 'Events',
      created: '1 week ago',
      items: 8,
      status: 'completed',
      state: 'approval pending',
    },
    {
      id: 4,
      name: 'Blog Post Series - Q1',
      type: 'blog',
      folder: 'Content',
      created: '1 week ago',
      items: 12,
      status: 'completed',
      state: 'completed',
    },
    {
      id: 5,
      name: 'Tutorial Video Shorts',
      type: 'video',
      folder: 'Education',
      created: '2 weeks ago',
      items: 20,
      status: 'completed',
      state: 'approval pending',
    },
    {
      id: 6,
      name: 'Instagram Carousel Posts',
      type: 'image',
      folder: 'Social Media',
      created: '2 weeks ago',
      items: 10,
      status: 'completed',
      state: 'completed',
    },
    {
      id: 7,
      name: 'Conference Presentation Clips',
      type: 'video',
      folder: 'Events',
      created: '3 weeks ago',
      items: 6,
      status: 'completed',
      state: 'approval pending',
    },
    {
      id: 8,
      name: 'Email Newsletter Graphics',
      type: 'image',
      folder: 'Marketing',
      created: 'Nov 8, 2025',
      items: 18,
      status: 'completed',
      state: 'completed',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'image':
        return Image;
      case 'blog':
        return FileText;
      default:
        return Film;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/10 text-blue-400';
      case 'image':
        return 'bg-purple-500/10 text-purple-400';
      case 'blog':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'approval pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2">My Projects</h1>
            <p className="text-muted-foreground">View and manage all your created content</p>
          </div>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Create New Project
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <select className="px-4 py-3 bg-card border border-border rounded-lg text-foreground">
            <option>All Folders</option>
            <option>Marketing</option>
            <option>Design</option>
            <option>Events</option>
            <option>Content</option>
          </select>
          <select className="px-4 py-3 bg-card border border-border rounded-lg text-foreground">
            <option>All Types</option>
            <option>Video</option>
            <option>Image</option>
            <option>Blog</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {projects.map((project) => {
            const Icon = getIcon(project.type);
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
              >
                {/* Project Header */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(project.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${getStateColor(project.state)}`}>
                      <span className="text-xs font-medium capitalize">{project.state}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{project.type} project</p>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Folder</p>
                      <p className="text-foreground font-medium">{project.folder}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Items</p>
                      <p className="text-foreground font-medium">{project.items} items</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Created {project.created}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-destructive/20 rounded-lg transition-colors text-sm group"
                      >
                        <Trash2 className="w-4 h-4 group-hover:text-destructive transition-colors" />
                        <span className="group-hover:text-destructive transition-colors">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

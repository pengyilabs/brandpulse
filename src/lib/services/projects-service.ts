import { supabase } from '../supabase';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  default_brand_kit_id: string | null;
  default_writer_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCounts extends Project {
  campaigns_count: number;
  content_items_count: number;
}

export async function getProjects(): Promise<ProjectWithCounts[]> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      campaigns(count),
      content_items(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (projects || []).map(p => ({
    ...p,
    campaigns_count: p.campaigns?.[0]?.count || 0,
    content_items_count: p.content_items?.[0]?.count || 0,
  }));
}

export async function createProject(
  name: string,
  description?: string
): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description: description || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, 'name' | 'description' | 'default_brand_kit_id' | 'default_writer_profile_id'>>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

export async function createTemplateProject(): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Create template project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: 'Sample Project',
      description: 'This is an example project to help you get started. Feel free to explore, modify, or delete it.',
    })
    .select()
    .single();

  if (projectError || !project) {
    console.error('Error creating template project:', projectError);
    return null;
  }

  // Create sample content items
  const sampleContentItems = [
    {
      project_id: project.id,
      platform: 'instagram',
      content_type: 'image',
      status: 'draft',
      title: 'Welcome Post',
      description: 'Introduce your brand to the world',
      scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    },
    {
      project_id: project.id,
      platform: 'linkedin',
      content_type: 'article',
      status: 'draft',
      title: 'Industry Insights',
      description: 'Share thought leadership content',
      scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    },
    {
      project_id: project.id,
      platform: 'xiaohongshu',
      content_type: 'carousel',
      status: 'draft',
      title: 'Product Showcase',
      description: 'Highlight your offerings in a visual carousel',
      scheduled_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    },
  ];

  const { error: contentError } = await supabase
    .from('content_items')
    .insert(sampleContentItems);

  if (contentError) {
    console.error('Error creating sample content items:', contentError);
  }

  return project;
}

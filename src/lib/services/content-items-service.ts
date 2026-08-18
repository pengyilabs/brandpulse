import { supabase } from '../supabase';

export interface ContentItem {
  id: string;
  project_id: string;
  campaign_id: string | null;
  platform: string;
  content_type: string;
  status: string;
  title: string | null;
  description: string | null;
  scheduled_at: string | null;
  brand_kit_id: string | null;
  writer_profile_id: string | null;
  resource_ids: string[];
  generated_content_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getContentItems(
  projectId: string,
  campaignId?: string
): Promise<ContentItem[]> {
  let query = supabase
    .from('content_items')
    .select('*')
    .eq('project_id', projectId)
    .order('scheduled_at', { ascending: true, nullsFirst: false });

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching content items:', error);
    return [];
  }

  return data || [];
}

export async function getContentItem(id: string): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching content item:', error);
    return null;
  }

  return data;
}

export async function createContentItem(
  projectId: string,
  data: {
    campaign_id?: string | null;
    platform: string;
    content_type: string;
    title?: string | null;
    description?: string | null;
    scheduled_at?: string | null;
    brand_kit_id?: string | null;
    writer_profile_id?: string | null;
    resource_ids?: string[];
  }
): Promise<ContentItem | null> {
  const { data: result, error } = await supabase
    .from('content_items')
    .insert({
      project_id: projectId,
      campaign_id: data.campaign_id || null,
      platform: data.platform,
      content_type: data.content_type,
      title: data.title || null,
      description: data.description || null,
      scheduled_at: data.scheduled_at || null,
      brand_kit_id: data.brand_kit_id || null,
      writer_profile_id: data.writer_profile_id || null,
      resource_ids: data.resource_ids || [],
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating content item:', error);
    return null;
  }

  return result;
}

export async function updateContentItem(
  id: string,
  updates: Partial<Pick<ContentItem, 'title' | 'description' | 'status' | 'scheduled_at' | 'campaign_id' | 'brand_kit_id' | 'writer_profile_id' | 'resource_ids'>>
): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating content item:', error);
    return null;
  }

  return data;
}

export async function deleteContentItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting content item:', error);
    return false;
  }

  return true;
}

export async function getAllUserContentItems(): Promise<(ContentItem & { project_name?: string })[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .eq('user_id', user.id);

  if (!projects || projects.length === 0) return [];

  const projectMap = new Map(projects.map(p => [p.id, p.name]));

  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .in('project_id', projects.map(p => p.id))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user content items:', error);
    return [];
  }

  return (data || []).map(item => ({
    ...item,
    project_name: projectMap.get(item.project_id) || 'Unknown Project',
  }));
}

export async function getContentItemCount(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from('content_items')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) {
    console.error('Error counting content items:', error);
    return 0;
  }

  return count || 0;
}
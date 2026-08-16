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
  updates: Partial<Pick<ContentItem, 'title' | 'description' | 'status' | 'scheduled_at' | 'campaign_id'>>
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
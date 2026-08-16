import { supabase } from '../supabase';

export interface Campaign {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  brand_kit_id: string | null;
  writer_profile_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCampaigns(projectId: string): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }

  return data || [];
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }

  return data;
}

export async function createCampaign(
  projectId: string,
  name: string,
  description: string | null = null
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      project_id: projectId,
      name,
      description,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    return null;
  }

  return data;
}

export async function updateCampaign(
  id: string,
  updates: Partial<Pick<Campaign, 'name' | 'description'>>
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    return null;
  }

  return data;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting campaign:', error);
    return false;
  }

  return true;
}

export async function getCampaignCount(projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (error) {
    console.error('Error counting campaigns:', error);
    return 0;
  }

  return count || 0;
}
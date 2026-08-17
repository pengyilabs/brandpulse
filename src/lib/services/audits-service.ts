import { supabase } from '../supabase';

export interface Audit {
  id: string;
  user_id: string;
  url: string;
  name: string;
  date_range_start: string | null;
  date_range_end: string | null;
  profile_score: number | null;
  followers: string | null;
  growth: string | null;
  engagements: string | null;
  audit_data: any;
  created_at: string;
  updated_at: string;
}

export async function getAudits(): Promise<Audit[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching audits:', error);
    return [];
  }

  return data || [];
}

export async function getAudit(id: string): Promise<Audit | null> {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching audit:', error);
    return null;
  }

  return data;
}

export async function createAudit(
  url: string,
  name: string,
  data: {
    dateRangeStart?: Date | null;
    dateRangeEnd?: Date | null;
    profileScore?: number | null;
    followers?: string | null;
    growth?: string | null;
    engagements?: string | null;
    auditData?: any;
  } = {}
): Promise<Audit | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: audit, error } = await supabase
    .from('audits')
    .insert({
      user_id: user.id,
      url,
      name,
      date_range_start: data.dateRangeStart?.toISOString() ?? null,
      date_range_end: data.dateRangeEnd?.toISOString() ?? null,
      profile_score: data.profileScore ?? null,
      followers: data.followers ?? null,
      growth: data.growth ?? null,
      engagements: data.engagements ?? null,
      audit_data: data.auditData ?? {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating audit:', error);
    return null;
  }

  return audit;
}

export async function updateAudit(
  id: string,
  updates: Partial<Pick<Audit, 'url' | 'name' | 'date_range_start' | 'date_range_end' | 'profile_score' | 'followers' | 'growth' | 'engagements' | 'audit_data'>>
): Promise<Audit | null> {
  const { data, error } = await supabase
    .from('audits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating audit:', error);
    return null;
  }

  return data;
}

export async function deleteAudit(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting audit:', error);
    return false;
  }

  return true;
}

import { supabase } from '../supabase';

export interface WriterProfile {
  id: string;
  user_id: string;
  name: string;
  style: string | null;
  tone: string | null;
  topics: string[] | null;
  audience: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
}

export async function getWriterProfiles(): Promise<WriterProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('writer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching writer profiles:', error);
    return [];
  }

  return data || [];
}

export async function getWriterProfile(id: string): Promise<WriterProfile | null> {
  const { data, error } = await supabase
    .from('writer_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching writer profile:', error);
    return null;
  }

  return data;
}

export async function createWriterProfile(
  name: string,
  tone: string | null = null,
  style: string | null = null,
  description: string | null = null
): Promise<WriterProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('writer_profiles')
    .insert({
      user_id: user.id,
      name,
      tone,
      style,
      audience: description,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating writer profile:', error);
    return null;
  }

  return data;
}

export async function updateWriterProfile(
  id: string,
  updates: Partial<Pick<WriterProfile, 'name' | 'tone' | 'style' | 'audience'>>
): Promise<WriterProfile | null> {
  const { data, error } = await supabase
    .from('writer_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating writer profile:', error);
    return null;
  }

  return data;
}

export async function deleteWriterProfile(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('writer_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting writer profile:', error);
    return false;
  }

  return true;
}
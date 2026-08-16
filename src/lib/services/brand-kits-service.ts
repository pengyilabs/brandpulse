import { supabase } from '../supabase';

export interface BrandKit {
  id: string;
  user_id: string;
  name: string;
  colors: string[];
  fonts: string[];
  logo_url: string | null;
  tone_of_voice: string | null;
  created_at: string;
  updated_at: string;
}

export async function getBrandKits(): Promise<BrandKit[]> {
  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brand kits:', error);
    return [];
  }

  return data || [];
}

export async function getBrandKit(id: string): Promise<BrandKit | null> {
  const { data, error } = await supabase
    .from('brand_kits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching brand kit:', error);
    return null;
  }

  return data;
}

export async function createBrandKit(
  name: string,
  colors: string[] = [],
  fonts: string[] = [],
  logo_url: string | null = null,
  tone_of_voice: string | null = null
): Promise<BrandKit | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('brand_kits')
    .insert({
      user_id: user.id,
      name,
      colors,
      fonts,
      logo_url,
      tone_of_voice
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating brand kit:', error);
    return null;
  }

  return data;
}

export async function updateBrandKit(
  id: string,
  updates: Partial<Pick<BrandKit, 'name' | 'colors' | 'fonts' | 'logo_url' | 'tone_of_voice'>>
): Promise<BrandKit | null> {
  const { data, error } = await supabase
    .from('brand_kits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand kit:', error);
    return null;
  }

  return data;
}

export async function deleteBrandKit(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('brand_kits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting brand kit:', error);
    return false;
  }

  return true;
}

import { supabase } from '../supabase';

export interface Resource {
  id: string;
  user_id: string;
  project_id: string | null;
  name: string;
  type: 'image' | 'video' | 'document' | 'text';
  file_url: string;
  file_size: number;
  mime_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export async function getResources(projectId?: string): Promise<Resource[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data || [];
}

export async function getResource(id: string): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching resource:', error);
    return null;
  }

  return data;
}

export async function uploadResource(
  file: File,
  projectId: string | null = null,
  description: string | null = null
): Promise<Resource | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Determine resource type based on MIME type
  let type: Resource['type'] = 'document';
  if (file.type.startsWith('image/')) type = 'image';
  else if (file.type.startsWith('video/')) type = 'video';
  else if (file.type === 'text/plain' || file.type === 'application/pdf') type = 'document';

  // Upload file to Supabase Storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resources')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('resources')
    .getPublicUrl(fileName);

  // Create resource record in database
  const { data, error } = await supabase
    .from('resources')
    .insert({
      user_id: user.id,
      project_id: projectId,
      name: file.name,
      type,
      file_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
      description
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating resource record:', error);
    // Clean up uploaded file
    await supabase.storage.from('resources').remove([fileName]);
    return null;
  }

  return data;
}

export async function updateResource(
  id: string,
  updates: Partial<Pick<Resource, 'name' | 'description' | 'project_id'>>
): Promise<Resource | null> {
  const { data, error } = await supabase
    .from('resources')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating resource:', error);
    return null;
  }

  return data;
}

export async function deleteResource(id: string): Promise<boolean> {
  // Get resource to find file path
  const resource = await getResource(id);
  if (!resource) return false;

  // Extract file path from URL
  const urlParts = resource.file_url.split('/');
  const filePath = urlParts.slice(-2).join('/'); // user_id/filename

  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('resources')
    .remove([filePath]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    return false;
  }

  // Delete record from database
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting resource record:', error);
    return false;
  }

  return true;
}

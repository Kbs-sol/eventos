import { createServerClient } from '../server'
import type { MediaAsset } from '../types'

export async function getAllMedia(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<MediaAsset[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch media: ${error.message}`)
  return data ?? []
}

export async function getMediaByFolder(
  folder: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<MediaAsset[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('folder', folder)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch media by folder: ${error.message}`)
  return data ?? []
}

export async function createMediaAsset(
  asset: Partial<MediaAsset>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<MediaAsset> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('media_assets')
    .insert(asset)
    .select()
    .single()

  if (error) throw new Error(`Failed to create media asset: ${error.message}`)
  return data
}

export async function deleteMediaAsset(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<MediaAsset> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to delete media asset: ${error.message}`)
  return data
}

export async function getMediaStorageStats(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<{ totalFiles: number; totalBytes: number; folders: string[] }> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('media_assets')
    .select('size_bytes, folder')

  if (error) throw new Error(`Failed to fetch storage stats: ${error.message}`)

  const folders = new Set<string>()
  let totalBytes = 0

  data?.forEach((item: { size_bytes: number | null; folder: string | null }) => {
    totalBytes += item.size_bytes ?? 0
    if (item.folder) folders.add(item.folder)
  })

  return {
    totalFiles: data?.length ?? 0,
    totalBytes,
    folders: Array.from(folders),
  }
}

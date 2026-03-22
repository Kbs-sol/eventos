import { createServerClient } from '../server'
import type { SiteSetting } from '../types'

export async function getAllSettings(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Record<string, string>> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) throw new Error(`Failed to fetch settings: ${error.message}`)

  const result: Record<string, string> = {}
  data?.forEach((row: SiteSetting) => {
    if (row.value !== null) {
      result[row.key] = row.value
    }
  })

  return result
}

export async function getSetting(
  key: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<string | null> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch setting: ${error.message}`)
  return data?.value ?? null
}

export async function upsertSetting(
  key: string,
  value: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )

  if (error) throw new Error(`Failed to upsert setting: ${error.message}`)
}

export async function upsertMultipleSettings(
  settings: Record<string, string>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) throw new Error(`Failed to upsert settings: ${error.message}`)
}

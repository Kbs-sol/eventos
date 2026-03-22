import { createServerClient } from '../server'
import config from '@eventos/config'

function getConfigDefault(sectionId: string): boolean {
  const parts = sectionId.split('_')
  const page = parts[0]
  const rest = parts.slice(1)

  const camelKey = rest
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join('')

  try {
    const pageConfig = config.sections[page as keyof typeof config.sections] as Record<string, boolean>
    return pageConfig[camelKey] ?? false
  } catch {
    return false
  }
}

export async function getSectionVisibility(
  sectionId: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<boolean> {
  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('section_config')
      .select('is_visible')
      .eq('section_id', sectionId)
      .maybeSingle()

    if (error || data === null) {
      return getConfigDefault(sectionId)
    }
    return data.is_visible
  } catch {
    return getConfigDefault(sectionId)
  }
}

export async function getAllSectionVisibility(
  page: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Record<string, boolean>> {
  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey)
    const { data } = await supabase
      .from('section_config')
      .select('section_id, is_visible')
      .eq('page', page)

    const result: Record<string, boolean> = {}

    // First, populate from config defaults
    const pageConfig = config.sections[page as keyof typeof config.sections]
    if (pageConfig) {
      for (const [key, value] of Object.entries(pageConfig)) {
        result[`${page}_${key}`] = value as boolean
      }
    }

    // Then override with DB values
    data?.forEach((row: { section_id: string; is_visible: boolean }) => {
      result[row.section_id] = row.is_visible
    })

    return result
  } catch {
    const result: Record<string, boolean> = {}
    const pageConfig = config.sections[page as keyof typeof config.sections]
    if (pageConfig) {
      for (const [key, value] of Object.entries(pageConfig)) {
        result[`${page}_${key}`] = value as boolean
      }
    }
    return result
  }
}

export async function updateSectionVisibility(
  sectionId: string,
  isVisible: boolean,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('section_config')
    .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
    .eq('section_id', sectionId)

  if (error) {
    throw new Error(`Failed to update section visibility: ${error.message}`)
  }
}

export async function getAllSections(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Array<{ section_id: string; page: string; section_name: string; is_visible: boolean; sort_order: number; updated_at: string }>> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('section_config')
    .select('*')
    .order('page')
    .order('sort_order')

  if (error) {
    throw new Error(`Failed to fetch sections: ${error.message}`)
  }

  return data ?? []
}

import { createServerClient } from '../server'
import type { HeroSlide } from '../types'

export async function getVisibleHeroSlides(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<HeroSlide[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch hero slides: ${error.message}`)
  return data ?? []
}

export async function getAllHeroSlides(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<HeroSlide[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch all hero slides: ${error.message}`)
  return data ?? []
}

export async function createHeroSlide(
  slide: Partial<HeroSlide>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<HeroSlide> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('hero_slides')
    .insert(slide)
    .select()
    .single()

  if (error) throw new Error(`Failed to create hero slide: ${error.message}`)
  return data
}

export async function updateHeroSlide(
  id: string,
  updates: Partial<HeroSlide>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<HeroSlide> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('hero_slides')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update hero slide: ${error.message}`)
  return data
}

export async function deleteHeroSlide(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('hero_slides')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete hero slide: ${error.message}`)
}

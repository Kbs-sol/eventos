import { createServerClient } from '../server'
import type { PortfolioEvent, PortfolioImage } from '../types'

export async function getVisiblePortfolioEvents(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch portfolio: ${error.message}`)
  return data ?? []
}

export async function getFeaturedPortfolioEvents(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(6)

  if (error) throw new Error(`Failed to fetch featured portfolio: ${error.message}`)
  return data ?? []
}

export async function getPortfolioEvent(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent | null> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Failed to fetch event: ${error.message}`)
  return data
}

export async function getPortfolioImages(
  eventId: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioImage[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_visible', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch portfolio images: ${error.message}`)
  return data ?? []
}

export async function getAllPortfolioEvents(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch all portfolio: ${error.message}`)
  return data ?? []
}

export async function createPortfolioEvent(
  event: Partial<PortfolioEvent>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .insert(event)
    .select()
    .single()

  if (error) throw new Error(`Failed to create event: ${error.message}`)
  return data
}

export async function updatePortfolioEvent(
  id: string,
  updates: Partial<PortfolioEvent>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioEvent> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update event: ${error.message}`)
  return data
}

export async function deletePortfolioEvent(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('portfolio_events')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete event: ${error.message}`)
}

export async function createPortfolioImage(
  image: Partial<PortfolioImage>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<PortfolioImage> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('portfolio_images')
    .insert(image)
    .select()
    .single()

  if (error) throw new Error(`Failed to create image: ${error.message}`)
  return data
}

export async function deletePortfolioImage(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete image: ${error.message}`)
}

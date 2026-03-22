import { createServerClient } from '../server'
import type { Testimonial } from '../types'

export async function getVisibleTestimonials(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Testimonial[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch testimonials: ${error.message}`)
  return data ?? []
}

export async function getFeaturedTestimonials(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Testimonial[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(6)

  if (error) throw new Error(`Failed to fetch featured testimonials: ${error.message}`)
  return data ?? []
}

export async function getAllTestimonials(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Testimonial[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch all testimonials: ${error.message}`)
  return data ?? []
}

export async function createTestimonial(
  testimonial: Partial<Testimonial>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Testimonial> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) throw new Error(`Failed to create testimonial: ${error.message}`)
  return data
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Testimonial>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Testimonial> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update testimonial: ${error.message}`)
  return data
}

export async function deleteTestimonial(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete testimonial: ${error.message}`)
}

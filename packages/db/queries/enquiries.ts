import { createServerClient } from '../server'
import type { ContactEnquiry } from '../types'

export async function getAllEnquiries(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<ContactEnquiry[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch enquiries: ${error.message}`)
  return data ?? []
}

export async function getEnquiriesByStatus(
  status: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<ContactEnquiry[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch enquiries: ${error.message}`)
  return data ?? []
}

export async function getRecentEnquiries(
  limit: number = 5,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<ContactEnquiry[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Failed to fetch recent enquiries: ${error.message}`)
  return data ?? []
}

export async function createEnquiry(
  enquiry: Partial<ContactEnquiry>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<ContactEnquiry> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .insert(enquiry)
    .select()
    .single()

  if (error) throw new Error(`Failed to create enquiry: ${error.message}`)
  return data
}

export async function updateEnquiry(
  id: string,
  updates: Partial<ContactEnquiry>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<ContactEnquiry> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update enquiry: ${error.message}`)
  return data
}

export async function getEnquiryCount(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Record<string, number>> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)

  const counts: Record<string, number> = { new: 0, read: 0, replied: 0, archived: 0, total: 0 }

  for (const status of ['new', 'read', 'replied', 'archived'] as const) {
    const { count, error } = await supabase
      .from('contact_enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (!error && count !== null) {
      counts[status] = count
      counts.total += count
    }
  }

  return counts
}

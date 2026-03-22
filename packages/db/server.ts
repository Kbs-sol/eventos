import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let serverClient: SupabaseClient | null = null

export function createServerClient(url?: string, serviceRoleKey?: string): SupabaseClient {
  const supabaseUrl = url || process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL || ''
  const supabaseKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase server credentials')
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serverClient
}

export function createAnonClient(url?: string, anonKey?: string): SupabaseClient {
  const supabaseUrl = url || process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL || ''
  const supabaseAnonKey = anonKey || process.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase anon credentials')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

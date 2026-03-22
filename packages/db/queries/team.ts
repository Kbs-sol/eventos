import { createServerClient } from '../server'
import type { TeamMember } from '../types'

export async function getVisibleTeamMembers(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<TeamMember[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch team: ${error.message}`)
  return data ?? []
}

export async function getAllTeamMembers(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<TeamMember[]> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order')

  if (error) throw new Error(`Failed to fetch all team: ${error.message}`)
  return data ?? []
}

export async function createTeamMember(
  member: Partial<TeamMember>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<TeamMember> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('team_members')
    .insert(member)
    .select()
    .single()

  if (error) throw new Error(`Failed to create team member: ${error.message}`)
  return data
}

export async function updateTeamMember(
  id: string,
  updates: Partial<TeamMember>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<TeamMember> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from('team_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update team member: ${error.message}`)
  return data
}

export async function deleteTeamMember(
  id: string,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete team member: ${error.message}`)
}

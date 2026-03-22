import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const teamRoutes = new Hono<{ Bindings: Env }>()

// GET / — visible team members (public)
teamRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /all — all team members (admin)
teamRoutes.get('/all', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// POST / — create (admin)
const createSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().optional(),
  photo_key: z.string().optional(),
  is_founder: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  sort_order: z.number().default(0),
})

teamRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('team_members')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 201)
})

// PATCH /:id — update (admin)
teamRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = createSchema.partial().safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('team_members')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// DELETE /:id — delete (admin)
teamRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

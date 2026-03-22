import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const enquiriesRoutes = new Hono<{ Bindings: Env }>()

// GET / — all enquiries (admin)
enquiriesRoutes.get('/', async (c) => {
  const status = c.req.query('status')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

  let query = supabase
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /counts — enquiry counts by status (admin)
enquiriesRoutes.get('/counts', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const counts: Record<string, number> = { new: 0, read: 0, replied: 0, archived: 0, total: 0 }

  for (const status of ['new', 'read', 'replied', 'archived'] as const) {
    const { count } = await supabase
      .from('contact_enquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    if (count !== null) {
      counts[status] = count
      counts.total += count
    }
  }

  return c.json({ data: counts })
})

// GET /recent — recent enquiries (admin, for dashboard)
enquiriesRoutes.get('/recent', async (c) => {
  const limit = parseInt(c.req.query('limit') || '5', 10)
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// PATCH /:id — update enquiry status (admin)
const updateSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
  is_starred: z.boolean().optional(),
  internal_note: z.string().optional(),
})

enquiriesRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('contact_enquiries')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

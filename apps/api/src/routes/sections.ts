import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const sectionsRoutes = new Hono<{ Bindings: Env }>()

// GET / — list all sections (public, for page rendering)
sectionsRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('section_config')
    .select('*')
    .order('page')
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /page/:page — get all sections for a specific page
sectionsRoutes.get('/page/:page', async (c) => {
  const page = c.req.param('page')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('section_config')
    .select('section_id, is_visible')
    .eq('page', page)

  if (error) return c.json({ error: error.message }, 500)

  const result: Record<string, boolean> = {}
  data?.forEach((row: { section_id: string; is_visible: boolean }) => {
    result[row.section_id] = row.is_visible
  })

  return c.json({ data: result })
})

// PATCH /:sectionId — toggle section visibility (admin only)
const updateSchema = z.object({
  isVisible: z.boolean(),
})

sectionsRoutes.patch('/:sectionId', async (c) => {
  const sectionId = c.req.param('sectionId')
  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid request body', details: parsed.error.flatten() }, 400)
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('section_config')
    .update({
      is_visible: parsed.data.isVisible,
      updated_at: new Date().toISOString(),
    })
    .eq('section_id', sectionId)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

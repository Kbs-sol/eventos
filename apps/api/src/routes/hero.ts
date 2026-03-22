import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const heroRoutes = new Hono<{ Bindings: Env }>()

// GET / — list all hero slides (public: only visible, admin: all)
heroRoutes.get('/', async (c) => {
  const isAdmin = c.req.path.startsWith('/admin')
  const key = isAdmin ? c.env.SUPABASE_SERVICE_ROLE_KEY : c.env.SUPABASE_ANON_KEY
  const supabase = createClient(c.env.SUPABASE_URL, key)

  let query = supabase.from('hero_slides').select('*').order('sort_order')
  if (!isAdmin) {
    query = query.eq('is_visible', true)
  }

  const { data, error } = await query
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /:id — single slide
heroRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase.from('hero_slides').select('*').eq('id', id).single()
  if (error) return c.json({ error: error.message }, 404)
  return c.json({ data })
})

// POST / — create hero slide
const createSchema = z.object({
  image_key: z.string().nullable().optional(),
  video_url: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  subheadline: z.string().nullable().optional(),
  cta1_label: z.string().optional().default('Explore Our Work'),
  cta1_href: z.string().optional().default('/portfolio'),
  cta2_label: z.string().optional().default('Plan Your Event'),
  cta2_href: z.string().optional().default('/contact'),
  is_visible: z.boolean().optional().default(true),
  sort_order: z.number().optional().default(0),
})

heroRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Invalid body', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase.from('hero_slides').insert(parsed.data).select().single()
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 201)
})

// PATCH /:id — update hero slide
heroRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase.from('hero_slides').update(body).eq('id', id).select().single()
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// DELETE /:id — delete hero slide
heroRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase.from('hero_slides').delete().eq('id', id)
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

// POST /reorder — reorder slides
heroRoutes.post('/reorder', async (c) => {
  const { items } = await c.req.json() as { items: { id: string; sort_order: number }[] }
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

  for (const item of items) {
    await supabase.from('hero_slides').update({ sort_order: item.sort_order }).eq('id', item.id)
  }

  return c.json({ success: true })
})

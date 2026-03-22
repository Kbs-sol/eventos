import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const testimonialsRoutes = new Hono<{ Bindings: Env }>()

// GET / — visible testimonials (public)
testimonialsRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /featured — featured testimonials (public)
testimonialsRoutes.get('/featured', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(6)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /all — all testimonials (admin)
testimonialsRoutes.get('/all', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// POST / — create (admin)
const createSchema = z.object({
  client_name: z.string().min(1),
  client_company: z.string().optional(),
  event_type: z.string().optional(),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  photo_key: z.string().optional(),
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().default(0),
})

testimonialsRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('testimonials')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 201)
})

// PATCH /:id — update (admin)
testimonialsRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = createSchema.partial().safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('testimonials')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// DELETE /:id — delete (admin)
testimonialsRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

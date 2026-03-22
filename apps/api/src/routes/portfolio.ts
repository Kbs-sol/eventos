import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const portfolioRoutes = new Hono<{ Bindings: Env }>()

// GET / — list visible portfolio events (public)
portfolioRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /featured — featured events (public)
portfolioRoutes.get('/featured', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('sort_order')
    .limit(6)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /:id — single event (public)
portfolioRoutes.get('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return c.json({ error: error.message }, 404)
  return c.json({ data })
})

// GET /:id/images — event gallery images (public)
portfolioRoutes.get('/:id/images', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('event_id', id)
    .eq('is_visible', true)
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// GET /all — list ALL portfolio events (admin)
portfolioRoutes.get('/all', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .select('*')
    .order('sort_order')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// POST / — create event (admin)
const createEventSchema = z.object({
  title: z.string().min(1),
  event_type: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().optional(),
  description: z.string().optional(),
  cover_image: z.string().optional(),
  is_visible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().optional(),
})

portfolioRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 201)
})

// PATCH /:id — update event (admin)
portfolioRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = createEventSchema.partial().safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('portfolio_events')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// DELETE /:id — delete event (admin)
portfolioRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('portfolio_events')
    .delete()
    .eq('id', id)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

// POST /:id/images — add image to event (admin)
const imageSchema = z.object({
  image_key: z.string().min(1),
  alt_text: z.string().optional(),
  sort_order: z.number().optional(),
})

portfolioRoutes.post('/:id/images', async (c) => {
  const eventId = c.req.param('id')
  const body = await c.req.json()
  const parsed = imageSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('portfolio_images')
    .insert({ event_id: eventId, ...parsed.data })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 201)
})

// DELETE /images/:imageId — delete image (admin)
portfolioRoutes.delete('/images/:imageId', async (c) => {
  const imageId = c.req.param('imageId')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', imageId)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

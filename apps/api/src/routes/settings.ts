import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'

export const settingsRoutes = new Hono<{ Bindings: Env }>()

// GET / — all settings (public for some, admin for all)
settingsRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) return c.json({ error: error.message }, 500)

  const result: Record<string, string | null> = {}
  data?.forEach((row: { key: string; value: string | null }) => {
    result[row.key] = row.value
  })

  return c.json({ data: result })
})

// PATCH / — update multiple settings (admin)
const updateSchema = z.record(z.string(), z.string().nullable())

settingsRoutes.patch('/', async (c) => {
  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

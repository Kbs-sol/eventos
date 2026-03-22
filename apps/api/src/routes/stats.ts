import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'
import config from '@eventos/config'

export const statsRoutes = new Hono<{ Bindings: Env }>()

// GET / — stats with overrides (public)
statsRoutes.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data: overrides } = await supabase
    .from('stats_override')
    .select('*')

  const overrideMap = new Map<string, Record<string, unknown>>()
  overrides?.forEach((o: Record<string, unknown>) => {
    overrideMap.set(o.stat_id as string, o)
  })

  const stats = config.stats.map((stat) => {
    const override = overrideMap.get(stat.id)
    return {
      id: stat.id,
      label: (override?.label as string) ?? stat.label,
      value: (override?.value as number) ?? stat.value,
      suffix: (override?.suffix as string) ?? stat.suffix,
      visible: (override?.is_visible as boolean) ?? stat.visible,
    }
  })

  return c.json({ data: stats })
})

// PATCH /:statId — update stat (admin)
const updateSchema = z.object({
  label: z.string().optional(),
  value: z.number().optional(),
  suffix: z.string().optional(),
  is_visible: z.boolean().optional(),
})

statsRoutes.patch('/:statId', async (c) => {
  const statId = c.req.param('statId')
  const body = await c.req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('stats_override')
    .upsert({ stat_id: statId, ...parsed.data }, { onConflict: 'stat_id' })

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true })
})

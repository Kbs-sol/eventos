import { createServerClient } from '../server'
import config from '@eventos/config'
import type { StatOverride } from '../types'

export async function getStatsWithOverrides(
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<Array<{ id: string; label: string; value: number; suffix: string; visible: boolean }>> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { data: overrides } = await supabase
    .from('stats_override')
    .select('*')

  const overrideMap = new Map<string, StatOverride>()
  overrides?.forEach((o: StatOverride) => overrideMap.set(o.stat_id, o))

  return config.stats.map((stat) => {
    const override = overrideMap.get(stat.id)
    return {
      id: stat.id,
      label: override?.label ?? stat.label,
      value: override?.value ?? stat.value,
      suffix: override?.suffix ?? stat.suffix,
      visible: override?.is_visible ?? stat.visible,
    }
  })
}

export async function updateStatOverride(
  statId: string,
  updates: Partial<StatOverride>,
  supabaseUrl?: string,
  supabaseKey?: string,
): Promise<void> {
  const supabase = createServerClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('stats_override')
    .upsert({ stat_id: statId, ...updates }, { onConflict: 'stat_id' })

  if (error) throw new Error(`Failed to update stat: ${error.message}`)
}

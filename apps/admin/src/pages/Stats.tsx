import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { PageHeader } from '../components/ui/Shared'
import config from '@eventos/config'

export default function Stats() {
  const [stats, setStats] = useState(config.stats.map(s => ({ ...s })))

  function updateStat(id: string, field: string, value: string | number | boolean) {
    setStats(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  return (
    <div>
      <PageHeader title="Stats Counters" description="Edit the statistics displayed on your about page" />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map(stat => (
          <Card key={stat.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">#</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
                  <p className="text-xs text-gray-500">ID: {stat.id}</p>
                </div>
              </div>
              <Toggle checked={stat.visible} onChange={v => updateStat(stat.id, 'visible', v)} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Value</label>
                <input type="number" value={stat.value} onChange={e => updateStat(stat.id, 'value', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Suffix</label>
                <input value={stat.suffix} onChange={e => updateStat(stat.id, 'suffix', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">Label</label>
                <input value={stat.label} onChange={e => updateStat(stat.id, 'label', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-gray-50 text-center">
              <span className="text-3xl font-bold text-indigo-600">{stat.value}{stat.suffix}</span>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Stats defaults come from <code className="bg-blue-100 px-1 rounded">brand.config.ts</code>. 
          Connect Supabase to persist admin overrides in the <code className="bg-blue-100 px-1 rounded">stats_override</code> table.
        </p>
      </div>
    </div>
  )
}

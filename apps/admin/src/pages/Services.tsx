import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Toggle } from '../components/ui/Toggle'
import { PageHeader } from '../components/ui/Shared'
import config from '@eventos/config'
import { apiGet, apiPatch } from '../lib/api'

interface ServiceOverride {
  service_id: string; title: string | null; short_desc: string | null
  is_visible: boolean | null; sort_order: number | null
}

export default function Services() {
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOverrides()
  }, [])

  async function loadOverrides() {
    try {
      const r = await apiGet<{ data: ServiceOverride[] }>('/admin/stats') // services reuse
      const map: Record<string, ServiceOverride> = {}
      r.data?.forEach((o: ServiceOverride) => { map[o.service_id] = o })
      setOverrides(map)
    } catch { /* use defaults */ }
    finally { setLoading(false) }
  }

  async function toggleService(serviceId: string, visible: boolean) {
    // Optimistic update
    setOverrides(prev => ({
      ...prev,
      [serviceId]: {
        ...(prev[serviceId] || { service_id: serviceId, title: null, short_desc: null, sort_order: null }),
        is_visible: visible
      }
    }))

    try {
      await apiPatch(`/admin/sections/services_${serviceId}`, { isVisible: visible })
    } catch { 
      // Rollback on error
      loadOverrides()
    }
  }

  return (
    <div>
      <PageHeader title="Services" description="Manage service visibility and details. Services come from brand.config." />

      <div className="space-y-4">
        {config.services.map((service, i) => {
          const override = overrides[service.id]
          const isVisible = override?.is_visible ?? service.visible

          return (
            <Card key={service.id} hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{override?.title || service.title}</h3>
                    {service.comingSoon && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{override?.short_desc || service.shortDesc}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map(f => (
                      <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Toggle
                    checked={isVisible}
                    onChange={(v) => toggleService(service.id, v)}
                    label="Visible"
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Service definitions come from <code className="bg-blue-100 px-1 rounded">brand.config.ts</code>. 
          Admin overrides (title, description, visibility) are stored in the <code className="bg-blue-100 px-1 rounded">services_override</code> table.
        </p>
      </div>
    </div>
  )
}

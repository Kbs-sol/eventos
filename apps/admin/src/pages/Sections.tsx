import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Toggle } from '../components/ui/Toggle'
import { Badge } from '../components/ui/Badge'
import { PageHeader } from '../components/ui/Shared'
import { apiGet, apiPatch } from '../lib/api'

interface SectionRow {
  section_id: string
  page: string
  section_name: string
  is_visible: boolean
  sort_order: number
}

const pageLabels: Record<string, string> = {
  home: 'Home Page',
  about: 'About Page',
  services: 'Services Page',
  portfolio: 'Portfolio Page',
  contact: 'Contact Page',
}

const pageIcons: Record<string, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  about: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  services: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  portfolio: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14',
  contact: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
}

export default function Sections() {
  const [sections, setSections] = useState<SectionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    loadSections()
  }, [])

  async function loadSections() {
    try {
      const res = await apiGet<{ data: SectionRow[] }>('/admin/sections')
      setSections(res.data)
    } catch {
      // Use defaults from config when API is not connected
      setSections([])
    } finally {
      setLoading(false)
    }
  }

  async function toggleSection(sectionId: string, isVisible: boolean) {
    setToggling(sectionId)
    try {
      await apiPatch(`/admin/sections/${sectionId}`, { isVisible })
      setSections((prev) => prev.map((s) => (s.section_id === sectionId ? { ...s, is_visible: isVisible } : s)))
    } catch (err) {
      console.error('Toggle failed:', err)
    } finally {
      setToggling(null)
    }
  }

  // Group by page
  const grouped = sections.reduce<Record<string, SectionRow[]>>((acc, s) => {
    ;(acc[s.page] = acc[s.page] || []).push(s)
    return acc
  }, {})

  if (loading) {
    return (
      <div>
        <PageHeader title="Sections" description="Control which sections appear on each page" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div>
        <PageHeader title="Sections" description="Control which sections appear on each page" />
        <Card className="text-center py-12">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p className="text-sm text-gray-500 mb-2">Connect Supabase to manage section visibility</p>
          <p className="text-xs text-gray-400">Section defaults come from brand.config.ts</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Sections" description="Toggle sections on or off for each page. Changes are live immediately." />

      <div className="space-y-6">
        {Object.entries(grouped).map(([page, pageSections]) => (
          <Card key={page}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={pageIcons[page] || pageIcons.home} />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{pageLabels[page] || page}</h3>
                <p className="text-xs text-gray-500">{pageSections.filter((s) => s.is_visible).length} of {pageSections.length} sections visible</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {pageSections.sort((a, b) => a.sort_order - b.sort_order).map((section) => (
                <div key={section.section_id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${section.is_visible ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <span className="text-sm font-medium text-gray-700">{section.section_name}</span>
                    {!section.is_visible && <Badge variant="default">Hidden</Badge>}
                  </div>
                  <Toggle
                    checked={section.is_visible}
                    onChange={(v) => toggleSection(section.section_id, v)}
                    disabled={toggling === section.section_id}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

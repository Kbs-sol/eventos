import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { PageHeader, EmptyState } from '../components/ui/Shared'
import { apiGet, apiPatch } from '../lib/api'

interface Enquiry {
  id: string; name: string; email: string; phone: string | null
  event_type: string | null; event_date: string | null; guest_count: string | null
  budget: string | null; message: string | null; status: string
  is_starred: boolean; internal_note: string | null; created_at: string
}

const statusOptions = ['new', 'read', 'replied', 'archived']

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await apiGet<{ data: Enquiry[] }>('/admin/enquiries'); setEnquiries(r.data || []) }
    catch { setEnquiries([]) } finally { setLoading(false) }
  }

  async function updateStatus(id: string, status: string) {
    try { await apiPatch(`/admin/enquiries/${id}`, { status }); await load() } catch {}
  }

  async function toggleStar(id: string, starred: boolean) {
    try { await apiPatch(`/admin/enquiries/${id}`, { is_starred: starred }); await load() } catch {}
  }

  const filtered = filter === 'all' ? enquiries : filter === 'starred' ? enquiries.filter(e => e.is_starred) : enquiries.filter(e => e.status === filter)

  const counts = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    starred: enquiries.filter(e => e.is_starred).length,
  }

  return (
    <div>
      <PageHeader title="Enquiries" description={`${counts.new} new enquiries`} />

      {/* Filter bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: `All (${counts.all})` },
          { key: 'new', label: `New (${counts.new})` },
          { key: 'read', label: 'Read' },
          { key: 'replied', label: 'Replied' },
          { key: 'starred', label: `Starred (${counts.starred})` },
          { key: 'archived', label: 'Archived' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" title="No enquiries found" description={filter !== 'all' ? 'Try a different filter' : 'Enquiries will appear here when visitors submit the contact form'} />
      ) : (
        <div className="space-y-2">
          {filtered.map(eq => (
            <div key={eq.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => setSelected(eq)}>
              <div className="flex items-start gap-4">
                <button onClick={e => { e.stopPropagation(); toggleStar(eq.id, !eq.is_starred) }} className="mt-1 flex-shrink-0">
                  <svg className={`w-5 h-5 ${eq.is_starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} fill={eq.is_starred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{eq.name}</span>
                    <StatusBadge status={eq.status} />
                  </div>
                  <p className="text-xs text-gray-500">{eq.email}{eq.phone ? ` · ${eq.phone}` : ''}</p>
                  {eq.message && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{eq.message}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] text-gray-400">{new Date(eq.created_at).toLocaleDateString()}</p>
                  {eq.event_type && <Badge variant="default" className="mt-1">{eq.event_type}</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Enquiry Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-medium text-gray-500 mb-1">Name</p><p className="text-sm font-semibold text-gray-900">{selected.name}</p></div>
              <div><p className="text-[11px] font-medium text-gray-500 mb-1">Email</p><p className="text-sm text-gray-900"><a href={`mailto:${selected.email}`} className="text-indigo-600 hover:underline">{selected.email}</a></p></div>
              {selected.phone && <div><p className="text-[11px] font-medium text-gray-500 mb-1">Phone</p><p className="text-sm text-gray-900"><a href={`tel:${selected.phone}`} className="text-indigo-600 hover:underline">{selected.phone}</a></p></div>}
              {selected.event_type && <div><p className="text-[11px] font-medium text-gray-500 mb-1">Event Type</p><p className="text-sm text-gray-900">{selected.event_type}</p></div>}
              {selected.event_date && <div><p className="text-[11px] font-medium text-gray-500 mb-1">Event Date</p><p className="text-sm text-gray-900">{new Date(selected.event_date).toLocaleDateString()}</p></div>}
              {selected.guest_count && <div><p className="text-[11px] font-medium text-gray-500 mb-1">Guests</p><p className="text-sm text-gray-900">{selected.guest_count}</p></div>}
              {selected.budget && <div><p className="text-[11px] font-medium text-gray-500 mb-1">Budget</p><p className="text-sm text-gray-900">{selected.budget}</p></div>}
            </div>
            {selected.message && (
              <div><p className="text-[11px] font-medium text-gray-500 mb-1">Message</p><p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.message}</p></div>
            )}
            <div className="flex items-center gap-3 pt-4 border-t">
              <p className="text-xs font-medium text-gray-500 mr-2">Status:</p>
              {statusOptions.map(s => (
                <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }) }} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selected.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

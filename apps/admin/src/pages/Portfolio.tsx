import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { PageHeader, EmptyState } from '../components/ui/Shared'
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api'

interface PortfolioEvent {
  id: string; title: string; event_type: string | null; location: string | null
  event_date: string | null; description: string | null; cover_image: string | null
  is_visible: boolean; is_featured: boolean; sort_order: number
}

export default function Portfolio() {
  const [events, setEvents] = useState<PortfolioEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<Partial<PortfolioEvent> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await apiGet<{ data: PortfolioEvent[] }>('/admin/portfolio'); setEvents(r.data || []) }
    catch { setEvents([]) } finally { setLoading(false) }
  }

  function openNew() { setEdit({ title: '', event_type: '', location: '', description: '', is_visible: true, is_featured: false, sort_order: 0 }); setModalOpen(true) }
  function openEdit(ev: PortfolioEvent) { setEdit({ ...ev }); setModalOpen(true) }

  async function save() {
    if (!edit) return; setSaving(true)
    try {
      if (edit.id) { await apiPatch(`/admin/portfolio/${edit.id}`, edit) }
      else { await apiPost('/admin/portfolio', edit) }
      await load(); setModalOpen(false)
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  async function remove(id: string) {
    if (!confirm('Delete this event?')) return
    try { await apiDelete(`/admin/portfolio/${id}`); await load() } catch {}
  }

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit(p => p ? { ...p, [f]: e.target.value } : null)

  return (
    <div>
      <PageHeader title="Portfolio" description="Manage your portfolio events and galleries">
        <Button onClick={openNew}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Event
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-60" />)}</div>
      ) : events.length === 0 ? (
        <EmptyState icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" title="No portfolio events" description="Add your first event to showcase your work" action={<Button onClick={openNew} size="sm">Add Event</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(ev => (
            <Card key={ev.id} padding="none" hover className="overflow-hidden group">
              <div className="aspect-video relative" style={{ background: 'linear-gradient(135deg, #1a1a2e, #C9A84C)' }}>
                {ev.cover_image && <img src={ev.cover_image} alt={ev.title} className="w-full h-full object-cover" />}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  {ev.is_featured && <Badge variant="primary">Featured</Badge>}
                  {!ev.is_visible && <Badge variant="default">Hidden</Badge>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{ev.title}</h3>
                <p className="text-xs text-gray-500">{[ev.event_type, ev.location].filter(Boolean).join(' · ')}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <Toggle checked={ev.is_visible} onChange={v => apiPatch(`/admin/portfolio/${ev.id}`, { is_visible: v }).then(load)} size="sm" />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => remove(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={edit?.id ? 'Edit Event' : 'New Event'}>
        <div className="space-y-4">
          <Input label="Title" required value={edit?.title || ''} onChange={upd('title')} placeholder="Annual Corporate Gala" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Event Type" value={edit?.event_type || ''} onChange={upd('event_type')} placeholder="Wedding, Corporate..." />
            <Input label="Location" value={edit?.location || ''} onChange={upd('location')} placeholder="The Taj, Bengaluru" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Event Date" type="date" value={edit?.event_date || ''} onChange={upd('event_date')} />
            <Input label="Cover Image Key" value={edit?.cover_image || ''} onChange={upd('cover_image')} placeholder="portfolio/event-cover.webp" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} value={edit?.description || ''} onChange={upd('description')} placeholder="Brief description of the event..." className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" />
          </div>
          <div className="flex gap-6">
            <Toggle checked={edit?.is_visible ?? true} onChange={v => setEdit(p => p ? { ...p, is_visible: v } : null)} label="Visible" />
            <Toggle checked={edit?.is_featured ?? false} onChange={v => setEdit(p => p ? { ...p, is_featured: v } : null)} label="Featured" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{edit?.id ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

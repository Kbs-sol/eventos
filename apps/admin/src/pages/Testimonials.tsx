import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { PageHeader, EmptyState } from '../components/ui/Shared'
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api'

interface Testimonial {
  id: string; client_name: string; client_company: string | null; event_type: string | null
  quote: string; rating: number; photo_key: string | null; is_visible: boolean; is_featured: boolean; sort_order: number
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<Partial<Testimonial> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await apiGet<{ data: Testimonial[] }>('/admin/testimonials'); setItems(r.data || []) }
    catch { setItems([]) } finally { setLoading(false) }
  }

  function openNew() { setEdit({ client_name: '', quote: '', rating: 5, client_company: '', event_type: '', is_visible: true, is_featured: false, sort_order: 0 }); setModalOpen(true) }
  function openEdit(t: Testimonial) { setEdit({ ...t }); setModalOpen(true) }

  async function save() {
    if (!edit) return; setSaving(true)
    try {
      if (edit.id) { await apiPatch(`/admin/testimonials/${edit.id}`, edit) }
      else { await apiPost('/admin/testimonials', edit) }
      await load(); setModalOpen(false)
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  async function remove(id: string) {
    if (!confirm('Delete this testimonial?')) return
    try { await apiDelete(`/admin/testimonials/${id}`); await load() } catch {}
  }

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit(p => p ? { ...p, [f]: e.target.value } : null)

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client testimonials displayed on your website">
        <Button onClick={openNew}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Testimonial
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">{[1,2].map(i => <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-40" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" title="No testimonials yet" description="Add client testimonials to build trust" action={<Button onClick={openNew} size="sm">Add First Testimonial</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(t => (
            <Card key={t.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold flex-shrink-0">
                    {t.client_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.client_name}</p>
                    <p className="text-xs text-gray-500">{[t.client_company, t.event_type].filter(Boolean).join(' · ')}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {t.is_featured && <Badge variant="primary">Featured</Badge>}
                  {!t.is_visible && <Badge variant="default">Hidden</Badge>}
                </div>
              </div>
              <Stars rating={t.rating} />
              <p className="text-sm text-gray-600 mt-3 line-clamp-3 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <Toggle checked={t.is_visible} onChange={v => apiPatch(`/admin/testimonials/${t.id}`, { is_visible: v }).then(load)} size="sm" />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={edit?.id ? 'Edit Testimonial' : 'New Testimonial'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Client Name" required value={edit?.client_name || ''} onChange={upd('client_name')} placeholder="Sarah Johnson" />
            <Input label="Company" value={edit?.client_company || ''} onChange={upd('client_company')} placeholder="TechCorp India" />
          </div>
          <Input label="Event Type" value={edit?.event_type || ''} onChange={upd('event_type')} placeholder="Wedding, Corporate..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quote <span className="text-red-500">*</span></label>
            <textarea rows={3} required value={edit?.quote || ''} onChange={upd('quote')} placeholder="The event was absolutely phenomenal..." className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} type="button" onClick={() => setEdit(p => p ? { ...p, rating: i } : null)} className={`p-1 ${i <= (edit?.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </button>
              ))}
            </div>
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

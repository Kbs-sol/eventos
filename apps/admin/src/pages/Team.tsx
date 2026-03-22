import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Toggle } from '../components/ui/Toggle'
import { Modal } from '../components/ui/Modal'
import { PageHeader, EmptyState } from '../components/ui/Shared'
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api'

interface TeamMember {
  id: string; name: string; role: string | null; bio: string | null
  photo_key: string | null; is_founder: boolean; is_visible: boolean; sort_order: number
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [edit, setEdit] = useState<Partial<TeamMember> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await apiGet<{ data: TeamMember[] }>('/admin/team'); setMembers(r.data || []) }
    catch { setMembers([]) } finally { setLoading(false) }
  }

  function openNew() { setEdit({ name: '', role: '', bio: '', is_founder: false, is_visible: true, sort_order: 0 }); setModalOpen(true) }
  function openEdit(m: TeamMember) { setEdit({ ...m }); setModalOpen(true) }

  async function save() {
    if (!edit) return; setSaving(true)
    try {
      if (edit.id) { await apiPatch(`/admin/team/${edit.id}`, edit) }
      else { await apiPost('/admin/team', edit) }
      await load(); setModalOpen(false)
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  async function remove(id: string) {
    if (!confirm('Remove this team member?')) return
    try { await apiDelete(`/admin/team/${id}`); await load() } catch {}
  }

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit(p => p ? { ...p, [f]: e.target.value } : null)

  return (
    <div>
      <PageHeader title="Team Members" description="Manage the team grid on your about page">
        <Button onClick={openNew}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Member
        </Button>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="animate-pulse rounded-xl bg-gray-100 h-48" />)}</div>
      ) : members.length === 0 ? (
        <EmptyState icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" title="No team members" description="Add your team to show on the about page" action={<Button onClick={openNew} size="sm">Add First Member</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map(m => (
            <Card key={m.id} hover>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role || 'No role'}</p>
                  {m.is_founder && <span className="text-[10px] font-medium text-indigo-600 uppercase">Founder</span>}
                </div>
              </div>
              {m.bio && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{m.bio}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Toggle checked={m.is_visible} onChange={v => apiPatch(`/admin/team/${m.id}`, { is_visible: v }).then(load)} size="sm" />
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={edit?.id ? 'Edit Member' : 'New Member'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" required value={edit?.name || ''} onChange={upd('name')} placeholder="John Doe" />
            <Input label="Role" value={edit?.role || ''} onChange={upd('role')} placeholder="Creative Director" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea rows={3} value={edit?.bio || ''} onChange={upd('bio')} placeholder="Short bio..." className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <Input label="Photo Key (R2)" value={edit?.photo_key || ''} onChange={upd('photo_key')} placeholder="team/john.webp" />
          <div className="flex gap-6">
            <Toggle checked={edit?.is_visible ?? true} onChange={v => setEdit(p => p ? { ...p, is_visible: v } : null)} label="Visible" />
            <Toggle checked={edit?.is_founder ?? false} onChange={v => setEdit(p => p ? { ...p, is_founder: v } : null)} label="Founder" />
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

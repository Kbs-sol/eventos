import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { PageHeader, EmptyState } from '../components/ui/Shared'
import { apiGet, apiPost, apiDelete } from '../lib/api'

interface MediaAsset {
  id: string; filename: string; r2_key: string; folder: string | null
  size_bytes: number | null; width: number | null; height: number | null
  mime_type: string; created_at: string
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Media() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [newLink, setNewLink] = useState({ url: '', filename: '', mimeType: 'video/embed' })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { const r = await apiGet<{ data: MediaAsset[] }>('/admin/upload'); setAssets(r.data || []) }
    catch { setAssets([]) } finally { setLoading(false) }
  }

  async function remove(id: string) {
    if (!confirm('Delete this file?')) return
    try { await apiDelete(`/admin/upload/${id}`); await load() } catch {}
  }

  async function saveLink() {
    if (!newLink.url || !newLink.filename) return alert('Please fill in all fields')
    setIsSaving(true)
    try {
      await apiPost('/admin/upload/link', newLink)
      setIsLinkModalOpen(false)
      setNewLink({ url: '', filename: '', mimeType: 'video/embed' })
      await load()
    } catch (err: any) {
      alert(err.message || 'Failed to save link')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Media Library" description={`${assets.length} files`}>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
          </div>
          <Button variant="secondary" onClick={() => setIsLinkModalOpen(true)}>
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
             Add Link
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload
          </Button>
        </div>
      </PageHeader>


      {loading ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{[1,2,3,4].map(i => <div key={i} className="animate-pulse rounded-xl bg-gray-100 aspect-square" />)}</div>
      ) : assets.length === 0 ? (
        <EmptyState
          icon="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          title="No media files"
          description="Upload images and files to use across your website. Connect Supabase & R2 to enable uploads."
        />
      ) : view === 'grid' ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map(a => (
            <Card key={a.id} padding="none" hover className="overflow-hidden group">
              <div className="aspect-square relative bg-gray-100">
                {a.mime_type.startsWith('image/') ? (
                  <img src={a.r2_key} alt={a.filename} className="w-full h-full object-cover" />
                ) : a.mime_type === 'video/embed' || a.folder === 'external' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4">
                    <svg className="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <span className="text-[10px] text-gray-400 font-medium">External Link</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <button onClick={() => remove(a.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-50 transition-all shadow">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-900 truncate">{a.filename}</p>
                <p className="text-[10px] text-gray-400">{formatBytes(a.size_bytes)} {a.width && a.height ? `· ${a.width}x${a.height}` : ''}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="text-left text-xs font-medium text-gray-500 px-4 py-3">File</th><th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Size</th><th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Type</th><th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th><th className="w-10"></th></tr></thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{a.filename}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatBytes(a.size_bytes)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.mime_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><button onClick={() => remove(a.id)} className="p-1 text-gray-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Add External Media Link"
        description="Add a link from Google Drive, Supabase, or R2."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLinkModalOpen(false)}>Cancel</Button>
            <Button onClick={saveLink} loading={isSaving}>Save Link</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Filename / Title"
            value={newLink.filename}
            onChange={(e: any) => setNewLink({ ...newLink, filename: e.target.value })}
            placeholder="e.g. Wedding Highlight Video"
          />
          <Input
            label="Direct Link / Embed URL"
            value={newLink.url}
            onChange={(e: any) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="https://..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
            <select
              value={newLink.mimeType}
              onChange={(e) => setNewLink({ ...newLink, mimeType: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white border"
            >
              <option value="video/embed">Video (Embed)</option>
              <option value="image/external">Image (External Link)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}


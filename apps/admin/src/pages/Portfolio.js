import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { PageHeader, EmptyState } from '../components/ui/Shared';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
export default function Portfolio() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [edit, setEdit] = useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => { load(); }, []);
    async function load() {
        try {
            const r = await apiGet('/admin/portfolio');
            setEvents(r.data || []);
        }
        catch {
            setEvents([]);
        }
        finally {
            setLoading(false);
        }
    }
    function openNew() { setEdit({ title: '', event_type: '', location: '', description: '', is_visible: true, is_featured: false, sort_order: 0 }); setModalOpen(true); }
    function openEdit(ev) { setEdit({ ...ev }); setModalOpen(true); }
    async function save() {
        if (!edit)
            return;
        setSaving(true);
        try {
            if (edit.id) {
                await apiPatch(`/admin/portfolio/${edit.id}`, edit);
            }
            else {
                await apiPost('/admin/portfolio', edit);
            }
            await load();
            setModalOpen(false);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setSaving(false);
        }
    }
    async function remove(id) {
        if (!confirm('Delete this event?'))
            return;
        try {
            await apiDelete(`/admin/portfolio/${id}`);
            await load();
        }
        catch { }
    }
    const upd = (f) => (e) => setEdit(p => p ? { ...p, [f]: e.target.value } : null);
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Portfolio", description: "Manage your portfolio events and galleries", children: _jsxs(Button, { onClick: openNew, children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Add Event"] }) }), loading ? (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map(i => _jsx("div", { className: "animate-pulse rounded-xl bg-gray-100 h-60" }, i)) })) : events.length === 0 ? (_jsx(EmptyState, { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", title: "No portfolio events", description: "Add your first event to showcase your work", action: _jsx(Button, { onClick: openNew, size: "sm", children: "Add Event" }) })) : (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: events.map(ev => (_jsxs(Card, { padding: "none", hover: true, className: "overflow-hidden group", children: [_jsxs("div", { className: "aspect-video relative", style: { background: 'linear-gradient(135deg, #1a1a2e, #C9A84C)' }, children: [ev.cover_image && _jsx("img", { src: ev.cover_image, alt: ev.title, className: "w-full h-full object-cover" }), _jsxs("div", { className: "absolute top-2 left-2 flex gap-1.5", children: [ev.is_featured && _jsx(Badge, { variant: "primary", children: "Featured" }), !ev.is_visible && _jsx(Badge, { variant: "default", children: "Hidden" })] })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-sm text-gray-900 mb-1", children: ev.title }), _jsx("p", { className: "text-xs text-gray-500", children: [ev.event_type, ev.location].filter(Boolean).join(' · ') }), _jsxs("div", { className: "flex items-center justify-between mt-3 pt-3 border-t border-gray-100", children: [_jsx(Toggle, { checked: ev.is_visible, onChange: v => apiPatch(`/admin/portfolio/${ev.id}`, { is_visible: v }).then(load), size: "sm" }), _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => openEdit(ev), className: "p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsx("button", { onClick: () => remove(ev.id), className: "p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] })] })] }, ev.id))) })), _jsx(Modal, { isOpen: modalOpen, onClose: () => setModalOpen(false), title: edit?.id ? 'Edit Event' : 'New Event', children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Title", required: true, value: edit?.title || '', onChange: upd('title'), placeholder: "Annual Corporate Gala" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Event Type", value: edit?.event_type || '', onChange: upd('event_type'), placeholder: "Wedding, Corporate..." }), _jsx(Input, { label: "Location", value: edit?.location || '', onChange: upd('location'), placeholder: "The Taj, Bengaluru" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Event Date", type: "date", value: edit?.event_date || '', onChange: upd('event_date') }), _jsx(Input, { label: "Cover Image Key", value: edit?.cover_image || '', onChange: upd('cover_image'), placeholder: "portfolio/event-cover.webp" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: "Description" }), _jsx("textarea", { rows: 3, value: edit?.description || '', onChange: upd('description'), placeholder: "Brief description of the event...", className: "w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" })] }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Toggle, { checked: edit?.is_visible ?? true, onChange: v => setEdit(p => p ? { ...p, is_visible: v } : null), label: "Visible" }), _jsx(Toggle, { checked: edit?.is_featured ?? false, onChange: v => setEdit(p => p ? { ...p, is_featured: v } : null), label: "Featured" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx(Button, { variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }), _jsx(Button, { onClick: save, loading: saving, children: edit?.id ? 'Update' : 'Create' })] })] }) })] }));
}

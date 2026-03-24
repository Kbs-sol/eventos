import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toggle } from '../components/ui/Toggle';
import { Modal } from '../components/ui/Modal';
import { PageHeader, EmptyState } from '../components/ui/Shared';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
const emptySlide = {
    headline: '', subheadline: '', image_key: '', video_url: '',
    cta1_label: 'Explore Our Work', cta1_href: '/portfolio',
    cta2_label: 'Plan Your Event', cta2_href: '/contact',
    is_visible: true, sort_order: 0,
};
export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editSlide, setEditSlide] = useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => { load(); }, []);
    async function load() {
        try {
            const res = await apiGet('/admin/hero');
            setSlides(res.data || []);
        }
        catch {
            setSlides([]);
        }
        finally {
            setLoading(false);
        }
    }
    function openNew() { setEditSlide({ ...emptySlide }); setModalOpen(true); }
    function openEdit(slide) { setEditSlide({ ...slide }); setModalOpen(true); }
    async function save() {
        if (!editSlide)
            return;
        setSaving(true);
        try {
            if (editSlide.id) {
                await apiPatch(`/admin/hero/${editSlide.id}`, editSlide);
            }
            else {
                await apiPost('/admin/hero', editSlide);
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
        if (!confirm('Delete this slide?'))
            return;
        try {
            await apiDelete(`/admin/hero/${id}`);
            await load();
        }
        catch (err) {
            console.error(err);
        }
    }
    const updateField = (field) => (e) => {
        setEditSlide((prev) => prev ? { ...prev, [field]: e.target.value } : null);
    };
    if (loading)
        return _jsxs("div", { children: [_jsx(PageHeader, { title: "Hero Slides" }), _jsx("div", { className: "animate-pulse rounded-xl bg-gray-100 h-64" })] });
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Hero Slides", description: "Manage the hero banner carousel on your homepage", children: _jsxs(Button, { onClick: openNew, children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }), "Add Slide"] }) }), slides.length === 0 ? (_jsx(EmptyState, { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14", title: "No hero slides", description: "Add your first hero slide to get started" })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: slides.map((slide) => (_jsxs(Card, { padding: "none", className: "overflow-hidden group", children: [_jsxs("div", { className: "aspect-video relative", style: { background: 'linear-gradient(135deg, #1a1a2e, #C9A84C)' }, children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center p-4 text-center", children: _jsxs("div", { children: [_jsx("p", { className: "text-white text-sm font-bold truncate", children: slide.headline || 'No headline' }), _jsx("p", { className: "text-white/60 text-xs mt-1 truncate", children: slide.subheadline || '' })] }) }), !slide.is_visible && (_jsx("div", { className: "absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] px-2 py-0.5 rounded-full", children: "Hidden" }))] }), _jsxs("div", { className: "p-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Toggle, { checked: slide.is_visible, onChange: (v) => apiPatch(`/admin/hero/${slide.id}`, { is_visible: v }).then(load), size: "sm" }), _jsx("span", { className: "text-xs text-gray-500", children: "Visible" })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => openEdit(slide), className: "p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }) }), _jsx("button", { onClick: () => remove(slide.id), className: "p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) })] })] })] }, slide.id))) })), _jsx(Modal, { isOpen: modalOpen, onClose: () => setModalOpen(false), title: editSlide?.id ? 'Edit Slide' : 'New Slide', children: _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Headline", value: editSlide?.headline || '', onChange: updateField('headline'), placeholder: "We Turn Moments Into Memories" }), _jsx(Input, { label: "Subheadline", value: editSlide?.subheadline || '', onChange: updateField('subheadline'), placeholder: "Full-service event management..." }), _jsx(Input, { label: "Image Key (R2)", value: editSlide?.image_key || '', onChange: updateField('image_key'), placeholder: "hero/slide-1.webp" }), _jsx(Input, { label: "Video URL", value: editSlide?.video_url || '', onChange: updateField('video_url'), placeholder: "https://youtube.com/..." }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "CTA 1 Label", value: editSlide?.cta1_label || '', onChange: updateField('cta1_label') }), _jsx(Input, { label: "CTA 1 Link", value: editSlide?.cta1_href || '', onChange: updateField('cta1_href') }), _jsx(Input, { label: "CTA 2 Label", value: editSlide?.cta2_label || '', onChange: updateField('cta2_label') }), _jsx(Input, { label: "CTA 2 Link", value: editSlide?.cta2_href || '', onChange: updateField('cta2_href') })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t", children: [_jsx(Button, { variant: "ghost", onClick: () => setModalOpen(false), children: "Cancel" }), _jsx(Button, { onClick: save, loading: saving, children: editSlide?.id ? 'Update' : 'Create' })] })] }) })] }));
}

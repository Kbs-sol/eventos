import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { PageHeader, EmptyState } from '../components/ui/Shared';
import { apiGet, apiPatch } from '../lib/api';
const statusOptions = ['new', 'read', 'replied', 'archived'];
export default function Enquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all');
    useEffect(() => { load(); }, []);
    async function load() {
        try {
            const r = await apiGet('/admin/enquiries');
            setEnquiries(r.data || []);
        }
        catch {
            setEnquiries([]);
        }
        finally {
            setLoading(false);
        }
    }
    async function updateStatus(id, status) {
        try {
            await apiPatch(`/admin/enquiries/${id}`, { status });
            await load();
        }
        catch { }
    }
    async function toggleStar(id, starred) {
        try {
            await apiPatch(`/admin/enquiries/${id}`, { is_starred: starred });
            await load();
        }
        catch { }
    }
    const filtered = filter === 'all' ? enquiries : filter === 'starred' ? enquiries.filter(e => e.is_starred) : enquiries.filter(e => e.status === filter);
    const counts = {
        all: enquiries.length,
        new: enquiries.filter(e => e.status === 'new').length,
        starred: enquiries.filter(e => e.is_starred).length,
    };
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Enquiries", description: `${counts.new} new enquiries` }), _jsx("div", { className: "flex gap-2 mb-6 flex-wrap", children: [
                    { key: 'all', label: `All (${counts.all})` },
                    { key: 'new', label: `New (${counts.new})` },
                    { key: 'read', label: 'Read' },
                    { key: 'replied', label: 'Replied' },
                    { key: 'starred', label: `Starred (${counts.starred})` },
                    { key: 'archived', label: 'Archived' },
                ].map(f => (_jsx("button", { onClick: () => setFilter(f.key), className: `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`, children: f.label }, f.key))) }), loading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map(i => _jsx("div", { className: "animate-pulse rounded-xl bg-gray-100 h-20" }, i)) })) : filtered.length === 0 ? (_jsx(EmptyState, { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "No enquiries found", description: filter !== 'all' ? 'Try a different filter' : 'Enquiries will appear here when visitors submit the contact form' })) : (_jsx("div", { className: "space-y-2", children: filtered.map(eq => (_jsx("div", { className: "bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer", onClick: () => setSelected(eq), children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("button", { onClick: e => { e.stopPropagation(); toggleStar(eq.id, !eq.is_starred); }, className: "mt-1 flex-shrink-0", children: _jsx("svg", { className: `w-5 h-5 ${eq.is_starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`, fill: eq.is_starred ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-sm text-gray-900", children: eq.name }), _jsx(StatusBadge, { status: eq.status })] }), _jsxs("p", { className: "text-xs text-gray-500", children: [eq.email, eq.phone ? ` · ${eq.phone}` : ''] }), eq.message && _jsx("p", { className: "text-sm text-gray-600 mt-1 line-clamp-1", children: eq.message })] }), _jsxs("div", { className: "text-right flex-shrink-0", children: [_jsx("p", { className: "text-[11px] text-gray-400", children: new Date(eq.created_at).toLocaleDateString() }), eq.event_type && _jsx(Badge, { variant: "default", className: "mt-1", children: eq.event_type })] })] }) }, eq.id))) })), _jsx(Modal, { isOpen: !!selected, onClose: () => setSelected(null), title: "Enquiry Details", size: "lg", children: selected && (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Name" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: selected.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Email" }), _jsx("p", { className: "text-sm text-gray-900", children: _jsx("a", { href: `mailto:${selected.email}`, className: "text-indigo-600 hover:underline", children: selected.email }) })] }), selected.phone && _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Phone" }), _jsx("p", { className: "text-sm text-gray-900", children: _jsx("a", { href: `tel:${selected.phone}`, className: "text-indigo-600 hover:underline", children: selected.phone }) })] }), selected.event_type && _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Event Type" }), _jsx("p", { className: "text-sm text-gray-900", children: selected.event_type })] }), selected.event_date && _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Event Date" }), _jsx("p", { className: "text-sm text-gray-900", children: new Date(selected.event_date).toLocaleDateString() })] }), selected.guest_count && _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Guests" }), _jsx("p", { className: "text-sm text-gray-900", children: selected.guest_count })] }), selected.budget && _jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Budget" }), _jsx("p", { className: "text-sm text-gray-900", children: selected.budget })] })] }), selected.message && (_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-medium text-gray-500 mb-1", children: "Message" }), _jsx("p", { className: "text-sm text-gray-700 bg-gray-50 rounded-lg p-3", children: selected.message })] })), _jsxs("div", { className: "flex items-center gap-3 pt-4 border-t", children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mr-2", children: "Status:" }), statusOptions.map(s => (_jsx("button", { onClick: () => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }, className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selected.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)))] })] })) })] }));
}

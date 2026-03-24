import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader, EmptyState } from '../components/ui/Shared';
import { apiGet, apiDelete } from '../lib/api';
function formatBytes(bytes) {
    if (!bytes)
        return '-';
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export default function Media() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    useEffect(() => { load(); }, []);
    async function load() {
        try {
            const r = await apiGet('/admin/upload');
            setAssets(r.data || []);
        }
        catch {
            setAssets([]);
        }
        finally {
            setLoading(false);
        }
    }
    async function remove(id) {
        if (!confirm('Delete this file?'))
            return;
        try {
            await apiDelete(`/admin/upload/${id}`);
            await load();
        }
        catch { }
    }
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Media Library", description: `${assets.length} files`, children: _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex rounded-lg border border-gray-200 overflow-hidden", children: [_jsx("button", { onClick: () => setView('grid'), className: `p-2 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`, children: _jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) }) }), _jsx("button", { onClick: () => setView('list'), className: `p-2 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`, children: _jsx("svg", { className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) }) })] }), _jsxs(Button, { children: [_jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }), "Upload"] })] }) }), loading ? (_jsx("div", { className: "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", children: [1, 2, 3, 4].map(i => _jsx("div", { className: "animate-pulse rounded-xl bg-gray-100 aspect-square" }, i)) })) : assets.length === 0 ? (_jsx(EmptyState, { icon: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z", title: "No media files", description: "Upload images and files to use across your website. Connect Supabase & R2 to enable uploads." })) : view === 'grid' ? (_jsx("div", { className: "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", children: assets.map(a => (_jsxs(Card, { padding: "none", hover: true, className: "overflow-hidden group", children: [_jsxs("div", { className: "aspect-square relative bg-gray-100", children: [a.mime_type.startsWith('image/') ? (_jsx("img", { src: a.r2_key, alt: a.filename, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx("svg", { className: "w-12 h-12 text-gray-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) })), _jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center", children: _jsx("button", { onClick: () => remove(a.id), className: "opacity-0 group-hover:opacity-100 p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-50 transition-all shadow", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }) })] }), _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-xs font-medium text-gray-900 truncate", children: a.filename }), _jsxs("p", { className: "text-[10px] text-gray-400", children: [formatBytes(a.size_bytes), " ", a.width && a.height ? `· ${a.width}x${a.height}` : ''] })] })] }, a.id))) })) : (_jsx(Card, { padding: "none", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-100", children: [_jsx("th", { className: "text-left text-xs font-medium text-gray-500 px-4 py-3", children: "File" }), _jsx("th", { className: "text-left text-xs font-medium text-gray-500 px-4 py-3", children: "Size" }), _jsx("th", { className: "text-left text-xs font-medium text-gray-500 px-4 py-3", children: "Type" }), _jsx("th", { className: "text-left text-xs font-medium text-gray-500 px-4 py-3", children: "Date" }), _jsx("th", { className: "w-10" })] }) }), _jsx("tbody", { children: assets.map(a => (_jsxs("tr", { className: "border-b border-gray-50 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-sm text-gray-900", children: a.filename }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: formatBytes(a.size_bytes) }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: a.mime_type }), _jsx("td", { className: "px-4 py-3 text-sm text-gray-500", children: new Date(a.created_at).toLocaleDateString() }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => remove(a.id), className: "p-1 text-gray-400 hover:text-red-600", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }) })] }, a.id))) })] }) }))] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { PageHeader } from '../components/ui/Shared';
import config from '@eventos/config';
import { apiGet, apiPatch } from '../lib/api';
export default function Services() {
    const [overrides, setOverrides] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadOverrides();
    }, []);
    async function loadOverrides() {
        try {
            const r = await apiGet('/admin/stats'); // services reuse
            const map = {};
            r.data?.forEach((o) => { map[o.service_id] = o; });
            setOverrides(map);
        }
        catch { /* use defaults */ }
        finally {
            setLoading(false);
        }
    }
    async function toggleService(serviceId, visible) {
        // Optimistic update
        const prev = overrides[serviceId];
        setOverrides(prevMap => ({
            ...prevMap,
            [serviceId]: { ...(prevMap[serviceId] || { service_id: serviceId, title: null, short_desc: null, sort_order: null }), is_visible: visible }
        }));
        try {
            await apiPatch(`/admin/sections/services_${serviceId}`, { isVisible: visible });
        }
        catch (err) {
            // Revert on error
            setOverrides(prevMap => ({
                ...prevMap,
                [serviceId]: prev
            }));
            console.error('Failed to toggle service:', err);
        }
    }
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Services", description: "Manage service visibility and details. Services come from brand.config." }), _jsx("div", { className: "space-y-4", children: config.services.map((service, i) => {
                    const override = overrides[service.id];
                    const isVisible = override?.is_visible ?? service.visible;
                    return (_jsx(Card, { hover: true, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600", children: _jsx("span", { className: "text-lg font-bold", children: i + 1 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: override?.title || service.title }), service.comingSoon && (_jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700", children: "Coming Soon" }))] }), _jsx("p", { className: "text-sm text-gray-500 mb-3", children: override?.short_desc || service.shortDesc }), _jsx("div", { className: "flex flex-wrap gap-2", children: service.features.map((f) => (_jsx("span", { className: "text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600", children: f }, f))) })] }), _jsx("div", { className: "flex-shrink-0", children: _jsx(Toggle, { checked: isVisible, onChange: (v) => toggleService(service.id, v), label: "Visible" }) })] }) }, service.id));
                }) }), _jsx("div", { className: "mt-8 p-4 rounded-xl bg-blue-50 border border-blue-200", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Note:" }), " Service definitions come from ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "brand.config.ts" }), ". Admin overrides (title, description, visibility) are stored in the ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "services_override" }), " table."] }) })] }));
}

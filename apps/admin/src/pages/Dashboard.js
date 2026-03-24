import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/Shared';
import config from '@eventos/config';
function computeMaturityScore() {
    const items = [
        { label: 'Hero slide exists', done: false, points: 10, href: '/hero' },
        { label: 'Logo uploaded', done: true, points: 10, href: '/settings' },
        { label: 'Contact info configured', done: !!config.company.email, points: 10, href: '/settings' },
        { label: '1+ visible portfolio events', done: false, points: 10, href: '/portfolio' },
        { label: '2+ testimonials', done: false, points: 15, href: '/testimonials' },
        { label: 'Team configured', done: !config.sections.about.team, points: 10, href: '/team' },
        { label: '3+ visible services', done: config.services.filter(s => s.visible).length >= 3, points: 15, href: '/services' },
        { label: 'Stats configured', done: config.stats.some(s => s.visible), points: 10, href: '/stats' },
        { label: 'Social link added', done: Object.values(config.social).some(v => v), points: 5, href: '/settings' },
        { label: '5+ portfolio events', done: false, points: 5, href: '/portfolio' },
    ];
    const score = items.reduce((acc, i) => acc + (i.done ? i.points : 0), 0);
    return { score, items };
}
function ProgressRing({ value, size = 120 }) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const getColor = (v) => {
        if (v >= 80)
            return '#10B981';
        if (v >= 50)
            return '#F59E0B';
        return '#6366F1';
    };
    return (_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "#F3F4F6", strokeWidth: strokeWidth }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: getColor(value), strokeWidth: strokeWidth, strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: "round", className: "transition-all duration-1000 ease-out" })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-3xl font-bold text-gray-900", children: value }), _jsx("span", { className: "text-xs text-gray-500", children: "/ 100" })] })] }));
}
function QuickAction({ href, icon, label, description }) {
    return (_jsxs(Link, { to: href, className: "flex items-start gap-3.5 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200 group", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors", children: _jsx("svg", { className: "w-5 h-5 text-indigo-600", fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: icon }) }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors", children: label }), _jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: description })] })] }));
}
export default function Dashboard() {
    const { score, items } = computeMaturityScore();
    const completed = items.filter(i => i.done);
    const pending = items.filter(i => !i.done);
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "Dashboard", description: `Welcome to ${config.company.name} admin panel` }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
                    { label: 'Total Enquiries', value: '—', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'indigo' },
                    { label: 'Active Sections', value: String(Object.values(config.sections.home).filter(Boolean).length), icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z', color: 'emerald' },
                    { label: 'Services Live', value: String(config.services.filter(s => s.visible).length), icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2', color: 'amber' },
                    { label: 'Maturity Score', value: `${score}%`, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'violet' },
                ].map((stat) => (_jsx(Card, { padding: "sm", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center flex-shrink-0`, children: _jsx("svg", { className: `w-5 h-5 text-${stat.color}-600`, fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: stat.icon }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value }), _jsx("p", { className: "text-xs text-gray-500", children: stat.label })] })] }) }, stat.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:row-span-2", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 mb-1", children: "Website Maturity" }), _jsx("p", { className: "text-xs text-gray-500 mb-6", children: "Complete tasks to improve your site" }), _jsx(ProgressRing, { value: score })] }), _jsxs("div", { className: "mt-6 space-y-2", children: [completed.map((item) => (_jsxs("div", { className: "flex items-center gap-2.5 text-sm", children: [_jsx("svg", { className: "w-4 h-4 text-emerald-500 flex-shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }), _jsx("span", { className: "text-gray-500 line-through", children: item.label }), _jsxs(Badge, { variant: "success", className: "ml-auto", children: ["+", item.points] })] }, item.label))), pending.map((item) => (_jsxs(Link, { to: item.href, className: "flex items-center gap-2.5 text-sm group hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors", children: [_jsx("div", { className: "w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 group-hover:border-indigo-400 transition-colors" }), _jsx("span", { className: "text-gray-700 group-hover:text-indigo-600 transition-colors", children: item.label }), _jsxs(Badge, { variant: "default", className: "ml-auto", children: ["+", item.points] })] }, item.label)))] })] }), _jsxs(Card, { className: "lg:col-span-2", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(QuickAction, { href: "/sections", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", label: "Toggle Sections", description: "Show or hide website sections" }), _jsx(QuickAction, { href: "/hero", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14", label: "Update Hero", description: "Change hero banner content" }), _jsx(QuickAction, { href: "/portfolio", icon: "M12 4v16m8-8H4", label: "Add Portfolio Event", description: "Showcase your latest work" }), _jsx(QuickAction, { href: "/enquiries", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8", label: "View Enquiries", description: "Check new contact submissions" })] })] }), _jsxs(Card, { className: "lg:col-span-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: "Recent Enquiries" }), _jsx(Link, { to: "/enquiries", className: "text-sm text-indigo-600 hover:text-indigo-700 font-medium", children: "View all \u2192" })] }), _jsxs("div", { className: "text-center py-8", children: [_jsx("svg", { className: "w-12 h-12 text-gray-300 mx-auto mb-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), _jsx("p", { className: "text-sm text-gray-500", children: "Enquiries will appear here once your contact form is live." }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Connect Supabase to enable real-time data." })] })] })] })] }));
}

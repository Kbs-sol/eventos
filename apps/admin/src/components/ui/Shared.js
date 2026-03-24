import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ icon, title, description, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-gray-200/80", children: [icon && (_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400", children: typeof icon === 'string' ? (_jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: icon }) })) : icon })), _jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-1", children: title }), description && _jsx("p", { className: "text-sm text-gray-500 max-w-sm mb-4", children: description }), action] }));
}
export function LoadingSpinner({ size = 'md' }) {
    const sizeMap = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
    return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("svg", { className: `animate-spin ${sizeMap[size]} text-indigo-600`, viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }) }));
}
export function PageHeader({ title, description, action, children, }) {
    return (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl md:text-2xl font-bold text-gray-900", children: title }), description && _jsx("p", { className: "text-sm text-gray-500 mt-1", children: description })] }), (action || children) && _jsx("div", { className: "flex-shrink-0", children: action || children })] }));
}
export function Toast({ message, type = 'success', onClose }) {
    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    const icons = {
        success: 'M5 13l4 4L19 7',
        error: 'M6 18L18 6M6 6l12 12',
        info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return (_jsxs("div", { className: `
      fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
      animate-[slideUp_0.3s_ease-out] ${colors[type]}
    `, children: [_jsx("svg", { className: "w-5 h-5 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: icons[type] }) }), _jsx("p", { className: "text-sm font-medium", children: message }), _jsx("button", { onClick: onClose, className: "ml-2 p-0.5 rounded hover:bg-black/5", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }));
}

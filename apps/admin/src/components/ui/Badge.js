import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantStyles = {
    default: 'bg-gray-100 text-gray-700 ring-gray-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-red-50 text-red-700 ring-red-200',
    info: 'bg-blue-50 text-blue-700 ring-blue-200',
    primary: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
};
const dotColors = {
    default: 'bg-gray-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    primary: 'bg-indigo-500',
};
export function Badge({ children, variant = 'default', dot, className = '' }) {
    return (_jsxs("span", { className: `
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-xs font-medium ring-1 ring-inset
        ${variantStyles[variant]} ${className}
      `, children: [dot && _jsx("span", { className: `w-1.5 h-1.5 rounded-full ${dotColors[variant]}` }), children] }));
}
export function StatusBadge({ status }) {
    const statusMap = {
        new: { label: 'New', variant: 'info' },
        read: { label: 'Read', variant: 'default' },
        replied: { label: 'Replied', variant: 'success' },
        archived: { label: 'Archived', variant: 'default' },
        paid: { label: 'Paid', variant: 'success' },
        pending: { label: 'Pending', variant: 'warning' },
        failed: { label: 'Failed', variant: 'danger' },
        refunded: { label: 'Refunded', variant: 'info' },
    };
    const cfg = statusMap[status] || { label: status, variant: 'default' };
    return _jsx(Badge, { variant: cfg.variant, dot: true, children: cfg.label });
}

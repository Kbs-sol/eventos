import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
};
export function Card({ children, className = '', padding = 'md', hover }) {
    return (_jsx("div", { className: `
        bg-white rounded-xl border border-gray-200/80 shadow-sm
        ${paddingMap[padding]}
        ${hover ? 'hover:shadow-md hover:border-gray-300/80 transition-all duration-200' : ''}
        ${className}
      `, children: children }));
}
export function CardHeader({ title, description, action }) {
    return (_jsxs("div", { className: "flex items-start justify-between gap-4 mb-5", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: title }), description && _jsx("p", { className: "text-sm text-gray-500 mt-0.5", children: description })] }), action && _jsx("div", { className: "flex-shrink-0", children: action })] }));
}

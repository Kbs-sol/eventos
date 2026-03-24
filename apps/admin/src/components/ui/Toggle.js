import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Toggle({ checked, onChange, label, description, disabled, size = 'md' }) {
    const trackSize = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6';
    const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';
    const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';
    return (_jsxs("label", { className: `flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} group`, children: [_jsx("button", { type: "button", role: "switch", "aria-checked": checked, disabled: disabled, onClick: () => !disabled && onChange(!checked), className: `
          relative inline-flex flex-shrink-0 ${trackSize} rounded-full
          transition-colors duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
          ${checked ? 'bg-indigo-600' : 'bg-gray-200 group-hover:bg-gray-300'}
        `, children: _jsx("span", { className: `
            pointer-events-none inline-block ${thumbSize} rounded-full bg-white shadow-lg ring-0
            transition-transform duration-200 ease-in-out
            ${checked ? thumbTranslate : 'translate-x-0.5'}
            mt-[3px]
          ` }) }), (label || description) && (_jsxs("div", { className: "flex-1 min-w-0", children: [label && (_jsx("span", { className: "text-sm font-medium text-gray-900 select-none", children: label })), description && (_jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: description }))] }))] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const Input = forwardRef(({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (_jsxs("div", { className: "w-full", children: [label && (_jsxs("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1.5", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-0.5", children: "*" })] })), _jsx("input", { ref: ref, id: inputId, className: `
            w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white
            border rounded-lg transition-all duration-150
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 hover:border-gray-400'}
            ${className}
          `, ...props }), error && _jsx("p", { className: "mt-1.5 text-xs text-red-600", children: error }), hint && !error && _jsx("p", { className: "mt-1.5 text-xs text-gray-500", children: hint })] }));
});
Input.displayName = 'Input';
export const TextArea = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1.5", children: label })), _jsx("textarea", { ref: ref, id: inputId, className: `
            w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white
            border rounded-lg transition-all duration-150
            placeholder:text-gray-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500
            ${error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'}
            ${className}
          `, ...props }), error && _jsx("p", { className: "mt-1.5 text-xs text-red-600", children: error })] }));
});
TextArea.displayName = 'TextArea';
export const Select = forwardRef(({ label, error, options, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1.5", children: label })), _jsx("select", { ref: ref, id: inputId, className: `
            w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white
            border rounded-lg transition-all duration-150 appearance-none
            focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500
            ${error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'}
            ${className}
          `, ...props, children: options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), error && _jsx("p", { className: "mt-1.5 text-xs text-red-600", children: error })] }));
});
Select.displayName = 'Select';

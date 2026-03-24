import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { Button } from './Button';
const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
};
export function Modal({ isOpen, onClose, title, description, children, size = 'md', footer }) {
    const overlayRef = useRef(null);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleEsc = (e) => { if (e.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [_jsx("div", { ref: overlayRef, className: "fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsxs("div", { className: `
            relative bg-white rounded-2xl shadow-2xl w-full ${sizeMap[size]}
            transform transition-all
            animate-[modalIn_0.2s_ease-out]
          `, onClick: (e) => e.stopPropagation(), children: [(title || description) && (_jsx("div", { className: "px-6 pt-6 pb-0", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [title && _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: title }), description && _jsx("p", { className: "text-sm text-gray-500 mt-1", children: description })] }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }) })), _jsx("div", { className: "px-6 py-5", children: children }), footer && (_jsx("div", { className: "px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-end gap-3", children: footer }))] }) }), _jsx("style", { children: `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      ` })] }));
}
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', loading, }) {
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: title, size: "sm", footer: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "secondary", onClick: onClose, children: "Cancel" }), _jsx(Button, { variant: variant === 'danger' ? 'danger' : 'primary', onClick: onConfirm, loading: loading, children: confirmLabel })] }), children: _jsx("p", { className: "text-sm text-gray-600", children: message }) }));
}

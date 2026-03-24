import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [sidebarOpen && (_jsx("div", { className: "fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden", onClick: () => setSidebarOpen(false) })), _jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "lg:pl-64", children: [_jsx(TopBar, { onMenuClick: () => setSidebarOpen(true) }), _jsx("main", { className: "px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto", children: children })] })] }));
}

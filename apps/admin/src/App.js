import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/auth';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sections from './pages/Sections';
import Hero from './pages/Hero';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import Team from './pages/Team';
import Stats from './pages/Stats';
import Enquiries from './pages/Enquiries';
import Media from './pages/Media';
import Settings from './pages/Settings';
function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined);
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSession(data.session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
        return () => subscription.unsubscribe();
    }, []);
    if (session === undefined) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsxs("svg", { className: "animate-spin h-8 w-8 text-indigo-600", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }), _jsx("p", { className: "text-sm text-gray-500", children: "Loading..." })] }) }));
    }
    if (!session)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(AdminLayout, { children: children });
}
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/sections", element: _jsx(ProtectedRoute, { children: _jsx(Sections, {}) }) }), _jsx(Route, { path: "/hero", element: _jsx(ProtectedRoute, { children: _jsx(Hero, {}) }) }), _jsx(Route, { path: "/portfolio", element: _jsx(ProtectedRoute, { children: _jsx(Portfolio, {}) }) }), _jsx(Route, { path: "/services", element: _jsx(ProtectedRoute, { children: _jsx(Services, {}) }) }), _jsx(Route, { path: "/testimonials", element: _jsx(ProtectedRoute, { children: _jsx(Testimonials, {}) }) }), _jsx(Route, { path: "/team", element: _jsx(ProtectedRoute, { children: _jsx(Team, {}) }) }), _jsx(Route, { path: "/stats", element: _jsx(ProtectedRoute, { children: _jsx(Stats, {}) }) }), _jsx(Route, { path: "/enquiries", element: _jsx(ProtectedRoute, { children: _jsx(Enquiries, {}) }) }), _jsx(Route, { path: "/media", element: _jsx(ProtectedRoute, { children: _jsx(Media, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(Settings, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}

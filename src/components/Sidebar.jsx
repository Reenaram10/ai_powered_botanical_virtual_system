import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Scan,
    MessageSquare,
    Leaf,
    Calendar,
    Compass,
    Users,
    Settings,
    Sparkles,
    Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
    const { savedPlants, reminders } = useApp();
    const pendingReminders = reminders.filter(r => !r.completed).length;

    const navItems = [
        { name: 'Dashboard', path: '/home', icon: Home },
        { name: 'Scan & Identify', path: '/scan', icon: Scan, badge: 'AI' },
        { name: 'AI Assistant', path: '/chat', icon: MessageSquare, badge: 'Active' },
        { name: 'NLP Dashboard', path: '/nlp-dashboard', icon: Cpu, badge: '🔬 Dev' },
        { name: 'My Plants', path: '/my-plants', icon: Leaf, count: savedPlants.length },
        { name: 'Care Calendar', path: '/calendar', icon: Calendar, count: pendingReminders > 0 ? pendingReminders : null },
        { name: 'Explore Library', path: '/explore', icon: Compass },
        { name: 'Community', path: '/community', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white/70 dark:bg-emerald-950/40 backdrop-blur-md border-r border-emerald-100 dark:border-emerald-900/50 min-h-[calc(100vh-65px)] p-4">

            {/* Navigation Links */}
            <nav className="space-y-1.5 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all
                ${isActive
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                                    : 'text-emerald-900/80 dark:text-emerald-200/80 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 hover:text-emerald-900 dark:hover:text-emerald-100'
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 shrink-0" />
                                <span>{item.name}</span>
                            </div>

                            {item.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200">
                                    {item.badge}
                                </span>
                            )}

                            {item.count !== undefined && item.count !== null && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                                    {item.count}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Pro Assistant Card Promo */}
            <div className="mt-auto pt-4 border-t border-emerald-100 dark:border-emerald-900/50">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Plant Doctor AI</span>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed mb-3">
                        Get instant pest identification & step-by-step treatment plans anytime.
                    </p>
                    <NavLink
                        to="/chat"
                        className="block text-center text-xs font-semibold py-2 px-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm"
                    >
                        Start Chatting
                    </NavLink>
                </div>
            </div>

        </aside>
    );
};

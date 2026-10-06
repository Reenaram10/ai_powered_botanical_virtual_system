import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sprout, Sun, Moon, Bell, CloudSun, Sparkles, Scan, MessageSquare, Plus } from 'lucide-react';

export const Navbar = () => {
    const { theme, toggleTheme, userProfile, reminders } = useApp();
    const location = useLocation();

    const pendingRemindersCount = reminders.filter(r => !r.completed).length;

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-emerald-950/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/50 px-4 lg:px-8 py-3 transition-colors">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand Logo & Name */}
                <Link to="/home" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight text-emerald-900 dark:text-emerald-100 flex items-center gap-1">
                            Plant<span className="text-emerald-500">AI</span>
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                                PRO
                            </span>
                        </span>
                        <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 -mt-0.5 hidden sm:block">
                            Smart Botanist & Care Companion
                        </p>
                    </div>
                </Link>

                {/* Quick Weather Tip Pill (Header Center) */}
                <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200">
                    <CloudSun className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                    <span><strong>72°F Humidity 65%</strong> — Ideal indoor watering conditions today!</span>
                </div>

                {/* Right Header Controls */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Quick Scan CTA Button */}
                    <Link
                        to="/scan"
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:scale-102"
                    >
                        <Scan className="w-4 h-4" />
                        <span className="hidden sm:inline">Scan Leaf</span>
                    </Link>

                    {/* Quick Chat Shortcut */}
                    <Link
                        to="/chat"
                        className="p-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors relative"
                        title="Ask Botanist Chatbot"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </Link>

                    {/* Notification / Reminders Badge Link */}
                    <Link
                        to="/calendar"
                        className="p-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors relative"
                        title="Care Reminders"
                    >
                        <Bell className="w-5 h-5" />
                        {pendingRemindersCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {pendingRemindersCount}
                            </span>
                        )}
                    </Link>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors"
                        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
                    </button>

                    {/* User Profile Avatar Link */}
                    <Link to="/settings" className="flex items-center gap-2 pl-2 border-l border-emerald-200 dark:border-emerald-900">
                        <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/50 hover:ring-emerald-500 transition-all"
                        />
                    </Link>

                </div>

            </div>
        </header>
    );
};

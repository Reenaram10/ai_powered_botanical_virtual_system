import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Scan,
    MessageSquare,
    Leaf,
    Calendar,
    Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomTabBar = () => {
    const { savedPlants, reminders } = useApp();
    const pendingReminders = reminders.filter(r => !r.completed).length;

    const mobileNavItems = [
        { name: 'Home', path: '/home', icon: Home },
        { name: 'Scan', path: '/scan', icon: Scan, primary: true },
        { name: 'Assistant', path: '/chat', icon: MessageSquare },
        { name: 'My Plants', path: '/my-plants', icon: Leaf, badge: savedPlants.length },
        { name: 'Calendar', path: '/calendar', icon: Calendar, badge: pendingReminders > 0 ? pendingReminders : null },
        { name: 'Explore', path: '/explore', icon: Compass },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md border-t border-emerald-100 dark:border-emerald-900/60 px-2 py-1.5 shadow-lg">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    if (item.primary) {
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className="flex flex-col items-center justify-center -mt-5"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 ring-4 ring-white dark:ring-emerald-950 active:scale-95 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                                    {item.name}
                                </span>
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative
                ${isActive
                                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                    : 'text-gray-500 dark:text-emerald-200/60 hover:text-emerald-700 dark:hover:text-emerald-200'
                                }
              `}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" />
                                {item.badge !== undefined && item.badge !== null && (
                                    <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] mt-0.5">{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

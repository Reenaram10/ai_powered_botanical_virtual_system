import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
    const { toastNotification } = useApp();

    if (!toastNotification) return null;

    const { message, type } = toastNotification;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning':
            case 'error':
                return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            default:
                return <Info className="w-5 h-5 text-teal-500 shrink-0" />;
        }
    };

    return (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-xl shadow-emerald-950/10 dark:shadow-emerald-950/40 text-sm text-emerald-950 dark:text-emerald-50">
                {getIcon()}
                <span className="font-medium text-xs sm:text-sm">{message}</span>
            </div>
        </div>
    );
};

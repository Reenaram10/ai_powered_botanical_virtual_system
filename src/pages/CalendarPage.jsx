import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Droplets,
    Sparkles,
    Bell,
    Plus,
    ChevronRight,
    Wind,
    Check,
    RotateCcw,
    Volume2
} from 'lucide-react';

export const CalendarPage = () => {
    const { reminders, toggleReminderComplete, snoozeReminder, addReminder, savedPlants, showToast } = useApp();

    const [filterType, setFilterType] = useState('all'); // all | pending | completed
    const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

    // New Reminder Form
    const [selectedPlantId, setSelectedPlantId] = useState(savedPlants[0]?.id || '');
    const [taskType, setTaskType] = useState('Watering');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredReminders = reminders.filter(rem => {
        if (filterType === 'pending') return !rem.completed;
        if (filterType === 'completed') return rem.completed;
        return true;
    });

    const handleSimulateNotification = () => {
        showToast('🔔 Notification Alert: Figgy needs watering today!', 'info');
    };

    const handleCreateReminder = (e) => {
        e.preventDefault();
        const matchedPlant = savedPlants.find(p => p.id === selectedPlantId);
        addReminder({
            plantId: selectedPlantId,
            plantNickname: matchedPlant ? matchedPlant.nickname : 'Plant',
            speciesName: matchedPlant ? matchedPlant.speciesName : 'Species',
            type: taskType,
            dueDate,
            icon: taskType.includes('Water') ? 'Droplets' : 'Sparkles'
        });
        setIsAddReminderOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                        <CalendarIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        <span>Care Calendar & Reminders</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                        Never miss a watering, fertilizing, or repotting schedule.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSimulateNotification}
                        className="py-2.5 px-3.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Simulate Push Notification Toast"
                    >
                        <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
                        <span>Test Push Notification</span>
                    </button>

                    <button
                        onClick={() => setIsAddReminderOpen(true)}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Reminder</span>
                    </button>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 text-xs">
                    {['all', 'pending', 'completed'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1 rounded-lg capitalize font-medium text-xs transition-all ${filterType === type
                                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                    : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
                                }`}
                        >
                            {type} Tasks ({type === 'pending' ? reminders.filter(r => !r.completed).length : type === 'completed' ? reminders.filter(r => r.completed).length : reminders.length})
                        </button>
                    ))}
                </div>

                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* REMINDERS LIST */}
            <div className="space-y-3">
                {filteredReminders.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white dark:bg-emerald-950/40 border border-dashed border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                        <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">No care tasks found.</h3>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">All set for this view!</p>
                    </div>
                ) : (
                    filteredReminders.map((rem) => (
                        <div
                            key={rem.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${rem.completed
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30 opacity-75'
                                    : 'bg-white dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <button
                                    onClick={() => toggleReminderComplete(rem.id)}
                                    className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors ${rem.completed
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'border-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-transparent'
                                        }`}
                                    title={rem.completed ? 'Mark incomplete' : 'Mark complete'}
                                >
                                    <Check className="w-4 h-4" />
                                </button>

                                <div>
                                    <h4 className={`font-bold text-sm ${rem.completed ? 'line-through text-emerald-950/60 dark:text-emerald-200/60' : 'text-emerald-950 dark:text-emerald-100'} flex items-center gap-2`}>
                                        <span>{rem.plantNickname}</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                            {rem.type}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                        {rem.speciesName} • Due: {rem.dueDate} {rem.snoozedUntil && `(Snoozed until ${rem.snoozedUntil})`}
                                    </p>
                                </div>
                            </div>

                            {!rem.completed && (
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                        onClick={() => snoozeReminder(rem.id, 2)}
                                        className="py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Snooze 2 Days</span>
                                    </button>

                                    <button
                                        onClick={() => toggleReminderComplete(rem.id)}
                                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                                    >
                                        Complete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ADD REMINDER MODAL */}
            {isAddReminderOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-2xl space-y-4 animate-scale-up">
                        <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-emerald-600" />
                            <span>Schedule Custom Care Reminder</span>
                        </h3>

                        <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Select Plant</label>
                                <select
                                    value={selectedPlantId}
                                    onChange={(e) => setSelectedPlantId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none"
                                >
                                    {savedPlants.map(p => (
                                        <option key={p.id} value={p.id}>{p.nickname} ({p.speciesName})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Task Type</label>
                                <select
                                    value={taskType}
                                    onChange={(e) => setTaskType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none"
                                >
                                    <option value="Watering">Watering</option>
                                    <option value="Fertilizing">Fertilizing</option>
                                    <option value="Misting & Humidity">Misting & Humidity</option>
                                    <option value="Repotting">Repotting</option>
                                    <option value="Pruning">Pruning</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddReminderOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                                >
                                    Schedule Reminder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

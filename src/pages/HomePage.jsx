import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PLANT_SPECIES_DATABASE } from '../services/api';
import {
    CloudSun,
    Scan,
    MessageSquare,
    Leaf,
    Compass,
    Droplets,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ShieldCheck,
    Plus
} from 'lucide-react';

export const HomePage = () => {
    const navigate = useNavigate();
    const { userProfile, savedPlants, reminders, setActiveChatContext, toggleReminderComplete } = useApp();

    const plantOfTheDay = PLANT_SPECIES_DATABASE[0]; // Monstera Deliciosa

    const pendingReminders = reminders.filter(r => !r.completed);
    const healthyPlantsCount = savedPlants.filter(p => p.healthStatus === 'healthy').length;

    const handleQuickAskChat = (plantObj = null) => {
        if (plantObj) {
            setActiveChatContext(plantObj);
        }
        navigate('/chat');
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">

            {/* Weather-aware Greeting Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white relative overflow-hidden shadow-xl shadow-emerald-950/10">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                                Good day, {userProfile.name.split(' ')[0]} 🌿
                            </span>
                            <span className="text-xs text-emerald-200/80">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Your garden is <span className="text-emerald-300">thriving</span> today.
                        </h1>

                        {/* Weather Tip Pill */}
                        <div className="inline-flex items-center gap-2.5 mt-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-emerald-100">
                            <CloudSun className="w-5 h-5 text-amber-300 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
                            <span>
                                <strong>Weather Alert:</strong> Dry ambient humidity expected today (40%). Consider misting your tropical foliage!
                            </span>
                        </div>
                    </div>

                    {/* Quick Stats Counter */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[90px]">
                            <span className="block text-2xl font-extrabold text-white">{savedPlants.length}</span>
                            <span className="text-[11px] text-emerald-200">My Plants</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[90px]">
                            <span className="block text-2xl font-extrabold text-emerald-300">{healthyPlantsCount}</span>
                            <span className="text-[11px] text-emerald-200">Healthy</span>
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[90px]">
                            <span className="block text-2xl font-extrabold text-amber-300">{pendingReminders.length}</span>
                            <span className="text-[11px] text-emerald-200">Tasks Due</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div>
                <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 mb-3 flex items-center justify-between">
                    <span>Quick Actions</span>
                    <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">Tap to launch feature</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">

                    {/* Action 1: Scan a Plant */}
                    <Link
                        to="/scan"
                        className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between h-32"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-6 transition-transform">
                            <Scan className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white group-hover:underline">Scan a Plant</h3>
                            <p className="text-[11px] text-emerald-100/80">Identify & Diagnose</p>
                        </div>
                    </Link>

                    {/* Action 2: Ask Assistant */}
                    <button
                        onClick={() => handleQuickAskChat()}
                        className="group p-4 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-900 text-white shadow-md shadow-emerald-900/20 hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between h-32 text-left"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:rotate-6 transition-transform">
                            <MessageSquare className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white group-hover:underline">Ask Assistant</h3>
                            <p className="text-[11px] text-emerald-200/80">24/7 AI Botanist</p>
                        </div>
                    </button>

                    {/* Action 3: My Plants */}
                    <Link
                        to="/my-plants"
                        className="group p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex flex-col justify-between h-32"
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:rotate-6 transition-transform">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600">My Collection</h3>
                            <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">{savedPlants.length} plants saved</p>
                        </div>
                    </Link>

                    {/* Action 4: Explore Library */}
                    <Link
                        to="/explore"
                        className="group p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex flex-col justify-between h-32"
                    >
                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:rotate-6 transition-transform">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 group-hover:text-teal-600">Explore Library</h3>
                            <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Species care guides</p>
                        </div>
                    </Link>

                </div>
            </div>

            {/* TWO COLUMN GRID: Today's Tasks & Plant of the Day */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2 cols): Care Tasks Due Today */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <span>Pending Care Tasks</span>
                        </h2>
                        <Link to="/calendar" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                            <span>View Calendar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-2.5">
                        {pendingReminders.length === 0 ? (
                            <div className="p-6 rounded-2xl bg-white dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-center space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">All tasks completed!</h4>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Your plants are fully watered and cared for today.</p>
                            </div>
                        ) : (
                            pendingReminders.slice(0, 3).map((rem) => (
                                <div
                                    key={rem.id}
                                    className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex items-center justify-between gap-4 transition-transform hover:scale-[1.005]"
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleReminderComplete(rem.id)}
                                            className="w-6 h-6 rounded-lg border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-transparent"
                                            title="Mark as Done"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <div>
                                            <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                                                <span>{rem.plantNickname}</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                                    {rem.type}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                                {rem.speciesName} • Due: {rem.dueDate}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const matched = savedPlants.find(p => p.id === rem.plantId);
                                            handleQuickAskChat(matched);
                                        }}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                                    >
                                        Ask AI
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column (1 col): Plant of the Day Card */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span>Plant of the Day</span>
                    </h2>

                    <div className="rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-md overflow-hidden flex flex-col group">
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={plantOfTheDay.image}
                                alt={plantOfTheDay.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-white text-[11px] font-bold">
                                Daily Feature
                            </div>
                        </div>

                        <div className="p-5 space-y-3">
                            <div>
                                <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">{plantOfTheDay.name}</h3>
                                <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">{plantOfTheDay.scientificName}</p>
                            </div>

                            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 line-clamp-2 leading-relaxed">
                                {plantOfTheDay.description}
                            </p>

                            <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    {plantOfTheDay.difficulty} • {plantOfTheDay.light}
                                </span>
                                <Link
                                    to="/explore"
                                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    <span>Care Guide</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RECENT ACTIVITY & SAVED PLANTS PREVIEW */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span>My Plant Health Overview</span>
                    </h2>
                    <Link to="/my-plants" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                        Manage All ({savedPlants.length})
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {savedPlants.map((plant) => (
                        <div
                            key={plant.id}
                            onClick={() => navigate(`/plant/${plant.id}`)}
                            className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] flex items-center gap-3.5"
                        >
                            <img
                                src={plant.thumbnail}
                                alt={plant.nickname}
                                className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-emerald-500/20"
                            />
                            <div className="space-y-1 min-w-0">
                                <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 truncate">
                                    {plant.nickname}
                                </h4>
                                <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 truncate">
                                    {plant.speciesName}
                                </p>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${plant.healthStatus === 'healthy' ? 'bg-emerald-500' :
                                            plant.healthStatus === 'needs attention' ? 'bg-amber-500' : 'bg-rose-500'
                                        }`} />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-200">
                                        {plant.healthStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

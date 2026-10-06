import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
    Settings,
    User,
    Moon,
    Sun,
    Download,
    Trash2,
    Sliders,
    Cpu,
    Key,
    Zap,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

export const SettingsPage = () => {
    const navigate = useNavigate();
    const {
        userProfile,
        updateUserProfile,
        theme,
        toggleTheme,
        savedPlants,
        geminiApiKey,
        saveGeminiApiKey,
        showToast
    } = useApp();

    const [name, setName] = useState(userProfile.name);
    const [experience, setExperience] = useState(userProfile.experience || 'intermediate');
    const [metricUnits, setMetricUnits] = useState(userProfile.metricUnits);
    const [pushNotifications, setPushNotifications] = useState(userProfile.pushNotifications);
    const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateUserProfile({
            name,
            experience,
            metricUnits,
            pushNotifications
        });
    };

    const handleSaveApiKey = (e) => {
        e.preventDefault();
        saveGeminiApiKey(apiKeyInput);
    };

    const handleExportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            userProfile,
            savedPlants,
            exportDate: new Date().toISOString()
        }, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `plantai_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Data exported successfully!', 'success');
    };

    const handleClearData = () => {
        if (window.confirm('Reset all saved plants and preferences to default demo state?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Header Banner */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                    <Settings className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    <span>Profile & App Settings</span>
                </h1>
                <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                    Manage your plant parenting preferences, Gemini AI integration, theme, and data export.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column (1 col): User Avatar Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm text-center space-y-4 h-fit">
                    <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-emerald-500/30 shadow-md"
                    />

                    <div>
                        <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100">{userProfile.name}</h3>
                        <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 capitalize">
                            {userProfile.experience} Botanist
                        </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-200">
                        <strong>{savedPlants.length} Plants</strong> in Collection
                    </div>

                    {/* Gemini AI Status Badge */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-left space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>{geminiApiKey ? 'Gemini 2.5 Active ⚡' : 'Smart Local NLP Mode'}</span>
                        </div>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                            {geminiApiKey
                                ? 'Connected to Google Gemini API for live plant intelligence.'
                                : 'Configure API Key below for live Gemini botanical responses.'}
                        </p>
                    </div>

                    {/* NLP Analysis Dashboard Button */}
                    <button
                        onClick={() => navigate('/nlp-dashboard')}
                        className="w-full py-2.5 px-3 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 hover:bg-teal-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-teal-200 dark:border-teal-800"
                    >
                        <Cpu className="w-4 h-4 text-teal-600" />
                        <span>🔬 Open NLP Dashboard</span>
                    </button>
                </div>

                {/* Right Column (2 cols): Settings Form */}
                <div className="md:col-span-2 space-y-6">

                    {/* Gemini API Key Configuration Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                                <Key className="w-5 h-5 text-amber-500" />
                                <span>Google Gemini API Configuration</span>
                            </h3>
                            {geminiApiKey && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>Connected</span>
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 leading-relaxed">
                            Connect your Google Gemini API Key to enable real-time AI botanical intelligence and leaf diagnosis for plant queries. Responses are restricted strictly to plant-related topics.
                        </p>

                        <form onSubmit={handleSaveApiKey} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                                    Gemini API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                                <button
                                    type="submit"
                                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                                >
                                    <Zap className="w-4 h-4 text-amber-950 fill-amber-950" />
                                    <span>Save Gemini Key</span>
                                </button>

                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <span>Get a free key from Google AI Studio</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Profile Form Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                        <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            <span>Personal Information</span>
                        </h3>

                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Experience Level</label>
                                <select
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none"
                                >
                                    <option value="beginner">Beginner Plant Parent 🌱</option>
                                    <option value="intermediate">Intermediate Gardener 🌿</option>
                                    <option value="expert">Expert Botanist 🌳</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/50 space-y-3">
                                <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-200">System Preferences</h4>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-emerald-950 dark:text-emerald-100 block">Push Care Notifications</span>
                                        <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Receive daily watering alerts</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={pushNotifications}
                                        onChange={(e) => setPushNotifications(e.target.checked)}
                                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-emerald-950 dark:text-emerald-100 block">Metric Measurement Units</span>
                                        <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Celcius (°C) & Milliliters (ml)</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={metricUnits}
                                        onChange={(e) => setMetricUnits(e.target.checked)}
                                        className="w-4 h-4 accent-emerald-600 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                            >
                                Save Preferences
                            </button>
                        </form>
                    </div>

                    {/* Theme & Data Card */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                        <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-teal-600" />
                            <span>Theme & Data Controls</span>
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/40">
                                <div>
                                    <span className="font-bold text-emerald-950 dark:text-emerald-100 block">Appearance Theme</span>
                                    <span className="text-emerald-600/70 dark:text-emerald-400/70">Current mode: {theme.toUpperCase()}</span>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className="py-1.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
                                >
                                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                    <span>Switch Theme</span>
                                </button>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleExportData}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export Data (JSON)</span>
                                </button>

                                <button
                                    onClick={handleClearData}
                                    className="py-2.5 px-4 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Reset App</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

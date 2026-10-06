import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    ArrowLeft,
    MessageSquare,
    Calendar,
    Droplets,
    Sparkles,
    Plus,
    Edit3,
    Trash2,
    Clock,
    CheckCircle2,
    Heart,
    Camera,
    AlertTriangle
} from 'lucide-react';

export const PlantProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { savedPlants, updatePlant, deletePlant, addPhotoToPlant, setActiveChatContext, showToast } = useApp();

    const plant = savedPlants.find(p => p.id === id) || savedPlants[0];

    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesText, setNotesText] = useState(plant ? plant.notes : '');
    const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [newPhotoNote, setNewPhotoNote] = useState('');

    if (!plant) {
        return (
            <div className="p-12 text-center space-y-3">
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-100">Plant not found</h2>
                <button onClick={() => navigate('/my-plants')} className="text-xs font-bold text-emerald-600 hover:underline">
                    Return to My Plants
                </button>
            </div>
        );
    }

    const handleSaveNotes = () => {
        updatePlant(plant.id, { notes: notesText });
        setIsEditingNotes(false);
    };

    const handleAddPhotoSubmit = (e) => {
        e.preventDefault();
        if (!newPhotoUrl.trim()) return;
        addPhotoToPlant(plant.id, newPhotoUrl, newPhotoNote);
        setIsAddPhotoOpen(false);
        setNewPhotoUrl('');
        setNewPhotoNote('');
    };

    const handleChatAboutPlant = () => {
        setActiveChatContext(plant);
        navigate('/chat');
    };

    const handleDeletePlant = () => {
        if (window.confirm(`Are you sure you want to delete ${plant.nickname}?`)) {
            deletePlant(plant.id);
            navigate('/my-plants');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Back Bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/my-plants')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Collection</span>
                </button>

                <button
                    onClick={handleDeletePlant}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Plant</span>
                </button>
            </div>

            {/* PLANT HERO BANNER CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-xl flex flex-col md:flex-row gap-6 items-center">

                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shrink-0 shadow-lg ring-4 ring-emerald-500/20">
                    <img src={plant.thumbnail} alt={plant.nickname} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                        Score: {plant.healthScore}/100
                    </div>
                </div>

                <div className="space-y-3 flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plant.healthStatus === 'healthy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                                plant.healthStatus === 'needs attention' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                    'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                            }`}>
                            {plant.healthStatus}
                        </span>
                        <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                            Acquired: {plant.acquiredDate}
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">{plant.nickname}</h1>
                        <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">{plant.speciesName} • {plant.location}</p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <button
                            onClick={handleChatAboutPlant}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform hover:scale-102"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat about this plant</span>
                        </button>

                        <button
                            onClick={() => setIsAddPhotoOpen(true)}
                            className="py-2.5 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold text-xs hover:bg-emerald-200 flex items-center gap-1.5 transition-colors"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Log New Photo</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* TWO COLUMN DETAILS: Care Schedule & Notes Left, Timeline History Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column (1 col): Care Schedule & Editable Notes */}
                <div className="space-y-6">

                    {/* Care Schedule Card */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                        <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-teal-600" />
                            <span>Care Intervals</span>
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/40 flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-emerald-950 dark:text-emerald-100 block">Watering</span>
                                    <span className="text-emerald-600/70 dark:text-emerald-400/70">Every {plant.waterIntervalDays} days</span>
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Last: {plant.lastWatered}</span>
                            </div>

                            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/40 flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-emerald-950 dark:text-emerald-100 block">Fertilizing</span>
                                    <span className="text-emerald-600/70 dark:text-emerald-400/70">Every {plant.fertilizeIntervalDays} days</span>
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Last: {plant.lastFertilized}</span>
                            </div>
                        </div>
                    </div>

                    {/* Plant Notes Card */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">Care Notes</h3>
                            {!isEditingNotes && (
                                <button onClick={() => setIsEditingNotes(true)} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </button>
                            )}
                        </div>

                        {isEditingNotes ? (
                            <div className="space-y-2">
                                <textarea
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 text-xs border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={handleSaveNotes}
                                    className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                                >
                                    Save Notes
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed italic">
                                "{plant.notes || 'No notes added yet.'}"
                            </p>
                        )}
                    </div>

                </div>

                {/* Right Column (2 cols): Visual Photo Growth Timeline */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span>Visual Growth Timeline</span>
                        </h3>

                        <button
                            onClick={() => setIsAddPhotoOpen(true)}
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Progress Photo</span>
                        </button>
                    </div>

                    {/* Timeline Items List */}
                    <div className="space-y-4 relative border-l-2 border-emerald-200 dark:border-emerald-800 pl-4 ml-2">
                        {(plant.photoHistory || []).map((photo, idx) => (
                            <div key={idx} className="relative space-y-2 group">
                                <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-emerald-950" />

                                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                        <span className="font-bold text-emerald-950 dark:text-emerald-100">{photo.date}</span>
                                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                            Progress Log #{plant.photoHistory.length - idx}
                                        </span>
                                    </div>

                                    <img
                                        src={photo.url}
                                        alt={photo.note}
                                        className="w-full h-48 object-cover rounded-xl"
                                    />

                                    <p className="text-xs text-emerald-800 dark:text-emerald-200">
                                        {photo.note}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            {/* ADD PHOTO MODAL */}
            {isAddPhotoOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-2xl space-y-4 animate-scale-up">
                        <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-emerald-600" />
                            <span>Log Progress Photo</span>
                        </h3>

                        <form onSubmit={handleAddPhotoSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Image URL or Sample</label>
                                <input
                                    type="text"
                                    required
                                    value={newPhotoUrl}
                                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setNewPhotoUrl('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80')}
                                    className="text-[11px] text-emerald-600 hover:underline pt-1"
                                >
                                    Use sample demo photo
                                </button>
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Observation Note</label>
                                <input
                                    type="text"
                                    value={newPhotoNote}
                                    onChange={(e) => setNewPhotoNote(e.target.value)}
                                    placeholder="e.g. New leaf unfurling today!"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddPhotoOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                                >
                                    Add Photo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

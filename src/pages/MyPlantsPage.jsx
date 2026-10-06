import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Leaf,
    LayoutGrid,
    List,
    Search,
    Filter,
    Plus,
    Sparkles,
    ChevronRight,
    Heart,
    Calendar,
    AlertTriangle
} from 'lucide-react';

export const MyPlantsPage = () => {
    const navigate = useNavigate();
    const { savedPlants, addPlant } = useApp();

    const [viewMode, setViewMode] = useState('grid'); // grid | list
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | healthy | needs attention | critical
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Plant Form State
    const [newNickname, setNewNickname] = useState('');
    const [newSpeciesName, setNewSpeciesName] = useState('Monstera Deliciosa');
    const [newLocation, setNewLocation] = useState('Living Room Window');

    const filteredPlants = savedPlants.filter(plant => {
        const matchesSearch = (plant.nickname || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (plant.speciesName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || plant.healthStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreatePlant = (e) => {
        e.preventDefault();
        if (!newNickname.trim()) return;

        const created = addPlant({
            nickname: newNickname,
            speciesName: newSpeciesName,
            location: newLocation,
            thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
            notes: 'Newly added companion.'
        });

        setIsAddModalOpen(false);
        setNewNickname('');
        navigate(`/plant/${created.id}`);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in max-w-6xl mx-auto">

            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                        <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        <span>My Plant Collection</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                        You are nurturing {savedPlants.length} green friends.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-102 self-start md:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Plant</span>
                </button>
            </div>

            {/* FILTER & SEARCH TOOLBAR */}
            <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by nickname or species..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 placeholder-emerald-600/50 text-xs border border-emerald-200/60 dark:border-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Status Filter Pills & View Toggles */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">

                    <div className="flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 text-xs">
                        {['all', 'healthy', 'needs attention', 'critical'].map(st => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-2.5 py-1 rounded-lg capitalize font-medium text-[11px] transition-all ${statusFilter === st
                                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                        : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
                                    }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    {/* View Mode Toggle Buttons */}
                    <div className="flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-emerald-700 dark:text-emerald-300'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-emerald-700 dark:text-emerald-300'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>

            {/* PLANTS DISPLAY CONTAINER */}
            {filteredPlants.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white dark:bg-emerald-950/40 border border-dashed border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <Leaf className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">No plants match your search.</h3>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Try changing your search query or filter settings.</p>
                </div>
            ) : viewMode === 'grid' ? (

                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPlants.map((plant) => (
                        <div
                            key={plant.id}
                            onClick={() => navigate(`/plant/${plant.id}`)}
                            className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-lg cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group space-y-4"
                        >
                            <div className="relative h-48 rounded-2xl overflow-hidden">
                                <img
                                    src={plant.thumbnail}
                                    alt={plant.nickname}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Health Status Badge Overlay */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${plant.healthStatus === 'healthy' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' :
                                            plant.healthStatus === 'needs attention' ? 'bg-amber-900/80 text-amber-300 border border-amber-500/40' :
                                                'bg-rose-900/80 text-rose-300 border border-rose-500/40'
                                        }`}>
                                        {plant.healthStatus} ({plant.healthScore}/100)
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 transition-colors">
                                    {plant.nickname}
                                </h3>
                                <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">
                                    {plant.speciesName} • {plant.location}
                                </p>
                                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 line-clamp-2 pt-1">
                                    {plant.notes}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-700/70 dark:text-emerald-300/70">
                                <span>Last check: {plant.lastCheckDate}</span>
                                <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>

            ) : (

                /* LIST VIEW */
                <div className="space-y-3">
                    {filteredPlants.map((plant) => (
                        <div
                            key={plant.id}
                            onClick={() => navigate(`/plant/${plant.id}`)}
                            className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.005] flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <img src={plant.thumbnail} alt={plant.nickname} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 truncate">{plant.nickname}</h3>
                                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 truncate">{plant.speciesName} • {plant.location}</p>
                                    <span className="text-[10px] text-emerald-500">Last watered: {plant.lastWatered}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${plant.healthStatus === 'healthy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                                        plant.healthStatus === 'needs attention' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                            'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                    }`}>
                                    {plant.healthStatus}
                                </span>
                                <ChevronRight className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    ))}
                </div>

            )}

            {/* ADD PLANT MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-2xl space-y-4 animate-scale-up">
                        <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-emerald-600" />
                            <span>Add Plant to Collection</span>
                        </h3>

                        <form onSubmit={handleCreatePlant} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Plant Nickname</label>
                                <input
                                    type="text"
                                    required
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    placeholder="e.g. Monty, Leafy, Big Boy"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Species Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newSpeciesName}
                                    onChange={(e) => setNewSpeciesName(e.target.value)}
                                    placeholder="e.g. Monstera Deliciosa"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-900 dark:text-emerald-200 mb-1">Home Location</label>
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="e.g. Living Room Window, Balcony"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                                >
                                    Save Plant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

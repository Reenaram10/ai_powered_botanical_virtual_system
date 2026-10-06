import React, { useState } from 'react';
import { PLANT_SPECIES_DATABASE } from '../services/api';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
    Compass,
    Search,
    Sun,
    Droplets,
    Heart,
    Bookmark,
    CheckCircle2,
    Sparkles,
    Info,
    ChevronRight,
    ShieldCheck,
    X
} from 'lucide-react';

export const ExplorePage = () => {
    const navigate = useNavigate();
    const { setActiveChatContext, addPlant, showToast } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all'); // all | Beginner | Easy | Intermediate | Expert
    const [wishlist, setWishlist] = useState(['snake-plant']);
    const [activeSpeciesModal, setActiveSpeciesModal] = useState(null);

    const filteredSpecies = PLANT_SPECIES_DATABASE.filter(species => {
        const matchesSearch = (species.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (species.scientificName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'all' || species.difficulty.toLowerCase().includes(difficultyFilter.toLowerCase());
        return matchesSearch && matchesDifficulty;
    });

    const toggleWishlist = (speciesId, e) => {
        e.stopPropagation();
        setWishlist(prev => {
            const exists = prev.includes(speciesId);
            if (exists) {
                showToast('Removed from wishlist.', 'info');
                return prev.filter(id => id !== speciesId);
            } else {
                showToast('Added to plant wishlist! 💚', 'success');
                return [...prev, speciesId];
            }
        });
    };

    const handleAdoptPlant = (species) => {
        addPlant({
            speciesId: species.id,
            nickname: species.name + ' #' + Math.floor(Math.random() * 100),
            speciesName: species.name,
            location: 'Indoor Garden',
            thumbnail: species.image,
            notes: `Added from Explore Library.`
        });
        setActiveSpeciesModal(null);
        navigate('/my-plants');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                        <Compass className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                        <span>Plant Species Library</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                        Explore care guides, light requirements, and toxicity for 10,000+ botanic species.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                    <Bookmark className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>Wishlist ({wishlist.length})</span>
                </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">

                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Monstera, Snake Plant, Fiddle..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 placeholder-emerald-600/50 text-xs border border-emerald-200/60 dark:border-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 text-xs w-full sm:w-auto overflow-x-auto">
                    {['all', 'beginner', 'easy', 'intermediate', 'expert'].map(diff => (
                        <button
                            key={diff}
                            onClick={() => setDifficultyFilter(diff)}
                            className={`px-3 py-1 rounded-lg capitalize font-medium text-xs whitespace-nowrap transition-all ${difficultyFilter === diff
                                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                    : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>

            </div>

            {/* SPECIES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecies.map((species) => {
                    const isWishlisted = wishlist.includes(species.id);
                    return (
                        <div
                            key={species.id}
                            onClick={() => setActiveSpeciesModal(species)}
                            className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group space-y-4"
                        >
                            <div className="relative h-48 rounded-2xl overflow-hidden">
                                <img
                                    src={species.image}
                                    alt={species.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Pet Friendly Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${species.petFriendly ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40' : 'bg-amber-900/80 text-amber-300 border border-amber-500/40'
                                        }`}>
                                        {species.petFriendly ? 'Pet Safe 🐾' : 'Toxic to Pets ⚠️'}
                                    </span>
                                </div>

                                {/* Wishlist Bookmark Button */}
                                <button
                                    onClick={(e) => toggleWishlist(species.id, e)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
                                    title="Bookmark to Wishlist"
                                >
                                    <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-emerald-400 text-emerald-400' : 'text-white'}`} />
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 transition-colors">
                                        {species.name}
                                    </h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                        {species.difficulty}
                                    </span>
                                </div>

                                <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">
                                    {species.scientificName}
                                </p>

                                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 line-clamp-2 pt-1">
                                    {species.description}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-700/80 dark:text-emerald-300/80">
                                <span>☀️ {species.light}</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <span>View Guide</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SPECIES DETAIL MODAL */}
            {activeSpeciesModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 shadow-2xl space-y-5 animate-scale-up">

                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Species Guide</span>
                                <h2 className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-50">{activeSpeciesModal.name}</h2>
                                <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">{activeSpeciesModal.scientificName}</p>
                            </div>

                            <button
                                onClick={() => setActiveSpeciesModal(null)}
                                className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="h-48 rounded-2xl overflow-hidden">
                            <img src={activeSpeciesModal.image} alt={activeSpeciesModal.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100">Care Guide Steps</h4>
                            <ul className="space-y-1.5 text-xs text-emerald-800/90 dark:text-emerald-200/90">
                                {activeSpeciesModal.careGuide.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setActiveChatContext({ speciesName: activeSpeciesModal.name, nickname: activeSpeciesModal.name });
                                    setActiveSpeciesModal(null);
                                    navigate('/chat');
                                }}
                                className="flex-1 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 font-bold text-xs"
                            >
                                Ask Assistant about {activeSpeciesModal.name}
                            </button>

                            <button
                                onClick={() => handleAdoptPlant(activeSpeciesModal)}
                                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                            >
                                Adopt & Add to My Plants
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

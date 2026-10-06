import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Cpu, Leaf, ChevronDown, Sparkles, Zap } from 'lucide-react';

export const ChatHeader = ({
    geminiApiKey,
    activeChatContext,
    setActiveChatContext,
    savedPlants
}) => {
    const navigate = useNavigate();
    const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);

    return (
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between gap-3 border-b border-emerald-800/60 shrink-0">

            {/* Botanist Avatar & Status */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-emerald-950 font-bold shadow-md">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-900" />
                </div>

                <div>
                    <h2 className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                        <span>PlantAI Botanist</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                            <Zap className="w-3 h-3 text-amber-950 fill-amber-950" />
                            <span>Gemini 2.5 Flash</span>
                        </span>
                    </h2>
                    <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                        Strict Plant-Only Scope • Live Google Gemini Connected
                    </p>
                </div>
            </div>

            {/* Controls: NLP Dashboard & Context Dropdown */}
            <div className="flex items-center gap-2">

                <button
                    onClick={() => navigate('/nlp-dashboard')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-xs text-teal-100 border border-teal-600/60 transition-colors shadow-xs"
                    title="Open NLP Tokenization & Entity Dashboard"
                >
                    <Cpu className="w-3.5 h-3.5 text-teal-300" />
                    <span className="hidden sm:inline font-bold">🔬 NLP Dashboard</span>
                </button>

                {/* Context Selector Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsContextDropdownOpen(!isContextDropdownOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-xs text-emerald-100 border border-emerald-700/60 transition-colors"
                    >
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="max-w-[100px] sm:max-w-[150px] truncate">
                            {activeChatContext ? `${activeChatContext.nickname || activeChatContext.speciesName}` : 'General Care'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                    </button>

                    {/* Context Dropdown Menu */}
                    {isContextDropdownOpen && (
                        <div className="absolute right-0 top-10 z-30 w-56 p-2 rounded-2xl bg-emerald-950 border border-emerald-800 shadow-2xl text-xs space-y-1">
                            <span className="block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                Switch Plant Context
                            </span>

                            <button
                                onClick={() => { setActiveChatContext(null); setIsContextDropdownOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 ${!activeChatContext ? 'bg-emerald-800 text-white font-bold' : 'text-emerald-200 hover:bg-emerald-900'}`}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>General Assistant</span>
                            </button>

                            {savedPlants && savedPlants.map(plant => (
                                <button
                                    key={plant.id}
                                    onClick={() => { setActiveChatContext(plant); setIsContextDropdownOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 truncate ${activeChatContext?.id === plant.id ? 'bg-emerald-800 text-white font-bold' : 'text-emerald-200 hover:bg-emerald-900'}`}
                                >
                                    <img src={plant.thumbnail} alt={plant.nickname} className="w-5 h-5 rounded-md object-cover" />
                                    <span className="truncate">{plant.nickname || plant.speciesName}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

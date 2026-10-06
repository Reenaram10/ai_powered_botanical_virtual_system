import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { runNlpPipeline } from '../utils/nlpPipeline';
import {
    Cpu,
    ArrowLeft,
    MessageSquare,
    Sparkles,
    Layers,
    Tag,
    ShieldAlert,
    Activity,
    CheckCircle2,
    ChevronRight,
    RotateCcw,
    Sliders,
    FileCode,
    Zap
} from 'lucide-react';

export const NlpDashboardPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { chatMessages } = useApp();

    // Extract user messages from chat history
    const userMessages = chatMessages.filter(m => m.sender === 'user');

    const preselectedMsgId = searchParams.get('msgId');

    const initialSelectedMsg = userMessages.find(m => m.id === preselectedMsgId) || userMessages[userMessages.length - 1];

    const [selectedMessageId, setSelectedMessageId] = useState(initialSelectedMsg ? initialSelectedMsg.id : 'custom');
    const [customInputText, setCustomInputText] = useState(
        initialSelectedMsg ? initialSelectedMsg.text : 'My Monstera has yellowing leaves and brown spots on the stems. How often should I water it?'
    );

    useEffect(() => {
        if (preselectedMsgId) {
            const match = userMessages.find(m => m.id === preselectedMsgId);
            if (match) {
                setSelectedMessageId(match.id);
                setCustomInputText(match.text);
            }
        }
    }, [preselectedMsgId]);

    const handleSelectChange = (msgId) => {
        setSelectedMessageId(msgId);
        if (msgId === 'custom') {
            setCustomInputText('How to fertilize my Fiddle Leaf Fig during spring?');
        } else {
            const selected = userMessages.find(m => m.id === msgId);
            if (selected) {
                setCustomInputText(selected.text);
            }
        }
    };

    // Run shared NLP pipeline on active text
    const nlpData = runNlpPipeline(customInputText);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in">

            {/* Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate('/chat')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline mb-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Assistant Chat</span>
                    </button>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                        <Cpu className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                        <span>NLP Analysis Dashboard</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                        Live tokenization, lemmatization, POS tagging, NER entities & intent classification engine.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/chat')}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <MessageSquare className="w-4 h-4" />
                    <span>Test in Chatbot</span>
                </button>
            </div>

            {/* MESSAGE SELECTOR & TEST INPUT BAR */}
            <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-md space-y-4">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <label className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-emerald-600" />
                        <span>Select User Query to Analyze:</span>
                    </label>

                    <select
                        value={selectedMessageId}
                        onChange={(e) => handleSelectChange(e.target.value)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="custom">✍️ Live Custom Input</option>
                        {userMessages.map((m, idx) => (
                            <option key={m.id} value={m.id}>
                                Msg #{idx + 1}: "{m.text.slice(0, 35)}..." ({m.timestamp})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={customInputText}
                        onChange={(e) => {
                            setCustomInputText(e.target.value);
                            setSelectedMessageId('custom');
                        }}
                        placeholder="Type any plant query to test the NLP pipeline live..."
                        className="w-full pl-4 pr-12 py-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 font-medium text-xs sm:text-sm border border-emerald-200/60 dark:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-emerald-500">
                        {customInputText.length} chars
                    </span>
                </div>

            </div>

            {/* DASHBOARD METRICS SUMMARY TOP BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Tokens Extracted</span>
                    <p className="text-xl font-black text-emerald-950 dark:text-emerald-50">{nlpData.tokenCount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Named Entities</span>
                    <p className="text-xl font-black text-emerald-950 dark:text-emerald-50">{nlpData.entityCount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Classified Intent</span>
                    <p className="text-base font-extrabold text-emerald-950 dark:text-emerald-50 truncate">{nlpData.intent}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Urgency Level</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${nlpData.urgencyBadgeColor}`}>
                        {nlpData.urgency}
                    </span>
                </div>

            </div>

            {/* STAGE 1 & STAGE 2: TOKENIZATION & LEMMATIZATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* STAGE 1: TOKENIZATION */}
                <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span>1. Tokenization</span>
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                            Regex Splitting
                        </span>
                    </div>

                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                        Splits text stream into lexical token tokens indexable by position.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {nlpData.tokens.map((token, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-mono text-xs flex items-center gap-1.5 shadow-xs"
                            >
                                <span className="text-[9px] font-extrabold text-emerald-500">#{i}</span>
                                <span>{token}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* STAGE 2: LEMMATIZATION */}
                <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-teal-600" />
                            <span>2. Lemmatization & Normalization</span>
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                            Stem & Lemma
                        </span>
                    </div>

                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                        Maps inflected words back to dictionary root lemma forms (e.g. leaves ➔ leaf).
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {nlpData.lemmatized.map((item, i) => (
                            <span
                                key={i}
                                className={`px-2.5 py-1 rounded-xl border text-xs font-mono flex items-center gap-1 shadow-xs ${item.word.toLowerCase() !== item.lemma
                                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200 font-bold'
                                        : 'bg-emerald-50/50 dark:bg-emerald-900/30 border-emerald-200/50 text-emerald-800 dark:text-emerald-200'
                                    }`}
                            >
                                <span>{item.word}</span>
                                {item.word.toLowerCase() !== item.lemma && (
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">➔ {item.lemma}</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            {/* STAGE 3: POS TAGGING */}
            <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span>3. Part-of-Speech (POS) Tagging</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                        Grammatical Heuristics
                    </span>
                </div>

                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                    Annotates each token with grammatical category chips (NOUN, VERB, ADJ, DET, ADP, PRON, PUNCT).
                </p>

                <div className="flex flex-wrap gap-2">
                    {nlpData.posTagged.map((item, i) => (
                        <div
                            key={i}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 shadow-xs ${item.color}`}
                        >
                            <span className="font-bold">{item.word}</span>
                            <span className="text-[9px] font-black uppercase opacity-75 border-l border-current pl-1.5">
                                {item.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* STAGE 4: NAMED ENTITY RECOGNITION (NER) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span>4. Named Entity Recognition (NER)</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Botanical Entity Extractor
                    </span>
                </div>

                {nlpData.entities.length === 0 ? (
                    <p className="text-xs italic text-emerald-600/70 dark:text-emerald-400/70">
                        No domain botanical entities matched in this input. Try terms like "Monstera", "yellow leaves", "root rot", or "water".
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2.5">
                        {nlpData.entities.map((entity, i) => (
                            <div
                                key={i}
                                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 space-y-1"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${entity.color}`}>
                                        {entity.entityType}
                                    </span>
                                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-mono">
                                        [{entity.start}:{entity.end}]
                                    </span>
                                </div>
                                <p className="font-bold text-xs text-emerald-950 dark:text-emerald-100">"{entity.text}"</p>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">{entity.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* STAGE 5 & 6: INTENT & URGENCY DETECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* INTENT CLASSIFICATION */}
                <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span>5. Intent Classification</span>
                    </h3>

                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100">{nlpData.intent}</span>
                            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{nlpData.intentConfidence}% Confidence</span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-emerald-200 dark:bg-emerald-800 overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${nlpData.intentConfidence}%` }} />
                        </div>

                        <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 pt-1">
                            {nlpData.intentRationale}
                        </p>
                    </div>
                </div>

                {/* URGENCY DETECTION */}
                <div className="p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
                    <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>6. Urgency & Distress Evaluator</span>
                    </h3>

                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${nlpData.urgencyBadgeColor}`}>
                                Risk Level: {nlpData.urgency}
                            </span>
                            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">Score: {nlpData.urgencyScore}/100</span>
                        </div>

                        <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80 pt-1">
                            {nlpData.urgencyExplanation}
                        </p>
                    </div>
                </div>

            </div>

            {/* PIPELINE SUMMARY & TEXT FLOW DIAGRAM FOOTER */}
            <div className="p-6 rounded-3xl bg-emerald-900 text-white shadow-xl space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Sequential NLP Pipeline Flow Diagram</span>
                </h3>

                {/* ASCII Flow Diagram */}
                <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800/80 font-mono text-[11px] sm:text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded bg-emerald-800 text-white font-bold">Input Text</span>
                        <span>➔</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-800 text-emerald-200">1. Tokenizer ({nlpData.tokenCount})</span>
                        <span>➔</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-800 text-emerald-200">2. POS Tagging</span>
                        <span>➔</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-800 text-teal-200">3. NER ({nlpData.entityCount} entities)</span>
                        <span>➔</span>
                        <span className="px-2.5 py-1 rounded bg-amber-800 text-amber-200">4. Intent ({nlpData.intent})</span>
                        <span>➔</span>
                        <span className="px-2.5 py-1 rounded bg-rose-900 text-rose-200">5. Urgency ({nlpData.urgency})</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs pt-1">
                    {nlpData.pipelineSteps.map(step => (
                        <div key={step.step} className="p-2.5 rounded-xl bg-emerald-800/60 border border-emerald-700/50 space-y-1">
                            <span className="text-[10px] font-bold text-emerald-400 block">Stage #{step.step}</span>
                            <span className="font-bold text-white block truncate">{step.name}</span>
                            <span className="text-[10px] text-emerald-300/80 block">{step.detail}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

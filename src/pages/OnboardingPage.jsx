import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    Sprout,
    ArrowRight,
    CheckCircle,
    Sparkles,
    ShieldCheck,
    Scan,
    MessageSquare,
    Heart,
    Sun,
    Award,
    ChevronRight
} from 'lucide-react';

export const OnboardingPage = () => {
    const navigate = useNavigate();
    const { updateUserProfile } = useApp();
    const [step, setStep] = useState(0); // 0 = Splash, 1 = Quiz Step 1, 2 = Quiz Step 2, 3 = Goal Step

    const [experience, setExperience] = useState('beginner');
    const [selectedInterests, setSelectedInterests] = useState(['indoor', 'tropical']);
    const [primaryGoal, setPrimaryGoal] = useState('care_reminders');

    const toggleInterest = (interestId) => {
        setSelectedInterests(prev =>
            prev.includes(interestId)
                ? prev.filter(i => i !== interestId)
                : [...prev, interestId]
        );
    };

    const handleFinishQuiz = () => {
        updateUserProfile({
            experience,
            interests: selectedInterests,
            primaryGoal,
            hasCompletedOnboarding: true
        });
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">

            {/* Background Glow Orbs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Header Logo */}
            <div className="flex items-center justify-between z-10 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">PlantAI</span>
                </div>

                {step > 0 && (
                    <button
                        onClick={() => navigate('/home')}
                        className="text-xs text-emerald-300/80 hover:text-white transition-colors underline"
                    >
                        Skip to Dashboard
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="max-w-xl mx-auto w-full z-10 my-auto py-8">

                {/* STEP 0: SPLASH SCREEN */}
                {step === 0 && (
                    <div className="text-center space-y-6 animate-fade-in">

                        {/* Hero Image Showcase */}
                        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56">
                            <img
                                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"
                                alt="PlantAI Welcome"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl shadow-emerald-950 ring-4 ring-emerald-500/30 transform hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute -bottom-3 -right-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 text-xs font-semibold text-emerald-200">
                                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                                <span>AI Botanist Ready</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                Never kill another houseplant again.
                            </h1>
                            <p className="text-sm sm:text-base text-emerald-200/80 max-w-md mx-auto leading-relaxed">
                                Instant plant identification, 98% accurate leaf disease diagnosis, and a 24/7 personal botanist chatbot at your fingertips.
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className="grid grid-cols-3 gap-3 text-left py-2">
                            <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-sm">
                                <Scan className="w-5 h-5 text-emerald-400 mb-1" />
                                <h4 className="text-xs font-bold text-white">Instant Scan</h4>
                                <p className="text-[10px] text-emerald-300/70">ID 10,000+ species</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-sm">
                                <ShieldCheck className="w-5 h-5 text-teal-400 mb-1" />
                                <h4 className="text-xs font-bold text-white">AI Doctor</h4>
                                <p className="text-[10px] text-emerald-300/70">Treatment steps</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 backdrop-blur-sm">
                                <MessageSquare className="w-5 h-5 text-amber-400 mb-1" />
                                <h4 className="text-xs font-bold text-white">Plant Chat</h4>
                                <p className="text-[10px] text-emerald-300/70">Context memory</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* STEP 1: EXPERIENCE QUIZ */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 1 of 3</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">What is your plant parenting level?</h2>
                            <p className="text-xs sm:text-sm text-emerald-200/70">We customize watering reminders and care advice for you.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'beginner', title: 'Beginner Plant Parent 🌱', desc: 'I struggle keeping succulents alive or just bought my first plant.' },
                                { id: 'intermediate', title: 'Intermediate Gardener 🌿', desc: 'I own 3-10 plants, know basic watering, but want better health & growth.' },
                                { id: 'expert', title: 'Expert Botanist 🌳', desc: 'I manage an indoor jungle, propagate cuttings, and troubleshoot soil mixtures.' }
                            ].map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => setExperience(opt.id)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${experience === opt.id
                                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-950'
                                            : 'bg-emerald-900/30 border-emerald-800 text-emerald-100 hover:border-emerald-700'
                                        }`}
                                >
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-0.5">{opt.title}</h4>
                                        <p className="text-xs text-emerald-200/70">{opt.desc}</p>
                                    </div>
                                    {experience === opt.id && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setStep(0)}
                                className="py-3 px-5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                            >
                                <span>Continue</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: INTERESTS QUIZ */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 2 of 3</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">What plants excite you most?</h2>
                            <p className="text-xs sm:text-sm text-emerald-200/70">Select all that apply.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'indoor', title: 'Indoor Tropicals 🪴', tag: 'Monstera, Fiddle Leaf, Pothos' },
                                { id: 'succulents', title: 'Succulents & Cacti 🌵', tag: 'Snake plant, Aloe, Echeveria' },
                                { id: 'flowering', title: 'Flowering Plants 🌸', tag: 'Peace Lily, Orchids, Begonia' },
                                { id: 'edible', title: 'Edible Herbs & Veggies 🥬', tag: 'Basil, Mint, Cherry Tomatoes' }
                            ].map(item => {
                                const isSelected = selectedInterests.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleInterest(item.id)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${isSelected
                                                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                                                : 'bg-emerald-900/30 border-emerald-800 text-emerald-100 hover:border-emerald-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-sm">{item.title}</span>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                        </div>
                                        <span className="text-[10px] text-emerald-300/70">{item.tag}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setStep(1)}
                                className="py-3 px-5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                            >
                                <span>Continue</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PRIMARY GOAL */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 3 of 3</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">What is your main goal?</h2>
                            <p className="text-xs sm:text-sm text-emerald-200/70">You can change this later in settings.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'care_reminders', title: 'Schedule Smart Reminders', desc: 'Get automated alerts when plants need water or fertilizing.' },
                                { id: 'disease_scan', title: 'Diagnose Leaf Diseases', desc: 'Use AI visual scanning to fix yellowing, pests, or brown spots.' },
                                { id: 'ai_chatbot', title: 'Chat with AI Botanist Assistant', desc: 'Ask any plant care question 24/7 with multi-turn context memory.' }
                            ].map(goal => (
                                <div
                                    key={goal.id}
                                    onClick={() => setPrimaryGoal(goal.id)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${primaryGoal === goal.id
                                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                                            : 'bg-emerald-900/30 border-emerald-800 text-emerald-100 hover:border-emerald-700'
                                        }`}
                                >
                                    <div>
                                        <h4 className="font-bold text-sm text-white mb-0.5">{goal.title}</h4>
                                        <p className="text-xs text-emerald-200/70">{goal.desc}</p>
                                    </div>
                                    {primaryGoal === goal.id && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setStep(2)}
                                className="py-3 px-5 rounded-xl bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 font-semibold text-xs"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinishQuiz}
                                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                            >
                                <Sparkles className="w-5 h-5 text-emerald-950 animate-spin" style={{ animationDuration: '3s' }} />
                                <span>Enter PlantAI Dashboard</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Step Indicator Dots */}
            <div className="flex justify-center gap-2 z-10">
                {[0, 1, 2, 3].map(idx => (
                    <span
                        key={idx}
                        className={`h-2 rounded-full transition-all ${step === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-emerald-800/80'
                            }`}
                    />
                ))}
            </div>

        </div>
    );
};

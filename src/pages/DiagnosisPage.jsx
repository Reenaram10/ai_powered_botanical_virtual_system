import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import {
    ShieldAlert,
    CheckSquare,
    Square,
    MessageSquare,
    Sparkles,
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    Droplets,
    Sun,
    Activity,
    CheckCircle2
} from 'lucide-react';

export const DiagnosisPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setActiveChatContext, showToast } = useApp();

    const [loading, setLoading] = useState(true);
    const [diagnosisData, setDiagnosisData] = useState(null);
    const [treatmentSteps, setTreatmentSteps] = useState([]);

    useEffect(() => {
        const fetchDiagnosis = async () => {
            setLoading(true);
            try {
                const data = await apiService.diagnosePlant(id || 'demo');
                setDiagnosisData(data);
                setTreatmentSteps(data.treatmentPlan || []);
            } catch (err) {
                showToast('Error fetching diagnosis detail.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnosis();
    }, [id]);

    const toggleStepDone = (stepId) => {
        setTreatmentSteps(prev => prev.map(s => s.id === stepId ? { ...s, done: !s.done } : s));
        showToast('Treatment step updated!', 'success');
    };

    const handleDeepLinkChat = () => {
        if (!diagnosisData) return;
        setActiveChatContext({
            nickname: diagnosisData.plantName,
            speciesName: diagnosisData.plantName,
            diseaseContext: diagnosisData.diseaseName
        });
        navigate('/chat');
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-12 text-center space-y-4 animate-pulse">
                <ShieldAlert className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-100">Generating Disease Diagnosis...</h2>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Analyzing symptom patterns against plant pathology database...</p>
            </div>
        );
    }

    const completedStepsCount = treatmentSteps.filter(s => s.done).length;
    const progressPercent = Math.round((completedStepsCount / treatmentSteps.length) * 100) || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Top Back Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Scanner</span>
                </button>

                <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                    Diagnosis ID #{diagnosisData.id.slice(-4)}
                </span>
            </div>

            {/* HEADER CARD: Disease Name & Severity Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-emerald-950 text-white shadow-xl relative overflow-hidden space-y-4 border border-rose-800/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Severity: {diagnosisData.severity.toUpperCase()}</span>
                    </span>

                    <span className="text-xs font-semibold text-emerald-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        AI Confidence: {diagnosisData.confidence}%
                    </span>
                </div>

                <div>
                    <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Affected Plant:</span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">{diagnosisData.plantName}</h1>
                    <h2 className="text-lg text-rose-200 font-semibold mt-1 flex items-center gap-2">
                        <span>Issue: {diagnosisData.diseaseName}</span>
                    </h2>
                </div>

                {/* Cause Summary */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-rose-100 leading-relaxed">
                    <strong>Primary Cause:</strong> {diagnosisData.cause}
                </div>

                {/* Deep-link to Assistant CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-rose-200/80">Need custom step-by-step guidance for your specific soil mix?</p>
                    <button
                        onClick={handleDeepLinkChat}
                        className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white text-rose-950 font-bold text-xs shadow-lg hover:bg-rose-50 flex items-center justify-center gap-2 transition-transform hover:scale-102 shrink-0"
                    >
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        <span>Ask Assistant about this Issue</span>
                    </button>
                </div>
            </div>

            {/* TWO COLUMN CONTENT: Symptoms Left, Treatment Checklist Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column (1 col): Matched Symptoms & Risk Analysis */}
                <div className="space-y-4">
                    <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-rose-500" />
                        <span>Symptoms Matched</span>
                    </h3>

                    <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
                        {diagnosisData.symptomsMatched.map((symptom, idx) => (
                            <div key={idx} className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 flex items-start gap-2.5 text-xs text-rose-950 dark:text-rose-100">
                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <span>{symptom}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (2 cols): Interactive Treatment Plan */}
                <div className="md:col-span-2 space-y-4">

                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                            <span>Step-by-Step Recovery Plan</span>
                        </h3>

                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            {completedStepsCount} of {treatmentSteps.length} Steps Completed ({progressPercent}%)
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-emerald-100 dark:bg-emerald-900/60 h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3">
                        {treatmentSteps.map((step) => (
                            <div
                                key={step.id}
                                onClick={() => toggleStepDone(step.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${step.done
                                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700/60 opacity-80'
                                        : 'bg-white dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:border-emerald-400'
                                    }`}
                            >
                                <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                                    {step.done ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
                                    ) : (
                                        <Square className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <h4 className={`font-bold text-sm ${step.done ? 'line-through text-emerald-900/60 dark:text-emerald-200/60' : 'text-emerald-950 dark:text-emerald-100'}`}>
                                        Step {step.step}: {step.title}
                                    </h4>
                                    <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                                        {step.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>
    );
};

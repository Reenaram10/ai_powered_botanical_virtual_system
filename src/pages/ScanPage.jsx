import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import {
    UploadCloud,
    Camera,
    RotateCw,
    Crop,
    Sparkles,
    CheckCircle2,
    ShieldAlert,
    ArrowRight,
    Plus,
    MessageSquare,
    RefreshCw,
    Info
} from 'lucide-react';

export const ScanPage = () => {
    const navigate = useNavigate();
    const { addPlant, setActiveChatContext, showToast } = useApp();

    const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80');
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    const sampleImages = [
        { label: 'Monstera Leaf', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80' },
        { label: 'Leaf Spot Issue', url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80' },
        { label: 'Calathea Leaf', url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80' }
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedImage(url);
            setScanResult(null);
        }
    };

    const handleRunScan = async () => {
        setIsScanning(true);
        setScanResult(null);
        try {
            const result = await apiService.identifyPlant(selectedImage);
            setScanResult(result);
        } catch (err) {
            showToast('Scanning error, please try again.', 'error');
        } finally {
            setIsScanning(false);
        }
    };

    const handleSaveToCollection = () => {
        if (!scanResult) return;
        const match = scanResult.primaryMatch;
        const newPlant = addPlant({
            speciesId: match.id,
            nickname: match.name + ' #' + Math.floor(Math.random() * 100),
            speciesName: match.name,
            location: 'Living Room Window',
            thumbnail: selectedImage,
            healthStatus: scanResult.healthStatus.status,
            notes: `Scanned on ${new Date().toLocaleDateString()}. Confidence: ${scanResult.confidence}%`
        });
        navigate(`/plant/${newPlant.id}`);
    };

    const handleDeepLinkChat = () => {
        if (!scanResult) return;
        setActiveChatContext({
            speciesName: scanResult.primaryMatch.name,
            nickname: scanResult.primaryMatch.name,
            thumbnail: selectedImage
        });
        navigate('/chat');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Header Banner */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>AI Vision Engine v3.2</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">
                    Plant Identification & Leaf Health Scanner
                </h1>
                <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 max-w-lg mx-auto">
                    Upload or select a photo of leaves, stems, or flowers for instant species matching and disease detection.
                </p>
            </div>

            {/* TWO COLUMN WORKSPACE: Image Editor Left, Controls / Results Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* LEFT COLUMN: Upload & Preview Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-lg space-y-4">

                    <div className="relative h-72 sm:h-80 rounded-2xl bg-emerald-950/90 overflow-hidden flex items-center justify-center group border border-emerald-800/40">
                        {/* Scan animation line */}
                        {isScanning && <div className="animate-scan z-20" />}

                        <img
                            src={selectedImage}
                            alt="Scan target"
                            style={{
                                transform: `rotate(${rotation}deg) scale(${zoom})`,
                                transition: 'transform 0.3s ease'
                            }}
                            className="max-h-full max-w-full object-contain"
                        />

                        {/* Overlay Camera Badge */}
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Live Preview</span>
                        </div>

                        {/* Quick Sample Selector Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-center gap-2 overflow-x-auto py-1">
                            {sampleImages.map((samp, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setSelectedImage(samp.url); setScanResult(null); }}
                                    className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-[10px] text-emerald-200 border border-white/20 whitespace-nowrap"
                                >
                                    Demo {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Toolbar: Rotate, Zoom, Upload */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setRotation(r => (r + 90) % 360)}
                                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                                title="Rotate 90deg"
                            >
                                <RotateCw className="w-4 h-4" />
                                <span className="hidden sm:inline">Rotate</span>
                            </button>

                            <button
                                onClick={() => setZoom(z => (z === 1 ? 1.25 : z === 1.25 ? 1.5 : 1))}
                                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                                title="Toggle Zoom"
                            >
                                <Crop className="w-4 h-4" />
                                <span className="text-[11px] font-mono">{zoom}x</span>
                            </button>
                        </div>

                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors">
                            <UploadCloud className="w-4 h-4" />
                            <span>Choose Photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>

                    {/* Action CTA Button */}
                    <button
                        onClick={handleRunScan}
                        disabled={isScanning}
                        className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                        {isScanning ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                                <span>Analyzing Botanical Markers...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 text-amber-300" />
                                <span>Run AI Health & Species Scan</span>
                            </>
                        )}
                    </button>

                </div>

                {/* RIGHT COLUMN: Results Screen Card */}
                <div className="space-y-4">

                    {!scanResult && !isScanning && (
                        <div className="p-8 rounded-3xl bg-white dark:bg-emerald-950/40 border border-dashed border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                            <Info className="w-12 h-12 text-emerald-400 mx-auto" />
                            <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">Ready to Identify</h3>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 max-w-xs mx-auto">
                                Click "Run AI Health & Species Scan" on the left to get instant 90%+ match results.
                            </p>
                        </div>
                    )}

                    {isScanning && (
                        <div className="p-8 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-center space-y-4 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mx-auto text-emerald-600">
                                <Sparkles className="w-8 h-8 animate-spin" />
                            </div>
                            <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">Neural Network Analysis in Progress</h3>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                Matching leaf structure, vein geometry, and discoloration patterns against 10,000+ botanic samples...
                            </p>
                        </div>
                    )}

                    {scanResult && !isScanning && (
                        <div className="space-y-4 animate-fade-in">

                            {/* Primary Match Card */}
                            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl space-y-4 border border-emerald-700/50 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                                        Primary Match ({scanResult.confidence}% Confidence)
                                    </span>
                                    <span className="text-xs text-emerald-300 font-semibold">Match ID #{scanResult.scanId.slice(-4)}</span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-extrabold text-white">{scanResult.primaryMatch.name}</h2>
                                    <p className="text-xs italic text-emerald-300/80">{scanResult.primaryMatch.scientificName}</p>
                                </div>

                                <p className="text-xs text-emerald-100/90 leading-relaxed">
                                    {scanResult.primaryMatch.description}
                                </p>

                                {/* Matched Features */}
                                <div className="space-y-1.5 pt-2 border-t border-emerald-800/60">
                                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Identified Markers:</span>
                                    <ul className="text-xs space-y-1 text-emerald-100/80">
                                        {scanResult.primaryMatch.matchedFeatures.map((feat, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Health Status Pill */}
                                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-white block">Health Condition:</span>
                                        <span className="text-[11px] text-emerald-200">{scanResult.healthStatus.summary}</span>
                                    </div>
                                    <span className="text-lg font-extrabold text-emerald-300">{scanResult.healthStatus.score}/100</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2.5 pt-2">
                                    <button
                                        onClick={handleSaveToCollection}
                                        className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Save to My Plants</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/diagnosis/demo')}
                                        className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5"
                                    >
                                        <ShieldAlert className="w-4 h-4 text-amber-300" />
                                        <span>View Diagnosis</span>
                                    </button>
                                </div>
                            </div>

                            {/* Alternate Species Matches Card */}
                            <div className="p-5 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-3">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                                    Alternate Matches (Top 3)
                                </h3>

                                <div className="space-y-2">
                                    {scanResult.alternateMatches.map((alt, idx) => (
                                        <div key={idx} className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-900/30 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={alt.image} alt={alt.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-xs text-emerald-950 dark:text-emerald-100 truncate">{alt.name}</h4>
                                                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">{alt.confidence}% Similarity</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleDeepLinkChat}
                                                className="p-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
                                            >
                                                Ask AI
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

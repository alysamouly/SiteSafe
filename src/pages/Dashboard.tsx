import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { AnalysisView } from '../components/AnalysisView';
import { ReportSidebar } from '../components/ReportSidebar';
import { analyzeImage } from '../services/gemini';
import { AnalysisResult } from '../types';
import { AlertCircle, Loader2, ArrowRight, Download, FolderOpen, Plus, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { processImageFile } from '../utils/imageProcess';
import { generateInspectionPDF } from '../utils/generatePDF';

export function Dashboard() {
    const { addInspection, addReport, projects, activeProject, setActiveProject, addProject, inspections } = useAppContext();
    const [sessionSite, setSessionSite] = useState('');
    const [sessionInspector, setSessionInspector] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [selectedHazardId, setSelectedHazardId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showProjectSelector, setShowProjectSelector] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [lastInspectionId, setLastInspectionId] = useState<string | null>(null);

    const handleUpload = async (base64: string, mimeType: string, fileUrl: string) => {
        setImageUrl(fileUrl);
        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setSelectedHazardId(null);

        try {
            const analysisResult = await analyzeImage(base64, mimeType);
            const filteredHazards = analysisResult.hazards.filter(h => h.confidence >= 0.5);

            setResult({
                ...analysisResult,
                hazards: filteredHazards,
            });

            const hazardsCount = filteredHazards.length;
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const savedInspection = await addInspection({
                site: sessionSite || 'Unknown Site',
                date: today,
                inspector: sessionInspector || 'System User',
                hazards: hazardsCount,
                imageUrl: fileUrl,
                hazardDetails: filteredHazards,
                reasoning: analysisResult.reasoning || '',
                projectId: activeProject?.id || '',
            });

            setLastInspectionId(savedInspection.id);

            await addReport({
                title: `${sessionSite || 'Unknown Site'} Compliance Report`,
                date: today,
                size: '1.4 MB',
                type: 'Post-Scan',
                inspectionId: savedInspection.id,
            });

        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExportPDF = () => {
        if (lastInspectionId) {
            const inspection = inspections.find(i => i.id === lastInspectionId);
            if (inspection) generateInspectionPDF(inspection);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

            {/* Dashboard Header */}
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">Hazard Detection Dashboard</h1>
                        <p className="font-data text-dark/60 mt-4 text-sm">Upload site photos to automatically detect and classify safety hazards.</p>
                    </div>
                    {result && lastInspectionId && (
                        <button
                            onClick={handleExportPDF}
                            className="inline-flex items-center px-6 py-3 bg-dark text-paper font-heading font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-accent transition-colors shrink-0"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                        </button>
                    )}
                </div>
            </div>

            {/* Project Selector Bar */}
            <div className="mb-6 bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-accent" />
                    <div>
                        <span className="font-data text-[10px] uppercase tracking-widest text-dark/50 block">Active Project</span>
                        <span className="font-heading font-bold text-dark text-sm uppercase">
                            {activeProject ? `${activeProject.id} — ${activeProject.name}` : 'No Project Selected'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {projects.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProjectSelector(!showProjectSelector)}
                                className="inline-flex items-center px-4 py-2 border border-dark/10 rounded-full font-heading font-bold text-[10px] uppercase tracking-widest text-dark hover:bg-dark/5 transition-colors"
                            >
                                Switch Project <ChevronDown className="w-3 h-3 ml-2" />
                            </button>
                            {showProjectSelector && (
                                <div className="absolute right-0 mt-2 w-64 bg-paper border border-dark/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                    {projects.map(proj => (
                                        <button
                                            key={proj.id}
                                            onClick={() => {
                                                setActiveProject(proj);
                                                setShowProjectSelector(false);
                                                setIsSessionActive(false);
                                                setImageUrl(null);
                                                setResult(null);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-dark/5 transition-colors border-b border-dark/5 last:border-0 ${activeProject?.id === proj.id ? 'bg-accent/5' : ''}`}
                                        >
                                            <span className="font-data text-[10px] uppercase tracking-widest text-dark/50 block">{proj.id}</span>
                                            <span className="font-heading font-bold text-sm text-dark">{proj.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            placeholder="New project name..."
                            className="px-3 py-2 border border-dark/10 rounded-full font-data text-xs bg-white focus:outline-none focus:border-accent w-44"
                        />
                        <button
                            onClick={async () => {
                                if (newProjectName.trim()) {
                                    await addProject(newProjectName.trim());
                                    setNewProjectName('');
                                    setIsSessionActive(false);
                                    setImageUrl(null);
                                    setResult(null);
                                }
                            }}
                            disabled={!newProjectName.trim()}
                            className="inline-flex items-center px-4 py-2 bg-dark text-paper rounded-full font-heading font-bold text-[10px] uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Create
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Column: Upload & Image View */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    {!isSessionActive ? (
                        <div
                            className="flex-1 flex flex-col items-center justify-center bg-paper rounded-[2rem] shadow-sm border border-dark/10 p-12 text-center h-[500px]"
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                    setSessionSite(sessionSite || activeProject?.name || 'Auto-Detected Site');
                                    setSessionInspector(sessionInspector || 'System User');
                                    setIsSessionActive(true);
                                    processImageFile(e.dataTransfer.files[0], handleUpload);
                                }
                            }}
                        >
                            <h2 className="font-heading font-black text-2xl text-dark uppercase tracking-wide mb-2 pointer-events-none">
                                {activeProject ? 'Add Inspection to Project' : 'Create a New Inspection'}
                            </h2>
                            <p className="font-data text-sm text-dark/50 mb-8 max-w-sm pointer-events-none">
                                {activeProject
                                    ? `Add a new photo to ${activeProject.name}, or drag and drop directly.`
                                    : 'Enter site details to begin, or drag and drop a photo directly onto this area.'
                                }
                            </p>

                            <div className="w-full max-w-sm space-y-4">
                                <input
                                    type="text"
                                    value={sessionSite}
                                    onChange={e => setSessionSite(e.target.value)}
                                    placeholder={activeProject ? `Area (e.g. North Wing)` : "Site Name (e.g. North Wing Excavation)"}
                                    className="w-full px-4 py-3 bg-white border border-dark/10 rounded-xl font-data text-sm focus:outline-none focus:border-accent"
                                />
                                <input
                                    type="text"
                                    value={sessionInspector}
                                    onChange={e => setSessionInspector(e.target.value)}
                                    placeholder="Inspector Name"
                                    className="w-full px-4 py-3 bg-white border border-dark/10 rounded-xl font-data text-sm focus:outline-none focus:border-accent"
                                />
                                <button
                                    onClick={() => {
                                        if (sessionSite.trim() && sessionInspector.trim()) setIsSessionActive(true);
                                    }}
                                    disabled={!sessionSite.trim() || !sessionInspector.trim()}
                                    className="w-full py-4 mt-4 bg-dark text-paper font-heading font-bold text-sm tracking-widest uppercase rounded-xl disabled:opacity-50 flex items-center justify-center transition-colors hover:bg-accent"
                                >
                                    Start Session <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : !imageUrl ? (
                        <div className="flex-1 flex items-center justify-center bg-paper rounded-[2rem] shadow-sm border border-dark/10">
                            <ImageUpload onUpload={handleUpload} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col bg-paper rounded-[2rem] border border-dark/10 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-dark/10 flex items-center justify-between bg-background">
                                <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">Site Analysis</h2>
                                <button
                                    onClick={() => {
                                        setImageUrl(null);
                                        setResult(null);
                                        setError(null);
                                    }}
                                    className="text-xs font-data text-dark/50 hover:text-dark font-medium transition-colors uppercase tracking-widest"
                                >
                                    Upload New Image
                                </button>
                            </div>

                            <div className="flex-1 p-4 relative min-h-[400px]">
                                <AnalysisView
                                    imageUrl={imageUrl}
                                    hazards={result?.hazards || []}
                                    isAnalyzing={isAnalyzing}
                                    selectedHazardId={selectedHazardId}
                                    onSelectHazard={setSelectedHazardId}
                                />

                                {isAnalyzing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-paper/50 backdrop-blur-sm z-20 rounded-[2rem] m-4">
                                        <div className="bg-paper border border-dark/10 p-8 rounded-[2rem] shadow-xl flex flex-col items-center gap-4">
                                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                            <div className="text-center">
                                                <p className="font-heading font-bold text-dark uppercase tracking-wider">Scanning for Hazards...</p>
                                                <p className="font-data text-xs text-dark/60 mt-2">Analyzing OSHA & ISO compliance</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-xl m-4">
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-200 flex flex-col items-center gap-4 max-w-md text-center">
                                            <AlertCircle className="w-10 h-10 text-red-500" />
                                            <div>
                                                <p className="font-semibold text-red-900 mb-1">Analysis Failed</p>
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setImageUrl(null);
                                                    setError(null);
                                                }}
                                                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reasoning Section */}
                    {result?.reasoning && (
                        <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-8 mt-6">
                            <h3 className="font-data text-xs font-bold text-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                AI Reasoning
                            </h3>
                            <p className="font-data text-dark/70 text-sm leading-relaxed">
                                {result.reasoning}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <div className="w-full lg:w-96 shrink-0 bg-paper rounded-[2rem] border border-dark/10 shadow-sm overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] lg:sticky lg:top-24 mt-6 lg:mt-0">
                    {imageUrl && !isAnalyzing && !error ? (
                        <ReportSidebar
                            hazards={result?.hazards || []}
                            selectedHazardId={selectedHazardId}
                            onSelectHazard={setSelectedHazardId}
                            onExportPDF={handleExportPDF}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
                            <div className="w-16 h-16 bg-dark/5 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-dark/40" />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-dark mb-2 uppercase tracking-widest">Risk Report</h3>
                            <p className="font-data text-dark/60 text-sm">
                                Upload an image to generate a detailed safety compliance report.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

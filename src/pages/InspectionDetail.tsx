import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, ArrowLeft, Shield, Download } from 'lucide-react';
import { generateInspectionPDF } from '../utils/generatePDF';

export function InspectionDetail() {
    const { id } = useParams<{ id: string }>();
    const { inspections } = useAppContext();
    const inspection = inspections.find(ins => ins.id === id);

    if (!inspection) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
                <h1 className="font-heading font-black text-3xl text-dark uppercase mb-4">Inspection Not Found</h1>
                <p className="font-data text-dark/60 mb-8">The inspection record you are looking for does not exist.</p>
                <Link to="/inspections" className="font-heading font-bold text-sm uppercase tracking-widest text-accent hover:text-dark transition-colors">
                    <ArrowLeft className="w-4 h-4 inline mr-2" />Back to Archive
                </Link>
            </div>
        );
    }

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'High': return 'bg-red-50 border-red-200 text-red-800';
            case 'Medium': return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'Low': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
            default: return 'bg-dark/5 border-dark/10 text-dark';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'High': return 'rgba(220, 38, 38, 0.7)';
            case 'Medium': return 'rgba(217, 119, 6, 0.7)';
            case 'Low': return 'rgba(22, 163, 74, 0.7)';
            default: return 'rgba(100, 100, 100, 0.7)';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <div className="mb-8 border-b border-dark/10 pb-6 mt-4">
                <Link to="/inspections" className="font-data text-xs uppercase tracking-widest text-dark/50 hover:text-accent transition-colors flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-3 h-3" /> Back to Archive
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-heading font-black text-dark tracking-tight uppercase">{inspection.id}</h1>
                        <p className="font-data text-dark/60 mt-2 text-sm">{inspection.site} &bull; {inspection.date} &bull; Inspector: {inspection.inspector}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-2 border rounded-sm text-[10px] font-data font-bold tracking-widest uppercase ${inspection.hazards > 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {inspection.hazards} Hazard{inspection.hazards !== 1 ? 's' : ''} Detected
                        </span>
                        <button
                            onClick={() => generateInspectionPDF(inspection)}
                            className="inline-flex items-center px-5 py-2 bg-dark text-paper font-heading font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
                        >
                            <Download className="w-3 h-3 mr-2" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image with hazard circles */}
                <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-dark/10 bg-background">
                        <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">Site Photo</h2>
                    </div>
                    <div className="p-4 relative">
                        {inspection.imageUrl ? (
                            <div className="relative">
                                <img src={inspection.imageUrl} alt={`${inspection.site} photo`} className="w-full h-auto rounded-xl border border-dark/10" />
                                {/* Hazard circles overlay */}
                                {inspection.hazardDetails.map((hazard, idx) => (
                                    <div
                                        key={hazard.hazard_id}
                                        className="absolute pointer-events-none"
                                        style={{
                                            left: `${hazard.x}%`,
                                            top: `${hazard.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <div
                                            className="rounded-full border-2 flex items-center justify-center animate-pulse"
                                            style={{
                                                width: `${hazard.radius * 6}px`,
                                                height: `${hazard.radius * 6}px`,
                                                borderColor: getSeverityColor(hazard.severity),
                                                backgroundColor: getSeverityColor(hazard.severity).replace('0.7', '0.15'),
                                            }}
                                        >
                                            <span className="font-data font-bold text-white text-[10px] drop-shadow-md">{idx + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 bg-dark/5 rounded-xl flex items-center justify-center">
                                <p className="font-data text-dark/40 text-sm">Image not available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Hazards */}
                <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-dark/10 bg-background flex items-center gap-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <h2 className="font-heading font-bold text-dark uppercase tracking-widest text-sm">Detected Hazards</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-dark/10">
                        {inspection.hazardDetails.length > 0 ? inspection.hazardDetails.map((hazard, idx) => (
                            <div key={hazard.hazard_id} className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-data text-accent font-bold text-xs">{String(idx + 1).padStart(2, '0')}</span>
                                        <h3 className="font-heading font-bold text-dark uppercase text-sm">{hazard.type}</h3>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-1 border rounded-sm text-[10px] font-data font-bold tracking-widest uppercase ${getSeverityStyle(hazard.severity)}`}>
                                        {hazard.severity}
                                    </span>
                                </div>
                                <p className="font-data text-dark/70 text-sm mb-3 leading-relaxed">{hazard.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span className="font-data text-[10px] uppercase tracking-widest text-dark/40 font-bold shrink-0 mt-0.5">Regulation</span>
                                        <span className="font-data text-xs text-dark/70">{hazard.regulation}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-data text-[10px] uppercase tracking-widest text-dark/40 font-bold shrink-0 mt-0.5">Mitigation</span>
                                        <span className="font-data text-xs text-dark/70">{hazard.mitigation}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-data text-[10px] uppercase tracking-widest text-dark/40 font-bold shrink-0 mt-0.5">Confidence</span>
                                        <span className="font-data text-xs text-dark/70">{Math.round(hazard.confidence * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center">
                                <p className="font-data text-sm text-dark/50">No hazards detected in this inspection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Reasoning */}
            {inspection.reasoning && (
                <div className="bg-paper rounded-[2rem] border border-dark/10 shadow-sm p-8 mt-8">
                    <h3 className="font-data text-xs font-bold text-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        AI Reasoning
                    </h3>
                    <p className="font-data text-dark/70 text-sm leading-relaxed">{inspection.reasoning}</p>
                </div>
            )}
        </div>
    );
}

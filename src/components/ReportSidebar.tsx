import React from 'react';
import { Hazard } from '../types';
import { AlertTriangle, ShieldAlert, ShieldCheck, Download } from 'lucide-react';

interface ReportSidebarProps {
  hazards: Hazard[];
  selectedHazardId: string | null;
  onSelectHazard: (id: string) => void;
  onExportPDF?: () => void;
}

export function ReportSidebar({ hazards, selectedHazardId, onSelectHazard, onExportPDF }: ReportSidebarProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'low':
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-600 border-red-200 font-data text-[10px] font-bold tracking-widest uppercase';
      case 'medium':
        return 'bg-amber-50 text-amber-600 border-amber-200 font-data text-[10px] font-bold tracking-widest uppercase';
      case 'low':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 font-data text-[10px] font-bold tracking-widest uppercase';
      default:
        return 'bg-dark/5 text-dark border-dark/10 font-data text-[10px] font-bold tracking-widest uppercase';
    }
  };

  const handleExport = () => {
    if (onExportPDF) onExportPDF();
  };

  if (hazards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border-l border-dark/10 bg-paper">
        <ShieldCheck className="w-16 h-16 text-dark/20 mb-4" />
        <h3 className="text-xl font-heading font-black text-dark tracking-tight uppercase mb-2">No Hazards Detected</h3>
        <p className="font-data text-dark/60 text-sm">Upload an image to scan for safety compliance issues.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l border-dark/10 bg-paper">
      <div className="p-6 border-b border-dark/10 flex items-center justify-between bg-background">
        <div>
          <h2 className="font-heading font-bold text-lg text-dark tracking-tight uppercase">Risk Report</h2>
          <p className="font-data text-xs text-dark/60 mt-1">{hazards.length} hazards identified</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-dark text-paper rounded-full text-[10px] font-heading font-bold hover:bg-accent transition-colors uppercase tracking-widest"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {hazards.map((hazard) => (
          <div
            key={hazard.hazard_id}
            onClick={() => onSelectHazard(hazard.hazard_id)}
            className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-200 ${selectedHazardId === hazard.hazard_id
              ? 'border-dark bg-dark/5 shadow-sm'
              : 'border-transparent hover:border-dark/10 hover:bg-dark/5'
              }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getSeverityIcon(hazard.severity)}
                <h3 className="font-heading font-bold text-dark uppercase">{hazard.type}</h3>
              </div>
              <span className={`px-2 py-1 rounded-sm border ${getSeverityBadge(hazard.severity)}`}>
                {hazard.severity.toUpperCase()}
              </span>
            </div>

            <div className="space-y-4 text-sm mt-4">
              <div>
                <span className="font-data text-dark/50 text-[10px] uppercase tracking-widest block mb-1">Regulation</span>
                <span className="inline-block bg-dark/10 text-dark px-2 py-1 rounded-sm text-xs font-data font-bold">
                  {hazard.regulation}
                </span>
              </div>

              <div>
                <span className="font-data text-dark/50 text-[10px] uppercase tracking-widest block mb-1">Observation</span>
                <p className="font-data text-dark/80 text-xs leading-relaxed">{hazard.description}</p>
              </div>

              <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 mt-4">
                <span className="font-data text-accent text-[10px] uppercase tracking-widest block mb-1">Mitigation</span>
                <p className="font-data text-dark/80 text-xs leading-relaxed">{hazard.mitigation}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark/10 mt-4">
                <span className="font-data text-dark/40 text-[10px] uppercase tracking-widest">Confidence Score</span>
                <span className="font-data text-dark/60 text-[10px] font-bold">{(hazard.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

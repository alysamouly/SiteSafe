import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Hazard } from '../types';

interface AnalysisViewProps {
  imageUrl: string;
  hazards: Hazard[];
  isAnalyzing: boolean;
  selectedHazardId: string | null;
  onSelectHazard: (id: string) => void;
}

export function AnalysisView({ imageUrl, hazards, isAnalyzing, selectedHazardId, onSelectHazard }: AnalysisViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'border-red-500 bg-red-500/20';
      case 'medium':
        return 'border-amber-500 bg-amber-500/20';
      case 'low':
        return 'border-emerald-500 bg-emerald-500/20';
      default:
        return 'border-dark/50 bg-dark/20';
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] bg-background border border-dark/10 rounded-[2rem] overflow-hidden flex items-center justify-center p-2 md:p-8">
      <div className="relative inline-block max-w-full max-h-full">
        {/* Image */}
        <img
          src={imageUrl}
          alt="Construction Site"
          className="max-w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-xl shadow-md border border-dark/10"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Scanning Effect */}
        {isAnalyzing && imageLoaded && (
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_30px_5px_var(--color-accent)] z-10"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Hazard Overlays */}
        {!isAnalyzing && imageLoaded && hazards.map((hazard) => {
          const isSelected = selectedHazardId === hazard.hazard_id;
          return (
            <motion.div
              key={hazard.hazard_id}
              className={`absolute rounded-full border-2 cursor-pointer transition-all duration-200 ${getSeverityColor(hazard.severity)} ${isSelected ? 'ring-4 ring-white/50 shadow-xl scale-110' : 'hover:scale-105'}`}
              style={{
                left: `${hazard.x}%`,
                top: `${hazard.y}%`,
                width: `${hazard.radius * 2}%`,
                height: `${hazard.radius * 2}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onSelectHazard(hazard.hazard_id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {isSelected && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-paper font-heading font-black tracking-widest uppercase text-[10px] px-3 py-1.5 rounded-sm shadow-lg whitespace-nowrap z-20">
                  {hazard.type}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

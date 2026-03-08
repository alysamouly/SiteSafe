export interface Hazard {
  hazard_id: string;
  type: string;
  regulation: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  mitigation: string;
  confidence: number;
  x: number;
  y: number;
  radius: number;
}

export interface AnalysisResult {
  reasoning: string;
  hazards: Hazard[];
}

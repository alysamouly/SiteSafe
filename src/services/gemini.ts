/// <reference types="vite/client" />
import { AnalysisResult } from '../types';

export async function analyzeImage(base64Image: string, mimeType: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not set. Using mock analysis data.');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          reasoning: "The image shows a construction site with multiple active zones. Identifying key structural elements and worker placements. Several safety protocols appear to be violated. Proceeding to flag hazards.",
          hazards: [
            {
              hazard_id: "mock-1",
              type: "Missing Hard Hat",
              regulation: "OSHA 1926.100(a)",
              severity: "High",
              description: "Worker in active excavation zone is not wearing head protection.",
              mitigation: "Immediately issue hard hat to worker and conduct safety briefing.",
              confidence: 0.95,
              x: 45,
              y: 60,
              radius: 5
            },
            {
              hazard_id: "mock-2",
              type: "Unsecured Scaffolding",
              regulation: "OSHA 1926.451(c)(1)",
              severity: "High",
              description: "Scaffolding base lacks proper bracing against lateral movement.",
              mitigation: "Halt work on scaffolding and install cross-bracing per manufacturer guidelines.",
              confidence: 0.88,
              x: 75,
              y: 30,
              radius: 8
            }
          ]
        });
      }, 3000);
    });
  }

  const prompt = `You are a Lead Safety Inspector specializing in OSHA and ISO standards. 
Your task is to analyze construction site images and identify physical hazards.

### Output Requirements:
1. Coordinates: Provide 'x' and 'y' as percentages (0-100) relative to the image dimensions.
2. 'x' and 'y' should represent the center point of the hazard.
3. Include a 'radius' property (1-20) representing the size of the hazard area.
4. Reason about the scene first, then output the hazards.
5. Include specific OSHA/ISO Codes in the regulation field.
6. Return a confidence score (0.0 to 1.0) for each hazard.

### JSON Schema:
{
  "reasoning": "Reason about the scene first to identify potential hazards.",
  "hazards": [
    {
      "hazard_id": "string",
      "type": "string",
      "regulation": "OSHA/ISO Code",
      "severity": "Low" | "Medium" | "High",
      "description": "Short explanation",
      "mitigation": "Actionable fix",
      "confidence": number,
      "x": number,
      "y": number,
      "radius": number
    }
  ]
}

Respond ONLY with the JSON object, no markdown formatting.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini API error:', response.status, errorBody);
    throw new Error(`Gemini API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('No text in Gemini response:', JSON.stringify(data));
    throw new Error('No response text from Gemini API');
  }

  try {
    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error('Failed to parse Gemini response:', text);
    throw new Error('Failed to parse analysis results');
  }
}

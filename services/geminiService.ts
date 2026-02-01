import type { AnalysisResult } from '../types';

// Lightweight mock of an image analysis service. Returns a guess based on file size/seed.
export const analyzeWheelImage = async (file: File): Promise<AnalysisResult> => {
  // Simulate network/API delay
  await new Promise((res) => setTimeout(res, 900));

  // crude heuristic for demo: use file size to decide severity
  const size = file.size || 0;
  if (size < 10000) {
    return {
      condition: 'Image too small to analyze reliably',
      recommendation: 'Please upload a higher-resolution photo taken close to the wheel.',
      estimatedEffort: 'Low'
    };
  }

  // Randomized demo outputs
  const outcomes: AnalysisResult[] = [
    { condition: 'Minor curb rash detected', recommendation: 'Refurbish and touch-up paint', estimatedEffort: 'Low' },
    { condition: 'Moderate alloy damage', recommendation: 'Repair and balance', estimatedEffort: 'Medium' },
    { condition: 'Severe corrosion and deformation', recommendation: 'Recommend replacement or full refurb', estimatedEffort: 'High' }
  ];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};
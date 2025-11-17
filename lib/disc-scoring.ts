// lib/disc-scoring.ts
import { DISCScore, DISCTrait, QuizQuestion, QuizOption } from '@/types/disc-personality';

/**
 * Calculate DISC scores from quiz answers
 * @param questions - The quiz questions
 * @param answers - Array of selected option indices (one per question)
 * @returns Calculated DISC scores (0-100 for each trait)
 */
export function calculateDISCScoresFromQuiz(
  questions: QuizQuestion[],
  answers: number[]
): DISCScore {
  // Initialize raw scores
  const rawScores = {
    dominance: 0,
    influence: 0,
    steadiness: 0,
    conscientiousness: 0
  };

  // Max possible score per trait
  let maxPossiblePerTrait = 0;

  // Sum up weighted scores
  questions.forEach((question, index) => {
    const selectedOptionIndex = answers[index];
    if (selectedOptionIndex === undefined || selectedOptionIndex === null) {
      return; // Skip unanswered questions
    }

    const selectedOption = question.options[selectedOptionIndex];
    if (!selectedOption) return;

    // Add weights to raw scores
    Object.entries(selectedOption.weights).forEach(([trait, weight]) => {
      if (weight) {
        rawScores[trait as DISCTrait] += weight;
      }
    });

    // Track max possible (assuming max weight is 3 per question)
    maxPossiblePerTrait += 3;
  });

  // Normalize scores to 0-100 scale
  const normalizedScores: DISCScore = {
    dominance: normalizeScore(rawScores.dominance, maxPossiblePerTrait),
    influence: normalizeScore(rawScores.influence, maxPossiblePerTrait),
    steadiness: normalizeScore(rawScores.steadiness, maxPossiblePerTrait),
    conscientiousness: normalizeScore(rawScores.conscientiousness, maxPossiblePerTrait)
  };

  return normalizedScores;
}

/**
 * Normalize a raw score to 0-100 scale
 */
function normalizeScore(rawScore: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  const normalized = (rawScore / maxPossible) * 100;
  return Math.round(Math.max(0, Math.min(100, normalized))); // Clamp between 0-100
}

/**
 * Validate DISC scores (ensure all are between 0-100)
 */
export function validateDISCScores(scores: DISCScore): boolean {
  return (
    scores.dominance >= 0 && scores.dominance <= 100 &&
    scores.influence >= 0 && scores.influence <= 100 &&
    scores.steadiness >= 0 && scores.steadiness <= 100 &&
    scores.conscientiousness >= 0 && scores.conscientiousness <= 100
  );
}

/**
 * Get the level (low/moderate/high) for a specific trait score
 */
export function getTraitLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

/**
 * Determine dominant traits (those scoring 60 or higher)
 * Returns top 1-2 traits
 */
export function getDominantTraits(scores: DISCScore): DISCTrait[] {
  const traits: Array<{ trait: DISCTrait; score: number }> = [
    { trait: 'dominance', score: scores.dominance },
    { trait: 'influence', score: scores.influence },
    { trait: 'steadiness', score: scores.steadiness },
    { trait: 'conscientiousness', score: scores.conscientiousness }
  ];

  // Sort by score descending
  traits.sort((a, b) => b.score - a.score);

  // Get top traits that are >= 60
  const dominant = traits.filter(t => t.score >= 60);

  if (dominant.length === 0) {
    // If no trait is 60+, just return the highest one
    return [traits[0].trait];
  }

  if (dominant.length === 1) {
    return [dominant[0].trait];
  }

  // If multiple traits >= 60, return top 2 if second is within 10 points of first
  if (dominant.length >= 2) {
    const diff = dominant[0].score - dominant[1].score;
    if (diff <= 10) {
      return [dominant[0].trait, dominant[1].trait];
    }
    return [dominant[0].trait];
  }

  return [dominant[0].trait];
}

/**
 * Get a short trait identifier (D, I, S, or C)
 */
export function getTraitInitial(trait: DISCTrait): string {
  return trait.charAt(0).toUpperCase();
}

/**
 * Get trait color for visualizations
 */
export function getTraitColor(trait: DISCTrait): string {
  const colors = {
    dominance: '#EF4444',
    influence: '#F59E0B',
    steadiness: '#10B981',
    conscientiousness: '#3B82F6'
  };
  return colors[trait];
}

/**
 * Get trait icon emoji
 */
export function getTraitIcon(trait: DISCTrait): string {
  const icons = {
    dominance: '💪',
    influence: '🤝',
    steadiness: '🛡️',
    conscientiousness: '🎯'
  };
  return icons[trait];
}

/**
 * Format DISC scores for display
 */
export function formatScoresForDisplay(scores: DISCScore): string {
  return `D: ${scores.dominance} | I: ${scores.influence} | S: ${scores.steadiness} | C: ${scores.conscientiousness}`;
}

/**
 * Calculate similarity between two DISC profiles (0-100)
 * Useful for matching or comparing profiles
 */
export function calculateProfileSimilarity(
  profile1: DISCScore,
  profile2: DISCScore
): number {
  const dDiff = Math.abs(profile1.dominance - profile2.dominance);
  const iDiff = Math.abs(profile1.influence - profile2.influence);
  const sDiff = Math.abs(profile1.steadiness - profile2.steadiness);
  const cDiff = Math.abs(profile1.conscientiousness - profile2.conscientiousness);

  // Average difference across all traits
  const avgDiff = (dDiff + iDiff + sDiff + cDiff) / 4;

  // Convert to similarity score (lower diff = higher similarity)
  const similarity = 100 - avgDiff;

  return Math.round(Math.max(0, Math.min(100, similarity)));
}

/**
 * Check if a profile is balanced (all traits within 40-70 range)
 */
export function isBalancedProfile(scores: DISCScore): boolean {
  return (
    scores.dominance >= 40 && scores.dominance <= 70 &&
    scores.influence >= 40 && scores.influence <= 70 &&
    scores.steadiness >= 40 && scores.steadiness <= 70 &&
    scores.conscientiousness >= 40 && scores.conscientiousness <= 70
  );
}

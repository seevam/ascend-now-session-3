// lib/matching-algorithm.ts
import {
  PersonalityCareerCriteria,
  PersonalityFitScore,
  CareerForMatching,
  MatchingInsight
} from '@/types/career-matching';
import { DISCProfile, DISCTrait, DISCScore } from '@/types/disc-personality';
import personalityCareerMap from '@/data/personality-career-map.json';

/**
 * Calculate how well a person's DISC profile fits a specific career
 * @param career - The career to evaluate
 * @param discProfile - The person's DISC profile
 * @returns Fit score and analysis
 */
export function calculateDISCFit(
  career: CareerForMatching,
  discProfile: DISCProfile
): PersonalityFitScore {
  // Get career criteria
  const careerCriteriaMap = personalityCareerMap.careerCriteria as Record<string, PersonalityCareerCriteria>;
  const criteria = careerCriteriaMap[career.id];

  if (!criteria) {
    // Default scoring if career not found in map
    return {
      careerId: career.id,
      discFit: 50,
      overallFit: 50,
      reasoning: "No specific personality data available for this career.",
      strengths: [],
      considerations: [],
      traitFits: {
        dominance: 50,
        influence: 50,
        steadiness: 50,
        conscientiousness: 50
      }
    };
  }

  // Calculate fit for each DISC trait
  const traitFits = calculateIndividualTraitFits(
    discProfile.scores,
    criteria.discTraits
  );

  // Calculate overall DISC fit (weighted average)
  const discFit = calculateWeightedFit(traitFits, criteria.discTraits);

  // Generate reasoning
  const reasoning = generateReasoning(discProfile, criteria);

  // Identify strengths and considerations
  const { strengths, considerations } = identifyStrengthsAndConsiderations(
    discProfile,
    criteria
  );

  return {
    careerId: career.id,
    discFit,
    overallFit: discFit, // For now, just use DISC fit. Can add TypeFinder later
    reasoning,
    strengths,
    considerations,
    traitFits
  };
}

/**
 * Calculate fit for each individual DISC trait
 */
function calculateIndividualTraitFits(
  scores: DISCScore,
  discTraits: PersonalityCareerCriteria['discTraits']
): Record<DISCTrait, number> {
  const fits: Record<DISCTrait, number> = {
    dominance: 50,
    influence: 50,
    steadiness: 50,
    conscientiousness: 50
  };

  const traits: DISCTrait[] = ['dominance', 'influence', 'steadiness', 'conscientiousness'];

  traits.forEach(trait => {
    const score = scores[trait];

    if (discTraits.primary.includes(trait)) {
      // Primary trait: high score = high fit
      fits[trait] = score;
    } else if (discTraits.avoid && discTraits.avoid.includes(trait)) {
      // Avoid trait: low score = high fit
      fits[trait] = 100 - score;
    } else if (discTraits.secondary && discTraits.secondary.includes(trait)) {
      // Secondary trait: moderate-to-high score is good
      if (score >= 50) {
        fits[trait] = score;
      } else {
        fits[trait] = 50 + (score / 2); // Scale 0-50 to 50-75
      }
    } else {
      // Neutral trait: moderate score is best (around 50)
      fits[trait] = 100 - Math.abs(50 - score);
    }
  });

  return fits;
}

/**
 * Calculate weighted overall fit
 */
function calculateWeightedFit(
  traitFits: Record<DISCTrait, number>,
  discTraits: PersonalityCareerCriteria['discTraits']
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  // Primary traits have weight 3
  discTraits.primary.forEach(trait => {
    weightedSum += traitFits[trait] * 3;
    totalWeight += 3;
  });

  // Secondary traits have weight 1
  if (discTraits.secondary) {
    discTraits.secondary.forEach(trait => {
      weightedSum += traitFits[trait] * 1;
      totalWeight += 1;
    });
  }

  // Avoid traits have weight 2 (but inverted)
  if (discTraits.avoid) {
    discTraits.avoid.forEach(trait => {
      weightedSum += traitFits[trait] * 2;
      totalWeight += 2;
    });
  }

  // All other traits have weight 0.5
  const allTraits: DISCTrait[] = ['dominance', 'influence', 'steadiness', 'conscientiousness'];
  allTraits.forEach(trait => {
    if (
      !discTraits.primary.includes(trait) &&
      !discTraits.secondary?.includes(trait) &&
      !discTraits.avoid?.includes(trait)
    ) {
      weightedSum += traitFits[trait] * 0.5;
      totalWeight += 0.5;
    }
  });

  const overallFit = totalWeight > 0 ? (weightedSum / totalWeight) : 50;

  return Math.round(Math.max(0, Math.min(100, overallFit)));
}

/**
 * Generate reasoning text for the fit
 */
function generateReasoning(
  discProfile: DISCProfile,
  criteria: PersonalityCareerCriteria
): string {
  const reasoning: string[] = [];

  // Get dominant traits
  discProfile.dominantTraits.forEach(trait => {
    const level = getTraitLevel(discProfile.scores[trait]);
    const key = `${level}_${trait}`;

    if (criteria.reasoning[key]) {
      reasoning.push(criteria.reasoning[key]);
    } else if (criteria.reasoning[`high_${trait}`] && level === 'high') {
      reasoning.push(criteria.reasoning[`high_${trait}`]);
    }
  });

  // Check for combination patterns (e.g., "high_D_low_I")
  const traits: DISCTrait[] = ['dominance', 'influence', 'steadiness', 'conscientiousness'];
  traits.forEach(trait1 => {
    traits.forEach(trait2 => {
      if (trait1 !== trait2) {
        const level1 = getTraitLevel(discProfile.scores[trait1]);
        const level2 = getTraitLevel(discProfile.scores[trait2]);
        const comboKey = `${level1}_${getTraitShort(trait1)}_${level2}_${getTraitShort(trait2)}`;

        if (criteria.reasoning[comboKey]) {
          reasoning.push(criteria.reasoning[comboKey]);
        }
      }
    });
  });

  if (reasoning.length === 0) {
    reasoning.push(`Your ${discProfile.profileType} profile brings unique strengths to this career.`);
  }

  return reasoning.join(' ');
}

/**
 * Identify strengths and considerations for this career match
 */
function identifyStrengthsAndConsiderations(
  discProfile: DISCProfile,
  criteria: PersonalityCareerCriteria
): { strengths: string[]; considerations: string[] } {
  const strengths: string[] = [];
  const considerations: string[] = [];

  // Check primary trait alignment
  criteria.discTraits.primary.forEach(trait => {
    const score = discProfile.scores[trait];
    if (score >= 70) {
      strengths.push(`Your high ${trait} strongly aligns with this career's requirements.`);
    } else if (score < 40) {
      considerations.push(`This career typically requires higher ${trait} than your current score.`);
    }
  });

  // Check avoid traits
  if (criteria.discTraits.avoid) {
    criteria.discTraits.avoid.forEach(trait => {
      const score = discProfile.scores[trait];
      if (score >= 70) {
        considerations.push(`Your high ${trait} might create challenges in this career.`);
      } else if (score < 40) {
        strengths.push(`Your lower ${trait} could be an advantage in this role.`);
      }
    });
  }

  // Add work environment considerations
  const { pace, structure, socialLevel, autonomy } = criteria.workEnvironment;

  if (pace === 'fast' && discProfile.scores.steadiness > 70) {
    considerations.push("This fast-paced environment may feel stressful given your preference for stability.");
  }

  if (socialLevel === 'high' && discProfile.scores.influence < 40) {
    considerations.push("This career involves significant social interaction, which may be draining.");
  }

  if (structure === 'low' && discProfile.scores.conscientiousness > 70) {
    considerations.push("The lack of structure in this role may feel uncomfortable.");
  }

  if (strengths.length === 0) {
    strengths.push("Your personality profile brings unique perspectives to this career.");
  }

  return { strengths, considerations };
}

/**
 * Generate matching insights across all careers
 */
export function generateMatchingInsights(
  fitScores: PersonalityFitScore[],
  discProfile: DISCProfile
): MatchingInsight[] {
  const insights: MatchingInsight[] = [];

  // Find pattern: Are all high fits in a similar cluster?
  const topFits = fitScores
    .filter(f => f.overallFit >= 70)
    .sort((a, b) => b.overallFit - a.overallFit);

  if (topFits.length > 0) {
    insights.push({
      type: 'strength',
      title: 'Strong Career Matches Found',
      description: `Your ${discProfile.profileType} profile shows strong alignment with ${topFits.length} career(s). These careers leverage your natural strengths.`,
      relatedCareers: topFits.map(f => f.careerId)
    });
  }

  // Identify growth areas
  const lowFits = fitScores.filter(f => f.overallFit < 50);
  if (lowFits.length > 0) {
    const primaryIssues = new Set<string>();
    lowFits.forEach(fit => {
      if (fit.considerations.length > 0) {
        fit.considerations.forEach(c => primaryIssues.add(c));
      }
    });

    if (primaryIssues.size > 0) {
      insights.push({
        type: 'growth_area',
        title: 'Areas for Development',
        description: 'Some careers may require developing skills outside your natural preferences. Consider these as growth opportunities.',
        relatedCareers: lowFits.map(f => f.careerId)
      });
    }
  }

  // Dominant trait insights
  discProfile.dominantTraits.forEach(trait => {
    const traitName = trait.charAt(0).toUpperCase() + trait.slice(1);
    const goodFits = fitScores.filter(f => f.traitFits[trait] >= 70);

    if (goodFits.length > 0) {
      insights.push({
        type: 'strength',
        title: `${traitName} Alignment`,
        description: `Your high ${trait} score aligns well with careers that value ${getTraitDescription(trait)}.`,
        relatedCareers: goodFits.map(f => f.careerId).slice(0, 5)
      });
    }
  });

  return insights.slice(0, 5); // Return top 5 insights
}

/**
 * Helper function to get trait level
 */
function getTraitLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

/**
 * Helper function to get short trait name
 */
function getTraitShort(trait: DISCTrait): string {
  return trait.charAt(0).toUpperCase();
}

/**
 * Helper function to get trait description
 */
function getTraitDescription(trait: DISCTrait): string {
  const descriptions: Record<DISCTrait, string> = {
    dominance: 'results-orientation and decisive action',
    influence: 'people skills and persuasive communication',
    steadiness: 'patience, reliability, and supportiveness',
    conscientiousness: 'attention to detail and quality focus'
  };
  return descriptions[trait];
}

/**
 * Get top N career matches
 */
export function getTopMatches(
  fitScores: PersonalityFitScore[],
  n: number = 3
): PersonalityFitScore[] {
  return [...fitScores]
    .sort((a, b) => b.overallFit - a.overallFit)
    .slice(0, n);
}

/**
 * Filter careers by minimum fit score
 */
export function filterByMinFit(
  fitScores: PersonalityFitScore[],
  minFit: number = 60
): PersonalityFitScore[] {
  return fitScores.filter(f => f.overallFit >= minFit);
}

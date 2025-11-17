// lib/profile-types.ts
import { DISCScore, DISCTrait, ProfileTypeData } from '@/types/disc-personality';
import discTraitsData from '@/data/disc-traits.json';

/**
 * Determine the DISC profile type based on scores
 * Returns the profile type name (e.g., "The Driver", "The Influencer")
 */
export function determineProfileType(scores: DISCScore): string {
  const { dominance, influence, steadiness, conscientiousness } = scores;

  // Check for single dominant traits first (score > 70, others < 70)
  if (dominance > 70 && influence < 70 && steadiness < 70 && conscientiousness < 70) {
    return discTraitsData.profileTypes.D_dominant.name;
  }
  if (influence > 70 && dominance < 70 && steadiness < 70 && conscientiousness < 70) {
    return discTraitsData.profileTypes.I_dominant.name;
  }
  if (steadiness > 70 && dominance < 70 && influence < 70 && conscientiousness < 70) {
    return discTraitsData.profileTypes.S_dominant.name;
  }
  if (conscientiousness > 70 && dominance < 70 && influence < 70 && steadiness < 70) {
    return discTraitsData.profileTypes.C_dominant.name;
  }

  // Check for blends (two traits > 60)
  if (dominance > 60 && influence > 60) {
    return discTraitsData.profileTypes.DI_blend.name;
  }
  if (dominance > 60 && conscientiousness > 60) {
    return discTraitsData.profileTypes.DC_blend.name;
  }
  if (influence > 60 && steadiness > 60) {
    return discTraitsData.profileTypes.IS_blend.name;
  }
  if (steadiness > 60 && conscientiousness > 60) {
    return discTraitsData.profileTypes.SC_blend.name;
  }

  // Check for balanced profile (all traits between 40-70)
  if (
    dominance >= 40 && dominance <= 70 &&
    influence >= 40 && influence <= 70 &&
    steadiness >= 40 && steadiness <= 70 &&
    conscientiousness >= 40 && conscientiousness <= 70
  ) {
    return discTraitsData.profileTypes.balanced.name;
  }

  // If no pattern matches, return the highest scoring trait's dominant type
  const highestTrait = getHighestTrait(scores);
  switch (highestTrait) {
    case 'dominance':
      return discTraitsData.profileTypes.D_dominant.name;
    case 'influence':
      return discTraitsData.profileTypes.I_dominant.name;
    case 'steadiness':
      return discTraitsData.profileTypes.S_dominant.name;
    case 'conscientiousness':
      return discTraitsData.profileTypes.C_dominant.name;
    default:
      return discTraitsData.profileTypes.balanced.name;
  }
}

/**
 * Get the profile type description
 */
export function getProfileTypeDescription(profileType: string): string {
  const profileTypes = discTraitsData.profileTypes;

  // Find matching profile type
  const match = Object.values(profileTypes).find(pt => pt.name === profileType);

  return match?.description || "A unique personality profile that combines multiple traits.";
}

/**
 * Get a short profile code (e.g., "D/I", "S/C", "D")
 */
export function getProfileCode(scores: DISCScore): string {
  const { dominance, influence, steadiness, conscientiousness } = scores;

  // Get traits scoring 60 or higher
  const highTraits: string[] = [];
  if (dominance >= 60) highTraits.push('D');
  if (influence >= 60) highTraits.push('I');
  if (steadiness >= 60) highTraits.push('S');
  if (conscientiousness >= 60) highTraits.push('C');

  if (highTraits.length === 0) {
    // If no trait >= 60, use the highest one
    const highest = getHighestTrait(scores);
    return highest.charAt(0).toUpperCase();
  }

  // Return up to 2 highest traits
  return highTraits.slice(0, 2).join('/');
}

/**
 * Get the highest scoring trait
 */
function getHighestTrait(scores: DISCScore): DISCTrait {
  const traits: Array<{ trait: DISCTrait; score: number }> = [
    { trait: 'dominance', score: scores.dominance },
    { trait: 'influence', score: scores.influence },
    { trait: 'steadiness', score: scores.steadiness },
    { trait: 'conscientiousness', score: scores.conscientiousness }
  ];

  traits.sort((a, b) => b.score - a.score);

  return traits[0].trait;
}

/**
 * Get all profile types with descriptions
 */
export function getAllProfileTypes(): Record<string, ProfileTypeData> {
  return discTraitsData.profileTypes as Record<string, ProfileTypeData>;
}

/**
 * Get profile summary text based on dominant traits
 */
export function getProfileSummary(dominantTraits: DISCTrait[]): string {
  if (dominantTraits.length === 0) {
    return "You have a balanced personality profile with no strongly dominant traits.";
  }

  if (dominantTraits.length === 1) {
    const trait = dominantTraits[0];
    const summaries: Record<DISCTrait, string> = {
      dominance: "You're results-oriented and thrive on challenges. You naturally take charge and prefer fast-paced environments where you can see immediate impact.",
      influence: "You're people-oriented and excel at building relationships. You bring enthusiasm and positive energy to collaborative environments.",
      steadiness: "You're steady and dependable, preferring consistency and harmony. You excel at supporting others and maintaining stable environments.",
      conscientiousness: "You're analytical and detail-oriented, valuing accuracy and quality. You thrive in structured environments with clear standards."
    };
    return summaries[trait];
  }

  // Two dominant traits
  const trait1 = dominantTraits[0];
  const trait2 = dominantTraits[1];
  const combo = `${trait1}_${trait2}`;

  const comboSummaries: Record<string, string> = {
    'dominance_influence': "You combine assertive leadership with people skills. You drive results while building relationships and motivating teams.",
    'dominance_conscientiousness': "You're both results-driven and quality-focused. You execute quickly while maintaining high standards.",
    'influence_steadiness': "You build strong relationships while creating stable environments. You're collaborative and supportive.",
    'steadiness_conscientiousness': "You combine reliability with attention to detail. You provide consistent, high-quality work.",
    // Reverse combinations
    'influence_dominance': "You combine people skills with assertive leadership. You motivate teams while driving toward goals.",
    'conscientiousness_dominance': "You're quality-focused and results-driven. You maintain high standards while executing decisively.",
    'steadiness_influence': "You're supportive and collaborative. You create stable, positive team environments.",
    'conscientiousness_steadiness': "You provide consistent, detail-oriented work. You're dependable and thorough."
  };

  return comboSummaries[combo] || "You have a unique blend of traits that shape your work style and preferences.";
}

/**
 * Get complementary traits (traits that would balance the profile)
 */
export function getComplementaryTraits(scores: DISCScore): DISCTrait[] {
  const traits: Array<{ trait: DISCTrait; score: number }> = [
    { trait: 'dominance', score: scores.dominance },
    { trait: 'influence', score: scores.influence },
    { trait: 'steadiness', score: scores.steadiness },
    { trait: 'conscientiousness', score: scores.conscientiousness }
  ];

  // Sort by score ascending (lowest first)
  traits.sort((a, b) => a.score - b.score);

  // Return the 1-2 lowest scoring traits (these could be areas for growth)
  const complementary: DISCTrait[] = [];
  if (traits[0].score < 40) {
    complementary.push(traits[0].trait);
  }
  if (traits[1].score < 40 && complementary.length < 2) {
    complementary.push(traits[1].trait);
  }

  return complementary;
}

/**
 * Determine if profile suggests leadership potential
 */
export function hasLeadershipTraits(scores: DISCScore): boolean {
  // High D or high D+I suggests leadership potential
  return (
    scores.dominance >= 70 ||
    (scores.dominance >= 60 && scores.influence >= 60)
  );
}

/**
 * Determine if profile suggests analytical/technical aptitude
 */
export function hasAnalyticalTraits(scores: DISCScore): boolean {
  // High C suggests analytical aptitude
  return scores.conscientiousness >= 70;
}

/**
 * Determine if profile suggests people/relationship aptitude
 */
export function hasPeopleOrientedTraits(scores: DISCScore): boolean {
  // High I or high I+S suggests people orientation
  return (
    scores.influence >= 70 ||
    (scores.influence >= 60 && scores.steadiness >= 60)
  );
}

/**
 * Determine if profile suggests preference for stability
 */
export function prefersStability(scores: DISCScore): boolean {
  // High S and low D suggests preference for stability
  return scores.steadiness >= 70 && scores.dominance < 50;
}

/**
 * Determine if profile suggests preference for fast-paced environment
 */
export function prefersFastPace(scores: DISCScore): boolean {
  // High D and low S suggests preference for fast pace
  return scores.dominance >= 70 && scores.steadiness < 50;
}

// lib/personality-data.ts
import { DISCProfile, TypeFinderProfile, CombinedPersonalityProfile, StoredDISCData } from '@/types/disc-personality';
import { Session2ClusterData } from '@/types/career-matching';

const DISC_STORAGE_KEY = 'ascend_disc_explorer_v1';
const TYPEFINDER_STORAGE_KEY = 'ascend_typefinder_v1';
const SESSION2_STORAGE_KEY = 'ascend_session2_clusters_v1';

const EXPIRY_DAYS = 90; // Data expires after 90 days

/**
 * Load DISC profile from Activity 5 (DISC Explorer)
 */
export function loadDISCProfile(): DISCProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(DISC_STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredDISCData = JSON.parse(stored);

    // Check if data has expired
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(DISC_STORAGE_KEY);
      return null;
    }

    // Convert date strings back to Date objects
    if (parsed.data && parsed.data.createdAt) {
      parsed.data.createdAt = new Date(parsed.data.createdAt);
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to load DISC profile:', error);
    return null;
  }
}

/**
 * Save DISC profile to localStorage
 */
export function saveDISCProfile(profile: DISCProfile): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data: StoredDISCData = {
      data: profile,
      version: '1.0',
      expiry: Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    };

    localStorage.setItem(DISC_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save DISC profile:', error);
    return false;
  }
}

/**
 * Clear DISC profile from storage
 */
export function clearDISCProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DISC_STORAGE_KEY);
}

/**
 * Load TypeFinder profile (if user has completed it)
 */
export function loadTypeFinderProfile(): TypeFinderProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(TYPEFINDER_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Check expiry
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(TYPEFINDER_STORAGE_KEY);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to load TypeFinder profile:', error);
    return null;
  }
}

/**
 * Save TypeFinder profile
 */
export function saveTypeFinderProfile(profile: TypeFinderProfile): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = {
      data: profile,
      version: '1.0',
      expiry: Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    };

    localStorage.setItem(TYPEFINDER_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save TypeFinder profile:', error);
    return false;
  }
}

/**
 * Load Session 2 cluster data (top 3 clusters)
 */
export function loadSession2ClusterData(): Session2ClusterData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(SESSION2_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Check expiry
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(SESSION2_STORAGE_KEY);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Failed to load Session 2 data:', error);
    return null;
  }
}

/**
 * Combine DISC + TypeFinder for comprehensive personality profile
 */
export function getCombinedPersonalityProfile(): CombinedPersonalityProfile | null {
  const disc = loadDISCProfile();
  if (!disc) return null;

  const typeFinder = loadTypeFinderProfile();

  return {
    disc,
    typeFinder: typeFinder || undefined,
    integrationInsights: generateIntegrationInsights(disc, typeFinder)
  };
}

/**
 * Generate insights on how DISC + TypeFinder work together
 */
function generateIntegrationInsights(
  disc: DISCProfile,
  typeFinder?: TypeFinderProfile | null
): string[] {
  if (!typeFinder) {
    return ["Complete TypeFinder assessment for deeper personality insights."];
  }

  const insights: string[] = [];

  // D + E/I integration
  if (disc.dominantTraits.includes('dominance') && typeFinder.dimensions.energy === 'E') {
    insights.push(
      "Your high Dominance (D) + Extraversion (E) makes you a natural, outgoing leader who energizes others while driving results."
    );
  }
  if (disc.dominantTraits.includes('dominance') && typeFinder.dimensions.energy === 'I') {
    insights.push(
      "Your Dominance (D) + Introversion (I) combination suggests you lead through expertise and strategic thinking rather than social charisma."
    );
  }

  // I + E/I integration
  if (disc.dominantTraits.includes('influence') && typeFinder.dimensions.energy === 'E') {
    insights.push(
      "Your Influence (I) + Extraversion (E) makes you exceptionally social and persuasive, thriving in people-oriented environments."
    );
  }
  if (disc.dominantTraits.includes('influence') && typeFinder.dimensions.energy === 'I') {
    insights.push(
      "Your Influence (I) + Introversion (I) is an interesting combination - you value relationships but recharge through alone time."
    );
  }

  // S + J/P integration
  if (disc.dominantTraits.includes('steadiness') && typeFinder.dimensions.lifestyle === 'J') {
    insights.push(
      "Your Steadiness (S) + Judging (J) combination means you thrive with structure, planning, and predictable routines."
    );
  }
  if (disc.dominantTraits.includes('steadiness') && typeFinder.dimensions.lifestyle === 'P') {
    insights.push(
      "Your Steadiness (S) + Perceiving (P) creates an interesting balance - you value stability but also appreciate flexibility."
    );
  }

  // C + T/F integration
  if (disc.dominantTraits.includes('conscientiousness') && typeFinder.dimensions.decisions === 'T') {
    insights.push(
      "Your Conscientiousness (C) + Thinking (T) makes you exceptionally analytical and systematic in your approach to problems."
    );
  }
  if (disc.dominantTraits.includes('conscientiousness') && typeFinder.dimensions.decisions === 'F') {
    insights.push(
      "Your Conscientiousness (C) + Feeling (F) means you combine attention to detail with consideration for how decisions affect people."
    );
  }

  // C + S integration
  if (disc.dominantTraits.includes('conscientiousness') && typeFinder.dimensions.information === 'S') {
    insights.push(
      "Your Conscientiousness (C) + Sensing (S) makes you excel at practical, detailed work with real-world applications."
    );
  }
  if (disc.dominantTraits.includes('conscientiousness') && typeFinder.dimensions.information === 'N') {
    insights.push(
      "Your Conscientiousness (C) + Intuition (N) combines systematic thinking with big-picture innovation."
    );
  }

  // If no specific insights, add a general one
  if (insights.length === 0) {
    insights.push(
      `Your ${disc.profileType} DISC profile combined with ${typeFinder.type} TypeFinder creates a unique personality blend that shapes how you work and communicate.`
    );
  }

  return insights;
}

/**
 * Export profile data as JSON for sharing
 */
export function exportProfileAsJSON(profile: DISCProfile): string {
  return JSON.stringify(profile, null, 2);
}

/**
 * Import profile data from JSON
 */
export function importProfileFromJSON(jsonString: string): DISCProfile | null {
  try {
    const profile = JSON.parse(jsonString);
    // Basic validation
    if (profile && profile.scores && profile.dominantTraits) {
      return profile as DISCProfile;
    }
    return null;
  } catch (error) {
    console.error('Failed to import profile:', error);
    return null;
  }
}

/**
 * Check if user has completed DISC assessment
 */
export function hasDISCProfile(): boolean {
  return loadDISCProfile() !== null;
}

/**
 * Check if user has Session 2 data
 */
export function hasSession2Data(): boolean {
  return loadSession2ClusterData() !== null;
}

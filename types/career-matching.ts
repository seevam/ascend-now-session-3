// types/career-matching.ts
import { DISCTrait, TypeFinderType, CombinedPersonalityProfile } from './disc-personality';

export type ClusterCategory =
  | 'agriculture_food_natural_resources'
  | 'architecture_construction'
  | 'arts_av_communication'
  | 'business_management_administration'
  | 'education_training'
  | 'finance'
  | 'government_public_administration'
  | 'health_science'
  | 'hospitality_tourism'
  | 'human_services'
  | 'information_technology'
  | 'law_public_safety_corrections_security'
  | 'manufacturing'
  | 'marketing'
  | 'stem'
  | 'transportation_distribution_logistics';

export interface CareerForMatching {
  id: string;
  title: string;
  cluster: ClusterCategory;
  shortDescription: string;
  source: 'session2' | 'user_added' | 'recommended';
}

export interface PersonalityFitScore {
  careerId: string;
  discFit: number; // 0-100
  typeFinderFit?: number; // 0-100 (if available)
  overallFit: number; // 0-100 (weighted average)
  reasoning: string;
  strengths: string[]; // Why this is a good fit
  considerations: string[]; // Potential challenges
  traitFits: Record<DISCTrait, number>; // Individual trait fits
}

export interface CareerMatch {
  sessionId: string;
  createdAt: Date;
  personalityProfile: CombinedPersonalityProfile;
  selectedCareers: CareerForMatching[];
  fitScores: PersonalityFitScore[];
  topMatches: CareerForMatching[]; // Top 3 best fits
  recommendations: CareerRecommendation[];
  insights: MatchingInsight[];
  userRatings: Record<string, number>; // careerId -> rating (1-5)
}

export interface CareerRecommendation {
  careerId: string;
  careerTitle: string;
  reason: string;
  discAlignment: string; // e.g., "Your high D trait aligns with..."
  typeFinderAlignment?: string;
  nextSteps: string[];
}

export interface MatchingInsight {
  type: 'strength' | 'consideration' | 'growth_area';
  title: string;
  description: string;
  relatedCareers: string[]; // Career IDs
}

// Matching criteria
export interface PersonalityCareerCriteria {
  careerTitle: string;
  cluster: ClusterCategory;
  discTraits: {
    primary: DISCTrait[]; // Required primary traits
    secondary?: DISCTrait[]; // Helpful secondary traits
    avoid?: DISCTrait[]; // Traits that may struggle
  };
  typeFinderTypes?: {
    ideal: TypeFinderType[];
    suitable: TypeFinderType[];
  };
  workEnvironment: {
    pace: 'fast' | 'moderate' | 'steady';
    structure: 'high' | 'moderate' | 'low';
    socialLevel: 'high' | 'moderate' | 'low';
    autonomy: 'high' | 'moderate' | 'low';
  };
  keyTraits: string[];
  reasoning: Record<string, string>; // e.g., "high_D": "Your dominance helps..."
  considerations: Record<string, string>; // e.g., "high_D_low_I": "May struggle with..."
}

export interface PersonalityCareerMap {
  version: string;
  careerCriteria: Record<string, PersonalityCareerCriteria>;
  generalRules: {
    high_D_careers: { bestFit: string[]; challenges: string[] };
    high_I_careers: { bestFit: string[]; challenges: string[] };
    high_S_careers: { bestFit: string[]; challenges: string[] };
    high_C_careers: { bestFit: string[]; challenges: string[] };
  };
}

// Session 2 data types (for importing cluster data)
export interface Session2ClusterData {
  topThreeClusters: ClusterCategory[];
  rankings: Record<ClusterCategory, number>;
  exploredCareers: string[];
}

// Storage interface
export interface StoredCareerMatchData {
  data: CareerMatch;
  version: string;
  expiry: number;
}

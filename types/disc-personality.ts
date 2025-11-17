// types/disc-personality.ts
export type DISCTrait = 'dominance' | 'influence' | 'steadiness' | 'conscientiousness';

export interface DISCScore {
  dominance: number; // 0-100
  influence: number; // 0-100
  steadiness: number; // 0-100
  conscientiousness: number; // 0-100
}

export interface DISCProfile {
  sessionId: string;
  createdAt: Date;
  inputMethod: 'manual' | 'quiz' | 'imported';
  scores: DISCScore;
  dominantTraits: DISCTrait[]; // Top 1-2 traits
  profileType: string; // e.g., "D/I", "S/C", etc.
  traitDescriptions: Record<DISCTrait, TraitAnalysis>;
  workStyles: WorkStyle[];
  idealEnvironments: WorkEnvironment[];
  completedScenarios: ScenarioResult[];
}

export interface TraitAnalysis {
  trait: DISCTrait;
  score: number;
  level: 'low' | 'moderate' | 'high';
  description: string;
  strengths: string[];
  challenges: string[];
  workPreferences: string[];
  communicationStyle: string;
}

export interface WorkStyle {
  name: string;
  description: string;
  fitScore: number; // 0-100 based on DISC profile
  characteristics: string[];
}

export interface WorkEnvironment {
  type: string; // e.g., "Fast-paced", "Collaborative", "Structured"
  description: string;
  fitScore: number;
  sampleRoles: string[];
}

export interface ScenarioResult {
  scenarioId: string;
  situation: string;
  userChoice: string;
  alignedTrait: DISCTrait;
  isAligned: boolean; // Does choice match dominant trait?
  feedback: string;
}

// TypeFinder (from Session 3 lesson plans)
export type TypeFinderType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface TypeFinderProfile {
  type: TypeFinderType;
  dimensions: {
    energy: 'E' | 'I'; // Extraversion/Introversion
    information: 'S' | 'N'; // Sensing/Intuition
    decisions: 'T' | 'F'; // Thinking/Feeling
    lifestyle: 'J' | 'P'; // Judging/Perceiving
  };
  description: string;
  strengths: string[];
  workStyles: string[];
}

export interface CombinedPersonalityProfile {
  disc: DISCProfile;
  typeFinder?: TypeFinderProfile;
  integrationInsights: string[]; // How DISC + TypeFinder work together
}

// Storage interface
export interface StoredDISCData {
  data: DISCProfile;
  version: string;
  expiry: number;
}

// Quiz types
export interface QuizQuestion {
  id: string;
  scenario: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  description: string;
  weights: Partial<Record<DISCTrait, number>>;
}

// Scenario types
export interface WorkScenario {
  id: string;
  situation: string;
  responses: ScenarioResponse[];
}

export interface ScenarioResponse {
  label: string;
  description: string;
  alignedTrait: DISCTrait;
  feedbackTemplates: {
    high: string; // Feedback if user has high trait
    moderate: string; // Feedback if user has moderate trait
    low: string; // Feedback if user has low trait
  };
}

// Trait data types
export interface TraitLevel {
  range: [number, number];
  description: string;
  strengths: string[];
  challenges: string[];
  workPreferences: string[];
  communicationStyle: string;
}

export interface TraitData {
  name: string;
  shortDescription: string;
  icon: string;
  color: string;
  levels: {
    high: TraitLevel;
    moderate: TraitLevel;
    low: TraitLevel;
  };
  careerExamples: {
    high: string[];
    moderate: string[];
    low: string[];
  };
}

export interface DISCTraitsData {
  version: string;
  traits: Record<DISCTrait, TraitData>;
  profileTypes: Record<string, ProfileTypeData>;
}

export interface ProfileTypeData {
  pattern: string[];
  name: string;
  description: string;
}

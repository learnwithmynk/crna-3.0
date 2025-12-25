/**
 * School Types
 *
 * Shared TypeScript types for school-related data.
 * New files can import these for type safety.
 */

export interface School {
  id: string | number;
  name: string;
  city: string;
  state: string;
  tuitionInState?: number;
  tuitionOutOfState?: number;
  applicationDeadline?: string;
  programType?: 'front_loaded' | 'integrated';
  greRequired?: boolean;
  greWaivedFor?: string;
  ccrnRequired?: boolean;
  shadowingRequired?: boolean;
  acceptsNicu?: boolean;
  acceptsPicu?: boolean;
  acceptsEr?: boolean;
  acceptsOtherCriticalCare?: boolean;
  // Prerequisites
  prereqStatistics?: boolean;
  prereqGenChemistry?: boolean;
  prereqOrganicChemistry?: boolean;
  prereqBiochemistry?: boolean;
  prereqAnatomy?: boolean;
  prereqPhysics?: boolean;
  prereqPharmacology?: boolean;
  prereqPhysiology?: boolean;
  prereqMicrobiology?: boolean;
  prereqResearch?: boolean;
}

export interface FitScore {
  score: number;
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

export interface SchoolWithFitScore extends School {
  fitScore: FitScore;
  isSaved: boolean;
  isTarget: boolean;
}

import type { Profile } from '@/lib/data/profiles/profileTypes';

export const CandidateStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type CandidateStatus = keyof typeof CandidateStatus;

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  status: CandidateStatus;
  email?: string;
  phone?: string;
  payRateMin?: number;
  payRateMax?: number;
  payCurrency: string;
  education?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExploreCandidate = Pick<Candidate, 'id' | 'city' | 'state' | 'country'>;

export type CandidateProfileSummary = Pick<Profile, 'id' | 'title'>;

export type CandidateWithProfiles = Candidate & {
  profiles: CandidateProfileSummary[];
};

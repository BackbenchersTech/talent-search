import type { Profile } from '@/lib/data/profiles/profileTypes';
import { SORT_ORDER, type SortOrder } from '@/lib/constants/sort';

export const CandidateStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type CandidateStatus = keyof typeof CandidateStatus;

export const CANDIDATES_SORT_COLUMN = {
  NAME: 'name',
  CREATED_AT: 'createdAt',
} as const;
export type CandidatesSortColumn = (typeof CANDIDATES_SORT_COLUMN)[keyof typeof CANDIDATES_SORT_COLUMN];

export type CandidatesSort = {
  column: CandidatesSortColumn;
  order: SortOrder;
};

export const CANDIDATES_DEFAULT_SORT: CandidatesSort = {
  column: CANDIDATES_SORT_COLUMN.NAME,
  order: SORT_ORDER.ASC,
};

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

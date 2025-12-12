export const CandidateAvailability = {
  AVAILABLE_NOW: 'AVAILABLE_NOW',
  TWO_WEEKS: 'TWO_WEEKS',
  ONE_MONTH: 'ONE_MONTH',
};
export type CandidateAvailability = keyof typeof CandidateAvailability;

const CandidateStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
type CandidateStatus = keyof typeof CandidateStatus;

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  title?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  availability?: CandidateAvailability;
  status?: CandidateStatus;
  email?: string;
  phone?: string;
  payRateMin?: number;
  payRateMax?: number;
  payCurrency: string;
  education?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExploreCandidate = Pick<
  Candidate,
  'id' | 'city' | 'state' | 'country' | 'availability'
>;

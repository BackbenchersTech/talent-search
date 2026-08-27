import { ExploreCandidate } from '../candidates/candidateTypes';

export const MAX_BIO_LENGTH = 1000;

export const ProfileStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type ProfileStatus = keyof typeof ProfileStatus;

const ProfileVisibility = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
} as const;
export type ProfileVisibility = keyof typeof ProfileVisibility;

export const ProfileAvailability = {
  AVAILABLE_NOW: 'AVAILABLE_NOW',
  TWO_WEEKS: 'TWO_WEEKS',
  ONE_MONTH: 'ONE_MONTH',
} as const;
export type ProfileAvailability =
  (typeof ProfileAvailability)[keyof typeof ProfileAvailability];

export const PROFILE_AVAILABILITY_LABELS: Record<ProfileAvailability, string> = {
  AVAILABLE_NOW: 'Available immediately',
  TWO_WEEKS: 'Available in 2 weeks',
  ONE_MONTH: 'Available in 1 month',
};

export type Profile = {
  id: string;
  candidateId: string;
  title: string;
  availability?: ProfileAvailability;
  industry?: string;
  seniority?: string;
  status: ProfileStatus;
  visibility: ProfileVisibility;
  billRateMin?: number;
  billRateMax?: number;
  openForRelocation: boolean;
  headline?: string;
  bio?: string;
  skills: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileWithCandidate = Profile & {
  candidate: ExploreCandidate;
};

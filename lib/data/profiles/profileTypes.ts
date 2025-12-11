import { ExploreCandidate } from '../candidates/candidateTypes';

const ProfileStatus = {
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

export type Profile = {
  id: string;
  candidateId: string;
  title: string;
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

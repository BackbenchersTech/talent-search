export type LocationType = 'REMOTE' | 'HYBRID' | 'ONSITE';

export type ExperienceSource = 'SDR' | 'RESUME';

export type Experience = {
  id: string;
  profileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  locationText?: string;
  city?: string;
  state?: string;
  country?: string;
  locationType?: LocationType;
  source: ExperienceSource;
  createdAt: Date;
  updatedAt: Date;
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'Onsite',
};

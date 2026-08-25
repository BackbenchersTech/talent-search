import { ExperienceInput } from '@/lib/data/profiles/actions';
import { Experience } from '@/lib/data/experiences/experienceTypes';

// Month/year are picked separately; the ISO date is computed on save as the
// first day of the chosen month.
export type ExperienceDraft = ExperienceInput & {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
};

export const splitDate = (value?: string) => ({
  month: value?.slice(5, 7) ?? '',
  year: value?.slice(0, 4) ?? '',
});

export const createEditDraft = (experience: Experience): ExperienceDraft => {
  const start = splitDate(experience.startDate);
  const end = splitDate(experience.endDate);

  return {
    title: experience.title,
    company: experience.company,
    startDate: experience.startDate,
    endDate: experience.endDate,
    isCurrent: experience.isCurrent,
    description: experience.description,
    locationText: experience.locationText,
    locationType: experience.locationType,
    startMonth: start.month,
    startYear: start.year,
    endMonth: end.month,
    endYear: end.year,
  };
};

export const formatYearMonth = (value?: string) => {
  if (!value) return null;

  const [year, month] = value.split('-');
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const formatDateRange = (experience: Experience) => {
  const start = formatYearMonth(experience.startDate);
  const end = experience.isCurrent
    ? 'Present'
    : formatYearMonth(experience.endDate) || 'Present';

  if (!start) return null;

  return `${start} - ${end}`;
};

// Dates are stored as first-of-month, so tenure is measured at month granularity.
export const formatTenure = (experience: Experience) => {
  const start = new Date(`${experience.startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = experience.isCurrent
    ? new Date()
    : new Date(`${experience.endDate}T00:00:00`);

  if (Number.isNaN(end.getTime())) {
    return null;
  }

  // Counted inclusively: Mar 2021 -> Mar 2022 spans 13 months ("1 yr 1 mo").
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  return [
    years > 0 ? (years === 1 ? '1 yr' : `${years} yrs`) : null,
    remMonths > 0 ? (remMonths === 1 ? '1 mo' : `${remMonths} mos`) : null,
  ]
    .filter(Boolean)
    .join(' ');
};

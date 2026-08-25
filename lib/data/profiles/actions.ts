'use server';

import { getAppContext } from '@/lib/auth/getAppContext';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { withEducationRepo } from '@/lib/repos/education';
import { withExperiencesRepo } from '@/lib/repos/experiences';
import { withProfilesRepo } from '@/lib/repos/profiles';
import { MAX_BIO_LENGTH } from '@/lib/data/profiles/profileTypes';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createProfileId, decodeProfileId } from './profileTransforms';

const optionalPositiveNumber = z.preprocess(
  (val) => {
    if (val === '' || val == null) return undefined;
    return Number(val);
  },
  z.number().min(0, { error: 'Enter a positive number.' }).optional(),
);

const FormSchema = z.object({
  title: z.string().trim().min(1, { error: 'Please enter a title.' }),
  billRateMin: optionalPositiveNumber,
  billRateMax: optionalPositiveNumber,
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, {
      error: `Summary must be ${MAX_BIO_LENGTH} characters or fewer.`,
    }),
});

export type State = {
  errors?: {
    title?: { errors?: string[] };
    billRateMin?: { errors?: string[] };
    billRateMax?: { errors?: string[] };
    bio?: { errors?: string[] };
  };
  message?: string | null;
  fields?: {
    title?: string;
    billRateMin?: string;
    billRateMax?: string;
    bio?: string;
  };
  success?: boolean;
};

export async function createProfile(
  candidateId: string,
  domain: string,
  candidateUrlId: string,
  prevState: State,
  formData: FormData,
) {
  const rawFormData = {
    title: formData.get('title'),
    billRateMin: formData.get('billRateMin'),
    billRateMax: formData.get('billRateMax'),
    bio: formData.get('bio'),
  };

  const validatedFields = FormSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties || {},
      message: 'Please correct the errors in the form.',
      fields: {
        title: rawFormData.title?.toString() ?? '',
        billRateMin: rawFormData.billRateMin?.toString() ?? '',
        billRateMax: rawFormData.billRateMax?.toString() ?? '',
        bio: rawFormData.bio?.toString() ?? '',
      },
      success: false,
    };
  }

  const { title, billRateMin, billRateMax, bio } = validatedFields.data;

  let createdProfileId: string | undefined;

  try {
    const { orgId } = await getAppContext();

    const candidate = await withCandidatesRepo(orgId, (repo) =>
      repo.getById(candidateId),
    );
    if (!candidate) {
      return { message: 'Candidate not found.', success: false };
    }

    const profile = await withProfilesRepo(orgId, (repo) =>
      repo.create({ candidateId, title, billRateMin, billRateMax, bio }),
    );

    createdProfileId = createProfileId(profile.id);
  } catch {
    return {
      message: 'Database error: Failed to create profile.',
      success: false,
    };
  }

  revalidatePath(`/c/${domain}/candidates/${candidateUrlId}`);

  // redirect() throws NEXT_REDIRECT, so it must live outside the try/catch.
  redirect(`/c/${domain}/candidates/${candidateUrlId}/profiles/${createdProfileId}`);
}

// Invalidate every route this profile can render on — detail page and the
// explore slide-over — without needing the concrete URL segments.
const revalidateProfileRoutes = (profileUrlId: string) => {
  revalidatePath(`/c/[domain]/candidates/[id]/profiles/${profileUrlId}`, 'page');
  revalidatePath(`/c/[domain]/explore`, 'page');
};

const getProfileForUpdate = async (profileUrlId: string) => {
  const { orgId } = await getAppContext();

  let profileId: string;
  try {
    profileId = decodeProfileId(profileUrlId);
  } catch {
    return { error: 'Profile not found.' } as const;
  }

  const profile = await withProfilesRepo(orgId, (repo) => repo.getById(profileId));
  if (!profile) {
    return { error: 'Profile not found.' } as const;
  }

  return { orgId, profileId, profile } as const;
};

const BioSchema = z.string().max(MAX_BIO_LENGTH, {
  error: `Summary must be ${MAX_BIO_LENGTH} characters or fewer.`,
});

export type UpdateSummaryResult = {
  bio?: string;
  error?: string;
};

export async function updateProfileSummary(
  profileUrlId: string,
  bio: string,
): Promise<UpdateSummaryResult> {
  const validatedFields = BioSchema.safeParse(bio.trim());

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0]?.message };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    await withProfilesRepo(existing.orgId, (repo) =>
      repo.update(existing.profileId, { bio: validatedFields.data }),
    );
  } catch {
    return { error: 'Database error: Failed to update summary.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return { bio: validatedFields.data };
}

export type UpdateSkillsResult = {
  skills?: string[];
  error?: string;
};

const parseSkillsInput = (input: string) =>
  input
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

export async function addProfileSkills(
  profileUrlId: string,
  input: string,
): Promise<UpdateSkillsResult> {
  const parsed = [...new Set(parseSkillsInput(input))];

  if (!parsed.length) {
    return { error: 'Enter at least one skill.' };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const existingSkills = existing.profile.skills ?? [];
    const skills = [...new Set([...existingSkills, ...parsed])];

    await withProfilesRepo(existing.orgId, (repo) =>
      repo.update(existing.profileId, { skills }),
    );

    revalidateProfileRoutes(profileUrlId);

    return { skills };
  } catch {
    return { error: 'Database error: Failed to add skills.' };
  }
}

export async function removeProfileSkill(
  profileUrlId: string,
  skill: string,
): Promise<UpdateSkillsResult> {
  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const existingSkills = existing.profile.skills ?? [];
    const skills = existingSkills.filter((s) => s !== skill);

    await withProfilesRepo(existing.orgId, (repo) =>
      repo.update(existing.profileId, { skills }),
    );

    revalidateProfileRoutes(profileUrlId);

    return { skills };
  } catch {
    return { error: 'Database error: Failed to remove skill.' };
  }
}

const DegreeSchema = z.enum(['BACHELORS', 'MASTERS']);
const EducationSchema = z.object({
  school: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a school.' })
    .max(200, { error: 'School must be 200 characters or fewer.' }),
  degree: DegreeSchema,
  fieldOfStudy: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a field of study.' })
    .max(200, { error: 'Field of study must be 200 characters or fewer.' }),
});

export type EducationInput = z.infer<typeof EducationSchema>;
export type EducationFieldErrors = Partial<Record<keyof EducationInput, string>>;
export type EducationMutationResult = {
  errors?: EducationFieldErrors;
  error?: string;
};

const collectEducationFieldErrors = (
  error: z.ZodError<EducationInput>,
): EducationFieldErrors => {
  const fieldErrors: EducationFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof EducationInput | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
};

export async function addProfileEducation(
  profileUrlId: string,
  input: EducationInput,
): Promise<EducationMutationResult> {
  const validatedFields = EducationSchema.safeParse(input);

  if (!validatedFields.success) {
    return { errors: collectEducationFieldErrors(validatedFields.error) };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const { school, degree, fieldOfStudy } = validatedFields.data;

    await withEducationRepo(existing.orgId, async (repo) => {
      const education = await repo.getByCandidateId(existing.profile.candidateId);

      await repo.create({
        candidateId: existing.profile.candidateId,
        school,
        degree,
        fieldOfStudy,
        orderIndex: education.length,
      });
    });
  } catch {
    return { error: 'Database error: Failed to add education.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

export async function updateProfileEducation(
  profileUrlId: string,
  educationId: string,
  input: EducationInput,
): Promise<EducationMutationResult> {
  const validatedFields = EducationSchema.safeParse(input);

  if (!validatedFields.success) {
    return { errors: collectEducationFieldErrors(validatedFields.error) };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const { school, degree, fieldOfStudy } = validatedFields.data;

    const updated = await withEducationRepo(existing.orgId, (repo) =>
      repo.update(educationId, existing.profile.candidateId, {
        school,
        degree,
        fieldOfStudy,
      }),
    );

    if (!updated) {
      return { error: 'Education not found.' };
    }
  } catch {
    return { error: 'Database error: Failed to update education.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

export async function removeProfileEducation(
  profileUrlId: string,
  educationId: string,
): Promise<EducationMutationResult> {
  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const removed = await withEducationRepo(existing.orgId, (repo) =>
      repo.remove(educationId, existing.profile.candidateId),
    );

    if (!removed) {
      return { error: 'Education not found.' };
    }
  } catch {
    return { error: 'Database error: Failed to remove education.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

const LocationTypeSchema = z.enum(['REMOTE', 'HYBRID', 'ONSITE']);
const ExperienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a title.' })
    .max(200, { error: 'Title must be 200 characters or fewer.' }),
  company: z
    .string()
    .trim()
    .min(1, { error: 'Please enter a company.' })
    .max(200, { error: 'Company must be 200 characters or fewer.' }),
  startDate: z.iso.date({ error: 'Please enter a start date.' }),
  endDate: z.iso.date({ error: 'Please enter a valid end date.' }).optional(),
  isCurrent: z.boolean(),
  description: z
    .string()
    .trim()
    .max(2000, { error: 'Description must be 2000 characters or fewer.' })
    .optional(),
  locationText: z
    .string()
    .trim()
    .max(200, { error: 'Location must be 200 characters or fewer.' })
    .optional(),
  locationType: LocationTypeSchema.optional(),
});

export type ExperienceInput = z.infer<typeof ExperienceSchema>;
export type ExperienceFieldErrors = Partial<Record<keyof ExperienceInput, string>>;
export type ExperienceMutationResult = {
  errors?: ExperienceFieldErrors;
  error?: string;
};

const collectExperienceFieldErrors = (
  error: z.ZodError<ExperienceInput>,
): ExperienceFieldErrors => {
  const fieldErrors: ExperienceFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof ExperienceInput | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
};

// The DB requires endDate when isCurrent is false, and forbids it when true.
const reconcileEndDate = (input: ExperienceInput) => {
  if (input.isCurrent) {
    return { ...input, endDate: undefined };
  }

  return input;
};

// The form always submits the full record, so absent optional fields mean
// "cleared" — write null rather than leaving the column untouched (drizzle
// skips undefined keys in .set()).
const nullClearedFields = (input: ExperienceInput) => ({
  ...input,
  description: input.description ?? null,
  locationText: input.locationText ?? null,
  locationType: input.locationType ?? null,
});

const validateExperienceDates = (input: ExperienceInput): ExperienceFieldErrors => {
  if (!input.isCurrent && !input.endDate) {
    return { endDate: 'Enter an end date, or mark the role as current.' };
  }

  if (input.endDate && input.endDate < input.startDate) {
    return { endDate: 'End date must be after the start date.' };
  }

  return {};
};

export async function addProfileExperience(
  profileUrlId: string,
  input: ExperienceInput,
): Promise<ExperienceMutationResult> {
  const validatedFields = ExperienceSchema.safeParse(input);

  if (!validatedFields.success) {
    return { errors: collectExperienceFieldErrors(validatedFields.error) };
  }

  const dateErrors = validateExperienceDates(validatedFields.data);
  if (Object.keys(dateErrors).length) {
    return { errors: dateErrors };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const { endDate, ...values } = reconcileEndDate(validatedFields.data);

    await withExperiencesRepo(existing.profileId, (repo) =>
      repo.create({
        ...values,
        endDate,
        // Manually created experiences come from the SDR flow; RESUME is
        // reserved for the (future) AI-agent import.
        source: 'SDR',
      }),
    );
  } catch {
    return { error: 'Database error: Failed to add experience.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

export async function updateProfileExperience(
  profileUrlId: string,
  experienceId: string,
  input: ExperienceInput,
): Promise<ExperienceMutationResult> {
  const validatedFields = ExperienceSchema.safeParse(input);

  if (!validatedFields.success) {
    return { errors: collectExperienceFieldErrors(validatedFields.error) };
  }

  const dateErrors = validateExperienceDates(validatedFields.data);
  if (Object.keys(dateErrors).length) {
    return { errors: dateErrors };
  }

  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const { endDate, ...values } = nullClearedFields(
      reconcileEndDate(validatedFields.data),
    );

    const updated = await withExperiencesRepo(existing.profileId, (repo) =>
      repo.update(experienceId, {
        ...values,
        endDate: endDate ?? null,
      }),
    );

    if (!updated) {
      return { error: 'Experience not found.' };
    }
  } catch {
    return { error: 'Database error: Failed to update experience.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

export async function removeProfileExperience(
  profileUrlId: string,
  experienceId: string,
): Promise<ExperienceMutationResult> {
  try {
    const existing = await getProfileForUpdate(profileUrlId);
    if ('error' in existing) {
      return existing;
    }

    const removed = await withExperiencesRepo(existing.profileId, (repo) =>
      repo.remove(experienceId),
    );

    if (!removed) {
      return { error: 'Experience not found.' };
    }
  } catch {
    return { error: 'Database error: Failed to remove experience.' };
  }

  revalidateProfileRoutes(profileUrlId);

  return {};
}

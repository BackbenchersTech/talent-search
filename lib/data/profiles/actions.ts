'use server';

import { getAppContext } from '@/lib/auth/getAppContext';
import { withCandidatesRepo } from '@/lib/repos/candidates';
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

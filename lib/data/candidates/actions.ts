'use server';

import { getAppContext } from '@/lib/auth/getAppContext';
import { decodeCandidateId } from '@/lib/data/candidates/candidateTransforms';
import { CandidateStatus } from '@/lib/data/candidates/candidateTypes';
import { createProfileId } from '@/lib/data/profiles/profileTransforms';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { withProfilesRepo } from '@/lib/repos/profiles';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  firstName: z.string().trim().min(1, {
    error: 'Please enter a first name.',
  }),
  lastName: z.string().trim().min(1, {
    error: 'Please enter a last name.',
  }),
  email: z
    .string()
    .trim()
    .min(1, {
      error: 'Please enter an email address.',
    })
    .pipe(
      z.email({
        error: 'Please enter a valid email address.',
      }),
    ),
});

export type State = {
  errors?: {
    firstName?: { errors?: string[] };
    lastName?: { errors?: string[] };
    email?: { errors?: string[] };
  };
  message?: string | null;
  fields?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  success?: boolean;
};

const CreateCandidate = FormSchema.omit({ id: true });

// Name is required; location fields are optional and cleared when left empty.
const UpdateNameAndLocationSchema = z.object({
  firstName: z.string().trim().min(1, {
    error: 'Please enter a first name.',
  }),
  lastName: z.string().trim().min(1, {
    error: 'Please enter a last name.',
  }),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

export async function createCandidate(prevState: State, formData: FormData) {
  const rawFormData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
  };
  const validatedFields = CreateCandidate.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties || {},
      message: 'Please correct the errors in the form.',
      fields: {
        firstName: rawFormData.firstName?.toString() ?? '',
        lastName: rawFormData.lastName?.toString() ?? '',
        email: rawFormData.email?.toString() ?? '',
      },
      success: false,
    };
  }

  const { firstName, lastName, email } = validatedFields.data;

  try {
    const { orgId } = await getAppContext();
    await withCandidatesRepo(orgId, (repo) =>
      repo.create({ firstName, lastName, email }),
    );

    // TODO: work on refreshing when using the path instead of subdomain
    revalidatePath('/candidates');

    return { message: 'Candidate created successfully.', success: true };
  } catch {
    return {
      message: 'Database error: Failed to create candidate.',
      success: false,
    };
  }
}

export type UpdateNameAndLocationState = {
  errors?: {
    firstName?: { errors?: string[] };
    lastName?: { errors?: string[] };
  };
  message?: string | null;
  fields?: {
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  success?: boolean;
};

// Invalidate every route this candidate can render on — the detail page and
// the candidates table — without needing the concrete URL segments.
const revalidateCandidateRoutes = () => {
  revalidatePath(`/c/[domain]/candidates/[id]`, 'page');
  revalidatePath(`/c/[domain]/candidates`, 'page');
};

export async function updateCandidateNameAndLocation(
  domain: string,
  candidateUrlId: string,
  prevState: UpdateNameAndLocationState,
  formData: FormData,
) {
  const rawFormData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    city: formData.get('city'),
    state: formData.get('state'),
    country: formData.get('country'),
  };

  const validatedFields = UpdateNameAndLocationSchema.safeParse(rawFormData);
  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error).properties || {},
      message: 'Please correct the errors in the form.',
      fields: {
        firstName: rawFormData.firstName?.toString() ?? '',
        lastName: rawFormData.lastName?.toString() ?? '',
        city: rawFormData.city?.toString() ?? '',
        state: rawFormData.state?.toString() ?? '',
        country: rawFormData.country?.toString() ?? '',
      },
      success: false,
    };
  }

  const { firstName, lastName } = validatedFields.data;
  // empty string -> null so the columns actually clear in postgres
  const location = {
    city: validatedFields.data.city || null,
    state: validatedFields.data.state || null,
    country: validatedFields.data.country || null,
  };

  try {
    const { orgId } = await getAppContext();
    const candidateId = decodeCandidateId(candidateUrlId);

    if (!candidateId) {
      return { message: 'Candidate not found.', success: false };
    }

    const updated = await withCandidatesRepo(orgId, (repo) =>
      repo.update(candidateId, { firstName, lastName, ...location }),
    );
    if (!updated) {
      return { message: 'Candidate not found.', success: false };
    }
  } catch {
    return {
      message: 'Database error: Failed to update candidate.',
      success: false,
    };
  }

  revalidateCandidateRoutes();

  return {
    message: 'Candidate updated successfully.',
    success: true,
  };
}

export type CandidateActionResult = {
  error?: string;
};

export async function setCandidateStatus(
  candidateUrlId: string,
  status: CandidateStatus,
): Promise<CandidateActionResult> {
  const candidateId = decodeCandidateId(candidateUrlId);
  if (!candidateId) {
    return { error: 'Candidate not found.' };
  }

  let unpublishedProfileUrlIds: string[] = [];

  try {
    const { orgId } = await getAppContext();
    const updated = await withCandidatesRepo(orgId, (repo) =>
      repo.update(candidateId, { status }),
    );
    if (!updated) {
      return { error: 'Candidate not found.' };
    }

    // Deactivating a candidate unpublishes their published profiles.
    if (status === CandidateStatus.INACTIVE) {
      const profileIds = await withProfilesRepo(orgId, (repo) =>
        repo.unpublishByCandidateId(candidateId),
      );
      unpublishedProfileUrlIds = profileIds.map(createProfileId);
    }
  } catch {
    return { error: 'Failed to update candidate status.' };
  }

  revalidateCandidateRoutes();
  unpublishedProfileUrlIds.forEach((profileUrlId) => {
    revalidatePath(`/c/[domain]/candidates/[id]/profiles/${profileUrlId}`, 'page');
  });
  if (unpublishedProfileUrlIds.length) {
    revalidatePath(`/c/[domain]/explore`, 'page');
  }

  return {};
}

export async function deleteCandidate(
  candidateUrlId: string,
): Promise<CandidateActionResult> {
  const candidateId = decodeCandidateId(candidateUrlId);
  if (!candidateId) {
    return { error: 'Candidate not found.' };
  }

  try {
    const { orgId } = await getAppContext();
    const deleted = await withCandidatesRepo(orgId, (repo) => repo.delete(candidateId));
    if (!deleted) {
      return { error: 'Candidate not found.' };
    }
  } catch {
    return { error: 'Failed to delete candidate.' };
  }

  // the detail page no longer exists; clear it along with the table
  revalidateCandidateRoutes();

  return {};
}

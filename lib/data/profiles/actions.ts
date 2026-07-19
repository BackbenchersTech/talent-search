'use server';

import { getAppContext } from '@/lib/auth/getAppContext';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { withProfilesRepo } from '@/lib/repos/profiles';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
  bio: z.string().trim().optional(),
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

  try {
    const { orgId } = await getAppContext();

    const candidate = await withCandidatesRepo(orgId, (repo) =>
      repo.getById(candidateId),
    );
    if (!candidate) {
      return { message: 'Candidate not found.', success: false };
    }

    await withProfilesRepo(orgId, (repo) =>
      repo.create({ candidateId, title, billRateMin, billRateMax, bio }),
    );

    revalidatePath(`/c/${domain}/candidates/${candidateUrlId}`);

    return { message: 'Profile created successfully.', success: true };
  } catch {
    return {
      message: 'Database error: Failed to create profile.',
      success: false,
    };
  }
}

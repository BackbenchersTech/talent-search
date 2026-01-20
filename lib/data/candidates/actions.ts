'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

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
};

const CreateCandidate = FormSchema.omit({ id: true });

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
    };
  }

  const { firstName, lastName, email } = validatedFields.data;

  try {
    await sql`
      INSERT INTO candidates (first_name, last_name, email) VALUES (${firstName}, ${lastName}, ${email})
    `;
  } catch {
    return {
      message: 'Database error: Failed to create candidate.',
    };
  }

  // TODO: work on refreshing when using the path instead of subdomain
  revalidatePath('/candidates');
  redirect('/candidates');
}

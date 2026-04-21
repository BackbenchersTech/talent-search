import { auth } from '@clerk/nextjs/server';

export async function getClerkAuthContext() {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  return { userId, orgId };
}

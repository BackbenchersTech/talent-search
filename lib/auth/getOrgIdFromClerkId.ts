import { db } from '@/lib/db/client';
import { Organizations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getOrgIdFromClerkId = cache(async (clerkOrgId?: string) => {
  if (!clerkOrgId) throw new Error('No organization ID');

  const [org] = await db
    .select({ id: Organizations.id })
    .from(Organizations)
    .where(eq(Organizations.clerkOrgId, clerkOrgId))
    .limit(1);

  if (!org) {
    throw new Error('Organization not found');
  }

  return org.id;
});

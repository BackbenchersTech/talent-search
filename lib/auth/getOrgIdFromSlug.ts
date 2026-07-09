import { db } from '@/lib/db/client';
import { Organizations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getOrgIdFromSlug = cache(async (slug: string) => {
  if (!slug) throw new Error('No organization slug');

  const [org] = await db
    .select({ id: Organizations.id })
    .from(Organizations)
    .where(eq(Organizations.slug, slug))
    .limit(1);

  if (!org) {
    throw new Error('Organization not found');
  }

  return org.id;
});

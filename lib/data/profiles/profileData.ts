import { db } from '@/lib/db/client';
import { Candidates, Profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { getTableColumns } from 'drizzle-orm';
import { mapProfileRowToProfileWithCandidate } from './profileTransforms';

export async function getProfiles(limit = 20) {
  const result = (
    await db
      .select({
        ...getTableColumns(Profiles),
        candidate: {
          id: Profiles.candidateId,
          // Convert first + last name → initials (e.g. "JD")
          initials: sql<string>`
          CONCAT(
            SUBSTRING(${Candidates.firstName} FROM 1 FOR 1),
            SUBSTRING(${Candidates.lastName} FROM 1 FOR 1)
          )
        `,
          city: Candidates.city,
          state: Candidates.state,
          country: Candidates.country,
          availability: Candidates.availability,
        },
      })
      .from(Profiles)
      .leftJoin(Candidates, eq(Profiles.candidateId, Candidates.id))
      .limit(limit)
  ).map(mapProfileRowToProfileWithCandidate);

  return result;
}

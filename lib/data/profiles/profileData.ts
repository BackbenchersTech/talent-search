import { db } from '@/lib/db/client';
import { Candidates, Profiles } from '@/lib/db/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import {
  mapProfileRowToProfile,
  mapProfileRowToProfileWithCandidate,
} from './profileTransforms';

export async function getProfiles(limit = 20) {
  return (
    await db
      .select({
        ...getTableColumns(Profiles),
        candidate: {
          id: Profiles.candidateId,
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
}

export async function getCandidateProfiles(candidateId: string) {
  return (
    await db.query.Profiles.findMany({
      where: (fields, { eq }) => eq(fields.candidateId, candidateId),
    })
  ).map(mapProfileRowToProfile);
}

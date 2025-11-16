import { db } from '@/lib/db/client';
import { Candidates } from '@/lib/db/schema';
import { mapCandidateRowToCandidate } from './candidateTransforms';

export async function getCandidates(limit = 20) {
  return (await db.select().from(Candidates).limit(limit)).map(
    mapCandidateRowToCandidate
  );
}

// WIP functions below
export async function getCandidateById(id: string) {
  return db.query.Candidates.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  });
}

export async function searchCandidates(term: string) {
  return db.query.Candidates.findMany({
    where: (fields, ops) =>
      ops.or(
        ops.ilike(fields.firstName, `%${term}%`),
        ops.ilike(fields.lastName, `%${term}%`),
        ops.ilike(fields.title, `%${term}%`)
      ),
  });
}

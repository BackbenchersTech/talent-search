import { db } from '@/lib/db/client';
import { withCandidateRepo } from '@/lib/repos/candidates';
import { mapCandidateRowToCandidate } from './candidateTransforms';

export async function getCandidates(orgId: string) {
  return (await withCandidateRepo(orgId, (repo) => repo.getAll())).map(
    mapCandidateRowToCandidate,
  );
}

export async function getCandidateById(id: string) {
  const row = await db.query.Candidates.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
  });

  if (!row) return null;

  return mapCandidateRowToCandidate(row);
}

// WIP functions below
export async function searchCandidates(term: string) {
  return db.query.Candidates.findMany({
    where: (fields, ops) =>
      ops.or(
        ops.ilike(fields.firstName, `%${term}%`),
        ops.ilike(fields.lastName, `%${term}%`),
        ops.ilike(fields.title, `%${term}%`),
      ),
  });
}

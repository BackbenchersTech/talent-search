import { db } from '@/lib/db/client';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { decodeCandidateId, mapCandidateRowToCandidate } from './candidateTransforms';

export async function getCandidates(orgId: string) {
  return (await withCandidatesRepo(orgId, (repo) => repo.getAll())).map(
    mapCandidateRowToCandidate,
  );
}

export async function getCandidateById(orgId: string, candidateUrlId: string) {
  const candidateId = decodeCandidateId(candidateUrlId);
  if (!candidateId) return null;

  const candidate = await withCandidatesRepo(orgId, (repo) => repo.getById(candidateId));

  if (!candidate) return null;

  return mapCandidateRowToCandidate(candidate);
}

// WIP functions below
export async function searchCandidates(term: string) {
  return db.query.Candidates.findMany({
    where: (fields, ops) =>
      ops.or(
        ops.ilike(fields.firstName, `%${term}%`),
        ops.ilike(fields.lastName, `%${term}%`),
      ),
  });
}

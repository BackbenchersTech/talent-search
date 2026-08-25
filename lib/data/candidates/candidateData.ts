import { db } from '@/lib/db/client';
import { withProfilesRepo } from '@/lib/repos/profiles';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { CandidateWithProfiles, CandidateProfileSummary } from './candidateTypes';
import { createProfileId } from '@/lib/data/profiles/profileTransforms';
import { decodeCandidateId, mapCandidateRowToCandidate } from './candidateTransforms';

export async function getCandidates(orgId: string) {
  return (await withCandidatesRepo(orgId, (repo) => repo.getAll())).map(
    mapCandidateRowToCandidate,
  );
}

export async function getCandidatesWithProfiles(orgId: string) {
  const candidates = await getCandidates(orgId);

  // profiles are fetched only for the candidates on this page
  const rawCandidateIds = candidates.map((c) => decodeCandidateId(c.id)!);
  const profileRows = await withProfilesRepo(orgId, (repo) =>
    repo.getByCandidateIds(rawCandidateIds),
  );

  const profilesByCandidateId = new Map<string, CandidateProfileSummary[]>();
  for (const { id, candidateId, title } of profileRows) {
    const summaries = profilesByCandidateId.get(candidateId) ?? [];
    summaries.push({ id: createProfileId(id), title });
    profilesByCandidateId.set(candidateId, summaries);
  }

  return candidates.map<CandidateWithProfiles>((candidate) => ({
    ...candidate,
    profiles: profilesByCandidateId.get(decodeCandidateId(candidate.id)!) ?? [],
  }));
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

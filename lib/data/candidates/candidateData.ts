import { db } from '@/lib/db/client';
import { withProfilesRepo } from '@/lib/repos/profiles';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import {
  Candidate,
  CandidateWithProfiles,
  CandidateProfileSummary,
} from './candidateTypes';
import { createProfileId } from '@/lib/data/profiles/profileTransforms';
import { decodeCandidateId, mapCandidateRowToCandidate } from './candidateTransforms';

export type CandidatesPage = {
  rows: CandidateWithProfiles[];
  total: number;
  page: number;
  totalPages: number;
};

const attachProfiles = async (orgId: string, candidates: Candidate[]) => {
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
};

export const getCandidatesWithProfilesPage = async (
  orgId: string,
  { page, pageSize }: { page: number; pageSize: number },
) => {
  const { rows, total } = await withCandidatesRepo(orgId, (repo) =>
    repo.getPaginated({ limit: pageSize, offset: (page - 1) * pageSize }),
  );

  const candidates = rows.map(mapCandidateRowToCandidate);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    rows: await attachProfiles(orgId, candidates),
    total,
    page,
    totalPages,
  } satisfies CandidatesPage;
};

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

import { mapCandidateRowToCandidate } from '@/lib/data/candidates/candidateTransforms';
import { mapEducationRowToEducation } from '@/lib/data/education/educationTransforms';
import { withCandidatesRepo } from '@/lib/repos/candidates';
import { withEducationRepo } from '@/lib/repos/education';
import { withProfilesRepo } from '@/lib/repos/profiles';
import {
  mapProfileRowToProfile,
  mapProfileRowToProfileWithCandidate,
} from './profileTransforms';

export async function getProfiles(orgId: string) {
  return (await withProfilesRepo(orgId, (repo) => repo.getAllWithCandidate())).map(
    mapProfileRowToProfileWithCandidate,
  );
}

export async function getCandidateProfiles(orgId: string, candidateId: string) {
  return (
    await withProfilesRepo(orgId, (repo) => repo.getByCandidateId(candidateId))
  ).map(mapProfileRowToProfile);
}

export async function getFullProfileDetails(orgId: string, profileId: string) {
  const profileRow = await withProfilesRepo(orgId, (repo) => repo.getById(profileId));

  if (!profileRow) return { profile: undefined, candidate: undefined, education: [] };

  const candidateRow = await withCandidatesRepo(orgId, (repo) =>
    repo.getById(profileRow.candidateId),
  );
  const education = (
    await withEducationRepo(orgId, (repo) =>
      repo.getByCandidateId(profileRow.candidateId),
    )
  ).map(({ education }) => mapEducationRowToEducation(education));

  const profile = profileRow ? mapProfileRowToProfile(profileRow) : undefined;
  const candidate = candidateRow ? mapCandidateRowToCandidate(candidateRow) : undefined;

  return { profile, candidate, education };
}

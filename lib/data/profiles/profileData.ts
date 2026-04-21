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

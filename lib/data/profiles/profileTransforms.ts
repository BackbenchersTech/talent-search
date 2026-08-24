import { createCandidateId } from '@/lib/data/candidates/candidateTransforms';
import { ExploreCandidate } from '@/lib/data/candidates/candidateTypes';
import { Candidates, Profiles } from '@/lib/db/schema';
import { encodeUUID } from '@/lib/utils/base62';
import { normalize } from '@/lib/utils/normalize';
import { InferSelectModel } from 'drizzle-orm';

export const PROFILE_ID_PREFIX = 'prof_';
export const createProfileId = (id: string) => `${PROFILE_ID_PREFIX}${encodeUUID(id)}`;

// --- Main mapper ---
export function mapProfileRowToProfileWithCandidate(
  row: InferSelectModel<typeof Profiles> & {
    candidate: Pick<InferSelectModel<typeof Candidates>, keyof ExploreCandidate>;
  },
) {
  const {
    id,
    candidateId,
    candidate: { ...candidateFields },
    ...profileFields
  } = row;
  return {
    id: createProfileId(id),
    candidateId: createCandidateId(candidateId),
    ...normalize(profileFields),
    candidate: {
      ...normalize(candidateFields),
      id: createCandidateId(candidateId),
    },
  };
}

export const mapProfileRowToProfile = (row: InferSelectModel<typeof Profiles>) => {
  const { id, candidateId, ...profileFields } = row;

  return {
    id: createProfileId(id),
    candidateId: createCandidateId(candidateId),
    ...normalize(profileFields),
  };
};

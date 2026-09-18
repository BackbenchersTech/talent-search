import { createCandidateId } from '@/lib/data/candidates/candidateTransforms';
import { ExploreCandidate } from '@/lib/data/candidates/candidateTypes';
import { Candidates, Profiles } from '@/lib/db/schema';
import { decodeUUID, encodeUUID } from '@/lib/utils/base62';
import { createUrlIdDecoder } from '@/lib/utils/createUrlIdDecoder';
import { normalize } from '@/lib/utils/normalize';
import { InferSelectModel } from 'drizzle-orm';

export const PROFILE_ID_PREFIX = 'prof_';
export const createProfileId = (id: string) => `${PROFILE_ID_PREFIX}${encodeUUID(id)}`;
export const decodeProfileId = createUrlIdDecoder(PROFILE_ID_PREFIX);

// Opaque keyset cursor: ms-precision ISO timestamp + '_' + encoded uuid.
// Neither side contains '_' so the split is unambiguous.
export const encodeProfileCursor = (createdAt: Date, id: string) =>
  `${createdAt.toISOString()}_${encodeUUID(id)}`;

export const decodeProfileCursor = (cursor: string) => {
  const separatorIndex = cursor.indexOf('_');
  if (separatorIndex === -1) return null;

  const createdAt = new Date(cursor.slice(0, separatorIndex));
  const id = decodeUUID(cursor.slice(separatorIndex + 1));

  if (Number.isNaN(createdAt.getTime()) || !id) return null;

  return { createdAt, id };
};

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

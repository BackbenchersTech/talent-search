import { encodeUUID } from '@/lib/utils/base62';
import { InferSelectModel } from 'drizzle-orm';
import { createCandidateId } from '../candidates/candidateTransforms';
import { ExploreCandidate } from '../candidates/candidateTypes';
import { Profiles } from './profileSchema';
import { Candidates } from '../candidates/candidateSchema';

const PROFILE_ID_PREFIX = 'prof_';
const createProfileId = (id: string) => `${PROFILE_ID_PREFIX}${encodeUUID(id)}`;

// Clean nulls → undefined
// For each property, if the property type includes `null`, replace `null` with `undefined` in the result type.
type NormalizeResult<T> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
};

const normalize = <T extends object>(obj: T): NormalizeResult<T> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === null ? undefined : value]),
  ) as unknown as NormalizeResult<T>;

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

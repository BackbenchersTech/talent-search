import { encodeUUID } from '@/lib/utils/base62';
import { createUrlIdDecoder } from '@/lib/utils/createUrlIdDecoder';
import { InferSelectModel } from 'drizzle-orm';
import { Candidates } from '@/lib/db/schema';
import { Candidate } from './candidateTypes';

export const CANDIDATE_ID_PREFIX = 'cand_';
export const createCandidateId = (id: string) => {
  return `${CANDIDATE_ID_PREFIX}${encodeUUID(id)}`;
};
export const decodeCandidateId = createUrlIdDecoder(CANDIDATE_ID_PREFIX);

export const mapCandidateRowToCandidate = ({
  id,
  ...rest
}: InferSelectModel<typeof Candidates>): Candidate => {
  return {
    id: createCandidateId(id),
    ...(Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ]),
    ) as Omit<Candidate, 'id'>),
  };
};

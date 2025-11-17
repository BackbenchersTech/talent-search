import { encodeUUID } from '@/lib/utils/base62';
import { InferSelectModel } from 'drizzle-orm';
import { Candidates } from './candidateSchema';
import { Candidate } from './candidateTypes';

const CANDIDATE_ID_PREFIX = 'cand_';
const createCandidateId = (id: string) => {
  return `${CANDIDATE_ID_PREFIX}${encodeUUID(id)}`;
};

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

import { createCandidateId } from '@/lib/data/candidates/candidateTransforms';
import { Education } from '@/lib/db/schema';
import { normalize } from '@/lib/utils/normalize';
import { InferSelectModel } from 'drizzle-orm';

export const mapEducationRowToEducation = (row: InferSelectModel<typeof Education>) => {
  const { candidateId, ...educationFields } = row;

  return {
    candidateId: createCandidateId(candidateId),
    ...normalize(educationFields),
  };
};

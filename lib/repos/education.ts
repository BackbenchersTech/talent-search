import { db } from '@/lib/db/client';
import { Candidates, Education } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

const createEducationRepo = (orgId: string) => {
  return {
    getByCandidateId: async (candidateId: string) =>
      await db
        .select()
        .from(Education)
        .innerJoin(Candidates, eq(Education.candidateId, Candidates.id))
        .where(
          and(
            eq(Candidates.organizationId, orgId),
            eq(Education.candidateId, candidateId),
          ),
        ),
  };
};

export const withEducationRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createEducationRepo>) => Promise<T>,
) => {
  const repo = createEducationRepo(orgId);
  return fn(repo);
};

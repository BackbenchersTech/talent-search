import { db } from '@/lib/db/client';
import { Candidates, Profiles } from '@/lib/db/schema';
import { and, eq, getTableColumns } from 'drizzle-orm';

type GetAllOptions = {
  limit?: number;
};

export const createProfilesRepo = (orgId: string) => {
  const baseFilter = eq(Profiles.organizationId, orgId);

  return {
    getAllWithCandidate: async ({ limit = 20 }: GetAllOptions = {}) =>
      await db
        .select({
          ...getTableColumns(Profiles),
          candidate: {
            id: Profiles.candidateId,
            city: Candidates.city,
            state: Candidates.state,
            country: Candidates.country,
          },
        })
        .from(Profiles)
        .leftJoin(Candidates, eq(Profiles.candidateId, Candidates.id))
        .where(baseFilter)
        .limit(limit),
    getByCandidateId: async (candidateId: string) =>
      await db.query.Profiles.findMany({
        where: (fields) => and(baseFilter, eq(fields.candidateId, candidateId)),
      }),
    getById: async (id: string) =>
      await db.query.Profiles.findFirst({
        where: and(baseFilter, eq(Profiles.id, id)),
      }),
  };
};

export const withProfilesRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createProfilesRepo>) => Promise<T>,
) => {
  const repo = createProfilesRepo(orgId);
  return fn(repo);
};

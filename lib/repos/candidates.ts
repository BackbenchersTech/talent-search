import { db } from '@/lib/db/client';
import { and, eq } from 'drizzle-orm';
import { Candidates } from '../db/schema';

type GetAllOptions = {
  limit?: number;
};

export const createCandidateRepo = (orgId: string) => {
  const baseFilter = eq(Candidates.organizationId, orgId);

  return {
    getAll: async ({ limit = 20 }: GetAllOptions = {}) =>
      await db.select().from(Candidates).where(baseFilter).limit(limit),
    getById: async (id: string) =>
      await db.query.Candidates.findFirst({
        where: and(baseFilter, eq(Candidates.id, id)),
      }),
    // WIP
    create: async () => {},
  };
};

export const withCandidateRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createCandidateRepo>) => Promise<T>,
) => {
  const repo = createCandidateRepo(orgId ?? '');
  return fn(repo);
};

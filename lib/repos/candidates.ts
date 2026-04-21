import { db } from '@/lib/db/client';
import { Candidates } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

type GetAllOptions = {
  limit?: number;
};

const createCandidatesRepo = (orgId: string) => {
  const baseFilter = eq(Candidates.organizationId, orgId);

  return {
    getAll: async ({ limit = 20 }: GetAllOptions = {}) =>
      await db.select().from(Candidates).where(baseFilter).limit(limit),
    getById: async (id: string) =>
      await db.query.Candidates.findFirst({
        where: and(baseFilter, eq(Candidates.id, id)),
      }),
    create: async ({
      firstName,
      lastName,
      email,
    }: {
      firstName: string;
      lastName: string;
      email: string;
    }) => {
      const [candidate] = await db
        .insert(Candidates)
        .values({
          firstName,
          lastName,
          email,
          organizationId: orgId,
        })
        .returning();

      return candidate;
    },
  };
};

export const withCandidatesRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createCandidatesRepo>) => Promise<T>,
) => {
  const repo = createCandidatesRepo(orgId);
  return fn(repo);
};

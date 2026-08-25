import { db } from '@/lib/db/client';
import { Candidates } from '@/lib/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';

type GetPaginatedOptions = {
  limit: number;
  offset: number;
};

const createCandidatesRepo = (orgId: string) => {
  const baseFilter = eq(Candidates.organizationId, orgId);

  return {
    getPaginated: async ({ limit, offset }: GetPaginatedOptions) => {
      const orderBy = [asc(Candidates.firstName), asc(Candidates.createdAt)];

      const [rows, [{ total }]] = await Promise.all([
        db
          .select()
          .from(Candidates)
          .where(baseFilter)
          .orderBy(...orderBy)
          .limit(limit)
          .offset(offset),
        db.select({ total: count() }).from(Candidates).where(baseFilter),
      ]);

      return { rows, total };
    },
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

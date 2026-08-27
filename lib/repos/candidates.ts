import { db } from '@/lib/db/client';
import { Candidates } from '@/lib/db/schema';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import {
  CANDIDATES_DEFAULT_SORT,
  CANDIDATES_SORT_COLUMN,
  CandidateStatus,
  CandidatesSort,
  CandidatesSortColumn,
} from '@/lib/data/candidates/candidateTypes';
import { SORT_ORDER } from '@/lib/constants/sort';

type GetPaginatedOptions = {
  limit: number;
  offset: number;
  sort?: CandidatesSort;
};

// first-of-chain tie-breakers keep pagination stable
const SORT_COLUMNS: Record<CandidatesSortColumn, readonly PgColumn[]> = {
  [CANDIDATES_SORT_COLUMN.NAME]: [Candidates.firstName, Candidates.lastName],
  [CANDIDATES_SORT_COLUMN.CREATED_AT]: [Candidates.createdAt],
};

const createCandidatesRepo = (orgId: string) => {
  const baseFilter = eq(Candidates.organizationId, orgId);

  return {
    getPaginated: async ({
      limit,
      offset,
      sort = CANDIDATES_DEFAULT_SORT,
    }: GetPaginatedOptions) => {
      const dir = sort.order === SORT_ORDER.DESC ? desc : asc;
      const orderBy = [
        ...SORT_COLUMNS[sort.column].map((column) => dir(column)),
        // tie-breakers
        ...(sort.column === CANDIDATES_SORT_COLUMN.CREATED_AT
          ? []
          : [asc(Candidates.createdAt)]),
        asc(Candidates.id),
      ];

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
    update: async (
      id: string,
      values: Partial<{
        firstName: string;
        lastName: string;
        city: string | null;
        state: string | null;
        country: string | null;
        status: CandidateStatus;
      }>,
    ) => {
      const [candidate] = await db
        .update(Candidates)
        .set({ ...values, updatedAt: new Date() })
        .where(and(baseFilter, eq(Candidates.id, id)))
        .returning();

      return candidate;
    },
    delete: async (id: string) => {
      // profiles (and their experiences) + education cascade in the DB
      const deleted = await db
        .delete(Candidates)
        .where(and(baseFilter, eq(Candidates.id, id)))
        .returning({ id: Candidates.id });

      return deleted.length > 0;
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

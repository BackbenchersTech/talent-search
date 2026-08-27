import { db } from '@/lib/db/client';
import {
  ProfileAvailability,
  ProfileStatus,
} from '@/lib/data/profiles/profileTypes';
import { Candidates, Profiles } from '@/lib/db/schema';
import { and, asc, eq, getTableColumns, inArray } from 'drizzle-orm';

type GetAllOptions = {
  limit?: number;
};

export const createProfilesRepo = (orgId: string) => {
  const baseFilter = eq(Profiles.organizationId, orgId);

  return {
    getByCandidateIds: async (candidateIds: string[]) =>
      candidateIds.length
        ? await db
            .select({
              id: Profiles.id,
              candidateId: Profiles.candidateId,
              title: Profiles.title,
            })
            .from(Profiles)
            .where(and(baseFilter, inArray(Profiles.candidateId, candidateIds)))
            .orderBy(asc(Profiles.createdAt))
        : [],
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
    create: async ({
      candidateId,
      title,
      billRateMin,
      billRateMax,
      bio,
    }: {
      candidateId: string;
      title: string;
      billRateMin?: number;
      billRateMax?: number;
      bio?: string;
    }) => {
      const [profile] = await db
        .insert(Profiles)
        .values({
          candidateId,
          title,
          billRateMin,
          billRateMax,
          bio,
          organizationId: orgId,
        })
        .returning();

      return profile;
    },
    update: async (
      id: string,
      values: Partial<{
        title: string;
        availability: ProfileAvailability | null;
        billRateMin: number | null;
        billRateMax: number | null;
        bio: string | null;
        skills: string[];
        status: ProfileStatus;
      }>,
    ) => {
      const [profile] = await db
        .update(Profiles)
        .set(values)
        .where(and(baseFilter, eq(Profiles.id, id)))
        .returning();

      return profile;
    },
    delete: async (id: string) => {
      await db.delete(Profiles).where(and(baseFilter, eq(Profiles.id, id)));
    },
  };
};

export const withProfilesRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createProfilesRepo>) => Promise<T>,
) => {
  const repo = createProfilesRepo(orgId);
  return fn(repo);
};

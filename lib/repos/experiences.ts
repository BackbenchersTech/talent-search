import { db } from '@/lib/db/client';
import { ExperienceSource, LocationType } from '@/lib/data/experiences/experienceTypes';
import { Experiences } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

// Experiences has no organizationId — org membership derives from the parent
// profile. Callers must have already org-verified the profile (see
// getProfileForUpdate / withProfilesRepo) before using this repo;
// profileId is the scoping key.
const createExperiencesRepo = (profileId: string) => {
  const baseFilter = eq(Experiences.profileId, profileId);

  return {
    getAll: async () => await db.select().from(Experiences).where(baseFilter),
    create: async ({
      title,
      company,
      startDate,
      endDate,
      isCurrent,
      description,
      locationText,
      locationType,
      source,
    }: {
      title: string;
      company: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description?: string;
      locationText?: string;
      locationType?: LocationType;
      source: ExperienceSource;
    }) => {
      const [experience] = await db
        .insert(Experiences)
        .values({
          profileId,
          title,
          company,
          startDate,
          endDate,
          isCurrent,
          description,
          locationText,
          locationType,
          source,
        })
        .returning();

      return experience;
    },
    // undefined fields are skipped by drizzle's .set(); pass null explicitly
    // to clear a column.
    update: async (
      id: string,
      values: Partial<{
        title: string;
        company: string;
        startDate: string;
        endDate?: string | null;
        isCurrent: boolean;
        description?: string | null;
        locationText?: string | null;
        locationType?: LocationType | null;
      }>,
    ) => {
      const [experience] = await db
        .update(Experiences)
        .set(values)
        .where(and(baseFilter, eq(Experiences.id, id)))
        .returning();

      return experience;
    },
    remove: async (id: string) => {
      const [experience] = await db
        .delete(Experiences)
        .where(and(baseFilter, eq(Experiences.id, id)))
        .returning();

      return experience;
    },
  };
};

export const withExperiencesRepo = <T>(
  profileId: string,
  fn: (repo: ReturnType<typeof createExperiencesRepo>) => Promise<T>,
) => {
  const repo = createExperiencesRepo(profileId);
  return fn(repo);
};

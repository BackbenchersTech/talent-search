import { db } from '@/lib/db/client';
import { Education } from '@/lib/data/education/educationTypes';
import { Education as EducationRow } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

// Education has no organizationId — org membership derives from the parent
// candidate, reached via the parent profile. Callers must have already
// org-verified the profile (see getProfileForUpdate / withProfilesRepo)
// before using this repo; candidateId is the scoping key.
const createEducationRepo = (candidateId: string) => {
  const baseFilter = eq(EducationRow.candidateId, candidateId);

  return {
    getAll: async () => await db.select().from(EducationRow).where(baseFilter),
    create: async ({
      school,
      degree,
      fieldOfStudy,
      orderIndex,
    }: {
      school: string;
      degree: Education['degree'];
      fieldOfStudy: string;
      // Defaults to 0 (the column default) when omitted.
      orderIndex?: number;
    }) => {
      const [education] = await db
        .insert(EducationRow)
        .values({ candidateId, school, degree, fieldOfStudy, orderIndex })
        .returning();

      return education;
    },
    update: async (
      id: string,
      values: Partial<{
        school: string;
        degree: Education['degree'];
        fieldOfStudy: string;
      }>,
    ) => {
      const [education] = await db
        .update(EducationRow)
        .set(values)
        .where(and(baseFilter, eq(EducationRow.id, id)))
        .returning();

      return education;
    },
    remove: async (id: string) => {
      const [education] = await db
        .delete(EducationRow)
        .where(and(baseFilter, eq(EducationRow.id, id)))
        .returning();

      return education;
    },
  };
};

export const withEducationRepo = <T>(
  candidateId: string,
  fn: (repo: ReturnType<typeof createEducationRepo>) => Promise<T>,
) => {
  const repo = createEducationRepo(candidateId);
  return fn(repo);
};

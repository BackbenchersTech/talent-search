import { db } from '@/lib/db/client';
import { Education } from '@/lib/data/education/educationTypes';
import { Candidates, Education as EducationRow } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

const createEducationRepo = (orgId: string) => {
  return {
    getByCandidateId: async (candidateId: string) =>
      await db
        .select()
        .from(EducationRow)
        .innerJoin(Candidates, eq(EducationRow.candidateId, Candidates.id))
        .where(
          and(
            eq(Candidates.organizationId, orgId),
            eq(EducationRow.candidateId, candidateId),
          ),
        ),
    create: async ({
      candidateId,
      school,
      degree,
      fieldOfStudy,
      orderIndex,
    }: {
      candidateId: string;
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
      candidateId: string,
      values: Partial<{
        school: string;
        degree: Education['degree'];
        fieldOfStudy: string;
      }>,
    ) => {
      const [education] = await db
        .update(EducationRow)
        .set(values)
        .where(and(eq(EducationRow.candidateId, candidateId), eq(EducationRow.id, id)))
        .returning();

      return education;
    },
    remove: async (id: string, candidateId: string) => {
      const [education] = await db
        .delete(EducationRow)
        .where(and(eq(EducationRow.candidateId, candidateId), eq(EducationRow.id, id)))
        .returning();

      return education;
    },
  };
};

export const withEducationRepo = <T>(
  orgId: string,
  fn: (repo: ReturnType<typeof createEducationRepo>) => Promise<T>,
) => {
  const repo = createEducationRepo(orgId);
  return fn(repo);
};

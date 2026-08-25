import { createProfileId } from '@/lib/data/profiles/profileTransforms';
import { Experiences } from '@/lib/db/schema';
import { normalize } from '@/lib/utils/normalize';
import { InferSelectModel } from 'drizzle-orm';

export const mapExperienceRowToExperience = (
  row: InferSelectModel<typeof Experiences>,
) => {
  const { profileId, ...experienceFields } = row;

  return {
    profileId: createProfileId(profileId),
    ...normalize(experienceFields),
  };
};

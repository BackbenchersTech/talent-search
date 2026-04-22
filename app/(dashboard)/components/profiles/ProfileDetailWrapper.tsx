import { getFullProfileDetails } from '@/lib/data/profiles/profileData';
import { ProfileDetailClient } from './ProfileDetailClient';
import { getAppContext } from '@/lib/auth/getAppContext';
import { PROFILE_ID_PREFIX } from '@/lib/data/profiles/profileTransforms';
import { decodeUUID } from '@/lib/utils/base62';

export const ProfileDetailWrapper = async ({ profileId }: { profileId: string }) => {
  const { orgId } = await getAppContext();
  const encodedProfileId = profileId.replace(PROFILE_ID_PREFIX, '');
  const decodedProfileId = decodeUUID(encodedProfileId);
  const { profile, candidate, education } = await getFullProfileDetails(
    orgId,
    decodedProfileId,
  );

  return (
    <ProfileDetailClient profile={profile} candidate={candidate} education={education} />
  );
};

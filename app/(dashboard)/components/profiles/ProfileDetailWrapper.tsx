import { getFullProfileDetails } from '@/lib/data/profiles/profileData';
import { ProfileDetailClient } from './ProfileDetailClient';
import { getAppContext } from '@/lib/auth/getAppContext';

export const ProfileDetailWrapper = async ({ profileId }: { profileId: string }) => {
  const { orgId } = await getAppContext();
  const { profile, candidate, education, experiences } = await getFullProfileDetails(
    orgId,
    profileId,
  );

  return (
    <ProfileDetailClient
      profile={profile}
      candidate={candidate}
      education={education}
      experiences={experiences}
    />
  );
};

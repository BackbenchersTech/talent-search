import { ProfileCard } from '@/app/(dashboard)/components/profiles/ProfileCard';
import { ProfileGrid } from '@/app/(dashboard)/components/profiles/ProfileGrid';
import { Search } from '@/app/components/Search';
import { getProfiles } from '@/lib/data/profiles/profileData';
import { cn } from '@/lib/utils/cn';

import { ProfileDetailWrapper } from '@/app/(dashboard)/components/profiles/ProfileDetailWrapper';
import styles from '@/app/(dashboard)/dashboard.module.css';
import { getAppContext } from '@/lib/auth/getAppContext';

const ExplorePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ profileId?: string }>;
}) => {
  const queryParams = await searchParams;
  const profileId = queryParams?.profileId;
  const { orgId } = await getAppContext();
  const profilesWithCandidate = await getProfiles(orgId);

  return (
    <>
      <div
        id='profiles-container'
        className={cn(
          'transition-all duration-100',
          profileId
            ? 'h-full w-[calc((100vw-(var(--spacing)*20))/2)] overflow-y-scroll border-r px-10 pt-16 pb-8'
            : styles['dashboard-page-container'],
        )}
      >
        <div className='flex flex-col'>
          <h1 className='text-2xl font-semibold'>Explore candidates</h1>

          <div className='mt-5'>
            <Search />
          </div>

          <div className='mt-6 w-full'>
            <ProfileGrid>
              {profilesWithCandidate.map((p) => (
                <ProfileCard key={p.id} profileWithCandidate={p} />
              ))}
            </ProfileGrid>
          </div>
        </div>
      </div>

      {profileId && <ProfileDetailWrapper key={profileId} profileId={profileId} />}
    </>
  );
};

export default ExplorePage;

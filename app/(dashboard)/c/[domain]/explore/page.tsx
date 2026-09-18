import { ExploreProfiles } from '@/app/(dashboard)/components/profiles/ExploreProfiles';
import { ProfileDetailWrapper } from '@/app/(dashboard)/components/profiles/ProfileDetailWrapper';
import styles from '@/app/(dashboard)/dashboard.module.css';
import { Search } from '@/app/components/Search';
import { getOrgIdFromSlug } from '@/lib/auth/getOrgIdFromSlug';
import { getProfilesPage } from '@/lib/data/profiles/profileData';
import { EXPLORE_PAGE_SIZE } from '@/lib/data/profiles/profileTypes';
import { cn } from '@/lib/utils/cn';

const ExplorePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ profileId?: string }>;
}) => {
  const { domain } = await params;
  const queryParams = await searchParams;
  const profileId = queryParams?.profileId;
  const orgId = await getOrgIdFromSlug(domain);
  const { rows, nextCursor, total } = await getProfilesPage(orgId, {
    limit: EXPLORE_PAGE_SIZE,
  });

  return (
    <>
      <div
        id='profiles-container'
        className={cn(
          'transition-all duration-100',
          profileId
            ? 'no-scrollbar h-full w-[calc((100vw-(var(--spacing)*20))/2)] overflow-y-scroll border-r px-10 pt-16 pb-8'
            : styles['dashboard-page-container'],
        )}
      >
        <div className='flex flex-col'>
          <h1 className='text-2xl font-semibold'>Explore candidates</h1>

          <div className='mt-5 w-full max-w-[500px]'>
            <Search />
          </div>

          <div className='mt-6 w-full'>
            <ExploreProfiles
              initialRows={rows}
              initialCursor={nextCursor}
              total={total}
            />
          </div>
        </div>
      </div>

      {profileId && <ProfileDetailWrapper key={profileId} profileId={profileId} />}
    </>
  );
};

export default ExplorePage;

import { ProfileCard } from '@/app/(dashboard)/components/profiles/ProfileCard';
import { ProfileGrid } from '@/app/(dashboard)/components/profiles/ProfileGrid';
import { Search } from '@/app/components/Search';
import { getProfiles } from '@/lib/data/profiles/profileData';

const ExplorePage = async () => {
  const profilesWithCandidate = await getProfiles();

  return (
    <main>
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
    </main>
  );
};

export default ExplorePage;

import { CandidateCard } from '@/app/components/CandidateCard';
import { CandidateGrid } from '@/app/components/CandidateGrid';
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
        <CandidateGrid>
          {profilesWithCandidate.map((p) => (
            <CandidateCard key={p.id} profileWithCandidate={p} />
          ))}
        </CandidateGrid>
      </div>
    </main>
  );
};

export default ExplorePage;

import { CandidateCard } from '@/app/components/CandidateCard';
import { CandidateGrid } from '@/app/components/CandidateGrid';
import { Search } from '@/app/components/Search';
import { getCandidates } from '@/lib/data/candidates/candidateData';

const ExplorePage = async () => {
  const candidates = await getCandidates();

  return (
    <main>
      <h1 className='text-2xl font-semibold'>Explore candidates</h1>

      <div className='mt-5'>
        <Search />
      </div>

      <div className='mt-6 w-full'>
        <CandidateGrid>
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </CandidateGrid>
      </div>
    </main>
  );
};

export default ExplorePage;

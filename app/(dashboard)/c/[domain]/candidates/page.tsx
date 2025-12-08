import { Search } from '@/app/components/Search';
import { Button } from '@/components/ui/button';

const CandidatesPage = () => (
  <main>
    <h1 className='text-2xl font-semibold'>Candidate management</h1>

    <div className='mt-5 flex items-center justify-between gap-2'>
      <Search />

      <Button>Add candidate</Button>
    </div>

    <div className='mt-6 w-full'>Candidates data table</div>
  </main>
);

export default CandidatesPage;

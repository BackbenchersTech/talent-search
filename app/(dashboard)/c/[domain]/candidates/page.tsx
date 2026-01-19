import { CandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { CreateCandidateButtonAndDialog } from '@/app/(dashboard)/components/candidates/CreateCandidateButtonAndDialog';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { Search } from '@/app/components/Search';
import { getCandidates } from '@/lib/data/candidates/candidateData';

const CandidatesPage = async () => {
  const candidates = await getCandidates();

  return (
    <main>
      <h1 className='text-2xl font-semibold'>Candidate management</h1>

      <div className='mt-5 flex items-center justify-between gap-2'>
        <Search />

        <CreateCandidateButtonAndDialog />
      </div>

      <div className='mt-6 w-full'>
        <DataTable data={candidates} columns={CandidatesTableColumns} />
      </div>
    </main>
  );
};

export default CandidatesPage;

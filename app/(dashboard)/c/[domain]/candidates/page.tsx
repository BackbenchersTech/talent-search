import { CandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { Search } from '@/app/components/Search';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getCandidates } from '@/lib/data/candidates/candidateData';
import Link from 'next/link';

const CandidatesPage = async () => {
  const candidates = await getCandidates();

  return (
    <main>
      <h1 className='text-2xl font-semibold'>Candidate management</h1>

      <div className='mt-5 flex items-center justify-between gap-2'>
        <Search />

        <Link
          href='candidates/new'
          className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium'
        >
          <PlusIcon className='size-4' />
          <span>Add candidate</span>
        </Link>
      </div>

      <div className='mt-6 w-full'>
        <DataTable data={candidates} columns={CandidatesTableColumns} />
      </div>
    </main>
  );
};

export default CandidatesPage;

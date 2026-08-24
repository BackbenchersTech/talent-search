import { CandidatesTable } from '@/app/(dashboard)/components/candidates/CandidatesTable';
import { CreateCandidateButtonAndDialog } from '@/app/(dashboard)/components/candidates/CreateCandidateButtonAndDialog';
import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { Search } from '@/app/components/Search';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getCandidates } from '@/lib/data/candidates/candidateData';

const CandidatesPage = async () => {
  const { orgId } = await getAppContext();
  const candidates = await getCandidates(orgId);

  return (
    <PageContainer>
      <h1 className='text-2xl font-semibold'>Candidate management</h1>

      <div className='mt-5 flex items-center justify-between gap-2'>
        <Search />

        <CreateCandidateButtonAndDialog />
      </div>

      <div className='mt-6 w-full'>
        <CandidatesTable candidates={candidates} />
      </div>
    </PageContainer>
  );
};

export default CandidatesPage;

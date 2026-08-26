import { CandidatesTable } from '@/app/(dashboard)/components/candidates/CandidatesTable';
import { CreateCandidateButtonAndDialog } from '@/app/(dashboard)/components/candidates/CreateCandidateButtonAndDialog';
import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { Search } from '@/app/components/Search';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getCandidatesWithProfilesPage } from '@/lib/data/candidates/candidateData';
import { parseCandidatesSort } from '@/app/(dashboard)/utils/candidateTable';

const PAGE_SIZE = 10;

const CandidatesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; order?: string }>;
}) => {
  const { orgId } = await getAppContext();

  const params = await searchParams;
  const requestedPage = Number(params.page);
  const page = Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1);
  const sort = parseCandidatesSort(params);

  let candidatesPage = await getCandidatesWithProfilesPage(orgId, {
    page,
    pageSize: PAGE_SIZE,
    sort,
  });

  // serve the last page when the link is stale (e.g. candidates were removed)
  if (candidatesPage.rows.length === 0 && page > candidatesPage.totalPages) {
    candidatesPage = await getCandidatesWithProfilesPage(orgId, {
      page: candidatesPage.totalPages,
      pageSize: PAGE_SIZE,
      sort,
    });
  }

  return (
    <PageContainer>
      <h1 className='text-2xl font-semibold'>Candidate management</h1>

      <div className='mt-5 flex items-center justify-between gap-2'>
        <Search />

        <CreateCandidateButtonAndDialog />
      </div>

      <div className='mt-6 w-full'>
        <CandidatesTable
          candidatesPage={candidatesPage}
          pageSize={PAGE_SIZE}
          sort={sort}
        />
      </div>
    </PageContainer>
  );
};

export default CandidatesPage;

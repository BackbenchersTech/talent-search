import { PageContainer } from '@/app/(dashboard)/components/PageContainer';

const HomePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ query?: string }>;
}) => {
  const { domain } = await params;
  const queryParams = await searchParams;

  return (
    <PageContainer>
      Home page <br />
      Domain: {domain}
      <br />
      Query: {JSON.stringify(queryParams) || 'N/A'}
    </PageContainer>
  );
};

export default HomePage;

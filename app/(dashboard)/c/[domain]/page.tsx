export const HomePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ query?: string }>;
}) => {
  const { domain } = await params;
  const searchParamsResolved = await searchParams;

  return (
    <div>
      Welcome to the {domain} Page. {JSON.stringify(searchParamsResolved)}
    </div>
  );
};

export default HomePage;

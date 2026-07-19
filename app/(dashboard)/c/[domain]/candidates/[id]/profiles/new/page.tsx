import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { CreateProfileForm } from '@/app/(dashboard)/components/profiles/CreateProfileForm';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getCandidateById } from '@/lib/data/candidates/candidateData';
import { CANDIDATE_ID_PREFIX } from '@/lib/data/candidates/candidateTransforms';
import { decodeUUID } from '@/lib/utils/base62';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const NewProfilePage = async (props: {
  params: Promise<{ id: string; domain: string }>;
}) => {
  const { domain, id } = await props.params;
  const encodedCandidateId = id.replace(CANDIDATE_ID_PREFIX, '');
  const decodedCandidateId = decodeUUID(encodedCandidateId);
  const { orgId } = await getAppContext();
  const candidate = await getCandidateById(orgId, decodedCandidateId);

  if (!candidate) {
    notFound();
  }

  const { firstName, lastName } = candidate;

  return (
    <PageContainer>
      <Link
        href={`/c/${domain}/candidates/${id}`}
        className='mb-2 inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-50'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        <span className='font-medium'>
          Back to {firstName} {lastName}
        </span>
      </Link>

      <h1 className='text-2xl font-medium'>New profile</h1>
      <p className='text-gray-600'>
        Create a new job profile for {firstName} {lastName}.
      </p>

      <CreateProfileForm
        candidateId={decodedCandidateId}
        domain={domain}
        candidateUrlId={id}
        className='mt-6'
      />
    </PageContainer>
  );
};

export default NewProfilePage;

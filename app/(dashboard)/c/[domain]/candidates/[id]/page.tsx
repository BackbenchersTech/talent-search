import { getCandidateById } from '@/lib/data/candidates/candidateData';
import { CANDIDATE_ID_PREFIX } from '@/lib/data/candidates/candidateTransforms';
import { decodeUUID } from '@/lib/utils/base62';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CandidateDetailPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const encodedCandidateId = id.replace(CANDIDATE_ID_PREFIX, '');
  const candidate = await getCandidateById(decodeUUID(encodedCandidateId));

  if (!candidate) {
    notFound();
  }

  const { firstName, lastName, city, state, country } = candidate;

  return (
    <main>
      <Link
        href='/candidates'
        className='mb-2 inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-50'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        <span className='font-medium'>View all candidates</span>
      </Link>

      {/* Name and location */}
      <div className='flex flex-col'>
        <h1 className='text-2xl font-medium'>
          {firstName} {lastName}
        </h1>

        <span className='flex items-center gap-1 text-gray-600'>
          <MapPinIcon className='size-4' />

          <span className='text-sm'>
            {city ? `${city}` : ''}
            {state ? `, ${state}` : ''}
            {country && country !== 'USA' ? `, ${country}` : ''}
          </span>
        </span>
      </div>

      {/*  */}
      <section>
        <div className='mt-6'>
          <h2 className='mt-6 mb-3 text-lg font-medium'>Basic information</h2>
          <p className='mt-2 mb-2 text-base'>TK</p>
        </div>
      </section>
    </main>
  );
};

export default CandidateDetailPage;

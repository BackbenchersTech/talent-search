import { CandidateInfoCard } from '@/app/(dashboard)/components/candidates/CandidateInfoCard';
import { CandidateStatusBadge } from '@/app/(dashboard)/components/candidates/CandidateStatusBadge';
import { ProfileCard } from '@/app/(dashboard)/components/profiles/ProfileCard';
import { ProfileGrid } from '@/app/(dashboard)/components/profiles/ProfileGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCandidateById } from '@/lib/data/candidates/candidateData';
import { CANDIDATE_ID_PREFIX } from '@/lib/data/candidates/candidateTransforms';
import { getCandidateProfiles } from '@/lib/data/profiles/profileData';
import { decodeUUID } from '@/lib/utils/base62';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CandidateDetailPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const encodedCandidateId = id.replace(CANDIDATE_ID_PREFIX, '');
  const decodedCandidateId = decodeUUID(encodedCandidateId);
  const candidate = await getCandidateById(decodedCandidateId);
  const jobProfiles = await getCandidateProfiles(decodedCandidateId);

  if (!candidate) {
    notFound();
  }

  const profilesWithCandidate = jobProfiles.map((jp) => ({
    ...jp,
    candidate: {
      id: candidate.id,
      city: candidate.city,
      state: candidate.state,
      country: candidate.country,
      availability: candidate.availability,
    },
  }));

  const { firstName, lastName, city, state, country, profileImageUrl, status } =
    candidate;

  return (
    <main>
      <Link
        href='/candidates'
        className='mb-2 inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-50'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        <span className='font-medium'>View all candidates</span>
      </Link>

      {/* TODO: add linkedin link as icon in header */}
      {/* TODO: actions => make active/inactive, edit */}
      <div className='flex items-center gap-4'>
        <>
          <Avatar className='size-13'>
            <AvatarImage src={profileImageUrl || undefined} alt='' />
            <AvatarFallback className='bg-black text-white'>
              {firstName.at(0)}
              {lastName.at(0)}
            </AvatarFallback>
          </Avatar>
        </>

        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-medium'>
              {firstName} {lastName}
            </h1>

            <CandidateStatusBadge status={status} />
          </div>

          <span className='flex items-center gap-1 text-gray-600'>
            <MapPinIcon className='size-4' />

            <span className='text-sm'>
              {city ? `${city}` : ''}
              {state ? `, ${state}` : ''}
              {country && country !== 'USA' ? `, ${country}` : ''}
            </span>
          </span>
        </div>
      </div>

      <section>
        <CandidateInfoCard className='mt-6' />

        <h2 className='mt-6 mb-3 text-lg font-medium'>Job profiles</h2>
        <ProfileGrid>
          {/* fetch profiles for candidate */}
          {profilesWithCandidate.map((p) => (
            <ProfileCard key={p.id} profileWithCandidate={p} />
          ))}
        </ProfileGrid>
      </section>
    </main>
  );
};

export default CandidateDetailPage;

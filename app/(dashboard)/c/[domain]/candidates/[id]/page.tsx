import { ProfileCard } from '@/app/(dashboard)/components/profiles/ProfileCard';
import { ProfileGrid } from '@/app/(dashboard)/components/profiles/ProfileGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const { firstName, lastName, city, state, country, profileImageUrl } = candidate;

  return (
    <main>
      <Link
        href='/candidates'
        className='mb-2 inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-50'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        <span className='font-medium'>View all candidates</span>
      </Link>

      {/* TODO: add status tag and linkedin link as icon in header */}
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
      </div>

      <section>
        {/* TODO: implement a single row/card that shows all of this */}
        {/* TODO: split the cards into individual client components that have the edit buttons functionality built into them */}
        <Card className='mt-6 shadow-none'>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardAction>edit button on hover</CardAction>
          </CardHeader>

          <CardContent>
            <p>email &middot; • phone, salary expected range</p>
          </CardContent>
        </Card>

        <h2 className='mt-6 mb-3 text-lg font-medium'>Job profiles</h2>
        <ProfileGrid>
          {/* fetch profiles for candidate */}
          {profilesWithCandidate.map((p) => (
            <ProfileCard key={p.id} profileWithCandidate={p} />
          ))}
        </ProfileGrid>

        <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm'>
          <span className='flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-sm ring-2 ring-white' />

          <span className='text-sm font-medium text-gray-800'>Active</span>
        </span>

        <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm'>
          <span className='flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-300 via-red-500 to-red-600 shadow-sm ring-2 ring-white' />

          <span className='text-sm font-medium text-gray-800'>Inactive</span>
        </span>

        <span className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm'>
          <span className='flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-sm ring-2 ring-white' />

          <span className='text-sm font-medium text-gray-700'>Draft</span>
        </span>

        <div>hoverable notes section that internal team adds</div>
      </section>
    </main>
  );
};

export default CandidateDetailPage;

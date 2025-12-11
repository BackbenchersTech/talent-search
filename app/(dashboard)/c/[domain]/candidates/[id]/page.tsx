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

      {/* TODO: add tags in header */}
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
        {/* all of this is internal view only */}
        {/* TODO: split the cards into individual client components that have the edit buttons functionality built into them */}
        <Card className='mt-6 shadow-none'>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardAction>edit button on hover</CardAction>
          </CardHeader>

          <CardContent>
            <p>
              name, title, location, availability, salary expectations, total years of
              experience
            </p>
          </CardContent>
        </Card>

        <Card className='mt-6 shadow-none'>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardAction>edit button on hover</CardAction>
          </CardHeader>

          <CardContent>
            <p>email, phone, linkedin</p>
          </CardContent>
        </Card>

        <Card className='mt-6 shadow-none'>
          <CardHeader>
            <CardTitle>Skills & Tags</CardTitle>
            <CardAction>edit button on hover</CardAction>
          </CardHeader>

          <CardContent>
            <p>Skill chips. should this be in profiles?</p>
          </CardContent>
        </Card>

        <Card className='mt-6 shadow-none'>
          <CardHeader>
            <CardTitle>Resumes</CardTitle>
            <CardAction>edit button on hover</CardAction>
          </CardHeader>

          <CardContent>
            <p>PDF preview, parsed summary</p>
          </CardContent>
        </Card>

        <span>public profiles section</span>
        <br />

        <span>hoverable notes section that internal team adds</span>
        <br />
      </section>
    </main>
  );
};

export default CandidateDetailPage;

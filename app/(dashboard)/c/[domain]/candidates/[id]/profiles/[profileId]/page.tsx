import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { ProfileDetailContent } from '@/app/(dashboard)/components/profiles/ProfileDetailContent';
import { ProfileStatusBadge } from '@/app/(dashboard)/components/profiles/ProfileStatusBadge';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getFullProfileDetails } from '@/lib/data/profiles/profileData';
import { PROFILE_ID_PREFIX } from '@/lib/data/profiles/profileTransforms';
import { ProfileAvailability } from '@/lib/data/profiles/profileTypes';
import { decodeUUID } from '@/lib/utils/base62';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const ProfileDetailPage = async (props: {
  params: Promise<{ domain: string; id: string; profileId: string }>;
}) => {
  const { domain, id, profileId } = await props.params;
  const encodedProfileId = profileId.replace(PROFILE_ID_PREFIX, '');

  let decodedProfileId: string;
  try {
    decodedProfileId = decodeUUID(encodedProfileId);
  } catch {
    notFound();
  }

  const { orgId } = await getAppContext();
  const { profile, candidate, education } = await getFullProfileDetails(
    orgId,
    decodedProfileId,
  );

  if (!profile || profile.candidateId !== id) {
    notFound();
  }

  const { title, billRateMin, billRateMax, availability, status } = profile;
  const { firstName, lastName, city, state, country } = candidate || {};

  return (
    <PageContainer>
      {/* TODO: rework header layout — split into proper header/hero section */}
      <Link
        href={`/c/${domain}/candidates/${id}`}
        className='mb-2 inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-50'
      >
        <ArrowLeftIcon className='size-4 stroke-2' />
        <span className='font-medium'>
          Back to {firstName} {lastName}
        </span>
      </Link>

      <div className='flex flex-wrap items-center gap-2'>
        <h1 className='text-2xl font-medium'>{title}</h1>

        <ProfileStatusBadge status={status} />
      </div>

      <div className='mt-2 flex flex-wrap items-center gap-1'>
        <span className='flex items-center gap-1 text-gray-600'>
          <MapPinIcon className='size-4' />

          <span className='text-sm'>
            {city ? `${city}` : ''}
            {state ? `, ${state}` : ''}
            {country && country !== 'USA' ? `, ${country}` : ''}
          </span>
        </span>
        {city && <span>·</span>}
        {availability && (
          <span className='text-sm text-gray-600'>
            Available
            {` ${
              availability === ProfileAvailability.AVAILABLE_NOW
                ? 'immediately'
                : `in ${availability}`
            }`}
          </span>
        )}
      </div>

      <article className='max-w-3xl'>
        <h2 className='mt-8 mb-3 text-[26px] font-semibold'>
          {`$${billRateMin}${billRateMax ? ` - ${billRateMax}` : ''}`}
          <span className='ml-2 text-[14px] font-normal text-gray-500'>per hour</span>
        </h2>

        <ProfileDetailContent profile={profile} education={education} editable />
      </article>
    </PageContainer>
  );
};

export default ProfileDetailPage;

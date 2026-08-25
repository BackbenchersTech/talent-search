import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { ProfileDetailContent } from '@/app/(dashboard)/components/profiles/ProfileDetailContent';
import { ProfileStatusBadge } from '@/app/(dashboard)/components/profiles/ProfileStatusBadge';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getFullProfileDetails } from '@/lib/data/profiles/profileData';
import { ProfileAvailability } from '@/lib/data/profiles/profileTypes';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const ProfileDetailPage = async (props: {
  params: Promise<{ domain: string; id: string; profileId: string }>;
}) => {
  const { domain, id, profileId } = await props.params;
  const { orgId } = await getAppContext();
  const { profile, candidate, education, experiences } = await getFullProfileDetails(
    orgId,
    profileId,
  );

  if (!profile || profile.candidateId !== id) {
    return (
      <PageContainer>
        <div className='mx-auto mt-24 max-w-md text-center'>
          <h1 className='text-xl font-medium text-gray-900'>
            Couldn&lsquo;t find what you were looking for
          </h1>

          <p className='mt-2 text-sm text-gray-600'>
            This profile doesn&lsquo;t exist or may have been deleted.
          </p>

          <div className='mt-6'>
            <Link
              href={`/c/${domain}/candidates/${id}`}
              className='inline-flex items-center gap-1 text-sm font-medium underline-offset-2 transition-opacity hover:opacity-50 hover:underline'
            >
              <ArrowLeftIcon className='size-4 stroke-2' />
              Go back to candidate
            </Link>
          </div>
        </div>
      </PageContainer>
    );
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

        <ProfileDetailContent
          profile={profile}
          education={education}
          experiences={experiences}
          editable
        />
      </article>
    </PageContainer>
  );
};

export default ProfileDetailPage;

import { NotFoundState } from '@/app/(dashboard)/components/NotFoundState';
import { PageContainer } from '@/app/(dashboard)/components/PageContainer';
import { ProfileDetailContent } from '@/app/(dashboard)/components/profiles/ProfileDetailContent';
import { ProfileHeader } from '@/app/(dashboard)/components/profiles/ProfileHeader';
import { getAppContext } from '@/lib/auth/getAppContext';
import { getFullProfileDetails } from '@/lib/data/profiles/profileData';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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
        <NotFoundState
          primaryText='Couldn&lsquo;t find what you were looking for'
          secondaryText='This profile doesn&lsquo;t exist or may have been deleted.'
          backHref={`/c/${domain}/candidates/${id}`}
          backLabel='Go back to candidate'
        />
      </PageContainer>
    );
  }

  const { firstName, lastName } = candidate || {};

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

      <article className='max-w-3xl'>
        <ProfileHeader profile={profile} candidate={candidate} />

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

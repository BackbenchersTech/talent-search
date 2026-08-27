'use client';

import { NotFoundState } from '@/app/(dashboard)/components/NotFoundState';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/lib/data/candidates/candidateTypes';
import { Education } from '@/lib/data/education/educationTypes';
import { Experience } from '@/lib/data/experiences/experienceTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';
import {
  ArrowDownTrayIcon,
  ChevronDoubleRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import { ProfileDetailContent } from './ProfileDetailContent';
import { ProfileHeader } from './ProfileHeader';

const Panel = ({ children }: { children: ReactNode }) => (
  <aside className='fixed top-0 right-0 z-30 h-full w-full overflow-y-auto bg-white px-8 pt-16 sm:w-[calc(100vw-(var(--spacing)*20))] sm:pt-5 lg:w-[calc((100vw-(var(--spacing)*20))/2)]'>
    {children}
  </aside>
);

export const ProfileDetailClient = ({
  profile,
  candidate,
  education,
  experiences,
}: {
  profile?: Profile;
  candidate?: Candidate;
  education: Education[];
  experiences: Experience[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const closeHref = (() => {
    const params = new URLSearchParams(searchParams);
    params.delete('profileId');

    const qs = params.toString();

    return qs ? `${pathname}?${qs}` : pathname;
  })();

  const closePanel = () => {
    router.push(closeHref);
  };

  if (!profile) {
    return (
      <Panel>
        <NotFoundState
          primaryText='Couldn&lsquo;t find what you were looking for'
          secondaryText='This profile doesn&lsquo;t exist or may have been deleted.'
          backHref={closeHref}
          backLabel='Go back to explore'
        />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className='flex items-center'>
        <Button
          variant='ghost'
          className='cursor-pointer rounded-md p-2! transition hover:bg-gray-100'
          onClick={closePanel}
        >
          <ChevronDoubleRightIcon className='stroke-1.5 size-5 text-gray-400' />
        </Button>
      </div>

      <article>
        <div className='lg:pt-8'>
          <ProfileHeader
          profile={profile}
          candidate={candidate}
          actions={
            <>
              <Button className='cursor-pointer'>
                <PlusIcon className='size-4' /> Shortlist
              </Button>
              <Button variant='outline' className='cursor-pointer shadow-none'>
                <ArrowDownTrayIcon className='size-4' /> Download resume
              </Button>
            </>
          }
        />
        </div>

        <ProfileDetailContent
          profile={profile}
          education={education}
          experiences={experiences}
        />
      </article>
    </Panel>
  );
};

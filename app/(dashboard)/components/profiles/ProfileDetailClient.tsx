'use client';

import { NotFoundState } from '@/app/(dashboard)/components/NotFoundState';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/lib/data/candidates/candidateTypes';
import { Education } from '@/lib/data/education/educationTypes';
import { Experience } from '@/lib/data/experiences/experienceTypes';
import { Profile, ProfileAvailability } from '@/lib/data/profiles/profileTypes';
import {
  ArrowDownTrayIcon,
  ChevronDoubleRightIcon,
  MapPinIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import { ProfileDetailContent } from './ProfileDetailContent';

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
  const { title, billRateMin, billRateMax, availability } = profile || {};
  const { city, state, country } = candidate || {};

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
        {/* Profile title and rate details */}
        <div className='flex justify-between max-lg:gap-6 lg:pt-8'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col items-start gap-1'>
              <h1 className='text-2xl font-medium tracking-tight text-gray-900'>
                {title}
              </h1>

              <h2 className='text-xl font-medium sm:hidden'>
                {`$${billRateMin}${billRateMax ? ` - ${billRateMax}` : ''} / hour`}
              </h2>
            </div>

            <div className='flex flex-wrap items-center gap-1'>
              <span className='flex items-center gap-1 text-gray-600'>
                <MapPinIcon className='size-4' />

                <span className='text-sm'>
                  {city ? `${city}` : ''}
                  {state ? `, ${state}` : ''}
                  {country && country !== 'USA' ? `, ${country}` : ''}
                </span>
              </span>
              {city && <span>·</span>}
              <span className='text-sm text-gray-600'>
                Available
                {availability === ProfileAvailability.AVAILABLE_NOW
                  ? ' immediately'
                  : ` in ${availability}`}
              </span>
            </div>

            <div className='flex gap-1.5'>
              <Button className='cursor-pointer'>
                <PlusIcon className='size-4' /> Shortlist
              </Button>
              <Button variant='outline' className='cursor-pointer shadow-none'>
                <ArrowDownTrayIcon className='size-4' /> Download resume
              </Button>
            </div>
          </div>

          <div className='flex flex-col items-end max-sm:hidden'>
            <h2 className='text-[26px] font-semibold max-sm:text-2xl'>
              {`$${billRateMin}${billRateMax ? ` - ${billRateMax}` : ''}`}
            </h2>

            {/* TODO: need a rate range descriptor that we can get from an enum */}
            <div className='text-[14px] text-gray-500'>per hour</div>
          </div>
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

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Candidate, CandidateAvailability } from '@/lib/data/candidates/candidateTypes';
import { Education } from '@/lib/data/education/educationTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';
import {
  ArrowDownTrayIcon,
  ChevronDoubleRightIcon,
  MapPinIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const ProfileDetailClient = ({
  profile,
  candidate,
  education,
}: {
  profile?: Profile;
  candidate?: Candidate;
  education: Education[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { title, billRateMin, billRateMax, bio, skills } = profile || {};
  const { city, state, country, availability } = candidate || {};

  const closePanel = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('profileId');

    router.push(`${pathname}?${params.toString()}`);
  };

  if (!profile) {
    return null;
  }

  return (
    <aside className='fixed top-0 right-0 z-30 h-full w-full overflow-y-auto bg-white px-8 pt-16 sm:w-[calc(100vw-(var(--spacing)*20))] sm:pt-5 lg:w-[calc((100vw-(var(--spacing)*20))/2)]'>
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
                {` ${
                  availability === CandidateAvailability.AVAILABLE_NOW
                    ? 'immediately'
                    : `in ${availability}`
                }`}
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

        <section className='mt-8'>
          {/* Bio section */}
          <section className='mb-4'>
            <h3 className='font-medium text-black'>
              <strong>Summary</strong>
            </h3>

            <p className='text-gray-600'>{bio}</p>
          </section>

          {/* Skills section */}
          {skills?.length && (
            <section className='mb-4'>
              <h3 className='font-medium text-black'>
                <strong>Skills</strong>
              </h3>

              <p className='text-gray-600'>
                {skills.map((skill, idx) => (
                  <Badge key={`skill-${idx}`} className='mr-1 bg-gray-200 text-black'>
                    {skill}
                  </Badge>
                ))}
              </p>
            </section>
          )}

          {/* 3 highlighted/curated experiences */}
          {/* Summary/timeline of all positions with option to view more details  */}
          {/* Education section */}
          {education.length && (
            <section>
              <h3 className='font-medium text-black'>
                <strong>Education</strong>
              </h3>

              <ul>
                {education.map((edu, idx) => (
                  <li key={`education-${idx}`} className='mb-2'>
                    <span>
                      {edu.degree}
                      {edu.fieldOfStudy ? `; ${edu.fieldOfStudy}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </article>
    </aside>
  );
};

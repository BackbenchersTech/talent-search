import { Candidate } from '@/lib/data/candidates/candidateTypes';
import { Profile, ProfileAvailability } from '@/lib/data/profiles/profileTypes';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import { ProfileStatusBadge } from './ProfileStatusBadge';

interface ProfileHeaderProps {
  profile: Profile;
  candidate?: Candidate;
  actions?: ReactNode;
}

export const ProfileHeader = ({
  profile,
  candidate,
  actions,
}: ProfileHeaderProps) => {
  const { title, billRateMin, billRateMax, availability, status } = profile;
  const { city, state, country } = candidate || {};

  return (
    <div className='flex justify-between max-lg:gap-6'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col items-start gap-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-medium tracking-tight text-gray-900'>
              {title}
            </h1>

            <ProfileStatusBadge status={status} />
          </div>

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
          {availability && (
            <span className='text-sm text-gray-600'>
              Available
              {availability === ProfileAvailability.AVAILABLE_NOW
                ? ' immediately'
                : ` in ${availability}`}
            </span>
          )}
        </div>

        {actions && <div className='flex flex-wrap gap-1.5'>{actions}</div>}
      </div>

      <div className='flex flex-col items-end max-sm:hidden'>
        <h2 className='text-[26px] font-semibold max-sm:text-2xl'>
          {`$${billRateMin}${billRateMax ? ` - ${billRateMax}` : ''}`}
        </h2>

        {/* TODO: need a rate range descriptor that we can get from an enum */}
        <div className='text-[14px] text-gray-500'>per hour</div>
      </div>
    </div>
  );
};

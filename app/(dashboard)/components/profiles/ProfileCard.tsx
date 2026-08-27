'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ProfileWithCandidate,
  ProfileAvailability,
} from '@/lib/data/profiles/profileTypes';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileStatusBadge } from './ProfileStatusBadge';

interface ProfileCardProps {
  profileWithCandidate: ProfileWithCandidate;
  href: string;
  showStatus?: boolean;
}

export const ProfileCard = ({
  profileWithCandidate,
  href,
  showStatus = false,
}: ProfileCardProps) => {
  const {
    title,
    billRateMin,
    billRateMax,
    availability,
    status,
    candidate: { city, state, country },
  } = profileWithCandidate;

  return (
    <Link
      href={href}
      className='group block rounded-md bg-white p-3 shadow ring-1 ring-gray-200 transition-all hover:bg-gray-100/70 hover:shadow-md hover:ring-2 hover:ring-gray-600 active:shadow-none'
    >
      <article className='relative p-1'>
        {showStatus && (
          <section className='mb-0.5'>
            <ProfileStatusBadge status={status} />
          </section>
        )}

        <section className='mb-2 flex items-center gap-2'>
          <h2 className='line-clamp-1 pe-2 font-medium group-hover:max-w-[75%]'>
            {title}
          </h2>
        </section>

        {/* absolute positioned view CTA */}
        <p className='absolute top-0 right-2 flex items-center gap-1 rounded-md bg-gray-50/50 px-2 py-4 text-sm text-black opacity-0 backdrop-blur-sm group-hover:opacity-100 group-focus:opacity-100'>
          View
          <ArrowUpRightIcon className='size-3' />
        </p>

        {/* Rate */}
        <p className='text-[15px] text-gray-600'>
          {`$${billRateMin}${billRateMax ? ` - ${billRateMax}` : ''} / hour`}
        </p>

        {/* Location with timezone */}
        <p className='my-[2px] text-sm text-gray-500'>
          {[city, state, country].filter((x) => !!x).join(', ')} (UTC+5:30)
        </p>

        {/* Availability */}
        <p className='text-sm text-gray-500'>
          Available
          {availability === ProfileAvailability.AVAILABLE_NOW
            ? ' immediately'
            : ` in ${availability}`}
        </p>

        <section className='mt-6 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex -space-x-1'>
              <Avatar className='size-6 border-2 border-white'>
                <AvatarImage src='https://www.github.com/apiedy.png' alt='@apiedy' />
              </Avatar>

              <Avatar className='size-6 border-2 border-white'>
                <AvatarImage src='https://www.github.com/shadcn.png' alt='@shadcn' />
              </Avatar>

              <Avatar className='size-6 border-2 border-white'>
                {/* intentionally failing url */}
                <AvatarImage src='/default-avatar' alt='@default' />
                <AvatarFallback>
                  <Image
                    src='/default-avatar.svg'
                    width={24}
                    height={24}
                    alt='Default Profile Image'
                  />
                </AvatarFallback>
              </Avatar>
            </div>

            <span className='text-xs text-gray-500'>3 projects completed</span>
          </div>
        </section>
      </article>
    </Link>
  );
};

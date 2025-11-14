'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight } from '@/components/ui/icons/ArrowUpRight';
import Image from 'next/image';
import Link from 'next/link';

interface CandidateCardProps {
  href: string;
}

export const CandidateCard = ({ href }: CandidateCardProps) => {
  return (
    <Link
      href={href}
      className='block group rounded-md bg-white p-3 shadow ring-1 ring-gray-200 transition-all hover:bg-gray-100/70 hover:shadow-md hover:ring-2 hover:ring-gray-600 active:shadow-none'
    >
      <article className='relative p-1'>
        <section className='flex items-center mb-2 gap-2'>
          <Avatar className='size-10'>
            <AvatarImage
              src='https://www.github.com/apiedy.png'
              alt='@apiedy'
            />
          </Avatar>

          <h2 className='font-medium line-clamp-1 pe-2 group-hover:max-w-[75%]'>
            Certified Salesforce Administrator (Pardot)
          </h2>
        </section>

        {/* absolute positioned view CTA */}
        <p className='flex items-center gap-1 rounded-md bg-gray-50/50 absolute top-0 right-2 px-2 py-4 text-sm text-black opacity-0 group-hover:opacity-100 backdrop-blur-sm group-focus:opacity-100'>
          View
          <ArrowUpRight />
        </p>

        {/* Rate */}
        <p className='text-[15px] text-gray-600'>$35 - $45 / hour</p>

        {/* Location with timezone */}
        <p className='my-[2px] text-sm text-gray-500'>
          Bangalore, India (UTC+5:30)
        </p>

        {/* Availability */}
        <p className='text-sm text-gray-500'>Available in 2 weeks</p>

        <section className='mt-6 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex -space-x-1'>
              <Avatar className='border-2 border-white size-6'>
                <AvatarImage
                  src='https://www.github.com/apiedy.png'
                  alt='@apiedy'
                />
              </Avatar>

              <Avatar className='border-2 border-white size-6'>
                <AvatarImage
                  src='https://www.github.com/shadcn.png'
                  alt='@shadcn'
                />
              </Avatar>

              <Avatar className='border-2 border-white size-6'>
                {/* intentionally failing url */}
                <AvatarImage src='/default-avatar' alt='@default' />
                <AvatarFallback>
                  <Image
                    src='/default-avatar.svg'
                    width={24}
                    height={24}
                    alt=''
                    className='grayscale'
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

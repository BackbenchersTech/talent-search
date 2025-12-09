'use client';

import { cn } from '@/lib/utils/cn';
import {
  ArrowTrendingUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
  const pathName = usePathname();

  return (
    <footer className='fixed bottom-0 left-0 z-50 w-screen border-t bg-white py-3 sm:hidden'>
      <ul role='list' className='flex items-center justify-around'>
        <li className='relative'>
          <Link
            href='/explore'
            className={cn(
              'group flex aspect-square w-[40px] flex-col items-center justify-center gap-1 text-black',
              { 'text-indigo-600': pathName === '/explore' },
            )}
          >
            <div className='transition-all duration-300'>
              <MagnifyingGlassIcon className='size-5 stroke-2' />
            </div>

            <span className='text-[10px]'>Explore</span>
          </Link>
        </li>

        <li className='relative'>
          <Link
            href='/'
            className={cn(
              'group flex aspect-square w-[40px] flex-col items-center justify-center gap-1 text-black',
              { 'text-indigo-600': pathName === '/' },
            )}
          >
            <div className='transition-all duration-300'>
              <HomeIcon className='size-5 stroke-2' />
            </div>

            <span className='text-[10px]'>Home</span>
          </Link>
        </li>

        <li className='relative'>
          <Link
            href='/candidates'
            className={cn(
              'group flex aspect-square w-[40px] flex-col items-center justify-center gap-1 text-black',
              { 'text-indigo-600': pathName === '/candidates' },
            )}
          >
            <div className='transition-all duration-300'>
              <UsersIcon className='size-5 stroke-2' />
            </div>

            <span className='text-[10px]'>Candidates</span>
          </Link>
        </li>

        <li className='relative'>
          <Link
            href='/analytics'
            className={cn(
              'group flex aspect-square w-[40px] flex-col items-center justify-center gap-1 text-black',
              { 'text-indigo-600': pathName === '/analytics' },
            )}
          >
            <div className='transition-all duration-300'>
              <ArrowTrendingUpIcon className='size-5 stroke-2' />
            </div>

            <span className='text-[10px]'>Analytics</span>
          </Link>
        </li>
      </ul>
    </footer>
  );
};

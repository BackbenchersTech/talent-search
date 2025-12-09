'use client';

import { cn } from '@/lib/utils/cn';
import {
  ArrowRightEndOnRectangleIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className='hidden h-screen sm:sticky sm:top-0 sm:z-50 sm:flex sm:flex-col'
      aria-label='Main navigation sidebar'
    >
      <div className='flex w-20 grow flex-col overflow-x-visible border-r border-gray-200 bg-white/5'>
        <section className='flex flex-1 flex-col'>
          <div className='flex justify-center p-3'>
            {/* TODO: replace with logo SVG */}
            <div className='flex h-[56px] w-[55px] items-center justify-center text-[30px]'>
              ff
            </div>
          </div>

          <nav className='flex-1'>
            <ul role='list' className='flex flex-col items-center justify-center'>
              <li className='flex w-full flex-col items-center justify-center'>
                {/* TODO: fix routes to work for both domain paths and subdomains */}
                <Link
                  className={cn(
                    'group relative flex w-full flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]',
                    { 'bg-indigo-50': pathname === '/explore' },
                  )}
                  aria-label='Explore'
                  href='/explore'
                >
                  <div
                    className={cn(
                      'flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600',
                      { 'font-medium text-indigo-600': pathname === '/explore' },
                    )}
                  >
                    <div className='p-2'>
                      <MagnifyingGlassIcon className='size-5 stroke-2' />
                    </div>

                    <span className='text-[10px]'>Explore</span>
                  </div>
                </Link>
              </li>

              <li className='flex w-full flex-col items-center justify-center'>
                <Link
                  className={cn(
                    'group relative flex w-full flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]',
                    { 'bg-indigo-50': pathname === '/' },
                  )}
                  aria-label='Home'
                  href='/'
                >
                  <div
                    className={cn(
                      'flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600',
                      { 'font-medium text-indigo-600': pathname === '/' },
                    )}
                  >
                    <div className='p-2'>
                      <HomeIcon className='size-5 stroke-2' />
                    </div>

                    <span className='text-[10px]'>Home</span>
                  </div>
                </Link>
              </li>

              <li className='flex w-full flex-col items-center justify-center'>
                <Link
                  className={cn(
                    'group relative flex w-full flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]',
                    { 'bg-indigo-50': pathname === '/candidates' },
                  )}
                  aria-label='Candidates'
                  href='/candidates'
                >
                  <div
                    className={cn(
                      'flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600',
                      { 'font-medium text-indigo-600': pathname === '/candidates' },
                    )}
                  >
                    <div className='p-2'>
                      <UsersIcon className='size-5 stroke-2' />
                    </div>

                    <span className='text-[10px]'>Candidates</span>
                  </div>
                </Link>
              </li>

              <li className='flex w-full flex-col items-center justify-center'>
                <Link
                  className={cn(
                    'group relative flex w-full flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]',
                    { 'bg-indigo-50': pathname === '/analytics' },
                  )}
                  aria-label='Analytics'
                  href='/analytics'
                >
                  <div
                    className={cn(
                      'flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600',
                      { 'font-medium text-indigo-600': pathname === '/analytics' },
                    )}
                  >
                    <div className='p-2'>
                      <ArrowTrendingUpIcon className='size-5 stroke-2' />
                    </div>

                    <span className='text-[10px]'>Analytics</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          <section aria-label='User actions'>
            <ul role='list' className='flex w-full flex-col items-center'>
              <li className='flex w-full flex-col items-center justify-center'>
                <button
                  onClick={() => {
                    router.push('/login');
                  }}
                  className='group relative flex w-full cursor-pointer flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]'
                >
                  <div className='flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600'>
                    <div className='p-2'>
                      <ArrowRightEndOnRectangleIcon className='size-6' />
                    </div>

                    <span className='text-[10px]'>Sign in</span>
                  </div>
                </button>
              </li>
            </ul>
          </section>
        </section>
      </div>
    </aside>
  );
};

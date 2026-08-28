'use client';

import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const NavBar = () => {
  const [isSlidingMenuOpen, setIsSlidingMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSlidingMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='fixed top-0 left-0 flex h-[64px] w-full flex-row items-center justify-between gap-4 bg-white px-6 text-[14px] duration-300 sm:px-6 md:px-5'>
        <Link href='/' className=''>
          Example
        </Link>

        <div className='justfy-center hidden flex-row items-center gap-2 md:flex'>
          <Link
            href='/pricing'
            className='rounded-full px-3.5 py-2 duration-200 hover:bg-gray-100'
          >
            Pricing
          </Link>

          <Link
            href='/blog'
            className='rounded-full px-3.5 py-2 duration-200 hover:bg-gray-100'
          >
            Blog
          </Link>

          <Link
            href='/blog'
            className='rounded-full px-3.5 py-2 duration-200 hover:bg-gray-100'
          >
            Request a demo
          </Link>
        </div>

        <div className='flex flex-row items-center justify-end'>
          <Button
            variant='ghost'
            className='h-fit p-0! text-gray-400 duration-200 hover:text-black md:hidden'
            onClick={() => setIsSlidingMenuOpen(!isSlidingMenuOpen)}
          >
            {/* sidebar icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              aria-hidden='true'
              data-slot='icon'
              fill='none'
              className='size-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 4.5v15m-4.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z'
              ></path>
            </svg>
          </Button>

          <Link
            href='/login'
            className='hidden rounded-full bg-gray-100/80 px-4 py-2 duration-300 hover:bg-gray-200/80 md:block'
          >
            Log in
          </Link>
        </div>
      </div>

      <div
        className={clsx(
          'fixed z-[1000] mx-0 mt-16 block h-full w-[100vw] bg-white pr-6 pl-4.5 duration-300 md:hidden',
          {
            'ml-0 opacity-100': isSlidingMenuOpen,
            '-ml-[100vw] opacity-0': !isSlidingMenuOpen,
          },
        )}
      >
        <div className='flex h-full w-full flex-col items-start justify-start text-[14px] max-md:pt-4'>
          <Link
            href='/pricing'
            className='w-full px-2 py-2 text-start duration-200 hover:bg-gray-100/80 max-md:py-3 max-md:text-base'
          >
            Pricing
          </Link>

          <Link
            href='/blog'
            className='w-full px-2 py-2 text-start duration-200 hover:bg-gray-100/80 max-md:py-3 max-md:text-base'
          >
            Blog
          </Link>

          <Link
            href='/blog'
            className='w-full px-2 py-2 text-start duration-200 hover:bg-gray-100/80 max-md:py-3 max-md:text-base'
          >
            Request a demo
          </Link>
        </div>
      </div>
    </>
  );
};

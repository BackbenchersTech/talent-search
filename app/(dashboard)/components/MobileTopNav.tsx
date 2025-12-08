'use client';

import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export const MobileTopNav = () => {
  const router = useRouter();

  return (
    <div className='fixed top-0 z-40 inline-block w-full sm:hidden'>
      <div className='flex h-16 items-center justify-between bg-white pr-4 shadow-sm max-sm:pr-0 sm:px-0 sm:pr-6 sm:pl-3 sm:shadow-none md:border-b md:border-gray-200'>
        <div className='flex h-16 w-16 items-center justify-center text-[30px]'>ff</div>

        <section aria-label='User actions'>
          <ul role='list' className='flex w-full flex-col items-center'>
            <li className='flex w-full flex-col items-center justify-center'>
              <button
                onClick={() => {
                  router.push('/login');
                }}
                className='group relative flex w-full cursor-pointer flex-col items-center justify-center px-3 py-2 hover:bg-[#F5F7FF]'
              >
                <div className='flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600'>
                  <div className='mb-[1px] px-2 py-1'>
                    <ArrowRightEndOnRectangleIcon className='size-6' />
                  </div>

                  <span className='text-[10px]'>Sign in</span>
                </div>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

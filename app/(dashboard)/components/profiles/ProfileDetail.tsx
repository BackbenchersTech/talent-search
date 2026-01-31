'use client';

import { Button } from '@/components/ui/button';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const ProfileDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const closePanel = () => {
    const params = new URLSearchParams(searchParams);

    params.delete('profileId');

    router.push(`${pathname}?${params.toString()}`);
  };

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
    </aside>
  );
};

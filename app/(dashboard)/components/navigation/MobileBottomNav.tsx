'use client';

import { createNavItems, isActive } from '@/app/(dashboard)/utils/navigation';
import { NAV_ICONS } from '@/app/(dashboard)/utils/navIcons';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
  const params = useParams<{ domain: string }>();
  const pathName = usePathname();
  const items = createNavItems(params.domain);

  return (
    <footer className='fixed bottom-0 left-0 z-50 w-screen border-t bg-white py-3 sm:hidden'>
      <ul role='list' className='flex items-center justify-around'>
        {items.map((item) => {
          const Icon = NAV_ICONS[item.key];

          return (
            <li key={item.key} className='relative'>
              <Link
                href={item.href}
                className={cn(
                  'group flex aspect-square w-[40px] flex-col items-center justify-center gap-1 text-black',
                  { 'text-indigo-600': isActive(pathName, item.href) },
                )}
              >
                <div className='transition-all duration-300'>
                  <Icon className='size-5 stroke-2' />
                </div>

                <span className='text-[10px]'>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

'use client';

import { createNavItems, isActive } from '@/app/(dashboard)/utils/navigation';
import { NAV_ICONS } from '@/app/(dashboard)/utils/navIcons';
import { cn } from '@/lib/utils/cn';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export const SideNav = () => {
  const params = useParams<{ domain: string }>();
  const pathname = usePathname();
  const items = createNavItems(params.domain);

  return (
    <aside
      className='hidden h-screen sm:sticky sm:top-0 sm:z-50 sm:flex sm:flex-col'
      aria-label='Main navigation sidebar'
    >
      <div className='flex w-20 grow flex-col overflow-x-visible border-r border-gray-200 bg-white/5'>
        <section className='flex-1 flex flex-col'>
          <div className='flex justify-center p-3'>
            {/* TODO: replace with logo SVG */}
            <div className='flex h-[56px] w-[55px] items-center justify-center text-[30px]'>
              ff
            </div>
          </div>

          <nav className='flex-1'>
            <ul role='list' className='flex flex-col items-center justify-center'>
              {items.map((item) => {
                const Icon = NAV_ICONS[item.key];

                return (
                  <li
                    key={item.key}
                    className='flex w-full flex-col items-center justify-center'
                  >
                    <Link
                      className={cn(
                        'group relative flex w-full flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]',
                        { 'bg-indigo-50': isActive(pathname, item.href) },
                      )}
                      aria-label={item.label}
                      href={item.href}
                    >
                      <div
                        className={cn(
                          'flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600',
                          { 'font-medium text-indigo-600': isActive(pathname, item.href) },
                        )}
                      >
                        <div className='p-2'>
                          <Icon className='size-5 stroke-2' />
                        </div>

                        <span className='text-[10px]'>{item.label}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section aria-label='User actions'>
            <ul role='list' className='flex w-full flex-col items-center'>
              <li className='flex w-full flex-col items-center justify-center'>
                <SignedOut>
                  <SignInButton mode='modal'>
                    <button className='group relative flex w-full cursor-pointer flex-col items-center justify-center px-3 py-[11px] hover:bg-[#F5F7FF]'>
                      <div className='flex h-fit w-fit flex-col items-center justify-center text-black group-hover:text-indigo-600'>
                        <div className='p-2'>
                          <ArrowRightEndOnRectangleIcon className='size-6' />
                        </div>

                        <span className='text-[10px]'>Sign in</span>
                      </div>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className='flex w-full flex-col items-center justify-center px-3 py-[11px]'>
                    <UserButton />
                  </div>
                </SignedIn>
              </li>
            </ul>
          </section>
        </section>
      </div>
    </aside>
  );
};

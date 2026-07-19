import type { ReactNode } from 'react';

export const ProfileGrid = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className='grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5'>
    {children}
  </div>
);

import type { ReactElement } from 'react';
import { ProfileCard } from './ProfileCard';

export const ProfileGrid = ({
  children,
}: {
  // only an array of ProfileCard elements
  children: ReactElement<typeof ProfileCard>[];
}) => (
  <div className='grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5'>
    {children}
  </div>
);

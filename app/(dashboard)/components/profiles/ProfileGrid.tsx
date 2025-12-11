import { ReactElement } from 'react';
import { ProfileCard } from './ProfileCard';

export const ProfileGrid = ({
  children,
}: {
  // only an array of ProfileCard elements
  children: ReactElement<typeof ProfileCard>[];
}) => (
  <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
    {children}
  </div>
);

import { ReactElement } from 'react';
import { CandidateCard } from './CandidateCard';

export const CandidateGrid = ({
  children,
}: {
  // only an array of CandidateCard elements
  children: ReactElement<typeof CandidateCard>[];
}) => (
  <div className='grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
    {children}
  </div>
);

import { Badge } from '@/components/ui/badge';
import { CandidateStatus } from '@/lib/data/candidates/candidateTypes';
import type { ReactElement } from 'react';

export const CandidateStatusBadge = ({ status }: { status: CandidateStatus }) => {
  let StatusIndicator: ReactElement | null = null;
  let text = '';

  switch (status) {
    case CandidateStatus.ACTIVE:
      StatusIndicator = (
        <span className='h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-sm' />
      );
      text = 'Active';
      break;
    case CandidateStatus.INACTIVE:
      StatusIndicator = (
        <span className='h-2 w-2 rounded-full bg-gradient-to-br from-red-300 via-red-500 to-red-600 shadow-sm' />
      );
      // gray is 3-4-5
      text = 'Inactive';
      break;
  }

  return (
    <Badge variant='outline'>
      {StatusIndicator}
      {text}
    </Badge>
  );
};

import { Badge } from '@/components/ui/badge';
import { ProfileStatus } from '@/lib/data/profiles/profileTypes';
import type { ReactElement } from 'react';

export const ProfileStatusBadge = ({ status }: { status: ProfileStatus }) => {
  let StatusIndicator: ReactElement | null = null;
  let text = '';

  switch (status) {
    case ProfileStatus.PUBLISHED:
      StatusIndicator = (
        <span className='h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-sm' />
      );
      text = 'Published';
      break;
    case ProfileStatus.ARCHIVED:
      StatusIndicator = (
        <span className='h-2 w-2 rounded-full bg-gradient-to-br from-red-300 via-red-500 to-red-600 shadow-sm' />
      );
      text = 'Archived';
      break;
    case ProfileStatus.DRAFT:
      StatusIndicator = (
        <span className='h-2 w-2 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-sm' />
      );
      text = 'Draft';
      break;
  }

  return (
    <Badge variant='outline'>
      {StatusIndicator}
      {text}
    </Badge>
  );
};

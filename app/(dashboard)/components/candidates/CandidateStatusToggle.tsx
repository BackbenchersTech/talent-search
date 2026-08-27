'use client';

import { Button } from '@/components/ui/button';
import { setCandidateStatus } from '@/lib/data/candidates/actions';
import { CandidateStatus } from '@/lib/data/candidates/candidateTypes';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface CandidateStatusToggleProps {
  candidateId: string;
  status: CandidateStatus;
}

export const CandidateStatusToggle = ({
  candidateId,
  status,
}: CandidateStatusToggleProps) => {
  const [isPending, startTransition] = useTransition();

  const nextStatus =
    status === CandidateStatus.ACTIVE
      ? CandidateStatus.INACTIVE
      : CandidateStatus.ACTIVE;

  const toggle = () => {
    startTransition(async () => {
      const result = await setCandidateStatus(candidateId, nextStatus);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        nextStatus === CandidateStatus.ACTIVE
          ? 'Candidate is now active'
          : 'Candidate is now inactive',
      );
    });
  };

  return (
    <Button
      variant='outline'
      size='sm'
      className='cursor-pointer'
      onClick={toggle}
      disabled={isPending}
    >
      {nextStatus === CandidateStatus.ACTIVE ? 'Make active' : 'Make inactive'}
    </Button>
  );
};

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteCandidate, setCandidateStatus } from '@/lib/data/candidates/actions';
import { Candidate, CandidateStatus } from '@/lib/data/candidates/candidateTypes';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface CandidateActionsMenuProps {
  candidate: Candidate;
}

export const CandidateActionsMenu = ({ candidate }: CandidateActionsMenuProps) => {
  const router = useRouter();
  const { domain } = useParams<{ domain: string }>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { id: candidateId, firstName, lastName, status } = candidate;

  const nextStatus =
    status === CandidateStatus.ACTIVE ? CandidateStatus.INACTIVE : CandidateStatus.ACTIVE;

  const run = (fn: () => Promise<{ error?: string }>, successToast: string) => {
    startTransition(async () => {
      const result = await fn();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(successToast);
    });
  };

  const handleStatus = () =>
    run(
      () => setCandidateStatus(candidateId, nextStatus),
      nextStatus === CandidateStatus.ACTIVE
        ? 'Candidate is now active'
        : 'Candidate is now inactive',
    );

  const handleDelete = () =>
    run(async () => {
      const result = await deleteCandidate(candidateId);

      if (!result.error) {
        router.replace(`/c/${domain}/candidates`);
      }

      return result;
    }, 'Candidate deleted');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='cursor-pointer shadow-none'
            disabled={isPending}
          >
            Actions
            <ChevronDownIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end'>
          <DropdownMenuItem disabled={isPending} onSelect={handleStatus}>
            {nextStatus === CandidateStatus.ACTIVE ? 'Make active' : 'Make inactive'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant='destructive'
            disabled={isPending}
            onSelect={() => setIsConfirmOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className='sm:max-w-[425px]' showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete candidate</DialogTitle>
            <DialogDescription>
              This permanently deletes {firstName} {lastName} and all of their profiles.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' className='cursor-pointer' disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant='destructive'
              className='cursor-pointer'
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting…' : 'Delete candidate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

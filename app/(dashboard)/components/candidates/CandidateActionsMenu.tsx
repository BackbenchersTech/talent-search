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
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface CandidateActionsMenuProps {
  candidate: Candidate;
  publishedProfiles: { id: string; title: string }[];
}

export const CandidateActionsMenu = ({
  candidate,
  publishedProfiles,
}: CandidateActionsMenuProps) => {
  const router = useRouter();
  const { domain } = useParams<{ domain: string }>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { id: candidateId, firstName, lastName, status } = candidate;

  const nextStatus =
    status === CandidateStatus.ACTIVE ? CandidateStatus.INACTIVE : CandidateStatus.ACTIVE;

  const run = (
    fn: () => Promise<{ error?: string }>,
    successToast: string,
    onSuccess?: () => void,
  ) => {
    startTransition(async () => {
      const result = await fn();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      onSuccess?.();
      toast.success(successToast);
    });
  };

  const handleActivate = () =>
    run(() => setCandidateStatus(candidateId, nextStatus), 'Candidate activated');

  const handleDeactivate = () =>
    run(
      () => setCandidateStatus(candidateId, nextStatus),
      publishedProfiles.length
        ? 'Candidate deactivated. Published profiles moved to draft.'
        : 'Candidate deactivated',
      () => setIsDeactivateOpen(false),
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
          <DropdownMenuItem
            disabled={isPending}
            onSelect={() =>
              nextStatus === CandidateStatus.ACTIVE
                ? handleActivate()
                : setIsDeactivateOpen(true)
            }
          >
            {nextStatus === CandidateStatus.ACTIVE ? 'Activate' : 'Deactivate'}
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

      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent className='sm:max-w-[425px]' showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Deactivate candidate</DialogTitle>
            <DialogDescription>
              Deactivating {firstName} {lastName} unpublishes any published profiles,
              moving them back to draft.
            </DialogDescription>
          </DialogHeader>

          {publishedProfiles.length > 0 && (
            <div className='flex flex-col gap-1'>
              {publishedProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/c/${domain}/candidates/${candidateId}/profiles/${profile.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline-offset-2 transition-opacity hover:underline'
                >
                  {profile.title}
                </Link>
              ))}
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' className='cursor-pointer' disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              className='cursor-pointer'
              onClick={handleDeactivate}
              disabled={isPending}
            >
              {isPending ? 'Deactivating…' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
import { deleteProfile, setProfileStatus } from '@/lib/data/profiles/actions';
import { Profile, ProfileStatus } from '@/lib/data/profiles/profileTypes';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const STATUS_TOASTS: Record<ProfileStatus, string> = {
  DRAFT: 'Profile moved to draft',
  PUBLISHED: 'Profile published',
  ARCHIVED: 'Profile archived',
};

interface StatusItem {
  label: string;
  nextStatus: ProfileStatus;
}

const statusItemsFor = (status: ProfileStatus): StatusItem[] => {
  switch (status) {
    case ProfileStatus.DRAFT:
      return [
        { label: 'Publish', nextStatus: ProfileStatus.PUBLISHED },
        { label: 'Archive', nextStatus: ProfileStatus.ARCHIVED },
      ];
    case ProfileStatus.PUBLISHED:
      return [
        { label: 'Unpublish', nextStatus: ProfileStatus.DRAFT },
        { label: 'Archive', nextStatus: ProfileStatus.ARCHIVED },
      ];
    case ProfileStatus.ARCHIVED:
      return [{ label: 'Restore to draft', nextStatus: ProfileStatus.DRAFT }];
  }
};

interface ProfileActionsMenuProps {
  profile: Profile;
}

export const ProfileActionsMenu = ({ profile }: ProfileActionsMenuProps) => {
  const router = useRouter();
  const { domain } = useParams<{ domain: string }>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const handleStatus = (nextStatus: ProfileStatus) =>
    run(() => setProfileStatus(profile.id, nextStatus), STATUS_TOASTS[nextStatus]);

  const handleDelete = () =>
    run(async () => {
      const result = await deleteProfile(profile.id);

      if (!result.error) {
        router.replace(`/c/${domain}/candidates/${profile.candidateId}`);
      }

      return result;
    }, 'Profile deleted');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='shadow-none'
            disabled={isPending}
          >
            Actions
            <ChevronDownIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='start'>
          {statusItemsFor(profile.status).map((item) => (
            <DropdownMenuItem
              key={item.label}
              disabled={isPending}
              onSelect={() => handleStatus(item.nextStatus)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}

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
            <DialogTitle>Delete profile</DialogTitle>
            <DialogDescription>
              This permanently deletes &lsquo;{profile.title}&rsquo; and its experiences.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button variant='destructive' onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting…' : 'Delete profile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

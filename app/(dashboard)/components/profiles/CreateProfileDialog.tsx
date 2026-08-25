'use client';

import { FormField, fieldId } from '@/app/(dashboard)/components/forms/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createProfile, State } from '@/lib/data/profiles/actions';
import { ReactNode } from 'react';
import { useActionState } from 'react';
import { useParams } from 'next/navigation';

interface CreateProfileDialogProps {
  /** Element that opens the dialog (button, link, etc.). */
  children: ReactNode;
}

export const CreateProfileDialog = ({ children }: CreateProfileDialogProps) => {
  const { domain, id } = useParams<{ domain: string; id: string }>();
  const initialState: State = { message: null, errors: {} };
  const createProfileBound = createProfile.bind(null, id, domain);
  const [state, formAction, isPending] = useActionState(
    createProfileBound,
    initialState,
  );

  // On success the action redirects to the new profile, which unmounts this
  // dialog — no explicit close handling needed.

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New profile</DialogTitle>
          <DialogDescription>
            Enter a title for the new job profile. Everything else can be filled
            in on the profile page.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <div className='grid gap-4'>
            <FormField
              name='title'
              label='Title'
              required
              error={state.errors?.title?.errors?.[0]}
            >
              <Input
                id={fieldId('title')}
                name='title'
                placeholder='Senior Backend Engineer'
                defaultValue={state.fields?.title ?? ''}
                disabled={isPending}
                autoFocus={true}
                aria-invalid={Boolean(state.errors?.title) || undefined}
              />
            </FormField>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' className='cursor-pointer'>
                  Cancel
                </Button>
              </DialogClose>

              <Button type='submit' className='cursor-pointer' disabled={isPending}>
                Create
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

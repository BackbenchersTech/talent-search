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
import {
  UpdateNameAndLocationState,
  updateCandidateNameAndLocation,
} from '@/lib/data/candidates/actions';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

const EDIT_LABEL = 'Edit name and location';

interface EditNameAndLocationDialogProps {
  candidate: {
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export const EditNameAndLocationDialog = ({
  candidate,
}: EditNameAndLocationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { domain, id } = useParams<{ domain: string; id: string }>();
  const initialState: UpdateNameAndLocationState = { message: null, errors: {} };
  const updateCandidate = updateCandidateNameAndLocation.bind(null, domain, id);
  const [state, formAction, isPending] = useActionState(updateCandidate, initialState);

  useEffect(() => {
    console.log('ispending', isPending, state);
  }, [isPending, state]);

  useEffect(() => {
    if (!state.timestamp) return;

    if (state.success) {
      toast.success('Candidate updated');
      setTimeout(() => setOpen(false), 0);
    }
  }, [state.timestamp, state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon-sm'
          className='cursor-pointer text-gray-400 hover:text-gray-600'
          aria-label={EDIT_LABEL}
          title={EDIT_LABEL}
        >
          <PencilIcon className='size-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit name and location</DialogTitle>
          <DialogDescription>
            Update the candidate&apos;s name and location.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <div className='grid gap-4'>
            <FormField
              name='firstName'
              label='First name'
              required
              error={state.errors?.firstName?.errors?.[0]}
            >
              <Input
                id={fieldId('firstName')}
                name='firstName'
                defaultValue={state.fields?.firstName ?? candidate.firstName}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.firstName) || undefined}
              />
            </FormField>

            <FormField
              name='lastName'
              label='Last name'
              required
              error={state.errors?.lastName?.errors?.[0]}
            >
              <Input
                id={fieldId('lastName')}
                name='lastName'
                defaultValue={state.fields?.lastName ?? candidate.lastName}
                disabled={isPending}
                aria-invalid={Boolean(state.errors?.lastName) || undefined}
              />
            </FormField>

            <FormField name='city' label='City'>
              <Input
                id={fieldId('city')}
                name='city'
                placeholder='San Francisco'
                defaultValue={state.fields?.city ?? candidate.city ?? ''}
                disabled={isPending}
              />
            </FormField>

            <FormField name='state' label='State'>
              <Input
                id={fieldId('state')}
                name='state'
                placeholder='CA'
                defaultValue={state.fields?.state ?? candidate.state ?? ''}
                disabled={isPending}
              />
            </FormField>

            <FormField name='country' label='Country'>
              <Input
                id={fieldId('country')}
                name='country'
                placeholder='USA'
                defaultValue={state.fields?.country ?? candidate.country ?? ''}
                disabled={isPending}
              />
            </FormField>

            {state.message && !state.success && (
              <p className='text-sm text-red-500'>{state.message}</p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' className='cursor-pointer'>
                  Cancel
                </Button>
              </DialogClose>

              <Button type='submit' className='cursor-pointer' disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

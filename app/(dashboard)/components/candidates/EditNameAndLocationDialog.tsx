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
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

const EDIT_LABEL = 'Edit name and location';

const INITIAL_STATE: UpdateNameAndLocationState = { message: null, errors: {} };

interface EditNameAndLocationDialogProps {
  candidate: {
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Inner form mounts fresh each time the dialog opens (Radix unmounts content
 * when closed), so form state resets between opens.
 */
const EditNameAndLocationForm = ({
  candidate,
  onSuccess,
}: {
  candidate: EditNameAndLocationDialogProps['candidate'];
  onSuccess: () => void;
}) => {
  const { domain, id } = useParams<{ domain: string; id: string }>();
  const updateCandidate = updateCandidateNameAndLocation.bind(null, domain, id);

  const handleSubmit = async (
    _prevState: UpdateNameAndLocationState,
    formData: FormData,
  ): Promise<UpdateNameAndLocationState> => {
    const result = await updateCandidate(_prevState, formData);

    if (result.success) {
      toast.success('Candidate updated');
      onSuccess();
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, INITIAL_STATE);

  return (
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
  );
};

export const EditNameAndLocationDialog = ({
  candidate,
}: EditNameAndLocationDialogProps) => {
  const [open, setOpen] = useState(false);

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

        <EditNameAndLocationForm
          candidate={candidate}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

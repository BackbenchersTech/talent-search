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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCandidate, State } from '@/lib/data/candidates/actions';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

const INITIAL_STATE: State = { message: null, errors: {} };

/**
 * Inner form mounts fresh each time the dialog opens (Radix unmounts content
 * when closed), so form state resets between opens.
 */
const CreateCandidateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const handleSubmit = async (_prevState: State, formData: FormData): Promise<State> => {
    const result = await createCandidate(_prevState, formData);

    if (result.success) {
      toast.success('Candidate created successfully!');
      onSuccess();
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, INITIAL_STATE);

  return (
    <form action={formAction}>
      <div className='grid gap-4'>
        <div className='grid gap-3'>
          <Label htmlFor='firstName'>First name</Label>
          <Input
            id='firstName'
            name='firstName'
            placeholder='Tim'
            defaultValue={state.fields?.firstName ?? ''}
            disabled={isPending}
          />

          <div id='first-name-errors' aria-live='polite' aria-atomic='true'>
            {state.errors?.firstName?.errors?.map((error) => (
              <p className='text-sm text-red-500' key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='lastName'>Last name</Label>
          <Input
            id='lastName'
            name='lastName'
            placeholder='Apple'
            defaultValue={state.fields?.lastName ?? ''}
            disabled={isPending}
          />

          <div id='last-name-errors' aria-live='polite' aria-atomic='true'>
            {state.errors?.lastName?.errors?.map((error) => (
              <p className='text-sm text-red-500' key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className='grid gap-3'>
          <Label htmlFor='email'>Email address</Label>
          <Input
            id='email'
            name='email'
            placeholder='tapple@gmail.com'
            defaultValue={state.fields?.email ?? ''}
            disabled={isPending}
          />

          <div id='email-errors' aria-live='polite' aria-atomic='true'>
            {state.errors?.email?.errors?.map((error) => (
              <p className='text-sm text-red-500' key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>

          <Button type='submit' disabled={isPending}>
            Create
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export const CreateCandidateButtonAndDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='size-4' />
          <span>Add candidate</span>
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add candidate</DialogTitle>
          <DialogDescription>
            Add a new candidate here. Click &quot;Create&quot; when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <CreateCandidateForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

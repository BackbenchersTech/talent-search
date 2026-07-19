'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createProfile, State } from '@/lib/data/profiles/actions';
import { cn } from '@/lib/utils/cn';
import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CreateProfileFormProps {
  candidateId: string;
  domain: string;
  candidateUrlId: string;
  className?: string;
}

export const CreateProfileForm = ({
  candidateId,
  domain,
  candidateUrlId,
  className,
}: CreateProfileFormProps) => {
  const router = useRouter();
  const initialState: State = { message: null, errors: {} };
  const createProfileBound = createProfile.bind(
    null,
    candidateId,
    domain,
    candidateUrlId,
  );
  const [state, formAction, isPending] = useActionState(
    createProfileBound,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      toast.success('Profile created successfully!');
      router.push(`/c/${domain}/candidates/${candidateUrlId}`);
    }
  }, [state.success, router, domain, candidateUrlId]);

  return (
    <form
      action={formAction}
      className={cn('flex max-w-xl flex-col gap-5', className)}
    >
      <div className='grid gap-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          name='title'
          placeholder='Senior Backend Engineer'
          defaultValue={state.fields?.title ?? ''}
          disabled={isPending}
        />
        <div aria-live='polite' aria-atomic='true'>
          {state.errors?.title?.errors?.map((error) => (
            <p className='text-sm text-red-500' key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='billRateMin'>Bill rate min ($/hour)</Label>
        <Input
          id='billRateMin'
          name='billRateMin'
          type='number'
          min={0}
          placeholder='60'
          defaultValue={state.fields?.billRateMin ?? ''}
          disabled={isPending}
        />
        <div aria-live='polite' aria-atomic='true'>
          {state.errors?.billRateMin?.errors?.map((error) => (
            <p className='text-sm text-red-500' key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='billRateMax'>Bill rate max ($/hour)</Label>
        <Input
          id='billRateMax'
          name='billRateMax'
          type='number'
          min={0}
          placeholder='80'
          defaultValue={state.fields?.billRateMax ?? ''}
          disabled={isPending}
        />
        <div aria-live='polite' aria-atomic='true'>
          {state.errors?.billRateMax?.errors?.map((error) => (
            <p className='text-sm text-red-500' key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className='grid gap-2'>
        <Label htmlFor='bio'>Bio</Label>
        <Textarea
          id='bio'
          name='bio'
          rows={5}
          placeholder='A short summary of the profile...'
          defaultValue={state.fields?.bio ?? ''}
          disabled={isPending}
        />
        <div aria-live='polite' aria-atomic='true'>
          {state.errors?.bio?.errors?.map((error) => (
            <p className='text-sm text-red-500' key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button type='submit' className='cursor-pointer' disabled={isPending}>
          Create
        </Button>
        <Button asChild variant='outline' className='cursor-pointer'>
          <Link href={`/c/${domain}/candidates/${candidateUrlId}`}>Cancel</Link>
        </Button>
      </div>

      {state.message && !state.success ? (
        <p className='text-sm text-red-500'>{state.message}</p>
      ) : null}
    </form>
  );
};

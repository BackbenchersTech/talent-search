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
  ProfileDetailsFieldErrors,
  updateProfileDetails,
} from '@/lib/data/profiles/actions';
import {
  PROFILE_AVAILABILITY_LABELS,
  Profile,
  ProfileAvailability,
} from '@/lib/data/profiles/profileTypes';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useActionState, useState } from 'react';
import { toast } from 'sonner';

const EDIT_LABEL = 'Edit profile details';

const SELECT_CLASS =
  'border-input bg-background dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

const AVAILABILITY_OPTIONS = Object.entries(PROFILE_AVAILABILITY_LABELS) as [
  ProfileAvailability,
  string,
][];

const RATE_RANGE_ERROR =
  'Max rate must be greater than min rate. Leave max empty for a flat rate.';

type DetailsFormState = {
  errors?: ProfileDetailsFieldErrors;
  error?: string;
};

const INITIAL_STATE: DetailsFormState = {};

type DetailsDraft = {
  title: string;
  availability: ProfileAvailability;
  billRateMin: string;
  billRateMax: string;
};

const toDraft = (profile: Profile): DetailsDraft => ({
  title: profile.title,
  availability: profile.availability ?? ProfileAvailability.AVAILABLE_NOW,
  billRateMin: profile.billRateMin?.toString() ?? '',
  billRateMax: profile.billRateMax?.toString() ?? '',
});

/**
 * Inner form mounts fresh each time the dialog opens (Radix unmounts content
 * when closed), so form state resets between opens. Fields are controlled so
 * user input survives failed submits — React auto-resets uncontrolled inputs
 * to their defaultValue after a form action, which would revert the fields to
 * the stored profile values while the error from the submitted values shows.
 */
const EditProfileDetailsForm = ({
  profile,
  onSuccess,
}: {
  profile: Profile;
  onSuccess: () => void;
}) => {
  const [draft, setDraft] = useState<DetailsDraft>(() => toDraft(profile));

  const handleSubmit = async (
    _prevState: DetailsFormState,
    formData: FormData,
  ): Promise<DetailsFormState> => {
    try {
      const result = await updateProfileDetails(profile.id, {
        title: String(formData.get('title') ?? ''),
        availability: formData.get('availability') as ProfileAvailability,
        billRateMin: formData.get('billRateMin')
          ? Number(formData.get('billRateMin'))
          : null,
        billRateMax: formData.get('billRateMax')
          ? Number(formData.get('billRateMax'))
          : null,
      });

      if (result.errors || result.error) {
        return result;
      }
    } catch {
      return { error: 'Something went wrong. Please try again.' };
    }

    toast.success('Profile details updated');
    onSuccess();

    return {};
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, INITIAL_STATE);

  const minRate = draft.billRateMin ? Number(draft.billRateMin) : undefined;
  const maxRate = draft.billRateMax ? Number(draft.billRateMax) : undefined;

  // Live cross-field check: rates are a related pair, so the error belongs to
  // the group, not to whichever field happens to trip the check.
  const rateRangeError =
    minRate != null && maxRate != null && maxRate <= minRate ? RATE_RANGE_ERROR : null;
  const rateError =
    rateRangeError ?? state.errors?.billRateMin ?? state.errors?.billRateMax;

  return (
    <form action={formAction}>
      <div className='grid gap-4'>
        <FormField
          name='profile-title'
          label='Title'
          required
          error={state.errors?.title}
        >
          <Input
            id={fieldId('profile-title')}
            name='title'
            autoFocus={true}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder='Senior Backend Engineer'
            disabled={isPending}
            aria-invalid={Boolean(state.errors?.title) || undefined}
          />
        </FormField>

        <FormField
          name='profile-availability'
          label='Availability'
          required
          error={state.errors?.availability}
        >
          <select
            id={fieldId('profile-availability')}
            name='availability'
            value={draft.availability}
            onChange={(e) =>
              setDraft({ ...draft, availability: e.target.value as ProfileAvailability })
            }
            disabled={isPending}
            className={SELECT_CLASS}
          >
            {AVAILABILITY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <fieldset className='grid gap-2'>
          <legend className='text-sm font-medium'>Hourly rate</legend>
          <p className='mb-2 text-xs text-gray-500'>
            Enter a flat rate, or a range. Shows as &quot;$80&quot; or
            &quot;$80&ndash;$120&quot;.
          </p>

          <div className='grid grid-cols-2 gap-4'>
            <Input
              id={fieldId('profile-bill-rate-min')}
              name='billRateMin'
              type='number'
              min={1}
              value={draft.billRateMin}
              onChange={(e) => setDraft({ ...draft, billRateMin: e.target.value })}
              placeholder='Min (e.g. 80)'
              aria-label='Minimum hourly rate'
              disabled={isPending}
              aria-invalid={
                Boolean(state.errors?.billRateMin) || Boolean(rateRangeError) || undefined
              }
            />

            <Input
              id={fieldId('profile-bill-rate-max')}
              name='billRateMax'
              type='number'
              min={1}
              value={draft.billRateMax}
              onChange={(e) => setDraft({ ...draft, billRateMax: e.target.value })}
              placeholder='Max — optional'
              aria-label='Maximum hourly rate'
              disabled={isPending}
              aria-invalid={
                Boolean(state.errors?.billRateMax) || Boolean(rateRangeError) || undefined
              }
            />
          </div>

          {rateError && <p className='text-sm text-red-500'>{rateError}</p>}
        </fieldset>

        {state.error && <p className='text-sm text-red-500'>{state.error}</p>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' className='cursor-pointer' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type='submit'
            className='cursor-pointer'
            disabled={isPending || Boolean(rateRangeError)}
          >
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};

export const EditProfileDetailsDialog = ({ profile }: { profile: Profile }) => {
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
          <DialogTitle>Edit profile details</DialogTitle>
          <DialogDescription>
            Update the profile title, availability, and bill rate.
          </DialogDescription>
        </DialogHeader>

        <EditProfileDetailsForm profile={profile} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

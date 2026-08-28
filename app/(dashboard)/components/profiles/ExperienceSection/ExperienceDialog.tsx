'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, fieldId } from '@/app/(dashboard)/components/forms/FormField';
import { MONTH_OPTIONS, YEAR_OPTIONS } from '@/lib/constants/dates';
import {
  ExperienceFieldErrors,
  ExperienceInput,
  addProfileExperience,
  updateProfileExperience,
} from '@/lib/data/profiles/actions';
import {
  LOCATION_TYPE_LABELS,
  LocationType,
  Experience,
} from '@/lib/data/experiences/experienceTypes';
import {
  ExperienceDraft,
  createEditDraft,
} from '@/app/(dashboard)/utils/experienceFormat';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export const SELECT_CLASS =
  'border-input bg-background dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

const LOCATION_TYPE_OPTIONS = Object.entries(LOCATION_TYPE_LABELS) as [
  LocationType,
  string,
][];

interface MonthYearSelectProps {
  label: string;
  name: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
  required?: boolean;
  /** Hides the field while keeping its grid slot (no layout shift). */
  hidden?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

const MonthYearSelect = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  hidden = false,
  invalid = false,
  disabled = false,
}: MonthYearSelectProps) => (
  <FormField
    name={name}
    label={label}
    required={required}
    className='content-start'
    style={hidden ? { visibility: 'hidden' } : undefined}
  >
    <select
      id={fieldId(name)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={SELECT_CLASS}
      aria-invalid={invalid || undefined}
    >
      <option value=''></option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </FormField>
);

const emptyDraft: ExperienceDraft = {
  title: '',
  company: '',
  startDate: '',
  endDate: undefined,
  isCurrent: false,
  description: undefined,
  locationText: undefined,
  locationType: undefined,
  startMonth: '',
  startYear: '',
  endMonth: '',
  endYear: '',
};

interface ExperienceDialogProps {
  profileId: string;
  experience?: Experience;
  onClose: () => void;
}

export const ExperienceDialog = ({
  profileId,
  experience,
  onClose,
}: ExperienceDialogProps) => {
  const isEditing = experience != null;
  const [draft, setDraft] = useState<ExperienceDraft>(
    experience ? createEditDraft(experience) : emptyDraft,
  );
  const [errors, setErrors] = useState<ExperienceFieldErrors | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  const save = () => {
    setErrors(null);
    setError(null);

    const input: ExperienceInput = {
      ...draft,
      startDate:
        draft.startYear && draft.startMonth
          ? `${draft.startYear}-${draft.startMonth}-01`
          : '',
      endDate:
        !draft.isCurrent && draft.endYear && draft.endMonth
          ? `${draft.endYear}-${draft.endMonth}-01`
          : undefined,
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateProfileExperience(profileId, experience.id, input)
        : await addProfileExperience(profileId, input);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      onClose();
      toast.success(isEditing ? 'Experience updated' : 'Experience added');
    });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className='sm:max-w-[560px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit experience' : 'Add experience'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the experience details below.'
              : 'Add a role, company, and duration.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <div className='grid gap-4'>
            <FormField
              name='experience-title'
              label='Title'
              required
              error={errors?.title}
            >
              <Input
                id={fieldId('experience-title')}
                autoFocus={true}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder='Senior Software Engineer'
                disabled={isSaving}
                aria-invalid={Boolean(errors?.title) || undefined}
              />
            </FormField>

            <FormField
              name='experience-company'
              label='Company'
              required
              error={errors?.company}
            >
              <Input
                id={fieldId('experience-company')}
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                placeholder='Acme Corp'
                disabled={isSaving}
                aria-invalid={Boolean(errors?.company) || undefined}
              />
            </FormField>

            <div className='grid grid-cols-2 gap-2'>
              <FormField
                name='experience-location'
                label='Location'
                error={errors?.locationText}
              >
                <Input
                  id={fieldId('experience-location')}
                  value={draft.locationText ?? ''}
                  onChange={(e) =>
                    setDraft({ ...draft, locationText: e.target.value || undefined })
                  }
                  placeholder='Seattle, WA'
                  disabled={isSaving}
                  aria-invalid={Boolean(errors?.locationText) || undefined}
                />
              </FormField>

              <FormField name='experience-location-type' label='Location type'>
                <select
                  id={fieldId('experience-location-type')}
                  value={draft.locationType ?? ''}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      locationType: (e.target.value || undefined) as
                        | LocationType
                        | undefined,
                    })
                  }
                  disabled={isSaving}
                  className={SELECT_CLASS}
                >
                  <option value=''></option>
                  {LOCATION_TYPE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className='grid grid-cols-4 gap-2'>
              <MonthYearSelect
                label='Start month'
                name='experience-start-month'
                required={true}
                value={draft.startMonth}
                onChange={(startMonth) => setDraft({ ...draft, startMonth })}
                options={MONTH_OPTIONS}
                disabled={isSaving}
                invalid={Boolean(errors?.startDate)}
              />

              <MonthYearSelect
                label='Start year'
                name='experience-start-year'
                required={true}
                value={draft.startYear}
                onChange={(startYear) => setDraft({ ...draft, startYear })}
                options={YEAR_OPTIONS.map((year) => [year, year] as const)}
                disabled={isSaving}
                invalid={Boolean(errors?.startDate)}
              />

              <MonthYearSelect
                label='End month'
                name='experience-end-month'
                required={true}
                hidden={draft.isCurrent}
                value={draft.endMonth}
                onChange={(endMonth) => setDraft({ ...draft, endMonth })}
                options={MONTH_OPTIONS}
                disabled={isSaving}
              />

              <MonthYearSelect
                label='End year'
                name='experience-end-year'
                required={true}
                hidden={draft.isCurrent}
                value={draft.endYear}
                onChange={(endYear) => setDraft({ ...draft, endYear })}
                options={YEAR_OPTIONS.map((year) => [year, year] as const)}
                disabled={isSaving}
              />
            </div>

            {errors?.startDate && (
              <p className='-mt-2 text-sm text-red-500'>{errors.startDate}</p>
            )}
            {errors?.endDate && (
              <p className='-mt-2 text-sm text-red-500'>{errors.endDate}</p>
            )}

            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={draft.isCurrent}
                onChange={(e) => setDraft({ ...draft, isCurrent: e.target.checked })}
                disabled={isSaving}
                className='size-4 cursor-pointer accent-gray-900'
              />
              I currently work here
            </label>

            <FormField
              name='experience-description'
              label='Description'
              error={errors?.description}
            >
              <Textarea
                id={fieldId('experience-description')}
                value={draft.description ?? ''}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value || undefined })
                }
                placeholder='What did you work on?'
                disabled={isSaving}
                aria-invalid={Boolean(errors?.description) || undefined}
              />
            </FormField>

            {error && <p className='text-sm text-red-500'>{error}</p>}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type='submit' disabled={isSaving}>
                {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

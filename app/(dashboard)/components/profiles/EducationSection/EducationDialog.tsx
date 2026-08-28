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
import { FormField, fieldId } from '@/app/(dashboard)/components/forms/FormField';
import {
  addProfileEducation,
  EducationFieldErrors,
  EducationInput,
  updateProfileEducation,
} from '@/lib/data/profiles/actions';
import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const DEGREE_OPTIONS = Object.entries(DEGREE_LABELS) as [Education['degree'], string][];

const SELECT_CLASS =
  'border-input bg-background dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

const emptyDraft: EducationInput = {
  school: '',
  degree: 'BACHELORS',
  fieldOfStudy: '',
};

interface EducationDialogProps {
  profileId: string;
  education?: Education;
  onClose: () => void;
}

export const EducationDialog = ({
  profileId,
  education,
  onClose,
}: EducationDialogProps) => {
  const isEditing = education != null;
  const [draft, setDraft] = useState<EducationInput>(
    education
      ? {
          school: education.school ?? '',
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy ?? '',
        }
      : emptyDraft,
  );
  const [errors, setErrors] = useState<EducationFieldErrors | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  const save = () => {
    setErrors(null);
    setError(null);

    startTransition(async () => {
      const result = isEditing
        ? await updateProfileEducation(profileId, education.id, draft)
        : await addProfileEducation(profileId, draft);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      onClose();
      toast.success(isEditing ? 'Education updated' : 'Education added');
    });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit education' : 'Add education'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the education details below.'
              : 'Add a school, degree, and field of study.'}
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
              name='education-school'
              label='School'
              required
              error={errors?.school}
            >
              <Input
                id={fieldId('education-school')}
                autoFocus={true}
                value={draft.school}
                onChange={(e) => setDraft({ ...draft, school: e.target.value })}
                placeholder='University of Washington'
                disabled={isSaving}
                aria-invalid={Boolean(errors?.school) || undefined}
              />
            </FormField>

            <FormField
              name='education-degree'
              label='Degree'
              required
              error={errors?.degree}
            >
              <select
                id={fieldId('education-degree')}
                value={draft.degree}
                onChange={(e) =>
                  setDraft({ ...draft, degree: e.target.value as Education['degree'] })
                }
                disabled={isSaving}
                className={SELECT_CLASS}
              >
                {DEGREE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              name='education-field'
              label='Field of study'
              required
              error={errors?.fieldOfStudy}
            >
              <Input
                id={fieldId('education-field')}
                value={draft.fieldOfStudy}
                onChange={(e) => setDraft({ ...draft, fieldOfStudy: e.target.value })}
                placeholder='Computer Science'
                disabled={isSaving}
                aria-invalid={Boolean(errors?.fieldOfStudy) || undefined}
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

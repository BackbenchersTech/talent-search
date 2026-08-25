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
  removeProfileEducation,
  updateProfileEducation,
} from '@/lib/data/profiles/actions';
import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface EducationSectionProps {
  profileId: string;
  education: Education[];
  editable?: boolean;
}

const ADD_EDUCATION_LABEL = 'Add education';
const EDIT_EDUCATION_LABEL = 'Edit education';
const REMOVE_EDUCATION_LABEL = 'Remove education';

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

const EducationDialog = ({ profileId, education, onClose }: EducationDialogProps) => {
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
                className='cursor-pointer'
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button type='submit' className='cursor-pointer' disabled={isSaving}>
                {isSaving ? 'Saving…' : isEditing ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface RemoveEducationDialogProps {
  profileId: string;
  education: Education;
  onClose: () => void;
}

const RemoveEducationDialog = ({
  profileId,
  education,
  onClose,
}: RemoveEducationDialogProps) => {
  const [isRemoving, startTransition] = useTransition();

  const label = [education.school, DEGREE_LABELS[education.degree]]
    .filter(Boolean)
    .join(' — ');

  const remove = () => {
    startTransition(async () => {
      const result = await removeProfileEducation(profileId, education.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      onClose();
      toast.success('Education removed');
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
          <DialogTitle>Remove education</DialogTitle>
          <DialogDescription>
            This action cannot be undone, are you sure you want to remove {label} from
            this profile?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            className='cursor-pointer'
            onClick={onClose}
            disabled={isRemoving}
          >
            Cancel
          </Button>

          <Button
            variant='destructive'
            className='cursor-pointer'
            onClick={remove}
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing…' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const EducationSection = ({
  profileId,
  education = [],
  editable = false,
}: EducationSectionProps) => {
  const [dialogEducation, setDialogEducation] = useState<Education | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [removalCandidate, setRemovalCandidate] = useState<Education | null>(null);

  if (!education.length && !editable) {
    return null;
  }

  const sorted = [...education].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section className='mb-4'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='font-semibold text-black'>Education</h3>

        {editable && (
          <Button
            variant='ghost'
            size='icon-sm'
            className='cursor-pointer text-gray-400 hover:text-gray-600'
            onClick={() => setIsAddDialogOpen(true)}
            aria-label={ADD_EDUCATION_LABEL}
            title={ADD_EDUCATION_LABEL}
          >
            <PlusIcon className='size-4' />
          </Button>
        )}
      </div>

      {sorted.length > 0 ? (
        <ul className='mt-2'>
          {sorted.map((edu) => {
            const credential = [DEGREE_LABELS[edu.degree], edu.fieldOfStudy]
              .filter(Boolean)
              .join(' · ');

            return (
              <li
                key={edu.id}
                className='group mb-3 flex items-start justify-between gap-2'
              >
                <div>
                  <p className='font-medium text-black'>{edu.school || credential}</p>
                  {edu.school && <p className='text-sm text-gray-600'>{credential}</p>}
                </div>

                {editable && (
                  <div className='flex shrink-0 gap-1'>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      className='cursor-pointer text-gray-400 hover:text-gray-600'
                      onClick={() => setDialogEducation(edu)}
                      aria-label={EDIT_EDUCATION_LABEL}
                      title={EDIT_EDUCATION_LABEL}
                    >
                      <PencilSquareIcon className='size-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon-sm'
                      className='cursor-pointer text-gray-400 hover:text-gray-600'
                      onClick={() => setRemovalCandidate(edu)}
                      aria-label={REMOVE_EDUCATION_LABEL}
                      title={REMOVE_EDUCATION_LABEL}
                    >
                      <TrashIcon className='size-4' />
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className='text-center'>
          <Button
            variant='link'
            size='sm'
            className='h-auto cursor-pointer p-0 text-sm text-gray-500 italic underline hover:text-gray-700'
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add education
          </Button>
        </p>
      )}

      {isAddDialogOpen && (
        <EducationDialog
          profileId={profileId}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}

      {dialogEducation && (
        <EducationDialog
          profileId={profileId}
          education={dialogEducation}
          onClose={() => setDialogEducation(null)}
        />
      )}

      {removalCandidate && (
        <RemoveEducationDialog
          profileId={profileId}
          education={removalCandidate}
          onClose={() => setRemovalCandidate(null)}
        />
      )}
    </section>
  );
};

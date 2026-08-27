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
import { removeProfileEducation } from '@/lib/data/profiles/actions';
import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { EducationDialog } from './EducationDialog';

interface EducationSectionProps {
  profileId: string;
  education: Education[];
  editable?: boolean;
}

const ADD_EDUCATION_LABEL = 'Add education';
const EDIT_EDUCATION_LABEL = 'Edit education';
const REMOVE_EDUCATION_LABEL = 'Remove education';

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

      {education.length > 0 ? (
        <ul className='mt-2'>
          {education.map((edu) => {
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

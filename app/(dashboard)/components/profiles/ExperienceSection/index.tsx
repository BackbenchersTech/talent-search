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
import { removeProfileExperience } from '@/lib/data/profiles/actions';
import { LOCATION_TYPE_LABELS, Experience } from '@/lib/data/experiences/experienceTypes';
import { formatDateRange, formatTenure } from '@/app/(dashboard)/utils/experienceFormat';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { ExperienceDialog } from './ExperienceDialog';

interface ExperienceSectionProps {
  profileId: string;
  experiences: Experience[];
  editable?: boolean;
}

const ADD_EXPERIENCE_LABEL = 'Add experience';
const EDIT_EXPERIENCE_LABEL = 'Edit experience';
const REMOVE_EXPERIENCE_LABEL = 'Remove experience';

interface RemoveExperienceDialogProps {
  profileId: string;
  experience: Experience;
  onClose: () => void;
}

const RemoveExperienceDialog = ({
  profileId,
  experience,
  onClose,
}: RemoveExperienceDialogProps) => {
  const [isRemoving, startTransition] = useTransition();

  const label = [experience.title, experience.company].filter(Boolean).join(' — ');

  const remove = () => {
    startTransition(async () => {
      const result = await removeProfileExperience(profileId, experience.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      onClose();
      toast.success('Experience removed');
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
          <DialogTitle>Remove experience</DialogTitle>
          <DialogDescription>
            This action cannot be undone, are you sure you want to remove {label} from
            this profile?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isRemoving}>
            Cancel
          </Button>

          <Button variant='destructive' onClick={remove} disabled={isRemoving}>
            {isRemoving ? 'Removing…' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ExperienceSection = ({
  profileId,
  experiences = [],
  editable = false,
}: ExperienceSectionProps) => {
  const [dialogExperience, setDialogExperience] = useState<Experience | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [removalCandidate, setRemovalCandidate] = useState<Experience | null>(null);

  if (!experiences.length && !editable) {
    return null;
  }

  return (
    <section className='mb-4'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='font-semibold text-black'>Experience</h3>

        {editable && (
          <Button
            variant='ghost'
            size='icon-sm'
            className='text-gray-400 hover:text-gray-600'
            onClick={() => setIsAddDialogOpen(true)}
            aria-label={ADD_EXPERIENCE_LABEL}
            title={ADD_EXPERIENCE_LABEL}
          >
            <PlusIcon className='size-4' />
          </Button>
        )}
      </div>

      {experiences.length > 0 ? (
        <ul className='mt-2'>
          {experiences.map((experience) => {
            const dateRange = formatDateRange(experience);
            const tenure = formatTenure(experience);
            const dates = dateRange && tenure ? `${dateRange} · ${tenure}` : dateRange;
            const location = [
              experience.locationText,
              experience.locationType
                ? LOCATION_TYPE_LABELS[experience.locationType]
                : null,
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <li
                key={experience.id}
                className='group mb-3 flex items-start justify-between gap-2'
              >
                <div>
                  <p className='font-medium text-black'>{experience.title}</p>
                  <p className='text-sm text-black'>{experience.company}</p>
                  {dates && <p className='text-sm text-gray-600'>{dates}</p>}
                  {location && <p className='text-sm text-gray-600'>{location}</p>}
                  {experience.description && (
                    <p className='text-sm whitespace-pre-line text-black'>
                      {experience.description}
                    </p>
                  )}
                </div>

                {editable && (
                  <div className='flex shrink-0 gap-1'>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      className='text-gray-400 hover:text-gray-600'
                      onClick={() => setDialogExperience(experience)}
                      aria-label={EDIT_EXPERIENCE_LABEL}
                      title={EDIT_EXPERIENCE_LABEL}
                    >
                      <PencilSquareIcon className='size-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon-sm'
                      className='text-gray-400 hover:text-gray-600'
                      onClick={() => setRemovalCandidate(experience)}
                      aria-label={REMOVE_EXPERIENCE_LABEL}
                      title={REMOVE_EXPERIENCE_LABEL}
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
            className='h-auto p-0 text-sm text-gray-500 italic underline hover:text-gray-700'
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add experience
          </Button>
        </p>
      )}

      {isAddDialogOpen && (
        <ExperienceDialog
          profileId={profileId}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}

      {dialogExperience && (
        <ExperienceDialog
          profileId={profileId}
          experience={dialogExperience}
          onClose={() => setDialogExperience(null)}
        />
      )}

      {removalCandidate && (
        <RemoveExperienceDialog
          profileId={profileId}
          experience={removalCandidate}
          onClose={() => setRemovalCandidate(null)}
        />
      )}
    </section>
  );
};

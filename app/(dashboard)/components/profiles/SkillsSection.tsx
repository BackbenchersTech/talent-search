'use client';

import { Badge } from '@/components/ui/badge';
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
import { addProfileSkills, removeProfileSkill } from '@/lib/data/profiles/actions';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface SkillsSectionProps {
  profileId: string;
  skills?: string[];
  editable?: boolean;
}

const REMOVE_SKILL_LABEL = 'Remove skill';
const ADD_SKILLS_LABEL = 'Add skills';

interface AddSkillsDialogProps {
  profileId: string;
  onClose: () => void;
}

const AddSkillsDialog = ({ profileId, onClose }: AddSkillsDialogProps) => {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  const add = () => {
    setError(null);

    startTransition(async () => {
      const result = await addProfileSkills(profileId, draft);

      if (result.error) {
        setError(result.error);
        return;
      }

      onClose();
      toast.success('Skills added');
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
          <DialogTitle>Add skills</DialogTitle>
          <DialogDescription>
            Enter one or more skills, separated by commas.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <div className='grid gap-2'>
            <Input
              autoFocus={true}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder='React, TypeScript, GraphQL'
              disabled={isSaving}
              aria-label='Skills'
            />

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
                {isSaving ? 'Adding…' : 'Add'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const SkillsSection = ({
  profileId,
  skills = [],
  editable = false,
}: SkillsSectionProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, startTransition] = useTransition();

  if (!skills.length && !editable) {
    return null;
  }

  const remove = (skill: string) => {
    startTransition(async () => {
      const result = await removeProfileSkill(profileId, skill);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Skill removed');
    });
  };

  return (
    <section className='mb-4'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='font-semibold text-black'>Skills</h3>

        {editable && (
          <Button
            variant='ghost'
            size='icon-sm'
            className='cursor-pointer text-gray-400 hover:text-gray-600'
            onClick={() => setIsAddDialogOpen(true)}
            aria-label={ADD_SKILLS_LABEL}
            title={ADD_SKILLS_LABEL}
          >
            <PlusIcon className='size-4' />
          </Button>
        )}
      </div>

      <p className='flex flex-wrap items-center gap-1.5 text-gray-600'>
        {skills.map((skill) => (
          <Badge key={skill} className='bg-gray-200 text-black'>
            {skill}

            {editable && (
              <Button
                variant='ghost'
                size='icon-sm'
                className='-mr-1 size-4 cursor-pointer rounded-full text-gray-500 hover:bg-gray-300 hover:text-black'
                onClick={() => remove(skill)}
                disabled={isSaving}
                aria-label={`${REMOVE_SKILL_LABEL}: ${skill}`}
                title={`${REMOVE_SKILL_LABEL}: ${skill}`}
              >
                <XMarkIcon className='size-3' />
              </Button>
            )}
          </Badge>
        ))}

        {editable && (
          <Button
            variant='outline'
            size='sm'
            className='h-auto cursor-pointer gap-1 rounded-full px-2 py-0.5 text-xs shadow-none'
            onClick={() => setIsAddDialogOpen(true)}
            disabled={isSaving}
          >
            <PlusIcon className='size-3' />
            Add skill
          </Button>
        )}
      </p>

      {isAddDialogOpen && (
        <AddSkillsDialog
          profileId={profileId}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}
    </section>
  );
};

'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateProfileSummary } from '@/lib/data/profiles/actions';
import { MAX_BIO_LENGTH } from '@/lib/data/profiles/profileTypes';
import { cn } from '@/lib/utils/cn';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface SummarySectionProps {
  profileId: string;
  bio?: string;
  editable?: boolean;
}

const SUMMARY_EDITOR_LABEL = 'Edit summary';

export const SummarySection = ({
  profileId,
  bio,
  editable = false,
}: SummarySectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  if (!bio && !editable) {
    return null;
  }

  const startEditing = () => {
    setDraft(bio ?? '');
    setIsEditing(true);
  };

  const cancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const save = () => {
    setError(null);

    startTransition(async () => {
      const result = await updateProfileSummary(profileId, draft);

      if (result.error) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      toast.success('Summary updated');
    });
  };

  const count = draft.length;
  const nearLimit = count > MAX_BIO_LENGTH * 0.9;
  const overLimit = count > MAX_BIO_LENGTH;

  return (
    <section className='mb-4'>
      <div className='flex items-center justify-between gap-2'>
        <h3 className='font-semibold text-black'>Summary</h3>

        {editable && !isEditing && (
          <Button
            variant='ghost'
            size='icon-sm'
            className='cursor-pointer text-gray-400 hover:text-gray-600'
            onClick={startEditing}
            aria-label={SUMMARY_EDITOR_LABEL}
            title={SUMMARY_EDITOR_LABEL}
          >
            <PencilSquareIcon className='size-4' />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div>
          <Textarea
            autoFocus={true}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                cancel();
              }

              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                save();
              }
            }}
            rows={5}
            disabled={isSaving}
            aria-label='Summary'
          />

          <div className='mt-2 flex items-center justify-end gap-2'>
            {error ? (
              <p className='mr-auto text-sm text-red-500'>{error}</p>
            ) : (
              <span
                className={cn(
                  'mr-auto text-sm text-gray-400 tabular-nums',
                  nearLimit && !overLimit && 'text-amber-600',
                  overLimit && 'font-medium text-red-500',
                )}
              >
                {count}/{MAX_BIO_LENGTH}
              </span>
            )}

            <Button
              variant='outline'
              size='sm'
              className='cursor-pointer'
              onClick={cancel}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              size='sm'
              className='cursor-pointer'
              onClick={save}
              disabled={isSaving || overLimit}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      ) : bio ? (
        <p className='text-gray-600'>{bio}</p>
      ) : (
        <p className='text-center text-sm italic text-gray-400'>
          No summary yet — add one now.
        </p>
      )}
    </section>
  );
};

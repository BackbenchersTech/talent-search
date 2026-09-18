'use client';

import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/app/(dashboard)/components/profiles/ProfileCard';
import { ProfileGrid } from '@/app/(dashboard)/components/profiles/ProfileGrid';
import { loadMoreProfiles } from '@/lib/data/profiles/actions';
import { ProfileWithCandidate } from '@/lib/data/profiles/profileTypes';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';

interface ExploreProfilesProps {
  initialRows: ProfileWithCandidate[];
  initialCursor: string | null;
  total: number;
}

export const ExploreProfiles = ({
  initialRows,
  initialCursor,
  total,
}: ExploreProfilesProps) => {
  const [rows, setRows] = useState(initialRows);
  const [cursor, setCursor] = useState(initialCursor);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    setError(null);
    startTransition(async () => {
      try {
        const page = await loadMoreProfiles(cursor);

        setRows((prev) => [...prev, ...page.rows]);
        setCursor(page.nextCursor);
      } catch {
        setError('Failed to load profiles. Try again.');
      }
    });
  };

  return (
    <div className='w-full'>
      <ProfileGrid>
        {rows.map((p) => (
          <ProfileCard key={p.id} profileWithCandidate={p} href={`?profileId=${p.id}`} />
        ))}
      </ProfileGrid>

      <div className='mt-8 flex flex-col items-center gap-2'>
        {cursor ? (
          <>
            <Button variant='outline' onClick={loadMore} disabled={isPending}>
              <ArrowDownIcon className='size-4' />
              {isPending ? 'Loading…' : 'Load more'}
            </Button>

            <span className='text-muted-foreground text-sm'>
              Showing {rows.length} of {total} profiles
            </span>
          </>
        ) : (
          rows.length > 0 && (
            <span className='text-muted-foreground text-sm'>
              Showing all {total} profiles
            </span>
          )
        )}

        {error && <span className='text-destructive text-sm'>{error}</span>}
      </div>
    </div>
  );
};

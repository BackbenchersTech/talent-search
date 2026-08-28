'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CandidateStatus } from '@/lib/data/candidates/candidateTypes';
import { parseCandidateStatus } from '@/app/(dashboard)/utils/candidateTable';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

const STATUS_OPTIONS = Object.values(CandidateStatus);

const toLabel = (status: CandidateStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

interface CandidatesStatusFilterProps {
  status?: CandidateStatus;
  onStatusChange: (status: CandidateStatus | undefined) => void;
}

export const CandidatesStatusFilter = ({
  status,
  onStatusChange,
}: CandidatesStatusFilterProps) => {
  const isActive = status !== undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'outline'}
          aria-label={
            isActive
              ? `Status filter: ${toLabel(status)}, activate to clear`
              : 'Filter by status'
          }
        >
          Status
          {isActive ? (
            // span (not svg) so the click lands — Button base styles disable svg pointer events
            <span
              role='button'
              tabIndex={0}
              className='flex cursor-pointer items-center rounded-sm hover:bg-black/10'
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStatusChange(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onStatusChange(undefined);
                }
              }}
            >
              <XMarkIcon className='size-4' aria-hidden='true' />
              <span className='sr-only'>Clear status filter</span>
            </span>
          ) : (
            <ChevronDownIcon className='size-4 opacity-60' />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start'>
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={(next) =>
            onStatusChange(next === status ? undefined : parseCandidateStatus(next))
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              aria-label={`Filter by ${toLabel(option).toLowerCase()}`}
            >
              {toLabel(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

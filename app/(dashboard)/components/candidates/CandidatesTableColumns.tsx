'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CANDIDATES_SORT_COLUMN,
  CandidatesSort,
  CandidatesSortColumn,
  CandidateWithProfiles,
} from '@/lib/data/candidates/candidateTypes';
import { SORT_ORDER } from '@/lib/constants/sort';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const SortHeader = ({
  label,
  column,
  activeSort,
  onSortChange,
}: {
  label: string;
  column: CandidatesSortColumn;
  activeSort: CandidatesSort;
  onSortChange: (column: CandidatesSortColumn) => void;
}) => {
  const isActive = activeSort.column === column;
  const isDesc = activeSort.order === SORT_ORDER.DESC;

  return (
    <Button
      variant='ghost'
      size='sm'
      className='-ml-2.5 cursor-pointer gap-1 px-2 has-[>svg]:px-2'
      aria-label={
        isActive
          ? `Sort by ${label.toLowerCase()}, sorted ${isDesc ? 'descending' : 'ascending'}`
          : `Sort by ${label.toLowerCase()}`
      }
      onClick={() => onSortChange(column)}
    >
      {label}
      {!isActive ? (
        <ArrowsUpDownIcon className='size-3.5 opacity-60' />
      ) : isDesc ? (
        <ArrowDownIcon className='size-3.5 opacity-60' />
      ) : (
        <ArrowUpIcon className='size-3.5 opacity-60' />
      )}
    </Button>
  );
};

export const getCandidatesTableColumns = (
  activeSort: CandidatesSort,
  onSortChange: (column: CandidatesSortColumn) => void,
): ColumnDef<CandidateWithProfiles>[] => [
  {
    id: 'candidateName',
    header: () => (
      <SortHeader
        label='Name'
        column={CANDIDATES_SORT_COLUMN.NAME}
        activeSort={activeSort}
        onSortChange={onSortChange}
      />
    ),
    cell: ({ row }) => {
      const { firstName, lastName, city, state, country, profileImageUrl } = row.original;

      return (
        <div className='flex items-center gap-1'>
          <>
            <Avatar className='size-10'>
              <AvatarImage src={profileImageUrl} alt='' />
              <AvatarFallback className='bg-black text-white'>
                {firstName.at(0)}
                {lastName.at(0)}
              </AvatarFallback>
            </Avatar>
          </>

          <div className='flex flex-col'>
            <span className='font-medium'>
              {firstName} {lastName}
            </span>

            <span className='text-sm text-gray-600'>
              {city ? `${city}` : ''}
              {state ? `, ${state}` : ''}
              {country && country !== 'USA' ? `, ${country}` : ''}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'profiles',
    header: 'Profiles',
    cell: ({ row }) => {
      const { id: candidateId, profiles } = row.original;
      const [firstProfile, ...rest] = profiles;

      if (!firstProfile) return <span className='text-gray-400'>-</span>;

      return (
        <div className='flex items-center gap-2'>
          <Link
            href={`candidates/${candidateId}/profiles/${firstProfile.id}`}
            className='underline-offset-2 transition-opacity hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {firstProfile.title}
          </Link>

          {rest.length > 0 && <Badge variant='secondary'>+{rest.length}</Badge>}
        </div>
      );
    },
  },
  { accessorKey: 'status', header: 'Status' },
  {
    id: 'createdOn',
    header: () => (
      <SortHeader
        label='Created on'
        column={CANDIDATES_SORT_COLUMN.CREATED_AT}
        activeSort={activeSort}
        onSortChange={onSortChange}
      />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return (
        <div className='flex flex-col'>
          <span>
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(createdAt)}
          </span>
          <span className='text-sm text-gray-600'>
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })
              .format(createdAt)
              .toLowerCase()}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 cursor-pointer p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <span className='sr-only'>Open menu</span>
              <EllipsisHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem>
              <Link href={`candidates/${id}`}>View details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

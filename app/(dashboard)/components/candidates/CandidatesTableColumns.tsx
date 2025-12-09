'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Candidate } from '@/lib/data/candidates/candidateTypes';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const CandidatesTableColumns: ColumnDef<Candidate>[] = [
  {
    id: 'candidateName',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName, city, state, country, profileImageUrl } = row.original;

      return (
        <div className='flex items-center gap-1'>
          <div>
            <Avatar className='size-10'>
              <AvatarImage src={profileImageUrl} alt='' />
              <AvatarFallback className='bg-black text-white'>
                {firstName.at(0)}
                {lastName.at(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className='flex flex-col'>
            <span className='font-medium'>
              {firstName} {lastName}
            </span>

            <span className='text-sm text-gray-500'>
              {city ? `${city}` : ''}
              {state ? `, ${state}` : ''}
              {country && country !== 'USA' ? `, ${country}` : ''}
            </span>
          </div>
        </div>
      );
    },
  },
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'availability', header: 'Availability' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 cursor-pointer p-0'>
              <span className='sr-only'>Open menu</span>
              <EllipsisHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <Link href={`candidates/${id}`}>View details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

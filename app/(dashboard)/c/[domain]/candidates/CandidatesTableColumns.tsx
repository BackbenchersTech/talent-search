'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Candidate } from '@/lib/data/candidates/candidateTypes';

export const CandidatesTableColumns: ColumnDef<Candidate>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
];

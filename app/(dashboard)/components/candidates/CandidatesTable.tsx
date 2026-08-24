'use client';

import { CandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { Candidate } from '@/lib/data/candidates/candidateTypes';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface CandidatesTableProps {
  candidates: Candidate[];
}

export const CandidatesTable = ({ candidates }: CandidatesTableProps) => {
  const router = useRouter();

  const handleRowClick = useCallback(
    (candidate: Candidate) => router.push(`candidates/${candidate.id}`),
    [router],
  );

  return (
    <DataTable
      data={candidates}
      columns={CandidatesTableColumns}
      onRowClick={handleRowClick}
    />
  );
};

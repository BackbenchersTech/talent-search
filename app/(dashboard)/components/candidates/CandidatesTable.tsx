'use client';

import { CandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { CandidateWithProfiles } from '@/lib/data/candidates/candidateTypes';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface CandidatesTableProps {
  candidates: CandidateWithProfiles[];
}

export const CandidatesTable = ({ candidates }: CandidatesTableProps) => {
  const router = useRouter();

  const handleRowClick = useCallback(
    (candidate: CandidateWithProfiles) => router.push(`candidates/${candidate.id}`),
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

'use client';

import { CandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { TablePagination } from '@/app/(dashboard)/components/candidates/TablePagination';
import { CandidatesPage } from '@/lib/data/candidates/candidateData';
import { CandidateWithProfiles } from '@/lib/data/candidates/candidateTypes';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface CandidatesTableProps {
  candidatesPage: CandidatesPage;
  pageSize: number;
}

export const CandidatesTable = ({ candidatesPage, pageSize }: CandidatesTableProps) => {
  const router = useRouter();

  const handleRowClick = useCallback(
    (candidate: CandidateWithProfiles) => router.push(`candidates/${candidate.id}`),
    [router],
  );

  return (
    <div className='flex flex-col gap-4'>
      <DataTable
        data={candidatesPage.rows}
        columns={CandidatesTableColumns}
        onRowClick={handleRowClick}
      />

      <TablePagination
        page={candidatesPage.page}
        pageSize={pageSize}
        total={candidatesPage.total}
        totalPages={candidatesPage.totalPages}
      />
    </div>
  );
};

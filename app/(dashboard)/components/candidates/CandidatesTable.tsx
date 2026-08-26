'use client';

import { getCandidatesTableColumns } from '@/app/(dashboard)/components/candidates/CandidatesTableColumns';
import { DataTable } from '@/app/(dashboard)/components/candidates/DataTable';
import { TablePagination } from '@/app/(dashboard)/components/candidates/TablePagination';
import { CandidatesPage } from '@/lib/data/candidates/candidateData';
import {
  CandidatesSort,
  CandidatesSortColumn,
  CandidateWithProfiles,
} from '@/lib/data/candidates/candidateTypes';
import {
  candidatesSortToParams,
  toggleCandidatesSort,
} from '@/app/(dashboard)/utils/candidateTable';
import { cn } from '@/lib/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface CandidatesTableProps {
  candidatesPage: CandidatesPage;
  pageSize: number;
  sort: CandidatesSort;
}

export const CandidatesTable = ({
  candidatesPage,
  pageSize,
  sort,
}: CandidatesTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams);
      mutate(params);
      const query = `?${params.toString()}`;
      // update the address bar immediately; Next syncs useSearchParams to it
      // (navigations themselves only commit the URL once the server data arrives)
      window.history.replaceState(null, '', query);
      startTransition(() => {
        router.replace(query);
      });
    },
    [router, searchParams],
  );

  const handleSortChange = useCallback(
    (column: CandidatesSortColumn) => {
      const next = toggleCandidatesSort(sort, column);
      updateParams((params) => {
        params.delete('page');
        candidatesSortToParams(next, params);
      });
    },
    [updateParams, sort],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateParams((params) => params.set('page', String(nextPage)));
    },
    [updateParams],
  );

  const handleRowClick = useCallback(
    (candidate: CandidateWithProfiles) => router.push(`candidates/${candidate.id}`),
    [router],
  );

  return (
    <div className='flex flex-col gap-4'>
      <div
        aria-busy={isPending}
        className={cn(
          'transition-opacity',
          isPending && 'pointer-events-none opacity-50',
        )}
      >
        <DataTable
          data={candidatesPage.rows}
          columns={getCandidatesTableColumns(sort, handleSortChange)}
          onRowClick={handleRowClick}
          isLoading={isPending}
        />
      </div>

      <TablePagination
        page={candidatesPage.page}
        pageSize={pageSize}
        total={candidatesPage.total}
        totalPages={candidatesPage.totalPages}
        onPageChange={handlePageChange}
        disabled={isPending}
      />
    </div>
  );
};

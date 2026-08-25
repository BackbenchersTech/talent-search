'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const TablePagination = ({ page, pageSize, total, totalPages }: TablePaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goTo = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(nextPage));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='text-muted-foreground text-sm'>
        Showing {start}-{end} of {total} candidates
      </span>

      {totalPages > 1 && (
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={page === 1}
            onClick={() => goTo(1)}
          >
            <span className='sr-only'>First page</span>
            <ChevronDoubleLeftIcon className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={page === 1}
            onClick={() => goTo(page - 1)}
          >
            <span className='sr-only'>Previous page</span>
            <ChevronLeftIcon className='size-4' />
          </Button>

          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === page ? 'default' : 'outline'}
              size='icon-sm'
              className='cursor-pointer'
              onClick={() => goTo(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={page === totalPages}
            onClick={() => goTo(page + 1)}
          >
            <span className='sr-only'>Next page</span>
            <ChevronRightIcon className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={page === totalPages}
            onClick={() => goTo(totalPages)}
          >
            <span className='sr-only'>Last page</span>
            <ChevronDoubleRightIcon className='size-4' />
          </Button>
        </div>
      )}
    </div>
  );
};

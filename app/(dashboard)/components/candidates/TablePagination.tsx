'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const TablePagination = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  disabled = false,
}: TablePaginationProps) => {
  const goTo = (nextPage: number) => onPageChange(nextPage);

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
            disabled={disabled || page === 1}
            onClick={() => goTo(1)}
          >
            <span className='sr-only'>First page</span>
            <ChevronDoubleLeftIcon className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={disabled || page === 1}
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
              disabled={disabled}
              onClick={() => goTo(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={disabled || page === totalPages}
            onClick={() => goTo(page + 1)}
          >
            <span className='sr-only'>Next page</span>
            <ChevronRightIcon className='size-4' />
          </Button>
          <Button
            variant='outline'
            size='icon-sm'
            className='cursor-pointer'
            disabled={disabled || page === totalPages}
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

import { cn } from '@/lib/utils/cn';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type NotFoundStateProps = {
  primaryText: string;
  secondaryText: string;
  backHref: string;
  backLabel: string;
  className?: string;
};

export const NotFoundState = ({
  primaryText,
  secondaryText,
  backHref,
  backLabel,
  className,
}: NotFoundStateProps) => {
  return (
    <div className={cn('mx-auto mt-24 max-w-md text-center', className)}>
      <h1 className='text-xl font-medium text-gray-900'>{primaryText}</h1>

      <p className='mt-2 text-sm text-gray-600'>{secondaryText}</p>

      <div className='mt-6'>
        <Link
          href={backHref}
          className='inline-flex items-center gap-1 text-sm font-medium underline-offset-2 transition-opacity hover:underline hover:opacity-50'
        >
          <ArrowLeftIcon className='size-4 stroke-2' />
          {backLabel}
        </Link>
      </div>
    </div>
  );
};

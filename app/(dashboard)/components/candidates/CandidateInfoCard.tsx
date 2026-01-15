import { cn } from '@/lib/utils/cn';
import { CurrencyDollarIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export const CandidateInfoCard = ({ className }: { className?: string }) => {
  return (
    <div className={cn('rounded-md bg-gray-100', className)}>
      <h2 className='p-3 font-medium'>Personal information</h2>

      <div className='mx-0.5 mb-1 rounded-md bg-white p-3 shadow-sm ring-1 ring-gray-100'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <h3 className='flex items-center gap-1 text-sm text-gray-600'>
              <EnvelopeIcon className='h-5 w-5 text-gray-500' />
              Email address
            </h3>

            <p className='text-sm font-medium'>liam.carter@email.com</p>
          </div>

          <div className='flex flex-col gap-1 sm:border-l sm:border-gray-200 sm:pl-4 lg:border-l lg:border-gray-200 lg:pl-4'>
            <h3 className='flex items-center gap-1 text-sm text-gray-600'>
              <PhoneIcon className='h-5 w-5 text-gray-500' />
              Phone number
            </h3>

            <p className='text-sm font-medium'>+1 (415) 763-9824</p>
          </div>

          <div className='flex flex-col gap-1 lg:border-l lg:border-gray-200 lg:pl-4'>
            <h3 className='flex items-center gap-1 text-sm text-gray-600'>
              <CurrencyDollarIcon className='h-5 w-5 text-gray-500' />
              Pay rate
            </h3>

            <p className='text-sm font-medium'>$50/hr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

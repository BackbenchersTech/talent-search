import '@/app/globals.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-8'>
      <div className='mx-auto mt-16 max-w-2xl text-center sm:mt-16'>
        <p className='text-base leading-8 font-semibold'>404</p>

        <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
          This page does not exist
        </h1>

        <p className='mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8'>
          Sorry, we couldn&lsquo;t find the page you were looking for.
        </p>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/'
            className='flex gap-1 text-sm leading-6 font-semibold text-black'
          >
            <span aria-hidden='true'>←</span>Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export const Hero = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='w-full text-center'>
      <h1 className='text-[38px] leading-[38px] font-medium'>{title}</h1>

      <p className='max-w-[400px] mx-auto mt-[1.5rem] text-gray-800'>
        {description}
      </p>

      <div className='mt-6 w-full flex flex-row items-center justify-center gap-4 text-[15px]'>
        <Link
          href='/explore'
          className='rounded-full bg-gray-100 px-4 py-[9.5px] text-sm'
        >
          Search
        </Link>
      </div>
    </div>
  );
};

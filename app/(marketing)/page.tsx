import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <main className='mx-auto w-full max-w-[1600px] px-6 md:px-8 lg:px-14'>
      <Hero
        title='Find your next expert'
        description='Find top-tier talent for your teams.'
      />
    </main>
  );
}

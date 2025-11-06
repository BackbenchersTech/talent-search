import { Search } from '@/app/components/Search';

const ExplorePage = () => {
  return (
    <main>
      <h1 className='text-2xl font-semibold'>Explore candidates</h1>

      <div className='mt-5'>
        <Search />
      </div>
    </main>
  );
};

export default ExplorePage;

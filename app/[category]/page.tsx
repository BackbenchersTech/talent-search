import { notFound } from 'next/navigation';
import { Hero } from '../ui/layout/Hero';

const CATEGORIES: Record<
  string,
  {
    heroTitle: string;
    heroDescription: string;
  }
> = {
  'salesforce-experts': {
    heroTitle: 'Find top Salesforce experts',
    heroDescription:
      'Connect with certified Salesforce professionals to elevate your CRM strategies.',
  },
  'mulesoft-experts': {
    heroTitle: 'Discover MuleSoft experts',
    heroDescription:
      'Hire skilled MuleSoft developers to streamline your integration solutions.',
  },
};

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await props.params;

  const categoryData = CATEGORIES[category];

  if (!categoryData) {
    notFound();
  }

  const { heroTitle, heroDescription } = categoryData;

  return (
    <main className='w-full max-w-[1600px] mx-auto px-6 md:px-8 lg:px-14'>
      <Hero title={heroTitle} description={heroDescription} />
    </main>
  );
}

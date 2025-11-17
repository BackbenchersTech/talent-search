import { AppTopNavigation } from '@/app/components/AppTopNavigation';
import { HtmlShell } from '@/app/components/HtmlShell';
import { MarketingFooter } from '@/app/components/MarketingFooter';
import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talent | Backbenchers',
  description:
    'Discover top-tier candidates with our private, searchable talent showcase. Browse profiles, filter by skills, and connect with professionals looking for their next opportunity.',
};

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <HtmlShell>
      <AppTopNavigation />

      <div className='flex flex-row pt-16'>
        <div className='mx-auto w-full max-w-[1600px] px-6 duration-300 md:px-8 lg:px-14 2xl:mt-16'>
          {children}

          <MarketingFooter />
        </div>
      </div>
    </HtmlShell>
  );
};

export default MarketingLayout;

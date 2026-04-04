import { SideNav } from '@/app/(dashboard)/components/navigation/SideNav';
import { HtmlShell } from '@/app/components/HtmlShell';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProvider } from '@clerk/nextjs';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { MobileTopNav } from './components/navigation/MobileTopNav';

import '@/app/globals.css';

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => (
  <HtmlShell>
    <ClerkProvider>
      <div className='min-h-full'>
        <MobileTopNav />

        <MobileBottomNav />

        {/* layout with sidenav (sidenav hides in mobile size) */}
        <div className='relative flex h-full'>
          <SideNav />

          <div className='h-full w-full flex-1'>
            <main className='no-scrollbar h-full w-full overflow-auto py-0 pt-16 sm:pt-0'>
              {children}
            </main>
          </div>
        </div>
      </div>

      <Toaster />
    </ClerkProvider>
  </HtmlShell>
);

export default ApplicationLayout;

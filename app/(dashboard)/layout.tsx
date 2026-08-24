import { SideNav } from '@/app/(dashboard)/components/navigation/SideNav';
import { Toaster } from '@/components/ui/sonner';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { MobileTopNav } from './components/navigation/MobileTopNav';

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <div className='h-full'>
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
  </>
);

export default ApplicationLayout;

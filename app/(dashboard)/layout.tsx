import { SideNav } from '@/app/(dashboard)/components/SideNav';
import { HtmlShell } from '@/app/components/HtmlShell';
import '@/app/globals.css';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileTopNav } from './components/MobileTopNav';
import styles from './dashboard.module.css';

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => (
  <HtmlShell>
    <div className='min-h-full'>
      <MobileTopNav />

      <MobileBottomNav />

      {/* layout with sidenav (sidenav hides in mobile size) */}
      <div className='relative flex h-full'>
        <SideNav />

        <div className='h-full w-full flex-1'>
          <main className='no-scrollbar h-full w-full overflow-auto py-0 pt-16 sm:pt-0'>
            <div className={styles['dashboard-page-container']}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  </HtmlShell>
);

export default ApplicationLayout;

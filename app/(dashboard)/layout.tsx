import styles from './dashboard.module.css';

const ApplicationLayout = ({ children }: { children: React.ReactNode }) => (
  <div className='min-h-full'>
    {/* responsive top bar to show in mobile size */}
    {/* responsive bottom navbar to show in mobile size */}

    {/* layout with sidenav (sidenav should hide in mobile size)  */}
    <div className='relative flex h-full'>
      {/* add sidenav here */}

      <div className='h-full w-full flex-1'>
        {/* main content */}
        <main className='h-full w-full overflow-auto no-scrollbar py-0 pt-16 sm:pt-0'>
          <div className={styles['dashboard-page-container']}>{children}</div>
        </main>
      </div>
    </div>
  </div>
);

export default ApplicationLayout;

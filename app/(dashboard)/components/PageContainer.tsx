import { cn } from '@/lib/utils/cn';
import { PropsWithChildren } from 'react';

import styles from '@/app/(dashboard)/dashboard.module.css';

export const PageContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <main className={cn(styles['dashboard-page-container'], className)}>{children}</main>
);

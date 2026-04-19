import { ClerkProvider } from '@clerk/nextjs';
import { HtmlShell } from './components/HtmlShell';

import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <HtmlShell>
      <ClerkProvider taskUrls={{ 'choose-organization': '/onboarding' }}>
        {children}
      </ClerkProvider>
    </HtmlShell>
  );
}

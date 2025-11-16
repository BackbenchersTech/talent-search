import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talent | Backbenchers',
  description:
    'Discover top-tier candidates with our private, searchable talent showcase. Browse profiles, filter by skills, and connect with professionals looking for their next opportunity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className='antialiased h-full'>{children}</body>
    </html>
  );
}

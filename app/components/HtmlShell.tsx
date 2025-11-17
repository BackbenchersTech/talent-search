export const HtmlShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' className='h-full'>
      <body className='h-full antialiased'>{children}</body>
    </html>
  );
};

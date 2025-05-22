import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Using --font-geist-sans as variable name for consistency with original
});

export const metadata: Metadata = {
  title: 'NutriJournal - Your Personal Food Diary',
  description: 'Track your daily meals and nutrients with NutriJournal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

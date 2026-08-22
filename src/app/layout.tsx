import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CivicProvider } from '@/lib/context/CivicContext';
import { CivicShell } from '@/components/layout/CivicShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bhopal Civic Memory | Municipal Operations & Incident Intelligence',
  description:
    'Civic operations, Bhojtal lake ecology tracking, heritage corridor protection, and citizen incident management platform for Bhopal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#070A11] text-slate-100 antialiased font-sans`}
      >
        <CivicProvider>
          <CivicShell>{children}</CivicShell>
        </CivicProvider>
      </body>
    </html>
  );
}

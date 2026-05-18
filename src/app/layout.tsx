import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';

export const metadata: Metadata = {
  title: 'Squizzy — Belajar Sambil Bermain',
  description:
    'Squizzy adalah aplikasi edukasi anak yang interaktif seperti boneka squishy: jawab kuis, kumpulkan koin, dan mainkan claw machine untuk mengoleksi karakter lucu!',
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <AppProviders>
          <div className="mx-auto flex min-h-screen max-w-md flex-col">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}

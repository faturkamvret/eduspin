import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduSpin — Belajar Sambil Bermain',
  description:
    'Aplikasi edukasi anak: jawab kuis, kumpulkan koin, dan mainkan claw machine untuk mengoleksi karakter lucu!',
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
        <div className="mx-auto flex min-h-screen max-w-md flex-col">{children}</div>
      </body>
    </html>
  );
}

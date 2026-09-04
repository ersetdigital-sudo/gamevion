import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import 'swiper/css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GAMEVION — Top Up Game Instan & Aman',
  description: 'Top up diamond & UC langsung ke akun game. Tanpa registrasi, proses otomatis 24 jam.',
  openGraph: {
    title: 'GAMEVION — Top Up Game Instan & Aman',
    description: 'Top up diamond & UC langsung ke akun game. Tanpa registrasi, proses otomatis 24 jam.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GAMEVION - Top Up Game',
      },
    ],
    type: 'website',
    url: 'https://gamevion.net',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GAMEVION — Top Up Game Instan & Aman',
    description: 'Top up diamond & UC langsung ke akun game. Tanpa registrasi, proses otomatis 24 jam.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico?t=20260903" type="image/x-icon" />
        <link rel="icon" href="/favicon.png?t=20260903" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?t=20260903" />
      </head>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

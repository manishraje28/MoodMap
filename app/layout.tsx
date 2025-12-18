import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: 'PlaceSense - Discover Places That Match Your Mood',
  description:
    'Find the perfect nearby spot based on how you feel. Whether you need a quiet cafe to work, a romantic restaurant for a date, or a quick bite on the go.',
  keywords: [
    'nearby places',
    'mood-based recommendations',
    'cafes',
    'restaurants',
    'location finder',
    'OpenStreetMap',
  ],
  authors: [{ name: 'PlaceSense Team' }],
  openGraph: {
    title: 'PlaceSense - Discover Places That Match Your Mood',
    description:
      'Find the perfect nearby spot based on how you feel. Built with Next.js and OpenStreetMap.',
    type: 'website',
    locale: 'en_US',
    siteName: 'PlaceSense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlaceSense - Discover Places That Match Your Mood',
    description:
      'Find the perfect nearby spot based on how you feel. Built with Next.js and OpenStreetMap.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const sourceSerif = Source_Serif_4({ 
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: 'MoodMap — Find places that fit how you feel',
  description: 'Discover nearby spots based on your mood. Simple, private, and free.',
  keywords: ['nearby places', 'mood', 'cafes', 'restaurants', 'local', 'OpenStreetMap'],
  authors: [{ name: 'MoodMap' }],
  openGraph: {
    title: 'MoodMap — Find places that fit how you feel',
    description: 'Discover nearby spots based on your mood. Simple, private, and free.',
    type: 'website',
    locale: 'en_US',
    siteName: 'MoodMap',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoodMap — Find places that fit how you feel',
    description: 'Discover nearby spots based on your mood. Simple, private, and free.',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

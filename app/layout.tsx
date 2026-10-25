import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import MobileTopbar from '@/components/MobileTopbar';
import Ruler from '@/components/Ruler';
import Sidebar from '@/components/Sidebar';
import BackToTop from '@/components/fx/BackToTop';
import BatCursor from '@/components/fx/BatCursor';
import BatSwarm from '@/components/fx/BatSwarm';
import CommandPalette from '@/components/fx/CommandPalette';
import { FxProvider } from '@/components/fx/FxProvider';
import LightsOut from '@/components/fx/LightsOut';
import Toast from '@/components/fx/Toast';
import VoiceHello from '@/components/fx/VoiceHello';
import { profile, seo } from '@/content/profile';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
});
const sans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});
const mono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  authors: [{ name: profile.name, url: profile.github.url }],
  alternates: { canonical: '/' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: profile.name,
    title: seo.ogTitle,
    description: seo.ogDescription,
    locale: 'en_CA',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: seo.ogTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.ogTitle,
    description: seo.ogDescription,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#131412',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-scroll-behavior: keep in-page anchors smooth, but let route changes jump to the top instantly.
    <html lang="en" data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <FxProvider>
          <a className="skip" href="#content">
            Skip to content
          </a>
          <MobileTopbar />
          <Sidebar />
          <main id="content">
            <Ruler />
            {children}
          </main>
          <CommandPalette />
          <Toast />
          <BackToTop />
          <LightsOut />
          <BatCursor />
          <VoiceHello />
          <BatSwarm />
        </FxProvider>
      </body>
    </html>
  );
}

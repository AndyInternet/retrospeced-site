import type { Metadata } from 'next';
import { JetBrains_Mono, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '600', '700'],
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'retro(speced) — spec-driven AI development TUI for macOS',
  description:
    'Open-source terminal UI for spec-driven AI development on macOS. Plan, build, review, ship — all in one loop.',
  metadataBase: new URL('https://retrospeced.dev'),
  openGraph: {
    type: 'website',
    title: 'retro(speced) — spec-driven AI development TUI for macOS',
    description:
      'Open-source terminal UI for spec-driven AI development on macOS. Plan, build, review, ship — all in one loop.',
    images: ['/og.png'],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-accent="orange"
      data-scanlines="on"
      className={`${jetbrainsMono.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div data-placeholder="nav" />
        <main id="main">{children}</main>
        <div data-placeholder="footer" />
        <div data-placeholder="tweaks" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

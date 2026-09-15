import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
  weight: ["400", "500"],
});

/* Social-card metadata must never be able to fail a production build, so a
 * malformed origin degrades to "no metadataBase" instead of throwing during
 * page-data collection. */
function metadataBase(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(profile.meta.url),
  title: {
    default: profile.meta.title,
    template: `%s — ${profile.name}`,
  },
  description: profile.meta.description,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  keywords: [
    "Sujith C",
    "cybersecurity",
    "systems",
    "networking",
    "self-hosting",
    "Debian",
    "CSE student",
  ],
  openGraph: {
    type: "profile",
    title: profile.meta.title,
    description: profile.meta.description,
    siteName: profile.name,
    url: profile.meta.url,
  },
  twitter: {
    card: "summary_large_image",
    title: profile.meta.title,
    description: profile.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  colorScheme: "dark",
};

/* Runs before first paint, so the page never flashes behind the sequence.
 * Deliberately consults no storage: every real page load replays the
 * opening. Only prefers-reduced-motion skips it. */
const INTRO_GATE = `
try {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.setAttribute('data-intro', reduced ? 'done' : 'pending');
  if (!reduced && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
} catch (e) {
  document.documentElement.setAttribute('data-intro', 'done');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <noscript>
          {/* Without JS the sequence can never hand off, so show the site. */}
          <style>{`.intro-root{display:none!important}#site{opacity:1!important;pointer-events:auto!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

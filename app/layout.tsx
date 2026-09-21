import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/content/personal";
import { LivingSystem } from "@/components/canvas/living-system";
import { SkipLink } from "@/components/layout/skip-link";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

/* Fonts are self-hosted through next/font: no runtime request to Google.
 * All three are SIL Open Font License. Archivo carries a width axis that
 * the display style sets to 108 for the engineered, wide-set headline. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

function metadataBase(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(profile.meta.url),
  title: { default: profile.meta.title, template: `%s — ${profile.name}` },
  description: profile.meta.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.links.github }],
  creator: profile.name,
  keywords: [
    "Sujith C",
    "networking",
    "cybersecurity",
    "Linux",
    "home lab",
    "self-hosting",
    "Debian",
    "Tailscale",
    "CSE student",
    "BMSIT",
  ],
  openGraph: {
    type: "profile",
    title: profile.meta.title,
    description: profile.meta.description,
    siteName: profile.name,
    url: profile.meta.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.meta.title,
    description: profile.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090b0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* Runs before first paint, so nothing flashes before the sequence owns
 * the screen. The opening plays on the home route only; every other
 * route starts in the finished state. No storage of any kind is read,
 * so a real reload always replays it. prefers-reduced-motion skips it
 * entirely, and the sequence itself advances the state from here. */
const INTRO_GATE = `
try {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var home = location.pathname === '/' || location.pathname === '';
  document.documentElement.setAttribute('data-intro', reduced || !home ? 'done' : 'pending');
  if (!reduced && home && 'scrollRestoration' in history) history.scrollRestoration = 'manual';
} catch (e) {
  document.documentElement.setAttribute('data-intro', 'done');
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <noscript>
          {/* Without JS the sequence can never hand off, so show the site. */}
          <style>{`.intro-root{display:none!important}#site{opacity:1!important;pointer-events:auto!important}[data-enter]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        {/* One canvas for the whole site, mounted above the router so
            moving between the home page and /work never resets it. */}
        <LivingSystem>
          <SkipLink />
          {children}
          <Footer />
        </LivingSystem>
      </body>
    </html>
  );
}

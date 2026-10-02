import type { Metadata, Viewport } from "next";
import { Doto, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Background } from "@/components/background";
import { Boot } from "@/components/boot";
import { Runtime } from "@/components/runtime";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

/* JetBrains Mono for everything; Doto only for the hero name and the
 * large index numbers on project cards. Self-hosted through next/font. */
/* Arrows, ✕ and the block cursor are in no Google subset; like the
 * reference they fall back to the system monospace, not to Arial. */
const jb = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jb",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  adjustFontFallback: false,
});
const doto = Doto({ subsets: ["latin"], weight: ["900"], variable: "--font-doto", display: "swap", fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"], adjustFontFallback: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: "https://github.com/sgtsujith141-wq" }],
  creator: site.name,
  openGraph: { type: "profile", title: site.title, description: site.description, siteName: site.name, url: site.url, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* Runs before first paint. Marks JS as present (so reveal states may start
 * hidden) and, unless reduced motion is on, raises the intro cover before
 * anything else can flash. If the intro never starts (a script error), the
 * cover drops itself after four seconds. */
const GATE = `(function(){var h=document.documentElement;h.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.classList.add('booting');setTimeout(function(){if(!window.__bootStarted)h.classList.remove('booting')},4000)}if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){h.classList.remove('booting')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jb.variable} ${doto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: GATE }} />
      </head>
      <body>
        <a className="skip" href="#app">
          Skip to content
        </a>
        <Background />
        <Runtime />
        <Boot />
        <Header />
        <main id="app">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

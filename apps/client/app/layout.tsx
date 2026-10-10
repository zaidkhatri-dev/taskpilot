import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Inter — primary typeface for all display, body, and UI text.
 * next/font self-hosts the font files, eliminating external requests to Google.
 * The `variable` option injects the font as var(--font-sans) on <html>,
 * which is consumed by tokens.css and all downstream styles.
 */
const inter = Inter({
  subsets: ["latin"],
  // Inter is a variable font — no weight array needed; all weights included.
  variable: "--font-sans",
  display: "swap",
});

/**
 * JetBrains Mono — monospace typeface for code in product screenshots.
 * Injected as var(--font-mono) on <html>.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * title.template lets nested page.tsx exports set just their own title
   * e.g. export const metadata = { title: "Dashboard" }
   * → renders as "Dashboard | TaskPilot" in the browser tab.
   * title.default is the fallback used when a route has no metadata export.
   */
  title: {
    template: "%s | TaskPilot",
    default: "TaskPilot — Task management for modern teams",
  },
  description:
    "TaskPilot helps modern teams manage tasks, projects, and priorities in one place.",

  /**
   * OpenGraph — controls the link preview card on Slack, LinkedIn, iMessage, etc.
   * Next.js auto-detects app/opengraph-image.* as the image when present.
   */
  openGraph: {
    title: "TaskPilot",
    description:
      "TaskPilot helps modern teams manage tasks, projects, and priorities in one place.",
    siteName: "TaskPilot",
    locale: "en_US",
    type: "website",
  },

  /**
   * Twitter / X card — separate from OG; controls how the link appears on X.
   * "summary_large_image" shows a wide card with the OG image.
   */
  twitter: {
    card: "summary_large_image",
    title: "TaskPilot",
    description:
      "TaskPilot helps modern teams manage tasks, projects, and priorities in one place.",
  },

  /**
   * Robots — controls search engine crawling and indexing.
   * "index, follow" is the default but making it explicit avoids
   * accidental de-indexing from inherited parent layouts.
   */
  robots: {
    index: true,
    follow: true,
  },

  /**
   * Icons — Next.js auto-detects app/favicon.ico and app/icon.* but
   * declaring them here gives full control over shortcut and Apple icons.
   */
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Viewport is exported separately from Metadata in the Next.js App Router.
 * Merging them into the metadata object is a common mistake that silently fails.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Both font variables are applied here so every component in the tree
      // can access var(--font-sans) and var(--font-mono) via CSS.
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
    images: [
      {
        url: "/logo.webp",
        alt: "TaskPilot Logo",
      },
    ],
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
    images: ["/logo.webp"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${geist.variable} dark`}>
      <body className={`min-h-full`}>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/core/i18n/LanguageContext";
import { PlatformHeader } from "@/core/ui/PlatformHeader";
import { PlatformFooter } from "@/core/ui/PlatformFooter";

export const metadata: Metadata = {
  title: "Guitar Companion | Interactive Web Tools for Guitarists",
  description:
    "A modern, modular suite of practice tools for guitarists. Practice rhythm, strumming patterns, timing, and fretboard skills with real-time feedback.",
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" content="true" />
      </head>
      <body
        className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <PlatformHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <PlatformFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}

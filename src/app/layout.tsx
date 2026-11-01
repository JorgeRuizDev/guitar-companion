import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guitar Companion | Interactive Web Tools for Guitarists",
  description: "A modern, modular suite of practice tools for guitarists. Practice rhythm, strumming patterns, timing, and fretboard skills with real-time feedback.",
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
        <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white hover:text-amber-400 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                🎸
              </span>
              <span>Guitar Companion</span>
            </a>
            <nav className="flex items-center gap-1 sm:gap-4">
              <a
                href="/strumming"
                className="text-sm font-medium px-3 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-all min-h-[44px] flex items-center"
              >
                Strumming Trainer
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4">
            <p>Guitar Companion Platform &bull; Real-time interactive tools for guitarists.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

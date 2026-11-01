import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strumming Pattern Trainer | Guitar Companion",
  description:
    "Interactive visual timeline and audio metronome for learning and practicing guitar strumming patterns with directional down/up arrows, beginner presets, and customizable BPM.",
  keywords: [
    "guitar strumming trainer",
    "strumming patterns",
    "guitar metronome",
    "island strum",
    "rhythm practice guitar",
    "guitar companion",
  ],
  openGraph: {
    title: "Strumming Pattern Trainer | Guitar Companion",
    description:
      "Interactive visual timeline and audio metronome for guitar strumming patterns with beginner presets and tempo control.",
    type: "website",
    url: "https://guitarcompanion.app/strumming",
  },
  alternates: {
    canonical: "https://guitarcompanion.app/strumming",
  },
};

export default function StrummingAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Strumming Pattern Trainer",
    applicationCategory: "MusicApplication",
    operatingSystem: "All",
    browserRequirements: "Requires modern Web Audio API compatible browser",
    description:
      "Real-time visual strumming pattern trainer with synchronized metronome and customizable subdivisions for guitar practice.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 flex flex-col">{children}</div>
    </>
  );
}

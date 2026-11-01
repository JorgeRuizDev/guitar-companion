import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basic Chord Trainer | Guitar Companion',
  description:
    'Learn beginner open guitar chords (C, G, D, Am, Em, E7, Cadd9) with dual Anglo-Saxon and European Solfège notation, interactive fretboard drawing, and recognition drills.',
  keywords: [
    'guitar chord trainer',
    'open chords guitar',
    'learn guitar chords',
    'draw guitar chords',
    'solfege guitar chords',
    'guitar companion',
    'beginner guitar chords',
    'c major guitar',
    'g major guitar',
  ],
  openGraph: {
    title: 'Basic Chord Trainer | Guitar Companion',
    description:
      'Master 22 beginner open chords with interactive fretboard drawing, multiple choice recognition, and dual notation.',
    type: 'website',
    url: 'https://guitarcompanion.app/basic-chord-trainer',
  },
  alternates: {
    canonical: 'https://guitarcompanion.app/basic-chord-trainer',
  },
};

export default function BasicChordTrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Basic Chord Trainer',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description:
      'Interactive guitar chord learning tool bridging Anglo-Saxon letter notation and European Solfège through fretboard drawing and visual identification.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
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

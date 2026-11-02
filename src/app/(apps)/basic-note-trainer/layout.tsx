import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basic Note Trainer | Guitar Companion',
  description:
    'Master Anglo-Saxon note letters (A-G) and Solfège (Do-Si) translations, chromatic accidentals (#/b), and natural semitones with interactive flashcards and memory tricks.',
  keywords: [
    'guitar note trainer',
    'learn note names',
    'solfege to letters',
    'anglo-saxon music notes',
    'guitar companion',
    'natural semitones',
    'music theory flashcards',
  ],
  openGraph: {
    title: 'Basic Note Trainer | Guitar Companion',
    description:
      'Learn musical note names, Solfège translations, and chromatic accidentals with interactive flashcards.',
    type: 'website',
    url: 'https://guitarcompanion.app/basic-note-trainer',
  },
  alternates: {
    canonical: 'https://guitarcompanion.app/basic-note-trainer',
  },
};

export default function BasicNoteTrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Basic Note Trainer',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description:
      'Interactive note translation and music theory trainer for guitarists and musicians learning Anglo-Saxon and Solfège systems.',
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

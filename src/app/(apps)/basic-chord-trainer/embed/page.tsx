import { parseChordTrainerParams } from '@/apps/basic-chord-trainer/domain/queryParams';
import { ChordTrainerApp } from '@/apps/basic-chord-trainer/components/ChordTrainerApp';

interface EmbedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Basic Chord Trainer Embed',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BasicChordTrainerEmbedPage({ searchParams }: EmbedPageProps) {
  const resolvedSearchParams = await searchParams;
  const config = parseChordTrainerParams(resolvedSearchParams);

  const embedConfig = {
    ...config,
    embed: true,
    compact: true,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-2 sm:p-3 overflow-hidden select-none">
      <ChordTrainerApp config={embedConfig} className="w-full my-auto" />
    </div>
  );
}

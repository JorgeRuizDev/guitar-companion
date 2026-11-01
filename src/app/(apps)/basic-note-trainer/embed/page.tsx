import { parseTrainerParams } from '@/apps/basic-note-trainer/domain/queryParams';
import { NoteTrainerApp } from '@/apps/basic-note-trainer/components/NoteTrainerApp';

interface EmbedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: 'Basic Note Trainer Embed',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BasicNoteTrainerEmbedPage({ searchParams }: EmbedPageProps) {
  const resolvedSearchParams = await searchParams;
  const config = parseTrainerParams(resolvedSearchParams);

  // Enforce embed & compact mode for dedicated route
  const embedConfig = {
    ...config,
    embed: true,
    compact: true,
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-2 sm:p-3 overflow-hidden select-none">
      <NoteTrainerApp config={embedConfig} className="w-full my-auto" />
    </div>
  );
}

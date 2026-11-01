import { parseTrainerParams } from '@/apps/basic-note-trainer/domain/queryParams';
import { BasicNoteTrainerContainer } from '@/apps/basic-note-trainer/components/BasicNoteTrainerContainer';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BasicNoteTrainerPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const config = parseTrainerParams(resolvedSearchParams);

  return <BasicNoteTrainerContainer config={config} />;
}

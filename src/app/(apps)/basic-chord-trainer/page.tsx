import { parseChordTrainerParams } from '@/apps/basic-chord-trainer/domain/queryParams';
import { BasicChordTrainerContainer } from '@/apps/basic-chord-trainer/components/BasicChordTrainerContainer';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BasicChordTrainerPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const config = parseChordTrainerParams(resolvedSearchParams);

  return <BasicChordTrainerContainer initialConfig={config} />;
}

import {getTranslations, setRequestLocale} from 'next-intl/server';
import AssignmentCenter from '@/components/AssignmentCenter';

export default async function AssignmentsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('assignments');

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <AssignmentCenter />
    </div>
  );
}

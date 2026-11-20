import {getTranslations, setRequestLocale} from 'next-intl/server';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-sm text-navy/60">{t('subtitle')}</p>
      <div className="mt-8">
        <AdminDashboard />
      </div>
    </div>
  );
}

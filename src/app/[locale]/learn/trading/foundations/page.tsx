import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Foundations from '@/components/trading/Foundations';

export default async function FoundationsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('foundations');
  const tt = await getTranslations('trading');

  return (
    <div>
      <Link href="/learn/trading" className="text-sm text-accent hover:underline">
        ← {tt('title')}
      </Link>
      <h1 className="mt-3 text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8">
        <Foundations />
      </div>
    </div>
  );
}

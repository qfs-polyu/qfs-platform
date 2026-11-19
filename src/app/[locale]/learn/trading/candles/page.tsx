import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import CandleReader from '@/components/trading/CandleReader';

export default async function CandlesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('candles');
  const tt = await getTranslations('trading');

  return (
    <div>
      <Link href="/learn/trading" className="text-sm text-accent hover:underline">
        ← {tt('title')}
      </Link>
      <h1 className="mt-3 text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8">
        <CandleReader />
      </div>
    </div>
  );
}

import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {TRADING_STAGES} from '@/content/curriculum';

export default async function TradingPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('trading');
  const tl = await getTranslations('learn');

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 space-y-4">
        {TRADING_STAGES.map((stage) => (
          <div
            key={stage.n}
            className="flex gap-5 rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-navy text-white">
              <span className="text-[10px] leading-none opacity-70">
                {tl('stageLabel')}
              </span>
              <span className="text-lg font-bold leading-none">{stage.n}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-navy">{stage.title}</h2>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {t('level')} {stage.level}
                </span>
                {stage.n === 5 && (
                  <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs text-navy/60">
                    Extension
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-navy/65">{stage.blurb}</p>
              {stage.n === 1 && (
                <Link
                  href="/learn/trading/candles"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  {t('openCandles')} →
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {t('live')}
                  </span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
